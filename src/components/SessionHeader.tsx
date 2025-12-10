import type { ReactElement } from "react";
import type { User } from "@/types/session";
import { Button } from "./ui/button";
import { Badge } from "./ui/badge";
import { Copy, LogOut } from "lucide-react";

interface SessionHeaderProps {
  sessionID: string;
  currentUser: User;
  onExit: () => void;
}

export const SessionHeader = ({
  sessionID,
  currentUser,
  onExit,
}: SessionHeaderProps): ReactElement => {
  const handleCopyLink = (): void => {
    const url = `${window.location.origin}${window.location.pathname}#${sessionID}`;
    navigator.clipboard.writeText(url).catch(() => {
      navigator.clipboard.writeText(sessionID).catch(() => {
        // Fallback if clipboard fails
      });
    });
  };

  return (
    <header className="border-b bg-card">
      <div className="container mx-auto px-4 py-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <div>
              <h1 className="text-xl font-bold">Planning Poker</h1>
              <div className="flex items-center gap-2 mt-1">
                <span className="text-sm text-muted-foreground">
                  Session: {sessionID}
                </span>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={handleCopyLink}
                  className="h-6 px-2"
                >
                  <Copy className="h-3 w-3" />
                </Button>
              </div>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <div className="text-right">
              <div className="text-sm font-medium">{currentUser.displayName}</div>
              <Badge variant="secondary" className="text-xs">
                {currentUser.role}
              </Badge>
            </div>
            <Button variant="outline" size="sm" onClick={onExit}>
              <LogOut className="h-4 w-4 mr-2" />
              Exit
            </Button>
          </div>
        </div>
      </div>
    </header>
  );
};

