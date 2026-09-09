/* Problemen en risico's.
 *
 * r01–r06: de veiligheidsaandachtspunten uit het plan van aanpak §5.2.5.
 * r07–r09: de problemen waar IUT Toulouse in 2011 tegenaan liep.
 * r10–r14: risico's uit het veiligheidsnormen-document.
 * r15–r21: projectrisico's die volgen uit tegenstrijdigheden en gaten in de bestanden.
 *
 * Belangrijk: dit zijn risico's zoals ze in de bronnen staan, geen vastgestelde
 * feiten. Bij elk risico staat waar het vandaan komt, zodat je het kunt narekenen.
 */

export const risicos = [
  {
    id: 'r01',
    titel: 'Implosierisico van de vacuümkamer',
    omschrijving:
      'Op een kamer onder vacuüm drukt ongeveer 1 atmosfeer naar binnen, op elk stuk oppervlak. Gebruik alleen een kamer die daar tegen kan en inspecteer hem voordat je gaat pompen.',
    datum: '2026-09-08',
    ernst: 'kritiek',
    verantwoordelijke: 'lid2',
    status: 'open',
    categorie: 'veiligheid',
    oplossing:
      'Wanddikte minimaal 10 mm (eis R1), implosieberekening op basis van de leveranciersgegevens (eis VS4), visuele inspectie op krassen en insluitsels vóór elke pompsessie.',
    notities: 'Bron: plan van aanpak §5.2.5 en veiligheidsnormenterrella.pdf §4.',
    herkomst: 'bestand',
  },
  {
    id: 'r02',
    titel: 'Hoogspanningsschok bij aanraking',
    omschrijving:
      'Ook de 300 V tot enkele kV die in deze opstelling gebruikt worden is levensgevaarlijk bij aanraking.',
    datum: '2026-09-08',
    ernst: 'kritiek',
    verantwoordelijke: 'lid1',
    status: 'open',
    categorie: 'veiligheid',
    oplossing:
      'Behuizing en voeding altijd aarden (eis F5), nooit aan de doorvoer of de elektroden werken als de voeding aanstaat, geen aanraakbare spanningvoerende delen tijdens bedrijf.',
    notities: 'Bron: plan van aanpak §5.2.5.',
    herkomst: 'bestand',
  },
  {
    id: 'r03',
    titel: 'Zachte röntgenstraling bij hoge spanning',
    omschrijving:
      'Bij spanningen ver boven enkele kV kunnen elektronen die in vacuüm op metaal botsen zachte röntgenstraling opwekken.',
    datum: '2026-09-08',
    ernst: 'hoog',
    verantwoordelijke: 'lid1',
    status: 'open',
    categorie: 'veiligheid',
    oplossing: 'Binnen het afgesproken spanningsbereik blijven: maximaal 2 kV volgens eis F4.',
    notities:
      'Bron: plan van aanpak §5.2.5. Dit maakt het extra belangrijk dat het spanningsbereik eenduidig vastligt — zie risico r19.',
    herkomst: 'bestand',
  },
  {
    id: 'r04',
    titel: 'Boogvorming door onbegrensde stroom',
    omschrijving:
      'Als de stroom niet begrensd wordt, kan een gloeiontlading omslaan in een boog en gaat er van alles kapot.',
    datum: '2026-09-08',
    ernst: 'hoog',
    verantwoordelijke: 'lid1',
    status: 'open',
    categorie: 'elektro',
    oplossing: 'Altijd een ballastweerstand gebruiken die de stroom tussen 0,1 en 1,0 mA houdt (eis F4).',
    notities: 'Bron: plan van aanpak §5.2.5.',
    herkomst: 'bestand',
  },
  {
    id: 'r05',
    titel: 'Zuurstofverdringing bij een gaslek',
    omschrijving: 'Inert gas kan bij een lek de lucht in een kleine ruimte wegdrukken.',
    datum: '2026-09-08',
    ernst: 'middel',
    verantwoordelijke: 'lid4',
    status: 'open',
    categorie: 'veiligheid',
    oplossing: 'Alleen bijvullen in een geventileerde ruimte.',
    notities: 'Bron: plan van aanpak §5.2.5. Toewijzing aan Teamlid 4 is een voorstel.',
    herkomst: 'bestand',
  },
  {
    id: 'r06',
    titel: 'Sterke neodymium-magneten',
    omschrijving:
      'De magneten zijn sterk genoeg om vingers te beknellen of gereedschap uit je hand te trekken. Het plan van aanpak noemt ook afstand houden van pacemakers en harde schijven.',
    datum: '2026-09-08',
    ernst: 'hoog',
    verantwoordelijke: 'lid3',
    status: 'open',
    categorie: 'veiligheid',
    oplossing:
      'Werkinstructie voor het hanteren van de magneten opstellen; waarschuwing opnemen in de gebruiksinstructie en bij demonstraties.',
    notities:
      'Bron: plan van aanpak §5.2.5. Dit staat daar als aandachtspunt genoteerd, niet als gemeten of onderbouwd feit. Zoek voor de gebruiksinstructie een gezaghebbende bron over veilige afstanden bij medische implantaten.',
    herkomst: 'bestand',
  },
  {
    id: 'r07',
    titel: 'Vacuüm moet verbroken worden om bij de bol te komen',
    omschrijving:
      'IUT Toulouse liep hiertegenaan: elke keer als ze iets aan de bol wilden veranderen, moesten ze het vacuüm weer verbreken.',
    datum: '2026-09-08',
    ernst: 'middel',
    verantwoordelijke: 'lid3',
    status: 'bezig',
    categorie: 'ontwerp',
    oplossing:
      'Eis R4 (tweedelige bol, zonder gereedschap te openen) maakt het wisselen sneller, maar heft het probleem niet op. Overweeg of er meer instelbaar moet zijn zonder de kamer te openen.',
    notities: 'Bron: plan van aanpak §5.2.6, projectrapport IUT Toulouse 2011.',
    herkomst: 'bestand',
  },
  {
    id: 'r08',
    titel: 'Draaiende bol laat de voedingskabel om de rotatie-as wikkelen',
    omschrijving:
      'IUT Toulouse kreeg de bol niet draaiend omdat de voedingskabel om de rotatie-as wikkelde. Zij hebben dat opgelost door in plaats daarvan een magneet binnenin de bol te laten draaien.',
    datum: '2026-09-08',
    ernst: 'laag',
    verantwoordelijke: 'lid3',
    status: 'open',
    categorie: 'ontwerp',
    oplossing:
      'Alleen relevant als jullie de bol willen laten draaien. Dat staat nu niet in de eisen — bepaal of jullie dit willen.',
    notities: 'Bron: plan van aanpak §5.2.6, projectrapport IUT Toulouse 2011.',
    herkomst: 'bestand',
  },
  {
    id: 'r09',
    titel: 'Elektrode verticaal bewegen onder vacuüm',
    omschrijving:
      'Het elektronenkanon omhoog en omlaag bewegen terwijl het vacuüm intact bleef, is IUT Toulouse uiteindelijk niet gelukt.',
    datum: '2026-09-08',
    ernst: 'middel',
    verantwoordelijke: 'lid1',
    status: 'open',
    categorie: 'elektro',
    oplossing:
      'Weeg dit mee bij de beslissing over eis V2 (verstelbare anode-kathode-afstand). Een vaste, goed gekozen afstand is misschien betrouwbaarder dan een verstelbare.',
    notities: 'Bron: plan van aanpak §5.2.6, projectrapport IUT Toulouse 2011.',
    herkomst: 'bestand',
  },
  {
    id: 'r10',
    titel: 'CE-verplichting bij overdracht aan de opdrachtgever',
    omschrijving:
      'Het veiligheidsnormen-document gaat ervan uit dat overdracht aan een klant telt als "in de handel brengen" — ook bij een prototype, ook bij tijdelijke overdracht en ook gratis. Dat brengt een risicobeoordeling, technisch dossier, gebruiksinstructie en conformiteitsverklaring met zich mee.',
    datum: '2026-09-08',
    ernst: 'hoog',
    verantwoordelijke: 'lid1',
    status: 'open',
    categorie: 'veiligheid',
    oplossing:
      'Uitzoeken of dit ook geldt als LiS zelf de opdrachtgever is en de opstelling binnen de school blijft. Voorleggen aan de praktijkbegeleider.',
    notities:
      'Bron: veiligheidsnormenterrella.pdf §3 en §8. Het document zegt zelf dat het een oriëntatie is en geen juridisch advies.',
    herkomst: 'bestand',
  },
  {
    id: 'r11',
    titel: 'Vakbekwaamheidseis NEN 3840 voor het hoogspanningsdeel',
    omschrijving:
      'Voor werkzaamheden aan of nabij het hoogspanningsdeel gelden zwaardere vakbekwaamheidseisen. Een VOP mag daar niet aan werken; dat is voorbehouden aan een VP of VOL-HS. Dat geldt ook voor de bouwer of tester zolang het apparaat onder spanning staat.',
    datum: '2026-09-08',
    ernst: 'hoog',
    verantwoordelijke: 'lid1',
    status: 'open',
    categorie: 'veiligheid',
    oplossing:
      'Vroeg regelen wie bevoegd is om onder spanning te testen. Zonder dat kan de hoogspanningstest niet doorgaan.',
    notities:
      'Bron: veiligheidsnormenterrella.pdf §1 en §7. Dit kan de planning voor fase 6 blokkeren — zie taak t57.',
    herkomst: 'bestand',
  },
  {
    id: 'r12',
    titel: 'Laagspanningsrichtlijn dekt het hoogspanningsdeel niet',
    omschrijving:
      'De Laagspanningsrichtlijn geldt van 50–1000 V AC of 75–1500 V DC. Een excitatiecircuit boven die grens valt er dus buiten; je kunt niet volstaan met "voldoet aan de LVD".',
    datum: '2026-09-08',
    ernst: 'middel',
    verantwoordelijke: 'lid1',
    status: 'open',
    categorie: 'veiligheid',
    oplossing:
      'Voor het hoogspanningsdeel terugvallen op de Machinerichtlijn en de normen IEC 61010-1, EN 60204-1 en EN 60664-1 (mogelijk de IEC 60071-reeks).',
    notities: 'Bron: veiligheidsnormenterrella.pdf §2 en §6.',
    herkomst: 'bestand',
  },
  {
    id: 'r13',
    titel: 'EMC-storing door hoge dV/dt',
    omschrijving:
      'Een hard geschakelde hoogspanningsexcitatie kan aanzienlijke elektromagnetische storing veroorzaken. De EMC-richtlijn geldt ongeacht spanningsniveau.',
    datum: '2026-09-08',
    ernst: 'middel',
    verantwoordelijke: 'lid1',
    status: 'open',
    categorie: 'elektro',
    oplossing: 'EMC meenemen in het ontwerp en EMC-tests opnemen in het testplan (eis VS3).',
    notities: 'Bron: veiligheidsnormenterrella.pdf §5.',
    herkomst: 'bestand',
  },
  {
    id: 'r14',
    titel: 'Overgang naar de Machineverordening per 20 januari 2027',
    omschrijving:
      'De Machinerichtlijn 2006/42/EG wordt per 20 januari 2027 vervangen door de Machineverordening (EU) 2023/1230, die op onderdelen strenger is.',
    datum: '2026-09-08',
    ernst: 'laag',
    verantwoordelijke: 'lid1',
    status: 'open',
    categorie: 'veiligheid',
    oplossing:
      'De planning eindigt op 10 november 2026, dus ruim vóór die datum. Alleen bij flinke uitloop wordt dit een probleem.',
    notities: 'Bron: veiligheidsnormenterrella.pdf §3.',
    herkomst: 'bestand',
  },
  {
    id: 'r15',
    titel: 'Tegenstrijdige einddata tussen plan van aanpak en Excel-planning',
    omschrijving:
      'De tabel in hoofdstuk 6 van het plan van aanpak noemt andere periodes dan de Excel-strokenplanning. Voorbeeld: Ontwerp staat in de tabel op "week 2 (14-18 sep)", maar de eisen R1 en R2 hebben als deadline 29 september, wat overeenkomt met de Excel. Ook de weeknummering in de tabel klopt niet met zichzelf.',
    datum: '2026-09-09',
    ernst: 'hoog',
    verantwoordelijke: 'lid1',
    status: 'open',
    categorie: 'planning',
    oplossing:
      'Kies één versie en corrigeer de andere. Deze hub houdt de Excel aan, omdat die overeenkomt met de SMART-deadlines. Zie taak t15.',
    notities: 'Gevonden bij het vergelijken van Plan van aanpak §6 met Planning_Noorderlicht_Opstelling.xlsx.',
    herkomst: 'voorstel',
  },
  {
    id: 'r16',
    titel: 'Doeldruk staat in vier verschillende waarden in de bestanden',
    omschrijving:
      '"Ongeveer 0,2 mbar" (inleiding en eis F3), "bij 10 pascal" (eis F1, dus 0,1 mbar), "een paar pascal" (§5.2.2) en "0.1 mbar of lager" (werknotitie). Dat scheelt een factor twee tot tien.',
    datum: '2026-09-09',
    ernst: 'hoog',
    verantwoordelijke: 'lid2',
    status: 'open',
    categorie: 'vacuum',
    oplossing:
      'Eén waarde kiezen, alle documenten aanpassen en er een eigen genummerde eis van maken. Zie taak t16 en onderzoek o12.',
    notities: 'Zonder eenduidige waarde kun je de pomp niet kiezen en de eis niet aftekenen.',
    herkomst: 'voorstel',
  },
  {
    id: 'r17',
    titel: 'Geen noodstop in het SMART-pakket van eisen',
    omschrijving:
      'De mindmap noemt een noodstop twee keer: als functionele eis F7 en als onderdeel van het elektrisch systeem. In het SMART-PvE in het plan van aanpak komt hij niet meer voor.',
    datum: '2026-09-09',
    ernst: 'hoog',
    verantwoordelijke: 'lid1',
    status: 'open',
    categorie: 'veiligheid',
    oplossing: 'Eis V1 opnieuw opnemen en SMART maken, of bewust en gemotiveerd schrappen. Zie taak t17.',
    notities: 'Bij een opstelling met 2 kV is dit geen detail om per ongeluk kwijt te raken.',
    herkomst: 'voorstel',
  },
  {
    id: 'r18',
    titel: 'Geen budget vastgelegd terwijl de bol alleen al bijna € 1.000 kost',
    omschrijving:
      'In de bestanden staat nergens een budget. Het kostenoverzicht voor de bol komt uit op € 951,95. IUT Toulouse kwam voor een compleet vergelijkbaar project op € 6.173.',
    datum: '2026-09-09',
    ernst: 'hoog',
    verantwoordelijke: 'lid1',
    status: 'open',
    categorie: 'inkoop',
    oplossing:
      'Budget afstemmen met de opdrachtgever vóór de inkoopfase begint (23 september). Zie taak t20 en eis V5.',
    notities:
      'Het examenportfolio vraagt bij P4-K4-W1 ook expliciet om een kosten-batenanalyse en een inschatting of het maken rendabel is.',
    herkomst: 'voorstel',
  },
  {
    id: 'r19',
    titel: 'Twee verschillende spanningsaannames in de bestanden',
    omschrijving:
      'Het plan van aanpak houdt 300 V tot 2 kV aan. Het veiligheidsnormen-document beschrijft een excitatie van 1500–2000 V die terugzakt naar ~400 V, en spreekt bovendien over een externe klant als opdrachtgever terwijl het plan van aanpak LiS als opdrachtgever noemt.',
    datum: '2026-09-09',
    ernst: 'middel',
    verantwoordelijke: 'lid1',
    status: 'open',
    categorie: 'elektro',
    oplossing:
      'Uitzoeken of het veiligheidsnormen-document over ditzelfde project gaat, of over een ander (afstudeer)project. De conclusies over NEN 3840 en CE hangen af van welke spanning en welke opdrachtgever klopt.',
    notities:
      'Het veiligheidsnormen-document heeft als kop "TECHNISCHE / JURIDISCHE REFERENTIE — AFSTUDEERPROJECT", terwijl dit project een bedrijfsproject voor kerntaak P4-K4 is.',
    herkomst: 'voorstel',
  },
  {
    id: 'r20',
    titel: 'Teamgrootte: drie personen in de bestanden, vier plekken in deze hub',
    omschrijving:
      'Het plan van aanpak noemt drie projectleden met een duidelijke rolverdeling. Deze projecthub is ingericht voor vier personen.',
    datum: '2026-09-09',
    ernst: 'laag',
    verantwoordelijke: '',
    status: 'open',
    categorie: 'planning',
    oplossing:
      'Vul op de Team-pagina de echte namen en rollen in. De taken die nu aan Teamlid 4 hangen zijn voorstellen — verdeel ze opnieuw als er geen vierde persoon is.',
    notities: 'Ook het plan van aanpak zelf moet dan bijgewerkt worden, want daarin staan drie namen.',
    herkomst: 'voorstel',
  },
  {
    id: 'r21',
    titel: 'Werkverdeling is scheef: Teamlid 1 draagt bijna de helft',
    omschrijving:
      'De rolverdeling in het plan van aanpak legt bij Teamlid 1 drie rollen tegelijk neer: het complete elektrische systeem, het contact met de opdrachtgever én de documentatie. In deze hub komt dat neer op ongeveer 27 van de 69 taken, tegen 12 tot 16 voor de anderen.',
    datum: '2026-09-09',
    ernst: 'middel',
    verantwoordelijke: '',
    status: 'open',
    categorie: 'planning',
    oplossing:
      'Bespreek de verdeling aan het begin van de ontwerpfase. Documentatie en testuitvoering zijn het makkelijkst over te dragen; het elektrische ontwerp niet, omdat daar vakbekwaamheid voor nodig is (zie risico r11).',
    notities:
      'Geconstateerd bij het inrichten van de hub, op basis van de rolverdeling in hoofdstuk 2 van het plan van aanpak. Een paar taken zijn al als voorstel verschoven — die staan met een notitie gemarkeerd.',
    herkomst: 'voorstel',
  },
];
