import { useCallback, useEffect, useMemo, useState } from 'react';

import { Zijbalk, Kopbalk, PAGINAS } from './components/layout/Navigatie.jsx';
import { Melding, Knop } from './components/ui/Basis.jsx';
import { useProject } from './store/ProjectContext.jsx';

import { Dashboard } from './pages/Dashboard.jsx';
import { Planning } from './pages/Planning.jsx';
import { Taken } from './pages/Taken.jsx';
import { Team } from './pages/Team.jsx';
import { Bronnen } from './pages/Bronnen.jsx';
import { Onderzoek } from './pages/Onderzoek.jsx';
import { Onderdelen } from './pages/Onderdelen.jsx';
import { Eisen } from './pages/Eisen.jsx';
import { Documentatie } from './pages/Documentatie.jsx';
import { Beslissingen } from './pages/Beslissingen.jsx';
import { Risicos } from './pages/Risicos.jsx';
import { Voortgang } from './pages/Voortgang.jsx';
import { Zoeken } from './pages/Zoeken.jsx';
import { Instellingen } from './pages/Instellingen.jsx';

const THEMA_SLEUTEL = 'planeterrella-hub-thema';

function leesThema() {
  try {
    const opgeslagen = window.localStorage.getItem(THEMA_SLEUTEL);
    if (opgeslagen === 'licht' || opgeslagen === 'donker') return opgeslagen;
  } catch {
    /* opslag niet beschikbaar — dan volgen we het systeem */
  }
  return 'systeem';
}

/** Wat ziet de gebruiker nu echt? Bij de instelling "systeem" bepaalt het
 *  besturingssysteem dat, en daar moet de knop op meebewegen — anders staat er
 *  "Donkere weergave" terwijl het al donker is en doet de eerste klik niets. */
function systeemIsDonker() {
  return typeof window.matchMedia === 'function' && window.matchMedia('(prefers-color-scheme: dark)').matches;
}

function huidigeHash() {
  const hash = window.location.hash.replace('#', '');
  return PAGINAS.some((p) => p.id === hash) ? hash : 'dashboard';
}

export default function App() {
  const { staat, opslagFout, opslagWerkt, startMelding, verbergStartMelding } = useProject();

  const [pagina, setPagina] = useState(huidigeHash);
  const [menuOpen, setMenuOpen] = useState(false);
  const [zoekterm, setZoekterm] = useState('');
  const [bewerkTaak, setBewerkTaak] = useState(null);
  const [thema, setThema] = useState(leesThema);
  const [systeemDonker, setSysteemDonker] = useState(systeemIsDonker);

  /* Meebewegen als de gebruiker het systeemthema onderweg omzet. */
  useEffect(() => {
    if (typeof window.matchMedia !== 'function') return undefined;
    const media = window.matchMedia('(prefers-color-scheme: dark)');
    const bij = (e) => setSysteemDonker(e.matches);
    media.addEventListener('change', bij);
    return () => media.removeEventListener('change', bij);
  }, []);

  const effectiefThema = thema === 'systeem' ? (systeemDonker ? 'donker' : 'licht') : thema;

  /* Thema toepassen en onthouden. */
  useEffect(() => {
    const wortel = document.documentElement;
    if (thema === 'systeem') {
      wortel.removeAttribute('data-thema');
    } else {
      wortel.setAttribute('data-thema', thema);
    }
    try {
      if (thema === 'systeem') window.localStorage.removeItem(THEMA_SLEUTEL);
      else window.localStorage.setItem(THEMA_SLEUTEL, thema);
    } catch {
      /* niets aan te doen */
    }
  }, [thema]);

  /* De hash in de adresbalk bijhouden, zodat vernieuwen op dezelfde pagina blijft. */
  useEffect(() => {
    function bijHash() {
      setPagina(huidigeHash());
    }
    window.addEventListener('hashchange', bijHash);
    return () => window.removeEventListener('hashchange', bijHash);
  }, []);

  const gaNaar = useCallback((doel) => {
    setPagina(doel);
    setMenuOpen(false);
    if (window.location.hash !== `#${doel}`) {
      window.location.hash = doel;
    }
    const inhoud = document.querySelector('.inhoud');
    if (inhoud) inhoud.scrollTop = 0;
  }, []);

  /* Een taak openen: naar de takenpagina en het formulier openzetten. */
  const opTaak = useCallback(
    (taak) => {
      setBewerkTaak(taak);
      if (pagina !== 'taken' && pagina !== 'planning') gaNaar('taken');
    },
    [pagina, gaNaar],
  );

  const tellingen = useMemo(
    () => ({
      takenOpen: staat.taken.filter((t) => t.status !== 'klaar').length,
      eisenOpen: staat.eisen.filter((e) => e.status !== 'behaald' && e.status !== 'vervallen').length,
      risicosOpen: staat.risicos.filter((r) => r.status === 'open' || r.status === 'bezig').length,
    }),
    [staat.taken, staat.eisen, staat.risicos],
  );

  const paginaTitel = PAGINAS.find((p) => p.id === pagina)?.naam || 'Dashboard';

  function toonPagina() {
    switch (pagina) {
      case 'planning':
        return <Planning bewerkTaak={bewerkTaak} setBewerkTaak={setBewerkTaak} />;
      case 'taken':
        return <Taken bewerkTaak={bewerkTaak} setBewerkTaak={setBewerkTaak} />;
      case 'team':
        return <Team opTaak={opTaak} />;
      case 'bronnen':
        return <Bronnen />;
      case 'onderzoek':
        return <Onderzoek gaNaar={gaNaar} />;
      case 'onderdelen':
        return <Onderdelen opTaak={opTaak} />;
      case 'eisen':
        return <Eisen />;
      case 'documentatie':
        return <Documentatie gaNaar={gaNaar} />;
      case 'beslissingen':
        return <Beslissingen />;
      case 'risicos':
        return <Risicos />;
      case 'voortgang':
        return <Voortgang />;
      case 'zoeken':
        return <Zoeken zoekterm={zoekterm} setZoekterm={setZoekterm} gaNaar={gaNaar} />;
      case 'instellingen':
        return <Instellingen opslagWerkt={opslagWerkt} />;
      case 'dashboard':
      default:
        return <Dashboard gaNaar={gaNaar} opTaak={opTaak} />;
    }
  }

  return (
    <div className="app">
      {menuOpen ? <div className="overlay" onClick={() => setMenuOpen(false)} aria-hidden="true" /> : null}

      <Zijbalk
        pagina={pagina}
        gaNaar={gaNaar}
        open={menuOpen}
        sluit={() => setMenuOpen(false)}
        projectnaam={staat.project.naam}
        tellingen={tellingen}
      />

      <div className="hoofd">
        <Kopbalk
          titel={paginaTitel}
          zoekterm={zoekterm}
          setZoekterm={setZoekterm}
          opZoek={() => gaNaar('zoeken')}
          openMenu={() => setMenuOpen(true)}
          thema={effectiefThema}
          wisselThema={() => setThema(effectiefThema === 'donker' ? 'licht' : 'donker')}
        />

        <main className="inhoud">
          <div className="inhoud-binnen">
            {startMelding ? (
              <Melding
                soort={startMelding.soort}
                actie={
                  <Knop klein soort="stil" icoon="kruis" onClick={verbergStartMelding}>
                    Sluiten
                  </Knop>
                }
              >
                {startMelding.tekst}
              </Melding>
            ) : null}

            {opslagFout ? <Melding soort="gevaar">{opslagFout}</Melding> : null}

            {toonPagina()}
          </div>
        </main>
      </div>
    </div>
  );
}
