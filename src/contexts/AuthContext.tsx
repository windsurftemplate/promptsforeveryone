'use client';

import { createContext, useContext, useEffect, useState } from 'react';
import { 
  onAuthStateChanged,
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut as firebaseSignOut,
  GoogleAuthProvider,
  signInWithPopup,
  getRedirectResult,
  User
} from 'firebase/auth';
import { useRouter } from 'next/navigation';
import { auth, db } from '@/lib/firebase';
import { ref, get, set } from 'firebase/database';

type AuthContextType = {
  user: User | null;
  loading: boolean;
  signIn: (email: string, password: string) => Promise<void>;
  signUp: (email: string, password: string) => Promise<void>;
  signOut: () => Promise<void>;
  signInWithGoogle: () => Promise<void>;
  error: string | null;
};

const AuthContext = createContext<AuthContextType | null>(null);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      setUser(user);
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  const signIn = async (email: string, password: string) => {
    try {
      setError(null);
      const userCredential = await signInWithEmailAndPassword(auth, email, password);
      
      // Check user role and redirect accordingly
      const userRef = ref(db, `users/${userCredential.user.uid}`);
      const snapshot = await get(userRef);
      const userData = snapshot.val();
      
      router.push('/dashboard');
    } catch (err: any) {
      setError(err.message || 'Failed to sign in');
    }
  };

  const signUp = async (email: string, password: string) => {
    try {
      setError(null);
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      
      // Create user profile in database
      await set(ref(db, `users/${userCredential.user.uid}`), {
        email,
        role: 'user',
        createdAt: new Date().toISOString()
      });
      
      router.push('/dashboard');
    } catch (err: any) {
      setError(err.message || 'Failed to create account');
    }
  };

  const signInWithGoogle = async () => {
    try {
      setError(null);
      console.log('Starting Google sign-in...');
      const provider = new GoogleAuthProvider();
      provider.addScope('https://www.googleapis.com/auth/userinfo.email');
      provider.addScope('https://www.googleapis.com/auth/userinfo.profile');
      
      console.log('Initiating popup...');
      const result = await signInWithPopup(auth, provider);
      console.log('Sign-in successful:', result.user?.email);
      
      if (result.user) {
        const userRef = ref(db, `users/${result.user.uid}`);
        console.log('Checking if user exists...');
        const snapshot = await get(userRef);
        
        if (!snapshot.exists()) {
          console.log('Creating new user profile...');
          await set(userRef, {
            email: result.user.email,
            displayName: result.user.displayName,
            photoURL: result.user.photoURL,
            role: 'user',
            createdAt: new Date().toISOString()
          });
        }
        console.log('Redirecting to dashboard...');
        router.push('/dashboard');
      }
    } catch (err: any) {
      console.error('Google sign-in error:', err);
      console.error('Error code:', err.code);
      console.error('Error message:', err.message);
      if (err.code === 'auth/popup-closed-by-user') {
        setError('Sign-in was cancelled');
      } else if (err.code === 'auth/popup-blocked') {
        setError('Sign-in popup was blocked. Please allow popups for this site.');
      } else if (err.code === 'auth/unauthorized-domain') {
        setError('This domain is not authorized for Google sign-in. Please check Firebase Console settings.');
      } else {
        setError(err.message || 'Failed to sign in with Google');
      }
    }
  };

  const signOut = async () => {
    try {
      setError(null);
      await firebaseSignOut(auth);
      router.push('/');
    } catch (err: any) {
      setError(err.message || 'Failed to sign out');
    }
  };

  const value = {
    user,
    loading,
    signIn,
    signUp,
    signOut,
    signInWithGoogle,
    error
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-indigo-600"></div>
      </div>
    );
  }

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}