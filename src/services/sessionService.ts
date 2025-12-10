import { sessionStore } from "./sessionStore";
import type {
  CreateSessionRequest,
  CreateSessionResponse,
  JoinSessionRequest,
  JoinSessionResponse,
  VoteRequest,
  VoteResponse,
  StoryRequest,
  StoryResponse,
  RevealRequest,
  RevealResponse,
  ResetRequest,
  ResetResponse,
  ArchiveRequest,
  ArchiveResponse,
  GetStateRequest,
  GetStateResponse,
} from "../types/api";

class SessionService {
  async createSession(
    request: CreateSessionRequest
  ): Promise<CreateSessionResponse> {
    const result = sessionStore.createSession(request.displayName);
    return {
      sessionID: result.sessionID,
      userID: result.userID,
      state: result.state,
    };
  }

  async joinSession(request: JoinSessionRequest): Promise<JoinSessionResponse | null> {
    const result = sessionStore.joinSession(
      request.sessionID.toUpperCase(),
      request.displayName
    );
    if (!result) {
      return null;
    }
    return {
      userID: result.userID,
      state: result.state,
    };
  }

  async getSessionState(request: GetStateRequest): Promise<GetStateResponse | null> {
    const state = sessionStore.getSessionState(
      request.sessionID.toUpperCase(),
      request.userID
    );
    if (!state) {
      return null;
    }
    return { state };
  }

  async vote(request: VoteRequest): Promise<VoteResponse | null> {
    const success = sessionStore.updateVote(
      request.sessionID.toUpperCase(),
      request.userID,
      request.cardValue
    );
    if (!success) {
      return null;
    }
    const state = sessionStore.getSessionState(request.sessionID.toUpperCase());
    if (!state) {
      return null;
    }
    return { success: true, state };
  }

  async setStory(request: StoryRequest): Promise<StoryResponse | null> {
    const success = sessionStore.setStory(
      request.sessionID.toUpperCase(),
      request.userID,
      request.storyText
    );
    if (!success) {
      return null;
    }
    const state = sessionStore.getSessionState(request.sessionID.toUpperCase());
    if (!state) {
      return null;
    }
    return { success: true, state };
  }

  async revealCards(request: RevealRequest): Promise<RevealResponse | null> {
    const success = sessionStore.revealCards(
      request.sessionID.toUpperCase(),
      request.userID
    );
    if (!success) {
      return null;
    }
    const state = sessionStore.getSessionState(request.sessionID.toUpperCase());
    if (!state) {
      return null;
    }
    return { success: true, state };
  }

  async resetRound(request: ResetRequest): Promise<ResetResponse | null> {
    const success = sessionStore.resetRound(
      request.sessionID.toUpperCase(),
      request.userID
    );
    if (!success) {
      return null;
    }
    const state = sessionStore.getSessionState(request.sessionID.toUpperCase());
    if (!state) {
      return null;
    }
    return { success: true, state };
  }

  async archiveStory(request: ArchiveRequest): Promise<ArchiveResponse | null> {
    const success = sessionStore.archiveStory(
      request.sessionID.toUpperCase(),
      request.userID
    );
    if (!success) {
      return null;
    }
    const state = sessionStore.getSessionState(request.sessionID.toUpperCase());
    if (!state) {
      return null;
    }
    return { success: true, state };
  }
}

export const sessionService = new SessionService();

