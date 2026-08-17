import React from 'react';
import { Link } from 'react-router-dom';

export const Footer: React.FC = () => {
  return (
    <footer className="section-card--footer py-6 px-6">
      <div className="max-w-5xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-2">
        <p className="text-xs opacity-30">
          <Link
            to="/admin"
            className="hover:text-accent transition-colors duration-200"
            title="EPD Control Room"
          >
            ©
          </Link>{' '}
          {new Date().getFullYear()} Enzo P. Daniela
        </p>
        <p className="text-xs opacity-30">Caloocan City, Philippines</p>
        <p className="text-xs opacity-30">Built with React & Tailwind CSS</p>
      </div>
    </footer>
  );
};
