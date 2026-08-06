export function hasEverOwned(toy, playerId) {
  return toy.ownershipChain.some((entry) => entry.playerId === playerId);
}
