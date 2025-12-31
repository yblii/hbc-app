export type User = {
  id: number;
  email: string;
  firstName?: string;
  lastName?: string;
}

export type GroupMember = {
    id: number;
    firstName: string;
}

export type Group = {
  id: number;
  players: GroupMember[];
}

export type Court = {
  id: number;
  activeGroup: Group | null; // might be null if court is empty
}

export type GroupCleanupData = {
    type: "UPDATED";
    group: Group;
} | {
    type: "DELETED";
    groupId: number;
};