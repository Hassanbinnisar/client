import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import { getAuth } from "firebase/auth";

const firebaseConfig = {
  apiKey: "AIzaSyCB5rXpJ1xCvhIIN2Dr-f516NT7MDoWBA8",
  authDomain: "coding-night-c22c2.firebaseapp.com",
  projectId: "coding-night-c22c2",
  storageBucket: "coding-night-c22c2.firebasestorage.app",
  messagingSenderId: "89313283375",
  appId: "1:89313283375:web:59cae83ac0b89cfbc3e5da",
  measurementId: "G-NTH80QJ0L3"
};

const app = initializeApp(firebaseConfig);
export const db = getFirestore(app);
export const auth = getAuth(app);

