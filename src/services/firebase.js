import { initializeApp, getApps, getApp } from 'firebase/app';
import { 
  getFirestore, 
  collection, 
  getDocs, 
  getDoc, 
  doc, 
  addDoc, 
  setDoc, 
  updateDoc, 
  deleteDoc, 
  query, 
  where, 
  orderBy, 
  serverTimestamp,
  writeBatch
} from 'firebase/firestore';
import { 
  getAuth, 
  signInWithEmailAndPassword, 
  signOut, 
  onAuthStateChanged 
} from 'firebase/auth';

// Database configuration: Supports Environment Variables for switching seamlessly between TEST and PRODUCTION
const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY || "AIzaSyB3-Bu_owRb7lgKYEzC9rhWvx3YHvExGL0",
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN || "alerta-paraguay.firebaseapp.com",
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID || "alerta-paraguay",
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET || "alerta-paraguay.firebasestorage.app",
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID || "120835336233",
  appId: import.meta.env.VITE_FIREBASE_APP_ID || "1:120835336233:web:71251cea8fce226e329438"
};

// Initialize Firebase without colliding with existing instances
const app = getApps().length > 0 ? getApp() : initializeApp(firebaseConfig);
export const db = getFirestore(app);
export const auth = getAuth(app);

// Safe collection names with datacampus prefix to strictly avoid touching other alerta-paraguay collections
export const COLLECTIONS = {
  UNIVERSITIES: 'datacampus_universities',
  CAREERS: 'datacampus_careers',
  LEADS: 'datacampus_leads',
  BANNERS: 'datacampus_banners',
  USERS: 'datacampus_users',
  TEST_RESULTS: 'datacampus_test_results',
  SETTINGS: 'datacampus_settings'
};

export {
  collection, 
  getDocs, 
  getDoc, 
  doc, 
  addDoc, 
  setDoc, 
  updateDoc, 
  deleteDoc, 
  query, 
  where, 
  orderBy, 
  serverTimestamp,
  writeBatch,
  signInWithEmailAndPassword, 
  signOut, 
  onAuthStateChanged 
};
