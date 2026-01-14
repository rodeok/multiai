import { NextRequest, NextResponse } from 'next/server';
import { verifyPayment } from '@/lib/paystack';

export async function GET(req: NextRequest) {
    const { searchParams } = new URL(req.url);
    const reference = searchParams.get('reference');

    if (!reference) {
        return NextResponse.redirect(`${process.env.NEXTAUTH_URL}/workspace?error=no_reference`);
    }

    try {
        const data = await verifyPayment(reference);

        if (data.status && data.data.status === 'success') {
            // Payment was successful. 
            // Note: Webhook also handles DB update for reliability.
            return NextResponse.redirect(`${process.env.NEXTAUTH_URL}/workspace?upgraded=success`);
        } else {
            return NextResponse.redirect(`${process.env.NEXTAUTH_URL}/workspace?upgraded=failed`);
        }
    } catch (error) {
        console.error('Payment verification redirect error:', error);
        return NextResponse.redirect(`${process.env.NEXTAUTH_URL}/workspace?upgraded=error`);
    }
}
