"use client";

import React from 'react';
import Link from 'next/link';
import { useData } from '@/lib/data-context';
import { truncateHash } from '@/lib/utils';
import { Lock, FileCheck, Eye, ShieldCheck, Layers } from 'lucide-react';

export default function EvidenceGalleryPage() {
  const { complaints } = useData();

  const evidenceItems = [
    {
      id: 'ev-01',
      title: 'Pothole Defect - Market St & 7th',
      stage: 'BEFORE',
      sha: 'a9b8c7d6e5f41234567890abcdef1234567890abcdef1234567890abcdef1234',
      phash: 'f4b2c1a8e930',
      image: 'https://images.unsplash.com/photo-1515162816999-a0c47dc192f7?auto=format&fit=crop&w=800&q=80',
      workOrder: 'WO-2091',
    },
    {
      id: 'ev-02',
      title: 'Compacted Asphalt Patch Repair',
      stage: 'AFTER',
      sha: '3c4d5e6f7a8b901234567890abcdef1234567890abcdef1234567890abcdef12',
      phash: 'a1c9e8d4f2b0',
      image: 'https://images.unsplash.com/photo-1544620347-c4fd4a3d5957?auto=format&fit=crop&w=800&q=80',
      workOrder: 'WO-2091',
    },
    {
      id: 'ev-03',
      title: 'Illegal Waste Accumulation',
      stage: 'BEFORE',
      sha: '7f8e9d0a1b2c34567890abcdef1234567890abcdef1234567890abcdef1234',
      phash: 'd8c2e4f0a9b1',
      image: 'https://images.unsplash.com/photo-1532996122724-e3c354a0b15b?auto=format&fit=crop&w=800&q=80',
      workOrder: 'WO-2092',
    }
  ];

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6">
      <div className="border-b border-white/10 pb-4">
        <div className="flex items-center gap-2 text-xs font-mono text-gold-400 mb-1">
          <Lock className="w-3.5 h-3.5" />
          <span>CRYPTOGRAPHIC EVIDENCE EXPLORER</span>
        </div>
        <h1 className="text-2xl font-bold text-white tracking-tight">Evidence Vault</h1>
        <p className="text-xs text-platinum-muted mt-1">
          Cryptographically hashed physical artifacts, perceptual fingerprints, and provenance chains.
        </p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {evidenceItems.map((item) => (
          <div
            key={item.id}
            className="glass-panel rounded-2xl overflow-hidden border border-white/10 space-y-3 p-4 hover:border-gold-500/30 transition-colors"
          >
            <div className="relative h-48 rounded-xl overflow-hidden bg-obsidian-950">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={item.image} alt={item.title} className="w-full h-full object-cover" />
              <div className="absolute top-2 left-2 px-2 py-0.5 rounded text-[10px] font-mono font-bold bg-obsidian-950/80 text-white border border-white/10">
                {item.stage}
              </div>
            </div>

            <div className="space-y-1">
              <h4 className="text-sm font-bold text-white truncate">{item.title}</h4>
              <div className="text-[11px] font-mono text-platinum-subtle">Job #{item.workOrder}</div>
            </div>

            <div className="p-2.5 rounded-xl bg-obsidian-950 border border-white/5 space-y-1 text-[11px] font-mono">
              <div className="flex justify-between">
                <span className="text-platinum-subtle">SHA-256:</span>
                <span className="text-platinum">{truncateHash(item.sha, 6, 6)}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-platinum-subtle">pHash:</span>
                <span className="text-emerald-400">{item.phash}</span>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
