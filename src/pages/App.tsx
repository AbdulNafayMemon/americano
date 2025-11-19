import React from "react";
import Lobby from "./Lobby";
import LiveBoard from "./LiveBoard";
import { Player, Match } from "../types";

export default function App() {
  const [players, setPlayers] = React.useState<Player[]>([]);
  const [matches, setMatches] = React.useState<Match[]>([]);
  const [stage, setStage] = React.useState<"lobby" | "tournament">("lobby");

  return (
    <div className="min-h-screen p-4 bg-slate-100">
      {stage === "lobby" && (
        <Lobby
          players={players}
          setPlayers={setPlayers}
          onStart={(m) => {
            setMatches(m);
            setStage("tournament");
          }}
        />
      )}

      {stage === "tournament" && (
        <LiveBoard matches={matches} setMatches={setMatches} />
      )}
    </div>
  );
}
