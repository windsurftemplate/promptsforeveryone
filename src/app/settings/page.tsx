'use client';

import { useState, useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { db } from '@/lib/firebase';
import { ref, get, update } from 'firebase/database';
import Card from '@/components/ui/Card';
import Button from '@/components/ui/Button';
import { redirectToCheckout } from '@/lib/stripe';

export default function SettingsPage() {
  const { user } = useAuth();
  const [loading, setLoading] = useState(true);
  const [isPro, setIsPro] = useState(false);
  const [subscriptionStatus, setSubscriptionStatus] = useState<string>('');
  const [error, setError] = useState<string | null>(null);
  const [isEditing, setIsEditing] = useState(false);
  const [editedProfile, setEditedProfile] = useState({
    displayName: '',
    bio: '',
    website: '',
    twitter: '',
    github: ''
  });
  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    const loadUserData = async () => {
      if (!user?.uid) return;

      try {
        const userRef = ref(db, `users/${user.uid}`);
        const snapshot = await get(userRef);
        const userData = snapshot.val();
        
        setIsPro(userData?.plan === 'pro');
        setSubscriptionStatus(userData?.subscriptionStatus || 'free');
        
        setEditedProfile({
          displayName: userData?.displayName || user.displayName || '',
          bio: userData?.bio || '',
          website: userData?.website || '',
          twitter: userData?.twitter || '',
          github: userData?.github || ''
        });
      } catch (error) {
        console.error('Error loading user data:', error);
        setError('Failed to load user data');
      } finally {
        setLoading(false);
      }
    };

    loadUserData();
  }, [user?.uid, user?.displayName]);

  const handleUpgradeClick = async () => {
    if (!user) {
      setError('You must be logged in to upgrade');
      return;
    }

    try {
      const priceId = process.env.NEXT_PUBLIC_STRIPE_PRICE_MONTHLY_ID;
      if (!priceId) {
        setError('Configuration error: Price ID is missing');
        return;
      }
      await redirectToCheckout(priceId, user.uid);
    } catch (error) {
      console.error('Error redirecting to checkout:', error);
      setError('Failed to start checkout process');
    }
  };

  const handleCancelSubscription = async () => {
    setError('Please contact support to cancel your subscription');
  };

  const handleSaveProfile = async () => {
    if (!user?.uid) return;

    setIsSaving(true);
    try {
      const userRef = ref(db, `users/${user.uid}`);
      await update(userRef, {
        ...editedProfile,
        updatedAt: new Date().toISOString()
      });
      setIsEditing(false);
      setError(null);
    } catch (error) {
      console.error('Error saving profile:', error);
      setError('Failed to save profile changes');
    } finally {
      setIsSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-[200px]">
        <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-[#00ffff]"></div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8 max-w-4xl">
      <h1 className="text-3xl font-bold mb-8 bg-gradient-to-r from-[#00ffff] to-[#00ffff] bg-clip-text text-transparent">Settings</h1>

      <div className="grid gap-6">
        {/* Account Section */}
        <Card className="p-6 bg-black/50 backdrop-blur-lg border border-[#00ffff]/20 hover:border-[#00ffff]/40 transition-all duration-300">
          <div className="flex justify-between items-start mb-6">
            <h2 className="text-xl font-semibold text-[#00ffff]">Account</h2>
            {!isEditing && (
              <Button variant="ghost" onClick={() => setIsEditing(true)} 
                      className="text-white hover:bg-[#00ffff]/10 transition-colors">
                Edit Profile
              </Button>
            )}
          </div>
          
          {error && (
            <div className="bg-red-500/10 border border-red-500/20 text-red-400 rounded-lg p-3 text-sm mb-4">
              {error}
            </div>
          )}

          {isEditing ? (
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-white/80 mb-1">Display Name</label>
                <input
                  type="text"
                  value={editedProfile.displayName}
                  onChange={(e) => setEditedProfile(prev => ({ ...prev, displayName: e.target.value }))}
                  className="w-full px-3 py-2 bg-black/50 border border-[#00ffff]/20 rounded-lg focus:outline-none focus:ring-[#00ffff]/50 focus:border-[#00ffff] text-white placeholder-white/50"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-white/80 mb-1">Bio</label>
                <textarea
                  value={editedProfile.bio}
                  onChange={(e) => setEditedProfile(prev => ({ ...prev, bio: e.target.value }))}
                  rows={3}
                  className="w-full px-3 py-2 bg-black/50 border border-[#00ffff]/20 rounded-lg focus:outline-none focus:ring-[#00ffff]/50 focus:border-[#00ffff] text-white placeholder-white/50"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-white/80 mb-1">Website</label>
                <input
                  type="url"
                  value={editedProfile.website}
                  onChange={(e) => setEditedProfile(prev => ({ ...prev, website: e.target.value }))}
                  className="w-full px-3 py-2 bg-black/50 border border-[#00ffff]/20 rounded-lg focus:outline-none focus:ring-[#00ffff]/50 focus:border-[#00ffff] text-white placeholder-white/50"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-white/80 mb-1">Twitter</label>
                <input
                  type="text"
                  value={editedProfile.twitter}
                  onChange={(e) => setEditedProfile(prev => ({ ...prev, twitter: e.target.value }))}
                  className="w-full px-3 py-2 bg-black/50 border border-[#00ffff]/20 rounded-lg focus:outline-none focus:ring-[#00ffff]/50 focus:border-[#00ffff] text-white placeholder-white/50"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-white/80 mb-1">GitHub</label>
                <input
                  type="text"
                  value={editedProfile.github}
                  onChange={(e) => setEditedProfile(prev => ({ ...prev, github: e.target.value }))}
                  className="w-full px-3 py-2 bg-black/50 border border-[#00ffff]/20 rounded-lg focus:outline-none focus:ring-[#00ffff]/50 focus:border-[#00ffff] text-white placeholder-white/50"
                />
              </div>
              <div className="flex justify-end space-x-3 pt-4">
                <Button variant="ghost" onClick={() => setIsEditing(false)}
                        className="text-white hover:bg-[#00ffff]/10 transition-colors">
                  Cancel
                </Button>
                <Button onClick={handleSaveProfile} disabled={isSaving}
                        className="bg-[#00ffff] hover:bg-[#00ffff]/80 text-black font-bold transition-colors shadow-[0_0_15px_rgba(0,255,255,0.5)]">
                  {isSaving ? 'Saving...' : 'Save Changes'}
                </Button>
              </div>
            </div>
          ) : (
            <div className="space-y-4">
              <div>
                <h3 className="font-medium text-white/80 mb-1">Email</h3>
                <p className="text-white">{user?.email}</p>
              </div>
              <div>
                <h3 className="font-medium text-white/80 mb-1">Display Name</h3>
                <p className="text-white">{editedProfile.displayName || 'Not set'}</p>
              </div>
              {editedProfile.bio && (
                <div>
                  <h3 className="font-medium text-white/80 mb-1">Bio</h3>
                  <p className="text-white">{editedProfile.bio}</p>
                </div>
              )}
              {editedProfile.website && (
                <div>
                  <h3 className="font-medium text-white/80 mb-1">Website</h3>
                  <a href={editedProfile.website} target="_blank" rel="noopener noreferrer" 
                     className="text-[#00ffff] hover:text-[#00ffff]/80 transition-colors">
                    {editedProfile.website}
                  </a>
                </div>
              )}
              {editedProfile.twitter && (
                <div>
                  <h3 className="font-medium text-white/80 mb-1">Twitter</h3>
                  <a href={`https://twitter.com/${editedProfile.twitter}`} target="_blank" rel="noopener noreferrer"
                     className="text-[#00ffff] hover:text-[#00ffff]/80 transition-colors">
                    @{editedProfile.twitter}
                  </a>
                </div>
              )}
              {editedProfile.github && (
                <div>
                  <h3 className="font-medium text-white/80 mb-1">GitHub</h3>
                  <a href={`https://github.com/${editedProfile.github}`} target="_blank" rel="noopener noreferrer"
                     className="text-[#00ffff] hover:text-[#00ffff]/80 transition-colors">
                    {editedProfile.github}
                  </a>
                </div>
              )}
            </div>
          )}
        </Card>

        {/* Subscription Section */}
        <Card className="p-6 bg-black/50 backdrop-blur-lg border border-[#00ffff]/20 hover:border-[#00ffff]/40 transition-all duration-300">
          <h2 className="text-xl font-semibold mb-4 text-[#00ffff]">Subscription</h2>
          
          <div className="space-y-4">
            <div className="flex justify-between items-center pb-4 border-b border-[#00ffff]/20">
              <div>
                <h3 className="font-medium text-white">Current Plan</h3>
                <p className="text-white/70 text-sm">
                  {isPro ? 'Pro Plan' : 'Free Plan'}
                </p>
              </div>
              <div>
                <p className="text-sm text-white/70">
                  Status: <span className="capitalize">{subscriptionStatus}</span>
                </p>
              </div>
            </div>

            <div className="flex justify-end">
              {isPro ? (
                <Button onClick={handleCancelSubscription}
                        className="bg-red-500/10 hover:bg-red-500/20 text-red-400 border border-red-500/20 transition-colors">
                  Cancel Subscription
                </Button>
              ) : (
                <Button onClick={handleUpgradeClick}
                        className="bg-[#00ffff] hover:bg-[#00ffff]/80 text-black font-bold transition-colors shadow-[0_0_15px_rgba(0,255,255,0.5)]">
                  Upgrade to Pro
                </Button>
              )}
            </div>
          </div>
        </Card>

        {/* Preferences Section */}
        <Card className="p-6 bg-[#0f172a]/80 backdrop-blur-lg border border-[#2563eb]/20">
          <h2 className="text-xl font-semibold mb-4 text-white">Preferences</h2>
          <div className="space-y-4">
            <div>
              <label className="flex items-center space-x-2 text-white cursor-pointer">
                <input
                  type="checkbox"
                  className="form-checkbox rounded border-[#2563eb]/20 text-[#2563eb] focus:ring-[#2563eb] bg-[#1e293b]"
                />
                <span>Email notifications for new features</span>
              </label>
            </div>
            <div>
              <label className="flex items-center space-x-2 text-white cursor-pointer">
                <input
                  type="checkbox"
                  className="form-checkbox rounded border-[#2563eb]/20 text-[#2563eb] focus:ring-[#2563eb] bg-[#1e293b]"
                />
                <span>Email notifications for prompt interactions</span>
              </label>
            </div>
          </div>
        </Card>

        {/* Danger Zone */}
        <Card className="p-6 bg-[#0f172a]/80 backdrop-blur-lg border border-red-500/20">
          <h2 className="text-xl font-semibold mb-4 text-red-500">Danger Zone</h2>
          <div className="space-y-4">
            <p className="text-sm text-white/70">
              Once you delete your account, there is no going back. Please be certain.
            </p>
            <Button variant="ghost" 
                    className="bg-red-500/10 hover:bg-red-500/20 text-red-500 border border-red-500/20">
              Delete Account
            </Button>
          </div>
        </Card>
      </div>
    </div>
  );
}
