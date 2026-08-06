import { rarityClass } from "../rarity";

export default function PhysicalToysPanel({ player, toys }) {
  const currentToys = player.collection
    .map((id) => toys[id])
    .filter(Boolean)
    .reverse();

  return (
    <div className="panel">
      <h2>Physical toys</h2>
      <p className="panel-note">{currentToys.length} currently owned</p>
      {currentToys.length === 0 ? (
        <p className="empty-note">None yet — pull a toy to get started.</p>
      ) : (
        <ul className="item-list">
          {currentToys.map((toy) => (
            <li key={toy.id} className="item-row">
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
  );
}
