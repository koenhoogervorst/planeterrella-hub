/** Maandkalender met een dagplanning eronder.
 *
 *  De kalender laat per dag zien wat er loopt, niet alleen wat er die dag af moet.
 *  Klik op een dag en je ziet per teamlid wat diegene kan oppakken, wat af moet
 *  en waar iemand op wacht.
 */

import { useMemo, useState } from 'react';
import { Knop, Avatar, Badge, PrioriteitBadge, Leeg } from '../ui/Basis.jsx';
import { Keuze } from '../ui/Formulier.jsx';
import { Icoon } from '../ui/Icoon.jsx';
import {
  DAGLABELS,
  maandRaster,
  toonMaandJaar,
  toonDatumLang,
  vandaagIso,
  naarDate,
} from '../../lib/datums.js';
import { dagOverzicht, dagPerTeamlid, tellingenPerDag, isWeekend } from '../../lib/dagplanning.js';

/** Eén taakregel in het dagpaneel. */
function DagTaak({ taak, wacht, onOpen, categorie }) {
  return (
    <button type="button" className="dagtaak" onClick={() => onOpen(taak)}>
      <span className="dagtaak-titel">{taak.titel}</span>
      <span className="rij rij-wrap" style={{ gap: 5 }}>
        <PrioriteitBadge prioriteit={taak.prioriteit} />
        {categorie ? (
          <span className="mini" style={{ color: categorie.kleur, fontWeight: 650 }}>
            {categorie.naam}
          </span>
        ) : null}
        {wacht && wacht.length > 0 ? (
          <span className="mini" style={{ color: 'var(--waarschuwing)' }}>
            wacht op: {wacht.map((b) => b.titel).join(', ')}
          </span>
        ) : null}
      </span>
    </button>
  );
}

/** De drie stapels van één persoon op één dag. */
function PersoonsDag({ lid, overzicht, onOpen, categorieVan }) {
  const leeg = overzicht.totaal === 0;
  return (
    <div className="dagkolom">
      <div className="dagkolom-kop">
        <Avatar lid={lid} formaat="klein" />
        <span className="klein vet vul afgekapt">{lid ? lid.naam : 'Niet toegewezen'}</span>
        {leeg ? (
          <Badge kleur={overzicht.vastBeginnen && overzicht.vastBeginnen.length > 0 ? 'info' : 'neutraal'}>
            {overzicht.vastBeginnen && overzicht.vastBeginnen.length > 0 ? 'vooruit' : 'vrij'}
          </Badge>
        ) : (
          <span className="mini dof">{overzicht.totaal}</span>
        )}
      </div>

      {leeg && overzicht.vastBeginnen && overzicht.vastBeginnen.length > 0 ? (
        <div className="dagstapel" data-soort="vooruit">
          <span className="dagstapel-kop">
            <Icoon naam="pijlRechts" grootte={11} /> Niets ingepland — begin alvast aan
          </span>
          {overzicht.vastBeginnen.map((taak) => (
            <DagTaak key={taak.id} taak={taak} onOpen={onOpen} categorie={categorieVan(taak)} />
          ))}
        </div>
      ) : null}

      {leeg && (!overzicht.vastBeginnen || overzicht.vastBeginnen.length === 0) ? (
        <p className="mini dof" style={{ padding: '6px 2px' }}>
          Niets ingepland en niets om vooruit te pakken.
        </p>
      ) : null}

      {overzicht.deadline.length > 0 ? (
        <div className="dagstapel" data-soort="deadline">
          <span className="dagstapel-kop">
            <Icoon naam="klok" grootte={11} /> Moet vandaag af
          </span>
          {overzicht.deadline.map(({ taak, wacht }) => (
            <DagTaak key={taak.id} taak={taak} wacht={wacht} onOpen={onOpen} categorie={categorieVan(taak)} />
          ))}
        </div>
      ) : null}

      {overzicht.oppakken.length > 0 ? (
        <div className="dagstapel" data-soort="oppakken">
          <span className="dagstapel-kop">
            <Icoon naam="vink" grootte={11} /> Kun je aan werken
          </span>
          {overzicht.oppakken.map(({ taak, wacht }) => (
            <DagTaak key={taak.id} taak={taak} wacht={wacht} onOpen={onOpen} categorie={categorieVan(taak)} />
          ))}
        </div>
      ) : null}

      {overzicht.geblokkeerd.length > 0 ? (
        <div className="dagstapel" data-soort="geblokkeerd">
          <span className="dagstapel-kop">
            <Icoon naam="slot" grootte={11} /> Wacht op ander werk
          </span>
          {overzicht.geblokkeerd.map(({ taak, wacht }) => (
            <DagTaak key={taak.id} taak={taak} wacht={wacht} onOpen={onOpen} categorie={categorieVan(taak)} />
          ))}
        </div>
      ) : null}

      {overzicht.afgerond.length > 0 ? (
        <div className="dagstapel" data-soort="afgerond">
          <span className="dagstapel-kop">
            <Icoon naam="vink" grootte={11} /> Die dag afgerond
          </span>
          {overzicht.afgerond.map((taak) => (
            <DagTaak key={taak.id} taak={taak} onOpen={onOpen} categorie={categorieVan(taak)} />
          ))}
        </div>
      ) : null}
    </div>
  );
}

export function Kalender({ taken, fases, teamleden, categorieen, project, onOpen, beginDatum }) {
  const vandaag = vandaagIso();

  const startMaand = useMemo(() => naarDate(beginDatum) || new Date(), [beginDatum]);
  const [jaar, setJaar] = useState(startMaand.getFullYear());
  const [maand, setMaand] = useState(startMaand.getMonth());
  const [gekozenDag, setGekozenDag] = useState(vandaag);
  const [wie, setWie] = useState('alle');

  const dagen = useMemo(() => maandRaster(jaar, maand), [jaar, maand]);

  const zichtbaar = useMemo(() => {
    if (wie === 'alle') return taken;
    if (wie === 'geen') return taken.filter((t) => !t.toegewezenAan);
    return taken.filter((t) => t.toegewezenAan === wie);
  }, [taken, wie]);

  const tellingen = useMemo(
    () => tellingenPerDag(dagen.map((d) => d.iso), taken, zichtbaar, fases, project),
    [dagen, taken, zichtbaar, fases, project],
  );

  const perLid = useMemo(
    () => dagPerTeamlid(gekozenDag, taken, teamleden, fases, project),
    [gekozenDag, taken, teamleden, fases, project],
  );

  const totaalDag = useMemo(
    () => dagOverzicht(gekozenDag, taken, zichtbaar, fases, project),
    [gekozenDag, taken, zichtbaar, fases, project],
  );

  const categorieVan = (taak) => categorieen.find((c) => c.id === taak.categorie) || null;

  function verschuifMaand(stap) {
    const d = new Date(jaar, maand + stap, 1);
    setJaar(d.getFullYear());
    setMaand(d.getMonth());
  }

  function naarVandaag() {
    const nu = new Date();
    setJaar(nu.getFullYear());
    setMaand(nu.getMonth());
    setGekozenDag(vandaag);
  }

  const eersteDag = dagen[0].iso;
  const laatsteDag = dagen[dagen.length - 1].iso;
  const lopendeFases = fases.filter((f) => f.start && f.eind && f.start <= laatsteDag && f.eind >= eersteDag);

  /* Wie heeft er op de gekozen dag niets? Handig signaal om te herverdelen. */
  const vrijeLeden = perLid.rijen
    .filter((r) => r.totaal === 0 && (!r.vastBeginnen || r.vastBeginnen.length === 0))
    .map((r) => r.lid.naam);

  return (
    <div className="kolom" style={{ gap: 'var(--r4)' }}>
      <div className="rij rij-wrap">
        <Knop soort="stil" alleenIcoon icoon="chevronLinks" onClick={() => verschuifMaand(-1)} aria-label="Vorige maand" />
        <span className="vet" style={{ minWidth: 152, textAlign: 'center' }}>
          {toonMaandJaar(new Date(jaar, maand, 1))}
        </span>
        <Knop soort="stil" alleenIcoon icoon="chevron" onClick={() => verschuifMaand(1)} aria-label="Volgende maand" />
        <Knop klein onClick={naarVandaag}>
          Vandaag
        </Knop>
        <span className="vul" />
        <div style={{ minWidth: 160 }}>
          <Keuze
            label="Toon in de kalender"
            value={wie}
            onChange={(e) => setWie(e.target.value)}
            opties={[
              { waarde: 'alle', label: 'Iedereen' },
              { waarde: 'geen', label: 'Niet toegewezen' },
              ...teamleden.map((l) => ({ waarde: l.id, label: l.naam })),
            ]}
          />
        </div>
      </div>

      <div className="kalender">
        {DAGLABELS.map((label) => (
          <div key={label} className="kalender-daglabel">
            {label}
          </div>
        ))}

        {dagen.map((dag) => {
          const telling = tellingen.get(dag.iso) || { totaal: 0, deadlines: 0, voorbeeld: [] };
          return (
            <button
              type="button"
              key={dag.iso}
              className="kalender-cel"
              data-buiten={dag.buitenMaand ? 'true' : 'false'}
              data-vandaag={dag.iso === vandaag ? 'true' : 'false'}
              data-weekend={isWeekend(dag.iso) ? 'true' : 'false'}
              data-gekozen={dag.iso === gekozenDag ? 'true' : 'false'}
              onClick={() => setGekozenDag(dag.iso)}
              aria-label={`${toonDatumLang(dag.iso)} — ${telling.totaal} taken`}
              aria-pressed={dag.iso === gekozenDag ? 'true' : 'false'}
            >
              <span className="kalender-kop">
                <span className="kalender-datum">{dag.dagnummer}</span>
                {telling.deadlines > 0 ? (
                  <span className="kalender-deadlinestip" title={`${telling.deadlines} deadline(s)`}>
                    {telling.deadlines}
                  </span>
                ) : null}
              </span>

              {telling.voorbeeld.map(({ taak }) => (
                <span
                  key={taak.id}
                  className="kalender-item"
                  data-deadline={taak.deadline === dag.iso ? 'true' : 'false'}
                  title={taak.titel}
                >
                  {taak.titel}
                </span>
              ))}

              {telling.totaal > telling.voorbeeld.length ? (
                <span className="mini dof">+{telling.totaal - telling.voorbeeld.length} meer</span>
              ) : null}
            </button>
          );
        })}
      </div>

      <div className="kaart">
        <div className="kaart-kop">
          <div className="vul kolom" style={{ gap: 2 }}>
            <span className="kaart-kop-titel">
              {gekozenDag === vandaag ? 'Vandaag — ' : ''}
              {toonDatumLang(gekozenDag)}
            </span>
            <span className="mini dof">
              {totaalDag.totaal === 0
                ? 'Niets ingepland'
                : `${totaalDag.totaal} taken lopen, waarvan ${totaalDag.deadline.length} met deadline vandaag`}
              {isWeekend(gekozenDag) ? ' · weekend' : ''}
            </span>
          </div>
        </div>

        <div className="kaart-lijf">
          {vrijeLeden.length > 0 && !isWeekend(gekozenDag) ? (
            <div className="melding melding-waarschuwing" style={{ marginBottom: 'var(--r4)' }}>
              <Icoon naam="waarschuwing" grootte={15} />
              <span className="vul">
                {vrijeLeden.join(' en ')} {vrijeLeden.length === 1 ? 'heeft' : 'hebben'} deze dag niets staan. Verplaats
                een taak of pas de startdatum aan.
              </span>
            </div>
          ) : null}

          {taken.length === 0 ? (
            <Leeg titel="Geen taken" tekst="Voeg eerst taken toe." />
          ) : (
            <div className="dagraster">
              {perLid.rijen.map((rij) => (
                <PersoonsDag
                  key={rij.lid.id}
                  lid={rij.lid}
                  overzicht={rij}
                  onOpen={onOpen}
                  categorieVan={categorieVan}
                />
              ))}
              {perLid.nietToegewezen.totaal > 0 ? (
                <PersoonsDag
                  lid={null}
                  overzicht={perLid.nietToegewezen}
                  onOpen={onOpen}
                  categorieVan={categorieVan}
                />
              ) : null}
            </div>
          )}
        </div>
      </div>

      {lopendeFases.length > 0 ? (
        <div className="rij rij-wrap" style={{ gap: 6 }}>
          <span className="mini dof">Fases deze maand:</span>
          {lopendeFases.map((f) => (
            <Badge key={f.id} kleur={f.start <= vandaag && f.eind >= vandaag ? 'accent' : 'omlijnd'}>
              {f.naam}
            </Badge>
          ))}
        </div>
      ) : null}
    </div>
  );
}
