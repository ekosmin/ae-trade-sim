import { useEffect, useState } from "react";
import { signInAnonymously, onAuthStateChanged } from "firebase/auth";
import { doc, getDoc, setDoc } from "firebase/firestore";
import { auth, db } from "./firebase";

export function usePlayer() {
  const [uid, setUid] = useState(null);
  const [player, setPlayer] = useState(null); // null = not loaded yet, undefined-name = needs name entry
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

  // Step 2: once we have a uid, check if a player doc already exists for it
  useEffect(() => {
    if (!uid) return;

    async function loadPlayer() {
      const playerRef = doc(db, "players", uid);
      const snapshot = await getDoc(playerRef);

      if (snapshot.exists()) {
        setPlayer({ id: uid, ...snapshot.data() });
      } else {
        setPlayer(null); // signals "no player doc yet, need name entry"
      }
      setLoading(false);
    }

    loadPlayer();
  }, [uid]);

  // Step 3: called by the name-entry screen once the player picks a name
  async function createPlayer(name) {
    const playerRef = doc(db, "players", uid);
    const newPlayer = {
      name,
      collection: [], // array of physicalToy IDs currently owned
      everOwned: [], // array of physicalToy IDs ever owned (never shrinks)
      currentRoom: null,
    };
    await setDoc(playerRef, newPlayer);
    setPlayer({ id: uid, ...newPlayer });
  }

  // Optimistic local update so the UI reflects a pull immediately, without
  // waiting on a live listener (see known gaps re: no onSnapshot yet).
  function addOwnedToy(toyId) {
    setPlayer((prev) => ({
      ...prev,
      collection: [...prev.collection, toyId],
      everOwned: [...prev.everOwned, toyId],
    }));
  }

  return { uid, player, loading, createPlayer, addOwnedToy };
}