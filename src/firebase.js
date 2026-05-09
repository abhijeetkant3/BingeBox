import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth"; // Added for your Signup/Login logic
import { getFirestore } from "firebase/firestore"; // Added if you decide to save data later

const firebaseConfig = {
  apiKey: process.env.REACT_APP_FIREBASE_API_KEY,
  authDomain: process.env.REACT_APP_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.REACT_APP_FIREBASE_PROJECT_ID,
  storageBucket: process.env.REACT_APP_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.REACT_APP_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.REACT_APP_FIREBASE_APP_ID,
  measurementId: process.env.REACT_APP_FIREBASE_MEASUREMENT_ID
};

console.log("Firebase Initializing with API Key:", firebaseConfig.apiKey ? "Present" : "MISSING");

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Export services to use them in your components
export const auth = getAuth(app);
export const db = getFirestore(app);
export default app;