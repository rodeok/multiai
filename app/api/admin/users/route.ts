import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { adminAuthOptions } from '@/lib/admin-auth';
import clientPromise from '@/lib/mongodb';
import { ObjectId } from 'mongodb';

export async function GET(request: NextRequest) {
  try {
    const session = await getServerSession(adminAuthOptions);
    if (!session?.user || session.user.role !== 'admin') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { searchParams } = new URL(request.url);
    const page = parseInt(searchParams.get('page') || '1');
    const limit = parseInt(searchParams.get('limit') || '10');
    const search = searchParams.get('search') || '';
    const role = searchParams.get('role') || '';
    const status = searchParams.get('status') || '';

    const client = await clientPromise;
    const users = client.db().collection('users');

    // Build filter
    const filter: any = {};
    if (search) {
      filter.$or = [
        { name: { $regex: search, $options: 'i' } },
        { email: { $regex: search, $options: 'i' } }
      ];
    }
    if (role && role !== 'all') {
      filter.role = role;
    }
    if (status && status !== 'all') {
      filter.status = status;
    }

    const skip = (page - 1) * limit;

    const [userList, totalCount] = await Promise.all([
      users.find(filter)
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(limit)
        .toArray(),
      users.countDocuments(filter)
    ]);

    return NextResponse.json({
      users: userList,
      totalCount,
      totalPages: Math.ceil(totalCount / limit),
      currentPage: page
    });
  } catch (error) {
    console.error('Admin users API error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

export async function DELETE(request: NextRequest) {
  try {
    const session = await getServerSession(adminAuthOptions);
    if (!session?.user || session.user.role !== 'admin') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { userIds } = await request.json();

    if (!userIds || !Array.isArray(userIds)) {
      return NextResponse.json(
        { error: 'Invalid user IDs' },
        { status: 400 }
      );
    }

    const client = await clientPromise;
    const users = client.db().collection('users');

    const result = await users.deleteMany({
      _id: { $in: userIds.map(id => new ObjectId(id)) }
    });

    return NextResponse.json({
      message: `${result.deletedCount} users deleted successfully`,
      deletedCount: result.deletedCount
    });
  } catch (error) {
    console.error('Admin delete users error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}