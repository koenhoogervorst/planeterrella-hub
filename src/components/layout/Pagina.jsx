/** Standaard paginakop met titel, uitleg en actieknoppen rechts. */

export function PaginaKop({ titel, uitleg, acties, children }) {
  return (
    <div className="paginakop">
      <div className="paginakop-tekst">
        <h1>{titel}</h1>
        {uitleg ? <p className="zacht klein">{uitleg}</p> : null}
        {children}
      </div>
      {acties ? <div className="paginakop-acties">{acties}</div> : null}
    </div>
  );
}
