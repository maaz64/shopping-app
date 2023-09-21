// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyBeyUJQz6GS7NDdolYhkeFKSjF4jUlDpYw",
  authDomain: "busy-buy-app-81f6a.firebaseapp.com",
  projectId: "busy-buy-app-81f6a",
  storageBucket: "busy-buy-app-81f6a.appspot.com",
  messagingSenderId: "92597230634",
  appId: "1:92597230634:web:2aa30ffd683b45aeae3753"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app);

export {db, auth};