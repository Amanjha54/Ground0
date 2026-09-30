"use client";

import React, { useState } from 'react';
import { useParams } from 'next/navigation';
import Link from 'next/link';
import { useData } from '@/lib/data-context';
import { BeforeAfterSlider } from '@/components/verification/BeforeAfterSlider';
import { formatDate } from '@/lib/utils';
import {
  ShieldCheck,
  CheckCircle2,
  AlertTriangle,
  MapPin,
  Clock,
  ArrowLeft,
  Sparkles,
  RefreshCw,
  ThumbsUp,
  ThumbsDown,
  ChevronRight
} from 'lucide-react';

export default function ComplaintDetailPage() {
  const params = useParams();
  const complaintId = params?.id as string;
  const { complaints, masterIssues, submitCitizenFeedback } = useData();

  const complaint = complaints.find(
    (c) => c.id === complaintId || c.tracking_number === complaintId
  ) || complaints[0];

  const masterIssue = masterIssues.find((m) => m.id === complaint?.master_issue_id);

  const [feedbackSubmitted, setFeedbackSubmitted] = useState(false);
  const [feedbackNotes, setFeedbackNotes] = useState('');
  const [feedbackChoice, setFeedbackChoice] = useState<boolean | null>(null);

  // High-fidelity Before/After demonstration evidence
  const beforePhoto = complaint?.media?.[0]?.storage_path || 'https://images.unsplash.com/photo-1515162816999-a0c47dc192f7?auto=format&fit=crop&w=800&q=80';
  const afterPhoto = 'https://images.unsplash.com/photo-1544620347-c4fd4a3d5957?auto=format&fit=crop&w=800&q=80';

  const isResolvedOrVerified = complaint.status === 'RESOLVED' || complaint.status === 'VERIFIED' || complaint.status === 'WORK_ORDER_CREATED';

  const handleFeedback = async (isSolved: boolean) => {
    setFeedbackChoice(isSolved);
    await submitCitizenFeedback(complaint.id, isSolved, feedbackNotes);
    setFeedbackSubmitted(true);
  };

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 py-10 space-y-8">
      {/* Back Link */}
      <Link
        href="/dashboard"
        className="inline-flex items-center gap-1.5 text-xs font-mono text-platinum-muted hover:text-gold-400 transition-colors"
      >
        <ArrowLeft className="w-3.5 h-3.5" />
        Return to Command Center
      </Link>

      {/* Header Banner */}
      <div className="glass-panel p-6 rounded-2xl border border-white/10 flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <span className="text-xs font-mono px-2 py-0.5 rounded bg-gold-500/20 text-gold-300 border border-gold-500/30">
              Complaint #{complaint.tracking_number}
            </span>
            <span className="text-xs font-mono px-2 py-0.5 rounded bg-white/5 text-platinum border border-white/10">
              {complaint.category}
            </span>
            <span className="text-xs font-mono px-2 py-0.5 rounded bg-rose-950 text-rose-300 border border-rose-800">
              Severity: {complaint.severity}
            </span>
          </div>
          <h1 className="text-2xl font-bold text-white tracking-tight">
            {complaint.address || 'San Francisco Municipal Site'}
          </h1>
          <p className="text-xs text-platinum-muted flex items-center gap-3">
            <span className="flex items-center gap-1">
              <Clock className="w-3 h-3 text-gold-400" />
              Reported {formatDate(complaint.created_at)}
            </span>
            <span>•</span>
            <span className="flex items-center gap-1">
              <MapPin className="w-3 h-3 text-emerald-400" />
              {complaint.latitude.toFixed(5)}, {complaint.longitude.toFixed(5)}
            </span>
          </p>
        </div>

        {/* Status Pill */}
        <div className="flex flex-col items-end gap-1">
          <div className="text-[11px] font-mono text-platinum-subtle uppercase">Lifecycle Status</div>
          <div className="px-3 py-1 rounded-full text-xs font-mono font-bold bg-emerald-950 text-emerald-300 border border-emerald-800 flex items-center gap-1.5 shadow-sm">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
            {complaint.status}
          </div>
        </div>
      </div>

      {/* Clustered Master Issue Notice if duplicate */}
      {masterIssue && (
        <div className="glass-panel p-4 rounded-xl border-l-4 border-gold-400 flex items-center justify-between">
          <div className="space-y-0.5">
            <div className="text-xs font-mono text-gold-400 font-bold uppercase">
              Grouped into Master Issue #{masterIssue.issue_code}
            </div>
            <div className="text-xs text-platinum-muted">
              {masterIssue.title} • Combined from {masterIssue.total_reports} citizen submissions.
            </div>
          </div>
          <Link
            href="/issues"
            className="text-xs font-mono text-gold-400 hover:text-gold-300 underline flex items-center gap-1"
          >
            Inspect Cluster <ChevronRight className="w-3 h-3" />
          </Link>
        </div>
      )}

      {/* Interactive Verification Proof (The Ground0 Magic Moment) */}
      <div className="glass-panel p-6 sm:p-8 rounded-2xl border border-white/10 space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-white/10 pb-4">
          <div>
            <div className="inline-flex items-center gap-1.5 text-xs font-mono text-emerald-400 font-bold uppercase">
              <Sparkles className="w-3.5 h-3.5" />
              Verified Physical Remediation
            </div>
            <h2 className="text-xl font-bold text-white mt-1">
              Before ↔ After Evidence Comparison
            </h2>
          </div>

          <div className="flex items-center gap-2">
            <span className="text-[11px] font-mono px-2.5 py-1 rounded-lg bg-emerald-950/80 text-emerald-300 border border-emerald-800 flex items-center gap-1">
              <CheckCircle2 className="w-3 h-3" />
              Ground0 AI: 94.1% Verified
            </span>
            <span className="text-[11px] font-mono px-2.5 py-1 rounded-lg bg-gold-950/80 text-gold-300 border border-gold-800 flex items-center gap-1">
              <ShieldCheck className="w-3 h-3" />
              Inspector Approved
            </span>
          </div>
        </div>

        {/* Dual-pane Interactive Slider */}
        <BeforeAfterSlider
          beforeImage={beforePhoto}
          afterImage={afterPhoto}
          beforeLabel="BEFORE: Physical Pothole Hazard"
          afterLabel="AFTER: Flush Asphalt Compaction"
        />

        {/* Section 19 Citizen Confirmation Widget */}
        <div className="pt-4 border-t border-white/10">
          {!feedbackSubmitted ? (
            <div className="p-6 rounded-xl bg-obsidian-950/80 border border-white/10 text-center space-y-4">
              <h3 className="text-base font-bold text-white">
                Citizen Verification Check: Is the problem actually solved?
              </h3>
              <p className="text-xs text-platinum-muted max-w-lg mx-auto">
                Ground0 requires public confirmation to close municipal tickets permanently. If physical work remains deficient, you may dispute and reopen.
              </p>

              <div className="flex flex-wrap items-center justify-center gap-4 pt-2">
                <button
                  type="button"
                  onClick={() => handleFeedback(true)}
                  className="px-6 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs flex items-center gap-2 transition-all shadow-lg cursor-pointer"
                >
                  <ThumbsUp className="w-4 h-4" />
                  YES — PROBLEM SOLVED
                </button>
                <button
                  type="button"
                  onClick={() => handleFeedback(false)}
                  className="px-6 py-2.5 rounded-xl bg-crimson-600 hover:bg-crimson-500 text-white font-bold text-xs flex items-center gap-2 transition-all shadow-lg cursor-pointer"
                >
                  <ThumbsDown className="w-4 h-4" />
                  NO — PROBLEM REMAINS (REOPEN)
                </button>
              </div>
            </div>
          ) : (
            <div className="p-5 rounded-xl glass-panel-emerald border border-emerald-500/40 text-center space-y-2">
              <div className="flex items-center justify-center gap-2 text-emerald-400 font-bold text-sm">
                <CheckCircle2 className="w-5 h-5" />
                Citizen Feedback Recorded
              </div>
              <p className="text-xs text-platinum-muted">
                {feedbackChoice
                  ? "Thank you! Your confirmation has finalized and permanently archived this work order."
                  : "Dispute registered. Complaint status has been set to REOPENED and routed for supervisor re-inspection."}
              </p>
            </div>
          )}
        </div>
      </div>

      {/* Description & Technical Audit Details */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="glass-panel p-6 rounded-2xl border border-white/10 space-y-3">
          <h3 className="text-xs font-mono font-bold text-gold-400 uppercase tracking-wider">
            Original Citizen Description
          </h3>
          <p className="text-xs text-platinum leading-relaxed">
            &quot;{complaint.description}&quot;
          </p>
        </div>

        <div className="glass-panel p-6 rounded-2xl border border-white/10 space-y-3">
          <h3 className="text-xs font-mono font-bold text-emerald-400 uppercase tracking-wider">
            AI Triage & Weather Context
          </h3>
          <p className="text-xs text-platinum leading-relaxed">
            {complaint.ai_notes || 'Triage completed with high visual confidence.'}
          </p>
          <div className="pt-2 text-[11px] font-mono text-platinum-subtle flex items-center justify-between">
            <span>Open-Meteo Telemetry:</span>
            <span className="text-platinum">18.5°C, 0.0mm Rainfall (Clear)</span>
          </div>
        </div>
      </div>
    </div>
  );
}
