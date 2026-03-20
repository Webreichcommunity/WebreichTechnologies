// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import { getAuth, onAuthStateChanged, signInAnonymously } from "firebase/auth";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyDwxu3BZ7Mov2YRYQCSusUo5lwNB6fbUoM",
  authDomain: "webreichtechnologies.firebaseapp.com",
  projectId: "webreichtechnologies",
  storageBucket: "webreichtechnologies.firebasestorage.app",
  messagingSenderId: "468047151094",
  appId: "1:468047151094:web:148e558df72174b2f111d7"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const db = getFirestore(app);
const auth = getAuth(app);

const authReady = new Promise((resolve) => {
  const unsubscribe = onAuthStateChanged(auth, (user) => {
    resolve(user || null);
    unsubscribe();
  });
});

signInAnonymously(auth).catch(() => {
  // Auth might be disabled in Firebase Console; allow app to continue.
});

export { app, db, auth, authReady };
