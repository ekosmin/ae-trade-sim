import { useState } from "react";
import { usePlayer } from "./usePlayer";
import NameEntry from "./components/NameEntry";
import PullPanel from "./components/PullPanel";

function App() {
  const { uid, player, loading, createPlayer } = usePlayer();
  const [pullHistory, setPullHistory] = useState([]);

  if (loading) {
    return <p style={{ textAlign: "center", marginTop: 80 }}>Loading...</p>;
  }

  if (!player) {
    return <NameEntry onSubmit={createPlayer} />;
  }

  return (
    <div style={{ maxWidth: 480, margin: "40px auto" }}>
      <h1>Trading Sim</h1>
      <p>
        Signed in as <strong>{player.name}</strong>
      </p>
      <p>Player ID: {player.id}</p>
      <p>Toys currently owned: {player.collection.length + pullHistory.length}</p>
      <p>Toys ever owned: {player.everOwned.length + pullHistory.length}</p>

      <PullPanel uid={uid} onPulled={(result) => setPullHistory((prev) => [...prev, result])} />
    </div>
  );
}

export default App;