import React from 'react';
import { PortfolioConfig } from '../../types';

interface HeroProps {
  config: PortfolioConfig;
}

export const Hero: React.FC<HeroProps> = ({ config }) => {
  return (
    <section className="section-card section-card--hero min-h-screen flex flex-col justify-center pt-28 pb-0 px-6">
      <div className="max-w-5xl mx-auto w-full">
        {/* Top small label */}
        <p className="animate-fade-up stagger-1 text-xs tracking-[0.3em] uppercase text-accent mb-8">
          {config.heroLabel || 'Portfolio — 2026'}
        </p>

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
              'IT Graduate & Web Developer based in Caloocan City, Philippines. Building systems with Node.js, Express, MySQL, Supabase & Docker.'}
          </p>
          <div className="sm:ml-auto flex flex-wrap gap-3">
            <a
              href={`mailto:${config.email || 'parane.enzo@gmail.com'}`}
              className="px-5 py-2.5 bg-ink text-cream dark:bg-cream dark:text-ink text-xs tracking-widest uppercase hover:opacity-80 transition-opacity"
            >
              Hire Me
            </a>
            <a
              href="/doc/Enzo%20Daniela%20Resume.pdf"
              target="_blank"
              rel="noopener noreferrer"
              className="px-5 py-2.5 border border-ink dark:border-cream text-xs tracking-widest uppercase hover:bg-ink hover:text-cream dark:hover:bg-cream dark:hover:text-ink transition-colors"
            >
              Resume
            </a>
          </div>
        </div>

        {/* Quick Stats row */}
        <div className="animate-fade-up stagger-4 grid grid-cols-2 sm:grid-cols-4 border-b border-ink/15 dark:border-cream/15">
          <div className="py-6 pr-6 border-r border-ink/15 dark:border-cream/15">
            <p className="font-display text-4xl font-normal text-accent">4+</p>
            <p className="text-xs uppercase tracking-widest opacity-50 mt-1">Projects</p>
          </div>
          <div className="py-6 px-6 border-r border-ink/15 dark:border-cream/15">
            <p className="font-display text-4xl font-normal text-accent">4+yr</p>
            <p className="text-xs uppercase tracking-widest opacity-50 mt-1">Coding</p>
          </div>
          <div className="py-6 px-6 border-r border-ink/15 dark:border-cream/15">
            <p className="font-display text-4xl font-normal text-accent">BS</p>
            <p className="text-xs uppercase tracking-widest opacity-50 mt-1">IT Degree</p>
          </div>
          <div className="py-6 pl-6">
            <p className="font-display text-4xl font-normal text-accent">Web</p>
            <p className="text-xs uppercase tracking-widest opacity-50 mt-1">Developer</p>
          </div>
        </div>
      </div>
    </section>
  );
};
