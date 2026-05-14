import React, { createContext, useContext, useEffect, useState } from 'react';
import { onAuthStateChanged, User, GoogleAuthProvider, signInWithPopup, signInWithRedirect, getRedirectResult, signOut, signInWithCredential } from 'firebase/auth';
import { auth, db, handleFirestoreError, OperationType } from '../lib/firebase';
import { doc, getDoc } from 'firebase/firestore';
import { UserProfile } from '../types';
import { GoogleSignIn } from '@capawesome/capacitor-google-sign-in';
import { Capacitor } from '@capacitor/core';

interface AuthContextType {
  user: User | null;
  profile: UserProfile | null;
  loading: boolean;
  signInWithGoogle: () => Promise<void>;
  logout: () => Promise<void>;
  refreshProfile: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(true);

  const refreshProfile = async () => {
    if (!auth.currentUser) return;
    const profileDoc = doc(db, 'users', auth.currentUser.uid, 'profile', 'data');
    try {
      const snap = await getDoc(profileDoc);
      if (snap.exists()) {
        setProfile(snap.data() as UserProfile);
      } else {
        setProfile(null);
      }
    } catch (err) {
      handleFirestoreError(err, OperationType.GET, `users/${auth.currentUser.uid}/profile/data`);
    }
  };

  useEffect(() => {
    // Initialize Google Auth
    if (Capacitor.isNativePlatform()) {
      GoogleSignIn.initialize({
        clientId: '252561332006-rv546ijg5ubupaa84qlt0sdu8auitmo8.apps.googleusercontent.com',
      });
    }

    // Handle redirect result
    const handleRedirect = async () => {
      if (Capacitor.isNativePlatform()) return; // Native doesn't use redirects

      try {
        const result = await getRedirectResult(auth);
        if (result?.user) {
          await refreshProfile();
        }
      } catch (err: any) {
        console.error('Redirect Sign-in Error:', err);
      }
    };
    handleRedirect();

    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      setUser(user);
      if (user) {
        await refreshProfile();
      } else {
        setProfile(null);
      }
      setLoading(false);
    });
    return unsubscribe;
  }, []);

  const signInWithGoogle = async () => {
    if (loading) return;

    try {
      if (Capacitor.isNativePlatform()) {
        // Native Google Login
        const googleUser = await GoogleSignIn.signIn();
        const credential = GoogleAuthProvider.credential(googleUser.idToken);
        await signInWithCredential(auth, credential);
      } else {
        // Web Google Login
        const provider = new GoogleAuthProvider();
        const isMobile = /iPhone|iPad|iPod|Android/i.test(navigator.userAgent);

        if (isMobile) {
          await signInWithRedirect(auth, provider);
        } else {
          await signInWithPopup(auth, provider);
        }
      }
    } catch (err: any) {
      if (err.code === 'auth/cancelled-popup-request' || err.code === 'auth/popup-closed-by-user') {
        console.log('Login cancelled by user.');
      } else {
        console.error('Authentication Error:', err);
      }
    }
  };

  const logout = async () => {
    if (Capacitor.isNativePlatform()) {
      await GoogleSignIn.signOut();
    }
    await signOut(auth);
  };

  return (
    <AuthContext.Provider value={{ user, profile, loading, signInWithGoogle, logout, refreshProfile }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
