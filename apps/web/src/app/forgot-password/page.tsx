"use client";

import React, { useState } from 'react';
import Link from 'next/link';
import { ShieldCheck, Mail, ArrowLeft, CheckCircle2 } from 'lucide-react';

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState('');
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitted(true);
  };

  return (
    <div className="max-w-md mx-auto px-4 py-16 sm:px-0 space-y-6">
      <Link
        href="/login"
        className="inline-flex items-center gap-1.5 text-xs font-mono text-platinum-muted hover:text-gold-400 transition-colors"
      >
        <ArrowLeft className="w-3.5 h-3.5" />
        Back to Login
      </Link>

      <div className="text-center space-y-2">
        <h1 className="text-2xl font-bold text-white tracking-tight">Reset Password</h1>
        <p className="text-xs text-platinum-muted">
          Enter your registered email to receive cryptographic password recovery instructions.
        </p>
      </div>

      {!submitted ? (
        <form onSubmit={handleSubmit} className="glass-panel p-6 sm:p-8 rounded-2xl border border-white/10 space-y-4">
          <div>
            <label className="block text-xs font-mono text-platinum-subtle mb-1">Email Address</label>
            <div className="relative">
              <Mail className="w-4 h-4 absolute left-3 top-3 text-platinum-subtle" />
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="officer@metro.gov"
                className="w-full pl-9 pr-3 py-2.5 rounded-xl bg-obsidian-950 border border-white/10 text-white text-xs font-mono focus:border-gold-500 focus:outline-none"
                required
              />
            </div>
          </div>

          <button
            type="submit"
            className="w-full py-3.5 rounded-xl bg-gold-500 hover:bg-gold-400 text-obsidian-950 font-bold text-xs uppercase tracking-wider transition-all shadow-md cursor-pointer"
          >
            Send Recovery Link
          </button>
        </form>
      ) : (
        <div className="p-6 rounded-2xl glass-panel-emerald border border-emerald-500/40 text-center space-y-2">
          <CheckCircle2 className="w-8 h-8 text-emerald-400 mx-auto" />
          <h3 className="text-sm font-bold text-white">Recovery Link Sent</h3>
          <p className="text-xs text-platinum-muted">
            If an account exists for {email}, password reset instructions have been dispatched.
          </p>
        </div>
      )}
    </div>
  );
}
