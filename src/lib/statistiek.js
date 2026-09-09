/** Berekent alle voortgangscijfers. Alles wordt afgeleid uit de taken —
 *  er wordt nergens een percentage handmatig bijgehouden. */

import { HOGE_PRIORITEITEN, STATUSSEN, PRIORITEITEN } from '../data/constanten.js';
import { dagenTotVandaag, isDatum } from './datums.js';

export function percentage(deel, totaal) {
  if (!totaal) return 0;
  return Math.round((deel / totaal) * 100);
}

/** Statuscijfers over een willekeurige takenlijst. */
export function takenSamenvatting(taken) {
  const perStatus = { todo: 0, bezig: 0, wacht: 0, klaar: 0 };
  taken.forEach((t) => {
    if (perStatus[t.status] !== undefined) perStatus[t.status] += 1;
  });
  const totaal = taken.length;
  const klaar = perStatus.klaar;
  return {
    totaal,
    klaar,
    open: totaal - klaar,
    perStatus,
    percentage: percentage(klaar, totaal),
  };
}

/** Volledige projectstatistiek. */
export function projectStatistiek(staat) {
  const { taken, teamleden, categorieen, fases, eisen, onderzoeken, risicos } = staat;
  const basis = takenSamenvatting(taken);

  const hogePrioriteitOpen = taken.filter(
    (t) => t.status !== 'klaar' && HOGE_PRIORITEITEN.includes(t.prioriteit),
  );

  const metDeadline = taken.filter((t) => t.status !== 'klaar' && isDatum(t.deadline));
  const verlopen = metDeadline.filter((t) => dagenTotVandaag(t.deadline) < 0);
  const dezeWeek = metDeadline.filter((t) => {
    const d = dagenTotVandaag(t.deadline);
    return d >= 0 && d <= 7;
  });

  const perTeamlid = teamleden.map((lid) => {
    const eigen = taken.filter((t) => t.toegewezenAan === lid.id);
    return { lid, ...takenSamenvatting(eigen) };
  });

  const nietToegewezen = taken.filter((t) => !t.toegewezenAan);

  const perCategorie = categorieen
    .map((cat) => {
      const eigen = taken.filter((t) => t.categorie === cat.id);
      return { categorie: cat, ...takenSamenvatting(eigen) };
    })
    .filter((c) => c.totaal > 0);

  const perFase = fases.map((fase) => {
    const eigen = taken.filter((t) => t.fase === fase.id);
    return { fase, ...takenSamenvatting(eigen) };
  });

  const perPrioriteit = PRIORITEITEN.map((p) => ({
    prioriteit: p,
    aantal: taken.filter((t) => t.prioriteit === p.id).length,
    open: taken.filter((t) => t.prioriteit === p.id && t.status !== 'klaar').length,
  }));

  const statusVerdeling = STATUSSEN.map((s) => ({
    status: s,
    aantal: basis.perStatus[s.id] || 0,
  }));

  const eisenBehaald = eisen.filter((e) => e.status === 'behaald').length;
  const eisenVervallen = eisen.filter((e) => e.status === 'vervallen').length;
  const eisenTellend = eisen.length - eisenVervallen;

  const onderzoekBeantwoord = onderzoeken.filter((o) => o.status === 'beantwoord').length;
  const risicosOpen = risicos.filter((r) => r.status === 'open' || r.status === 'bezig').length;

  return {
    ...basis,
    hogePrioriteitOpen,
    verlopen,
    dezeWeek,
    perTeamlid,
    nietToegewezen,
    perCategorie,
    perFase,
    perPrioriteit,
    statusVerdeling,
    eisen: {
      totaal: eisen.length,
      tellend: eisenTellend,
      behaald: eisenBehaald,
      vervallen: eisenVervallen,
      percentage: percentage(eisenBehaald, eisenTellend),
    },
    onderzoek: {
      totaal: onderzoeken.length,
      beantwoord: onderzoekBeantwoord,
      percentage: percentage(onderzoekBeantwoord, onderzoeken.length),
    },
    risicos: {
      totaal: risicos.length,
      open: risicosOpen,
      kritiek: risicos.filter((r) => r.ernst === 'kritiek' && r.status !== 'opgelost').length,
    },
  };
}

/** Taken die wachten op een andere taak die nog niet af is. */
export function geblokkeerdeTaken(taken) {
  const perId = new Map(taken.map((t) => [t.id, t]));
  return taken
    .filter((t) => t.status !== 'klaar' && t.afhankelijkVan.length > 0)
    .map((t) => {
      const blokkers = t.afhankelijkVan
        .map((id) => perId.get(id))
        .filter((b) => b && b.status !== 'klaar');
      return { taak: t, blokkers };
    })
    .filter((r) => r.blokkers.length > 0);
}

/** De eerstvolgende deadlines, gesorteerd. */
export function komendeDeadlines(taken, aantal = 6) {
  return taken
    .filter((t) => t.status !== 'klaar' && isDatum(t.deadline))
    .sort((a, b) => (a.deadline < b.deadline ? -1 : a.deadline > b.deadline ? 1 : 0))
    .slice(0, aantal);
}
