import { useState } from "react";
import { rarityClass } from "../rarity";
import LineageModal from "./LineageModal";

const STAR_LABELS = {
  1: "★",
  2: "★★",
  3: "★★★",
  4: "★★★★",
  5: "★★★★★",
  platinum: "✦ PLATINUM ✦",
};

export default function DigitalCharactersPanel({ uid, digitalCharacters, toys }) {
  const [selectedToyId, setSelectedToyId] = useState(null);
  const characters = digitalCharacters.slice().reverse();
  const selectedToy = selectedToyId ? toys[selectedToyId] : null;

  return (
    <>
      <div className="panel">
        <h2>Digital characters</h2>
        <p className="panel-note">{characters.length} generated — click one to see its lineage</p>
        {characters.length === 0 ? (
          <p className="empty-note">None yet.</p>
        ) : (
          <ul className="item-list">
            {characters.map((char) => (
              <li
                key={char.toyId}
                className="item-row item-row-clickable"
                onClick={() => setSelectedToyId(char.toyId)}
              >
                <span className={`tier-dot ${rarityClass(char.rarity)}`} />
                <div className="item-main">
                  <div className="item-name">{char.species}</div>
                </div>
                <span className={`tier-badge ${rarityClass(char.rarity)}`}>{char.rarity}</span>
                <span
                  className={`star-rating ${char.starRating === "platinum" ? "platinum" : ""}`}
                >
                  {STAR_LABELS[char.starRating]}
                </span>
              </li>
            ))}
          </ul>
        )}
      </div>

      {selectedToy && (
        <LineageModal uid={uid} toy={selectedToy} onClose={() => setSelectedToyId(null)} />
      )}
    </>
  );
}
