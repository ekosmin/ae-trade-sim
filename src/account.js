import { signOut } from "firebase/auth";
import { auth } from "./firebase";

// Signs out of the current anonymous session. usePlayer's auth listener will
// automatically sign in a brand new anonymous user afterward, so the player
// starts fresh — any toys they owned stay exactly where they are in
// Firestore, just no longer reachable from the new account.
export async function resetAccount() {
  await signOut(auth);
}
