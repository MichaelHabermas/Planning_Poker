import { useEffect, useRef } from "react";
import { sessionService } from "@/services/sessionService";
import type { SessionState } from "@/types/session";

interface UseSessionPollingOptions {
  sessionID: string;
  userID?: string;
  enabled: boolean;
  interval?: number;
  onStateUpdate: (state: SessionState) => void;
  onError?: (error: Error) => void;
}

export const useSessionPolling = ({
  sessionID,
  userID,
  enabled,
  interval = 2500,
  onStateUpdate,
  onError,
}: UseSessionPollingOptions): void => {
  const intervalRef = useRef<number | null>(null);

  useEffect(() => {
    if (!enabled || !sessionID) {
      return;
    }

    const poll = async (): Promise<void> => {
      try {
        const response = await sessionService.getSessionState({
          sessionID,
          userID,
        });

        if (response) {
          onStateUpdate(response.state);
        }
      } catch (error) {
        if (onError) {
          onError(error instanceof Error ? error : new Error("Polling failed"));
        }
      }
    };

    poll();
    intervalRef.current = window.setInterval(poll, interval);

    return () => {
      if (intervalRef.current !== null) {
        window.clearInterval(intervalRef.current);
        intervalRef.current = null;
      }
    };
  }, [sessionID, userID, enabled, interval, onStateUpdate, onError]);
};

