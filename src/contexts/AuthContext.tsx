'use client';

import React, { createContext, useContext, useEffect, useState, ReactNode } from 'react';
import { auth, db } from '@/lib/firebase';
import { 
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  signOut,
  onAuthStateChanged,
  GoogleAuthProvider,
  signInWithPopup,
  User as FirebaseUser
} from 'firebase/auth';
import { ref, get, set } from 'firebase/database';

interface User extends FirebaseUser {
  role?: string;
  isPro?: boolean;
}

interface AuthContextType {
  user: User | null;
  login: (email: string, password: string) => Promise<void>;
  signup: (email: string, password: string) => Promise<void>;
  signInWithGoogle: () => Promise<void>;
  signOut: () => Promise<void>;
  loading: boolean;
  error: string | null;
  isPro: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}

interface AuthProviderProps {
  children: ReactNode;
}

export function AuthProvider({ children }: AuthProviderProps) {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isPro, setIsPro] = useState(false);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (firebaseUser) => {
      if (firebaseUser) {
        // Get additional user data from the database
        const userRef = ref(db, `users/${firebaseUser.uid}`);
        const snapshot = await get(userRef);
        const userData = snapshot.val();
        
        // Combine Firebase user with additional data
        const enhancedUser = {
          ...firebaseUser,
          role: userData?.role || 'user'
        } as User;
        
        setUser(enhancedUser);
        setIsPro(userData?.plan === 'pro' || userData?.role === 'admin');
      } else {
        setUser(null);
        setIsPro(false);
      }
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  const signup = async (email: string, password: string) => {
    try {
      setError(null);
      const { user: newUser } = await createUserWithEmailAndPassword(auth, email, password);
      
      // Create user document in the database
      const userRef = ref(db, `users/${newUser.uid}`);
      await set(userRef, {
        email: newUser.email,
        role: 'user',
        plan: 'free',
        createdAt: new Date().toISOString(),
        lastLogin: new Date().toISOString()
      });
    } catch (err: any) {
      setError(err.message || 'Failed to sign up');
      throw err;
    }
  };

  const login = async (email: string, password: string) => {
    try {
      setError(null);
      const { user: signedInUser } = await signInWithEmailAndPassword(auth, email, password);
      
      // Update last login time
      const userRef = ref(db, `users/${signedInUser.uid}/lastLogin`);
      await set(userRef, new Date().toISOString());
    } catch (err: any) {
      setError(err.message || 'Failed to sign in');
      throw err;
    }
  };

  const signInWithGoogle = async () => {
    try {
      setError(null);
      const provider = new GoogleAuthProvider();
      const { user: googleUser } = await signInWithPopup(auth, provider);

      // Create or update user document
      const userRef = ref(db, `users/${googleUser.uid}`);
      const snapshot = await get(userRef);
      
      if (!snapshot.exists()) {
        await set(userRef, {
          email: googleUser.email,
          role: 'user',
          plan: 'free',
          createdAt: new Date().toISOString(),
          lastLogin: new Date().toISOString()
        });
      } else {
        await set(ref(db, `users/${googleUser.uid}/lastLogin`), new Date().toISOString());
      }
    } catch (err: any) {
      setError(err.message || 'Failed to sign in with Google');
      throw err;
    }
  };

  const value = {
    user,
    login,
    signup,
    signInWithGoogle,
    signOut: () => signOut(auth),
    loading,
    error,
    isPro
  };

  return (
    <AuthContext.Provider value={value}>
      {!loading && children}
    </AuthContext.Provider>
  );
}