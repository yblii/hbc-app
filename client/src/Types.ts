export type Player = {
  name: string;
  email: string;
}

export type Slip = {
  id: number;
  players: Player[];
}

export type Court = {
  id: number;
  activeGroup: Slip | null; // might be null if court is empty
}