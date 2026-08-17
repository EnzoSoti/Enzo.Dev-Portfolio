import React from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { useTheme } from '../../context/ThemeContext';

interface NavbarProps {
  activeSection?: string;
  onNavigateSection?: (sectionId: string) => void;
}

export const Navbar: React.FC<NavbarProps> = ({ activeSection, onNavigateSection }) => {
  const { theme, toggleTheme } = useTheme();
  const location = useLocation();
  const navigate = useNavigate();

  const navLinks = [
    { label: 'About', sectionId: 'about' },
    { label: 'Work', sectionId: 'projects' },
    { label: 'Gallery', sectionId: 'gallery' },
    { label: 'Contact', sectionId: 'contact' },
  ];

  const handleLinkClick = (e: React.MouseEvent, sectionId: string) => {
    e.preventDefault();
    if (location.pathname !== '/') {
      navigate(`/#${sectionId}`);
      return;
    }

    if (onNavigateSection) {
      onNavigateSection(sectionId);
    } else {
      const el = document.getElementById(sectionId);
      if (el) {
        el.scrollIntoView({ behavior: 'smooth' });
        window.history.pushState(null, '', `/${sectionId}`);
      }
    }
  };

  return (
    <nav className="fixed top-4 left-4 right-4 md:top-6 md:left-6 md:right-6 z-50 bg-cream/90 dark:bg-ink/90 backdrop-blur-md rounded-xl border border-ink/10 dark:border-cream/10 transition-colors duration-300">
      <div className="max-w-5xl mx-auto px-6 h-16 flex items-center justify-between">
        <a
          href="/"
          onClick={(e) => {
            e.preventDefault();
            if (location.pathname === '/') {
              window.scrollTo({ top: 0, behavior: 'smooth' });
              window.history.pushState(null, '', '/');
            } else {
              navigate('/');
            }
          }}
          className="text-xs tracking-widest uppercase font-mono font-semibold text-accent"
        >
          enzo.daniela
        </a>

        <div className="flex items-center gap-6">
          {navLinks.map((link) => (
            <a
              key={link.sectionId}
              href={`/${link.sectionId}`}
              onClick={(e) => handleLinkClick(e, link.sectionId)}
              className={`nav-link text-xs tracking-wider uppercase transition-all duration-200 hidden sm:block ${
                activeSection === link.sectionId
                  ? 'text-accent opacity-100 font-semibold'
                  : 'opacity-60 hover:opacity-100'
              }`}
            >
              {link.label}
            </a>
          ))}

          <button
            id="themeToggle"
            onClick={toggleTheme}
            className="relative w-7 h-7 flex items-center justify-center rounded-full border border-ink/20 dark:border-cream/20 hover:bg-ink/5 dark:hover:bg-cream/5 transition-colors group overflow-hidden"
            aria-label="Toggle theme"
          >
            {/* Sun Icon */}
            <svg
              id="sunIcon"
              className="w-3.5 h-3.5 absolute transition-all duration-500 transform rotate-90 scale-0 opacity-0 dark:rotate-0 dark:scale-100 dark:opacity-100 group-hover:rotate-12"
              fill="currentColor"
              viewBox="0 0 24 24"
            >
              <path d="M12 2a1 1 0 011 1v1a1 1 0 01-2 0V3a1 1 0 011-1zm0 15a5 5 0 100-10 5 5 0 000 10zm7.07-12.07a1 1 0 010 1.41l-.71.71a1 1 0 01-1.41-1.41l.71-.71a1 1 0 011.41 0zM21 11h1a1 1 0 010 2h-1a1 1 0 010-2zM4.93 4.93a1 1 0 011.41 0l.71.71a1 1 0 01-1.41 1.41l-.71-.71a1 1 0 010-1.41zM3 11h1a1 1 0 010 2H3a1 1 0 010-2zm15.36 7.07l-.71-.71a1 1 0 011.41-1.41l.71.71a1 1 0 01-1.41 1.41zM12 20a1 1 0 011 1v1a1 1 0 01-2 0v-1a1 1 0 011-1zm-7.07-1.93a1 1 0 010-1.41l.71-.71a1 1 0 011.41 1.41l-.71.71a1 1 0 01-1.41 0z" />
            </svg>

            {/* Moon Icon */}
            <svg
              id="moonIcon"
              className="w-3.5 h-3.5 absolute transition-all duration-500 transform rotate-0 scale-100 opacity-100 dark:-rotate-90 dark:scale-0 dark:opacity-0 group-hover:-rotate-12"
              fill="currentColor"
              viewBox="0 0 24 24"
            >
              <path d="M21 12.79A9 9 0 1111.21 3a7 7 0 109.79 9.79z" />
            </svg>
          </button>
        </div>
      </div>
    </nav>
  );
};
