import { PortfolioConfig, Project, Experience, GalleryItem, ContactMessage, GithubStats } from '../types';
import {
  DEFAULT_CONFIG,
  DEFAULT_PROJECTS,
  DEFAULT_EXPERIENCES,
  DEFAULT_GALLERY,
  DEFAULT_GITHUB_STATS,
} from './mockData';

export const API_BASE =
  window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1'
    ? 'http://localhost:5000'
    : 'https://enzo-dev-portfolio.onrender.com';

function authHeaders() {
  const token = localStorage.getItem('adminToken') || '';
  return {
    Authorization: `Bearer ${token}`,
    'Content-Type': 'application/json',
  };
}

export const api = {
  async getPortfolio(): Promise<{
    config: PortfolioConfig;
    projects: Project[];
    experiences: Experience[];
    gallery: GalleryItem[];
  }> {
    try {
      const res = await fetch(`${API_BASE}/api/portfolio`);
      if (!res.ok) throw new Error('Failed to fetch portfolio data');
      const data = await res.json();
      return {
        config: { ...DEFAULT_CONFIG, ...(data.config || {}) },
        projects: data.projects && data.projects.length > 0 ? data.projects : DEFAULT_PROJECTS,
        experiences: data.experiences && data.experiences.length > 0 ? data.experiences : DEFAULT_EXPERIENCES,
        gallery: data.gallery && data.gallery.length > 0 ? data.gallery : DEFAULT_GALLERY,
      };
    } catch (err) {
      console.warn('API fetch failed, using offline fallback data:', err);
      return {
        config: DEFAULT_CONFIG,
        projects: DEFAULT_PROJECTS,
        experiences: DEFAULT_EXPERIENCES,
        gallery: DEFAULT_GALLERY,
      };
    }
  },

  async getGithubStats(): Promise<GithubStats> {
    try {
      const res = await fetch(`${API_BASE}/api/github-stats`);
      if (!res.ok) throw new Error('API server unreachable');
      return await res.json();
    } catch (err) {
      return DEFAULT_GITHUB_STATS;
    }
  },

  async pingServer(): Promise<{ dbConnection: string; latency: number }> {
    const startTime = performance.now();
    try {
      const res = await fetch(`${API_BASE}/api/ping`);
      const data = await res.json();
      const latency = Math.round(performance.now() - startTime);
      return { dbConnection: data.dbConnection || 'connected', latency };
    } catch (err) {
      return { dbConnection: 'simulated', latency: 45 };
    }
  },

  async sendContactMessage(payload: { name: string; email: string; message: string }): Promise<boolean> {
    try {
      const res = await fetch(`${API_BASE}/api/contact`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });
      return res.ok;
    } catch (err) {
      return false;
    }
  },

  // Admin APIs
  async adminLogin(credentials: { email: string; password: string }): Promise<{ token: string }> {
    const res = await fetch(`${API_BASE}/api/admin/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(credentials),
    });
    const data = await res.json();
    if (!res.ok || !data.token) {
      throw new Error(data.error || 'Invalid credentials');
    }
    return data;
  },

  async verifyAdminToken(token: string): Promise<boolean> {
    try {
      const res = await fetch(`${API_BASE}/api/admin/verify`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      const data = await res.json();
      return !!data.valid;
    } catch {
      return false;
    }
  },

  async updateConfig(payload: Partial<PortfolioConfig>): Promise<boolean> {
    const res = await fetch(`${API_BASE}/api/portfolio/config`, {
      method: 'PUT',
      headers: authHeaders(),
      body: JSON.stringify(payload),
    });
    if (!res.ok) throw new Error('Failed to update config');
    return true;
  },

  async uploadProfileImage(file: File): Promise<string> {
    const token = localStorage.getItem('adminToken') || '';
    const formData = new FormData();
    formData.append('image', file);

    const res = await fetch(`${API_BASE}/api/uploads/profile-image`, {
      method: 'POST',
      headers: { Authorization: `Bearer ${token}` },
      body: formData,
    });
    if (!res.ok) throw new Error('Upload failed');
    const data = await res.json();
    return data.url;
  },

  // Projects CRUD
  async saveProject(project: Partial<Project>, id?: string): Promise<Project> {
    const url = id ? `${API_BASE}/api/projects/${id}` : `${API_BASE}/api/projects`;
    const method = id ? 'PUT' : 'POST';
    const res = await fetch(url, {
      method,
      headers: authHeaders(),
      body: JSON.stringify(project),
    });
    if (!res.ok) throw new Error('Failed to save project');
    return await res.json();
  },

  async deleteProject(id: string): Promise<boolean> {
    const res = await fetch(`${API_BASE}/api/projects/${id}`, {
      method: 'DELETE',
      headers: authHeaders(),
    });
    if (!res.ok) throw new Error('Failed to delete project');
    return true;
  },

  // Experiences CRUD
  async saveExperience(experience: Partial<Experience>, id?: string): Promise<Experience> {
    const url = id ? `${API_BASE}/api/experiences/${id}` : `${API_BASE}/api/experiences`;
    const method = id ? 'PUT' : 'POST';
    const res = await fetch(url, {
      method,
      headers: authHeaders(),
      body: JSON.stringify(experience),
    });
    if (!res.ok) throw new Error('Failed to save experience');
    return await res.json();
  },

  async deleteExperience(id: string): Promise<boolean> {
    const res = await fetch(`${API_BASE}/api/experiences/${id}`, {
      method: 'DELETE',
      headers: authHeaders(),
    });
    if (!res.ok) throw new Error('Failed to delete experience');
    return true;
  },

  // Gallery CRUD
  async saveGalleryItem(item: Partial<GalleryItem>, id?: string): Promise<GalleryItem> {
    const url = id ? `${API_BASE}/api/gallery/${id}` : `${API_BASE}/api/gallery`;
    const method = id ? 'PUT' : 'POST';
    const res = await fetch(url, {
      method,
      headers: authHeaders(),
      body: JSON.stringify(item),
    });
    if (!res.ok) throw new Error('Failed to save gallery item');
    return await res.json();
  },

  async deleteGalleryItem(id: string): Promise<boolean> {
    const res = await fetch(`${API_BASE}/api/gallery/${id}`, {
      method: 'DELETE',
      headers: authHeaders(),
    });
    if (!res.ok) throw new Error('Failed to delete gallery item');
    return true;
  },

  // Messages Inbox
  async getContacts(): Promise<ContactMessage[]> {
    const res = await fetch(`${API_BASE}/api/contacts`, {
      headers: authHeaders(),
    });
    if (!res.ok) throw new Error('Failed to load contacts');
    return await res.json();
  },

  // Reset to Defaults
  async resetPortfolio(): Promise<boolean> {
    const res = await fetch(`${API_BASE}/api/portfolio/reset`, {
      method: 'POST',
      headers: authHeaders(),
    });
    if (!res.ok) throw new Error('Failed to reset portfolio');
    return true;
  },
};
