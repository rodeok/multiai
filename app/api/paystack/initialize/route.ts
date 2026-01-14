import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { initializePayment } from '@/lib/paystack';

export async function POST(req: NextRequest) {
    try {
        const session = await getServerSession(authOptions);
        if (!session || !session.user) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }

        const { amount, couponCode } = await req.json();

        // Double check amount and apply coupon if present
        let finalAmount = amount;
        if (couponCode) {
            const { validateCoupon } = await import('@/app/actions/coupons');
            const coupon = await validateCoupon(couponCode);
            if (!coupon.error) {
                // We re-calculate to be safe from client-side manipulation
                const { getSystemSettings } = await import('@/app/actions/admin');
                const settings = await getSystemSettings();
                const basePrice = settings.proPriceNgn || 4000;

                if (coupon.discountType === 'percentage') {
                    finalAmount = basePrice - (basePrice * (coupon.discountAmount / 100));
                } else {
                    finalAmount = Math.max(0, basePrice - coupon.discountAmount);
                }
            }
        }

        if (finalAmount <= 0) {
            // Free upgrade!
            const client = await (await import('@/lib/mongodb')).default;
            const db = client.db();
            await db.collection('users').updateOne(
                { email: session.user.email },
                { $set: { subscription: 'pro' } }
            );

            // Mark coupon as used if applied
            if (couponCode) {
                await db.collection('coupons').updateOne(
                    { code: couponCode.toUpperCase() },
                    { $inc: { usageCount: 1 } }
                );
            }

            return NextResponse.json({ success: true, message: 'Upgraded to Pro!' });
        }

        const paymentData = await initializePayment(session.user.email!, finalAmount);

        if (paymentData.status) {
            return NextResponse.json({ url: paymentData.data.authorization_url });
        } else {
            return NextResponse.json({
                error: paymentData.message || 'Failed to initialize payment',
                details: paymentData
            }, { status: 500 });
        }
    } catch (error: any) {
        console.error('Payment initialization error:', error);
        return NextResponse.json({
            error: error.message || 'Internal server error',
            stack: process.env.NODE_ENV === 'development' ? error.stack : undefined
        }, { status: 500 });
    }
}
