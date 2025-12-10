import type { ReactElement } from "react";
import type { SessionState, User } from "@/types/session";
import { Role } from "@/types/session";
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";
import { Badge } from "./ui/badge";
import { CheckCircle2, Circle } from "lucide-react";

interface ParticipantListProps {
  state: SessionState;
  currentUserID: string;
}

export const ParticipantList = ({
  state,
  currentUserID,
}: ParticipantListProps): ReactElement => {
  const users: User[] = Array.from(state.users.values());

  const getRoleBadgeVariant = (role: Role): "default" | "secondary" | "outline" => {
    switch (role) {
      case Role.FACILITATOR:
        return "default";
      case Role.VOTER:
        return "secondary";
      case Role.OBSERVER:
        return "outline";
      default:
        return "outline";
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Participants ({users.length})</CardTitle>
      </CardHeader>
      <CardContent className="space-y-2">
        {users.map((user) => {
          const hasVoted = state.isRevealed
            ? state.votes.has(user.userID)
            : user.hasVoted;
          const voteValue = state.isRevealed
            ? state.votes.get(user.userID)
            : undefined;
          const isCurrentUser = user.userID === currentUserID;

          return (
            <div
              key={user.userID}
              className={`flex items-center justify-between p-2 rounded-md border ${
                isCurrentUser ? "bg-accent" : ""
              }`}
            >
              <div className="flex items-center gap-2 flex-1 min-w-0">
                {hasVoted ? (
                  <CheckCircle2 className="h-4 w-4 text-green-600 shrink-0" />
                ) : (
                  <Circle className="h-4 w-4 text-muted-foreground shrink-0" />
                )}
                <span
                  className={`text-sm truncate ${
                    isCurrentUser ? "font-medium" : ""
                  }`}
                >
                  {user.displayName}
                </span>
                {isCurrentUser && (
                  <span className="text-xs text-muted-foreground">(You)</span>
                )}
              </div>
              <div className="flex items-center gap-2 shrink-0">
                {state.isRevealed && voteValue && (
                  <span className="text-sm font-bold">{voteValue}</span>
                )}
                <Badge variant={getRoleBadgeVariant(user.role)} className="text-xs">
                  {user.role}
                </Badge>
              </div>
            </div>
          );
        })}
      </CardContent>
    </Card>
  );
};

