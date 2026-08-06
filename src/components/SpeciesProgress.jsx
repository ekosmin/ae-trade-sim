import { SPECIES } from "../gameData";

const RARITY_ORDER = ["Common", "Rare", "Epic", "Legendary"];

export default function SpeciesProgress({ digitalCharacters }) {
  const countsBySpecies = {};
  for (const char of digitalCharacters) {
    countsBySpecies[char.species] = (countsBySpecies[char.species] || 0) + 1;
  }

  return (
    <div style={{ marginTop: 24 }}>
      <h3>Species progress</h3>
      {RARITY_ORDER.map((rarity) => {
        const speciesInRarity = SPECIES.filter((s) => s.rarity === rarity);
        const collected = speciesInRarity.filter((s) => countsBySpecies[s.name] > 0).length;

        return (
          <div key={rarity} style={{ marginBottom: 16 }}>
            <h4>
              {rarity} ({collected} / {speciesInRarity.length} collected)
            </h4>
            <ul style={{ listStyle: "none", padding: 0 }}>
              {speciesInRarity.map((s) => (
                <li
                  key={s.name}
                  style={{
                    display: "flex",
                    justifyContent: "space-between",
                    padding: "4px 12px",
                    opacity: countsBySpecies[s.name] ? 1 : 0.5,
                  }}
                >
                  <span>{s.name}</span>
                  <span>{countsBySpecies[s.name] || 0}</span>
                </li>
              ))}
            </ul>
          </div>
        );
      })}
    </div>
  );
}
