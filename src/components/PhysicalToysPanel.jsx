import { useState } from "react";
import { rarityClass } from "../rarity";
import LineageModal from "./LineageModal";

export default function PhysicalToysPanel({ uid, player, toys }) {
  const [selectedToyId, setSelectedToyId] = useState(null);
  const currentToys = player.collection
    .map((id) => toys[id])
    .filter(Boolean)
    .reverse();
  const selectedToy = selectedToyId ? toys[selectedToyId] : null;

  return (
    <>
      <div className="panel">
        <h2>Physical toys</h2>
        <p className="panel-note">{currentToys.length} currently owned — click one to see its lineage</p>
        {currentToys.length === 0 ? (
          <p className="empty-note">None yet — pull a toy to get started.</p>
        ) : (
          <ul className="item-list">
            {currentToys.map((toy) => (
              <li
                key={toy.id}
                className="item-row item-row-clickable"
                onClick={() => setSelectedToyId(toy.id)}
              >
                <span className={`tier-dot ${rarityClass(toy.rarity)}`} />
                <div className="item-main">
                  <div className="item-name">{toy.species}</div>
                  <div className="item-sub">{toy.id}</div>
                </div>
                <span className={`tier-badge ${rarityClass(toy.rarity)}`}>{toy.rarity}</span>
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
