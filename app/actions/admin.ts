'use server';

import { MongoClient, ObjectId } from 'mongodb';
import clientPromise from '@/lib/mongodb';
import { User, AIModel, ChatSession } from '@/types';
import { revalidatePath } from 'next/cache';
import { startOfDay, subDays, format } from 'date-fns';
import { sendModelNotificationEmail } from '@/lib/resend';

export async function getAdminStats() {
    const client = await clientPromise;
    const db = client.db();

    const [usersCount, sessionsCount, modelsCount] = await Promise.all([
        db.collection('users').countDocuments(),
        db.collection('sessions').countDocuments(),
        db.collection('models').countDocuments({ status: 'active' }),
    ]);

    return {
        usersCount,
        sessionsCount,
        activeModels: modelsCount,
    };
}

export async function getUsers() {
    const client = await clientPromise;
    const db = client.db();

    const users = await db.collection('users').find({}).toArray();

    return users.map(user => ({
        ...user,
        id: user._id.toString(),
        _id: user._id.toString(),
    }));
}

export async function toggleUserBan(userId: string, isBanned: boolean) {
    const client = await clientPromise;
    const db = client.db();

    await db.collection('users').updateOne(
        { _id: new ObjectId(userId) },
        { $set: { isBanned } }
    );

    revalidatePath('/admin/dashboard');
}

export async function deleteUser(userId: string) {
    const client = await clientPromise;
    const db = client.db();

    await db.collection('users').deleteOne({ _id: new ObjectId(userId) });

    revalidatePath('/admin/dashboard');
}

export async function getModels() {
    const client = await clientPromise;
    const db = client.db();

    const models = await db.collection('models').find({}).toArray();

    return models.map(model => ({
        ...model,
        id: model._id.toString(),
        _id: model._id.toString(),
    }));
}

// Helper to notify all users
async function notifyUsersOfModelChange(modelName: string, action: 'added' | 'updated', description?: string) {
    try {
        const client = await clientPromise;
        const db = client.db();
        const users = await db.collection('users').find({}, { projection: { email: 1 } }).toArray();
        const emails = users.map(u => u.email).filter(Boolean);

        if (emails.length > 0) {
            await sendModelNotificationEmail({
                to: emails,
                modelName,
                action,
                description
            });
        }
    } catch (error) {
        console.error('Failed to notify users:', error);
    }
}

export async function addModel(model: Omit<AIModel, 'id'>) {
    const client = await clientPromise;
    const db = client.db();

    await db.collection('models').insertOne({
        ...model,
        status: 'active',
        createdAt: new Date(),
    });

    // Notify users
    await notifyUsersOfModelChange(model.displayName, 'added', model.description);

    revalidatePath('/admin/dashboard');
}

export async function toggleModelStatus(modelId: string, status: 'active' | 'inactive') {
    const client = await clientPromise;
    const db = client.db();

    const result = await db.collection('models').findOneAndUpdate(
        { _id: new ObjectId(modelId) },
        { $set: { status } },
        { returnDocument: 'after' }
    );

    if (result?.value && status === 'active') {
        // Only notify if it was re-activated (or updated status)
        await notifyUsersOfModelChange(result.value.displayName, 'updated', result.value.description);
    }

    revalidatePath('/admin/dashboard');
}

export async function getAnalyticsData() {
    const client = await clientPromise;
    const db = client.db();

    const last7Days = Array.from({ length: 7 }, (_, i) => {
        const d = subDays(new Date(), 6 - i);
        return format(d, 'MMM dd');
    });

    // Aggregate sessions by day
    const sessions = await db.collection('sessions').aggregate([
        {
            $match: {
                createdAt: { $gte: subDays(new Date(), 7) }
            }
        },
        {
            $group: {
                _id: { $dateToString: { format: "%Y-%m-%d", date: "$createdAt" } },
                count: { $sum: 1 }
            }
        }
    ]).toArray();

    // Aggregate users by day
    const users = await db.collection('users').aggregate([
        {
            $match: {
                createdAt: { $gte: subDays(new Date(), 7) }
            }
        },
        {
            $group: {
                _id: { $dateToString: { format: "%Y-%m-%d", date: "$createdAt" } },
                count: { $sum: 1 }
            }
        }
    ]).toArray();

    const sessionMap = new Map(sessions.map(s => [format(new Date(s._id), 'MMM dd'), s.count]));
    const userMap = new Map(users.map(u => [format(new Date(u._id), 'MMM dd'), u.count]));

    return last7Days.map(date => ({
        name: date,
        users: userMap.get(date) || 0,
        sessions: sessionMap.get(date) || 0
    }));
}

export async function getActiveModels() {
    try {
        const client = await clientPromise;
        const db = client.db();

        const models = await db.collection('models').find({}).toArray();

        return models.map(model => ({
            ...model,
            id: model._id.toString(),
            _id: model._id.toString(),
        })) as unknown as AIModel[];
    } catch (error) {
        console.error('Failed to fetch active models:', error);
        return [];
    }
}

export async function getSystemSettings() {
    try {
        const client = await clientPromise;
        const db = client.db();

        const settings = await db.collection('settings').findOne({ type: 'global' });

        if (!settings) {
            // Return default settings if none exist
            return {
                siteName: 'Multiai',
                supportEmail: 'support@Multiai.ai',
                maintenanceMode: false,
                registrationEnabled: true,
                sessionDuration: 24,
                maxLoginAttempts: 5,
                defaultModel: 'GPT-4 Turbo',
                temperature: 0.7,
                systemPrompt: 'You are Multiai, a highly intelligent and helpful AI assistant designed to provide accurate, relevant, and engaging information to users...'
            };
        }

        const { _id, type, ...rest } = settings;
        return rest;
    } catch (error) {
        console.error('Failed to fetch system settings:', error);
        // Fallback to defaults if DB connection fails (e.g. during build)
        return {
            siteName: 'Multiai',
            supportEmail: 'support@Multiai.ai',
            maintenanceMode: false,
            registrationEnabled: true,
            sessionDuration: 24,
            maxLoginAttempts: 5,
            defaultModel: 'GPT-4 Turbo',
            temperature: 0.7,
            systemPrompt: 'You are Multiai, a highly intelligent and helpful AI assistant designed to provide accurate, relevant, and engaging information to users...'
        };
    }
}

export async function updateSystemSettings(settings: any) {
    const client = await clientPromise;
    const db = client.db();

    await db.collection('settings').updateOne(
        { type: 'global' },
        { $set: { ...settings, updatedAt: new Date() } },
        { upsert: true }
    );

    revalidatePath('/admin/settings');
    revalidatePath('/');
}

