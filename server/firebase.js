const { initializeApp } = require('firebase/app');
const { getFirestore } = require('firebase/firestore');
require('dotenv').config();

const firebaseConfig = {
  apiKey: process.env.FIREBASE_API_KEY || "AIzaSyAAYHv5k4Lmu69Pzi2ZsyipI8082SuWaSE",
  authDomain: process.env.FIREBASE_AUTH_DOMAIN || "portfolio-admin-57e19.firebaseapp.com",
  projectId: process.env.FIREBASE_PROJECT_ID || "portfolio-admin-57e19",
  storageBucket: process.env.FIREBASE_STORAGE_BUCKET || "portfolio-admin-57e19.firebasestorage.app",
  messagingSenderId: process.env.FIREBASE_MESSAGING_SENDER_ID || "322965578736",
  appId: process.env.FIREBASE_APP_ID || "1:322965578736:web:9e690930800bafe48b3335"
};

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

module.exports = { db };
