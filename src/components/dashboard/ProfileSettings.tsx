import React, { useState, useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { db } from '@/lib/firebase';
import { ref, get, update } from 'firebase/database';
import { Button } from '@/components/ui/Button';

export default function ProfileSettings() {
  const { user } = useAuth();
  const [displayName, setDisplayName] = useState('');
  const [email, setEmail] = useState('');
  const [plan, setPlan] = useState('');
  const [role, setRole] = useState('');
  const [isEditing, setIsEditing] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [error, setError] = useState('');
  const [successMessage, setSuccessMessage] = useState('');

  useEffect(() => {
    const fetchUserProfile = async () => {
      if (!user) return;

      try {
        const userRef = ref(db, `users/${user.uid}`);
        const snapshot = await get(userRef);
        if (snapshot.exists()) {
          const userData = snapshot.val();
          setDisplayName(userData.name || user.displayName || '');
          setEmail(user.email || '');
          setPlan(userData.plan || 'free');
          setRole(userData.role || 'user');
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

  return (
    <div className="max-w-2xl mx-auto">
      <h2 className="text-3xl font-bold bg-gradient-to-r from-[#00ffff] to-[#00ffff] bg-clip-text text-transparent mb-8">
        Profile Settings
      </h2>

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

      <div className="bg-black/80 backdrop-blur-lg border border-[#00ffff]/20 rounded-lg p-6 space-y-6">
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

        <div>
          <label className="block text-sm font-medium text-[#00ffff] mb-2">
            Current Plan
          </label>
          <div className="flex items-center space-x-4 p-2">
            <span className="text-white/80 capitalize">{plan}</span>
            {plan === 'free' && (
              <a
                href="/price"
                className="text-sm text-[#00ffff] hover:text-[#00ffff]/80 transition-colors"
              >
                Upgrade to Pro
              </a>
            )}
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-[#00ffff] mb-2">
            Role
          </label>
          <p className="text-white/80 capitalize p-2">{role}</p>
        </div>

        <div className="flex justify-end space-x-4 pt-4 border-t border-[#00ffff]/20">
          {isEditing ? (
            <>
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
            </>
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
      </div>
    </div>
  );
} 