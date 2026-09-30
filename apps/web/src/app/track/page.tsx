"use client";

import React, { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useData } from '@/lib/data-context';
import { formatDate } from '@/lib/utils';
import { Search, MapPin, AlertCircle, ChevronRight, Sparkles } from 'lucide-react';

export default function TrackPage() {
  const router = useRouter();
  const { complaints } = useData();
  const [query, setQuery] = useState('');

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    const trimmed = query.trim().toUpperCase();
    if (!trimmed) return;

    const found = complaints.find(
      (c) => c.tracking_number.toUpperCase() === trimmed || c.id === query.trim()
    );
    if (found) {
      router.push(`/complaint/${found.id}`);
    } else {
      router.push(`/complaint/${complaints[0]?.id || 'GR0-2941'}`);
    }
  };

  return (
    <div className="max-w-4xl mx-auto px-4 py-12 sm:px-6 space-y-10">
      <div className="text-center space-y-3">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-gold-500/10 border border-gold-500/30 text-gold-400 text-xs font-mono">
          <Sparkles className="w-3.5 h-3.5" />
          <span>Public Transparency Registry</span>
        </div>
        <h1 className="text-3xl sm:text-4xl font-extrabold text-white">
          Track a Civic Complaint
        </h1>
        <p className="text-sm text-platinum-muted max-w-xl mx-auto">
          Enter your unique Ground0 tracking identifier (e.g., GR0-2941) to inspect real-time progress, AI verification status, and work order closure.
        </p>

        {/* Search Bar */}
        <form onSubmit={handleSearch} className="max-w-md mx-auto pt-4 flex gap-2">
          <div className="relative flex-1">
            <Search className="w-4 h-4 absolute left-3.5 top-3.5 text-platinum-subtle" />
            <input
              type="text"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Enter GR0-XXXX..."
              className="w-full pl-10 pr-4 py-3 rounded-xl bg-obsidian-950 border border-white/10 text-white text-xs font-mono uppercase focus:border-gold-500 focus:outline-none"
            />
          </div>
          <button
            type="submit"
            className="px-5 py-3 rounded-xl bg-gold-500 hover:bg-gold-400 text-obsidian-950 font-bold text-xs uppercase tracking-wider transition-all"
          >
            Track
          </button>
        </form>
      </div>

      {/* Recent Public Reports */}
      <div className="glass-panel p-6 rounded-2xl border border-white/10 space-y-4">
        <h3 className="text-xs font-mono font-bold text-gold-400 uppercase tracking-wider">
          Recent Public Verified Incidents
        </h3>

        <div className="divide-y divide-white/5">
          {complaints.map((c) => (
            <Link
              key={c.id}
              href={`/complaint/${c.id}`}
              className="py-3 flex items-center justify-between hover:bg-white/5 px-3 rounded-lg transition-colors group"
            >
              <div className="space-y-1">
                <div className="flex items-center gap-2">
                  <span className="text-xs font-mono font-bold text-white group-hover:text-gold-400 transition-colors">
                    {c.tracking_number}
                  </span>
                  <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-white/5 text-platinum-muted border border-white/10">
                    {c.category}
                  </span>
                  <span className="text-[10px] font-mono text-emerald-400">
                    {c.status}
                  </span>
                </div>
                <div className="text-xs text-platinum-muted flex items-center gap-2">
                  <MapPin className="w-3 h-3 text-platinum-subtle" />
                  <span>{c.address}</span>
                  <span>•</span>
                  <span>{formatDate(c.created_at)}</span>
                </div>
              </div>
              <ChevronRight className="w-4 h-4 text-platinum-subtle group-hover:text-gold-400 transition-colors" />
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
}
