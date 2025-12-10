import type { ReactElement } from "react";
import type { SessionState } from "@/types/session";
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";
import { Badge } from "./ui/badge";

interface ResultsDisplayProps {
  state: SessionState;
}

export const ResultsDisplay = ({ state }: ResultsDisplayProps): ReactElement => {
  const votes = Array.from(state.votes.entries())
    .map(([userID, cardValue]) => {
      const user = state.users.get(userID);
      return {
        userID,
        displayName: user?.displayName || "Unknown",
        cardValue,
      };
    })
    .filter((v) => v.cardValue);

  const numericValues = votes
    .map((v) => parseFloat(v.cardValue))
    .filter((v) => !isNaN(v));

  const min = numericValues.length > 0 ? Math.min(...numericValues) : 0;
  const max = numericValues.length > 0 ? Math.max(...numericValues) : 0;
  const average =
    numericValues.length > 0
      ? numericValues.reduce((a, b) => a + b, 0) / numericValues.length
      : 0;

  return (
    <Card>
      <CardHeader>
        <CardTitle>Voting Results</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="grid grid-cols-3 gap-4">
          <div className="text-center p-4 bg-muted rounded-md">
            <div className="text-2xl font-bold">{min}</div>
            <div className="text-sm text-muted-foreground">Minimum</div>
          </div>
          <div className="text-center p-4 bg-muted rounded-md">
            <div className="text-2xl font-bold">{average.toFixed(1)}</div>
            <div className="text-sm text-muted-foreground">Average</div>
          </div>
          <div className="text-center p-4 bg-muted rounded-md">
            <div className="text-2xl font-bold">{max}</div>
            <div className="text-sm text-muted-foreground">Maximum</div>
          </div>
        </div>

        <div className="space-y-2">
          <h4 className="font-semibold">Individual Votes:</h4>
          <div className="space-y-1">
            {votes.map((vote) => (
              <div
                key={vote.userID}
                className="flex items-center justify-between p-2 rounded-md border"
              >
                <span className="text-sm">{vote.displayName}</span>
                <Badge variant="secondary">{vote.cardValue}</Badge>
              </div>
            ))}
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

