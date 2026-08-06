import { collection, doc, setDoc, updateDoc, arrayUnion, arrayRemove } from "firebase/firestore";
import { db } from "./firebase";

export async function createRoom(uid, name) {
  const roomRef = doc(collection(db, "tradeRooms"));
  await setDoc(roomRef, {
    name,
    createdAt: Date.now(),
    members: [uid],
  });
  await updateDoc(doc(db, "players", uid), { currentRoom: roomRef.id });
  return roomRef.id;
}

export async function joinRoom(uid, roomId) {
  await updateDoc(doc(db, "tradeRooms", roomId), {
    members: arrayUnion(uid),
  });
  await updateDoc(doc(db, "players", uid), { currentRoom: roomId });
}

export async function leaveRoom(uid, roomId) {
  await updateDoc(doc(db, "tradeRooms", roomId), {
    members: arrayRemove(uid),
  });
  await updateDoc(doc(db, "players", uid), { currentRoom: null });
}
