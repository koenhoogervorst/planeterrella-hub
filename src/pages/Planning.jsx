import { useMemo, useState } from 'react';
import { PaginaKop } from '../components/layout/Pagina.jsx';
import { Kaart, Knop, Badge, BalkMetGetal, Melding } from '../components/ui/Basis.jsx';
import { Bevestig } from '../components/ui/Dialoog.jsx';
import { TaakLijst } from '../components/taken/TaakLijst.jsx';
import { TaakFilters, useTaakFilters } from '../components/taken/TaakFilters.jsx';
import { TaakFormulier } from '../components/taken/TaakFormulier.jsx';
import { Kanban } from '../components/taken/Kanban.jsx';
import { Kalender } from '../components/taken/Kalender.jsx';
import { useProject } from '../store/ProjectContext.jsx';
import { useToast } from '../store/ToastContext.jsx';
import { takenSamenvatting } from '../lib/statistiek.js';
import { toonDatum, vandaagIso, dagenTussen } from '../lib/datums.js';

const WEERGAVEN = [
  { id: 'lijst', naam: 'Takenlijst', icoon: 'lijst' },
  { id: 'kanban', naam: 'Kanban-bord', icoon: 'blok' },
  { id: 'kalender', naam: 'Kalender', icoon: 'kalender' },
  { id: 'fases', naam: 'Strokenplanning', icoon: 'voortgang' },
];

/** Strokenplanning: elke fase als balk op een tijdlijn. */
function Strokenplanning({ fases, taken, project }) {
  const vandaag = vandaagIso();
  const start = project.startdatum;
  const eind = project.einddatum;
  const totaal = dagenTussen(start, eind) || 1;

  function positie(datum) {
    const dagen = dagenTussen(start, datum);
    if (dagen === null) return 0;
    return Math.max(0, Math.min(100, (dagen / totaal) * 100));
  }

  const vandaagPositie = vandaag >= start && vandaag <= eind ? positie(vandaag) : null;

  return (
    <div className="tabel-omhulsel">
      <div className="gantt">
        {fases.map((fase) => {
          const eigen = taken.filter((t) => t.fase === fase.id);
          const samenvatting = takenSamenvatting(eigen);
          const links = positie(fase.start);
          const rechts = positie(fase.eind);
          const breedte = Math.max(2, rechts - links);
          const af = samenvatting.totaal > 0 && samenvatting.percentage === 100;
          return (
            <div key={fase.id} className="gantt-rij">
              <div>
                <div className="gantt-naam" title={fase.naam}>
                  {fase.naam}
                </div>
                <div className="mini dof">
                  {toonDatum(fase.start)} — {toonDatum(fase.eind)}
                </div>
              </div>
              <div className="gantt-spoor">
                {vandaagPositie !== null ? (
                  <div className="gantt-vandaag" style={{ left: `${vandaagPositie}%` }} title={`Vandaag: ${toonDatum(vandaag)}`} />
                ) : null}
                <div
                  className="gantt-blok"
                  data-af={af ? 'true' : 'false'}
                  style={{ left: `${links}%`, width: `${breedte}%` }}
                  title={`${fase.naam}: ${samenvatting.klaar}/${samenvatting.totaal} taken af`}
                >
                  {samenvatting.totaal > 0 ? `${samenvatting.percentage}%` : ''}
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

export function Planning({ bewerkTaak, setBewerkTaak }) {
  const { staat, acties } = useProject();
  const toast = useToast();
  const [weergave, setWeergave] = useState('lijst');
  const [formulierOpen, setFormulierOpen] = useState(false);
  const [teVerwijderen, setTeVerwijderen] = useState(null);
  const filterset = useTaakFilters(staat);

  const vandaag = vandaagIso();
  const actieveTaak = bewerkTaak || null;
  const dialoogOpen = formulierOpen || actieveTaak !== null;

  const faseOverzicht = useMemo(
    () =>
      staat.fases.map((fase) => {
        const eigen = staat.taken.filter((t) => t.fase === fase.id);
        const loopt = fase.start <= vandaag && fase.eind >= vandaag;
        const voorbij = fase.eind < vandaag;
        return { fase, ...takenSamenvatting(eigen), loopt, voorbij };
      }),
    [staat.fases, staat.taken, vandaag],
  );

  const achterlopend = faseOverzicht.filter((f) => f.voorbij && f.totaal > 0 && f.percentage < 100);

  function sluitFormulier() {
    setFormulierOpen(false);
    setBewerkTaak(null);
  }

  function opslaan(waarden) {
    if (actieveTaak) {
      acties.taakBijwerken(actieveTaak.id, waarden, waarden.titel);
      toast.goed('Taak bijgewerkt');
    } else {
      acties.taakToevoegen(waarden);
      toast.goed('Taak toegevoegd');
    }
    sluitFormulier();
  }

  return (
    <>
      <PaginaKop
        titel="Planning"
        uitleg="De acht projectfases uit de strokenplanning, met alle taken die eronder vallen."
        acties={
          <Knop soort="primair" icoon="plus" onClick={() => setFormulierOpen(true)}>
            Nieuwe taak
          </Knop>
        }
      />

      <Melding soort="waarschuwing">
        De data hieronder komen uit <strong>Planning_Noorderlicht_Opstelling.xlsx</strong>. De tabel in hoofdstuk 6 van
        het plan van aanpak noemt andere periodes. Zie de taak “Tegenstrijdige einddata oplossen”.
      </Melding>

      {achterlopend.length > 0 ? (
        <Melding soort="gevaar">
          <strong>{achterlopend.length}</strong> {achterlopend.length === 1 ? 'fase is' : 'fases zijn'} voorbij de
          einddatum terwijl er nog taken open staan: {achterlopend.map((f) => f.fase.naam).join(', ')}.
        </Melding>
      ) : null}

      <div className="raster raster-4">
        {faseOverzicht.map(({ fase, klaar, totaal, percentage, loopt, voorbij }) => (
          <div key={fase.id} className="kaart">
            <div className="stat" style={{ padding: 'var(--r3) var(--r4)' }}>
              <div className="rij" style={{ gap: 6 }}>
                <span className="klein vet vul afgekapt" title={fase.naam}>
                  {fase.naam}
                </span>
                {loopt ? <Badge kleur="accent">Nu</Badge> : null}
                {voorbij && percentage < 100 ? <Badge kleur="gevaar">Te laat</Badge> : null}
              </div>
              <span className="mini dof">
                {toonDatum(fase.start)} — {toonDatum(fase.eind)}
              </span>
              <div style={{ marginTop: 6 }}>
                <BalkMetGetal waarde={percentage} label={`Voortgang ${fase.naam}`} />
              </div>
              <span className="mini dof">
                {klaar} van {totaal} taken af
              </span>
            </div>
          </div>
        ))}
      </div>

      <div className="rij rij-wrap">
        {WEERGAVEN.map((w) => (
          <Knop
            key={w.id}
            soort={weergave === w.id ? 'primair' : 'gewoon'}
            icoon={w.icoon}
            onClick={() => setWeergave(w.id)}
          >
            {w.naam}
          </Knop>
        ))}
      </div>

      {weergave === 'fases' ? (
        <Kaart titel="Strokenplanning">
          <Strokenplanning fases={staat.fases} taken={staat.taken} project={staat.project} />
          <p className="mini dof" style={{ marginTop: 'var(--r3)' }}>
            De rode lijn is vandaag. Het percentage in de balk is het aandeel afgeronde taken in die fase.
          </p>
        </Kaart>
      ) : null}

      {weergave === 'kalender' ? (
        <Kaart titel="Kalender en dagplanning">
          <Kalender
            taken={staat.taken}
            fases={staat.fases}
            teamleden={staat.teamleden}
            categorieen={staat.categorieen}
            project={staat.project}
            onOpen={setBewerkTaak}
            beginDatum={vandaag < staat.project.startdatum ? staat.project.startdatum : vandaag}
          />
        </Kaart>
      ) : null}

      {weergave === 'kanban' || weergave === 'lijst' ? (
        <>
          <Kaart>
            <TaakFilters staat={staat} {...filterset} setSortering={weergave === 'lijst' ? filterset.setSortering : null} />
          </Kaart>

          {weergave === 'kanban' ? (
            <Kanban
              taken={filterset.gefilterd}
              onWijzigStatus={(taak, status) => acties.taakStatus(taak.id, status, taak.titel)}
              onOpen={setBewerkTaak}
            />
          ) : (
            <Kaart strak titel={`${filterset.gefilterd.length} taken`}>
              <TaakLijst
                taken={filterset.gefilterd}
                onWijzigStatus={(taak, status) => acties.taakStatus(taak.id, status, taak.titel)}
                onBewerk={setBewerkTaak}
                onVerwijder={setTeVerwijderen}
              />
            </Kaart>
          )}
        </>
      ) : null}

      <TaakFormulier open={dialoogOpen} taak={actieveTaak} onSluit={sluitFormulier} onOpslaan={opslaan} />

      <Bevestig
        open={teVerwijderen !== null}
        titel="Taak verwijderen"
        tekst={teVerwijderen ? `Weet je zeker dat je "${teVerwijderen.titel}" wilt verwijderen?` : ''}
        onBevestig={() => {
          acties.verwijderen('taken', teVerwijderen.id, `Taak verwijderd: ${teVerwijderen.titel}`);
          toast.goed('Taak verwijderd');
          setTeVerwijderen(null);
        }}
        onAnnuleer={() => setTeVerwijderen(null)}
      />
    </>
  );
}
