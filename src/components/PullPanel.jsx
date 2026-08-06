import { useState } from "react";
import { pullToy } from "../pull";

const STAR_LABELS = {
  1: "★",
  2: "★★",
  3: "★★★",
  4: "★★★★",
  5: "★★★★★",
  platinum: "✦ PLATINUM ✦",
};

export default function PullPanel({ uid, onPulled }) {
  const [pulling, setPulling] = useState(false);
  const [lastPull, setLastPull] = useState(null);
  const [error, setError] = useState(null);

  async function handlePull() {
    setPulling(true);
    setError(null);
    try {
      const result = await pullToy(uid);
      setLastPull(result);
      if (onPulled) onPulled(result);
    } catch (err) {
      setError(err.message);
    } finally {
      setPulling(false);
    }
  }

  return (
    <div style={{ border: "1px solid #ccc", borderRadius: 8, padding: 16, marginTop: 16 }}>
      <h3>Pull a toy</h3>
      <button onClick={handlePull} disabled={pulling} style={{ padding: "8px 16px", fontSize: 16 }}>
        {pulling ? "Pulling..." : "Pull!"}
      </button>

      {error && <p style={{ color: "red" }}>{error}</p>}

      {lastPull && (
        <div style={{ marginTop: 12 }}>
          <p>
            You pulled a <strong>{lastPull.species}</strong> ({lastPull.rarity})
          </p>
          <p>{STAR_LABELS[lastPull.ownershipChain[0].starRating]}</p>
        </div>
      )}
    </div>
  );
}