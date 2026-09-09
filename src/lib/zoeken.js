/** Globale zoekfunctie over alle onderdelen van het project. */

/** Maakt tekst vergelijkbaar: kleine letters, zonder accenten. */
function normaliseer(tekst) {
  return String(tekst || '')
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '');
}

/** Bevat de haystack alle losse woorden uit de zoekterm? */
export function bevatTerm(haystack, term) {
  const doel = normaliseer(haystack);
  const woorden = normaliseer(term).split(/\s+/).filter(Boolean);
  if (woorden.length === 0) return true;
  return woorden.every((w) => doel.includes(w));
}

/** Knipt een stukje tekst rond de eerste treffer uit, voor de resultaatweergave. */
export function fragment(tekst, term, lengte = 130) {
  const bron = String(tekst || '');
  if (!bron) return '';
  const eersteWoord = normaliseer(term).split(/\s+/).filter(Boolean)[0];
  if (!eersteWoord) return bron.slice(0, lengte);
  const positie = normaliseer(bron).indexOf(eersteWoord);
  if (positie < 0) return bron.slice(0, lengte);
  const start = Math.max(0, positie - 40);
  const stuk = bron.slice(start, start + lengte);
  return (start > 0 ? '…' : '') + stuk + (start + lengte < bron.length ? '…' : '');
}

const SOORTEN = [
  {
    sleutel: 'taken',
    label: 'Taak',
    pagina: 'taken',
    titel: (i) => i.titel,
    velden: (i) => [i.titel, i.beschrijving, i.notities, i.bron],
  },
  {
    sleutel: 'bronnen',
    label: 'Bron',
    pagina: 'bronnen',
    titel: (i) => i.titel,
    velden: (i) => [i.titel, i.auteur, i.organisatie, i.onderwerp, i.samenvatting, i.notities, i.url, i.gebruiktVoor],
  },
  {
    sleutel: 'onderzoeken',
    label: 'Onderzoek',
    pagina: 'onderzoek',
    titel: (i) => i.vraag,
    velden: (i) => [i.vraag, i.waarom, i.huidigeKennis, i.resultaten, i.conclusie, i.vervolgvragen],
  },
  {
    sleutel: 'eisen',
    label: 'Eis',
    pagina: 'eisen',
    titel: (i) => `${i.code ? `${i.code} — ` : ''}${i.omschrijving}`,
    velden: (i) => [i.code, i.omschrijving, i.verificatie, i.notitie, i.bron],
  },
  {
    sleutel: 'onderdelen',
    label: 'Projectonderdeel',
    pagina: 'onderdelen',
    titel: (i) => i.naam,
    velden: (i) => [i.naam, i.omschrijving, i.notities, i.bestanden],
  },
  {
    sleutel: 'documenten',
    label: 'Document',
    pagina: 'documentatie',
    titel: (i) => i.titel,
    velden: (i) => [i.titel, i.soort, i.pad, i.omschrijving, i.notities],
  },
  {
    sleutel: 'beslissingen',
    label: 'Beslissing',
    pagina: 'beslissingen',
    titel: (i) => i.beslissing,
    velden: (i) => [i.beslissing, i.reden, i.gevolgen, i.notitie],
  },
  {
    sleutel: 'risicos',
    label: 'Probleem / risico',
    pagina: 'risicos',
    titel: (i) => i.titel,
    velden: (i) => [i.titel, i.omschrijving, i.oplossing, i.notities],
  },
];

/**
 * Zoekt door alle collecties.
 * Levert een lijst met { id, soort, label, pagina, titel, fragment }.
 */
export function zoekAlles(staat, term, maxPerSoort = 12) {
  const schoon = String(term || '').trim();
  if (schoon.length < 2) return [];

  const treffers = [];
  SOORTEN.forEach((soort) => {
    const lijst = Array.isArray(staat[soort.sleutel]) ? staat[soort.sleutel] : [];
    let gevonden = 0;
    lijst.forEach((item) => {
      if (gevonden >= maxPerSoort) return;
      const velden = soort.velden(item).filter(Boolean);
      const alles = velden.join(' • ');
      if (!bevatTerm(alles, schoon)) return;
      gevonden += 1;
      treffers.push({
        id: item.id,
        soort: soort.sleutel,
        label: soort.label,
        pagina: soort.pagina,
        titel: soort.titel(item) || '(geen titel)',
        fragment: fragment(velden.slice(1).join(' • ') || velden[0] || '', schoon),
      });
    });
  });

  return treffers;
}

/** Markeert de zoekterm in een stuk tekst. Levert stukjes voor React. */
export function splitsOpTerm(tekst, term) {
  const bron = String(tekst || '');
  const woorden = normaliseer(term).split(/\s+/).filter(Boolean);
  if (woorden.length === 0 || !bron) return [{ tekst: bron, raak: false }];

  const genormaliseerd = normaliseer(bron);
  const posities = [];
  woorden.forEach((woord) => {
    let index = genormaliseerd.indexOf(woord);
    while (index !== -1) {
      posities.push([index, index + woord.length]);
      index = genormaliseerd.indexOf(woord, index + woord.length);
    }
  });
  if (posities.length === 0) return [{ tekst: bron, raak: false }];

  posities.sort((a, b) => a[0] - b[0]);
  const samengevoegd = [];
  posities.forEach(([start, eind]) => {
    const laatste = samengevoegd[samengevoegd.length - 1];
    if (laatste && start <= laatste[1]) {
      laatste[1] = Math.max(laatste[1], eind);
    } else {
      samengevoegd.push([start, eind]);
    }
  });

  const delen = [];
  let cursor = 0;
  samengevoegd.forEach(([start, eind]) => {
    if (start > cursor) delen.push({ tekst: bron.slice(cursor, start), raak: false });
    delen.push({ tekst: bron.slice(start, eind), raak: true });
    cursor = eind;
  });
  if (cursor < bron.length) delen.push({ tekst: bron.slice(cursor), raak: false });
  return delen;
}
