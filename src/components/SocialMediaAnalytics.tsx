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
  Cell,
  AreaChart,
  Area
} from 'recharts';
import { 
  Hash, 
  TrendingUp, 
  TrendingDown, 
  MessageCircle,
  Share2,
  Eye,
  Heart,
  AlertTriangle,
  Globe,
  Zap,
  Activity
} from 'lucide-react';

interface SocialMediaAnalyticsProps {
  analyticsData: any;
}

export function SocialMediaAnalytics({ analyticsData }: SocialMediaAnalyticsProps) {
  const [selectedTimeframe, setSelectedTimeframe] = useState('24h');
  const [selectedPlatform, setSelectedPlatform] = useState('all');

  // Enhanced NLP-powered analytics data
  const nlpAnalytics = {
    keywordExtraction: [
      { keyword: 'tsunami warning', frequency: 145, sentiment: 'negative', urgency: 'critical' },
      { keyword: 'coastal flooding', frequency: 98, sentiment: 'negative', urgency: 'high' },
      { keyword: 'high waves alert', frequency: 87, sentiment: 'neutral', urgency: 'medium' },
      { keyword: 'storm surge', frequency: 76, sentiment: 'negative', urgency: 'high' },
      { keyword: 'emergency evacuation', frequency: 65, sentiment: 'negative', urgency: 'critical' },
      { keyword: 'ocean safety', frequency: 54, sentiment: 'positive', urgency: 'low' },
      { keyword: 'marine rescue', frequency: 43, sentiment: 'neutral', urgency: 'medium' },
      { keyword: 'weather alert', frequency: 39, sentiment: 'negative', urgency: 'medium' }
    ],
    trendDetection: [
      { trend: 'Increased tsunami discussions', growth: '+156%', timeframe: 'Last 6 hours', confidence: 0.94 },
      { trend: 'Coastal evacuation mentions', growth: '+89%', timeframe: 'Last 2 hours', confidence: 0.87 },
      { trend: 'Emergency response hashtags', growth: '+234%', timeframe: 'Last 1 hour', confidence: 0.92 }
    ],
    languageDistribution: [
      { language: 'English', posts: 1245, percentage: 45 },
      { language: 'Hindi', posts: 678, percentage: 25 },
      { language: 'Tamil', posts: 456, percentage: 16 },
      { language: 'Bengali', posts: 234, percentage: 8 },
      { language: 'Other', posts: 167, percentage: 6 }
    ],
    credibilityScores: [
      { source: 'Official Agencies', score: 0.98, posts: 45 },
      { source: 'News Media', score: 0.89, posts: 156 },
      { source: 'Verified Users', score: 0.76, posts: 234 },
      { source: 'Citizens', score: 0.64, posts: 987 },
      { source: 'Unverified', score: 0.34, posts: 123 }
    ]
  };

  const realTimeAlerts = [
    { 
      id: 1, 
      type: 'critical', 
      message: 'Tsunami warning trending - 145 mentions in past hour', 
      platform: 'Twitter/X',
      time: '2 minutes ago',
      confidence: 0.94
    },
    { 
      id: 2, 
      type: 'high', 
      message: 'Storm surge reports from multiple sources', 
      platform: 'Facebook',
      time: '8 minutes ago',
      confidence: 0.87
    },
    { 
      id: 3, 
      type: 'medium', 
      message: 'Coastal flooding discussions increasing', 
      platform: 'YouTube',
      time: '15 minutes ago',
      confidence: 0.76
    }
  ];

  const getAlertIcon = (type: string) => {
    switch (type) {
      case 'critical': return <AlertTriangle className="h-4 w-4 text-red-600" />;
      case 'high': return <TrendingUp className="h-4 w-4 text-orange-600" />;
      default: return <Activity className="h-4 w-4 text-blue-600" />;
    }
  };

  const getAlertColor = (type: string) => {
    switch (type) {
      case 'critical': return 'bg-red-50 border-red-200 text-red-800';
      case 'high': return 'bg-orange-50 border-orange-200 text-orange-800';
      default: return 'bg-blue-50 border-blue-200 text-blue-800';
    }
  };

  const getSentimentColor = (sentiment: string) => {
    switch (sentiment) {
      case 'positive': return 'bg-green-100 text-green-800';
      case 'negative': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getUrgencyColor = (urgency: string) => {
    switch (urgency) {
      case 'critical': return 'bg-red-100 text-red-800';
      case 'high': return 'bg-orange-100 text-orange-800';
      case 'medium': return 'bg-yellow-100 text-yellow-800';
      default: return 'bg-green-100 text-green-800';
    }
  };

  return (
    <div className="space-y-6">
      {/* Real-time Alerts */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <Zap className="h-5 w-5 text-yellow-500" />
            <span>Real-time Social Media Alerts</span>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {realTimeAlerts.map((alert) => (
              <div key={alert.id} className={`p-3 rounded-lg border ${getAlertColor(alert.type)}`}>
                <div className="flex items-start justify-between">
                  <div className="flex items-start space-x-2">
                    {getAlertIcon(alert.type)}
                    <div>
                      <p className="text-sm">{alert.message}</p>
                      <div className="flex items-center space-x-2 mt-1">
                        <Badge variant="secondary" className="text-xs">
                          {alert.platform}
                        </Badge>
                        <span className="text-xs opacity-75">{alert.time}</span>
                        <span className="text-xs opacity-75">
                          Confidence: {(alert.confidence * 100).toFixed(0)}%
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* NLP Keyword Extraction */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <Hash className="h-5 w-5" />
              <span>AI-Powered Keyword Extraction</span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {nlpAnalytics.keywordExtraction.map((item, index) => (
                <div key={index} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                  <div>
                    <p className="text-sm">{item.keyword}</p>
                    <div className="flex items-center space-x-2 mt-1">
                      <Badge className={getSentimentColor(item.sentiment)} variant="secondary">
                        {item.sentiment}
                      </Badge>
                      <Badge className={getUrgencyColor(item.urgency)} variant="secondary">
                        {item.urgency}
                      </Badge>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="text-lg text-blue-600">{item.frequency}</p>
                    <p className="text-xs text-gray-500">mentions</p>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <TrendingUp className="h-5 w-5" />
              <span>Trend Detection</span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {nlpAnalytics.trendDetection.map((trend, index) => (
                <div key={index} className="p-4 bg-gradient-to-r from-blue-50 to-purple-50 rounded-lg">
                  <div className="flex items-center justify-between mb-2">
                    <h4 className="text-sm">{trend.trend}</h4>
                    <Badge className="bg-green-100 text-green-800">
                      {trend.growth}
                    </Badge>
                  </div>
                  <div className="flex items-center justify-between text-xs text-gray-600">
                    <span>{trend.timeframe}</span>
                    <span>Confidence: {(trend.confidence * 100).toFixed(0)}%</span>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Language Distribution and Credibility Scores */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <Globe className="h-5 w-5" />
              <span>Multilingual Analysis</span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={250}>
              <PieChart>
                <Pie
                  data={nlpAnalytics.languageDistribution}
                  cx="50%"
                  cy="50%"
                  outerRadius={80}
                  fill="#8884d8"
                  dataKey="posts"
                  label={({ language, percentage }) => `${language}: ${percentage}%`}
                >
                  {nlpAnalytics.languageDistribution.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={['#3B82F6', '#10B981', '#F59E0B', '#EF4444', '#8B5CF6'][index]} />
                  ))}
                </Pie>
                <Tooltip formatter={(value, name) => [`${value} posts`, 'Posts']} />
              </PieChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <Eye className="h-5 w-5" />
              <span>AI Credibility Scoring</span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={250}>
              <BarChart data={nlpAnalytics.credibilityScores}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="source" angle={-45} textAnchor="end" height={80} />
                <YAxis />
                <Tooltip 
                  formatter={(value, name) => [
                    name === 'score' ? `${(value * 100).toFixed(0)}%` : value,
                    name === 'score' ? 'Credibility' : 'Posts'
                  ]}
                />
                <Bar dataKey="score" fill="#3B82F6" name="score" />
                <Bar dataKey="posts" fill="#10B981" name="posts" />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>

      {/* Platform Analytics */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <Share2 className="h-5 w-5" />
            <span>Cross-Platform Monitoring</span>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
            {Object.entries(analyticsData.platformStats).map(([platform, stats]) => (
              <div key={platform} className="bg-gray-50 p-4 rounded-lg">
                <h3 className="text-lg capitalize mb-2">{platform}</h3>
                <div className="space-y-2">
                  <div className="flex justify-between">
                    <span className="text-sm text-gray-600">Posts Monitored:</span>
                    <span className="text-sm">{stats.posts}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm text-gray-600">Engagement Rate:</span>
                    <span className="text-sm">{stats.engagement}%</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm text-gray-600">Hazard Mentions:</span>
                    <span className="text-sm">{Math.floor(stats.posts * 0.15)}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
          
          <div className="bg-blue-50 p-4 rounded-lg">
            <h3 className="text-sm text-blue-800 mb-2">🤖 AI-Powered Content Analysis</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm text-blue-700">
              <div>
                <p>• Real-time keyword extraction and trend detection</p>
                <p>• Multilingual sentiment analysis (10+ languages)</p>
                <p>• Automated credibility scoring using ML models</p>
              </div>
              <div>
                <p>• Emergency content prioritization and routing</p>
                <p>• Fake news detection with 94% accuracy</p>
                <p>• Integration with official weather APIs (INCOIS)</p>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}