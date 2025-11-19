import React from "react";
import { Match } from "../types";
import Leaderboard from "./Leaderboard";

export default function LiveBoard({
  matches,
  setMatches,
}: {
  matches: Match[];
  setMatches: (m: Match[]) => void;
}) {
  const [tab, setTab] = React.useState<"matches" | "leaderboard">("matches");

  return (
    <div className="max-w-2xl mx-auto mt-6">

      <div className="flex gap-3 mb-4">
        <button
          className={`button-secondary ${tab === "matches" && "!bg-blue-600 !text-white"}`}
          onClick={() => setTab("matches")}
        >
          Matches
        </button>
        <button
          className={`button-secondary ${tab === "leaderboard" && "!bg-blue-600 !text-white"}`}
          onClick={() => setTab("leaderboard")}
        >
          Leaderboard
        </button>
      </div>

      {tab === "leaderboard" && <Leaderboard matches={matches} />}

      {tab === "matches" && (
        <div className="space-y-4">
          {matches.map((m) => (
            <div key={m.id} className="card">
              <h2 className="font-bold text-lg">Round {m.round}</h2>

              <div className="mt-2">
                <b>Team A</b>
                <div>{m.teamA.p1.name} — O:{m.teamA.p1.offence} D:{m.teamA.p1.defence} IQ:{m.teamA.p1.iq}</div>
                <div>{m.teamA.p2.name} — O:{m.teamA.p2.offence} D:{m.teamA.p2.defence} IQ:{m.teamA.p2.iq}</div>
              </div>

              <div className="mt-2">
                <b>Team B</b>
                <div>{m.teamB.p1.name} — O:{m.teamB.p1.offence} D:{m.teamB.p1.defence} IQ:{m.teamB.p1.iq}</div>
                <div>{m.teamB.p2.name} — O:{m.teamB.p2.offence} D:{m.teamB.p2.defence} IQ:{m.teamB.p2.iq}</div>
              </div>

              <div className="grid grid-cols-2 gap-3 mt-3">
                <input
                  type="number"
                  className="input"
                  placeholder="A score"
                  value={m.scoreA ?? ""}
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
                  className="input"
                  placeholder="B score"
                  value={m.scoreB ?? ""}
                  onChange={(e) =>
                    setMatches(
                      matches.map((x) =>
                        x.id === m.id ? { ...x, scoreB: Number(e.target.value) } : x
                      )
                    )
                  }
                />
              </div>

              <button
                className="button mt-3"
                onClick={() => {
                  if (m.scoreA == null || m.scoreB == null) return;
                  setMatches(
                    matches.map((x) =>
                      x.id === m.id ? { ...x, completed: true } : x
                    )
                  );
                }}
              >
                Mark Match Complete
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
