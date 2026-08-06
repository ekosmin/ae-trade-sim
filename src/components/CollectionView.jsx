import { useToys } from "../useToys";

const STAR_LABELS = {
  1: "★",
  2: "★★",
  3: "★★★",
  4: "★★★★",
  5: "★★★★★",
  platinum: "✦ PLATINUM ✦",
};

const cardStyle = {
  border: "1px solid #ccc",
  borderRadius: 8,
  padding: "8px 12px",
  marginBottom: 8,
};

export default function CollectionView({ uid, player }) {
  const allIds = Array.from(new Set([...player.collection, ...player.everOwned]));
  const { toys, loading } = useToys(allIds);

  if (loading) {
    return <p>Loading collection...</p>;
  }

  const currentToys = player.collection.map((id) => toys[id]).filter(Boolean);

  const digitalCharacters = player.everOwned
    .map((id) => toys[id])
    .filter(Boolean)
    .map((toy) => {
      const entry = toy.ownershipChain.find((e) => e.playerId === uid);
      return {
        toyId: toy.id,
        species: toy.species,
        rarity: toy.rarity,
        starRating: entry?.starRating,
      };
    });

  return (
    <div style={{ marginTop: 24 }}>
      <h3>Current physical toys ({currentToys.length})</h3>
      {currentToys.length === 0 && <p>None yet — pull a toy to get started.</p>}
      <ul style={{ listStyle: "none", padding: 0 }}>
        {currentToys.map((toy) => (
          <li key={toy.id} style={cardStyle}>
            <strong>{toy.species}</strong> ({toy.rarity})
            <div style={{ fontSize: 12, color: "#888" }}>{toy.id}</div>
          </li>
        ))}
      </ul>

      <h3>Digital characters ({digitalCharacters.length})</h3>
      {digitalCharacters.length === 0 && <p>None yet.</p>}
      <ul style={{ listStyle: "none", padding: 0 }}>
        {digitalCharacters.map((char) => (
          <li key={char.toyId} style={cardStyle}>
            <strong>{char.species}</strong> ({char.rarity}) — {STAR_LABELS[char.starRating]}
          </li>
        ))}
      </ul>
    </div>
  );
}
