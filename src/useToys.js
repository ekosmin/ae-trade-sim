import { useEffect, useState } from "react";
import { doc, onSnapshot } from "firebase/firestore";
import { db } from "./firebase";

export function useToys(toyIds) {
  const [toys, setToys] = useState({});
  const key = toyIds.join(",");

  useEffect(() => {
    const unsubscribes = toyIds.map((id) =>
      onSnapshot(doc(db, "physicalToys", id), (snapshot) => {
        setToys((prev) => ({
          ...prev,
          [id]: snapshot.exists() ? { id, ...snapshot.data() } : null,
        }));
      })
    );

    return () => unsubscribes.forEach((unsub) => unsub());
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [key]);

  const loading = toyIds.some((id) => !(id in toys));

  return { toys, loading };
}
