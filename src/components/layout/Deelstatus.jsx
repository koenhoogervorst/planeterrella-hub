/** Toont of de hub verbonden is met de gedeelde database, en wie je bent.
 *  Staat in de kopbalk, zodat je in één oogopslag ziet of je teamgenoten
 *  meekijken met wat je verandert. */

import { useProject } from '../../store/ProjectContext.jsx';
import { Icoon } from '../ui/Icoon.jsx';

const STATUS = {
  laden: { tekst: 'Verbinden…', kleur: 'var(--tekst-dof)', uitleg: 'Bezig met verbinden met de gedeelde database.' },
  verbonden: {
    tekst: 'Live',
    kleur: 'var(--goed)',
    uitleg: 'Verbonden. Wat jij verandert zien je teamgenoten meteen, en andersom.',
  },
  offline: {
    tekst: 'Offline',
    kleur: 'var(--gevaar)',
    uitleg:
      'Geen verbinding met de gedeelde database. Je werk wordt wel in deze browser bewaard en later opnieuw verstuurd.',
  },
  uit: {
    tekst: 'Alleen lokaal',
    kleur: 'var(--tekst-dof)',
    uitleg: 'Er is geen gedeelde database ingesteld. Alles blijft in deze browser.',
  },
};

export function Deelstatus() {
  const { staat, deelStatus, wieBenIk, setWieBenIk } = useProject();
  const info = STATUS[deelStatus] || STATUS.uit;

  return (
    <div className="rij" style={{ gap: 6 }}>
      <span className="deelstatus" title={info.uitleg}>
        <span
          className="deelstatus-stip"
          style={{ background: info.kleur }}
          data-pulseer={deelStatus === 'verbonden' ? 'true' : 'false'}
        />
        <span className="deelstatus-tekst">{info.tekst}</span>
      </span>

      {deelStatus !== 'uit' ? (
        <label className="deelstatus-wie" title="Wie ben jij? Dit zetten we bij elke wijziging die je maakt.">
          <Icoon naam="team" grootte={13} />
          <span className="verborgen-visueel">Wie ben jij?</span>
          <select
            className="deelstatus-keuze"
            value={wieBenIk}
            onChange={(e) => setWieBenIk(e.target.value)}
            aria-label="Wie ben jij?"
          >
            <option value="">Wie ben jij?</option>
            {staat.teamleden.map((lid) => (
              <option key={lid.id} value={lid.naam}>
                {lid.naam}
              </option>
            ))}
          </select>
        </label>
      ) : null}
    </div>
  );
}
