import { SPECIES } from "../gameData";
import { RARITY_ORDER, rarityClass } from "../rarity";

export default function SpeciesProgress({ digitalCharacters }) {
  const countsBySpecies = {};
  for (const char of digitalCharacters) {
    countsBySpecies[char.species] = (countsBySpecies[char.species] || 0) + 1;
  }

  return (
    <div className="panel">
      <h2>Species progress</h2>
      <p className="panel-note">Digital characters collected, by species</p>
      {RARITY_ORDER.map((rarity) => {
        const speciesInRarity = SPECIES.filter((s) => s.rarity === rarity);
        const collected = speciesInRarity.filter((s) => countsBySpecies[s.name] > 0).length;

        return (
          <div key={rarity} className="species-group">
            <div className="species-group-head">
              <span className={`tier-dot ${rarityClass(rarity)}`} />
              <span>{rarity}</span>
              <strong>
                {collected} / {speciesInRarity.length}
              </strong>
            </div>
            <ul className="item-list">
              {speciesInRarity.map((s) => (
                <li
                  key={s.name}
                  className={`species-row ${countsBySpecies[s.name] ? "" : "uncollected"}`}
                >
                  <span className="species-name">{s.name}</span>
                  <span className="species-count">{countsBySpecies[s.name] || 0}</span>
                </li>
              ))}
            </ul>
          </div>
        );
      })}
    </div>
  );
}
