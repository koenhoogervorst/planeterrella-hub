import { useMemo } from 'react';
import { PaginaKop } from '../components/layout/Pagina.jsx';
import { Kaart, Badge, Leeg, Knop } from '../components/ui/Basis.jsx';
import { Icoon } from '../components/ui/Icoon.jsx';
import { useProject } from '../store/ProjectContext.jsx';
import { zoekAlles, splitsOpTerm } from '../lib/zoeken.js';

const SOORT_KLEUR = {
  taken: 'accent',
  bronnen: 'info',
  onderzoeken: 'neutraal',
  eisen: 'goed',
  onderdelen: 'omlijnd',
  documenten: 'neutraal',
  beslissingen: 'omlijnd',
  risicos: 'gevaar',
};

function Gemarkeerd({ tekst, term }) {
  const delen = splitsOpTerm(tekst, term);
  return (
    <>
      {delen.map((deel, index) =>
        deel.raak ? (
          // eslint-disable-next-line react/no-array-index-key
          <mark key={index} className="markeer">
            {deel.tekst}
          </mark>
        ) : (
          // eslint-disable-next-line react/no-array-index-key
          <span key={index}>{deel.tekst}</span>
        ),
      )}
    </>
  );
}

export function Zoeken({ zoekterm, setZoekterm, gaNaar }) {
  const { staat } = useProject();
  const treffers = useMemo(() => zoekAlles(staat, zoekterm), [staat, zoekterm]);

  const perSoort = useMemo(() => {
    const kaart = new Map();
    treffers.forEach((t) => {
      if (!kaart.has(t.label)) kaart.set(t.label, []);
      kaart.get(t.label).push(t);
    });
    return [...kaart.entries()];
  }, [treffers]);

  return (
    <>
      <PaginaKop
        titel="Zoeken"
        uitleg="Zoek tegelijk door taken, bronnen, onderzoeken, eisen, onderdelen, documenten, beslissingen en risico's."
      />

      <Kaart>
        <div className="kopbalk-zoek" style={{ maxWidth: 'none' }}>
          <span className="kopbalk-zoek-icoon">
            <Icoon naam="zoeken" grootte={16} />
          </span>
          <input
            type="search"
            className="invoer"
            value={zoekterm}
            onChange={(e) => setZoekterm(e.target.value)}
            placeholder="Typ minimaal twee letters…"
            aria-label="Zoekterm"
            autoFocus
          />
        </div>
        {zoekterm.trim().length > 0 && zoekterm.trim().length < 2 ? (
          <p className="mini dof" style={{ marginTop: 8 }}>
            Typ minimaal twee letters.
          </p>
        ) : null}
      </Kaart>

      {zoekterm.trim().length < 2 ? (
        <Kaart>
          <Leeg
            titel="Waar zoek je naar?"
            tekst="Bijvoorbeeld: vacuüm, magneet, hoogspanning, trolley, NEN 3840, Paschen of transporttest."
          />
        </Kaart>
      ) : treffers.length === 0 ? (
        <Kaart>
          <Leeg titel="Geen resultaten" tekst={`Niets gevonden voor "${zoekterm}". Probeer een korter of ander woord.`} />
        </Kaart>
      ) : (
        <>
          <div className="klein zacht">
            {treffers.length} {treffers.length === 1 ? 'resultaat' : 'resultaten'} voor “{zoekterm}”
          </div>

          {perSoort.map(([label, items]) => (
            <Kaart key={label} strak titel={`${label} (${items.length})`}>
              {items.map((treffer) => (
                <button
                  key={`${treffer.soort}-${treffer.id}`}
                  type="button"
                  className="zoek-treffer"
                  onClick={() => gaNaar(treffer.pagina)}
                >
                  <div className="rij" style={{ gap: 8 }}>
                    <span className="vul klein vet">
                      <Gemarkeerd tekst={treffer.titel} term={zoekterm} />
                    </span>
                    <Badge kleur={SOORT_KLEUR[treffer.soort] || 'neutraal'}>{treffer.label}</Badge>
                  </div>
                  {treffer.fragment ? (
                    <span className="mini dof">
                      <Gemarkeerd tekst={treffer.fragment} term={zoekterm} />
                    </span>
                  ) : null}
                </button>
              ))}
            </Kaart>
          ))}

          <div className="rij">
            <Knop soort="stil" icoon="kruis" onClick={() => setZoekterm('')}>
              Zoekopdracht wissen
            </Knop>
          </div>
        </>
      )}
    </>
  );
}
