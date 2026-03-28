// src/services/firebase.js
// Client-side Firebase SDK (auth + Firestore reads for real-time UI)

import { initializeApp } from "firebase/app";
import {
  getAuth,
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut,
  GoogleAuthProvider,
  signInWithPopup,
  onAuthStateChanged,
  updateProfile,
} from "firebase/auth";
import {
  getFirestore,
  doc,
  getDoc,
  onSnapshot,
  collection,
  query,
  where,
  orderBy,
  limit,
  getDocs,
} from "firebase/firestore";

// ─── Firebase config from Vite env ───────────────────────────────────────
const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN,
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID,
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID,
  appId: import.meta.env.VITE_FIREBASE_APP_ID,
};

const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const db = getFirestore(app);
const googleProvider = new GoogleAuthProvider();

// ─── Auth Actions ─────────────────────────────────────────────────────────

export async function signUpWithEmail(email, password, displayName) {
  const cred = await createUserWithEmailAndPassword(auth, email, password);
  await updateProfile(cred.user, { displayName });
  return cred.user;
}

export async function signInWithEmail(email, password) {
  const cred = await signInWithEmailAndPassword(auth, email, password);
  return cred.user;
}

export async function signInWithGoogle() {
  const result = await signInWithPopup(auth, googleProvider);
  return result.user;
}

export async function logout() {
  await signOut(auth);
}

export function onAuthChange(callback) {
  return onAuthStateChanged(auth, callback);
}

// ─── Fetch user role from Firestore ──────────────────────────────────────
export async function getUserRole(uid) {
  const snap = await getDoc(doc(db, "users", uid));
  return snap.exists() ? snap.data().role : null;
}

// ─── Real-time listener for cultural passport ─────────────────────────────
export function listenToPassport(uid, callback) {
  const passportRef = doc(db, "cultural_passports", uid);
  return onSnapshot(passportRef, (snap) => {
    callback(snap.exists() ? snap.data() : null);
  });
}

// ─── Real-time listener for commission updates ────────────────────────────
export function listenToCommissions(uid, role, callback) {
  const field = role === "artist" ? "artistId" : "buyerId";
  const q = query(
    collection(db, "commissions"),
    where(field, "==", uid),
    orderBy("createdAt", "desc"),
    limit(20)
  );
  return onSnapshot(q, (snap) => {
    callback(snap.docs.map((d) => ({ id: d.id, ...d.data() })));
  });
}

// ─── Get artist profile (client-side read) ────────────────────────────────
export async function getArtistProfile(uid) {
  const snap = await getDoc(doc(db, "artists", uid));
  return snap.exists() ? snap.data() : null;
}

// ─── Get marketplace artworks (client-side read for fast SSR) ────────────
export async function getMarketplaceArtworks({ artForm, state, limitCount = 20 } = {}) {
  let q = query(
    collection(db, "artworks"),
    where("status", "==", "listed"),
    orderBy("createdAt", "desc"),
    limit(limitCount)
  );

  const snap = await getDocs(q);
  let artworks = snap.docs.map((d) => ({ id: d.id, ...d.data() }));

  if (artForm) artworks = artworks.filter((a) => a.artForm === artForm);
  if (state) artworks = artworks.filter((a) => a.state === state);

  return artworks;
}

export default app;
