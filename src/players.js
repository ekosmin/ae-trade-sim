import { doc, updateDoc, increment } from "firebase/firestore";
import { db } from "./firebase";

export async function addTradePortal(uid) {
  await updateDoc(doc(db, "players", uid), {
    tradePortals: increment(1),
    spendTracker: increment(2),
  });
}
