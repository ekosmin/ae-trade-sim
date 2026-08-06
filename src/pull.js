import { collection, doc, setDoc, updateDoc, arrayUnion, increment } from "firebase/firestore";
import { db } from "./firebase";
import { rollSpecies } from "./gameData";
import { rollStarRating } from "./starRating";

export async function pullToy(uid, config) {
  const species = rollSpecies(config?.speciesWeights);
  const starRating = rollStarRating("pulled");

  const toyRef = doc(collection(db, "physicalToys"));
  const toyId = toyRef.id;

  const toyData = {
    species: species.name,
    rarity: species.rarity,
    createdAt: Date.now(),
    pulledBy: uid,
    currentOwner: uid,
    ownershipChain: [
      { playerId: uid, acquiredAt: Date.now(), method: "pulled", starRating },
    ],
  };

  await setDoc(toyRef, toyData);

  const playerRef = doc(db, "players", uid);
  await updateDoc(playerRef, {
    collection: arrayUnion(toyId),
    everOwned: arrayUnion(toyId),
    tradePortals: increment(config?.portalsPerHatch ?? 1),
  });

  return { toyId, ...toyData };
}