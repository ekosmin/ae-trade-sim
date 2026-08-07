import { rarityClass } from "../rarity";
import { acceptTrade, declineTrade, acknowledgeTrade } from "../trades";

const STAR_LABELS = {
  1: "★",
  2: "★★",
  3: "★★★",
  4: "★★★★",
  5: "★★★★★",
  platinum: "✦ PLATINUM ✦",
};

export default function TradeRequestsPanel({ roomId, uid, trades, toys, members }) {
  const hasPortal = (members[uid]?.tradePortals ?? 0) >= 1;
  const relevant = trades.filter((t) => {
    const isFrom = t.fromPlayer === uid;
    const isTo = t.toPlayer === uid;
    if (t.status === "pending") return isFrom || isTo;
    if (t.status === "accepted") return (isFrom && !t.fromClaimed) || (isTo && !t.toClaimed);
    return false;
  });

  if (relevant.length === 0) {
    return null;
  }

  return (
    <div className="panel">
      <h2>Trade requests</h2>
      <ul className="item-list">
        {relevant.map((trade) => {
          const isFrom = trade.fromPlayer === uid;
          const otherPlayer = members[isFrom ? trade.toPlayer : trade.fromPlayer];
          const otherName = otherPlayer ? otherPlayer.name : "Someone";
          const offeredToy = toys[trade.offeredToyId];
          const requestedToy = toys[trade.requestedToyId];
          if (!offeredToy || !requestedToy) return null;

          if (trade.status === "accepted") {
            const newToyId = isFrom ? trade.requestedToyId : trade.offeredToyId;
            const newToy = toys[newToyId];
            if (!newToy) return null;
            const myEntry = newToy.ownershipChain.find((e) => e.playerId === uid);

            return (
              <li key={trade.id} className="item-row">
                <span className={`tier-dot ${rarityClass(newToy.rarity)}`} />
                <div className="item-main">
                  <div className="item-name">New ÆRTHLING: {newToy.species}</div>
                  <div className="item-sub">
                    From trading with {otherName} —{" "}
                    <span
                      className={`star-rating ${myEntry?.starRating === "platinum" ? "platinum" : ""}`}
                    >
                      {STAR_LABELS[myEntry?.starRating]}
                    </span>
                  </div>
                </div>
                <button
                  className="pull-button small"
                  onClick={() => acknowledgeTrade(roomId, trade, uid)}
                >
                  OK
                </button>
              </li>
            );
          }

          const isIncoming = !isFrom;

          return (
            <li key={trade.id} className="item-row">
              <div className="item-main">
                {isIncoming ? (
                  <>
                    <div className="item-name">{otherName}</div>
                    <div className="item-sub">
                      offers {offeredToy.species} ({offeredToy.rarity}) for your{" "}
                      {requestedToy.species} ({requestedToy.rarity})
                    </div>
                  </>
                ) : (
                  <>
                    <div className="item-name">You offered {offeredToy.species}</div>
                    <div className="item-sub">
                      for {otherName}'s {requestedToy.species}
                    </div>
                  </>
                )}
              </div>
              {isIncoming ? (
                <div className="trade-actions">
                  <button
                    className="pull-button small"
                    onClick={() => acceptTrade(roomId, trade)}
                    disabled={!hasPortal}
                    title={hasPortal ? undefined : "You need a Trade Portal to accept a trade"}
                  >
                    Accept
                  </button>
                  <button
                    className="pull-button small ghost"
                    onClick={() => declineTrade(roomId, trade.id)}
                  >
                    Reject
                  </button>
                </div>
              ) : (
                <span className="empty-note">Pending</span>
              )}
            </li>
          );
        })}
      </ul>
    </div>
  );
}
