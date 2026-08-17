import { PortfolioConfig, Project, Experience, GalleryItem, Testimonial, GithubStats } from '../types';

export const DEFAULT_CONFIG: PortfolioConfig = {
  heroLabel: 'Portfolio — 2026',
  heroName1: 'Enzo',
  heroName2: 'Daniela.',
  heroTagline: 'IT Graduate & Web Developer based in Caloocan City, Philippines. Building systems with Node.js, Express, MySQL, Supabase & Docker.',
  aboutTitle: 'Backend-first developer who actually cares about how the data moves.',
  aboutText1: 'BS Information Technology graduate with hands-on experience in web development through internship, academic, and personal projects. Focused on building robust server-side logic, RESTful APIs, and database operations.',
  aboutText2: 'Comfortable working on both solo and team-based projects. Uses AI-assisted tools like Claude and GitHub Copilot to accelerate development and support frontend implementation.',
  badgeText: 'BSIT Graduate',
  school: 'STI College Fairview',
  course: 'BS Information Technology',
  graduated: 'July 17, 2026',
  location: 'Caloocan City, PH',
  contactText: "I am currently looking for full-time roles in web development. Feel free to reach out if you think we'd be a good fit!",
  email: 'parane.enzo@gmail.com',
  profileImg: '/image/gradpic.jpg',
};

export const DEFAULT_PROJECTS: Project[] = [
  {
    id: 'proj-1',
    title: 'Gym Management System',
    description: 'Full-stack gym management with POS, inventory tracking, and member check-ins.',
    imageUrl: '/image/landing.png',
    liveUrl: 'https://fitworxgymph.web.app/',
    githubUrl: '',
    tags: 'Express.js, MySQL, Firebase, Node.js',
    category: 'node database',
    badge: 'Capstone',
    sortOrder: 1,
    featured: true,
  },
  {
    id: 'proj-2',
    title: 'Grade Calculator',
    description: 'STI grading system with local storage.',
    imageUrl: '/image/STI GRADE CALCULATOR.png',
    liveUrl: 'https://grade-calculator-xi.vercel.app/',
    githubUrl: '',
    tags: 'JavaScript, CSS3, HTML5',
    category: 'vanilla',
    badge: '',
    sortOrder: 2,
    featured: false,
  },
  {
    id: 'proj-3',
    title: 'Attendance System',
    description: 'QR-based logging, 95% tracking accuracy.',
    imageUrl: '/image/Screenshot 2026-05-13 081804.png',
    liveUrl: 'https://attendance-tracker-asean.vercel.app/',
    githubUrl: '',
    tags: 'React, Node.js, Supabase',
    category: 'react node database',
    badge: 'IBP',
    sortOrder: 3,
    featured: false,
  },
  {
    id: 'proj-4',
    title: 'Ticketing System',
    description: 'Facility issue management & workflows.',
    imageUrl: '',
    liveUrl: '',
    githubUrl: '',
    tags: 'TypeScript, React, Tailwind',
    category: 'react',
    badge: 'IBP',
    sortOrder: 4,
    featured: false,
  },
];

export const DEFAULT_EXPERIENCES: Experience[] = [
  {
    id: 'exp-1',
    role: 'Web Developer Intern | IT Support',
    company: 'Integrated Bar of the Philippines (IBP)',
    period: 'March 2026 — May 2026',
    logoUrl: '/image/ibp logo.png',
    bullets: JSON.stringify([
      'Contributed to the development of a Human Resource Information System (HRIS)',
      'Contributed to the development of an Attendance Monitoring System (AMS)',
      'Assisted in building a Ticketing Management System for internal operations',
      'Streamlined employee and administrative workflows',
      'Provided technical support and system maintenance',
    ]),
    sortOrder: 1,
    images: [
      {
        url: '/image/ibp pic.jpg',
        caption: 'Deployment: ASEAN Summit',
        description: 'Where the real-time attendance tracking system supported delegates.',
      },
      {
        url: '/image/Screenshot 2026-05-13 081804.png',
        caption: 'Attendance Dashboard UI',
        description: 'The live statistics panel built for managing check-ins and registration.',
      },
    ],
  },
  {
    id: 'exp-2',
    role: 'Backend Developer & Team Lead',
    company: 'Online Gym Facility Management System (Capstone)',
    period: 'Aug 2025 — Dec 2025',
    logoUrl: '',
    bullets: JSON.stringify([
      'Developed and structured 20+ backend route modules implementing RESTful APIs for membership management, ecommerce, and payment processing.',
      'Implemented secure equipment tracking, reservations, and customer inquiries using Node.js & Express.js.',
    ]),
    sortOrder: 2,
    images: [
      {
        url: '/image/capstone pic.jpg',
        caption: 'Capstone Defense',
        description: 'With Capstone adviser Rubinado Lubian III, celebrating the project release.',
      },
      {
        url: '/image/landing.png',
        caption: 'Fitworx Landing Portal',
        description: 'The administrative and member login portal interface for Fitworx Gym.',
      },
    ],
  },
  {
    id: 'exp-3',
    role: 'Bachelor of Science in Information Technology (BSIT)',
    company: 'STI College Fairview',
    period: 'July 2026',
    logoUrl: '/image/STI.png',
    bullets: JSON.stringify([
      'Graduated on July 17, 2026, with an emphasis on web development, database management systems, and systems integration.',
      'Completed a 4-year BSIT curriculum focusing on practical application development and software design methodologies.',
    ]),
    sortOrder: 3,
  },
];

export const DEFAULT_GALLERY: GalleryItem[] = [
  {
    id: 'gal-1',
    title: 'Board Presentation',
    description: 'Presenting the completed HRIS to the IBP Board of Lawyers — the culmination of our internship project.',
    imageUrl: '/image/picture with boards.jpg',
    sortOrder: 1,
  },
  {
    id: 'gal-2',
    title: 'OJT Certificate',
    description: 'Received the official certificate of completion for the On-the-Job Training program at IBP.',
    imageUrl: '/image/picture with certificate.jpg',
    sortOrder: 2,
  },
  {
    id: 'gal-3',
    title: 'With HR Heads',
    description: 'Together with the IBP Human Resources department heads who guided our team throughout the internship.',
    imageUrl: '/image/picture with hr heads.jpg',
    sortOrder: 3,
  },
  {
    id: 'gal-4',
    title: 'With Supervisor',
    description: 'With my OJT supervisor who mentored our team on IT support and web development throughout the program.',
    imageUrl: '/image/picture with supervisor.jpg',
    sortOrder: 4,
  },
];

export const DEFAULT_TESTIMONIALS: Testimonial[] = [
  {
    id: 'test-1',
    name: 'Rubinado Lubian III',
    role: 'Capstone Adviser / STI Fairview',
    quote: '"Enzo stood out as an exemplary student and team leader during his Capstone project. He demonstrated great responsibility in guiding his team, exceptional problem-solving skills, and a strong commitment to academic excellence. The success of their Capstone system is a testament to his dedication and work ethic."',
    initials: 'RL',
    link: 'https://www.facebook.com/flux.lubian',
    sortOrder: 1,
  },
  {
    id: 'test-2',
    name: 'Norberto Beltran',
    role: 'OJT Supervisor / IBP IT Support',
    quote: '"As a Web Developer Intern, Enzo quickly adapted to our systems at the IBP. He played a critical role in deploying the Attendance Monitoring System at the ASEAN Summit and streamlined key internal workflows."',
    initials: 'NB',
    sortOrder: 2,
  },
];

export const DEFAULT_GITHUB_STATS: GithubStats = {
  repos: '12',
  stars: '3',
  activity: 'Pushed to Enzo.Dev-Portfolio: "Migrate to React architecture"',
};
