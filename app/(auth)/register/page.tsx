'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { auth, db } from '@/lib/firebase';
import { createUserWithEmailAndPassword, updateProfile, GoogleAuthProvider, signInWithPopup } from 'firebase/auth';
import { ref, get, set } from 'firebase/database';
import Link from 'next/link';
import { Button } from '@/components/ui/Button';
import { SparklesIcon, CheckIcon } from '@heroicons/react/24/outline';

export default function RegisterPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [tosAgreed, setTosAgreed] = useState(false);
  const router = useRouter();

  useEffect(() => {
    if (typeof window !== 'undefined') {
      window.scrollTo({ top: 0, left: 0, behavior: 'smooth' });
    }
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (!tosAgreed) {
      setError('Please agree to the Terms of Service to continue');
      return;
    }

    if (password.length < 6) {
      setError('Password must be at least 6 characters long');
      return;
    }

    setLoading(true);

    try {
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      const user = userCredential.user;

      await updateProfile(user, { displayName: name });

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
    } catch (err: any) {
      switch (err.code) {
        case 'auth/email-already-in-use':
          setError('This email is already registered. Please sign in instead.');
          break;
        case 'auth/invalid-email':
          setError('Please enter a valid email address.');
          break;
        case 'auth/weak-password':
          setError('Password is too weak. Please use a stronger password.');
          break;
        default:
          setError('Failed to create an account. Please try again.');
      }
    }

    setLoading(false);
  };

  const handleGoogleSignIn = async () => {
    if (!tosAgreed) {
      setError('Please agree to the Terms of Service to continue');
      return;
    }

    setLoading(true);

    try {
      const provider = new GoogleAuthProvider();
      provider.setCustomParameters({ prompt: 'select_account' });
      const result = await signInWithPopup(auth, provider);
      const user = result.user;

      const userRef = ref(db, `users/${user.uid}`);
      const snapshot = await get(userRef);

      if (!snapshot.exists()) {
        await set(userRef, {
          email: user.email,
          name: user.displayName,
          role: 'user',
          plan: 'free',
          createdAt: new Date().toISOString(),
          lastLogin: new Date().toISOString()
        });
      } else {
        await set(ref(db, `users/${user.uid}/lastLogin`), new Date().toISOString());
      }

      router.push('/dashboard');
    } catch (err) {
      setError('Failed to sign in with Google. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-background-base py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="flex justify-center mb-6">
            <div className="w-12 h-12 rounded-xl bg-violet/10 border border-violet/20 flex items-center justify-center">
              <SparklesIcon className="w-6 h-6 text-violet-400" />
            </div>
          </div>
          <h2 className="text-3xl font-medium text-white tracking-tight font-display">
            Create Account
          </h2>
          <p className="mt-2 text-sm text-neutral-500">
            Join our community of prompt creators
          </p>
        </div>

        {/* Card */}
        <div className="glass-panel rounded-2xl p-8">
          {/* Google Sign In */}
          <button
            type="button"
            onClick={handleGoogleSignIn}
            disabled={loading}
            className="w-full flex items-center justify-center gap-3 px-4 py-3 bg-white/5 border border-white/10 rounded-lg text-sm font-medium text-white hover:bg-white/10 hover:border-white/20 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <svg className="w-5 h-5" viewBox="0 0 24 24">
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
            {loading ? 'Signing up...' : 'Continue with Google'}
          </button>

          {/* Divider */}
          <div className="relative my-6">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-white/10" />
            </div>
            <div className="relative flex justify-center text-xs">
              <span className="px-3 bg-background-base text-neutral-500">or continue with email</span>
            </div>
          </div>

          {/* Error Message */}
          {error && (
            <div className={`mb-6 p-3 rounded-lg text-sm text-center ${
              error.includes('Terms')
                ? 'bg-yellow-500/10 border border-yellow-500/20 text-yellow-400'
                : 'bg-red-500/10 border border-red-500/20 text-red-400'
            }`}>
              {error}
            </div>
          )}

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-5">
            <div>
              <label htmlFor="name" className="block text-xs font-medium text-neutral-400 uppercase tracking-wider mb-2">
                Name
              </label>
              <input
                id="name"
                type="text"
                required
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full px-4 py-3 bg-background-base/40 border border-white/10 rounded-lg text-white placeholder-neutral-600 focus:outline-none focus:border-violet/50 focus:ring-1 focus:ring-violet/30 transition-all"
                placeholder="Your display name"
              />
            </div>

            <div>
              <label htmlFor="email" className="block text-xs font-medium text-neutral-400 uppercase tracking-wider mb-2">
                Email
              </label>
              <input
                id="email"
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full px-4 py-3 bg-background-base/40 border border-white/10 rounded-lg text-white placeholder-neutral-600 focus:outline-none focus:border-violet/50 focus:ring-1 focus:ring-violet/30 transition-all"
                placeholder="you@example.com"
              />
            </div>

            <div>
              <label htmlFor="password" className="block text-xs font-medium text-neutral-400 uppercase tracking-wider mb-2">
                Password
              </label>
              <input
                id="password"
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full px-4 py-3 bg-background-base/40 border border-white/10 rounded-lg text-white placeholder-neutral-600 focus:outline-none focus:border-violet/50 focus:ring-1 focus:ring-violet/30 transition-all"
                placeholder="At least 6 characters"
              />
              <p className="mt-1.5 text-xs text-neutral-600">
                Use 6+ characters with numbers and symbols for best security
              </p>
            </div>

            {/* Terms Checkbox */}
            <div className="flex items-start gap-3">
              <div className="relative flex items-center">
                <input
                  id="tos"
                  name="tos"
                  type="checkbox"
                  checked={tosAgreed}
                  onChange={(e) => setTosAgreed(e.target.checked)}
                  className="sr-only"
                />
                <button
                  type="button"
                  onClick={() => setTosAgreed(!tosAgreed)}
                  className={`w-5 h-5 rounded border flex items-center justify-center transition-all ${
                    tosAgreed
                      ? 'bg-violet border-violet'
                      : 'bg-background-base/40 border-white/20 hover:border-white/40'
                  }`}
                >
                  {tosAgreed && <CheckIcon className="w-3 h-3 text-white" />}
                </button>
              </div>
              <label htmlFor="tos" className="text-sm text-neutral-400">
                I agree to the{' '}
                <Link href="/terms" className="text-violet-400 hover:text-violet-400-300 transition-colors" target="_blank">
                  Terms of Service
                </Link>
                {' '}and{' '}
                <Link href="/privacy" className="text-violet-400 hover:text-violet-400-300 transition-colors" target="_blank">
                  Privacy Policy
                </Link>
              </label>
            </div>

            <Button
              type="submit"
              disabled={loading}
              className="w-full"
              size="lg"
            >
              {loading ? 'Creating Account...' : 'Create Account'}
            </Button>
          </form>

          {/* Footer */}
          <p className="mt-6 text-center text-sm text-neutral-500">
            Already have an account?{' '}
            <Link href="/login" className="text-violet-400 hover:text-violet-400-300 transition-colors">
              Sign in
            </Link>
          </p>
        </div>

        {/* Benefits */}
        <div className="mt-8 grid grid-cols-3 gap-4 text-center">
          <div className="text-neutral-600">
            <p className="text-xs uppercase tracking-wider mb-1">Free</p>
            <p className="text-[10px] text-neutral-700">to get started</p>
          </div>
          <div className="text-neutral-600">
            <p className="text-xs uppercase tracking-wider mb-1">1000+</p>
            <p className="text-[10px] text-neutral-700">prompts available</p>
          </div>
          <div className="text-neutral-600">
            <p className="text-xs uppercase tracking-wider mb-1">AI</p>
            <p className="text-[10px] text-neutral-700">coaching included</p>
          </div>
        </div>
      </div>
    </div>
  );
}
