import { NextRequest, NextResponse } from 'next/server';
import { validateCoupon } from '@/app/actions/coupons';

export async function POST(req: NextRequest) {
    try {
        const { code } = await req.json();
        if (!code) {
            return NextResponse.json({ error: 'Code is required' }, { status: 400 });
        }

        const result = await validateCoupon(code);
        return NextResponse.json(result);
    } catch (error) {
        return NextResponse.json({ error: 'Failed to validate coupon' }, { status: 500 });
    }
}
