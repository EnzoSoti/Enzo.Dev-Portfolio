import React, { useRef, useState, useEffect } from 'react';
import { GalleryItem } from '../../types';

interface GalleryProps {
  galleryItems: GalleryItem[];
  onImageClick: (src: string, alt: string) => void;
}

export const Gallery: React.FC<GalleryProps> = ({ galleryItems, onImageClick }) => {
  const trackRef = useRef<HTMLDivElement>(null);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [progressWidth, setProgressWidth] = useState(25);

  const total = galleryItems.length || 1;

  const updateGalleryState = () => {
    if (!trackRef.current) return;
    const track = trackRef.current;
    const scrollLeft = track.scrollLeft;
    const maxScroll = track.scrollWidth - track.clientWidth;
    const progress = maxScroll > 0 ? (scrollLeft / maxScroll) * 100 : 0;

    const startPercent = 100 / total;
    const mapped = startPercent + progress * (1 - startPercent / 100);
    setProgressWidth(Math.min(Math.max(mapped, startPercent), 100));

    const slide = track.querySelector('.gallery-slide') as HTMLElement;
    if (slide) {
      const slideWidth = slide.offsetWidth + 20; // 20px gap
      const index = Math.round(scrollLeft / slideWidth);
      setCurrentIndex(Math.min(Math.max(index, 0), total - 1));
    }
  };

  useEffect(() => {
    const track = trackRef.current;
    if (!track) return;

    track.addEventListener('scroll', updateGalleryState, { passive: true });
    updateGalleryState();

    // Keyboard navigation when gallery is in view
    const handleKeyDown = (e: KeyboardEvent) => {
      const section = document.getElementById('gallery');
      if (!section) return;
      const rect = section.getBoundingClientRect();
      if (rect.top < window.innerHeight && rect.bottom > 0) {
        if (e.key === 'ArrowLeft') scroll(-1);
        if (e.key === 'ArrowRight') scroll(1);
      }
    };

    window.addEventListener('keydown', handleKeyDown);

    return () => {
      track.removeEventListener('scroll', updateGalleryState);
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [total]);

  const scroll = (direction: number) => {
    if (!trackRef.current) return;
    const slide = trackRef.current.querySelector('.gallery-slide') as HTMLElement;
    const slideWidth = slide ? slide.offsetWidth + 20 : 300;
    trackRef.current.scrollBy({ left: direction * slideWidth, behavior: 'smooth' });
  };

  return (
    <section id="gallery" className="section-card py-24 overflow-hidden">
      <div className="max-w-5xl mx-auto px-6">
        {/* Header row with title, counter & arrows */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-10">
          <div>
            <p className="text-xs tracking-[0.3em] uppercase text-accent mb-4">Visual Journey</p>
            <h2 className="font-display text-4xl font-normal mb-3">Gallery.</h2>
            <p className="text-sm opacity-60 leading-relaxed max-w-md">
              A visual record of projects, events, and milestones throughout my software development journey.
            </p>
          </div>

          <div className="flex items-center gap-4">
            {/* Slide Counter */}
            <div className="flex items-baseline gap-1 mr-4">
              <span className="font-display text-3xl text-accent font-normal">
                {String(currentIndex + 1).padStart(2, '0')}
              </span>
              <span className="text-xs opacity-30 mx-1">/</span>
              <span className="text-xs opacity-40 font-mono">{String(total).padStart(2, '0')}</span>
            </div>

            {/* Navigation Arrows */}
            <button
              onClick={() => scroll(-1)}
              disabled={currentIndex === 0}
              aria-label="Previous slide"
              className="w-10 h-10 border border-ink/20 dark:border-cream/20 flex items-center justify-center hover:border-accent hover:text-accent transition-all duration-300 disabled:opacity-20 disabled:cursor-not-allowed group"
            >
              <span className="text-sm transition-transform duration-200 group-hover:-translate-x-0.5">←</span>
            </button>
            <button
              onClick={() => scroll(1)}
              disabled={currentIndex >= total - 1}
              aria-label="Next slide"
              className="w-10 h-10 border border-ink/20 dark:border-cream/20 flex items-center justify-center hover:border-accent hover:text-accent transition-all duration-300 disabled:opacity-20 disabled:cursor-not-allowed group"
            >
              <span className="text-sm transition-transform duration-200 group-hover:translate-x-0.5">→</span>
            </button>
          </div>
        </div>

        {/* Progress Bar */}
        <div className="w-full h-[1px] bg-ink/10 dark:bg-cream/10 mb-8">
          <div
            className="h-full bg-accent transition-all duration-300 ease-out"
            style={{ width: `${progressWidth}%` }}
          />
        </div>
      </div>

      {/* Scrollable Gallery Track */}
      <div
        ref={trackRef}
        className="gallery-track flex gap-5 overflow-x-auto px-6 md:px-[calc((100vw-64rem)/2+1.5rem)] pb-6"
      >
        {galleryItems.map((item, idx) => (
          <div
            key={item.id || idx}
            className="gallery-slide flex-shrink-0 w-[85vw] sm:w-[70vw] md:w-[45vw] lg:w-[38vw]"
          >
            <div className="gallery-item group overflow-hidden border border-ink/10 dark:border-cream/10 relative font-mono">
              <div className="overflow-hidden aspect-[3/2]">
                {item.imageUrl ? (
                  <img
                    src={item.imageUrl}
                    alt={item.title}
                    onClick={() => onImageClick(item.imageUrl, item.title)}
                    className="previewable-img w-full h-full object-cover grayscale group-hover:grayscale-0 group-hover:scale-105 transition-all duration-700 ease-out cursor-zoom-in"
                  />
                ) : (
                  <div className="w-full h-full bg-ink/5 dark:bg-cream/5 flex items-center justify-center">
                    <span className="text-[10px] uppercase tracking-widest opacity-40">Gallery Image</span>
                  </div>
                )}
              </div>

              <div className="absolute inset-0 bg-gradient-to-t from-ink/70 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none flex items-end">
                <div className="p-5">
                  <p className="text-cream text-[10px] tracking-widest uppercase font-semibold">
                    Scroll to explore →
                  </p>
                </div>
              </div>
            </div>

            <div className="pt-4 flex items-start justify-between gap-4">
              <div>
                <p className="text-xs font-semibold tracking-wider uppercase mb-1">{item.title}</p>
                <p className="text-[10px] opacity-50 leading-relaxed max-w-xs">{item.description || ''}</p>
              </div>
              <span className="text-[10px] opacity-20 font-mono mt-0.5 flex-shrink-0">
                {String(idx + 1).padStart(2, '0')}
              </span>
            </div>
          </div>
        ))}
      </div>

      {/* Swipe hint on mobile */}
      <div className="px-6 mt-2 md:hidden">
        <p className="text-[10px] uppercase tracking-widest opacity-30 text-center">← Swipe to browse →</p>
      </div>
    </section>
  );
};
