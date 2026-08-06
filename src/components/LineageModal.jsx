import { usePlayersLive } from "../usePlayersLive";
import { rarityClass } from "../rarity";

const STAR_LABELS = {
  1: "★",
  2: "★★",
  3: "★★★",
  4: "★★★★",
  5: "★★★★★",
  platinum: "✦ PLATINUM ✦",
};

export default function LineageModal({ uid, toy, onClose }) {
  const ownerIds = Array.from(new Set(toy.ownershipChain.map((entry) => entry.playerId)));
  const owners = usePlayersLive(ownerIds);

  return (
    <div className="modal-backdrop" onClick={onClose}>
      <div className="panel modal" onClick={(e) => e.stopPropagation()}>
        <div className="room-header">
          <h2>{toy.species} lineage</h2>
          <button className="pull-button small ghost" onClick={onClose}>
            Close
          </button>
        </div>
        <p className="panel-note">
          <span className={`tier-badge ${rarityClass(toy.rarity)}`}>{toy.rarity}</span> — every
          digital ÆRTHLING generated from this physical toy, oldest first.
        </p>

        <ul className="item-list">
          {toy.ownershipChain.map((entry, index) => {
            const owner = owners[entry.playerId];
            const isMe = entry.playerId === uid;

            return (
              <li key={entry.playerId} className="item-row">
                <span className="item-note">#{index + 1}</span>
                <div className="item-main">
                  <div className="item-name">
                    {owner ? owner.name : "..."}
                    {isMe ? " (you)" : ""}
                  </div>
                  <div className="item-sub">
                    {entry.method === "pulled" ? "Original pull" : "Traded"}
                  </div>
                </div>
                <span
                  className={`star-rating ${entry.starRating === "platinum" ? "platinum" : ""}`}
                >
                  {STAR_LABELS[entry.starRating]}
                </span>
              </li>
            );
          })}
        </ul>
      </div>
    </div>
  );
}
