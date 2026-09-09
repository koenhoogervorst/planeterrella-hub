/** Dialoogvenster met focusval, Escape-sluiten en een bevestigingsvariant. */

import { useEffect, useRef } from 'react';
import { Knop } from './Basis.jsx';
import { Icoon } from './Icoon.jsx';

export function Dialoog({ titel, open, onSluit, children, voet, breed = false }) {
  const lijfRef = useRef(null);
  const vorigeFocus = useRef(null);

  useEffect(() => {
    if (!open) return undefined;

    vorigeFocus.current = document.activeElement;

    function bijToets(e) {
      if (e.key === 'Escape') {
        e.stopPropagation();
        onSluit();
        return;
      }
      if (e.key !== 'Tab' || !lijfRef.current) return;
      const focusbaar = lijfRef.current.querySelectorAll(
        'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])',
      );
      const zichtbaar = Array.from(focusbaar).filter((el) => !el.disabled && el.offsetParent !== null);
      if (zichtbaar.length === 0) return;
      const eerste = zichtbaar[0];
      const laatste = zichtbaar[zichtbaar.length - 1];
      if (e.shiftKey && document.activeElement === eerste) {
        e.preventDefault();
        laatste.focus();
      } else if (!e.shiftKey && document.activeElement === laatste) {
        e.preventDefault();
        eerste.focus();
      }
    }

    document.addEventListener('keydown', bijToets, true);
    const overloop = document.body.style.overflow;
    document.body.style.overflow = 'hidden';

    /* Focus in het venster zetten, maar niet in een tekstveld scrollen. */
    const timer = setTimeout(() => {
      const eerste = lijfRef.current?.querySelector('input, select, textarea, button');
      if (eerste) eerste.focus();
    }, 30);

    return () => {
      document.removeEventListener('keydown', bijToets, true);
      document.body.style.overflow = overloop;
      clearTimeout(timer);
      if (vorigeFocus.current && typeof vorigeFocus.current.focus === 'function') {
        vorigeFocus.current.focus();
      }
    };
  }, [open, onSluit]);

  if (!open) return null;

  return (
    <div
      className="dialoog-achtergrond"
      onMouseDown={(e) => {
        if (e.target === e.currentTarget) onSluit();
      }}
    >
      <div
        className={breed ? 'dialoog dialoog-breed' : 'dialoog'}
        role="dialog"
        aria-modal="true"
        aria-label={titel}
        ref={lijfRef}
      >
        <header className="dialoog-kop">
          <h2 className="kaart-kop-titel vul">{titel}</h2>
          <Knop soort="stil" alleenIcoon icoon="kruis" onClick={onSluit} aria-label="Sluiten" />
        </header>
        <div className="dialoog-lijf">{children}</div>
        {voet ? <footer className="dialoog-voet">{voet}</footer> : null}
      </div>
    </div>
  );
}

/** Bevestiging vóór het verwijderen van iets. */
export function Bevestig({ open, titel, tekst, bevestigLabel = 'Verwijderen', onBevestig, onAnnuleer }) {
  return (
    <Dialoog
      open={open}
      titel={titel}
      onSluit={onAnnuleer}
      voet={
        <>
          <Knop onClick={onAnnuleer}>Annuleren</Knop>
          <Knop soort="gevaar" icoon="prullenbak" onClick={onBevestig}>
            {bevestigLabel}
          </Knop>
        </>
      }
    >
      <div className="melding melding-waarschuwing">
        <Icoon naam="waarschuwing" grootte={16} />
        <div className="vul">{tekst}</div>
      </div>
    </Dialoog>
  );
}
