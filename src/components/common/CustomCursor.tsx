import React, { useEffect, useRef, useState } from 'react';

export const CustomCursor: React.FC = () => {
  const cursorRef = useRef<HTMLDivElement>(null);
  const dotRef = useRef<HTMLDivElement>(null);
  const [isHovered, setIsHovered] = useState(false);
  const [isDashed, setIsDashed] = useState(false);

  useEffect(() => {
    let mouseX = 0;
    let mouseY = 0;
    let posX = 0;
    let posY = 0;
    let animFrameId: number;

    const handleMouseMove = (e: MouseEvent) => {
      mouseX = e.clientX;
      mouseY = e.clientY;
      if (dotRef.current) {
        dotRef.current.style.left = `${mouseX}px`;
        dotRef.current.style.top = `${mouseY}px`;
      }
    };

    const animate = () => {
      posX += (mouseX - posX) * 0.15;
      posY += (mouseY - posY) * 0.15;
      if (cursorRef.current) {
        cursorRef.current.style.left = `${posX}px`;
        cursorRef.current.style.top = `${posY}px`;
      }
      animFrameId = requestAnimationFrame(animate);
    };

    const hoverSelector = 'a, button, input, textarea, .previewable-img, .filter-btn, #themeToggle, .tech-pill, .interactive-card';

    const handleMouseOver = (e: MouseEvent) => {
      const target = (e.target as HTMLElement)?.closest(hoverSelector);
      if (target) {
        setIsHovered(true);
        if (target.classList.contains('previewable-img') || target.id === 'themeToggle') {
          setIsDashed(true);
        } else {
          setIsDashed(false);
        }
      }
    };

    const handleMouseOut = (e: MouseEvent) => {
      const target = (e.target as HTMLElement)?.closest(hoverSelector);
      if (target) {
        setIsHovered(false);
        setIsDashed(false);
      }
    };

    window.addEventListener('mousemove', handleMouseMove, { passive: true });
    document.addEventListener('mouseover', handleMouseOver);
    document.addEventListener('mouseout', handleMouseOut);
    animate();

    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      document.removeEventListener('mouseover', handleMouseOver);
      document.removeEventListener('mouseout', handleMouseOut);
      cancelAnimationFrame(animFrameId);
    };
  }, []);

  return (
    <>
      <div
        ref={cursorRef}
        className={`hidden md:block fixed w-8 h-8 rounded-full border border-accent pointer-events-none z-[100] -translate-x-1/2 -translate-y-1/2 transition-transform duration-200 ease-out ${
          isHovered ? 'scale-150 bg-accent/10' : 'scale-100'
        } ${isDashed ? 'border-dashed' : ''}`}
      />
      <div
        ref={dotRef}
        className="hidden md:block fixed w-2 h-2 rounded-full bg-accent pointer-events-none z-[100] -translate-x-1/2 -translate-y-1/2"
      />
    </>
  );
};
