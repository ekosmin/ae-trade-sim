import {
  collection,
  doc,
  setDoc,
  updateDoc,
  arrayUnion,
  arrayRemove,
  getDoc,
  writeBatch,
} from "firebase/firestore";
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

// Empties the room and kicks every current member back to the room browser.
export async function closeRoom(roomId) {
  const roomRef = doc(db, "tradeRooms", roomId);
  const roomSnap = await getDoc(roomRef);
  if (!roomSnap.exists()) return;

  const members = roomSnap.data().members ?? [];
  const batch = writeBatch(db);
  batch.update(roomRef, { members: [], closed: true });
  members.forEach((memberId) => {
    batch.update(doc(db, "players", memberId), { currentRoom: null });
  });
  await batch.commit();
}
