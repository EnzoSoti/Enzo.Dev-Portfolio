import React, { useEffect, useState } from 'react';

export const BackToTop: React.FC = () => {
  const [visible, setVisible] = useState(false);
  const [scrollProgress, setScrollProgress] = useState(0);

  useEffect(() => {
    const handleScroll = () => {
      const winScroll = document.documentElement.scrollTop || document.body.scrollTop;
      const height = document.documentElement.scrollHeight - document.documentElement.clientHeight;
      const scrolled = height > 0 ? (winScroll / height) * 100 : 0;

      setScrollProgress(scrolled);
      setVisible(winScroll > 300);
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <button
      id="backToTop"
      onClick={scrollToTop}
      aria-label="Back to top"
      className={`fixed bottom-6 right-6 z-40 w-10 h-10 rounded-full border border-ink/10 dark:border-cream/10 bg-cream/90 dark:bg-ink/90 backdrop-blur-sm flex items-center justify-center text-ink dark:text-cream shadow-md transition-all duration-300 hover:border-accent hover:text-accent group ${
        visible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4 pointer-events-none'
      }`}
    >
      <svg className="w-10 h-10 absolute inset-0 -rotate-90" viewBox="0 0 36 36">
        <path
          className="text-ink/5 dark:text-cream/5"
          stroke="currentColor"
          strokeWidth="2"
          fill="none"
          d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
        />
        <path
          className="text-accent transition-all duration-100"
          stroke="currentColor"
          strokeWidth="2"
          strokeDasharray={`${scrollProgress}, 100`}
          fill="none"
          d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
        />
      </svg>
      <span className="text-sm transition-transform duration-300 group-hover:-translate-y-0.5">↑</span>
    </button>
  );
};
