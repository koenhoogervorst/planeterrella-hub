import { useEffect, useMemo, useState } from 'react';
import { PaginaKop } from '../components/layout/Pagina.jsx';
import { Kaart, Knop, Leeg, HerkomstLabel, ErnstBadge, RisicoStatusBadge, Stat, Melding } from '../components/ui/Basis.jsx';
import { Dialoog, Bevestig } from '../components/ui/Dialoog.jsx';
import { Invoer, Keuze, Tekstvak, Zoekveld } from '../components/ui/Formulier.jsx';
import { useProject, useOpzoek } from '../store/ProjectContext.jsx';
import { useToast } from '../store/ToastContext.jsx';
import { ERNSTEN, RISICO_STATUSSEN } from '../data/constanten.js';
import { bevatTerm } from '../lib/zoeken.js';
import { toonDatum, vandaagIso } from '../lib/datums.js';

const LEEG = {
  titel: '',
  omschrijving: '',
  datum: '',
  ernst: 'middel',
  verantwoordelijke: '',
  status: 'open',
  categorie: '',
  oplossing: '',
  notities: '',
};

const ERNST_GEWICHT = { kritiek: 0, hoog: 1, middel: 2, laag: 3 };

function RisicoFormulier({ open, item, onSluit, onOpslaan }) {
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
    if (!waarden.titel.trim()) {
      setFout('Geef het probleem of risico een korte titel.');
      return;
    }
    onOpslaan({ ...waarden, titel: waarden.titel.trim() });
  }

  return (
    <Dialoog
      open={open}
      titel={item ? 'Probleem aanpassen' : 'Nieuw probleem of risico'}
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
      <Tekstvak
        label="Omschrijving"
        value={waarden.omschrijving}
        onChange={(e) => zet('omschrijving', e.target.value)}
        breed
        rijen={3}
      />
      <div className="raster raster-2">
        <Invoer label="Datum" type="date" value={waarden.datum} onChange={(e) => zet('datum', e.target.value)} />
        <Keuze label="Ernst" value={waarden.ernst} onChange={(e) => zet('ernst', e.target.value)} opties={ERNSTEN} />
        <Keuze label="Status" value={waarden.status} onChange={(e) => zet('status', e.target.value)} opties={RISICO_STATUSSEN} />
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
        />
      </div>
      <Tekstvak
        label="Oplossing of beheersmaatregel"
        value={waarden.oplossing}
        onChange={(e) => zet('oplossing', e.target.value)}
        breed
        rijen={3}
      />
      <Tekstvak
        label="Notities"
        value={waarden.notities}
        onChange={(e) => zet('notities', e.target.value)}
        breed
        rijen={2}
        hint="Noteer hier waar dit risico vandaan komt, zodat je het later kunt narekenen."
      />
    </Dialoog>
  );
}

export function Risicos() {
  const { staat, acties } = useProject();
  const opzoek = useOpzoek();
  const toast = useToast();
  const [zoek, setZoek] = useState('');
  const [ernst, setErnst] = useState('alle');
  const [status, setStatus] = useState('alle');
  const [nieuwOpen, setNieuwOpen] = useState(false);
  const [bewerken, setBewerken] = useState(null);
  const [teVerwijderen, setTeVerwijderen] = useState(null);

  const gefilterd = useMemo(() => {
    const lijst = staat.risicos.filter((r) => {
      if (ernst !== 'alle' && r.ernst !== ernst) return false;
      if (status !== 'alle' && r.status !== status) return false;
      if (zoek.trim()) {
        if (!bevatTerm([r.titel, r.omschrijving, r.oplossing, r.notities].join(' '), zoek)) return false;
      }
      return true;
    });
    /* Ernstigste bovenaan, opgeloste onderaan. */
    return [...lijst].sort((a, b) => {
      const aOp = a.status === 'opgelost' ? 1 : 0;
      const bOp = b.status === 'opgelost' ? 1 : 0;
      if (aOp !== bOp) return aOp - bOp;
      return (ERNST_GEWICHT[a.ernst] ?? 9) - (ERNST_GEWICHT[b.ernst] ?? 9);
    });
  }, [staat.risicos, zoek, ernst, status]);

  const kritiekOpen = staat.risicos.filter((r) => r.ernst === 'kritiek' && r.status !== 'opgelost').length;
  const open = staat.risicos.filter((r) => r.status === 'open').length;
  const opgelost = staat.risicos.filter((r) => r.status === 'opgelost').length;

  function opslaan(waarden) {
    if (bewerken) {
      acties.bijwerken('risicos', bewerken.id, waarden, `Risico aangepast: ${waarden.titel}`);
      toast.goed('Risico bijgewerkt');
      setBewerken(null);
    } else {
      acties.toevoegen('risicos', { ...waarden, herkomst: 'eigen' }, `Risico toegevoegd: ${waarden.titel}`);
      toast.goed('Risico toegevoegd');
      setNieuwOpen(false);
    }
  }

  return (
    <>
      <PaginaKop
        titel="Problemen &amp; risico’s"
        uitleg="Wat er mis kan gaan en hoe jullie het beheersen."
        acties={
          <Knop soort="primair" icoon="plus" onClick={() => setNieuwOpen(true)}>
            Nieuw risico
          </Knop>
        }
      />

      <Melding soort="info">
        Dit zijn risico’s zoals ze in jullie bronnen genoemd worden, geen vastgestelde feiten. Bij elk risico staat in de
        notities waar het vandaan komt, zodat je het kunt narekenen voordat het in het eindverslag belandt.
      </Melding>

      <div className="raster raster-4">
        <Stat label="Risico’s totaal" waarde={staat.risicos.length} icoon="risicos" />
        <Stat label="Kritiek en niet opgelost" waarde={kritiekOpen} icoon="waarschuwing" kleur={kritiekOpen > 0 ? 'var(--gevaar)' : undefined} />
        <Stat label="Nog helemaal open" waarde={open} icoon="vraag" />
        <Stat label="Opgelost" waarde={opgelost} icoon="vink" kleur="var(--status-klaar)" />
      </div>

      <Kaart>
        <div className="filterbalk">
          <Zoekveld
            label="Zoeken"
            value={zoek}
            onChange={(e) => setZoek(e.target.value)}
            placeholder="Titel, omschrijving of oplossing…"
          />
          <Keuze
            label="Ernst"
            value={ernst}
            onChange={(e) => setErnst(e.target.value)}
            opties={[{ waarde: 'alle', label: 'Alle' }, ...ERNSTEN.map((e) => ({ waarde: e.id, label: e.naam }))]}
          />
          <Keuze
            label="Status"
            value={status}
            onChange={(e) => setStatus(e.target.value)}
            opties={[{ waarde: 'alle', label: 'Alle' }, ...RISICO_STATUSSEN.map((s) => ({ waarde: s.id, label: s.naam }))]}
          />
        </div>
      </Kaart>

      {gefilterd.length === 0 ? (
        <Kaart>
          <Leeg titel="Geen risico’s gevonden" tekst="Pas de filters aan of voeg een risico toe." />
        </Kaart>
      ) : null}

      <div className="raster raster-2">
        {gefilterd.map((risico) => {
          const categorie = opzoek.categorie(risico.categorie);
          return (
            <Kaart key={risico.id}>
              <div className="kolom">
                <div className="rij rij-wrap" style={{ gap: 6 }}>
                  <ErnstBadge ernst={risico.ernst} />
                  <RisicoStatusBadge status={risico.status} />
                  {categorie ? (
                    <span className="mini" style={{ color: categorie.kleur, fontWeight: 650 }}>
                      {categorie.naam}
                    </span>
                  ) : null}
                  <span className="vul" />
                  <HerkomstLabel herkomst={risico.herkomst} kort />
                </div>

                <span className="vet" style={{ fontSize: 'var(--tekst-lg)' }}>
                  {risico.titel}
                </span>

                {risico.omschrijving ? (
                  <p className="klein zacht multiline" style={{ margin: 0 }}>
                    {risico.omschrijving}
                  </p>
                ) : null}

                {risico.oplossing ? (
                  <div className="melding melding-goed">
                    <span className="vul multiline">
                      <strong>Aanpak:</strong> {risico.oplossing}
                    </span>
                  </div>
                ) : (
                  <div className="melding melding-waarschuwing">
                    <span className="vul">Nog geen oplossing of beheersmaatregel vastgelegd.</span>
                  </div>
                )}

                {risico.notities ? (
                  <p className="mini dof multiline" style={{ margin: 0 }}>
                    {risico.notities}
                  </p>
                ) : null}

                <div className="rij rij-wrap mini dof" style={{ gap: 8 }}>
                  <span>{opzoek.lidNaam(risico.verantwoordelijke)}</span>
                  {risico.datum ? <span>· {toonDatum(risico.datum)}</span> : null}
                  <span className="vul" />
                  <Knop soort="stil" alleenIcoon klein icoon="potlood" onClick={() => setBewerken(risico)} aria-label="Aanpassen" />
                  <Knop
                    soort="stil"
                    alleenIcoon
                    klein
                    icoon="prullenbak"
                    onClick={() => setTeVerwijderen(risico)}
                    aria-label="Verwijderen"
                  />
                </div>
              </div>
            </Kaart>
          );
        })}
      </div>

      <RisicoFormulier open={nieuwOpen} item={null} onSluit={() => setNieuwOpen(false)} onOpslaan={opslaan} />
      <RisicoFormulier open={bewerken !== null} item={bewerken} onSluit={() => setBewerken(null)} onOpslaan={opslaan} />

      <Bevestig
        open={teVerwijderen !== null}
        titel="Risico verwijderen"
        tekst={teVerwijderen ? `"${teVerwijderen.titel}" verwijderen?` : ''}
        onBevestig={() => {
          acties.verwijderen('risicos', teVerwijderen.id, `Risico verwijderd: ${teVerwijderen.titel}`);
          toast.goed('Risico verwijderd');
          setTeVerwijderen(null);
        }}
        onAnnuleer={() => setTeVerwijderen(null)}
      />
    </>
  );
}
