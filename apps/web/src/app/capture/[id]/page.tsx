"use client";

import React, { useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { useData } from '@/lib/data-context';
import {
  Camera,
  MapPin,
  Lock,
  CheckCircle2,
  AlertTriangle,
  Upload,
  ArrowRight,
  ShieldAlert,
  Loader2,
  RefreshCw,
  Sparkles
} from 'lucide-react';

export default function WorkerCapturePage() {
  const params = useParams();
  const workOrderId = params?.id as string;
  const router = useRouter();
  const { workOrders, submitEvidenceAndVerify } = useData();

  const workOrder = workOrders.find(
    (w) => w.id === workOrderId || w.work_order_number === workOrderId
  ) || workOrders[0];

  // Cryptographic capture session challenge
  const [nonce] = useState('7f89d3a1e9c402b8d5a1b3c9e7f89d3a1e9c402b8d5a1b3c9e7f89d3a1e9c402');
  const [stage, setStage] = useState<'BEFORE' | 'AFTER'>('AFTER');
  const [capturedLat, setCapturedLat] = useState(37.775115);
  const [capturedLon, setCapturedLon] = useState(-122.419205);

  // Pre-configured evidence images for real testing & cheat scenarios
  const normalBefore = 'https://images.unsplash.com/photo-1515162816999-a0c47dc192f7?auto=format&fit=crop&w=800&q=80';
  const genuineAfter = 'https://images.unsplash.com/photo-1544620347-c4fd4a3d5957?auto=format&fit=crop&w=800&q=80';
  const mismatchScene = 'https://images.unsplash.com/photo-1506744038136-46273834b3fb?auto=format&fit=crop&w=800&q=80';

  const [selectedBeforeImage, setSelectedBeforeImage] = useState(normalBefore);
  const [selectedAfterImage, setSelectedAfterImage] = useState(genuineAfter);
  const [isVerifying, setIsVerifying] = useState(false);

  // Trigger verification submission
  const handleVerify = async () => {
    setIsVerifying(true);
    try {
      const run = await submitEvidenceAndVerify(
        workOrder.id,
        selectedBeforeImage,
        selectedAfterImage,
        capturedLat,
        capturedLon
      );
      setTimeout(() => {
        router.push(`/verification/${run.id}`);
      }, 1000);
    } catch (err) {
      console.error(err);
      setIsVerifying(false);
    }
  };

  return (
    <div className="max-w-md mx-auto px-4 py-8 sm:px-0 space-y-6">
      {/* Mobile PWA Card Top Bar */}
      <div className="glass-panel p-4 rounded-2xl border border-white/10 flex items-center justify-between">
        <div>
          <div className="text-[10px] font-mono text-gold-400 font-bold uppercase">
            Field Worker PWA • Job #{workOrder.work_order_number}
          </div>
          <h1 className="text-base font-bold text-white tracking-tight">
            {workOrder.title}
          </h1>
        </div>
        <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-emerald-950 text-emerald-300 border border-emerald-800 font-bold">
          {workOrder.priority}
        </span>
      </div>

      {/* Cryptographic Session Badge */}
      <div className="p-3 rounded-xl bg-obsidian-950 border border-white/10 text-[11px] font-mono space-y-1">
        <div className="flex items-center justify-between text-platinum-subtle">
          <span className="flex items-center gap-1.5 text-gold-400">
            <Lock className="w-3.5 h-3.5" />
            Server Nonce Challenge Active
          </span>
          <span className="text-emerald-400">TTL 1h 58m</span>
        </div>
        <div className="text-platinum-muted truncate text-[10px]">
          Nonce: {nonce}
        </div>
        <div className="flex items-center justify-between text-platinum-subtle pt-1 border-t border-white/5">
          <span>GPS Geofence:</span>
          <span className="text-emerald-400 font-bold">Verified on Site (3.8m delta)</span>
        </div>
      </div>

      {/* Step Tabs: BEFORE vs AFTER */}
      <div className="grid grid-cols-2 gap-2 glass-panel p-1 rounded-xl">
        <button
          type="button"
          onClick={() => setStage('BEFORE')}
          className={`py-2 text-xs font-mono font-bold rounded-lg transition-colors ${
            stage === 'BEFORE' ? 'bg-gold-500 text-obsidian-950 shadow-md' : 'text-platinum hover:text-white'
          }`}
        >
          1. BEFORE Work
        </button>
        <button
          type="button"
          onClick={() => setStage('AFTER')}
          className={`py-2 text-xs font-mono font-bold rounded-lg transition-colors ${
            stage === 'AFTER' ? 'bg-gold-500 text-obsidian-950 shadow-md' : 'text-platinum hover:text-white'
          }`}
        >
          2. AFTER Completion
        </button>
      </div>

      {/* Simulated Live Viewfinder */}
      <div className="relative rounded-2xl overflow-hidden border border-white/15 h-80 bg-obsidian-950 flex flex-col justify-between p-4 shadow-2xl">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={stage === 'BEFORE' ? selectedBeforeImage : selectedAfterImage}
          alt="Viewfinder Frame"
          className="absolute inset-0 w-full h-full object-cover pointer-events-none"
        />

        {/* Viewfinder Target Reticle */}
        <div className="absolute inset-0 pointer-events-none flex items-center justify-center">
          <div className="w-48 h-48 border border-gold-400/40 rounded-xl relative">
            <span className="absolute -top-1 -left-1 w-3 h-3 border-t-2 border-l-2 border-gold-400" />
            <span className="absolute -top-1 -right-1 w-3 h-3 border-t-2 border-r-2 border-gold-400" />
            <span className="absolute -bottom-1 -left-1 w-3 h-3 border-b-2 border-l-2 border-gold-400" />
            <span className="absolute -bottom-1 -right-1 w-3 h-3 border-b-2 border-r-2 border-gold-400" />
            <div className="absolute inset-0 flex items-center justify-center">
              <span className="w-1.5 h-1.5 rounded-full bg-gold-400" />
            </div>
          </div>
        </div>

        {/* Top HUD */}
        <div className="relative z-10 flex justify-between items-center text-[10px] font-mono glass-panel px-2.5 py-1 rounded-md text-platinum">
          <span>{stage} FRAME</span>
          <span className="text-emerald-400">CRYPTOGRAPHIC ANCHOR READY</span>
        </div>

        {/* Bottom HUD */}
        <div className="relative z-10 flex justify-between items-center text-[10px] font-mono glass-panel px-2.5 py-1 rounded-md text-platinum">
          <span>{capturedLat.toFixed(5)}, {capturedLon.toFixed(5)}</span>
          <span className="text-gold-400">HEADING: 210°</span>
        </div>
      </div>

      {/* Hackathon Demo Testing Controls (Section 65 Live Fraud Simulation) */}
      <div className="glass-panel p-4 rounded-xl border border-white/10 space-y-3">
        <div className="text-[11px] font-mono font-bold text-gold-400 uppercase flex items-center justify-between">
          <span>Hackathon Demo Scenario Presets</span>
          <span className="text-[10px] text-platinum-subtle">Test Fraud vs Truth</span>
        </div>

        <div className="grid grid-cols-3 gap-2 text-[10px] font-mono">
          <button
            type="button"
            onClick={() => {
              setSelectedBeforeImage(normalBefore);
              setSelectedAfterImage(genuineAfter);
            }}
            className="p-2 rounded-lg bg-emerald-950/80 text-emerald-300 border border-emerald-800 hover:bg-emerald-900 transition-colors text-center font-bold"
          >
            ✓ Genuine Work (Pass AI)
          </button>
          <button
            type="button"
            onClick={() => {
              setSelectedBeforeImage(normalBefore);
              setSelectedAfterImage(normalBefore); // SAME PHOTO (Replay Attack)
            }}
            className="p-2 rounded-lg bg-rose-950/80 text-rose-300 border border-rose-800 hover:bg-rose-900 transition-colors text-center font-bold"
          >
            ✕ Replay Duplicate
          </button>
          <button
            type="button"
            onClick={() => {
              setSelectedBeforeImage(normalBefore);
              setSelectedAfterImage(mismatchScene); // WRONG SCENE
            }}
            className="p-2 rounded-lg bg-amber-950/80 text-amber-300 border border-amber-800 hover:bg-amber-900 transition-colors text-center font-bold"
          >
            ✕ Scene Mismatch
          </button>
        </div>
      </div>

      {/* Submit Verification Button */}
      <button
        type="button"
        disabled={isVerifying}
        onClick={handleVerify}
        className="w-full py-4 rounded-xl bg-gradient-to-r from-gold-500 via-gold-400 to-gold-600 text-obsidian-950 font-bold text-sm uppercase tracking-wider flex items-center justify-center gap-2 shadow-xl gold-glow disabled:opacity-50 cursor-pointer"
      >
        {isVerifying ? (
          <>
            <Loader2 className="w-4 h-4 animate-spin" />
            Executing 8-Stage AI Verification...
          </>
        ) : (
          <>
            <Sparkles className="w-4 h-4" />
            TRANSMIT & VERIFY EVIDENCE
            <ArrowRight className="w-4 h-4" />
          </>
        )}
      </button>
    </div>
  );
}
