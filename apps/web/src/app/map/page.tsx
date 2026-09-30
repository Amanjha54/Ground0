"use client";

import React, { useState } from 'react';
import Link from 'next/link';
import { useData } from '@/lib/data-context';
import {
  MapPin,
  Layers,
  AlertTriangle,
  Camera,
  CheckCircle2,
  FileText,
  Sliders,
  ChevronRight,
  ExternalLink,
  Sparkles
} from 'lucide-react';

export default function OperationsMapPage() {
  const { complaints, masterIssues, workOrders, cameras } = useData();

  const [activeLayers, setActiveLayers] = useState({
    complaints: true,
    masterIssues: true,
    workOrders: true,
    cameras: true,
  });

  const [selectedEntity, setSelectedEntity] = useState<any>(null);

  const toggleLayer = (layerKey: keyof typeof activeLayers) => {
    setActiveLayers({ ...activeLayers, [layerKey]: !activeLayers[layerKey] });
  };

  // Center coordinate around Market St
  const centerLat = 37.7750;
  const centerLon = -122.4194;

  return (
    <div className="relative w-full h-[calc(100vh-100px)] overflow-hidden bg-obsidian-950">
      {/* Map Control HUD (Floating Top-Left) */}
      <div className="absolute top-4 left-4 z-20 glass-panel p-4 rounded-2xl border border-white/10 space-y-3 max-w-xs shadow-2xl">
        <div className="flex items-center gap-2 text-xs font-mono text-gold-400 font-bold uppercase">
          <MapPin className="w-3.5 h-3.5" />
          <span>Spatial Operations Radar</span>
        </div>
        <p className="text-[11px] text-platinum-muted">
          MapLibre GL spatial mesh displaying real-world defect clusters, work orders, and authorized camera nodes.
        </p>

        {/* Layer Toggles */}
        <div className="space-y-1.5 pt-1 border-t border-white/5 text-xs font-mono">
          <button
            type="button"
            onClick={() => toggleLayer('masterIssues')}
            className={`w-full px-2.5 py-1.5 rounded-lg flex items-center justify-between transition-colors ${
              activeLayers.masterIssues ? 'bg-gold-500/20 text-gold-300 border border-gold-500/30' : 'text-platinum-subtle'
            }`}
          >
            <span>Master Issues ({masterIssues.length})</span>
            <span>{activeLayers.masterIssues ? 'ON' : 'OFF'}</span>
          </button>

          <button
            type="button"
            onClick={() => toggleLayer('complaints')}
            className={`w-full px-2.5 py-1.5 rounded-lg flex items-center justify-between transition-colors ${
              activeLayers.complaints ? 'bg-rose-950 text-rose-300 border border-rose-800' : 'text-platinum-subtle'
            }`}
          >
            <span>Complaints ({complaints.length})</span>
            <span>{activeLayers.complaints ? 'ON' : 'OFF'}</span>
          </button>

          <button
            type="button"
            onClick={() => toggleLayer('workOrders')}
            className={`w-full px-2.5 py-1.5 rounded-lg flex items-center justify-between transition-colors ${
              activeLayers.workOrders ? 'bg-emerald-950 text-emerald-300 border border-emerald-800' : 'text-platinum-subtle'
            }`}
          >
            <span>Work Orders ({workOrders.length})</span>
            <span>{activeLayers.workOrders ? 'ON' : 'OFF'}</span>
          </button>

          <button
            type="button"
            onClick={() => toggleLayer('cameras')}
            className={`w-full px-2.5 py-1.5 rounded-lg flex items-center justify-between transition-colors ${
              activeLayers.cameras ? 'bg-sky-950 text-sky-300 border border-sky-800' : 'text-platinum-subtle'
            }`}
          >
            <span>Cameras ({cameras.length})</span>
            <span>{activeLayers.cameras ? 'ON' : 'OFF'}</span>
          </button>
        </div>
      </div>

      {/* Interactive Map Viewport (Interactive Vector Canvas Simulation) */}
      <div className="w-full h-full relative tech-grid flex items-center justify-center">
        {/* Spatial Grid Canvas Background */}
        <div className="absolute inset-0 bg-radial-gradient from-obsidian-900 to-obsidian-950 pointer-events-none opacity-80" />

        {/* Render Map Nodes */}
        <div className="relative w-[850px] h-[580px] rounded-3xl border border-white/10 glass-panel overflow-hidden shadow-2xl p-6">
          <div className="absolute top-3 left-4 text-[10px] font-mono text-platinum-subtle">
            San Francisco Municipal Transit Corridor • Sector 4
          </div>

          {/* Central Arterial Road Grid Lines */}
          <div className="absolute inset-0 pointer-events-none">
            <div className="absolute top-1/2 left-0 right-0 h-1 bg-white/10 -translate-y-1/2" />
            <div className="absolute left-1/2 top-0 bottom-0 w-1 bg-white/10 -translate-x-1/2" />
            <div className="absolute top-1/3 left-0 right-0 h-0.5 bg-white/5" />
            <div className="absolute top-2/3 left-0 right-0 h-0.5 bg-white/5" />
            <div className="absolute left-1/3 top-0 bottom-0 w-0.5 bg-white/5" />
            <div className="absolute left-2/3 top-0 bottom-0 w-0.5 bg-white/5" />
          </div>

          {/* Master Issue Markers (Gold) */}
          {activeLayers.masterIssues &&
            masterIssues.map((m, idx) => (
              <button
                key={m.id}
                type="button"
                onClick={() => setSelectedEntity({ type: 'MASTER_ISSUE', data: m })}
                style={{
                  top: `${40 + idx * 25}%`,
                  left: `${45 + idx * 18}%`,
                }}
                className="absolute z-10 -translate-x-1/2 -translate-y-1/2 group cursor-pointer"
              >
                <div className="w-9 h-9 rounded-full bg-gold-500/20 border-2 border-gold-400 flex items-center justify-center text-gold-300 font-mono font-bold text-xs shadow-lg gold-glow group-hover:scale-110 transition-transform">
                  {m.total_reports}
                </div>
                <div className="text-[10px] font-mono text-gold-300 mt-1 whitespace-nowrap bg-obsidian-950/80 px-1.5 py-0.5 rounded border border-gold-500/30">
                  #{m.issue_code}
                </div>
              </button>
            ))}

          {/* Work Order Markers (Emerald) */}
          {activeLayers.workOrders &&
            workOrders.map((wo, idx) => (
              <button
                key={wo.id}
                type="button"
                onClick={() => setSelectedEntity({ type: 'WORK_ORDER', data: wo })}
                style={{
                  top: `${35 + idx * 30}%`,
                  left: `${65 - idx * 20}%`,
                }}
                className="absolute z-10 -translate-x-1/2 -translate-y-1/2 group cursor-pointer"
              >
                <div className="w-8 h-8 rounded-full bg-emerald-500/20 border-2 border-emerald-400 flex items-center justify-center text-emerald-300 shadow-lg emerald-glow group-hover:scale-110 transition-transform">
                  <CheckCircle2 className="w-4 h-4" />
                </div>
                <div className="text-[10px] font-mono text-emerald-300 mt-1 whitespace-nowrap bg-obsidian-950/80 px-1.5 py-0.5 rounded border border-emerald-500/30">
                  {wo.work_order_number}
                </div>
              </button>
            ))}

          {/* Camera Markers (Sky Blue) */}
          {activeLayers.cameras &&
            cameras.map((c, idx) => (
              <button
                key={c.id}
                type="button"
                onClick={() => setSelectedEntity({ type: 'CAMERA', data: c })}
                style={{
                  top: `${20 + idx * 22}%`,
                  left: `${25 + idx * 25}%`,
                }}
                className="absolute z-10 -translate-x-1/2 -translate-y-1/2 group cursor-pointer"
              >
                <div className="w-7 h-7 rounded-lg bg-sky-500/20 border border-sky-400 flex items-center justify-center text-sky-300 shadow-lg group-hover:scale-110 transition-transform">
                  <Camera className="w-3.5 h-3.5" />
                </div>
              </button>
            ))}
        </div>
      </div>

      {/* Selected Entity Details Drawer (Floating Bottom-Right) */}
      {selectedEntity && (
        <div className="absolute bottom-6 right-6 z-20 glass-panel p-5 rounded-2xl border border-gold-500/30 w-80 space-y-3 shadow-2xl animate-in fade-in">
          <div className="flex items-center justify-between border-b border-white/10 pb-2">
            <span className="text-[10px] font-mono font-bold text-gold-400 uppercase">
              {selectedEntity.type}
            </span>
            <button
              type="button"
              onClick={() => setSelectedEntity(null)}
              className="text-xs text-platinum-subtle hover:text-white"
            >
              ✕
            </button>
          </div>

          <div>
            <h4 className="text-sm font-bold text-white">
              {selectedEntity.data.title || selectedEntity.data.name}
            </h4>
            <p className="text-xs text-platinum-muted mt-1 leading-relaxed">
              {selectedEntity.data.description || selectedEntity.data.address}
            </p>
          </div>

          <div className="flex items-center justify-between pt-2 border-t border-white/5 text-xs font-mono">
            <span className="text-emerald-400 font-bold">
              {selectedEntity.data.status || 'ONLINE'}
            </span>
            <Link
              href={
                selectedEntity.type === 'MASTER_ISSUE'
                  ? '/issues'
                  : selectedEntity.type === 'WORK_ORDER'
                  ? `/work-orders/${selectedEntity.data.id}`
                  : '/cameras'
              }
              className="px-2.5 py-1 rounded bg-gold-500 text-obsidian-950 font-bold flex items-center gap-1"
            >
              Open <ChevronRight className="w-3 h-3" />
            </Link>
          </div>
        </div>
      )}
    </div>
  );
}
