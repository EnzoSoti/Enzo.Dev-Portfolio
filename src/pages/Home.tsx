import React, { useEffect, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { PortfolioConfig, Project, Experience, GalleryItem } from '../types';
import {
  DEFAULT_CONFIG,
  DEFAULT_PROJECTS,
  DEFAULT_EXPERIENCES,
  DEFAULT_GALLERY,
} from '../services/mockData';
import { api } from '../services/api';
import { Navbar } from '../components/common/Navbar';
import { Footer } from '../components/common/Footer';
import { ScrollProgress } from '../components/common/ScrollProgress';
import { BackToTop } from '../components/common/BackToTop';
import { CustomCursor } from '../components/common/CustomCursor';
import { ImageModal } from '../components/common/ImageModal';
import { Hero } from '../components/hero/Hero';
import { About } from '../components/about/About';
import { Experience as ExperienceSection } from '../components/experience/Experience';
import { Projects } from '../components/projects/Projects';
import { Testimonials } from '../components/testimonials/Testimonials';
import { Gallery } from '../components/gallery/Gallery';
import { Contact } from '../components/contact/Contact';

export const Home: React.FC = () => {
  const location = useLocation();
  const navigate = useNavigate();

  const [config, setConfig] = useState<PortfolioConfig>(DEFAULT_CONFIG);
  const [projects, setProjects] = useState<Project[]>(DEFAULT_PROJECTS);
  const [experiences, setExperiences] = useState<Experience[]>(DEFAULT_EXPERIENCES);
  const [gallery, setGallery] = useState<GalleryItem[]>(DEFAULT_GALLERY);

  const [activeSection, setActiveSection] = useState<string>('');
  const [modalImage, setModalImage] = useState<{ src: string; alt: string } | null>(null);

  // Fetch portfolio data
  useEffect(() => {
    api.getPortfolio().then((data) => {
      setConfig(data.config);
      setProjects(data.projects);
      setExperiences(data.experiences);
      setGallery(data.gallery);
    });
  }, []);

  // Clean URL initial scrolling
  useEffect(() => {
    const path = location.pathname.replace('/', '').trim();
    if (path) {
      setTimeout(() => {
        const el = document.getElementById(path);
        if (el) {
          el.scrollIntoView({ behavior: 'smooth' });
          setActiveSection(path);
        }
      }, 150);
    }
  }, [location.pathname]);

  // Scrollspy to update URL based on active visible section
  useEffect(() => {
    const sections = ['about', 'experience', 'projects', 'testimonials', 'gallery', 'contact'];
    let timer: any = null;

    const handleScroll = () => {
      clearTimeout(timer);
      timer = setTimeout(() => {
        let current = '';
        for (const id of sections) {
          const el = document.getElementById(id);
          if (el) {
            const rect = el.getBoundingClientRect();
            if (rect.top <= 200 && rect.bottom > 200) {
              current = id;
              break;
            }
          }
        }

        setActiveSection(current);
        const currentPath = window.location.pathname.replace('/', '');
        if (current && current !== currentPath) {
          window.history.replaceState(null, '', `/${current}`);
        } else if (!current && currentPath && window.scrollY < 200) {
          window.history.replaceState(null, '', '/');
        }
      }, 100);
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => {
      clearTimeout(timer);
      window.removeEventListener('scroll', handleScroll);
    };
  }, []);

  // Admin shortcut: Ctrl + Alt + A
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.ctrlKey && e.altKey && e.key.toLowerCase() === 'a') {
        e.preventDefault();
        navigate('/admin');
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [navigate]);

  const handleOpenImageModal = (src: string, alt: string) => {
    setModalImage({ src, alt });
  };

  const handleNavigateSection = (sectionId: string) => {
    const el = document.getElementById(sectionId);
    if (el) {
      el.scrollIntoView({ behavior: 'smooth' });
      window.history.pushState(null, '', `/${sectionId}`);
      setActiveSection(sectionId);
    }
  };

  return (
    <div className="bg-[#E5E1DA] dark:bg-[#080706] text-ink dark:text-cream min-h-screen transition-colors duration-300 font-mono relative selection:bg-accent selection:text-white">
      <ScrollProgress />
      <CustomCursor />
      <Navbar activeSection={activeSection} onNavigateSection={handleNavigateSection} />

      <main>
        <Hero config={config} />
        <About config={config} onImageClick={handleOpenImageModal} />
        <ExperienceSection experiences={experiences} onImageClick={handleOpenImageModal} />
        <Projects projects={projects} onImageClick={handleOpenImageModal} />
        <Testimonials />
        <Gallery galleryItems={gallery} onImageClick={handleOpenImageModal} />
        <Contact config={config} />
      </main>

      <Footer />
      <BackToTop />
      <ImageModal
        src={modalImage?.src || null}
        alt={modalImage?.alt}
        onClose={() => setModalImage(null)}
      />
    </div>
  );
};
