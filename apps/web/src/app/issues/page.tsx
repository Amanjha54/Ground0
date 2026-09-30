"use client";

import React from 'react';
import Link from 'next/link';
import { useData } from '@/lib/data-context';
import { Layers, MapPin, ChevronRight, Plus, AlertCircle, ArrowRight } from 'lucide-react';

export default function MasterIssuesPage() {
  const { masterIssues } = useData();

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-white/10 pb-4">
        <div>
          <div className="flex items-center gap-2 text-xs font-mono text-gold-400 mb-1">
            <Layers className="w-3.5 h-3.5" />
            <span>AGENTIC DEDUPLICATION & SPATIAL CLUSTERING</span>
          </div>
          <h1 className="text-2xl font-bold text-white tracking-tight">
            Master Infrastructure Issues
          </h1>
          <p className="text-xs text-platinum-muted mt-1">
            Clustered municipal problems grouped across geographic distance and visual embedding similarity.
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

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {masterIssues.map((issue) => (
          <div
            key={issue.id}
            className="glass-panel p-6 rounded-2xl border border-white/10 space-y-4 hover:border-gold-500/40 transition-colors"
          >
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <span className="text-xs font-mono font-bold px-2.5 py-1 rounded bg-gold-500/20 text-gold-300 border border-gold-500/30">
                  Master #{issue.issue_code}
                </span>
                <span className="text-xs font-mono px-2 py-0.5 rounded bg-white/5 text-platinum">
                  {issue.category}
                </span>
              </div>
              <span className="text-xs font-mono px-2.5 py-1 rounded bg-emerald-950 text-emerald-300 border border-emerald-800 font-bold">
                {issue.total_reports} Citizen Reports Clustered
              </span>
            </div>

            <div>
              <h3 className="text-base font-bold text-white">{issue.title}</h3>
              <p className="text-xs text-platinum-muted mt-1.5 leading-relaxed">
                {issue.description}
              </p>
            </div>

            <div className="p-3 rounded-xl bg-obsidian-950 border border-white/5 space-y-1 text-xs font-mono text-platinum-subtle">
              <div className="flex items-center gap-1.5 text-platinum">
                <MapPin className="w-3.5 h-3.5 text-gold-400" />
                <span>{issue.address}</span>
              </div>
              <div className="text-[11px] text-platinum-muted">
                Spatial Radius: 75m cluster • DINOv2 embedding cosine similarity &gt; 0.88
              </div>
            </div>

            <div className="flex items-center justify-between pt-2 border-t border-white/5">
              <span className="text-xs font-mono text-rose-400 font-bold">
                Priority: {issue.severity}
              </span>
              <Link
                href={`/work-orders/new?masterIssueId=${issue.id}`}
                className="px-3.5 py-1.5 rounded-lg bg-gold-500 hover:bg-gold-400 text-obsidian-950 font-bold text-xs flex items-center gap-1 transition-all"
              >
                Dispatch Work Order <ArrowRight className="w-3.5 h-3.5" />
              </Link>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
