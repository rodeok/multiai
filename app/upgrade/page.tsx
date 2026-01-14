'use client';

import { useState, useEffect } from 'react';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { FaCheckCircle, FaRocket, FaGem, FaArrowLeft } from 'react-icons/fa';

export default function Upgrade() {
    const { data: session } = useSession();
    const router = useRouter();
    const [loading, setLoading] = useState(false);
    const [couponCode, setCouponCode] = useState('');
    const [couponError, setCouponError] = useState('');
    const [discount, setDiscount] = useState<{ type: string, amount: number } | null>(null);
    const [pricing, setPricing] = useState({ proPriceNgn: 4000, proPriceUsd: 5 });

    const userSubscription = (session?.user as any)?.subscription || 'free';
    const isPro = userSubscription === 'pro';

    useEffect(() => {
        async function fetchSettings() {
            try {
                const response = await fetch('/api/admin/settings');
                const data = await response.json();
                if (data.proPriceNgn) {
                    setPricing({
                        proPriceNgn: data.proPriceNgn,
                        proPriceUsd: data.proPriceUsd
                    });
                }
            } catch (error) {
                console.error('Failed to fetch pricing:', error);
            }
        }
        fetchSettings();
    }, []);

    const applyCoupon = async () => {
        if (!couponCode.trim()) return;
        setLoading(true);
        setCouponError('');
        try {
            const response = await fetch('/api/coupons/validate', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ code: couponCode })
            });
            const data = await response.json();
            if (data.error) {
                setCouponError(data.error);
                setDiscount(null);
            } else {
                setDiscount({ type: data.discountType, amount: data.discountAmount });
                setCouponError('');
            }
        } catch (error) {
            setCouponError('Error validating coupon');
        } finally {
            setLoading(false);
        }
    };

    const calculateFinalPrice = () => {
        let price = pricing.proPriceNgn;
        if (!discount) return price;
        if (discount.type === 'percentage') {
            return price - (price * (discount.amount / 100));
        } else {
            return Math.max(0, price - discount.amount);
        }
    };

    const finalPrice = calculateFinalPrice();

    const handleUpgrade = async () => {
        setLoading(true);
        try {
            const response = await fetch('/api/paystack/initialize', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    amount: finalPrice,
                    couponCode: discount ? couponCode : undefined
                }),
            });

            const data = await response.json();
            if (data.url) {
                window.location.href = data.url;
            } else if (data.success) {
                // Free upgrade (100% discount)
                router.push('/workspace?upgraded=success');
            } else {
                alert(data.error || 'Failed to initialize payment');
            }
        } catch (error) {
            console.error('Upgrade error:', error);
            alert('An error occurred. Please try again.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-slate-900 text-white selection:bg-blue-500/30">
            {/* Background decoration */}
            <div className="fixed inset-0 overflow-hidden pointer-events-none">
                <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-blue-500/10 blur-[120px] rounded-full"></div>
                <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-purple-500/10 blur-[120px] rounded-full"></div>
            </div>

            <div className="relative max-w-7xl mx-auto px-6 py-12">
                <button
                    onClick={() => router.back()}
                    className="flex items-center gap-2 text-gray-400 hover:text-white transition-colors mb-12 group"
                >
                    <FaArrowLeft className="group-hover:-translate-x-1 transition-transform" /> Back to Workspace
                </button>

                <div className="text-center mb-16">
                    <h1 className="text-4xl md:text-6xl font-black mb-6 bg-gradient-to-r from-blue-400 via-purple-400 to-pink-400 bg-clip-text text-transparent">
                        Power Up Your Experience
                    </h1>
                    <p className="text-gray-400 text-lg md:text-xl max-w-2xl mx-auto">
                        Choose the plan that fits your workflow. Compare more models, get deeper insights, and unlock full potential.
                    </p>
                </div>

                <div className="grid md:grid-cols-2 gap-8 max-w-5xl mx-auto">
                    {/* Free Plan */}
                    <div className="bg-slate-800/50 backdrop-blur-xl border border-slate-700/50 rounded-3xl p-8 flex flex-col hover:border-slate-600/50 transition-colors group">
                        <div className="mb-8">
                            <div className="w-12 h-12 bg-slate-700/50 rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                                <FaRocket className="text-blue-400 text-2xl" />
                            </div>
                            <h2 className="text-2xl font-bold mb-2">Free</h2>
                            <div className="flex items-baseline gap-1">
                                <span className="text-4xl font-black">N0</span>
                                <span className="text-gray-400">/month</span>
                            </div>
                        </div>

                        <ul className="space-y-4 mb-12 flex-1">
                            <li className="flex items-center gap-3 text-gray-300">
                                <FaCheckCircle className="text-blue-500 flex-shrink-0" /> Compare up to 3 models at once
                            </li>
                            <li className="flex items-center gap-3 text-gray-300">
                                <FaCheckCircle className="text-blue-500 flex-shrink-0" /> Access to basic AI models
                            </li>
                            <li className="flex items-center gap-3 text-gray-300">
                                <FaCheckCircle className="text-blue-500 flex-shrink-0" /> Standard response speed
                            </li>
                            <li className="flex items-center gap-3 text-gray-500 line-through">
                                Advanced reasoning models
                            </li>
                        </ul>

                        <button
                            disabled
                            className="w-full py-4 bg-slate-700 text-gray-400 rounded-2xl font-bold transition-all"
                        >
                            {isPro ? 'Free Plan' : 'Current Plan'}
                        </button>
                    </div>

                    {/* Pro Plan */}
                    <div className="relative bg-gradient-to-b from-blue-600/20 to-purple-600/20 backdrop-blur-xl border-2 border-blue-500/50 rounded-3xl p-8 flex flex-col shadow-2xl shadow-blue-500/10 hover:shadow-blue-500/20 transition-all group scale-105">
                        <div className="absolute -top-4 left-1/2 -translate-x-1/2 bg-blue-500 text-white px-4 py-1 rounded-full text-xs font-black uppercase tracking-widest shadow-lg">
                            Most Popular
                        </div>

                        <div className="mb-8">
                            <div className="w-12 h-12 bg-blue-500/20 rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                                <FaGem className="text-blue-400 text-2xl" />
                            </div>
                            <h2 className="text-2xl font-bold mb-2">Pro</h2>
                            <div className="flex items-baseline gap-1">
                                <div className="flex flex-col">
                                    <div className="flex items-center gap-2">
                                        {discount && (
                                            <span className="text-xl text-gray-500 line-through">N{pricing.proPriceNgn.toLocaleString()}</span>
                                        )}
                                        <span className="text-4xl font-black">N{finalPrice.toLocaleString()}</span>
                                    </div>
                                    {!discount && (
                                        <span className="text-xs text-blue-400 font-bold">~ ${pricing.proPriceUsd} USD</span>
                                    )}
                                </div>
                                <span className="text-gray-400">/month</span>
                            </div>
                        </div>

                        <ul className="space-y-4 mb-8 flex-1">
                            <li className="flex items-center gap-3 text-gray-200">
                                <FaCheckCircle className="text-blue-400 flex-shrink-0" /> Compare up to 5 models at once
                            </li>
                            <li className="flex items-center gap-3 text-gray-200">
                                <FaCheckCircle className="text-blue-400 flex-shrink-0" /> Access to all premium models
                            </li>
                            <li className="flex items-center gap-3 text-gray-200">
                                <FaCheckCircle className="text-blue-400 flex-shrink-0" /> Priority server access
                            </li>
                            <li className="flex items-center gap-3 text-gray-200">
                                <FaCheckCircle className="text-blue-400 flex-shrink-0" /> No usage limits
                            </li>
                        </ul>

                        {!isPro && (
                            <div className="mb-6 space-y-2">
                                <div className="flex gap-2">
                                    <input
                                        type="text"
                                        value={couponCode}
                                        onChange={(e) => setCouponCode(e.target.value.toUpperCase())}
                                        placeholder="Coupon Code"
                                        className="flex-1 bg-slate-900/50 border border-slate-700 rounded-xl px-4 py-2 text-sm focus:outline-none focus:border-blue-500 transition-colors"
                                    />
                                    <button
                                        onClick={applyCoupon}
                                        className="px-4 py-2 bg-slate-700 hover:bg-slate-600 rounded-xl text-xs font-bold transition-colors"
                                    >
                                        Apply
                                    </button>
                                </div>
                                {couponError && <p className="text-red-400 text-[10px] pl-1">{couponError}</p>}
                                {discount && <p className="text-green-400 text-[10px] pl-1">Discount applied: {discount.type === 'percentage' ? `${discount.amount}%` : `N${discount.amount}`}</p>}
                            </div>
                        )}

                        <button
                            onClick={handleUpgrade}
                            disabled={loading || isPro}
                            className="w-full py-4 bg-blue-500 hover:bg-blue-600 text-white rounded-2xl font-bold shadow-lg shadow-blue-500/30 transition-all active:scale-95 disabled:opacity-50 disabled:scale-100"
                        >
                            {loading ? 'Processing...' : isPro ? 'Current Plan' : finalPrice === 0 ? 'Claim Free Upgrade' : 'Upgrade Now'}
                        </button>
                    </div>
                </div>

                <p className="text-center mt-12 text-gray-500 text-sm">
                    Payments are handled securely via Paystack. Cancel anytime.
                </p>
            </div>
        </div>
    );
}
