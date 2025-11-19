import React from "react";
import { Match } from "../types";

export default function LiveBoard({
  matches,
  setMatches,
}: {
  matches: Match[];
  setMatches: (m: Match[]) => void;
}) {
  return (
    <div className="max-w-2xl mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">Live Tournament</h1>

      {matches.map((m) => (
        <div key={m.id} className="bg-white p-3 border rounded mb-2">
          <div className="font-semibold">Round {m.round}</div>

          <div>
            <b>Team A:</b> {m.teamA.p1.name} & {m.teamA.p2.name}
          </div>
          <div>
            <b>Team B:</b> {m.teamB.p1.name} & {m.teamB.p2.name}
          </div>

          <div className="flex gap-2 mt-2">
            <input
              type="number"
              placeholder="A score"
              className="border p-1 w-20"
              onChange={(e) =>
                setMatches(
                  matches.map((x) =>
                    x.id === m.id ? { ...x, scoreA: Number(e.target.value) } : x
                  )
                )
              }
            />
            <input
              type="number"
              placeholder="B score"
              className="border p-1 w-20"
              onChange={(e) =>
                setMatches(
                  matches.map((x) =>
                    x.id === m.id ? { ...x, scoreB: Number(e.target.value) } : x
                  )
                )
              }
            />
          </div>
        </div>
      ))}
    </div>
  );
}
