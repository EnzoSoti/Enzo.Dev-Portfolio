const API_BASE = window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1'
    ? 'http://localhost:5000'
    : 'https://enzo-dev-portfolio.onrender.com';

const token = localStorage.getItem('adminToken');

// Auth guard
if (!token) {
    window.location.href = '/admin/index.html';
}

// ─── Helpers ──────────────────────────────────────────────────
function authHeaders() {
    return { 'Authorization': `Bearer ${token}`, 'Content-Type': 'application/json' };
}

function showToast(message, type = 'success') {
    const toast = document.getElementById('toast');
    toast.textContent = message;
    toast.className = `toast toast-${type} show`;
    setTimeout(() => toast.classList.remove('show'), 3000);
}

// ─── Tab Navigation ───────────────────────────────────────────
const tabBtns = document.querySelectorAll('.tab-btn');
const tabPanels = document.querySelectorAll('.tab-panel');

tabBtns.forEach(btn => {
    btn.addEventListener('click', () => {
        tabBtns.forEach(b => b.classList.remove('tab-active'));
        btn.classList.add('tab-active');

        const tabName = btn.dataset.tab;
        tabPanels.forEach(p => p.classList.add('hidden'));
        document.getElementById(`panel-${tabName}`).classList.remove('hidden');

        // Load tab-specific data
        if (tabName === 'contacts') loadContacts();
    });
});

// ─── General Config ───────────────────────────────────────────
const configFields = [
    'heroLabel', 'heroName1', 'heroName2', 'heroTagline',
    'aboutTitle', 'aboutText1', 'aboutText2',
    'badgeText', 'school', 'course', 'graduated', 'location',
    'contactText', 'email', 'profileImg'
];

async function loadConfig() {
    try {
        const res = await fetch(`${API_BASE}/api/portfolio`);
        const data = await res.json();
        const config = data.config;

        configFields.forEach(field => {
            const el = document.getElementById(`cfg-${field}`);
            if (el && config[field] !== undefined) {
                el.value = config[field];
            }
        });

        // Also load projects and experiences
        renderProjectsList(data.projects);
        renderExperiencesList(data.experiences);
    } catch (err) {
        showToast('Failed to load config', 'error');
    }
}

document.getElementById('saveConfigBtn').addEventListener('click', async () => {
    const payload = {};
    configFields.forEach(field => {
        const el = document.getElementById(`cfg-${field}`);
        if (el) payload[field] = el.value;
    });

    try {
        const res = await fetch(`${API_BASE}/api/portfolio/config`, {
            method: 'PUT',
            headers: authHeaders(),
            body: JSON.stringify(payload)
        });
        if (!res.ok) throw new Error('Update failed');
        showToast('Configuration saved successfully');
    } catch (err) {
        showToast('Failed to save config', 'error');
    }
});

// ─── Projects CRUD ────────────────────────────────────────────
function renderProjectsList(projects) {
    const container = document.getElementById('projectsList');
    if (!projects.length) {
        container.innerHTML = '<p class="text-xs opacity-30">No projects yet. Click "+ Add Project" to create one.</p>';
        return;
    }

    container.innerHTML = projects.map(p => `
        <div class="glass rounded-sm p-5 card-item flex items-center justify-between gap-4">
            <div class="flex-1 min-w-0">
                <div class="flex items-center gap-3 mb-1">
                    <h4 class="text-sm font-semibold truncate">${p.title}</h4>
                    ${p.featured ? '<span class="px-1.5 py-0.5 bg-accent/20 text-accent text-[9px] uppercase tracking-wider rounded-sm">Featured</span>' : ''}
                    ${p.badge ? `<span class="px-1.5 py-0.5 border border-accent/30 text-accent text-[9px] uppercase tracking-wider rounded-sm">${p.badge}</span>` : ''}
                </div>
                <p class="text-[11px] opacity-40 truncate">${p.description}</p>
                <div class="flex gap-1.5 mt-2">
                    ${p.tags.split(',').filter(t => t).map(t => `<span class="px-1.5 py-0.5 border border-cream/10 text-[9px] opacity-50 rounded-sm">${t.trim()}</span>`).join('')}
                </div>
            </div>
            <div class="flex gap-2 flex-shrink-0">
                <button onclick="editProject('${p.id}')" class="px-3 py-1.5 border border-cream/10 text-[10px] uppercase tracking-wider opacity-50 hover:opacity-100 hover:border-accent hover:text-accent transition-all">
                    Edit
                </button>
                <button onclick="deleteProject('${p.id}')" class="px-3 py-1.5 border border-red-500/20 text-red-400/50 text-[10px] uppercase tracking-wider hover:border-red-500/60 hover:text-red-400 transition-all">
                    Delete
                </button>
            </div>
        </div>
    `).join('');
}

let allProjects = [];

document.getElementById('addProjectBtn').addEventListener('click', () => {
    document.getElementById('projectModalTitle').textContent = 'New Project';
    document.getElementById('projectForm').reset();
    document.getElementById('proj-id').value = '';
    document.getElementById('proj-sortOrder').value = allProjects.length + 1;
    document.getElementById('projectModal').classList.remove('hidden');
});

document.getElementById('closeProjectModal').addEventListener('click', () => {
    document.getElementById('projectModal').classList.add('hidden');
});

window.editProject = async function(id) {
    const proj = allProjects.find(p => p.id === id);
    if (!proj) return;

    document.getElementById('projectModalTitle').textContent = 'Edit Project';
    document.getElementById('proj-id').value = proj.id;
    document.getElementById('proj-title').value = proj.title;
    document.getElementById('proj-description').value = proj.description;
    document.getElementById('proj-imageUrl').value = proj.imageUrl || '';
    document.getElementById('proj-liveUrl').value = proj.liveUrl || '';
    document.getElementById('proj-githubUrl').value = proj.githubUrl || '';
    document.getElementById('proj-tags').value = proj.tags || '';
    document.getElementById('proj-category').value = proj.category || '';
    document.getElementById('proj-badge').value = proj.badge || '';
    document.getElementById('proj-sortOrder').value = proj.sortOrder || 0;
    document.getElementById('proj-featured').checked = proj.featured || false;
    document.getElementById('projectModal').classList.remove('hidden');
};

window.deleteProject = async function(id) {
    if (!confirm('Delete this project?')) return;
    try {
        const res = await fetch(`${API_BASE}/api/projects/${id}`, {
            method: 'DELETE',
            headers: authHeaders()
        });
        if (!res.ok) throw new Error();
        showToast('Project deleted');
        refreshProjects();
    } catch (err) {
        showToast('Failed to delete project', 'error');
    }
};

document.getElementById('projectForm').addEventListener('submit', async (e) => {
    e.preventDefault();
    const id = document.getElementById('proj-id').value;
    const payload = {
        title: document.getElementById('proj-title').value,
        description: document.getElementById('proj-description').value,
        imageUrl: document.getElementById('proj-imageUrl').value,
        liveUrl: document.getElementById('proj-liveUrl').value,
        githubUrl: document.getElementById('proj-githubUrl').value,
        tags: document.getElementById('proj-tags').value,
        category: document.getElementById('proj-category').value,
        badge: document.getElementById('proj-badge').value,
        sortOrder: parseInt(document.getElementById('proj-sortOrder').value) || 0,
        featured: document.getElementById('proj-featured').checked
    };

    try {
        const url = id ? `${API_BASE}/api/projects/${id}` : `${API_BASE}/api/projects`;
        const method = id ? 'PUT' : 'POST';
        const res = await fetch(url, { method, headers: authHeaders(), body: JSON.stringify(payload) });
        if (!res.ok) throw new Error();
        showToast(id ? 'Project updated' : 'Project created');
        document.getElementById('projectModal').classList.add('hidden');
        refreshProjects();
    } catch (err) {
        showToast('Failed to save project', 'error');
    }
});

async function refreshProjects() {
    try {
        const res = await fetch(`${API_BASE}/api/projects`);
        allProjects = await res.json();
        renderProjectsList(allProjects);
    } catch (err) {
        showToast('Failed to load projects', 'error');
    }
}

// ─── Experience CRUD ──────────────────────────────────────────
let allExperiences = [];

function renderExperiencesList(experiences) {
    allExperiences = experiences;
    const container = document.getElementById('experiencesList');
    if (!experiences.length) {
        container.innerHTML = '<p class="text-xs opacity-30">No experiences yet.</p>';
        return;
    }

    container.innerHTML = experiences.map(e => {
        let bullets = [];
        try { bullets = JSON.parse(e.bullets); } catch (_) {}

        return `
            <div class="glass rounded-sm p-5 card-item flex items-center justify-between gap-4">
                <div class="flex-1 min-w-0">
                    <div class="flex items-center gap-3 mb-1">
                        <h4 class="text-sm font-semibold truncate">${e.company}</h4>
                        <span class="text-[10px] opacity-30 font-mono">${e.period}</span>
                    </div>
                    <p class="text-[11px] opacity-50">${e.role}</p>
                    <p class="text-[10px] opacity-30 mt-1">${bullets.length} bullet point${bullets.length !== 1 ? 's' : ''}</p>
                </div>
                <div class="flex gap-2 flex-shrink-0">
                    <button onclick="editExperience('${e.id}')" class="px-3 py-1.5 border border-cream/10 text-[10px] uppercase tracking-wider opacity-50 hover:opacity-100 hover:border-accent hover:text-accent transition-all">
                        Edit
                    </button>
                    <button onclick="deleteExperience('${e.id}')" class="px-3 py-1.5 border border-red-500/20 text-red-400/50 text-[10px] uppercase tracking-wider hover:border-red-500/60 hover:text-red-400 transition-all">
                        Delete
                    </button>
                </div>
            </div>
        `;
    }).join('');
}

document.getElementById('addExpBtn').addEventListener('click', () => {
    document.getElementById('expModalTitle').textContent = 'New Experience';
    document.getElementById('expForm').reset();
    document.getElementById('exp-id').value = '';
    document.getElementById('exp-sortOrder').value = allExperiences.length + 1;
    document.getElementById('expModal').classList.remove('hidden');
});

document.getElementById('closeExpModal').addEventListener('click', () => {
    document.getElementById('expModal').classList.add('hidden');
});

window.editExperience = function(id) {
    const exp = allExperiences.find(e => e.id === id);
    if (!exp) return;

    let bullets = [];
    try { bullets = JSON.parse(exp.bullets); } catch (_) {}

    document.getElementById('expModalTitle').textContent = 'Edit Experience';
    document.getElementById('exp-id').value = exp.id;
    document.getElementById('exp-role').value = exp.role;
    document.getElementById('exp-company').value = exp.company;
    document.getElementById('exp-period').value = exp.period;
    document.getElementById('exp-logoUrl').value = exp.logoUrl || '';
    document.getElementById('exp-bullets').value = bullets.join('\n');
    document.getElementById('exp-sortOrder').value = exp.sortOrder || 0;
    document.getElementById('expModal').classList.remove('hidden');
};

window.deleteExperience = async function(id) {
    if (!confirm('Delete this experience?')) return;
    try {
        const res = await fetch(`${API_BASE}/api/experiences/${id}`, {
            method: 'DELETE',
            headers: authHeaders()
        });
        if (!res.ok) throw new Error();
        showToast('Experience deleted');
        refreshExperiences();
    } catch (err) {
        showToast('Failed to delete experience', 'error');
    }
};

document.getElementById('expForm').addEventListener('submit', async (e) => {
    e.preventDefault();
    const id = document.getElementById('exp-id').value;
    const bulletsRaw = document.getElementById('exp-bullets').value;
    const bullets = bulletsRaw.split('\n').filter(b => b.trim()).map(b => b.trim());

    const payload = {
        role: document.getElementById('exp-role').value,
        company: document.getElementById('exp-company').value,
        period: document.getElementById('exp-period').value,
        logoUrl: document.getElementById('exp-logoUrl').value,
        bullets: JSON.stringify(bullets),
        sortOrder: parseInt(document.getElementById('exp-sortOrder').value) || 0
    };

    try {
        const url = id ? `${API_BASE}/api/experiences/${id}` : `${API_BASE}/api/experiences`;
        const method = id ? 'PUT' : 'POST';
        const res = await fetch(url, { method, headers: authHeaders(), body: JSON.stringify(payload) });
        if (!res.ok) throw new Error();
        showToast(id ? 'Experience updated' : 'Experience created');
        document.getElementById('expModal').classList.add('hidden');
        refreshExperiences();
    } catch (err) {
        showToast('Failed to save experience', 'error');
    }
});

async function refreshExperiences() {
    try {
        const res = await fetch(`${API_BASE}/api/experiences`);
        allExperiences = await res.json();
        renderExperiencesList(allExperiences);
    } catch (err) {
        showToast('Failed to load experiences', 'error');
    }
}

// ─── Contacts Inbox ───────────────────────────────────────────
async function loadContacts() {
    const container = document.getElementById('contactsList');
    try {
        const res = await fetch(`${API_BASE}/api/contacts`, { headers: authHeaders() });
        const contacts = await res.json();

        if (!contacts.length) {
            container.innerHTML = '<p class="text-xs opacity-30">No contact submissions yet.</p>';
            return;
        }

        container.innerHTML = contacts.map(c => `
            <div class="glass rounded-sm p-5 card-item">
                <div class="flex items-start justify-between gap-4 mb-3">
                    <div>
                        <h4 class="text-sm font-semibold">${c.name}</h4>
                        <a href="mailto:${c.email}" class="text-[11px] text-accent hover:underline">${c.email}</a>
                    </div>
                    <span class="text-[10px] opacity-30 font-mono whitespace-nowrap">${new Date(c.createdAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}</span>
                </div>
                <p class="text-xs opacity-60 leading-relaxed border-t border-cream/5 pt-3">${c.message}</p>
            </div>
        `).join('');
    } catch (err) {
        container.innerHTML = '<p class="text-xs text-red-400">Failed to load contacts.</p>';
    }
}

// ─── Logout ───────────────────────────────────────────────────
document.getElementById('logoutBtn').addEventListener('click', () => {
    localStorage.removeItem('adminToken');
    window.location.href = '/admin/index.html';
});

// ─── Init ─────────────────────────────────────────────────────
loadConfig();
