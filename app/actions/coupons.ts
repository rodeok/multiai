'use server';

import { MongoClient, ObjectId } from 'mongodb';
import clientPromise from '@/lib/mongodb';
import { revalidatePath } from 'next/cache';
import { Resend } from 'resend';

const resend = new Resend(process.env.RESEND_API_KEY);

export interface Coupon {
    id: string;
    code: string;
    discountType: 'percentage' | 'fixed';
    discountAmount: number;
    expiryDate?: Date;
    usageLimit?: number;
    usageCount: number;
    isActive: boolean;
}

export async function getCoupons() {
    const client = await clientPromise;
    const db = client.db();
    const coupons = await db.collection('coupons').find({}).toArray();
    return coupons.map(c => ({
        ...c,
        id: c._id.toString(),
        _id: c._id.toString()
    }));
}

export async function createCoupon(coupon: Omit<Coupon, 'id' | 'usageCount' | 'isActive'>) {
    const client = await clientPromise;
    const db = client.db();

    const result = await db.collection('coupons').insertOne({
        ...coupon,
        usageCount: 0,
        isActive: true,
        createdAt: new Date()
    });

    revalidatePath('/admin/coupons');
    return result.insertedId.toString();
}

export async function deleteCoupon(id: string) {
    const client = await clientPromise;
    const db = client.db();
    await db.collection('coupons').deleteOne({ _id: new ObjectId(id) });
    revalidatePath('/admin/coupons');
}

export async function validateCoupon(code: string) {
    const client = await clientPromise;
    const db = client.db();

    const coupon = await db.collection('coupons').findOne({
        code: code.toUpperCase(),
        isActive: true
    });

    if (!coupon) return { error: 'Invalid coupon' };

    if (coupon.expiryDate && new Date(coupon.expiryDate) < new Date()) {
        return { error: 'Coupon has expired' };
    }

    if (coupon.usageLimit && coupon.usageCount >= coupon.usageLimit) {
        return { error: 'Coupon usage limit reached' };
    }

    return {
        id: coupon._id.toString(),
        code: coupon.code,
        discountType: coupon.discountType,
        discountAmount: coupon.discountAmount
    };
}

export async function sendCouponEmail(email: string, code: string, discountInfo: string) {
    if (!process.env.RESEND_API_KEY) {
        throw new Error('Email service not configured');
    }

    try {
        await resend.emails.send({
            from: 'MultiAI <coupons@resend.dev>',
            to: email,
            subject: 'Your MultiAI Exclusive Discount Code!',
            html: `
        <div style="font-family: sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
          <h2 style="color: #2563eb;">Special Offer for You!</h2>
          <p>We're excited to offer you a special discount on our Pro plan.</p>
          <div style="background: #f8fafc; padding: 20px; border-radius: 8px; text-align: center; margin: 20px 0;">
            <p style="margin: 0; color: #64748b; font-size: 14px;">Use code:</p>
            <h1 style="margin: 10px 0; color: #1e293b; letter-spacing: 2px;">${code.toUpperCase()}</h1>
            <p style="margin: 0; color: #2563eb; font-weight: bold;">${discountInfo}</p>
          </div>
          <p>This code can be applied at checkout when you upgrade your account.</p>
          <div style="margin-top: 30px;">
            <a href="${process.env.NEXTAUTH_URL}/upgrade" style="background: #2563eb; color: white; padding: 12px 24px; text-decoration: none; border-radius: 6px; font-weight: bold;">Claim Discount</a>
          </div>
        </div>
      `
        });
        return { success: true };
    } catch (error) {
        console.error('Email error:', error);
        throw error;
    }
}
