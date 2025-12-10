import { useState, useEffect, useCallback } from "react";
import type { ReactElement } from "react";
import type { SessionState } from "@/types/session";
import { Role } from "@/types/session";
import { sessionService } from "@/services/sessionService";
import { useSessionPolling } from "@/hooks/useSessionPolling";
import { SessionHeader } from "./SessionHeader";
import { ParticipantList } from "./ParticipantList";
import { ActiveStory } from "./ActiveStory";
import { CardDeck } from "./CardDeck";
import { ResultsDisplay } from "./ResultsDisplay";
import { FacilitatorControls } from "./FacilitatorControls";
import { SessionHistory } from "./SessionHistory";

interface SessionPageProps {
  sessionID: string;
  userID: string;
  onExit: () => void;
}

export const SessionPage = ({
  sessionID,
  userID,
  onExit,
}: SessionPageProps): ReactElement => {
  const [state, setState] = useState<SessionState | null>(null);
  const [loading, setLoading] = useState(true);

  const handleStateUpdate = useCallback((newState: SessionState) => {
    setState(newState);
    setLoading(false);
  }, []);

  useSessionPolling({
    sessionID,
    userID,
    enabled: true,
    interval: 2500,
    onStateUpdate: handleStateUpdate,
    onError: () => {
      // Error handled silently - polling will retry
    },
  });

  useEffect(() => {
    const fetchInitialState = async (): Promise<void> => {
      try {
        const response = await sessionService.getSessionState({
          sessionID,
          userID,
        });
        if (response) {
          setState(response.state);
        }
      } catch {
        // Error handled - will show loading state
      } finally {
        setLoading(false);
      }
    };

    fetchInitialState();
  }, [sessionID, userID]);

  if (loading || !state) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-muted-foreground">Loading session...</div>
      </div>
    );
  }

  const currentUser = Array.from(state.users.values()).find(
    (u) => u.userID === userID
  );

  if (!currentUser) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-destructive">User not found in session</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <SessionHeader
        sessionID={sessionID}
        currentUser={currentUser}
        onExit={onExit}
      />
      <div className="container mx-auto p-4">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
          <div className="lg:col-span-2 space-y-4">
            <ActiveStory story={state.currentStory} />
            {state.isRevealed ? (
              <ResultsDisplay state={state} />
            ) : (
              <CardDeck
                sessionID={sessionID}
                userID={userID}
                currentUser={currentUser}
                state={state}
                onStateUpdate={handleStateUpdate}
              />
            )}
            {currentUser.role === Role.FACILITATOR && (
              <FacilitatorControls
                sessionID={sessionID}
                userID={userID}
                state={state}
                onStateUpdate={handleStateUpdate}
              />
            )}
          </div>
          <div className="space-y-4">
            <ParticipantList state={state} currentUserID={userID} />
            <SessionHistory history={state.history} />
          </div>
        </div>
      </div>
    </div>
  );
};

