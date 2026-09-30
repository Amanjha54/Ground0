"use client";

import React, { useState } from 'react';
import Link from 'next/link';
import { useData } from '@/lib/data-context';
import { formatDate } from '@/lib/utils';
import { AlertTriangle, MapPin, Search, Filter, ChevronRight, Plus } from 'lucide-react';

export default function ComplaintsListPage() {
  const { complaints } = useData();
  const [search, setSearch] = useState('');
  const [filterCat, setFilterCat] = useState('ALL');

  const filtered = complaints.filter((c) => {
    const matchesSearch =
      c.tracking_number.toLowerCase().includes(search.toLowerCase()) ||
      c.description.toLowerCase().includes(search.toLowerCase()) ||
      (c.address && c.address.toLowerCase().includes(search.toLowerCase()));
    const matchesCat = filterCat === 'ALL' || c.category === filterCat;
    return matchesSearch && matchesCat;
  });

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-white/10 pb-4">
        <div>
          <h1 className="text-2xl font-bold text-white tracking-tight">Public Complaints Registry</h1>
          <p className="text-xs text-platinum-muted mt-1">
            Real-world civic defects submitted by citizens with GPS and visual proof.
          </p>
        </div>
        <Link
          href="/report"
          className="px-4 py-2 rounded-xl bg-gold-500 text-obsidian-950 font-bold text-xs flex items-center gap-1.5 shadow-md"
        >
          <Plus className="w-4 h-4" />
          Report New Defect
        </Link>
      </div>

      {/* Filter / Search Bar */}
      <div className="flex flex-col sm:flex-row gap-3">
        <div className="relative flex-1">
          <Search className="w-4 h-4 absolute left-3.5 top-3 text-platinum-subtle" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search tracking ID, description, address..."
            className="w-full pl-10 pr-4 py-2 rounded-xl bg-obsidian-950 border border-white/10 text-white text-xs font-mono focus:border-gold-500 focus:outline-none"
          />
        </div>
        <select
          value={filterCat}
          onChange={(e) => setFilterCat(e.target.value)}
          className="px-3 py-2 rounded-xl bg-obsidian-950 border border-white/10 text-xs font-mono text-platinum focus:border-gold-500 focus:outline-none"
        >
          <option value="ALL">All Categories</option>
          <option value="POTHOLE">Potholes</option>
          <option value="GARBAGE">Garbage & Waste</option>
          <option value="DRAIN_BLOCKAGE">Drain Blockages</option>
          <option value="BROKEN_STREETLIGHT">Streetlights</option>
        </select>
      </div>

      {/* Complaints List Table */}
      <div className="glass-panel rounded-2xl border border-white/10 overflow-hidden">
        <div className="divide-y divide-white/5">
          {filtered.map((c) => (
            <Link
              key={c.id}
              href={`/complaint/${c.id}`}
              className="p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3 hover:bg-white/5 transition-colors group"
            >
              <div className="space-y-1">
                <div className="flex items-center gap-2">
                  <span className="text-xs font-mono font-bold text-white group-hover:text-gold-400 transition-colors">
                    #{c.tracking_number}
                  </span>
                  <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-white/5 text-platinum border border-white/10">
                    {c.category}
                  </span>
                  <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-rose-950 text-rose-300 border border-rose-800">
                    {c.severity}
                  </span>
                </div>
                <p className="text-xs text-platinum-muted truncate max-w-xl">
                  {c.description}
                </p>
                <div className="text-[11px] font-mono text-platinum-subtle flex items-center gap-2">
                  <MapPin className="w-3 h-3 text-gold-400" />
                  <span>{c.address}</span>
                  <span>•</span>
                  <span>{formatDate(c.created_at)}</span>
                </div>
              </div>

              <div className="flex items-center gap-3">
                <span className="text-xs font-mono text-emerald-400 font-bold bg-emerald-950/60 px-2.5 py-1 rounded border border-emerald-800">
                  {c.status}
                </span>
                <ChevronRight className="w-4 h-4 text-platinum-subtle group-hover:text-gold-400 transition-colors" />
              </div>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
}
