/* Projectgegevens, team, fases en categorieën.
 *
 * Alles hieronder komt uit de projectbestanden, tenzij anders vermeld:
 *  - "Plan van aanpak - Noorderlichtopstelling.docx" (8 september 2026)
 *  - "Planning_Noorderlicht_Opstelling.xlsx" (strokenplanning)
 *  - "Noorderlicht Opstelling - Planeterrella.pdf" (mindmap)
 *  - "veiligheidsnormenterrella.pdf"
 *  - "25897 RIM niv 4 P4-K4 - BLE Examenportfolio.docx"
 */

export const project = {
  naam: 'Noorderlichtopstelling (Planeterrella)',
  ondertitel: 'Bestaande Planeterrella verbeteren: groter, steviger en verrijdbaar',
  school: 'Leidse Instrumentmakers School (LiS), Leiden',
  opleiding: 'Researchinstrumentmaker, mbo niveau 4 (Productietechniek, crebo 25897)',
  kerntaak: 'P4-K4 — Ontwerpt prototypen',
  klas: '26P1-H9',
  opdrachtgever: 'LiS zelf (zie beslissing B5 — nog te bevestigen)',
  startdatum: '2026-09-02',
  einddatum: '2026-11-10',
};

/* Het plan van aanpak noemt drie projectleden (Koen, Davey, Daniel).
 * De hub is ingericht voor vier plekken. Teamlid 4 staat leeg omdat er in de
 * projectbestanden geen vierde persoon voorkomt — vul zelf de echte namen in
 * op de Team-pagina. De rolomschrijvingen komen wél uit het plan van aanpak. */
export const teamleden = [
  {
    id: 'lid1',
    naam: 'Teamlid 1',
    rol: 'Elektronica en hoogspanning, contact met de opdrachtgever, documentatie',
    kleur: '#3b5bdb',
    notities:
      'Rol uit het plan van aanpak (hoofdstuk 2): ontwerpt, bouwt en test het elektrische deel — instelbare hoogspanningsvoeding, stroombegrenzing, hoogspanningsdoorvoer, aarding en de bediening van gas, druk en spanning. Regelt daarnaast de communicatie met de opdrachtgever en houdt de documentatie bij. Eigenaar van eisen F4, F5 en F6.',
  },
  {
    id: 'lid2',
    naam: 'Teamlid 2',
    rol: 'Natuurkundige theorie en onderzoek, vacuümkamer',
    kleur: '#2b8a3e',
    notities:
      'Rol uit het plan van aanpak (hoofdstuk 2): zoekt alle natuurkundige informatie op, zet dat om in documentatie en gebruikt het om de opstelling zo goed mogelijk te maken. Eigenaar van eis F7 (kamerdiameter).',
  },
  {
    id: 'lid3',
    naam: 'Teamlid 3',
    rol: 'Productie en assemblage, bol en magneetophanging',
    kleur: '#c2810b',
    notities:
      'Rol uit het plan van aanpak (hoofdstuk 2): houdt overzicht over wat er gemaakt en samengebouwd moet worden, is leidend in onderzoek. Eigenaar van eis F8 (magneethoek 23,5°).',
  },
  {
    id: 'lid4',
    naam: 'Teamlid 4',
    rol: 'Rol nog te bepalen',
    kleur: '#9c36b5',
    notities:
      'LET OP: in de projectbestanden staan drie projectleden. Deze vierde plek is toegevoegd omdat de hub voor vier personen is ingericht. De taken die hier nu aan hangen zijn voorstellen — verdeel ze zelf opnieuw zodra de echte rolverdeling duidelijk is.',
  },
];

/* Fasedata komen uit de strokenplanning in Planning_Noorderlicht_Opstelling.xlsx.
 * Die data sluiten aan op de SMART-deadlines in het pakket van eisen.
 * De tabel in hoofdstuk 6 van het plan van aanpak noemt ándere data —
 * zie risico R10 en taak "Tegenstrijdige einddata oplossen". */
export const fases = [
  { id: 'f1', naam: 'Oriëntatie & onderzoek', start: '2026-09-02', eind: '2026-09-15' },
  { id: 'f2', naam: 'Pakket van eisen', start: '2026-09-09', eind: '2026-09-22' },
  { id: 'f3', naam: 'Ontwerp', start: '2026-09-16', eind: '2026-09-29' },
  { id: 'f4', naam: 'Inkoop & voorbereiding', start: '2026-09-23', eind: '2026-10-06' },
  { id: 'f5', naam: 'Bouw & assemblage', start: '2026-09-30', eind: '2026-10-20' },
  { id: 'f6', naam: 'Testen', start: '2026-10-14', eind: '2026-10-27' },
  { id: 'f7', naam: 'Transporttest', start: '2026-10-21', eind: '2026-11-03' },
  { id: 'f8', naam: 'Documentatie & oplevering', start: '2026-10-28', eind: '2026-11-10' },
];

/* Categorieën volgen de onderwerpen die daadwerkelijk in de bestanden voorkomen. */
export const categorieen = [
  { id: 'planning', naam: 'Projectplanning', kleur: '#5c7cfa' },
  { id: 'onderzoek', naam: 'Onderzoek', kleur: '#7950f2' },
  { id: 'ontwerp', naam: 'Ontwerp', kleur: '#1c7ed6' },
  { id: 'vacuum', naam: 'Vacuümsysteem', kleur: '#0b7285' },
  { id: 'elektro', naam: 'Elektronica & hoogspanning', kleur: '#e8590c' },
  { id: 'magneet', naam: 'Magnetisch systeem (bol)', kleur: '#c2255c' },
  { id: 'constructie', naam: 'Constructie & trolley', kleur: '#5f3dc4' },
  { id: 'veiligheid', naam: 'Veiligheid & normen', kleur: '#c92a2a' },
  { id: 'inkoop', naam: 'Materialen & inkoop', kleur: '#2b8a3e' },
  { id: 'testen', naam: 'Testen', kleur: '#087f5b' },
  { id: 'documentatie', naam: 'Documentatie & school', kleur: '#868e96' },
];
