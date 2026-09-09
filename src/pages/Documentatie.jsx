import { useEffect, useMemo, useState } from 'react';
import { PaginaKop } from '../components/layout/Pagina.jsx';
import { Kaart, Knop, Badge, Leeg, HerkomstLabel } from '../components/ui/Basis.jsx';
import { Dialoog, Bevestig } from '../components/ui/Dialoog.jsx';
import { Invoer, Keuze, Tekstvak, MeerKeuze, Zoekveld } from '../components/ui/Formulier.jsx';
import { Icoon } from '../components/ui/Icoon.jsx';
import { useProject, useOpzoek } from '../store/ProjectContext.jsx';
import { useToast } from '../store/ToastContext.jsx';
import { DOCUMENT_SOORTEN } from '../data/constanten.js';
import { bevatTerm } from '../lib/zoeken.js';
import { toonDatum } from '../lib/datums.js';

const LEEG = {
  titel: '',
  soort: 'Overige',
  pad: '',
  datum: '',
  omschrijving: '',
  koppelingen: { taken: [], bronnen: [], onderzoeken: [], onderdelen: [] },
  notities: '',
};

function DocumentFormulier({ open, item, onSluit, onOpslaan }) {
  const { staat } = useProject();
  const [waarden, setWaarden] = useState(LEEG);
  const [fout, setFout] = useState('');

  useEffect(() => {
    if (!open) return;
    if (item) {
      setWaarden({
        ...LEEG,
        ...item,
        koppelingen: { ...LEEG.koppelingen, ...(item.koppelingen || {}) },
      });
    } else {
      setWaarden({ ...LEEG, koppelingen: { taken: [], bronnen: [], onderzoeken: [], onderdelen: [] } });
    }
    setFout('');
  }, [open, item]);

  function zet(veld, waarde) {
    setWaarden((h) => ({ ...h, [veld]: waarde }));
    if (fout) setFout('');
  }

  function zetKoppeling(soort, waarde) {
    setWaarden((h) => ({ ...h, koppelingen: { ...h.koppelingen, [soort]: waarde } }));
  }

  function opslaan() {
    if (!waarden.titel.trim()) {
      setFout('Geef het document een titel.');
      return;
    }
    onOpslaan({ ...waarden, titel: waarden.titel.trim() });
  }

  return (
    <Dialoog
      open={open}
      titel={item ? 'Document aanpassen' : 'Nieuw document'}
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
        <Keuze label="Soort" value={waarden.soort} onChange={(e) => zet('soort', e.target.value)} opties={DOCUMENT_SOORTEN} />
        <Invoer label="Datum" type="date" value={waarden.datum} onChange={(e) => zet('datum', e.target.value)} />
      </div>
      <Invoer
        label="Bestandspad of locatie"
        value={waarden.pad}
        onChange={(e) => zet('pad', e.target.value)}
        placeholder="Downloads/milestone 1/…"
        hint="De hub bewaart geen bestanden — alleen waar ze staan."
        breed
      />
      <Tekstvak
        label="Omschrijving"
        value={waarden.omschrijving}
        onChange={(e) => zet('omschrijving', e.target.value)}
        breed
        rijen={3}
      />
      <MeerKeuze
        label="Hoort bij taken"
        opties={staat.taken.map((t) => ({ waarde: t.id, label: t.titel }))}
        gekozen={waarden.koppelingen.taken}
        onWijzig={(nieuw) => zetKoppeling('taken', nieuw)}
        leegTekst="Er staan nog geen taken in de hub."
      />
      <MeerKeuze
        label="Hoort bij bronnen"
        opties={staat.bronnen.map((b) => ({ waarde: b.id, label: b.titel }))}
        gekozen={waarden.koppelingen.bronnen}
        onWijzig={(nieuw) => zetKoppeling('bronnen', nieuw)}
        leegTekst="Er staan nog geen bronnen in de hub."
      />
      <MeerKeuze
        label="Hoort bij onderzoeken"
        opties={staat.onderzoeken.map((o) => ({ waarde: o.id, label: o.vraag }))}
        gekozen={waarden.koppelingen.onderzoeken}
        onWijzig={(nieuw) => zetKoppeling('onderzoeken', nieuw)}
        leegTekst="Er staan nog geen onderzoeken in de hub."
      />
      <MeerKeuze
        label="Hoort bij projectonderdelen"
        opties={staat.onderdelen.map((o) => ({ waarde: o.id, label: o.naam }))}
        gekozen={waarden.koppelingen.onderdelen}
        onWijzig={(nieuw) => zetKoppeling('onderdelen', nieuw)}
        leegTekst="Er staan nog geen onderdelen in de hub."
      />
      <Tekstvak label="Notities" value={waarden.notities} onChange={(e) => zet('notities', e.target.value)} breed rijen={2} />
    </Dialoog>
  );
}

export function Documentatie({ gaNaar }) {
  const { staat, acties } = useProject();
  const opzoek = useOpzoek();
  const toast = useToast();
  const [zoek, setZoek] = useState('');
  const [soort, setSoort] = useState('alle');
  const [nieuwOpen, setNieuwOpen] = useState(false);
  const [bewerken, setBewerken] = useState(null);
  const [teVerwijderen, setTeVerwijderen] = useState(null);
  const [uitgeklapt, setUitgeklapt] = useState(null);

  const gefilterd = useMemo(
    () =>
      staat.documenten.filter((d) => {
        if (soort !== 'alle' && d.soort !== soort) return false;
        if (zoek.trim()) {
          if (!bevatTerm([d.titel, d.soort, d.pad, d.omschrijving, d.notities].join(' '), zoek)) return false;
        }
        return true;
      }),
    [staat.documenten, zoek, soort],
  );

  const gebruikteSoorten = useMemo(
    () => [...new Set(staat.documenten.map((d) => d.soort))].sort((a, b) => a.localeCompare(b, 'nl')),
    [staat.documenten],
  );

  function opslaan(waarden) {
    if (bewerken) {
      acties.bijwerken('documenten', bewerken.id, waarden, `Document aangepast: ${waarden.titel}`);
      toast.goed('Document bijgewerkt');
      setBewerken(null);
    } else {
      acties.toevoegen('documenten', { ...waarden, herkomst: 'eigen' }, `Document toegevoegd: ${waarden.titel}`);
      toast.goed('Document toegevoegd');
      setNieuwOpen(false);
    }
  }

  return (
    <>
      <PaginaKop
        titel="Documentatie"
        uitleg="Welke documenten, tekeningen en foto's er zijn, waar ze staan en waar ze bij horen."
        acties={
          <Knop soort="primair" icoon="plus" onClick={() => setNieuwOpen(true)}>
            Document toevoegen
          </Knop>
        }
      />

      <Kaart>
        <div className="filterbalk">
          <Zoekveld
            label="Zoeken"
            value={zoek}
            onChange={(e) => setZoek(e.target.value)}
            placeholder="Titel, pad of omschrijving…"
          />
          <Keuze
            label="Soort"
            value={soort}
            onChange={(e) => setSoort(e.target.value)}
            opties={[{ waarde: 'alle', label: 'Alle soorten' }, ...gebruikteSoorten.map((s) => ({ waarde: s, label: s }))]}
          />
        </div>
        <p className="mini dof" style={{ marginTop: 'var(--r3)' }}>
          De hub bewaart geen bestanden zelf — alleen een verwijzing naar waar ze staan. Klopt een pad niet meer, pas het
          dan hier aan.
        </p>
      </Kaart>

      {gefilterd.length === 0 ? (
        <Kaart>
          <Leeg titel="Geen documenten gevonden" tekst="Pas de filters aan of voeg een document toe." />
        </Kaart>
      ) : null}

      {gefilterd.map((doc) => {
        const open = uitgeklapt === doc.id;
        const k = doc.koppelingen || {};
        const taken = (k.taken || []).map((id) => opzoek.taak(id)).filter(Boolean);
        const bronnen = (k.bronnen || []).map((id) => opzoek.bron(id)).filter(Boolean);
        const onderzoeken = (k.onderzoeken || [])
          .map((id) => staat.onderzoeken.find((o) => o.id === id))
          .filter(Boolean);
        const onderdelen = (k.onderdelen || [])
          .map((id) => staat.onderdelen.find((o) => o.id === id))
          .filter(Boolean);
        const aantalKoppelingen = taken.length + bronnen.length + onderzoeken.length + onderdelen.length;

        return (
          <div key={doc.id} className="uitklap">
            <button type="button" className="uitklap-kop" onClick={() => setUitgeklapt(open ? null : doc.id)}>
              <Icoon naam="chevron" grootte={15} className="uitklap-pijl" data-open={open ? 'true' : 'false'} />
              <div className="vul kolom" style={{ gap: 4, minWidth: 0 }}>
                <span className="vet">{doc.titel}</span>
                <div className="rij rij-wrap mini dof" style={{ gap: 8 }}>
                  {doc.pad ? <span className="mono afgekapt">{doc.pad}</span> : <span>Geen pad ingevuld</span>}
                  {doc.datum ? <span>· {toonDatum(doc.datum)}</span> : null}
                </div>
              </div>
              <div className="rij rij-wrap" style={{ gap: 5 }}>
                <Badge kleur="omlijnd">{doc.soort}</Badge>
                {aantalKoppelingen > 0 ? <Badge kleur="accent">{aantalKoppelingen} koppelingen</Badge> : null}
                <HerkomstLabel herkomst={doc.herkomst} kort />
              </div>
            </button>

            {open ? (
              <div className="uitklap-lijf">
                {doc.omschrijving ? (
                  <p className="multiline" style={{ marginBottom: 'var(--r4)' }}>
                    {doc.omschrijving}
                  </p>
                ) : null}

                <div className="raster raster-2">
                  <div className="kolom" style={{ gap: 4 }}>
                    <span className="klein vet zacht">Gekoppelde taken</span>
                    {taken.length === 0 ? (
                      <span className="klein dof">Geen</span>
                    ) : (
                      <ul className="klein" style={{ margin: 0 }}>
                        {taken.map((t) => (
                          <li key={t.id}>{t.titel}</li>
                        ))}
                      </ul>
                    )}

                    <span className="klein vet zacht" style={{ marginTop: 8 }}>
                      Gekoppelde bronnen
                    </span>
                    {bronnen.length === 0 ? (
                      <span className="klein dof">Geen</span>
                    ) : (
                      <ul className="klein" style={{ margin: 0 }}>
                        {bronnen.map((b) => (
                          <li key={b.id}>{b.titel}</li>
                        ))}
                      </ul>
                    )}
                  </div>

                  <div className="kolom" style={{ gap: 4 }}>
                    <span className="klein vet zacht">Gekoppelde onderzoeken</span>
                    {onderzoeken.length === 0 ? (
                      <span className="klein dof">Geen</span>
                    ) : (
                      <ul className="klein" style={{ margin: 0 }}>
                        {onderzoeken.map((o) => (
                          <li key={o.id}>{o.vraag}</li>
                        ))}
                      </ul>
                    )}

                    <span className="klein vet zacht" style={{ marginTop: 8 }}>
                      Gekoppelde onderdelen
                    </span>
                    {onderdelen.length === 0 ? (
                      <span className="klein dof">Geen</span>
                    ) : (
                      <ul className="klein" style={{ margin: 0 }}>
                        {onderdelen.map((o) => (
                          <li key={o.id}>{o.naam}</li>
                        ))}
                      </ul>
                    )}
                  </div>
                </div>

                {doc.notities ? (
                  <p className="klein zacht multiline" style={{ marginTop: 'var(--r3)' }}>
                    {doc.notities}
                  </p>
                ) : null}

                <div className="rij" style={{ marginTop: 'var(--r4)' }}>
                  <Knop klein soort="stil" icoon="onderdelen" onClick={() => gaNaar('onderdelen')}>
                    Naar onderdelen
                  </Knop>
                  <span className="vul" />
                  <Knop klein icoon="potlood" onClick={() => setBewerken(doc)}>
                    Aanpassen
                  </Knop>
                  <Knop klein soort="stil" icoon="prullenbak" onClick={() => setTeVerwijderen(doc)}>
                    Verwijderen
                  </Knop>
                </div>
              </div>
            ) : null}
          </div>
        );
      })}

      <DocumentFormulier open={nieuwOpen} item={null} onSluit={() => setNieuwOpen(false)} onOpslaan={opslaan} />
      <DocumentFormulier open={bewerken !== null} item={bewerken} onSluit={() => setBewerken(null)} onOpslaan={opslaan} />

      <Bevestig
        open={teVerwijderen !== null}
        titel="Document verwijderen"
        tekst={teVerwijderen ? `"${teVerwijderen.titel}" uit de index verwijderen? Het bestand zelf blijft staan.` : ''}
        onBevestig={() => {
          acties.verwijderen('documenten', teVerwijderen.id, `Document verwijderd: ${teVerwijderen.titel}`);
          toast.goed('Document verwijderd');
          setTeVerwijderen(null);
        }}
        onAnnuleer={() => setTeVerwijderen(null)}
      />
    </>
  );
}
