import { useEffect, useState } from "react";
import { doc, getDoc } from "firebase/firestore";
import { db } from "./firebase";

export function useToys(toyIds) {
  const [toys, setToys] = useState({});
  const [loading, setLoading] = useState(true);
  const key = toyIds.join(",");

  useEffect(() => {
    let cancelled = false;

    async function loadToys() {
      setLoading(true);
      const entries = await Promise.all(
        toyIds.map(async (id) => {
          const snapshot = await getDoc(doc(db, "physicalToys", id));
          return [id, snapshot.exists() ? { id, ...snapshot.data() } : null];
        })
      );
      if (cancelled) return;
      setToys(Object.fromEntries(entries));
      setLoading(false);
    }

    loadToys();

    return () => {
      cancelled = true;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [key]);

  return { toys, loading };
}
