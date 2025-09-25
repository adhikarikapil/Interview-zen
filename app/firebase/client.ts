import { initializeApp, getApp, getApps } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyAMpPk_MDGIybJfyzLnmVLRlrbnZk4UC98",
  authDomain: "interview-zen.firebaseapp.com",
  projectId: "interview-zen",
  storageBucket: "interview-zen.firebasestorage.app",
  messagingSenderId: "173123519285",
  appId: "1:173123519285:web:f65f90f3d251df951b027c",
  measurementId: "G-M5YWG860Y3"
};

// Initialize Firebase
const app = !getApps.length ? initializeApp(firebaseConfig) : getApp();

export const auth = getAuth(app);
export const db = getFirestore(app)
