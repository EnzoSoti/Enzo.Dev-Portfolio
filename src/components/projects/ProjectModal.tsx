import React, { useEffect } from 'react';
import { Project } from '../../types';

interface ProjectModalProps {
  project: Project | null;
  onClose: () => void;
}

export const ProjectModal: React.FC<ProjectModalProps> = ({ project, onClose }) => {
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };

    if (project) {
      document.body.style.overflow = 'hidden';
      window.addEventListener('keydown', handleKeyDown);
    }

    return () => {
      document.body.style.overflow = '';
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [project, onClose]);

  if (!project) return null;

  return (
    <div
      onClick={onClose}
      className="fixed inset-0 z-[150] bg-ink/80 dark:bg-black/90 backdrop-blur-md flex items-center justify-center p-4 animate-in fade-in duration-200 overflow-y-auto"
    >
      <div
        onClick={(e) => e.stopPropagation()}
        className="w-full max-w-2xl bg-cream dark:bg-[#12110F] border border-ink/15 dark:border-cream/15 rounded-xl shadow-2xl overflow-hidden font-mono text-ink dark:text-cream max-h-[90vh] flex flex-col"
      >
        {/* Modal Header */}
        <div className="p-6 border-b border-ink/10 dark:border-cream/10 flex items-start justify-between gap-4">
          <div>
            <div className="flex items-center gap-3 mb-2">
              <span className="text-[10px] uppercase tracking-widest text-accent font-semibold">
                Project Case Study
              </span>
              {project.badge && (
                <span className="px-2 py-0.5 border border-accent/40 text-accent text-[9px] uppercase tracking-wider font-semibold rounded">
                  {project.badge}
                </span>
              )}
            </div>
            <h2 className="font-display text-2xl sm:text-3xl font-normal leading-tight">
              {project.title}
            </h2>
          </div>
          <button
            onClick={onClose}
            aria-label="Close"
            className="w-8 h-8 rounded-full border border-ink/15 dark:border-cream/15 flex items-center justify-center text-sm opacity-60 hover:opacity-100 hover:border-accent transition-colors"
          >
            &times;
          </button>
        </div>

        {/* Modal Body */}
        <div className="p-6 overflow-y-auto space-y-6 flex-1 text-xs sm:text-sm">
          {project.imageUrl && (
            <div className="overflow-hidden rounded-lg border border-ink/10 dark:border-cream/10">
              <img
                src={project.imageUrl}
                alt={project.title}
                className="w-full h-56 sm:h-72 object-cover"
              />
            </div>
          )}

          <div>
            <h4 className="text-[10px] uppercase tracking-widest text-accent font-semibold mb-2">
              Overview & Objectives
            </h4>
            <p className="leading-relaxed opacity-75">{project.description}</p>
          </div>

          {/* Tech Stack */}
          <div>
            <h4 className="text-[10px] uppercase tracking-widest text-accent font-semibold mb-2">
              Technologies & Tooling
            </h4>
            <div className="flex flex-wrap gap-2">
              {project.tags
                .split(',')
                .filter(Boolean)
                .map((t, idx) => (
                  <span
                    key={idx}
                    className="px-2.5 py-1 bg-ink/5 dark:bg-cream/5 border border-ink/10 dark:border-cream/10 rounded text-xs tracking-wider"
                  >
                    {t.trim()}
                  </span>
                ))}
            </div>
          </div>

          {/* Key Architecture Highlights */}
          <div className="p-4 bg-ink/5 dark:bg-cream/5 border border-ink/10 dark:border-cream/10 rounded-lg space-y-2">
            <h4 className="text-[10px] uppercase tracking-widest font-semibold opacity-60">
              Engineering Architecture
            </h4>
            <ul className="space-y-1.5 text-xs opacity-75">
              <li className="flex items-start gap-2">
                <span className="text-accent">•</span>
                <span>Modular component hierarchy with responsive cross-device layouts.</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-accent">•</span>
                <span>Optimized state management and client-side data caching.</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-accent">•</span>
                <span>Strict RESTful endpoint design with robust error handling.</span>
              </li>
            </ul>
          </div>
        </div>

        {/* Modal Footer / Actions */}
        <div className="p-4 bg-ink/5 dark:bg-black/30 border-t border-ink/10 dark:border-cream/10 flex flex-wrap items-center justify-end gap-3">
          {project.githubUrl && (
            <a
              href={project.githubUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="px-4 py-2 border border-ink/20 dark:border-cream/20 text-xs tracking-wider uppercase hover:bg-ink hover:text-cream dark:hover:bg-cream dark:hover:text-ink transition-colors"
            >
              View Code →
            </a>
          )}
          {project.liveUrl && (
            <a
              href={project.liveUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="px-5 py-2 bg-accent text-white text-xs tracking-wider uppercase hover:opacity-90 transition-opacity"
            >
              Open Live Demo ↗
            </a>
          )}
        </div>
      </div>
    </div>
  );
};
