import React, { useEffect } from 'react';

interface ImageModalProps {
  src: string | null;
  alt?: string;
  onClose: () => void;
}

export const ImageModal: React.FC<ImageModalProps> = ({ src, alt, onClose }) => {
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };

    if (src) {
      document.body.style.overflow = 'hidden';
      window.addEventListener('keydown', handleKeyDown);
    }

    return () => {
      document.body.style.overflow = '';
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [src, onClose]);

  if (!src) return null;

  return (
    <div
      onClick={onClose}
      className="fixed inset-0 z-[150] bg-ink/90 dark:bg-black/95 backdrop-blur-sm flex items-center justify-center p-4 cursor-zoom-out animate-in fade-in duration-300"
    >
      <button
        onClick={onClose}
        aria-label="Close Preview"
        className="absolute top-6 right-6 text-cream/70 hover:text-cream text-3xl font-mono focus:outline-none z-10"
      >
        &times;
      </button>
      <img
        src={src}
        alt={alt || 'Preview'}
        onClick={(e) => e.stopPropagation()}
        className="max-w-full max-h-[90vh] object-contain select-none shadow-2xl transition-transform duration-300 rounded-sm"
      />
    </div>
  );
};
