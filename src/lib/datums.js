/** Datumhulp. Alle datums in de app zijn ISO-strings: "JJJJ-MM-DD".
 *  We rekenen bewust met lokale middernacht, niet met UTC, zodat er geen
 *  dag verschuift door de tijdzone. */

const MAANDEN = [
  'januari', 'februari', 'maart', 'april', 'mei', 'juni',
  'juli', 'augustus', 'september', 'oktober', 'november', 'december',
];

const MAANDEN_KORT = [
  'jan', 'feb', 'mrt', 'apr', 'mei', 'jun',
  'jul', 'aug', 'sep', 'okt', 'nov', 'dec',
];

const DAGEN_KORT = ['ma', 'di', 'wo', 'do', 'vr', 'za', 'zo'];

export const DAGLABELS = DAGEN_KORT;

/** Is dit een bruikbare "JJJJ-MM-DD"-string? */
export function isDatum(waarde) {
  if (typeof waarde !== 'string') return false;
  if (!/^\d{4}-\d{2}-\d{2}$/.test(waarde)) return false;
  const d = naarDate(waarde);
  return d !== null && isoVan(d) === waarde;
}

/** "JJJJ-MM-DD" -> Date op lokale middernacht. Ongeldig -> null. */
export function naarDate(iso) {
  if (typeof iso !== 'string' || !/^\d{4}-\d{2}-\d{2}$/.test(iso)) return null;
  const [j, m, d] = iso.split('-').map(Number);
  const datum = new Date(j, m - 1, d);
  if (Number.isNaN(datum.getTime())) return null;
  return datum;
}

/** Date -> "JJJJ-MM-DD" (lokaal). */
function isoVan(datum) {
  const j = datum.getFullYear();
  const m = String(datum.getMonth() + 1).padStart(2, '0');
  const d = String(datum.getDate()).padStart(2, '0');
  return `${j}-${m}-${d}`;
}

export function vandaagIso() {
  return isoVan(new Date());
}

/** Aantal hele dagen tussen twee ISO-datums (b - a). null bij ongeldige invoer. */
export function dagenTussen(a, b) {
  const da = naarDate(a);
  const db = naarDate(b);
  if (!da || !db) return null;
  return Math.round((db.getTime() - da.getTime()) / 86400000);
}

/** Dagen vanaf vandaag tot de datum. Negatief = in het verleden. */
export function dagenTotVandaag(iso) {
  return dagenTussen(vandaagIso(), iso);
}

/** "2026-09-29" -> "29 sep 2026". Leeg/ongeldig -> vervangtekst. */
export function toonDatum(iso, vervanging = '—') {
  const d = naarDate(iso);
  if (!d) return vervanging;
  return `${d.getDate()} ${MAANDEN_KORT[d.getMonth()]} ${d.getFullYear()}`;
}

export function toonDatumLang(iso, vervanging = '—') {
  const d = naarDate(iso);
  if (!d) return vervanging;
  return `${d.getDate()} ${MAANDEN[d.getMonth()]} ${d.getFullYear()}`;
}

export function toonMaandJaar(datum) {
  return `${MAANDEN[datum.getMonth()]} ${datum.getFullYear()}`;
}

/** Menselijke omschrijving van een deadline t.o.v. vandaag. */
export function deadlineTekst(iso) {
  const dagen = dagenTotVandaag(iso);
  if (dagen === null) return '';
  if (dagen === 0) return 'vandaag';
  if (dagen === 1) return 'morgen';
  if (dagen === -1) return 'gisteren';
  if (dagen < 0) return `${Math.abs(dagen)} dagen te laat`;
  return `over ${dagen} dagen`;
}

/** Urgentie van een deadline: 'verlopen' | 'vandaag' | 'week' | 'later' | null */
export function deadlineUrgentie(iso) {
  const dagen = dagenTotVandaag(iso);
  if (dagen === null) return null;
  if (dagen < 0) return 'verlopen';
  if (dagen === 0) return 'vandaag';
  if (dagen <= 7) return 'week';
  return 'later';
}

/** Datum van de maandag in dezelfde week (ma=start). */
function startVanWeek(datum) {
  const d = new Date(datum.getFullYear(), datum.getMonth(), datum.getDate());
  const dag = (d.getDay() + 6) % 7;
  d.setDate(d.getDate() - dag);
  return d;
}

/** Raster van 42 dagen (6 weken) rond de gegeven maand, beginnend op maandag. */
export function maandRaster(jaar, maand) {
  const eerste = new Date(jaar, maand, 1);
  const start = startVanWeek(eerste);
  const dagen = [];
  for (let i = 0; i < 42; i += 1) {
    const d = new Date(start.getFullYear(), start.getMonth(), start.getDate() + i);
    dagen.push({
      iso: isoVan(d),
      dagnummer: d.getDate(),
      buitenMaand: d.getMonth() !== maand,
    });
  }
  return dagen;
}

/** Sorteerhulp: lege datums altijd achteraan. */
export function vergelijkDatums(a, b) {
  const va = isDatum(a) ? a : '';
  const vb = isDatum(b) ? b : '';
  if (!va && !vb) return 0;
  if (!va) return 1;
  if (!vb) return -1;
  return va < vb ? -1 : va > vb ? 1 : 0;
}
