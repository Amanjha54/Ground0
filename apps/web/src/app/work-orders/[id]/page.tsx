"use client";

import React from 'react';
import { useParams } from 'next/navigation';
import Link from 'next/link';
import { useData } from '@/lib/data-context';
import { formatDate } from '@/lib/utils';
import {
  FileText,
  ArrowLeft,
  CheckCircle2,
  Clock,
  ShieldCheck,
  Camera,
  MapPin,
  ArrowRight,
  ExternalLink
} from 'lucide-react';

export default function WorkOrderDetailPage() {
  const params = useParams();
  const woId = params?.id as string;
  const { workOrders, masterIssues } = useData();

  const wo = workOrders.find(
    (w) => w.id === woId || w.work_order_number === woId
  ) || workOrders[0];

  const linkedMaster = masterIssues.find((m) => m.id === wo?.master_issue_id);

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 py-10 space-y-6">
      <Link
        href="/work-orders"
        className="inline-flex items-center gap-1.5 text-xs font-mono text-platinum-muted hover:text-gold-400 transition-colors"
      >
        <ArrowLeft className="w-3.5 h-3.5" />
        Return to Work Orders
      </Link>

      <div className="glass-panel p-6 rounded-2xl border border-white/10 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <span className="text-xs font-mono font-bold px-2 py-0.5 rounded bg-gold-500/20 text-gold-300 border border-gold-500/30">
              #{wo.work_order_number}
            </span>
            <span className="text-xs font-mono px-2 py-0.5 rounded bg-white/5 text-platinum">
              {wo.category}
            </span>
            <span className="text-xs font-mono px-2 py-0.5 rounded bg-rose-950 text-rose-300 border border-rose-800">
              {wo.priority}
            </span>
          </div>
          <h1 className="text-2xl font-bold text-white tracking-tight">{wo.title}</h1>
        </div>

        <div className="px-3 py-1 rounded-full text-xs font-mono font-bold bg-emerald-950 text-emerald-300 border border-emerald-800 text-center">
          {wo.status}
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="md:col-span-2 space-y-6">
          <div className="glass-panel p-6 rounded-2xl border border-white/10 space-y-3">
            <h3 className="text-xs font-mono font-bold text-gold-400 uppercase tracking-wider">
              Work Order Specifications
            </h3>
            <p className="text-xs text-platinum leading-relaxed">
              {wo.description}
            </p>
          </div>

          <div className="glass-panel p-6 rounded-2xl border border-white/10 space-y-4">
            <h3 className="text-xs font-mono font-bold text-emerald-400 uppercase tracking-wider flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4" />
              Verifiable Completion Criteria
            </h3>
            <div className="space-y-2">
              {wo.requirements?.map((req) => (
                <div
                  key={req.id}
                  className="p-3 rounded-xl bg-obsidian-950 border border-white/5 flex items-center justify-between text-xs"
                >
                  <span className="font-mono text-white">{req.title}</span>
                  <span className="text-emerald-400 font-mono text-[10px] bg-emerald-950/60 px-2 py-0.5 rounded border border-emerald-800">
                    Mandatory Rule
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="space-y-4">
          <div className="glass-panel p-5 rounded-2xl border border-white/10 space-y-3 text-xs">
            <h4 className="text-xs font-mono font-bold text-white uppercase">Dispatch Actions</h4>
            <Link
              href={`/capture/${wo.id}`}
              className="w-full py-2.5 rounded-xl bg-gold-500 hover:bg-gold-400 text-obsidian-950 font-bold text-xs uppercase flex items-center justify-center gap-1.5 transition-all shadow-md"
            >
              Open Worker PWA <ArrowRight className="w-3.5 h-3.5" />
            </Link>
            <Link
              href="/verification-lab"
              className="w-full py-2.5 rounded-xl glass-panel text-white font-bold text-xs flex items-center justify-center gap-1.5 hover:bg-white/10 transition-colors border border-white/20"
            >
              Inspect in Verification Lab
            </Link>
          </div>

          <div className="glass-panel p-5 rounded-2xl border border-white/10 space-y-2 text-xs font-mono text-platinum-subtle">
            <div className="text-white font-bold mb-1">Contractor Telemetry</div>
            <div>Contractor: Apex Civil Infrastructure</div>
            <div>Inspector: Municipal Public Works Officer</div>
            <div>Deadline: {formatDate(wo.deadline)}</div>
          </div>
        </div>
      </div>
    </div>
  );
}
