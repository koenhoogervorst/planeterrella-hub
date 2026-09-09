/** Genereert korte, unieke id's voor nieuwe items. */

let teller = 0;

export function nieuwId(voorvoegsel = 'x') {
  teller += 1;
  const tijd = Date.now().toString(36);
  const toeval = Math.random().toString(36).slice(2, 7);
  return `${voorvoegsel}-${tijd}${teller.toString(36)}${toeval}`;
}
