import { useEffect, useMemo, useState } from 'react';
import { PaginaKop } from '../components/layout/Pagina.jsx';
import { Kaart, Knop, Leeg, HerkomstLabel, Avatar } from '../components/ui/Basis.jsx';
import { Dialoog, Bevestig } from '../components/ui/Dialoog.jsx';
import { Invoer, Tekstvak, MeerKeuze, Zoekveld } from '../components/ui/Formulier.jsx';
import { useProject, useOpzoek } from '../store/ProjectContext.jsx';
import { useToast } from '../store/ToastContext.jsx';
import { bevatTerm } from '../lib/zoeken.js';
import { toonDatumLang, vandaagIso, vergelijkDatums } from '../lib/datums.js';

const LEEG = {
  datum: '',
  beslissing: '',
  reden: '',
  betrokkenen: [],
  gevolgen: '',
  bronIds: [],
  notitie: '',
};

function BeslissingFormulier({ open, item, onSluit, onOpslaan }) {
  const { staat } = useProject();
  const [waarden, setWaarden] = useState(LEEG);
  const [fout, setFout] = useState('');

  useEffect(() => {
    if (!open) return;
    setWaarden(item ? { ...LEEG, ...item } : { ...LEEG, datum: vandaagIso() });
    setFout('');
  }, [open, item]);

  function zet(veld, waarde) {
    setWaarden((h) => ({ ...h, [veld]: waarde }));
    if (fout) setFout('');
  }

  function opslaan() {
    if (!waarden.beslissing.trim()) {
      setFout('Beschrijf wat er besloten is.');
      return;
    }
    onOpslaan({ ...waarden, beslissing: waarden.beslissing.trim() });
  }

  return (
    <Dialoog
      open={open}
      titel={item ? 'Beslissing aanpassen' : 'Nieuwe beslissing'}
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
      <Invoer label="Datum" type="date" value={waarden.datum} onChange={(e) => zet('datum', e.target.value)} />
      <Tekstvak
        label="Wat is er besloten? *"
        value={waarden.beslissing}
        onChange={(e) => zet('beslissing', e.target.value)}
        fout={fout}
        breed
        rijen={2}
      />
      <Tekstvak label="Waarom?" value={waarden.reden} onChange={(e) => zet('reden', e.target.value)} breed rijen={3} />
      <Tekstvak
        label="Wat zijn de gevolgen?"
        value={waarden.gevolgen}
        onChange={(e) => zet('gevolgen', e.target.value)}
        breed
        rijen={3}
      />
      <MeerKeuze
        label="Wie waren erbij betrokken?"
        opties={staat.teamleden.map((l) => ({ waarde: l.id, label: l.naam }))}
        gekozen={waarden.betrokkenen}
        onWijzig={(nieuw) => zet('betrokkenen', nieuw)}
      />
      <MeerKeuze
        label="Gebruikte bronnen"
        opties={staat.bronnen.map((b) => ({ waarde: b.id, label: b.titel }))}
        gekozen={waarden.bronIds}
        onWijzig={(nieuw) => zet('bronIds', nieuw)}
        leegTekst="Er staan nog geen bronnen in de hub."
      />
      <Tekstvak label="Notitie" value={waarden.notitie} onChange={(e) => zet('notitie', e.target.value)} breed rijen={2} />
    </Dialoog>
  );
}

export function Beslissingen() {
  const { staat, acties } = useProject();
  const opzoek = useOpzoek();
  const toast = useToast();
  const [zoek, setZoek] = useState('');
  const [nieuwOpen, setNieuwOpen] = useState(false);
  const [bewerken, setBewerken] = useState(null);
  const [teVerwijderen, setTeVerwijderen] = useState(null);

  const gesorteerd = useMemo(() => {
    const lijst = staat.beslissingen.filter((b) => {
      if (!zoek.trim()) return true;
      return bevatTerm([b.beslissing, b.reden, b.gevolgen, b.notitie].join(' '), zoek);
    });
    /* Nieuwste bovenaan. */
    return [...lijst].sort((a, b) => vergelijkDatums(b.datum, a.datum));
  }, [staat.beslissingen, zoek]);

  function opslaan(waarden) {
    if (bewerken) {
      acties.bijwerken('beslissingen', bewerken.id, waarden, 'Beslissing aangepast');
      toast.goed('Beslissing bijgewerkt');
      setBewerken(null);
    } else {
      acties.toevoegen('beslissingen', { ...waarden, herkomst: 'eigen' }, 'Beslissing vastgelegd');
      toast.goed('Beslissing vastgelegd');
      setNieuwOpen(false);
    }
  }

  return (
    <>
      <PaginaKop
        titel="Beslissingen"
        uitleg="Het besluitenlogboek: wat is er besloten, waarom, en wat waren de gevolgen."
        acties={
          <Knop soort="primair" icoon="plus" onClick={() => setNieuwOpen(true)}>
            Beslissing vastleggen
          </Knop>
        }
      />

      <Kaart>
        <div className="filterbalk">
          <Zoekveld
            label="Zoeken"
            value={zoek}
            onChange={(e) => setZoek(e.target.value)}
            placeholder="Beslissing, reden of gevolg…"
          />
        </div>
        <p className="mini dof" style={{ marginTop: 'var(--r3)' }}>
          In de projectbestanden staat geen echt besluitenlogboek. De beslissingen hieronder zijn afgeleid uit de
          documenten waarin de keuze voor het eerst zichtbaar is — controleer de datums en vul de echte overwegingen aan.
        </p>
      </Kaart>

      {gesorteerd.length === 0 ? (
        <Kaart>
          <Leeg
            titel="Geen beslissingen"
            tekst={staat.beslissingen.length === 0 ? 'Leg jullie eerste beslissing vast.' : 'Geen resultaten voor deze zoekterm.'}
          />
        </Kaart>
      ) : null}

      {gesorteerd.map((beslissing) => {
        const betrokkenen = beslissing.betrokkenen.map((id) => opzoek.lid(id)).filter(Boolean);
        const bronnen = beslissing.bronIds.map((id) => opzoek.bron(id)).filter(Boolean);
        return (
          <Kaart key={beslissing.id}>
            <div className="kolom">
              <div className="rij rij-wrap" style={{ gap: 8 }}>
                <span className="klein vet zacht" style={{ whiteSpace: 'nowrap' }}>
                  {beslissing.datum ? toonDatumLang(beslissing.datum) : 'Datum onbekend'}
                </span>
                <span className="vul" />
                <HerkomstLabel herkomst={beslissing.herkomst} kort />
                <Knop soort="stil" alleenIcoon klein icoon="potlood" onClick={() => setBewerken(beslissing)} aria-label="Aanpassen" />
                <Knop
                  soort="stil"
                  alleenIcoon
                  klein
                  icoon="prullenbak"
                  onClick={() => setTeVerwijderen(beslissing)}
                  aria-label="Verwijderen"
                />
              </div>

              <p className="vet multiline" style={{ fontSize: 'var(--tekst-lg)', margin: 0 }}>
                {beslissing.beslissing}
              </p>

              <div className="detail-lijst">
                {beslissing.reden ? (
                  <div className="detail-regel">
                    <span className="detail-term">Reden</span>
                    <span className="multiline">{beslissing.reden}</span>
                  </div>
                ) : null}
                {beslissing.gevolgen ? (
                  <div className="detail-regel">
                    <span className="detail-term">Gevolgen</span>
                    <span className="multiline">{beslissing.gevolgen}</span>
                  </div>
                ) : null}
                {betrokkenen.length > 0 ? (
                  <div className="detail-regel">
                    <span className="detail-term">Betrokkenen</span>
                    <div className="rij rij-wrap" style={{ gap: 6 }}>
                      {betrokkenen.map((lid) => (
                        <span key={lid.id} className="rij" style={{ gap: 5 }}>
                          <Avatar lid={lid} formaat="klein" />
                          <span className="klein">{lid.naam}</span>
                        </span>
                      ))}
                    </div>
                  </div>
                ) : null}
                {bronnen.length > 0 ? (
                  <div className="detail-regel">
                    <span className="detail-term">Bronnen</span>
                    <ul className="klein" style={{ margin: 0 }}>
                      {bronnen.map((b) => (
                        <li key={b.id}>{b.titel}</li>
                      ))}
                    </ul>
                  </div>
                ) : null}
                {beslissing.notitie ? (
                  <div className="detail-regel">
                    <span className="detail-term">Notitie</span>
                    <span className="multiline" style={{ color: 'var(--waarschuwing)' }}>
                      {beslissing.notitie}
                    </span>
                  </div>
                ) : null}
              </div>
            </div>
          </Kaart>
        );
      })}

      <BeslissingFormulier open={nieuwOpen} item={null} onSluit={() => setNieuwOpen(false)} onOpslaan={opslaan} />
      <BeslissingFormulier open={bewerken !== null} item={bewerken} onSluit={() => setBewerken(null)} onOpslaan={opslaan} />

      <Bevestig
        open={teVerwijderen !== null}
        titel="Beslissing verwijderen"
        tekst={teVerwijderen ? `"${teVerwijderen.beslissing.slice(0, 70)}" verwijderen?` : ''}
        onBevestig={() => {
          acties.verwijderen('beslissingen', teVerwijderen.id, 'Beslissing verwijderd');
          toast.goed('Beslissing verwijderd');
          setTeVerwijderen(null);
        }}
        onAnnuleer={() => setTeVerwijderen(null)}
      />
    </>
  );
}
