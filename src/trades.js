import { collection, doc, setDoc, updateDoc } from "firebase/firestore";
import { db } from "./firebase";

export async function requestTrade(roomId, { fromPlayer, toPlayer, offeredToyId, requestedToyId }) {
  const tradeRef = doc(collection(db, "tradeRooms", roomId, "trades"));
  await setDoc(tradeRef, {
    fromPlayer,
    toPlayer,
    offeredToyId,
    requestedToyId,
    status: "pending",
    createdAt: Date.now(),
  });
  return tradeRef.id;
}

export async function respondToTrade(roomId, tradeId, accepted) {
  await updateDoc(doc(db, "tradeRooms", roomId, "trades", tradeId), {
    status: accepted ? "accepted" : "declined",
  });
}
