// firebase.ts

import { initializeApp } from "firebase/app";
import {
  getAuth,
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut,
  onAuthStateChanged,
} from "firebase/auth";
import {
  getFirestore,
  doc,
  setDoc,
  getDoc,
  updateDoc,
  collection,
  addDoc,
  deleteDoc,
} from "firebase/firestore";

// ✅ Your Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyCPgBF7-6eFre4poIR2CjVwp1mn32ItznQ",
  authDomain: "rna-hub.firebaseapp.com",
  projectId: "rna-hub",
  storageBucket: "rna-hub.appspot.com",
  messagingSenderId: "1051758926151",
  appId: "1:1051758926151:web:8cc9e4380054acdb01d462",
};

// ✅ Initialize Firebase app
const app = initializeApp(firebaseConfig);

// ✅ Initialize Firebase Auth and Firestore
const auth = getAuth(app);
const db = getFirestore(app);

// ✅ Export everything needed across the app
export {
  auth,
  db,
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut,
  onAuthStateChanged,
  doc,
  setDoc,
  getDoc,
  updateDoc,
  collection,
  addDoc,
  deleteDoc,
};
