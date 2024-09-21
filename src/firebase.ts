// src/firebase.ts
import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyBBa-Ya8fcCWPusD-fq7kuec8fx83qbgqo",
  authDomain: "movie-picker-a3a6c.firebaseapp.com",
  projectId: "movie-picker-a3a6c",
  storageBucket: "movie-picker-a3a6c.appspot.com",
  messagingSenderId: "84824817592",
  appId: "1:84824817592:web:fcf2eab1d7bb9068d0594d"
};

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

export { db };
