/** Twee eenvoudige grafieken als inline SVG: een ringdiagram en een
 *  horizontale staafgrafiek. Bewust klein gehouden — geen grafiekbibliotheek. */

export function Ring({ percentage, grootte = 132, dikte = 13, kleur = 'var(--accent)', onder }) {
  const veilig = Math.max(0, Math.min(100, Number.isFinite(percentage) ? percentage : 0));
  const straal = (grootte - dikte) / 2;
  const omtrek = 2 * Math.PI * straal;
  const gevuld = (veilig / 100) * omtrek;

  return (
    <div className="donut-omhulsel" style={{ width: grootte, height: grootte }}>
      <svg width={grootte} height={grootte} role="img" aria-label={`${veilig} procent afgerond`}>
        <circle
          cx={grootte / 2}
          cy={grootte / 2}
          r={straal}
          fill="none"
          stroke="var(--vlak-gedempt)"
          strokeWidth={dikte}
        />
        <circle
          cx={grootte / 2}
          cy={grootte / 2}
          r={straal}
          fill="none"
          stroke={kleur}
          strokeWidth={dikte}
          strokeLinecap="round"
          strokeDasharray={`${gevuld} ${omtrek - gevuld}`}
          transform={`rotate(-90 ${grootte / 2} ${grootte / 2})`}
          style={{ transition: 'stroke-dasharray 0.3s ease' }}
        />
      </svg>
      <div className="donut-midden">
        <span className="donut-percentage">{veilig}%</span>
        {onder ? <span className="mini dof">{onder}</span> : null}
      </div>
    </div>
  );
}

/**
 * Horizontale staafgrafiek.
 * `rijen` = [{ label, waarde, kleur }]
 */
export function Staven({ rijen, eenheid = '', hoogte = 22 }) {
  const maximum = Math.max(1, ...rijen.map((r) => r.waarde));
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
      {rijen.map((rij) => (
        <div key={rij.label} style={{ display: 'grid', gridTemplateColumns: '1fr 44px', gap: 10, alignItems: 'center' }}>
          <div>
            <div className="mini zacht" style={{ marginBottom: 3, fontWeight: 600 }}>
              {rij.label}
            </div>
            <div style={{ height: hoogte / 2.4, background: 'var(--vlak-gedempt)', borderRadius: 20 }}>
              <div
                style={{
                  width: `${(rij.waarde / maximum) * 100}%`,
                  height: '100%',
                  background: rij.kleur || 'var(--accent)',
                  borderRadius: 20,
                  transition: 'width 0.25s ease',
                }}
              />
            </div>
          </div>
          <span className="klein vet" style={{ textAlign: 'right', fontVariantNumeric: 'tabular-nums' }}>
            {rij.waarde}
            {eenheid}
          </span>
        </div>
      ))}
    </div>
  );
}

/** Legenda met kleurvlek, label en getal. */
export function Legenda({ rijen }) {
  return (
    <div className="legenda">
      {rijen.map((rij) => (
        <div key={rij.label} className="legenda-regel">
          <span className="legenda-vlek" style={{ background: rij.kleur }} />
          <span className="vul zacht">{rij.label}</span>
          <span className="legenda-getal">{rij.waarde}</span>
        </div>
      ))}
    </div>
  );
}
