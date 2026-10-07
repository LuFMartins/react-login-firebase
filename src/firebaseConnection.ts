import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyA0hEVTcOtCv4OOu5ivyKDneGNCkl-q804",
  authDomain: "cursoreact-8e493.firebaseapp.com",
  projectId: "cursoreact-8e493",
  storageBucket: "cursoreact-8e493.firebasestorage.app",
  messagingSenderId: "658499428725",
  appId: "1:658499428725:web:672e1f2990889a2c1f733c"
};

const firebaseApp = initializeApp(firebaseConfig);
const db = getFirestore(firebaseApp)

export {db};