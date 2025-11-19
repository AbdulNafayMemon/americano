import React from "react";
import { Player } from "../types";
import { scheduleTournament } from "../logic/scheduler";
import { v4 as uuidv4 } from "uuid";

export default function Lobby({
  players,
  setPlayers,
  onStart,
}: {
  players: Player[];
  setPlayers: (p: Player[]) => void;
  onStart: (matches: any[]) => void;
}) {
  const [form, setForm] = React.useState({
    name: "",
    offence: 50,
    defence: 50,
    iq: 50,
  });

  return (
    <div className="max-w-xl mx-auto mt-8 space-y-6">
      <h1 className="text-3xl font-bold text-center">Americano Setup</h1>

      <div className="card space-y-4">
        <h2 className="text-xl font-semibold">Add Player</h2>

        <input
          placeholder="Player Name"
          className="input"
          value={form.name}
          onChange={(e) => setForm({ ...form, name: e.target.value })}
        />

        <div className="grid grid-cols-3 gap-3">
          <input
            type="number"
            className="input"
            placeholder="Offence"
            value={form.offence}
            onChange={(e) =>
              setForm({ ...form, offence: Number(e.target.value) })
            }
          />

          <input
            type="number"
            className="input"
            placeholder="Defence"
            value={form.defence}
            onChange={(e) =>
              setForm({ ...form, defence: Number(e.target.value) })
            }
          />

          <input
            type="number"
            className="input"
            placeholder="IQ"
            value={form.iq}
            onChange={(e) => setForm({ ...form, iq: Number(e.target.value) })}
          />
        </div>

        <button
          className="button"
          onClick={() => {
            if (!form.name) return;

            setPlayers([
              ...players,
              {
                id: uuidv4(),
                name: form.name.trim(),
                offence: form.offence,
                defence: form.defence,
                iq: form.iq,
                composite:
                  0.4 * form.offence +
                  0.4 * form.defence +
                  0.2 * form.iq,
              },
            ]);

            setForm({ name: "", offence: 50, defence: 50, iq: 50 });
          }}
        >
          Add Player
        </button>
      </div>

      <div className="card">
        <h2 className="text-xl font-semibold mb-3">Players</h2>

        <ul className="space-y-2">
          {players.map((p) => (
            <li key={p.id} className="p-2 rounded-md bg-gray-100">
              <div className="font-semibold">{p.name}</div>
              <div className="text-sm text-gray-600">
                O:{p.offence} • D:{p.defence} • IQ:{p.iq}
              </div>
            </li>
          ))}
        </ul>
      </div>

      <button
        className="button bg-green-600 hover:bg-green-700"
        onClick={() => {
          const matches = scheduleTournament(players, 1);
          onStart(matches);
        }}
      >
        Start Tournament
      </button>
    </div>
  );
}
