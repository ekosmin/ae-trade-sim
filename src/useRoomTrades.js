import { useEffect, useState } from "react";
import { collection, onSnapshot } from "firebase/firestore";
import { db } from "./firebase";

export function useRoomTrades(roomId) {
  const [trades, setTrades] = useState([]);

  useEffect(() => {
    const unsubscribe = onSnapshot(collection(db, "tradeRooms", roomId, "trades"), (snapshot) => {
      setTrades(snapshot.docs.map((d) => ({ id: d.id, ...d.data() })));
    });

    return () => unsubscribe();
  }, [roomId]);

  return trades;
}
