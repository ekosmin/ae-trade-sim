import { useState } from "react";
import "./App.css";
import { usePlayer } from "./usePlayer";
import { useToys } from "./useToys";
import { getDigitalCharacters } from "./collectionUtils";
import NameEntry from "./components/NameEntry";
import PullPanel from "./components/PullPanel";
import PhysicalToysPanel from "./components/PhysicalToysPanel";
import DigitalCharactersPanel from "./components/DigitalCharactersPanel";
import SpeciesProgress from "./components/SpeciesProgress";
import TradeRoomsPanel from "./components/TradeRoomsPanel";

const TABS = [
  { id: "collection", label: "Collection" },
  { id: "trade", label: "Trade Rooms" },
];

function App() {
  const { uid, player, loading, createPlayer } = usePlayer();
  const [tab, setTab] = useState("collection");
  const allIds = player ? Array.from(new Set([...player.collection, ...player.everOwned])) : [];
  const { toys, loading: toysLoading } = useToys(allIds);

  if (loading) {
    return <p style={{ textAlign: "center", marginTop: 80 }}>Loading...</p>;
  }

  if (!player) {
    return <NameEntry onSubmit={createPlayer} />;
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
        {TABS.map((t) => (
          <button
            key={t.id}
            className={`tab-button ${tab === t.id ? "active" : ""}`}
            onClick={() => setTab(t.id)}
          >
            {t.label}
          </button>
        ))}
      </nav>

      {tab === "collection" ? (
        <>
          <PullPanel uid={uid} />

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
      ) : (
        <TradeRoomsPanel uid={uid} player={player} />
      )}
    </div>
  );
}

export default App;