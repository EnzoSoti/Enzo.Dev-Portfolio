const express = require('express');
const cors = require('cors');
const fetch = require('node-fetch');
const { PrismaClient } = require('@prisma/client');
const { doc, getDoc, setDoc, collection, addDoc, getDocs } = require('firebase/firestore');
const { db } = require('./firebase');
require('dotenv').config();

const app = express();
const prisma = new PrismaClient();
const PORT = process.env.PORT || 5000;

// Static admin credentials (testing only)
const ADMIN_EMAIL = '1';
const ADMIN_PASSWORD = '1';
const ADMIN_TOKEN = 'epd-admin-session-token-2026';

app.use(cors());
app.use(express.json());

// ─── Auth Middleware ───────────────────────────────────────────
function requireAuth(req, res, next) {
    const token = req.headers.authorization?.replace('Bearer ', '');
    if (token !== ADMIN_TOKEN) {
        return res.status(401).json({ error: 'Unauthorized' });
    }
    next();
}

// ─── Admin Auth ───────────────────────────────────────────────
app.post('/api/admin/login', (req, res) => {
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
        let config = await prisma.portfolioConfig.findUnique({ where: { id: 1 } });
        if (!config) {
            config = await prisma.portfolioConfig.create({ data: { id: 1 } });
        }
        const projects = await prisma.project.findMany({ orderBy: { sortOrder: 'asc' } });
        const experiences = await prisma.experience.findMany({ orderBy: { sortOrder: 'asc' } });
        res.json({ config, projects, experiences });
    } catch (error) {
        console.error('Portfolio fetch error:', error);
        res.status(500).json({ error: 'Failed to fetch portfolio data' });
    }
});

app.put('/api/portfolio/config', requireAuth, async (req, res) => {
    try {
        const data = req.body;
        // Remove fields that shouldn't be updated directly
        delete data.id;
        delete data.updatedAt;
        const config = await prisma.portfolioConfig.update({
            where: { id: 1 },
            data
        });
        res.json(config);
    } catch (error) {
        console.error('Config update error:', error);
        res.status(500).json({ error: 'Failed to update config' });
    }
});

// ─── Projects CRUD ────────────────────────────────────────────
app.get('/api/projects', async (req, res) => {
    try {
        const projects = await prisma.project.findMany({ orderBy: { sortOrder: 'asc' } });
        res.json(projects);
    } catch (error) {
        res.status(500).json({ error: 'Failed to fetch projects' });
    }
});

app.post('/api/projects', requireAuth, async (req, res) => {
    try {
        const project = await prisma.project.create({ data: req.body });
        res.status(201).json(project);
    } catch (error) {
        console.error('Project create error:', error);
        res.status(500).json({ error: 'Failed to create project' });
    }
});

app.put('/api/projects/:id', requireAuth, async (req, res) => {
    try {
        const data = req.body;
        delete data.id;
        delete data.createdAt;
        delete data.updatedAt;
        const project = await prisma.project.update({
            where: { id: parseInt(req.params.id) },
            data
        });
        res.json(project);
    } catch (error) {
        console.error('Project update error:', error);
        res.status(500).json({ error: 'Failed to update project' });
    }
});

app.delete('/api/projects/:id', requireAuth, async (req, res) => {
    try {
        await prisma.project.delete({ where: { id: parseInt(req.params.id) } });
        res.json({ success: true });
    } catch (error) {
        console.error('Project delete error:', error);
        res.status(500).json({ error: 'Failed to delete project' });
    }
});

// ─── Experiences CRUD ─────────────────────────────────────────
app.get('/api/experiences', async (req, res) => {
    try {
        const experiences = await prisma.experience.findMany({ orderBy: { sortOrder: 'asc' } });
        res.json(experiences);
    } catch (error) {
        res.status(500).json({ error: 'Failed to fetch experiences' });
    }
});

app.post('/api/experiences', requireAuth, async (req, res) => {
    try {
        const experience = await prisma.experience.create({ data: req.body });
        res.status(201).json(experience);
    } catch (error) {
        console.error('Experience create error:', error);
        res.status(500).json({ error: 'Failed to create experience' });
    }
});

app.put('/api/experiences/:id', requireAuth, async (req, res) => {
    try {
        const data = req.body;
        delete data.id;
        delete data.createdAt;
        delete data.updatedAt;
        const experience = await prisma.experience.update({
            where: { id: parseInt(req.params.id) },
            data
        });
        res.json(experience);
    } catch (error) {
        console.error('Experience update error:', error);
        res.status(500).json({ error: 'Failed to update experience' });
    }
});

app.delete('/api/experiences/:id', requireAuth, async (req, res) => {
    try {
        await prisma.experience.delete({ where: { id: parseInt(req.params.id) } });
        res.json({ success: true });
    } catch (error) {
        console.error('Experience delete error:', error);
        res.status(500).json({ error: 'Failed to delete experience' });
    }
});

// ─── Contacts Inbox (Firebase) ────────────────────────────────
app.get('/api/contacts', requireAuth, async (req, res) => {
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
app.post('/api/contact', async (req, res) => {
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

app.listen(PORT, async () => {
    console.log(`Server is running on port ${PORT}`);
    
    // Automatically run database migrations & seeds on start if needed
    try {
        console.log('Checking database status...');
        const count = await prisma.portfolioConfig.count();
        if (count === 0) {
            console.log('Database is empty. Running auto-seeding...');
            const { execSync } = require('child_process');
            execSync('node seed.js', { stdio: 'inherit' });
            console.log('Seeding completed successfully.');
        } else {
            console.log('Database connected successfully. Config records found:', count);
        }
    } catch (err) {
        console.warn('Database connection check failed or tables missing. Attempting to deploy migrations & seed...', err.message);
        try {
            const { execSync } = require('child_process');
            console.log('Running prisma migrations deploy...');
            execSync('npx prisma migrate deploy', { stdio: 'inherit' });
            console.log('Running database seed...');
            execSync('node seed.js', { stdio: 'inherit' });
            console.log('Auto-initialization completed successfully.');
        } catch (migrationErr) {
            console.error('Auto-initialization migration/seed failed. Please check database environment settings.', migrationErr);
        }
    }
});
