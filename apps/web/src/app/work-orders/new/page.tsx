"use client";

import React, { useState, Suspense } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { useData } from '@/lib/data-context';
import { COMPLAINT_CATEGORIES } from '@ground0/config';
import { ComplaintCategory } from '@ground0/types';
import { Plus, ArrowLeft, CheckCircle2, ShieldCheck, Camera, FileText, Loader2 } from 'lucide-react';
import Link from 'next/link';

function NewWorkOrderForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const masterIssueId = searchParams.get('masterIssueId') || undefined;

  const { createWorkOrder, masterIssues } = useData();

  const linkedMaster = masterIssues.find((m) => m.id === masterIssueId);

  const [title, setTitle] = useState(
    linkedMaster ? `Remediation: ${linkedMaster.title}` : 'Emergency Asphalt Remediation & Patching'
  );
  const [description, setDescription] = useState(
    linkedMaster?.description || 'Excavate cracked asphalt base, fill with hot-mix asphalt (HMA), compact to grade, and apply edge sealant.'
  );
  const [category, setCategory] = useState<ComplaintCategory>(
    linkedMaster?.category || 'POTHOLE'
  );
  const [priority, setPriority] = useState<'LOW' | 'MEDIUM' | 'HIGH' | 'CRITICAL'>('HIGH');
  const [requirement1, setRequirement1] = useState('Total Cavity Backfill & Leveling');
  const [requirement2, setRequirement2] = useState('Perimeter Thermal Sealing');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    try {
      const wo = await createWorkOrder({
        masterIssueId,
        title,
        description,
        category,
        priority,
        requirements: [requirement1, requirement2].filter(Boolean),
      });
      router.push(`/work-orders/${wo.id}`);
    } catch (err) {
      console.error(err);
      setIsSubmitting(false);
    }
  };

  return (
    <div className="max-w-3xl mx-auto px-4 sm:px-6 py-10 space-y-6">
      <Link
        href="/work-orders"
        className="inline-flex items-center gap-1.5 text-xs font-mono text-platinum-muted hover:text-gold-400 transition-colors"
      >
        <ArrowLeft className="w-3.5 h-3.5" />
        Return to Work Orders
      </Link>

      <div className="space-y-1">
        <h1 className="text-2xl font-bold text-white tracking-tight">
          Create & Dispatch Work Order
        </h1>
        <p className="text-xs text-platinum-muted">
          Establish formal contractor dispatch with cryptographically verifiable completion criteria.
        </p>
      </div>

      <form onSubmit={handleSubmit} className="glass-panel p-6 sm:p-8 rounded-2xl border border-white/10 space-y-6">
        <div>
          <label className="block text-xs font-mono text-platinum-subtle mb-1">
            Work Order Title
          </label>
          <input
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            className="w-full px-3 py-2 rounded-xl bg-obsidian-950 border border-white/10 text-white text-xs font-mono focus:border-gold-500 focus:outline-none"
            required
          />
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-xs font-mono text-platinum-subtle mb-1">
              Issue Category
            </label>
            <select
              value={category}
              onChange={(e) => setCategory(e.target.value as any)}
              className="w-full px-3 py-2 rounded-xl bg-obsidian-950 border border-white/10 text-white text-xs font-mono focus:border-gold-500 focus:outline-none"
            >
              {COMPLAINT_CATEGORIES.map((c) => (
                <option key={c.id} value={c.id}>
                  {c.label}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-xs font-mono text-platinum-subtle mb-1">
              Priority
            </label>
            <select
              value={priority}
              onChange={(e) => setPriority(e.target.value as any)}
              className="w-full px-3 py-2 rounded-xl bg-obsidian-950 border border-white/10 text-white text-xs font-mono focus:border-gold-500 focus:outline-none"
            >
              <option value="LOW">Low</option>
              <option value="MEDIUM">Medium</option>
              <option value="HIGH">High</option>
              <option value="CRITICAL">Critical Hazard</option>
            </select>
          </div>
        </div>

        <div>
          <label className="block text-xs font-mono text-platinum-subtle mb-1">
            Contractor Scope of Work & Procedures
          </label>
          <textarea
            rows={3}
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            className="w-full px-3 py-2 rounded-xl bg-obsidian-950 border border-white/10 text-white text-xs leading-relaxed focus:border-gold-500 focus:outline-none"
            required
          />
        </div>

        {/* Verifiable Completion Criteria (Section 11) */}
        <div className="space-y-3 pt-2 border-t border-white/5">
          <div className="flex items-center justify-between">
            <span className="text-xs font-mono font-bold text-gold-400 uppercase">
              Mandatory AI Verification Criteria
            </span>
            <span className="text-[10px] font-mono text-platinum-subtle">Evaluated by Gemini</span>
          </div>

          <div className="space-y-2">
            <input
              type="text"
              value={requirement1}
              onChange={(e) => setRequirement1(e.target.value)}
              placeholder="Criterion 1 (e.g., Total Cavity Backfill & Leveling)"
              className="w-full px-3 py-2 rounded-xl bg-obsidian-950 border border-white/10 text-white text-xs font-mono focus:border-gold-500 focus:outline-none"
              required
            />
            <input
              type="text"
              value={requirement2}
              onChange={(e) => setRequirement2(e.target.value)}
              placeholder="Criterion 2 (e.g., Perimeter Thermal Sealing)"
              className="w-full px-3 py-2 rounded-xl bg-obsidian-950 border border-white/10 text-white text-xs font-mono focus:border-gold-500 focus:outline-none"
            />
          </div>
        </div>

        <button
          type="submit"
          disabled={isSubmitting}
          className="w-full py-3.5 rounded-xl bg-gradient-to-r from-gold-500 via-gold-400 to-gold-600 text-obsidian-950 font-bold text-xs uppercase tracking-wider flex items-center justify-center gap-2 shadow-lg gold-glow cursor-pointer"
        >
          <Plus className="w-4 h-4" />
          Dispatch Work Order
        </button>
      </form>
    </div>
  );
}

export default function NewWorkOrderPage() {
  return (
    <Suspense
      fallback={
        <div className="p-12 text-center text-xs font-mono text-platinum-muted flex items-center justify-center gap-2">
          <Loader2 className="w-4 h-4 animate-spin text-gold-400" />
          Loading Work Order Dispatch Interface...
        </div>
      }
    >
      <NewWorkOrderForm />
    </Suspense>
  );
}
