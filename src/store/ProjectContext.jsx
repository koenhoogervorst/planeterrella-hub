import { useContext, useEffect, useMemo, useReducer, useRef, useState } from 'react';

import { laadProject, bewaarProject, wisProject } from '../lib/opslag.js';
import { maakStartdata } from '../data/seed/index.js';
import { normaliseerProject } from '../lib/schema.js';
import { nieuwId } from '../lib/id.js';
import { vandaagIso } from '../lib/datums.js';
import { ProjectContext } from './context.js';

/* Voorvoegsels voor nieuwe id's per collectie. */
const VOORVOEGSELS = {
  taken: 'taak',
  bronnen: 'bron',
  onderzoeken: 'onz',
  eisen: 'eis',
  onderdelen: 'ond',
  documenten: 'doc',
  beslissingen: 'bes',
  risicos: 'ris',
  teamleden: 'lid',
};

const MAX_ACTIVITEIT = 60;

function metActiviteit(staat, tekst, soort = 'wijziging') {
  if (!tekst) return staat.activiteit;
  const regel = {
    id: nieuwId('act'),
    tijd: new Date().toISOString(),
    tekst,
    soort,
  };
  return [regel, ...staat.activiteit].slice(0, MAX_ACTIVITEIT);
}

function reducer(staat, actie) {
  switch (actie.type) {
    case 'toevoegen': {
      const { collectie, item, omschrijving } = actie;
      const lijst = staat[collectie] || [];
      const nieuw = { ...item, id: item.id || nieuwId(VOORVOEGSELS[collectie] || 'x') };
      return {
        ...staat,
        [collectie]: [nieuw, ...lijst],
        activiteit: metActiviteit(staat, omschrijving),
      };
    }

    case 'bijwerken': {
      const { collectie, id, wijziging, omschrijving } = actie;
      const lijst = staat[collectie] || [];
      return {
        ...staat,
        [collectie]: lijst.map((item) => (item.id === id ? { ...item, ...wijziging } : item)),
        activiteit: metActiviteit(staat, omschrijving),
      };
    }

    case 'verwijderen': {
      const { collectie, id, omschrijving } = actie;
      const lijst = staat[collectie] || [];
      const overig = { ...staat, [collectie]: lijst.filter((item) => item.id !== id) };

      /* Verwijzingen naar het verwijderde item opruimen, zodat er nooit een
         taak blijft hangen die wacht op iets dat niet meer bestaat. */
      if (collectie === 'taken') {
        overig.taken = overig.taken.map((t) => ({
          ...t,
          afhankelijkVan: t.afhankelijkVan.filter((v) => v !== id),
        }));
      }
      if (collectie === 'bronnen') {
        overig.onderzoeken = overig.onderzoeken.map((o) => ({
          ...o,
          bronIds: o.bronIds.filter((v) => v !== id),
        }));
        overig.onderdelen = overig.onderdelen.map((o) => ({
          ...o,
          bronIds: o.bronIds.filter((v) => v !== id),
        }));
        overig.beslissingen = overig.beslissingen.map((b) => ({
          ...b,
          bronIds: b.bronIds.filter((v) => v !== id),
        }));
      }
      if (collectie === 'eisen') {
        overig.onderdelen = overig.onderdelen.map((o) => ({
          ...o,
          eisIds: o.eisIds.filter((v) => v !== id),
        }));
      }
      if (collectie === 'teamleden') {
        overig.taken = overig.taken.map((t) =>
          t.toegewezenAan === id ? { ...t, toegewezenAan: '' } : t,
        );
        overig.eisen = overig.eisen.map((e) => (e.eigenaar === id ? { ...e, eigenaar: '' } : e));
        overig.onderzoeken = overig.onderzoeken.map((o) =>
          o.eigenaar === id ? { ...o, eigenaar: '' } : o,
        );
        overig.onderdelen = overig.onderdelen.map((o) =>
          o.verantwoordelijke === id ? { ...o, verantwoordelijke: '' } : o,
        );
        overig.risicos = overig.risicos.map((r) =>
          r.verantwoordelijke === id ? { ...r, verantwoordelijke: '' } : r,
        );
        overig.beslissingen = overig.beslissingen.map((b) => ({
          ...b,
          betrokkenen: b.betrokkenen.filter((v) => v !== id),
        }));
      }

      overig.activiteit = metActiviteit(staat, omschrijving);
      return overig;
    }

    case 'projectBijwerken':
      return {
        ...staat,
        project: { ...staat.project, ...actie.wijziging },
        activiteit: metActiviteit(staat, 'Projectgegevens aangepast'),
      };

    case 'vervangAlles':
      return actie.data;

    default:
      return staat;
  }
}

export function ProjectProvider({ children }) {
  const [beginToestand] = useState(() => laadProject());
  const [staat, dispatch] = useReducer(reducer, beginToestand.data);
  const [opslagFout, setOpslagFout] = useState(null);
  const [startMelding, setStartMelding] = useState(beginToestand.melding);
  const opslagWerkt = beginToestand.opslagWerkt;

  /* Opslaan met een korte vertraging, zodat typen in een formulier niet bij
     elke toetsaanslag naar localStorage schrijft. */
  const timer = useRef(null);
  useEffect(() => {
    if (timer.current) clearTimeout(timer.current);
    timer.current = setTimeout(() => {
      const fout = bewaarProject(staat);
      setOpslagFout(fout);
    }, 350);
    return () => {
      if (timer.current) clearTimeout(timer.current);
    };
  }, [staat]);

  /* Heeft de gebruiker sinds het openen iets veranderd? Alleen dan is het
     zinvol om te waarschuwen als opslaan niet kan. */
  const eersteStaat = useRef(staat);
  const isGewijzigd = staat !== eersteStaat.current;

  /* Bij het sluiten van het tabblad meteen wegschrijven, zodat de laatste
     wijziging niet in de vertraging blijft hangen.
     Kan de browser niets opslaan (privévenster, of het bestand rechtstreeks van
     schijf geopend), dan waarschuwen we in plaats daarvan — anders zou het werk
     zonder enige melding verdwijnen. */
  useEffect(() => {
    const bijAfsluiten = (e) => {
      bewaarProject(staat);
      if (!opslagWerkt && isGewijzigd) {
        e.preventDefault();
        e.returnValue = '';
        return '';
      }
      return undefined;
    };
    const bijVerbergen = () => bewaarProject(staat);
    window.addEventListener('beforeunload', bijAfsluiten);
    window.addEventListener('pagehide', bijVerbergen);
    return () => {
      window.removeEventListener('beforeunload', bijAfsluiten);
      window.removeEventListener('pagehide', bijVerbergen);
    };
  }, [staat, opslagWerkt, isGewijzigd]);

  const acties = useMemo(() => {
    const nu = () => new Date().toISOString();

    return {
      /* ---- algemeen ---- */
      toevoegen(collectie, item, omschrijving) {
        dispatch({ type: 'toevoegen', collectie, item, omschrijving });
      },
      bijwerken(collectie, id, wijziging, omschrijving) {
        dispatch({ type: 'bijwerken', collectie, id, wijziging, omschrijving });
      },
      verwijderen(collectie, id, omschrijving) {
        dispatch({ type: 'verwijderen', collectie, id, omschrijving });
      },
      projectBijwerken(wijziging) {
        dispatch({ type: 'projectBijwerken', wijziging });
      },

      /* ---- taken ---- */
      taakToevoegen(taak) {
        const volledig = {
          titel: '',
          beschrijving: '',
          categorie: '',
          fase: '',
          toegewezenAan: '',
          prioriteit: 'normaal',
          status: 'todo',
          deadline: '',
          afhankelijkVan: [],
          herkomst: 'eigen',
          bron: '',
          notities: '',
          ...taak,
          aangemaakt: nu(),
          gewijzigd: nu(),
          afgerondOp: taak.status === 'klaar' ? vandaagIso() : '',
        };
        dispatch({
          type: 'toevoegen',
          collectie: 'taken',
          item: volledig,
          omschrijving: `Taak toegevoegd: ${volledig.titel}`,
        });
      },
      taakBijwerken(id, wijziging, titel) {
        const compleet = { ...wijziging, gewijzigd: nu() };
        if (wijziging.status !== undefined) {
          compleet.afgerondOp = wijziging.status === 'klaar' ? vandaagIso() : '';
        }
        dispatch({
          type: 'bijwerken',
          collectie: 'taken',
          id,
          wijziging: compleet,
          omschrijving: titel ? `Taak aangepast: ${titel}` : 'Taak aangepast',
        });
      },
      taakStatus(id, status, titel) {
        dispatch({
          type: 'bijwerken',
          collectie: 'taken',
          id,
          wijziging: {
            status,
            gewijzigd: nu(),
            afgerondOp: status === 'klaar' ? vandaagIso() : '',
          },
          omschrijving:
            status === 'klaar'
              ? `Taak afgerond: ${titel || ''}`.trim()
              : `Status gewijzigd: ${titel || ''}`.trim(),
        });
      },

      /* ---- data beheren ---- */
      allesVervangen(ruweData) {
        const schoon = normaliseerProject(ruweData, maakStartdata());
        dispatch({ type: 'vervangAlles', data: schoon });
        return schoon;
      },
      terugNaarStart() {
        const start = maakStartdata();
        dispatch({ type: 'vervangAlles', data: start });
      },
      allesLeegmaken() {
        const start = maakStartdata();
        dispatch({
          type: 'vervangAlles',
          data: {
            ...start,
            taken: [],
            bronnen: [],
            onderzoeken: [],
            eisen: [],
            onderdelen: [],
            documenten: [],
            beslissingen: [],
            risicos: [],
            activiteit: [
              {
                id: nieuwId('act'),
                tijd: new Date().toISOString(),
                tekst: 'Alle inhoud gewist — lege hub',
                soort: 'systeem',
              },
            ],
          },
        });
      },
      opslagWissen() {
        wisProject();
      },
    };
  }, []);

  const waarde = useMemo(
    () => ({
      staat,
      acties,
      opslagFout,
      opslagWerkt,
      startMelding,
      verbergStartMelding: () => setStartMelding(null),
    }),
    [staat, acties, opslagFout, opslagWerkt, startMelding],
  );

  return <ProjectContext.Provider value={waarde}>{children}</ProjectContext.Provider>;
}

export function useProject() {
  const context = useContext(ProjectContext);
  if (!context) {
    throw new Error('useProject moet binnen een ProjectProvider gebruikt worden.');
  }
  return context;
}

/** Handige afgeleide opzoektabellen. */
export function useOpzoek() {
  const { staat } = useProject();
  return useMemo(
    () => ({
      lid: (id) => staat.teamleden.find((l) => l.id === id) || null,
      lidNaam: (id, vervanging = 'Niet toegewezen') =>
        staat.teamleden.find((l) => l.id === id)?.naam || vervanging,
      categorie: (id) => staat.categorieen.find((c) => c.id === id) || null,
      categorieNaam: (id, vervanging = 'Geen categorie') =>
        staat.categorieen.find((c) => c.id === id)?.naam || vervanging,
      fase: (id) => staat.fases.find((f) => f.id === id) || null,
      faseNaam: (id, vervanging = 'Geen fase') =>
        staat.fases.find((f) => f.id === id)?.naam || vervanging,
      taak: (id) => staat.taken.find((t) => t.id === id) || null,
      bron: (id) => staat.bronnen.find((b) => b.id === id) || null,
      eis: (id) => staat.eisen.find((e) => e.id === id) || null,
    }),
    [staat],
  );
}
