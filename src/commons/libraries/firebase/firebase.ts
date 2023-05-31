import { initializeApp } from "firebase/app";
import { GoogleAuthProvider, getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

// TODO: Replace the following with your app's Firebase project configuration
// See: https://firebase.google.com/docs/web/learn-more#config-object
const firebaseConfig = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
  //  "AIzaSyCuGAx87vTtMb7ENj4S0a8kiDA8sI2d7q8",
  authDomain: "ourtown-beta.firebaseapp.com",
  projectId: "ourtown-beta",
  storageBucket: "ourtown-beta.appspot.com",
  messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGINGSENDERID,
  // "149183681513",
  appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID,
  // "1:149183681513:web:ac448a5baa37a791333178",
  measurementId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGINGSENDERID,
  // "G-0WKSVH695S",
};

// Initialize Firebase
export const app = initializeApp(firebaseConfig);

// Initialize Firebase Authentication and get a reference to the service
export const auth = getAuth(app);
export const db = getFirestore(app);
export const provider = new GoogleAuthProvider();
