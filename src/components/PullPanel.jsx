import { useState } from "react";
import { pullToy } from "../pull";
import { rarityClass } from "../rarity";

const STAR_LABELS = {
  1: "★",
  2: "★★",
  3: "★★★",
  4: "★★★★",
  5: "★★★★★",
  platinum: "✦ PLATINUM ✦",
};

export default function PullPanel({ uid }) {
  const [pulling, setPulling] = useState(false);
  const [lastPull, setLastPull] = useState(null);
  const [error, setError] = useState(null);

  async function handlePull() {
    setPulling(true);
    setError(null);
    try {
      const result = await pullToy(uid);
      setLastPull(result);
    } catch (err) {
      setError(err.message);
    } finally {
      setPulling(false);
    }
  }

  return (
    <div className="panel pull-panel">
      <h2>Pull a toy</h2>
      <button className="pull-button" onClick={handlePull} disabled={pulling}>
        {pulling ? "Pulling..." : "Pull!"}
      </button>

      {error && <p className="pull-error">{error}</p>}

      {lastPull && (
        <div className="last-pull">
          <span className="name">{lastPull.species}</span>
          <span className={`tier-badge ${rarityClass(lastPull.rarity)}`}>{lastPull.rarity}</span>
          <span
            className={`star-rating ${
              lastPull.ownershipChain[0].starRating === "platinum" ? "platinum" : ""
            }`}
          >
            {STAR_LABELS[lastPull.ownershipChain[0].starRating]}
          </span>
        </div>
      )}
    </div>
  );
}