import React from 'react';
import { Link } from 'react-router-dom';
import { CustomCursor } from '../components/common/CustomCursor';
import { useTheme } from '../context/ThemeContext';

export const NotFound: React.FC = () => {
  const { toggleTheme } = useTheme();

  return (
    <div className="bg-[#E5E1DA] dark:bg-[#080706] text-ink dark:text-cream font-mono min-h-screen flex flex-col justify-between transition-colors duration-300">
      <CustomCursor />

      {/* Nav / Branding */}
      <nav className="w-full max-w-5xl mx-auto px-6 h-16 flex items-center justify-between">
        <Link to="/" className="text-xs tracking-widest uppercase font-semibold text-accent">
          enzo.daniela
        </Link>
        <button
          onClick={toggleTheme}
          className="w-7 h-7 flex items-center justify-center rounded-full border border-ink/20 dark:border-cream/20 hover:bg-ink/5 dark:hover:bg-cream/5 transition-colors"
          aria-label="Toggle theme"
        >
          <svg className="w-3.5 h-3.5 hidden dark:block" fill="currentColor" viewBox="0 0 24 24">
            <path d="M12 2a1 1 0 011 1v1a1 1 0 01-2 0V3a1 1 0 011-1zm0 15a5 5 0 100-10 5 5 0 000 10zm7.07-12.07a1 1 0 010 1.41l-.71.71a1 1 0 01-1.41-1.41l.71-.71a1 1 0 011.41 0zM21 11h1a1 1 0 010 2h-1a1 1 0 010-2zM4.93 4.93a1 1 0 011.41 0l.71.71a1 1 0 01-1.41 1.41l-.71-.71a1 1 0 010-1.41zM3 11h1a1 1 0 010 2H3a1 1 0 010-2zm15.36 7.07l-.71-.71a1 1 0 011.41-1.41l.71.71a1 1 0 01-1.41 1.41zM12 20a1 1 0 011 1v1a1 1 0 01-2 0v-1a1 1 0 011-1zm-7.07-1.93a1 1 0 010-1.41l.71-.71a1 1 0 011.41 1.41l-.71.71a1 1 0 01-1.41 0z" />
          </svg>
          <svg className="w-3.5 h-3.5 block dark:hidden" fill="currentColor" viewBox="0 0 24 24">
            <path d="M21 12.79A9 9 0 1111.21 3a7 7 0 109.79 9.79z" />
          </svg>
        </button>
      </nav>

      {/* Main Content */}
      <main className="flex-grow flex flex-col justify-center px-6">
        <div className="max-w-5xl mx-auto w-full">
          <p className="text-xs tracking-[0.3em] uppercase text-accent mb-6 animate-fade-up">
            Error 404 — System Exception
          </p>
          <h1 className="font-display text-[clamp(4rem,15vw,10rem)] leading-none font-normal tracking-tight mb-4 animate-fade-up">
            404<span className="text-accent">.</span>
          </h1>

          <div className="flex flex-col sm:flex-row sm:items-baseline gap-6 border-b border-ink/15 dark:border-cream/15 pb-8 mb-8 animate-fade-up">
            <p className="text-sm opacity-70 max-w-sm leading-relaxed">
              The requested route does not exist or has been relocated. Check the system log or return to the main dashboard.
            </p>
            <div className="sm:ml-auto">
              <Link
                to="/"
                className="inline-block px-6 py-3 bg-ink text-cream dark:bg-cream dark:text-ink text-xs tracking-widest uppercase hover:opacity-80 transition-opacity"
              >
                Return to Portfolio →
              </Link>
            </div>
          </div>

          <div className="border border-ink/10 dark:border-cream/10 p-4 bg-ink/5 dark:bg-cream/5 rounded text-xs space-y-1 opacity-70 animate-fade-up">
            <p className="text-accent font-semibold">&gt; HTTP_STATUS: 404 Not Found</p>
            <p>&gt; ROUTE_MATCH: NULL</p>
            <p>&gt; ACTION: Redirect recommended</p>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="w-full max-w-5xl mx-auto px-6 py-6 border-t border-ink/10 dark:border-cream/10 flex flex-col sm:flex-row items-center justify-between gap-2 text-xs opacity-40">
        <p>© {new Date().getFullYear()} Enzo P. Daniela</p>
        <p>Caloocan City, Philippines</p>
      </footer>
    </div>
  );
};
