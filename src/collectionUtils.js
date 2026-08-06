export function getDigitalCharacters(player, uid, toys) {
  return player.everOwned
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
}
