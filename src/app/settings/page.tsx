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
          <h1 className="text-3xl font-bold">Settings</h1>
          <p className="mt-1 text-text-muted">
            Manage your account settings and preferences
          </p>
        </div>

        {message && (
          <div className={`p-4 rounded-md ${
            message.type === 'success' ? 'bg-green-50 text-green-800' : 'bg-red-50 text-red-800'
          }`}>
            {message.text}
          </div>
        )}

        {/* Profile Section */}
        <Card>
          <form onSubmit={handleProfileUpdate} className="p-6 space-y-6">
            <div className="space-y-1">
              <h2 className="text-xl font-semibold">Profile Information</h2>
              <p className="text-text-muted">Update your profile details</p>
            </div>

            <div className="grid grid-cols-1 gap-6">
              <div>
                <label className="block text-sm font-medium mb-1">Email</label>
                <p className="text-text-muted">{user.email}</p>
              </div>

              <div>
                <label htmlFor="displayName" className="block text-sm font-medium mb-1">
                  Display Name
                </label>
                <input
                  type="text"
                  id="displayName"
                  name="displayName"
                  value={profileData.displayName}
                  onChange={(e) => setProfileData(prev => ({ ...prev, displayName: e.target.value }))}
                  className="w-full px-3 py-2 bg-white text-black rounded-md border border-border focus:outline-none focus:ring-2 focus:ring-primary-accent"
                  placeholder="Enter your display name"
                />
              </div>

              <div>
                <label htmlFor="photoURL" className="block text-sm font-medium mb-1">
                  Profile Picture URL
                </label>
                <input
                  type="url"
                  id="photoURL"
                  name="photoURL"
                  value={profileData.photoURL}
                  onChange={(e) => setProfileData(prev => ({ ...prev, photoURL: e.target.value }))}
                  className="w-full px-3 py-2 bg-white text-black rounded-md border border-border focus:outline-none focus:ring-2 focus:ring-primary-accent"
                  placeholder="Enter URL for your profile picture"
                />
                {profileData.photoURL && (
                  <div className="mt-2">
                    <img
                      src={profileData.photoURL}
                      alt="Profile preview"
                      className="w-16 h-16 rounded-full object-cover"
                      onError={(e) => {
                        const img = e.target as HTMLImageElement;
                        img.src = 'https://www.gravatar.com/avatar/00000000000000000000000000000000?d=mp&f=y';
                      }}
                    />
                  </div>
                )}
              </div>

              <div className="pt-4">
                <Button
                  type="submit"
                  disabled={isLoading}
                  className="w-full sm:w-auto"
                >
                  {isLoading ? 'Saving...' : 'Save Changes'}
                </Button>
              </div>
            </div>
          </form>
        </Card>

        {/* Preferences Section */}
        <Card>
          <div className="p-6 space-y-6">
            <div className="space-y-1">
              <h2 className="text-xl font-semibold">Preferences</h2>
              <p className="text-text-muted">Customize your experience</p>
            </div>

            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <label className="block text-sm font-medium">Email Notifications</label>
                  <p className="text-text-muted text-sm">Receive updates about your prompts</p>
                </div>
                <div className="flex items-center">
                  <button
                    type="button"
                    className={`
                      relative inline-flex h-6 w-11 flex-shrink-0 cursor-pointer rounded-full border-2 border-transparent
                      transition-colors duration-200 ease-in-out focus:outline-none focus:ring-2 focus:ring-primary-accent
                      ${true ? 'bg-primary-accent' : 'bg-gray-200'}
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
        <Card>
          <div className="p-6 space-y-6">
            <div className="space-y-1">
              <h2 className="text-xl font-semibold">Account Actions</h2>
              <p className="text-text-muted">Manage your account access</p>
            </div>

            <div className="space-y-4">
              <Button
                onClick={handleLogout}
                variant="destructive"
                className="w-full sm:w-auto"
                disabled={isLoading}
              >
                {isLoading ? 'Signing out...' : 'Sign Out'}
              </Button>
            </div>
          </div>
        </Card>
      </div>
    </div>
  );
}
