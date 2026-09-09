/** Formulier om een taak toe te voegen of aan te passen. */

import { useEffect, useState } from 'react';
import { Dialoog } from '../ui/Dialoog.jsx';
import { Knop } from '../ui/Basis.jsx';
import { Invoer, Keuze, Tekstvak, MeerKeuze } from '../ui/Formulier.jsx';
import { STATUSSEN, PRIORITEITEN } from '../../data/constanten.js';
import { useProject } from '../../store/ProjectContext.jsx';
import { isDatum } from '../../lib/datums.js';

const LEEG = {
  titel: '',
  beschrijving: '',
  categorie: '',
  fase: '',
  toegewezenAan: '',
  prioriteit: 'normaal',
  status: 'todo',
  deadline: '',
  afhankelijkVan: [],
  notities: '',
  bron: '',
};

export function TaakFormulier({ open, taak, onSluit, onOpslaan, standaardFase = '' }) {
  const { staat } = useProject();
  const [waarden, setWaarden] = useState(LEEG);
  const [fouten, setFouten] = useState({});

  useEffect(() => {
    if (!open) return;
    setFouten({});
    if (taak) {
      setWaarden({
        titel: taak.titel || '',
        beschrijving: taak.beschrijving || '',
        categorie: taak.categorie || '',
        fase: taak.fase || '',
        toegewezenAan: taak.toegewezenAan || '',
        prioriteit: taak.prioriteit || 'normaal',
        status: taak.status || 'todo',
        deadline: taak.deadline || '',
        afhankelijkVan: taak.afhankelijkVan || [],
        notities: taak.notities || '',
        bron: taak.bron || '',
      });
    } else {
      setWaarden({ ...LEEG, fase: standaardFase });
    }
  }, [open, taak, standaardFase]);

  function zet(veld, waarde) {
    setWaarden((h) => ({ ...h, [veld]: waarde }));
    if (fouten[veld]) setFouten((h) => ({ ...h, [veld]: undefined }));
  }

  function opslaan() {
    const nieuweFouten = {};
    if (!waarden.titel.trim()) {
      nieuweFouten.titel = 'Geef de taak een naam.';
    }
    if (waarden.deadline && !isDatum(waarden.deadline)) {
      nieuweFouten.deadline = 'Gebruik een geldige datum.';
    }
    if (Object.keys(nieuweFouten).length > 0) {
      setFouten(nieuweFouten);
      return;
    }
    onOpslaan({ ...waarden, titel: waarden.titel.trim() });
  }

  /* Een taak kan niet op zichzelf wachten. */
  const mogelijkeAfhankelijkheden = staat.taken
    .filter((t) => !taak || t.id !== taak.id)
    .map((t) => ({ waarde: t.id, label: t.titel }));

  return (
    <Dialoog
      open={open}
      titel={taak ? 'Taak aanpassen' : 'Nieuwe taak'}
      onSluit={onSluit}
      breed
      voet={
        <>
          <Knop onClick={onSluit}>Annuleren</Knop>
          <Knop soort="primair" icoon="vink" onClick={opslaan}>
            {taak ? 'Wijzigingen opslaan' : 'Taak toevoegen'}
          </Knop>
        </>
      }
    >
      <Invoer
        label="Taaknaam *"
        value={waarden.titel}
        onChange={(e) => zet('titel', e.target.value)}
        fout={fouten.titel}
        placeholder="Bijvoorbeeld: Vacuümkamer ontwerpen"
        breed
      />

      <Tekstvak
        label="Beschrijving"
        value={waarden.beschrijving}
        onChange={(e) => zet('beschrijving', e.target.value)}
        placeholder="Wat houdt deze taak precies in?"
        breed
        rijen={3}
      />

      <div className="raster raster-2">
        <Keuze
          label="Categorie"
          value={waarden.categorie}
          onChange={(e) => zet('categorie', e.target.value)}
          opties={staat.categorieen}
          leegLabel="Geen categorie"
        />
        <Keuze
          label="Fase"
          value={waarden.fase}
          onChange={(e) => zet('fase', e.target.value)}
          opties={staat.fases}
          leegLabel="Geen fase"
        />
        <Keuze
          label="Verantwoordelijke"
          value={waarden.toegewezenAan}
          onChange={(e) => zet('toegewezenAan', e.target.value)}
          opties={staat.teamleden}
          leegLabel="Niet toegewezen"
        />
        <Keuze
          label="Prioriteit"
          value={waarden.prioriteit}
          onChange={(e) => zet('prioriteit', e.target.value)}
          opties={PRIORITEITEN}
        />
        <Keuze
          label="Status"
          value={waarden.status}
          onChange={(e) => zet('status', e.target.value)}
          opties={STATUSSEN}
        />
        <Invoer
          label="Deadline"
          type="date"
          value={waarden.deadline}
          onChange={(e) => zet('deadline', e.target.value)}
          fout={fouten.deadline}
          hint="Mag leeg blijven."
        />
      </div>

      <MeerKeuze
        label="Wacht op deze taken"
        opties={mogelijkeAfhankelijkheden}
        gekozen={waarden.afhankelijkVan}
        onWijzig={(nieuw) => zet('afhankelijkVan', nieuw)}
        hint="Klik taken aan waar deze taak van afhangt."
        leegTekst="Er zijn nog geen andere taken."
      />

      <Invoer
        label="Bron"
        value={waarden.bron}
        onChange={(e) => zet('bron', e.target.value)}
        placeholder="Bijvoorbeeld: Plan van aanpak §3, eis F5"
        breed
      />

      <Tekstvak
        label="Notities"
        value={waarden.notities}
        onChange={(e) => zet('notities', e.target.value)}
        breed
        rijen={2}
      />
    </Dialoog>
  );
}
