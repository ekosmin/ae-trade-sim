import {
  collection,
  doc,
  setDoc,
  updateDoc,
  arrayUnion,
  runTransaction,
  getDocs,
  query,
  where,
} from "firebase/firestore";
import { db } from "./firebase";
import { rollStarRating } from "./starRating";

export async function requestTrade(roomId, { fromPlayer, toPlayer, offeredToyId, requestedToyId }) {
  const tradeRef = doc(collection(db, "tradeRooms", roomId, "trades"));
  await setDoc(tradeRef, {
    fromPlayer,
    toPlayer,
    offeredToyId,
    requestedToyId,
    status: "pending",
    createdAt: Date.now(),
  });
  return tradeRef.id;
}

export async function declineTrade(roomId, tradeId) {
  await updateDoc(doc(db, "tradeRooms", roomId, "trades", tradeId), {
    status: "declined",
  });
}

// Exchanges custody of the two physical toys, rolls each player a new
// "traded" digital character on the toy they just received, and cancels any
// other pending trades for either toy since they've now changed hands.
export async function acceptTrade(roomId, trade) {
  const { id: tradeId, fromPlayer, toPlayer, offeredToyId, requestedToyId } = trade;

  const tradesRef = collection(db, "tradeRooms", roomId, "trades");
  const pendingSnapshot = await getDocs(query(tradesRef, where("status", "==", "pending")));
  const otherPendingRefs = pendingSnapshot.docs
    .filter((d) => {
      if (d.id === tradeId) return false;
      const data = d.data();
      return [data.offeredToyId, data.requestedToyId].some((toyId) =>
        [offeredToyId, requestedToyId].includes(toyId)
      );
    })
    .map((d) => d.ref);

  await runTransaction(db, async (transaction) => {
    const tradeRef = doc(db, "tradeRooms", roomId, "trades", tradeId);
    const offeredToyRef = doc(db, "physicalToys", offeredToyId);
    const requestedToyRef = doc(db, "physicalToys", requestedToyId);
    const fromPlayerRef = doc(db, "players", fromPlayer);
    const toPlayerRef = doc(db, "players", toPlayer);

    const [tradeSnap, offeredToySnap, requestedToySnap, fromPlayerSnap, toPlayerSnap] =
      await Promise.all([
        transaction.get(tradeRef),
        transaction.get(offeredToyRef),
        transaction.get(requestedToyRef),
        transaction.get(fromPlayerRef),
        transaction.get(toPlayerRef),
      ]);
    const otherPendingSnaps = await Promise.all(
      otherPendingRefs.map((ref) => transaction.get(ref))
    );

    if (tradeSnap.data().status !== "pending") {
      throw new Error("This trade is no longer pending.");
    }

    const offeredToy = offeredToySnap.data();
    const requestedToy = requestedToySnap.data();
    const fromCollection = fromPlayerSnap.data().collection;
    const toCollection = toPlayerSnap.data().collection;

    if (!fromCollection.includes(offeredToyId) || !toCollection.includes(requestedToyId)) {
      throw new Error("This trade is no longer valid — one of the toys has changed hands.");
    }

    const fromPortals = fromPlayerSnap.data().tradePortals ?? 0;
    const toPortals = toPlayerSnap.data().tradePortals ?? 0;
    if (fromPortals < 1 || toPortals < 1) {
      throw new Error("Both players need a Trade Portal to complete this trade.");
    }

    // Tradeback rule, re-checked at accept time in case anything changed since request.
    const fromAlreadyOwnedRequested = requestedToy.ownershipChain.some(
      (e) => e.playerId === fromPlayer
    );
    const toAlreadyOwnedOffered = offeredToy.ownershipChain.some((e) => e.playerId === toPlayer);
    if (fromAlreadyOwnedRequested || toAlreadyOwnedOffered) {
      throw new Error("This trade would violate the no-tradebacks rule.");
    }

    const now = Date.now();

    transaction.update(offeredToyRef, {
      currentOwner: toPlayer,
      ownershipChain: [
        ...offeredToy.ownershipChain,
        { playerId: toPlayer, acquiredAt: now, method: "traded", starRating: rollStarRating("traded") },
      ],
    });

    transaction.update(requestedToyRef, {
      currentOwner: fromPlayer,
      ownershipChain: [
        ...requestedToy.ownershipChain,
        { playerId: fromPlayer, acquiredAt: now, method: "traded", starRating: rollStarRating("traded") },
      ],
    });

    transaction.update(fromPlayerRef, {
      collection: fromCollection.filter((id) => id !== offeredToyId).concat(requestedToyId),
      tradePortals: fromPortals - 1,
    });
    transaction.update(toPlayerRef, {
      collection: toCollection.filter((id) => id !== requestedToyId).concat(offeredToyId),
      tradePortals: toPortals - 1,
    });

    transaction.update(tradeRef, {
      status: "accepted",
      fromClaimed: false,
      toClaimed: false,
    });

    otherPendingSnaps.forEach((snap) => {
      if (snap.exists() && snap.data().status === "pending") {
        transaction.update(snap.ref, { status: "declined" });
      }
    });
  });
}

// Adds the newly-received toy to the player's everOwned list so their new
// digital character shows up in their collection.
export async function claimTrade(roomId, trade, uid) {
  const isFrom = trade.fromPlayer === uid;
  const newToyId = isFrom ? trade.requestedToyId : trade.offeredToyId;

  await updateDoc(doc(db, "players", uid), {
    everOwned: arrayUnion(newToyId),
  });
  await updateDoc(doc(db, "tradeRooms", roomId, "trades", trade.id), {
    [isFrom ? "fromClaimed" : "toClaimed"]: true,
  });
}
