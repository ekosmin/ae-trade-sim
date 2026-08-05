import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyBz_RmtJkiu9qv1QizBYrw0MNc1aY4b5M8",
  authDomain: "ae-trade-sim.firebaseapp.com",
  projectId: "ae-trade-sim",
  storageBucket: "ae-trade-sim.firebasestorage.app",
  messagingSenderId: "12481399865",
  appId: "1:12481399865:web:b8c26b362afcdbb33ad1e8"
};

const app = initializeApp(firebaseConfig);

export const auth = getAuth(app);
export const db = getFirestore(app);
