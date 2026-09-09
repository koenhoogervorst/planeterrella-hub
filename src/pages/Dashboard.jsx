import { useMemo } from 'react';
import { PaginaKop } from '../components/layout/Pagina.jsx';
import {
  Kaart,
  Stat,
  Knop,
  Badge,
  Avatar,
  BalkMetGetal,
  Melding,
  Leeg,
  HerkomstLabel,
} from '../components/ui/Basis.jsx';
import { Ring, Legenda } from '../components/ui/Grafiek.jsx';
import { TaakRegel } from '../components/taken/TaakLijst.jsx';
import { Icoon } from '../components/ui/Icoon.jsx';
import { useProject, useOpzoek } from '../store/ProjectContext.jsx';
import { projectStatistiek, komendeDeadlines, geblokkeerdeTaken } from '../lib/statistiek.js';
import { toonDatum, deadlineTekst, vandaagIso, dagenTussen } from '../lib/datums.js';

const STATUS_KLEUREN = {
  todo: 'var(--status-todo)',
  bezig: 'var(--status-bezig)',
  wacht: 'var(--status-wacht)',
  klaar: 'var(--status-klaar)',
};

function relatieveTijd(iso) {
  const tijd = Date.parse(iso);
  if (Number.isNaN(tijd)) return '';
  const seconden = Math.round((Date.now() - tijd) / 1000);
  if (seconden < 60) return 'zojuist';
  if (seconden < 3600) return `${Math.floor(seconden / 60)} min geleden`;
  if (seconden < 86400) return `${Math.floor(seconden / 3600)} uur geleden`;
  const dagen = Math.floor(seconden / 86400);
  if (dagen === 1) return 'gisteren';
  if (dagen < 30) return `${dagen} dagen geleden`;
  return toonDatum(new Date(tijd).toISOString().slice(0, 10));
}

export function Dashboard({ gaNaar, opTaak }) {
  const { staat } = useProject();
  const opzoek = useOpzoek();
  const stat = useMemo(() => projectStatistiek(staat), [staat]);
  const deadlines = useMemo(() => komendeDeadlines(staat.taken, 6), [staat.taken]);
  const geblokkeerd = useMemo(() => geblokkeerdeTaken(staat.taken), [staat.taken]);

  const vandaag = vandaagIso();
  const huidigeFases = staat.fases.filter((f) => f.start && f.eind && f.start <= vandaag && f.eind >= vandaag);

  const dagenTotEind = dagenTussen(vandaag, staat.project.einddatum);
  const totaleDagen = dagenTussen(staat.project.startdatum, staat.project.einddatum);
  const verstreken = dagenTussen(staat.project.startdatum, vandaag);
  const tijdPercentage =
    totaleDagen && totaleDagen > 0 ? Math.max(0, Math.min(100, Math.round((verstreken / totaleDagen) * 100))) : 0;

  const voorstellen = staat.taken.filter((t) => t.herkomst === 'voorstel' && t.status !== 'klaar');

  return (
    <>
      <PaginaKop
        titel="Dashboard"
        uitleg={`${staat.project.naam} — ${staat.project.kerntaak}`}
        acties={
          <>
            <Knop icoon="taken" onClick={() => gaNaar('taken')}>
              Naar taken
            </Knop>
            <Knop soort="primair" icoon="kalender" onClick={() => gaNaar('planning')}>
              Naar planning
            </Knop>
          </>
        }
      />

      {stat.verlopen.length > 0 ? (
        <Melding soort="gevaar" actie={<Knop klein onClick={() => gaNaar('taken')}>Bekijken</Knop>}>
          <strong>
            {stat.verlopen.length} {stat.verlopen.length === 1 ? 'taak is' : 'taken zijn'} over de deadline.
          </strong>{' '}
          De vroegste liep af op {toonDatum(stat.verlopen[0].deadline)}.
        </Melding>
      ) : null}

      <div className="raster raster-4">
        <Stat
          label="Projectvoortgang"
          waarde={`${stat.percentage}%`}
          onder={`${stat.klaar} van ${stat.totaal} taken afgerond`}
          icoon="voortgang"
        />
        <Stat label="Openstaande taken" waarde={stat.open} onder={`${stat.perStatus.bezig} bezig, ${stat.perStatus.wacht} wachtend`} icoon="taken" />
        <Stat
          label="Hoge prioriteit"
          waarde={stat.hogePrioriteitOpen.length}
          onder="Hoog of kritiek en nog niet af"
          icoon="vlag"
          kleur={stat.hogePrioriteitOpen.length > 0 ? 'var(--prio-hoog)' : undefined}
        />
        <Stat
          label="Deadlines deze week"
          waarde={stat.dezeWeek.length}
          onder={dagenTotEind !== null ? `Nog ${dagenTotEind} dagen tot oplevering` : ''}
          icoon="klok"
          kleur={stat.dezeWeek.length > 0 ? 'var(--waarschuwing)' : undefined}
        />
      </div>

      <div className="raster raster-2-breed-smal">
        <Kaart titel="Voortgang van het project">
          <div className="rij" style={{ gap: 'var(--r5)', flexWrap: 'wrap' }}>
            <Ring percentage={stat.percentage} onder={`${stat.klaar}/${stat.totaal} taken`} />
            <div className="vul kolom" style={{ minWidth: 190 }}>
              <Legenda
                rijen={stat.statusVerdeling.map((s) => ({
                  label: s.status.naam,
                  waarde: s.aantal,
                  kleur: STATUS_KLEUREN[s.status.id],
                }))}
              />
              <div className="kolom" style={{ gap: 4, marginTop: 6 }}>
                <div className="rij mini zacht">
                  <span className="vul">Verstreken projecttijd</span>
                </div>
                <BalkMetGetal waarde={tijdPercentage} kleur="var(--tekst-dof)" label="Verstreken projecttijd" />
                <span className="mini dof">
                  {toonDatum(staat.project.startdatum)} — {toonDatum(staat.project.einddatum)}
                </span>
              </div>
            </div>
          </div>
        </Kaart>

        <Kaart
          titel="Taken per teamlid"
          actie={
            <Knop soort="stil" klein icoon="team" onClick={() => gaNaar('team')}>
              Team
            </Knop>
          }
        >
          <div className="kolom" style={{ gap: 'var(--r3)' }}>
            {stat.perTeamlid.map(({ lid, klaar, totaal, percentage }) => (
              <div key={lid.id} className="rij" style={{ gap: 10 }}>
                <Avatar lid={lid} />
                <div className="vul kolom" style={{ gap: 3 }}>
                  <div className="rij">
                    <span className="klein vet vul afgekapt">{lid.naam}</span>
                    <span className="mini dof">
                      {klaar}/{totaal}
                    </span>
                  </div>
                  <BalkMetGetal waarde={percentage} kleur={lid.kleur} label={`Voortgang ${lid.naam}`} />
                </div>
              </div>
            ))}
            {stat.nietToegewezen.length > 0 ? (
              <div className="melding melding-waarschuwing">
                <Icoon naam="waarschuwing" grootte={15} />
                <span>
                  {stat.nietToegewezen.length}{' '}
                  {stat.nietToegewezen.length === 1 ? 'taak heeft' : 'taken hebben'} nog geen verantwoordelijke.
                </span>
              </div>
            ) : null}
          </div>
        </Kaart>
      </div>

      <div className="raster raster-3">
        <Kaart
          titel="Eerstvolgende deadlines"
          strak
          actie={
            <Knop soort="stil" klein icoon="kalender" onClick={() => gaNaar('planning')}>
              Kalender
            </Knop>
          }
        >
          {deadlines.length === 0 ? (
            <Leeg titel="Geen deadlines" tekst="Er staan geen openstaande taken met een datum." />
          ) : (
            deadlines.map((taak) => (
              <button key={taak.id} type="button" className="zoek-treffer" onClick={() => opTaak(taak)}>
                <div className="rij" style={{ gap: 8 }}>
                  <span className="vul klein vet afgekapt">{taak.titel}</span>
                  <span
                    className="mini vet"
                    style={{
                      whiteSpace: 'nowrap',
                      color:
                        deadlineTekst(taak.deadline).includes('te laat')
                          ? 'var(--gevaar)'
                          : 'var(--tekst-zacht)',
                    }}
                  >
                    {toonDatum(taak.deadline)}
                  </span>
                </div>
                <div className="rij rij-wrap mini dof" style={{ gap: 8 }}>
                  <span>{opzoek.lidNaam(taak.toegewezenAan)}</span>
                  <span>· {deadlineTekst(taak.deadline)}</span>
                </div>
              </button>
            ))
          )}
        </Kaart>

        <Kaart
          titel="Hoge prioriteit"
          strak
          actie={
            <Knop soort="stil" klein icoon="taken" onClick={() => gaNaar('taken')}>
              Alle taken
            </Knop>
          }
        >
          {stat.hogePrioriteitOpen.length === 0 ? (
            <Leeg titel="Niets urgents" tekst="Geen openstaande taken met hoge of kritieke prioriteit." />
          ) : (
            stat.hogePrioriteitOpen.slice(0, 6).map((taak) => <TaakRegel key={taak.id} taak={taak} onKlik={opTaak} />)
          )}
        </Kaart>

        <Kaart titel="Recente wijzigingen" strak>
          {staat.activiteit.length === 0 ? (
            <Leeg titel="Nog geen wijzigingen" tekst="Zodra je iets aanpast verschijnt het hier." />
          ) : (
            staat.activiteit.slice(0, 8).map((regel) => (
              <div key={regel.id} className="zoek-treffer" style={{ cursor: 'default' }}>
                <span className="klein">{regel.tekst}</span>
                <span className="mini dof">
                  {regel.doorWie ? <span className="activiteit-wie">{regel.doorWie}</span> : null}
                  {regel.doorWie ? ' · ' : ''}
                  {relatieveTijd(regel.tijd)}
                </span>
              </div>
            ))
          )}
        </Kaart>
      </div>

      <div className="raster raster-2">
        <Kaart titel="Belangrijke projectinformatie">
          <div className="kolom">
            <div className="rij rij-wrap" style={{ gap: 6 }}>
              {huidigeFases.length > 0 ? (
                huidigeFases.map((f) => (
                  <Badge key={f.id} kleur="accent">
                    Nu bezig: {f.naam}
                  </Badge>
                ))
              ) : (
                <Badge kleur="neutraal">Geen fase actief vandaag</Badge>
              )}
            </div>

            <dl className="detail-lijst" style={{ margin: 0 }}>
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
                <span className="detail-term">Opdrachtgever</span>
                <span>{staat.project.opdrachtgever}</span>
              </div>
            </dl>

            <div className="raster raster-3" style={{ gap: 'var(--r3)' }}>
              <div className="kolom" style={{ gap: 2 }}>
                <span className="mini dof">Eisen behaald</span>
                <span className="vet">
                  {stat.eisen.behaald}/{stat.eisen.tellend}
                </span>
              </div>
              <div className="kolom" style={{ gap: 2 }}>
                <span className="mini dof">Onderzoek beantwoord</span>
                <span className="vet">
                  {stat.onderzoek.beantwoord}/{stat.onderzoek.totaal}
                </span>
              </div>
              <div className="kolom" style={{ gap: 2 }}>
                <span className="mini dof">Open risico’s</span>
                <span className="vet" style={{ color: stat.risicos.kritiek > 0 ? 'var(--gevaar)' : undefined }}>
                  {stat.risicos.open}
                  {stat.risicos.kritiek > 0 ? ` (${stat.risicos.kritiek} kritiek)` : ''}
                </span>
              </div>
            </div>
          </div>
        </Kaart>

        <Kaart titel="Aandachtspunten">
          <div className="kolom">
            {voorstellen.length > 0 ? (
              <Melding soort="waarschuwing">
                <strong>{voorstellen.length} voorgestelde taken</strong> staan nog open. Dat zijn aanvullingen die niet
                letterlijk in jullie projectbestanden staan — controleer of jullie ze willen houden. Ze zijn overal
                gemarkeerd met <HerkomstLabel herkomst="voorstel" kort />.
              </Melding>
            ) : null}

            {geblokkeerd.length > 0 ? (
              <div className="kolom" style={{ gap: 6 }}>
                <span className="klein vet zacht">
                  {geblokkeerd.length} {geblokkeerd.length === 1 ? 'taak wacht' : 'taken wachten'} op ander werk
                </span>
                {geblokkeerd.slice(0, 4).map(({ taak, blokkers }) => (
                  <button
                    key={taak.id}
                    type="button"
                    className="zoek-treffer"
                    onClick={() => opTaak(taak)}
                    style={{ border: '1px solid var(--lijn)', borderRadius: 'var(--rond)' }}
                  >
                    <span className="klein vet">{taak.titel}</span>
                    <span className="mini dof">Wacht op: {blokkers.map((b) => b.titel).join(', ')}</span>
                  </button>
                ))}
              </div>
            ) : null}

            {stat.risicos.kritiek > 0 ? (
              <Melding soort="gevaar" actie={<Knop klein onClick={() => gaNaar('risicos')}>Bekijken</Knop>}>
                Er staan {stat.risicos.kritiek} kritieke risico’s open, waaronder implosiegevaar en hoogspanning.
              </Melding>
            ) : null}

            {voorstellen.length === 0 && geblokkeerd.length === 0 && stat.risicos.kritiek === 0 ? (
              <Leeg titel="Alles onder controle" tekst="Geen blokkades, voorstellen of kritieke risico’s." />
            ) : null}
          </div>
        </Kaart>
      </div>
    </>
  );
}
