export type Player = {
  name: string;
  email: string;
}

export type Group = {
  id: number;
  players: Player[];
}

export type Court = {
  id: number;
  activeGroup: Group | null; // might be null if court is empty
}