/* Onderzoeksvragen.
 * o01–o07: de openstaande onderzoeksvragen uit het plan van aanpak §1.
 * o08–o10: extra vragen uit de mindmap.
 * o11–o12: voorgestelde aanvullingen op basis van tegenstrijdigheden in de bestanden.
 *
 * "huidigeKennis" bevat alleen wat er echt in jullie bestanden staat.
 * "resultaten" en "conclusie" zijn bewust leeg waar het onderzoek nog moet gebeuren.
 */

export const onderzoeken = [
  {
    id: 'o01',
    vraag: 'Welk materiaal is het beste voor de vacuümkamer?',
    waarom:
      'De kamer moet transparant zijn én 1 bar drukverschil aankunnen. De materiaalkeuze bepaalt de wanddikte, de kosten en de implosieveiligheid.',
    huidigeKennis:
      'Eis R1 zegt: transparant acrylaat of glas, wanddikte minimaal 10 mm. Het veiligheidsnormen-document spreekt over gelaagd gehard glas en een hoge veiligheidsfactor, en zegt dat je de implosieveiligheid zelf moet onderbouwen met de opgave van de glasleverancier. De referentieprojecten gebruikten plexiglas (IUT Toulouse) en glas (Birkeland).',
    resultaten: '',
    conclusie: '',
    vervolgvragen:
      'Welke veiligheidsfactor houden we aan? Levert de leverancier de sterktegegevens die we nodig hebben voor de berekening? Acrylaat is beter tegen scherven maar krast sneller — weegt dat op tegen glas?',
    status: 'bezig',
    categorie: 'vacuum',
    eigenaar: 'lid2',
    bronIds: ['b16', 'b18', 'b05'],
    herkomst: 'bestand',
  },
  {
    id: 'o02',
    vraag: 'Welk gas geeft het beste kleureffect?',
    waarom: 'De kleur van het noorderlicht bepaalt hoe herkenbaar en indrukwekkend de demonstratie is.',
    huidigeKennis:
      'Uit de theorie in §5.2.2: aangeslagen gasdeeltjes vallen terug naar hun grondtoestand en zenden licht uit op golflengtes die bij dat gas horen. Stikstof geeft blauw, rood en paars; zuurstof groen en rood; neon oranjerood; argon paars/violet. Met gewone lucht krijg je een bleke wit-paarse gloed. Bijvullen met een specifiek gas bij een lage, geregelde druk maakt de kleuren veel feller. Een werknotitie noemt argon, helium en neon als kandidaten.',
    resultaten: '',
    conclusie: '',
    vervolgvragen:
      'Welke gassen zijn op school beschikbaar? Wat kost een kleine fles met naaldventiel? Testen we meerdere gassen of kiezen we er één?',
    status: 'open',
    categorie: 'testen',
    eigenaar: 'lid2',
    bronIds: ['b16', 'b19'],
    herkomst: 'bestand',
  },
  {
    id: 'o03',
    vraag: 'Welke vacuümdruk werkt het beste en wat voor pomp hebben we nodig?',
    waarom:
      'De gloed ontstaat alleen in een smal drukvenster. Zonder de juiste pomp haal je dat venster niet en werkt de hele opstelling niet.',
    huidigeKennis:
      'Uit de onderdelenlijst: een tweetraps rotatiepomp haalt ca. 10⁻² tot 10⁻³ mbar, plus een Pirani- of thermokoppelmeter. Lilensten werkte bij ca. 10 Pa; IUT Toulouse had een pomp tot 10⁻² Pa. De ideale gaswet (p·V = N·k·T) is de formule om het pompvermogen bij het kamervolume te bepalen. Vuistregel uit het plan van aanpak: 1 mbar = 100 Pa = 0,75 Torr.',
    resultaten: '',
    conclusie: '',
    vervolgvragen:
      'Wat wordt precies het kamervolume? Kunnen we een pomp lenen uit de schoolwerkplaats? Hoe lang mag afpompen duren?',
    status: 'open',
    categorie: 'vacuum',
    eigenaar: 'lid2',
    bronIds: ['b16', 'b02', 'b05', 'b21'],
    herkomst: 'bestand',
  },
  {
    id: 'o04',
    vraag: 'Wat is de beste afstand tussen de anode en de kathode?',
    waarom:
      'De wet van Paschen zegt dat de doorslagspanning afhangt van het product p·d. De elektrodeafstand bepaalt dus mede of de ontlading überhaupt ontsteekt.',
    huidigeKennis:
      'Voor lucht ligt het minimum van de doorslagspanning rond 327 V bij p·d ≈ 0,567 Torr·cm, met A ≈ 15 (cm·Torr)⁻¹, B ≈ 365 V·cm⁻¹·Torr⁻¹ en γ ≈ 10⁻². De onderdelenlijst noemt een verstelbare steunarm voor de kathode, zodat je de elektrode onder vacuüm kunt verplaatsen.',
    resultaten: '',
    conclusie: '',
    vervolgvragen:
      'Willen we de afstand echt verstelbaar maken tijdens bedrijf? Dat was eis F4 in de mindmap maar staat niet meer in het SMART-PvE. IUT Toulouse kreeg het bewegen van het elektronenkanon onder vacuüm niet werkend.',
    status: 'open',
    categorie: 'elektro',
    eigenaar: 'lid2',
    bronIds: ['b16', 'b19', 'b05'],
    herkomst: 'bestand',
  },
  {
    id: 'o05',
    vraag: 'Welke spanning en stroom geven het mooiste plasma?',
    waarom: 'Te weinig spanning en er is geen ontlading; te veel stroom en de gloeiontlading slaat om in een boog.',
    huidigeKennis:
      'Birkeland en Lilensten houden minimaal 300 V aan, meestal 1000 V, met een stroom van 0,1 tot 1,0 mA. Eis F4 zet het bereik op 300 V tot 2 kV met begrenzing op maximaal 1,0 mA via een ballastweerstand van 100 kΩ tot enkele MΩ. Bij die waarden blijft het vermogen (P = V · I) ruim onder 10 W.',
    resultaten: '',
    conclusie: '',
    vervolgvragen:
      'Welke ballastweerstand kiezen we precies? Het veiligheidsnormen-document noemt 1500–2000 V ontsteking die terugzakt naar ~400 V — klopt dat met wat wij gaan bouwen?',
    status: 'open',
    categorie: 'elektro',
    eigenaar: 'lid1',
    bronIds: ['b16', 'b02', 'b18'],
    herkomst: 'bestand',
  },
  {
    id: 'o06',
    vraag: 'Welke magneten kunnen we het beste gebruiken?',
    waarom:
      'Het magneetveld stuurt de geladen deeltjes naar de polen. Zonder sterk genoeg veld krijg je een vage wolk in plaats van scherpe ringen.',
    huidigeKennis:
      'De onderdelenlijst noemt neodymium-magneten met ca. 0,5 T aan het oppervlak. De gyrostraalformule r_L = (m · v⊥) / (|q| · B) beschrijft hoe strak de deeltjes om de veldlijnen spiraliseren. In het kostenoverzicht staan vijf maten ringmagneten begroot: Ø75/49, Ø60/20, Ø40/22, Ø30/12 en Ø24/12 mm.',
    resultaten:
      'Er is al gerekend met ringmagneten in plaats van een blokmagneet: er bestaan STL-bestanden "kogel new design ring magnet bottom" en "kogel now design ring magnet top".',
    conclusie: '',
    vervolgvragen:
      'Welke combinatie van ringmagneten geeft 0,5 T aan het booloppervlak? Hoe verhoudt de gekozen stapeling zich tot de 50 N-trekproef uit eis R3?',
    status: 'bezig',
    categorie: 'magneet',
    eigenaar: 'lid3',
    bronIds: ['b16', 'b21'],
    herkomst: 'bestand',
  },
  {
    id: 'o07',
    vraag: 'Hoe groot kunnen we de Planeterrella maken zonder dat hij te zwaar of te lastig te vervoeren wordt?',
    waarom:
      'Eis F7 wil een grotere kamer, eis F2 wil dat één persoon hem binnen 10 minuten over 50 m verplaatst. Die twee eisen trekken aan elkaar.',
    huidigeKennis:
      'Referentiematen: Birkelands terrella was 88 × 88 × 45 cm en woog met statief 374 kg — veel te zwaar. Lilensten gebruikte 50 liter / 50 cm doorsnede. Eis F7 stelt minimaal 400 mm inwendig.',
    resultaten: '',
    conclusie: '',
    vervolgvragen:
      'Wat is het maximale gewicht dat één persoon veilig over 50 m kan rijden? Welke wielen en welk zwaartepunt heeft de trolley nodig?',
    status: 'open',
    categorie: 'constructie',
    eigenaar: 'lid3',
    bronIds: ['b16', 'b02'],
    herkomst: 'bestand',
  },
  {
    id: 'o08',
    vraag: 'Hoe maken we de opstelling veilig transporteerbaar?',
    waarom:
      'Eis F3 zegt dat er na de transportrit geen schade en geen losgeraakte onderdelen mogen zijn, en dat de kamer opnieuw de doeldruk moet halen.',
    huidigeKennis:
      'De mindmap noemde ook een aparte transportdoos (realisatie-eis R5). Kwetsbare onderdelen zijn het glas en de elektronica. De herhaalde druktest na transport laat zien of er onzichtbare lekkage is ontstaan.',
    resultaten: '',
    conclusie: '',
    vervolgvragen: 'Losse transportdoos of vaste bescherming op de trolley? Moeten de glasplaten tijdens transport ontlast worden?',
    status: 'open',
    categorie: 'constructie',
    eigenaar: 'lid3',
    bronIds: ['b16', 'b19'],
    herkomst: 'bestand',
  },
  {
    id: 'o09',
    vraag: 'Welk materiaal gebruiken we voor de bol: aluminium 7075 of koper?',
    waarom: 'De bol is de elektrode én de drager van het magneetveld. Het materiaal bepaalt gedrag en bewerkbaarheid.',
    huidigeKennis:
      'Een handgeschreven werknotitie zegt: "alu 7075 of koper — alu 7075 is beter, kan beter geleiden en betere ionenimplantatie". De onderdelenlijst in het plan van aanpak noemt aluminium bollen van 5 tot 10 cm.',
    resultaten: '',
    conclusie: '',
    vervolgvragen:
      'De onderbouwing in de notitie is nog niet gecontroleerd: koper heeft juist een hogere elektrische geleidbaarheid dan aluminium 7075. Er kunnen goede redenen zijn om tóch aluminium te kiezen (gewicht, bewerkbaarheid, prijs, niet-magnetisch) — schrijf de echte reden op voordat dit in het eindverslag komt.',
    status: 'deels',
    categorie: 'magneet',
    eigenaar: 'lid3',
    bronIds: ['b16'],
    herkomst: 'bestand',
  },
  {
    id: 'o10',
    vraag: 'Moeten alle onderdelen non-ferro zijn?',
    waarom: 'Ferromagnetische onderdelen vervormen het magneetveld en kunnen de plasmaringen verstoren.',
    huidigeKennis:
      'Een werknotitie zegt kort: "alles moet als ferro metalen" — waarschijnlijk bedoeld als "alles behalve ferro-metalen", maar dat staat er niet letterlijk. In dezelfde notitie staat ook "kamer moet minstens op 0.1 mbar of lager".',
    resultaten: '',
    conclusie: '',
    vervolgvragen:
      'Wat bedoelde de schrijver precies? Geldt dit voor de hele opstelling of alleen voor onderdelen binnen de kamer? Leg dit vast als een eis zodra het duidelijk is.',
    status: 'open',
    categorie: 'ontwerp',
    eigenaar: 'lid3',
    bronIds: [],
    herkomst: 'bestand',
  },
  {
    id: 'o11',
    vraag: 'Welke CE- en conformiteitsroute geldt bij oplevering aan de opdrachtgever?',
    waarom:
      'Als de overdracht telt als "in de handel brengen", horen daar een risicobeoordeling, technisch dossier, gebruiksinstructie en conformiteitsverklaring bij.',
    huidigeKennis:
      'Het veiligheidsnormen-document concludeert dat overdracht aan een klant in beginsel als in de handel brengen geldt, óók bij een prototype en óók gratis. Het excitatiecircuit valt buiten de Laagspanningsrichtlijn. De vacuümkamer valt buiten de PED. De EMC-richtlijn geldt sowieso. Vóór 20 januari 2027 geldt de Machinerichtlijn 2006/42/EG.',
    resultaten:
      'Er ligt al een oriëntatie met acht concrete actiepunten. Het document zegt er zelf bij dat het geen juridisch advies is.',
    conclusie: '',
    vervolgvragen:
      'Belangrijke complicatie: het plan van aanpak zegt dat LiS zélf de opdrachtgever is en dat er geen externe partij is. Als de opstelling binnen de school blijft, is er misschien helemaal geen sprake van in de handel brengen. Leg dit voor aan de praktijkbegeleider.',
    status: 'deels',
    categorie: 'veiligheid',
    eigenaar: 'lid1',
    bronIds: ['b18', 'b12', 'b13', 'b14'],
    herkomst: 'bestand',
  },
  {
    id: 'o12',
    vraag: 'Wat wordt onze definitieve doeldruk?',
    waarom:
      'Zonder één vastgelegde waarde kun je de pomp niet kiezen, de test niet ontwerpen en de eis niet afvinken.',
    huidigeKennis:
      'De bestanden noemen vier verschillende waarden: "ongeveer 0,2 mbar" (inleiding en eis F3), "bij 10 pascal" (eis F1, = 0,1 mbar), "een paar pascal" (§5.2.2) en "0.1 mbar of lager" (werknotitie). Lilensten werkte bij ca. 10 Pa.',
    resultaten: '',
    conclusie: '',
    vervolgvragen:
      'Kies één waarde, pas het plan van aanpak aan en maak er een eigen genummerde eis van (nu staat de druk alleen verstopt in de tekst van F1 en F3).',
    status: 'open',
    categorie: 'vacuum',
    eigenaar: 'lid2',
    bronIds: ['b16', 'b02'],
    herkomst: 'voorstel',
  },
];
