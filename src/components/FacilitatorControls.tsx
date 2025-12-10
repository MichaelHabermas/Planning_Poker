import { useState } from "react";
import type { ReactElement } from "react";
import type { SessionState } from "@/types/session";
import { sessionService } from "@/services/sessionService";
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";
import { Button } from "./ui/button";
import { Textarea } from "./ui/textarea";
import { Label } from "./ui/label";

interface FacilitatorControlsProps {
  sessionID: string;
  userID: string;
  state: SessionState;
  onStateUpdate: (state: SessionState) => void;
}

export const FacilitatorControls = ({
  sessionID,
  userID,
  state,
  onStateUpdate,
}: FacilitatorControlsProps): ReactElement => {
  const [storyText, setStoryText] = useState(state.currentStory);
  const [loading, setLoading] = useState(false);

  const handleSetStory = async (): Promise<void> => {
    if (storyText.length > 255) {
      return;
    }

    setLoading(true);
    try {
      const response = await sessionService.setStory({
        sessionID,
        userID,
        storyText: storyText.trim(),
      });

      if (response) {
        onStateUpdate(response.state);
      }
    } catch {
      // Error handled silently
    } finally {
      setLoading(false);
    }
  };

  const handleReveal = async (): Promise<void> => {
    setLoading(true);
    try {
      const response = await sessionService.revealCards({
        sessionID,
        userID,
      });

      if (response) {
        onStateUpdate(response.state);
      }
    } catch {
      // Error handled silently
    } finally {
      setLoading(false);
    }
  };

  const handleReset = async (): Promise<void> => {
    setLoading(true);
    try {
      const response = await sessionService.resetRound({
        sessionID,
        userID,
      });

      if (response) {
        onStateUpdate(response.state);
        setStoryText(response.state.currentStory);
      }
    } catch {
      // Error handled silently
    } finally {
      setLoading(false);
    }
  };

  const handleArchive = async (): Promise<void> => {
    if (!state.isRevealed || !state.currentStory) {
      return;
    }

    setLoading(true);
    try {
      const response = await sessionService.archiveStory({
        sessionID,
        userID,
      });

      if (response) {
        onStateUpdate(response.state);
        setStoryText("");
      }
    } catch {
      // Error handled silently
    } finally {
      setLoading(false);
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Facilitator Controls</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="space-y-2">
          <Label htmlFor="storyInput">Story Description</Label>
          <Textarea
            id="storyInput"
            placeholder="Enter the story or ticket to estimate..."
            value={storyText}
            onChange={(e) => setStoryText(e.target.value)}
            maxLength={255}
            disabled={loading}
            rows={3}
          />
          <div className="text-xs text-muted-foreground text-right">
            {storyText.length}/255
          </div>
          <Button
            onClick={handleSetStory}
            disabled={loading || storyText.trim() === state.currentStory}
            className="w-full"
          >
            {storyText.trim() === state.currentStory ? "Story Set" : "Set Story"}
          </Button>
        </div>

        <div className="flex gap-2">
          {!state.isRevealed && (
            <Button
              onClick={handleReveal}
              disabled={loading || state.votes.size === 0}
              variant="outline"
              className="flex-1"
            >
              Reveal Cards
            </Button>
          )}
          {state.isRevealed && (
            <>
              <Button
                onClick={handleReset}
                disabled={loading}
                variant="outline"
                className="flex-1"
              >
                Reset Round
              </Button>
              <Button
                onClick={handleArchive}
                disabled={loading || !state.currentStory}
                className="flex-1"
              >
                Archive Story
              </Button>
            </>
          )}
        </div>
      </CardContent>
    </Card>
  );
};

