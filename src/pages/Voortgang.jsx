import { useMemo } from 'react';
import { PaginaKop } from '../components/layout/Pagina.jsx';
import { Kaart, Stat, Avatar, BalkMetGetal, Badge, Leeg } from '../components/ui/Basis.jsx';
import { Ring, Staven, Legenda } from '../components/ui/Grafiek.jsx';
import { useProject } from '../store/ProjectContext.jsx';
import { projectStatistiek } from '../lib/statistiek.js';
import { toonDatum, vandaagIso, dagenTussen } from '../lib/datums.js';

const STATUS_KLEUREN = {
  todo: 'var(--status-todo)',
  bezig: 'var(--status-bezig)',
  wacht: 'var(--status-wacht)',
  klaar: 'var(--status-klaar)',
};

const PRIO_KLEUREN = {
  laag: 'var(--prio-laag)',
  normaal: 'var(--prio-normaal)',
  hoog: 'var(--prio-hoog)',
  kritiek: 'var(--prio-kritiek)',
};

export function Voortgang() {
  const { staat } = useProject();
  const stat = useMemo(() => projectStatistiek(staat), [staat]);

  const vandaag = vandaagIso();
  const totaleDagen = dagenTussen(staat.project.startdatum, staat.project.einddatum) || 1;
  const verstreken = dagenTussen(staat.project.startdatum, vandaag) ?? 0;
  const tijdPercentage = Math.max(0, Math.min(100, Math.round((verstreken / totaleDagen) * 100)));
  const resterend = dagenTussen(vandaag, staat.project.einddatum);

  /* Loopt het project voor of achter? Vergelijk afgeronde taken met verstreken tijd. */
  const verschil = stat.percentage - tijdPercentage;

  return (
    <>
      <PaginaKop
        titel="Voortgang"
        uitleg="Alle cijfers worden automatisch berekend uit de taken, eisen en risico's die in de hub staan."
      />

      <div className="raster raster-4">
        <Stat label="Project afgerond" waarde={`${stat.percentage}%`} onder={`${stat.klaar} van ${stat.totaal} taken`} icoon="voortgang" />
        <Stat label="Verstreken tijd" waarde={`${tijdPercentage}%`} onder={resterend !== null ? `Nog ${resterend} dagen` : ''} icoon="klok" />
        <Stat
          label="Voor of achter"
          waarde={`${verschil >= 0 ? '+' : ''}${verschil}`}
          onder="Procentpunt taken t.o.v. tijd"
          icoon={verschil >= 0 ? 'vink' : 'waarschuwing'}
          kleur={verschil >= 0 ? 'var(--goed)' : 'var(--gevaar)'}
        />
        <Stat
          label="Verlopen deadlines"
          waarde={stat.verlopen.length}
          icoon="waarschuwing"
          kleur={stat.verlopen.length > 0 ? 'var(--gevaar)' : undefined}
        />
      </div>

      <div className="raster raster-2-smal-breed">
        <Kaart titel="Totale voortgang">
          <div className="rij" style={{ gap: 'var(--r5)', flexWrap: 'wrap' }}>
            <Ring percentage={stat.percentage} grootte={150} onder={`${stat.klaar}/${stat.totaal}`} />
            <div className="vul" style={{ minWidth: 180 }}>
              <Legenda
                rijen={stat.statusVerdeling.map((s) => ({
                  label: s.status.naam,
                  waarde: s.aantal,
                  kleur: STATUS_KLEUREN[s.status.id],
                }))}
              />
            </div>
          </div>

          <div style={{ marginTop: 'var(--r5)' }}>
            <div className="rij mini zacht" style={{ marginBottom: 4 }}>
              <span className="vul">Tijdlijn van het project</span>
              <span>
                {toonDatum(staat.project.startdatum)} — {toonDatum(staat.project.einddatum)}
              </span>
            </div>
            <BalkMetGetal waarde={tijdPercentage} kleur="var(--tekst-dof)" label="Verstreken projecttijd" />
          </div>
        </Kaart>

        <Kaart titel="Voortgang per teamlid">
          <div className="kolom" style={{ gap: 'var(--r4)' }}>
            {stat.perTeamlid.map(({ lid, klaar, totaal, open, percentage, perStatus }) => (
              <div key={lid.id} className="rij" style={{ gap: 12, alignItems: 'flex-start' }}>
                <Avatar lid={lid} />
                <div className="vul kolom" style={{ gap: 4, minWidth: 0 }}>
                  <div className="rij">
                    <span className="klein vet vul afgekapt">{lid.naam}</span>
                    <span className="mini dof">
                      {klaar}/{totaal} af · {open} open
                    </span>
                  </div>
                  <BalkMetGetal waarde={percentage} kleur={lid.kleur} label={`Voortgang ${lid.naam}`} />
                  <div className="rij rij-wrap mini dof" style={{ gap: 8 }}>
                    <span>{perStatus.bezig} bezig</span>
                    <span>· {perStatus.wacht} wachtend</span>
                    <span>· {perStatus.todo} niet begonnen</span>
                  </div>
                </div>
              </div>
            ))}
            {stat.nietToegewezen.length > 0 ? (
              <div className="melding melding-waarschuwing">
                <span className="vul">
                  {stat.nietToegewezen.length} {stat.nietToegewezen.length === 1 ? 'taak is' : 'taken zijn'} aan niemand
                  toegewezen en tellen dus bij niemand mee.
                </span>
              </div>
            ) : null}
          </div>
        </Kaart>
      </div>

      <div className="raster raster-2">
        <Kaart titel="Voortgang per fase">
          <div className="kolom" style={{ gap: 'var(--r3)' }}>
            {stat.perFase.map(({ fase, klaar, totaal, percentage }) => {
              const loopt = fase.start <= vandaag && fase.eind >= vandaag;
              const voorbij = fase.eind < vandaag;
              return (
                <div key={fase.id} className="kolom" style={{ gap: 3 }}>
                  <div className="rij">
                    <span className="klein vet vul">{fase.naam}</span>
                    {loopt ? <Badge kleur="accent">Nu</Badge> : null}
                    {voorbij && percentage < 100 && totaal > 0 ? <Badge kleur="gevaar">Te laat</Badge> : null}
                    <span className="mini dof">
                      {klaar}/{totaal}
                    </span>
                  </div>
                  <BalkMetGetal waarde={percentage} label={`Voortgang ${fase.naam}`} />
                  <span className="mini dof">
                    {toonDatum(fase.start)} — {toonDatum(fase.eind)}
                  </span>
                </div>
              );
            })}
          </div>
        </Kaart>

        <Kaart titel="Voortgang per categorie">
          {stat.perCategorie.length === 0 ? (
            <Leeg titel="Geen categorieën in gebruik" />
          ) : (
            <div className="kolom" style={{ gap: 'var(--r3)' }}>
              {stat.perCategorie.map(({ categorie, klaar, totaal, percentage }) => (
                <div key={categorie.id} className="kolom" style={{ gap: 3 }}>
                  <div className="rij">
                    <span className="klein vet vul" style={{ color: categorie.kleur }}>
                      {categorie.naam}
                    </span>
                    <span className="mini dof">
                      {klaar}/{totaal}
                    </span>
                  </div>
                  <BalkMetGetal waarde={percentage} kleur={categorie.kleur} label={`Voortgang ${categorie.naam}`} />
                </div>
              ))}
            </div>
          )}
        </Kaart>
      </div>

      <div className="raster raster-3">
        <Kaart titel="Taken per prioriteit">
          <Staven
            rijen={stat.perPrioriteit.map((p) => ({
              label: `${p.prioriteit.naam} (${p.open} nog open)`,
              waarde: p.aantal,
              kleur: PRIO_KLEUREN[p.prioriteit.id],
            }))}
          />
        </Kaart>

        <Kaart titel="Eisen">
          <div className="kolom">
            <Ring percentage={stat.eisen.percentage} grootte={110} onder={`${stat.eisen.behaald}/${stat.eisen.tellend}`} />
            <div className="kolom klein zacht" style={{ gap: 3 }}>
              <span>{stat.eisen.totaal} eisen in totaal</span>
              <span>{stat.eisen.behaald} behaald</span>
              <span>{stat.eisen.vervallen} vervallen (tellen niet mee)</span>
            </div>
          </div>
        </Kaart>

        <Kaart titel="Onderzoek &amp; risico’s">
          <div className="kolom" style={{ gap: 'var(--r4)' }}>
            <div className="kolom" style={{ gap: 4 }}>
              <div className="rij">
                <span className="klein vet vul">Onderzoeksvragen beantwoord</span>
                <span className="mini dof">
                  {stat.onderzoek.beantwoord}/{stat.onderzoek.totaal}
                </span>
              </div>
              <BalkMetGetal waarde={stat.onderzoek.percentage} label="Onderzoek beantwoord" />
            </div>
            <div className="kolom" style={{ gap: 4 }}>
              <div className="rij">
                <span className="klein vet vul">Risico’s afgehandeld</span>
                <span className="mini dof">
                  {stat.risicos.totaal - stat.risicos.open}/{stat.risicos.totaal}
                </span>
              </div>
              <BalkMetGetal
                waarde={
                  stat.risicos.totaal === 0
                    ? 0
                    : Math.round(((stat.risicos.totaal - stat.risicos.open) / stat.risicos.totaal) * 100)
                }
                kleur="var(--goed)"
                label="Risico's afgehandeld"
              />
              {stat.risicos.kritiek > 0 ? (
                <span className="mini" style={{ color: 'var(--gevaar)', fontWeight: 620 }}>
                  {stat.risicos.kritiek} kritieke risico’s nog niet opgelost
                </span>
              ) : null}
            </div>
          </div>
        </Kaart>
      </div>
    </>
  );
}
