/* Beslissingenlogboek.
 *
 * Dit zijn keuzes die uit de projectbestanden af te leiden zijn. Nergens in
 * de bestanden staat een echt besluitenlogboek met datums en argumenten, dus
 * de datums hieronder zijn de datums van de bestanden waarin de keuze voor het
 * eerst zichtbaar is. Controleer ze en vul de echte overwegingen aan.
 */

export const beslissingen = [
  {
    id: 'be1',
    datum: '2026-09-08',
    beslissing: 'De vacuümkamer krijgt een inwendige diameter van minimaal 400 mm.',
    reden:
      'De opdrachtgever wil een grotere opstelling dan het huidige model, zodat publiek en opdrachtgever het plasma beter kunnen zien. Ter vergelijking: Lilensten gebruikte 50 cm doorsnede.',
    betrokkenen: ['lid2'],
    gevolgen:
      'Bepaalt het kamervolume en daarmee de benodigde pompcapaciteit, het gewicht en dus de eisen aan de trolley. Werkt door in eis F7 en in onderzoek o03 en o07.',
    bronIds: ['b16', 'b02'],
    notitie: 'Vastgelegd als eis F7 in het plan van aanpak.',
    herkomst: 'bestand',
  },
  {
    id: 'be2',
    datum: '2026-09-08',
    beslissing: 'De bol wordt minimaal Ø80 mm; de tekeningen gaan uit van Ø83 mm.',
    reden:
      'De opdrachtgever stelt 50 mm als ondergrens. Hoe groter de bol, hoe groter het effect van het magneetveld en hoe beter je het ziet. 80 mm valt binnen het bereik van 5 tot 10 cm uit het vooronderzoek.',
    betrokkenen: ['lid3'],
    gevolgen:
      'Bepaalt de maten van de ringmagneten en de ophanging. De begroting voor de twee kogelhelften komt op € 857,35.',
    bronIds: ['b16'],
    notitie:
      'Eis R2 zegt "minimaal 80 mm"; de STL- en STEP-bestanden heten "rond 83". Leg vast of 83 mm de definitieve maat is.',
    herkomst: 'bestand',
  },
  {
    id: 'be3',
    datum: '2026-09-08',
    beslissing:
      'De hoogspanning wordt instelbaar van 300 V tot 2 kV, met de stroom begrensd op 0,1 tot 1,0 mA via een ballastweerstand.',
    reden:
      'Birkeland en Lilensten houden minimaal 300 V aan. Zonder stroombegrenzing slaat een gloeiontlading om in een boog en gaan onderdelen kapot. Bij deze waarden blijft het vermogen ruim onder 10 W.',
    betrokkenen: ['lid1'],
    gevolgen:
      'Bepaalt de keuze van voeding, ballastweerstand en HV-probe. Het excitatiecircuit valt hiermee deels buiten de Laagspanningsrichtlijn — zie eis VS1.',
    bronIds: ['b16', 'b02', 'b18'],
    notitie:
      'Let op: het veiligheidsnormen-document gaat uit van 1500–2000 V ontsteking die terugzakt naar ~400 V. Dat is een andere aanname. Zie risico R19.',
    herkomst: 'bestand',
  },
  {
    id: 'be4',
    datum: '2026-09-08',
    beslissing: 'De magneetas in de bol staat onder 23,5°, met een tolerantie van ± 1°.',
    reden:
      'Zo staat de bol net zo scheef als de echte aarde, wat de demonstratie realistischer maakt. Een afwijking van 1° is met een gewone digitale hoekmeter goed te halen.',
    betrokkenen: ['lid3'],
    gevolgen: 'Bepaalt het ontwerp van de ophanging en de manier waarop de bol gemonteerd wordt.',
    bronIds: ['b16'],
    notitie: 'Vastgelegd als eis F8.',
    herkomst: 'bestand',
  },
  {
    id: 'be5',
    datum: '2026-09-08',
    beslissing: 'LiS wordt zelf als opdrachtgever aangemerkt; er is geen externe commerciële opdrachtgever.',
    reden:
      'In de opdrachtomschrijving wordt nergens een externe opdrachtgever met naam genoemd. De begeleidend docent/system engineer treedt op als contactpersoon en beoordelaar namens de opdrachtgever.',
    betrokkenen: ['lid1'],
    gevolgen:
      'Raakt direct aan de CE-vraag: als de opstelling binnen de school blijft, is er mogelijk geen sprake van "in de handel brengen". Zie onderzoek o11 en eis VS2.',
    bronIds: ['b16', 'b18'],
    notitie:
      'Het plan van aanpak zegt hier zelf bij: "mocht dit niet kloppen, dan passen we deze paragraaf aan met de juiste organisatie". Deze beslissing is dus nog niet definitief. Het veiligheidsnormen-document gaat juist wél uit van een externe klant.',
    herkomst: 'bestand',
  },
  {
    id: 'be6',
    datum: '2026-09-02',
    beslissing: 'Voor de bol wordt aluminium 7075 overwogen boven koper.',
    reden:
      'Volgens een werknotitie: "alu 7075 is beter, kan beter geleiden en betere ionenimplantatie". De onderdelenlijst in het plan van aanpak noemt ook aluminium bollen.',
    betrokkenen: ['lid3'],
    gevolgen: 'Bepaalt bewerkingsmethode, gewicht en kosten van de twee kogelhelften.',
    bronIds: ['b16'],
    notitie:
      'De onderbouwing is nog niet gecontroleerd: koper geleidt elektrisch juist beter dan aluminium 7075. Er kunnen prima andere redenen zijn om aluminium te kiezen (gewicht, bewerkbaarheid, prijs), maar schrijf die op vóórdat dit in het eindverslag komt. Zie onderzoek o09.',
    herkomst: 'bestand',
  },
  {
    id: 'be7',
    datum: '2026-09-08',
    beslissing:
      'De vacuümkamer wordt een frameconstructie met vlakke glasplaten en trekstangen, niet een klassieke stolp.',
    reden: 'Nog niet schriftelijk onderbouwd — deze keuze is alleen af te leiden uit de CAD-bestanden.',
    betrokkenen: ['lid2'],
    gevolgen:
      'Een vlakke plaat onder vacuüm buigt anders door dan een gebogen stolp; dat maakt de implosieberekening (eis VS4) belangrijker. Ook de afdichting per paneel wordt kritischer.',
    bronIds: [],
    notitie:
      'Afgeleid uit de Inventor-bestandsnamen: FaceFrame, CornerPost, GlassPane, GlassPane_Port, Glass_Long, Glass_Short, TieRod, PlateTop, PlateBottom. Leg de reden voor deze keuze alsnog vast.',
    herkomst: 'voorstel',
  },
  {
    id: 'be8',
    datum: '2026-09-09',
    beslissing:
      'In deze projecthub worden de fasedata uit de Excel-strokenplanning aangehouden, niet de tabel uit hoofdstuk 6 van het plan van aanpak.',
    reden:
      'De Excel-data (2 sep t/m 10 nov) komen exact overeen met de SMART-deadlines in het pakket van eisen: ontwerp tot 29 september, bouw tot 20 oktober, test tot 27 oktober, transporttest tot 3 november, oplevering 10 november. De tabel in hoofdstuk 6 noemt andere periodes.',
    betrokkenen: ['lid1'],
    gevolgen: 'Alle deadlines in deze hub volgen de Excel. De tabel in het plan van aanpak moet nog gecorrigeerd worden.',
    bronIds: ['b16', 'b17'],
    notitie:
      'Dit is een keuze die bij het inrichten van de hub is gemaakt, niet door het team. Bevestig hem of draai hem terug — zie taak t15.',
    herkomst: 'voorstel',
  },
];
