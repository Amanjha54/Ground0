"use client";

import React from 'react';
import { useData } from '@/lib/data-context';
import { ShieldCheck, User, Award, Activity, CheckCircle2 } from 'lucide-react';

export default function ProfilePage() {
  const { role } = useData();

  return (
    <div className="max-w-3xl mx-auto px-4 sm:px-6 py-10 space-y-6">
      <div className="glass-panel p-6 sm:p-8 rounded-2xl border border-white/10 flex flex-col sm:flex-row sm:items-center justify-between gap-6">
        <div className="flex items-center gap-4">
          <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-gold-500/20 to-emerald-600/20 border-2 border-gold-400 flex items-center justify-center text-gold-400 text-2xl font-bold shadow-xl">
            MV
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-xl font-bold text-white">Marcus Vance</h1>
              <ShieldCheck className="w-4 h-4 text-gold-400" />
            </div>
            <div className="text-xs font-mono text-gold-400">{role}</div>
            <div className="text-xs text-platinum-muted mt-0.5">m.vance@metro.gov</div>
          </div>
        </div>

        <div className="p-3.5 rounded-xl bg-obsidian-950 border border-white/10 text-center">
          <div className="text-2xl font-extrabold font-mono text-emerald-400">98 / 100</div>
          <div className="text-[10px] font-mono text-platinum-subtle uppercase">Reputation Score</div>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="glass-panel p-4 rounded-xl border border-white/10 text-center space-y-1">
          <div className="text-2xl font-bold font-mono text-white">42</div>
          <div className="text-xs font-mono text-platinum-muted uppercase">Verified Inspections</div>
        </div>

        <div className="glass-panel p-4 rounded-xl border border-white/10 text-center space-y-1">
          <div className="text-2xl font-bold font-mono text-emerald-400">0</div>
          <div className="text-xs font-mono text-platinum-muted uppercase">Disputed Outcomes</div>
        </div>

        <div className="glass-panel p-4 rounded-xl border border-white/10 text-center space-y-1">
          <div className="text-2xl font-bold font-mono text-gold-400">100%</div>
          <div className="text-xs font-mono text-platinum-muted uppercase">Compliance Rate</div>
        </div>
      </div>
    </div>
  );
}
