import "./App.css";
import { usePlayer } from "./usePlayer";
import { useToys } from "./useToys";
import { getDigitalCharacters } from "./collectionUtils";
import NameEntry from "./components/NameEntry";
import PullPanel from "./components/PullPanel";
import PhysicalToysPanel from "./components/PhysicalToysPanel";
import DigitalCharactersPanel from "./components/DigitalCharactersPanel";
import SpeciesProgress from "./components/SpeciesProgress";

function App() {
  const { uid, player, loading, createPlayer, addOwnedToy } = usePlayer();
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
            <strong>{player.collection.length}</strong> owned
          </span>
          <span className="stat">
            <strong>{player.everOwned.length}</strong> ever owned
          </span>
        </div>
      </header>

      <PullPanel uid={uid} onPulled={(result) => addOwnedToy(result.toyId)} />

      {toysLoading ? (
        <p className="empty-note" style={{ marginTop: 24 }}>
          Loading collection...
        </p>
      ) : (
        <div className="grid">
          <SpeciesProgress digitalCharacters={digitalCharacters} />
          <PhysicalToysPanel player={player} toys={toys} />
          <DigitalCharactersPanel digitalCharacters={digitalCharacters} />
        </div>
      )}
    </div>
  );
}

export default App;