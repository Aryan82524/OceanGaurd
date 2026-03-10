import { Hono } from 'npm:hono';
import { cors } from 'npm:hono/cors';
import { logger } from 'npm:hono/logger';
import { createClient } from 'npm:@supabase/supabase-js@2';
import * as kv from './kv_store.tsx';

const app = new Hono();

app.use('*', cors({
  origin: '*',
  allowMethods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowHeaders: ['Content-Type', 'Authorization'],
}));

app.use('*', logger(console.log));

const supabase = createClient(
  Deno.env.get('SUPABASE_URL')!,
  Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!,
);

// Initialize storage bucket
async function initializeBucket() {
  const bucketName = 'make-4387d93a-hazard-images';
  const { data: buckets } = await supabase.storage.listBuckets();
  const bucketExists = buckets?.some(bucket => bucket.name === bucketName);
  if (!bucketExists) {
    await supabase.storage.createBucket(bucketName, { public: false });
  }
}

initializeBucket();

// User registration
app.post('/make-server-4387d93a/signup', async (c) => {
  try {
    const { email, password, name, role = 'user' } = await c.req.json();
    
    const { data, error } = await supabase.auth.admin.createUser({
      email,
      password,
      user_metadata: { 
        name, 
        role,
        badges: [],
        points: 0,
        reportsSubmitted: 0
      },
      // Automatically confirm the user's email since an email server hasn't been configured.
      email_confirm: true
    });

    if (error) {
      console.log(`Error creating user during signup: ${error.message}`);
      return c.json({ error: error.message }, 400);
    }

    return c.json({ user: data.user });
  } catch (error) {
    console.log(`Server error during user signup: ${error}`);
    return c.json({ error: 'Internal server error' }, 500);
  }
});

// Submit hazard report
app.post('/make-server-4387d93a/reports', async (c) => {
  try {
    const accessToken = c.req.header('Authorization')?.split(' ')[1];
    const { data: { user }, error: authError } = await supabase.auth.getUser(accessToken);
    
    if (!user?.id) {
      return c.json({ error: 'Unauthorized' }, 401);
    }

    const { type, description, latitude, longitude, severity, imageUrl } = await c.req.json();
    
    const reportId = crypto.randomUUID();
    const report = {
      id: reportId,
      userId: user.id,
      userEmail: user.email,
      userName: user.user_metadata?.name || 'Anonymous',
      type,
      description,
      latitude,
      longitude,
      severity,
      imageUrl,
      status: 'pending',
      timestamp: new Date().toISOString(),
      upvotes: 0,
      verifiedBy: []
    };

    await kv.set(`report:${reportId}`, report);
    
    // Update user points and reports count
    const userKey = `user:${user.id}`;
    const userData = await kv.get(userKey) || {
      id: user.id,
      email: user.email,
      name: user.user_metadata?.name,
      role: user.user_metadata?.role || 'user',
      points: 0,
      reportsSubmitted: 0,
      badges: []
    };
    
    userData.points += 10;
    userData.reportsSubmitted += 1;
    
    // Award badges
    if (userData.reportsSubmitted === 1 && !userData.badges.includes('First Reporter')) {
      userData.badges.push('First Reporter');
    }
    if (userData.reportsSubmitted >= 5 && !userData.badges.includes('Ocean Guardian')) {
      userData.badges.push('Ocean Guardian');
    }
    if (userData.reportsSubmitted >= 10 && !userData.badges.includes('Environmental Hero')) {
      userData.badges.push('Environmental Hero');
    }
    
    await kv.set(userKey, userData);

    return c.json({ 
      report,
      userUpdate: {
        points: userData.points,
        reportsSubmitted: userData.reportsSubmitted,
        badges: userData.badges
      }
    });
  } catch (error) {
    console.log(`Error submitting hazard report: ${error}`);
    return c.json({ error: 'Failed to submit report' }, 500);
  }
});

// Get all reports
app.get('/make-server-4387d93a/reports', async (c) => {
  try {
    const reports = await kv.getByPrefix('report:');
    const sortedReports = reports
      .map(r => r.value)
      .sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime());
    
    return c.json({ reports: sortedReports });
  } catch (error) {
    console.log(`Error fetching reports: ${error}`);
    return c.json({ error: 'Failed to fetch reports' }, 500);
  }
});

// Get user profile
app.get('/make-server-4387d93a/profile', async (c) => {
  try {
    const accessToken = c.req.header('Authorization')?.split(' ')[1];
    const { data: { user }, error: authError } = await supabase.auth.getUser(accessToken);
    
    if (!user?.id) {
      return c.json({ error: 'Unauthorized' }, 401);
    }

    const userKey = `user:${user.id}`;
    const userData = await kv.get(userKey) || {
      id: user.id,
      email: user.email,
      name: user.user_metadata?.name,
      role: user.user_metadata?.role || 'user',
      points: 0,
      reportsSubmitted: 0,
      badges: []
    };

    return c.json({ profile: userData });
  } catch (error) {
    console.log(`Error fetching user profile: ${error}`);
    return c.json({ error: 'Failed to fetch profile' }, 500);
  }
});

// Admin: Update report status
app.put('/make-server-4387d93a/admin/reports/:id', async (c) => {
  try {
    const accessToken = c.req.header('Authorization')?.split(' ')[1];
    const { data: { user }, error: authError } = await supabase.auth.getUser(accessToken);
    
    if (!user?.id) {
      return c.json({ error: 'Unauthorized' }, 401);
    }

    // Check if user is admin
    const userKey = `user:${user.id}`;
    const userData = await kv.get(userKey);
    if (!userData || userData.role !== 'admin') {
      return c.json({ error: 'Admin access required' }, 403);
    }

    const reportId = c.req.param('id');
    const { status } = await c.req.json();
    
    const report = await kv.get(`report:${reportId}`);
    if (!report) {
      return c.json({ error: 'Report not found' }, 404);
    }

    report.status = status;
    report.reviewedBy = user.email;
    report.reviewedAt = new Date().toISOString();

    await kv.set(`report:${reportId}`, report);

    return c.json({ report });
  } catch (error) {
    console.log(`Error updating report status: ${error}`);
    return c.json({ error: 'Failed to update report' }, 500);
  }
});

// Upvote report
app.post('/make-server-4387d93a/reports/:id/upvote', async (c) => {
  try {
    const accessToken = c.req.header('Authorization')?.split(' ')[1];
    const { data: { user }, error: authError } = await supabase.auth.getUser(accessToken);
    
    if (!user?.id) {
      return c.json({ error: 'Unauthorized' }, 401);
    }

    const reportId = c.req.param('id');
    const report = await kv.get(`report:${reportId}`);
    
    if (!report) {
      return c.json({ error: 'Report not found' }, 404);
    }

    if (!report.verifiedBy.includes(user.id)) {
      report.upvotes += 1;
      report.verifiedBy.push(user.id);
      await kv.set(`report:${reportId}`, report);
    }

    return c.json({ report });
  } catch (error) {
    console.log(`Error upvoting report: ${error}`);
    return c.json({ error: 'Failed to upvote report' }, 500);
  }
});

// Get social media analytics (simulated data)
app.get('/make-server-4387d93a/analytics', async (c) => {
  try {
    // Simulated social media analytics data
    const analyticsData = {
      sentimentTrends: [
        { date: '2024-01-01', positive: 65, negative: 20, neutral: 15 },
        { date: '2024-01-02', positive: 70, negative: 18, neutral: 12 },
        { date: '2024-01-03', positive: 60, negative: 25, neutral: 15 },
        { date: '2024-01-04', positive: 75, negative: 15, neutral: 10 },
        { date: '2024-01-05', positive: 80, negative: 12, neutral: 8 }
      ],
      trendingHashtags: [
        { tag: '#OceanCleanup', mentions: 1250, sentiment: 'positive' },
        { tag: '#PlasticPollution', mentions: 980, sentiment: 'negative' },
        { tag: '#MarineLife', mentions: 750, sentiment: 'neutral' },
        { tag: '#OilSpill', mentions: 650, sentiment: 'negative' },
        { tag: '#BeachCleanup', mentions: 580, sentiment: 'positive' }
      ],
      platformStats: {
        twitter: { posts: 1250, engagement: 85 },
        facebook: { posts: 890, engagement: 72 },
        instagram: { posts: 650, engagement: 94 }
      }
    };

    return c.json(analyticsData);
  } catch (error) {
    console.log(`Error fetching analytics: ${error}`);
    return c.json({ error: 'Failed to fetch analytics' }, 500);
  }
});

// Get dashboard stats
app.get('/make-server-4387d93a/stats', async (c) => {
  try {
    const reports = await kv.getByPrefix('report:');
    const reportData = reports.map(r => r.value);
    
    const stats = {
      totalReports: reportData.length,
      pendingReports: reportData.filter(r => r.status === 'pending').length,
      approvedReports: reportData.filter(r => r.status === 'approved').length,
      rejectedReports: reportData.filter(r => r.status === 'rejected').length,
      reportsByType: {
        'oil-spill': reportData.filter(r => r.type === 'oil-spill').length,
        'plastic-waste': reportData.filter(r => r.type === 'plastic-waste').length,
        'dangerous-tide': reportData.filter(r => r.type === 'dangerous-tide').length,
        'stranded-animal': reportData.filter(r => r.type === 'stranded-animal').length,
        'other': reportData.filter(r => r.type === 'other').length
      },
      recentActivity: reportData
        .sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime())
        .slice(0, 5)
    };

    return c.json(stats);
  } catch (error) {
    console.log(`Error fetching stats: ${error}`);
    return c.json({ error: 'Failed to fetch stats' }, 500);
  }
});

Deno.serve(app.fetch);