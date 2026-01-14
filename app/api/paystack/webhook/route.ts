import { NextRequest, NextResponse } from 'next/server';
import crypto from 'crypto';
import clientPromise from '@/lib/mongodb';

export async function POST(req: NextRequest) {
    try {
        const body = await req.json();
        const secret = process.env.PAYSTACK_SECRET_KEY!;

        // Verify signature
        const signature = req.headers.get('x-paystack-signature');
        const hash = crypto.createHmac('sha512', secret).update(JSON.stringify(body)).digest('hex');

        if (hash !== signature) {
            return NextResponse.json({ error: 'Invalid signature' }, { status: 400 });
        }

        if (body.event === 'charge.success') {
            const { email } = body.data.customer;

            const client = await clientPromise;
            const users = client.db().collection('users');

            await users.updateOne(
                { email },
                { $set: { subscription: 'pro' } }
            );

            console.log(`User ${email} upgraded to Pro`);
        }

        return NextResponse.json({ status: 'success' });
    } catch (error) {
        console.error('Webhook processing error:', error);
        return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
    }
}
