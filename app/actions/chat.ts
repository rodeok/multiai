'use server';

import { MongoClient, ObjectId } from 'mongodb';
import clientPromise from '@/lib/mongodb';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { revalidatePath } from 'next/cache';

export async function getChatSessions() {
    const session = await getServerSession(authOptions);
    if (!session?.user?.id) return [];

    const client = await clientPromise;
    const db = client.db();
    const sessions = await db.collection('sessions')
        .find({ userId: session.user.id })
        .sort({ updatedAt: -1 })
        .toArray();

    return sessions.map(s => ({
        ...s,
        id: s._id.toString(),
        _id: s._id.toString(),
    }));
}

export async function getChatSession(sessionId: string) {
    const session = await getServerSession(authOptions);
    if (!session?.user?.id) return null;

    const client = await clientPromise;
    const db = client.db();
    const chatSession = await db.collection('sessions').findOne({
        _id: new ObjectId(sessionId),
        userId: session.user.id
    });

    if (!chatSession) return null;

    return {
        ...chatSession,
        id: chatSession._id.toString(),
        _id: chatSession._id.toString(),
    };
}


export async function getChatMessages(sessionId: string) {
    const session = await getServerSession(authOptions);
    if (!session?.user) return [];

    const client = await clientPromise;
    const db = client.db();
    const messages = await db.collection('messages')
        .find({ sessionId: sessionId })
        .sort({ timestamp: 1 })
        .toArray();

    return messages.map(m => ({
        ...m,
        id: m._id.toString(),
        _id: m._id.toString(),
    }));
}

export async function createChatSession(title: string, selectedModels: string[]) {
    const session = await getServerSession(authOptions);
    if (!session?.user?.id) throw new Error('Unauthorized');

    const client = await clientPromise;
    const db = client.db();

    const result = await db.collection('sessions').insertOne({
        userId: session.user.id,
        title,
        selectedModels,
        createdAt: new Date(),
        updatedAt: new Date(),
    });

    revalidatePath('/chat');
    return result.insertedId.toString();
}

export async function updateChatSessionTitle(sessionId: string, title: string) {
    const session = await getServerSession(authOptions);
    if (!session?.user) throw new Error('Unauthorized');

    const client = await clientPromise;
    const db = client.db();

    await db.collection('sessions').updateOne(
        { _id: new ObjectId(sessionId) },
        { $set: { title, updatedAt: new Date() } }
    );

    revalidatePath('/chat');
}

export async function deleteChatSession(sessionId: string) {
    const session = await getServerSession(authOptions);
    if (!session?.user) throw new Error('Unauthorized');

    const client = await clientPromise;
    const db = client.db();

    // Delete session and its messages
    await Promise.all([
        db.collection('sessions').deleteOne({ _id: new ObjectId(sessionId) }),
        db.collection('messages').deleteMany({ sessionId })
    ]);

    revalidatePath('/chat');
}
