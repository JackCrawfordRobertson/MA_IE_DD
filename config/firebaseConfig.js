// firebaseConfig.js
import { initializeApp, getApps, getApp } from 'firebase/app';
import { getFirestore } from 'firebase/firestore';

const firebaseConfig = {
  apiKey: "AIzaSyCm9psIsfz8bQs76vw4474As6-HU_kPlgM",
  authDomain: "climate-chatbot.firebaseapp.com",
  projectId: "climate-chatbot",
  storageBucket: "climate-chatbot.appspot.com",
  messagingSenderId: "1020836566148",
  appId: "1:1020836566148:web:faf36389aacdc7786eded1",
  measurementId: "G-JQT50PRTZZ"
};

// Initialize Firebase only once
export function initializeFirebase() {
  if (!getApps().length) {
    return initializeApp(firebaseConfig);
  } else {
    return getApp();
  }
}

export function getFirestoreDB() {
  const app = initializeFirebase();
  return getFirestore(app);
}