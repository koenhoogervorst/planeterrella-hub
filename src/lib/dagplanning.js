/** Bepaalt wat er op een bepaalde dag te doen is.
 *
 *  Het idee: een taak is niet alleen relevant op zijn deadline. Hij loopt van
 *  een startdatum tot en met de deadline, en in die periode kun je eraan werken.
 *  Deze module rekent dat uit, plus of een taak nog wacht op ander werk.
 */

import { isDatum, naarDate } from './datums.js';

/** Zaterdag of zondag? Handig om schooldagen te onderscheiden. */
export function isWeekend(iso) {
  const d = naarDate(iso);
  if (!d) return false;
  const dag = d.getDay();
  return dag === 0 || dag === 6;
}

/**
 * Vanaf wanneer kun je aan deze taak werken?
 * Volgorde: de eigen startdatum, anders het begin van de fase, anders het begin
 * van het project. Levert '' als er niets bekend is.
 */
export function startVanTaak(taak, fases, project) {
  if (isDatum(taak.startdatum)) return taak.startdatum;
  const fase = fases.find((f) => f.id === taak.fase);
  if (fase && isDatum(fase.start)) return fase.start;
  if (project && isDatum(project.startdatum)) return project.startdatum;
  return '';
}

/** Loopt deze taak op deze dag? Afgeronde taken lopen niet meer. */
export function looptOpDag(taak, dag, fases, project) {
  if (taak.status === 'klaar') return false;
  const start = startVanTaak(taak, fases, project);
  if (start && dag < start) return false;
  if (isDatum(taak.deadline) && dag > taak.deadline) return false;
  /* Zonder deadline én zonder start weten we niets — dan telt hij altijd mee,
     want hij moet nog steeds gebeuren. */
  return true;
}

/** Welke taken houden deze taak tegen? Levert de nog niet afgeronde blokkers. */
export function blokkers(taak, alleTaken) {
  if (!taak.afhankelijkVan || taak.afhankelijkVan.length === 0) return [];
  return taak.afhankelijkVan
    .map((id) => alleTaken.find((t) => t.id === id))
    .filter((t) => t && t.status !== 'klaar');
}

/**
 * Alles wat er op één dag speelt, opgesplitst in drie stapels:
 *  - deadline:    moet vandaag af
 *  - oppakken:    loopt en niets houdt het tegen
 *  - geblokkeerd: loopt, maar wacht op ander werk
 *
 * `taken` is de volledige lijst (nodig om blokkers op te zoeken); met
 * `zichtbaar` beperk je wat er in de uitkomst terechtkomt, bijvoorbeeld na
 * een filter op persoon.
 */
export function dagOverzicht(dag, taken, zichtbaar, fases, project) {
  const meetellen = zichtbaar || taken;
  const uit = { dag, deadline: [], oppakken: [], geblokkeerd: [], afgerond: [] };

  meetellen.forEach((taak) => {
    if (taak.status === 'klaar') {
      if (taak.afgerondOp === dag) uit.afgerond.push(taak);
      return;
    }
    if (!looptOpDag(taak, dag, fases, project)) return;

    const wacht = blokkers(taak, taken);
    if (isDatum(taak.deadline) && taak.deadline === dag) {
      uit.deadline.push({ taak, wacht });
    } else if (wacht.length > 0) {
      uit.geblokkeerd.push({ taak, wacht });
    } else {
      uit.oppakken.push({ taak, wacht });
    }
  });

  const opPrioriteit = (a, b) => {
    const gewicht = { kritiek: 0, hoog: 1, normaal: 2, laag: 3 };
    return (gewicht[a.taak.prioriteit] ?? 9) - (gewicht[b.taak.prioriteit] ?? 9);
  };
  uit.deadline.sort(opPrioriteit);
  uit.oppakken.sort(opPrioriteit);
  uit.geblokkeerd.sort(opPrioriteit);

  uit.totaal = uit.deadline.length + uit.oppakken.length + uit.geblokkeerd.length;

  /* Niets te doen vandaag? Dan is de vraag niet "pech gehad", maar "waar kun je
     alvast aan beginnen". Dat gebeurt zodra iemand sneller klaar is dan gepland,
     en dan wil je niet dat de dagplanning leeg blijft. */
  if (uit.totaal === 0) {
    uit.vastBeginnen = meetellen
      .filter((taak) => {
        if (taak.status === 'klaar') return false;
        const start = startVanTaak(taak, fases, project);
        return start && start > dag && blokkers(taak, taken).length === 0;
      })
      .sort((a, b) => {
        const sa = startVanTaak(a, fases, project);
        const sb = startVanTaak(b, fases, project);
        return sa < sb ? -1 : sa > sb ? 1 : 0;
      })
      .slice(0, 3);
  } else {
    uit.vastBeginnen = [];
  }

  return uit;
}

/** Hetzelfde dagoverzicht, maar per teamlid uitgesplitst. */
export function dagPerTeamlid(dag, taken, teamleden, fases, project) {
  const rijen = teamleden.map((lid) => ({
    lid,
    ...dagOverzicht(
      dag,
      taken,
      taken.filter((t) => t.toegewezenAan === lid.id),
      fases,
      project,
    ),
  }));

  const zonder = taken.filter((t) => !t.toegewezenAan);
  const nietToegewezen = dagOverzicht(dag, taken, zonder, fases, project);

  return { rijen, nietToegewezen };
}

/**
 * Compacte telling per dag, voor de vakjes in de kalender.
 * Levert een Map van datum -> { totaal, deadlines, oppakken, geblokkeerd, taken }.
 */
export function tellingenPerDag(dagen, taken, zichtbaar, fases, project) {
  const kaart = new Map();
  dagen.forEach((dag) => {
    const overzicht = dagOverzicht(dag, taken, zichtbaar, fases, project);
    kaart.set(dag, {
      totaal: overzicht.totaal,
      deadlines: overzicht.deadline.length,
      oppakken: overzicht.oppakken.length,
      geblokkeerd: overzicht.geblokkeerd.length,
      afgerond: overzicht.afgerond.length,
      /* De eerste paar taken, gesorteerd op urgentie, om in het vakje te tonen. */
      voorbeeld: [...overzicht.deadline, ...overzicht.oppakken, ...overzicht.geblokkeerd].slice(0, 3),
    });
  });
  return kaart;
}
