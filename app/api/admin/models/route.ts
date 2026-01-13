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
    const models = client.db().collection('ai_models');

    const modelList = await models.find({}).sort({ createdAt: -1 }).toArray();

    return NextResponse.json({ models: modelList });
  } catch (error) {
    console.error('Admin models API error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(adminAuthOptions);
    if (!session?.user || session.user.role !== 'admin') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { name, displayName, provider, description, apiEndpoint, capabilities, pricing } = await request.json();

    if (!name || !displayName || !provider) {
      return NextResponse.json(
        { error: 'Name, display name, and provider are required' },
        { status: 400 }
      );
    }

    const client = await clientPromise;
    const models = client.db().collection('ai_models');

    // Check if model already exists
    const existingModel = await models.findOne({ name });
    if (existingModel) {
      return NextResponse.json(
        { error: 'Model with this name already exists' },
        { status: 400 }
      );
    }

    const newModel = {
      name,
      displayName,
      provider,
      description: description || '',
      apiEndpoint: apiEndpoint || '',
      capabilities: capabilities || [],
      pricing: pricing || 'premium',
      status: 'active',
      totalRequests: 0,
      successRate: 100,
      avgResponseTime: 0,
      createdAt: new Date(),
      updatedAt: new Date(),
      createdBy: session.user.id
    };

    const result = await models.insertOne(newModel);

    return NextResponse.json(
      { 
        message: 'Model added successfully', 
        modelId: result.insertedId,
        model: newModel
      },
      { status: 201 }
    );
  } catch (error) {
    console.error('Admin add model error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}