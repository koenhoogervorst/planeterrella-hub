/** Controleert en repareert ingelezen data.
 *
 *  Waarom dit bestaat: opgeslagen data kan uit een oudere versie komen, met de
 *  hand aangepast zijn, of half geschreven zijn omdat de browser afsloot. In
 *  plaats van de app te laten crashen repareren we wat we kunnen en gooien we
 *  alleen weg wat echt onbruikbaar is.
 */

import {
  STATUS_IDS,
  PRIORITEIT_IDS,
  BRONTYPES,
  DATA_VERSIE,
} from '../data/constanten.js';
import { isDatum } from './datums.js';
import { nieuwId } from './id.js';

const OK_ONDERZOEK_STATUS = ['open', 'bezig', 'deels', 'beantwoord'];
const OK_EIS_TYPE = ['functioneel', 'realisatie', 'veiligheid', 'overig'];
const OK_EIS_STATUS = ['open', 'bezig', 'behaald', 'herbeoordelen', 'vervallen'];
const OK_EIS_PRIO = ['must', 'should', 'could'];
const OK_ONDERDEEL_STATUS = ['idee', 'ontwerp', 'inkoop', 'bouw', 'test', 'klaar'];
const OK_ONTWERP_STATUS = ['geen', 'schets', 'cad', 'definitief'];
const OK_ERNST = ['laag', 'middel', 'hoog', 'kritiek'];
const OK_RISICO_STATUS = ['open', 'bezig', 'beheerst', 'opgelost'];
const OK_BETROUWBAARHEID = ['hoog', 'middel', 'laag', 'onbekend'];
const OK_HERKOMST = ['bestand', 'voorstel', 'eigen'];

function tekst(waarde, standaard = '') {
  if (typeof waarde === 'string') return waarde;
  if (typeof waarde === 'number' && Number.isFinite(waarde)) return String(waarde);
  return standaard;
}

function keuze(waarde, toegestaan, standaard) {
  return toegestaan.includes(waarde) ? waarde : standaard;
}

function datum(waarde) {
  return isDatum(waarde) ? waarde : '';
}

function lijstVanTekst(waarde) {
  if (!Array.isArray(waarde)) return [];
  return waarde.filter((v) => typeof v === 'string' && v.length > 0);
}

function tijdstempel(waarde) {
  if (typeof waarde === 'string' && !Number.isNaN(Date.parse(waarde))) return waarde;
  return new Date().toISOString();
}

/** Zorgt dat elk item een id heeft en dat ids uniek zijn binnen de lijst. */
function metUniekeIds(lijst, voorvoegsel) {
  const gezien = new Set();
  return lijst.map((item) => {
    let id = tekst(item.id);
    if (!id || gezien.has(id)) id = nieuwId(voorvoegsel);
    gezien.add(id);
    return { ...item, id };
  });
}

function alsLijst(waarde) {
  return Array.isArray(waarde) ? waarde.filter((i) => i && typeof i === 'object') : [];
}

/* ---------------- Per collectie ---------------- */

function leesTeamlid(l, index) {
  return {
    id: tekst(l.id) || `lid${index + 1}`,
    naam: tekst(l.naam) || `Teamlid ${index + 1}`,
    rol: tekst(l.rol),
    kleur: /^#[0-9a-fA-F]{3,8}$/.test(tekst(l.kleur)) ? l.kleur : '#3b5bdb',
    notities: tekst(l.notities),
  };
}

function leesFase(f, index) {
  return {
    id: tekst(f.id) || `f${index + 1}`,
    naam: tekst(f.naam) || `Fase ${index + 1}`,
    start: datum(f.start),
    eind: datum(f.eind),
  };
}

function leesCategorie(c, index) {
  return {
    id: tekst(c.id) || `cat${index + 1}`,
    naam: tekst(c.naam) || `Categorie ${index + 1}`,
    kleur: /^#[0-9a-fA-F]{3,8}$/.test(tekst(c.kleur)) ? c.kleur : '#868e96',
  };
}

function leesTaak(t) {
  const status = keuze(t.status, STATUS_IDS, 'todo');
  return {
    id: tekst(t.id),
    titel: tekst(t.titel) || 'Naamloze taak',
    beschrijving: tekst(t.beschrijving),
    categorie: tekst(t.categorie),
    fase: tekst(t.fase),
    toegewezenAan: tekst(t.toegewezenAan),
    prioriteit: keuze(t.prioriteit, PRIORITEIT_IDS, 'normaal'),
    status,
    deadline: datum(t.deadline),
    afhankelijkVan: lijstVanTekst(t.afhankelijkVan),
    herkomst: keuze(t.herkomst, OK_HERKOMST, 'eigen'),
    bron: tekst(t.bron),
    notities: tekst(t.notities),
    aangemaakt: tijdstempel(t.aangemaakt),
    gewijzigd: tijdstempel(t.gewijzigd),
    afgerondOp: status === 'klaar' ? datum(t.afgerondOp) : '',
  };
}

function leesBron(b) {
  return {
    id: tekst(b.id),
    titel: tekst(b.titel) || 'Naamloze bron',
    auteur: tekst(b.auteur),
    organisatie: tekst(b.organisatie),
    url: tekst(b.url),
    datum: datum(b.datum),
    type: BRONTYPES.includes(b.type) ? b.type : 'Overige',
    onderwerp: tekst(b.onderwerp),
    samenvatting: tekst(b.samenvatting),
    betrouwbaarheid: keuze(b.betrouwbaarheid, OK_BETROUWBAARHEID, 'onbekend'),
    notities: tekst(b.notities),
    gebruiktVoor: tekst(b.gebruiktVoor),
    herkomst: keuze(b.herkomst, OK_HERKOMST, 'eigen'),
  };
}

function leesOnderzoek(o) {
  return {
    id: tekst(o.id),
    vraag: tekst(o.vraag) || 'Naamloze onderzoeksvraag',
    waarom: tekst(o.waarom),
    huidigeKennis: tekst(o.huidigeKennis),
    resultaten: tekst(o.resultaten),
    conclusie: tekst(o.conclusie),
    vervolgvragen: tekst(o.vervolgvragen),
    status: keuze(o.status, OK_ONDERZOEK_STATUS, 'open'),
    categorie: tekst(o.categorie),
    eigenaar: tekst(o.eigenaar),
    bronIds: lijstVanTekst(o.bronIds),
    herkomst: keuze(o.herkomst, OK_HERKOMST, 'eigen'),
  };
}

function leesEis(e) {
  return {
    id: tekst(e.id),
    code: tekst(e.code),
    omschrijving: tekst(e.omschrijving) || 'Naamloze eis',
    type: keuze(e.type, OK_EIS_TYPE, 'overig'),
    prioriteit: keuze(e.prioriteit, OK_EIS_PRIO, 'should'),
    status: keuze(e.status, OK_EIS_STATUS, 'open'),
    verificatie: tekst(e.verificatie),
    eigenaar: tekst(e.eigenaar),
    deadline: datum(e.deadline),
    bron: tekst(e.bron),
    notitie: tekst(e.notitie),
    herkomst: keuze(e.herkomst, OK_HERKOMST, 'eigen'),
  };
}

function leesOnderdeel(o) {
  return {
    id: tekst(o.id),
    naam: tekst(o.naam) || 'Naamloos onderdeel',
    omschrijving: tekst(o.omschrijving),
    categorie: tekst(o.categorie),
    status: keuze(o.status, OK_ONDERDEEL_STATUS, 'idee'),
    ontwerpstatus: keuze(o.ontwerpstatus, OK_ONTWERP_STATUS, 'geen'),
    verantwoordelijke: tekst(o.verantwoordelijke),
    eisIds: lijstVanTekst(o.eisIds),
    bronIds: lijstVanTekst(o.bronIds),
    bestanden: tekst(o.bestanden),
    notities: tekst(o.notities),
    herkomst: keuze(o.herkomst, OK_HERKOMST, 'eigen'),
  };
}

function leesDocument(d) {
  const k = d.koppelingen && typeof d.koppelingen === 'object' ? d.koppelingen : {};
  return {
    id: tekst(d.id),
    titel: tekst(d.titel) || 'Naamloos document',
    soort: tekst(d.soort) || 'Overige',
    pad: tekst(d.pad),
    datum: datum(d.datum),
    omschrijving: tekst(d.omschrijving),
    koppelingen: {
      taken: lijstVanTekst(k.taken),
      bronnen: lijstVanTekst(k.bronnen),
      onderzoeken: lijstVanTekst(k.onderzoeken),
      onderdelen: lijstVanTekst(k.onderdelen),
    },
    notities: tekst(d.notities),
    herkomst: keuze(d.herkomst, OK_HERKOMST, 'eigen'),
  };
}

function leesBeslissing(b) {
  return {
    id: tekst(b.id),
    datum: datum(b.datum),
    beslissing: tekst(b.beslissing) || 'Naamloze beslissing',
    reden: tekst(b.reden),
    betrokkenen: lijstVanTekst(b.betrokkenen),
    gevolgen: tekst(b.gevolgen),
    bronIds: lijstVanTekst(b.bronIds),
    notitie: tekst(b.notitie),
    herkomst: keuze(b.herkomst, OK_HERKOMST, 'eigen'),
  };
}

function leesRisico(r) {
  return {
    id: tekst(r.id),
    titel: tekst(r.titel) || 'Naamloos risico',
    omschrijving: tekst(r.omschrijving),
    datum: datum(r.datum),
    ernst: keuze(r.ernst, OK_ERNST, 'middel'),
    verantwoordelijke: tekst(r.verantwoordelijke),
    status: keuze(r.status, OK_RISICO_STATUS, 'open'),
    categorie: tekst(r.categorie),
    oplossing: tekst(r.oplossing),
    notities: tekst(r.notities),
    herkomst: keuze(r.herkomst, OK_HERKOMST, 'eigen'),
  };
}

function leesActiviteit(a) {
  return {
    id: tekst(a.id),
    tijd: tijdstempel(a.tijd),
    tekst: tekst(a.tekst),
    soort: tekst(a.soort) || 'wijziging',
  };
}

/* ---------------- Hoofdfunctie ---------------- */

/**
 * Maakt van willekeurige ingelezen data een geldige projectstaat.
 * Ontbrekende collecties worden overgenomen uit de meegegeven startdata,
 * zodat de app nooit met een half-lege staat opstart.
 */
export function normaliseerProject(ruw, startdata) {
  const bron = ruw && typeof ruw === 'object' ? ruw : {};
  const basis = startdata;

  const teamledenRuw = alsLijst(bron.teamleden);
  const fasesRuw = alsLijst(bron.fases);
  const categorieenRuw = alsLijst(bron.categorieen);

  const teamleden = metUniekeIds(
    (teamledenRuw.length ? teamledenRuw : basis.teamleden).map(leesTeamlid),
    'lid',
  );
  const fases = metUniekeIds((fasesRuw.length ? fasesRuw : basis.fases).map(leesFase), 'fase');
  const categorieen = metUniekeIds(
    (categorieenRuw.length ? categorieenRuw : basis.categorieen).map(leesCategorie),
    'cat',
  );

  const taken = metUniekeIds(alsLijst(bron.taken).map(leesTaak), 'taak');
  const eisen = metUniekeIds(alsLijst(bron.eisen).map(leesEis), 'eis');
  const bronnen = metUniekeIds(alsLijst(bron.bronnen).map(leesBron), 'bron');
  const onderzoeken = metUniekeIds(alsLijst(bron.onderzoeken).map(leesOnderzoek), 'onz');
  const onderdelen = metUniekeIds(alsLijst(bron.onderdelen).map(leesOnderdeel), 'ond');
  const documenten = metUniekeIds(alsLijst(bron.documenten).map(leesDocument), 'doc');
  const beslissingen = metUniekeIds(alsLijst(bron.beslissingen).map(leesBeslissing), 'bes');
  const risicos = metUniekeIds(alsLijst(bron.risicos).map(leesRisico), 'ris');
  const activiteit = metUniekeIds(alsLijst(bron.activiteit).map(leesActiviteit), 'act').slice(0, 80);

  /* Verwijs nooit naar iets dat niet (meer) bestaat. */
  const taakIds = new Set(taken.map((t) => t.id));
  const lidIds = new Set(teamleden.map((l) => l.id));
  const faseIds = new Set(fases.map((f) => f.id));
  const catIds = new Set(categorieen.map((c) => c.id));
  const bronIds = new Set(bronnen.map((b) => b.id));
  const eisIds = new Set(eisen.map((e) => e.id));

  const schoneTaken = taken.map((t) => ({
    ...t,
    toegewezenAan: lidIds.has(t.toegewezenAan) ? t.toegewezenAan : '',
    fase: faseIds.has(t.fase) ? t.fase : '',
    categorie: catIds.has(t.categorie) ? t.categorie : '',
    afhankelijkVan: t.afhankelijkVan.filter((id) => id !== t.id && taakIds.has(id)),
  }));

  const projectRuw = bron.project && typeof bron.project === 'object' ? bron.project : {};

  return {
    versie: DATA_VERSIE,
    project: {
      naam: tekst(projectRuw.naam) || basis.project.naam,
      ondertitel: tekst(projectRuw.ondertitel, basis.project.ondertitel),
      school: tekst(projectRuw.school, basis.project.school),
      opleiding: tekst(projectRuw.opleiding, basis.project.opleiding),
      kerntaak: tekst(projectRuw.kerntaak, basis.project.kerntaak),
      klas: tekst(projectRuw.klas, basis.project.klas),
      opdrachtgever: tekst(projectRuw.opdrachtgever, basis.project.opdrachtgever),
      startdatum: datum(projectRuw.startdatum) || basis.project.startdatum,
      einddatum: datum(projectRuw.einddatum) || basis.project.einddatum,
    },
    teamleden,
    fases,
    categorieen,
    taken: schoneTaken,
    eisen: eisen.map((e) => ({ ...e, eigenaar: lidIds.has(e.eigenaar) ? e.eigenaar : '' })),
    bronnen,
    onderzoeken: onderzoeken.map((o) => ({
      ...o,
      eigenaar: lidIds.has(o.eigenaar) ? o.eigenaar : '',
      categorie: catIds.has(o.categorie) ? o.categorie : '',
      bronIds: o.bronIds.filter((id) => bronIds.has(id)),
    })),
    onderdelen: onderdelen.map((o) => ({
      ...o,
      verantwoordelijke: lidIds.has(o.verantwoordelijke) ? o.verantwoordelijke : '',
      categorie: catIds.has(o.categorie) ? o.categorie : '',
      eisIds: o.eisIds.filter((id) => eisIds.has(id)),
      bronIds: o.bronIds.filter((id) => bronIds.has(id)),
    })),
    documenten,
    beslissingen: beslissingen.map((b) => ({
      ...b,
      betrokkenen: b.betrokkenen.filter((id) => lidIds.has(id)),
      bronIds: b.bronIds.filter((id) => bronIds.has(id)),
    })),
    risicos: risicos.map((r) => ({
      ...r,
      verantwoordelijke: lidIds.has(r.verantwoordelijke) ? r.verantwoordelijke : '',
      categorie: catIds.has(r.categorie) ? r.categorie : '',
    })),
    activiteit,
  };
}
