/** Bouwt de startdataset op uit de losse seed-bestanden.
 *  Deze functie levert altijd een verse kopie, zodat de app de seed nooit
 *  per ongeluk aanpast. */

import { project, teamleden, fases, categorieen } from './basis.js';
import { taken } from './taken.js';
import { eisen } from './eisen.js';
import { bronnen } from './bronnen.js';
import { onderzoeken } from './onderzoeken.js';
import { onderdelen } from './onderdelen.js';
import { documenten } from './documenten.js';
import { beslissingen } from './beslissingen.js';
import { risicos } from './risicos.js';
import { DATA_VERSIE } from '../constanten.js';

/** Diepe kopie zonder afhankelijkheden. structuredClone zit in alle moderne
 *  browsers; JSON is de terugvaloptie voor oudere. */
function kopieer(waarde) {
  if (typeof structuredClone === 'function') {
    try {
      return structuredClone(waarde);
    } catch {
      /* valt hieronder terug op JSON */
    }
  }
  return JSON.parse(JSON.stringify(waarde));
}

export function maakStartdata() {
  return kopieer({
    versie: DATA_VERSIE,
    project,
    teamleden,
    fases,
    categorieen,
    taken,
    eisen,
    bronnen,
    onderzoeken,
    onderdelen,
    documenten,
    beslissingen,
    risicos,
    activiteit: [
      {
        id: 'act-start',
        tijd: '2026-09-09T08:00:00.000Z',
        tekst: 'Projecthub ingericht op basis van de projectbestanden',
        soort: 'systeem',
      },
    ],
  });
}

