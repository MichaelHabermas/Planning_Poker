import { useState } from "react";
import type { ReactElement } from "react";
import { HomePage } from "./components/HomePage";
import { SessionPage } from "./components/SessionPage";

export const App = (): ReactElement => {
  const [sessionID, setSessionID] = useState<string | null>(null);
  const [userID, setUserID] = useState<string | null>(null);

  if (sessionID && userID) {
    return (
      <SessionPage
        sessionID={sessionID}
        userID={userID}
        onExit={() => {
          setSessionID(null);
          setUserID(null);
        }}
      />
    );
  }

  return (
    <HomePage
      onSessionCreated={(sid, uid) => {
        setSessionID(sid);
        setUserID(uid);
      }}
      onSessionJoined={(sid, uid) => {
        setSessionID(sid);
        setUserID(uid);
      }}
    />
  );
};
