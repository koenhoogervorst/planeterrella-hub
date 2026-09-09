# Planeterrella Projecthub

Projectomgeving voor de **Noorderlichtopstelling (Planeterrella)** — kerntaak P4-K4
"Ontwerpt prototypen", Researchinstrumentmaker (crebo 25897), Leidse Instrumentmakers School.

De hub is gevuld met de inhoud van jullie eigen projectbestanden: 69 taken, 28 eisen,
21 bronnen, 12 onderzoeksvragen, 12 projectonderdelen, 15 documenten, 8 beslissingen
en 21 risico's.

**Online:** https://planeterella-werk.planeterella-info.com
(reserveadres: https://planeterrella-hub.koenhoogervorst2005.workers.dev)

Jullie werken alle vier in **dezelfde gegevens**: wat de een verandert, ziet de
ander binnen een paar seconden verschijnen zonder de pagina te verversen.

---

## Snel starten

**Optie 1 — open de website** (aanbevolen)

https://planeterella-werk.planeterella-info.com

Werkt op elke computer en telefoon, zonder installatie en zonder inloggen. Alles wat
je verandert staat meteen in de gedeelde database, dus je teamgenoten zien het direct.

Zet rechtsboven één keer **wie je bent** (Teamlid 1 t/m 4). Dat wordt in je eigen
browser onthouden en komt bij elke wijziging te staan, zodat jullie terug kunnen zien
wie wat heeft gedaan.

Naast die keuze staat een stip:

| Stip | Betekenis |
|---|---|
| groen, "Live" | Verbonden. Je teamgenoten zien je wijzigingen meteen. |
| rood, "Offline" | Geen verbinding. Je werk wordt in je eigen browser bewaard en later alsnog verstuurd. |

**Optie 2 — dubbelklik `Start-Projecthub.cmd`** (offline werken)

De hub opent vanzelf in je browser op `http://localhost:5184`. De eerste keer duurt
dat een halve minuut, daarna is het meteen klaar. Laat het zwarte venster openstaan
zolang je de hub gebruikt; sluiten stopt de hub.

Hiervoor moet Node.js op de computer staan (eenmalig, via https://nodejs.org).
Het startbestand controleert dat en zegt het als het ontbreekt.

**Optie 3 — `Planeterrella-Projecthub.html` dubbelklikken**

Eén los bestand met alles erin, handig om door te sturen of even te laten zien.

> **Let op:** of je wijzigingen bewaard blijven, hangt af van je browser. Sommige
> browsers staan opslag niet toe voor bestanden die je rechtstreeks van de schijf
> opent. De hub controleert dat bij het opstarten: kan hij niets bewaren, dan zie je
> bovenaan een rode waarschuwing en vraagt de browser om bevestiging als je het
> tabblad sluit met niet-opgeslagen werk.
>
> Test het één keer: open het bestand, voeg een taak toe, sluit het tabblad en open
> het opnieuw. Staat de taak er nog? Dan kun je deze versie gewoon gebruiken. Zo
> niet, gebruik dan optie 1 of 2 — die werken altijd.

**Optie 4 — met Node, om de code aan te passen**

```
npm install
npm run dev
```

Open daarna http://localhost:5183. Let op: in Windows PowerShell werkt `&&` niet,
dus zet die twee regels apart of gebruik een puntkomma.

Heb je iets aangepast en wil je een nieuwe losse HTML?

```
npm run build
npm run bundel
```

## De website bijwerken

De code staat in de privé-repository
[koenhoogervorst/planeterrella-hub](https://github.com/koenhoogervorst/planeterrella-hub).
De site draait op Cloudflare Workers.

Iets aangepast en online zetten? Eén commando:

```
npm run publiceer
```

Dat bouwt de app en publiceert hem naar Cloudflare. Vergeet daarna niet je wijziging
ook naar GitHub te pushen.

---

## Waar staat wat?

| Pagina | Waarvoor |
|---|---|
| **Dashboard** | Waar staat het project nu: voortgang, deadlines, hoge prioriteit, aandachtspunten |
| **Voortgang** | Alle cijfers per teamlid, per fase, per categorie en per prioriteit |
| **Planning** | De acht projectfases in vier weergaven: takenlijst, kanban-bord, kalender, strokenplanning |
| **Taken** | Toevoegen, aanpassen, afvinken, toewijzen, filteren, CSV exporteren |
| **Team** | Wie doet wat. Hier vervang je "Teamlid 1" door jullie echte namen |
| **Projectonderdelen** | De fysieke delen van de opstelling, met status, eisen, taken en bestanden |
| **Eisen** | Het pakket van eisen: functioneel, realisatie, veiligheid en schoolvoorwaarden |
| **Onderzoek** | Per onderzoeksvraag: waarom, wat we al weten, resultaten, conclusie |
| **Problemen & risico's** | Wat er mis kan gaan en hoe jullie het beheersen |
| **Bronnen** | Alle bronnen met samenvatting, betrouwbaarheid en waar ze voor gebruikt zijn |
| **Documentatie** | Welke bestanden er zijn, waar ze staan en waar ze bij horen |
| **Beslissingen** | Besluitenlogboek: wat, waarom, door wie, met welke gevolgen |
| **Zoeken** | Doorzoekt alles tegelijk |
| **Instellingen** | Back-up maken, terugzetten, projectgegevens aanpassen |

---

## Belangrijk: bestand of voorstel?

Overal in de hub staat bij elk item een label:

- **Bestand** — komt letterlijk uit een van jullie eigen projectbestanden
- **Voorstel** — logische aanvulling die er nog niet stond; controleer of jullie hem willen
- **Eigen** — later in de hub zelf toegevoegd

Verzin niets bij: als er iets niet in de bestanden stond, staat dat er zo bij.

---

## Vier dingen die eerst geregeld moeten worden

Bij het uitpluizen van de projectbestanden kwamen vier tegenstrijdigheden naar boven.
Ze staan als taak én als risico in de hub.

1. **De einddata spreken elkaar tegen.** De strokenplanning in Excel loopt van
   2 september tot 10 november en klopt met de SMART-deadlines in het pakket van eisen.
   De tabel in hoofdstuk 6 van het plan van aanpak noemt andere periodes. Deze hub houdt
   de Excel aan; corrigeer het plan van aanpak of andersom.
2. **De doeldruk staat er vier keer verschillend in:** "ongeveer 0,2 mbar" (inleiding en
   eis F3), "bij 10 pascal" (eis F1), "een paar pascal" (§5.2.2) en "0.1 mbar of lager"
   (werknotitie). Kies één waarde.
3. **De noodstop is verdwenen.** De mindmap noemt hem twee keer, het SMART-pakket van
   eisen niet meer. Bij 2 kV is dat geen detail.
4. **Er is geen budget vastgelegd,** terwijl de bol alleen al begroot is op € 951,95.

---

## Hoe de gegevens bewaard worden

Er zijn twee lagen, en dat is met opzet.

**1. De gedeelde database (Supabase).** Dit is de echte bron. Elk item — elke taak,
bron, eis, beslissing — is één rij in de tabel `items`. Zodra jij iets verandert gaat
alleen dát item naar de database, en krijgen de anderen het via een live verbinding
binnen. Twee mensen die tegelijk aan verschillende taken werken zitten elkaar dus niet
in de weg. Werken jullie per ongeluk allebei aan dezelfde taak, dan wint de laatste
die opslaat.

**2. Je eigen browser (localStorage).** Daarnaast blijft alles ook lokaal staan, onder
de sleutel `planeterrella-hub`. Valt het internet weg, dan kun je gewoon doorwerken:
de hub schakelt naar "Offline" en probeert je wijzigingen opnieuw te versturen zodra
je weer iets aanpast.

Verder geldt:

- raakt de lokale kopie beschadigd, dan merkt de hub dat bij het opstarten, zet de
  beschadigde versie apart onder `planeterrella-hub-kapotte-data` en begint opnieuw;
- **Instellingen → Alles exporteren (JSON)** maakt een volledige reservekopie. Doe dat
  af en toe: er is geen inlog, dus als iemand per ongeluk veel weggooit is dit je
  vangnet;
- **Startgegevens terugzetten** en **Alle inhoud wissen** werken op de gedeelde
  database. Wat jij daar doet, doe je dus voor iedereen;
- op de pagina's Taken en Bronnen kun je een **CSV** exporteren van precies wat je op
  dat moment gefilterd hebt. Die opent direct in Excel.

### Let op: er zit geen slot op

Er is bewust geen inlogscherm. Iedereen die de link kent kan alles lezen, aanpassen en
verwijderen. De site staat wel op `noindex`, dus zoekmachines nemen hem niet op — hij
is alleen te vinden voor wie het adres heeft.

Wil je dat later dichtzetten, dan moeten twee dingen mee veranderen:

1. in Supabase de policies op de tabel `items` (nu `using (true)`, dan
   `using (auth.role() = 'authenticated')`);
2. in de app een inlogscherm met Supabase Auth.

De plek waar dat moet staat aangegeven in `src/data/supabase-config.js`.

---

## Mappenstructuur

```
planeterrella-hub/
├── Start-Projecthub.cmd            dubbelklik dit om te beginnen
├── Planeterrella-Projecthub.html   losse versie, alles in één bestand
├── index.html                      startpunt voor de dev-server
├── vite.config.js
├── wrangler.jsonc                  Cloudflare: domein en publicatie
├── scripts/
│   └── maak-losse-html.mjs         bouwt de losse HTML
└── src/
    ├── main.jsx                    start de app
    ├── App.jsx                     navigatie en paginakeuze
    ├── styles/
    │   ├── tokens.css              kleuren, ruimte, typografie (pas hier aan)
    │   ├── base.css                reset, formulieren, rasters
    │   └── componenten.css         alle componentstijlen
    ├── data/
    │   ├── constanten.js           statussen, prioriteiten, types
    │   ├── supabase-config.js      adres en sleutel van de gedeelde database
    │   └── seed/                   de projectinhoud uit jullie bestanden
    │       ├── basis.js            project, team, fases, categorieën
    │       ├── taken.js
    │       ├── eisen.js
    │       ├── bronnen.js
    │       ├── onderzoeken.js
    │       ├── onderdelen.js
    │       ├── documenten.js
    │       ├── beslissingen.js
    │       ├── risicos.js
    │       └── index.js
    ├── lib/
    │   ├── datums.js               datumrekenen (altijd "JJJJ-MM-DD")
    │   ├── opslag.js               lezen en schrijven naar localStorage
    │   ├── schema.js               controleert en repareert ingelezen gegevens
    │   ├── statistiek.js           alle voortgangsberekeningen
    │   ├── zoeken.js               globale zoekfunctie
    │   ├── synchronisatie.js       praten met de gedeelde database
    │   ├── bestanden.js            CSV, downloads, bestand inlezen
    │   └── id.js
    ├── store/
    │   ├── context.js              de React-contexten (apart, zie het commentaar)
    │   ├── ProjectContext.jsx      alle projectgegevens en acties
    │   └── ToastContext.jsx        korte bevestigingsmeldingen
    ├── components/
    │   ├── ui/                     knop, kaart, badge, dialoog, formulier, grafiek
    │   ├── layout/                 zijbalk, kopbalk, paginakop
    │   └── taken/                  takenlijst, filters, formulier, kanban, kalender
    └── pages/                      één bestand per pagina
```

---

## Zelf aanpassen

**Namen van teamleden** → pagina Team, potloodje bij een naam.
Doe dit als eerste; alle taken lopen mee.

**Kleuren van de hub** → `src/styles/tokens.css`. Alle kleuren staan bovenin als
variabelen, één keer voor licht en één keer voor donker.

**Categorieën, fases, statussen** → `src/data/constanten.js` en `src/data/seed/basis.js`.

**Startgegevens** → de bestanden in `src/data/seed/`. Let op: die worden alleen gebruikt
als de hub nog leeg is, of als je op **Instellingen → Startgegevens terugzetten** klikt.

---

## Wat er getest is

Handmatig en met scripts in de browser gecontroleerd:

- taken toevoegen, aanpassen, afvinken, verwijderen, en hetzelfde voor bronnen,
  onderzoeken, eisen, onderdelen, documenten, beslissingen, risico's en teamleden;
- alle filters (persoon, status, categorie, prioriteit, fase, deadline), sorteren en zoeken;
- zoeken met en zonder accenten, met hoofdletters, met meerdere woorden;
- gegevens blijven bestaan na vernieuwen en na opnieuw openen;
- JSON exporteren en importeren, inclusief een kapot bestand, een bestand zonder
  projectgegevens en een bestand met onzinwaarden;
- beschadigde browseropslag: de hub herstelt en bewaart de beschadigde versie;
- een teamlid verwijderen laat de taken staan en zet ze op "niet toegewezen";
- een bron verwijderen haalt de koppelingen uit onderzoeken, onderdelen en beslissingen;
- taken zonder deadline, zonder verantwoordelijke, en twee taken met dezelfde naam;
- 671 taken tegelijk: geen crash, tabel toont er 100 met een knop "toon meer";
- lichte en donkere weergave, en de weergave op 375 px breed (telefoon);
- de productieversie zoals `Start-Projecthub.cmd` hem serveert: opslaan en herladen werken;
- **samenwerken in twee vensters tegelijk**: een taak toevoegen in het ene venster
  verschijnt binnen enkele seconden in het andere, afvinken gaat de andere kant op
  weer mee, verwijderen ook, en overal staat de juiste naam bij;
- hetzelfde tussen de live website en een tweede computer, dus over het internet heen;
- de teller in de zijbalk en alle percentages lopen bij zo'n wijziging vanzelf mee.

Niet getest: of opslaan werkt wanneer je `Planeterrella-Projecthub.html` rechtstreeks
van de schijf opent. Dat verschilt per browser en was in deze omgeving niet na te gaan —
zie de waarschuwing bij optie 2 hierboven.
