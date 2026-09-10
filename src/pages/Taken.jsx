import { useState } from 'react';
import { PaginaKop } from '../components/layout/Pagina.jsx';
import { Kaart, Knop, Melding } from '../components/ui/Basis.jsx';
import { Bevestig } from '../components/ui/Dialoog.jsx';
import { TaakLijst } from '../components/taken/TaakLijst.jsx';
import { TaakFilters, useTaakFilters } from '../components/taken/TaakFilters.jsx';
import { TaakFormulier } from '../components/taken/TaakFormulier.jsx';
import { useProject } from '../store/ProjectContext.jsx';
import { useToast } from '../store/ToastContext.jsx';
import { maakCsv, downloadTekst, datumStempel } from '../lib/bestanden.js';
import { STATUSSEN, PRIORITEITEN, HERKOMSTEN, zoekOp } from '../data/constanten.js';

export function Taken({ bewerkTaak, setBewerkTaak }) {
  const { staat, acties } = useProject();
  const toast = useToast();
  const filterset = useTaakFilters(staat);
  const [formulierOpen, setFormulierOpen] = useState(false);
  const [teVerwijderen, setTeVerwijderen] = useState(null);

  /* Een taak die van buitenaf geopend wordt (bijv. vanaf het dashboard). */
  const actieveTaak = bewerkTaak !== undefined ? bewerkTaak : null;
  const dialoogOpen = formulierOpen || actieveTaak !== null;

  function sluitFormulier() {
    setFormulierOpen(false);
    if (setBewerkTaak) setBewerkTaak(null);
  }

  function opslaan(waarden) {
    if (actieveTaak) {
      acties.taakBijwerken(actieveTaak.id, waarden, waarden.titel);
      toast.goed('Taak bijgewerkt');
    } else {
      acties.taakToevoegen(waarden);
      toast.goed('Taak toegevoegd');
    }
    sluitFormulier();
  }

  function wijzigStatus(taak, status) {
    acties.taakStatus(taak.id, status, taak.titel);
  }

  function verwijderBevestigd() {
    acties.verwijderen('taken', teVerwijderen.id, `Taak verwijderd: ${teVerwijderen.titel}`);
    toast.goed('Taak verwijderd');
    setTeVerwijderen(null);
  }

  function exporteerCsv() {
    const kolommen = [
      { label: 'Taaknaam', waarde: (t) => t.titel },
      { label: 'Beschrijving', waarde: (t) => t.beschrijving },
      { label: 'Categorie', waarde: (t) => staat.categorieen.find((c) => c.id === t.categorie)?.naam || '' },
      { label: 'Fase', waarde: (t) => staat.fases.find((f) => f.id === t.fase)?.naam || '' },
      { label: 'Verantwoordelijke', waarde: (t) => staat.teamleden.find((l) => l.id === t.toegewezenAan)?.naam || '' },
      { label: 'Prioriteit', waarde: (t) => zoekOp(PRIORITEITEN, t.prioriteit)?.naam || t.prioriteit },
      { label: 'Status', waarde: (t) => zoekOp(STATUSSEN, t.status)?.naam || t.status },
      { label: 'Vanaf', waarde: (t) => t.startdatum },
      { label: 'Deadline', waarde: (t) => t.deadline },
      { label: 'Afgerond op', waarde: (t) => t.afgerondOp },
      {
        label: 'Wacht op',
        waarde: (t) =>
          t.afhankelijkVan.map((id) => staat.taken.find((x) => x.id === id)?.titel || id).join(' | '),
      },
      { label: 'Herkomst', waarde: (t) => zoekOp(HERKOMSTEN, t.herkomst)?.naam || t.herkomst },
      { label: 'Bron', waarde: (t) => t.bron },
      { label: 'Notities', waarde: (t) => t.notities },
    ];
    downloadTekst(
      `planeterrella-taken-${datumStempel()}.csv`,
      maakCsv(kolommen, filterset.gefilterd),
      'text/csv;charset=utf-8',
    );
    toast.goed(`${filterset.gefilterd.length} taken geëxporteerd naar CSV`);
  }

  return (
    <>
      <PaginaKop
        titel="Taken"
        uitleg="Alles wat er moet gebeuren. Vink af, wijs toe en filter op wat je nu nodig hebt."
        acties={
          <>
            <Knop icoon="download" onClick={exporteerCsv} disabled={filterset.gefilterd.length === 0}>
              CSV exporteren
            </Knop>
            <Knop soort="primair" icoon="plus" onClick={() => setFormulierOpen(true)}>
              Nieuwe taak
            </Knop>
          </>
        }
      />

      <Kaart>
        <TaakFilters staat={staat} {...filterset} />
      </Kaart>

      {staat.taken.length === 0 ? (
        <Melding soort="info">
          Er staan nog geen taken in de hub. Voeg er zelf een toe, of zet via Instellingen de startgegevens uit de
          projectbestanden terug.
        </Melding>
      ) : null}

      <Kaart
        strak
        titel={`${filterset.gefilterd.length} ${filterset.gefilterd.length === 1 ? 'taak' : 'taken'}${
          filterset.actief || filterset.verbergAf ? ' (gefilterd)' : ''
        }`}
      >
        <TaakLijst
          taken={filterset.gefilterd}
          onWijzigStatus={wijzigStatus}
          onBewerk={(taak) => setBewerkTaak(taak)}
          onVerwijder={setTeVerwijderen}
        />
      </Kaart>

      <TaakFormulier open={dialoogOpen} taak={actieveTaak} onSluit={sluitFormulier} onOpslaan={opslaan} />

      <Bevestig
        open={teVerwijderen !== null}
        titel="Taak verwijderen"
        tekst={
          teVerwijderen
            ? `Weet je zeker dat je "${teVerwijderen.titel}" wilt verwijderen? Dit kun je niet ongedaan maken.`
            : ''
        }
        onBevestig={verwijderBevestigd}
        onAnnuleer={() => setTeVerwijderen(null)}
      />
    </>
  );
}
