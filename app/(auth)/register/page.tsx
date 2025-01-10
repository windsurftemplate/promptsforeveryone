'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { auth, db } from '@/lib/firebase';
import { createUserWithEmailAndPassword, updateProfile, GoogleAuthProvider, signInWithPopup } from 'firebase/auth';
import { ref, get, set } from 'firebase/database';
import Link from 'next/link';
import { Button } from '@/components/ui/Button';

export default function RegisterPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [tosAgreed, setTosAgreed] = useState(false);
  const router = useRouter();

  useEffect(() => {
    // Scroll to top on component mount
    if (typeof window !== 'undefined') {
      window.scrollTo({
        top: 0,
        left: 0,
        behavior: 'smooth'
      });
    }
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (!tosAgreed) {
      setError('You must agree to the Terms of Service to create an account');
      return;
    }

    setLoading(true);

    try {
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      const user = userCredential.user;
      
      // Update user profile with name
      await updateProfile(user, { displayName: name });

      // Save user data to Firebase Realtime Database
      const userRef = ref(db, `users/${user.uid}`);
      await set(userRef, {
        email: user.email,
        name: name,
        role: 'user',
        plan: 'free',
        createdAt: new Date().toISOString(),
        lastLogin: new Date().toISOString()
      });

      router.push('/dashboard');
    } catch (err) {
      setError('Failed to create an account. Please try again.');
      console.error(err);
    }

    setLoading(false);
  };

  const handleGoogleSignIn = async () => {
    if (!tosAgreed) {
      setError('You must agree to the Terms of Service to create an account');
      return;
    }

    setLoading(true);

    try {
      const provider = new GoogleAuthProvider();
      provider.setCustomParameters({
        prompt: 'select_account'
      });
      const result = await signInWithPopup(auth, provider);
      const user = result.user;

      // Check if user already exists in database
      const userRef = ref(db, `users/${user.uid}`);
      const snapshot = await get(userRef);

      if (!snapshot.exists()) {
        // Create new user document in database
        await set(userRef, {
          email: user.email,
          name: user.displayName,
          role: 'user',
          plan: 'free',
          createdAt: new Date().toISOString(),
          lastLogin: new Date().toISOString()
        });
      } else {
        // Update last login time
        await set(ref(db, `users/${user.uid}/lastLogin`), new Date().toISOString());
      }

      router.push('/dashboard');
    } catch (err) {
      setError('Failed to sign in with Google. Please try again.');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-black flex items-center justify-center px-4">
      <div className="max-w-md w-full space-y-8">
        <div className="text-center">
          <h2 className="text-4xl font-bold bg-gradient-to-r from-[#00ffff] to-[#00ffff] bg-clip-text text-transparent">
            Create Account
          </h2>
          <p className="mt-2 text-white/60">
            Join our community of prompt engineers
          </p>
        </div>

        <div className="bg-black/50 border border-[#00ffff]/20 rounded-lg p-8 shadow-lg backdrop-blur-sm">
          <button
            type="button"
            onClick={handleGoogleSignIn}
            disabled={loading}
            className="group relative w-full flex justify-center py-2 px-4 border border-[#00ffff]/20 text-sm font-medium rounded-md text-white bg-black/50 hover:bg-[#00ffff]/10 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#00ffff] transition-colors duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <svg className="w-5 h-5 mr-2" viewBox="0 0 24 24">
              <path
                fill="#4285F4"
                d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
              />
              <path
                fill="#34A853"
                d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
              />
              <path
                fill="#FBBC05"
                d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
              />
              <path
                fill="#EA4335"
                d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
              />
            </svg>
            {loading ? 'Signing in...' : 'Continue with Google'}
          </button>

          <div className="relative my-6">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-[#00ffff]/20"></div>
            </div>
            <div className="relative flex justify-center text-sm">
              <span className="px-2 bg-black text-white/60">Or continue with email</span>
            </div>
          </div>

          {error && (
            <div className="mb-4 p-3 rounded bg-red-500/10 border border-red-500/20 text-red-500">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label htmlFor="name" className="block text-sm font-medium text-white/80 mb-1">
                Name
              </label>
              <input
                id="name"
                type="text"
                required
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full px-3 py-2 bg-black/50 border border-[#00ffff]/20 rounded-md text-white placeholder-white/40 focus:outline-none focus:ring-2 focus:ring-[#00ffff]/50 focus:border-transparent"
                placeholder="Enter your name"
              />
            </div>

            <div>
              <label htmlFor="email" className="block text-sm font-medium text-white/80 mb-1">
                Email
              </label>
              <input
                id="email"
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full px-3 py-2 bg-black/50 border border-[#00ffff]/20 rounded-md text-white placeholder-white/40 focus:outline-none focus:ring-2 focus:ring-[#00ffff]/50 focus:border-transparent"
                placeholder="Enter your email"
              />
            </div>

            <div>
              <label htmlFor="password" className="block text-sm font-medium text-white/80 mb-1">
                Password
              </label>
              <input
                id="password"
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full px-3 py-2 bg-black/50 border border-[#00ffff]/20 rounded-md text-white placeholder-white/40 focus:outline-none focus:ring-2 focus:ring-[#00ffff]/50 focus:border-transparent"
                placeholder="Create a password"
              />
            </div>

            <div className="flex items-start">
              <div className="flex items-center h-5">
                <input
                  id="tos"
                  name="tos"
                  type="checkbox"
                  checked={tosAgreed}
                  onChange={(e) => setTosAgreed(e.target.checked)}
                  className="h-4 w-4 rounded border-[#00ffff]/20 bg-black/50 text-[#00ffff] focus:ring-[#00ffff]/50"
                />
              </div>
              <div className="ml-3">
                <label htmlFor="tos" className="text-sm text-white/80">
                  I agree to the{' '}
                  <Link href="/terms" className="text-[#00ffff] hover:text-[#00ffff]/80" target="_blank">
                    Terms of Service
                  </Link>
                </label>
              </div>
            </div>

            <Button
              type="submit"
              disabled={loading || !tosAgreed}
              className="w-full bg-[#00ffff] hover:bg-[#00ffff]/80 text-black font-bold py-3 rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? 'Creating Account...' : 'Create Account'}
            </Button>
          </form>

          <p className="mt-4 text-center text-white/60">
            Already have an account?{' '}
            <Link href="/login" className="text-[#00ffff] hover:text-[#00ffff]/80">
              Sign in
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
