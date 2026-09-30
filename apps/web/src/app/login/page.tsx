"use client";

import React, { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { ShieldCheck, Lock, Mail, ArrowRight } from 'lucide-react';

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState('inspector@metro.gov');
  const [password, setPassword] = useState('ground0-secure');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    router.push('/dashboard');
  };

  return (
    <div className="max-w-md mx-auto px-4 py-16 sm:px-0 space-y-6">
      <div className="text-center space-y-2">
        <div className="w-12 h-12 rounded-2xl bg-gold-500/10 border border-gold-500/30 flex items-center justify-center mx-auto shadow-lg">
          <ShieldCheck className="w-6 h-6 text-gold-400" />
        </div>
        <h1 className="text-2xl font-bold text-white tracking-tight">Access Command Center</h1>
        <p className="text-xs text-platinum-muted">
          Authenticated access for municipal officers, inspectors, and contractors.
        </p>
      </div>

      <form onSubmit={handleSubmit} className="glass-panel p-6 sm:p-8 rounded-2xl border border-white/10 space-y-4">
        <div>
          <label className="block text-xs font-mono text-platinum-subtle mb-1">Government / Work Email</label>
          <div className="relative">
            <Mail className="w-4 h-4 absolute left-3 top-3 text-platinum-subtle" />
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full pl-9 pr-3 py-2.5 rounded-xl bg-obsidian-950 border border-white/10 text-white text-xs font-mono focus:border-gold-500 focus:outline-none"
              required
            />
          </div>
        </div>

        <div>
          <label className="block text-xs font-mono text-platinum-subtle mb-1">Password</label>
          <div className="relative">
            <Lock className="w-4 h-4 absolute left-3 top-3 text-platinum-subtle" />
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full pl-9 pr-3 py-2.5 rounded-xl bg-obsidian-950 border border-white/10 text-white text-xs font-mono focus:border-gold-500 focus:outline-none"
              required
            />
          </div>
        </div>

        <div className="flex items-center justify-between text-[11px] font-mono">
          <Link href="/forgot-password" className="text-gold-400 hover:underline">
            Forgot password?
          </Link>
          <span className="text-platinum-subtle">PostgreSQL RLS Secured</span>
        </div>

        <button
          type="submit"
          className="w-full py-3.5 rounded-xl bg-gradient-to-r from-gold-500 via-gold-400 to-gold-600 text-obsidian-950 font-bold text-xs uppercase tracking-wider flex items-center justify-center gap-2 shadow-lg gold-glow cursor-pointer"
        >
          Sign In to Ground0
          <ArrowRight className="w-4 h-4" />
        </button>

        <div className="text-center pt-2 text-xs text-platinum-muted">
          Don&apos;t have an account?{' '}
          <Link href="/signup" className="text-gold-400 hover:underline font-mono">
            Register here
          </Link>
        </div>
      </form>
    </div>
  );
}
