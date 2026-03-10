import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Badge } from './ui/badge';
import { 
  AlertTriangle, 
  CheckCircle, 
  Clock, 
  XCircle,
  TrendingUp,
  Users,
  MapPin,
  Activity
} from 'lucide-react';
import { projectId, publicAnonKey } from '../utils/supabase/info';
import { HazardMap } from './HazardMap';

interface DashboardProps {
  user: any;
  userProfile: any;
}

export function Dashboard({ user, userProfile }: DashboardProps) {
  const [stats, setStats] = useState(null);
  const [reports, setReports] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    try {
      const [statsResponse, reportsResponse] = await Promise.all([
        fetch(`https://${projectId}.supabase.co/functions/v1/make-server-4387d93a/stats`, {
          headers: { 'Authorization': `Bearer ${publicAnonKey}` }
        }),
        fetch(`https://${projectId}.supabase.co/functions/v1/make-server-4387d93a/reports`, {
          headers: { 'Authorization': `Bearer ${publicAnonKey}` }
        })
      ]);

      if (statsResponse.ok) {
        const statsData = await statsResponse.json();
        setStats(statsData);
      }

      if (reportsResponse.ok) {
        const reportsData = await reportsResponse.json();
        setReports(reportsData.reports);
      }
    } catch (error) {
      console.error('Error fetching dashboard data:', error);
    } finally {
      setLoading(false);
    }
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case 'approved':
        return <CheckCircle className="h-4 w-4 text-green-600" />;
      case 'rejected':
        return <XCircle className="h-4 w-4 text-red-600" />;
      default:
        return <Clock className="h-4 w-4 text-yellow-600" />;
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'approved': return 'bg-green-100 text-green-800';
      case 'rejected': return 'bg-red-100 text-red-800';
      default: return 'bg-yellow-100 text-yellow-800';
    }
  };

  const getHazardTypeColor = (type) => {
    switch (type) {
      case 'oil-spill': return 'bg-red-100 text-red-800';
      case 'plastic-waste': return 'bg-orange-100 text-orange-800';
      case 'dangerous-tide': return 'bg-blue-100 text-blue-800';
      case 'stranded-animal': return 'bg-purple-100 text-purple-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const formatHazardType = (type) => {
    return type.split('-').map(word => 
      word.charAt(0).toUpperCase() + word.slice(1)
    ).join(' ');
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between">
        <div>
          <h1 className="text-3xl text-gray-900">Dashboard</h1>
          <p className="text-gray-600 mt-1">
            Welcome back, {userProfile?.name || user.email}
          </p>
        </div>
        {userProfile && (
          <Card className="mt-4 sm:mt-0">
            <CardContent className="p-4">
              <div className="flex items-center space-x-4">
                <div className="text-center">
                  <p className="text-2xl text-blue-600">{userProfile.points}</p>
                  <p className="text-sm text-gray-500">Points</p>
                </div>
                <div className="text-center">
                  <p className="text-2xl text-green-600">{userProfile.reportsSubmitted}</p>
                  <p className="text-sm text-gray-500">Reports</p>
                </div>
                <div className="text-center">
                  <p className="text-2xl text-purple-600">{userProfile.badges?.length || 0}</p>
                  <p className="text-sm text-gray-500">Badges</p>
                </div>
              </div>
            </CardContent>
          </Card>
        )}
      </div>

      {stats && (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm">Total Reports</CardTitle>
              <Activity className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl">{stats.totalReports}</div>
              <p className="text-xs text-muted-foreground">
                All hazard reports submitted
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm">Pending Review</CardTitle>
              <Clock className="h-4 w-4 text-yellow-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl">{stats.pendingReports}</div>
              <p className="text-xs text-muted-foreground">
                Awaiting admin review
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm">Approved</CardTitle>
              <CheckCircle className="h-4 w-4 text-green-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl">{stats.approvedReports}</div>
              <p className="text-xs text-muted-foreground">
                Verified hazards
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm">Active Users</CardTitle>
              <Users className="h-4 w-4 text-blue-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl">{Math.floor(stats.totalReports / 3)}</div>
              <p className="text-xs text-muted-foreground">
                Community members
              </p>
            </CardContent>
          </Card>
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Hazard Distribution</CardTitle>
          </CardHeader>
          <CardContent>
            {stats?.reportsByType && (
              <div className="space-y-3">
                {Object.entries(stats.reportsByType).map(([type, count]) => (
                  <div key={type} className="flex items-center justify-between">
                    <div className="flex items-center space-x-2">
                      <Badge className={getHazardTypeColor(type)}>
                        {formatHazardType(type)}
                      </Badge>
                    </div>
                    <span className="text-sm text-gray-600">{count as number} reports</span>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Recent Activity</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {stats?.recentActivity?.slice(0, 5).map((report) => (
                <div key={report.id} className="flex items-center space-x-3 p-2 bg-gray-50 rounded-lg">
                  <div className="flex items-center space-x-2">
                    {getStatusIcon(report.status)}
                    <Badge className={getHazardTypeColor(report.type)} variant="secondary">
                      {formatHazardType(report.type)}
                    </Badge>
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm text-gray-900 truncate">
                      {report.description}
                    </p>
                    <p className="text-xs text-gray-500">
                      by {report.userName} • {new Date(report.timestamp).toLocaleDateString()}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <MapPin className="h-5 w-5" />
            <span>Hazard Locations</span>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <HazardMap reports={reports} />
        </CardContent>
      </Card>
    </div>
  );
}