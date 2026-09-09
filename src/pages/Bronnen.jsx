import { useEffect, useMemo, useState } from 'react';
import { PaginaKop } from '../components/layout/Pagina.jsx';
import { Kaart, Knop, Badge, Leeg, HerkomstLabel } from '../components/ui/Basis.jsx';
import { Dialoog, Bevestig } from '../components/ui/Dialoog.jsx';
import { Invoer, Keuze, Tekstvak, Zoekveld } from '../components/ui/Formulier.jsx';
import { Icoon } from '../components/ui/Icoon.jsx';
import { useProject } from '../store/ProjectContext.jsx';
import { useToast } from '../store/ToastContext.jsx';
import { BRONTYPES, BETROUWBAARHEDEN, zoekOp } from '../data/constanten.js';
import { bevatTerm } from '../lib/zoeken.js';
import { toonDatum } from '../lib/datums.js';
import { maakCsv, downloadTekst, datumStempel } from '../lib/bestanden.js';

const LEEG = {
  titel: '',
  auteur: '',
  organisatie: '',
  url: '',
  datum: '',
  type: 'Website',
  onderwerp: '',
  samenvatting: '',
  betrouwbaarheid: 'onbekend',
  notities: '',
  gebruiktVoor: '',
};

const BETROUWBAARHEID_KLEUR = { hoog: 'goed', middel: 'info', laag: 'waarschuwing', onbekend: 'neutraal' };

function BronFormulier({ open, bron, onSluit, onOpslaan }) {
  const [waarden, setWaarden] = useState(LEEG);
  const [fout, setFout] = useState('');

  useEffect(() => {
    if (!open) return;
    setWaarden(bron ? { ...LEEG, ...bron } : LEEG);
    setFout('');
  }, [open, bron]);

  function zet(veld, waarde) {
    setWaarden((h) => ({ ...h, [veld]: waarde }));
    if (fout) setFout('');
  }

  function opslaan() {
    if (!waarden.titel.trim()) {
      setFout('Geef de bron een titel.');
      return;
    }
    onOpslaan({ ...waarden, titel: waarden.titel.trim() });
  }

  return (
    <Dialoog
      open={open}
      titel={bron ? 'Bron aanpassen' : 'Nieuwe bron'}
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
      <Invoer label="Titel *" value={waarden.titel} onChange={(e) => zet('titel', e.target.value)} fout={fout} breed />
      <div className="raster raster-2">
        <Invoer label="Auteur" value={waarden.auteur} onChange={(e) => zet('auteur', e.target.value)} />
        <Invoer
          label="Website of organisatie"
          value={waarden.organisatie}
          onChange={(e) => zet('organisatie', e.target.value)}
        />
        <Keuze label="Type bron" value={waarden.type} onChange={(e) => zet('type', e.target.value)} opties={BRONTYPES} />
        <Keuze
          label="Betrouwbaarheid"
          value={waarden.betrouwbaarheid}
          onChange={(e) => zet('betrouwbaarheid', e.target.value)}
          opties={BETROUWBAARHEDEN}
        />
        <Invoer label="Datum" type="date" value={waarden.datum} onChange={(e) => zet('datum', e.target.value)} hint="Mag leeg blijven." />
        <Invoer label="Onderwerp" value={waarden.onderwerp} onChange={(e) => zet('onderwerp', e.target.value)} />
      </div>
      <Invoer
        label="URL"
        type="url"
        value={waarden.url}
        onChange={(e) => zet('url', e.target.value)}
        placeholder="https://…"
        hint="Mag leeg blijven, bijvoorbeeld bij een boek of een eigen document."
        breed
      />
      <Tekstvak
        label="Korte samenvatting"
        value={waarden.samenvatting}
        onChange={(e) => zet('samenvatting', e.target.value)}
        breed
        rijen={3}
      />
      <Invoer
        label="Waar is deze bron voor gebruikt?"
        value={waarden.gebruiktVoor}
        onChange={(e) => zet('gebruiktVoor', e.target.value)}
        placeholder="Bijvoorbeeld: eis F4, hoofdstuk 5.2.3"
        breed
      />
      <Tekstvak label="Notities" value={waarden.notities} onChange={(e) => zet('notities', e.target.value)} breed rijen={2} />
    </Dialoog>
  );
}

export function Bronnen() {
  const { staat, acties } = useProject();
  const toast = useToast();
  const [zoek, setZoek] = useState('');
  const [type, setType] = useState('alle');
  const [betrouwbaarheid, setBetrouwbaarheid] = useState('alle');
  const [nieuwOpen, setNieuwOpen] = useState(false);
  const [bewerken, setBewerken] = useState(null);
  const [teVerwijderen, setTeVerwijderen] = useState(null);
  const [uitgeklapt, setUitgeklapt] = useState(null);

  const gefilterd = useMemo(
    () =>
      staat.bronnen.filter((b) => {
        if (type !== 'alle' && b.type !== type) return false;
        if (betrouwbaarheid !== 'alle' && b.betrouwbaarheid !== betrouwbaarheid) return false;
        if (zoek.trim()) {
          const tekst = [b.titel, b.auteur, b.organisatie, b.onderwerp, b.samenvatting, b.notities, b.url, b.gebruiktVoor].join(' ');
          if (!bevatTerm(tekst, zoek)) return false;
        }
        return true;
      }),
    [staat.bronnen, zoek, type, betrouwbaarheid],
  );

  function opslaan(waarden) {
    if (bewerken) {
      acties.bijwerken('bronnen', bewerken.id, waarden, `Bron aangepast: ${waarden.titel}`);
      toast.goed('Bron bijgewerkt');
      setBewerken(null);
    } else {
      acties.toevoegen('bronnen', { ...waarden, herkomst: 'eigen' }, `Bron toegevoegd: ${waarden.titel}`);
      toast.goed('Bron toegevoegd');
      setNieuwOpen(false);
    }
  }

  function exporteerCsv() {
    const kolommen = [
      { label: 'Titel', waarde: (b) => b.titel },
      { label: 'Auteur', waarde: (b) => b.auteur },
      { label: 'Organisatie', waarde: (b) => b.organisatie },
      { label: 'URL', waarde: (b) => b.url },
      { label: 'Datum', waarde: (b) => b.datum },
      { label: 'Type', waarde: (b) => b.type },
      { label: 'Onderwerp', waarde: (b) => b.onderwerp },
      { label: 'Samenvatting', waarde: (b) => b.samenvatting },
      { label: 'Betrouwbaarheid', waarde: (b) => zoekOp(BETROUWBAARHEDEN, b.betrouwbaarheid)?.naam || b.betrouwbaarheid },
      { label: 'Gebruikt voor', waarde: (b) => b.gebruiktVoor },
      { label: 'Notities', waarde: (b) => b.notities },
    ];
    downloadTekst(`planeterrella-bronnen-${datumStempel()}.csv`, maakCsv(kolommen, gefilterd), 'text/csv;charset=utf-8');
    toast.goed(`${gefilterd.length} bronnen geëxporteerd naar CSV`);
  }

  return (
    <>
      <PaginaKop
        titel="Bronnen"
        uitleg="Alle bronnen op één plek, met samenvatting en waar ze voor gebruikt zijn."
        acties={
          <>
            <Knop icoon="download" onClick={exporteerCsv} disabled={gefilterd.length === 0}>
              CSV exporteren
            </Knop>
            <Knop soort="primair" icoon="plus" onClick={() => setNieuwOpen(true)}>
              Nieuwe bron
            </Knop>
          </>
        }
      />

      <Kaart>
        <div className="filterbalk">
          <Zoekveld
            label="Zoeken"
            value={zoek}
            onChange={(e) => setZoek(e.target.value)}
            placeholder="Titel, auteur, onderwerp of samenvatting…"
          />
          <Keuze
            label="Type"
            value={type}
            onChange={(e) => setType(e.target.value)}
            opties={[{ waarde: 'alle', label: 'Alle types' }, ...BRONTYPES.map((t) => ({ waarde: t, label: t }))]}
          />
          <Keuze
            label="Betrouwbaarheid"
            value={betrouwbaarheid}
            onChange={(e) => setBetrouwbaarheid(e.target.value)}
            opties={[{ waarde: 'alle', label: 'Alle' }, ...BETROUWBAARHEDEN.map((b) => ({ waarde: b.id, label: b.naam }))]}
          />
          {zoek || type !== 'alle' || betrouwbaarheid !== 'alle' ? (
            <div className="veld">
              <span className="veld-label">&nbsp;</span>
              <Knop
                soort="stil"
                icoon="kruis"
                onClick={() => {
                  setZoek('');
                  setType('alle');
                  setBetrouwbaarheid('alle');
                }}
              >
                Wis filters
              </Knop>
            </div>
          ) : null}
        </div>
      </Kaart>

      <div className="klein zacht">
        {gefilterd.length} van {staat.bronnen.length} bronnen
      </div>

      {gefilterd.length === 0 ? (
        <Kaart>
          <Leeg
            titel="Geen bronnen gevonden"
            tekst={staat.bronnen.length === 0 ? 'Voeg jullie eerste bron toe.' : 'Pas de filters aan.'}
          />
        </Kaart>
      ) : null}

      {gefilterd.map((bron) => {
        const open = uitgeklapt === bron.id;
        return (
          <div key={bron.id} className="uitklap">
            <button type="button" className="uitklap-kop" onClick={() => setUitgeklapt(open ? null : bron.id)}>
              <Icoon naam="chevron" grootte={15} className="uitklap-pijl" data-open={open ? 'true' : 'false'} />
              <div className="vul kolom" style={{ gap: 4, minWidth: 0 }}>
                <span className="vet">{bron.titel}</span>
                <div className="rij rij-wrap mini dof" style={{ gap: 8 }}>
                  {bron.auteur ? <span>{bron.auteur}</span> : null}
                  {bron.organisatie ? <span>· {bron.organisatie}</span> : null}
                  {bron.datum ? <span>· {toonDatum(bron.datum)}</span> : null}
                </div>
              </div>
              <div className="rij rij-wrap" style={{ gap: 5 }}>
                <Badge kleur="omlijnd">{bron.type}</Badge>
                <Badge kleur={BETROUWBAARHEID_KLEUR[bron.betrouwbaarheid]}>
                  {zoekOp(BETROUWBAARHEDEN, bron.betrouwbaarheid)?.naam || bron.betrouwbaarheid}
                </Badge>
                <HerkomstLabel herkomst={bron.herkomst} kort />
              </div>
            </button>

            {open ? (
              <div className="uitklap-lijf">
                <div className="detail-lijst">
                  {bron.onderwerp ? (
                    <div className="detail-regel">
                      <span className="detail-term">Onderwerp</span>
                      <span>{bron.onderwerp}</span>
                    </div>
                  ) : null}
                  {bron.samenvatting ? (
                    <div className="detail-regel">
                      <span className="detail-term">Samenvatting</span>
                      <span className="multiline">{bron.samenvatting}</span>
                    </div>
                  ) : null}
                  {bron.gebruiktVoor ? (
                    <div className="detail-regel">
                      <span className="detail-term">Gebruikt voor</span>
                      <span className="multiline">{bron.gebruiktVoor}</span>
                    </div>
                  ) : null}
                  <div className="detail-regel">
                    <span className="detail-term">URL</span>
                    {bron.url ? (
                      <a href={bron.url} target="_blank" rel="noreferrer noopener" className="rij" style={{ gap: 4, wordBreak: 'break-all' }}>
                        <Icoon naam="link" grootte={13} />
                        {bron.url}
                      </a>
                    ) : (
                      <span className="dof">Geen URL — bijvoorbeeld een boek of een eigen document.</span>
                    )}
                  </div>
                  {bron.notities ? (
                    <div className="detail-regel">
                      <span className="detail-term">Notities</span>
                      <span className="multiline">{bron.notities}</span>
                    </div>
                  ) : null}
                </div>

                <div className="rij" style={{ marginTop: 'var(--r4)' }}>
                  <span className="vul" />
                  <Knop klein icoon="potlood" onClick={() => setBewerken(bron)}>
                    Aanpassen
                  </Knop>
                  <Knop klein soort="stil" icoon="prullenbak" onClick={() => setTeVerwijderen(bron)}>
                    Verwijderen
                  </Knop>
                </div>
              </div>
            ) : null}
          </div>
        );
      })}

      <BronFormulier open={nieuwOpen} bron={null} onSluit={() => setNieuwOpen(false)} onOpslaan={opslaan} />
      <BronFormulier open={bewerken !== null} bron={bewerken} onSluit={() => setBewerken(null)} onOpslaan={opslaan} />

      <Bevestig
        open={teVerwijderen !== null}
        titel="Bron verwijderen"
        tekst={
          teVerwijderen
            ? `"${teVerwijderen.titel}" verwijderen? De koppelingen vanuit onderzoeken, onderdelen en beslissingen verdwijnen dan ook.`
            : ''
        }
        onBevestig={() => {
          acties.verwijderen('bronnen', teVerwijderen.id, `Bron verwijderd: ${teVerwijderen.titel}`);
          toast.goed('Bron verwijderd');
          setTeVerwijderen(null);
        }}
        onAnnuleer={() => setTeVerwijderen(null)}
      />
    </>
  );
}
