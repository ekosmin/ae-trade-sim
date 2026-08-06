import { rarityClass } from "../rarity";
import { hasEverOwned } from "../tradeback";
import { requestTrade } from "../trades";

export default function TradeOfferPanel({ roomId, uid, target, myToys, onCancel, onOffered }) {
  const offerable = myToys.filter((toy) => !hasEverOwned(toy, target.ownerId));

  async function handleOffer(toy) {
    await requestTrade(roomId, {
      fromPlayer: uid,
      toPlayer: target.ownerId,
      offeredToyId: toy.id,
      requestedToyId: target.toyId,
    });
    onOffered();
  }

  return (
    <div className="panel">
      <div className="room-header">
        <h2>Offer a toy</h2>
        <button className="pull-button small ghost" onClick={onCancel}>
          Cancel
        </button>
      </div>
      <p className="panel-note">Pick one of your toys to offer in exchange.</p>

      {offerable.length === 0 ? (
        <p className="empty-note">
          Nothing eligible to offer — they've owned all of your toys before.
        </p>
      ) : (
        <ul className="item-list">
          {offerable.map((toy) => (
            <li
              key={toy.id}
              className="item-row item-row-clickable"
              onClick={() => handleOffer(toy)}
            >
              <span className={`tier-dot ${rarityClass(toy.rarity)}`} />
              <div className="item-main">
                <div className="item-name">{toy.species}</div>
              </div>
              <span className={`tier-badge ${rarityClass(toy.rarity)}`}>{toy.rarity}</span>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
