import { useState } from "react";
import type { ReactElement } from "react";
import type { SessionState, User } from "@/types/session";
import { Role } from "@/types/session";
import { sessionService } from "@/services/sessionService";
import { Card, CardContent } from "./ui/card";
import { Button } from "./ui/button";

interface CardDeckProps {
  sessionID: string;
  userID: string;
  currentUser: User;
  state: SessionState;
  onStateUpdate: (state: SessionState) => void;
}

const CARD_VALUES = ["0", "0.5", "1", "2", "3", "5", "8", "13", "20", "40", "100", "∞"];

export const CardDeck = ({
  sessionID,
  userID,
  currentUser,
  state,
  onStateUpdate,
}: CardDeckProps): ReactElement => {
  const [selectedCard, setSelectedCard] = useState<string | null>(
    state.votes.get(userID) || null
  );
  const [submitting, setSubmitting] = useState(false);

  if (currentUser.role !== Role.VOTER) {
    return (
      <Card>
        <CardContent className="p-6">
          <p className="text-muted-foreground text-center">
            Only voters can cast votes. Your role is {currentUser.role}.
          </p>
        </CardContent>
      </Card>
    );
  }

  const handleCardSelect = async (cardValue: string): Promise<void> => {
    setSelectedCard(cardValue);
    setSubmitting(true);

    try {
      const response = await sessionService.vote({
        sessionID,
        userID,
        cardValue,
      });

      if (response) {
        onStateUpdate(response.state);
      }
    } catch {
      // Error handled silently - UI will show appropriate state
    } finally {
      setSubmitting(false);
    }
  };

  const currentVote = state.votes.get(userID);

  return (
    <Card>
      <CardContent className="p-6">
        <h3 className="text-lg font-semibold mb-4">Select Your Estimate</h3>
        {currentVote && !state.isRevealed && (
          <div className="mb-4 p-3 bg-accent rounded-md text-sm">
            Your current vote: <strong>{currentVote}</strong>
          </div>
        )}
        <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-6 gap-3">
          {CARD_VALUES.map((value) => {
            const isSelected = selectedCard === value || currentVote === value;
            return (
              <Button
                key={value}
                variant={isSelected ? "default" : "outline"}
                size="lg"
                className="h-20 text-lg font-bold"
                onClick={() => handleCardSelect(value)}
                disabled={submitting || state.isRevealed}
              >
                {value}
              </Button>
            );
          })}
        </div>
        {state.isRevealed && (
          <p className="text-center text-muted-foreground mt-4">
            Votes have been revealed. Waiting for facilitator to reset or archive.
          </p>
        )}
      </CardContent>
    </Card>
  );
};

