import React, { useState, useEffect } from 'react';
import { PortfolioConfig, GithubStats } from '../../types';
import { PacketSimulator } from './PacketSimulator';
import { api } from '../../services/api';

interface AboutProps {
  config: PortfolioConfig;
  onImageClick: (src: string, alt: string) => void;
}

export const About: React.FC<AboutProps> = ({ config, onImageClick }) => {
  const [githubStats, setGithubStats] = useState<GithubStats>({
    repos: '12',
    stars: '3',
    activity: 'Fetching latest event...',
  });
  const [hoveredTech, setHoveredTech] = useState<string | null>(null);

  useEffect(() => {
    api.getGithubStats().then((stats) => {
      setGithubStats(stats);
    });
  }, []);

  const techStack = {
    backend: ['Node.js', 'Express.js', 'Python', 'SQL', 'MySQL', 'Firebase', 'Supabase'],
    frontend: ['React', 'TypeScript', 'JavaScript', 'Tailwind', 'HTML/CSS'],
    tools: ['Docker', 'Git/GitHub', 'Google Apps Script', 'Claude', 'GitHub Copilot', 'Antigravity'],
  };

  const renderTechPill = (tech: string) => {
    const isHighlighted = hoveredTech === tech.toLowerCase();
    return (
      <span
        key={tech}
        onMouseEnter={() => setHoveredTech(tech.toLowerCase())}
        onMouseLeave={() => setHoveredTech(null)}
        className={`tech-pill px-3 py-1 border text-xs tracking-wider transition-all duration-200 cursor-default select-none ${
          isHighlighted
            ? 'bg-accent/20 border-accent text-accent scale-105'
            : 'border-ink/20 dark:border-cream/20'
        }`}
      >
        {tech}
      </span>
    );
  };

  return (
    <section id="about" className="section-card py-24 px-6">
      <div className="max-w-5xl mx-auto">
        <div className="grid md:grid-cols-2 gap-16 items-start">
          {/* Left Column: Photo & Education Stats */}
          <div>
            <div className="relative inline-block group">
              <img
                src={config.profileImg || '/image/gradpic.jpg'}
                alt="Enzo P. Daniela"
                onClick={() =>
                  onImageClick(config.profileImg || '/image/gradpic.jpg', 'Enzo P. Daniela')
                }
                className="previewable-img w-full max-w-xs grayscale hover:grayscale-0 transition-all duration-500 border border-ink/10 dark:border-cream/10 cursor-zoom-in"
              />
              <div className="absolute -bottom-4 -right-4 bg-accent text-cream px-4 py-2 shadow-sm">
                <p className="text-xs tracking-widest uppercase">{config.badgeText || 'BSIT Graduate'}</p>
              </div>
            </div>

            <div className="mt-12 space-y-4">
              <div className="flex items-center gap-4 py-3 border-t border-ink/10 dark:border-cream/10">
                <span className="text-xs tracking-widest uppercase opacity-40 w-20 flex-shrink-0">School</span>
                <span className="text-sm">{config.school || 'STI College Fairview'}</span>
              </div>
              <div className="flex items-center gap-4 py-3 border-t border-ink/10 dark:border-cream/10">
                <span className="text-xs tracking-widest uppercase opacity-40 w-20 flex-shrink-0">Course</span>
                <span className="text-sm">{config.course || 'BS Information Technology'}</span>
              </div>
              <div className="flex items-center gap-4 py-3 border-t border-ink/10 dark:border-cream/10">
                <span className="text-xs tracking-widest uppercase opacity-40 w-20 flex-shrink-0">Graduated</span>
                <span className="text-sm">{config.graduated || 'July 17, 2026'}</span>
              </div>
              <div className="flex items-center gap-4 py-3 border-t border-b border-ink/10 dark:border-cream/10">
                <span className="text-xs tracking-widest uppercase opacity-40 w-20 flex-shrink-0">Location</span>
                <span className="text-sm">{config.location || 'Caloocan City, PH'}</span>
              </div>
            </div>
          </div>

          {/* Right Column: Bio, Tech Stack & Simulation */}
          <div>
            <p className="text-xs tracking-[0.3em] uppercase text-accent mb-6">About</p>
            <h2 className="font-display text-2xl leading-relaxed mb-6 font-normal">
              {config.aboutTitle || 'Backend-first developer who actually cares about how the data moves.'}
            </h2>
            <p className="text-sm leading-relaxed opacity-70 mb-4">
              {config.aboutText1 ||
                'BS Information Technology graduate with hands-on experience in web development through internship, academic, and personal projects. Focused on building robust server-side logic, RESTful APIs, and database operations.'}
            </p>
            <p className="text-sm leading-relaxed opacity-70 mb-12">
              {config.aboutText2 ||
                'Comfortable working on both solo and team-based projects. Uses AI-assisted tools like Claude and GitHub Copilot to accelerate development and support frontend implementation.'}
            </p>

            {/* Tech Stack */}
            <p className="text-xs tracking-[0.3em] uppercase text-accent mb-6">Tech Stack</p>
            <div className="space-y-4">
              <div>
                <p className="text-xs uppercase tracking-widest opacity-40 mb-2">Backend</p>
                <div className="flex flex-wrap gap-2">{techStack.backend.map(renderTechPill)}</div>
              </div>
              <div>
                <p className="text-xs uppercase tracking-widest opacity-40 mb-2">Frontend</p>
                <div className="flex flex-wrap gap-2">{techStack.frontend.map(renderTechPill)}</div>
              </div>
              <div>
                <p className="text-xs uppercase tracking-widest opacity-40 mb-2">Tools & AI</p>
                <div className="flex flex-wrap gap-2">{techStack.tools.map(renderTechPill)}</div>
              </div>
            </div>

            {/* Interactive Data Flow Simulation */}
            <PacketSimulator />
          </div>
        </div>

        {/* GitHub Activity Section */}
        <div className="mt-16 pt-16 border-t border-ink/10 dark:border-cream/10">
          <p className="text-xs tracking-[0.3em] uppercase text-accent mb-6 font-semibold">GitHub Activity</p>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-6">
            <div className="border border-ink/10 dark:border-cream/10 p-5 bg-ink/5 dark:bg-cream/5 rounded-sm group hover:border-accent/40 transition-colors duration-300">
              <p className="text-[10px] uppercase tracking-widest opacity-40">Public Repositories</p>
              <p className="text-3xl font-display text-accent mt-2 font-normal">{githubStats.repos}</p>
            </div>
            <div className="border border-ink/10 dark:border-cream/10 p-5 bg-ink/5 dark:bg-cream/5 rounded-sm group hover:border-accent/40 transition-colors duration-300">
              <p className="text-[10px] uppercase tracking-widest opacity-40">GitHub Stars</p>
              <p className="text-3xl font-display text-accent mt-2 font-normal">{githubStats.stars}</p>
            </div>
            <div className="border border-ink/10 dark:border-cream/10 p-5 bg-ink/5 dark:bg-cream/5 rounded-sm group hover:border-accent/40 transition-colors duration-300">
              <p className="text-[10px] uppercase tracking-widest opacity-40">Latest Activity</p>
              <p className="text-xs font-mono mt-2 text-accent font-semibold leading-relaxed line-clamp-2 h-10 flex items-center">
                {githubStats.activity}
              </p>
            </div>
          </div>

          <div className="overflow-x-auto pb-2 border border-ink/10 dark:border-cream/10 p-6 bg-ink/5 dark:bg-cream/5 rounded">
            <div className="min-w-[750px]">
              <img
                src="https://ghchart.rshah.org/C8522A/EnzoSoti"
                alt="Enzo P. Daniela's GitHub Contribution Calendar Heatmap"
                className="w-full h-auto select-none"
              />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
