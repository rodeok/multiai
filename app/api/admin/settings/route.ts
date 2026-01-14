import { NextResponse } from 'next/server';
import { getSystemSettings } from '@/app/actions/admin';

export async function GET() {
    try {
        const settings = await getSystemSettings();
        return NextResponse.json(settings);
    } catch (error) {
        return NextResponse.json({ error: 'Failed to fetch settings' }, { status: 500 });
    }
}
