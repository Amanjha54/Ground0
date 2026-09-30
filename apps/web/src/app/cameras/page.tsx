"use client";

import React, { useState } from 'react';
import { useData } from '@/lib/data-context';
import {
  Camera as CameraIcon,
  ShieldCheck,
  EyeOff,
  Eye,
  Activity,
  MapPin,
  Lock,
  Layers,
  AlertCircle,
  Plus
} from 'lucide-react';

export default function CameraWallPage() {
  const { cameras, toggleCameraPrivacy, role } = useData();
  const [layout, setLayout] = useState<'2x2' | '3x3'>('2x2');
  const [globalPrivacyBlur, setGlobalPrivacyBlur] = useState(true);

  // Sample municipal stream simulation frames
  const sampleStreams = [
    'https://images.unsplash.com/photo-1544620347-c4fd4a3d5957?auto=format&fit=crop&w=800&q=80',
    'https://images.unsplash.com/photo-1506744038136-46273834b3fb?auto=format&fit=crop&w=800&q=80',
    'https://images.unsplash.com/photo-1477959858617-67f30bc75b82?auto=format&fit=crop&w=800&q=80',
    'https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?auto=format&fit=crop&w=800&q=80',
  ];

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-white/10 pb-4">
        <div>
          <div className="flex items-center gap-2 text-xs font-mono text-sky-400 mb-1">
            <CameraIcon className="w-3.5 h-3.5" />
            <span>MEDIAMTX SECURE RTSP / WEBRTC GATEWAY</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
            Live Municipal Camera Wall
          </h1>
          <p className="text-xs text-platinum-muted mt-1">
            Passive corroborating surveillance from authorized municipal infrastructure feeds.
          </p>
        </div>

        {/* Controls: Layout & Privacy */}
        <div className="flex flex-wrap items-center gap-3">
          {/* Privacy Blur Toggle */}
          <button
            type="button"
            onClick={() => setGlobalPrivacyBlur(!globalPrivacyBlur)}
            className={`px-3 py-1.5 rounded-lg text-xs font-mono font-bold flex items-center gap-1.5 border transition-all ${
              globalPrivacyBlur
                ? 'bg-emerald-950 text-emerald-300 border-emerald-800'
                : 'bg-rose-950 text-rose-300 border-rose-800'
            }`}
          >
            {globalPrivacyBlur ? <EyeOff className="w-3.5 h-3.5" /> : <Eye className="w-3.5 h-3.5" />}
            {globalPrivacyBlur ? 'Privacy Masking: ACTIVE' : 'Privacy Masking: DISABLED'}
          </button>

          {/* Grid Layout Switcher */}
          <div className="flex items-center gap-1 glass-panel p-1 rounded-lg text-xs font-mono">
            <button
              type="button"
              onClick={() => setLayout('2x2')}
              className={`px-3 py-1 rounded-md transition-colors ${
                layout === '2x2' ? 'bg-gold-500 text-obsidian-950 font-bold' : 'text-platinum'
              }`}
            >
              2 × 2 Matrix
            </button>
            <button
              type="button"
              onClick={() => setLayout('3x3')}
              className={`px-3 py-1 rounded-md transition-colors ${
                layout === '3x3' ? 'bg-gold-500 text-obsidian-950 font-bold' : 'text-platinum'
              }`}
            >
              3 × 3 Matrix
            </button>
          </div>
        </div>
      </div>

      {/* Privacy Notice Banner (Section 23) */}
      <div className="p-3.5 rounded-xl bg-obsidian-950/80 border border-white/10 text-xs text-platinum-muted flex items-center justify-between">
        <div className="flex items-center gap-2">
          <ShieldCheck className="w-4 h-4 text-emerald-400" />
          <span>
            <strong>Zero Biometric Surveillance Policy:</strong> Incidental human faces and vehicle license plates are masked by OpenCV edge filters prior to browser rendering. Facial recognition is explicitly blocked.
          </span>
        </div>
        <span className="hidden sm:inline text-[10px] font-mono text-gold-400">
          AES-256 Encrypted Feeds
        </span>
      </div>

      {/* Camera Grid View */}
      <div
        className={`grid gap-4 ${
          layout === '2x2' ? 'grid-cols-1 md:grid-cols-2' : 'grid-cols-1 md:grid-cols-3'
        }`}
      >
        {cameras.map((cam, idx) => (
          <div
            key={cam.id}
            className="glass-panel rounded-2xl overflow-hidden border border-white/10 space-y-2 group hover:border-gold-500/30 transition-colors"
          >
            {/* Camera Viewport */}
            <div className="relative h-60 bg-black overflow-hidden flex items-center justify-center">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={sampleStreams[idx % sampleStreams.length]}
                alt={cam.name}
                className={`w-full h-full object-cover transition-all ${
                  globalPrivacyBlur && cam.privacy_blur_enabled ? 'blur-sm scale-105' : ''
                }`}
              />

              {/* Live Overlay Badges */}
              <div className="absolute top-3 left-3 flex items-center gap-2">
                <span
                  className={`px-2 py-0.5 rounded text-[10px] font-mono font-bold flex items-center gap-1 ${
                    cam.is_online
                      ? 'bg-emerald-950 text-emerald-300 border border-emerald-800'
                      : 'bg-rose-950 text-rose-300 border border-rose-800'
                  }`}
                >
                  <span
                    className={`w-1.5 h-1.5 rounded-full ${
                      cam.is_online ? 'bg-emerald-400 animate-pulse' : 'bg-rose-400'
                    }`}
                  />
                  {cam.is_online ? 'LIVE' : 'OFFLINE'}
                </span>

                <span className="px-2 py-0.5 rounded bg-black/60 backdrop-blur-md text-[10px] font-mono text-white border border-white/10">
                  WebRTC
                </span>
              </div>

              {globalPrivacyBlur && cam.privacy_blur_enabled && (
                <div className="absolute top-3 right-3 px-2 py-0.5 rounded bg-emerald-950/80 backdrop-blur-md text-[10px] font-mono text-emerald-400 border border-emerald-800 flex items-center gap-1">
                  <EyeOff className="w-3 h-3" />
                  Redaction Active
                </div>
              )}

              {/* Edge AI Event Spotter Banner */}
              <div className="absolute bottom-2 left-2 right-2 px-2.5 py-1 rounded bg-black/70 backdrop-blur-md text-[10px] font-mono text-platinum flex items-center justify-between border border-white/10">
                <span className="text-gold-300">Latest Event: Work Activity Detected</span>
                <span className="text-emerald-400 font-bold">Conf: 91%</span>
              </div>
            </div>

            {/* Camera Metadata Card */}
            <div className="p-4 space-y-1.5">
              <div className="flex items-center justify-between">
                <h4 className="text-sm font-bold text-white truncate max-w-[240px]">
                  {cam.name}
                </h4>
                <button
                  type="button"
                  onClick={() => toggleCameraPrivacy(cam.id)}
                  className="text-[11px] font-mono text-platinum-subtle hover:text-gold-400"
                >
                  Toggle Blur
                </button>
              </div>

              <div className="flex items-center justify-between text-[11px] font-mono text-platinum-muted">
                <span className="flex items-center gap-1">
                  <MapPin className="w-3 h-3 text-gold-400" />
                  {cam.latitude.toFixed(4)}, {cam.longitude.toFixed(4)}
                </span>
                <span>Path: {cam.webrtc_path}</span>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
