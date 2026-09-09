/** Formuliervelden met label, hint en foutmelding. */

import { useId } from 'react';

export function Veld({ label, hint, fout, children, breed = false, className = '' }) {
  return (
    <div className={`veld ${className}`.trim()} style={breed ? { gridColumn: '1 / -1' } : undefined}>
      {label ? <label className="veld-label">{label}</label> : null}
      {children}
      {fout ? <span className="veld-fout">{fout}</span> : null}
      {hint && !fout ? <span className="veld-hint">{hint}</span> : null}
    </div>
  );
}

export function Invoer({ label, hint, fout, breed, type = 'text', ...rest }) {
  const id = useId();
  return (
    <div className="veld" style={breed ? { gridColumn: '1 / -1' } : undefined}>
      {label ? (
        <label className="veld-label" htmlFor={id}>
          {label}
        </label>
      ) : null}
      <input id={id} type={type} className="invoer" aria-invalid={fout ? 'true' : undefined} {...rest} />
      {fout ? <span className="veld-fout">{fout}</span> : null}
      {hint && !fout ? <span className="veld-hint">{hint}</span> : null}
    </div>
  );
}

/**
 * Zoekveld voor de filterbalken. Bestaat apart omdat exact dit blokje op acht
 * pagina's terugkwam, en omdat het label met een id aan het invoerveld
 * gekoppeld moet zijn — anders leest een schermlezer alleen "zoekveld".
 */
export function Zoekveld({ label = 'Zoeken', breed = false, ...rest }) {
  const id = useId();
  return (
    <div className={breed ? 'veld' : 'veld veld-zoek'} style={breed ? { gridColumn: '1 / -1' } : undefined}>
      <label className="veld-label" htmlFor={id}>
        {label}
      </label>
      <input id={id} type="search" className="invoer" {...rest} />
    </div>
  );
}

export function Tekstvak({ label, hint, fout, breed, rijen = 3, ...rest }) {
  const id = useId();
  return (
    <div className="veld" style={breed ? { gridColumn: '1 / -1' } : undefined}>
      {label ? (
        <label className="veld-label" htmlFor={id}>
          {label}
        </label>
      ) : null}
      <textarea id={id} rows={rijen} className="tekstvak" aria-invalid={fout ? 'true' : undefined} {...rest} />
      {fout ? <span className="veld-fout">{fout}</span> : null}
      {hint && !fout ? <span className="veld-hint">{hint}</span> : null}
    </div>
  );
}

/**
 * Keuzelijst.
 * `opties` is een lijst van { waarde, label } of van strings.
 */
export function Keuze({ label, hint, fout, breed, opties = [], leegLabel, ...rest }) {
  const id = useId();
  const genormaliseerd = opties.map((o) =>
    typeof o === 'string' ? { waarde: o, label: o } : { waarde: o.waarde ?? o.id, label: o.label ?? o.naam },
  );
  return (
    <div className="veld" style={breed ? { gridColumn: '1 / -1' } : undefined}>
      {label ? (
        <label className="veld-label" htmlFor={id}>
          {label}
        </label>
      ) : null}
      <select id={id} className="keuze" aria-invalid={fout ? 'true' : undefined} {...rest}>
        {leegLabel !== undefined ? <option value="">{leegLabel}</option> : null}
        {genormaliseerd.map((o) => (
          <option key={o.waarde} value={o.waarde}>
            {o.label}
          </option>
        ))}
      </select>
      {fout ? <span className="veld-fout">{fout}</span> : null}
      {hint && !fout ? <span className="veld-hint">{hint}</span> : null}
    </div>
  );
}

/** Meervoudige keuze via aanvinkbare chips — prettiger dan een multi-select. */
export function MeerKeuze({ label, hint, opties = [], gekozen = [], onWijzig, leegTekst = 'Geen opties beschikbaar' }) {
  const genormaliseerd = opties.map((o) => ({ waarde: o.waarde ?? o.id, label: o.label ?? o.naam }));
  function wissel(waarde) {
    if (gekozen.includes(waarde)) {
      onWijzig(gekozen.filter((g) => g !== waarde));
    } else {
      onWijzig([...gekozen, waarde]);
    }
  }
  return (
    <div className="veld" style={{ gridColumn: '1 / -1' }}>
      {label ? <span className="veld-label">{label}</span> : null}
      {genormaliseerd.length === 0 ? (
        <span className="veld-hint">{leegTekst}</span>
      ) : (
        <div
          className="chip-rij"
          style={
            genormaliseerd.length > 12
              ? {
                  maxHeight: 168,
                  overflowY: 'auto',
                  padding: 6,
                  border: '1px solid var(--lijn)',
                  borderRadius: 'var(--rond)',
                  background: 'var(--vlak-achtergrond)',
                }
              : undefined
          }
        >
          {genormaliseerd.map((o) => (
            <button
              key={o.waarde}
              type="button"
              className="chip"
              aria-pressed={gekozen.includes(o.waarde) ? 'true' : 'false'}
              onClick={() => wissel(o.waarde)}
            >
              {o.label}
            </button>
          ))}
        </div>
      )}
      {hint ? <span className="veld-hint">{hint}</span> : null}
    </div>
  );
}
