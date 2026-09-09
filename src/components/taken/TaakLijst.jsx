/** Takentabel met afvinken, snel wijzigen van status en de knoppen
 *  voor aanpassen en verwijderen. */

import { useEffect, useState } from 'react';
import { Knop, StatusBadge, PrioriteitBadge, Avatar, Leeg, HerkomstLabel, Badge } from '../ui/Basis.jsx';
import { Icoon } from '../ui/Icoon.jsx';
import { STATUSSEN } from '../../data/constanten.js';
import { toonDatum, deadlineTekst, deadlineUrgentie } from '../../lib/datums.js';
import { useOpzoek } from '../../store/ProjectContext.jsx';

/* Hoeveel rijen we in één keer tonen. Bij honderden taken wordt de tabel
   anders merkbaar traag, en je scrolt er toch niet doorheen. */
const RIJEN_PER_KEER = 100;

const URGENTIE_KLEUR = {
  verlopen: 'var(--gevaar)',
  vandaag: 'var(--waarschuwing)',
  week: 'var(--waarschuwing)',
};

function DeadlineCel({ taak }) {
  if (!taak.deadline) return <span className="dof klein">Geen deadline</span>;
  const urgentie = taak.status === 'klaar' ? null : deadlineUrgentie(taak.deadline);
  const kleur = urgentie ? URGENTIE_KLEUR[urgentie] : undefined;
  return (
    <div>
      <div className="klein" style={{ color: kleur, fontWeight: kleur ? 620 : 500, whiteSpace: 'nowrap' }}>
        {toonDatum(taak.deadline)}
      </div>
      {urgentie && urgentie !== 'later' ? (
        <div className="mini" style={{ color: kleur }}>
          {deadlineTekst(taak.deadline)}
        </div>
      ) : null}
    </div>
  );
}

export function TaakLijst({ taken, onWijzigStatus, onBewerk, onVerwijder, onOpen, toonFase = true, leegTekst }) {
  const opzoek = useOpzoek();
  const [zichtbaar, setZichtbaar] = useState(RIJEN_PER_KEER);

  /* Terug naar het begin zodra de lijst verandert (bijvoorbeeld door een filter). */
  useEffect(() => {
    setZichtbaar(RIJEN_PER_KEER);
  }, [taken]);

  if (taken.length === 0) {
    return (
      <Leeg
        titel="Geen taken gevonden"
        tekst={leegTekst || 'Pas de filters aan of voeg een nieuwe taak toe.'}
      />
    );
  }

  return (
    <div className="tabel-omhulsel">
      <table className="tabel">
        <thead>
          <tr>
            <th style={{ width: 34 }}>
              <span className="verborgen-visueel">Afgerond</span>
            </th>
            <th>Taak</th>
            <th style={{ width: 140 }}>Wie</th>
            <th style={{ width: 168 }}>Status</th>
            <th style={{ width: 96 }}>Prioriteit</th>
            <th style={{ width: 126 }}>Deadline</th>
            <th style={{ width: 78 }}>
              <span className="verborgen-visueel">Acties</span>
            </th>
          </tr>
        </thead>
        <tbody>
          {taken.slice(0, zichtbaar).map((taak) => {
            const lid = opzoek.lid(taak.toegewezenAan);
            const categorie = opzoek.categorie(taak.categorie);
            const blokkers = taak.afhankelijkVan
              .map((id) => opzoek.taak(id))
              .filter((t) => t && t.status !== 'klaar');

            return (
              <tr key={taak.id} className={taak.status === 'klaar' ? 'rij-af' : undefined}>
                <td>
                  <input
                    type="checkbox"
                    className="vink"
                    checked={taak.status === 'klaar'}
                    onChange={(e) => onWijzigStatus(taak, e.target.checked ? 'klaar' : 'todo')}
                    aria-label={`${taak.titel} afvinken`}
                  />
                </td>

                <td>
                  <button
                    type="button"
                    onClick={() => (onOpen ? onOpen(taak) : onBewerk(taak))}
                    className="cel-titel"
                    style={{
                      background: 'none',
                      border: 0,
                      padding: 0,
                      textAlign: 'left',
                      font: 'inherit',
                      color: 'inherit',
                      cursor: 'pointer',
                      fontWeight: 560,
                    }}
                  >
                    {taak.titel}
                  </button>
                  <div className="rij rij-wrap" style={{ gap: 5, marginTop: 4 }}>
                    {categorie ? (
                      <span className="mini" style={{ color: categorie.kleur, fontWeight: 650 }}>
                        {categorie.naam}
                      </span>
                    ) : null}
                    {toonFase && taak.fase ? <span className="mini dof">· {opzoek.faseNaam(taak.fase)}</span> : null}
                    <HerkomstLabel herkomst={taak.herkomst} kort />
                    {blokkers.length > 0 ? (
                      <Badge kleur="waarschuwing" title={blokkers.map((b) => b.titel).join(', ')}>
                        Wacht op {blokkers.length}
                      </Badge>
                    ) : null}
                  </div>
                </td>

                <td>
                  <div className="rij" style={{ gap: 6 }}>
                    <Avatar lid={lid} formaat="klein" />
                    <span className="klein afgekapt">{lid ? lid.naam : <span className="dof">Niet toegewezen</span>}</span>
                  </div>
                </td>

                <td>
                  <select
                    className="keuze"
                    value={taak.status}
                    onChange={(e) => onWijzigStatus(taak, e.target.value)}
                    aria-label={`Status van ${taak.titel}`}
                    style={{ fontSize: 'var(--tekst-sm)', padding: '4px 24px 4px 8px' }}
                  >
                    {STATUSSEN.map((s) => (
                      <option key={s.id} value={s.id}>
                        {s.naam}
                      </option>
                    ))}
                  </select>
                </td>

                <td>
                  <PrioriteitBadge prioriteit={taak.prioriteit} />
                </td>

                <td>
                  <DeadlineCel taak={taak} />
                </td>

                <td>
                  <div className="cel-acties">
                    <Knop
                      soort="stil"
                      alleenIcoon
                      klein
                      icoon="potlood"
                      onClick={() => onBewerk(taak)}
                      aria-label={`${taak.titel} aanpassen`}
                      title="Aanpassen"
                    />
                    <Knop
                      soort="stil"
                      alleenIcoon
                      klein
                      icoon="prullenbak"
                      onClick={() => onVerwijder(taak)}
                      aria-label={`${taak.titel} verwijderen`}
                      title="Verwijderen"
                    />
                  </div>
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>

      {taken.length > zichtbaar ? (
        <div className="rij" style={{ justifyContent: 'center', gap: 'var(--r3)', padding: 'var(--r4)' }}>
          <span className="klein dof">
            {zichtbaar} van {taken.length} taken getoond
          </span>
          <Knop klein icoon="chevronOmlaag" onClick={() => setZichtbaar((h) => h + RIJEN_PER_KEER)}>
            Toon {Math.min(RIJEN_PER_KEER, taken.length - zichtbaar)} meer
          </Knop>
          <Knop klein soort="stil" onClick={() => setZichtbaar(taken.length)}>
            Toon alles
          </Knop>
        </div>
      ) : null}
    </div>
  );
}

/** Compacte regel voor gebruik op het dashboard en detailpagina's. */
export function TaakRegel({ taak, onKlik }) {
  const opzoek = useOpzoek();
  const lid = opzoek.lid(taak.toegewezenAan);
  return (
    <button
      type="button"
      onClick={() => onKlik && onKlik(taak)}
      className="zoek-treffer"
      style={{ cursor: onKlik ? 'pointer' : 'default' }}
    >
      <div className="rij" style={{ gap: 8 }}>
        <Avatar lid={lid} formaat="klein" />
        <span className="vul klein vet afgekapt">{taak.titel}</span>
        <StatusBadge status={taak.status} />
      </div>
      <div className="rij rij-wrap mini dof" style={{ gap: 8, paddingLeft: 30 }}>
        <span>{opzoek.categorieNaam(taak.categorie, 'Geen categorie')}</span>
        {taak.deadline ? (
          <span className="rij" style={{ gap: 3 }}>
            <Icoon naam="klok" grootte={11} />
            {toonDatum(taak.deadline)}
          </span>
        ) : null}
      </div>
    </button>
  );
}
