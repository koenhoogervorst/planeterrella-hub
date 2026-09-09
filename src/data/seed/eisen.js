/* Pakket van eisen.
 * F1–F8 en R1–R4 zijn overgenomen uit het SMART-pakket van eisen in het
 * plan van aanpak (hoofdstuk 3). De kolom "Behaald" was daar bij alle eisen
 * nog leeg, dus alle statussen staan hier op open of in uitvoering.
 *
 * V1–V5 komen uit de oudere mindmap-versie van het PvE en zijn in de
 * SMART-versie verdwenen. Ze staan hier op "Te herbeoordelen" zodat je
 * bewust kunt kiezen of ze terugkomen.
 *
 * VS1–VS5 komen uit veiligheidsnormenterrella.pdf.
 * S1–S6 komen uit het examenportfolio en de rubric.
 */

export const eisen = [
  /* ---------- Functionele eisen (SMART, plan van aanpak §3) ---------- */
  {
    id: 'e-f1',
    code: 'F1',
    type: 'functioneel',
    prioriteit: 'must',
    status: 'open',
    eigenaar: '',
    deadline: '2026-10-27',
    omschrijving:
      'Bij 10 pascal en minimaal 300 V ontstaat zichtbaar plasma in ringen rond de noord- en zuidpool van de bol, in een verduisterde ruimte met het blote oog te zien en op foto vast te leggen.',
    verificatie:
      'Visuele test tijdens werking, met foto van de ringen. De opdrachtgever beoordeelt of het effect herkenbaar is als noorderlicht.',
    bron: 'Plan van aanpak §3, functionele eisen',
    notitie:
      'Toelichting uit het PvA: dit is het hoofddoel. De combinatie van lage druk en minimaal 300 V komt uit de wet van Paschen en de specificatie van Birkeland en Lilensten. Eigenaar in het PvA: "Algemeen" — plasma ontstaat pas als vacuüm, magneetveld en elektronica alle drie werken. LET OP: hier staat 10 Pa, elders in hetzelfde document 0,2 mbar (= 20 Pa).',
    herkomst: 'bestand',
  },
  {
    id: 'e-f2',
    code: 'F2',
    type: 'functioneel',
    prioriteit: 'must',
    status: 'open',
    eigenaar: '',
    deadline: '2026-11-03',
    omschrijving:
      'Eén persoon verplaatst de complete opstelling op één trolley over minimaal 50 m binnen het schoolgebouw, zonder de opstelling te demonteren en binnen 10 minuten.',
    verificatie:
      'Praktijktest over een vooraf vastgelegde route van 50 m, uitgevoerd door één teamlid, met de tijd erbij geklokt.',
    bron: 'Plan van aanpak §3, functionele eisen',
    notitie: 'Eigenaar in het PvA: "Algemeen", met Teamlid 1 als uitvoerder van de transporttest.',
    herkomst: 'bestand',
  },
  {
    id: 'e-f3',
    code: 'F3',
    type: 'functioneel',
    prioriteit: 'must',
    status: 'open',
    eigenaar: '',
    deadline: '2026-11-03',
    omschrijving:
      'Na de transportrit van F2 zijn er geen zichtbare beschadigingen en geen losgeraakte onderdelen, en haalt de kamer opnieuw 0,2 mbar.',
    verificatie:
      'Visuele inspectie op schade en losse delen direct na het transport, gevolgd door een herhaalde druktest.',
    bron: 'Plan van aanpak §3, functionele eisen',
    notitie:
      'In het PvA verwijst de verificatietekst naar "een herhaalde druktest volgens F2", maar F2 gaat over transport, niet over druk. Zie taak t18.',
    herkomst: 'bestand',
  },
  {
    id: 'e-f4',
    code: 'F4',
    type: 'functioneel',
    prioriteit: 'should',
    status: 'open',
    eigenaar: 'lid1',
    deadline: '2026-10-20',
    omschrijving:
      'De hoogspanningsvoeding is instelbaar van 300 V tot 2 kV en de stroom is via een ballastweerstand begrensd op maximaal 1,0 mA, zodat de gloeiontlading niet omslaat in een boog.',
    verificatie:
      'Spanning en stroom meten met een hoogspanningsbestendige multimeter op vijf instelpunten tussen 300 V en 2 kV. Bij elk punt blijft de stroom onder 1,0 mA.',
    bron: 'Plan van aanpak §3, functionele eisen',
    notitie: 'Zonder stroombegrenzing slaat een gloeiontlading om in een boog en gaan onderdelen kapot.',
    herkomst: 'bestand',
  },
  {
    id: 'e-f5',
    code: 'F5',
    type: 'functioneel',
    prioriteit: 'must',
    status: 'open',
    eigenaar: 'lid1',
    deadline: '2026-10-20',
    omschrijving:
      'Alle geleidende delen van de behuizing en de voeding zijn geaard met een overgangsweerstand van maximaal 0,5 ohm, en er zijn geen spanningvoerende delen aan te raken als de voeding aanstaat.',
    verificatie:
      'Aardweerstand meten op vier punten van de behuizing. Visuele controle op afgeschermde doorvoeren en kabels.',
    bron: 'Plan van aanpak §3, functionele eisen',
    notitie: 'Bij 300 V tot 2 kV is aanraking levensgevaarlijk.',
    herkomst: 'bestand',
  },
  {
    id: 'e-f6',
    code: 'F6',
    type: 'functioneel',
    prioriteit: 'must',
    status: 'open',
    eigenaar: 'lid1',
    deadline: '2026-10-27',
    omschrijving:
      'De hoogspanningsdoorvoer houdt bij 2 kV het vacuüm vast zonder zichtbare overslag naar de kamerwand of de behuizing, gedurende minimaal 3 minuten aaneengesloten bedrijf.',
    verificatie:
      'Doorvoer 10 minuten op 2 kV zetten bij 0,2 mbar. Drukverloop volgen en in een verduisterde ruimte controleren op overslag.',
    bron: 'Plan van aanpak §3, functionele eisen',
    notitie: 'Slaat de doorvoer over of gaat hij lekken, dan is er geen plasma en loopt het vacuümsysteem schade op.',
    herkomst: 'bestand',
  },
  {
    id: 'e-f7',
    code: 'F7',
    type: 'functioneel',
    prioriteit: 'must',
    status: 'bezig',
    eigenaar: 'lid2',
    deadline: '2026-10-20',
    omschrijving:
      'De vacuümkamer heeft een inwendige diameter van minimaal 400 mm, groter dan de kamer van het huidige model, zodat het plasma beter zichtbaar is voor publiek en opdrachtgever.',
    verificatie: 'Inwendige diameter meten met een rolmaat en vergelijken met de opgemeten diameter van het huidige model.',
    bron: 'Plan van aanpak §3, functionele eisen',
    notitie:
      'De vergelijking met "het huidige model" kan pas als de nulmeting gedaan is (taak t10). Die maat staat nergens in de bestanden.',
    herkomst: 'bestand',
  },
  {
    id: 'e-f8',
    code: 'F8',
    type: 'functioneel',
    prioriteit: 'should',
    status: 'bezig',
    eigenaar: 'lid3',
    deadline: '2026-10-20',
    omschrijving:
      'De magneet in de bol staat onder een hoek van 23,5° ten opzichte van de verticale as, met een afwijking van maximaal 1°, zodat de opstelling zoveel mogelijk lijkt op de werkelijke situatie bij de aarde.',
    verificatie: 'Drie metingen met een digitale hoekmeter tijdens montage; alle metingen liggen binnen 23,5° ± 1°.',
    bron: 'Plan van aanpak §3, functionele eisen',
    notitie: 'Een afwijking van 1° is met een gewone digitale hoekmeter goed te halen.',
    herkomst: 'bestand',
  },

  /* ---------- Realisatie-eisen (SMART, plan van aanpak §3) ---------- */
  {
    id: 'e-r1',
    code: 'R1',
    type: 'realisatie',
    prioriteit: 'must',
    status: 'bezig',
    eigenaar: 'lid2',
    deadline: '2026-09-29',
    omschrijving:
      'De vacuümkamer is van transparant acrylaat of glas met een wanddikte van minimaal 10 mm, zodat de kamer 1 bar drukverschil aankan.',
    verificatie:
      'Materiaalcertificaat en wanddikte controleren bij levering, plus visuele inspectie op krassen en insluitsels.',
    bron: 'Plan van aanpak §3, realisatie-eisen',
    notitie: 'Wens: krasvast en UV-bestendig acrylaat, zodat de kamer bij herhaald gebruik helder blijft.',
    herkomst: 'bestand',
  },
  {
    id: 'e-r2',
    code: 'R2',
    type: 'realisatie',
    prioriteit: 'must',
    status: 'bezig',
    eigenaar: 'lid3',
    deadline: '2026-09-29',
    omschrijving:
      'De bol ("aarde") heeft een diameter van minimaal 80 mm, ruim boven de 50 mm die de opdrachtgever als ondergrens stelt.',
    verificatie: 'Diameter op drie plaatsen meten met een schuifmaat, alle metingen minimaal 80 mm.',
    bron: 'Plan van aanpak §3, realisatie-eisen',
    notitie:
      'Wens: standaard verkrijgbare maat, zodat een vervangende bol binnen twee weken te bestellen is. De STL-bestanden gaan uit van Ø83 mm.',
    herkomst: 'bestand',
  },
  {
    id: 'e-r3',
    code: 'R3',
    type: 'realisatie',
    prioriteit: 'must',
    status: 'bezig',
    eigenaar: 'lid3',
    deadline: '2026-10-20',
    omschrijving:
      'De magneten zitten vast in een zelf ontworpen ophangsysteem dat een trekkracht van minimaal 50 N doorstaat zonder dat de magneet verschuift.',
    verificatie:
      'Visuele controle op de bevestiging plus trekproef met een veerunster tot 50 N, daarna de hoek van F8 opnieuw meten.',
    bron: 'Plan van aanpak §3, realisatie-eisen',
    notitie: 'Wens: ophangsysteem 3D-geprint, zodat een aangepaste versie binnen één dag te printen is.',
    herkomst: 'bestand',
  },
  {
    id: 'e-r4',
    code: 'R4',
    type: 'realisatie',
    prioriteit: 'must',
    status: 'bezig',
    eigenaar: 'lid3',
    deadline: '2026-10-20',
    omschrijving:
      'De bol bestaat uit twee delen die één persoon zonder gereedschap kan openen en weer sluiten, zodat de magneten bereikbaar zijn voor reparatie of vervanging.',
    verificatie: 'Demontagetest: bol openen, magneet nakijken of vervangen en weer sluiten.',
    bron: 'Plan van aanpak §3, realisatie-eisen',
    notitie: 'Wens: een klem- of schroefverbinding die ook na herhaald openen goed blijft sluiten.',
    herkomst: 'bestand',
  },

  /* ---------- Uit de eerdere mindmap-versie, nu te herbeoordelen ---------- */
  {
    id: 'e-v1',
    code: 'V1',
    type: 'veiligheid',
    prioriteit: 'must',
    status: 'herbeoordelen',
    eigenaar: 'lid1',
    deadline: '2026-09-22',
    omschrijving: 'Noodstop voor de hoogspanning.',
    verificatie: 'Nog te bepalen zodra de eis SMART is gemaakt.',
    bron: 'Mindmap: functionele eis F7 én onderdeel onder "Elektrisch systeem"',
    notitie:
      'Stond twee keer in de mindmap, maar komt niet terug in het SMART-pakket van eisen in het plan van aanpak. Beslis of deze eis terugkomt.',
    herkomst: 'bestand',
  },
  {
    id: 'e-v2',
    code: 'V2',
    type: 'functioneel',
    prioriteit: 'should',
    status: 'herbeoordelen',
    eigenaar: 'lid1',
    deadline: '2026-09-22',
    omschrijving: 'De afstand tussen anode en kathode is verstelbaar.',
    verificatie: 'Nog te bepalen.',
    bron: 'Mindmap: functionele eis F4',
    notitie:
      'Verdwenen uit het SMART-PvE, maar staat nog wel als open onderzoeksvraag. De onderdelenlijst noemt een "verstelbare steunarm voor de kathode".',
    herkomst: 'bestand',
  },
  {
    id: 'e-v3',
    code: 'V3',
    type: 'overig',
    prioriteit: 'could',
    status: 'herbeoordelen',
    eigenaar: '',
    deadline: '',
    omschrijving: 'Esthetisch verbeterd ontwerp ten opzichte van het huidige model.',
    verificatie: 'Nog te bepalen — lastig meetbaar te maken.',
    bron: 'Mindmap: functionele eis F8',
    notitie: 'Verdwenen uit het SMART-PvE. Als jullie hem willen houden, maak hem dan meetbaar of schrap hem bewust.',
    herkomst: 'bestand',
  },
  {
    id: 'e-v4',
    code: 'V4',
    type: 'realisatie',
    prioriteit: 'should',
    status: 'herbeoordelen',
    eigenaar: 'lid3',
    deadline: '2026-09-22',
    omschrijving: 'De opstelling past in een transportdoos.',
    verificatie: 'Nog te bepalen.',
    bron: 'Mindmap: realisatie-eis R5',
    notitie:
      'In het SMART-PvE zit transportbescherming alleen impliciet in F3 ("geen zichtbare beschadigingen na transport").',
    herkomst: 'bestand',
  },
  {
    id: 'e-v5',
    code: 'V5',
    type: 'overig',
    prioriteit: 'must',
    status: 'herbeoordelen',
    eigenaar: 'lid1',
    deadline: '2026-09-22',
    omschrijving: 'Het project blijft binnen de beschikbare tijd en middelen.',
    verificatie: 'Nog te bepalen — vraagt om een vastgesteld budget.',
    bron: 'Mindmap: realisatie-eis R8',
    notitie:
      'Er staat nergens in de bestanden een budgetbedrag. De bol alleen al is begroot op € 951,95. Zie taak t20.',
    herkomst: 'bestand',
  },

  /* ---------- Veiligheids- en regelgevingseisen ---------- */
  {
    id: 'e-vs1',
    code: 'VS1',
    type: 'veiligheid',
    prioriteit: 'must',
    status: 'open',
    eigenaar: 'lid1',
    deadline: '2026-10-14',
    omschrijving:
      'Het excitatiecircuit (ca. 1500–2000 V) wordt behandeld als hoogspanning: NEN 3840-vakbekwaamheid, extra isolatie, interlocks en ontladingsvoorzieningen voor eventuele condensatoren.',
    verificatie: 'Vastleggen wie aan het hoogspanningsdeel mag werken en dat laten bevestigen door de begeleider.',
    bron: 'veiligheidsnormenterrella.pdf §1, §7 en §8',
    notitie:
      'De grens ligt bij 1000 V AC / 1500 V DC. Een VOP (Voldoende Onderricht Persoon) mag niet aan het hoogspanningsdeel werken — dat is voorbehouden aan een VP of VOL-HS.',
    herkomst: 'bestand',
  },
  {
    id: 'e-vs2',
    code: 'VS2',
    type: 'veiligheid',
    prioriteit: 'must',
    status: 'open',
    eigenaar: 'lid1',
    deadline: '2026-11-10',
    omschrijving:
      'Bij overdracht aan de opdrachtgever horen een risicobeoordeling volgens ISO 12100, een technisch dossier, gebruiksinstructies en een EU-conformiteitsverklaring, met CE-markering waar van toepassing.',
    verificatie: 'Documentenset compleet en afgetekend vóór oplevering.',
    bron: 'veiligheidsnormenterrella.pdf §3 en §8',
    notitie:
      '"In de handel brengen" geldt óók bij een prototype, óók bij tijdelijke overdracht en óók als het gratis gebeurt. Het document waarschuwt uitdrukkelijk dat dit een oriëntatie is en geen juridisch advies — laat de begeleider meekijken.',
    herkomst: 'bestand',
  },
  {
    id: 'e-vs3',
    code: 'VS3',
    type: 'veiligheid',
    prioriteit: 'must',
    status: 'open',
    eigenaar: 'lid1',
    deadline: '2026-10-27',
    omschrijving: 'De EMC-richtlijn 2014/30/EU is in het testplan opgenomen en er is op EMC getest.',
    verificatie: 'EMC-test in het testplan en de meetresultaten in het eindverslag.',
    bron: 'veiligheidsnormenterrella.pdf §5 en §8',
    notitie: 'Geldt ongeacht spanningsniveau. Een hard geschakelde hoogspanningsexcitatie geeft hoge dV/dt.',
    herkomst: 'bestand',
  },
  {
    id: 'e-vs4',
    code: 'VS4',
    type: 'veiligheid',
    prioriteit: 'must',
    status: 'open',
    eigenaar: 'lid2',
    deadline: '2026-09-29',
    omschrijving:
      'De implosieveiligheid van het glas of acrylaat is onderbouwd met een berekening op basis van de opgaven van de leverancier.',
    verificatie: 'Berekening in het technisch dossier, met de leveranciersgegevens erbij.',
    bron: 'veiligheidsnormenterrella.pdf §4 en §8',
    notitie:
      'De Richtlijn Drukapparatuur (PED) geldt pas boven 0,5 bar overdruk en is dus niet van toepassing op een vacuümkamer. Het risico is implosie, niet explosie — dat moet je met goede-ingenieurspraktijk beheersen.',
    herkomst: 'bestand',
  },
  {
    id: 'e-vs5',
    code: 'VS5',
    type: 'overig',
    prioriteit: 'should',
    status: 'open',
    eigenaar: 'lid1',
    deadline: '2026-09-22',
    omschrijving:
      'Vastgelegd is welk wettelijk kader geldt bij de opleverdatum: vóór 20 januari 2027 de Machinerichtlijn 2006/42/EG, daarna de Machineverordening (EU) 2023/1230.',
    verificatie: 'Vastgelegd in het technisch dossier, bevestigd door de praktijkbegeleider.',
    bron: 'veiligheidsnormenterrella.pdf §3 en §8',
    notitie:
      'De planning eindigt op 10 november 2026, dus ruim vóór 20 januari 2027. Bij uitloop kan dit alsnog gaan spelen.',
    herkomst: 'bestand',
  },

  /* ---------- School- en examenvoorwaarden ---------- */
  {
    id: 'e-s1',
    code: 'S1',
    type: 'overig',
    prioriteit: 'must',
    status: 'open',
    eigenaar: '',
    deadline: '2026-11-10',
    omschrijving:
      'Het examenportfolio voor kerntaak P4-K4 bevat bewijzen voor alle vier de werkprocessen W1 t/m W4, inclusief verklaring authenticiteit en akkoordverklaring van de ROC-begeleider.',
    verificatie: 'Portfolio compleet en afgetekend vóór de inleverdatum.',
    bron: '25897 RIM niv 4 P4-K4 - BLE Examenportfolio.docx',
    notitie:
      'De inleverdatum staat in het formulier maar is nog niet ingevuld. Vraag die op bij de ROC-begeleider en vul hem hier in.',
    herkomst: 'bestand',
  },
  {
    id: 'e-s2',
    code: 'S2',
    type: 'overig',
    prioriteit: 'must',
    status: 'open',
    eigenaar: 'lid1',
    deadline: '2026-11-10',
    omschrijving:
      'De rapportage is volledig en kernachtig opgesteld, met bevindingen en conclusies over de werking van het prototype.',
    verificatie: 'Beoordeling van het product "Rapportage" bij P4-K4-W4.',
    bron: 'Examenportfolio P4-K4-W4',
    notitie: '',
    herkomst: 'bestand',
  },
  {
    id: 'e-s3',
    code: 'S3',
    type: 'overig',
    prioriteit: 'must',
    status: 'open',
    eigenaar: '',
    deadline: '2026-11-10',
    omschrijving:
      'In het eindgesprek worden de bevindingen en conclusies in het Engels duidelijk en concreet in vaktaal gemotiveerd.',
    verificatie: 'Eindgesprek bij P4-K4-W4.',
    bron: 'Examenportfolio P4-K4-W4, eindgesprek "Toelichting op het prototype"',
    notitie: '',
    herkomst: 'bestand',
  },
  {
    id: 'e-s4',
    code: 'S4',
    type: 'overig',
    prioriteit: 'must',
    status: 'open',
    eigenaar: '',
    deadline: '2026-11-10',
    omschrijving:
      'Er is beargumenteerd hoe rekening is gehouden met duurzaamheidsthema’s en circulariteit van materialen, met actueel inzicht.',
    verificatie: 'Eindgesprek "Duurzaamheid" bij P4-K4-W1.',
    bron: 'Examenportfolio P4-K4-W1',
    notitie: 'Dit onderwerp komt verder nergens in de projectbestanden terug.',
    herkomst: 'bestand',
  },
  {
    id: 'e-s5',
    code: 'S5',
    type: 'overig',
    prioriteit: 'must',
    status: 'open',
    eigenaar: 'lid1',
    deadline: '2026-11-10',
    omschrijving: 'Er is een kosten-batenanalyse gemaakt en de risico’s van het ontwerp zijn toegelicht.',
    verificatie: 'Eindgesprek "Ontwerpplan" bij P4-K4-W1.',
    bron: 'Examenportfolio P4-K4-W1',
    notitie: 'Het ontwerpplan moet ook aangeven of het maken ervan rendabel is.',
    herkomst: 'bestand',
  },
  {
    id: 'e-s6',
    code: 'S6',
    type: 'overig',
    prioriteit: 'must',
    status: 'open',
    eigenaar: 'lid3',
    deadline: '2026-11-10',
    omschrijving:
      'Er is onderbouwd welke onderdelen zelf gemaakt worden en welke (deels) worden uitbesteed, met inzicht in de organisatie van de materiaalaanvoer.',
    verificatie: 'Eindgesprek bij P4-K4-W3.',
    bron: 'Examenportfolio P4-K4-W3',
    notitie: '',
    herkomst: 'bestand',
  },
];
