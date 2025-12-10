import type { SessionState, User, Story } from "../types/session";
import { Role } from "../types/session";

class SessionStore {
  private sessions: Map<string, SessionState> = new Map();
  constructor() {
    this.startCleanupTimer();
  }

  private startCleanupTimer(): void {
    if (typeof window !== "undefined") {
      window.setInterval(() => {
        this.cleanupInactiveUsers();
      }, 10000); // Check every 10 seconds
    }
  }

  private cleanupInactiveUsers(): void {
    const now = Date.now();
    const INACTIVITY_TIMEOUT = 60000; // 60 seconds

    this.sessions.forEach((session) => {
      const usersToRemove: string[] = [];

      session.users.forEach((user, userID) => {
        if (now - user.lastSeen > INACTIVITY_TIMEOUT) {
          usersToRemove.push(userID);
        }
      });

      usersToRemove.forEach((userID) => {
        session.users.delete(userID);
        session.votes.delete(userID);
        session.lastActivity = now;
      });
    });
  }

  createSession(facilitatorName: string): { sessionID: string; userID: string; state: SessionState } {
    const sessionID = this.generateSessionID();
    const userID = this.generateUserID();

    const facilitator: User = {
      userID,
      displayName: facilitatorName,
      role: Role.FACILITATOR,
      hasVoted: false,
      lastSeen: Date.now(),
    };

    const state: SessionState = {
      sessionID,
      facilitatorID: userID,
      currentStory: "",
      isRevealed: false,
      users: new Map([[userID, facilitator]]),
      votes: new Map(),
      history: [],
      lastActivity: Date.now(),
    };

    this.sessions.set(sessionID, state);

    return { sessionID, userID, state: this.cloneState(state) };
  }

  joinSession(sessionID: string, displayName: string): { userID: string; state: SessionState } | null {
    const session = this.sessions.get(sessionID);
    if (!session) {
      return null;
    }

    const userID = this.generateUserID();
    const user: User = {
      userID,
      displayName,
      role: Role.VOTER,
      hasVoted: false,
      lastSeen: Date.now(),
    };

    session.users.set(userID, user);
    session.lastActivity = Date.now();

    return { userID, state: this.cloneState(session) };
  }

  getSessionState(sessionID: string, userID?: string): SessionState | null {
    const session = this.sessions.get(sessionID);
    if (!session) {
      return null;
    }

    if (userID) {
      const user = session.users.get(userID);
      if (user) {
        user.lastSeen = Date.now();
        session.lastActivity = Date.now();
      }
    }

    return this.cloneState(session);
  }

  updateVote(sessionID: string, userID: string, cardValue: string): boolean {
    const session = this.sessions.get(sessionID);
    if (!session) {
      return false;
    }

    const user = session.users.get(userID);
    if (!user || user.role !== Role.VOTER) {
      return false;
    }

    session.votes.set(userID, cardValue);
    user.hasVoted = true;
    user.lastSeen = Date.now();
    session.lastActivity = Date.now();

    // Auto-reveal if all voters have voted
    const activeVoters = Array.from(session.users.values()).filter(
      (u) => u.role === Role.VOTER
    );
    if (activeVoters.every((voter) => session.votes.has(voter.userID))) {
      session.isRevealed = true;
    }

    return true;
  }

  setStory(sessionID: string, userID: string, storyText: string): boolean {
    const session = this.sessions.get(sessionID);
    if (!session) {
      return false;
    }

    const user = session.users.get(userID);
    if (!user || user.role !== Role.FACILITATOR) {
      return false;
    }

    if (storyText.length > 255) {
      return false;
    }

    session.currentStory = storyText;
    session.lastActivity = Date.now();
    return true;
  }

  revealCards(sessionID: string, userID: string): boolean {
    const session = this.sessions.get(sessionID);
    if (!session) {
      return false;
    }

    const user = session.users.get(userID);
    if (!user || user.role !== Role.FACILITATOR) {
      return false;
    }

    session.isRevealed = true;
    session.lastActivity = Date.now();
    return true;
  }

  resetRound(sessionID: string, userID: string): boolean {
    const session = this.sessions.get(sessionID);
    if (!session) {
      return false;
    }

    const user = session.users.get(userID);
    if (!user || user.role !== Role.FACILITATOR) {
      return false;
    }

    session.votes.clear();
    session.isRevealed = false;
    session.users.forEach((u) => {
      u.hasVoted = false;
    });
    session.lastActivity = Date.now();
    return true;
  }

  archiveStory(sessionID: string, userID: string): boolean {
    const session = this.sessions.get(sessionID);
    if (!session) {
      return false;
    }

    const user = session.users.get(userID);
    if (!user || user.role !== Role.FACILITATOR) {
      return false;
    }

    if (!session.currentStory || !session.isRevealed) {
      return false;
    }

    const votes = Array.from(session.votes.entries())
      .map(([uid, cardValue]) => {
        const u = session.users.get(uid);
        return {
          userID: uid,
          displayName: u?.displayName || "Unknown",
          cardValue,
        };
      })
      .filter((v) => v.cardValue !== "∞" && v.cardValue !== "?");

    const numericValues = votes
      .map((v) => parseFloat(v.cardValue))
      .filter((v) => !isNaN(v));

    const results = {
      min: numericValues.length > 0 ? Math.min(...numericValues) : 0,
      max: numericValues.length > 0 ? Math.max(...numericValues) : 0,
      average:
        numericValues.length > 0
          ? numericValues.reduce((a, b) => a + b, 0) / numericValues.length
          : 0,
      votes: Array.from(session.votes.entries()).map(([uid, cardValue]) => {
        const u = session.users.get(uid);
        return {
          userID: uid,
          displayName: u?.displayName || "Unknown",
          cardValue,
        };
      }),
    };

    const story: Story = {
      storyText: session.currentStory,
      results,
      archivedAt: Date.now(),
    };

    session.history.push(story);
    session.currentStory = "";
    session.votes.clear();
    session.isRevealed = false;
    session.users.forEach((u) => {
      u.hasVoted = false;
    });
    session.lastActivity = Date.now();

    return true;
  }

  private generateSessionID(): string {
    return Math.random().toString(36).substring(2, 8).toUpperCase();
  }

  private generateUserID(): string {
    return `user_${Date.now()}_${Math.random().toString(36).substring(2, 9)}`;
  }

  private cloneState(state: SessionState): SessionState {
    return {
      ...state,
      users: new Map(state.users),
      votes: new Map(state.votes),
      history: [...state.history],
    };
  }
}

export const sessionStore = new SessionStore();

