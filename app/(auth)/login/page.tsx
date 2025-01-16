'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { 
  signInWithEmailAndPassword, 
  signInWithPopup, 
  GoogleAuthProvider,
  getAuth 
} from 'firebase/auth';
import { auth } from '@/lib/firebase';
import { useAuth } from '@/contexts/AuthContext';

export default function LoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();
  const { user } = useAuth();

  useEffect(() => {
    if (user) {
      router.push('/dashboard');
    }
  }, [user, router]);

  if (user === undefined) {
    return <div>Loading...</div>;
  }

  if (user) {
    return null;
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);

    if (!email || !password) {
      setError('Please enter both email and password');
      setIsLoading(false);
      return;
    }

    try {
      // Validate email format
      if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
        throw new Error('Please enter a valid email address');
      }

      // Validate password length
      if (password.length < 6) {
        throw new Error('Password must be at least 6 characters long');
      }

      console.log('Starting authentication...');
      const result = await signInWithEmailAndPassword(auth, email.trim(), password);
      console.log('Authentication successful');

      if (result.user) {
        router.push('/dashboard');
      }
    } catch (err: any) {
      console.error('Login error:', err);
      
      // Handle specific Firebase error codes
      const errorCode = err.code;
      switch (errorCode) {
        case 'auth/invalid-email':
          setError('Invalid email address format');
          break;
        case 'auth/user-disabled':
          setError('This account has been disabled');
          break;
        case 'auth/user-not-found':
          setError('No account found with this email');
          break;
        case 'auth/wrong-password':
          setError('Incorrect password');
          break;
        case 'auth/too-many-requests':
          setError('Too many failed attempts. Please try again later');
          break;
        case 'auth/network-request-failed':
          setError('Network error. Please check your internet connection');
          break;
        case 'auth/internal-error':
          setError('Authentication service error. Please try again');
          console.error('Internal Firebase error:', err);
          break;
        default:
          setError(err.message || 'Failed to login. Please try again');
      }
    } finally {
      setIsLoading(false);
    }
  };

  const handleGoogleSignIn = async () => {
    setError('');
    setIsLoading(true);

    try {
      const provider = new GoogleAuthProvider();
      
      // Basic configuration
      provider.setCustomParameters({
        prompt: 'select_account'
      });

      console.log('Starting Google sign-in...');
      const result = await signInWithPopup(auth, provider);
      console.log('Google sign-in successful:', result.user);

      if (result.user) {
        router.push('/dashboard');
      }
    } catch (err: any) {
      console.error('Google sign-in error:', err);
      
      switch (err.code) {
        case 'auth/popup-closed-by-user':
          setError('Sign-in cancelled. Please try again');
          break;
        case 'auth/popup-blocked':
          setError('Pop-up was blocked. Please allow pop-ups for this site and try again');
          break;
        case 'auth/cancelled-popup-request':
          setError('Another pop-up is already open. Please close it and try again');
          break;
        case 'auth/internal-error':
          setError('Authentication service error. Please try again');
          console.error('Detailed error:', err);
          break;
        case 'auth/network-request-failed':
          setError('Network error. Please check your internet connection');
          break;
        case 'auth/unauthorized-domain':
          setError('This domain is not authorized for Google sign-in');
          console.error('Domain not authorized:', window.location.hostname);
          break;
        default:
          setError(err.message || 'Failed to login with Google');
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-black py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8">
        <div>
          <h2 className="mt-6 text-center text-3xl font-extrabold bg-gradient-to-r from-[#00ffff] to-[#00ffff] bg-clip-text text-transparent">
            Welcome back! Sign in to your account
          </h2>
        </div>
        <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
          <input type="hidden" name="remember" defaultValue="true" />
          <div className="rounded-md shadow-sm -space-y-px">
            <div>
              <label htmlFor="email-address" className="sr-only">
                Email address
              </label>
              <input
                id="email-address"
                name="email"
                type="email"
                autoComplete="email"
                required
                className="appearance-none rounded-none relative block w-full px-3 py-2 bg-black/50 border border-[#00ffff]/20 placeholder-white/50 text-white rounded-t-md focus:outline-none focus:ring-[#00ffff]/50 focus:border-[#00ffff] focus:z-10 sm:text-sm"
                placeholder="Email address"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                disabled={isLoading}
              />
            </div>
            <div>
              <label htmlFor="password" className="sr-only">
                Password
              </label>
              <input
                id="password"
                name="password"
                type="password"
                autoComplete="current-password"
                required
                className="appearance-none rounded-none relative block w-full px-3 py-2 bg-black/50 border border-[#00ffff]/20 placeholder-white/50 text-white rounded-b-md focus:outline-none focus:ring-[#00ffff]/50 focus:border-[#00ffff] focus:z-10 sm:text-sm"
                placeholder="Password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                disabled={isLoading}
              />
            </div>
          </div>

          {error && (
            <div className="text-red-400 text-sm text-center bg-red-400/10 p-2 rounded">
              {error}
            </div>
          )}

          <div className="space-y-4">
            <button
              type="submit"
              disabled={isLoading}
              className="group relative w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-black bg-[#00ffff] hover:bg-[#00ffff]/80 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#00ffff] transition-colors duration-200 shadow-[0_0_15px_rgba(0,255,255,0.5)] disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isLoading ? 'Signing in...' : 'Sign in with Email'}
            </button>

            <button
              type="button"
              onClick={handleGoogleSignIn}
              disabled={isLoading}
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
              {isLoading ? 'Signing in...' : 'Sign in with Google'}
            </button>
          </div>
        </form>
        <div className="text-center">
          <p className="mt-2 text-sm text-white/60">
            Don&apos;t have an account?{' '}
            <a 
              href="/signup" 
              className="font-medium text-[#00ffff] hover:text-[#00ffff]/80 transition-colors"
            >
              Sign up
            </a>
          </p>
        </div>
      </div>
    </div>
  );
}
