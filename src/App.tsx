import React, { useState, useEffect } from 'react';
import { createClient } from '@supabase/supabase-js';
import { projectId, publicAnonKey } from './utils/supabase/info';
import { AuthForm } from './components/AuthForm';
import { Dashboard } from './components/Dashboard';
import { HazardReporting } from './components/HazardReporting';
import { Analytics } from './components/Analytics';
import { AdminPanel } from './components/AdminPanel';
import { UserProfile } from './components/UserProfile';
import { Navigation } from './components/Navigation';
import { NotificationSystem } from './components/NotificationSystem';
import { toast, Toaster } from 'sonner@2.0.3';

const supabase = createClient(
  `https://${projectId}.supabase.co`,
  publicAnonKey
);

export default function App() {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('dashboard');
  const [userProfile, setUserProfile] = useState(null);

  useEffect(() => {
    checkUser();
    
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      (event, session) => {
        if (event === 'SIGNED_IN') {
          setUser(session?.user || null);
          fetchUserProfile(session?.access_token);
        } else if (event === 'SIGNED_OUT') {
          setUser(null);
          setUserProfile(null);
        }
      }
    );

    return () => subscription.unsubscribe();
  }, []);

  const checkUser = async () => {
    try {
      const { data: { session } } = await supabase.auth.getSession();
      setUser(session?.user || null);
      if (session?.access_token) {
        await fetchUserProfile(session.access_token);
      }
    } catch (error) {
      console.error('Error checking user session:', error);
    } finally {
      setLoading(false);
    }
  };

  const fetchUserProfile = async (accessToken) => {
    try {
      const response = await fetch(`https://${projectId}.supabase.co/functions/v1/make-server-4387d93a/profile`, {
        headers: {
          'Authorization': `Bearer ${accessToken}`,
          'Content-Type': 'application/json'
        }
      });

      if (response.ok) {
        const data = await response.json();
        setUserProfile(data.profile);
      }
    } catch (error) {
      console.error('Error fetching user profile:', error);
    }
  };

  const handleSignIn = async (email, password) => {
    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (error) {
        toast.error(error.message);
        return false;
      }

      setUser(data.user);
      toast.success('Successfully signed in!');
      return true;
    } catch (error) {
      toast.error('Sign in failed');
      return false;
    }
  };

  const handleSignUp = async (email, password, name, role = 'user') => {
    try {
      const response = await fetch(`https://${projectId}.supabase.co/functions/v1/make-server-4387d93a/signup`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${publicAnonKey}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ email, password, name, role })
      });

      const data = await response.json();

      if (!response.ok) {
        toast.error(data.error || 'Registration failed');
        return false;
      }

      toast.success('Account created successfully! Please sign in.');
      return true;
    } catch (error) {
      toast.error('Registration failed');
      return false;
    }
  };

  const handleSignOut = async () => {
    try {
      await supabase.auth.signOut();
      setUser(null);
      setUserProfile(null);
      setActiveTab('dashboard');
      toast.success('Signed out successfully');
    } catch (error) {
      toast.error('Sign out failed');
    }
  };

  const updateUserProfile = (updatedProfile) => {
    setUserProfile(updatedProfile);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-cyan-50 flex items-center justify-center">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-cyan-50">
        <Toaster />
        <AuthForm onSignIn={handleSignIn} onSignUp={handleSignUp} />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-cyan-50">
      <Toaster />
      <Navigation
        user={user}
        userProfile={userProfile}
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        onSignOut={handleSignOut}
      />

      <main className="container mx-auto px-4 py-6">
        {activeTab === 'dashboard' && (
          <Dashboard user={user} userProfile={userProfile} />
        )}
        {activeTab === 'report' && (
          <HazardReporting 
            user={user} 
            onReportSubmitted={updateUserProfile} 
          />
        )}
        {activeTab === 'analytics' && <Analytics />}
        {activeTab === 'notifications' && (
          <NotificationSystem 
            user={user} 
            userProfile={userProfile}
          />
        )}
        {activeTab === 'profile' && (
          <UserProfile 
            user={user} 
            userProfile={userProfile}
            onProfileUpdate={updateUserProfile}
          />
        )}
        {activeTab === 'admin' && userProfile?.role === 'admin' && (
          <AdminPanel user={user} />
        )}
      </main>
    </div>
  );
}