"use client";

import React from 'react';
import Link from 'next/link';
import { WifiOff, RefreshCw, ArrowLeft } from 'lucide-react';

export default function OfflinePage() {
  return (
    <div className="max-w-md mx-auto px-4 py-20 text-center space-y-6">
      <div className="w-16 h-16 rounded-2xl bg-amber-500/10 border border-amber-500/30 flex items-center justify-center mx-auto text-amber-400">
        <WifiOff className="w-8 h-8" />
      </div>

      <div className="space-y-2">
        <h1 className="text-2xl font-bold text-white tracking-tight">Offline Mode Active</h1>
        <p className="text-xs text-platinum-muted leading-relaxed">
          Ground0 has cached your active work order session locally. Field photos captured while disconnected will automatically synchronize once network uplink is restored.
        </p>
      </div>

      <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
        <button
          type="button"
          onClick={() => window.location.reload()}
          className="w-full sm:w-auto px-5 py-2.5 rounded-xl bg-gold-500 text-obsidian-950 font-bold text-xs flex items-center justify-center gap-2 shadow-md cursor-pointer"
        >
          <RefreshCw className="w-3.5 h-3.5" />
          Retry Connection
        </button>

        <Link
          href="/dashboard"
          className="w-full sm:w-auto px-5 py-2.5 rounded-xl glass-panel text-white font-bold text-xs flex items-center justify-center gap-1.5 border border-white/20"
        >
          Return to Dashboard
        </Link>
      </div>
    </div>
  );
}
