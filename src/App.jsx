import { usePlayer } from "./usePlayer";
import { useToys } from "./useToys";
import { getDigitalCharacters } from "./collectionUtils";
import NameEntry from "./components/NameEntry";
import PullPanel from "./components/PullPanel";
import CollectionView from "./components/CollectionView";
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
    <div style={{ maxWidth: 480, margin: "40px auto" }}>
      <h1>Trading Sim</h1>
      <p>
        Signed in as <strong>{player.name}</strong>
      </p>
      <p>Player ID: {player.id}</p>
      <p>Toys currently owned: {player.collection.length}</p>
      <p>Toys ever owned: {player.everOwned.length}</p>

      <PullPanel uid={uid} onPulled={(result) => addOwnedToy(result.toyId)} />

      {toysLoading ? (
        <p>Loading collection...</p>
      ) : (
        <>
          <CollectionView player={player} toys={toys} digitalCharacters={digitalCharacters} />
          <SpeciesProgress digitalCharacters={digitalCharacters} />
        </>
      )}
    </div>
  );
}

export default App;