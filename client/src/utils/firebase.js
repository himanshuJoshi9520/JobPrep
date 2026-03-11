
import { initializeApp } from "firebase/app";
import {getAuth, GoogleAuthProvider} from "firebase/auth"
const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_APIKEY,
  authDomain: "interviewiq-bf9e9.firebaseapp.com",
  projectId: "interviewiq-bf9e9",
  storageBucket: "interviewiq-bf9e9.firebasestorage.app",
  messagingSenderId: "550774279911",
  appId: "1:550774279911:web:ff8fe794e87d8a796b1c42"
};

const app = initializeApp(firebaseConfig);

const auth = getAuth(app);

const provider = new GoogleAuthProvider()

export {auth , provider}