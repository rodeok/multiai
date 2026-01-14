'use client';

import { useState, useEffect } from 'react';
import { getCoupons, createCoupon, deleteCoupon, sendCouponEmail, Coupon } from '@/app/actions/coupons';
import { getUsers } from '@/app/actions/admin';
import { FaTicketAlt, FaTrash, FaPaperPlane, FaPlus } from 'react-icons/fa';

export default function AdminCoupons() {
    const [coupons, setCoupons] = useState<Coupon[]>([]);
    const [users, setUsers] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [isCreating, setIsCreating] = useState(false);
    const [newCoupon, setNewCoupon] = useState({
        code: '',
        discountType: 'percentage' as 'percentage' | 'fixed',
        discountAmount: 0,
        expiryDate: '',
        usageLimit: ''
    });
    const [sendModal, setSendModal] = useState<{ isOpen: boolean, code: string, discount: string }>({
        isOpen: false,
        code: '',
        discount: ''
    });
    const [selectedEmail, setSelectedEmail] = useState('');

    useEffect(() => {
        loadData();
    }, []);

    const loadData = async () => {
        try {
            const [c, u] = await Promise.all([getCoupons(), getUsers()]);
            setCoupons(c as unknown as Coupon[]);
            setUsers(u);
        } catch (error) {
            console.error('Failed to load data', error);
        } finally {
            setLoading(false);
        }
    };

    const generateCode = () => {
        const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
        let code = '';
        for (let i = 0; i < 8; i++) {
            code += chars.charAt(Math.floor(Math.random() * chars.length));
        }
        setNewCoupon({ ...newCoupon, code });
    };

    const handleCreate = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        try {
            await createCoupon({
                code: newCoupon.code.toUpperCase(),
                discountType: newCoupon.discountType,
                discountAmount: Number(newCoupon.discountAmount),
                expiryDate: newCoupon.expiryDate ? new Date(newCoupon.expiryDate) : undefined,
                usageLimit: newCoupon.usageLimit ? Number(newCoupon.usageLimit) : undefined,
            });
            setNewCoupon({ code: '', discountType: 'percentage', discountAmount: 0, expiryDate: '', usageLimit: '' });
            setIsCreating(false);
            await loadData();
        } catch (error) {
            alert('Failed to create coupon');
        } finally {
            setLoading(false);
        }
    };

    const handleDelete = async (id: string) => {
        if (!confirm('Are you sure?')) return;
        try {
            await deleteCoupon(id);
            await loadData();
        } catch (error) {
            alert('Failed to delete');
        }
    };

    const handleSendAction = async () => {
        if (!selectedEmail) return;
        try {
            setLoading(true);
            await sendCouponEmail(selectedEmail, sendModal.code, sendModal.discount);
            alert('Email sent successfully!');
            setSendModal({ isOpen: false, code: '', discount: '' });
            setSelectedEmail('');
        } catch (error) {
            alert('Failed to send email');
        } finally {
            setLoading(false);
        }
    };

    if (loading && coupons.length === 0) return <div className="p-8 text-white">Loading...</div>;

    return (
        <div className="p-8 text-white min-h-screen bg-slate-900">
            <div className="flex justify-between items-center mb-8">
                <div>
                    <h1 className="text-3xl font-black flex items-center gap-3">
                        <FaTicketAlt className="text-blue-500" /> Coupon Management
                    </h1>
                    <p className="text-gray-400">Create and manage discount codes for Pro upgrades.</p>
                </div>
                <button
                    onClick={() => setIsCreating(!isCreating)}
                    className="flex items-center gap-2 bg-blue-500 hover:bg-blue-600 px-6 py-3 rounded-xl font-bold transition-all"
                >
                    <FaPlus /> {isCreating ? 'Cancel' : 'Create Coupon'}
                </button>
            </div>

            {isCreating && (
                <form onSubmit={handleCreate} className="bg-slate-800/50 p-6 rounded-2xl border border-slate-700 mb-8 max-w-2xl">
                    <div className="grid grid-cols-2 gap-4">
                        <div className="col-span-2 space-y-2">
                            <label className="text-sm text-gray-400">Coupon Code</label>
                            <div className="flex gap-2">
                                <input
                                    required
                                    value={newCoupon.code}
                                    onChange={e => setNewCoupon({ ...newCoupon, code: e.target.value })}
                                    placeholder="PROMO50"
                                    className="flex-1 bg-slate-900 border border-slate-700 rounded-xl px-4 py-2 focus:border-blue-500 outline-none"
                                />
                                <button
                                    type="button"
                                    onClick={generateCode}
                                    className="px-4 py-2 bg-slate-700 hover:bg-slate-600 rounded-xl text-xs font-bold transition-all"
                                >
                                    Generate
                                </button>
                            </div>
                        </div>
                        <div className="space-y-2">
                            <label className="text-sm text-gray-400">Discount Type</label>
                            <select
                                value={newCoupon.discountType}
                                onChange={e => setNewCoupon({ ...newCoupon, discountType: e.target.value as any })}
                                className="w-full bg-slate-900 border border-slate-700 rounded-xl px-4 py-2 focus:border-blue-500 outline-none"
                            >
                                <option value="percentage">Percentage (%)</option>
                                <option value="fixed">Fixed Amount (NGN)</option>
                            </select>
                        </div>
                        <div className="space-y-2">
                            <label className="text-sm text-gray-400">Amount</label>
                            <input
                                type="number"
                                required
                                value={newCoupon.discountAmount}
                                onChange={e => setNewCoupon({ ...newCoupon, discountAmount: Number(e.target.value) })}
                                className="w-full bg-slate-900 border border-slate-700 rounded-xl px-4 py-2 focus:border-blue-500 outline-none"
                            />
                        </div>
                        <div className="space-y-2">
                            <label className="text-sm text-gray-400">Expiry Date (Optional)</label>
                            <input
                                type="date"
                                value={newCoupon.expiryDate}
                                onChange={e => setNewCoupon({ ...newCoupon, expiryDate: e.target.value })}
                                className="w-full bg-slate-900 border border-slate-700 rounded-xl px-4 py-2 focus:border-blue-500 outline-none"
                            />
                        </div>
                        <div className="space-y-2">
                            <label className="text-sm text-gray-400">Usage Limit (Optional)</label>
                            <input
                                type="number"
                                value={newCoupon.usageLimit}
                                onChange={e => setNewCoupon({ ...newCoupon, usageLimit: e.target.value })}
                                placeholder="100"
                                className="w-full bg-slate-900 border border-slate-700 rounded-xl px-4 py-2 focus:border-blue-500 outline-none"
                            />
                        </div>
                    </div>
                    <button type="submit" className="mt-6 w-full bg-blue-500 hover:bg-blue-600 py-3 rounded-xl font-bold transition-all">
                        Save Coupon
                    </button>
                </form>
            )}

            <div className="bg-slate-800/20 border border-slate-800 rounded-2xl overflow-hidden">
                <table className="w-full text-left">
                    <thead className="bg-slate-800/50 border-b border-slate-700">
                        <tr>
                            <th className="px-6 py-4 text-xs font-bold uppercase tracking-wider text-gray-400">Code</th>
                            <th className="px-6 py-4 text-xs font-bold uppercase tracking-wider text-gray-400">Discount</th>
                            <th className="px-6 py-4 text-xs font-bold uppercase tracking-wider text-gray-400">Usage</th>
                            <th className="px-6 py-4 text-xs font-bold uppercase tracking-wider text-gray-400">Status</th>
                            <th className="px-6 py-4 text-xs font-bold uppercase tracking-wider text-gray-400 text-right">Actions</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-800">
                        {coupons.map((coupon) => (
                            <tr key={coupon.id} className="hover:bg-slate-800/30 transition-colors group">
                                <td className="px-6 py-4 font-bold text-blue-400 uppercase">{coupon.code}</td>
                                <td className="px-6 py-4">
                                    <span className="bg-blue-500/10 text-blue-400 px-2 py-1 rounded text-xs font-bold">
                                        {coupon.discountType === 'percentage' ? `${coupon.discountAmount}% OFF` : `N${coupon.discountAmount} OFF`}
                                    </span>
                                </td>
                                <td className="px-6 py-4 text-gray-300">
                                    {coupon.usageCount} / {coupon.usageLimit || '∞'}
                                </td>
                                <td className="px-6 py-4">
                                    <span className="flex items-center gap-2 text-xs font-bold text-green-400">
                                        <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse" /> Active
                                    </span>
                                </td>
                                <td className="px-6 py-4 text-right space-x-3">
                                    <button
                                        onClick={() => setSendModal({
                                            isOpen: true,
                                            code: coupon.code,
                                            discount: coupon.discountType === 'percentage' ? `${coupon.discountAmount}% OFF` : `N${coupon.discountAmount} OFF`
                                        })}
                                        className="p-2 text-gray-400 hover:text-blue-500 transition-colors"
                                        title="Send to email"
                                    >
                                        <FaPaperPlane />
                                    </button>
                                    <button
                                        onClick={() => handleDelete(coupon.id)}
                                        className="p-2 text-gray-400 hover:text-red-500 transition-colors"
                                    >
                                        <FaTrash />
                                    </button>
                                </td>
                            </tr>
                        ))}
                        {coupons.length === 0 && (
                            <tr>
                                <td colSpan={5} className="px-6 py-12 text-center text-gray-500">No coupons found. Create your first one above.</td>
                            </tr>
                        )}
                    </tbody>
                </table>
            </div>

            {sendModal.isOpen && (
                <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-6">
                    <div className="bg-slate-800 border border-slate-700 rounded-3xl p-8 max-w-md w-full shadow-2xl animate-in zoom-in-95 duration-200">
                        <h2 className="text-2xl font-black mb-2">Send Coupon</h2>
                        <p className="text-gray-400 mb-6 text-sm">Send <span className="text-blue-400 font-bold">{sendModal.code}</span> ({sendModal.discount}) to a user.</p>

                        <div className="space-y-4">
                            <div className="space-y-2">
                                <label className="text-xs font-bold text-gray-500 uppercase tracking-widest">Select User</label>
                                <select
                                    value={selectedEmail}
                                    onChange={(e) => setSelectedEmail(e.target.value)}
                                    className="w-full bg-slate-900 border border-slate-700 rounded-xl px-4 py-3 focus:border-blue-500 outline-none text-sm"
                                >
                                    <option value="">Select an email...</option>
                                    {users.map((u: any) => (
                                        <option key={u.id} value={u.email}>{u.email} ({u.name || 'No Name'})</option>
                                    ))}
                                </select>
                            </div>

                            <div className="pt-4 flex gap-3">
                                <button
                                    onClick={() => setSendModal({ isOpen: false, code: '', discount: '' })}
                                    className="flex-1 py-3 px-4 bg-slate-700 hover:bg-slate-600 rounded-xl font-bold transition-all text-sm"
                                >
                                    Cancel
                                </button>
                                <button
                                    onClick={handleSendAction}
                                    disabled={!selectedEmail || loading}
                                    className="flex-1 py-3 px-4 bg-blue-500 hover:bg-blue-600 rounded-xl font-bold transition-all text-sm disabled:opacity-50"
                                >
                                    {loading ? 'Sending...' : 'Send Now'}
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
