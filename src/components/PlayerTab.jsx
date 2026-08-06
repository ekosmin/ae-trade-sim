import { resetAccount } from "../account";
import { addTradePortal } from "../players";

export default function PlayerTab({ uid, player }) {
  function handleReset() {
    const confirmed = window.confirm(
      "Reset your account? You'll start over with a new name and 5 Trade Portals. " +
        "Your existing toys stay exactly where they are, but you won't be able to access " +
        "them from this new account."
    );
    if (confirmed) {
      resetAccount();
    }
  }

  return (
    <div className="panel">
      <h2>Player</h2>
      <p className="panel-note">
        Playing as <strong>{player.name}</strong> — <span className="player-id">{player.id}</span>
      </p>

      <div className="player-actions">
        <div className="player-action-row">
          <div>
            <div className="item-name">Add a Trade Portal</div>
            <div className="item-sub">Grant yourself one more Trade Portal.</div>
          </div>
          <button className="pull-button small" onClick={() => addTradePortal(uid)}>
            + Trade Portal
          </button>
        </div>

        <div className="player-action-row">
          <div>
            <div className="item-name">Reset account</div>
            <div className="item-sub">Start over with a fresh account. Toys stay where they are.</div>
          </div>
          <button className="pull-button small ghost" onClick={handleReset}>
            Reset account
          </button>
        </div>
      </div>
    </div>
  );
}
