import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
import { getStorage } from "firebase/storage"; // Import Firebase Storage

const firebaseConfig = {
  apiKey: "AIzaSyBQEJ_bukPplbiTBLZgFMT6sHZ-_hAXna8",
  authDomain: "my-portfolio-2d67a.firebaseapp.com",
  projectId: "my-portfolio-2d67a",
  storageBucket: "my-portfolio-2d67a.firebasestorage.app",
  messagingSenderId: "951375502656",
  appId: "1:951375502656:web:04604f7e1bbd685b7d2ea5"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app);
const storage = getStorage(app); // Initialize Firebase Storage

export { auth, db, storage };
