import { usePlayer } from "./usePlayer";
import NameEntry from "./components/NameEntry";

function App() {
  const { player, loading, createPlayer } = usePlayer();

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
      <p>Collection: {JSON.stringify(player.collection)}</p>
      <p>Ever owned: {JSON.stringify(player.everOwned)}</p>
    </div>
  );
}

export default App;
