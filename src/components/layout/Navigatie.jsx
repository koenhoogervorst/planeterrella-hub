/** Zijbalk met navigatie en de kopbalk met de globale zoekbalk. */

import { Icoon } from '../ui/Icoon.jsx';
import { Knop } from '../ui/Basis.jsx';
import { Deelstatus } from './Deelstatus.jsx';

export const PAGINAS = [
  { id: 'dashboard', naam: 'Dashboard', icoon: 'dashboard', groep: 'Overzicht' },
  { id: 'voortgang', naam: 'Voortgang', icoon: 'voortgang', groep: 'Overzicht' },
  { id: 'planning', naam: 'Planning', icoon: 'kalender', groep: 'Werk' },
  { id: 'taken', naam: 'Taken', icoon: 'taken', groep: 'Werk', telling: 'takenOpen' },
  { id: 'team', naam: 'Team', icoon: 'team', groep: 'Werk' },
  { id: 'onderdelen', naam: 'Projectonderdelen', icoon: 'onderdelen', groep: 'Techniek' },
  { id: 'eisen', naam: 'Eisen', icoon: 'eisen', groep: 'Techniek', telling: 'eisenOpen' },
  { id: 'onderzoek', naam: 'Onderzoek', icoon: 'onderzoek', groep: 'Techniek' },
  { id: 'risicos', naam: 'Problemen & risico’s', icoon: 'risicos', groep: 'Techniek', telling: 'risicosOpen' },
  { id: 'bronnen', naam: 'Bronnen', icoon: 'bronnen', groep: 'Kennis' },
  { id: 'documentatie', naam: 'Documentatie', icoon: 'documentatie', groep: 'Kennis' },
  { id: 'beslissingen', naam: 'Beslissingen', icoon: 'beslissingen', groep: 'Kennis' },
  { id: 'zoeken', naam: 'Zoeken', icoon: 'zoeken', groep: 'Kennis' },
  { id: 'instellingen', naam: 'Instellingen & back-up', icoon: 'instellingen', groep: 'Beheer' },
];

const GROEPEN = ['Overzicht', 'Werk', 'Techniek', 'Kennis', 'Beheer'];

export function Zijbalk({ pagina, gaNaar, open, sluit, projectnaam, tellingen }) {
  return (
    <nav className="zijbalk" data-open={open ? 'true' : 'false'} aria-label="Hoofdnavigatie">
      <div className="zijbalk-merk">
        <span
          aria-hidden="true"
          style={{
            width: 30,
            height: 30,
            borderRadius: 8,
            background: 'linear-gradient(140deg, #3b5bdb, #7048e8)',
            display: 'grid',
            placeItems: 'center',
            color: '#fff',
            flexShrink: 0,
          }}
        >
          <Icoon naam="onderdelen" grootte={17} />
        </span>
        <div className="vul" style={{ minWidth: 0 }}>
          <div className="zijbalk-merk-titel afgekapt">Projecthub</div>
          <div className="mini dof afgekapt">{projectnaam}</div>
        </div>
        <Knop soort="stil" alleenIcoon icoon="kruis" className="zijbalk-sluit" onClick={sluit} aria-label="Menu sluiten" />
      </div>

      <div className="zijbalk-nav">
        {GROEPEN.map((groep) => {
          const items = PAGINAS.filter((p) => p.groep === groep);
          if (items.length === 0) return null;
          return (
            <div key={groep}>
              <div className="zijbalk-groep">{groep}</div>
              {items.map((p) => {
                const telling = p.telling ? tellingen[p.telling] : 0;
                return (
                  <button
                    key={p.id}
                    type="button"
                    className="nav-knop"
                    aria-current={pagina === p.id ? 'page' : undefined}
                    onClick={() => gaNaar(p.id)}
                  >
                    <Icoon naam={p.icoon} grootte={16} />
                    <span className="vul afgekapt">{p.naam}</span>
                    {telling > 0 ? <span className="nav-telling">{telling}</span> : null}
                  </button>
                );
              })}
            </div>
          );
        })}
      </div>

      <div className="zijbalk-voet">
        <span className="mini dof">
          Gegevens staan lokaal in deze browser. Maak regelmatig een back-up via Instellingen.
        </span>
      </div>
    </nav>
  );
}

export function Kopbalk({ titel, zoekterm, setZoekterm, opZoek, openMenu, thema, wisselThema }) {
  return (
    <header className="kopbalk">
      <Knop soort="stil" alleenIcoon icoon="menu" className="mobiel-knop" onClick={openMenu} aria-label="Menu openen" />
      <span className="kopbalk-titel vul afgekapt">{titel}</span>

      <div className="kopbalk-zoek">
        <span className="kopbalk-zoek-icoon">
          <Icoon naam="zoeken" grootte={15} />
        </span>
        <input
          type="search"
          className="invoer"
          placeholder="Zoek in het hele project…"
          value={zoekterm}
          onChange={(e) => setZoekterm(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === 'Enter') opZoek();
          }}
          aria-label="Zoeken in het hele project"
        />
      </div>

      <Deelstatus />

      <Knop
        soort="stil"
        alleenIcoon
        icoon={thema === 'donker' ? 'ster' : 'blok'}
        onClick={wisselThema}
        aria-label={thema === 'donker' ? 'Lichte weergave' : 'Donkere weergave'}
        title={thema === 'donker' ? 'Lichte weergave' : 'Donkere weergave'}
      />
    </header>
  );
}
