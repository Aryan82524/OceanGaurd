import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Button } from './ui/button';
import { Badge } from './ui/badge';
import { Switch } from './ui/switch';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { 
  Bell, 
  Mail, 
  MessageSquare, 
  AlertTriangle, 
  CheckCircle,
  Clock,
  MapPin,
  Users,
  Zap,
  Settings
} from 'lucide-react';
import { toast } from 'sonner@2.0.3';

interface NotificationSystemProps {
  user: any;
  userProfile: any;
}

export function NotificationSystem({ user, userProfile }: NotificationSystemProps) {
  const [notifications, setNotifications] = useState([]);
  const [settings, setSettings] = useState({
    emailAlerts: true,
    smsAlerts: false,
    pushNotifications: true,
    emergencyOnly: false,
    location: '',
    radius: 50 // km
  });

  const mockNotifications = [
    {
      id: 1,
      type: 'critical',
      title: 'Tsunami Warning - Bay of Bengal',
      message: 'High-risk tsunami detected. Immediate evacuation recommended for coastal areas within 10km.',
      timestamp: new Date(Date.now() - 300000), // 5 minutes ago
      location: 'Bay of Bengal, East Coast',
      verified: true,
      channels: ['email', 'sms', 'push'],
      escalationLevel: 'critical'
    },
    {
      id: 2,
      type: 'high',
      title: 'Storm Surge Alert - Mumbai Coast',
      message: 'Storm surge conditions detected. Coastal flooding possible in next 2-4 hours.',
      timestamp: new Date(Date.now() - 900000), // 15 minutes ago
      location: 'Mumbai Coastal Areas',
      verified: true,
      channels: ['email', 'push'],
      escalationLevel: 'high'
    },
    {
      id: 3,
      type: 'medium',
      title: 'High Wave Activity - Kerala',
      message: 'Unusual wave patterns observed. Exercise caution near coastal areas.',
      timestamp: new Date(Date.now() - 1800000), // 30 minutes ago
      location: 'Kerala Coastline',
      verified: false,
      channels: ['push'],
      escalationLevel: 'medium'
    },
    {
      id: 4,
      type: 'info',
      title: 'Report Verification Update',
      message: 'Your hazard report #HR-2024-0156 has been verified and approved.',
      timestamp: new Date(Date.now() - 3600000), // 1 hour ago
      location: 'Your Reports',
      verified: true,
      channels: ['email', 'push'],
      escalationLevel: 'low'
    }
  ];

  useEffect(() => {
    setNotifications(mockNotifications);
  }, []);

  const getNotificationIcon = (type: string) => {
    switch (type) {
      case 'critical':
        return <AlertTriangle className="h-5 w-5 text-red-600" />;
      case 'high':
        return <AlertTriangle className="h-5 w-5 text-orange-600" />;
      case 'medium':
        return <Bell className="h-5 w-5 text-yellow-600" />;
      default:
        return <Bell className="h-5 w-5 text-blue-600" />;
    }
  };

  const getNotificationColor = (type: string) => {
    switch (type) {
      case 'critical':
        return 'border-red-200 bg-red-50';
      case 'high':
        return 'border-orange-200 bg-orange-50';
      case 'medium':
        return 'border-yellow-200 bg-yellow-50';
      default:
        return 'border-blue-200 bg-blue-50';
    }
  };

  const getEscalationBadge = (level: string) => {
    switch (level) {
      case 'critical':
        return <Badge className="bg-red-100 text-red-800">CRITICAL</Badge>;
      case 'high':
        return <Badge className="bg-orange-100 text-orange-800">HIGH</Badge>;
      case 'medium':
        return <Badge className="bg-yellow-100 text-yellow-800">MEDIUM</Badge>;
      default:
        return <Badge className="bg-blue-100 text-blue-800">INFO</Badge>;
    }
  };

  const formatTimeAgo = (timestamp: Date) => {
    const now = new Date();
    const diffMs = now.getTime() - timestamp.getTime();
    const diffMins = Math.floor(diffMs / 60000);
    const diffHours = Math.floor(diffMs / 3600000);
    
    if (diffMins < 1) return 'Just now';
    if (diffMins < 60) return `${diffMins}m ago`;
    if (diffHours < 24) return `${diffHours}h ago`;
    return timestamp.toLocaleDateString();
  };

  const handleSettingsUpdate = (key: string, value: any) => {
    setSettings(prev => ({ ...prev, [key]: value }));
    toast.success('Notification settings updated');
  };

  const markAsRead = (notificationId: number) => {
    setNotifications(prev => 
      prev.map(notif => 
        notif.id === notificationId 
          ? { ...notif, read: true }
          : notif
      )
    );
  };

  const getChannelIcons = (channels: string[]) => {
    return channels.map(channel => {
      switch (channel) {
        case 'email':
          return <Mail key={channel} className="h-3 w-3" />;
        case 'sms':
          return <MessageSquare key={channel} className="h-3 w-3" />;
        case 'push':
          return <Bell key={channel} className="h-3 w-3" />;
        default:
          return null;
      }
    });
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl text-gray-900">Notification Center</h1>
        <p className="text-gray-600 mt-1">
          Manage alerts and emergency notifications for ocean hazards
        </p>
      </div>

      {/* Notification Settings */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <Settings className="h-5 w-5" />
            <span>Alert Preferences</span>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <Label>Email Alerts</Label>
                  <p className="text-sm text-gray-500">Receive notifications via email</p>
                </div>
                <Switch
                  checked={settings.emailAlerts}
                  onCheckedChange={(checked) => handleSettingsUpdate('emailAlerts', checked)}
                />
              </div>
              
              <div className="flex items-center justify-between">
                <div>
                  <Label>SMS Alerts</Label>
                  <p className="text-sm text-gray-500">Receive critical alerts via SMS</p>
                </div>
                <Switch
                  checked={settings.smsAlerts}
                  onCheckedChange={(checked) => handleSettingsUpdate('smsAlerts', checked)}
                />
              </div>
              
              <div className="flex items-center justify-between">
                <div>
                  <Label>Push Notifications</Label>
                  <p className="text-sm text-gray-500">Browser push notifications</p>
                </div>
                <Switch
                  checked={settings.pushNotifications}
                  onCheckedChange={(checked) => handleSettingsUpdate('pushNotifications', checked)}
                />
              </div>
              
              <div className="flex items-center justify-between">
                <div>
                  <Label>Emergency Only</Label>
                  <p className="text-sm text-gray-500">Only critical/high priority alerts</p>
                </div>
                <Switch
                  checked={settings.emergencyOnly}
                  onCheckedChange={(checked) => handleSettingsUpdate('emergencyOnly', checked)}
                />
              </div>
            </div>
            
            <div className="space-y-4">
              <div>
                <Label htmlFor="location">Location (Optional)</Label>
                <Input
                  id="location"
                  placeholder="e.g., Mumbai, Chennai, Kolkata"
                  value={settings.location}
                  onChange={(e) => handleSettingsUpdate('location', e.target.value)}
                />
                <p className="text-xs text-gray-500 mt-1">
                  Set your location to receive targeted local alerts
                </p>
              </div>
              
              <div>
                <Label htmlFor="radius">Alert Radius (km)</Label>
                <Input
                  id="radius"
                  type="number"
                  min="5"
                  max="500"
                  value={settings.radius}
                  onChange={(e) => handleSettingsUpdate('radius', parseInt(e.target.value))}
                />
                <p className="text-xs text-gray-500 mt-1">
                  Receive alerts within this distance from your location
                </p>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Emergency Alert System Overview */}
      <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm">Active Alerts</CardTitle>
            <AlertTriangle className="h-4 w-4 text-red-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl text-red-600">2</div>
            <p className="text-xs text-muted-foreground">Critical/High priority</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm">Total Sent</CardTitle>
            <Bell className="h-4 w-4 text-blue-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl">1,247</div>
            <p className="text-xs text-muted-foreground">Last 30 days</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm">Response Rate</CardTitle>
            <CheckCircle className="h-4 w-4 text-green-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl">94%</div>
            <p className="text-xs text-muted-foreground">Alert acknowledgment</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm">Users Reached</CardTitle>
            <Users className="h-4 w-4 text-purple-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl">15.2K</div>
            <p className="text-xs text-muted-foreground">Active subscribers</p>
          </CardContent>
        </Card>
      </div>

      {/* Recent Notifications */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <Bell className="h-5 w-5" />
            <span>Recent Notifications</span>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {notifications.map((notification) => (
              <div
                key={notification.id}
                className={`p-4 rounded-lg border ${getNotificationColor(notification.type)} ${!notification.read ? 'border-l-4' : ''}`}
              >
                <div className="flex items-start justify-between">
                  <div className="flex items-start space-x-3 flex-1">
                    {getNotificationIcon(notification.type)}
                    <div className="flex-1">
                      <div className="flex items-center space-x-2 mb-1">
                        <h3 className="text-sm">{notification.title}</h3>
                        {getEscalationBadge(notification.escalationLevel)}
                        {notification.verified && (
                          <Badge className="bg-green-100 text-green-800">
                            <CheckCircle className="h-3 w-3 mr-1" />
                            Verified
                          </Badge>
                        )}
                      </div>
                      <p className="text-sm text-gray-700 mb-2">{notification.message}</p>
                      <div className="flex items-center space-x-4 text-xs text-gray-500">
                        <div className="flex items-center space-x-1">
                          <Clock className="h-3 w-3" />
                          <span>{formatTimeAgo(notification.timestamp)}</span>
                        </div>
                        <div className="flex items-center space-x-1">
                          <MapPin className="h-3 w-3" />
                          <span>{notification.location}</span>
                        </div>
                        <div className="flex items-center space-x-1">
                          {getChannelIcons(notification.channels)}
                        </div>
                      </div>
                    </div>
                  </div>
                  {!notification.read && (
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => markAsRead(notification.id)}
                    >
                      Mark Read
                    </Button>
                  )}
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Escalation Process */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <Zap className="h-5 w-5" />
            <span>Emergency Escalation Process</span>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div className="text-center p-4 bg-blue-50 rounded-lg">
              <div className="w-12 h-12 bg-blue-600 text-white rounded-full flex items-center justify-center mx-auto mb-2">
                1
              </div>
              <h3 className="text-sm mb-1">Detection</h3>
              <p className="text-xs text-gray-600">
                AI monitors social media + citizen reports
              </p>
            </div>
            
            <div className="text-center p-4 bg-yellow-50 rounded-lg">
              <div className="w-12 h-12 bg-yellow-600 text-white rounded-full flex items-center justify-center mx-auto mb-2">
                2
              </div>
              <h3 className="text-sm mb-1">Verification</h3>
              <p className="text-xs text-gray-600">
                Automated credibility scoring + human review
              </p>
            </div>
            
            <div className="text-center p-4 bg-orange-50 rounded-lg">
              <div className="w-12 h-12 bg-orange-600 text-white rounded-full flex items-center justify-center mx-auto mb-2">
                3
              </div>
              <h3 className="text-sm mb-1">Alert Distribution</h3>
              <p className="text-xs text-gray-600">
                Multi-channel alerts to affected users
              </p>
            </div>
            
            <div className="text-center p-4 bg-red-50 rounded-lg">
              <div className="w-12 h-12 bg-red-600 text-white rounded-full flex items-center justify-center mx-auto mb-2">
                4
              </div>
              <h3 className="text-sm mb-1">Emergency Response</h3>
              <p className="text-xs text-gray-600">
                Escalation to authorities + rescue coordination
              </p>
            </div>
          </div>
          
          <div className="mt-6 bg-green-50 p-4 rounded-lg">
            <h3 className="text-sm text-green-800 mb-2">🚨 Integration with Emergency Services</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs text-green-700">
              <div>
                <p>• Automatic routing to INCOIS early warning systems</p>
                <p>• Direct integration with National Disaster Management Authority</p>
                <p>• Real-time coordination with Coast Guard and Navy</p>
              </div>
              <div>
                <p>• Multi-language alert support (Hindi, Tamil, Bengali, etc.)</p>
                <p>• SMS alerts via government emergency network</p>
                <p>• Emergency evacuation route guidance</p>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}