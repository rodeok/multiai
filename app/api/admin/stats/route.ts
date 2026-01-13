import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { adminAuthOptions } from '@/lib/admin-auth';
import clientPromise from '@/lib/mongodb';

export async function GET(request: NextRequest) {
  try {
    const session = await getServerSession(adminAuthOptions);
    if (!session?.user || session.user.role !== 'admin') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const client = await clientPromise;
    const db = client.db();

    // Get current date for calculations
    const now = new Date();
    const yesterday = new Date(now.getTime() - 24 * 60 * 60 * 1000);
    const lastWeek = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);

    // Parallel queries for better performance
    const [
      totalUsers,
      usersYesterday,
      totalSessions,
      sessionsYesterday,
      activeModels,
      newSignupsToday,
      newSignupsYesterday
    ] = await Promise.all([
      db.collection('users').countDocuments(),
      db.collection('users').countDocuments({ createdAt: { $lt: yesterday } }),
      db.collection('chat_sessions').countDocuments(),
      db.collection('chat_sessions').countDocuments({ createdAt: { $lt: yesterday } }),
      db.collection('ai_models').countDocuments({ status: 'active' }),
      db.collection('users').countDocuments({ 
        createdAt: { $gte: yesterday } 
      }),
      db.collection('users').countDocuments({ 
        createdAt: { 
          $gte: new Date(yesterday.getTime() - 24 * 60 * 60 * 1000),
          $lt: yesterday 
        } 
      })
    ]);

    // Calculate growth percentages
    const userGrowth = usersYesterday > 0 
      ? ((totalUsers - usersYesterday) / usersYesterday * 100).toFixed(1)
      : '0';

    const sessionGrowth = sessionsYesterday > 0 
      ? ((totalSessions - sessionsYesterday) / sessionsYesterday * 100).toFixed(1)
      : '0';

    const signupGrowth = newSignupsYesterday > 0 
      ? ((newSignupsToday - newSignupsYesterday) / newSignupsYesterday * 100).toFixed(1)
      : '0';

    // Mock API costs calculation (you'd implement real cost tracking)
    const apiCosts = 4230.50;
    const costGrowth = 15.4;

    const stats = {
      totalUsers,
      totalSessions,
      activeModels,
      apiCosts,
      newSignupsToday,
      userGrowth: parseFloat(userGrowth),
      sessionGrowth: parseFloat(sessionGrowth),
      signupGrowth: parseFloat(signupGrowth),
      costGrowth,
      activeSessions: 1203 // Mock active sessions
    };

    return NextResponse.json(stats);
  } catch (error) {
    console.error('Admin stats API error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}