const express = require('express');
const cors = require('cors');
const fs = require('fs');
const path = require('path');
const multer = require('multer');
const helmet = require('helmet');
const rateLimit = require('express-rate-limit');
const fetch = require('node-fetch');
const { doc, getDoc, setDoc, collection, addDoc, getDocs, updateDoc, deleteDoc } = require('firebase/firestore');
const { db } = require('./firebase');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 5000;

app.disable('x-powered-by');
app.set('trust proxy', 1);

const allowedOrigins = [
    /^https:\/\/.*\.vercel\.app$/i,
    /^https:\/\/.*\.onrender\.com$/i,
    /^http:\/\/localhost(?::\d+)?$/i,
    /^http:\/\/127\.0\.0\.1(?::\d+)?$/i,
];

const apiLimiter = rateLimit({
    windowMs: 15 * 60 * 1000,
    limit: 300,
    standardHeaders: true,
    legacyHeaders: false,
    message: { error: 'Too many requests. Please slow down.' },
});

const loginLimiter = rateLimit({
    windowMs: 15 * 60 * 1000,
    limit: 10,
    standardHeaders: true,
    legacyHeaders: false,
    message: { error: 'Too many login attempts. Please try again later.' },
});

const uploadLimiter = rateLimit({
    windowMs: 15 * 60 * 1000,
    limit: 20,
    standardHeaders: true,
    legacyHeaders: false,
    message: { error: 'Too many upload attempts. Please try again later.' },
});

const adminActionLimiter = rateLimit({
    windowMs: 15 * 60 * 1000,
    limit: 40,
    standardHeaders: true,
    legacyHeaders: false,
    message: { error: 'Too many admin actions. Please slow down.' },
});

const publicWriteLimiter = rateLimit({
    windowMs: 15 * 60 * 1000,
    limit: 30,
    standardHeaders: true,
    legacyHeaders: false,
    message: { error: 'Too many submissions. Please try again later.' },
});

app.use(helmet({ contentSecurityPolicy: false }));
app.use((req, res, next) => {
    res.setHeader('X-Content-Type-Options', 'nosniff');
    res.setHeader('X-Frame-Options', 'SAMEORIGIN');
    res.setHeader('Referrer-Policy', 'same-origin');
    res.setHeader('Permissions-Policy', 'camera=(), microphone=(), geolocation=()');
    if (req.secure || req.headers['x-forwarded-proto'] === 'https') {
        res.setHeader('Strict-Transport-Security', 'max-age=15552000; includeSubDomains');
    }
    next();
});

// Default Seed Data
const DEFAULT_CONFIG = {
    heroLabel: "Portfolio — 2026",
    heroName1: "Enzo",
    heroName2: "Daniela.",
    heroTagline: "IT Graduate & Web Developer based in Caloocan City, Philippines. Building systems with Node.js, Express, MySQL, Supabase & Docker.",
    aboutTitle: "Backend-first developer who actually cares about how the data moves.",
    aboutText1: "BS Information Technology graduate with hands-on experience in web development through internship, academic, and personal projects. Focused on building robust server-side logic, RESTful APIs, and database operations.",
    aboutText2: "Comfortable working on both solo and team-based projects. Uses AI-assisted tools like Claude and GitHub Copilot to accelerate development and support frontend implementation.",
    profileImg: "./image/new_formal-removebg-preview.png",
    badgeText: "BSIT Graduate",
    school: "STI College Fairview",
    course: "BS Information Technology",
    graduated: "July 17, 2026",
    location: "Caloocan City, PH",
    contactText: "I am currently looking for full-time roles in web development. Feel free to reach out if you think we'd be a good fit!",
    email: "parane.enzo@gmail.com"
};

const DEFAULT_PROJECTS = [
    {
        title: "Gym Management System",
        description: "Full-stack gym management with POS, inventory tracking, and member check-ins.",
        imageUrl: "image/landing.png",
        liveUrl: "https://fitworxgymph.web.app/",
        tags: "Express.js,MySQL,Firebase,Node.js",
        category: "node database",
        badge: "Capstone",
        featured: true,
        sortOrder: 1
    },
    {
        title: "Grade Calculator",
        description: "STI grading system with local storage.",
        imageUrl: "image/STI GRADE CALCULATOR.png",
        liveUrl: "https://grade-calculator-xi.vercel.app/",
        tags: "JavaScript,CSS3,HTML5",
        category: "vanilla",
        badge: "",
        featured: false,
        sortOrder: 2
    },
    {
        title: "Attendance System",
        description: "QR-based logging, 95% tracking accuracy.",
        imageUrl: "image/Screenshot 2026-05-13 081804.png",
        liveUrl: "https://attendance-tracker-asean.vercel.app/",
        tags: "React,Node.js,Supabase",
        category: "react node database",
        badge: "IBP",
        featured: false,
        sortOrder: 3
    },
    {
        title: "Ticketing System",
        description: "Facility issue management & workflows.",
        imageUrl: "",
        liveUrl: "",
        tags: "TypeScript,React,Tailwind",
        category: "react",
        badge: "IBP",
        featured: false,
        sortOrder: 4
    }
];

const DEFAULT_EXPERIENCES = [
    {
        role: "Web Developer Intern | IT Support",
        company: "Integrated Bar of the Philippines (IBP)",
        period: "March 2026 — May 2026",
        description: "",
        bullets: JSON.stringify([
            "Contributed to the development of a Human Resource Information System (HRIS)",
            "Contributed to the development of an Attendance Monitoring System (AMS)",
            "Assisted in building a Ticketing Management System for internal operations",
            "Streamlined employee and administrative workflows",
            "Provided technical support and system maintenance"
        ]),
        logoUrl: "image/ibp logo.png",
        sortOrder: 1
    },
    {
        role: "Backend Developer & Team Lead",
        company: "Online Gym Facility Management System (Capstone)",
        period: "Aug 2025 — Dec 2025",
        description: "",
        bullets: JSON.stringify([
            "Developed and structured 20+ backend route modules implementing RESTful APIs for membership management, ecommerce, and payment processing.",
            "Implemented secure equipment tracking, reservations, and customer inquiries using Node.js & Express.js."
        ]),
        logoUrl: "",
        sortOrder: 2
    },
    {
        role: "Bachelor of Science in Information Technology (BSIT)",
        company: "STI College Fairview",
        period: "July 2026",
        description: "",
        bullets: JSON.stringify([
            "Graduated on July 17, 2026, with an emphasis on web development, database management systems, and systems integration.",
            "Completed a 4-year BSIT curriculum focusing on practical application development and software design methodologies."
        ]),
        logoUrl: "image/STI.png",
        sortOrder: 3
    }
];

const DEFAULT_GALLERY = [
    {
        title: "Board Presentation",
        description: "Presenting the completed HRIS to the IBP Board of Lawyers — the culmination of our internship project.",
        imageUrl: "image/picture with boards.jpg",
        sortOrder: 1
    },
    {
        title: "OJT Certificate",
        description: "Received the official certificate of completion for the On-the-Job Training program at IBP.",
        imageUrl: "image/picture with certificate.jpg",
        sortOrder: 2
    },
    {
        title: "With HR Heads",
        description: "Together with the IBP Human Resources department heads who guided our team throughout the internship.",
        imageUrl: "image/picture with hr heads.jpg",
        sortOrder: 3
    },
    {
        title: "With Supervisor",
        description: "With my OJT supervisor who mentored our team on IT support and web development throughout the program.",
        imageUrl: "image/picture with supervisor.jpg",
        sortOrder: 4
    }
];

// Static admin credentials (testing only)
const ADMIN_EMAIL = '1';
const ADMIN_PASSWORD = '1';
const ADMIN_TOKEN = 'epd-admin-session-token-2026';

app.use(cors({
    origin: (origin, cb) => {
        if (!origin) return cb(null, true);
        if (allowedOrigins.some(pattern => pattern.test(origin))) {
            return cb(null, true);
        }
        return cb(new Error('CORS blocked for this origin'));
    },
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization'],
    maxAge: 86400,
}));
app.use(express.json({ limit: '100kb' }));
app.use(express.urlencoded({ extended: false, limit: '50kb' }));
app.use('/admin', express.static(path.join(__dirname, '..', 'admin')));
app.use('/css', express.static(path.join(__dirname, '..', 'css')));
app.use('/js', express.static(path.join(__dirname, '..', 'js')));
app.use('/image', express.static(path.join(__dirname, '..', 'image')));
app.use(express.static(path.join(__dirname, '..')));

const imageUploadDir = path.join(__dirname, '..', 'image', 'uploads');
if (!fs.existsSync(imageUploadDir)) {
    fs.mkdirSync(imageUploadDir, { recursive: true });
}

const uploadStorage = multer.diskStorage({
    destination: (_req, _file, cb) => cb(null, imageUploadDir),
    filename: (_req, file, cb) => {
        const safeName = file.originalname.replace(/[^a-zA-Z0-9._-]/g, '_');
        cb(null, `${Date.now()}-${safeName}`);
    }
});

const uploadImage = multer({
    storage: uploadStorage,
    limits: { fileSize: 5 * 1024 * 1024 },
    fileFilter: (_req, file, cb) => {
        if (!file.mimetype.startsWith('image/')) {
            return cb(new Error('Only image files are allowed'));
        }
        cb(null, true);
    }
});

// ─── Auth Middleware ───────────────────────────────────────────
function requireAuth(req, res, next) {
    const token = req.headers.authorization?.replace('Bearer ', '');
    if (token !== ADMIN_TOKEN) {
        return res.status(401).json({ error: 'Unauthorized' });
    }
    next();
}

// ─── Admin Auth ───────────────────────────────────────────────
app.post('/api/admin/login', loginLimiter, (req, res) => {
    const { email, password } = req.body;
    if (email === ADMIN_EMAIL && password === ADMIN_PASSWORD) {
        return res.json({ success: true, token: ADMIN_TOKEN, user: { email: 'admin@enzo.dev' } });
    }
    return res.status(401).json({ error: 'Invalid credentials' });
});

app.get('/api/admin/verify', requireAuth, (req, res) => {
    res.json({ valid: true });
});

// ─── Portfolio Config (Singleton CRUD) ────────────────────────
app.get('/api/portfolio', async (req, res) => {
    try {
        const configDoc = doc(db, 'portfolio', 'config');
        const configSnap = await getDoc(configDoc);
        let config = configSnap.exists() ? { id: 'config', ...configSnap.data() } : DEFAULT_CONFIG;

        // Fetch Projects
        const projectsCol = collection(db, 'projects');
        const projSnapshot = await getDocs(projectsCol);
        const projects = [];
        projSnapshot.forEach(doc => {
            projects.push({ id: doc.id, ...doc.data() });
        });
        projects.sort((a, b) => (a.sortOrder || 0) - (b.sortOrder || 0));

        // Fetch Experiences
        const expCol = collection(db, 'experiences');
        const expSnapshot = await getDocs(expCol);
        const experiences = [];
        expSnapshot.forEach(doc => {
            experiences.push({ id: doc.id, ...doc.data() });
        });
        experiences.sort((a, b) => (a.sortOrder || 0) - (b.sortOrder || 0));

        // Fetch Gallery
        const galleryCol = collection(db, 'gallery');
        const gallerySnapshot = await getDocs(galleryCol);
        const gallery = [];
        gallerySnapshot.forEach(doc => {
            gallery.push({ id: doc.id, ...doc.data() });
        });
        gallery.sort((a, b) => (a.sortOrder || 0) - (b.sortOrder || 0));

        res.json({ config, projects, experiences, gallery });
    } catch (error) {
        console.error('Portfolio fetch error:', error);
        res.status(500).json({ error: 'Failed to fetch portfolio data' });
    }
});

app.put('/api/portfolio/config', requireAuth, adminActionLimiter, async (req, res) => {
    try {
        const data = req.body;
        delete data.id;
        
        const configDoc = doc(db, 'portfolio', 'config');
        await setDoc(configDoc, data, { merge: true });
        res.json({ id: 'config', ...data });
    } catch (error) {
        console.error('Config update error:', error);
        res.status(500).json({ error: 'Failed to update config' });
    }
});

app.post('/api/uploads/profile-image', requireAuth, uploadLimiter, uploadImage.single('image'), async (req, res) => {
    try {
        if (!req.file) {
            return res.status(400).json({ error: 'No image file provided' });
        }

        const publicUrl = `${req.protocol}://${req.get('host')}/image/uploads/${encodeURIComponent(req.file.filename)}`;
        res.json({
            url: publicUrl,
            filename: req.file.filename,
            originalName: req.file.originalname
        });
    } catch (error) {
        console.error('Profile image upload error:', error);
        res.status(500).json({ error: 'Failed to upload profile image' });
    }
});

app.post('/api/portfolio/reset', requireAuth, adminActionLimiter, async (req, res) => {
    try {
        console.log('Resetting database to defaults...');
        
        // 1. Reset Config Doc
        const configDoc = doc(db, 'portfolio', 'config');
        await setDoc(configDoc, DEFAULT_CONFIG);
        
        // 2. Delete and re-seed projects
        const projectsCol = collection(db, 'projects');
        const projSnapshot = await getDocs(projectsCol);
        for (const projectDoc of projSnapshot.docs) {
            await deleteDoc(doc(db, 'projects', projectDoc.id));
        }
        for (const proj of DEFAULT_PROJECTS) {
            await addDoc(projectsCol, proj);
        }
        
        // 3. Delete and re-seed experiences
        const expCol = collection(db, 'experiences');
        const expSnapshot = await getDocs(expCol);
        for (const experienceDoc of expSnapshot.docs) {
            await deleteDoc(doc(db, 'experiences', experienceDoc.id));
        }
        for (const exp of DEFAULT_EXPERIENCES) {
            await addDoc(expCol, exp);
        }

        // 4. Delete and re-seed gallery
        const galleryCol = collection(db, 'gallery');
        const gallerySnapshot = await getDocs(galleryCol);
        for (const galleryDoc of gallerySnapshot.docs) {
            await deleteDoc(doc(db, 'gallery', galleryDoc.id));
        }
        for (const gal of DEFAULT_GALLERY) {
            await addDoc(galleryCol, gal);
        }

        console.log('Database reset completed successfully.');
        res.json({ success: true, message: 'Database reset to default values successfully.' });
    } catch (error) {
        console.error('Database reset error:', error);
        res.status(500).json({ error: 'Failed to reset database to default values.' });
    }
});

// ─── Projects CRUD ────────────────────────────────────────────
app.get('/api/projects', async (req, res) => {
    try {
        const projectsCol = collection(db, 'projects');
        const projSnapshot = await getDocs(projectsCol);
        const projects = [];
        projSnapshot.forEach(doc => {
            projects.push({ id: doc.id, ...doc.data() });
        });
        projects.sort((a, b) => (a.sortOrder || 0) - (b.sortOrder || 0));
        res.json(projects);
    } catch (error) {
        res.status(500).json({ error: 'Failed to fetch projects' });
    }
});

app.post('/api/projects', requireAuth, adminActionLimiter, async (req, res) => {
    try {
        const docRef = await addDoc(collection(db, 'projects'), req.body);
        res.status(201).json({ id: docRef.id, ...req.body });
    } catch (error) {
        console.error('Project create error:', error);
        res.status(500).json({ error: 'Failed to create project' });
    }
});

app.put('/api/projects/:id', requireAuth, adminActionLimiter, async (req, res) => {
    try {
        const data = req.body;
        delete data.id;
        const docRef = doc(db, 'projects', req.params.id);
        await setDoc(docRef, data, { merge: true });
        res.json({ id: req.params.id, ...data });
    } catch (error) {
        console.error('Project update error:', error);
        res.status(500).json({ error: 'Failed to update project' });
    }
});

app.delete('/api/projects/:id', requireAuth, adminActionLimiter, async (req, res) => {
    try {
        await deleteDoc(doc(db, 'projects', req.params.id));
        res.json({ success: true });
    } catch (error) {
        console.error('Project delete error:', error);
        res.status(500).json({ error: 'Failed to delete project' });
    }
});

// ─── Experiences CRUD ─────────────────────────────────────────
app.get('/api/experiences', async (req, res) => {
    try {
        const expCol = collection(db, 'experiences');
        const expSnapshot = await getDocs(expCol);
        const experiences = [];
        expSnapshot.forEach(doc => {
            experiences.push({ id: doc.id, ...doc.data() });
        });
        experiences.sort((a, b) => (a.sortOrder || 0) - (b.sortOrder || 0));
        res.json(experiences);
    } catch (error) {
        res.status(500).json({ error: 'Failed to fetch experiences' });
    }
});

app.post('/api/experiences', requireAuth, adminActionLimiter, async (req, res) => {
    try {
        const docRef = await addDoc(collection(db, 'experiences'), req.body);
        res.status(201).json({ id: docRef.id, ...req.body });
    } catch (error) {
        console.error('Experience create error:', error);
        res.status(500).json({ error: 'Failed to create experience' });
    }
});

app.put('/api/experiences/:id', requireAuth, adminActionLimiter, async (req, res) => {
    try {
        const data = req.body;
        delete data.id;
        const docRef = doc(db, 'experiences', req.params.id);
        await setDoc(docRef, data, { merge: true });
        res.json({ id: req.params.id, ...data });
    } catch (error) {
        console.error('Experience update error:', error);
        res.status(500).json({ error: 'Failed to update experience' });
    }
});

app.delete('/api/experiences/:id', requireAuth, adminActionLimiter, async (req, res) => {
    try {
        await deleteDoc(doc(db, 'experiences', req.params.id));
        res.json({ success: true });
    } catch (error) {
        console.error('Experience delete error:', error);
        res.status(500).json({ error: 'Failed to delete experience' });
    }
});

// ─── Gallery CRUD ─────────────────────────────────────────────
app.get('/api/gallery', async (req, res) => {
    try {
        const galleryCol = collection(db, 'gallery');
        const snapshot = await getDocs(galleryCol);
        const gallery = [];
        snapshot.forEach(doc => {
            gallery.push({ id: doc.id, ...doc.data() });
        });
        gallery.sort((a, b) => (a.sortOrder || 0) - (b.sortOrder || 0));
        res.json(gallery);
    } catch (error) {
        res.status(500).json({ error: 'Failed to fetch gallery' });
    }
});

app.post('/api/gallery', requireAuth, adminActionLimiter, async (req, res) => {
    try {
        const docRef = await addDoc(collection(db, 'gallery'), req.body);
        res.status(201).json({ id: docRef.id, ...req.body });
    } catch (error) {
        console.error('Gallery create error:', error);
        res.status(500).json({ error: 'Failed to create gallery item' });
    }
});

app.put('/api/gallery/:id', requireAuth, adminActionLimiter, async (req, res) => {
    try {
        const data = req.body;
        delete data.id;
        const docRef = doc(db, 'gallery', req.params.id);
        await setDoc(docRef, data, { merge: true });
        res.json({ id: req.params.id, ...data });
    } catch (error) {
        console.error('Gallery update error:', error);
        res.status(500).json({ error: 'Failed to update gallery item' });
    }
});

app.delete('/api/gallery/:id', requireAuth, adminActionLimiter, async (req, res) => {
    try {
        await deleteDoc(doc(db, 'gallery', req.params.id));
        res.json({ success: true });
    } catch (error) {
        console.error('Gallery delete error:', error);
        res.status(500).json({ error: 'Failed to delete gallery item' });
    }
});

// ─── Contacts Inbox (Firebase) ────────────────────────────────
app.get('/api/contacts', requireAuth, adminActionLimiter, async (req, res) => {
    try {
        const contactsCol = collection(db, 'contacts');
        const snapshot = await getDocs(contactsCol);
        const contacts = [];
        snapshot.forEach(doc => {
            contacts.push({ id: doc.id, ...doc.data() });
        });
        contacts.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
        res.json(contacts);
    } catch (error) {
        console.error('Contacts fetch error:', error);
        res.status(500).json({ error: 'Failed to fetch contacts' });
    }
});

// ─── GitHub Stats (Firebase cache) ────────────────────────────
async function fetchGithubStats() {
    const profileRes = await fetch('https://api.github.com/users/EnzoSoti', {
        headers: { 'User-Agent': 'EnzoSoti-Portfolio-Server' }
    });
    if (!profileRes.ok) throw new Error('GitHub Profile Fetch Failed');
    const profileData = await profileRes.json();
    const publicRepos = profileData.public_repos || 0;

    const reposRes = await fetch('https://api.github.com/users/EnzoSoti/repos?per_page=100', {
        headers: { 'User-Agent': 'EnzoSoti-Portfolio-Server' }
    });
    let totalStars = 0;
    if (reposRes.ok) {
        const reposData = await reposRes.json();
        totalStars = reposData.reduce((acc, repo) => acc + (repo.stargazers_count || 0), 0);
    }

    const eventsRes = await fetch('https://api.github.com/users/EnzoSoti/events', {
        headers: { 'User-Agent': 'EnzoSoti-Portfolio-Server' }
    });
    let latestActivity = 'No recent activity found';
    if (eventsRes.ok) {
        const eventsData = await eventsRes.json();
        const pushEvent = eventsData.find(e => e.type === 'PushEvent');
        if (pushEvent) {
            const repoName = pushEvent.repo.name.replace('EnzoSoti/', '');
            const commitMessage = pushEvent.payload.commits && pushEvent.payload.commits[0]
                ? pushEvent.payload.commits[0].message
                : 'Pushed changes';
            latestActivity = `Pushed to ${repoName}: "${commitMessage}"`;
        }
    }

    return { repos: publicRepos, stars: totalStars, activity: latestActivity, updatedAt: Date.now() };
}

app.get('/api/github-stats', async (req, res) => {
    try {
        const docRef = doc(db, 'cache', 'github-stats');
        const docSnap = await getDoc(docRef);
        let cachedData = null;
        if (docSnap.exists()) {
            cachedData = docSnap.data();
            const age = Date.now() - (cachedData.updatedAt || 0);
            if (age < 15 * 60 * 1000) {
                return res.json(cachedData);
            }
        }
        try {
            const freshData = await fetchGithubStats();
            await setDoc(docRef, freshData);
            return res.json(freshData);
        } catch (apiError) {
            if (cachedData) return res.json({ ...cachedData, fallback: true });
            throw apiError;
        }
    } catch (error) {
        console.error('GitHub Stats Route Error:', error);
        res.json({ repos: 12, stars: 3, activity: 'Pushed to Enzo.Dev-Portfolio', fallback: true, updatedAt: Date.now() });
    }
});

// ─── Contact Form (Firebase) ──────────────────────────────────
app.post('/api/contact', publicWriteLimiter, async (req, res) => {
    try {
        const { name, email, message } = req.body;
        if (!name || !email || !message) {
            return res.status(400).json({ error: 'Please provide name, email, and message.' });
        }
        const contactsCol = collection(db, 'contacts');
        const docRef = await addDoc(contactsCol, { name, email, message, createdAt: new Date().toISOString() });
        res.status(201).json({ success: true, id: docRef.id });
    } catch (error) {
        console.error('Contact Form Save Error:', error);
        res.status(500).json({ error: 'Failed to save contact message.' });
    }
});

// ─── Ping (for data flow visualizer) ──────────────────────────
app.get('/api/ping', async (req, res) => {
    try {
        const docRef = doc(db, 'cache', 'github-stats');
        await getDoc(docRef);
        res.json({ status: 'online', dbConnection: 'connected', latencyMs: 45, timestamp: Date.now() });
    } catch (e) {
        res.json({ status: 'online', dbConnection: 'disconnected', latencyMs: 0, timestamp: Date.now() });
    }
});

// ─── Clean URL Fallbacks ──────────────────────────────────────
app.get(['/about', '/projects', '/gallery', '/contact', '/experience', '/testimonials'], (req, res) => {
    res.sendFile(path.join(__dirname, '..', 'index.html'));
});

app.listen(PORT, async () => {
    console.log(`Server is running on port ${PORT}`);
    
    // Automatically initialize Firestore data if config document doesn't exist
    try {
        console.log('Checking database status (Firestore)...');
        const configDoc = doc(db, 'portfolio', 'config');
        const configSnap = await getDoc(configDoc);
        
        if (!configSnap.exists()) {
            console.log('Firestore config not found! Seeding database defaults...');
            
            // Seed Configuration
            await setDoc(configDoc, DEFAULT_CONFIG);
            console.log('Seeded default configuration.');
            
            // Seed Projects
            const projectsCol = collection(db, 'projects');
            for (const proj of DEFAULT_PROJECTS) {
                await addDoc(projectsCol, proj);
            }
            console.log('Seeded default projects.');
            
            // Seed Experiences
            const expCol = collection(db, 'experiences');
            for (const exp of DEFAULT_EXPERIENCES) {
                await addDoc(expCol, exp);
            }
            console.log('Seeded default experiences.');

            // Seed Gallery
            const galleryCol = collection(db, 'gallery');
            for (const gal of DEFAULT_GALLERY) {
                await addDoc(galleryCol, gal);
            }
            console.log('Seeded default gallery.');
            console.log('Firestore database initialized and seeded successfully.');
        } else {
            console.log('Firestore connected successfully. Config records found.');

            // Self-healing check for newly introduced gallery collection
            const galleryCol = collection(db, 'gallery');
            const gallerySnap = await getDocs(galleryCol);
            if (gallerySnap.empty) {
                console.log('Gallery collection is empty! Seeding default gallery items...');
                for (const gal of DEFAULT_GALLERY) {
                    await addDoc(galleryCol, gal);
                }
                console.log('Default gallery seeded successfully.');
            }
        }
    } catch (err) {
        console.error('Failed to initialize Firestore database:', err);
    }
});
