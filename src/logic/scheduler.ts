import { Player, Match } from "../types";
import { generateRoundPairings } from "./pairing";
import { v4 as uuidv4 } from "uuid";

export function scheduleTournament(
  players: Player[],
  courts: number
): Match[] {
  const N = players.length;
  const R = smallestR(N, courts);

  // play count distribution
  const playsPerPlayer = (R * 4 * courts) / N;

  const playCount = new Map<string, number>();
  const partnerHistory = new Map<string, Set<string>>();

  players.forEach((p) => {
    playCount.set(p.id, 0);
    partnerHistory.set(p.id, new Set());
  });

  const matches: Match[] = [];

  for (let r = 1; r <= R; r++) {
    // pick 4*courts players with the lowest play count
    const sorted = [...players].sort((a, b) => {
      const pa = playCount.get(a.id)!;
      const pb = playCount.get(b.id)!;
      if (pa !== pb) return pa - pb;
      return b.composite - a.composite;
    });

    const selected = sorted.slice(0, 4 * courts);

    for (let c = 0; c < courts; c++) {
      const chunk = selected.slice(c * 4, c * 4 + 4);
      const { matches: roundMatches } = generateRoundPairings(
        chunk,
        partnerHistory
      );

      for (const m of roundMatches) {
        // update history
        partnerHistory.get(m.teamA.p1.id)!.add(m.teamA.p2.id);
        partnerHistory.get(m.teamA.p2.id)!.add(m.teamA.p1.id);

        partnerHistory.get(m.teamB.p1.id)!.add(m.teamB.p2.id);
        partnerHistory.get(m.teamB.p2.id)!.add(m.teamB.p1.id);

        // update play count
        [m.teamA.p1, m.teamA.p2, m.teamB.p1, m.teamB.p2].forEach((p) =>
          playCount.set(p.id, playCount.get(p.id)! + 1)
        );

        matches.push({
          id: uuidv4(),
          round: r,
          teamA: m.teamA,
          teamB: m.teamB,
        });
      }
    }
  }

  return matches;
}

function smallestR(N: number, courts: number): number {
  let r = 1;
  while ((r * 4 * courts) % N !== 0) r++;
  return r;
}
