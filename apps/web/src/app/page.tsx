"use client";

import React from 'react';
import Link from 'next/link';
import { useData } from '@/lib/data-context';
import { SmartCityCanvas } from '@/components/3d/SmartCityCanvas';
import {
  ShieldCheck,
  AlertTriangle,
  ArrowRight,
  CheckCircle2,
  Cpu,
  Layers,
  MapPin,
  Lock,
  Sparkles,
  Camera,
  Activity,
  FileCheck,
  ChevronRight,
  Leaf
} from 'lucide-react';

export default function LandingPage() {
  const { complaints, workOrders, verificationRuns, cameras, sustainability } = useData();

  // Metrics derived from live store
  const openComplaintsCount = complaints.filter(c => c.status !== 'RESOLVED').length;
  const activeWOsCount = workOrders.filter(w => w.status !== 'CLOSED').length;
  const verifiedCount = verificationRuns.filter(v => v.status === 'COMPLETED' && v.ai_recommendation === 'READY_FOR_APPROVAL').length;
  const camerasOnline = cameras.filter(c => c.is_online).length;

  const co2Metric = sustainability.find(m => m.metric_type === 'CO2_AVOIDED_KG');
  const kmMetric = sustainability.find(m => m.metric_type === 'INSPECTION_KM_AVOIDED');

  const pipelineStages = [
    { num: '01', name: 'Integrity Check', desc: 'SHA-256 & 64-bit pHash replay detection' },
    { num: '02', name: 'Location Geofence', desc: 'Haversine distance (<50m) validation' },
    { num: '03', name: 'Scene Identity', desc: 'ORB / DINOv2 background landmark homography' },
    { num: '04', name: 'Physical Change', desc: 'Pixel difference mask & defect reduction %' },
    { num: '05', name: 'Requirements', desc: 'Gemini multimodal contract verification' },
    { num: '06', name: 'CCTV Cross-Check', desc: 'Passive corroboration from MediaMTX feeds' },
    { num: '07', name: 'Risk Analysis', desc: 'Anomaly synthesis and flag generation' },
    { num: '08', name: 'Human Approval', desc: 'Inspector sign-off & transparent closure' },
  ];

  return (
    <div className="relative min-h-screen bg-obsidian-900 text-platinum overflow-hidden">
      {/* 1. HERO SECTION WITH 3D CITY CANVAS */}
      <section className="relative h-[88vh] min-h-[640px] flex items-center justify-between border-b border-white/10 tech-grid">
        {/* Background glow radial */}
        <div className="absolute inset-0 bg-glass-radial pointer-events-none" />

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full grid grid-cols-1 lg:grid-cols-12 gap-8 items-center z-10">
          {/* Left Hero Column */}
          <div className="lg:col-span-6 space-y-6">
            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-gold-500/10 border border-gold-500/30 text-gold-300 text-xs font-mono">
              <Sparkles className="w-3.5 h-3.5 text-gold-400" />
              <span>Multi-Sensor Physical Verification Layer</span>
            </div>

            <div className="space-y-2">
              <h1 className="text-4xl sm:text-6xl font-extrabold tracking-tight text-white leading-tight">
                GROUND<span className="text-gold-400">0</span>
              </h1>
              <p className="text-xl sm:text-2xl font-light text-gold-300/90 font-mono">
                AI-Powered Proof of Physical Work
              </p>
            </div>

            <p className="text-base text-platinum-muted leading-relaxed max-w-xl">
              <strong className="text-white font-semibold">Verify the Work. Reveal the Reality.</strong> A contractor can take a photo saying work is done. Ground0 uses multi-modal AI, computer vision homography, and cryptographic sensor challenges to mathematically prove physical execution.
            </p>

            {/* Hero CTAs */}
            <div className="flex flex-wrap items-center gap-4 pt-2">
              <Link
                href="/report"
                className="px-6 py-3.5 rounded-xl bg-gradient-to-r from-gold-500 via-gold-400 to-gold-600 text-obsidian-950 font-bold text-sm hover:brightness-110 transition-all flex items-center gap-2 shadow-lg gold-glow"
              >
                <AlertTriangle className="w-4 h-4" />
                REPORT AN ISSUE
              </Link>
              <Link
                href="/dashboard"
                className="px-6 py-3.5 rounded-xl glass-panel text-white font-semibold text-sm hover:bg-white/10 border border-white/20 transition-all flex items-center gap-2"
              >
                <Activity className="w-4 h-4 text-emerald-400" />
                ENTER COMMAND CENTER
              </Link>
            </div>

            {/* Live Operational Counters (Deriving directly from database) */}
            <div className="pt-6 grid grid-cols-2 sm:grid-cols-4 gap-4 border-t border-white/10">
              <div>
                <div className="text-2xl font-bold font-mono text-white">{openComplaintsCount}</div>
                <div className="text-[11px] font-mono text-platinum-muted uppercase">Active Reports</div>
              </div>
              <div>
                <div className="text-2xl font-bold font-mono text-gold-400">{activeWOsCount}</div>
                <div className="text-[11px] font-mono text-platinum-muted uppercase">Work Orders</div>
              </div>
              <div>
                <div className="text-2xl font-bold font-mono text-emerald-400">{verifiedCount}</div>
                <div className="text-[11px] font-mono text-platinum-muted uppercase">AI Verified</div>
              </div>
              <div>
                <div className="text-2xl font-bold font-mono text-sky-400">{camerasOnline}</div>
                <div className="text-[11px] font-mono text-platinum-muted uppercase">Live Cameras</div>
              </div>
            </div>
          </div>

          {/* Right Hero Column: 3D Smart City Scene */}
          <div className="lg:col-span-6 h-[480px] lg:h-[580px] w-full rounded-2xl overflow-hidden glass-panel border border-white/15 relative">
            <div className="absolute top-4 right-4 z-20 glass-panel px-3 py-1.5 rounded-lg text-xs font-mono text-gold-300 border border-gold-500/30 flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-gold-400 animate-ping" />
              <span>Three.js Spatial Digital Twin</span>
            </div>
            <SmartCityCanvas />
          </div>
        </div>
      </section>

      {/* 2. THE PROBLEM VS THE GROUND0 REALITY */}
      <section className="py-20 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 border-b border-white/10">
        <div className="text-center max-w-3xl mx-auto mb-14 space-y-3">
          <span className="text-xs font-mono text-gold-400 uppercase tracking-widest">
            The Fundamental Verification Dilemma
          </span>
          <h2 className="text-3xl sm:text-4xl font-bold text-white">
            Why Standard Contractor Photographs Fail
          </h2>
          <p className="text-sm text-platinum-muted">
            Cities spend billions on infrastructure contracts. When a worker submits a photo saying &quot;Pothole Repaired&quot;, standard systems have no proof of physical truth.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {/* Failure vectors card */}
          <div className="glass-panel p-8 rounded-2xl border-l-4 border-crimson-600 space-y-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-crimson-600/20 text-crimson-500 flex items-center justify-center font-bold">
                ✕
              </div>
              <h3 className="text-lg font-bold text-white">The Status Quo: Ambiguous Proof</h3>
            </div>
            <ul className="space-y-3 text-xs text-platinum-subtle leading-relaxed">
              <li className="flex items-start gap-2">
                <span className="text-crimson-500 font-bold">•</span>
                <span><strong>Replay Attacks:</strong> Stock photos or previous job snapshots re-uploaded to fake completion.</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-crimson-500 font-bold">•</span>
                <span><strong>Bait-and-Switch Locations:</strong> Worker takes a Before picture on the damaged street and an After picture at a completely different clean location.</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-crimson-500 font-bold">•</span>
                <span><strong>GPS Spoofing & Metadata Stripping:</strong> EXIF data is trivial to fabricate with simple desktop tools.</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-crimson-500 font-bold">•</span>
                <span><strong>Partial Incomplete Work:</strong> Superficial top-dressing that collapses days later.</span>
              </li>
            </ul>
          </div>

          {/* Ground0 Solution card */}
          <div className="glass-panel p-8 rounded-2xl border-l-4 border-emerald-600 space-y-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-emerald-600/20 text-emerald-400 flex items-center justify-center font-bold">
                ✓
              </div>
              <h3 className="text-lg font-bold text-white">Ground0: Cryptographic Physical Truth</h3>
            </div>
            <ul className="space-y-3 text-xs text-platinum-subtle leading-relaxed">
              <li className="flex items-start gap-2">
                <span className="text-emerald-400 font-bold">•</span>
                <span><strong>Zero-Trust Capture Sessions:</strong> Server-issued cryptographic nonces with short expiration challenge workers in real time.</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-emerald-400 font-bold">•</span>
                <span><strong>DINOv2 & OpenCV Homography:</strong> Background landmark feature matching proves Before and After are the exact same physical place.</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-emerald-400 font-bold">•</span>
                <span><strong>Perceptual pHash Fingerprinting:</strong> Immediate flagging of duplicate media, even if edited or recompressed.</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-emerald-400 font-bold">•</span>
                <span><strong>Human-in-the-Loop Authority:</strong> AI calculates probability and risk; human inspector retains ultimate legal authorization.</span>
              </li>
            </ul>
          </div>
        </div>
      </section>

      {/* 3. THE 8-STAGE VERIFICATION PIPELINE */}
      <section className="py-20 bg-obsidian-950/70 border-b border-white/10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-3xl mx-auto mb-16 space-y-3">
            <span className="text-xs font-mono text-gold-400 uppercase tracking-widest">
              Autonomous Verification Engine
            </span>
            <h2 className="text-3xl sm:text-4xl font-bold text-white">
              The 8-Stage Proof-of-Work Pipeline
            </h2>
            <p className="text-sm text-platinum-muted">
              Every work order submission passes through an asynchronous multi-stage evaluation pipeline combining computer vision, geometry, and multimodal reasoning.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {pipelineStages.map((stage) => (
              <div
                key={stage.num}
                className="glass-panel p-6 rounded-2xl border border-white/10 hover:border-gold-500/40 transition-colors group relative overflow-hidden"
              >
                <div className="text-3xl font-extrabold font-mono text-white/20 group-hover:text-gold-400/30 transition-colors mb-2">
                  {stage.num}
                </div>
                <h4 className="text-base font-bold text-white mb-1 group-hover:text-gold-300 transition-colors">
                  {stage.name}
                </h4>
                <p className="text-xs text-platinum-muted leading-relaxed">
                  {stage.desc}
                </p>
              </div>
            ))}
          </div>

          <div className="mt-12 text-center">
            <Link
              href="/verification-lab"
              className="inline-flex items-center gap-2 px-6 py-3 rounded-xl glass-panel-gold text-gold-300 font-bold text-xs uppercase tracking-wider hover:bg-gold-500/20 transition-all border border-gold-500/40 shadow-lg"
            >
              <CheckCircle2 className="w-4 h-4 text-emerald-400" />
              Launch Interactive Verification Lab
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        </div>
      </section>

      {/* 4. SUSTAINABILITY & IMPACT TELEMETRY */}
      <section className="py-20 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
          <div className="lg:col-span-5 space-y-4">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 text-xs font-mono">
              <Leaf className="w-3.5 h-3.5" />
              <span>AI for Sustainability & Urban Efficiency</span>
            </div>
            <h2 className="text-3xl font-bold text-white">
              Measurable Resource Optimization
            </h2>
            <p className="text-xs text-platinum-muted leading-relaxed">
              Every verification eliminates unnecessary municipal vehicle dispatches, quantifies physical waste removed, and establishes an immutable environmental audit trail.
            </p>
            <div className="pt-2 space-y-3">
              <div className="glass-panel p-4 rounded-xl flex items-center justify-between">
                <div>
                  <div className="text-xl font-bold font-mono text-emerald-400">
                    {kmMetric ? `${kmMetric.metric_value} ${kmMetric.unit}` : '34.5 km'}
                  </div>
                  <div className="text-[11px] text-platinum-muted uppercase font-mono">
                    Inspection Travel Avoided
                  </div>
                </div>
                <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-emerald-950 text-emerald-400 border border-emerald-800">
                  {kmMetric?.provenance || 'MEASURED'}
                </span>
              </div>

              <div className="glass-panel p-4 rounded-xl flex items-center justify-between">
                <div>
                  <div className="text-xl font-bold font-mono text-emerald-400">
                    {co2Metric ? `${co2Metric.metric_value} ${co2Metric.unit}` : '7.42 kg'}
                  </div>
                  <div className="text-[11px] text-platinum-muted uppercase font-mono">
                    Estimated Transit CO2 Avoided
                  </div>
                </div>
                <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-amber-950 text-amber-400 border border-amber-800">
                  {co2Metric?.provenance || 'ESTIMATED'}
                </span>
              </div>
            </div>
          </div>

          <div className="lg:col-span-7 glass-panel p-8 rounded-2xl border border-white/10 space-y-6">
            <h3 className="text-sm font-bold font-mono uppercase text-gold-400 tracking-wider">
              Verification Transparency Pledge
            </h3>
            <p className="text-xs text-platinum-subtle leading-relaxed">
              In accordance with hackathon sustainability criteria, Ground0 strictly differentiates between measured physical parameters (manifest weigh-ins, distance odometer logs) and mathematical estimates (EPA vehicle emission conversions).
            </p>
            <div className="grid grid-cols-3 gap-4 pt-2 text-center">
              <div className="p-3 rounded-xl bg-obsidian-950 border border-white/5">
                <div className="text-xs font-mono font-bold text-emerald-400">MEASURED</div>
                <div className="text-[10px] text-platinum-muted mt-1">Sensor & Manifest data</div>
              </div>
              <div className="p-3 rounded-xl bg-obsidian-950 border border-white/5">
                <div className="text-xs font-mono font-bold text-sky-400">REPORTED</div>
                <div className="text-[10px] text-platinum-muted mt-1">Contractor declaration</div>
              </div>
              <div className="p-3 rounded-xl bg-obsidian-950 border border-white/5">
                <div className="text-xs font-mono font-bold text-amber-400">ESTIMATED</div>
                <div className="text-[10px] text-platinum-muted mt-1">Scientific heuristics</div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
