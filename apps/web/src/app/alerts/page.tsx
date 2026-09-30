"use client";

import React from 'react';
import { AlertTriangle, ShieldAlert, CheckCircle2, Clock } from 'lucide-react';
import { formatDate } from '@/lib/utils';

export default function AlertsPage() {
  const alerts = [
    {
      id: 'alt-01',
      title: 'High-Severity Cavity on Transit Arterial',
      description: 'Multiple citizen reports within 15 minutes. Roadway hazard flagged for rapid intervention.',
      severity: 'CRITICAL',
      location: 'Market St & 7th Ave',
      time: new Date().toISOString(),
    },
    {
      id: 'alt-02',
      title: 'Replay Evidence Flagged on WO-2089',
      description: 'AI verification engine detected 100% perceptual hash duplicate against historical repository.',
      severity: 'HIGH',
      location: 'Mission Culvert Site',
      time: new Date(Date.now() - 3600000 * 2).toISOString(),
    },
  ];

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 py-8 space-y-6">
      <div className="border-b border-white/10 pb-4">
        <h1 className="text-2xl font-bold text-white tracking-tight">System Alerts & Hazard Flags</h1>
        <p className="text-xs text-platinum-muted mt-1">
          Automated risk notifications, tamper warnings, and priority municipal alerts.
        </p>
      </div>

      <div className="space-y-3">
        {alerts.map((alt) => (
          <div
            key={alt.id}
            className="glass-panel p-5 rounded-2xl border border-white/10 flex items-start gap-4"
          >
            <div className="w-10 h-10 rounded-xl bg-rose-950/80 border border-rose-800 text-rose-400 flex items-center justify-center shrink-0">
              <ShieldAlert className="w-5 h-5" />
            </div>
            <div className="space-y-1 flex-1">
              <div className="flex items-center justify-between">
                <span className="text-xs font-mono font-bold text-rose-400 uppercase">
                  {alt.severity} ALERT
                </span>
                <span className="text-[11px] font-mono text-platinum-subtle">
                  {formatDate(alt.time)}
                </span>
              </div>
              <h4 className="text-sm font-bold text-white">{alt.title}</h4>
              <p className="text-xs text-platinum-muted leading-relaxed">
                {alt.description}
              </p>
              <div className="text-[11px] font-mono text-gold-400 pt-1">
                Site: {alt.location}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
