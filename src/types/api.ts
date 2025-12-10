import type { SessionState } from "./session";

export interface CreateSessionRequest {
  displayName: string;
}

export interface CreateSessionResponse {
  sessionID: string;
  userID: string;
  state: SessionState;
}

export interface JoinSessionRequest {
  sessionID: string;
  displayName: string;
}

export interface JoinSessionResponse {
  userID: string;
  state: SessionState;
}

export interface VoteRequest {
  sessionID: string;
  userID: string;
  cardValue: string;
}

export interface VoteResponse {
  success: boolean;
  state: SessionState;
}

export interface StoryRequest {
  sessionID: string;
  userID: string;
  storyText: string;
}

export interface StoryResponse {
  success: boolean;
  state: SessionState;
}

export interface RevealRequest {
  sessionID: string;
  userID: string;
}

export interface RevealResponse {
  success: boolean;
  state: SessionState;
}

export interface ResetRequest {
  sessionID: string;
  userID: string;
}

export interface ResetResponse {
  success: boolean;
  state: SessionState;
}

export interface ArchiveRequest {
  sessionID: string;
  userID: string;
}

export interface ArchiveResponse {
  success: boolean;
  state: SessionState;
}

export interface GetStateRequest {
  sessionID: string;
  userID?: string;
}

export interface GetStateResponse {
  state: SessionState;
}

