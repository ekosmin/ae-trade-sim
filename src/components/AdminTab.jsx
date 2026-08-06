import { SPECIES } from "../gameData";
import { updateGameConfig, updateSpeciesWeight } from "../config";
import { rarityClass } from "../rarity";

function commitNumber(field, e) {
  const value = Number(e.target.value);
  if (!Number.isFinite(value) || value < 0) return;
  updateGameConfig({ [field]: value });
}

function commitWeight(speciesName, e) {
  const value = Number(e.target.value);
  if (!Number.isFinite(value) || value < 0) return;
  updateSpeciesWeight(speciesName, value);
}

export default function AdminTab({ config }) {
  return (
    <div className="panel">
      <h2>Admin</h2>
      <div className="admin-warning">
        Changing these values changes the simulator's behavior for every player, immediately.
      </div>

      <div className="admin-field">
        <label htmlFor="portals-per-hatch">Portals per Hatch</label>
        <p className="panel-note">Trade Portals granted each time a player pulls a new ÆRTHLING.</p>
        <input
          id="portals-per-hatch"
          type="number"
          min="0"
          key={config.portalsPerHatch}
          defaultValue={config.portalsPerHatch}
          onBlur={(e) => commitNumber("portalsPerHatch", e)}
        />
      </div>

      <div className="admin-field">
        <label htmlFor="starting-portals">Starting Portals</label>
        <p className="panel-note">How many Trade Portals a brand-new account starts with.</p>
        <input
          id="starting-portals"
          type="number"
          min="0"
          key={config.startingPortals}
          defaultValue={config.startingPortals}
          onBlur={(e) => commitNumber("startingPortals", e)}
        />
      </div>

      <div className="admin-field">
        <label>ÆRTHLING Weights</label>
        <p className="panel-note">
          Relative pull weight per species — higher rolls more often. Rarity tiers are cosmetic
          only and don't have to line up with weight.
        </p>
        <ul className="item-list">
          {SPECIES.map((s) => {
            const weight = config.speciesWeights[s.name] ?? s.weight;

            return (
              <li key={s.name} className="item-row">
                <span className={`tier-dot ${rarityClass(s.rarity)}`} />
                <div className="item-main">
                  <div className="item-name">{s.name}</div>
                </div>
                <span className={`tier-badge ${rarityClass(s.rarity)}`}>{s.rarity}</span>
                <input
                  type="number"
                  min="0"
                  className="weight-input"
                  key={weight}
                  defaultValue={weight}
                  onBlur={(e) => commitWeight(s.name, e)}
                />
              </li>
            );
          })}
        </ul>
      </div>
    </div>
  );
}
