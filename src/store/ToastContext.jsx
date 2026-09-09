/** Korte bevestigingsmeldingen rechtsonder in beeld. */

import { useCallback, useContext, useMemo, useRef, useState, useEffect } from 'react';
import { nieuwId } from '../lib/id.js';
import { Icoon } from '../components/ui/Icoon.jsx';
import { ToastContext } from './context.js';

export function ToastProvider({ children }) {
  const [meldingen, setMeldingen] = useState([]);
  const timers = useRef(new Map());

  const verberg = useCallback((id) => {
    setMeldingen((huidig) => huidig.filter((m) => m.id !== id));
    const timer = timers.current.get(id);
    if (timer) {
      clearTimeout(timer);
      timers.current.delete(id);
    }
  }, []);

  const toon = useCallback(
    (tekst, soort = 'info', duur = 3600) => {
      const id = nieuwId('toast');
      setMeldingen((huidig) => [...huidig.slice(-3), { id, tekst, soort }]);
      const timer = setTimeout(() => verberg(id), duur);
      timers.current.set(id, timer);
      return id;
    },
    [verberg],
  );

  /* Alle lopende timers opruimen als de provider verdwijnt. */
  const timersRef = timers;
  useEffect(
    () => () => {
      timersRef.current.forEach((t) => clearTimeout(t));
      timersRef.current.clear();
    },
    [timersRef],
  );

  const waarde = useMemo(
    () => ({
      toon,
      goed: (tekst) => toon(tekst, 'goed'),
      fout: (tekst) => toon(tekst, 'fout', 6000),
    }),
    [toon],
  );

  return (
    <ToastContext.Provider value={waarde}>
      {children}
      <div className="toast-laag" role="status" aria-live="polite">
        {meldingen.map((m) => (
          <div key={m.id} className="toast" data-soort={m.soort}>
            <Icoon naam={m.soort === 'goed' ? 'vink' : m.soort === 'fout' ? 'waarschuwing' : 'info'} grootte={15} />
            <span className="vul">{m.tekst}</span>
            <button
              type="button"
              className="knop knop-stil knop-icoon knop-klein"
              onClick={() => verberg(m.id)}
              aria-label="Melding sluiten"
            >
              <Icoon naam="kruis" grootte={13} />
            </button>
          </div>
        ))}
      </div>
    </ToastContext.Provider>
  );
}

export function useToast() {
  const context = useContext(ToastContext);
  if (!context) throw new Error('useToast moet binnen een ToastProvider gebruikt worden.');
  return context;
}
