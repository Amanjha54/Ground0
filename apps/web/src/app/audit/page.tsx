"use client";

import React from 'react';
import { useData } from '@/lib/data-context';
import { formatDate } from '@/lib/utils';
import { Layers, ShieldCheck, Lock, Activity, FileText, CheckCircle2 } from 'lucide-react';

export default function AuditTrailPage() {
  const { auditEvents } = useData();

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6">
      <div className="border-b border-white/10 pb-4">
        <div className="flex items-center gap-2 text-xs font-mono text-purple-400 mb-1">
          <Layers className="w-3.5 h-3.5" />
          <span>CRYPTOGRAPHIC & TAMPER-EVIDENT SYSTEM RECORD</span>
        </div>
        <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
          Immutable System Audit Trail
        </h1>
        <p className="text-xs text-platinum-muted mt-1">
          Complete, unalterable event log capturing every complaint, dispatch, verification run, and inspector sign-off.
        </p>
      </div>

      <div className="glass-panel rounded-2xl border border-white/10 overflow-hidden">
        <div className="divide-y divide-white/5 font-mono text-xs">
          {auditEvents.map((evt) => (
            <div
              key={evt.id}
              className="p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3 hover:bg-white/5 transition-colors"
            >
              <div className="flex items-start gap-3">
                <div className="w-7 h-7 rounded-lg bg-purple-950/80 border border-purple-800 text-purple-300 flex items-center justify-center shrink-0 mt-0.5">
                  <ShieldCheck className="w-4 h-4" />
                </div>
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <span className="font-bold text-white uppercase">{evt.action}</span>
                    <span className="text-[10px] px-2 py-0.5 rounded bg-white/5 text-platinum-subtle border border-white/10">
                      {evt.resource_type}: {evt.resource_id.slice(0, 8)}
                    </span>
                  </div>
                  <div className="text-[11px] text-platinum-muted truncate max-w-xl">
                    Details: {JSON.stringify(evt.details)}
                  </div>
                </div>
              </div>

              <div className="text-right text-[11px] text-platinum-subtle whitespace-nowrap">
                {formatDate(evt.created_at)}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
