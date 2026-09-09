/** Synchronisatie met de gedeelde database (Supabase).
 *
 *  Hoe dit werkt:
 *
 *  1. Bij het opstarten haalt `haalAllesOp` alle rijen op en zet die om naar
 *     dezelfde vorm die de app al gebruikt (project, taken, bronnen, ...).
 *  2. Na elke wijziging vergelijkt `bepaalWijzigingen` de vorige en de nieuwe
 *     staat. Dat gaat op objectverwijzing: de reducer maakt alleen een nieuw
 *     object voor items die echt veranderd zijn, dus items die hetzelfde bleven
 *     herken je aan `===`. Daardoor sturen we alleen wat er echt anders is,
 *     inclusief de opruimacties die bij een verwijdering horen.
 *  3. `luisterNaarWijzigingen` abonneert op de tabel, zodat wat een teamgenoot
 *     aanpast direct in jouw scherm verschijnt.
 */

import { createClient } from '@supabase/supabase-js';
import { SUPABASE_URL, SUPABASE_SLEUTEL, TABEL, heeftGedeeldeDatabase } from '../data/supabase-config.js';

/* De collecties die als losse rijen in de database staan. */
export const COLLECTIES = [
  'teamleden',
  'fases',
  'categorieen',
  'taken',
  'eisen',
  'bronnen',
  'onderzoeken',
  'onderdelen',
  'documenten',
  'beslissingen',
  'risicos',
  'activiteit',
];

/* De projectgegevens zijn één object, geen lijst. Die krijgt een vaste rij. */
const PROJECT_COLLECTIE = 'project';
const PROJECT_ID = 'hoofd';

export const client = heeftGedeeldeDatabase
  ? createClient(SUPABASE_URL, SUPABASE_SLEUTEL, {
      auth: { persistSession: false },
      realtime: { params: { eventsPerSecond: 20 } },
    })
  : null;

/* ---------------- Lezen ---------------- */

/**
 * Haalt alles op en levert { data, leeg } terug.
 * `leeg` betekent: er staat nog niets in de database.
 */
export async function haalAllesOp(startdata) {
  if (!client) throw new Error('Geen databaseverbinding ingesteld.');

  const rijen = [];
  const perKeer = 1000;
  let vanaf = 0;

  /* In stukjes ophalen, anders loop je tegen de standaardlimiet aan. */
  for (;;) {
    const { data, error } = await client
      .from(TABEL)
      .select('collectie, id, data')
      .range(vanaf, vanaf + perKeer - 1);
    if (error) throw error;
    rijen.push(...data);
    if (data.length < perKeer) break;
    vanaf += perKeer;
  }

  if (rijen.length === 0) return { data: startdata, leeg: true };

  const staat = { versie: startdata.versie, project: startdata.project };
  COLLECTIES.forEach((c) => {
    staat[c] = [];
  });

  rijen.forEach((rij) => {
    if (rij.collectie === PROJECT_COLLECTIE) {
      staat.project = { ...startdata.project, ...rij.data };
      return;
    }
    if (!staat[rij.collectie]) return; /* onbekende collectie: overslaan */
    staat[rij.collectie].push(rij.data);
  });

  /* De activiteitenlijst nieuwste eerst; de rest laat de app zelf sorteren. */
  staat.activiteit.sort((a, b) => String(b.tijd).localeCompare(String(a.tijd)));

  return { data: staat, leeg: false };
}

/* ---------------- Verschillen bepalen ---------------- */

function alsKaart(lijst) {
  const kaart = new Map();
  (lijst || []).forEach((item) => {
    if (item && item.id) kaart.set(item.id, item);
  });
  return kaart;
}

/**
 * Vergelijkt twee staten en levert wat er naar de database moet.
 * Levert { upserts: [{collectie, id, data}], deletes: [{collectie, id}] }.
 */
export function bepaalWijzigingen(vorige, nieuwe) {
  const upserts = [];
  const deletes = [];

  if (!vorige) {
    /* Geen vergelijkingspunt: stuur alles. */
    COLLECTIES.forEach((c) => {
      (nieuwe[c] || []).forEach((item) => upserts.push({ collectie: c, id: item.id, data: item }));
    });
    upserts.push({ collectie: PROJECT_COLLECTIE, id: PROJECT_ID, data: nieuwe.project });
    return { upserts, deletes };
  }

  COLLECTIES.forEach((c) => {
    const oud = alsKaart(vorige[c]);
    const nieuw = alsKaart(nieuwe[c]);

    nieuw.forEach((item, id) => {
      /* Objectverwijzing is genoeg: de reducer vervangt alleen gewijzigde items. */
      if (oud.get(id) !== item) upserts.push({ collectie: c, id, data: item });
    });
    oud.forEach((_item, id) => {
      if (!nieuw.has(id)) deletes.push({ collectie: c, id });
    });
  });

  if (vorige.project !== nieuwe.project) {
    upserts.push({ collectie: PROJECT_COLLECTIE, id: PROJECT_ID, data: nieuwe.project });
  }

  return { upserts, deletes };
}

/**
 * Past één binnengekomen wijziging toe op een staat en levert een nieuwe staat.
 * Wordt op twee plekken gebruikt: om het scherm bij te werken, en om de
 * vergelijkingsbasis mee te laten lopen — anders zou een wijziging van een
 * teamgenoot jouw nog-niet-verstuurde wijziging overschrijven.
 */
export function pasRemoteToe(staat, { soort, collectie, id, data }) {
  if (!staat) return staat;

  if (collectie === 'project') {
    return { ...staat, project: { ...staat.project, ...(data || {}) } };
  }

  const lijst = staat[collectie];
  if (!Array.isArray(lijst)) return staat;

  if (soort === 'verwijderd') {
    if (!lijst.some((i) => i.id === id)) return staat;
    return { ...staat, [collectie]: lijst.filter((i) => i.id !== id) };
  }

  if (!data) return staat;
  const bestaat = lijst.some((i) => i.id === id);
  const nieuweLijst = bestaat ? lijst.map((i) => (i.id === id ? data : i)) : [data, ...lijst];
  return { ...staat, [collectie]: nieuweLijst };
}

/* ---------------- Schrijven ---------------- */

/** Stuurt de wijzigingen naar de database. Gooit een fout als het misging. */
export async function stuurWijzigingen({ upserts, deletes }, doorWie = '') {
  if (!client) throw new Error('Geen databaseverbinding ingesteld.');
  if (upserts.length === 0 && deletes.length === 0) return;

  if (upserts.length > 0) {
    /* In blokken, zodat één grote wijziging het verzoek niet laat klappen. */
    for (let i = 0; i < upserts.length; i += 200) {
      const blok = upserts.slice(i, i + 200).map((u) => ({
        collectie: u.collectie,
        id: u.id,
        data: u.data,
        gewijzigd_door: doorWie || null,
      }));
      const { error } = await client.from(TABEL).upsert(blok, { onConflict: 'collectie,id' });
      if (error) throw error;
    }
  }

  for (const d of deletes) {
    const { error } = await client.from(TABEL).delete().eq('collectie', d.collectie).eq('id', d.id);
    if (error) throw error;
  }
}

/** Zet de hele database in één keer op deze staat (import of terugzetten). */
export async function vervangAllesInDatabase(staat, doorWie = '') {
  if (!client) throw new Error('Geen databaseverbinding ingesteld.');
  const { error } = await client.from(TABEL).delete().neq('id', '__bestaat_niet__');
  if (error) throw error;
  await stuurWijzigingen(bepaalWijzigingen(null, staat), doorWie);
}

/* ---------------- Meeluisteren ---------------- */

/**
 * Abonneert op wijzigingen van anderen.
 * `opWijziging({ soort, collectie, id, data })` wordt aangeroepen per wijziging,
 * `opStatus(status)` bij verbinden en verbreken.
 * Levert een functie om het abonnement te stoppen.
 */
export function luisterNaarWijzigingen(opWijziging, opStatus) {
  if (!client) return () => {};

  const kanaal = client
    .channel('projecthub-items')
    .on('postgres_changes', { event: '*', schema: 'public', table: TABEL }, (bericht) => {
      const rij = bericht.eventType === 'DELETE' ? bericht.old : bericht.new;
      if (!rij || !rij.collectie) return;
      opWijziging({
        soort: bericht.eventType === 'DELETE' ? 'verwijderd' : 'gewijzigd',
        collectie: rij.collectie === PROJECT_COLLECTIE ? 'project' : rij.collectie,
        id: rij.id,
        data: rij.data,
      });
    })
    .subscribe((status) => {
      if (status === 'SUBSCRIBED') opStatus('verbonden');
      else if (status === 'CHANNEL_ERROR' || status === 'TIMED_OUT') opStatus('fout');
      else if (status === 'CLOSED') opStatus('verbroken');
    });

  return () => {
    client.removeChannel(kanaal);
  };
}
