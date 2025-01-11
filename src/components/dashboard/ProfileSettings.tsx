import React, { useState, useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { db } from '@/lib/firebase';
import { ref, get, update } from 'firebase/database';
import { Button } from '@/components/ui/Button';
import Link from 'next/link';

interface UserSettings {
  emailNotifications: boolean;
  timezone: string;
}

interface SubscriptionDetails {
  plan: string;
  status: string;
  nextBillingDate?: string;
  cancelAtPeriodEnd?: boolean;
}

export default function ProfileSettings() {
  const { user } = useAuth();
  const [isEditing, setIsEditing] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [error, setError] = useState('');
  const [successMessage, setSuccessMessage] = useState('');
  const [displayName, setDisplayName] = useState('');
  const [email, setEmail] = useState('');
  const [plan, setPlan] = useState('free');
  const [role, setRole] = useState('user');
  const [userData, setUserData] = useState<any>(null);
  
  // New state for user settings
  const [settings, setSettings] = useState<UserSettings>({
    emailNotifications: true,
    timezone: Intl.DateTimeFormat().resolvedOptions().timeZone
  });

  // New state for subscription details
  const [subscription, setSubscription] = useState<SubscriptionDetails>({
    plan: 'free',
    status: 'active'
  });

  useEffect(() => {
    const fetchUserProfile = async () => {
      if (!user) return;

      try {
        const userRef = ref(db, `users/${user.uid}`);
        const snapshot = await get(userRef);
        if (snapshot.exists()) {
          const userData = snapshot.val();
          setUserData(userData);
          console.log('Firebase User Data:', userData);
          console.log('Plan:', userData.plan);
          console.log('Stripe Status:', userData.stripeSubscriptionStatus);
          
          setDisplayName(userData.name || user.displayName || '');
          setEmail(user.email || '');
          setPlan(userData.plan || 'free');
          setRole(userData.role || 'user');
          
          // Load user settings
          setSettings({
            emailNotifications: userData.settings?.emailNotifications ?? true,
            timezone: userData.settings?.timezone ?? Intl.DateTimeFormat().resolvedOptions().timeZone
          });

          // Load subscription details
          const subscriptionData = {
            plan: userData.stripeSubscriptionStatus === 'active' ? 'paid' : 'free',
            status: userData.stripeSubscriptionStatus || 'inactive',
            nextBillingDate: userData.stripeCurrentPeriodEnd,
            cancelAtPeriodEnd: userData.stripeCancelAtPeriodEnd
          };
          console.log('Subscription Data:', subscriptionData);
          setSubscription(subscriptionData);
        }
      } catch (error) {
        console.error('Error fetching user profile:', error);
        setError('Failed to load profile data');
      }
    };

    fetchUserProfile();
  }, [user]);

  const handleSave = async () => {
    if (!user) return;

    try {
      setIsSaving(true);
      setError('');
      setSuccessMessage('');

      const userRef = ref(db, `users/${user.uid}`);
      await update(userRef, {
        name: displayName,
        settings: settings,
        updatedAt: new Date().toISOString()
      });

      setSuccessMessage('Profile updated successfully');
      setIsEditing(false);
    } catch (error) {
      console.error('Error updating profile:', error);
      setError('Failed to update profile');
    } finally {
      setIsSaving(false);
    }
  };

  const handleCancelSubscription = async () => {
    if (!user || subscription.plan === 'free') return;

    try {
      setIsSaving(true);
      setError('');
      
      // Call the API endpoint to cancel the subscription
      const response = await fetch('/api/stripe/cancel-subscription', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          userId: user.uid
        })
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.message || 'Failed to cancel subscription');
      }

      // Update local state
      setSubscription(prev => ({
        ...prev,
        cancelAtPeriodEnd: true
      }));

      setSuccessMessage('Your subscription has been cancelled and will end at the current billing period');
    } catch (error) {
      console.error('Error cancelling subscription:', error);
      setError(error instanceof Error ? error.message : 'Failed to cancel subscription');
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="max-w-2xl mx-auto">
      <div className="flex items-center justify-between mb-8">
        <h2 className="text-3xl font-bold bg-gradient-to-r from-[#00ffff] to-[#00ffff] bg-clip-text text-transparent">
          Profile Settings
        </h2>
        {isEditing ? (
          <div className="flex gap-4">
            <Button
              onClick={() => setIsEditing(false)}
              variant="secondary"
              disabled={isSaving}
              className="bg-black/50 text-white border border-[#00ffff]/20 hover:bg-[#00ffff]/10"
            >
              Cancel
            </Button>
            <Button
              onClick={handleSave}
              variant="primary"
              disabled={isSaving}
              className="bg-[#00ffff] text-black hover:bg-[#00ffff]/80"
            >
              {isSaving ? 'Saving...' : 'Save Changes'}
            </Button>
          </div>
        ) : (
          <Button
            onClick={() => setIsEditing(true)}
            variant="primary"
            className="bg-[#00ffff] text-black hover:bg-[#00ffff]/80"
          >
            Edit Profile
          </Button>
        )}
      </div>

      {error && (
        <div className="bg-red-500/10 border border-red-500/50 text-red-500 p-4 rounded-lg mb-6">
          {error}
        </div>
      )}

      {successMessage && (
        <div className="bg-green-500/10 border border-green-500/50 text-green-500 p-4 rounded-lg mb-6">
          {successMessage}
        </div>
      )}

      <div className="space-y-6">
        {/* Profile Information */}
        <div className="bg-black/80 backdrop-blur-lg border border-[#00ffff]/20 rounded-lg p-6 space-y-6">
          <h3 className="text-xl font-semibold text-[#00ffff] mb-4">Profile Information</h3>
          
          <div>
            <label className="block text-sm font-medium text-[#00ffff] mb-2">
              Display Name
            </label>
            {isEditing ? (
              <input
                type="text"
                value={displayName}
                onChange={(e) => setDisplayName(e.target.value)}
                className="w-full bg-black/50 text-white border border-[#00ffff]/20 rounded-lg p-2 focus:border-[#00ffff]/40 focus:outline-none"
              />
            ) : (
              <p className="text-white/80 p-2">{displayName}</p>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium text-[#00ffff] mb-2">
              Email
            </label>
            <p className="text-white/80 p-2">{email}</p>
          </div>
        </div>

        {/* User Settings */}
        <div className="bg-black/80 backdrop-blur-lg border border-[#00ffff]/20 rounded-lg p-6 space-y-6">
          <h3 className="text-xl font-semibold text-[#00ffff] mb-4">User Settings</h3>
          
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <label className="text-sm font-medium text-white">
                Email Notifications
              </label>
              <button
                onClick={() => setSettings(prev => ({ ...prev, emailNotifications: !prev.emailNotifications }))}
                className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                  settings.emailNotifications ? 'bg-[#00ffff]' : 'bg-gray-600'
                }`}
              >
                <span
                  className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                    settings.emailNotifications ? 'translate-x-6' : 'translate-x-1'
                  }`}
                />
              </button>
            </div>

            <div>
              <label className="block text-sm font-medium text-white mb-2">
                Timezone
              </label>
              <select
                value={settings.timezone}
                onChange={(e) => setSettings(prev => ({ ...prev, timezone: e.target.value }))}
                className="w-full bg-black/50 text-white border border-[#00ffff]/20 rounded-lg p-2 focus:border-[#00ffff]/40 focus:outline-none [&>option]:bg-black/90 hover:border-[#00ffff]/40 transition-colors"
              >
                {Intl.supportedValuesOf('timeZone').map((timezone) => (
                  <option key={timezone} value={timezone} className="bg-black/90 text-white hover:bg-[#00ffff]/10">
                    {timezone}
                  </option>
                ))}
              </select>
            </div>
          </div>
        </div>

        {/* Subscription Management */}
        <div className="bg-black/80 backdrop-blur-lg border border-[#00ffff]/20 rounded-lg p-6 space-y-6">
          <h3 className="text-xl font-semibold text-[#00ffff] mb-4">Subscription</h3>
          
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-[#00ffff] mb-2">
                Current Plan
              </label>
              <div className="flex items-center justify-between p-2">
                <div className="space-y-2">
                  <span className="text-white/80 capitalize">{subscription.plan === 'paid' ? 'Pro Plan' : 'Free Plan'}</span>
                  {subscription.status && (
                    <p className="text-sm text-white/60">
                      Status: <span className={`${subscription.status === 'active' ? 'text-green-400' : 'text-yellow-400'}`}>{subscription.status}</span>
                    </p>
                  )}
                  {subscription.plan === 'paid' && (
                    <div className="space-y-1">
                      <p className="text-sm text-white/60">
                        Subscription ID: {userData?.stripeSubscriptionId || 'N/A'}
                      </p>
                    </div>
                  )}
                </div>
                {subscription.plan === 'free' ? (
                  <Link href="/price">
                    <Button
                      variant="primary"
                      className="bg-[#00ffff] text-black hover:bg-[#00ffff]/80"
                    >
                      Upgrade to Pro
                    </Button>
                  </Link>
                ) : (
                  <div className="space-y-2">
                    {subscription.nextBillingDate && (
                      <p className="text-sm text-white/60">
                        Next billing date: {new Date(subscription.nextBillingDate).toLocaleDateString()}
                      </p>
                    )}
                    {subscription.cancelAtPeriodEnd ? (
                      <p className="text-sm text-yellow-500">
                        Your subscription will end at the current billing period
                      </p>
                    ) : (
                      <Button
                        onClick={handleCancelSubscription}
                        variant="secondary"
                        className="bg-black/50 text-white border border-[#00ffff]/20 hover:bg-[#00ffff]/10"
                      >
                        Cancel Subscription
                      </Button>
                    )}
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
} 