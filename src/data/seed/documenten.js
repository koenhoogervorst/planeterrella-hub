/* Documentatie-index.
 *
 * Deze hub slaat geen bestanden op — hij houdt bij wélke bestanden er zijn,
 * waar ze staan en waar ze bij horen. De paden hieronder zijn de plekken waar
 * de bestanden stonden tijdens de projectanalyse. Klopt een pad niet meer,
 * pas het dan aan op de Documentatie-pagina.
 */

export const documenten = [
  {
    id: 'd01',
    titel: 'Plan van aanpak — Noorderlichtopstelling',
    soort: 'Verslag',
    pad: 'Downloads/milestone 1/Plan van aanpak - Noorderlichtopstelling.docx',
    datum: '2026-09-08',
    omschrijving:
      'Het hoofddocument: inleiding en opdracht, betrokken partijen, projectgrenzen met het SMART-pakket van eisen, organisatie, functieblokschema, mindmap, vooronderzoek en planning.',
    koppelingen: { taken: ['t13'], bronnen: ['b16'], onderzoeken: [], onderdelen: ['od12'] },
    notities: 'Bevat drie afbeeldingen: een foto, het MEI-schema op hoofdniveau en het uitgewerkte functieblokschema.',
    herkomst: 'bestand',
  },
  {
    id: 'd02',
    titel: 'Strokenplanning Noorderlichtopstelling',
    soort: 'Planning',
    pad: 'Downloads/milestone 1/Planning_Noorderlicht_Opstelling.xlsx',
    datum: '2026-09-02',
    omschrijving:
      'Dag-voor-dag planning van 2 september tot 10 november 2026 met acht fases, plus tabbladen voor weekplanning per maand en afwezigheid van projectleden.',
    koppelingen: { taken: ['t15'], bronnen: ['b17'], onderzoeken: [], onderdelen: ['od12'] },
    notities: 'De tabbladen "Afwezigheid projectleden" en de weekplanningen zijn nog leeg.',
    herkomst: 'bestand',
  },
  {
    id: 'd03',
    titel: 'Mindmap Noorderlicht Opstelling (Planeterrella)',
    soort: 'Onderzoeksdocument',
    pad: 'Downloads/Noorderlicht Opstelling – Planeterrella.pdf',
    datum: '2026-09-01',
    omschrijving:
      'Mindmap met project en doel, team, functionele eisen F1–F8, realisatie-eisen R1–R8, open onderzoeksvragen, werking, theorie, veiligheid, onderdelen, formules, planning en referentieprojecten.',
    koppelingen: { taken: ['t05'], bronnen: ['b19'], onderzoeken: [], onderdelen: [] },
    notities: 'Bevat een oudere versie van het pakket van eisen — zie de eisen V1 t/m V5.',
    herkomst: 'bestand',
  },
  {
    id: 'd04',
    titel: 'Veiligheidsnormen en regelgeving Terrella-vacuümkamer',
    soort: 'Onderzoeksdocument',
    pad: 'Downloads/veiligheidsnormenterrella.pdf',
    datum: '2026-09-08',
    omschrijving:
      'Nederlands/EU-kader: spanningsclassificatie, Laagspanningsrichtlijn, Machinerichtlijn en -verordening, Richtlijn Drukapparatuur, EMC-richtlijn, relevante normen en acht actiepunten.',
    koppelingen: { taken: ['t09', 't23', 't56', 't57', 't62'], bronnen: ['b18'], onderzoeken: ['o11'], onderdelen: ['od6'] },
    notities:
      'Gaat uit van 1500–2000 V en een externe klant — dat wijkt af van het plan van aanpak. Zie risico r19.',
    herkomst: 'bestand',
  },
  {
    id: 'd05',
    titel: 'Parts, Hazards & Formulas — aurora vacuum chamber',
    soort: 'Onderzoeksdocument',
    pad: 'Downloads/Aurora_Chamber_Parts_and_Formulas.pdf',
    datum: '2026-08-31',
    omschrijving:
      'Onderdelenlijst in bouwvolgorde met per onderdeel een specificatie en de reden waarom je het nodig hebt: kamer, vacuümsysteem, elektrisch, planeten, gas en extra veiligheid.',
    koppelingen: { taken: ['t07'], bronnen: ['b21'], onderzoeken: ['o03'], onderdelen: ['od1', 'od7'] },
    notities: '',
    herkomst: 'bestand',
  },
  {
    id: 'd06',
    titel: 'Werknotities groepsproject (handgeschreven)',
    soort: 'Onderzoeksdocument',
    pad: 'Downloads/milestone 1/groeps project planeterra (1).pdf',
    datum: '2026-09-01',
    omschrijving:
      'Losse notities over praktijk en theorie: bal met axiale offset, 23,5° kanteling, aluminium 7075 versus koper, gaskeuze (argon, helium, neon), "kamer moet minstens op 0.1 mbar of lager" en "alles moet als ferro metalen".',
    koppelingen: { taken: [], bronnen: [], onderzoeken: ['o09', 'o10', 'o12'], onderdelen: ['od2'] },
    notities: 'Slecht leesbaar en deels onaf. Werk deze notities uit voordat er conclusies uit worden overgenomen.',
    herkomst: 'bestand',
  },
  {
    id: 'd07',
    titel: 'Inventor-assemblage vacuümkamer',
    soort: 'Tekening / CAD',
    pad: 'Documents/Inventor/Terrella/Terrella_Chamber.iam',
    datum: '2026-09-08',
    omschrijving:
      'Assemblage met 23 onderdelen: frame, hoekstijlen, glaspanelen (lang, kort en met poort), trekstangen, boven- en onderplaat, pompaansluiting, leidingen, bol, ophangstaaf, elektrode, doorvoerbus, isolator en statiefdelen.',
    koppelingen: { taken: ['t21', 't26', 't29'], bronnen: [], onderzoeken: ['o01'], onderdelen: ['od1', 'od4', 'od9'] },
    notities: 'Meest recente CAD-werk. Er staat ook een map OldVersions met eerdere versies.',
    herkomst: 'bestand',
  },
  {
    id: 'd08',
    titel: 'Renders vacuümkamer (vier ontwerpvarianten)',
    soort: 'Foto / render',
    pad: 'Documents/Inventor/Terrella/terrella*.png',
    datum: '2026-09-08',
    omschrijving:
      'Renders van vier varianten in verschillende aanzichten: vooraanzicht, isometrisch, museumopstelling en video-opstelling.',
    koppelingen: { taken: ['t21'], bronnen: [], onderzoeken: [], onderdelen: ['od1'] },
    notities: 'Handig bewijsmateriaal voor werkproces P4-K4-W2 (schetsen en ontwerpen).',
    herkomst: 'bestand',
  },
  {
    id: 'd09',
    titel: 'Bolmodellen en kostenoverzicht',
    soort: 'Tekening / CAD',
    pad: 'Downloads/milestone 1/stls/',
    datum: '2026-09-09',
    omschrijving:
      'STL- en STEP-bestanden van de kogelhelften (rond 83 mm, versies v2 en v3), de ringmagneetvarianten en het originele topontwerp, plus het kostenoverzicht kosten kogel.ods.',
    koppelingen: { taken: ['t24', 't25', 't32', 't33'], bronnen: [], onderzoeken: ['o06'], onderdelen: ['od2', 'od3'] },
    notities: 'Begroting in kosten kogel.ods komt uit op € 951,95 voor bol plus magneten.',
    herkomst: 'bestand',
  },
  {
    id: 'd10',
    titel: 'Script elektrode-assemblage (Fusion 360)',
    soort: 'Berekening',
    pad: 'Downloads/terrella_electrode_assembly.py',
    datum: '2026-09-07',
    omschrijving:
      'Python-script dat de twee kogelhelften importeert en een elektrode-assemblage opbouwt: ophang-/HV-staaf door de polaire boring, isolerende afstandhouder en montageflens.',
    koppelingen: { taken: ['t26'], bronnen: [], onderzoeken: [], onderdelen: ['od4'] },
    notities:
      'Het script gaat uit van een boring van ca. Ø10 mm en een staaf van 9,8 mm, en waarschuwt zelf dat die maten in CAD gecontroleerd moeten worden.',
    herkomst: 'bestand',
  },
  {
    id: 'd11',
    titel: 'Componentmodellen elektrisch systeem',
    soort: 'Tekening / CAD',
    pad: 'Downloads/planeterrella-cad/',
    datum: '2026-09-07',
    omschrijving:
      'Zes gedownloade componenten met 3MF-model en specificatiebestand: TE SHV-coaxdoorvoer 51494-2, Phoenix Contact ST 2,5 doorvoerklem, Lapp Skintop ST-M M20 wartel (IP69K), Schneider Acti9 iC60N 2P C16A installatieautomaat, MEAN WELL HDR-60-5 DIN-railvoeding en een Finder 80-serie tijdrelais.',
    koppelingen: { taken: ['t36'], bronnen: [], onderzoeken: [], onderdelen: ['od4', 'od5', 'od6', 'od11'] },
    notities:
      'Dit zijn keuzes voor de besturings- en installatiekant. De hoogspanningsbron zelf, de ballastweerstand en de HV-probe ontbreken nog.',
    herkomst: 'bestand',
  },
  {
    id: 'd12',
    titel: 'Examenportfolio P4-K4 — Ontwerpt prototypen',
    soort: 'Schooldocument',
    pad: 'Downloads/milestone 1/25897  RIM niv 4  P4-K4  - BLE Examenportfolio.docx',
    datum: '2024-11-28',
    omschrijving:
      'Het in te vullen examenportfolio met per werkproces (W1 t/m W4) de beoordelingsvormen, criteria en welk soort bewijs je moet aanleveren.',
    koppelingen: { taken: ['t39', 't64', 't65', 't66', 't67'], bronnen: ['b20'], onderzoeken: [], onderdelen: ['od12'] },
    notities: 'Startdatum, inleverdatum, ROC-begeleider en beoordelaars zijn nog niet ingevuld.',
    herkomst: 'bestand',
  },
  {
    id: 'd13',
    titel: 'Rubric Bedrijfsopdracht MEO',
    soort: 'Schooldocument',
    pad: 'Downloads/milestone 1/Rubric Bedrijfsopdracht MEO.pdf',
    datum: '2026-09-02',
    omschrijving:
      'Beoordelingsrubric met competenties op vier niveaus (Starter, In Ontwikkeling, Op Niveau, Gevorderd): vakdeskundigheid toepassen, plannen en organiseren, beslissen en activiteiten initiëren, analyseren en meer.',
    koppelingen: { taken: [], bronnen: [], onderzoeken: [], onderdelen: ['od12'] },
    notities:
      '"Plannen en organiseren" wordt apart beoordeeld — deze projecthub bijhouden helpt daar direct bij.',
    herkomst: 'bestand',
  },
  {
    id: 'd14',
    titel: 'Informatie voor de student — Bewijslastexamen (BLE)',
    soort: 'Schooldocument',
    pad: 'Downloads/milestone 1/Informatie voor de student BLE OVG.pdf',
    datum: '2024-11-28',
    omschrijving:
      'Uitleg over het bewijslastexamen, de fases, de beoordelingsvormen en het examenportfolio. Beoordeling met waardering: onvoldoende, voldoende of goed.',
    koppelingen: { taken: ['t67'], bronnen: ['b20'], onderzoeken: [], onderdelen: ['od12'] },
    notities:
      'Het portfolio wordt minimaal één keer met de ROC-begeleider besproken; daarna kan het nog aangepast worden vóór indiening.',
    herkomst: 'bestand',
  },
  {
    id: 'd15',
    titel: 'Format Pakket van Eisen (schoolsjabloon)',
    soort: 'Schooldocument',
    pad: 'Downloads/milestone 1/Format PvE (1) (2).xlsx',
    datum: '2026-09-02',
    omschrijving:
      'Leeg sjabloon met de kolommen Nr, Prioriteit, Eis, Verificatiemethode en Behaald, plus voorbeeldeisen ter illustratie.',
    koppelingen: { taken: ['t11', 't12'], bronnen: [], onderzoeken: [], onderdelen: ['od12'] },
    notities: 'De structuur van dit sjabloon is aangehouden in het pakket van eisen in het plan van aanpak.',
    herkomst: 'bestand',
  },
];
