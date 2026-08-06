import { respondToTrade } from "../trades";

export default function TradeRequestsPanel({ roomId, uid, trades, toys, members }) {
  const relevant = trades.filter(
    (t) => t.status === "pending" && (t.toPlayer === uid || t.fromPlayer === uid)
  );

  if (relevant.length === 0) {
    return null;
  }

  return (
    <div className="panel">
      <h2>Trade requests</h2>
      <ul className="item-list">
        {relevant.map((trade) => {
          const isIncoming = trade.toPlayer === uid;
          const otherPlayer = members[isIncoming ? trade.fromPlayer : trade.toPlayer];
          const otherName = otherPlayer ? otherPlayer.name : "Someone";
          const offeredToy = toys[trade.offeredToyId];
          const requestedToy = toys[trade.requestedToyId];
          if (!offeredToy || !requestedToy) return null;

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
                    onClick={() => respondToTrade(roomId, trade.id, true)}
                  >
                    Accept
                  </button>
                  <button
                    className="pull-button small ghost"
                    onClick={() => respondToTrade(roomId, trade.id, false)}
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
