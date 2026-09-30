import React from 'react';
import Link from 'next/link';
import { ShieldCheck, Lock, EyeOff, Cpu, Leaf, GitBranch } from 'lucide-react';

export function Footer() {
  return (
    <footer className="border-t border-white/10 bg-obsidian-950 text-platinum-muted py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-4 gap-8 mb-8">
        {/* Col 1: Brand & Mission */}
        <div className="space-y-3">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-gold-500/10 border border-gold-500/30 flex items-center justify-center">
              <ShieldCheck className="w-4 h-4 text-gold-400" />
            </div>
            <span className="font-bold text-lg text-white tracking-wide">
              GROUND<span className="text-gold-400">0</span>
            </span>
          </div>
          <p className="text-xs text-platinum-subtle leading-relaxed">
            AI-Powered Proof of Physical Work. Verifying municipal and civil engineering remediation through multi-sensor cryptography, computer vision, and multimodal reasoning.
          </p>
          <div className="text-[11px] font-mono text-gold-400/80">
            Verify the Work. Reveal the Reality.
          </div>
        </div>

        {/* Col 2: Core Subsystems */}
        <div>
          <h4 className="text-xs font-semibold text-white uppercase tracking-wider mb-3">
            Core Subsystems
          </h4>
          <ul className="space-y-2 text-xs">
            <li>
              <Link href="/report" className="hover:text-gold-400 transition-colors">
                Multimodal Intake Engine
              </Link>
            </li>
            <li>
              <Link href="/verification-lab" className="hover:text-gold-400 transition-colors">
                8-Stage Verification Pipeline
              </Link>
            </li>
            <li>
              <Link href="/cameras" className="hover:text-gold-400 transition-colors">
                MediaMTX Camera Gateway
              </Link>
            </li>
            <li>
              <Link href="/map" className="hover:text-gold-400 transition-colors">
                MapLibre Spatial Operations
              </Link>
            </li>
            <li>
              <Link href="/analytics" className="hover:text-gold-400 transition-colors">
                Sustainability Telemetry
              </Link>
            </li>
          </ul>
        </div>

        {/* Col 3: Cryptography & Security */}
        <div>
          <h4 className="text-xs font-semibold text-white uppercase tracking-wider mb-3">
            Security & Trust
          </h4>
          <ul className="space-y-2 text-xs text-platinum-subtle">
            <li className="flex items-center gap-2">
              <Lock className="w-3.5 h-3.5 text-emerald-400" />
              <span>SHA-256 & Perceptual pHash</span>
            </li>
            <li className="flex items-center gap-2">
              <Cpu className="w-3.5 h-3.5 text-gold-400" />
              <span>DINOv2 & OpenCV Homography</span>
            </li>
            <li className="flex items-center gap-2">
              <EyeOff className="w-3.5 h-3.5 text-sky-400" />
              <span>Automated Edge Privacy Blur</span>
            </li>
            <li className="flex items-center gap-2">
              <Leaf className="w-3.5 h-3.5 text-emerald-400" />
              <span>Measurable CO2 Avoidance</span>
            </li>
          </ul>
        </div>

        {/* Col 4: Hackathon Criteria & Architecture */}
        <div>
          <h4 className="text-xs font-semibold text-white uppercase tracking-wider mb-3">
            Competition Compliance
          </h4>
          <p className="text-xs text-platinum-subtle leading-relaxed mb-2">
            Engineered to fulfill requirements for Computer Vision, Multimodal AI, Agentic Systems, and AI for Sustainability.
          </p>
          <div className="flex items-center gap-2 text-xs font-mono text-emerald-400">
            <GitBranch className="w-3.5 h-3.5" />
            <span>PostgreSQL 15 + PostGIS RLS</span>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto pt-6 border-t border-white/5 flex flex-col sm:flex-row justify-between items-center text-xs text-platinum-subtle gap-4">
        <p>© 2026 GROUND0 Systems. All physical proof cryptographically anchored.</p>
        <p className="text-[11px] font-mono">
          Privacy Policy: Zero citizen biometric profiling. Infrastructure monitoring only.
        </p>
      </div>
    </footer>
  );
}
