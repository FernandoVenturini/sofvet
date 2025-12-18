// src/lib/firebase.ts
import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getStorage } from "firebase/storage";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyC3P6pnvPDLhVa2LwyH58YVi6gKAWzPGnk",
  authDomain: "sofvet-app.firebaseapp.com",
  projectId: "sofvet-app",
  storageBucket: "sofvet-app.firebasestorage.app",
  messagingSenderId: "43694691992",
  appId: "1:43694691992:web:a768132b812e59a5fae2ed",
};

const app = initializeApp(firebaseConfig);

export const auth = getAuth(app);
export const storage = getStorage(app);
export const db = getFirestore(app);
