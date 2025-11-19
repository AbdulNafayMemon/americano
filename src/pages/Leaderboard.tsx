import React from "react";
import { Match } from "../types";

export default function Leaderboard({ matches }: { matches: Match[] }) {
  const players = new Map<
    string,
    { name: string; wins: number; pf: number; pa: number; composite: number }
  >();

  // init
  matches.forEach((m) => {
    const all = [
      m.teamA.p1,
      m.teamA.p2,
      m.teamB.p1,
      m.teamB.p2,
    ];
    all.forEach((p) => {
      if (!players.has(p.id)) {
        players.set(p.id, {
          name: p.name,
          wins: 0,
          pf: 0,
          pa: 0,
          composite: p.composite,
        });
      }
    });
  });

  // scoring aggregation
  matches.forEach((m) => {
    if (m.scoreA == null || m.scoreB == null) return;

    const A = players.get(m.teamA.p1.id)!;
    const A2 = players.get(m.teamA.p2.id)!;
    const B = players.get(m.teamB.p1.id)!;
    const B2 = players.get(m.teamB.p2.id)!;

    A.pf += m.scoreA;
    A.pa += m.scoreB;
    A2.pf += m.scoreA;
    A2.pa += m.scoreB;

    B.pf += m.scoreB;
    B.pa += m.scoreA;
    B2.pf += m.scoreB;
    B2.pa += m.scoreA;

    if (m.scoreA > m.scoreB) {
      A.wins++; 
      A2.wins++;
    } else {
      B.wins++;
      B2.wins++;
    }
  });

  const list = Array.from(players.values()).sort((a, b) => {
    if (b.wins !== a.wins) return b.wins - a.wins;
    const diffA = a.pf - a.pa;
    const diffB = b.pf - b.pa;
    if (diffB !== diffA) return diffB - diffA;
    return b.composite - a.composite;
  });

  return (
    <div className="max-w-xl mx-auto mt-6 card">
      <h1 className="text-2xl font-bold mb-4">Leaderboard</h1>

      <table className="w-full">
        <thead>
          <tr className="text-left border-b">
            <th>Name</th>
            <th>Wins</th>
            <th>+/-</th>
          </tr>
        </thead>
        <tbody>
          {list.map((p) => (
            <tr key={p.name} className="border-b">
              <td>{p.name}</td>
              <td>{p.wins}</td>
              <td>{p.pf - p.pa}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
