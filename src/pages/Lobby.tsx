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
    <div className="max-w-lg mx-auto bg-white p-4 rounded shadow">
      <h1 className="text-2xl font-bold mb-4">Add Players</h1>

      <div className="space-y-2">
        <input
          placeholder="Name"
          className="border p-2 w-full"
          value={form.name}
          onChange={(e) => setForm({ ...form, name: e.target.value })}
        />

        <div className="grid grid-cols-3 gap-2">
          <input
            type="number"
            className="border p-2"
            value={form.offence}
            onChange={(e) =>
              setForm({ ...form, offence: Number(e.target.value) })
            }
          />
          <input
            type="number"
            className="border p-2"
            value={form.defence}
            onChange={(e) =>
              setForm({ ...form, defence: Number(e.target.value) })
            }
          />
          <input
            type="number"
            className="border p-2"
            value={form.iq}
            onChange={(e) => setForm({ ...form, iq: Number(e.target.value) })}
          />
        </div>

        <button
          className="bg-blue-600 text-white p-2 rounded w-full"
          onClick={() => {
            if (!form.name) return;
            setPlayers([
              ...players,
              {
                id: uuidv4(),
                name: form.name,
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

      <ul className="mt-4 space-y-1">
        {players.map((p) => (
          <li key={p.id} className="border-b pb-1">
            {p.name} — O:{p.offence} D:{p.defence} IQ:{p.iq}
          </li>
        ))}
      </ul>

      <button
        className="mt-6 bg-green-600 text-white p-2 rounded w-full"
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
