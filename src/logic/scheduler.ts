import { Player, Team, Match } from "../types";
import { v4 as uuidv4 } from "uuid";
import { teamRating } from "./pairing";

// Generate all combinations of 2 players (teammates)
function generateTeams(players: Player[]): Team[] {
  const result: Team[] = [];
  for (let i = 0; i < players.length; i++) {
    for (let j = i + 1; j < players.length; j++) {
      result.push({ p1: players[i], p2: players[j] });
    }
  }
  return result;
}

function sharePlayer(a: Team, b: Team): boolean {
  return (
    a.p1.id === b.p1.id ||
    a.p1.id === b.p2.id ||
    a.p2.id === b.p1.id ||
    a.p2.id === b.p2.id
  );
}

export function scheduleTournament(players: Player[], courts: number): Match[] {
  const N = players.length;

  // Only 8 or 9 players allowed
  if (N !== 8 && N !== 9) {
    throw new Error("Americano only supports 8 or 9 players.");
  }

  const TOTAL_TEAMS = (N * (N - 1)) / 2; // 28 for 8p, 36 for 9p
  const MATCHES = TOTAL_TEAMS / 2;       // 14 for 8p, 18 for 9p

  const teams = generateTeams(players);

  const used = new Set<number>();       // team indexes used
  const matches: Match[] = [];

  // Balanced opponent matching
  for (let i = 0; i < teams.length; i++) {
    if (used.has(i)) continue;

    const tA = teams[i];

    let bestJ = -1;
    let bestDiff = Infinity;

    for (let j = i + 1; j < teams.length; j++) {
      if (used.has(j)) continue;

      const tB = teams[j];
      if (sharePlayer(tA, tB)) continue;

      // rating difference
      const diff = Math.abs(teamRating(tA) - teamRating(tB));
      if (diff < bestDiff) {
        bestDiff = diff;
        bestJ = j;
      }
    }

    if (bestJ === -1) {
      // If stuck, fallback: just find ANY valid unused team
      for (let j = i + 1; j < teams.length; j++) {
        if (used.has(j)) continue;
        const tB = teams[j];
        if (!sharePlayer(tA, tB)) {
          bestJ = j;
          break;
        }
      }
    }

    if (bestJ === -1) {
      throw new Error("Could not schedule all matches (rare).");
    }

    // mark teams as used
    used.add(i);
    used.add(bestJ);

    matches.push({
      id: uuidv4(),
      round: matches.length + 1,
      teamA: teams[i],
      teamB: teams[bestJ],
    });
  }

  // Trim to exact Americano match count (should already match)
  return matches.slice(0, MATCHES);
}
