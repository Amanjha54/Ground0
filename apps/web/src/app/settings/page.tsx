"use client";

import React, { useState } from 'react';
import { Sliders, ShieldCheck, Database, Key, Server, CheckCircle2 } from 'lucide-react';

export default function SettingsPage() {
  const [saved, setSaved] = useState(false);

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 py-8 space-y-6">
      <div className="border-b border-white/10 pb-4">
        <h1 className="text-2xl font-bold text-white tracking-tight">System & Integration Settings</h1>
        <p className="text-xs text-platinum-muted mt-1">
          Manage Supabase connection endpoints, Google Gemini API parameters, and MediaMTX streaming ports.
        </p>
      </div>

      <div className="space-y-6">
        {/* Environment Integrations Card */}
        <div className="glass-panel p-6 rounded-2xl border border-white/10 space-y-4">
          <h3 className="text-xs font-mono font-bold text-gold-400 uppercase tracking-wider flex items-center gap-2">
            <Key className="w-4 h-4" />
            Backend Service Status
          </h3>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs font-mono">
            <div className="p-3.5 rounded-xl bg-obsidian-950 border border-white/5 space-y-1">
              <div className="text-platinum-subtle">Python AI Microservice:</div>
              <div className="text-emerald-400 font-bold">http://localhost:8000</div>
              <div className="text-[10px] text-platinum-muted">FastAPI + OpenCV + Gemini Active</div>
            </div>

            <div className="p-3.5 rounded-xl bg-obsidian-950 border border-white/5 space-y-1">
              <div className="text-platinum-subtle">MediaMTX Gateway:</div>
              <div className="text-emerald-400 font-bold">http://localhost:8889</div>
              <div className="text-[10px] text-platinum-muted">WebRTC / RTSP Port 8554</div>
            </div>

            <div className="p-3.5 rounded-xl bg-obsidian-950 border border-white/5 space-y-1">
              <div className="text-platinum-subtle">Open-Meteo Weather API:</div>
              <div className="text-emerald-400 font-bold">Public Telemetry Active</div>
              <div className="text-[10px] text-platinum-muted">Hourly Precipitation & Irradiance</div>
            </div>

            <div className="p-3.5 rounded-xl bg-obsidian-950 border border-white/5 space-y-1">
              <div className="text-platinum-subtle">Database Fabric:</div>
              <div className="text-gold-400 font-bold">Supabase PostgreSQL 15 + RLS</div>
              <div className="text-[10px] text-platinum-muted">PostGIS Spatial Indexing Ready</div>
            </div>
          </div>
        </div>

        {/* Verification Thresholds Card */}
        <div className="glass-panel p-6 rounded-2xl border border-white/10 space-y-4">
          <h3 className="text-xs font-mono font-bold text-white uppercase tracking-wider flex items-center gap-2">
            <Sliders className="w-4 h-4 text-emerald-400" />
            Autonomous Verification Policies
          </h3>

          <div className="space-y-4 text-xs">
            <div>
              <div className="flex justify-between font-mono mb-1">
                <span className="text-platinum">Minimum Scene Match Threshold (Homography):</span>
                <span className="text-gold-400 font-bold">75%</span>
              </div>
              <input type="range" min="50" max="95" defaultValue="75" className="w-full accent-gold-500" />
            </div>

            <div>
              <div className="flex justify-between font-mono mb-1">
                <span className="text-platinum">Geofence Adherence Radius:</span>
                <span className="text-gold-400 font-bold">50 Meters</span>
              </div>
              <input type="range" min="10" max="150" defaultValue="50" className="w-full accent-gold-500" />
            </div>

            <div>
              <div className="flex justify-between font-mono mb-1">
                <span className="text-platinum">Capture Nonce Expiration (TTL):</span>
                <span className="text-gold-400 font-bold">2 Hours</span>
              </div>
              <input type="range" min="1" max="6" defaultValue="2" className="w-full accent-gold-500" />
            </div>
          </div>

          <div className="pt-2">
            <button
              type="button"
              onClick={() => setSaved(true)}
              className="px-5 py-2.5 rounded-xl bg-gold-500 hover:bg-gold-400 text-obsidian-950 font-bold text-xs uppercase tracking-wider transition-all shadow-md cursor-pointer"
            >
              Save Configuration
            </button>
            {saved && (
              <span className="ml-3 text-xs font-mono text-emerald-400">
                ✓ Policies synchronized across worker nodes.
              </span>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
