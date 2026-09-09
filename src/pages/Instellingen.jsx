import { useRef, useState } from 'react';
import { PaginaKop } from '../components/layout/Pagina.jsx';
import { Kaart, Knop, Melding, Badge } from '../components/ui/Basis.jsx';
import { Bevestig, Dialoog } from '../components/ui/Dialoog.jsx';
import { Invoer, Tekstvak } from '../components/ui/Formulier.jsx';
import { useProject } from '../store/ProjectContext.jsx';
import { useToast } from '../store/ToastContext.jsx';
import { downloadTekst, leesBestand, datumStempel } from '../lib/bestanden.js';
import { leesKapotteBackup, wisKapotteBackup } from '../lib/opslag.js';
import { DATA_VERSIE } from '../data/constanten.js';

export function Instellingen({ opslagWerkt }) {
  const { staat, acties } = useProject();
  const toast = useToast();
  const invoerRef = useRef(null);
  const [importVoorbeeld, setImportVoorbeeld] = useState(null);
  const [bevestiging, setBevestiging] = useState(null);
  const [projectOpen, setProjectOpen] = useState(false);
  const [projectWaarden, setProjectWaarden] = useState(staat.project);

  const kapotteBackup = leesKapotteBackup();

  const tellingen = [
    { label: 'Taken', aantal: staat.taken.length },
    { label: 'Eisen', aantal: staat.eisen.length },
    { label: 'Bronnen', aantal: staat.bronnen.length },
    { label: 'Onderzoeken', aantal: staat.onderzoeken.length },
    { label: 'Onderdelen', aantal: staat.onderdelen.length },
    { label: 'Documenten', aantal: staat.documenten.length },
    { label: 'Beslissingen', aantal: staat.beslissingen.length },
    { label: 'Risico’s', aantal: staat.risicos.length },
    { label: 'Teamleden', aantal: staat.teamleden.length },
  ];

  function exporteerJson() {
    downloadTekst(
      `planeterrella-hub-backup-${datumStempel()}.json`,
      JSON.stringify(staat, null, 2),
      'application/json;charset=utf-8',
    );
    toast.goed('Back-up gedownload');
  }

  async function kiesBestand(e) {
    const bestand = e.target.files && e.target.files[0];
    /* Meteen leegmaken, anders kun je hetzelfde bestand niet nog eens kiezen. */
    e.target.value = '';
    if (!bestand) return;

    try {
      const tekst = await leesBestand(bestand);
      const data = JSON.parse(tekst);
      if (!data || typeof data !== 'object') {
        throw new Error('Het bestand bevat geen geldig object.');
      }
      const aantallen = [
        ['taken', data.taken],
        ['eisen', data.eisen],
        ['bronnen', data.bronnen],
        ['onderzoeken', data.onderzoeken],
        ['onderdelen', data.onderdelen],
        ['documenten', data.documenten],
        ['beslissingen', data.beslissingen],
        ['risicos', data.risicos],
        ['teamleden', data.teamleden],
      ].map(([naam, lijst]) => ({
        naam,
        /* Alleen echte objecten tellen mee — losse tekst of null wordt bij het
           inlezen toch overgeslagen, dus dan klopt het voorbeeld niet. */
        aantal: Array.isArray(lijst) ? lijst.filter((i) => i && typeof i === 'object').length : 0,
      }));

      if (aantallen.every((a) => a.aantal === 0)) {
        toast.fout('Dit bestand bevat geen projectgegevens die de hub herkent.');
        return;
      }

      setImportVoorbeeld({ data, aantallen, bestandsnaam: bestand.name });
    } catch (fout) {
      toast.fout(`Importeren mislukt: ${fout.message || 'het bestand is geen geldige JSON.'}`);
    }
  }

  function bevestigImport() {
    const schoon = acties.allesVervangen(importVoorbeeld.data);
    toast.goed(`Geïmporteerd: ${schoon.taken.length} taken, ${schoon.bronnen.length} bronnen`);
    setImportVoorbeeld(null);
  }

  function slaProjectOp() {
    acties.projectBijwerken(projectWaarden);
    toast.goed('Projectgegevens bijgewerkt');
    setProjectOpen(false);
  }

  return (
    <>
      <PaginaKop titel="Instellingen &amp; back-up" uitleg="Gegevens exporteren, importeren en de hub opnieuw instellen." />

      {!opslagWerkt ? (
        <Melding soort="gevaar">
          <strong>Let op:</strong> deze browser laat geen lokale opslag toe. Alles wat je invult verdwijnt zodra je de
          pagina sluit. Exporteer je werk regelmatig naar JSON.
        </Melding>
      ) : (
        <Melding soort="goed">
          Gegevens worden automatisch opgeslagen in deze browser (localStorage), ongeveer een halve seconde nadat je iets
          verandert. Ze blijven staan als je de pagina vernieuwt of de computer opnieuw opstart.
        </Melding>
      )}

      <div className="raster raster-2">
        <Kaart titel="Wat staat er nu in de hub?">
          <div className="raster raster-3" style={{ gap: 'var(--r3)' }}>
            {tellingen.map((t) => (
              <div key={t.label} className="kolom" style={{ gap: 0 }}>
                <span className="vet" style={{ fontSize: 'var(--tekst-xl)' }}>
                  {t.aantal}
                </span>
                <span className="mini dof">{t.label}</span>
              </div>
            ))}
          </div>
          <p className="mini dof" style={{ marginTop: 'var(--r4)' }}>
            Dataversie {staat.versie} · opslagsleutel <span className="mono">planeterrella-hub</span>
          </p>
        </Kaart>

        <Kaart titel="Back-up maken en terugzetten">
          <div className="kolom">
            <p className="klein zacht" style={{ margin: 0 }}>
              De hub slaat alles op in deze browser. Werk je op een andere laptop of wil je de gegevens delen met je
              projectgroep, gebruik dan de JSON-export en -import.
            </p>

            <div className="rij rij-wrap">
              <Knop soort="primair" icoon="download" onClick={exporteerJson}>
                Alles exporteren (JSON)
              </Knop>
              <Knop icoon="upload" onClick={() => invoerRef.current?.click()}>
                JSON importeren
              </Knop>
              <input
                ref={invoerRef}
                type="file"
                accept="application/json,.json"
                onChange={kiesBestand}
                aria-label="Back-upbestand kiezen"
                style={{ display: 'none' }}
                aria-hidden="true"
                tabIndex={-1}
              />
            </div>

            <Melding soort="waarschuwing">
              Importeren <strong>vervangt</strong> alles wat er nu in de hub staat. Maak eerst een export als je je
              huidige werk wilt bewaren.
            </Melding>

            <p className="mini dof" style={{ margin: 0 }}>
              CSV-export van taken en bronnen zit op de pagina’s Taken en Bronnen zelf, zodat je precies exporteert wat
              je gefilterd hebt.
            </p>
          </div>
        </Kaart>
      </div>

      <Kaart titel="Projectgegevens">
        <div className="kolom">
          <div className="detail-lijst">
            <div className="detail-regel">
              <span className="detail-term">Projectnaam</span>
              <span>{staat.project.naam}</span>
            </div>
            <div className="detail-regel">
              <span className="detail-term">Ondertitel</span>
              <span>{staat.project.ondertitel}</span>
            </div>
            <div className="detail-regel">
              <span className="detail-term">School</span>
              <span>{staat.project.school}</span>
            </div>
            <div className="detail-regel">
              <span className="detail-term">Opleiding</span>
              <span>{staat.project.opleiding}</span>
            </div>
            <div className="detail-regel">
              <span className="detail-term">Kerntaak</span>
              <span>{staat.project.kerntaak}</span>
            </div>
            <div className="detail-regel">
              <span className="detail-term">Klas</span>
              <span>{staat.project.klas}</span>
            </div>
            <div className="detail-regel">
              <span className="detail-term">Opdrachtgever</span>
              <span>{staat.project.opdrachtgever}</span>
            </div>
            <div className="detail-regel">
              <span className="detail-term">Looptijd</span>
              <span>
                {staat.project.startdatum} t/m {staat.project.einddatum}
              </span>
            </div>
          </div>
          <div className="rij">
            <span className="vul" />
            <Knop
              icoon="potlood"
              onClick={() => {
                setProjectWaarden(staat.project);
                setProjectOpen(true);
              }}
            >
              Projectgegevens aanpassen
            </Knop>
          </div>
        </div>
      </Kaart>

      {kapotteBackup ? (
        <Kaart titel="Beschadigde gegevens gevonden">
          <div className="kolom">
            <Melding soort="waarschuwing">
              Bij het opstarten waren de opgeslagen gegevens beschadigd. De originele tekst is bewaard, zodat je er nog
              bij kunt.
            </Melding>
            <Tekstvak label="Bewaarde inhoud" value={kapotteBackup.slice(0, 4000)} readOnly rijen={6} breed />
            <div className="rij">
              <Knop
                icoon="download"
                onClick={() => {
                  downloadTekst(`planeterrella-beschadigd-${datumStempel()}.txt`, kapotteBackup);
                  toast.goed('Beschadigde gegevens gedownload');
                }}
              >
                Downloaden
              </Knop>
              <Knop
                soort="stil"
                icoon="prullenbak"
                onClick={() => {
                  wisKapotteBackup();
                  toast.goed('Beschadigde kopie verwijderd');
                }}
              >
                Kopie verwijderen
              </Knop>
            </div>
          </div>
        </Kaart>
      ) : null}

      <Kaart titel="Opnieuw beginnen">
        <div className="kolom">
          <Melding soort="gevaar">
            Deze twee knoppen gooien je huidige werk weg. Exporteer eerst een back-up.
          </Melding>
          <div className="rij rij-wrap">
            <Knop
              icoon="upload"
              onClick={() =>
                setBevestiging({
                  titel: 'Startgegevens terugzetten',
                  tekst:
                    'Alles in de hub wordt vervangen door de startgegevens uit de projectbestanden. Je eigen wijzigingen gaan verloren.',
                  label: 'Terugzetten',
                  actie: () => {
                    acties.terugNaarStart();
                    toast.goed('Startgegevens teruggezet');
                  },
                })
              }
            >
              Startgegevens terugzetten
            </Knop>
            <Knop
              soort="gevaar"
              icoon="prullenbak"
              onClick={() =>
                setBevestiging({
                  titel: 'Alles wissen',
                  tekst:
                    'Alle taken, eisen, bronnen, onderzoeken, onderdelen, documenten, beslissingen en risico’s worden verwijderd. Het team, de fases en de categorieën blijven staan.',
                  label: 'Alles wissen',
                  actie: () => {
                    acties.allesLeegmaken();
                    toast.goed('Hub leeggemaakt');
                  },
                })
              }
            >
              Alle inhoud wissen
            </Knop>
          </div>
        </div>
      </Kaart>

      <Kaart titel="Hoe deze hub gegevens bewaart">
        <div className="kolom klein zacht">
          <p style={{ margin: 0 }}>
            De gegevens staan in <strong>localStorage</strong> van je browser, onder de sleutel{' '}
            <span className="mono">planeterrella-hub</span>. Dat is bewust gekozen: de dataset is klein (een paar honderd
            kilobytes), er worden geen bestanden of afbeeldingen in opgeslagen, en localStorage werkt synchroon. Dat
            scheelt veel complexiteit ten opzichte van IndexedDB, zonder dat je er iets voor inlevert.
          </p>
          <p style={{ margin: 0 }}>Wat dat in de praktijk betekent:</p>
          <ul style={{ margin: 0 }}>
            <li>De gegevens blijven staan als je de pagina vernieuwt of de computer opnieuw opstart.</li>
            <li>Ze staan alleen in <strong>deze</strong> browser op <strong>deze</strong> computer.</li>
            <li>
              Werken jullie met vier personen op verschillende laptops, gebruik dan de JSON-export en -import om de
              gegevens uit te wisselen. Spreek af wie de hoofdversie bijhoudt.
            </li>
            <li>In een privévenster kan de browser opslag blokkeren. De hub blijft dan werken maar bewaart niets.</li>
            <li>
              Beschadigde gegevens worden bij het opstarten gedetecteerd, apart bewaard en vervangen door de
              startgegevens — de hub loopt daar niet op vast.
            </li>
          </ul>
        </div>
      </Kaart>

      {/* Voorbeeld van wat er geïmporteerd wordt */}
      <Dialoog
        open={importVoorbeeld !== null}
        titel="Import controleren"
        onSluit={() => setImportVoorbeeld(null)}
        voet={
          <>
            <Knop onClick={() => setImportVoorbeeld(null)}>Annuleren</Knop>
            <Knop soort="primair" icoon="upload" onClick={bevestigImport}>
              Importeren en vervangen
            </Knop>
          </>
        }
      >
        {importVoorbeeld ? (
          <>
            <p className="klein">
              Bestand: <span className="mono">{importVoorbeeld.bestandsnaam}</span>
            </p>
            <div className="rij rij-wrap" style={{ gap: 6 }}>
              {importVoorbeeld.aantallen.map((a) => (
                <Badge key={a.naam} kleur={a.aantal > 0 ? 'accent' : 'neutraal'}>
                  {a.aantal} {a.naam}
                </Badge>
              ))}
            </div>
            <Melding soort="waarschuwing">
              Dit vervangt de huidige inhoud van de hub ({staat.taken.length} taken, {staat.bronnen.length} bronnen).
            </Melding>
            {importVoorbeeld.data.versie !== DATA_VERSIE ? (
              <Melding soort="info">
                Dit bestand komt uit dataversie {String(importVoorbeeld.data.versie ?? 'onbekend')}; de hub gebruikt
                versie {DATA_VERSIE}. Ontbrekende velden worden automatisch aangevuld.
              </Melding>
            ) : null}
          </>
        ) : null}
      </Dialoog>

      {/* Projectgegevens aanpassen */}
      <Dialoog
        open={projectOpen}
        titel="Projectgegevens aanpassen"
        onSluit={() => setProjectOpen(false)}
        breed
        voet={
          <>
            <Knop onClick={() => setProjectOpen(false)}>Annuleren</Knop>
            <Knop soort="primair" icoon="vink" onClick={slaProjectOp}>
              Opslaan
            </Knop>
          </>
        }
      >
        <Invoer
          label="Projectnaam"
          value={projectWaarden.naam}
          onChange={(e) => setProjectWaarden((h) => ({ ...h, naam: e.target.value }))}
          breed
        />
        <Invoer
          label="Ondertitel"
          value={projectWaarden.ondertitel}
          onChange={(e) => setProjectWaarden((h) => ({ ...h, ondertitel: e.target.value }))}
          breed
        />
        <div className="raster raster-2">
          <Invoer
            label="School"
            value={projectWaarden.school}
            onChange={(e) => setProjectWaarden((h) => ({ ...h, school: e.target.value }))}
          />
          <Invoer
            label="Klas"
            value={projectWaarden.klas}
            onChange={(e) => setProjectWaarden((h) => ({ ...h, klas: e.target.value }))}
          />
          <Invoer
            label="Opleiding"
            value={projectWaarden.opleiding}
            onChange={(e) => setProjectWaarden((h) => ({ ...h, opleiding: e.target.value }))}
          />
          <Invoer
            label="Kerntaak"
            value={projectWaarden.kerntaak}
            onChange={(e) => setProjectWaarden((h) => ({ ...h, kerntaak: e.target.value }))}
          />
          <Invoer
            label="Startdatum"
            type="date"
            value={projectWaarden.startdatum}
            onChange={(e) => setProjectWaarden((h) => ({ ...h, startdatum: e.target.value }))}
          />
          <Invoer
            label="Einddatum"
            type="date"
            value={projectWaarden.einddatum}
            onChange={(e) => setProjectWaarden((h) => ({ ...h, einddatum: e.target.value }))}
          />
        </div>
        <Invoer
          label="Opdrachtgever"
          value={projectWaarden.opdrachtgever}
          onChange={(e) => setProjectWaarden((h) => ({ ...h, opdrachtgever: e.target.value }))}
          breed
        />
      </Dialoog>

      <Bevestig
        open={bevestiging !== null}
        titel={bevestiging?.titel || ''}
        tekst={bevestiging?.tekst || ''}
        bevestigLabel={bevestiging?.label}
        onBevestig={() => {
          bevestiging.actie();
          setBevestiging(null);
        }}
        onAnnuleer={() => setBevestiging(null)}
      />
    </>
  );
}
