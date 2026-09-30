"use client";

import React, { useState, useRef, useCallback } from 'react';
import { Sliders, Layers, Sparkles } from 'lucide-react';

interface BeforeAfterSliderProps {
  beforeImage: string;
  afterImage: string;
  differenceMaskImage?: string;
  heatmapImage?: string;
  beforeLabel?: string;
  afterLabel?: string;
}

export function BeforeAfterSlider({
  beforeImage,
  afterImage,
  differenceMaskImage,
  heatmapImage,
  beforeLabel = "BEFORE (Defect)",
  afterLabel = "AFTER (Repaired)"
}: BeforeAfterSliderProps) {
  const [sliderPosition, setSliderPosition] = useState(50);
  const [mode, setMode] = useState<'SLIDER' | 'SIDE_BY_SIDE' | 'DIFF_MASK' | 'HEATMAP'>('SLIDER');
  const [isDragging, setIsDragging] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  const handleMove = useCallback((clientX: number) => {
    if (!containerRef.current) return;
    const rect = containerRef.current.getBoundingClientRect();
    const x = Math.max(0, Math.min(clientX - rect.left, rect.width));
    const percent = Math.max(0, Math.min((x / rect.width) * 100, 100));
    setSliderPosition(percent);
  }, []);

  const handleMouseDown = () => setIsDragging(true);
  const handleMouseUp = () => setIsDragging(false);

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!isDragging) return;
    handleMove(e.clientX);
  };

  const handleTouchMove = (e: React.TouchEvent) => {
    handleMove(e.touches[0].clientX);
  };

  return (
    <div className="space-y-3">
      {/* Mode Switcher */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-1 glass-panel p-1 rounded-lg text-xs font-mono">
          <button
            type="button"
            onClick={() => setMode('SLIDER')}
            className={`px-2.5 py-1 rounded-md transition-colors ${
              mode === 'SLIDER' ? 'bg-gold-500 text-obsidian-950 font-bold' : 'text-platinum hover:text-white'
            }`}
          >
            Interactive Slider
          </button>
          <button
            type="button"
            onClick={() => setMode('SIDE_BY_SIDE')}
            className={`px-2.5 py-1 rounded-md transition-colors ${
              mode === 'SIDE_BY_SIDE' ? 'bg-gold-500 text-obsidian-950 font-bold' : 'text-platinum hover:text-white'
            }`}
          >
            Side-by-Side
          </button>
          {differenceMaskImage && (
            <button
              type="button"
              onClick={() => setMode('DIFF_MASK')}
              className={`px-2.5 py-1 rounded-md transition-colors ${
                mode === 'DIFF_MASK' ? 'bg-gold-500 text-obsidian-950 font-bold' : 'text-platinum hover:text-white'
              }`}
            >
              Difference Mask
            </button>
          )}
          {heatmapImage && (
            <button
              type="button"
              onClick={() => setMode('HEATMAP')}
              className={`px-2.5 py-1 rounded-md transition-colors ${
                mode === 'HEATMAP' ? 'bg-gold-500 text-obsidian-950 font-bold' : 'text-platinum hover:text-white'
              }`}
            >
              CV Heatmap
            </button>
          )}
        </div>

        <div className="text-[11px] font-mono text-gold-400">
          Scene Align: <span className="text-emerald-400 font-bold">94.1% Homography</span>
        </div>
      </div>

      {/* Main Viewport */}
      {mode === 'SLIDER' && (
        <div
          ref={containerRef}
          onMouseMove={handleMouseMove}
          onMouseDown={handleMouseDown}
          onMouseUp={handleMouseUp}
          onTouchMove={handleTouchMove}
          className="relative w-full h-[420px] rounded-2xl overflow-hidden select-none cursor-ew-resize border border-white/15 shadow-2xl bg-obsidian-950"
        >
          {/* After Image (Background) */}
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={afterImage}
            alt="After Remediation"
            className="absolute inset-0 w-full h-full object-cover pointer-events-none"
          />
          <div className="absolute top-3 right-3 px-2.5 py-1 rounded-md glass-panel-emerald text-emerald-300 text-xs font-mono font-bold pointer-events-none">
            {afterLabel}
          </div>

          {/* Before Image (Clipped Foreground) */}
          <div
            className="absolute inset-0 overflow-hidden pointer-events-none"
            style={{ width: `${sliderPosition}%` }}
          >
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={beforeImage}
              alt="Before Remediation"
              className="absolute inset-0 w-full h-full object-cover max-w-none pointer-events-none"
              style={{
                width: containerRef.current ? `${containerRef.current.clientWidth}px` : '100%',
                height: '100%',
              }}
            />
            <div className="absolute top-3 left-3 px-2.5 py-1 rounded-md glass-panel text-amber-300 text-xs font-mono font-bold pointer-events-none">
              {beforeLabel}
            </div>
          </div>

          {/* Divider Line & Thumb */}
          <div
            className="absolute top-0 bottom-0 w-1 bg-gold-400 shadow-xl pointer-events-none"
            style={{ left: `${sliderPosition}%` }}
          >
            <div className="absolute top-1/2 -translate-y-1/2 -translate-x-1/2 w-8 h-8 rounded-full bg-gold-500 text-obsidian-950 shadow-2xl flex items-center justify-center font-bold text-xs border border-white/40 gold-glow">
              <Sliders className="w-4 h-4" />
            </div>
          </div>
        </div>
      )}

      {mode === 'SIDE_BY_SIDE' && (
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div className="relative rounded-xl overflow-hidden border border-white/10 h-72">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={beforeImage} alt="Before" className="w-full h-full object-cover" />
            <div className="absolute top-2 left-2 px-2 py-0.5 rounded bg-amber-950 text-amber-300 text-[10px] font-mono font-bold">
              {beforeLabel}
            </div>
          </div>
          <div className="relative rounded-xl overflow-hidden border border-white/10 h-72">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={afterImage} alt="After" className="w-full h-full object-cover" />
            <div className="absolute top-2 right-2 px-2 py-0.5 rounded bg-emerald-950 text-emerald-300 text-[10px] font-mono font-bold">
              {afterLabel}
            </div>
          </div>
        </div>
      )}

      {mode === 'DIFF_MASK' && differenceMaskImage && (
        <div className="relative rounded-xl overflow-hidden border border-white/10 h-[400px] bg-black flex items-center justify-center">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src={differenceMaskImage} alt="Difference Mask" className="max-h-full object-contain" />
          <div className="absolute top-3 left-3 px-3 py-1 rounded-md glass-panel text-white text-xs font-mono">
            OpenCV Morphological Difference Contour Mask (Defect Footprint)
          </div>
        </div>
      )}

      {mode === 'HEATMAP' && heatmapImage && (
        <div className="relative rounded-xl overflow-hidden border border-white/10 h-[400px] bg-black flex items-center justify-center">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src={heatmapImage} alt="Heatmap" className="max-h-full object-contain" />
          <div className="absolute top-3 left-3 px-3 py-1 rounded-md glass-panel text-gold-300 text-xs font-mono">
            ColorMap Jet Physical Intensity Alteration Heatmap
          </div>
        </div>
      )}
    </div>
  );
}
