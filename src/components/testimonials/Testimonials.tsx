import React from 'react';
import { Testimonial } from '../../types';
import { DEFAULT_TESTIMONIALS } from '../../services/mockData';

interface TestimonialsProps {
  testimonials?: Testimonial[];
}

export const Testimonials: React.FC<TestimonialsProps> = ({ testimonials = DEFAULT_TESTIMONIALS }) => {
  return (
    <section id="testimonials" className="section-card py-24 px-6">
      <div className="max-w-5xl mx-auto">
        <div className="grid md:grid-cols-3 gap-12">
          {/* Left Title Block */}
          <div>
            <p className="text-xs tracking-[0.3em] uppercase text-accent mb-4 font-semibold">04 // ENDORSEMENTS</p>
            <h2 className="font-display text-4xl font-normal mb-6">Feedback.</h2>
            <p className="text-sm opacity-60 leading-relaxed">
              Feedback and recommendations from my Capstone adviser and internship supervisor on system architecture,
              database design, and web development.
            </p>
          </div>

          {/* Right Cards */}
          <div className="md:col-span-2 grid md:grid-cols-2 gap-6">
            {testimonials.map((item) => (
              <div
                key={item.id}
                className="p-6 border border-ink/10 dark:border-cream/10 bg-ink/5 dark:bg-cream/5 flex flex-col justify-between relative overflow-hidden"
              >
                <div className="text-accent opacity-10 text-7xl font-serif absolute top-2 right-4 pointer-events-none select-none">
                  “
                </div>
                <p className="text-sm opacity-70 italic leading-relaxed mb-8 relative z-10">{item.quote}</p>
                <div className="flex items-center gap-3 border-t border-ink/10 dark:border-cream/10 pt-4 mt-auto">
                  <div className="w-8 h-8 rounded-full bg-accent/15 flex items-center justify-center text-accent font-semibold text-xs tracking-wider">
                    {item.initials}
                  </div>
                  <div>
                    {item.link ? (
                      <a
                        href={item.link}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-xs font-semibold uppercase tracking-wider text-accent hover:underline inline-flex items-center gap-1"
                      >
                        {item.name} <span className="text-[8px] opacity-75">↗</span>
                      </a>
                    ) : (
                      <h4 className="text-xs font-semibold uppercase tracking-wider text-accent">{item.name}</h4>
                    )}
                    <p className="text-[10px] opacity-40">{item.role}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};
