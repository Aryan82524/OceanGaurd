import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Badge } from './ui/badge';
import { Button } from './ui/button';
import { 
  Award, 
  Trophy, 
  Star, 
  Target, 
  TrendingUp,
  Calendar,
  MapPin,
  CheckCircle
} from 'lucide-react';
import { projectId } from '../utils/supabase/info';

interface UserProfileProps {
  user: any;
  userProfile: any;
  onProfileUpdate: (profile: any) => void;
}

export function UserProfile({ user, userProfile, onProfileUpdate }: UserProfileProps) {
  const [userReports, setUserReports] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (userProfile) {
      fetchUserReports();
    }
  }, [userProfile]);

  const fetchUserReports = async () => {
    try {
      const response = await fetch(`https://${projectId}.supabase.co/functions/v1/make-server-4387d93a/reports`, {
        headers: { 'Authorization': `Bearer ${user.access_token}` }
      });

      if (response.ok) {
        const data = await response.json();
        const myReports = data.reports.filter(report => report.userId === user.id);
        setUserReports(myReports);
      }
    } catch (error) {
      console.error('Error fetching user reports:', error);
    } finally {
      setLoading(false);
    }
  };

  const getBadgeIcon = (badge) => {
    switch (badge) {
      case 'First Reporter':
        return <Star className="h-5 w-5 text-yellow-500" />;
      case 'Ocean Guardian':
        return <Trophy className="h-5 w-5 text-blue-500" />;
      case 'Environmental Hero':
        return <Award className="h-5 w-5 text-green-500" />;
      default:
        return <Award className="h-5 w-5 text-purple-500" />;
    }
  };

  const getBadgeDescription = (badge) => {
    switch (badge) {
      case 'First Reporter':
        return 'Submitted your first hazard report';
      case 'Ocean Guardian':
        return 'Submitted 5 verified hazard reports';
      case 'Environmental Hero':
        return 'Submitted 10+ verified hazard reports';
      default:
        return 'Special achievement unlocked';
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

  const approvedReports = userReports.filter(r => r.status === 'approved').length;
  const pendingReports = userReports.filter(r => r.status === 'pending').length;
  const totalUpvotes = userReports.reduce((sum, report) => sum + (report.upvotes || 0), 0);

  if (!userProfile) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl text-gray-900">My Profile</h1>
        <p className="text-gray-600 mt-1">
          Track your contributions and achievements in ocean protection
        </p>
      </div>

      {/* Profile Overview */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <Card className="lg:col-span-1">
          <CardHeader className="text-center">
            <div className="mx-auto bg-blue-100 rounded-full p-6 w-24 h-24 flex items-center justify-center mb-4">
              <Award className="h-12 w-12 text-blue-600" />
            </div>
            <CardTitle>{userProfile.name}</CardTitle>
            <p className="text-gray-600 capitalize">{userProfile.role}</p>
            <p className="text-sm text-gray-500">{user.email}</p>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="text-center">
                <div className="text-3xl text-blue-600">{userProfile.points}</div>
                <p className="text-sm text-gray-600">Total Points</p>
              </div>
              
              <div className="grid grid-cols-2 gap-4 text-center">
                <div>
                  <div className="text-xl text-green-600">{approvedReports}</div>
                  <p className="text-xs text-gray-600">Approved Reports</p>
                </div>
                <div>
                  <div className="text-xl text-yellow-600">{pendingReports}</div>
                  <p className="text-xs text-gray-600">Pending Reports</p>
                </div>
              </div>
              
              <div className="text-center">
                <div className="text-xl text-purple-600">{totalUpvotes}</div>
                <p className="text-xs text-gray-600">Community Verifications</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="lg:col-span-2">
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <Trophy className="h-5 w-5" />
              <span>Achievements & Badges</span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            {userProfile.badges && userProfile.badges.length > 0 ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {userProfile.badges.map((badge, index) => (
                  <div key={index} className="bg-gradient-to-r from-yellow-50 to-yellow-100 p-4 rounded-lg border border-yellow-200">
                    <div className="flex items-center space-x-3">
                      {getBadgeIcon(badge)}
                      <div>
                        <h3 className="text-sm text-yellow-800">{badge}</h3>
                        <p className="text-xs text-yellow-700">{getBadgeDescription(badge)}</p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-8">
                <Award className="h-12 w-12 text-gray-300 mx-auto mb-4" />
                <p className="text-gray-500">No badges yet</p>
                <p className="text-sm text-gray-400">Submit reports to earn your first badge!</p>
              </div>
            )}

            <div className="mt-6 p-4 bg-blue-50 rounded-lg">
              <h3 className="text-sm text-blue-800 mb-2">🎯 Next Milestone</h3>
              <div className="space-y-2">
                {userProfile.reportsSubmitted < 1 && (
                  <p className="text-xs text-blue-700">Submit your first report to earn the "First Reporter" badge!</p>
                )}
                {userProfile.reportsSubmitted >= 1 && userProfile.reportsSubmitted < 5 && (
                  <p className="text-xs text-blue-700">Submit {5 - userProfile.reportsSubmitted} more reports to earn "Ocean Guardian" badge!</p>
                )}
                {userProfile.reportsSubmitted >= 5 && userProfile.reportsSubmitted < 10 && (
                  <p className="text-xs text-blue-700">Submit {10 - userProfile.reportsSubmitted} more reports to earn "Environmental Hero" badge!</p>
                )}
                {userProfile.reportsSubmitted >= 10 && (
                  <p className="text-xs text-blue-700">🎉 You're an Environmental Hero! Keep protecting our oceans!</p>
                )}
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Statistics Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm">Total Reports</CardTitle>
            <Target className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl">{userProfile.reportsSubmitted}</div>
            <p className="text-xs text-muted-foreground">
              Reports submitted
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm">Success Rate</CardTitle>
            <CheckCircle className="h-4 w-4 text-green-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl">
              {userReports.length > 0 
                ? Math.round((approvedReports / userReports.length) * 100)
                : 0}%
            </div>
            <p className="text-xs text-muted-foreground">
              Reports approved
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm">Community Impact</CardTitle>
            <TrendingUp className="h-4 w-4 text-purple-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl">{totalUpvotes}</div>
            <p className="text-xs text-muted-foreground">
              Community verifications
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm">Rank</CardTitle>
            <Star className="h-4 w-4 text-yellow-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl">
              {userProfile.points >= 100 ? 'Expert' : 
               userProfile.points >= 50 ? 'Guardian' :
               userProfile.points >= 10 ? 'Reporter' : 'Beginner'}
            </div>
            <p className="text-xs text-muted-foreground">
              Current level
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Recent Reports */}
      <Card>
        <CardHeader>
          <CardTitle>My Recent Reports</CardTitle>
        </CardHeader>
        <CardContent>
          {loading ? (
            <div className="flex items-center justify-center py-8">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
            </div>
          ) : userReports.length > 0 ? (
            <div className="space-y-4">
              {userReports.slice(0, 5).map((report) => (
                <div key={report.id} className="flex items-center space-x-4 p-4 bg-gray-50 rounded-lg">
                  <div className="flex-1">
                    <div className="flex items-center space-x-2 mb-2">
                      <Badge className={getHazardTypeColor(report.type)}>
                        {formatHazardType(report.type)}
                      </Badge>
                      <Badge className={getStatusColor(report.status)}>
                        {report.status}
                      </Badge>
                    </div>
                    <p className="text-sm text-gray-700 mb-1">{report.description}</p>
                    <div className="flex items-center text-xs text-gray-500 space-x-4">
                      <div className="flex items-center space-x-1">
                        <Calendar className="h-3 w-3" />
                        <span>{new Date(report.timestamp).toLocaleDateString()}</span>
                      </div>
                      <div className="flex items-center space-x-1">
                        <MapPin className="h-3 w-3" />
                        <span>{report.latitude?.toFixed(3)}, {report.longitude?.toFixed(3)}</span>
                      </div>
                      {report.upvotes > 0 && (
                        <span>👍 {report.upvotes} verification{report.upvotes !== 1 ? 's' : ''}</span>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-8">
              <MapPin className="h-12 w-12 text-gray-300 mx-auto mb-4" />
              <p className="text-gray-500">No reports submitted yet</p>
              <p className="text-sm text-gray-400 mb-4">Start reporting hazards to track your contributions</p>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}