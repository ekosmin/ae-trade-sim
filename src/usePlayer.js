import { useEffect, useState } from "react";
import { signInAnonymously, onAuthStateChanged } from "firebase/auth";
import { doc, setDoc, onSnapshot } from "firebase/firestore";
import { auth, db } from "./firebase";

export function usePlayer() {
  const [uid, setUid] = useState(null);
  const [player, setPlayer] = useState(null); // null = not loaded yet, or needs name entry
  const [loading, setLoading] = useState(true);

  // Step 1: handle auth state (sign in anonymously if needed, or pick up cached session)
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      if (user) {
        setUid(user.uid);
      } else {
        // no cached session -> create a new anonymous user
        await signInAnonymously(auth);
        // onAuthStateChanged will fire again once this resolves, with a user
      }
    });

    return () => unsubscribe();
  }, []);

  // Step 2: once we have a uid, subscribe to the player doc so pulls, trades,
  // and room membership all stay live without a manual refetch.
  useEffect(() => {
    if (!uid) return;

    const playerRef = doc(db, "players", uid);
    const unsubscribe = onSnapshot(playerRef, (snapshot) => {
      setPlayer(snapshot.exists() ? { id: uid, ...snapshot.data() } : null);
      setLoading(false);
    });

    return () => unsubscribe();
  }, [uid]);

  // Step 3: called by the name-entry screen once the player picks a name
  async function createPlayer(name) {
    const playerRef = doc(db, "players", uid);
    await setDoc(playerRef, {
      name,
      collection: [], // array of physicalToy IDs currently owned
      everOwned: [], // array of physicalToy IDs ever owned (never shrinks)
      currentRoom: null,
    });
    // the onSnapshot listener above will pick up the new doc.
  }

  return { uid, player, loading, createPlayer };
}
