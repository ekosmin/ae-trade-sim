import { useState } from "react";
import "./App.css";
import { usePlayer } from "./usePlayer";
import { useToys } from "./useToys";
import { useGameConfig } from "./config";
import { getDigitalCharacters } from "./collectionUtils";
import NameEntry from "./components/NameEntry";
import PullPanel from "./components/PullPanel";
import PhysicalToysPanel from "./components/PhysicalToysPanel";
import DigitalCharactersPanel from "./components/DigitalCharactersPanel";
import SpeciesProgress from "./components/SpeciesProgress";
import TradeRoomsPanel from "./components/TradeRoomsPanel";
import PlayerTab from "./components/PlayerTab";
import AdminTab from "./components/AdminTab";

const TABS = [
  { id: "collection", label: "Collection" },
  { id: "trade", label: "Trade Rooms" },
];

const RIGHT_TABS = [
  { id: "admin", label: "Admin" },
  { id: "player", label: "Player" },
];

function App() {
  const { uid, player, loading, createPlayer } = usePlayer();
  const config = useGameConfig();
  const [tab, setTab] = useState("collection");
  const allIds = player ? Array.from(new Set([...player.collection, ...player.everOwned])) : [];
  const { toys, loading: toysLoading } = useToys(allIds);

  if (loading) {
    return <p style={{ textAlign: "center", marginTop: 80 }}>Loading...</p>;
  }

  if (!player) {
    return (
      <NameEntry
        onSubmit={(name) => {
          createPlayer(name, config.startingPortals);
          setTab("collection");
        }}
      />
    );
  }

  const digitalCharacters = getDigitalCharacters(player, uid, toys);

  return (
    <div className="page">
      <header className="page-head">
        <div className="eyebrow">AE Trade Sim</div>
        <h1>Trading Sim</h1>
        <div className="player-stats">
          <span>
            Signed in as <strong>{player.name}</strong>
          </span>
          <span className="player-id">{player.id}</span>
          <span className="stat">
            <strong>{player.tradePortals ?? 0}</strong> Trade Portals
          </span>
        </div>
      </header>

      <nav className="tab-bar">
        <div className="tab-group">
          {TABS.map((t) => (
            <button
              key={t.id}
              className={`tab-button ${tab === t.id ? "active" : ""}`}
              onClick={() => setTab(t.id)}
            >
              {t.label}
            </button>
          ))}
        </div>
        <div className="tab-group">
          {RIGHT_TABS.map((t) => (
            <button
              key={t.id}
              className={`tab-button ${tab === t.id ? "active" : ""}`}
              onClick={() => setTab(t.id)}
            >
              {t.label}
            </button>
          ))}
        </div>
      </nav>

      {tab === "collection" && (
        <>
          <PullPanel uid={uid} config={config} />

          {toysLoading ? (
            <p className="empty-note" style={{ marginTop: 24 }}>
              Loading collection...
            </p>
          ) : (
            <div className="grid">
              <SpeciesProgress digitalCharacters={digitalCharacters} />
              <PhysicalToysPanel uid={uid} player={player} toys={toys} />
              <DigitalCharactersPanel uid={uid} digitalCharacters={digitalCharacters} toys={toys} />
            </div>
          )}
        </>
      )}

      {tab === "trade" && <TradeRoomsPanel uid={uid} player={player} />}

      {tab === "player" && <PlayerTab uid={uid} player={player} />}

      {tab === "admin" && <AdminTab config={config} />}
    </div>
  );
}

export default App;