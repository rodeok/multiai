'use client';

import React from 'react';
import { HiExclamation } from 'react-icons/hi';

export function MaintenanceAlert() {
    return (
        <div className="fixed top-0 left-0 right-0 z-[100] animate-in slide-in-from-top duration-500">
            <div className="bg-gradient-to-r from-orange-600 via-amber-600 to-orange-600 border-b border-white/10 shadow-2xl">
                <div className="max-w-7xl mx-auto px-4 py-3 sm:px-6 lg:px-8">
                    <div className="flex items-center justify-between flex-wrap">
                        <div className="w-0 flex-1 flex items-center">
                            <span className="flex p-2 rounded-lg bg-black/20 backdrop-blur-md">
                                <HiExclamation className="h-5 w-5 text-white animate-pulse" aria-hidden="true" />
                            </span>
                            <p className="ml-3 font-bold text-white truncate">
                                <span className="md:hidden text-sm">System Maintenance in progress.</span>
                                <span className="hidden md:inline text-sm">
                                    <span className="font-black uppercase tracking-widest mr-2 opacity-80">Alert:</span>
                                    Scheduled system maintenance is currently underway. Some features may be temporarily limited.
                                </span>
                            </p>
                        </div>
                        <div className="order-2 flex-shrink-0 sm:order-3 sm:ml-3">
                            <div className="px-3 py-1 bg-white/10 hover:bg-white/20 rounded-lg text-[10px] font-black text-white uppercase tracking-widest transition-all border border-white/10 backdrop-blur-md">
                                Active Mode
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            {/* Ambient Glow */}
            <div className="h-1 bg-gradient-to-r from-transparent via-orange-400/30 to-transparent blur-sm" />
        </div>
    );
}
