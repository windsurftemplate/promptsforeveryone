'use client';

import { useAuth } from '@/contexts/AuthContext';
import ProtectedRoute from '@/components/auth/ProtectedRoute';
import Card from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';

export default function ProfilePage() {
  const { user, signOut } = useAuth();

  return (
    <ProtectedRoute>
      <div className="container mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold mb-8">Profile</h1>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* User Info Card */}
          <Card className="md:col-span-2">
            <div className="p-6">
              <h2 className="text-xl font-semibold mb-4">User Information</h2>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm text-text-muted mb-1">Email</label>
                  <p className="text-text">{user?.email}</p>
                </div>
                <div>
                  <label className="block text-sm text-text-muted mb-1">Account Created</label>
                  <p className="text-text">
                    {user?.metadata.creationTime ? new Date(user.metadata.creationTime).toLocaleDateString() : 'N/A'}
                  </p>
                </div>
              </div>
            </div>
          </Card>

          {/* Quick Actions Card */}
          <Card>
            <div className="p-6">
              <h2 className="text-xl font-semibold mb-4">Quick Actions</h2>
              <div className="space-y-3">
                <Button variant="secondary" className="w-full">
                  Edit Profile
                </Button>
                <Button variant="secondary" className="w-full">
                  Change Password
                </Button>
                <Button variant="ghost" className="w-full text-red-500 hover:text-red-400" onClick={signOut}>
                  Sign Out
                </Button>
              </div>
            </div>
          </Card>

          {/* Activity Card */}
          <Card className="md:col-span-3">
            <div className="p-6">
              <h2 className="text-xl font-semibold mb-4">Recent Activity</h2>
              <div className="space-y-4">
                <p className="text-text-muted">No recent activity</p>
              </div>
            </div>
          </Card>
        </div>
      </div>
    </ProtectedRoute>
  );
}
