/**
 * Maakt van de build één los HTML-bestand dat je kunt dubbelklikken.
 *
 * Waarom: `npm run dev` is prima tijdens het aanpassen, maar voor dagelijks
 * gebruik wil je gewoon een bestand kunnen openen. Dit script plakt de CSS en
 * de JavaScript uit dist/ in de HTML, zodat er niets meer los bij hoeft.
 *
 * Gebruik:  npm run build  &&  npm run bundel
 * Resultaat: Planeterrella-Projecthub.html in de projectmap.
 */

import { readFile, writeFile, readdir } from 'node:fs/promises';
import { existsSync } from 'node:fs';
import { join, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';

const projectmap = join(dirname(fileURLToPath(import.meta.url)), '..');
const distMap = join(projectmap, 'dist');
const uitvoer = join(projectmap, 'Planeterrella-Projecthub.html');

function stop(bericht) {
  console.error(`\nFout: ${bericht}\n`);
  process.exit(1);
}

if (!existsSync(distMap)) {
  stop('de map dist/ bestaat niet. Draai eerst: npm run build');
}

const html = await readFile(join(distMap, 'index.html'), 'utf8');
const assets = await readdir(join(distMap, 'assets'));

const jsBestand = assets.find((n) => n.endsWith('.js'));
const cssBestand = assets.find((n) => n.endsWith('.css'));
if (!jsBestand || !cssBestand) {
  stop('kon de gebouwde JavaScript of CSS niet vinden in dist/assets.');
}

const js = await readFile(join(distMap, 'assets', jsBestand), 'utf8');
const css = await readFile(join(distMap, 'assets', cssBestand), 'utf8');

/* Een los bestand mag geen losse modules meer inladen — dat blokkeert de
   browser bij het openen vanaf de schijf (file://). */
if (/^\s*import\s|^\s*export\s/m.test(js)) {
  stop(
    'de gebouwde JavaScript bevat nog import/export-regels. Zet code-splitsing uit in vite.config.js.',
  );
}

let resultaat = html
  /* De losse verwijzingen naar de bestanden eruit halen ... */
  .replace(/<script[^>]*src="[^"]*"[^>]*><\/script>\s*/g, '')
  .replace(/<link[^>]*rel="stylesheet"[^>]*>\s*/g, '')
  .replace(/<link[^>]*rel="modulepreload"[^>]*>\s*/g, '')
  /* ... en de inhoud er direct in zetten. */
  .replace('</head>', `  <style>\n${css}\n  </style>\n  </head>`)
  .replace('</body>', `  <script type="module">\n${js}\n  </script>\n  </body>`);

/* Kleine controle: alles moet er echt in staan. */
if (!resultaat.includes('<style>') || !resultaat.includes('<script type="module">')) {
  stop('het samenvoegen is misgegaan; controleer dist/index.html.');
}
if (/(src|href)="\.?\/?assets\//.test(resultaat)) {
  stop('er staan nog verwijzingen naar losse bestanden in de HTML.');
}

resultaat = resultaat.replace(
  '<head>',
  `<head>
  <!--
    Planeterrella Projecthub — losse versie.
    Dit bestand bevat de complete app. Dubbelklik het om te openen.
    Je gegevens worden opgeslagen in de browser waarin je het opent.
    Gegenereerd met: npm run build && npm run bundel
  -->`,
);

await writeFile(uitvoer, resultaat, 'utf8');

const kb = Math.round(Buffer.byteLength(resultaat, 'utf8') / 1024);
console.log(`\nKlaar: Planeterrella-Projecthub.html (${kb} kB)`);
console.log('Dubbelklik dat bestand om de projecthub te openen.\n');
