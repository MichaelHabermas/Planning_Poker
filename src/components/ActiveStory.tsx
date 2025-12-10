import type { ReactElement } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";

interface ActiveStoryProps {
  story: string;
}

export const ActiveStory = ({ story }: ActiveStoryProps): ReactElement => {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Current Story</CardTitle>
      </CardHeader>
      <CardContent>
        {story ? (
          <p className="text-lg">{story}</p>
        ) : (
          <p className="text-muted-foreground italic">
            No story set yet. Facilitator can set a story to begin estimation.
          </p>
        )}
      </CardContent>
    </Card>
  );
};

