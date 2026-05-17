import { createContext, useContext, useState, useEffect } from 'react';
import { Platform } from 'react-native';
import { auth } from '../config/firebase';
import { onAuthStateChanged, signInWithEmailAndPassword, createUserWithEmailAndPassword, signOut, GoogleAuthProvider, signInWithCredential } from 'firebase/auth';
// import { GoogleSignin, statusCodes } from '@react-native-google-signin/google-signin';

const AuthContext = createContext();

// Configure Google Sign-In
// GoogleSignin.configure({
//   webClientId: process.env.EXPO_PUBLIC_GOOGLE_WEB_CLIENT_ID,
//   offlineAccess: true,
// });

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [authReady, setAuthReady] = useState(false);

  useEffect(() => {
    if (!auth) {
      // Mock auth bypass for UI testing if firebase isn't configured
      // setUser({ uid: 'mock-local-user', email: 'test@solace.com' });
      setAuthReady(true);
      return; 
    }
    const unsubscribe = onAuthStateChanged(auth, (authUser) => {
      setUser(authUser);
      setAuthReady(true);
    });
    return () => unsubscribe();
  }, []);

  const login = async (email, password) => {
    if (!auth) throw new Error("Firebase is not connected. Provide .env config!");
    return await signInWithEmailAndPassword(auth, email, password);
  };

  const register = async (email, password) => {
    if (!auth) throw new Error("Firebase is not connected. Provide .env config!");
    return await createUserWithEmailAndPassword(auth, email, password);
  };

  const signInWithGoogle = async () => {
    throw new Error('Google Sign-In is temporarily disabled for Expo Go testing.');
  };

  const logout = async () => {
    if (!auth) return;
    await signOut(auth);
  };

  return (
    <AuthContext.Provider value={{ user, authReady, login, register, signInWithGoogle, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  return useContext(AuthContext);
}
