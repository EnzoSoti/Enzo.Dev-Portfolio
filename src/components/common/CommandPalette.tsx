import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { useTheme } from '../../context/ThemeContext';
import { useToast } from '../../context/ToastContext';

interface CommandPaletteProps {
  isOpen: boolean;
  onClose: () => void;
  onNavigateSection: (sectionId: string) => void;
}

interface CommandItem {
  id: string;
  label: string;
  category: 'Navigation' | 'Projects' | 'Actions' | 'System';
  shortcut?: string;
  action: () => void;
}

export const CommandPalette: React.FC<CommandPaletteProps> = ({
  isOpen,
  onClose,
  onNavigateSection,
}) => {
  const [query, setQuery] = useState('');
  const [selectedIndex, setSelectedIndex] = useState(0);
  const inputRef = useRef<HTMLInputElement>(null);
  const { toggleTheme, theme } = useTheme();
  const { showToast } = useToast();
  const navigate = useNavigate();

  const commands: CommandItem[] = [
    // Navigation
    {
      id: 'nav-about',
      label: 'Jump to About & Skills',
      category: 'Navigation',
      action: () => {
        onNavigateSection('about');
        onClose();
      },
    },
    {
      id: 'nav-experience',
      label: 'Jump to Career History & Experience',
      category: 'Navigation',
      action: () => {
        onNavigateSection('experience');
        onClose();
      },
    },
    {
      id: 'nav-projects',
      label: 'Jump to Selected Work / Projects',
      category: 'Navigation',
      action: () => {
        onNavigateSection('projects');
        onClose();
      },
    },
    {
      id: 'nav-gallery',
      label: 'Jump to Visual Gallery & Milestones',
      category: 'Navigation',
      action: () => {
        onNavigateSection('gallery');
        onClose();
      },
    },
    {
      id: 'nav-contact',
      label: 'Jump to Contact Section',
      category: 'Navigation',
      action: () => {
        onNavigateSection('contact');
        onClose();
      },
    },

    // Projects
    {
      id: 'proj-fintech',
      label: 'Launch FinTech Pro (Budget & Salary Tracker)',
      category: 'Projects',
      action: () => {
        window.open('https://sotbt.vercel.app/', '_blank');
        onClose();
      },
    },
    {
      id: 'proj-gym',
      label: 'Launch Gym Management System (Capstone)',
      category: 'Projects',
      action: () => {
        window.open('https://fitworxgymph.web.app/', '_blank');
        onClose();
      },
    },
    {
      id: 'proj-attendance',
      label: 'Launch Attendance Monitoring System (IBP)',
      category: 'Projects',
      action: () => {
        window.open('https://attendance-tracker-asean.vercel.app/', '_blank');
        onClose();
      },
    },
    {
      id: 'proj-grade',
      label: 'Launch Grade Calculator (STI)',
      category: 'Projects',
      action: () => {
        window.open('https://grade-calculator-xi.vercel.app/', '_blank');
        onClose();
      },
    },

    // Actions
    {
      id: 'act-copy-email',
      label: 'Copy Email Address (parane.enzo@gmail.com)',
      category: 'Actions',
      action: () => {
        navigator.clipboard.writeText('parane.enzo@gmail.com');
        showToast('Email copied to clipboard!', 'success');
        onClose();
      },
    },
    {
      id: 'act-download-cv',
      label: 'Download Resume PDF',
      category: 'Actions',
      action: () => {
        window.open('/doc/Enzo%20Daniela%20Resume.pdf', '_blank');
        onClose();
      },
    },
    {
      id: 'act-github',
      label: 'Open GitHub Profile (@EnzoSoti)',
      category: 'Actions',
      action: () => {
        window.open('https://github.com/EnzoSoti', '_blank');
        onClose();
      },
    },
    {
      id: 'act-linkedin',
      label: 'Open LinkedIn Profile',
      category: 'Actions',
      action: () => {
        window.open('https://www.linkedin.com/in/enzo-daniela-685374324/', '_blank');
        onClose();
      },
    },

    // System
    {
      id: 'sys-theme',
      label: `Switch to ${theme === 'dark' ? 'Light' : 'Dark'} Mode`,
      category: 'System',
      action: () => {
        toggleTheme();
        onClose();
      },
    },
    {
      id: 'sys-admin',
      label: 'Open Admin Control Room',
      category: 'System',
      shortcut: 'Ctrl+Alt+A',
      action: () => {
        navigate('/admin');
        onClose();
      },
    },
  ];

  const filteredCommands = commands.filter((c) =>
    c.label.toLowerCase().includes(query.toLowerCase()) ||
    c.category.toLowerCase().includes(query.toLowerCase())
  );

  useEffect(() => {
    if (isOpen) {
      setQuery('');
      setSelectedIndex(0);
      setTimeout(() => inputRef.current?.focus(), 50);
    }
  }, [isOpen]);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (!isOpen) return;

      if (e.key === 'ArrowDown') {
        e.preventDefault();
        setSelectedIndex((prev) => (prev + 1) % (filteredCommands.length || 1));
      } else if (e.key === 'ArrowUp') {
        e.preventDefault();
        setSelectedIndex((prev) => (prev - 1 + filteredCommands.length) % (filteredCommands.length || 1));
      } else if (e.key === 'Enter') {
        e.preventDefault();
        if (filteredCommands[selectedIndex]) {
          filteredCommands[selectedIndex].action();
        }
      } else if (e.key === 'Escape') {
        onClose();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, filteredCommands, selectedIndex, onClose]);

  if (!isOpen) return null;

  return (
    <div
      onClick={onClose}
      className="fixed inset-0 z-[160] bg-ink/80 dark:bg-black/85 backdrop-blur-md flex items-start justify-center pt-24 px-4 animate-in fade-in duration-200"
    >
      <div
        onClick={(e) => e.stopPropagation()}
        className="w-full max-w-xl bg-cream dark:bg-[#12110F] border border-ink/15 dark:border-cream/15 rounded-xl shadow-2xl overflow-hidden font-mono text-ink dark:text-cream"
      >
        {/* Search Header */}
        <div className="flex items-center px-4 border-b border-ink/10 dark:border-cream/10 h-14">
          <span className="text-accent text-sm mr-3 font-semibold">&gt;</span>
          <input
            ref={inputRef}
            type="text"
            value={query}
            onChange={(e) => {
              setQuery(e.target.value);
              setSelectedIndex(0);
            }}
            placeholder="Type a command, search projects, or jump to section..."
            className="w-full bg-transparent text-xs sm:text-sm focus:outline-none placeholder-ink/40 dark:placeholder-cream/40"
          />
          <span className="text-[10px] uppercase opacity-30 border border-ink/10 dark:border-cream/10 px-1.5 py-0.5 rounded">
            ESC
          </span>
        </div>

        {/* Results List */}
        <div className="max-h-80 overflow-y-auto p-2 divide-y divide-transparent">
          {filteredCommands.length === 0 ? (
            <div className="py-8 text-center text-xs opacity-40">No matching commands found.</div>
          ) : (
            filteredCommands.map((cmd, idx) => {
              const isSelected = idx === selectedIndex;
              return (
                <div
                  key={cmd.id}
                  onClick={cmd.action}
                  onMouseEnter={() => setSelectedIndex(idx)}
                  className={`flex items-center justify-between px-3 py-2.5 rounded-lg cursor-pointer transition-colors text-xs ${
                    isSelected
                      ? 'bg-accent text-white font-medium shadow-sm'
                      : 'hover:bg-ink/5 dark:hover:bg-cream/5'
                  }`}
                >
                  <div className="flex items-center gap-3 min-w-0">
                    <span
                      className={`text-[9px] uppercase tracking-wider px-1.5 py-0.5 rounded ${
                        isSelected
                          ? 'bg-white/20 text-white'
                          : 'border border-ink/15 dark:border-cream/15 opacity-60'
                      }`}
                    >
                      {cmd.category}
                    </span>
                    <span className="truncate">{cmd.label}</span>
                  </div>
                  {cmd.shortcut && (
                    <span
                      className={`text-[10px] font-mono opacity-50 ${
                        isSelected ? 'text-white/80' : ''
                      }`}
                    >
                      {cmd.shortcut}
                    </span>
                  )}
                </div>
              );
            })
          )}
        </div>

        {/* Footer info */}
        <div className="px-4 py-2 bg-ink/5 dark:bg-black/40 border-t border-ink/10 dark:border-cream/10 flex items-center justify-between text-[10px] opacity-40">
          <span>Navigate with ↑ ↓ • Press Enter to select</span>
          <span>Cmd + K / Ctrl + K</span>
        </div>
      </div>
    </div>
  );
};
