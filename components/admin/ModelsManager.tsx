'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from '@/components/ui/dialog';
import { addModel, toggleModelStatus } from '@/app/actions/admin';
import { FaPlus, FaPowerOff, FaCheckCircle, FaExclamationCircle } from 'react-icons/fa';
import { toast } from 'sonner';

interface ModelsManagerProps {
    models: any[];
}

export function ModelsManager({ models }: ModelsManagerProps) {
    const [isOpen, setIsOpen] = useState(false);
    const [loading, setLoading] = useState(false);

    // Form state
    const [newModel, setNewModel] = useState({
        id: '',
        name: '',
        displayName: '',
        provider: 'Groq', // Default
        description: '',
    });

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        try {
            await addModel({
                name: newModel.name,
                displayName: newModel.displayName,
                provider: newModel.provider,
                description: newModel.description,
                capabilities: ['chat'],
                speed: 'Balanced',
                pricing: 'Open Source',
                features: ['context-window'],
            });
            toast.success('Model added successfully');
            setIsOpen(false);
            setNewModel({
                id: '',
                name: '',
                displayName: '',
                provider: 'Groq',
                description: '',
            });
        } catch (error) {
            toast.error('Failed to add model');
        } finally {
            setLoading(false);
        }
    };

    const handleToggle = async (modelId: string, currentStatus: string) => {
        try {
            const newStatus = currentStatus === 'active' ? 'inactive' : 'active';
            await toggleModelStatus(modelId, newStatus);
            toast.success(`Model ${newStatus}`);
        } catch (error) {
            toast.error('Failed to update model status');
        }
    };

    return (
        <div className="space-y-6">
            <div className="flex justify-between items-end">
                <div>
                    <h2 className="text-2xl font-bold text-white tracking-tight">AI Models</h2>
                    <p className="text-slate-400 text-sm font-medium">Manage available intelligence engines</p>
                </div>
                <Dialog open={isOpen} onOpenChange={setIsOpen}>
                    <DialogTrigger asChild>
                        <Button className="bg-blue-600 hover:bg-blue-700 rounded-2xl h-11 px-6 shadow-lg shadow-blue-500/20 transition-all active:scale-95">
                            <FaPlus className="mr-2 h-4 w-4" /> Add Model
                        </Button>
                    </DialogTrigger>
                    <DialogContent className="bg-slate-900 border-white/5 text-white rounded-[2rem] max-w-lg">
                        <DialogHeader>
                            <DialogTitle className="text-2xl font-bold tracking-tight">Add New Model</DialogTitle>
                        </DialogHeader>
                        <form onSubmit={handleSubmit} className="space-y-5 mt-4">
                            <div className="space-y-2">
                                <Label className="text-slate-300 font-medium">Model ID</Label>
                                <Input
                                    value={newModel.name}
                                    onChange={(e) => setNewModel({ ...newModel, name: e.target.value })}
                                    className="bg-white/5 border-white/5 h-12 rounded-xl focus:ring-blue-500/20"
                                    placeholder="e.g. llama3-70b-8192"
                                    required
                                />
                            </div>
                            <div className="space-y-2">
                                <Label className="text-slate-300 font-medium">Display Name</Label>
                                <Input
                                    value={newModel.displayName}
                                    onChange={(e) => setNewModel({ ...newModel, displayName: e.target.value })}
                                    className="bg-white/5 border-white/5 h-12 rounded-xl"
                                    placeholder="e.g. Llama 3 70B"
                                    required
                                />
                            </div>
                            <div className="grid grid-cols-2 gap-4">
                                <div className="space-y-2">
                                    <Label className="text-slate-300 font-medium">Provider</Label>
                                    <Input
                                        value={newModel.provider}
                                        onChange={(e) => setNewModel({ ...newModel, provider: e.target.value })}
                                        className="bg-white/5 border-white/5 h-12 rounded-xl"
                                        required
                                    />
                                </div>
                                <div className="space-y-2">
                                    <Label className="text-slate-300 font-medium">Status</Label>
                                    <div className="h-12 bg-white/5 rounded-xl border border-white/5 flex items-center px-4 text-slate-400 text-sm">
                                        Active (Default)
                                    </div>
                                </div>
                            </div>
                            <div className="space-y-2">
                                <Label className="text-slate-300 font-medium">Description</Label>
                                <textarea
                                    value={newModel.description}
                                    onChange={(e) => setNewModel({ ...newModel, description: e.target.value })}
                                    className="w-full bg-white/5 border border-white/5 rounded-xl p-4 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/20 min-h-[100px]"
                                    placeholder="Brief model description..."
                                />
                            </div>
                            <Button type="submit" className="w-full bg-blue-600 hover:bg-blue-700 h-14 rounded-2xl text-lg font-bold shadow-xl shadow-blue-500/20" disabled={loading}>
                                {loading ? 'Adding...' : 'Add Intelligence Engine'}
                            </Button>
                        </form>
                    </DialogContent>
                </Dialog>
            </div>

            <div className="grid gap-4 sm:grid-cols-2">
                {models.map((model) => (
                    <div
                        key={model.id}
                        className={`relative p-5 rounded-3xl border border-white/5 bg-slate-800/40 backdrop-blur-md transition-all duration-300 hover:border-white/10 group ${model.status !== 'active' ? 'opacity-60 saturate-50' : ''
                            }`}
                    >
                        <div className="flex justify-between items-start mb-4">
                            <div className="flex items-center gap-3">
                                <div className={`w-10 h-10 rounded-xl flex items-center justify-center font-bold text-lg ${model.status === 'active' ? 'bg-blue-600/10 text-blue-400' : 'bg-slate-700/50 text-slate-400'
                                    }`}>
                                    {model.provider[0]}
                                </div>
                                <div>
                                    <h3 className="font-bold text-white tracking-tight">{model.displayName}</h3>
                                    <p className="text-[10px] uppercase tracking-widest font-bold text-slate-500">{model.provider}</p>
                                </div>
                            </div>
                            <button
                                onClick={() => handleToggle(model.id, model.status)}
                                className={`w-8 h-8 rounded-full flex items-center justify-center transition-all ${model.status === 'active'
                                        ? 'bg-green-500/10 text-green-400 hover:bg-green-500/20'
                                        : 'bg-slate-700/50 text-slate-500 hover:bg-slate-700'
                                    }`}
                            >
                                <FaPowerOff className="w-3.5 h-3.5" />
                            </button>
                        </div>

                        <p className="text-xs text-slate-400 font-medium line-clamp-2 mb-4 leading-relaxed">
                            {model.description || 'No description available for this model.'}
                        </p>

                        <div className="flex items-center gap-3">
                            {model.status === 'active' ? (
                                <div className="flex items-center gap-1.5 text-[10px] font-bold text-green-400 bg-green-400/10 px-2 py-1 rounded-full border border-green-400/20">
                                    <FaCheckCircle className="w-2.5 h-2.5" />
                                    <span>OPERATIONAL</span>
                                </div>
                            ) : (
                                <div className="flex items-center gap-1.5 text-[10px] font-bold text-slate-400 bg-slate-400/10 px-2 py-1 rounded-full border border-slate-400/20">
                                    <FaExclamationCircle className="w-2.5 h-2.5" />
                                    <span>OFFLINE</span>
                                </div>
                            )}
                            <div className="flex items-center gap-1.5 text-[10px] font-bold text-blue-400 bg-blue-400/10 px-2 py-1 rounded-full border border-blue-400/20">
                                <span className="uppercase">{model.speed || 'FAST'}</span>
                            </div>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}
