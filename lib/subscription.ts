import { Resend } from 'resend';
import clientPromise from './mongodb';

const resend = new Resend(process.env.RESEND_API_KEY);

export async function checkExpiringSubscriptions() {
    if (!process.env.RESEND_API_KEY) {
        console.error('RESEND_API_KEY is not set');
        return;
    }

    try {
        const client = await clientPromise;
        const db = client.db();
        const usersCollection = db.collection('users');

        // Find users whose subscription ends in exactly 3 days (approximate comparison)
        const threeDaysFromNow = new Date();
        threeDaysFromNow.setDate(threeDaysFromNow.getDate() + 3);

        const startOfDay = new Date(threeDaysFromNow.setHours(0, 0, 0, 0));
        const endOfDay = new Date(threeDaysFromNow.setHours(23, 59, 59, 999));

        const expiringUsers = await usersCollection.find({
            subscription: 'pro',
            subscriptionEndDate: {
                $gte: startOfDay,
                $lte: endOfDay
            }
        }).toArray();

        console.log(`Found ${expiringUsers.length} users with subscriptions expiring in 3 days.`);

        for (const user of expiringUsers) {
            await sendExpiryNotification(user.email, user.subscriptionEndDate);
        }

        // Also check for already expired subscriptions to downgrade them
        const now = new Date();
        const expiredUsers = await usersCollection.find({
            subscription: 'pro',
            subscriptionEndDate: { $lt: now }
        }).toArray();

        if (expiredUsers.length > 0) {
            console.log(`Downgrading ${expiredUsers.length} expired subscriptions.`);
            await usersCollection.updateMany(
                { _id: { $in: expiredUsers.map(u => u._id) } },
                { $set: { subscription: 'free' } }
            );
        }

    } catch (error) {
        console.error('Error checking expiring subscriptions:', error);
    }
}

async function sendExpiryNotification(email: string, expiryDate: Date) {
    try {
        await resend.emails.send({
            from: 'MultiAI <notifications@resend.dev>',
            to: email,
            subject: 'Your MultiAI Pro Subscription is Expiring Soon',
            html: `
                <div style="font-family: sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #e2e8f0; border-radius: 8px;">
                    <h2 style="color: #2563eb;">Subscription Reminder</h2>
                    <p>Hello,</p>
                    <p>Your <strong>MultiAI Pro</strong> subscription will expire on <strong>${expiryDate.toLocaleDateString()}</strong>.</p>
                    <p>To avoid losing access to pro features like increased model limits (up to 10 models), please renew your subscription.</p>
                    <div style="margin-top: 30px;">
                        <a href="${process.env.NEXTAUTH_URL}/upgrade" 
                           style="background-color: #2563eb; color: white; padding: 12px 24px; text-decoration: none; border-radius: 6px; font-weight: bold;">
                           Renew Now
                        </a>
                    </div>
                    <hr style="margin-top: 40px; border: 0; border-top: 1px solid #e2e8f0;" />
                    <p style="font-size: 12px; color: #94a3b8;">You are receiving this because you have an account on MultiAI.</p>
                </div>
            `
        });
        console.log(`Sent expiry notice to ${email}`);
    } catch (error) {
        console.error(`Failed to send email to ${email}:`, error);
    }
}
