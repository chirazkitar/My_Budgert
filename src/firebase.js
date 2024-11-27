// firebase.js
import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
import { getStorage } from "firebase/storage";

const firebaseConfig = {
    apiKey: "AIzaSyAind94Qhm8-gusL6ShZLD1er7VRlHRX5c",
    authDomain: "my-budget-25a8b.firebaseapp.com",
    projectId: "my-budget-25a8b",
    storageBucket: "my-budget-25a8b.firebasestorage.app",
    messagingSenderId: "344701541660",
    appId: "1:344701541660:web:f9ac496863a1526c23aed9"
  };
  

const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const db = getFirestore(app);
export const storage = getStorage(app);
