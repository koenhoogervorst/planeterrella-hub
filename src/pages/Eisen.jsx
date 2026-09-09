import { useEffect, useMemo, useState } from 'react';
import { PaginaKop } from '../components/layout/Pagina.jsx';
import { Kaart, Knop, Badge, Leeg, HerkomstLabel, EisStatusBadge, Stat, BalkMetGetal } from '../components/ui/Basis.jsx';
import { Dialoog, Bevestig } from '../components/ui/Dialoog.jsx';
import { Invoer, Keuze, Tekstvak, Zoekveld } from '../components/ui/Formulier.jsx';
import { Icoon } from '../components/ui/Icoon.jsx';
import { useProject, useOpzoek } from '../store/ProjectContext.jsx';
import { useToast } from '../store/ToastContext.jsx';
import { EIS_TYPES, EIS_STATUSSEN, EIS_PRIORITEITEN, zoekOp } from '../data/constanten.js';
import { bevatTerm } from '../lib/zoeken.js';
import { toonDatum, deadlineUrgentie } from '../lib/datums.js';
import { percentage } from '../lib/statistiek.js';

const LEEG = {
  code: '',
  omschrijving: '',
  type: 'functioneel',
  prioriteit: 'should',
  status: 'open',
  verificatie: '',
  eigenaar: '',
  deadline: '',
  bron: '',
  notitie: '',
};

const PRIO_KLEUR = { must: 'gevaar', should: 'waarschuwing', could: 'neutraal' };

function EisFormulier({ open, eis, onSluit, onOpslaan }) {
  const { staat } = useProject();
  const [waarden, setWaarden] = useState(LEEG);
  const [fout, setFout] = useState('');

  useEffect(() => {
    if (!open) return;
    setWaarden(eis ? { ...LEEG, ...eis } : LEEG);
    setFout('');
  }, [open, eis]);

  function zet(veld, waarde) {
    setWaarden((h) => ({ ...h, [veld]: waarde }));
    if (fout) setFout('');
  }

  function opslaan() {
    if (!waarden.omschrijving.trim()) {
      setFout('Beschrijf waar de eis over gaat.');
      return;
    }
    onOpslaan({ ...waarden, omschrijving: waarden.omschrijving.trim(), code: waarden.code.trim() });
  }

  return (
    <Dialoog
      open={open}
      titel={eis ? 'Eis aanpassen' : 'Nieuwe eis'}
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
      <div className="raster raster-2">
        <Invoer
          label="ID / code"
          value={waarden.code}
          onChange={(e) => zet('code', e.target.value)}
          placeholder="Bijvoorbeeld F9 of R5"
          hint="Mag leeg blijven."
        />
        <Keuze label="Type" value={waarden.type} onChange={(e) => zet('type', e.target.value)} opties={EIS_TYPES} />
      </div>
      <Tekstvak
        label="Omschrijving *"
        value={waarden.omschrijving}
        onChange={(e) => zet('omschrijving', e.target.value)}
        fout={fout}
        breed
        rijen={3}
        placeholder="Maak de eis meetbaar: welke waarde, hoe gecontroleerd en vóór wanneer?"
      />
      <div className="raster raster-3">
        <Keuze label="Prioriteit" value={waarden.prioriteit} onChange={(e) => zet('prioriteit', e.target.value)} opties={EIS_PRIORITEITEN} />
        <Keuze label="Status" value={waarden.status} onChange={(e) => zet('status', e.target.value)} opties={EIS_STATUSSEN} />
        <Keuze
          label="Eigenaar"
          value={waarden.eigenaar}
          onChange={(e) => zet('eigenaar', e.target.value)}
          opties={staat.teamleden}
          leegLabel="Heel het team"
        />
      </div>
      <div className="raster raster-2">
        <Invoer label="Deadline" type="date" value={waarden.deadline} onChange={(e) => zet('deadline', e.target.value)} />
        <Invoer label="Bron" value={waarden.bron} onChange={(e) => zet('bron', e.target.value)} placeholder="Plan van aanpak §3" />
      </div>
      <Tekstvak
        label="Verificatiemethode"
        value={waarden.verificatie}
        onChange={(e) => zet('verificatie', e.target.value)}
        breed
        rijen={2}
        placeholder="Hoe toon je aan dat de eis gehaald is?"
      />
      <Tekstvak label="Notitie" value={waarden.notitie} onChange={(e) => zet('notitie', e.target.value)} breed rijen={2} />
    </Dialoog>
  );
}

export function Eisen() {
  const { staat, acties } = useProject();
  const opzoek = useOpzoek();
  const toast = useToast();
  const [zoek, setZoek] = useState('');
  const [type, setType] = useState('alle');
  const [status, setStatus] = useState('alle');
  const [nieuwOpen, setNieuwOpen] = useState(false);
  const [bewerken, setBewerken] = useState(null);
  const [teVerwijderen, setTeVerwijderen] = useState(null);

  const gefilterd = useMemo(
    () =>
      staat.eisen.filter((e) => {
        if (type !== 'alle' && e.type !== type) return false;
        if (status !== 'alle' && e.status !== status) return false;
        if (zoek.trim()) {
          const tekst = [e.code, e.omschrijving, e.verificatie, e.notitie, e.bron].join(' ');
          if (!bevatTerm(tekst, zoek)) return false;
        }
        return true;
      }),
    [staat.eisen, zoek, type, status],
  );

  const perType = useMemo(
    () =>
      EIS_TYPES.map((t) => {
        const eigen = gefilterd.filter((e) => e.type === t.id);
        return { type: t, eisen: eigen };
      }).filter((groep) => groep.eisen.length > 0),
    [gefilterd],
  );

  const tellend = staat.eisen.filter((e) => e.status !== 'vervallen');
  const behaald = tellend.filter((e) => e.status === 'behaald').length;
  const herbeoordelen = staat.eisen.filter((e) => e.status === 'herbeoordelen').length;

  function opslaan(waarden) {
    if (bewerken) {
      acties.bijwerken('eisen', bewerken.id, waarden, `Eis aangepast: ${waarden.code || waarden.omschrijving}`);
      toast.goed('Eis bijgewerkt');
      setBewerken(null);
    } else {
      acties.toevoegen('eisen', { ...waarden, herkomst: 'eigen' }, `Eis toegevoegd: ${waarden.code || waarden.omschrijving}`);
      toast.goed('Eis toegevoegd');
      setNieuwOpen(false);
    }
  }

  return (
    <>
      <PaginaKop
        titel="Eisen"
        uitleg="Het pakket van eisen: functioneel, realisatie, veiligheid en overige voorwaarden."
        acties={
          <Knop soort="primair" icoon="plus" onClick={() => setNieuwOpen(true)}>
            Nieuwe eis
          </Knop>
        }
      />

      <div className="raster raster-4">
        <Stat label="Eisen totaal" waarde={staat.eisen.length} icoon="eisen" />
        <Stat label="Behaald" waarde={`${behaald}/${tellend.length}`} icoon="vink" kleur="var(--status-klaar)" />
        <Stat
          label="Te herbeoordelen"
          waarde={herbeoordelen}
          onder="Uit de oudere mindmap-versie"
          icoon="vraag"
          kleur={herbeoordelen > 0 ? 'var(--waarschuwing)' : undefined}
        />
        <Stat
          label="Must-eisen open"
          waarde={staat.eisen.filter((e) => e.prioriteit === 'must' && e.status !== 'behaald' && e.status !== 'vervallen').length}
          icoon="vlag"
        />
      </div>

      <Kaart titel="Voortgang eisen">
        <BalkMetGetal waarde={percentage(behaald, tellend.length)} label="Eisen behaald" />
        <p className="mini dof" style={{ marginTop: 6 }}>
          In het plan van aanpak was de kolom “Behaald” bij alle eisen nog leeg. Zet een eis hier op “Behaald” zodra de
          verificatie is uitgevoerd.
        </p>
      </Kaart>

      <Kaart>
        <div className="filterbalk">
          <Zoekveld
            label="Zoeken"
            value={zoek}
            onChange={(e) => setZoek(e.target.value)}
            placeholder="Code, omschrijving of verificatie…"
          />
          <Keuze
            label="Type"
            value={type}
            onChange={(e) => setType(e.target.value)}
            opties={[{ waarde: 'alle', label: 'Alle types' }, ...EIS_TYPES.map((t) => ({ waarde: t.id, label: t.naam }))]}
          />
          <Keuze
            label="Status"
            value={status}
            onChange={(e) => setStatus(e.target.value)}
            opties={[{ waarde: 'alle', label: 'Alle statussen' }, ...EIS_STATUSSEN.map((s) => ({ waarde: s.id, label: s.naam }))]}
          />
        </div>
      </Kaart>

      {perType.length === 0 ? (
        <Kaart>
          <Leeg titel="Geen eisen gevonden" tekst="Pas de filters aan of voeg een eis toe." />
        </Kaart>
      ) : null}

      {perType.map(({ type: eisType, eisen }) => (
        <Kaart key={eisType.id} strak titel={`${eisType.naam} (${eisen.length})`}>
          <div className="tabel-omhulsel">
            <table className="tabel">
              <thead>
                <tr>
                  <th style={{ width: 62 }}>ID</th>
                  <th>Eis</th>
                  <th style={{ width: 84 }}>Prioriteit</th>
                  <th style={{ width: 132 }}>Status</th>
                  <th style={{ width: 120 }}>Eigenaar</th>
                  <th style={{ width: 108 }}>Deadline</th>
                  <th style={{ width: 78 }}>
                    <span className="verborgen-visueel">Acties</span>
                  </th>
                </tr>
              </thead>
              <tbody>
                {eisen.map((eis) => {
                  const urgentie = eis.status === 'behaald' ? null : deadlineUrgentie(eis.deadline);
                  return (
                    <tr key={eis.id}>
                      <td>
                        <span className="mono vet">{eis.code || '—'}</span>
                      </td>
                      <td>
                        <div className="multiline" style={{ fontWeight: 520 }}>
                          {eis.omschrijving}
                        </div>
                        {eis.verificatie ? (
                          <div className="mini dof multiline" style={{ marginTop: 4 }}>
                            <strong>Verificatie:</strong> {eis.verificatie}
                          </div>
                        ) : null}
                        {eis.notitie ? (
                          <div className="mini multiline" style={{ marginTop: 4, color: 'var(--waarschuwing)' }}>
                            {eis.notitie}
                          </div>
                        ) : null}
                        <div className="rij rij-wrap" style={{ gap: 5, marginTop: 5 }}>
                          <HerkomstLabel herkomst={eis.herkomst} kort />
                          {eis.bron ? <span className="mini dof">{eis.bron}</span> : null}
                        </div>
                      </td>
                      <td>
                        <Badge kleur={PRIO_KLEUR[eis.prioriteit] || 'neutraal'}>
                          {zoekOp(EIS_PRIORITEITEN, eis.prioriteit)?.naam || eis.prioriteit}
                        </Badge>
                      </td>
                      <td>
                        <select
                          className="keuze"
                          value={eis.status}
                          onChange={(e) =>
                            acties.bijwerken(
                              'eisen',
                              eis.id,
                              { status: e.target.value },
                              `Eisstatus gewijzigd: ${eis.code || eis.omschrijving.slice(0, 30)}`,
                            )
                          }
                          aria-label={`Status van eis ${eis.code}`}
                          style={{ fontSize: 'var(--tekst-sm)', padding: '4px 24px 4px 8px' }}
                        >
                          {EIS_STATUSSEN.map((s) => (
                            <option key={s.id} value={s.id}>
                              {s.naam}
                            </option>
                          ))}
                        </select>
                        <div style={{ marginTop: 4 }}>
                          <EisStatusBadge status={eis.status} />
                        </div>
                      </td>
                      <td className="klein">{opzoek.lidNaam(eis.eigenaar, 'Heel het team')}</td>
                      <td>
                        {eis.deadline ? (
                          <span
                            className="klein"
                            style={{
                              color: urgentie === 'verlopen' ? 'var(--gevaar)' : undefined,
                              fontWeight: urgentie === 'verlopen' ? 620 : 500,
                              whiteSpace: 'nowrap',
                            }}
                          >
                            {toonDatum(eis.deadline)}
                          </span>
                        ) : (
                          <span className="dof klein">—</span>
                        )}
                      </td>
                      <td>
                        <div className="cel-acties">
                          <Knop soort="stil" alleenIcoon klein icoon="potlood" onClick={() => setBewerken(eis)} aria-label="Eis aanpassen" />
                          <Knop
                            soort="stil"
                            alleenIcoon
                            klein
                            icoon="prullenbak"
                            onClick={() => setTeVerwijderen(eis)}
                            aria-label="Eis verwijderen"
                          />
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </Kaart>
      ))}

      <Kaart titel="Let op bij het pakket van eisen">
        <ul className="klein zacht" style={{ margin: 0, display: 'flex', flexDirection: 'column', gap: 6 }}>
          <li>
            <Icoon naam="waarschuwing" grootte={12} /> Er is geen losse, genummerde eis voor de <strong>vacuümdruk</strong>.
            De waarde staat alleen in de tekst van F1 (10 Pa) en F3 (0,2 mbar) — en die twee spreken elkaar tegen.
          </li>
          <li>
            <Icoon naam="waarschuwing" grootte={12} /> De verificatietekst van F3 en F6 verwijst naar “de druktest volgens
            F2”, maar F2 gaat over transport.
          </li>
          <li>
            <Icoon naam="waarschuwing" grootte={12} /> De eisen V1 tot en met V5 komen uit de oudere mindmap-versie en
            staan niet meer in het plan van aanpak. Beslis per eis of hij terugkomt of bewust vervalt.
          </li>
        </ul>
      </Kaart>

      <EisFormulier open={nieuwOpen} eis={null} onSluit={() => setNieuwOpen(false)} onOpslaan={opslaan} />
      <EisFormulier open={bewerken !== null} eis={bewerken} onSluit={() => setBewerken(null)} onOpslaan={opslaan} />

      <Bevestig
        open={teVerwijderen !== null}
        titel="Eis verwijderen"
        tekst={teVerwijderen ? `Eis "${teVerwijderen.code || teVerwijderen.omschrijving.slice(0, 40)}" verwijderen?` : ''}
        onBevestig={() => {
          acties.verwijderen('eisen', teVerwijderen.id, `Eis verwijderd: ${teVerwijderen.code}`);
          toast.goed('Eis verwijderd');
          setTeVerwijderen(null);
        }}
        onAnnuleer={() => setTeVerwijderen(null)}
      />
    </>
  );
}
