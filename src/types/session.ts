export const Role = {
  FACILITATOR: "FACILITATOR",
  VOTER: "VOTER",
  OBSERVER: "OBSERVER",
} as const;

export type Role = (typeof Role)[keyof typeof Role];

export interface User {
  userID: string;
  displayName: string;
  role: Role;
  hasVoted: boolean;
  lastSeen: number;
}

export interface Vote {
  userID: string;
  cardValue: string;
  submittedAt: number;
}

export interface Story {
  storyText: string;
  results: {
    min: number;
    max: number;
    average: number;
    votes: Array<{ userID: string; displayName: string; cardValue: string }>;
  };
  archivedAt: number;
}

export interface SessionState {
  sessionID: string;
  facilitatorID: string;
  currentStory: string;
  isRevealed: boolean;
  users: Map<string, User>;
  votes: Map<string, string>;
  history: Story[];
  lastActivity: number;
}

