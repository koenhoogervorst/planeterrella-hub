/** Maandkalender met de deadlines van taken en de fases van die maand. */

import { useMemo, useState } from 'react';
import { Knop } from '../ui/Basis.jsx';
import {
  DAGLABELS,
  maandRaster,
  toonMaandJaar,
  vandaagIso,
  naarDate,
  dagenTotVandaag,
} from '../../lib/datums.js';

export function Kalender({ taken, fases, onOpen, beginDatum }) {
  const start = useMemo(() => {
    const d = beginDatum ? naarDate(beginDatum) : null;
    return d || new Date();
  }, [beginDatum]);

  const [jaar, setJaar] = useState(start.getFullYear());
  const [maand, setMaand] = useState(start.getMonth());

  const dagen = useMemo(() => maandRaster(jaar, maand), [jaar, maand]);
  const vandaag = vandaagIso();

  const perDag = useMemo(() => {
    const kaart = new Map();
    taken.forEach((taak) => {
      if (!taak.deadline) return;
      if (!kaart.has(taak.deadline)) kaart.set(taak.deadline, []);
      kaart.get(taak.deadline).push(taak);
    });
    return kaart;
  }, [taken]);

  function verschuifMaand(stap) {
    const d = new Date(jaar, maand + stap, 1);
    setJaar(d.getFullYear());
    setMaand(d.getMonth());
  }

  /* Fases die deze maand lopen, als context onder de kalender. */
  const eersteDag = dagen[0].iso;
  const laatsteDag = dagen[dagen.length - 1].iso;
  const lopendeFases = fases.filter((f) => f.start && f.eind && f.start <= laatsteDag && f.eind >= eersteDag);

  return (
    <div className="kolom">
      <div className="rij">
        <Knop soort="stil" alleenIcoon icoon="chevronLinks" onClick={() => verschuifMaand(-1)} aria-label="Vorige maand" />
        <span className="vet" style={{ minWidth: 148, textAlign: 'center' }}>
          {toonMaandJaar(new Date(jaar, maand, 1))}
        </span>
        <Knop soort="stil" alleenIcoon icoon="chevron" onClick={() => verschuifMaand(1)} aria-label="Volgende maand" />
        <span className="vul" />
        <Knop
          klein
          onClick={() => {
            const nu = new Date();
            setJaar(nu.getFullYear());
            setMaand(nu.getMonth());
          }}
        >
          Vandaag
        </Knop>
      </div>

      <div className="kalender">
        {DAGLABELS.map((label) => (
          <div key={label} className="kalender-daglabel">
            {label}
          </div>
        ))}

        {dagen.map((dag) => {
          const items = perDag.get(dag.iso) || [];
          return (
            <div
              key={dag.iso}
              className="kalender-cel"
              data-buiten={dag.buitenMaand ? 'true' : 'false'}
              data-vandaag={dag.iso === vandaag ? 'true' : 'false'}
            >
              <span className="kalender-datum">{dag.dagnummer}</span>
              {items.slice(0, 3).map((taak) => (
                <button
                  key={taak.id}
                  type="button"
                  className="kalender-item"
                  data-status={taak.status}
                  data-verlopen={taak.status !== 'klaar' && dagenTotVandaag(taak.deadline) < 0 ? 'true' : 'false'}
                  onClick={() => onOpen(taak)}
                  title={taak.titel}
                >
                  {taak.titel}
                </button>
              ))}
              {items.length > 3 ? <span className="mini dof">+{items.length - 3} meer</span> : null}
            </div>
          );
        })}
      </div>

      {lopendeFases.length > 0 ? (
        <div className="kolom" style={{ gap: 4 }}>
          <span className="klein vet zacht">Fases die deze maand lopen</span>
          <ul className="klein zacht" style={{ margin: 0 }}>
            {lopendeFases.map((f) => (
              <li key={f.id}>{f.naam}</li>
            ))}
          </ul>
        </div>
      ) : null}
    </div>
  );
}
