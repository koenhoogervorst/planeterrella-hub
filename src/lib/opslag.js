/** Opslag in localStorage.
 *
 *  Keuze voor localStorage: de dataset van dit project is klein (tientallen
 *  taken en bronnen, samen enkele honderden kilobytes), er zijn geen bestanden
 *  of afbeeldingen die opgeslagen worden, en localStorage werkt synchroon —
 *  dat scheelt een hoop complexiteit ten opzichte van IndexedDB zonder dat we
 *  er iets voor inleveren. Voor back-up en uitwisseling tussen laptops zit er
 *  een JSON-export en -import in (pagina Instellingen).
 *
 *  Alles hieronder is defensief: als localStorage niet beschikbaar is (privé-
 *  venster, geblokkeerde cookies) valt de app terug op geheugenopslag en blijft
 *  gewoon werken — hij waarschuwt dan alleen dat er niets bewaard blijft.
 */

import { OPSLAG_SLEUTEL, OPSLAG_BACKUP_SLEUTEL } from '../data/constanten.js';
import { maakStartdata } from '../data/seed/index.js';
import { normaliseerProject } from './schema.js';

let geheugenOpslag = null;

/** Test of localStorage echt bruikbaar is (niet alleen of het bestaat). */
function opslagBeschikbaar() {
  try {
    const test = '__pt_test__';
    window.localStorage.setItem(test, '1');
    window.localStorage.removeItem(test);
    return true;
  } catch {
    return false;
  }
}

/**
 * Leest de opgeslagen staat.
 * Levert altijd { data, melding } — data is gegarandeerd bruikbaar.
 */
export function laadProject() {
  const startdata = maakStartdata();

  if (!opslagBeschikbaar()) {
    if (geheugenOpslag) {
      return { data: geheugenOpslag, melding: null, opslagWerkt: false };
    }
    return {
      data: startdata,
      opslagWerkt: false,
      melding: {
        soort: 'waarschuwing',
        tekst:
          'Deze browser laat geen lokale opslag toe (bijvoorbeeld in een privévenster). De hub werkt gewoon, maar je wijzigingen verdwijnen zodra je de pagina sluit. Gebruik Instellingen → Exporteren om je werk veilig te stellen.',
      },
    };
  }

  let ruweTekst = null;
  try {
    ruweTekst = window.localStorage.getItem(OPSLAG_SLEUTEL);
  } catch {
    ruweTekst = null;
  }

  if (!ruweTekst) {
    return { data: startdata, melding: null, opslagWerkt: true };
  }

  let ontleed = null;
  try {
    ontleed = JSON.parse(ruweTekst);
  } catch {
    /* Kapotte JSON: bewaar het origineel zodat er niets verloren gaat. */
    try {
      window.localStorage.setItem(OPSLAG_BACKUP_SLEUTEL, ruweTekst);
      window.localStorage.removeItem(OPSLAG_SLEUTEL);
    } catch {
      /* niets te doen */
    }
    return {
      data: startdata,
      opslagWerkt: true,
      melding: {
        soort: 'gevaar',
        tekst:
          'De opgeslagen gegevens waren beschadigd en konden niet gelezen worden. De hub is teruggezet naar de startgegevens uit de projectbestanden. De beschadigde versie is bewaard onder de sleutel "planeterrella-hub-kapotte-data" in de browseropslag.',
      },
    };
  }

  const data = normaliseerProject(ontleed, startdata);

  /* Was er echt iets mis met de structuur? Dan melden we dat, want dan is er
     mogelijk iets weggevallen bij het repareren. */
  const telVoor = telItems(ontleed);
  const telNa = telItems(data);
  if (telVoor > 0 && telNa < telVoor) {
    return {
      data,
      opslagWerkt: true,
      melding: {
        soort: 'waarschuwing',
        tekst: `Bij het inlezen zijn ${telVoor - telNa} onbruikbare items overgeslagen. De rest van je gegevens is intact.`,
      },
    };
  }

  return { data, melding: null, opslagWerkt: true };
}

function telItems(obj) {
  if (!obj || typeof obj !== 'object') return 0;
  const velden = [
    'taken', 'eisen', 'bronnen', 'onderzoeken',
    'onderdelen', 'documenten', 'beslissingen', 'risicos',
  ];
  return velden.reduce((som, veld) => som + (Array.isArray(obj[veld]) ? obj[veld].length : 0), 0);
}

/**
 * Slaat de staat op. Levert null bij succes, of een foutmelding.
 */
export function bewaarProject(data) {
  if (!opslagBeschikbaar()) {
    geheugenOpslag = data;
    return null;
  }
  try {
    window.localStorage.setItem(OPSLAG_SLEUTEL, JSON.stringify(data));
    return null;
  } catch (fout) {
    const vol =
      fout &&
      (fout.name === 'QuotaExceededError' ||
        fout.name === 'NS_ERROR_DOM_QUOTA_REACHED' ||
        fout.code === 22);
    return vol
      ? 'De browseropslag is vol. Verwijder oude items of exporteer je gegevens en begin met een schone hub.'
      : 'Opslaan is niet gelukt. Exporteer je gegevens via Instellingen om ze niet kwijt te raken.';
  }
}

export function wisProject() {
  try {
    window.localStorage.removeItem(OPSLAG_SLEUTEL);
  } catch {
    /* niets te doen */
  }
  geheugenOpslag = null;
}

/** Haalt een eerder bewaarde beschadigde versie op, zodat je er nog bij kunt. */
export function leesKapotteBackup() {
  try {
    return window.localStorage.getItem(OPSLAG_BACKUP_SLEUTEL);
  } catch {
    return null;
  }
}

export function wisKapotteBackup() {
  try {
    window.localStorage.removeItem(OPSLAG_BACKUP_SLEUTEL);
  } catch {
    /* niets te doen */
  }
}
