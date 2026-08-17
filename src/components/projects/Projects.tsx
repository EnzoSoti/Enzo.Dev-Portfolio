import React, { useState } from 'react';
import { Project } from '../../types';

interface ProjectsProps {
  projects: Project[];
  onImageClick: (src: string, alt: string) => void;
  onSelectProject?: (project: Project) => void;
}

export const Projects: React.FC<ProjectsProps> = ({ projects, onImageClick, onSelectProject }) => {
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

  const featured =
    filteredProjects.find((p) => p.featured) ||
    (filter === 'all' ? projects.find((p) => p.featured) : null);
  const regularProjects = filteredProjects.filter((p) => p !== featured);

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    const card = e.currentTarget;
    const rect = card.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    const xc = rect.width / 2;
    const yc = rect.height / 2;
    const angleX = (yc - y) / 16;
    const angleY = (x - xc) / 16;
    card.style.transform = `perspective(1000px) rotateX(${angleX}deg) rotateY(${angleY}deg) scale3d(1.01, 1.01, 1.01)`;
  };

  const handleMouseLeave = (e: React.MouseEvent<HTMLDivElement>) => {
    e.currentTarget.style.transform = 'perspective(1000px) rotateX(0deg) rotateY(0deg) scale3d(1, 1, 1)';
  };

  return (
    <section id="projects" className="section-card py-24 px-6">
      <div className="max-w-5xl mx-auto">
        {/* Header with Title & Filter Buttons */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-12">
          <div>
            <p className="text-xs tracking-[0.3em] uppercase text-accent mb-2 font-semibold">03 // SELECTED WORK</p>
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
            <div
              onMouseMove={handleMouseMove}
              onMouseLeave={handleMouseLeave}
              className="project-card block group mb-6 transition-all duration-300 transform scale-100 opacity-100 border border-ink/10 dark:border-cream/10 rounded-lg overflow-hidden bg-ink/5 dark:bg-cream/5"
            >
              <div className="relative overflow-hidden">
                {featured.imageUrl ? (
                  <img
                    src={featured.imageUrl}
                    alt={featured.title}
                    onClick={() => onSelectProject ? onSelectProject(featured) : onImageClick(featured.imageUrl!, featured.title)}
                    className="project-img previewable-img w-full h-72 sm:h-96 object-cover cursor-pointer"
                  />
                ) : (
                  <div className="w-full h-72 bg-ink/5 dark:bg-cream/5 flex items-center justify-center border-b border-ink/10 dark:border-cream/10">
                    <span className="text-[10px] uppercase tracking-widest opacity-40">Featured Application</span>
                  </div>
                )}

                <div className="absolute top-4 left-4 z-10 flex items-center gap-2">
                  <span className="px-2.5 py-1 bg-accent text-white text-[10px] font-mono tracking-widest uppercase font-semibold rounded shadow-md">
                    Featured Project
                  </span>
                  {featured.badge && (
                    <span className="px-2.5 py-1 bg-ink/80 dark:bg-black/80 text-cream text-[10px] font-mono tracking-widest uppercase rounded border border-cream/15 backdrop-blur-sm">
                      {featured.badge}
                    </span>
                  )}
                </div>
              </div>

              <div className="p-6 flex flex-col md:flex-row md:items-start md:justify-between gap-6 border-t border-ink/10 dark:border-cream/10">
                <div className="flex-1">
                  <h3 className="text-xl font-semibold mb-2">{featured.title}</h3>
                  <p className="text-sm opacity-70 max-w-xl leading-relaxed mb-4">{featured.description}</p>
                  
                  <div className="flex flex-wrap gap-2">
                    {featured.tags
                      .split(',')
                      .filter((t) => t.trim())
                      .map((t, idx) => (
                        <span
                          key={idx}
                          className="tech-pill px-2.5 py-1 border border-ink/15 dark:border-cream/15 text-xs transition-all duration-200 rounded font-mono"
                        >
                          {t.trim()}
                        </span>
                      ))}
                  </div>
                </div>

                <div className="flex flex-wrap items-center gap-3 self-start md:self-center flex-shrink-0">
                  {onSelectProject && (
                    <button
                      onClick={() => onSelectProject(featured)}
                      className="px-4 py-2 border border-ink/20 dark:border-cream/20 text-xs tracking-wider uppercase hover:bg-ink hover:text-cream dark:hover:bg-cream dark:hover:text-ink transition-colors"
                    >
                      Case Study
                    </button>
                  )}
                  {featured.liveUrl && (
                    <a
                      href={featured.liveUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="px-5 py-2 bg-accent text-white text-xs tracking-wider uppercase hover:opacity-90 transition-opacity"
                    >
                      Live Demo ↗
                    </a>
                  )}
                </div>
              </div>
            </div>
          )}

          {/* Grid of Other Projects */}
          <div className="grid md:grid-cols-3 gap-4">
            {regularProjects.map((p) => (
              <div
                key={p.id}
                onMouseMove={handleMouseMove}
                onMouseLeave={handleMouseLeave}
                className="project-card group border border-ink/10 dark:border-cream/10 rounded-lg overflow-hidden transition-all duration-300 transform scale-100 opacity-100 flex flex-col justify-between bg-ink/5 dark:bg-cream/5"
              >
                <div>
                  <div className="overflow-hidden border-b border-ink/10 dark:border-cream/10 relative">
                    {p.imageUrl ? (
                      <img
                        src={p.imageUrl}
                        alt={p.title}
                        onClick={() => onSelectProject ? onSelectProject(p) : onImageClick(p.imageUrl!, p.title)}
                        className="project-img previewable-img w-full h-44 object-cover cursor-pointer"
                      />
                    ) : (
                      <div className="w-full h-44 bg-ink/10 dark:bg-cream/5 flex flex-col items-center justify-center relative">
                        <span className="text-[10px] uppercase tracking-widest opacity-40 font-mono">
                          {p.badge || 'Internal Project'}
                        </span>
                      </div>
                    )}

                    {p.badge && (
                      <span className="absolute top-3 left-3 px-2 py-0.5 bg-ink/80 dark:bg-black/80 border border-cream/15 text-cream text-[9px] uppercase tracking-wider font-semibold rounded backdrop-blur-sm">
                        {p.badge}
                      </span>
                    )}
                  </div>

                  <div className="p-5">
                    <h3 className="text-sm font-semibold group-hover:text-accent transition-colors truncate mb-1">
                      {p.title}
                    </h3>
                    <p className="text-xs opacity-60 mb-3 line-clamp-2 leading-relaxed">{p.description}</p>
                    
                    <div className="flex flex-wrap gap-1.5 mt-2">
                      {p.tags
                        .split(',')
                        .filter((t) => t.trim())
                        .map((t, idx) => (
                          <span
                            key={idx}
                            className="tech-pill px-1.5 py-0.5 border border-ink/10 dark:border-cream/10 text-[10px] opacity-70 rounded-sm font-mono"
                          >
                            {t.trim()}
                          </span>
                        ))}
                    </div>
                  </div>
                </div>

                <div className="p-5 pt-0 flex items-center justify-between gap-2 border-t border-ink/5 dark:border-cream/5 mt-3">
                  {onSelectProject ? (
                    <button
                      onClick={() => onSelectProject(p)}
                      className="text-[11px] uppercase tracking-wider opacity-60 hover:opacity-100 hover:text-accent transition-colors"
                    >
                      Details →
                    </button>
                  ) : <span />}

                  {p.liveUrl ? (
                    <a
                      href={p.liveUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-[11px] uppercase tracking-wider text-accent font-semibold hover:underline"
                    >
                      Live ↗
                    </a>
                  ) : p.githubUrl ? (
                    <a
                      href={p.githubUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-[11px] uppercase tracking-wider text-accent font-semibold hover:underline"
                    >
                      Code ↗
                    </a>
                  ) : (
                    <span className="text-[10px] opacity-30 font-mono">Internal</span>
                  )}
                </div>
              </div>
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
