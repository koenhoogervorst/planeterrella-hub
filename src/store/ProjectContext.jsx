import { useCallback, useContext, useEffect, useMemo, useReducer, useRef, useState } from 'react';

import { laadProject, bewaarProject, wisProject } from '../lib/opslag.js';
import { maakStartdata } from '../data/seed/index.js';
import { normaliseerProject } from '../lib/schema.js';
import { nieuwId } from '../lib/id.js';
import { vandaagIso } from '../lib/datums.js';
import { ProjectContext } from './context.js';
import { heeftGedeeldeDatabase } from '../data/supabase-config.js';
import {
  haalAllesOp,
  bepaalWijzigingen,
  stuurWijzigingen,
  vervangAllesInDatabase,
  luisterNaarWijzigingen,
  pasRemoteToe,
} from '../lib/synchronisatie.js';

/* Wie ben jij? Wordt per browser onthouden en bij elke wijziging meegestuurd,
   zodat je teamgenoten zien wie wat deed. */
const WIE_SLEUTEL = 'planeterrella-hub-wie';

function leesWie() {
  try {
    return window.localStorage.getItem(WIE_SLEUTEL) || '';
  } catch {
    return '';
  }
}

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

function metActiviteit(staat, tekst, doorWie = '', soort = 'wijziging') {
  if (!tekst) return staat.activiteit;
  const regel = {
    id: nieuwId('act'),
    tijd: new Date().toISOString(),
    tekst,
    doorWie,
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
        activiteit: metActiviteit(staat, omschrijving, actie.doorWie),
      };
    }

    case 'bijwerken': {
      const { collectie, id, wijziging, omschrijving } = actie;
      const lijst = staat[collectie] || [];
      return {
        ...staat,
        [collectie]: lijst.map((item) => (item.id === id ? { ...item, ...wijziging } : item)),
        activiteit: metActiviteit(staat, omschrijving, actie.doorWie),
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

      overig.activiteit = metActiviteit(staat, omschrijving, actie.doorWie);
      return overig;
    }

    case 'projectBijwerken':
      return {
        ...staat,
        project: { ...staat.project, ...actie.wijziging },
        activiteit: metActiviteit(staat, 'Projectgegevens aangepast', actie.doorWie),
      };

    case 'vervangAlles':
      return actie.data;

    /* Een wijziging van een teamgenoot. Die heeft de bijbehorende
       activiteitregel zelf al aangemaakt, dus hier voegen we er geen toe. */
    case 'remoteToepassen':
      return pasRemoteToe(staat, actie.wijziging);

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

  /* Wie ben jij? Alleen voor de leesbaarheid van de activiteitenlijst. */
  const [wieBenIk, setWieBenIkStaat] = useState(leesWie);
  const wieRef = useRef(wieBenIk);
  wieRef.current = wieBenIk;

  const setWieBenIk = useCallback((naam) => {
    setWieBenIkStaat(naam);
    try {
      if (naam) window.localStorage.setItem(WIE_SLEUTEL, naam);
      else window.localStorage.removeItem(WIE_SLEUTEL);
    } catch {
      /* niets aan te doen */
    }
  }, []);

  /* Stand van de gedeelde database: 'uit' | 'laden' | 'verbonden' | 'offline' */
  const [deelStatus, setDeelStatus] = useState(heeftGedeeldeDatabase ? 'laden' : 'uit');
  const [deelFout, setDeelFout] = useState(null);

  /* Wat we denken dat er in de database staat. Hier vergelijken we tegenaan om
     te bepalen wat er verstuurd moet worden. */
  const gesynct = useRef(null);
  const eersteKeerGeladen = useRef(false);

  /* ---- 1. Bij het opstarten alles ophalen ---- */
  useEffect(() => {
    if (!heeftGedeeldeDatabase) return undefined;
    let afgebroken = false;

    (async () => {
      try {
        const startdata = maakStartdata();
        const { data, leeg } = await haalAllesOp(startdata);
        if (afgebroken) return;

        if (leeg) {
          /* Eerste keer: de startgegevens in de database zetten. */
          await vervangAllesInDatabase(startdata, wieRef.current);
          gesynct.current = startdata;
          dispatch({ type: 'vervangAlles', data: startdata });
        } else {
          const schoon = normaliseerProject(data, startdata);
          gesynct.current = schoon;
          dispatch({ type: 'vervangAlles', data: schoon });
        }
        eersteKeerGeladen.current = true;
        setDeelStatus('verbonden');
        setDeelFout(null);
      } catch (fout) {
        if (afgebroken) return;
        /* Geen verbinding: doorwerken met wat lokaal bewaard is. */
        setDeelStatus('offline');
        setDeelFout(
          'Geen verbinding met de gedeelde database. Je werkt nu alleen in deze browser; ' +
            'wijzigingen worden pas gedeeld als de verbinding terug is.',
        );
      }
    })();

    return () => {
      afgebroken = true;
    };
  }, []);

  /* ---- 2. Meeluisteren naar wijzigingen van teamgenoten ---- */
  useEffect(() => {
    if (!heeftGedeeldeDatabase) return undefined;

    const stop = luisterNaarWijzigingen(
      (wijziging) => {
        /* Ook de vergelijkingsbasis meenemen, anders zou een wijziging van een
           ander jouw nog niet verstuurde wijziging als "ongedaan" zien. */
        if (gesynct.current) gesynct.current = pasRemoteToe(gesynct.current, wijziging);
        dispatch({ type: 'remoteToepassen', wijziging });
      },
      (status) => {
        if (status === 'verbonden') {
          setDeelStatus('verbonden');
          setDeelFout(null);
        } else if (status === 'fout' || status === 'verbroken') {
          setDeelStatus('offline');
        }
      },
    );

    return stop;
  }, []);

  /* ---- 3. Eigen wijzigingen versturen ---- */
  const bezig = useRef(false);
  useEffect(() => {
    if (!heeftGedeeldeDatabase || !eersteKeerGeladen.current || !gesynct.current) return undefined;

    const timer = setTimeout(async () => {
      if (bezig.current) return;
      const basis = gesynct.current;
      const wijzigingen = bepaalWijzigingen(basis, staat);
      if (wijzigingen.upserts.length === 0 && wijzigingen.deletes.length === 0) return;

      bezig.current = true;
      try {
        await stuurWijzigingen(wijzigingen, wieRef.current);
        /* Alleen bij succes bijwerken; mislukt het, dan proberen we het bij de
           volgende wijziging opnieuw met dezelfde basis. */
        gesynct.current = staat;
        setDeelStatus('verbonden');
        setDeelFout(null);
      } catch (fout) {
        setDeelStatus('offline');
        setDeelFout(
          'Je laatste wijziging kon niet gedeeld worden. Hij staat wel in deze browser en wordt ' +
            'opnieuw geprobeerd zodra je iets anders aanpast.',
        );
      } finally {
        bezig.current = false;
      }
    }, 400);

    return () => clearTimeout(timer);
  }, [staat]);

  /* ---- 4. Altijd ook lokaal bewaren, als reservekopie en voor offline ---- */
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
     Kan de browser niets opslaan (privevenster, of het bestand rechtstreeks van
     schijf geopend), dan waarschuwen we in plaats daarvan - anders zou het werk
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
    /* Elke actie krijgt automatisch mee wie hem uitvoerde. */
    const verzend = (actie) => dispatch({ ...actie, doorWie: wieRef.current });

    return {
      /* ---- algemeen ---- */
      toevoegen(collectie, item, omschrijving) {
        verzend({ type: 'toevoegen', collectie, item, omschrijving });
      },
      bijwerken(collectie, id, wijziging, omschrijving) {
        verzend({ type: 'bijwerken', collectie, id, wijziging, omschrijving });
      },
      verwijderen(collectie, id, omschrijving) {
        verzend({ type: 'verwijderen', collectie, id, omschrijving });
      },
      projectBijwerken(wijziging) {
        verzend({ type: 'projectBijwerken', wijziging });
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
        verzend({
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
        verzend({
          type: 'bijwerken',
          collectie: 'taken',
          id,
          wijziging: compleet,
          omschrijving: titel ? `Taak aangepast: ${titel}` : 'Taak aangepast',
        });
      },
      taakStatus(id, status, titel) {
        verzend({
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

      /* ---- data beheren ----
         Deze drie vervangen alles in een keer. Dat moet ook in de gedeelde
         database gebeuren, anders zouden de oude rijen via realtime meteen
         weer terugkomen. */
      allesVervangen(ruweData) {
        const schoon = normaliseerProject(ruweData, maakStartdata());
        gesynct.current = schoon;
        verzend({ type: 'vervangAlles', data: schoon });
        if (heeftGedeeldeDatabase) vervangAllesInDatabase(schoon, wieRef.current).catch(() => {});
        return schoon;
      },
      terugNaarStart() {
        const start = maakStartdata();
        gesynct.current = start;
        verzend({ type: 'vervangAlles', data: start });
        if (heeftGedeeldeDatabase) vervangAllesInDatabase(start, wieRef.current).catch(() => {});
      },
      allesLeegmaken() {
        const start = maakStartdata();
        const leeg = {
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
              doorWie: wieRef.current,
              soort: 'systeem',
            },
          ],
        };
        gesynct.current = leeg;
        verzend({ type: 'vervangAlles', data: leeg });
        if (heeftGedeeldeDatabase) vervangAllesInDatabase(leeg, wieRef.current).catch(() => {});
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
      /* Gedeelde database */
      gedeeld: heeftGedeeldeDatabase,
      deelStatus,
      deelFout,
      wieBenIk,
      setWieBenIk,
    }),
    [staat, acties, opslagFout, opslagWerkt, startMelding, deelStatus, deelFout, wieBenIk, setWieBenIk],
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
