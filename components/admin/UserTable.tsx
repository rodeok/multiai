'use client';

import { useState } from 'react';
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from '@/components/ui/table';
import { toggleUserBan, deleteUser } from '@/app/actions/admin';
import { FaBan, FaTrash, FaCheck, FaUserCircle } from 'react-icons/fa';
import { toast } from 'sonner';

interface UserTableProps {
    users: any[];
}

export function UserTable({ users }: UserTableProps) {
    const [loading, setLoading] = useState<string | null>(null);

    const handleBanToggle = async (userId: string, currentStatus: boolean) => {
        setLoading(userId);
        try {
            await toggleUserBan(userId, !currentStatus);
            toast.success(currentStatus ? 'User unbanned' : 'User banned');
        } catch (error) {
            toast.error('Failed to update user status');
        } finally {
            setLoading(null);
        }
    };

    const handleDelete = async (userId: string) => {
        if (!confirm('Are you sure you want to delete this user?')) return;

        setLoading(userId);
        try {
            await deleteUser(userId);
            toast.success('User deleted');
        } catch (error) {
            toast.error('Failed to delete user');
        } finally {
            setLoading(null);
        }
    };

    return (
        <div className="w-full">
            <div className="flex justify-between items-end mb-6">
                <div>
                    <h2 className="text-2xl font-bold text-white tracking-tight">Platform Users</h2>
                    <p className="text-slate-400 text-sm font-medium">Manage and monitor community access</p>
                </div>
            </div>

            <div className="rounded-[2rem] overflow-hidden border border-white/5 bg-slate-800/40 backdrop-blur-md">
                <Table>
                    <TableHeader>
                        <TableRow className="border-white/5 hover:bg-transparent px-4">
                            <TableHead className="text-slate-500 font-bold text-[10px] uppercase tracking-widest h-14 pl-8">User Profile</TableHead>
                            <TableHead className="text-slate-500 font-bold text-[10px] uppercase tracking-widest h-14">Email Address</TableHead>
                            <TableHead className="text-slate-500 font-bold text-[10px] uppercase tracking-widest h-14">Plan</TableHead>
                            <TableHead className="text-slate-500 font-bold text-[10px] uppercase tracking-widest h-14">Status</TableHead>
                            <TableHead className="text-right text-slate-500 font-bold text-[10px] uppercase tracking-widest h-14 pr-8">Actions</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {users.map((user) => (
                            <TableRow key={user.id} className="border-white/5 hover:bg-white/5 transition-colors group">
                                <TableCell className="pl-8 py-4">
                                    <div className="flex items-center gap-3">
                                        <div className="w-10 h-10 rounded-xl bg-slate-700 flex items-center justify-center text-slate-400">
                                            {user.image ? (
                                                <img src={user.image} alt="" className="w-full h-full rounded-xl object-cover" />
                                            ) : (
                                                <FaUserCircle className="w-6 h-6" />
                                            )}
                                        </div>
                                        <div>
                                            <p className="font-bold text-white text-sm">{user.name || 'Anonymous User'}</p>
                                            <p className="text-[10px] text-slate-500 font-medium">ID: {user.id.slice(-6)}</p>
                                        </div>
                                    </div>
                                </TableCell>
                                <TableCell className="text-slate-300 text-sm font-medium">{user.email}</TableCell>
                                <TableCell>
                                    <span className={`text-[10px] font-bold px-2.5 py-1 rounded-full border ${user.subscription === 'pro'
                                        ? 'text-blue-400 bg-blue-400/10 border-blue-400/20'
                                        : 'text-slate-400 bg-slate-400/10 border-slate-400/20'}`}>
                                        {user.subscription?.toUpperCase() || 'FREE'}
                                    </span>
                                </TableCell>
                                <TableCell>
                                    {user.isBanned ? (
                                        <div className="inline-flex items-center gap-1.5 text-[10px] font-bold text-red-400 bg-red-400/10 px-2.5 py-1 rounded-full border border-red-400/20">
                                            <span>BANNED</span>
                                        </div>
                                    ) : (
                                        <div className="inline-flex items-center gap-1.5 text-[10px] font-bold text-green-400 bg-green-400/10 px-2.5 py-1 rounded-full border border-green-400/20">
                                            <span>ACTIVE</span>
                                        </div>
                                    )}
                                </TableCell>
                                <TableCell className="text-right pr-8">
                                    <div className="flex justify-end gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                                        <button
                                            disabled={loading === user.id}
                                            onClick={() => handleBanToggle(user.id, user.isBanned)}
                                            className={`p-2 rounded-xl transition-all active:scale-90 ${user.isBanned
                                                ? 'bg-green-500/10 text-green-400 hover:bg-green-500'
                                                : 'bg-yellow-500/10 text-yellow-500 hover:bg-yellow-500'
                                                } hover:text-white`}
                                        >
                                            {user.isBanned ? <FaCheck className="w-3.5 h-3.5" /> : <FaBan className="w-3.5 h-3.5" />}
                                        </button>
                                        <button
                                            disabled={loading === user.id}
                                            onClick={() => handleDelete(user.id)}
                                            className="p-2 rounded-xl bg-red-500/10 text-red-500 hover:bg-red-500 hover:text-white transition-all active:scale-90"
                                        >
                                            <FaTrash className="w-3.5 h-3.5" />
                                        </button>
                                    </div>
                                </TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </div>
        </div>
    );
}
