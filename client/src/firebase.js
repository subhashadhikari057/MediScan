// src/firebase.js
import { initializeApp } from "firebase/app";
import { getAuth, GoogleAuthProvider } from "firebase/auth";

const firebaseConfig = {
  apiKey: "AIzaSyDmqoruSYXecbv6szoP2rVN9hgeLwDTDz4",
  authDomain: "mediscan-a26f3.firebaseapp.com",
  projectId: "mediscan-a26f3",
  storageBucket: "mediscan-a26f3.appspot.com", // fix typo here
  messagingSenderId: "808033961639",
  appId: "1:808033961639:web:6a1cdf229e81c0bc543d82"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Initialize Auth
const auth = getAuth(app);
const provider = new GoogleAuthProvider();

export { auth, provider };
