-- CreateTable
CREATE TABLE "PortfolioConfig" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT DEFAULT 1,
    "heroLabel" TEXT NOT NULL DEFAULT 'Portfolio — 2026',
    "heroName1" TEXT NOT NULL DEFAULT 'Enzo',
    "heroName2" TEXT NOT NULL DEFAULT 'Daniela.',
    "heroTagline" TEXT NOT NULL DEFAULT 'IT Graduate & Web Developer based in Caloocan City, Philippines. Building systems with Node.js, Express, MySQL, Supabase & Docker.',
    "aboutTitle" TEXT NOT NULL DEFAULT 'Backend-first developer who actually cares about how the data moves.',
    "aboutText1" TEXT NOT NULL DEFAULT 'BS Information Technology graduate with hands-on experience in web development through internship, academic, and personal projects. Focused on building robust server-side logic, RESTful APIs, and database operations.',
    "aboutText2" TEXT NOT NULL DEFAULT 'Comfortable working on both solo and team-based projects. Uses AI-assisted tools like Claude and GitHub Copilot to accelerate development and support frontend implementation.',
    "profileImg" TEXT NOT NULL DEFAULT './image/new_formal-removebg-preview.png',
    "badgeText" TEXT NOT NULL DEFAULT 'BSIT Graduate',
    "school" TEXT NOT NULL DEFAULT 'STI College Fairview',
    "course" TEXT NOT NULL DEFAULT 'BS Information Technology',
    "graduated" TEXT NOT NULL DEFAULT 'July 17, 2026',
    "location" TEXT NOT NULL DEFAULT 'Caloocan City, PH',
    "contactText" TEXT NOT NULL DEFAULT 'I am currently looking for full-time roles in web development. Feel free to reach out if you think we''d be a good fit!',
    "email" TEXT NOT NULL DEFAULT 'parane.enzo@gmail.com',
    "updatedAt" DATETIME NOT NULL
);

-- CreateTable
CREATE TABLE "Project" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "title" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "imageUrl" TEXT NOT NULL DEFAULT '',
    "liveUrl" TEXT NOT NULL DEFAULT '',
    "githubUrl" TEXT NOT NULL DEFAULT '',
    "tags" TEXT NOT NULL DEFAULT '',
    "category" TEXT NOT NULL DEFAULT 'all',
    "badge" TEXT NOT NULL DEFAULT '',
    "featured" BOOLEAN NOT NULL DEFAULT false,
    "sortOrder" INTEGER NOT NULL DEFAULT 0,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL
);

-- CreateTable
CREATE TABLE "Experience" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "role" TEXT NOT NULL,
    "company" TEXT NOT NULL,
    "period" TEXT NOT NULL,
    "description" TEXT NOT NULL DEFAULT '',
    "bullets" TEXT NOT NULL DEFAULT '',
    "logoUrl" TEXT NOT NULL DEFAULT '',
    "sortOrder" INTEGER NOT NULL DEFAULT 0,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL
);
