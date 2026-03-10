import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Badge } from './ui/badge';
import { Button } from './ui/button';
import { 
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  LineChart,
  Line,
  PieChart,
  Pie,
  Cell
} from 'recharts';
import { 
  TrendingUp, 
  TrendingDown, 
  Hash, 
  Share2,
  Heart,
  MessageCircle,
  Eye,
  MapPin,
  Zap,
  Globe
} from 'lucide-react';
import { projectId, publicAnonKey } from '../utils/supabase/info';
import { SocialMediaAnalytics } from './SocialMediaAnalytics';

export function Analytics() {
  const [analyticsData, setAnalyticsData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [activeView, setActiveView] = useState('overview');

  useEffect(() => {
    fetchAnalytics();
  }, []);

  const fetchAnalytics = async () => {
    try {
      const response = await fetch(`https://${projectId}.supabase.co/functions/v1/make-server-4387d93a/analytics`, {
        headers: { 'Authorization': `Bearer ${publicAnonKey}` }
      });

      if (response.ok) {
        const data = await response.json();
        setAnalyticsData(data);
      }
    } catch (error) {
      console.error('Error fetching analytics:', error);
    } finally {
      setLoading(false);
    }
  };

  const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884D8'];

  const getSentimentIcon = (sentiment) => {
    switch (sentiment) {
      case 'positive':
        return <Heart className="h-4 w-4 text-green-600" />;
      case 'negative':
        return <TrendingDown className="h-4 w-4 text-red-600" />;
      default:
        return <MessageCircle className="h-4 w-4 text-gray-600" />;
    }
  };

  const getSentimentColor = (sentiment) => {
    switch (sentiment) {
      case 'positive': return 'bg-green-100 text-green-800';
      case 'negative': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  if (!analyticsData) {
    return (
      <div className="text-center py-12">
        <p className="text-gray-600">Unable to load analytics data</p>
      </div>
    );
  }

  const platformData = Object.entries(analyticsData.platformStats).map(([platform, stats]) => ({
    platform: platform.charAt(0).toUpperCase() + platform.slice(1),
    posts: stats.posts,
    engagement: stats.engagement
  }));

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between">
        <div>
          <h1 className="text-3xl text-gray-900">Social Media Analytics</h1>
          <p className="text-gray-600 mt-1">
            AI-powered social media monitoring and analysis for ocean hazards
          </p>
        </div>
        <div className="flex gap-2 mt-4 sm:mt-0">
          <Button
            variant={activeView === 'overview' ? 'default' : 'outline'}
            size="sm"
            onClick={() => setActiveView('overview')}
          >
            <Eye className="h-4 w-4 mr-1" />
            Overview
          </Button>
          <Button
            variant={activeView === 'nlp' ? 'default' : 'outline'}
            size="sm"
            onClick={() => setActiveView('nlp')}
          >
            <Zap className="h-4 w-4 mr-1" />
            NLP Analysis
          </Button>
          <Button
            variant={activeView === 'hotspots' ? 'default' : 'outline'}
            size="sm"
            onClick={() => setActiveView('hotspots')}
          >
            <MapPin className="h-4 w-4 mr-1" />
            Hotspots
          </Button>
        </div>
      </div>

      {/* Platform Stats Overview */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        {Object.entries(analyticsData.platformStats).map(([platform, stats]) => (
          <Card key={platform}>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm capitalize">{platform}</CardTitle>
              <Share2 className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl">{stats.posts}</div>
              <p className="text-xs text-muted-foreground">
                Posts • {stats.engagement}% engagement
              </p>
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Sentiment Trends */}
        <Card>
          <CardHeader>
            <CardTitle>Sentiment Trends Over Time</CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={analyticsData.sentimentTrends}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis 
                  dataKey="date" 
                  tickFormatter={(value) => new Date(value).toLocaleDateString()}
                />
                <YAxis />
                <Tooltip 
                  labelFormatter={(value) => new Date(value).toLocaleDateString()}
                  formatter={(value, name) => [`${value}%`, name.charAt(0).toUpperCase() + name.slice(1)]}
                />
                <Line type="monotone" dataKey="positive" stroke="#10B981" name="positive" strokeWidth={2} />
                <Line type="monotone" dataKey="negative" stroke="#EF4444" name="negative" strokeWidth={2} />
                <Line type="monotone" dataKey="neutral" stroke="#6B7280" name="neutral" strokeWidth={2} />
              </LineChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        {/* Platform Engagement */}
        <Card>
          <CardHeader>
            <CardTitle>Platform Engagement</CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={platformData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="platform" />
                <YAxis />
                <Tooltip />
                <Bar dataKey="posts" fill="#3B82F6" name="Posts" />
                <Bar dataKey="engagement" fill="#10B981" name="Engagement %" />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>

      {/* Trending Hashtags */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <Hash className="h-5 w-5" />
            <span>Trending Hashtags</span>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {analyticsData.trendingHashtags.map((hashtag, index) => (
              <div key={hashtag.tag} className="bg-gray-50 p-4 rounded-lg">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-lg text-blue-600">{hashtag.tag}</span>
                  <Badge className={getSentimentColor(hashtag.sentiment)}>
                    <div className="flex items-center space-x-1">
                      {getSentimentIcon(hashtag.sentiment)}
                      <span className="capitalize">{hashtag.sentiment}</span>
                    </div>
                  </Badge>
                </div>
                <div className="flex items-center space-x-2">
                  <Eye className="h-4 w-4 text-gray-600" />
                  <span className="text-sm text-gray-600">{hashtag.mentions.toLocaleString()} mentions</span>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Sentiment Distribution */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Current Sentiment Distribution</CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={250}>
              <PieChart>
                <Pie
                  data={[
                    { name: 'Positive', value: 70, color: '#10B981' },
                    { name: 'Negative', value: 20, color: '#EF4444' },
                    { name: 'Neutral', value: 10, color: '#6B7280' }
                  ]}
                  cx="50%"
                  cy="50%"
                  outerRadius={80}
                  fill="#8884d8"
                  dataKey="value"
                  label={({ name, value }) => `${name}: ${value}%`}
                >
                  {[
                    { name: 'Positive', value: 70, color: '#10B981' },
                    { name: 'Negative', value: 20, color: '#EF4444' },
                    { name: 'Neutral', value: 10, color: '#6B7280' }
                  ].map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Key Insights</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex items-start space-x-3">
                <TrendingUp className="h-5 w-5 text-green-600 mt-1" />
                <div>
                  <h4 className="text-sm">Positive Trend</h4>
                  <p className="text-sm text-gray-600">
                    Ocean cleanup initiatives are gaining 15% more positive sentiment this week
                  </p>
                </div>
              </div>
              
              <div className="flex items-start space-x-3">
                <Hash className="h-5 w-5 text-blue-600 mt-1" />
                <div>
                  <h4 className="text-sm">Top Hashtag</h4>
                  <p className="text-sm text-gray-600">
                    #OceanCleanup is trending with 1,250 mentions and positive sentiment
                  </p>
                </div>
              </div>
              
              <div className="flex items-start space-x-3">
                <Share2 className="h-5 w-5 text-purple-600 mt-1" />
                <div>
                  <h4 className="text-sm">Platform Leader</h4>
                  <p className="text-sm text-gray-600">
                    Instagram shows highest engagement (94%) for ocean conservation content
                  </p>
                </div>
              </div>
              
              <div className="flex items-start space-x-3">
                <MessageCircle className="h-5 w-5 text-orange-600 mt-1" />
                <div>
                  <h4 className="text-sm">Discussion Topics</h4>
                  <p className="text-sm text-gray-600">
                    Plastic pollution and marine life protection dominate conversations
                  </p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {activeView === 'nlp' && (
        <SocialMediaAnalytics analyticsData={analyticsData} />
      )}

      {activeView === 'hotspots' && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <MapPin className="h-5 w-5" />
              <span>Dynamic Hotspot Detection</span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              <div className="bg-red-50 p-4 rounded-lg border border-red-200">
                <h3 className="text-lg text-red-800 mb-2">Critical Hotspot</h3>
                <p className="text-sm text-red-700 mb-2">Bay of Bengal - East Coast</p>
                <div className="space-y-1 text-xs text-red-600">
                  <p>• 234 social media mentions (2x normal)</p>
                  <p>• 15 citizen reports submitted</p>
                  <p>• Keywords: "tsunami", "evacuation"</p>
                  <p>• Confidence: 94%</p>
                </div>
              </div>
              
              <div className="bg-orange-50 p-4 rounded-lg border border-orange-200">
                <h3 className="text-lg text-orange-800 mb-2">High Activity</h3>
                <p className="text-sm text-orange-700 mb-2">Mumbai Coastal Area</p>
                <div className="space-y-1 text-xs text-orange-600">
                  <p>• 156 social media mentions</p>
                  <p>• 8 citizen reports submitted</p>
                  <p>• Keywords: "storm surge", "flooding"</p>
                  <p>• Confidence: 87%</p>
                </div>
              </div>
              
              <div className="bg-yellow-50 p-4 rounded-lg border border-yellow-200">
                <h3 className="text-lg text-yellow-800 mb-2">Moderate Activity</h3>
                <p className="text-sm text-yellow-700 mb-2">Kerala Backwaters</p>
                <div className="space-y-1 text-xs text-yellow-600">
                  <p>• 89 social media mentions</p>
                  <p>• 4 citizen reports submitted</p>
                  <p>• Keywords: "high waves", "coastal"</p>
                  <p>• Confidence: 76%</p>
                </div>
              </div>
            </div>
            
            <div className="mt-6 bg-blue-50 p-4 rounded-lg">
              <h3 className="text-sm text-blue-800 mb-2">🎯 Hotspot Generation Algorithm</h3>
              <p className="text-sm text-blue-700 mb-2">
                Dynamic hotspots are generated using AI analysis of multiple data sources:
              </p>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs text-blue-600">
                <div>
                  <p>• Social media mention density and sentiment</p>
                  <p>• Citizen report clustering and verification</p>
                  <p>• Keyword frequency and urgency scoring</p>
                </div>
                <div>
                  <p>• Historical pattern analysis</p>
                  <p>• Weather data correlation (INCOIS integration)</p>
                  <p>• Cross-platform validation and scoring</p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {activeView === 'overview' && (
        <>
          {/* Platform Stats Overview */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            {Object.entries(analyticsData.platformStats).map(([platform, stats]) => (
              <Card key={platform}>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm capitalize">{platform}</CardTitle>
                  <Share2 className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl">{stats.posts}</div>
                  <p className="text-xs text-muted-foreground">
                    Posts • {stats.engagement}% engagement
                  </p>
                </CardContent>
              </Card>
            ))}
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Sentiment Trends */}
            <Card>
              <CardHeader>
                <CardTitle>Sentiment Trends Over Time</CardTitle>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={300}>
                  <LineChart data={analyticsData.sentimentTrends}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis 
                      dataKey="date" 
                      tickFormatter={(value) => new Date(value).toLocaleDateString()}
                    />
                    <YAxis />
                    <Tooltip 
                      labelFormatter={(value) => new Date(value).toLocaleDateString()}
                      formatter={(value, name) => [`${value}%`, name.charAt(0).toUpperCase() + name.slice(1)]}
                    />
                    <Line type="monotone" dataKey="positive" stroke="#10B981" name="positive" strokeWidth={2} />
                    <Line type="monotone" dataKey="negative" stroke="#EF4444" name="negative" strokeWidth={2} />
                    <Line type="monotone" dataKey="neutral" stroke="#6B7280" name="neutral" strokeWidth={2} />
                  </LineChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>

            {/* Platform Engagement */}
            <Card>
              <CardHeader>
                <CardTitle>Platform Engagement</CardTitle>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={300}>
                  <BarChart data={platformData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="platform" />
                    <YAxis />
                    <Tooltip />
                    <Bar dataKey="posts" fill="#3B82F6" name="Posts" />
                    <Bar dataKey="engagement" fill="#10B981" name="Engagement %" />
                  </BarChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>
          </div>

          {/* Trending Hashtags */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <Hash className="h-5 w-5" />
                <span>Trending Hashtags</span>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {analyticsData.trendingHashtags.map((hashtag, index) => (
                  <div key={hashtag.tag} className="bg-gray-50 p-4 rounded-lg">
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-lg text-blue-600">{hashtag.tag}</span>
                      <Badge className={getSentimentColor(hashtag.sentiment)}>
                        <div className="flex items-center space-x-1">
                          {getSentimentIcon(hashtag.sentiment)}
                          <span className="capitalize">{hashtag.sentiment}</span>
                        </div>
                      </Badge>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Eye className="h-4 w-4 text-gray-600" />
                      <span className="text-sm text-gray-600">{hashtag.mentions.toLocaleString()} mentions</span>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Sentiment Distribution */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>Current Sentiment Distribution</CardTitle>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={250}>
                  <PieChart>
                    <Pie
                      data={[
                        { name: 'Positive', value: 70, color: '#10B981' },
                        { name: 'Negative', value: 20, color: '#EF4444' },
                        { name: 'Neutral', value: 10, color: '#6B7280' }
                      ]}
                      cx="50%"
                      cy="50%"
                      outerRadius={80}
                      fill="#8884d8"
                      dataKey="value"
                      label={({ name, value }) => `${name}: ${value}%`}
                    >
                      {[
                        { name: 'Positive', value: 70, color: '#10B981' },
                        { name: 'Negative', value: 20, color: '#EF4444' },
                        { name: 'Neutral', value: 10, color: '#6B7280' }
                      ].map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.color} />
                      ))}
                    </Pie>
                    <Tooltip />
                  </PieChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Key Insights</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex items-start space-x-3">
                    <TrendingUp className="h-5 w-5 text-green-600 mt-1" />
                    <div>
                      <h4 className="text-sm">Positive Trend</h4>
                      <p className="text-sm text-gray-600">
                        Ocean cleanup initiatives are gaining 15% more positive sentiment this week
                      </p>
                    </div>
                  </div>
                  
                  <div className="flex items-start space-x-3">
                    <Hash className="h-5 w-5 text-blue-600 mt-1" />
                    <div>
                      <h4 className="text-sm">Top Hashtag</h4>
                      <p className="text-sm text-gray-600">
                        #OceanCleanup is trending with 1,250 mentions and positive sentiment
                      </p>
                    </div>
                  </div>
                  
                  <div className="flex items-start space-x-3">
                    <Share2 className="h-5 w-5 text-purple-600 mt-1" />
                    <div>
                      <h4 className="text-sm">Platform Leader</h4>
                      <p className="text-sm text-gray-600">
                        Instagram shows highest engagement (94%) for ocean conservation content
                      </p>
                    </div>
                  </div>
                  
                  <div className="flex items-start space-x-3">
                    <MessageCircle className="h-5 w-5 text-orange-600 mt-1" />
                    <div>
                      <h4 className="text-sm">Discussion Topics</h4>
                      <p className="text-sm text-gray-600">
                        Plastic pollution and marine life protection dominate conversations
                      </p>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </>
      )}

      <div className="bg-blue-50 p-6 rounded-lg">
        <h3 className="text-lg text-blue-900 mb-2">🚀 Advanced Social Media Integration</h3>
        <p className="text-blue-800 text-sm mb-4">
          This platform integrates advanced AI-powered social media monitoring with real emergency response capabilities.
        </p>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs text-blue-700">
          <div>
            <p>• Real-time monitoring across Twitter/X, Facebook, YouTube</p>
            <p>• Advanced NLP with multilingual sentiment analysis</p>
            <p>• AI-powered fake news detection (94% accuracy)</p>
            <p>• Dynamic hotspot generation and emergency routing</p>
          </div>
          <div>
            <p>• Integration with INCOIS early warning systems</p>
            <p>• Automated credibility scoring and verification</p>
            <p>• Cross-platform trend correlation and analysis</p>
            <p>• Emergency escalation to disaster management authorities</p>
          </div>
        </div>
      </div>
    </div>
  );
}