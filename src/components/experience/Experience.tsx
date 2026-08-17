import React from 'react';
import { Experience as ExperienceType } from '../../types';

interface ExperienceProps {
  experiences: ExperienceType[];
  onImageClick: (src: string, alt: string) => void;
}

export const Experience: React.FC<ExperienceProps> = ({ experiences, onImageClick }) => {
  return (
    <section id="experience" className="section-card py-24 px-6">
      <div className="max-w-5xl mx-auto">
        <div className="grid md:grid-cols-3 gap-12">
          {/* Left: Title & Intro */}
          <div>
            <p className="text-xs tracking-[0.3em] uppercase text-accent mb-4">Professional History</p>
            <h2 className="font-display text-4xl font-normal mb-6">History.</h2>
            <p className="text-sm opacity-60 leading-relaxed">
              A summary of my academic background at STI College, leading to backend development projects and internship
              experience at the Integrated Bar of the Philippines.
            </p>
          </div>

          {/* Right: Timeline Entries */}
          <div className="md:col-span-2 space-y-12">
            {experiences.map((exp, idx) => {
              let bullets: string[] = [];
              try {
                bullets = Array.isArray(exp.bullets) ? exp.bullets : JSON.parse(exp.bullets || '[]');
              } catch (_) {
                bullets = [];
              }

              const isLast = idx === experiences.length - 1;

              return (
                <div
                  key={exp.id || idx}
                  className={isLast ? '' : 'border-b border-ink/10 dark:border-cream/10 pb-8'}
                >
                  <div className="flex items-start gap-4 mb-4">
                    {exp.logoUrl ? (
                      <img
                        src={exp.logoUrl}
                        alt={`${exp.company} Logo`}
                        className="w-12 h-12 object-contain bg-white dark:bg-transparent p-1 rounded border border-ink/5 dark:border-cream/5"
                      />
                    ) : (
                      <div className="w-12 h-12 bg-accent/10 flex items-center justify-center text-accent font-semibold rounded text-sm">
                        {exp.company.substring(0, 2).toUpperCase()}
                      </div>
                    )}
                    <div className="flex-1">
                      <div className="flex flex-col sm:flex-row sm:items-baseline sm:justify-between gap-1">
                        <h3 className="text-lg font-semibold text-accent">{exp.company}</h3>
                        <span className="text-xs opacity-50 font-mono">{exp.period}</span>
                      </div>
                      <p className="text-sm font-semibold opacity-80">{exp.role}</p>
                    </div>
                  </div>

                  {/* Bullet points */}
                  <ul className="space-y-3 mb-6">
                    {bullets.map((bullet, bIdx) => (
                      <li key={bIdx} className="flex items-start gap-3 text-sm opacity-70">
                        <span className="text-accent mt-1.5 w-1.5 h-1.5 bg-accent rounded-full flex-shrink-0" />
                        <span>{bullet}</span>
                      </li>
                    ))}
                  </ul>

                  {/* Images showcase (if available) */}
                  {exp.images && exp.images.length > 0 && (
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mt-6">
                      {exp.images.map((img, iIdx) => (
                        <div
                          key={iIdx}
                          className="overflow-hidden border border-ink/10 dark:border-cream/10 group/img"
                        >
                          <div className="overflow-hidden h-40">
                            <img
                              src={img.url}
                              alt={img.caption}
                              onClick={() => onImageClick(img.url, img.caption)}
                              className="previewable-img w-full h-full object-cover grayscale group-hover/img:grayscale-0 group-hover/img:scale-105 transition-all duration-500 cursor-zoom-in"
                            />
                          </div>
                          <div className="p-3 bg-ink/5 dark:bg-cream/5 border-t border-ink/10 dark:border-cream/10">
                            <p className="text-[10px] uppercase tracking-wider opacity-60 font-semibold mb-0.5">
                              {img.caption}
                            </p>
                            <p className="text-[10px] opacity-40 leading-normal">{img.description}</p>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
};
