import { useEffect, useMemo, useState } from 'react';
import { PaginaKop } from '../components/layout/Pagina.jsx';
import { Kaart, Knop, Leeg, HerkomstLabel, OnderzoekStatusBadge, Stat } from '../components/ui/Basis.jsx';
import { Dialoog, Bevestig } from '../components/ui/Dialoog.jsx';
import { Invoer, Keuze, Tekstvak, MeerKeuze, Zoekveld } from '../components/ui/Formulier.jsx';
import { Icoon } from '../components/ui/Icoon.jsx';
import { useProject, useOpzoek } from '../store/ProjectContext.jsx';
import { useToast } from '../store/ToastContext.jsx';
import { ONDERZOEK_STATUSSEN } from '../data/constanten.js';
import { bevatTerm } from '../lib/zoeken.js';

const LEEG = {
  vraag: '',
  waarom: '',
  huidigeKennis: '',
  resultaten: '',
  conclusie: '',
  vervolgvragen: '',
  status: 'open',
  categorie: '',
  eigenaar: '',
  bronIds: [],
};

function OnderzoekFormulier({ open, item, onSluit, onOpslaan }) {
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
    if (!waarden.vraag.trim()) {
      setFout('Vul de onderzoeksvraag in.');
      return;
    }
    onOpslaan({ ...waarden, vraag: waarden.vraag.trim() });
  }

  return (
    <Dialoog
      open={open}
      titel={item ? 'Onderzoek aanpassen' : 'Nieuwe onderzoeksvraag'}
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
      <Invoer
        label="Onderzoeksvraag *"
        value={waarden.vraag}
        onChange={(e) => zet('vraag', e.target.value)}
        fout={fout}
        placeholder="Bijvoorbeeld: Welk gas geeft het beste kleureffect?"
        breed
      />
      <div className="raster raster-3">
        <Keuze label="Status" value={waarden.status} onChange={(e) => zet('status', e.target.value)} opties={ONDERZOEK_STATUSSEN} />
        <Keuze
          label="Categorie"
          value={waarden.categorie}
          onChange={(e) => zet('categorie', e.target.value)}
          opties={staat.categorieen}
          leegLabel="Geen categorie"
        />
        <Keuze
          label="Wie onderzoekt dit?"
          value={waarden.eigenaar}
          onChange={(e) => zet('eigenaar', e.target.value)}
          opties={staat.teamleden}
          leegLabel="Niet toegewezen"
        />
      </div>
      <Tekstvak label="Waarom onderzoeken we dit?" value={waarden.waarom} onChange={(e) => zet('waarom', e.target.value)} breed rijen={2} />
      <Tekstvak
        label="Wat weten we nu al?"
        value={waarden.huidigeKennis}
        onChange={(e) => zet('huidigeKennis', e.target.value)}
        breed
        rijen={4}
      />
      <Tekstvak label="Resultaten" value={waarden.resultaten} onChange={(e) => zet('resultaten', e.target.value)} breed rijen={3} />
      <Tekstvak label="Conclusie" value={waarden.conclusie} onChange={(e) => zet('conclusie', e.target.value)} breed rijen={3} />
      <Tekstvak
        label="Openstaande vragen / vervolgonderzoek"
        value={waarden.vervolgvragen}
        onChange={(e) => zet('vervolgvragen', e.target.value)}
        breed
        rijen={3}
      />
      <MeerKeuze
        label="Gebruikte bronnen"
        opties={staat.bronnen.map((b) => ({ waarde: b.id, label: b.titel }))}
        gekozen={waarden.bronIds}
        onWijzig={(nieuw) => zet('bronIds', nieuw)}
        leegTekst="Er staan nog geen bronnen in de hub."
      />
    </Dialoog>
  );
}

export function Onderzoek({ gaNaar }) {
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
      staat.onderzoeken.filter((o) => {
        if (status !== 'alle' && o.status !== status) return false;
        if (zoek.trim()) {
          const tekst = [o.vraag, o.waarom, o.huidigeKennis, o.resultaten, o.conclusie, o.vervolgvragen].join(' ');
          if (!bevatTerm(tekst, zoek)) return false;
        }
        return true;
      }),
    [staat.onderzoeken, zoek, status],
  );

  const tellingen = useMemo(
    () => ({
      open: staat.onderzoeken.filter((o) => o.status === 'open').length,
      bezig: staat.onderzoeken.filter((o) => o.status === 'bezig' || o.status === 'deels').length,
      beantwoord: staat.onderzoeken.filter((o) => o.status === 'beantwoord').length,
    }),
    [staat.onderzoeken],
  );

  function opslaan(waarden) {
    if (bewerken) {
      acties.bijwerken('onderzoeken', bewerken.id, waarden, `Onderzoek aangepast: ${waarden.vraag}`);
      toast.goed('Onderzoek bijgewerkt');
      setBewerken(null);
    } else {
      acties.toevoegen('onderzoeken', { ...waarden, herkomst: 'eigen' }, `Onderzoek toegevoegd: ${waarden.vraag}`);
      toast.goed('Onderzoeksvraag toegevoegd');
      setNieuwOpen(false);
    }
  }

  return (
    <>
      <PaginaKop
        titel="Onderzoek"
        uitleg="Per onderzoeksvraag: waarom, wat we al weten, resultaten, conclusie en wat er nog open staat."
        acties={
          <Knop soort="primair" icoon="plus" onClick={() => setNieuwOpen(true)}>
            Nieuwe onderzoeksvraag
          </Knop>
        }
      />

      <div className="raster raster-4">
        <Stat label="Onderzoeksvragen" waarde={staat.onderzoeken.length} icoon="onderzoek" />
        <Stat label="Nog niet onderzocht" waarde={tellingen.open} icoon="vraag" />
        <Stat label="Bezig of deels" waarde={tellingen.bezig} icoon="klok" kleur="var(--status-bezig)" />
        <Stat label="Beantwoord" waarde={tellingen.beantwoord} icoon="vink" kleur="var(--status-klaar)" />
      </div>

      <Kaart>
        <div className="filterbalk">
          <Zoekveld
            label="Zoeken"
            value={zoek}
            onChange={(e) => setZoek(e.target.value)}
            placeholder="Vraag, kennis, conclusie…"
          />
          <Keuze
            label="Status"
            value={status}
            onChange={(e) => setStatus(e.target.value)}
            opties={[
              { waarde: 'alle', label: 'Alle statussen' },
              ...ONDERZOEK_STATUSSEN.map((s) => ({ waarde: s.id, label: s.naam })),
            ]}
          />
        </div>
      </Kaart>

      {gefilterd.length === 0 ? (
        <Kaart>
          <Leeg titel="Geen onderzoeksvragen gevonden" tekst="Pas de filters aan of voeg een vraag toe." />
        </Kaart>
      ) : null}

      {gefilterd.map((item) => {
        const open = uitgeklapt === item.id;
        const categorie = opzoek.categorie(item.categorie);
        const bronnen = item.bronIds.map((id) => opzoek.bron(id)).filter(Boolean);
        return (
          <div key={item.id} className="uitklap">
            <button type="button" className="uitklap-kop" onClick={() => setUitgeklapt(open ? null : item.id)}>
              <Icoon naam="chevron" grootte={15} className="uitklap-pijl" data-open={open ? 'true' : 'false'} />
              <div className="vul kolom" style={{ gap: 4, minWidth: 0 }}>
                <span className="vet">{item.vraag}</span>
                <div className="rij rij-wrap mini dof" style={{ gap: 8 }}>
                  {categorie ? (
                    <span style={{ color: categorie.kleur, fontWeight: 650 }}>{categorie.naam}</span>
                  ) : null}
                  <span>· {opzoek.lidNaam(item.eigenaar)}</span>
                  {bronnen.length > 0 ? <span>· {bronnen.length} bronnen</span> : null}
                </div>
              </div>
              <div className="rij rij-wrap" style={{ gap: 5 }}>
                <OnderzoekStatusBadge status={item.status} />
                <HerkomstLabel herkomst={item.herkomst} kort />
              </div>
            </button>

            {open ? (
              <div className="uitklap-lijf">
                <div className="detail-lijst">
                  {item.waarom ? (
                    <div className="detail-regel">
                      <span className="detail-term">Waarom onderzoeken</span>
                      <span className="multiline">{item.waarom}</span>
                    </div>
                  ) : null}
                  {item.huidigeKennis ? (
                    <div className="detail-regel">
                      <span className="detail-term">Wat we al weten</span>
                      <span className="multiline">{item.huidigeKennis}</span>
                    </div>
                  ) : null}
                  <div className="detail-regel">
                    <span className="detail-term">Resultaten</span>
                    <span className={item.resultaten ? 'multiline' : 'dof'}>
                      {item.resultaten || 'Nog geen resultaten vastgelegd.'}
                    </span>
                  </div>
                  <div className="detail-regel">
                    <span className="detail-term">Conclusie</span>
                    <span className={item.conclusie ? 'multiline' : 'dof'}>
                      {item.conclusie || 'Nog geen conclusie.'}
                    </span>
                  </div>
                  {item.vervolgvragen ? (
                    <div className="detail-regel">
                      <span className="detail-term">Openstaande vragen</span>
                      <span className="multiline">{item.vervolgvragen}</span>
                    </div>
                  ) : null}
                  <div className="detail-regel">
                    <span className="detail-term">Gebruikte bronnen</span>
                    {bronnen.length === 0 ? (
                      <span className="dof">Nog geen bronnen gekoppeld.</span>
                    ) : (
                      <ul style={{ margin: 0 }}>
                        {bronnen.map((b) => (
                          <li key={b.id} className="klein">
                            {b.titel}
                            {b.url ? (
                              <>
                                {' '}
                                <a href={b.url} target="_blank" rel="noreferrer noopener">
                                  (link)
                                </a>
                              </>
                            ) : null}
                          </li>
                        ))}
                      </ul>
                    )}
                  </div>
                </div>

                <div className="rij" style={{ marginTop: 'var(--r4)' }}>
                  <Knop klein soort="stil" icoon="bronnen" onClick={() => gaNaar('bronnen')}>
                    Naar bronnen
                  </Knop>
                  <span className="vul" />
                  <Knop klein icoon="potlood" onClick={() => setBewerken(item)}>
                    Aanpassen
                  </Knop>
                  <Knop klein soort="stil" icoon="prullenbak" onClick={() => setTeVerwijderen(item)}>
                    Verwijderen
                  </Knop>
                </div>
              </div>
            ) : null}
          </div>
        );
      })}

      <OnderzoekFormulier open={nieuwOpen} item={null} onSluit={() => setNieuwOpen(false)} onOpslaan={opslaan} />
      <OnderzoekFormulier open={bewerken !== null} item={bewerken} onSluit={() => setBewerken(null)} onOpslaan={opslaan} />

      <Bevestig
        open={teVerwijderen !== null}
        titel="Onderzoeksvraag verwijderen"
        tekst={teVerwijderen ? `"${teVerwijderen.vraag}" verwijderen?` : ''}
        onBevestig={() => {
          acties.verwijderen('onderzoeken', teVerwijderen.id, `Onderzoek verwijderd: ${teVerwijderen.vraag}`);
          toast.goed('Onderzoeksvraag verwijderd');
          setTeVerwijderen(null);
        }}
        onAnnuleer={() => setTeVerwijderen(null)}
      />
    </>
  );
}
