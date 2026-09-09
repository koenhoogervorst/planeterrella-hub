/** Verbinding met de gedeelde database.
 *
 *  De sleutel hieronder is de "publishable" sleutel van Supabase. Die hoort in
 *  de front-end te staan en is bedoeld om openbaar te zijn — hij zit sowieso in
 *  de JavaScript die je browser downloadt. Wat iemand met die sleutel mag doen,
 *  bepalen de regels in de database (RLS), niet de sleutel zelf.
 *
 *  LET OP: die regels staan nu bewust open. Iedereen die de website-URL kent kan
 *  lezen én schrijven. Wil je dat later dichtzetten, dan moeten twee dingen mee
 *  veranderen: de policies op de tabel `items` in Supabase, en een inlogscherm
 *  in deze app.
 */

export const SUPABASE_URL = 'https://ykirkqukiguwnxthcdus.supabase.co';
export const SUPABASE_SLEUTEL = 'sb_publishable_7XSQ3I_l_ZW_emcin5VG6w_a-bJ9Ok8';

/** Naam van de tabel waarin alles staat. */
export const TABEL = 'items';

/** Zolang dit leeg is, werkt de hub gewoon alleen lokaal in je eigen browser. */
export const heeftGedeeldeDatabase = Boolean(SUPABASE_URL && SUPABASE_SLEUTEL);
