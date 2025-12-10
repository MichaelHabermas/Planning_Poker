import { useState, useCallback } from "react";
import { sessionService } from "@/services/sessionService";
import type { SessionState } from "@/types/session";

interface UseSessionReturn {
  state: SessionState | null;
  loading: boolean;
  error: Error | null;
  updateState: (newState: SessionState) => void;
  refreshState: () => Promise<void>;
}

export const useSession = (
  sessionID: string | null,
  userID: string | null
): UseSessionReturn => {
  const [state, setState] = useState<SessionState | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);

  const updateState = useCallback((newState: SessionState) => {
    setState(newState);
    setError(null);
  }, []);

  const refreshState = useCallback(async () => {
    if (!sessionID) {
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const response = await sessionService.getSessionState({
        sessionID,
        userID: userID || undefined,
      });

      if (response) {
        setState(response.state);
      } else {
        setError(new Error("Session not found"));
      }
    } catch (err) {
      setError(err instanceof Error ? err : new Error("Failed to fetch state"));
    } finally {
      setLoading(false);
    }
  }, [sessionID, userID]);

  return {
    state,
    loading,
    error,
    updateState,
    refreshState,
  };
};

