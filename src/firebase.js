// src/firebase.js

import { initializeApp } from "firebase/app";

import {
  getAuth,
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  sendPasswordResetEmail,
  signInWithPopup,
  GoogleAuthProvider,
  FacebookAuthProvider,
  EmailAuthProvider,
  updateProfile,
  updateEmail,
  updatePassword,
  confirmPasswordReset,
  reauthenticateWithCredential,
  signOut,
} from "firebase/auth";

import {
  getFirestore,
  doc,
  setDoc,
  getDoc,
  updateDoc,
} from "firebase/firestore";

import { getStorage, ref, uploadBytes, getDownloadURL } from "firebase/storage";

// 🔐 Your Firebase config from .env file
const firebaseConfig = {
  apiKey: import.meta.env.VITE_API_KEY,
  authDomain: import.meta.env.VITE_AUTH_DOMAIN,
  projectId: import.meta.env.VITE_PROJECT_ID,
  storageBucket: import.meta.env.VITE_STORAGE_BUCKET,
  messagingSenderId: import.meta.env.VITE_MESSAGING_SENDER_ID,
  appId: import.meta.env.VITE_APP_ID,
};

// 🔥 Initialize Firebase
const app = initializeApp(firebaseConfig);

// 🔐 Firebase services
const auth = getAuth(app);
const db = getFirestore(app);
const storage = getStorage(app);

// 🌟 Export everything needed
export {
  auth,
  db,
  doc,
  setDoc,
  getDoc,
  updateDoc,
  storage,
  ref,
  uploadBytes,
  getDownloadURL,
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  sendPasswordResetEmail,
  signInWithPopup,
  GoogleAuthProvider,
  FacebookAuthProvider,
  EmailAuthProvider,
  updateProfile,
  updateEmail,
  updatePassword,
  confirmPasswordReset,
  reauthenticateWithCredential,
  signOut,
};
