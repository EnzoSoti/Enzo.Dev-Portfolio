export interface PortfolioConfig {
  heroLabel: string;
  heroName1: string;
  heroName2: string;
  heroTagline: string;
  aboutTitle: string;
  aboutText1: string;
  aboutText2: string;
  badgeText: string;
  school: string;
  course: string;
  graduated: string;
  location: string;
  contactText: string;
  email: string;
  profileImg: string;
}

export interface Project {
  id: string;
  title: string;
  description: string;
  imageUrl?: string;
  liveUrl?: string;
  githubUrl?: string;
  tags: string;
  category: string;
  badge?: string;
  sortOrder: number;
  featured?: boolean;
}

export interface Experience {
  id: string;
  role: string;
  company: string;
  period: string;
  logoUrl?: string;
  bullets: string; // JSON string or array
  sortOrder: number;
  images?: Array<{
    url: string;
    caption: string;
    description: string;
  }>;
}

export interface GalleryItem {
  id: string;
  title: string;
  description?: string;
  imageUrl: string;
  sortOrder: number;
}

export interface Testimonial {
  id: string;
  name: string;
  role: string;
  quote: string;
  initials: string;
  link?: string;
  sortOrder: number;
}

export interface ContactMessage {
  id: string;
  name: string;
  email: string;
  message: string;
  createdAt: string;
}

export interface GithubStats {
  repos: string;
  stars: string;
  activity: string;
}
