/** Kleine, veelgebruikte bouwstenen: knop, kaart, badge, balk, avatar,
 *  lege staat, melding en de herkomstmarkering. */

import { Icoon } from './Icoon.jsx';
import {
  STATUSSEN,
  PRIORITEITEN,
  EIS_STATUSSEN,
  ONDERZOEK_STATUSSEN,
  ONDERDEEL_STATUSSEN,
  RISICO_STATUSSEN,
  ERNSTEN,
  HERKOMSTEN,
  zoekOp,
} from '../../data/constanten.js';

/* ---------------- Knop ---------------- */

export function Knop({
  children,
  soort = 'gewoon',
  klein = false,
  icoon = null,
  alleenIcoon = false,
  className = '',
  ...rest
}) {
  const soortKlasse =
    soort === 'primair' ? ' knop-primair' : soort === 'gevaar' ? ' knop-gevaar' : soort === 'stil' ? ' knop-stil' : '';
  return (
    <button
      type="button"
      className={`knop${soortKlasse}${klein ? ' knop-klein' : ''}${alleenIcoon ? ' knop-icoon' : ''} ${className}`.trim()}
      {...rest}
    >
      {icoon ? <Icoon naam={icoon} grootte={klein || alleenIcoon ? 14 : 15} /> : null}
      {children}
    </button>
  );
}

/* ---------------- Kaart ---------------- */

export function Kaart({ titel, actie, children, strak = false, className = '', ...rest }) {
  return (
    <section className={`kaart ${className}`.trim()} {...rest}>
      {titel ? (
        <header className="kaart-kop">
          <h3 className="kaart-kop-titel vul">{titel}</h3>
          {actie}
        </header>
      ) : null}
      <div className={strak ? 'kaart-lijf kaart-lijf-strak' : 'kaart-lijf'}>{children}</div>
    </section>
  );
}

/* ---------------- Badge ---------------- */

export function Badge({ kleur = 'neutraal', stip = false, children, ...rest }) {
  return (
    <span className={`badge badge-${kleur}`} {...rest}>
      {stip ? <span className="badge-stip" /> : null}
      {children}
    </span>
  );
}

export function StatusBadge({ status }) {
  const gevonden = zoekOp(STATUSSEN, status);
  return (
    <Badge kleur={status} stip>
      {gevonden ? gevonden.kort : status}
    </Badge>
  );
}

export function PrioriteitBadge({ prioriteit }) {
  const gevonden = zoekOp(PRIORITEITEN, prioriteit);
  return <Badge kleur={prioriteit}>{gevonden ? gevonden.naam : prioriteit}</Badge>;
}

const EIS_KLEUR = {
  open: 'neutraal',
  bezig: 'info',
  behaald: 'goed',
  herbeoordelen: 'waarschuwing',
  vervallen: 'omlijnd',
};

export function EisStatusBadge({ status }) {
  return <Badge kleur={EIS_KLEUR[status] || 'neutraal'}>{zoekOp(EIS_STATUSSEN, status)?.naam || status}</Badge>;
}

const ONDERZOEK_KLEUR = { open: 'neutraal', bezig: 'info', deels: 'waarschuwing', beantwoord: 'goed' };

export function OnderzoekStatusBadge({ status }) {
  return (
    <Badge kleur={ONDERZOEK_KLEUR[status] || 'neutraal'}>
      {zoekOp(ONDERZOEK_STATUSSEN, status)?.naam || status}
    </Badge>
  );
}

const ONDERDEEL_KLEUR = {
  idee: 'neutraal',
  ontwerp: 'info',
  inkoop: 'accent',
  bouw: 'waarschuwing',
  test: 'accent',
  klaar: 'goed',
};

export function OnderdeelStatusBadge({ status }) {
  return (
    <Badge kleur={ONDERDEEL_KLEUR[status] || 'neutraal'}>
      {zoekOp(ONDERDEEL_STATUSSEN, status)?.naam || status}
    </Badge>
  );
}

const RISICO_KLEUR = { open: 'gevaar', bezig: 'waarschuwing', beheerst: 'info', opgelost: 'goed' };

export function RisicoStatusBadge({ status }) {
  return (
    <Badge kleur={RISICO_KLEUR[status] || 'neutraal'}>{zoekOp(RISICO_STATUSSEN, status)?.naam || status}</Badge>
  );
}

const ERNST_KLEUR = { laag: 'neutraal', middel: 'info', hoog: 'waarschuwing', kritiek: 'gevaar' };

export function ErnstBadge({ ernst }) {
  return <Badge kleur={ERNST_KLEUR[ernst] || 'neutraal'}>{zoekOp(ERNSTEN, ernst)?.naam || ernst}</Badge>;
}

/* ---------------- Herkomst ---------------- */

export function HerkomstLabel({ herkomst, kort = false }) {
  const soort = zoekOp(HERKOMSTEN, herkomst);
  if (!soort) return null;
  return (
    <span className="herkomst" data-soort={herkomst} title={soort.uitleg}>
      {herkomst === 'bestand' ? <Icoon naam="bestand" grootte={11} /> : null}
      {herkomst === 'voorstel' ? <Icoon naam="vraag" grootte={11} /> : null}
      {kort ? soort.kort : soort.naam}
    </span>
  );
}

/* ---------------- Voortgangsbalk ---------------- */

function Balk({ waarde, kleur, dun = false, label }) {
  const veilig = Math.max(0, Math.min(100, Number.isFinite(waarde) ? waarde : 0));
  return (
    <div
      className={`balk${dun ? ' balk-dun' : ''}`}
      role="progressbar"
      aria-valuenow={veilig}
      aria-valuemin={0}
      aria-valuemax={100}
      aria-label={label || `${veilig} procent`}
    >
      <div className="balk-vulling" style={{ width: `${veilig}%`, background: kleur || undefined }} />
    </div>
  );
}

export function BalkMetGetal({ waarde, kleur, label }) {
  const veilig = Math.max(0, Math.min(100, Number.isFinite(waarde) ? waarde : 0));
  return (
    <div className="balk-rij">
      <Balk waarde={veilig} kleur={kleur} label={label} />
      <span className="balk-getal">{veilig}%</span>
    </div>
  );
}

/* ---------------- Avatar ---------------- */

function initialen(naam) {
  const woorden = String(naam || '').trim().split(/\s+/).filter(Boolean);
  if (woorden.length === 0) return '?';
  if (woorden.length === 1) return woorden[0].slice(0, 2).toUpperCase();
  return (woorden[0][0] + woorden[woorden.length - 1][0]).toUpperCase();
}

export function Avatar({ lid, formaat = 'normaal' }) {
  const klasse = formaat === 'groot' ? 'avatar avatar-groot' : formaat === 'klein' ? 'avatar avatar-klein' : 'avatar';
  if (!lid) {
    return (
      <span className={klasse} style={{ background: 'var(--tekst-dof)' }} title="Niet toegewezen">
        —
      </span>
    );
  }
  return (
    <span className={klasse} style={{ background: lid.kleur }} title={lid.naam}>
      {initialen(lid.naam)}
    </span>
  );
}

/* ---------------- Lege staat ---------------- */

export function Leeg({ titel = 'Niets gevonden', tekst, actie }) {
  return (
    <div className="leeg">
      <div className="leeg-titel">{titel}</div>
      {tekst ? <p className="klein">{tekst}</p> : null}
      {actie}
    </div>
  );
}

/* ---------------- Melding ---------------- */

const MELDING_ICOON = {
  info: 'info',
  waarschuwing: 'waarschuwing',
  gevaar: 'waarschuwing',
  goed: 'vink',
};

export function Melding({ soort = 'info', children, actie }) {
  return (
    <div className={`melding melding-${soort}`}>
      <Icoon naam={MELDING_ICOON[soort] || 'info'} grootte={16} />
      <div className="vul">{children}</div>
      {actie}
    </div>
  );
}

/* ---------------- Statistiektegel ---------------- */

export function Stat({ label, waarde, onder, icoon, kleur }) {
  return (
    <div className="kaart">
      <div className="stat">
        <span className="stat-label">
          {icoon ? <Icoon naam={icoon} grootte={14} /> : null}
          {label}
        </span>
        <span className="stat-waarde" style={kleur ? { color: kleur } : undefined}>
          {waarde}
        </span>
        {onder ? <span className="stat-onder">{onder}</span> : null}
      </div>
    </div>
  );
}
