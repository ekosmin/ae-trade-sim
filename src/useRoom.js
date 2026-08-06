import { useEffect, useState } from "react";
import { doc, onSnapshot } from "firebase/firestore";
import { db } from "./firebase";

export function useRoom(roomId) {
  const [room, setRoom] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = onSnapshot(doc(db, "tradeRooms", roomId), (snapshot) => {
      setRoom(snapshot.exists() ? { id: roomId, ...snapshot.data() } : null);
      setLoading(false);
    });

    return () => unsubscribe();
  }, [roomId]);

  return { room, loading };
}
