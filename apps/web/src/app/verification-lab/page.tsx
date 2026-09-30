"use client";

import React, { useState } from 'react';
import Link from 'next/link';
import { useData } from '@/lib/data-context';
import { BeforeAfterSlider } from '@/components/verification/BeforeAfterSlider';
import { truncateHash } from '@/lib/utils';
import {
  ShieldCheck,
  CheckCircle2,
  AlertTriangle,
  Lock,
  MapPin,
  Clock,
  Sparkles,
  Layers,
  ArrowRight,
  Eye,
  Camera,
  Activity,
  FileCheck,
  XCircle,
  HelpCircle,
  ChevronRight
} from 'lucide-react';

export default function VerificationLabPage() {
  const { verificationRuns, workOrders, conductHumanReview } = useData();

  const [selectedRunId, setSelectedRunId] = useState<string>(
    verificationRuns[0]?.id || 'vr-901'
  );
  const [reviewNotes, setReviewNotes] = useState('');
  const [reviewSubmitted, setReviewSubmitted] = useState(false);
  const [decisionAction, setDecisionAction] = useState<string | null>(null);

  const activeRun = verificationRuns.find((v) => v.id === selectedRunId) || verificationRuns[0];
  const associatedWO = workOrders.find((w) => w.id === activeRun?.work_order_id) || workOrders[0];

  const beforePhoto = 'https://images.unsplash.com/photo-1515162816999-a0c47dc192f7?auto=format&fit=crop&w=800&q=80';
  const afterPhoto = 'https://images.unsplash.com/photo-1544620347-c4fd4a3d5957?auto=format&fit=crop&w=800&q=80';

  const handleReviewAction = async (decision: 'APPROVE' | 'REJECT' | 'REQUEST_MORE_EVIDENCE') => {
    setDecisionAction(decision);
    await conductHumanReview(
      activeRun.id,
      associatedWO.id,
      decision,
      reviewNotes || `Official inspector sign-off: ${decision}`
    );
    setReviewSubmitted(true);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-white/10 pb-4">
        <div>
          <div className="flex items-center gap-2 text-xs font-mono text-gold-400 mb-1">
            <Sparkles className="w-3.5 h-3.5" />
            <span>DUAL-PANE MULTIMODAL AUDIT ENVIRONMENT</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
            Verification Lab
          </h1>
        </div>

        {/* Work Order Selector */}
        <div className="flex items-center gap-2">
          <span className="text-xs font-mono text-platinum-subtle">Audit Target:</span>
          <select
            value={selectedRunId}
            onChange={(e) => {
              setSelectedRunId(e.target.value);
              setReviewSubmitted(false);
            }}
            className="px-3 py-1.5 rounded-lg bg-obsidian-950 border border-white/10 text-gold-300 text-xs font-mono focus:border-gold-500 focus:outline-none"
          >
            {verificationRuns.map((r) => (
              <option key={r.id} value={r.id}>
                Run #{r.id} (WO #{r.work_order_id.slice(0, 8)})
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Main 3-Column Verification Layout (Section 38) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left Column: BEFORE Evidence & Cryptographic Anchor */}
        <div className="lg:col-span-3 space-y-4">
          <div className="glass-panel p-4 rounded-2xl border border-white/10 space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-xs font-mono font-bold text-amber-400 uppercase">
                1. Initial Defect
              </span>
              <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-amber-950 text-amber-300 border border-amber-800">
                BEFORE
              </span>
            </div>

            <div className="rounded-xl overflow-hidden border border-white/10 h-44 bg-obsidian-950 relative">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={beforePhoto} alt="Before" className="w-full h-full object-cover" />
            </div>

            <div className="space-y-1.5 text-[11px] font-mono text-platinum-muted">
              <div className="flex justify-between">
                <span className="text-platinum-subtle">SHA-256:</span>
                <span className="text-platinum">{truncateHash('a9b8c7d6e5f41234567890abcdef1234567890abcdef1234567890abcdef1234')}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-platinum-subtle">pHash:</span>
                <span className="text-platinum">f4b2c1a8e930</span>
              </div>
              <div className="flex justify-between">
                <span className="text-platinum-subtle">GPS Delta:</span>
                <span className="text-emerald-400 font-bold">0.0m (Ground Zero)</span>
              </div>
            </div>
          </div>

          {/* Work Order Specification */}
          <div className="glass-panel p-4 rounded-2xl border border-white/10 space-y-2 text-xs">
            <div className="text-[11px] font-mono text-gold-400 font-bold uppercase">
              Contract Specifications
            </div>
            <div className="font-bold text-white">{associatedWO.title}</div>
            <p className="text-platinum-muted leading-relaxed text-[11px]">
              {associatedWO.description}
            </p>
            <div className="pt-2 border-t border-white/5 space-y-1 text-[11px]">
              <div className="text-platinum-subtle font-mono">Mandatory Criteria:</div>
              {associatedWO.requirements?.map((req) => (
                <div key={req.id} className="flex items-center gap-1.5 text-platinum">
                  <CheckCircle2 className="w-3 h-3 text-emerald-400" />
                  <span>{req.title}</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Center Column: Interactive Comparison Suite */}
        <div className="lg:col-span-5 space-y-4">
          <div className="glass-panel p-5 rounded-2xl border border-white/10 space-y-4">
            <div className="flex items-center justify-between">
              <span className="text-xs font-mono font-bold text-white uppercase tracking-wider flex items-center gap-1.5">
                <Layers className="w-4 h-4 text-gold-400" />
                Evidence Comparison Matrix
              </span>
              <span className="text-[10px] font-mono text-emerald-400">
                Live Dynamic Shader Active
              </span>
            </div>

            <BeforeAfterSlider
              beforeImage={beforePhoto}
              afterImage={afterPhoto}
              beforeLabel="BEFORE"
              afterLabel="AFTER"
            />
          </div>

          {/* Inspector Action Controls */}
          <div className="glass-panel p-5 rounded-2xl border border-white/10 space-y-3">
            <h4 className="text-xs font-mono font-bold text-white uppercase tracking-wider">
              Official Inspector Determination
            </h4>
            <p className="text-xs text-platinum-muted">
              AI provides mathematical verification. Authorized municipal officers retain final legal sign-off.
            </p>

            <textarea
              rows={2}
              value={reviewNotes}
              onChange={(e) => setReviewNotes(e.target.value)}
              placeholder="Add official audit remarks for municipal ledger..."
              className="w-full px-3 py-2 rounded-xl bg-obsidian-950 border border-white/10 text-white text-xs leading-relaxed focus:border-gold-500 focus:outline-none"
            />

            {!reviewSubmitted ? (
              <div className="grid grid-cols-3 gap-2 pt-1">
                <button
                  type="button"
                  onClick={() => handleReviewAction('APPROVE')}
                  className="py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs flex items-center justify-center gap-1 transition-all shadow-md cursor-pointer"
                >
                  <CheckCircle2 className="w-3.5 h-3.5" />
                  APPROVE
                </button>
                <button
                  type="button"
                  onClick={() => handleReviewAction('REJECT')}
                  className="py-2.5 rounded-xl bg-crimson-600 hover:bg-crimson-500 text-white font-bold text-xs flex items-center justify-center gap-1 transition-all shadow-md cursor-pointer"
                >
                  <XCircle className="w-3.5 h-3.5" />
                  REJECT
                </button>
                <button
                  type="button"
                  onClick={() => handleReviewAction('REQUEST_MORE_EVIDENCE')}
                  className="py-2.5 rounded-xl bg-white/10 hover:bg-white/20 text-platinum font-bold text-xs flex items-center justify-center gap-1 transition-all border border-white/10 cursor-pointer"
                >
                  <HelpCircle className="w-3.5 h-3.5" />
                  MORE EVIDENCE
                </button>
              </div>
            ) : (
              <div className="p-3 rounded-xl glass-panel-emerald border border-emerald-500/40 text-center text-xs font-mono text-emerald-300">
                ✓ Decision Recorded: <strong>{decisionAction}</strong>. Audit trail updated.
              </div>
            )}
          </div>
        </div>

        {/* Right Column: Verification Intelligence & 8-Stage Telemetry */}
        <div className="lg:col-span-4 space-y-4">
          <div className="glass-panel p-5 rounded-2xl border border-white/10 space-y-4">
            <div className="flex items-center justify-between border-b border-white/10 pb-3">
              <div>
                <span className="text-[10px] font-mono text-platinum-subtle uppercase">
                  Overall Confidence
                </span>
                <div className="text-3xl font-extrabold font-mono text-emerald-400">
                  {Math.round((activeRun.overall_confidence || 0.942) * 100)}%
                </div>
              </div>
              <div className="text-right">
                <span className="text-[10px] font-mono text-platinum-subtle uppercase">
                  Risk Level
                </span>
                <div className="text-sm font-bold font-mono text-emerald-400">
                  {activeRun.risk_score ? (activeRun.risk_score < 0.2 ? 'LOW' : 'ELEVATED') : 'LOW'}
                </div>
              </div>
            </div>

            {/* Granular Pipeline Stage Statuses */}
            <div className="space-y-2">
              <div className="text-xs font-mono font-bold text-gold-400 uppercase">
                8-Stage Pipeline Telemetry
              </div>
              {activeRun.steps?.map((step) => (
                <div
                  key={step.id}
                  className="p-2 rounded-lg bg-obsidian-950 border border-white/5 flex items-center justify-between text-xs font-mono"
                >
                  <span className="text-platinum-muted truncate max-w-[170px]">
                    {step.step_name}
                  </span>
                  <span className="text-emerald-400 font-bold flex items-center gap-1">
                    <CheckCircle2 className="w-3 h-3" />
                    {step.score ? `${Math.round(step.score * 100)}%` : 'PASSED'}
                  </span>
                </div>
              ))}
            </div>

            {/* Multimodal Gemini Explanation */}
            <div className="p-3.5 rounded-xl bg-obsidian-950 border border-white/5 space-y-1.5 text-xs">
              <div className="text-[10px] font-mono text-gold-400 font-bold uppercase flex items-center gap-1.5">
                <Sparkles className="w-3 h-3" />
                Gemini Multimodal Reasoning
              </div>
              <p className="text-platinum-muted leading-relaxed text-[11px]">
                {activeRun.result?.gemini_audit_report || activeRun.explanation_summary}
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
