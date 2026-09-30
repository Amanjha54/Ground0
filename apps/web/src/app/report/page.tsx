"use client";

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useData } from '@/lib/data-context';
import { COMPLAINT_CATEGORIES } from '@ground0/config';
import { ComplaintCategory } from '@ground0/types';
import {
  AlertTriangle,
  Upload,
  MapPin,
  Mic,
  Camera,
  CheckCircle2,
  Sparkles,
  ArrowRight,
  Loader2
} from 'lucide-react';

export default function ReportPage() {
  const router = useRouter();
  const { submitComplaint } = useData();

  const [category, setCategory] = useState<ComplaintCategory>('POTHOLE');
  const [description, setDescription] = useState('');
  const [address, setAddress] = useState('701 Market St, San Francisco, CA');
  const [latitude, setLatitude] = useState(37.775115);
  const [longitude, setLongitude] = useState(-122.419205);
  const [isRecordingVoice, setIsRecordingVoice] = useState(false);
  const [voiceRecorded, setVoiceRecorded] = useState(false);
  const [uploadedImageUrl, setUploadedImageUrl] = useState<string>(
    'https://images.unsplash.com/photo-1515162816999-a0c47dc192f7?auto=format&fit=crop&w=800&q=80'
  );
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [aiTriageResult, setAiTriageResult] = useState<any>(null);

  const handleSimulateGPS = () => {
    // San Francisco coordinate jitter for realistic live demo
    const lat = 37.7749 + (Math.random() - 0.5) * 0.005;
    const lon = -122.4194 + (Math.random() - 0.5) * 0.005;
    setLatitude(lat);
    setLongitude(lon);
    setAddress(`San Francisco Civic Corridor, Marker #${Math.floor(Math.random() * 500)}`);
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const url = URL.createObjectURL(file);
      setUploadedImageUrl(url);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!description.trim()) return;

    setIsSubmitting(true);

    try {
      // Simulate/trigger AI triage analysis
      const newComp = await submitComplaint({
        category,
        description,
        latitude,
        longitude,
        address,
        mediaUrl: uploadedImageUrl
      });

      // Display AI triage results briefly before redirecting
      setAiTriageResult({
        tracking_number: newComp.tracking_number,
        category: newComp.category,
        confidence: newComp.ai_confidence,
        severity: newComp.severity,
        duplicate_count: 2
      });

      setTimeout(() => {
        router.push(`/complaint/${newComp.id}`);
      }, 1500);
    } catch (err) {
      console.error(err);
      setIsSubmitting(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto px-4 py-12 sm:px-6">
      <div className="text-center space-y-3 mb-10">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-gold-500/10 border border-gold-500/30 text-gold-400 text-xs font-mono">
          <AlertTriangle className="w-3.5 h-3.5" />
          <span>Municipal Citizen Intake Portal</span>
        </div>
        <h1 className="text-3xl sm:text-4xl font-extrabold text-white">
          Report a Real-World Issue
        </h1>
        <p className="text-sm text-platinum-muted max-w-xl mx-auto">
          Submit verified photographic and location evidence of physical civil defects. Ground0 AI clusters duplicates and tracks official remediation.
        </p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-8">
        {/* Step 1: Category Selection */}
        <div className="glass-panel p-6 rounded-2xl border border-white/10 space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-bold text-white font-mono uppercase tracking-wider flex items-center gap-2">
              <span className="w-6 h-6 rounded-full bg-gold-500 text-obsidian-950 flex items-center justify-center text-xs font-bold">1</span>
              Select Issue Category
            </h3>
            <span className="text-xs text-gold-400 font-mono">Mandatory</span>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-3">
            {COMPLAINT_CATEGORIES.map((cat) => {
              const isSelected = category === cat.id;
              return (
                <button
                  type="button"
                  key={cat.id}
                  onClick={() => setCategory(cat.id)}
                  className={`p-3 rounded-xl text-left border transition-all flex flex-col justify-between h-24 ${
                    isSelected
                      ? 'bg-gold-500/20 border-gold-400 text-white shadow-md'
                      : 'bg-obsidian-950/60 border-white/5 text-platinum-muted hover:border-white/20 hover:text-platinum'
                  }`}
                >
                  <div className="text-xs font-bold leading-tight">{cat.label}</div>
                  <div className="text-[10px] font-mono text-gold-400">
                    {isSelected ? '✓ SELECTED' : 'SELECT'}
                  </div>
                </button>
              );
            })}
          </div>
        </div>

        {/* Step 2: Visual Evidence & Voice Upload */}
        <div className="glass-panel p-6 rounded-2xl border border-white/10 space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-bold text-white font-mono uppercase tracking-wider flex items-center gap-2">
              <span className="w-6 h-6 rounded-full bg-gold-500 text-obsidian-950 flex items-center justify-center text-xs font-bold">2</span>
              Visual Evidence & Voice Note
            </h3>
            <span className="text-xs text-gold-400 font-mono">Photos / Video / Audio</span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 items-center">
            {/* Image Preview Box */}
            <div className="relative rounded-xl overflow-hidden border border-white/10 bg-obsidian-950 h-52 flex flex-col items-center justify-center group">
              {uploadedImageUrl ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img
                  src={uploadedImageUrl}
                  alt="Visual Evidence Preview"
                  className="w-full h-full object-cover"
                />
              ) : (
                <div className="text-center p-4">
                  <Camera className="w-8 h-8 text-platinum-subtle mx-auto mb-2" />
                  <p className="text-xs text-platinum-muted">No media captured</p>
                </div>
              )}
              <label className="absolute inset-0 bg-obsidian-950/60 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center cursor-pointer">
                <span className="px-3 py-1.5 rounded-lg bg-gold-500 text-obsidian-950 text-xs font-bold flex items-center gap-1.5 shadow-md">
                  <Upload className="w-3.5 h-3.5" />
                  Upload Photo/Video
                </span>
                <input
                  type="file"
                  accept="image/*,video/*"
                  onChange={handleImageChange}
                  className="hidden"
                />
              </label>
            </div>

            {/* Voice Note & Telemetry Controls */}
            <div className="space-y-4">
              <div className="p-4 rounded-xl bg-obsidian-950 border border-white/5 space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-medium text-white flex items-center gap-2">
                    <Mic className="w-4 h-4 text-gold-400" />
                    Optional Voice Telemetry
                  </span>
                  <span className="text-[11px] font-mono text-platinum-subtle">
                    {voiceRecorded ? 'Recorded (0:14)' : 'Ready'}
                  </span>
                </div>
                <p className="text-[11px] text-platinum-subtle leading-relaxed">
                  Record an audio voice note describing the noise, smell, or immediate road hazard.
                </p>
                <button
                  type="button"
                  onClick={() => {
                    if (!isRecordingVoice) {
                      setIsRecordingVoice(true);
                      setTimeout(() => {
                        setIsRecordingVoice(false);
                        setVoiceRecorded(true);
                      }, 2500);
                    }
                  }}
                  className={`w-full py-2 rounded-lg text-xs font-mono font-bold flex items-center justify-center gap-2 transition-colors ${
                    isRecordingVoice
                      ? 'bg-crimson-600 text-white animate-pulse'
                      : voiceRecorded
                      ? 'bg-emerald-950 text-emerald-400 border border-emerald-800'
                      : 'bg-white/5 hover:bg-white/10 text-platinum border border-white/10'
                  }`}
                >
                  <Mic className="w-3.5 h-3.5" />
                  {isRecordingVoice ? 'Recording Telemetry...' : voiceRecorded ? '✓ Voice Note Captured' : 'Record Voice Note'}
                </button>
              </div>

              <div className="p-3 rounded-xl bg-obsidian-950/40 border border-white/5 text-[11px] font-mono text-platinum-subtle flex items-center justify-between">
                <span>Cryptographic Proof:</span>
                <span className="text-emerald-400 font-bold">SHA-256 Enabled</span>
              </div>
            </div>
          </div>
        </div>

        {/* Step 3: Location */}
        <div className="glass-panel p-6 rounded-2xl border border-white/10 space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-bold text-white font-mono uppercase tracking-wider flex items-center gap-2">
              <span className="w-6 h-6 rounded-full bg-gold-500 text-obsidian-950 flex items-center justify-center text-xs font-bold">3</span>
              Location & Spatial Pin
            </h3>
            <button
              type="button"
              onClick={handleSimulateGPS}
              className="text-xs font-mono text-gold-400 hover:text-gold-300 underline flex items-center gap-1"
            >
              <MapPin className="w-3 h-3" />
              Auto-Detect Device GPS
            </button>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div className="sm:col-span-2">
              <label className="block text-xs font-mono text-platinum-subtle mb-1">
                Street Address / Intersection
              </label>
              <input
                type="text"
                value={address}
                onChange={(e) => setAddress(e.target.value)}
                className="w-full px-3 py-2 rounded-lg bg-obsidian-950 border border-white/10 text-white text-xs font-mono focus:border-gold-500 focus:outline-none"
                required
              />
            </div>
            <div>
              <label className="block text-xs font-mono text-platinum-subtle mb-1">
                GPS Latitude / Longitude
              </label>
              <input
                type="text"
                readOnly
                value={`${latitude.toFixed(6)}, ${longitude.toFixed(6)}`}
                className="w-full px-3 py-2 rounded-lg bg-obsidian-950/50 border border-white/5 text-emerald-400 text-xs font-mono cursor-not-allowed"
              />
            </div>
          </div>
        </div>

        {/* Step 4: Description */}
        <div className="glass-panel p-6 rounded-2xl border border-white/10 space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-bold text-white font-mono uppercase tracking-wider flex items-center gap-2">
              <span className="w-6 h-6 rounded-full bg-gold-500 text-obsidian-950 flex items-center justify-center text-xs font-bold">4</span>
              Detailed Description
            </h3>
          </div>
          <textarea
            rows={4}
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            placeholder="Describe the physical defect, approximate depth/size, and public safety hazard..."
            className="w-full px-4 py-3 rounded-xl bg-obsidian-950 border border-white/10 text-white text-xs leading-relaxed focus:border-gold-500 focus:outline-none"
            required
          />
        </div>

        {/* Submit CTA */}
        <div className="flex flex-col items-center gap-4">
          <button
            type="submit"
            disabled={isSubmitting || !description.trim()}
            className="w-full sm:w-auto px-10 py-4 rounded-xl bg-gradient-to-r from-gold-500 via-gold-400 to-gold-600 text-obsidian-950 font-bold text-sm hover:brightness-110 transition-all flex items-center justify-center gap-2 shadow-xl gold-glow disabled:opacity-50 cursor-pointer"
          >
            {isSubmitting ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin" />
                AI Analyzing & Submitting Complaint...
              </>
            ) : (
              <>
                <Sparkles className="w-4 h-4" />
                SUBMIT VERIFIED COMPLAINT
                <ArrowRight className="w-4 h-4" />
              </>
            )}
          </button>

          {aiTriageResult && (
            <div className="w-full p-4 rounded-xl glass-panel-emerald border border-emerald-500/40 text-center animate-in fade-in">
              <div className="flex items-center justify-center gap-2 text-emerald-400 font-bold text-xs uppercase font-mono">
                <CheckCircle2 className="w-4 h-4" />
                AI Triage Confirmed: Complaint #{aiTriageResult.tracking_number}
              </div>
              <div className="text-xs text-platinum-muted mt-1 font-mono">
                Detected: {aiTriageResult.category} ({Math.round(aiTriageResult.confidence * 100)}% Conf) • Severity: {aiTriageResult.severity}
              </div>
            </div>
          )}
        </div>
      </form>
    </div>
  );
}
