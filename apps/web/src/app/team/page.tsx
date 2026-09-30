"use client";

import React from 'react';
import { Users, ShieldCheck, Mail, Phone, Award } from 'lucide-react';

export default function TeamPage() {
  const members = [
    {
      name: 'Marcus Vance',
      role: 'Chief Public Works Inspector',
      department: 'Municipal Civil Division',
      email: 'm.vance@metro.gov',
      reputation: 98,
      verified: true,
    },
    {
      name: 'Elena Rostova',
      role: 'Lead Contractor Dispatcher',
      department: 'Apex Civil Infrastructure',
      email: 'elena@apexcivil.com',
      reputation: 94,
      verified: true,
    },
    {
      name: 'Devon Miller',
      role: 'Field Verification Specialist',
      department: 'Apex Rapid Response',
      email: 'devon.m@apexcivil.com',
      reputation: 99,
      verified: true,
    },
    {
      name: 'Sarah Chen',
      role: 'Compliance & Environmental Auditor',
      department: 'City Audit Committee',
      email: 's.chen@audit.gov',
      reputation: 100,
      verified: true,
    },
  ];

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 py-8 space-y-6">
      <div className="border-b border-white/10 pb-4">
        <h1 className="text-2xl font-bold text-white tracking-tight">Organization Personnel</h1>
        <p className="text-xs text-platinum-muted mt-1">
          Authorized municipal inspectors, contractor teams, and independent auditors.
        </p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {members.map((m, idx) => (
          <div
            key={idx}
            className="glass-panel p-5 rounded-2xl border border-white/10 space-y-3"
          >
            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <h4 className="text-sm font-bold text-white flex items-center gap-1.5">
                  {m.name}
                  {m.verified && <ShieldCheck className="w-3.5 h-3.5 text-gold-400" />}
                </h4>
                <div className="text-xs text-gold-400 font-mono">{m.role}</div>
              </div>
              <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-emerald-950 text-emerald-300 border border-emerald-800">
                Score: {m.reputation}
              </span>
            </div>

            <div className="text-xs text-platinum-muted">{m.department}</div>

            <div className="pt-2 border-t border-white/5 space-y-1 text-xs font-mono text-platinum-subtle">
              <div className="flex items-center gap-2">
                <Mail className="w-3 h-3 text-platinum-muted" />
                <span>{m.email}</span>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
