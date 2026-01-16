import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { generateResponse } from '@/lib/groq';
import clientPromise from '@/lib/mongodb';
import { ObjectId } from 'mongodb';
import { getSystemSettings } from '@/app/actions/admin';

export async function POST(request: NextRequest) {
  try {
    const settings = await getSystemSettings();
    if (settings?.maintenanceMode) {
      return NextResponse.json(
        { error: 'The system is currently undergoing maintenance. AI models are temporarily unavailable.' },
        { status: 503 }
      );
    }

    const session = await getServerSession(authOptions);
    if (!session?.user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { message, modelIds, sessionId } = await request.json();

    if (!message || !modelIds || modelIds.length === 0) {
      return NextResponse.json(
        { error: 'Message and model IDs are required' },
        { status: 400 }
      );
    }

    const userSubscription = (session?.user as any)?.subscription || 'free';
    const modelLimit = userSubscription === 'pro' ? 10 : 5;

    if (modelIds.length > modelLimit) {
      return NextResponse.json(
        { error: `Free users can use up to 5 models. Pro users can use up to 10. Please upgrade or reduce your selection.` },
        { status: 403 }
      );
    }

    const client = await clientPromise;
    const db = client.db();
    const modelsCollection = db.collection('models');

    // 1. Save User Message
    if (sessionId) {
      await db.collection('messages').insertOne({
        sessionId,
        role: 'user',
        content: message,
        timestamp: new Date(),
      });
    }

    const responses = await Promise.allSettled(
      modelIds.map(async (modelId: string) => {
        // First try to find by string ID (matching what's in the DB)
        let model = await modelsCollection.findOne({ _id: new ObjectId(modelId) });

        // If not found, it might be an older hardcoded ID from the URL during transition
        if (!model) {
          model = await modelsCollection.findOne({ id: modelId });
        }

        if (!model) {
          throw new Error(`Model ${modelId} not found`);
        }

        const response = await generateResponse(message, model.name);
        return {
          modelId: model.id || model._id.toString(),
          modelName: model.displayName,
          ...response,
        };
      })
    );

    const results = responses.map((result, index) => {
      if (result.status === 'fulfilled') {
        return result.value;
      } else {
        return {
          modelId: modelIds[index],
          error: result.reason.message,
        };
      }
    });

    // 2. Save Assistant Response
    if (sessionId && results.some(r => !r.error)) {
      await db.collection('messages').insertOne({
        sessionId,
        role: 'assistant',
        content: results.map(r => r.content).join('\n\n'), // Simplified for now, or we can store the whole responses array
        modelResponses: results.reduce((acc: any, r: any) => {
          if (!r.error) {
            acc[r.modelId] = {
              content: r.content,
              timestamp: new Date(),
              likes: 0,
              dislikes: 0
            };
          }
          return acc;
        }, {}),
        timestamp: new Date(),
      });

      // Update session last updated time
      await db.collection('sessions').updateOne(
        { _id: new ObjectId(sessionId) },
        { $set: { updatedAt: new Date() } }
      );
    }

    return NextResponse.json({ responses: results });
  } catch (error) {
    console.error('Chat API error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}