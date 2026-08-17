import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  PortfolioConfig,
  Project,
  Experience,
  GalleryItem,
  ContactMessage,
} from '../types';
import {
  DEFAULT_CONFIG,
  DEFAULT_PROJECTS,
  DEFAULT_EXPERIENCES,
  DEFAULT_GALLERY,
} from '../services/mockData';
import { api } from '../services/api';
import { useToast } from '../context/ToastContext';

export const AdminDashboard: React.FC = () => {
  const navigate = useNavigate();
  const { showToast } = useToast();

  const [activeTab, setActiveTab] = useState<
    'general' | 'projects' | 'experience' | 'gallery' | 'contacts' | 'settings'
  >('general');

  // Data state
  const [config, setConfig] = useState<PortfolioConfig>(DEFAULT_CONFIG);
  const [projects, setProjects] = useState<Project[]>(DEFAULT_PROJECTS);
  const [experiences, setExperiences] = useState<Experience[]>(DEFAULT_EXPERIENCES);
  const [gallery, setGallery] = useState<GalleryItem[]>(DEFAULT_GALLERY);
  const [contacts, setContacts] = useState<ContactMessage[]>([]);
  const [loading, setLoading] = useState(true);

  // Modals state
  const [editingProject, setEditingProject] = useState<Project | null>(null);
  const [isProjectModalOpen, setIsProjectModalOpen] = useState(false);

  const [editingExperience, setEditingExperience] = useState<Experience | null>(null);
  const [isExpModalOpen, setIsExpModalOpen] = useState(false);
  const [expBulletsText, setExpBulletsText] = useState('');

  const [editingGalleryItem, setEditingGalleryItem] = useState<GalleryItem | null>(null);
  const [isGalleryModalOpen, setIsGalleryModalOpen] = useState(false);

  const [confirmDialog, setConfirmDialog] = useState<{
    isOpen: boolean;
    title: string;
    message: string;
    onConfirm: () => void;
  }>({ isOpen: false, title: '', message: '', onConfirm: () => {} });

  // Auth guard & initial fetch
  useEffect(() => {
    const token = localStorage.getItem('adminToken');
    if (!token) {
      navigate('/admin');
      return;
    }

    api.getPortfolio()
      .then((data) => {
        setConfig(data.config);
        setProjects(data.projects);
        setExperiences(data.experiences);
        setGallery(data.gallery);
      })
      .finally(() => setLoading(false));
  }, [navigate]);

  const handleLogout = () => {
    localStorage.removeItem('adminToken');
    navigate('/admin');
  };

  const handleSaveConfig = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await api.updateConfig(config);
      showToast('Configuration updated successfully', 'success');
    } catch (err: any) {
      showToast(err.message || 'Failed to save configuration', 'error');
    }
  };

  const handleProfileImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    try {
      showToast('Uploading profile image...', 'info');
      const url = await api.uploadProfileImage(file);
      setConfig((prev) => ({ ...prev, profileImg: url }));
      showToast('Profile image uploaded', 'success');
    } catch (err: any) {
      showToast('Failed to upload image', 'error');
    }
  };

  // ─── Project Handlers ──────────────────────────────────────────
  const openNewProjectModal = () => {
    setEditingProject({
      id: '',
      title: '',
      description: '',
      imageUrl: '',
      liveUrl: '',
      githubUrl: '',
      tags: '',
      category: 'node',
      badge: '',
      sortOrder: projects.length + 1,
      featured: false,
    });
    setIsProjectModalOpen(true);
  };

  const openEditProjectModal = (proj: Project) => {
    setEditingProject({ ...proj });
    setIsProjectModalOpen(true);
  };

  const handleSaveProject = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingProject) return;

    try {
      const saved = await api.saveProject(editingProject, editingProject.id || undefined);
      if (editingProject.id) {
        setProjects((prev) => prev.map((p) => (p.id === editingProject.id ? saved : p)));
        showToast('Project updated', 'success');
      } else {
        setProjects((prev) => [...prev, saved]);
        showToast('Project created', 'success');
      }
      setIsProjectModalOpen(false);
    } catch (err: any) {
      showToast('Failed to save project', 'error');
    }
  };

  const handleDeleteProject = (id: string) => {
    setConfirmDialog({
      isOpen: true,
      title: 'Delete Project',
      message: 'Are you sure you want to delete this project? This action cannot be undone.',
      onConfirm: async () => {
        try {
          await api.deleteProject(id);
          setProjects((prev) => prev.filter((p) => p.id !== id));
          showToast('Project deleted', 'success');
        } catch {
          showToast('Failed to delete project', 'error');
        }
        setConfirmDialog((prev) => ({ ...prev, isOpen: false }));
      },
    });
  };

  // ─── Experience Handlers ───────────────────────────────────────
  const openNewExpModal = () => {
    setEditingExperience({
      id: '',
      role: '',
      company: '',
      period: '',
      logoUrl: '',
      bullets: '[]',
      sortOrder: experiences.length + 1,
    });
    setExpBulletsText('');
    setIsExpModalOpen(true);
  };

  const openEditExpModal = (exp: Experience) => {
    setEditingExperience({ ...exp });
    let bulletsArr: string[] = [];
    try {
      bulletsArr = Array.isArray(exp.bullets) ? exp.bullets : JSON.parse(exp.bullets || '[]');
    } catch {
      bulletsArr = [];
    }
    setExpBulletsText(bulletsArr.join('\n'));
    setIsExpModalOpen(true);
  };

  const handleSaveExperience = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingExperience) return;

    const bullets = expBulletsText
      .split('\n')
      .map((b) => b.trim())
      .filter(Boolean);

    const payload = {
      ...editingExperience,
      bullets: JSON.stringify(bullets),
    };

    try {
      const saved = await api.saveExperience(payload, editingExperience.id || undefined);
      if (editingExperience.id) {
        setExperiences((prev) => prev.map((ex) => (ex.id === editingExperience.id ? saved : ex)));
        showToast('Experience updated', 'success');
      } else {
        setExperiences((prev) => [...prev, saved]);
        showToast('Experience created', 'success');
      }
      setIsExpModalOpen(false);
    } catch {
      showToast('Failed to save experience', 'error');
    }
  };

  const handleDeleteExperience = (id: string) => {
    setConfirmDialog({
      isOpen: true,
      title: 'Delete Experience',
      message: 'Are you sure you want to delete this experience entry? This cannot be undone.',
      onConfirm: async () => {
        try {
          await api.deleteExperience(id);
          setExperiences((prev) => prev.filter((e) => e.id !== id));
          showToast('Experience deleted', 'success');
        } catch {
          showToast('Failed to delete experience', 'error');
        }
        setConfirmDialog((prev) => ({ ...prev, isOpen: false }));
      },
    });
  };

  // ─── Gallery Handlers ──────────────────────────────────────────
  const openNewGalleryModal = () => {
    setEditingGalleryItem({
      id: '',
      title: '',
      description: '',
      imageUrl: '',
      sortOrder: gallery.length + 1,
    });
    setIsGalleryModalOpen(true);
  };

  const openEditGalleryModal = (item: GalleryItem) => {
    setEditingGalleryItem({ ...item });
    setIsGalleryModalOpen(true);
  };

  const handleSaveGalleryItem = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingGalleryItem) return;

    try {
      const saved = await api.saveGalleryItem(
        editingGalleryItem,
        editingGalleryItem.id || undefined
      );
      if (editingGalleryItem.id) {
        setGallery((prev) => prev.map((g) => (g.id === editingGalleryItem.id ? saved : g)));
        showToast('Gallery item updated', 'success');
      } else {
        setGallery((prev) => [...prev, saved]);
        showToast('Gallery item created', 'success');
      }
      setIsGalleryModalOpen(false);
    } catch {
      showToast('Failed to save gallery item', 'error');
    }
  };

  const handleDeleteGallery = (id: string) => {
    setConfirmDialog({
      isOpen: true,
      title: 'Delete Gallery Item',
      message: 'Are you sure you want to delete this gallery photo? This cannot be undone.',
      onConfirm: async () => {
        try {
          await api.deleteGalleryItem(id);
          setGallery((prev) => prev.filter((g) => g.id !== id));
          showToast('Gallery item deleted', 'success');
        } catch {
          showToast('Failed to delete gallery item', 'error');
        }
        setConfirmDialog((prev) => ({ ...prev, isOpen: false }));
      },
    });
  };

  // ─── Contacts & Settings ───────────────────────────────────────
  const loadContacts = async () => {
    try {
      const list = await api.getContacts();
      setContacts(list);
    } catch {
      showToast('Failed to load contact inquiries', 'error');
    }
  };

  useEffect(() => {
    if (activeTab === 'contacts') {
      loadContacts();
    }
  }, [activeTab]);

  const handleResetDefaults = () => {
    setConfirmDialog({
      isOpen: true,
      title: 'Restore Database Defaults',
      message:
        'Are you sure you want to restore the database to default values? This will overwrite all custom configurations, projects, and experiences with the default Capstone state.',
      onConfirm: async () => {
        try {
          await api.resetPortfolio();
          showToast('Database restored to default values.', 'success');
          setTimeout(() => window.location.reload(), 1000);
        } catch {
          showToast('Reset failed', 'error');
        }
        setConfirmDialog((prev) => ({ ...prev, isOpen: false }));
      },
    });
  };

  return (
    <div className="min-h-screen bg-[#0F0E0C] grid-bg font-mono text-cream selection:bg-accent selection:text-white">
      {/* Top Navbar */}
      <nav className="fixed top-0 left-0 right-0 z-50 bg-[#0F0E0C]/95 backdrop-blur-sm border-b border-cream/5">
        <div className="max-w-6xl mx-auto px-6 h-12 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <span className="text-accent text-xs tracking-[0.3em] uppercase font-semibold">EPD</span>
            <span className="text-cream/20">|</span>
            <span className="text-xs tracking-wider opacity-40">Control Room (React)</span>
          </div>
          <div className="flex items-center gap-4">
            <a
              href="/"
              target="_blank"
              rel="noopener noreferrer"
              className="text-[10px] uppercase tracking-wider opacity-40 hover:opacity-100 hover:text-accent transition-all"
            >
              View Site ↗
            </a>
            <button
              onClick={handleLogout}
              className="text-[10px] uppercase tracking-wider text-red-400/60 hover:text-red-400 transition-colors"
            >
              Logout
            </button>
          </div>
        </div>
      </nav>

      {/* Main Container */}
      <div className="max-w-6xl mx-auto px-6 pt-20 pb-12">
        {/* Header */}
        <div className="mb-8">
          <p className="text-[10px] tracking-[0.3em] uppercase text-accent mb-2">Admin Dashboard</p>
          <h1 className="font-display text-3xl font-normal">Control Room.</h1>
        </div>

        {/* Tab Navigation */}
        <div className="flex gap-0 border-b border-cream/5 mb-8 overflow-x-auto">
          {[
            { id: 'general', label: 'General' },
            { id: 'projects', label: 'Projects' },
            { id: 'experience', label: 'Experience' },
            { id: 'gallery', label: 'Gallery' },
            { id: 'contacts', label: 'Messages' },
            { id: 'settings', label: 'Settings' },
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as any)}
              className={`px-5 py-3 text-[10px] uppercase tracking-[0.15em] transition-all whitespace-nowrap ${
                activeTab === tab.id
                  ? 'border-b-2 border-accent text-accent opacity-100'
                  : 'opacity-60 hover:opacity-100'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {/* ─── TAB: GENERAL ────────────────────────────────────────── */}
        {activeTab === 'general' && (
          <div className="animate-fade-up">
            <form onSubmit={handleSaveConfig} className="space-y-8">
              {/* Hero Section Card */}
              <div className="glass rounded-sm p-6 space-y-4">
                <h3 className="text-xs uppercase tracking-widest text-accent font-semibold mb-4">
                  Hero Section
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="text-[10px] uppercase tracking-widest opacity-40 block mb-1">
                      Hero Label
                    </label>
                    <input
                      type="text"
                      value={config.heroLabel}
                      onChange={(e) => setConfig({ ...config, heroLabel: e.target.value })}
                      className="field-input text-sm w-full bg-transparent border-b border-cream/10 py-1 text-cream outline-none focus:border-accent"
                    />
                  </div>
                  <div>
                    <label className="text-[10px] uppercase tracking-widest opacity-40 block mb-1">
                      First Name
                    </label>
                    <input
                      type="text"
                      value={config.heroName1}
                      onChange={(e) => setConfig({ ...config, heroName1: e.target.value })}
                      className="field-input text-sm w-full bg-transparent border-b border-cream/10 py-1 text-cream outline-none focus:border-accent"
                    />
                  </div>
                  <div>
                    <label className="text-[10px] uppercase tracking-widest opacity-40 block mb-1">
                      Last Name (Accent)
                    </label>
                    <input
                      type="text"
                      value={config.heroName2}
                      onChange={(e) => setConfig({ ...config, heroName2: e.target.value })}
                      className="field-input text-sm w-full bg-transparent border-b border-cream/10 py-1 text-cream outline-none focus:border-accent"
                    />
                  </div>
                  <div>
                    <label className="text-[10px] uppercase tracking-widest opacity-40 block mb-1">
                      Email
                    </label>
                    <input
                      type="email"
                      value={config.email}
                      onChange={(e) => setConfig({ ...config, email: e.target.value })}
                      className="field-input text-sm w-full bg-transparent border-b border-cream/10 py-1 text-cream outline-none focus:border-accent"
                    />
                  </div>
                </div>
                <div>
                  <label className="text-[10px] uppercase tracking-widest opacity-40 block mb-1">
                    Tagline
                  </label>
                  <textarea
                    rows={2}
                    value={config.heroTagline}
                    onChange={(e) => setConfig({ ...config, heroTagline: e.target.value })}
                    className="field-input text-sm w-full bg-transparent border-b border-cream/10 py-1 text-cream outline-none focus:border-accent resize-none"
                  />
                </div>
              </div>

              {/* About & Education Card */}
              <div className="glass rounded-sm p-6 space-y-4">
                <h3 className="text-xs uppercase tracking-widest text-accent font-semibold mb-4">
                  About & Bio
                </h3>
                <div>
                  <label className="text-[10px] uppercase tracking-widest opacity-40 block mb-1">
                    Headline Title
                  </label>
                  <input
                    type="text"
                    value={config.aboutTitle}
                    onChange={(e) => setConfig({ ...config, aboutTitle: e.target.value })}
                    className="field-input text-sm w-full bg-transparent border-b border-cream/10 py-1 text-cream outline-none focus:border-accent"
                  />
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="text-[10px] uppercase tracking-widest opacity-40 block mb-1">
                      Paragraph 1
                    </label>
                    <textarea
                      rows={3}
                      value={config.aboutText1}
                      onChange={(e) => setConfig({ ...config, aboutText1: e.target.value })}
                      className="field-input text-sm w-full bg-transparent border-b border-cream/10 py-1 text-cream outline-none focus:border-accent resize-none"
                    />
                  </div>
                  <div>
                    <label className="text-[10px] uppercase tracking-widest opacity-40 block mb-1">
                      Paragraph 2
                    </label>
                    <textarea
                      rows={3}
                      value={config.aboutText2}
                      onChange={(e) => setConfig({ ...config, aboutText2: e.target.value })}
                      className="field-input text-sm w-full bg-transparent border-b border-cream/10 py-1 text-cream outline-none focus:border-accent resize-none"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4 pt-4 border-t border-cream/5">
                  <div>
                    <label className="text-[10px] uppercase tracking-widest opacity-40 block mb-1">
                      Photo Badge
                    </label>
                    <input
                      type="text"
                      value={config.badgeText}
                      onChange={(e) => setConfig({ ...config, badgeText: e.target.value })}
                      className="field-input text-xs w-full bg-transparent border-b border-cream/10 py-1 text-cream outline-none focus:border-accent"
                    />
                  </div>
                  <div>
                    <label className="text-[10px] uppercase tracking-widest opacity-40 block mb-1">
                      School
                    </label>
                    <input
                      type="text"
                      value={config.school}
                      onChange={(e) => setConfig({ ...config, school: e.target.value })}
                      className="field-input text-xs w-full bg-transparent border-b border-cream/10 py-1 text-cream outline-none focus:border-accent"
                    />
                  </div>
                  <div>
                    <label className="text-[10px] uppercase tracking-widest opacity-40 block mb-1">
                      Course
                    </label>
                    <input
                      type="text"
                      value={config.course}
                      onChange={(e) => setConfig({ ...config, course: e.target.value })}
                      className="field-input text-xs w-full bg-transparent border-b border-cream/10 py-1 text-cream outline-none focus:border-accent"
                    />
                  </div>
                  <div>
                    <label className="text-[10px] uppercase tracking-widest opacity-40 block mb-1">
                      Graduated
                    </label>
                    <input
                      type="text"
                      value={config.graduated}
                      onChange={(e) => setConfig({ ...config, graduated: e.target.value })}
                      className="field-input text-xs w-full bg-transparent border-b border-cream/10 py-1 text-cream outline-none focus:border-accent"
                    />
                  </div>
                </div>

                {/* Profile Image & Upload */}
                <div className="pt-4 border-t border-cream/5 flex items-center gap-6">
                  <img
                    src={config.profileImg || '/image/gradpic.jpg'}
                    alt="Preview"
                    className="w-16 h-16 rounded object-cover border border-cream/10 grayscale"
                  />
                  <div>
                    <p className="text-xs uppercase tracking-wider mb-2 font-semibold">
                      Profile Image
                    </p>
                    <label className="cursor-pointer px-4 py-2 bg-cream/10 hover:bg-cream/20 text-xs tracking-widest uppercase transition-colors rounded-sm inline-block">
                      Upload New Image
                      <input
                        type="file"
                        accept="image/*"
                        onChange={handleProfileImageUpload}
                        className="hidden"
                      />
                    </label>
                  </div>
                </div>
              </div>

              <button
                type="submit"
                className="px-6 py-3 bg-accent text-cream text-xs tracking-[0.2em] uppercase hover:opacity-90 transition-all"
              >
                Save Configuration
              </button>
            </form>
          </div>
        )}

        {/* ─── TAB: PROJECTS ───────────────────────────────────────── */}
        {activeTab === 'projects' && (
          <div className="animate-fade-up space-y-6">
            <div className="flex justify-between items-center">
              <p className="text-xs opacity-60">Manage your portfolio projects showcase.</p>
              <button
                onClick={openNewProjectModal}
                className="px-4 py-2 bg-accent text-cream text-xs tracking-wider uppercase hover:opacity-90 transition-opacity"
              >
                + Add Project
              </button>
            </div>

            <div className="space-y-3">
              {projects.map((p) => (
                <div
                  key={p.id}
                  className="glass rounded-sm p-5 flex items-center justify-between gap-4"
                >
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-3 mb-1">
                      <h4 className="text-sm font-semibold truncate">{p.title}</h4>
                      {p.featured && (
                        <span className="px-1.5 py-0.5 bg-accent/20 text-accent text-[9px] uppercase tracking-wider rounded-sm">
                          Featured
                        </span>
                      )}
                      {p.badge && (
                        <span className="px-1.5 py-0.5 border border-accent/30 text-accent text-[9px] uppercase tracking-wider rounded-sm">
                          {p.badge}
                        </span>
                      )}
                    </div>
                    <p className="text-[11px] opacity-40 truncate">{p.description}</p>
                    <div className="flex gap-1.5 mt-2">
                      {p.tags
                        .split(',')
                        .filter(Boolean)
                        .map((t, idx) => (
                          <span
                            key={idx}
                            className="px-1.5 py-0.5 border border-cream/10 text-[9px] opacity-50 rounded-sm"
                          >
                            {t.trim()}
                          </span>
                        ))}
                    </div>
                  </div>
                  <div className="flex gap-2 flex-shrink-0">
                    <button
                      onClick={() => openEditProjectModal(p)}
                      className="px-3 py-1.5 border border-cream/10 text-[10px] uppercase tracking-wider opacity-50 hover:opacity-100 hover:border-accent hover:text-accent transition-all"
                    >
                      Edit
                    </button>
                    <button
                      onClick={() => handleDeleteProject(p.id)}
                      className="px-3 py-1.5 border border-red-500/20 text-red-400/50 text-[10px] uppercase tracking-wider hover:border-red-500/60 hover:text-red-400 transition-all"
                    >
                      Delete
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* ─── TAB: EXPERIENCE ─────────────────────────────────────── */}
        {activeTab === 'experience' && (
          <div className="animate-fade-up space-y-6">
            <div className="flex justify-between items-center">
              <p className="text-xs opacity-60">Manage your history, internships, and education.</p>
              <button
                onClick={openNewExpModal}
                className="px-4 py-2 bg-accent text-cream text-xs tracking-wider uppercase hover:opacity-90 transition-opacity"
              >
                + Add Experience
              </button>
            </div>

            <div className="space-y-3">
              {experiences.map((exp) => {
                let bulletsArr = [];
                try {
                  bulletsArr = Array.isArray(exp.bullets) ? exp.bullets : JSON.parse(exp.bullets || '[]');
                } catch {
                  bulletsArr = [];
                }
                return (
                  <div
                    key={exp.id}
                    className="glass rounded-sm p-5 flex items-center justify-between gap-4"
                  >
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-3 mb-1">
                        <h4 className="text-sm font-semibold truncate">{exp.company}</h4>
                        <span className="text-[10px] opacity-30 font-mono">{exp.period}</span>
                      </div>
                      <p className="text-[11px] opacity-50">{exp.role}</p>
                      <p className="text-[10px] opacity-30 mt-1">
                        {bulletsArr.length} bullet point{bulletsArr.length !== 1 ? 's' : ''}
                      </p>
                    </div>
                    <div className="flex gap-2 flex-shrink-0">
                      <button
                        onClick={() => openEditExpModal(exp)}
                        className="px-3 py-1.5 border border-cream/10 text-[10px] uppercase tracking-wider opacity-50 hover:opacity-100 hover:border-accent hover:text-accent transition-all"
                      >
                        Edit
                      </button>
                      <button
                        onClick={() => handleDeleteExperience(exp.id)}
                        className="px-3 py-1.5 border border-red-500/20 text-red-400/50 text-[10px] uppercase tracking-wider hover:border-red-500/60 hover:text-red-400 transition-all"
                      >
                        Delete
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* ─── TAB: GALLERY ────────────────────────────────────────── */}
        {activeTab === 'gallery' && (
          <div className="animate-fade-up space-y-6">
            <div className="flex justify-between items-center">
              <p className="text-xs opacity-60">Manage your visual journey photos and milestones.</p>
              <button
                onClick={openNewGalleryModal}
                className="px-4 py-2 bg-accent text-cream text-xs tracking-wider uppercase hover:opacity-90 transition-opacity"
              >
                + Add Photo
              </button>
            </div>

            <div className="space-y-3">
              {gallery.map((item) => (
                <div
                  key={item.id}
                  className="glass rounded-sm p-5 flex items-center justify-between gap-4"
                >
                  <div className="flex items-center gap-4 min-w-0 flex-1">
                    {item.imageUrl ? (
                      <img
                        src={item.imageUrl}
                        alt={item.title}
                        className="w-12 h-12 object-cover rounded border border-cream/10 grayscale"
                      />
                    ) : (
                      <div className="w-12 h-12 bg-accent/10 flex items-center justify-center text-accent text-[10px] uppercase font-semibold tracking-wider rounded">
                        IMG
                      </div>
                    )}
                    <div className="min-w-0 flex-1">
                      <div className="flex items-center gap-3 mb-1">
                        <h4 className="text-sm font-semibold truncate text-cream">{item.title}</h4>
                        <span className="text-[10px] opacity-30 font-mono">
                          Order: {item.sortOrder || 0}
                        </span>
                      </div>
                      <p className="text-[11px] opacity-50 truncate">{item.description || ''}</p>
                    </div>
                  </div>

                  <div className="flex gap-2 flex-shrink-0">
                    <button
                      onClick={() => openEditGalleryModal(item)}
                      className="px-3 py-1.5 border border-cream/10 text-[10px] uppercase tracking-wider opacity-50 hover:opacity-100 hover:border-accent hover:text-accent transition-all"
                    >
                      Edit
                    </button>
                    <button
                      onClick={() => handleDeleteGallery(item.id)}
                      className="px-3 py-1.5 border border-red-500/20 text-red-400/50 text-[10px] uppercase tracking-wider hover:border-red-500/60 hover:text-red-400 transition-all"
                    >
                      Delete
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* ─── TAB: MESSAGES (CONTACTS) ────────────────────────────── */}
        {activeTab === 'contacts' && (
          <div className="animate-fade-up space-y-4">
            <p className="text-xs opacity-60">Inquiries received from the portfolio contact form.</p>
            {contacts.length === 0 ? (
              <p className="text-xs opacity-30 py-8 text-center">No contact inquiries yet.</p>
            ) : (
              contacts.map((c) => (
                <div key={c.id} className="glass rounded-sm p-5">
                  <div className="flex items-start justify-between gap-4 mb-3">
                    <div>
                      <h4 className="text-sm font-semibold">{c.name}</h4>
                      <a href={`mailto:${c.email}`} className="text-[11px] text-accent hover:underline">
                        {c.email}
                      </a>
                    </div>
                    <span className="text-[10px] opacity-30 font-mono">
                      {new Date(c.createdAt).toLocaleDateString('en-US', {
                        month: 'short',
                        day: 'numeric',
                        year: 'numeric',
                      })}
                    </span>
                  </div>
                  <p className="text-xs opacity-60 leading-relaxed border-t border-cream/5 pt-3">
                    {c.message}
                  </p>
                </div>
              ))
            )}
          </div>
        )}

        {/* ─── TAB: SETTINGS ───────────────────────────────────────── */}
        {activeTab === 'settings' && (
          <div className="animate-fade-up space-y-6">
            <div className="glass rounded-sm p-6 space-y-4">
              <h3 className="text-xs uppercase tracking-widest text-accent font-semibold">
                Database Management
              </h3>
              <p className="text-xs opacity-60 leading-relaxed">
                Restore database configurations and items back to default values. Useful for resetting test data.
              </p>
              <button
                onClick={handleResetDefaults}
                className="px-4 py-2 border border-red-500/40 text-red-400 hover:bg-red-500/10 text-xs tracking-wider uppercase transition-colors"
              >
                Restore Default Values
              </button>
            </div>
          </div>
        )}
      </div>

      {/* ─── PROJECT MODAL ─────────────────────────────────────────── */}
      {isProjectModalOpen && editingProject && (
        <div className="fixed inset-0 z-[100] bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="glass bg-[#0F0E0C] border border-cream/10 rounded-sm p-6 max-w-lg w-full max-h-[90vh] overflow-y-auto">
            <div className="flex justify-between items-center mb-6">
              <h3 className="text-sm uppercase tracking-widest font-semibold text-accent">
                {editingProject.id ? 'Edit Project' : 'New Project'}
              </h3>
              <button
                onClick={() => setIsProjectModalOpen(false)}
                className="text-lg opacity-60 hover:opacity-100"
              >
                &times;
              </button>
            </div>

            <form onSubmit={handleSaveProject} className="space-y-4">
              <div>
                <label className="text-[10px] uppercase opacity-40 block mb-1">Title</label>
                <input
                  type="text"
                  required
                  value={editingProject.title}
                  onChange={(e) => setEditingProject({ ...editingProject, title: e.target.value })}
                  className="w-full bg-transparent border-b border-cream/10 py-1 text-sm focus:outline-none focus:border-accent text-cream"
                />
              </div>

              <div>
                <label className="text-[10px] uppercase opacity-40 block mb-1">Description</label>
                <textarea
                  rows={2}
                  required
                  value={editingProject.description}
                  onChange={(e) => setEditingProject({ ...editingProject, description: e.target.value })}
                  className="w-full bg-transparent border-b border-cream/10 py-1 text-sm focus:outline-none focus:border-accent text-cream resize-none"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-[10px] uppercase opacity-40 block mb-1">Live Demo URL</label>
                  <input
                    type="text"
                    value={editingProject.liveUrl || ''}
                    onChange={(e) => setEditingProject({ ...editingProject, liveUrl: e.target.value })}
                    className="w-full bg-transparent border-b border-cream/10 py-1 text-xs focus:outline-none focus:border-accent text-cream"
                  />
                </div>
                <div>
                  <label className="text-[10px] uppercase opacity-40 block mb-1">GitHub URL</label>
                  <input
                    type="text"
                    value={editingProject.githubUrl || ''}
                    onChange={(e) => setEditingProject({ ...editingProject, githubUrl: e.target.value })}
                    className="w-full bg-transparent border-b border-cream/10 py-1 text-xs focus:outline-none focus:border-accent text-cream"
                  />
                </div>
              </div>

              <div>
                <label className="text-[10px] uppercase opacity-40 block mb-1">Image URL</label>
                <input
                  type="text"
                  value={editingProject.imageUrl || ''}
                  onChange={(e) => setEditingProject({ ...editingProject, imageUrl: e.target.value })}
                  className="w-full bg-transparent border-b border-cream/10 py-1 text-xs focus:outline-none focus:border-accent text-cream"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-[10px] uppercase opacity-40 block mb-1">Category (e.g. node database)</label>
                  <input
                    type="text"
                    value={editingProject.category || ''}
                    onChange={(e) => setEditingProject({ ...editingProject, category: e.target.value })}
                    className="w-full bg-transparent border-b border-cream/10 py-1 text-xs focus:outline-none focus:border-accent text-cream"
                  />
                </div>
                <div>
                  <label className="text-[10px] uppercase opacity-40 block mb-1">Badge (e.g. Capstone, IBP)</label>
                  <input
                    type="text"
                    value={editingProject.badge || ''}
                    onChange={(e) => setEditingProject({ ...editingProject, badge: e.target.value })}
                    className="w-full bg-transparent border-b border-cream/10 py-1 text-xs focus:outline-none focus:border-accent text-cream"
                  />
                </div>
              </div>

              <div>
                <label className="text-[10px] uppercase opacity-40 block mb-1">Tags (Comma-separated)</label>
                <input
                  type="text"
                  value={editingProject.tags || ''}
                  onChange={(e) => setEditingProject({ ...editingProject, tags: e.target.value })}
                  className="w-full bg-transparent border-b border-cream/10 py-1 text-xs focus:outline-none focus:border-accent text-cream"
                />
              </div>

              <div className="flex items-center gap-3 pt-2">
                <input
                  type="checkbox"
                  id="projFeatured"
                  checked={editingProject.featured || false}
                  onChange={(e) => setEditingProject({ ...editingProject, featured: e.target.checked })}
                  className="rounded accent-accent"
                />
                <label htmlFor="projFeatured" className="text-xs uppercase tracking-wider cursor-pointer">
                  Featured Showcase Project
                </label>
              </div>

              <div className="flex justify-end gap-3 pt-4 border-t border-cream/5">
                <button
                  type="button"
                  onClick={() => setIsProjectModalOpen(false)}
                  className="px-4 py-2 border border-cream/10 text-xs tracking-wider uppercase opacity-60 hover:opacity-100"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 bg-accent text-cream text-xs tracking-wider uppercase hover:opacity-90"
                >
                  Save Project
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ─── EXPERIENCE MODAL ─────────────────────────────────────── */}
      {isExpModalOpen && editingExperience && (
        <div className="fixed inset-0 z-[100] bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="glass bg-[#0F0E0C] border border-cream/10 rounded-sm p-6 max-w-lg w-full max-h-[90vh] overflow-y-auto">
            <div className="flex justify-between items-center mb-6">
              <h3 className="text-sm uppercase tracking-widest font-semibold text-accent">
                {editingExperience.id ? 'Edit Experience' : 'New Experience'}
              </h3>
              <button onClick={() => setIsExpModalOpen(false)} className="text-lg opacity-60 hover:opacity-100">
                &times;
              </button>
            </div>

            <form onSubmit={handleSaveExperience} className="space-y-4">
              <div>
                <label className="text-[10px] uppercase opacity-40 block mb-1">Company / Institution</label>
                <input
                  type="text"
                  required
                  value={editingExperience.company}
                  onChange={(e) => setEditingExperience({ ...editingExperience, company: e.target.value })}
                  className="w-full bg-transparent border-b border-cream/10 py-1 text-sm focus:outline-none focus:border-accent text-cream"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-[10px] uppercase opacity-40 block mb-1">Role</label>
                  <input
                    type="text"
                    required
                    value={editingExperience.role}
                    onChange={(e) => setEditingExperience({ ...editingExperience, role: e.target.value })}
                    className="w-full bg-transparent border-b border-cream/10 py-1 text-xs focus:outline-none focus:border-accent text-cream"
                  />
                </div>
                <div>
                  <label className="text-[10px] uppercase opacity-40 block mb-1">Period (e.g. March 2026 — May 2026)</label>
                  <input
                    type="text"
                    required
                    value={editingExperience.period}
                    onChange={(e) => setEditingExperience({ ...editingExperience, period: e.target.value })}
                    className="w-full bg-transparent border-b border-cream/10 py-1 text-xs focus:outline-none focus:border-accent text-cream"
                  />
                </div>
              </div>

              <div>
                <label className="text-[10px] uppercase opacity-40 block mb-1">Logo URL (Optional)</label>
                <input
                  type="text"
                  value={editingExperience.logoUrl || ''}
                  onChange={(e) => setEditingExperience({ ...editingExperience, logoUrl: e.target.value })}
                  className="w-full bg-transparent border-b border-cream/10 py-1 text-xs focus:outline-none focus:border-accent text-cream"
                />
              </div>

              <div>
                <label className="text-[10px] uppercase opacity-40 block mb-1">
                  Bullet Points (One per line)
                </label>
                <textarea
                  rows={4}
                  value={expBulletsText}
                  onChange={(e) => setExpBulletsText(e.target.value)}
                  placeholder="Contributed to HRIS...&#10;Streamlined administrative workflows..."
                  className="w-full bg-transparent border-b border-cream/10 py-1 text-xs focus:outline-none focus:border-accent text-cream resize-none font-mono"
                />
              </div>

              <div className="flex justify-end gap-3 pt-4 border-t border-cream/5">
                <button
                  type="button"
                  onClick={() => setIsExpModalOpen(false)}
                  className="px-4 py-2 border border-cream/10 text-xs tracking-wider uppercase opacity-60 hover:opacity-100"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 bg-accent text-cream text-xs tracking-wider uppercase hover:opacity-90"
                >
                  Save Experience
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ─── GALLERY MODAL ────────────────────────────────────────── */}
      {isGalleryModalOpen && editingGalleryItem && (
        <div className="fixed inset-0 z-[100] bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="glass bg-[#0F0E0C] border border-cream/10 rounded-sm p-6 max-w-lg w-full max-h-[90vh] overflow-y-auto">
            <div className="flex justify-between items-center mb-6">
              <h3 className="text-sm uppercase tracking-widest font-semibold text-accent">
                {editingGalleryItem.id ? 'Edit Gallery Photo' : 'New Gallery Photo'}
              </h3>
              <button onClick={() => setIsGalleryModalOpen(false)} className="text-lg opacity-60 hover:opacity-100">
                &times;
              </button>
            </div>

            <form onSubmit={handleSaveGalleryItem} className="space-y-4">
              <div>
                <label className="text-[10px] uppercase opacity-40 block mb-1">Title</label>
                <input
                  type="text"
                  required
                  value={editingGalleryItem.title}
                  onChange={(e) => setEditingGalleryItem({ ...editingGalleryItem, title: e.target.value })}
                  className="w-full bg-transparent border-b border-cream/10 py-1 text-sm focus:outline-none focus:border-accent text-cream"
                />
              </div>

              <div>
                <label className="text-[10px] uppercase opacity-40 block mb-1">Description</label>
                <textarea
                  rows={2}
                  value={editingGalleryItem.description || ''}
                  onChange={(e) => setEditingGalleryItem({ ...editingGalleryItem, description: e.target.value })}
                  className="w-full bg-transparent border-b border-cream/10 py-1 text-xs focus:outline-none focus:border-accent text-cream resize-none"
                />
              </div>

              <div>
                <label className="text-[10px] uppercase opacity-40 block mb-1">Image URL</label>
                <input
                  type="text"
                  required
                  value={editingGalleryItem.imageUrl}
                  onChange={(e) => setEditingGalleryItem({ ...editingGalleryItem, imageUrl: e.target.value })}
                  className="w-full bg-transparent border-b border-cream/10 py-1 text-xs focus:outline-none focus:border-accent text-cream"
                />
              </div>

              <div className="flex justify-end gap-3 pt-4 border-t border-cream/5">
                <button
                  type="button"
                  onClick={() => setIsGalleryModalOpen(false)}
                  className="px-4 py-2 border border-cream/10 text-xs tracking-wider uppercase opacity-60 hover:opacity-100"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 bg-accent text-cream text-xs tracking-wider uppercase hover:opacity-90"
                >
                  Save Photo
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ─── CONFIRMATION DIALOG ──────────────────────────────────── */}
      {confirmDialog.isOpen && (
        <div className="fixed inset-0 z-[120] bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="glass bg-[#0F0E0C] border border-cream/10 rounded-sm p-6 max-w-sm w-full space-y-4">
            <h4 className="text-sm font-semibold text-accent uppercase tracking-wider">
              {confirmDialog.title}
            </h4>
            <p className="text-xs opacity-70 leading-relaxed">{confirmDialog.message}</p>
            <div className="flex justify-end gap-3 pt-4 border-t border-cream/5">
              <button
                onClick={() => setConfirmDialog((prev) => ({ ...prev, isOpen: false }))}
                className="px-4 py-1.5 border border-cream/10 text-xs tracking-wider uppercase opacity-60 hover:opacity-100"
              >
                Cancel
              </button>
              <button
                onClick={confirmDialog.onConfirm}
                className="px-4 py-1.5 bg-red-600 text-white text-xs tracking-wider uppercase hover:opacity-90"
              >
                Confirm
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
