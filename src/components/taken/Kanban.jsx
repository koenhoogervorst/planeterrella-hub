/** Kanban-bord met vier kolommen. Slepen werkt met de muis; er zijn ook
 *  knoppen om een kaart een kolom op te schuiven, zodat het zonder slepen kan. */

import { useState } from 'react';
import { STATUSSEN } from '../../data/constanten.js';
import { PrioriteitBadge, Avatar } from '../ui/Basis.jsx';
import { Icoon } from '../ui/Icoon.jsx';
import { toonDatum, deadlineUrgentie } from '../../lib/datums.js';
import { useOpzoek } from '../../store/ProjectContext.jsx';

const VOLGORDE = STATUSSEN.map((s) => s.id);

export function Kanban({ taken, onWijzigStatus, onOpen }) {
  const opzoek = useOpzoek();
  const [sleepDoel, setSleepDoel] = useState(null);

  function laatVallen(status) {
    return (e) => {
      e.preventDefault();
      setSleepDoel(null);
      const id = e.dataTransfer.getData('text/plain');
      const taak = taken.find((t) => t.id === id);
      if (taak && taak.status !== status) onWijzigStatus(taak, status);
    };
  }

  return (
    <div className="kanban">
      {STATUSSEN.map((status) => {
        const kolomTaken = taken.filter((t) => t.status === status.id);
        const index = VOLGORDE.indexOf(status.id);
        return (
          <div
            key={status.id}
            className="kanban-kolom"
            data-sleepdoel={sleepDoel === status.id ? 'true' : 'false'}
            onDragOver={(e) => {
              e.preventDefault();
              setSleepDoel(status.id);
            }}
            onDragLeave={() => setSleepDoel((h) => (h === status.id ? null : h))}
            onDrop={laatVallen(status.id)}
          >
            <div className="kanban-kop">
              <span className={`badge badge-${status.id}`}>
                <span className="badge-stip" />
                {status.kort}
              </span>
              <span className="vul" />
              <span className="mini dof">{kolomTaken.length}</span>
            </div>

            <div className="kanban-lijst">
              {kolomTaken.length === 0 ? (
                <p className="mini dof" style={{ padding: '10px 4px', textAlign: 'center' }}>
                  Geen taken
                </p>
              ) : null}

              {kolomTaken.map((taak) => {
                const lid = opzoek.lid(taak.toegewezenAan);
                const categorie = opzoek.categorie(taak.categorie);
                const urgentie = taak.status === 'klaar' ? null : deadlineUrgentie(taak.deadline);
                return (
                  <div
                    key={taak.id}
                    className="kanban-kaart"
                    draggable
                    onDragStart={(e) => {
                      e.dataTransfer.setData('text/plain', taak.id);
                      e.dataTransfer.effectAllowed = 'move';
                    }}
                  >
                    <button
                      type="button"
                      onClick={() => onOpen(taak)}
                      className="kanban-kaart-titel"
                      style={{
                        background: 'none',
                        border: 0,
                        padding: 0,
                        textAlign: 'left',
                        font: 'inherit',
                        fontWeight: 570,
                        color: 'inherit',
                        cursor: 'pointer',
                      }}
                    >
                      {taak.titel}
                    </button>

                    {categorie ? (
                      <span className="mini" style={{ color: categorie.kleur, fontWeight: 650 }}>
                        {categorie.naam}
                      </span>
                    ) : null}

                    <div className="rij rij-wrap" style={{ gap: 5 }}>
                      <PrioriteitBadge prioriteit={taak.prioriteit} />
                      {taak.deadline ? (
                        <span
                          className="mini rij"
                          style={{
                            gap: 3,
                            color:
                              urgentie === 'verlopen'
                                ? 'var(--gevaar)'
                                : urgentie === 'vandaag' || urgentie === 'week'
                                  ? 'var(--waarschuwing)'
                                  : 'var(--tekst-dof)',
                            fontWeight: 600,
                          }}
                        >
                          <Icoon naam="klok" grootte={11} />
                          {toonDatum(taak.deadline)}
                        </span>
                      ) : null}
                    </div>

                    <div className="rij" style={{ gap: 6 }}>
                      <Avatar lid={lid} formaat="klein" />
                      <span className="mini dof vul afgekapt">{lid ? lid.naam : 'Niet toegewezen'}</span>
                      <button
                        type="button"
                        className="knop knop-stil knop-icoon knop-klein"
                        disabled={index === 0}
                        onClick={() => onWijzigStatus(taak, VOLGORDE[index - 1])}
                        aria-label="Naar de vorige kolom"
                        title="Naar de vorige kolom"
                      >
                        <Icoon naam="chevronLinks" grootte={13} />
                      </button>
                      <button
                        type="button"
                        className="knop knop-stil knop-icoon knop-klein"
                        disabled={index === VOLGORDE.length - 1}
                        onClick={() => onWijzigStatus(taak, VOLGORDE[index + 1])}
                        aria-label="Naar de volgende kolom"
                        title="Naar de volgende kolom"
                      >
                        <Icoon naam="chevron" grootte={13} />
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        );
      })}
    </div>
  );
}
