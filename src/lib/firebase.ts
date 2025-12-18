// src/lib/firebase.ts
import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getStorage } from "firebase/storage";

// Cole aqui o firebaseConfig do Passo 1
const firebaseConfig = {
  apiKey: "AIzaSyC3P6pnvPDLhVa2LwyH58YVi6gKAWzPGnk", // ← MINHA KEY
  authDomain: "sofvet-app.firebaseapp.com",
  projectId: "sofvet-app",
  storageBucket: "sofvet-app.appspot.com",
  messagingSenderId: "123...",
  appId: "1:123...:web:abc...",
};

// Inicializa o app
const app = initializeApp(firebaseConfig);

// Exporta auth (já estava usando)
export const auth = getAuth(app);

// Exporta storage (para foto do perfil)
export const storage = getStorage(app);
