import React from 'react';
import { Button } from './ui/button';
import { Badge } from './ui/badge';
import { 
  Waves, 
  BarChart3, 
  AlertTriangle, 
  User, 
  Settings, 
  LogOut,
  Award
} from 'lucide-react';

interface NavigationProps {
  user: any;
  userProfile: any;
  activeTab: string;
  setActiveTab: (tab: string) => void;
  onSignOut: () => void;
}

export function Navigation({ user, userProfile, activeTab, setActiveTab, onSignOut }: NavigationProps) {
  return (
    <nav className="bg-white shadow-sm border-b">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          <div className="flex items-center space-x-8">
            <div className="flex items-center space-x-2">
              <Waves className="h-8 w-8 text-blue-600" />
              <span className="text-xl text-blue-900">OceanGuard</span>
            </div>
            
            <div className="hidden md:flex space-x-4">
              <Button
                variant={activeTab === 'dashboard' ? 'default' : 'ghost'}
                onClick={() => setActiveTab('dashboard')}
                className="flex items-center space-x-2"
              >
                <BarChart3 className="h-4 w-4" />
                <span>Dashboard</span>
              </Button>
              
              <Button
                variant={activeTab === 'report' ? 'default' : 'ghost'}
                onClick={() => setActiveTab('report')}
                className="flex items-center space-x-2"
              >
                <AlertTriangle className="h-4 w-4" />
                <span>Report Hazard</span>
              </Button>
              
              <Button
                variant={activeTab === 'analytics' ? 'default' : 'ghost'}
                onClick={() => setActiveTab('analytics')}
                className="flex items-center space-x-2"
              >
                <BarChart3 className="h-4 w-4" />
                <span>Analytics</span>
              </Button>
              
              <Button
                variant={activeTab === 'notifications' ? 'default' : 'ghost'}
                onClick={() => setActiveTab('notifications')}
                className="flex items-center space-x-2"
              >
                <Settings className="h-4 w-4" />
                <span>Alerts</span>
              </Button>
              
              {userProfile?.role === 'admin' && (
                <Button
                  variant={activeTab === 'admin' ? 'default' : 'ghost'}
                  onClick={() => setActiveTab('admin')}
                  className="flex items-center space-x-2"
                >
                  <Settings className="h-4 w-4" />
                  <span>Admin</span>
                </Button>
              )}
            </div>
          </div>
          
          <div className="flex items-center space-x-4">
            {userProfile && (
              <div className="flex items-center space-x-2">
                <Award className="h-4 w-4 text-yellow-500" />
                <span className="text-sm">{userProfile.points} pts</span>
                {userProfile.badges?.length > 0 && (
                  <Badge variant="secondary" className="text-xs">
                    {userProfile.badges.length} badge{userProfile.badges.length !== 1 ? 's' : ''}
                  </Badge>
                )}
              </div>
            )}
            
            <Button
              variant={activeTab === 'profile' ? 'default' : 'ghost'}
              onClick={() => setActiveTab('profile')}
              className="flex items-center space-x-2"
            >
              <User className="h-4 w-4" />
              <span className="hidden sm:inline">{userProfile?.name || user.email}</span>
            </Button>
            
            <Button variant="ghost" onClick={onSignOut} className="flex items-center space-x-2">
              <LogOut className="h-4 w-4" />
              <span className="hidden sm:inline">Sign Out</span>
            </Button>
          </div>
        </div>
        
        {/* Mobile Navigation */}
        <div className="md:hidden pb-4">
          <div className="flex space-x-2 overflow-x-auto">
            <Button
              variant={activeTab === 'dashboard' ? 'default' : 'ghost'}
              size="sm"
              onClick={() => setActiveTab('dashboard')}
            >
              Dashboard
            </Button>
            <Button
              variant={activeTab === 'report' ? 'default' : 'ghost'}
              size="sm"
              onClick={() => setActiveTab('report')}
            >
              Report
            </Button>
            <Button
              variant={activeTab === 'analytics' ? 'default' : 'ghost'}
              size="sm"
              onClick={() => setActiveTab('analytics')}
            >
              Analytics
            </Button>
            <Button
              variant={activeTab === 'notifications' ? 'default' : 'ghost'}
              size="sm"
              onClick={() => setActiveTab('notifications')}
            >
              Alerts
            </Button>
            {userProfile?.role === 'admin' && (
              <Button
                variant={activeTab === 'admin' ? 'default' : 'ghost'}
                size="sm"
                onClick={() => setActiveTab('admin')}
              >
                Admin
              </Button>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
}