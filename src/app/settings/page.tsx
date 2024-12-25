'use client';

import { useAuth } from '@/contexts/AuthContext';
import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Card from '@/components/ui/Card';
import Button from '@/components/ui/Button';
import { updateProfile } from 'firebase/auth';

export default function SettingsPage() {
  const { user, signOut } = useAuth();
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(true);
  const [message, setMessage] = useState<{ type: 'success' | 'error', text: string } | null>(null);
  const [profileData, setProfileData] = useState({
    displayName: '',
    photoURL: '',
  });

  useEffect(() => {
    if (user) {
      setProfileData({
        displayName: user.displayName || '',
        photoURL: user.photoURL || '',
      });
    } else if (!isLoading) {
      router.push('/');
    }
    setIsLoading(false);
  }, [user, router, isLoading]);

  if (isLoading || !user) {
    return null; // Return null while loading or redirecting
  }

  const handleProfileUpdate = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setMessage(null);

    try {
      await updateProfile(user, {
        displayName: profileData.displayName,
        photoURL: profileData.photoURL,
      });
      setMessage({ type: 'success', text: 'Profile updated successfully!' });
    } catch (error) {
      console.error('Error updating profile:', error);
      setMessage({ type: 'error', text: 'Failed to update profile. Please try again.' });
    } finally {
      setIsLoading(false);
    }
  };

  const handleLogout = async () => {
    try {
      await signOut();
      router.push('/');
    } catch (error) {
      console.error('Error signing out:', error);
      setMessage({ type: 'error', text: 'Failed to sign out. Please try again.' });
    }
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-4xl mx-auto space-y-8">
        {/* Header */}
        <div>
          <h1 className="text-2xl font-bold text-white">Settings</h1>
          <p className="mt-2 text-white/70">Manage your account settings and preferences</p>
        </div>

        {message && (
          <div className={`p-4 rounded-lg ${
            message.type === 'success' 
              ? 'bg-green-500/10 border border-green-500/20 text-green-500' 
              : 'bg-red-500/10 border border-red-500/20 text-red-500'
          }`}>
            {message.text}
          </div>
        )}

        {/* Profile Section */}
        <Card className="bg-white/[0.03] border border-white/10">
          <form onSubmit={handleProfileUpdate} className="p-6 space-y-6">
            <div className="space-y-1">
              <h2 className="text-xl font-semibold text-white">Profile Information</h2>
              <p className="text-white/70">Update your profile details</p>
            </div>

            <div className="grid grid-cols-1 gap-6">
              <div>
                <label className="block text-sm font-medium text-white/70 mb-2">Email</label>
                <p className="text-white/90 bg-white/5 px-4 py-2 rounded-lg border border-white/10">
                  {user.email}
                </p>
              </div>

              <div>
                <label htmlFor="displayName" className="block text-sm font-medium text-white/70 mb-2">
                  Display Name
                </label>
                <input
                  type="text"
                  id="displayName"
                  name="displayName"
                  value={profileData.displayName}
                  onChange={(e) => setProfileData(prev => ({ ...prev, displayName: e.target.value }))}
                  className="w-full px-4 py-2 bg-white/5 border border-white/10 rounded-lg text-white placeholder-white/30 focus:outline-none focus:ring-2 focus:ring-primary"
                  placeholder="Enter your display name"
                />
              </div>

              <div>
                <label htmlFor="photoURL" className="block text-sm font-medium text-white/70 mb-2">
                  Profile Picture URL
                </label>
                <input
                  type="url"
                  id="photoURL"
                  name="photoURL"
                  value={profileData.photoURL}
                  onChange={(e) => setProfileData(prev => ({ ...prev, photoURL: e.target.value }))}
                  className="w-full px-4 py-2 bg-white/5 border border-white/10 rounded-lg text-white placeholder-white/30 focus:outline-none focus:ring-2 focus:ring-primary"
                  placeholder="Enter URL for your profile picture"
                />
                {profileData.photoURL && (
                  <div className="mt-4 flex items-center space-x-4">
                    <img
                      src={profileData.photoURL}
                      alt="Profile preview"
                      className="w-16 h-16 rounded-full object-cover ring-2 ring-white/10"
                      onError={(e) => {
                        const img = e.target as HTMLImageElement;
                        img.src = 'https://www.gravatar.com/avatar/00000000000000000000000000000000?d=mp&f=y';
                      }}
                    />
                    <p className="text-sm text-white/50">Profile picture preview</p>
                  </div>
                )}
              </div>

              <div className="pt-4">
                <Button
                  type="submit"
                  disabled={isLoading}
                  variant="primary"
                  className="w-full sm:w-auto flex items-center justify-center space-x-2 px-6 py-2"
                >
                  {isLoading ? (
                    <>
                      <svg className="animate-spin h-5 w-5" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                      </svg>
                      <span>Saving Changes...</span>
                    </>
                  ) : (
                    <>
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                        <path d="M7.707 10.293a1 1 0 10-1.414 1.414l3 3a1 1 0 001.414 0l3-3a1 1 0 00-1.414-1.414L11 11.586V6a1 1 0 10-2 0v5.586l-1.293-1.293z" />
                      </svg>
                      <span>Save Changes</span>
                    </>
                  )}
                </Button>
              </div>
            </div>
          </form>
        </Card>

        {/* Preferences Section */}
        <Card className="bg-white/[0.03] border border-white/10">
          <div className="p-6 space-y-6">
            <div className="space-y-1">
              <h2 className="text-xl font-semibold text-white">Preferences</h2>
              <p className="text-white/70">Customize your experience</p>
            </div>

            <div className="space-y-4">
              <div className="flex items-center justify-between p-4 bg-white/5 rounded-lg border border-white/10">
                <div>
                  <label className="block text-sm font-medium text-white">Email Notifications</label>
                  <p className="text-sm text-white/50">Receive updates about your prompts</p>
                </div>
                <div className="flex items-center">
                  <button
                    type="button"
                    className={`
                      relative inline-flex h-6 w-11 flex-shrink-0 cursor-pointer rounded-full border-2 border-transparent
                      transition-colors duration-200 ease-in-out focus:outline-none focus:ring-2 focus:ring-primary
                      ${true ? 'bg-primary' : 'bg-white/10'}
                    `}
                  >
                    <span className={`
                      pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow ring-0
                      transition duration-200 ease-in-out
                      ${true ? 'translate-x-5' : 'translate-x-0'}
                    `} />
                  </button>
                </div>
              </div>
            </div>
          </div>
        </Card>

        {/* Account Actions */}
        <Card className="bg-white/[0.03] border border-white/10">
          <div className="p-6 space-y-6">
            <div className="space-y-1">
              <h2 className="text-xl font-semibold text-white">Account Actions</h2>
              <p className="text-white/70">Manage your account access</p>
            </div>

            <div className="flex flex-col space-y-4">
              <Button
                onClick={handleLogout}
                variant="secondary"
                className="w-full sm:w-auto bg-red-500/10 hover:bg-red-500/20 text-red-500 border border-red-500/20"
                disabled={isLoading}
              >
                {isLoading ? 'Signing out...' : 'Sign Out'}
              </Button>
              <p className="text-sm text-white/50">
                Warning: Signing out will end your current session
              </p>
            </div>
          </div>
        </Card>
      </div>
    </div>
  );
}
