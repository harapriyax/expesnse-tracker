import { Platform } from 'react-native';
import { initializeApp, getApp, getApps } from 'firebase/app';
import { getFirestore } from 'firebase/firestore';
import { initializeAuth, getAuth, getReactNativePersistence } from 'firebase/auth';
import AsyncStorage from '@react-native-async-storage/async-storage';

const firebaseConfig = {
  apiKey: process.env.EXPO_PUBLIC_FIREBASE_API_KEY,
  authDomain: process.env.EXPO_PUBLIC_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.EXPO_PUBLIC_FIREBASE_PROJECT_ID,
  storageBucket: process.env.EXPO_PUBLIC_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.EXPO_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.EXPO_PUBLIC_FIREBASE_APP_ID,
};

// Initialize Firebase securely (avoiding hot reload crashes)
let app;
let authInstance = null;

if (getApps().length === 0) {
  if (firebaseConfig.apiKey) {
    app = initializeApp(firebaseConfig);
    if (Platform.OS === 'web') {
      authInstance = getAuth(app);
      console.log("🔥 Firebase initialized for Web client.");
    } else {
      authInstance = initializeAuth(app, {
        persistence: getReactNativePersistence(AsyncStorage)
      });
      console.log("🔥 Firebase natively initialized on client.");
    }
  } else {
    console.warn("⚠️ DEVELOPMENT MODE: Firebase keys missing in .env. Waiting for configs...");
  }
} else {
  app = getApp();
  authInstance = getAuth(app);
}

export const db = app ? getFirestore(app) : null;
export const auth = authInstance;
