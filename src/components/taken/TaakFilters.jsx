/** Filterbalk voor taken plus de bijbehorende filter- en sorteerlogica. */

import { useMemo, useState } from 'react';
import { Keuze, Zoekveld } from '../ui/Formulier.jsx';
import { Knop } from '../ui/Basis.jsx';
import { STATUSSEN, PRIORITEITEN } from '../../data/constanten.js';
import { bevatTerm } from '../../lib/zoeken.js';
import { dagenTotVandaag, isDatum, vergelijkDatums } from '../../lib/datums.js';

const LEGE_FILTERS = {
  zoek: '',
  persoon: 'alle',
  status: 'alle',
  categorie: 'alle',
  prioriteit: 'alle',
  fase: 'alle',
  deadline: 'alle',
};

const DEADLINE_OPTIES = [
  { waarde: 'alle', label: 'Alle deadlines' },
  { waarde: 'verlopen', label: 'Verlopen' },
  { waarde: 'week', label: 'Binnen 7 dagen' },
  { waarde: 'maand', label: 'Binnen 30 dagen' },
  { waarde: 'geen', label: 'Zonder deadline' },
];

const SORTEER_OPTIES = [
  { waarde: 'deadline', label: 'Deadline' },
  { waarde: 'prioriteit', label: 'Prioriteit' },
  { waarde: 'status', label: 'Status' },
  { waarde: 'titel', label: 'Naam (A–Z)' },
  { waarde: 'fase', label: 'Fase' },
];

const STATUS_VOLGORDE = { bezig: 0, wacht: 1, todo: 2, klaar: 3 };

export function useTaakFilters(staat, beginFilters = LEGE_FILTERS) {
  const [filters, setFilters] = useState(beginFilters);
  const [sortering, setSortering] = useState('deadline');
  const [verbergAf, setVerbergAf] = useState(false);

  const gefilterd = useMemo(() => {
    const prioGewicht = Object.fromEntries(PRIORITEITEN.map((p) => [p.id, p.gewicht]));
    const faseVolgorde = Object.fromEntries(staat.fases.map((f, i) => [f.id, i]));

    let lijst = staat.taken.filter((taak) => {
      if (verbergAf && taak.status === 'klaar') return false;
      if (filters.persoon !== 'alle') {
        if (filters.persoon === 'geen' ? taak.toegewezenAan !== '' : taak.toegewezenAan !== filters.persoon) {
          return false;
        }
      }
      if (filters.status !== 'alle' && taak.status !== filters.status) return false;
      if (filters.categorie !== 'alle' && taak.categorie !== filters.categorie) return false;
      if (filters.prioriteit !== 'alle' && taak.prioriteit !== filters.prioriteit) return false;
      if (filters.fase !== 'alle' && taak.fase !== filters.fase) return false;

      if (filters.deadline !== 'alle') {
        const heeft = isDatum(taak.deadline);
        if (filters.deadline === 'geen') {
          if (heeft) return false;
        } else {
          if (!heeft) return false;
          const dagen = dagenTotVandaag(taak.deadline);
          if (filters.deadline === 'verlopen' && !(dagen < 0 && taak.status !== 'klaar')) return false;
          if (filters.deadline === 'week' && !(dagen >= 0 && dagen <= 7)) return false;
          if (filters.deadline === 'maand' && !(dagen >= 0 && dagen <= 30)) return false;
        }
      }

      if (filters.zoek.trim()) {
        const doorzoekbaar = [taak.titel, taak.beschrijving, taak.notities, taak.bron].join(' ');
        if (!bevatTerm(doorzoekbaar, filters.zoek)) return false;
      }
      return true;
    });

    lijst = [...lijst].sort((a, b) => {
      switch (sortering) {
        case 'prioriteit': {
          const verschil = (prioGewicht[b.prioriteit] || 0) - (prioGewicht[a.prioriteit] || 0);
          return verschil !== 0 ? verschil : vergelijkDatums(a.deadline, b.deadline);
        }
        case 'status': {
          const verschil = (STATUS_VOLGORDE[a.status] ?? 9) - (STATUS_VOLGORDE[b.status] ?? 9);
          return verschil !== 0 ? verschil : vergelijkDatums(a.deadline, b.deadline);
        }
        case 'titel':
          return a.titel.localeCompare(b.titel, 'nl');
        case 'fase': {
          const verschil = (faseVolgorde[a.fase] ?? 99) - (faseVolgorde[b.fase] ?? 99);
          return verschil !== 0 ? verschil : vergelijkDatums(a.deadline, b.deadline);
        }
        case 'deadline':
        default: {
          const verschil = vergelijkDatums(a.deadline, b.deadline);
          return verschil !== 0 ? verschil : (prioGewicht[b.prioriteit] || 0) - (prioGewicht[a.prioriteit] || 0);
        }
      }
    });

    return lijst;
  }, [staat.taken, staat.fases, filters, sortering, verbergAf]);

  const actief =
    filters.zoek.trim() !== '' ||
    filters.persoon !== 'alle' ||
    filters.status !== 'alle' ||
    filters.categorie !== 'alle' ||
    filters.prioriteit !== 'alle' ||
    filters.fase !== 'alle' ||
    filters.deadline !== 'alle';

  return {
    filters,
    setFilters,
    sortering,
    setSortering,
    verbergAf,
    setVerbergAf,
    gefilterd,
    actief,
    herstel: () => setFilters(LEGE_FILTERS),
  };
}

export function TaakFilters({ staat, filters, setFilters, sortering, setSortering, actief, herstel, verbergAf, setVerbergAf }) {
  function zet(veld, waarde) {
    setFilters((h) => ({ ...h, [veld]: waarde }));
  }

  return (
    <div className="filterbalk">
      <Zoekveld
            label="Zoeken in taken"
            value={filters.zoek}
            onChange={(e) => zet('zoek', e.target.value)}
            placeholder="Naam, beschrijving of bron…"
          />

      <Keuze
        label="Persoon"
        value={filters.persoon}
        onChange={(e) => zet('persoon', e.target.value)}
        opties={[
          { waarde: 'alle', label: 'Iedereen' },
          { waarde: 'geen', label: 'Niet toegewezen' },
          ...staat.teamleden.map((l) => ({ waarde: l.id, label: l.naam })),
        ]}
      />
      <Keuze
        label="Status"
        value={filters.status}
        onChange={(e) => zet('status', e.target.value)}
        opties={[{ waarde: 'alle', label: 'Alle statussen' }, ...STATUSSEN.map((s) => ({ waarde: s.id, label: s.naam }))]}
      />
      <Keuze
        label="Categorie"
        value={filters.categorie}
        onChange={(e) => zet('categorie', e.target.value)}
        opties={[
          { waarde: 'alle', label: 'Alle categorieën' },
          ...staat.categorieen.map((c) => ({ waarde: c.id, label: c.naam })),
        ]}
      />
      <Keuze
        label="Prioriteit"
        value={filters.prioriteit}
        onChange={(e) => zet('prioriteit', e.target.value)}
        opties={[
          { waarde: 'alle', label: 'Alle prioriteiten' },
          ...PRIORITEITEN.map((p) => ({ waarde: p.id, label: p.naam })),
        ]}
      />
      <Keuze
        label="Fase"
        value={filters.fase}
        onChange={(e) => zet('fase', e.target.value)}
        opties={[{ waarde: 'alle', label: 'Alle fases' }, ...staat.fases.map((f) => ({ waarde: f.id, label: f.naam }))]}
      />
      <Keuze
        label="Deadline"
        value={filters.deadline}
        onChange={(e) => zet('deadline', e.target.value)}
        opties={DEADLINE_OPTIES}
      />
      {setSortering ? (
        <Keuze label="Sorteren op" value={sortering} onChange={(e) => setSortering(e.target.value)} opties={SORTEER_OPTIES} />
      ) : null}

      <div className="veld" style={{ minWidth: 0 }}>
        <span className="veld-label">&nbsp;</span>
        <div className="rij">
          {setVerbergAf ? (
            <button
              type="button"
              className="chip"
              aria-pressed={verbergAf ? 'true' : 'false'}
              onClick={() => setVerbergAf(!verbergAf)}
              style={{ height: 34 }}
            >
              Verberg afgerond
            </button>
          ) : null}
          {actief ? (
            <Knop soort="stil" klein icoon="kruis" onClick={herstel}>
              Wis filters
            </Knop>
          ) : null}
        </div>
      </div>
    </div>
  );
}
