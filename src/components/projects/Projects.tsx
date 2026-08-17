import React, { useState } from 'react';
import { Project } from '../../types';

interface ProjectsProps {
  projects: Project[];
  onImageClick: (src: string, alt: string) => void;
}

export const Projects: React.FC<ProjectsProps> = ({ projects, onImageClick }) => {
  const [filter, setFilter] = useState('all');

  const filterButtons = [
    { label: 'All', value: 'all' },
    { label: 'React', value: 'react' },
    { label: 'Node.js', value: 'node' },
    { label: 'Databases', value: 'database' },
    { label: 'Vanilla JS', value: 'vanilla' },
  ];

  const filteredProjects = projects.filter((p) => {
    if (filter === 'all') return true;
    const cats = (p.category || '').toLowerCase().split(' ');
    return cats.includes(filter.toLowerCase());
  });

  const featured = filteredProjects.find((p) => p.featured) || (filter === 'all' ? projects.find((p) => p.featured) : null);
  const regularProjects = filteredProjects.filter((p) => p !== featured);

  const handleMouseMove = (e: React.MouseEvent<HTMLAnchorElement | HTMLDivElement>) => {
    const card = e.currentTarget;
    const rect = card.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    const xc = rect.width / 2;
    const yc = rect.height / 2;
    const angleX = (yc - y) / 14;
    const angleY = (x - xc) / 14;
    card.style.transform = `perspective(1000px) rotateX(${angleX}deg) rotateY(${angleY}deg) scale3d(1.01, 1.01, 1.01)`;
  };

  const handleMouseLeave = (e: React.MouseEvent<HTMLAnchorElement | HTMLDivElement>) => {
    e.currentTarget.style.transform = 'perspective(1000px) rotateX(0deg) rotateY(0deg) scale3d(1, 1, 1)';
  };

  return (
    <section id="projects" className="section-card py-24 px-6">
      <div className="max-w-5xl mx-auto">
        {/* Header with Title & Filter Buttons */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-12">
          <div>
            <p className="text-xs tracking-[0.3em] uppercase text-accent mb-2">Selected Work</p>
            <h2 className="font-display text-4xl font-normal">Projects.</h2>
          </div>

          <div className="flex flex-wrap gap-2 text-xs">
            {filterButtons.map((btn) => (
              <button
                key={btn.value}
                onClick={() => setFilter(btn.value)}
                className={`filter-btn px-3 py-1 border transition-all duration-200 ${
                  filter === btn.value
                    ? 'border-accent bg-accent text-cream'
                    : 'border-ink/20 dark:border-cream/20 opacity-60 hover:opacity-100 hover:border-accent'
                }`}
              >
                {btn.label}
              </button>
            ))}
          </div>

          <a
            href="https://github.com/EnzoSoti"
            target="_blank"
            rel="noopener noreferrer"
            className="text-xs tracking-widest uppercase opacity-50 hover:opacity-100 hover:text-accent transition-all hidden md:inline-block"
          >
            GitHub →
          </a>
        </div>

        {/* Projects Container */}
        <div className="w-full">
          {/* Featured Project Showcase */}
          {featured && (
            <a
              href={featured.liveUrl || featured.githubUrl || undefined}
              target={featured.liveUrl || featured.githubUrl ? '_blank' : undefined}
              rel="noopener noreferrer"
              onMouseMove={handleMouseMove}
              onMouseLeave={handleMouseLeave}
              className="project-card block group mb-6 transition-all duration-300 transform scale-100 opacity-100"
            >
              <div className="overflow-hidden border border-ink/10 dark:border-cream/10">
                <div className="relative">
                  {featured.imageUrl ? (
                    <img
                      src={featured.imageUrl}
                      alt={featured.title}
                      onClick={(e) => {
                        if (!featured.liveUrl && !featured.githubUrl) {
                          e.preventDefault();
                          onImageClick(featured.imageUrl!, featured.title);
                        }
                      }}
                      className="project-img previewable-img w-full h-72 object-cover"
                    />
                  ) : (
                    <div className="w-full h-72 bg-ink/5 dark:bg-cream/5 flex items-center justify-center border-b border-ink/10 dark:border-cream/10">
                      <span className="text-[10px] uppercase tracking-widest opacity-40">Internal System</span>
                    </div>
                  )}

                  <div className="absolute inset-0 bg-ink/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center pointer-events-none">
                    <span className="text-cream text-sm tracking-widest uppercase">
                      {featured.liveUrl ? 'View Live ↗' : featured.githubUrl ? 'View Code ↗' : 'Internal System'}
                    </span>
                  </div>
                </div>

                <div className="p-6 flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4 border-t border-ink/10 dark:border-cream/10">
                  <div>
                    <div className="flex items-center gap-3 mb-2">
                      <h3 className="text-lg font-semibold">{featured.title}</h3>
                      {featured.badge && (
                        <span className="px-2 py-0.5 bg-accent text-cream text-xs tracking-wider uppercase">
                          {featured.badge}
                        </span>
                      )}
                    </div>
                    <p className="text-sm opacity-60 max-w-md">{featured.description}</p>
                  </div>

                  <div className="flex flex-wrap gap-2 sm:text-right sm:justify-end">
                    {featured.tags
                      .split(',')
                      .filter((t) => t.trim())
                      .map((t, idx) => (
                        <span
                          key={idx}
                          className="tech-pill px-2 py-1 border border-ink/20 dark:border-cream/20 text-xs transition-all duration-200"
                        >
                          {t.trim()}
                        </span>
                      ))}
                  </div>
                </div>
              </div>
            </a>
          )}

          {/* Grid of Other Projects */}
          <div className="grid md:grid-cols-3 gap-4">
            {regularProjects.map((p) => (
              <a
                key={p.id}
                href={p.liveUrl || p.githubUrl || undefined}
                target={p.liveUrl || p.githubUrl ? '_blank' : undefined}
                rel="noopener noreferrer"
                onMouseMove={handleMouseMove}
                onMouseLeave={handleMouseLeave}
                className="project-card group block border border-ink/10 dark:border-cream/10 overflow-hidden transition-all duration-300 transform scale-100 opacity-100"
              >
                <div className="overflow-hidden border-b border-ink/10 dark:border-cream/10 relative">
                  {p.imageUrl ? (
                    <img
                      src={p.imageUrl}
                      alt={p.title}
                      onClick={(e) => {
                        if (!p.liveUrl && !p.githubUrl) {
                          e.preventDefault();
                          onImageClick(p.imageUrl!, p.title);
                        }
                      }}
                      className="project-img previewable-img w-full h-40 object-cover"
                    />
                  ) : (
                    <div className="w-full h-40 bg-ink/5 dark:bg-cream/5 flex flex-col items-center justify-center relative transition-colors group-hover:bg-ink/10 dark:group-hover:bg-cream/10">
                      <span className="text-[10px] uppercase tracking-widest opacity-40">Internal Tool / IBP</span>
                    </div>
                  )}

                  <div className="absolute inset-0 bg-ink/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center pointer-events-none">
                    <span className="text-cream text-xs tracking-widest uppercase">
                      {p.liveUrl ? 'View Live ↗' : p.githubUrl ? 'View Code ↗' : 'Internal System'}
                    </span>
                  </div>
                </div>

                <div className="p-4">
                  <div className="flex items-center justify-between gap-2 mb-1">
                    <h3 className="text-sm font-semibold group-hover:text-accent transition-colors truncate">
                      {p.title}
                    </h3>
                    {p.badge && (
                      <span className="px-1.5 py-0.5 border border-accent/40 text-[9px] uppercase tracking-wider text-accent font-semibold rounded-sm">
                        {p.badge}
                      </span>
                    )}
                  </div>
                  <p className="text-xs opacity-50 mb-3 line-clamp-2">{p.description}</p>
                  <div className="flex flex-wrap gap-1.5 mt-2">
                    {p.tags
                      .split(',')
                      .filter((t) => t.trim())
                      .map((t, idx) => (
                        <span
                          key={idx}
                          className="tech-pill px-1.5 py-0.5 border border-ink/10 dark:border-cream/10 text-[10px] opacity-60 rounded-sm transition-all duration-200"
                        >
                          {t.trim()}
                        </span>
                      ))}
                  </div>
                </div>
              </a>
            ))}
          </div>

          {filteredProjects.length === 0 && (
            <div className="text-center py-16 opacity-40 text-xs font-mono">
              No projects found matching the selected filter.
            </div>
          )}
        </div>
      </div>
    </section>
  );
};
