import { useEffect, useMemo, useState } from 'react';
import { PaginaKop } from '../components/layout/Pagina.jsx';
import {
  Kaart,
  Knop,
  Badge,
  Leeg,
  HerkomstLabel,
  OnderdeelStatusBadge,
  BalkMetGetal,
} from '../components/ui/Basis.jsx';
import { Dialoog, Bevestig } from '../components/ui/Dialoog.jsx';
import { Invoer, Keuze, Tekstvak, MeerKeuze, Zoekveld } from '../components/ui/Formulier.jsx';
import { Icoon } from '../components/ui/Icoon.jsx';
import { TaakRegel } from '../components/taken/TaakLijst.jsx';
import { useProject, useOpzoek } from '../store/ProjectContext.jsx';
import { useToast } from '../store/ToastContext.jsx';
import { ONDERDEEL_STATUSSEN, ONTWERP_STATUSSEN, zoekOp } from '../data/constanten.js';
import { takenSamenvatting } from '../lib/statistiek.js';
import { bevatTerm } from '../lib/zoeken.js';

const LEEG = {
  naam: '',
  omschrijving: '',
  categorie: '',
  status: 'idee',
  ontwerpstatus: 'geen',
  verantwoordelijke: '',
  eisIds: [],
  bronIds: [],
  bestanden: '',
  notities: '',
};

const ONTWERP_KLEUR = { geen: 'neutraal', schets: 'waarschuwing', cad: 'info', definitief: 'goed' };

function OnderdeelFormulier({ open, item, onSluit, onOpslaan }) {
  const { staat } = useProject();
  const [waarden, setWaarden] = useState(LEEG);
  const [fout, setFout] = useState('');

  useEffect(() => {
    if (!open) return;
    setWaarden(item ? { ...LEEG, ...item } : LEEG);
    setFout('');
  }, [open, item]);

  function zet(veld, waarde) {
    setWaarden((h) => ({ ...h, [veld]: waarde }));
    if (fout) setFout('');
  }

  function opslaan() {
    if (!waarden.naam.trim()) {
      setFout('Geef het onderdeel een naam.');
      return;
    }
    onOpslaan({ ...waarden, naam: waarden.naam.trim() });
  }

  return (
    <Dialoog
      open={open}
      titel={item ? 'Onderdeel aanpassen' : 'Nieuw projectonderdeel'}
      onSluit={onSluit}
      breed
      voet={
        <>
          <Knop onClick={onSluit}>Annuleren</Knop>
          <Knop soort="primair" icoon="vink" onClick={opslaan}>
            Opslaan
          </Knop>
        </>
      }
    >
      <Invoer label="Naam *" value={waarden.naam} onChange={(e) => zet('naam', e.target.value)} fout={fout} breed />
      <Tekstvak
        label="Omschrijving"
        value={waarden.omschrijving}
        onChange={(e) => zet('omschrijving', e.target.value)}
        breed
        rijen={3}
      />
      <div className="raster raster-2">
        <Keuze label="Status" value={waarden.status} onChange={(e) => zet('status', e.target.value)} opties={ONDERDEEL_STATUSSEN} />
        <Keuze
          label="Ontwerpstatus"
          value={waarden.ontwerpstatus}
          onChange={(e) => zet('ontwerpstatus', e.target.value)}
          opties={ONTWERP_STATUSSEN}
        />
        <Keuze
          label="Verantwoordelijke"
          value={waarden.verantwoordelijke}
          onChange={(e) => zet('verantwoordelijke', e.target.value)}
          opties={staat.teamleden}
          leegLabel="Niet toegewezen"
        />
        <Keuze
          label="Categorie"
          value={waarden.categorie}
          onChange={(e) => zet('categorie', e.target.value)}
          opties={staat.categorieen}
          leegLabel="Geen categorie"
          hint="Bepaalt welke taken automatisch bij dit onderdeel horen."
        />
      </div>
      <MeerKeuze
        label="Gekoppelde eisen"
        opties={staat.eisen.map((e) => ({ waarde: e.id, label: `${e.code ? `${e.code} — ` : ''}${e.omschrijving.slice(0, 60)}` }))}
        gekozen={waarden.eisIds}
        onWijzig={(nieuw) => zet('eisIds', nieuw)}
        leegTekst="Er staan nog geen eisen in de hub."
      />
      <MeerKeuze
        label="Gekoppelde bronnen"
        opties={staat.bronnen.map((b) => ({ waarde: b.id, label: b.titel }))}
        gekozen={waarden.bronIds}
        onWijzig={(nieuw) => zet('bronIds', nieuw)}
        leegTekst="Er staan nog geen bronnen in de hub."
      />
      <Tekstvak
        label="Bestanden"
        value={waarden.bestanden}
        onChange={(e) => zet('bestanden', e.target.value)}
        breed
        rijen={2}
        hint="Namen van tekeningen, CAD-bestanden of documenten die bij dit onderdeel horen."
      />
      <Tekstvak label="Notities" value={waarden.notities} onChange={(e) => zet('notities', e.target.value)} breed rijen={3} />
    </Dialoog>
  );
}

export function Onderdelen({ opTaak }) {
  const { staat, acties } = useProject();
  const opzoek = useOpzoek();
  const toast = useToast();
  const [zoek, setZoek] = useState('');
  const [status, setStatus] = useState('alle');
  const [nieuwOpen, setNieuwOpen] = useState(false);
  const [bewerken, setBewerken] = useState(null);
  const [teVerwijderen, setTeVerwijderen] = useState(null);
  const [uitgeklapt, setUitgeklapt] = useState(null);

  const gefilterd = useMemo(
    () =>
      staat.onderdelen.filter((o) => {
        if (status !== 'alle' && o.status !== status) return false;
        if (zoek.trim()) {
          const tekst = [o.naam, o.omschrijving, o.notities, o.bestanden].join(' ');
          if (!bevatTerm(tekst, zoek)) return false;
        }
        return true;
      }),
    [staat.onderdelen, zoek, status],
  );

  function opslaan(waarden) {
    if (bewerken) {
      acties.bijwerken('onderdelen', bewerken.id, waarden, `Onderdeel aangepast: ${waarden.naam}`);
      toast.goed('Onderdeel bijgewerkt');
      setBewerken(null);
    } else {
      acties.toevoegen('onderdelen', { ...waarden, herkomst: 'eigen' }, `Onderdeel toegevoegd: ${waarden.naam}`);
      toast.goed('Onderdeel toegevoegd');
      setNieuwOpen(false);
    }
  }

  return (
    <>
      <PaginaKop
        titel="Projectonderdelen"
        uitleg="De fysieke delen van de Planeterrella, met status, eisen, taken en bestanden."
        acties={
          <Knop soort="primair" icoon="plus" onClick={() => setNieuwOpen(true)}>
            Nieuw onderdeel
          </Knop>
        }
      />

      <Kaart>
        <div className="filterbalk">
          <Zoekveld
            label="Zoeken"
            value={zoek}
            onChange={(e) => setZoek(e.target.value)}
            placeholder="Naam, omschrijving of bestandsnaam…"
          />
          <Keuze
            label="Status"
            value={status}
            onChange={(e) => setStatus(e.target.value)}
            opties={[
              { waarde: 'alle', label: 'Alle statussen' },
              ...ONDERDEEL_STATUSSEN.map((s) => ({ waarde: s.id, label: s.naam })),
            ]}
          />
        </div>
      </Kaart>

      {gefilterd.length === 0 ? (
        <Kaart>
          <Leeg titel="Geen onderdelen gevonden" tekst="Pas de filters aan of voeg een onderdeel toe." />
        </Kaart>
      ) : null}

      {gefilterd.map((onderdeel) => {
        const open = uitgeklapt === onderdeel.id;
        /* Taken horen bij een onderdeel via de gedeelde categorie. */
        const taken = onderdeel.categorie ? staat.taken.filter((t) => t.categorie === onderdeel.categorie) : [];
        const samenvatting = takenSamenvatting(taken);
        const eisen = onderdeel.eisIds.map((id) => opzoek.eis(id)).filter(Boolean);
        const bronnen = onderdeel.bronIds.map((id) => opzoek.bron(id)).filter(Boolean);
        const lid = opzoek.lid(onderdeel.verantwoordelijke);

        return (
          <div key={onderdeel.id} className="uitklap">
            <button type="button" className="uitklap-kop" onClick={() => setUitgeklapt(open ? null : onderdeel.id)}>
              <Icoon naam="chevron" grootte={15} className="uitklap-pijl" data-open={open ? 'true' : 'false'} />
              <div className="vul kolom" style={{ gap: 4, minWidth: 0 }}>
                <span className="vet">{onderdeel.naam}</span>
                <div className="rij rij-wrap mini dof" style={{ gap: 8 }}>
                  <span>{lid ? lid.naam : 'Niet toegewezen'}</span>
                  {taken.length > 0 ? (
                    <span>
                      · {samenvatting.klaar}/{samenvatting.totaal} taken af
                    </span>
                  ) : null}
                  {eisen.length > 0 ? <span>· {eisen.length} eisen</span> : null}
                </div>
              </div>
              <div className="rij rij-wrap" style={{ gap: 5 }}>
                <OnderdeelStatusBadge status={onderdeel.status} />
                <Badge kleur={ONTWERP_KLEUR[onderdeel.ontwerpstatus] || 'neutraal'}>
                  {zoekOp(ONTWERP_STATUSSEN, onderdeel.ontwerpstatus)?.naam || onderdeel.ontwerpstatus}
                </Badge>
                <HerkomstLabel herkomst={onderdeel.herkomst} kort />
              </div>
            </button>

            {open ? (
              <div className="uitklap-lijf">
                {onderdeel.omschrijving ? (
                  <p className="multiline" style={{ marginBottom: 'var(--r4)' }}>
                    {onderdeel.omschrijving}
                  </p>
                ) : null}

                {taken.length > 0 ? (
                  <div style={{ marginBottom: 'var(--r4)' }}>
                    <BalkMetGetal waarde={samenvatting.percentage} label={`Voortgang ${onderdeel.naam}`} />
                  </div>
                ) : null}

                <div className="raster raster-2">
                  <div className="kolom">
                    <span className="klein vet zacht">Taken ({taken.length})</span>
                    {taken.length === 0 ? (
                      <p className="klein dof">
                        Geen taken. Taken horen bij een onderdeel via de categorie — kies een categorie bij het
                        onderdeel om ze te koppelen.
                      </p>
                    ) : (
                      <div style={{ border: '1px solid var(--lijn)', borderRadius: 'var(--rond)' }}>
                        {taken.slice(0, 6).map((taak) => (
                          <TaakRegel key={taak.id} taak={taak} onKlik={opTaak} />
                        ))}
                      </div>
                    )}
                    {taken.length > 6 ? <span className="mini dof">+{taken.length - 6} meer</span> : null}
                  </div>

                  <div className="kolom">
                    <div className="kolom" style={{ gap: 4 }}>
                      <span className="klein vet zacht">Eisen</span>
                      {eisen.length === 0 ? (
                        <span className="klein dof">Geen eisen gekoppeld.</span>
                      ) : (
                        <ul className="klein" style={{ margin: 0 }}>
                          {eisen.map((e) => (
                            <li key={e.id}>
                              <span className="mono vet">{e.code}</span> — {e.omschrijving.slice(0, 90)}
                              {e.omschrijving.length > 90 ? '…' : ''}
                            </li>
                          ))}
                        </ul>
                      )}
                    </div>

                    <div className="kolom" style={{ gap: 4 }}>
                      <span className="klein vet zacht">Bronnen</span>
                      {bronnen.length === 0 ? (
                        <span className="klein dof">Geen bronnen gekoppeld.</span>
                      ) : (
                        <ul className="klein" style={{ margin: 0 }}>
                          {bronnen.map((b) => (
                            <li key={b.id}>{b.titel}</li>
                          ))}
                        </ul>
                      )}
                    </div>

                    {onderdeel.bestanden ? (
                      <div className="kolom" style={{ gap: 4 }}>
                        <span className="klein vet zacht">Bestanden</span>
                        <span className="klein multiline mono" style={{ fontSize: 'var(--tekst-xs)' }}>
                          {onderdeel.bestanden}
                        </span>
                      </div>
                    ) : null}

                    {onderdeel.notities ? (
                      <div className="kolom" style={{ gap: 4 }}>
                        <span className="klein vet zacht">Notities</span>
                        <span className="klein multiline">{onderdeel.notities}</span>
                      </div>
                    ) : null}
                  </div>
                </div>

                <div className="rij" style={{ marginTop: 'var(--r4)' }}>
                  <span className="vul" />
                  <Knop klein icoon="potlood" onClick={() => setBewerken(onderdeel)}>
                    Aanpassen
                  </Knop>
                  <Knop klein soort="stil" icoon="prullenbak" onClick={() => setTeVerwijderen(onderdeel)}>
                    Verwijderen
                  </Knop>
                </div>
              </div>
            ) : null}
          </div>
        );
      })}

      <OnderdeelFormulier open={nieuwOpen} item={null} onSluit={() => setNieuwOpen(false)} onOpslaan={opslaan} />
      <OnderdeelFormulier open={bewerken !== null} item={bewerken} onSluit={() => setBewerken(null)} onOpslaan={opslaan} />

      <Bevestig
        open={teVerwijderen !== null}
        titel="Onderdeel verwijderen"
        tekst={teVerwijderen ? `"${teVerwijderen.naam}" verwijderen? De taken zelf blijven bestaan.` : ''}
        onBevestig={() => {
          acties.verwijderen('onderdelen', teVerwijderen.id, `Onderdeel verwijderd: ${teVerwijderen.naam}`);
          toast.goed('Onderdeel verwijderd');
          setTeVerwijderen(null);
        }}
        onAnnuleer={() => setTeVerwijderen(null)}
      />
    </>
  );
}
