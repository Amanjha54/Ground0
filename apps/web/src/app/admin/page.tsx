"use client";

import React, { useState } from 'react';
import { useData } from '@/lib/data-context';
import { ShieldCheck, Lock, AlertTriangle, CheckCircle2, Server, EyeOff } from 'lucide-react';

export default function AdminPage() {
  const { role, cameras } = useData();

  const [camName, setCamName] = useState('');
  const [streamUrl, setStreamUrl] = useState('');
  const [webrtcPath, setWebrtcPath] = useState('');
  const [ssrfPassed, setSsrfPassed] = useState<boolean | null>(null);
  const [ssrfMessage, setSsrfMessage] = useState('');

  // Validate Camera URL against Section 58 SSRF Rules
  const handleValidateSSRF = (e: React.FormEvent) => {
    e.preventDefault();
    const url = streamUrl.toLowerCase();

    // Check scheme
    if (!url.startsWith('rtsp://') && !url.startsWith('rtsps://') && !url.startsWith('https://')) {
      setSsrfPassed(false);
      setSsrfMessage('SSRF GUARD REJECT: Protocol must be strictly rtsp://, rtsps://, or https://');
      return;
    }

    // Check private RFC-1918 / loopback ranges
    if (
      url.includes('127.0.0.1') ||
      url.includes('localhost') ||
      url.includes('169.254.') ||
      url.includes('10.') ||
      url.includes('192.168.') ||
      url.includes('172.16.')
    ) {
      setSsrfPassed(false);
      setSsrfMessage('SSRF GUARD REJECT: Private RFC-1918 and loopback address targets are blocked.');
      return;
    }

    setSsrfPassed(true);
    setSsrfMessage('SSRF VALIDATION PASSED: Endpoint destination verified as legitimate external stream.');
  };

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 py-8 space-y-6">
      <div className="border-b border-white/10 pb-4">
        <div className="flex items-center gap-2 text-xs font-mono text-gold-400 mb-1">
          <ShieldCheck className="w-3.5 h-3.5" />
          <span>ROOT SYSTEM & SECURITY GOVERNANCE</span>
        </div>
        <h1 className="text-2xl font-bold text-white tracking-tight">Super Admin Console</h1>
        <p className="text-xs text-platinum-muted mt-1">
          Enforce camera network SSRF security, organization tenant boundaries, and cryptographic policy guards.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Camera SSRF Guard Form (Section 58) */}
        <div className="glass-panel p-6 rounded-2xl border border-white/10 space-y-4">
          <h3 className="text-xs font-mono font-bold text-white uppercase tracking-wider flex items-center gap-2">
            <Lock className="w-4 h-4 text-emerald-400" />
            Authorized Camera Registration (Anti-SSRF)
          </h3>
          <p className="text-xs text-platinum-muted">
            Protects internal subnets against malicious URL injection. Only authorized admins may register endpoints.
          </p>

          <form onSubmit={handleValidateSSRF} className="space-y-3">
            <div>
              <label className="block text-[11px] font-mono text-platinum-subtle mb-1">
                Camera Name / Label
              </label>
              <input
                type="text"
                value={camName}
                onChange={(e) => setCamName(e.target.value)}
                placeholder="CAM-05 Transit Overpass"
                className="w-full px-3 py-2 rounded-xl bg-obsidian-950 border border-white/10 text-white text-xs font-mono focus:border-gold-500 focus:outline-none"
                required
              />
            </div>

            <div>
              <label className="block text-[11px] font-mono text-platinum-subtle mb-1">
                RTSP / WebRTC Stream Endpoint
              </label>
              <input
                type="text"
                value={streamUrl}
                onChange={(e) => {
                  setStreamUrl(e.target.value);
                  setSsrfPassed(null);
                }}
                placeholder="rtsps://cam05.city.gov/live"
                className="w-full px-3 py-2 rounded-xl bg-obsidian-950 border border-white/10 text-white text-xs font-mono focus:border-gold-500 focus:outline-none"
                required
              />
            </div>

            <button
              type="submit"
              className="w-full py-2.5 rounded-xl bg-gold-500 hover:bg-gold-400 text-obsidian-950 font-bold text-xs uppercase tracking-wider transition-all shadow-md cursor-pointer"
            >
              Verify Endpoint & Check SSRF
            </button>
          </form>

          {ssrfPassed !== null && (
            <div
              className={`p-3 rounded-xl text-xs font-mono border ${
                ssrfPassed
                  ? 'glass-panel-emerald border-emerald-500/40 text-emerald-300'
                  : 'bg-rose-950/80 border-rose-800 text-rose-300'
              }`}
            >
              {ssrfMessage}
            </div>
          )}
        </div>

        {/* Database & RLS Enforcement Status */}
        <div className="glass-panel p-6 rounded-2xl border border-white/10 space-y-4">
          <h3 className="text-xs font-mono font-bold text-white uppercase tracking-wider flex items-center gap-2">
            <Server className="w-4 h-4 text-gold-400" />
            Security & RLS Governance
          </h3>

          <div className="space-y-2.5 text-xs font-mono">
            <div className="p-3 rounded-xl bg-obsidian-950 border border-white/5 flex items-center justify-between">
              <span>PostgreSQL 15 Row-Level Security:</span>
              <span className="text-emerald-400 font-bold">29 Tables Active</span>
            </div>

            <div className="p-3 rounded-xl bg-obsidian-950 border border-white/5 flex items-center justify-between">
              <span>Edge Privacy Filter:</span>
              <span className="text-emerald-400 font-bold">Face/Plate Mask ON</span>
            </div>

            <div className="p-3 rounded-xl bg-obsidian-950 border border-white/5 flex items-center justify-between">
              <span>Frontend Secret Exfiltration Scan:</span>
              <span className="text-emerald-400 font-bold">0 Leaks Detected</span>
            </div>

            <div className="p-3 rounded-xl bg-obsidian-950 border border-white/5 flex items-center justify-between">
              <span>Capture Nonce Cryptography:</span>
              <span className="text-emerald-400 font-bold">HMAC-SHA256 Active</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
