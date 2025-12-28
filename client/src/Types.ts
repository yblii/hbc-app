export type User = {
  email: string;
  firstName?: string;
  lastName?: string;
}

export type Group = {
  id: number;
  players: User[];
}

export type Court = {
  id: number;
  activeGroup: Group | null; // might be null if court is empty
}