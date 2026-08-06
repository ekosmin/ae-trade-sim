import { useEffect, useState } from "react";
import { doc, onSnapshot, setDoc } from "firebase/firestore";
import { db } from "./firebase";
import { getDefaultSpeciesWeights } from "./gameData";

function configRef() {
  return doc(db, "config", "gameSettings");
}

export function getDefaultConfig() {
  return {
    portalsPerHatch: 1,
    startingPortals: 5,
    speciesWeights: getDefaultSpeciesWeights(),
  };
}

export function useGameConfig() {
  const [config, setConfig] = useState(getDefaultConfig());

  useEffect(() => {
    const unsubscribe = onSnapshot(configRef(), (snapshot) => {
      const defaults = getDefaultConfig();
      const data = snapshot.exists() ? snapshot.data() : {};
      setConfig({
        portalsPerHatch: data.portalsPerHatch ?? defaults.portalsPerHatch,
        startingPortals: data.startingPortals ?? defaults.startingPortals,
        speciesWeights: { ...defaults.speciesWeights, ...(data.speciesWeights ?? {}) },
      });
    });

    return () => unsubscribe();
  }, []);

  return config;
}

export async function updateGameConfig(partial) {
  await setDoc(configRef(), partial, { merge: true });
}

export async function updateSpeciesWeight(speciesName, weight) {
  await setDoc(configRef(), { [`speciesWeights.${speciesName}`]: weight }, { merge: true });
}
