export interface Player {
  id: string;
  name: string;
  offence: number;
  defence: number;
  iq: number;
  composite: number;
}

export interface Team {
  p1: Player;
  p2: Player;
}

export interface Match {
  id: string;
  round: number;
  teamA: Team;
  teamB: Team;
  scoreA?: number;
  scoreB?: number;
}

export interface Tournament {
  players: Player[];
  matches: Match[];
  rounds: number;
  courts: number;
}
