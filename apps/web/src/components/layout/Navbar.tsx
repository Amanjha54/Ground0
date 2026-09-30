"use client";

import React, { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useData } from '@/lib/data-context';
import { UserRole } from '@ground0/types';
import {
  ShieldCheck,
  Activity,
  MapPin,
  Camera,
  CheckCircle2,
  FileText,
  Layers,
  BarChart3,
  Sliders,
  ChevronDown,
  Menu,
  X,
  AlertTriangle,
  UserCheck
} from 'lucide-react';

export function Navbar() {
  const pathname = usePathname();
  const { role, setRole } = useData();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [roleDropdownOpen, setRoleDropdownOpen] = useState(false);

  const roles: { id: UserRole; label: string; badgeClass: string }[] = [
    { id: 'CITIZEN', label: 'Citizen', badgeClass: 'text-sky-400 bg-sky-950/60 border-sky-800' },
    { id: 'FIELD_WORKER', label: 'Field Worker', badgeClass: 'text-amber-400 bg-amber-950/60 border-amber-800' },
    { id: 'INSPECTOR', label: 'Inspector', badgeClass: 'text-emerald-400 bg-emerald-950/60 border-emerald-800' },
    { id: 'PROJECT_MANAGER', label: 'Project Manager', badgeClass: 'text-indigo-400 bg-indigo-950/60 border-indigo-800' },
    { id: 'ORGANIZATION_ADMIN', label: 'Admin', badgeClass: 'text-gold-400 bg-gold-950/60 border-gold-800' },
    { id: 'AUDITOR', label: 'Auditor', badgeClass: 'text-purple-400 bg-purple-950/60 border-purple-800' },
  ];

  const currentRoleObj = roles.find((r) => r.id === role) || roles[2];

  const navLinks = [
    { href: '/dashboard', label: 'Command Center', icon: Activity },
    { href: '/report', label: 'Report Issue', icon: AlertTriangle },
    { href: '/work-orders', label: 'Work Orders', icon: FileText },
    { href: '/verification-lab', label: 'Verification Lab', icon: CheckCircle2 },
    { href: '/cameras', label: 'CCTV Wall', icon: Camera },
    { href: '/map', label: 'Live Map', icon: MapPin },
    { href: '/analytics', label: 'Analytics', icon: BarChart3 },
    { href: '/audit', label: 'Audit Trail', icon: Layers },
  ];

  return (
    <header className="sticky top-0 z-50 w-full glass-panel border-b border-white/10 backdrop-blur-md">
      {/* System Status Top Bar */}
      <div className="bg-obsidian-950/90 border-b border-white/5 px-4 py-1 text-xs flex justify-between items-center text-platinum-muted">
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-1.5">
            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
            <span className="text-[11px] font-mono tracking-wide text-emerald-400 font-semibold uppercase">
              AI Verification Engine: Active
            </span>
          </div>
          <span className="hidden sm:inline text-white/20">|</span>
          <div className="hidden sm:flex items-center gap-1.5 font-mono text-[11px]">
            <span>MediaMTX Gateway:</span>
            <span className="text-emerald-400">ONLINE (WebRTC / ONVIF)</span>
          </div>
        </div>
        <div className="flex items-center gap-3 font-mono text-[11px]">
          <span className="text-gold-400">Zero-Trust Physical Audit</span>
          <span className="text-white/20">|</span>
          <span className="text-platinum-subtle">Build v1.0 Production</span>
        </div>
      </div>

      {/* Main Navbar */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
        {/* Brand Logo */}
        <Link href="/" className="flex items-center gap-3 group">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-gold-500/20 via-obsidian-800 to-emerald-600/20 border border-gold-500/40 flex items-center justify-center group-hover:border-gold-400 transition-colors shadow-lg">
            <ShieldCheck className="w-5 h-5 text-gold-400 group-hover:scale-105 transition-transform" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="font-extrabold text-xl tracking-wider text-white">
                GROUND<span className="text-gold-400">0</span>
              </span>
              <span className="text-[9px] px-1.5 py-0.5 rounded bg-gold-500/10 text-gold-400 font-mono border border-gold-500/30">
                PROD
              </span>
            </div>
            <p className="text-[10px] text-platinum-muted hidden sm:block tracking-tight -mt-0.5">
              Proof of Physical Work
            </p>
          </div>
        </Link>

        {/* Desktop Nav Links */}
        <nav className="hidden xl:flex items-center gap-1">
          {navLinks.map((link) => {
            const Icon = link.icon;
            const isActive = pathname === link.href;
            return (
              <Link
                key={link.href}
                href={link.href}
                className={`px-3 py-1.5 rounded-lg text-xs font-medium flex items-center gap-1.5 transition-all ${
                  isActive
                    ? 'bg-gold-500/15 text-gold-300 border border-gold-500/30 shadow-sm'
                    : 'text-platinum-muted hover:text-white hover:bg-white/5'
                }`}
              >
                <Icon className={`w-3.5 h-3.5 ${isActive ? 'text-gold-400' : 'text-platinum-subtle'}`} />
                {link.label}
              </Link>
            );
          })}
        </nav>

        {/* Right Section: Role Switcher & CTA */}
        <div className="flex items-center gap-3">
          {/* Interactive Role Switcher for Hackathon Testing */}
          <div className="relative">
            <button
              onClick={() => setRoleDropdownOpen(!roleDropdownOpen)}
              className={`px-2.5 py-1.5 rounded-lg text-xs font-mono border flex items-center gap-1.5 transition-colors ${currentRoleObj.badgeClass}`}
              title="Switch role to inspect permissions & views"
            >
              <UserCheck className="w-3.5 h-3.5" />
              <span className="font-semibold">{currentRoleObj.label}</span>
              <ChevronDown className="w-3 h-3 opacity-70" />
            </button>

            {roleDropdownOpen && (
              <div className="absolute right-0 mt-2 w-48 rounded-xl glass-panel-gold p-1 shadow-2xl z-50">
                <div className="px-2 py-1.5 text-[10px] font-mono text-platinum-subtle uppercase border-b border-white/5">
                  Select Active Persona:
                </div>
                {roles.map((r) => (
                  <button
                    key={r.id}
                    onClick={() => {
                      setRole(r.id);
                      setRoleDropdownOpen(false);
                    }}
                    className={`w-full text-left px-2.5 py-1.5 rounded-lg text-xs flex items-center justify-between font-mono transition-colors ${
                      role === r.id ? 'bg-gold-500/20 text-gold-300' : 'text-platinum hover:bg-white/5'
                    }`}
                  >
                    <span>{r.label}</span>
                    {role === r.id && <span className="text-gold-400">✓</span>}
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Primary Action Button */}
          <Link
            href="/report"
            className="hidden sm:inline-flex items-center gap-2 px-3.5 py-1.5 rounded-lg bg-gradient-to-r from-gold-500 to-gold-600 text-obsidian-950 text-xs font-bold hover:brightness-110 transition-all shadow-md"
          >
            <AlertTriangle className="w-3.5 h-3.5" />
            Report Issue
          </Link>

          {/* Mobile Menu Toggle */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="xl:hidden p-2 text-platinum hover:text-white rounded-lg hover:bg-white/5"
          >
            {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>
      </div>

      {/* Mobile Menu Dropdown */}
      {mobileMenuOpen && (
        <div className="xl:hidden border-t border-white/10 bg-obsidian-900/95 px-4 pt-3 pb-5 space-y-1">
          {navLinks.map((link) => {
            const Icon = link.icon;
            const isActive = pathname === link.href;
            return (
              <Link
                key={link.href}
                href={link.href}
                onClick={() => setMobileMenuOpen(false)}
                className={`px-3 py-2 rounded-lg text-sm flex items-center gap-2.5 ${
                  isActive
                    ? 'bg-gold-500/15 text-gold-300 font-semibold'
                    : 'text-platinum-muted hover:text-white hover:bg-white/5'
                }`}
              >
                <Icon className="w-4 h-4 text-gold-400" />
                {link.label}
              </Link>
            );
          })}
          <div className="pt-2">
            <Link
              href="/report"
              onClick={() => setMobileMenuOpen(false)}
              className="w-full inline-flex justify-center items-center gap-2 px-4 py-2.5 rounded-lg bg-gold-500 text-obsidian-950 font-bold text-sm shadow-md"
            >
              <AlertTriangle className="w-4 h-4" />
              Report an Issue
            </Link>
          </div>
        </div>
      )}
    </header>
  );
}
