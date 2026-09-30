"use client";

import React, { useEffect } from 'react';
import Link from 'next/link';
import { AlertTriangle, RefreshCw, Home } from 'lucide-react';

export default function ErrorPage({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error("Ground0 System Error:", error);
  }, [error]);

  return (
    <div className="max-w-md mx-auto px-4 py-20 text-center space-y-6">
      <div className="w-16 h-16 rounded-2xl bg-rose-500/10 border border-rose-500/30 flex items-center justify-center mx-auto text-rose-400">
        <AlertTriangle className="w-8 h-8" />
      </div>

      <div className="space-y-2">
        <h1 className="text-2xl font-bold text-white tracking-tight">System Exception Intercepted</h1>
        <p className="text-xs text-platinum-muted leading-relaxed">
          The Ground0 fault-tolerance engine intercepted an unexpected condition. Session state has been safely isolated.
        </p>
      </div>

      <div className="p-3 rounded-xl bg-obsidian-950 border border-white/5 text-[11px] font-mono text-rose-300">
        {error?.message || "Internal rendering error"}
      </div>

      <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
        <button
          type="button"
          onClick={() => reset()}
          className="w-full sm:w-auto px-5 py-2.5 rounded-xl bg-gold-500 text-obsidian-950 font-bold text-xs flex items-center justify-center gap-2 shadow-md cursor-pointer"
        >
          <RefreshCw className="w-3.5 h-3.5" />
          Attempt Recovery
        </button>

        <Link
          href="/dashboard"
          className="w-full sm:w-auto px-5 py-2.5 rounded-xl glass-panel text-white font-bold text-xs flex items-center justify-center gap-1.5 border border-white/20"
        >
          <Home className="w-3.5 h-3.5" />
          Return to Command Center
        </Link>
      </div>
    </div>
  );
}
