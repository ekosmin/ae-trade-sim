export const SPECIES = [
    { name: "Rockflock", rarity: "Common", weight: 4 },
    { name: "Scatterpus", rarity: "Common", weight: 4 },
    { name: "Chomble", rarity: "Common", weight: 4 },
    { name: "Ooo-loo", rarity: "Common", weight: 4 },
    { name: "Elphie", rarity: "Common", weight: 5 },
    { name: "Jetti", rarity: "Common", weight: 5 },
    { name: "Pinbro", rarity: "Common", weight: 5 },
    { name: "Hornorang", rarity: "Common", weight: 5 },
    { name: "Glo-Bro", rarity: "Common", weight: 5 },
    { name: "Chanjo", rarity: "Common", weight: 5 },
    { name: "Chick-a-Boom", rarity: "Common", weight: 5 },
    { name: "Grogre", rarity: "Common", weight: 5 },
    { name: "Lennisaur", rarity: "Rare", weight: 4 },
    { name: "Triceraclops", rarity: "Rare", weight: 4 },
    { name: "Grizz-Grizz", rarity: "Rare", weight: 4 },
    { name: "Lilibud", rarity: "Rare", weight: 4 },
    { name: "Serpie", rarity: "Rare", weight: 4 },
    { name: "Flinkerflump", rarity: "Rare", weight: 4 },
    { name: "Cycroc", rarity: "Epic", weight: 3 },
    { name: "Bizken", rarity: "Epic", weight: 3 },
    { name: "Konjuri", rarity: "Epic", weight: 3 },
    { name: "Mouthster", rarity: "Epic", weight: 3 },
    { name: "Hoodon", rarity: "Legendary", weight: 2 },
    { name: "Drazzle", rarity: "Legendary", weight: 2 },
  ];

  export function getDefaultSpeciesWeights() {
    return Object.fromEntries(SPECIES.map((s) => [s.name, s.weight]));
  }

  export function rollSpecies(speciesWeights) {
    const weights = speciesWeights ?? getDefaultSpeciesWeights();
    const totalWeight = SPECIES.reduce((sum, s) => sum + (weights[s.name] ?? s.weight), 0);
    let roll = Math.random() * totalWeight;
    for (const s of SPECIES) {
      const weight = weights[s.name] ?? s.weight;
      if (roll < weight) return s;
      roll -= weight;
    }
    return SPECIES[SPECIES.length - 1]; // fallback, shouldn't hit due to floating point
  }
