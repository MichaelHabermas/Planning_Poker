import type { ReactElement } from "react";
import type { Story } from "@/types/session";
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";
import { Badge } from "./ui/badge";

interface SessionHistoryProps {
  history: Story[];
}

export const SessionHistory = ({ history }: SessionHistoryProps): ReactElement => {
  if (history.length === 0) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Session History</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-sm text-muted-foreground">
            No stories archived yet. Archived stories will appear here.
          </p>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Session History ({history.length})</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4 max-h-96 overflow-y-auto">
        {history.map((story, index) => (
          <div
            key={index}
            className="p-3 border rounded-md space-y-2 bg-muted/50"
          >
            <p className="text-sm font-medium">{story.storyText}</p>
            <div className="flex items-center gap-2 flex-wrap">
              <Badge variant="secondary">Min: {story.results.min}</Badge>
              <Badge variant="secondary">
                Avg: {story.results.average.toFixed(1)}
              </Badge>
              <Badge variant="secondary">Max: {story.results.max}</Badge>
            </div>
            <div className="text-xs text-muted-foreground">
              {new Date(story.archivedAt).toLocaleTimeString()}
            </div>
          </div>
        ))}
      </CardContent>
    </Card>
  );
};

