/** Vaste keuzelijsten. Eén bron van waarheid voor de hele app. */

export const OPSLAG_SLEUTEL = 'planeterrella-hub';
export const OPSLAG_BACKUP_SLEUTEL = 'planeterrella-hub-kapotte-data';
export const DATA_VERSIE = 1;

export const STATUSSEN = [
  { id: 'todo', naam: 'Nog niet begonnen', kort: 'Niet begonnen' },
  { id: 'bezig', naam: 'Bezig', kort: 'Bezig' },
  { id: 'wacht', naam: 'Wacht op iemand/iets', kort: 'Wacht' },
  { id: 'klaar', naam: 'Afgerond', kort: 'Afgerond' },
];

export const STATUS_IDS = STATUSSEN.map((s) => s.id);

export const PRIORITEITEN = [
  { id: 'laag', naam: 'Laag', gewicht: 1 },
  { id: 'normaal', naam: 'Normaal', gewicht: 2 },
  { id: 'hoog', naam: 'Hoog', gewicht: 3 },
  { id: 'kritiek', naam: 'Kritiek', gewicht: 4 },
];

export const PRIORITEIT_IDS = PRIORITEITEN.map((p) => p.id);

/** Prioriteiten die op het dashboard als "hoge prioriteit" tellen. */
export const HOGE_PRIORITEITEN = ['hoog', 'kritiek'];

export const BRONTYPES = [
  'Website',
  'Wetenschappelijk artikel',
  'Boek',
  'Handleiding',
  'Video',
  'PDF',
  'Schooldocument',
  'Eigen onderzoek',
  'Norm of regelgeving',
  'Leverancier / datasheet',
  'Overige',
];

export const BETROUWBAARHEDEN = [
  { id: 'hoog', naam: 'Hoog' },
  { id: 'middel', naam: 'Middel' },
  { id: 'laag', naam: 'Laag' },
  { id: 'onbekend', naam: 'Onbekend' },
];

export const ONDERZOEK_STATUSSEN = [
  { id: 'open', naam: 'Nog niet onderzocht' },
  { id: 'bezig', naam: 'Bezig met onderzoeken' },
  { id: 'deels', naam: 'Deels beantwoord' },
  { id: 'beantwoord', naam: 'Beantwoord' },
];

export const EIS_TYPES = [
  { id: 'functioneel', naam: 'Functionele eis' },
  { id: 'realisatie', naam: 'Realisatie-eis' },
  { id: 'veiligheid', naam: 'Veiligheidseis' },
  { id: 'overig', naam: 'Overige eis' },
];

export const EIS_STATUSSEN = [
  { id: 'open', naam: 'Open' },
  { id: 'bezig', naam: 'In uitvoering' },
  { id: 'behaald', naam: 'Behaald' },
  { id: 'herbeoordelen', naam: 'Te herbeoordelen' },
  { id: 'vervallen', naam: 'Vervallen' },
];

export const EIS_PRIORITEITEN = [
  { id: 'must', naam: 'Must' },
  { id: 'should', naam: 'Should' },
  { id: 'could', naam: 'Could' },
];

export const ONDERDEEL_STATUSSEN = [
  { id: 'idee', naam: 'Idee' },
  { id: 'ontwerp', naam: 'In ontwerp' },
  { id: 'inkoop', naam: 'In inkoop' },
  { id: 'bouw', naam: 'In aanbouw' },
  { id: 'test', naam: 'In test' },
  { id: 'klaar', naam: 'Klaar' },
];

export const ONTWERP_STATUSSEN = [
  { id: 'geen', naam: 'Nog geen ontwerp' },
  { id: 'schets', naam: 'Schets' },
  { id: 'cad', naam: 'CAD-model' },
  { id: 'definitief', naam: 'Definitief' },
];

export const ERNSTEN = [
  { id: 'laag', naam: 'Laag', gewicht: 1 },
  { id: 'middel', naam: 'Middel', gewicht: 2 },
  { id: 'hoog', naam: 'Hoog', gewicht: 3 },
  { id: 'kritiek', naam: 'Kritiek', gewicht: 4 },
];

export const RISICO_STATUSSEN = [
  { id: 'open', naam: 'Open' },
  { id: 'bezig', naam: 'Wordt aan gewerkt' },
  { id: 'beheerst', naam: 'Beheerst' },
  { id: 'opgelost', naam: 'Opgelost' },
];

export const DOCUMENT_SOORTEN = [
  'Ontwerpdocument',
  'Onderzoeksdocument',
  'Tekening / CAD',
  'Foto / render',
  'Handleiding',
  'Verslag',
  'Presentatie',
  'Planning',
  'Schooldocument',
  'Berekening',
  'Overige',
];

/** Waar een item vandaan komt. Belangrijk: we willen kunnen zien wat uit de
 *  projectbestanden komt en wat een voorstel is dat nog bevestigd moet worden. */
export const HERKOMSTEN = [
  {
    id: 'bestand',
    naam: 'Uit projectbestanden',
    kort: 'Bestand',
    uitleg: 'Komt letterlijk uit een van jullie eigen bestanden.',
  },
  {
    id: 'voorstel',
    naam: 'Voorgesteld',
    kort: 'Voorstel',
    uitleg:
      'Logische aanvulling die nog niet in jullie bestanden staat. Controleer hem en pas hem aan.',
  },
  {
    id: 'eigen',
    naam: 'Zelf toegevoegd',
    kort: 'Eigen',
    uitleg: 'Dit item is in de hub zelf toegevoegd.',
  },
];

export const TEAM_KLEUREN = ['#3b5bdb', '#2b8a3e', '#c2810b', '#9c36b5', '#0b7285', '#c92a2a'];

export function zoekOp(lijst, id) {
  return lijst.find((item) => item.id === id) || null;
}
