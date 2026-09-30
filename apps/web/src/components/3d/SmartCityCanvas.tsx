"use client";

import React, { useRef, useMemo, useState, useEffect } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { OrbitControls, Float } from '@react-three/drei';
import * as THREE from 'three';

// City Building Block with edge glow
function Building({ position, size, isVerified }: { position: [number, number, number]; size: [number, number, number]; isVerified?: boolean }) {
  const meshRef = useRef<THREE.Mesh>(null);
  
  return (
    <mesh ref={meshRef} position={[position[0], size[1] / 2, position[2]]}>
      <boxGeometry args={size} />
      <meshStandardMaterial
        color={isVerified ? "#0F281E" : "#111420"}
        roughness={0.2}
        metalness={0.8}
        emissive={isVerified ? "#059669" : "#1C1F2E"}
        emissiveIntensity={isVerified ? 0.3 : 0.1}
      />
    </mesh>
  );
}

// Scanning Radar Wave
function RadarScanWave() {
  const ringRef = useRef<THREE.Mesh>(null);

  useFrame(({ clock }) => {
    if (ringRef.current) {
      const t = (clock.getElapsedTime() * 0.8) % 6;
      ringRef.current.scale.set(1 + t * 4, 1 + t * 4, 1);
      const mat = ringRef.current.material as THREE.MeshBasicMaterial;
      if (mat) {
        mat.opacity = Math.max(0, 0.6 - (t / 6) * 0.6);
      }
    }
  });

  return (
    <mesh ref={ringRef} rotation={[-Math.PI / 2, 0, 0]} position={[0, 0.05, 0]}>
      <ringGeometry args={[1, 1.15, 64]} />
      <meshBasicMaterial color="#D4AF37" transparent opacity={0.5} side={THREE.DoubleSide} />
    </mesh>
  );
}

// Glowing Pin for Civic Issue Marker
function IssueNode({ position, verified }: { position: [number, number, number]; verified: boolean }) {
  const pinRef = useRef<THREE.Group>(null);

  useFrame(({ clock }) => {
    if (pinRef.current) {
      pinRef.current.position.y = position[1] + Math.sin(clock.getElapsedTime() * 3) * 0.2;
    }
  });

  return (
    <group ref={pinRef} position={position}>
      {/* Outer Halo */}
      <mesh position={[0, 0.8, 0]}>
        <sphereGeometry args={[0.3, 16, 16]} />
        <meshStandardMaterial
          color={verified ? "#10B981" : "#F59E0B"}
          emissive={verified ? "#059669" : "#D97706"}
          emissiveIntensity={1.8}
          roughness={0.1}
        />
      </mesh>
      {/* Beacon Pillar */}
      <mesh position={[0, 0.4, 0]}>
        <cylinderGeometry args={[0.04, 0.04, 0.8, 8]} />
        <meshBasicMaterial color={verified ? "#34D399" : "#FBBF24"} transparent opacity={0.7} />
      </mesh>
    </group>
  );
}

// Particle Dust
function ParticleDust({ count = 120 }: { count?: number }) {
  const points = useMemo(() => {
    const coords = new Float32Array(count * 3);
    for (let i = 0; i < count; i++) {
      coords[i * 3] = (Math.random() - 0.5) * 30;
      coords[i * 3 + 1] = Math.random() * 8;
      coords[i * 3 + 2] = (Math.random() - 0.5) * 30;
    }
    return coords;
  }, [count]);

  const pRef = useRef<THREE.Points>(null);
  useFrame(({ clock }) => {
    if (pRef.current) {
      pRef.current.rotation.y = clock.getElapsedTime() * 0.03;
    }
  });

  return (
    <points ref={pRef}>
      <bufferGeometry>
        <bufferAttribute
          attach="attributes-position"
          count={points.length / 3}
          array={points}
          itemSize={3}
        />
      </bufferGeometry>
      <pointsMaterial size={0.08} color="#D4AF37" transparent opacity={0.4} />
    </points>
  );
}

// Main 3D City Scene
function CityScene() {
  const buildings = useMemo(() => {
    const list: { pos: [number, number, number]; size: [number, number, number]; isVerified?: boolean }[] = [];
    const gridSize = 4;
    const spacing = 3.2;

    for (let x = -gridSize; x <= gridSize; x++) {
      for (let z = -gridSize; z <= gridSize; z++) {
        // Leave central avenue open for road grid
        if (Math.abs(x) < 1 || Math.abs(z) < 1) continue;

        const h = 1.2 + Math.abs(Math.sin(x * 12.3 + z * 34.5)) * 3.5;
        const isVer = (x + z) % 3 === 0;
        list.push({
          pos: [x * spacing + (Math.random() * 0.4), 0, z * spacing + (Math.random() * 0.4)],
          size: [1.8 + Math.random() * 0.4, h, 1.8 + Math.random() * 0.4],
          isVerified: isVer
        });
      }
    }
    return list;
  }, []);

  return (
    <>
      <ambientLight intensity={0.6} />
      <directionalLight position={[10, 20, 15]} intensity={1.2} color="#FFF8E7" />
      <pointLight position={[0, 4, 0]} intensity={2.0} color="#D4AF37" distance={15} />
      <pointLight position={[-8, 6, -8]} intensity={1.5} color="#059669" distance={20} />

      {/* Ground Grid Floor */}
      <gridHelper args={[40, 40, "#D4AF37", "#1C1F2E"]} position={[0, 0, 0]} />

      {/* Radar Wave */}
      <RadarScanWave />

      {/* Buildings */}
      {buildings.map((b, i) => (
        <Building key={i} position={b.pos} size={b.size} isVerified={b.isVerified} />
      ))}

      {/* Issue Marker Nodes */}
      <IssueNode position={[-2, 0, 3]} verified={true} />
      <IssueNode position={[3, 0, -2]} verified={false} />
      <IssueNode position={[-4, 0, -5]} verified={true} />
      <IssueNode position={[5, 0, 4]} verified={false} />

      {/* Particles */}
      <ParticleDust count={150} />

      <OrbitControls
        enableZoom={false}
        enablePan={false}
        autoRotate
        autoRotateSpeed={0.6}
        maxPolarAngle={Math.PI / 2.3}
        minPolarAngle={Math.PI / 4}
      />
    </>
  );
}

export function SmartCityCanvas() {
  const [hasWebGL, setHasWebGL] = useState(true);

  useEffect(() => {
    try {
      const canvas = document.createElement('canvas');
      const gl = canvas.getContext('webgl') || canvas.getContext('experimental-webgl');
      if (!gl) setHasWebGL(false);
    } catch {
      setHasWebGL(false);
    }
  }, []);

  if (!hasWebGL) {
    // Accessible fallback when WebGL is unavailable
    return (
      <div className="w-full h-full flex items-center justify-center bg-obsidian-950/80 tech-grid">
        <div className="text-center p-6 glass-panel rounded-2xl max-w-md border border-gold-500/20">
          <div className="w-12 h-12 rounded-full bg-gold-500/10 text-gold-400 flex items-center justify-center mx-auto mb-3">
            📍
          </div>
          <h3 className="text-sm font-bold text-white font-mono uppercase">
            Smart City Spatial Grid
          </h3>
          <p className="text-xs text-platinum-muted mt-1">
            Displaying high-contrast topological infrastructure nodes in reduced effects mode.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="w-full h-full relative cursor-grab active:cursor-grabbing">
      <Canvas
        camera={{ position: [14, 12, 14], fov: 45 }}
        gl={{ antialias: true, alpha: true }}
      >
        <CityScene />
      </Canvas>
      {/* 3D Scene Overlay Legend */}
      <div className="absolute bottom-4 left-4 glass-panel px-3 py-2 rounded-xl text-[11px] font-mono flex items-center gap-4 text-platinum-muted border border-white/10 pointer-events-none">
        <div className="flex items-center gap-1.5">
          <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse" />
          <span className="text-emerald-400">Verified Work (Emerald)</span>
        </div>
        <div className="flex items-center gap-1.5">
          <span className="w-2.5 h-2.5 rounded-full bg-amber-500" />
          <span className="text-amber-400">Active Incident (Amber)</span>
        </div>
        <div className="flex items-center gap-1.5 hidden sm:flex">
          <span className="w-2.5 h-2.5 rounded-full bg-gold-400" />
          <span className="text-gold-300">Radar Sensor</span>
        </div>
      </div>
    </div>
  );
}
