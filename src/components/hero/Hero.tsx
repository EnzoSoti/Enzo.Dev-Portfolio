import React, { useState } from 'react';
import { PortfolioConfig } from '../../types';
import { useToast } from '../../context/ToastContext';

interface HeroProps {
  config: PortfolioConfig;
}

export const Hero: React.FC<HeroProps> = ({ config }) => {
  const { showToast } = useToast();
  const [copied, setCopied] = useState(false);

  const handleCopyEmail = () => {
    const email = config.email || 'parane.enzo@gmail.com';
    navigator.clipboard.writeText(email);
    setCopied(true);
    showToast(`Copied ${email} to clipboard!`, 'success');
    setTimeout(() => setCopied(false), 2500);
  };

  return (
    <section className="section-card section-card--hero min-h-screen flex flex-col justify-center pt-28 pb-0 px-6">
      <div className="max-w-5xl mx-auto w-full">
        {/* Live Availability Status Pill & Label */}
        <div className="animate-fade-up stagger-1 flex flex-wrap items-center gap-3 mb-6">
          <div className="inline-flex items-center gap-2 px-3 py-1 bg-emerald-500/10 border border-emerald-500/30 text-emerald-600 dark:text-emerald-400 text-[10px] tracking-wider uppercase rounded-full">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
            <span>IT Developer @ Great Sierra Dev Corp · Open for select collaborations</span>
          </div>
          <span className="text-xs opacity-40 font-mono hidden sm:inline">•</span>
          <p className="text-xs tracking-[0.3em] uppercase text-accent font-semibold">
            {config.heroLabel || 'Portfolio — 2026'}
          </p>
        </div>

        {/* Big editorial headline */}
        <div className="animate-fade-up stagger-2">
          <h1 className="font-display text-[clamp(3rem,10vw,8rem)] leading-none font-normal tracking-tight mb-2">
            <span>{config.heroName1 || 'Enzo'}</span>
            <br />
            <span className="italic text-accent">{config.heroName2 || 'Daniela.'}</span>
          </h1>
        </div>

        {/* Divider + tagline row */}
        <div className="animate-fade-up stagger-3 flex flex-col sm:flex-row sm:items-end gap-6 mt-8 pb-8 border-b border-ink/15 dark:border-cream/15">
          <p className="text-sm leading-relaxed max-w-sm opacity-70">
            {config.heroTagline ||
              'IT Developer Programmer at Great Sierra Development Corporation & Web Developer based in Caloocan / Quezon City, Philippines. Building systems with React, TypeScript, Node.js, Express, SQL & Python.'}
          </p>
          <div className="sm:ml-auto flex flex-wrap gap-3">
            <button
              onClick={handleCopyEmail}
              className="px-5 py-2.5 bg-ink text-cream dark:bg-cream dark:text-ink text-xs tracking-widest uppercase hover:opacity-80 transition-opacity inline-flex items-center gap-2"
            >
              <span>{copied ? 'Email Copied!' : 'Copy Email'}</span>
              <span className="text-[10px] opacity-75">{copied ? '✓' : '⧉'}</span>
            </button>
            <a
              href="/doc/Enzo%20Daniela%20Resume.pdf"
              target="_blank"
              rel="noopener noreferrer"
              className="px-5 py-2.5 border border-ink dark:border-cream text-xs tracking-widest uppercase hover:bg-ink hover:text-cream dark:hover:bg-cream dark:hover:text-ink transition-colors"
            >
              Resume PDF ↗
            </a>
          </div>
        </div>

        {/* Quick Stats row */}
        <div className="animate-fade-up stagger-4 grid grid-cols-2 sm:grid-cols-4 border-b border-ink/15 dark:border-cream/15">
          <div className="py-6 pr-6 border-r border-ink/15 dark:border-cream/15">
            <p className="font-display text-4xl font-normal text-accent">5+</p>
            <p className="text-xs uppercase tracking-widest opacity-50 mt-1">Live Systems</p>
          </div>
          <div className="py-6 px-6 border-r border-ink/15 dark:border-cream/15">
            <p className="font-display text-4xl font-normal text-accent">4+yr</p>
            <p className="text-xs uppercase tracking-widest opacity-50 mt-1">Coding</p>
          </div>
          <div className="py-6 px-6 border-r border-ink/15 dark:border-cream/15">
            <p className="font-display text-4xl font-normal text-accent">GSDC</p>
            <p className="text-xs uppercase tracking-widest opacity-50 mt-1">Full-Time Role</p>
          </div>
          <div className="py-6 pl-6">
            <p className="font-display text-4xl font-normal text-accent">BS</p>
            <p className="text-xs uppercase tracking-widest opacity-50 mt-1">IT Degree</p>
          </div>
        </div>
      </div>
    </section>
  );
};
