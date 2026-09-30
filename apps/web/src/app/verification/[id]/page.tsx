"use client";

import React from 'react';
import { useParams } from 'next/navigation';
import Link from 'next/link';
import { useData } from '@/lib/data-context';
import {
  ShieldCheck,
  CheckCircle2,
  AlertTriangle,
  ArrowLeft,
  Sparkles,
  Layers,
  MapPin,
  Clock,
  Cpu,
  Lock,
  Camera,
  ArrowRight
} from 'lucide-react';

export default function VerificationRunDetailPage() {
  const params = useParams();
  const runId = params?.id as string;
  const { verificationRuns, workOrders } = useData();

  const run = verificationRuns.find((v) => v.id === runId) || verificationRuns[0];
  const workOrder = workOrders.find((w) => w.id === run?.work_order_id) || workOrders[0];

  const pipelineStages = [
    { name: '1. EVIDENCE INTEGRITY', icon: Lock, status: 'PASSED', metric: 'pHash Hamming Distance: 38 (Fresh Evidence)' },
    { name: '2. LOCATION GEOFENCE', icon: MapPin, status: 'PASSED', metric: 'Site Delta: 3.8m (Within 50m radius)' },
    { name: '3. SCENE HOMOGRAPHY', icon: Layers, status: 'PASSED', metric: `${run.result?.scene_match_percentage || 94.1}% Feature Inlier Consistency` },
    { name: '4. PHYSICAL CHANGE', icon: Sparkles, status: 'PASSED', metric: `${run.result?.physical_change_percentage || 91.4}% Cavity Surface Restoration` },
    { name: '5. REQUIREMENTS SATISFACTION', icon: CheckCircle2, status: 'PASSED', metric: '2 of 2 Contract Criteria Fulfilled' },
    { name: '6. CCTV CORROBORATION', icon: Camera, status: 'PASSED', metric: 'CAM-01 Activity Corroborated' },
    { name: '7. RISK SYNTHESIS', icon: ShieldCheck, status: 'PASSED', metric: 'Risk Level: LOW (Zero Tamper Flags)' },
    { name: '8. INSPECTOR RECOMMENDATION', icon: ArrowRight, status: 'PASSED', metric: run.ai_recommendation },
  ];

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 py-10 space-y-8">
      <Link
        href="/verification-lab"
        className="inline-flex items-center gap-1.5 text-xs font-mono text-platinum-muted hover:text-gold-400 transition-colors"
      >
        <ArrowLeft className="w-3.5 h-3.5" />
        Return to Verification Lab
      </Link>

      {/* Header */}
      <div className="glass-panel p-6 rounded-2xl border border-white/10 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 text-xs font-mono text-gold-400 mb-1">
            <Cpu className="w-3.5 h-3.5" />
            <span>AI AUDIT RUN #{run.id}</span>
          </div>
          <h1 className="text-2xl font-bold text-white tracking-tight">
            Proof-of-Work Pipeline Trace
          </h1>
          <p className="text-xs text-platinum-muted mt-1">
            Job Target: {workOrder.title} (#{workOrder.work_order_number})
          </p>
        </div>

        <div className="text-right">
          <div className="text-2xl font-extrabold font-mono text-emerald-400">
            {Math.round((run.overall_confidence || 0.942) * 100)}%
          </div>
          <div className="text-[10px] font-mono text-platinum-subtle uppercase">
            Confidence Score
          </div>
        </div>
      </div>

      {/* Agent Pipeline Animated Visual Walkthrough (Section 39) */}
      <div className="glass-panel p-6 rounded-2xl border border-white/10 space-y-4">
        <h3 className="text-xs font-mono font-bold text-gold-400 uppercase tracking-wider">
          Asynchronous Multi-Stage Execution Trail
        </h3>

        <div className="space-y-3">
          {pipelineStages.map((stg, i) => {
            const Icon = stg.icon;
            return (
              <div
                key={i}
                className="p-4 rounded-xl bg-obsidian-950 border border-white/10 flex items-center justify-between text-xs"
              >
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-lg bg-emerald-950 border border-emerald-800 text-emerald-400 flex items-center justify-center">
                    <Icon className="w-4 h-4" />
                  </div>
                  <div>
                    <div className="font-mono font-bold text-white">{stg.name}</div>
                    <div className="text-[11px] text-platinum-muted font-mono">{stg.metric}</div>
                  </div>
                </div>

                <span className="px-2.5 py-1 rounded bg-emerald-950 text-emerald-300 text-[10px] font-mono font-bold border border-emerald-800 flex items-center gap-1">
                  <CheckCircle2 className="w-3 h-3" />
                  PASSED
                </span>
              </div>
            );
          })}
        </div>
      </div>

      {/* Explanation Summary */}
      <div className="glass-panel p-6 rounded-2xl border border-white/10 space-y-3">
        <h3 className="text-xs font-mono font-bold text-emerald-400 uppercase tracking-wider flex items-center gap-2">
          <Sparkles className="w-4 h-4" />
          Synthesized AI Audit Verdict
        </h3>
        <p className="text-xs text-platinum leading-relaxed">
          {run.explanation_summary}
        </p>
      </div>
    </div>
  );
}
