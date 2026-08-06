import { useEffect, useState } from "react";
import { doc, onSnapshot } from "firebase/firestore";
import { db } from "./firebase";

export function usePlayersLive(playerIds) {
  const [players, setPlayers] = useState({});
  const key = playerIds.join(",");

  useEffect(() => {
    const unsubscribes = playerIds.map((id) =>
      onSnapshot(doc(db, "players", id), (snapshot) => {
        setPlayers((prev) => ({
          ...prev,
          [id]: snapshot.exists() ? { id, ...snapshot.data() } : null,
        }));
      })
    );

    return () => unsubscribes.forEach((unsub) => unsub());
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [key]);

  return players;
}
