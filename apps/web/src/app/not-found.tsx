"use client";

import React from 'react';
import Link from 'next/link';
import { ShieldAlert, ArrowLeft, Home } from 'lucide-react';

export default function NotFound() {
  return (
    <div className="max-w-md mx-auto px-4 py-24 text-center space-y-6">
      <div className="w-16 h-16 rounded-2xl bg-gold-500/10 border border-gold-500/30 flex items-center justify-center mx-auto text-gold-400">
        <ShieldAlert className="w-8 h-8" />
      </div>

      <div className="space-y-2">
        <h1 className="text-3xl font-extrabold text-white tracking-tight">404 — Node Not Found</h1>
        <p className="text-xs text-platinum-muted leading-relaxed">
          The requested coordinate or municipal record does not exist on the Ground0 network ledger.
        </p>
      </div>

      <div className="flex items-center justify-center gap-3">
        <Link
          href="/dashboard"
          className="px-5 py-2.5 rounded-xl bg-gold-500 text-obsidian-950 font-bold text-xs flex items-center gap-2 shadow-md hover:bg-gold-400 transition-colors"
        >
          <Home className="w-4 h-4" />
          Command Center
        </Link>
      </div>
    </div>
  );
}
