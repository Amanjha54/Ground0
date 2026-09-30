"use client";

import React from 'react';
import Link from 'next/link';
import { useData } from '@/lib/data-context';
import { formatDate } from '@/lib/utils';
import { FileText, Plus, CheckCircle2, Clock, AlertTriangle, ArrowRight, Camera } from 'lucide-react';

export default function WorkOrdersListPage() {
  const { workOrders } = useData();

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-white/10 pb-4">
        <div>
          <h1 className="text-2xl font-bold text-white tracking-tight">Active Work Orders</h1>
          <p className="text-xs text-platinum-muted mt-1">
            Contractor assignments, mandatory criteria, and multi-sensor verification policies.
          </p>
        </div>

        <Link
          href="/work-orders/new"
          className="px-4 py-2 rounded-xl bg-gold-500 text-obsidian-950 font-bold text-xs flex items-center gap-1.5 shadow-md"
        >
          <Plus className="w-4 h-4" />
          Create Work Order
        </Link>
      </div>

      <div className="space-y-4">
        {workOrders.map((wo) => (
          <div
            key={wo.id}
            className="glass-panel p-6 rounded-2xl border border-white/10 hover:border-gold-500/30 transition-colors flex flex-col md:flex-row md:items-center justify-between gap-6"
          >
            <div className="space-y-2 max-w-2xl">
              <div className="flex flex-wrap items-center gap-2">
                <span className="text-xs font-mono font-bold px-2.5 py-0.5 rounded bg-gold-500/20 text-gold-300 border border-gold-500/30">
                  #{wo.work_order_number}
                </span>
                <span className="text-xs font-mono px-2 py-0.5 rounded bg-white/5 text-platinum">
                  {wo.category}
                </span>
                <span className="text-xs font-mono px-2 py-0.5 rounded bg-rose-950 text-rose-300 border border-rose-800">
                  Priority: {wo.priority}
                </span>
                {wo.camera_verification_enabled && (
                  <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-sky-950 text-sky-300 border border-sky-800 flex items-center gap-1">
                    <Camera className="w-3 h-3" />
                    CCTV Corroboration Active
                  </span>
                )}
              </div>

              <h3 className="text-base font-bold text-white">{wo.title}</h3>
              <p className="text-xs text-platinum-muted leading-relaxed line-clamp-2">
                {wo.description}
              </p>

              <div className="flex flex-wrap items-center gap-4 text-xs font-mono text-platinum-subtle pt-1">
                <span>Contractor: Apex Civil Infrastructure</span>
                <span>•</span>
                <span>Deadline: {formatDate(wo.deadline)}</span>
              </div>
            </div>

            <div className="flex flex-col items-start md:items-end justify-between gap-3 min-w-[200px] border-t md:border-t-0 pt-4 md:pt-0 border-white/5">
              <div className="px-3 py-1 rounded-full text-xs font-mono font-bold bg-emerald-950 text-emerald-300 border border-emerald-800">
                {wo.status}
              </div>

              <div className="flex items-center gap-2">
                <Link
                  href={`/capture/${wo.id}`}
                  className="px-3 py-1.5 rounded-lg bg-white/10 hover:bg-white/20 text-platinum text-xs font-mono font-bold transition-colors"
                >
                  Worker PWA
                </Link>
                <Link
                  href={`/work-orders/${wo.id}`}
                  className="px-3.5 py-1.5 rounded-lg bg-gold-500 hover:bg-gold-400 text-obsidian-950 font-bold text-xs flex items-center gap-1 transition-all"
                >
                  Inspect <ArrowRight className="w-3.5 h-3.5" />
                </Link>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
