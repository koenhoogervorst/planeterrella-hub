/** Exporteren en importeren: JSON-back-up en CSV voor taken en bronnen. */

/** Zet een waarde veilig in een CSV-cel (Excel-vriendelijk). */
function csvCel(waarde) {
  const tekst = waarde === null || waarde === undefined ? '' : String(waarde);
  if (/[";\n\r]/.test(tekst)) {
    return `"${tekst.replace(/"/g, '""')}"`;
  }
  return tekst;
}

/**
 * Bouwt een CSV met puntkomma's als scheidingsteken — dat opent in een
 * Nederlandse Excel meteen goed in kolommen.
 */
export function maakCsv(kolommen, rijen) {
  const kop = kolommen.map((k) => csvCel(k.label)).join(';');
  const regels = rijen.map((rij) => kolommen.map((k) => csvCel(k.waarde(rij))).join(';'));
  /* BOM zodat Excel de accenten goed leest. */
  return `﻿${[kop, ...regels].join('\r\n')}`;
}

export function downloadTekst(bestandsnaam, inhoud, mime = 'text/plain;charset=utf-8') {
  const blob = new Blob([inhoud], { type: mime });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.download = bestandsnaam;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  /* Even wachten voordat we de url vrijgeven, anders breekt de download af
     in sommige browsers. */
  setTimeout(() => URL.revokeObjectURL(url), 1000);
}

export function datumStempel() {
  const d = new Date();
  const p = (n) => String(n).padStart(2, '0');
  return `${d.getFullYear()}-${p(d.getMonth() + 1)}-${p(d.getDate())}`;
}

/** Leest een bestand als tekst. */
export function leesBestand(bestand) {
  return new Promise((resolve, reject) => {
    const lezer = new FileReader();
    lezer.onload = () => resolve(String(lezer.result || ''));
    lezer.onerror = () => reject(new Error('Het bestand kon niet gelezen worden.'));
    lezer.readAsText(bestand);
  });
}
