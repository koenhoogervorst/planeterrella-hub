/* Projectonderdelen — de fysieke delen van de Planeterrella.
 * Samengesteld uit §5.2.4 van het plan van aanpak, de mindmap-onderdelenlijst,
 * de Inventor-bestanden en de gedownloade componentmodellen.
 *
 * Taken worden automatisch aan een onderdeel gekoppeld via het veld "categorie".
 */

export const onderdelen = [
  {
    id: 'od1',
    naam: 'Vacuümkamer',
    omschrijving:
      'Transparante kamer waarin het plasma ontstaat. Inwendig minimaal Ø400 mm, wanddikte minimaal 10 mm, met basisplaat en O-ring-afdichting voor de doorvoeren.',
    categorie: 'vacuum',
    status: 'ontwerp',
    ontwerpstatus: 'cad',
    verantwoordelijke: 'lid2',
    eisIds: ['e-f7', 'e-r1', 'e-vs4'],
    bronIds: ['b16', 'b21', 'b18'],
    bestanden:
      'Terrella_Chamber.iam, Terrella_FaceFrame.ipt, Terrella_CornerPost.ipt, Terrella_GlassPane.ipt, Terrella_GlassPane_Port.ipt, Terrella_Glass_Long.ipt, Terrella_Glass_Short.ipt, Terrella_TieRod.ipt, Terrella_PlateTop.ipt, Terrella_PlateBottom.ipt',
    notities:
      'Uit de Inventor-bestandsnamen blijkt een frameconstructie met vlakke glasplaten en trekstangen, niet een klassieke stolp. Die keuze staat nog niet schriftelijk onderbouwd — zie beslissing B7.',
    herkomst: 'bestand',
  },
  {
    id: 'od2',
    naam: 'Terrella / bol ("de aarde")',
    omschrijving:
      'Gemagnetiseerde bol die de planeet voorstelt. Minimaal Ø80 mm, tweedelig zodat je zonder gereedschap bij de magneten kunt.',
    categorie: 'magneet',
    status: 'ontwerp',
    ontwerpstatus: 'cad',
    verantwoordelijke: 'lid3',
    eisIds: ['e-r2', 'e-r4'],
    bronIds: ['b16', 'b21'],
    bestanden:
      'Terrella_Globe.ipt; milestone 1/stls: kogel top rond 83.stl/.step, kogel boden rond 83.stl/.step (v2, v3), origonal design top V2.stl, kosten kogel.ods',
    notities:
      'De STL- en STEP-bestanden gaan uit van Ø83 mm. Begroting: kogel bodem € 450,63 + kogel top € 406,72. Materiaalkeuze (aluminium 7075 of koper) staat nog open — zie onderzoek o09.',
    herkomst: 'bestand',
  },
  {
    id: 'od3',
    naam: 'Magnetisch systeem en ophanging',
    omschrijving:
      'Ringmagneten in de bol, onder 23,5° ± 1°, in een zelf ontworpen ophangsysteem dat 50 N trekkracht doorstaat.',
    categorie: 'magneet',
    status: 'ontwerp',
    ontwerpstatus: 'cad',
    verantwoordelijke: 'lid3',
    eisIds: ['e-f8', 'e-r3'],
    bronIds: ['b16'],
    bestanden:
      'Terrella_SuspensionRod.ipt, Terrella_SupportRod.ipt; stls: kogel new design ring magnet bottom.stl, kogel now design ring magnet top.stl',
    notities:
      'Begrote magneten: Ø75/49 mm (€ 36,88), 2× Ø60/20 mm, 2× Ø40/22 mm, 2× Ø30/12 mm en 2× Ø24/12 mm. Doelveldsterkte ca. 0,5 T aan het oppervlak. Wens uit R3: ophangsysteem 3D-geprint.',
    herkomst: 'bestand',
  },
  {
    id: 'od4',
    naam: 'Elektrode en hoogspanningsdoorvoer',
    omschrijving:
      'Kathode-elektrode in de kamer plus de geïsoleerde doorvoer die de hoogspanning naar binnen brengt zonder lekkage of overslag.',
    categorie: 'elektro',
    status: 'ontwerp',
    ontwerpstatus: 'cad',
    verantwoordelijke: 'lid1',
    eisIds: ['e-f6', 'e-v2'],
    bronIds: ['b16', 'b08', 'b21'],
    bestanden:
      'Terrella_Electrode.ipt, Terrella_ElectrodeBushing.ipt, Terrella_Insulator.ipt, terrella_electrode_assembly.py; planeterrella-cad/1831787_51494-2 (TE SHV-coaxdoorvoer)',
    notities:
      'Het Python-script is geschreven voor Fusion 360 en gaat uit van een polaire doorboring van ca. Ø10 mm met een staafdiameter van 9,8 mm (0,2 mm speling). Het script zegt er zelf bij dat die maten in CAD gecontroleerd moeten worden. Of de kathode verstelbaar wordt, staat nog open (eis V2).',
    herkomst: 'bestand',
  },
  {
    id: 'od5',
    naam: 'Hoogspanningsvoeding en stroombegrenzing',
    omschrijving:
      'Instelbare voeding van 300 V tot 2 kV met een ballastweerstand die de stroom begrenst op maximaal 1,0 mA.',
    categorie: 'elektro',
    status: 'idee',
    ontwerpstatus: 'geen',
    verantwoordelijke: 'lid1',
    eisIds: ['e-f4', 'e-vs1'],
    bronIds: ['b16', 'b02', 'b18'],
    bestanden: 'planeterrella-cad/power_supply_hdr-60-5 (MEAN WELL HDR-60-5, 5 V DIN-railvoeding)',
    notities:
      'De gedownloade HDR-60-5 is een 5 V-voeding — dat is de besturingsspanning, niet de hoogspanning zelf. De hoogspanningsbron, de ballastweerstand (100 kΩ – enkele MΩ) en de HV-probe zijn nog niet gekozen.',
    herkomst: 'bestand',
  },
  {
    id: 'od6',
    naam: 'Aarding en afscherming',
    omschrijving:
      'Alle geleidende delen geaard met maximaal 0,5 ohm overgangsweerstand, geen aanraakbare spanningvoerende delen tijdens bedrijf.',
    categorie: 'veiligheid',
    status: 'idee',
    ontwerpstatus: 'geen',
    verantwoordelijke: 'lid1',
    eisIds: ['e-f5', 'e-vs1'],
    bronIds: ['b16', 'b18', 'b09', 'b10'],
    bestanden:
      'planeterrella-cad/a9f79216 (Schneider Acti9 iC60N 2P C16A installatieautomaat), planeterrella-cad/53111020 (Lapp Skintop ST-M M20 wartel IP69K), planeterrella-cad/3031212 (Phoenix Contact ST 2,5 doorvoerklem)',
    notities:
      'NEN 3840 vereist voor het hoogspanningsdeel minimaal een VP of VOL-HS. Een VOP mag daar niet aan werken — ook niet als bouwer of tester zolang het apparaat onder spanning staat.',
    herkomst: 'bestand',
  },
  {
    id: 'od7',
    naam: 'Vacuümsysteem',
    omschrijving:
      'Tweetraps rotatiepomp, vacuümmeter (Pirani of thermokoppel), vacuümslang met KF/NW-fittingen en een afvoerleiding voor de pompuitlaat.',
    categorie: 'vacuum',
    status: 'idee',
    ontwerpstatus: 'geen',
    verantwoordelijke: 'lid2',
    eisIds: ['e-f3', 'e-f6'],
    bronIds: ['b16', 'b21', 'b05'],
    bestanden: 'Terrella_PumpPort.ipt, Terrella_PipeHoriz.ipt, Terrella_PipeVertical.ipt',
    notities:
      'Lekken bij de fittingen zijn volgens de onderdelenlijst de meest voorkomende reden dat een bouwsel de druk niet haalt. De doeldruk is nog niet eenduidig vastgelegd — zie onderzoek o12.',
    herkomst: 'bestand',
  },
  {
    id: 'od8',
    naam: 'Gassysteem',
    omschrijving: 'Kleine gasfles (N₂, Ar, Ne of lucht) met naaldventiel om fijn te doseren bij lage druk.',
    categorie: 'vacuum',
    status: 'idee',
    ontwerpstatus: 'geen',
    verantwoordelijke: 'lid4',
    eisIds: [],
    bronIds: ['b16', 'b21'],
    bestanden: '',
    notities:
      'Alleen bijvullen in een geventileerde ruimte: inert gas kan bij een lek de lucht in een kleine ruimte wegdrukken. Toewijzing aan Teamlid 4 is een voorstel.',
    herkomst: 'bestand',
  },
  {
    id: 'od9',
    naam: 'Constructie, frame en statief',
    omschrijving: 'Het draagframe waarop de kamer staat, inclusief poten en rails.',
    categorie: 'constructie',
    status: 'ontwerp',
    ontwerpstatus: 'cad',
    verantwoordelijke: 'lid3',
    eisIds: ['e-f2'],
    bronIds: ['b16'],
    bestanden: 'Terrella_StandLeg.ipt, Terrella_StandRailLong.ipt, Terrella_StandRailShort.ipt, Terrella_Plate.ipt',
    notities: 'Nog te bepalen of dit statief doorontwikkeld wordt tot de trolley, of dat de trolley een los onderdeel wordt.',
    herkomst: 'bestand',
  },
  {
    id: 'od10',
    naam: 'Trolley en transportbescherming',
    omschrijving:
      'Verrijdbaar onderstel waarmee één persoon de complete opstelling binnen 10 minuten over 50 m verplaatst, plus bescherming van glas en elektronica tijdens transport.',
    categorie: 'constructie',
    status: 'idee',
    ontwerpstatus: 'geen',
    verantwoordelijke: 'lid3',
    eisIds: ['e-f2', 'e-f3', 'e-v4'],
    bronIds: ['b16', 'b19'],
    bestanden: '',
    notities:
      'Dit is de belangrijkste nieuwe wens van de opdrachtgever ten opzichte van het bestaande model, en er is nog geen ontwerp voor.',
    herkomst: 'bestand',
  },
  {
    id: 'od11',
    naam: 'Bediening en noodstop',
    omschrijving:
      'De bediening waarmee de gebruiker gas, druk en spanning instelt, en de noodstop om de hoogspanning direct af te schakelen.',
    categorie: 'elektro',
    status: 'idee',
    ontwerpstatus: 'geen',
    verantwoordelijke: 'lid1',
    eisIds: ['e-v1'],
    bronIds: ['b19', 'b16'],
    bestanden: 'planeterrella-cad/relays_80_21_0_240_0000 (Finder 80-serie tijdrelais, 12–240 V AC/DC)',
    notities:
      'De mindmap noemt de noodstop zowel als functionele eis als als onderdeel, maar in het SMART-pakket van eisen ontbreekt hij. Zie taak t17 en eis V1.',
    herkomst: 'bestand',
  },
  {
    id: 'od12',
    naam: 'Documentatie en examenportfolio',
    omschrijving:
      'Alle papieren opleveringen: plan van aanpak, eindverslag, technisch dossier, gebruiksinstructie, presentatie en het examenportfolio P4-K4.',
    categorie: 'documentatie',
    status: 'bouw',
    ontwerpstatus: 'geen',
    verantwoordelijke: 'lid1',
    eisIds: ['e-s1', 'e-s2', 'e-s3', 'e-s4', 'e-s5', 'e-s6', 'e-vs2'],
    bronIds: ['b16', 'b20', 'b18'],
    bestanden:
      'Plan van aanpak - Noorderlichtopstelling.docx, Planning_Noorderlicht_Opstelling.xlsx, 25897 RIM niv 4 P4-K4 - BLE Examenportfolio.docx, Rubric Bedrijfsopdracht MEO.pdf',
    notities:
      'Het plan van aanpak is af. De rest van de documentatie moet nog gemaakt worden en heeft de meeste losse eisen aan zich hangen.',
    herkomst: 'bestand',
  },
];
