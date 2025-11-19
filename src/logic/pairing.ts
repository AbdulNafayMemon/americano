import { Player, Team, Match } from "../types";

// Composite rating calc
export const composite = (p: Player) =>
  0.4 * p.offence + 0.4 * p.defence + 0.2 * p.iq;

// Team rating
export const teamRating = (t: Team) =>
  (t.p1.composite + t.p2.composite) / 2;

// Objective: minimize opponent rating difference
export const matchObjective = (a: Team, b: Team) => {
  const diff = teamRating(a) - teamRating(b);
  return diff * diff;
};

/**
 * Main pairing engine
 * Generates teams with:
 * - no repeated partners
 * - minimal imbalance
 * - full browser performance
 */
export function generateRoundPairings(
  players: Player[],
  partnerHistory: Map<string, Set<string>>
): { matches: { teamA: Team; teamB: Team }[] } {
  const N = players.length;
  if (N !== 4) throw new Error("Internal error: round must have exactly 4 players.");

  // STEP 1: Generate 3 possible perfect matchings
  // (Small enough to brute force safely)
  const matchings: Team[][] = [];

  const [A, B, C, D] = players;

  matchings.push([
    { p1: A, p2: B },
    { p1: C, p2: D },
  ]);

  matchings.push([
    { p1: A, p2: C },
    { p1: B, p2: D },
  ]);

  matchings.push([
    { p1: A, p2: D },
    { p1: B, p2: C },
  ]);

  // STEP 2: Filter out partner-history repeats
  const validMatchings = matchings.filter((teams) => {
    for (const t of teams) {
      if (partnerHistory.get(t.p1.id)?.has(t.p2.id)) return false;
      if (partnerHistory.get(t.p2.id)?.has(t.p1.id)) return false;
    }
    return true;
  });

  // If none valid, allow fallback to least-bad
  const finalPool = validMatchings.length ? validMatchings : matchings;

  // STEP 3: Evaluate objectives, pick minimum
  let best = finalPool[0];
  let bestScore = matchObjective(finalPool[0][0], finalPool[0][1]);

  for (let i = 1; i < finalPool.length; i++) {
    const score = matchObjective(finalPool[i][0], finalPool[i][1]);
    if (score < bestScore) {
      bestScore = score;
      best = finalPool[i];
    }
  }

  return {
    matches: [
      {
        teamA: best[0],
        teamB: best[1],
      },
    ],
  };
}
