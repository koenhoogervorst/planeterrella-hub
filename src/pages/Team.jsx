import { useEffect, useMemo, useState } from 'react';
import { PaginaKop } from '../components/layout/Pagina.jsx';
import { Kaart, Knop, Avatar, BalkMetGetal, Badge, Melding, Leeg } from '../components/ui/Basis.jsx';
import { Dialoog, Bevestig } from '../components/ui/Dialoog.jsx';
import { Invoer, Tekstvak, Veld } from '../components/ui/Formulier.jsx';
import { TaakRegel } from '../components/taken/TaakLijst.jsx';
import { useProject } from '../store/ProjectContext.jsx';
import { useToast } from '../store/ToastContext.jsx';
import { projectStatistiek } from '../lib/statistiek.js';
import { TEAM_KLEUREN } from '../data/constanten.js';

function LidFormulier({ open, lid, onSluit, onOpslaan }) {
  const [naam, setNaam] = useState('');
  const [rol, setRol] = useState('');
  const [kleur, setKleur] = useState(TEAM_KLEUREN[0]);
  const [notities, setNotities] = useState('');
  const [fout, setFout] = useState('');

  /* Formulier vullen zodra het venster opengaat. */
  useEffect(() => {
    if (!open) return;
    setNaam(lid?.naam || '');
    setRol(lid?.rol || '');
    setKleur(lid?.kleur || TEAM_KLEUREN[0]);
    setNotities(lid?.notities || '');
    setFout('');
  }, [open, lid]);

  function opslaan() {
    if (!naam.trim()) {
      setFout('Vul een naam in.');
      return;
    }
    onOpslaan({ naam: naam.trim(), rol: rol.trim(), kleur, notities });
  }

  return (
    <Dialoog
      open={open}
      titel={lid ? 'Teamlid aanpassen' : 'Teamlid toevoegen'}
      onSluit={onSluit}
      voet={
        <>
          <Knop onClick={onSluit}>Annuleren</Knop>
          <Knop soort="primair" icoon="vink" onClick={opslaan}>
            Opslaan
          </Knop>
        </>
      }
    >
      <Invoer
        label="Naam *"
        value={naam}
        onChange={(e) => setNaam(e.target.value)}
        fout={fout}
        placeholder="Bijvoorbeeld: Koen"
        breed
      />
      <Invoer
        label="Rol"
        value={rol}
        onChange={(e) => setRol(e.target.value)}
        placeholder="Bijvoorbeeld: Elektronica en hoogspanning"
        breed
      />
      <Veld label="Kleur" hint="Wordt gebruikt in de avatar en de voortgangsbalken.">
        <div className="chip-rij">
          {TEAM_KLEUREN.map((k) => (
            <button
              key={k}
              type="button"
              onClick={() => setKleur(k)}
              aria-label={`Kleur ${k}`}
              aria-pressed={kleur === k ? 'true' : 'false'}
              style={{
                width: 28,
                height: 28,
                borderRadius: '50%',
                background: k,
                border: kleur === k ? '3px solid var(--tekst)' : '1px solid var(--lijn-sterk)',
                cursor: 'pointer',
              }}
            />
          ))}
        </div>
      </Veld>
      <Tekstvak label="Notities" value={notities} onChange={(e) => setNotities(e.target.value)} breed rijen={3} />
    </Dialoog>
  );
}

export function Team({ opTaak }) {
  const { staat, acties } = useProject();
  const toast = useToast();
  const stat = useMemo(() => projectStatistiek(staat), [staat]);
  const [bewerken, setBewerken] = useState(null);
  const [nieuwOpen, setNieuwOpen] = useState(false);
  const [teVerwijderen, setTeVerwijderen] = useState(null);

  function opslaan(waarden) {
    if (bewerken) {
      acties.bijwerken('teamleden', bewerken.id, waarden, `Teamlid aangepast: ${waarden.naam}`);
      toast.goed('Teamlid bijgewerkt');
      setBewerken(null);
    } else {
      acties.toevoegen('teamleden', waarden, `Teamlid toegevoegd: ${waarden.naam}`);
      toast.goed('Teamlid toegevoegd');
      setNieuwOpen(false);
    }
  }

  return (
    <>
      <PaginaKop
        titel="Team"
        uitleg="Wie doet wat. Klik op een naam om die aan te passen — de namen zijn met opzet neutraal ingevuld."
        acties={
          <Knop soort="primair" icoon="plus" onClick={() => setNieuwOpen(true)}>
            Teamlid toevoegen
          </Knop>
        }
      />

      <Melding soort="waarschuwing">
        In het plan van aanpak staan <strong>drie</strong> projectleden met een duidelijke rolverdeling. Deze hub is
        ingericht voor vier plekken. Vervang “Teamlid 1” tot en met “Teamlid 4” door jullie echte namen. Taken die nu
        aan Teamlid 4 hangen zijn <strong>voorstellen</strong> — verdeel ze opnieuw als er geen vierde persoon is.
      </Melding>

      {stat.nietToegewezen.length > 0 ? (
        <Melding soort="info">
          {stat.nietToegewezen.length} {stat.nietToegewezen.length === 1 ? 'taak heeft' : 'taken hebben'} nog geen
          verantwoordelijke.
        </Melding>
      ) : null}

      <div className="raster raster-2">
        {stat.perTeamlid.map(({ lid, klaar, open, totaal, percentage, perStatus }) => {
          const eigenTaken = staat.taken.filter((t) => t.toegewezenAan === lid.id);
          const openTaken = eigenTaken.filter((t) => t.status !== 'klaar').slice(0, 5);
          const eisen = staat.eisen.filter((e) => e.eigenaar === lid.id);

          return (
            <Kaart key={lid.id}>
              <div className="kolom">
                <div className="rij" style={{ gap: 12 }}>
                  <Avatar lid={lid} formaat="groot" />
                  <div className="vul kolom" style={{ gap: 1, minWidth: 0 }}>
                    <span className="vet" style={{ fontSize: 'var(--tekst-lg)' }}>
                      {lid.naam}
                    </span>
                    <span className="klein zacht">{lid.rol || 'Geen rol ingevuld'}</span>
                  </div>
                  <Knop soort="stil" alleenIcoon icoon="potlood" onClick={() => setBewerken(lid)} aria-label={`${lid.naam} aanpassen`} />
                  <Knop
                    soort="stil"
                    alleenIcoon
                    icoon="prullenbak"
                    onClick={() => setTeVerwijderen(lid)}
                    aria-label={`${lid.naam} verwijderen`}
                  />
                </div>

                <BalkMetGetal waarde={percentage} kleur={lid.kleur} label={`Voortgang ${lid.naam}`} />

                <div className="raster raster-4" style={{ gap: 'var(--r2)' }}>
                  <div className="kolom" style={{ gap: 0 }}>
                    <span className="vet" style={{ fontSize: 'var(--tekst-xl)' }}>
                      {totaal}
                    </span>
                    <span className="mini dof">Taken totaal</span>
                  </div>
                  <div className="kolom" style={{ gap: 0 }}>
                    <span className="vet" style={{ fontSize: 'var(--tekst-xl)', color: 'var(--status-klaar)' }}>
                      {klaar}
                    </span>
                    <span className="mini dof">Afgerond</span>
                  </div>
                  <div className="kolom" style={{ gap: 0 }}>
                    <span className="vet" style={{ fontSize: 'var(--tekst-xl)' }}>
                      {open}
                    </span>
                    <span className="mini dof">Openstaand</span>
                  </div>
                  <div className="kolom" style={{ gap: 0 }}>
                    <span className="vet" style={{ fontSize: 'var(--tekst-xl)', color: 'var(--status-bezig)' }}>
                      {perStatus.bezig}
                    </span>
                    <span className="mini dof">Bezig</span>
                  </div>
                </div>

                {eisen.length > 0 ? (
                  <div className="rij rij-wrap" style={{ gap: 5 }}>
                    <span className="mini dof">Eigenaar van eisen:</span>
                    {eisen.map((e) => (
                      <Badge key={e.id} kleur="omlijnd">
                        {e.code || e.omschrijving.slice(0, 12)}
                      </Badge>
                    ))}
                  </div>
                ) : null}

                {lid.notities ? (
                  <p className="klein zacht multiline" style={{ margin: 0 }}>
                    {lid.notities}
                  </p>
                ) : null}

                <div>
                  <span className="klein vet zacht">Openstaande taken</span>
                  {openTaken.length === 0 ? (
                    <p className="klein dof" style={{ marginTop: 4 }}>
                      Geen openstaande taken.
                    </p>
                  ) : (
                    <div style={{ marginTop: 4, border: '1px solid var(--lijn)', borderRadius: 'var(--rond)' }}>
                      {openTaken.map((taak) => (
                        <TaakRegel key={taak.id} taak={taak} onKlik={opTaak} />
                      ))}
                    </div>
                  )}
                  {open > 5 ? <span className="mini dof">+{open - 5} meer</span> : null}
                </div>
              </div>
            </Kaart>
          );
        })}

        {staat.teamleden.length === 0 ? (
          <Kaart>
            <Leeg titel="Geen teamleden" tekst="Voeg de leden van jullie projectgroep toe." />
          </Kaart>
        ) : null}
      </div>

      <LidFormulier open={nieuwOpen} lid={null} onSluit={() => setNieuwOpen(false)} onOpslaan={opslaan} />
      <LidFormulier open={bewerken !== null} lid={bewerken} onSluit={() => setBewerken(null)} onOpslaan={opslaan} />

      <Bevestig
        open={teVerwijderen !== null}
        titel="Teamlid verwijderen"
        tekst={
          teVerwijderen
            ? `"${teVerwijderen.naam}" verwijderen? Taken, eisen en risico's die aan deze persoon hangen blijven bestaan, maar komen op "niet toegewezen" te staan.`
            : ''
        }
        onBevestig={() => {
          acties.verwijderen('teamleden', teVerwijderen.id, `Teamlid verwijderd: ${teVerwijderen.naam}`);
          toast.goed('Teamlid verwijderd');
          setTeVerwijderen(null);
        }}
        onAnnuleer={() => setTeVerwijderen(null)}
      />
    </>
  );
}
