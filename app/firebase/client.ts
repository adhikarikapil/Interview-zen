// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
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
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);
