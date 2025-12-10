import { useState } from "react";
import type { ReactElement } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "./ui/card";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { Label } from "./ui/label";
import { sessionService } from "@/services/sessionService";

interface HomePageProps {
  onSessionCreated: (sessionID: string, userID: string) => void;
  onSessionJoined: (sessionID: string, userID: string) => void;
}

export const HomePage = ({ onSessionCreated, onSessionJoined }: HomePageProps): ReactElement => {
  const [displayName, setDisplayName] = useState("");
  const [joinCode, setJoinCode] = useState("");
  const [joinDisplayName, setJoinDisplayName] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleCreateSession = async (): Promise<void> => {
    if (!displayName.trim()) {
      setError("Please enter your name");
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const response = await sessionService.createSession({
        displayName: displayName.trim(),
      });

      onSessionCreated(response.sessionID, response.userID);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to create session");
    } finally {
      setLoading(false);
    }
  };

  const handleJoinSession = async (): Promise<void> => {
    if (!joinCode.trim() || !joinDisplayName.trim()) {
      setError("Please enter both session code and your name");
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const response = await sessionService.joinSession({
        sessionID: joinCode.trim().toUpperCase(),
        displayName: joinDisplayName.trim(),
      });

      if (!response) {
        setError("Session not found. Please check the code.");
        return;
      }

      onSessionJoined(joinCode.trim().toUpperCase(), response.userID);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to join session");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-4 bg-background">
      <div className="w-full max-w-md space-y-6">
        <div className="text-center space-y-2">
          <h1 className="text-3xl font-bold">Planning Poker</h1>
          <p className="text-muted-foreground">
            Agile story point estimation made simple
          </p>
        </div>

        {error && (
          <div className="p-3 rounded-md bg-destructive/10 text-destructive text-sm">
            {error}
          </div>
        )}

        <Card>
          <CardHeader>
            <CardTitle>Create New Session</CardTitle>
            <CardDescription>
              Start a new planning poker session as facilitator
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="displayName">Your Name</Label>
              <Input
                id="displayName"
                placeholder="Enter your name"
                value={displayName}
                onChange={(e) => setDisplayName(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === "Enter") {
                    handleCreateSession();
                  }
                }}
                disabled={loading}
              />
            </div>
            <Button
              onClick={handleCreateSession}
              disabled={loading}
              className="w-full"
            >
              {loading ? "Creating..." : "Create Session"}
            </Button>
          </CardContent>
        </Card>

        <div className="relative">
          <div className="absolute inset-0 flex items-center">
            <span className="w-full border-t" />
          </div>
          <div className="relative flex justify-center text-xs uppercase">
            <span className="bg-background px-2 text-muted-foreground">Or</span>
          </div>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Join Existing Session</CardTitle>
            <CardDescription>
              Enter the session code to join as a participant
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="joinCode">Session Code</Label>
              <Input
                id="joinCode"
                placeholder="Enter session code"
                value={joinCode}
                onChange={(e) => setJoinCode(e.target.value.toUpperCase())}
                maxLength={6}
                disabled={loading}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="joinDisplayName">Your Name</Label>
              <Input
                id="joinDisplayName"
                placeholder="Enter your name"
                value={joinDisplayName}
                onChange={(e) => setJoinDisplayName(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === "Enter") {
                    handleJoinSession();
                  }
                }}
                disabled={loading}
              />
            </div>
            <Button
              onClick={handleJoinSession}
              disabled={loading}
              variant="outline"
              className="w-full"
            >
              {loading ? "Joining..." : "Join Session"}
            </Button>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

