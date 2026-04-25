import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: process.env.REACT_APP_FIREBASE_API_KEY || "AIzaSyCoLhesh9vZ5jvXTnc1RYJWmgmqwDfQ3QA",
  authDomain: process.env.REACT_APP_FIREBASE_AUTH_DOMAIN || "bengi-box.firebaseapp.com",
  projectId: process.env.REACT_APP_FIREBASE_PROJECT_ID || "bengi-box",
  storageBucket: process.env.REACT_APP_FIREBASE_STORAGE_BUCKET || "bengi-box.firebasestorage.app",
  messagingSenderId: process.env.REACT_APP_FIREBASE_MESSAGING_SENDER_ID || "1038561994795",
  appId: process.env.REACT_APP_FIREBASE_APP_ID || "1:1038561994795:web:3e6ef8bb4270cc9440626e",
  measurementId: process.env.REACT_APP_FIREBASE_MEASUREMENT_ID || "G-8PD24GZ56J"
};

console.log("Firebase Initializing with API Key:", firebaseConfig.apiKey ? "Present" : "MISSING");

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Initialize Services
export const auth = getAuth(app);
export const db = getFirestore(app);

export default app;
