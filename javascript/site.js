// Theme Toggle
const themeToggle = document.getElementById('themeToggle');
const htmlElement = document.documentElement;

// Check for saved theme preference or default to light mode
const currentTheme = localStorage.getItem('theme') || 'light';
htmlElement.setAttribute('data-theme', currentTheme);

// Set initial toggle state
if (themeToggle) {
    themeToggle.checked = (currentTheme === 'dark');
}

// Update profile image based on current theme
function updateThemeIcon(theme) {
    const profileImage = document.getElementById('profileImage');
    
    // Update toggle checkbox state
    if (themeToggle) {
        themeToggle.checked = (theme === 'dark');
    }
    
    // Update profile image based on theme
    if (profileImage) {
        if (theme === 'dark') {
            profileImage.src = './image/new_formal-removebg-preview black.png';
            profileImage.setAttribute('data-normal', './image/new_formal-removebg-preview black.png');
            profileImage.setAttribute('data-hover', './image/ops-removebg-preview black.png');
        } else {
            profileImage.src = './image/new_formal-removebg-preview.png';
            profileImage.setAttribute('data-normal', './image/new_formal-removebg-preview.png');
            profileImage.setAttribute('data-hover', './image/ops-removebg-preview white.png');
        }
    }
}

// Initialize image
updateThemeIcon(currentTheme);

// Add hover effect for profile image
const profileImage = document.getElementById('profileImage');
if (profileImage) {
    profileImage.addEventListener('mouseenter', function() {
        const hoverSrc = this.getAttribute('data-hover');
        if (hoverSrc) {
            this.src = hoverSrc;
        }
    });
    
    profileImage.addEventListener('mouseleave', function() {
        const normalSrc = this.getAttribute('data-normal');
        if (normalSrc) {
            this.src = normalSrc;
        }
    });
}

// Toggle theme function
function toggleTheme() {
    const currentTheme = htmlElement.getAttribute('data-theme');
    const newTheme = currentTheme === 'light' ? 'dark' : 'light';
    
    htmlElement.setAttribute('data-theme', newTheme);
    localStorage.setItem('theme', newTheme);
    updateThemeIcon(newTheme);
}

// Add event listener for checkbox toggle
if (themeToggle) {
    themeToggle.addEventListener('change', toggleTheme);
}

// Make project cards clickable
document.addEventListener('DOMContentLoaded', function() {
    const projectCards = document.querySelectorAll('.project-card[data-url]');
    
    projectCards.forEach(card => {
        card.addEventListener('click', function(e) {
            // Don't trigger if clicking on a link inside the card
            if (e.target.tagName === 'A' || e.target.closest('a')) {
                return;
            }
            
            const url = this.getAttribute('data-url');
            if (url) {
                window.open(url, '_blank');
            }
        });
    });
});

// Typing Effect
const typingTextElement = document.getElementById('typing-text');
const roles = ["Express JS", "Node JS", "Firebase", "Java", "Firebase"];
let roleIndex = 0;
let charIndex = 0;
let isDeleting = false;
let typeSpeed = 100;

function typeEffect() {
    if (!typingTextElement) return;

    const currentRole = roles[roleIndex];
    
    if (isDeleting) {
        typingTextElement.textContent = currentRole.substring(0, charIndex - 1);
        charIndex--;
        typeSpeed = 50;
    } else {
        typingTextElement.textContent = currentRole.substring(0, charIndex + 1);
        charIndex++;
        typeSpeed = 100;
    }

    if (!isDeleting && charIndex === currentRole.length) {
        isDeleting = true;
        typeSpeed = 2000; // Pause at end
    } else if (isDeleting && charIndex === 0) {
        isDeleting = false;
        roleIndex = (roleIndex + 1) % roles.length;
        typeSpeed = 500; // Pause before next word
    }

    setTimeout(typeEffect, typeSpeed);
}

// Start typing effect
document.addEventListener('DOMContentLoaded', typeEffect);

// Scroll Animations (Intersection Observer)
const observerOptions = {
    threshold: 0.1,
    rootMargin: '0px 0px -50px 0px'
};

const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.classList.add('visible');
            
            // Animate progress bars if this is a skill section
            if (entry.target.classList.contains('glass-card')) { // Assuming bars are inside glass-cards that fade in
                 const progressBars = entry.target.querySelectorAll('.skill-bar-fill');
                 progressBars.forEach(bar => {
                     // Reset width to force transition (optional, but good for re-triggering if needed)
                     // Actually, CSS transition handles it if width is set inline.
                     // The inline style has the width. We need to make sure it animates from 0.
                     // A simple way is to store the target width in data attribute and set style.width to 0 initially in CSS or JS, then restore it here.
                     // But based on my CSS, the width is set in the HTML.
                     // Let's rely on the parent fading in for now, or add a specific class.
                 });
            }
            // For now, let's keep it simple with the fade-ins.
            // The CSS transition on .skill-bar-fill is 1.5s, so it will animate as the page loads/redraws.
            // But for a true scroll trigger, we might want to set width to 0 and then to value.
        }
    });
}, observerOptions);

const animateElements = document.querySelectorAll('.fade-in-up, .slide-in-left, .slide-in-right');
animateElements.forEach(el => observer.observe(el));

// Skill Bar Animation Trigger
// We can actually target skill bars specifically to ensure they animate ONLY when seen
const skillObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            const width = entry.target.getAttribute('style').match(/width:\s*(\d+)%/)[1];
            entry.target.style.width = '0%';
            setTimeout(() => {
                entry.target.style.width = width + '%';
            }, 100);
            skillObserver.unobserve(entry.target);
        }
    });
}, { threshold: 0.5 });

document.querySelectorAll('.skill-bar-fill').forEach(bar => {
    // Store original width if not already 0?
    // Actually, the HTML has style="width: 75%". 
    // The observer will snap it to 0 then animate it back to what's in style attribute.
    // However, getting the style from attribute might be tricky if I just set it to 0. 
    // Let's just rely on the 'visible' class of the parent or leave as is for simpler implementation first.
    // The previous code had a nice logic for this.
    
    // Retaining logic:
    const finalWidth = bar.style.width;
    bar.style.width = '0%'; // Start at 0
    
    // Create a specific observer for this bar or reuse one
    const barObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.style.width = finalWidth;
                barObserver.unobserve(entry.target);
            }
        });
    });
    barObserver.observe(bar);
});

// Smooth Scroll for Anchors
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        e.preventDefault();
        const target = document.querySelector(this.getAttribute('href'));
        if (target) {
            window.scrollTo({
                top: target.offsetTop - 80, // Adjust for fixed header
                behavior: 'smooth'
            });
        }
    });
});

// ========== PROJECT FILTERING ==========
const filterBtns = document.querySelectorAll('.filter-btn');
const projectCards = document.querySelectorAll('.project-card');

filterBtns.forEach(btn => {
    btn.addEventListener('click', () => {
        // Remove active class from all buttons
        filterBtns.forEach(b => b.classList.remove('active'));
        // Add active class to clicked button
        btn.classList.add('active');
        
        const filter = btn.getAttribute('data-filter');
        
        projectCards.forEach(card => {
            const tags = card.getAttribute('data-tags');
            
            if (filter === 'all' || tags.includes(filter)) {
                card.classList.remove('hidden');
                // Add fade-in animation
                card.style.animation = 'fadeIn 0.5s ease';
            } else {
                card.classList.add('hidden');
            }
        });
    });
});

// ========== PROJECT MODAL ==========
const modal = document.getElementById('projectModal');
const modalBody = document.getElementById('modalBody');
const modalClose = document.querySelector('.modal-close');
const modalOverlay = document.querySelector('.modal-overlay');
const viewDetailsBtns = document.querySelectorAll('.view-details-btn');

// Only run modal code if modal elements exist
if (modal && modalBody && modalClose && modalOverlay) {
    // Project data with detailed information
    const projectData = {
    gym: {
        title: 'Gym Management System (OGFMSI)',
        badge: 'Capstone Project',
        badgeColor: 'from-blue-600 to-purple-600',
        description: 'A comprehensive full-stack gym management solution designed to streamline operations for fitness centers.',
        role: 'Backend Developer',
        duration: '2024 - 2025',
        type: 'Team Project',
        features: [
            'Point of Sale (POS) system for membership and product sales',
            'Real-time inventory tracking and management',
            'Member check-in system with QR code scanning',
            'Staff management and role-based access control',
            'Revenue analytics and reporting dashboard',
            'Firebase real-time database integration'
        ],
        techStack: [
            { name: 'Express.js', icon: 'fas fa-server', description: 'Backend framework' },
            { name: 'MySQL', icon: 'fas fa-database', description: 'Primary database' },
            { name: 'Firebase', icon: 'fas fa-fire', description: 'Real-time features' },
            { name: 'Node.js', icon: 'fab fa-node', description: 'Runtime environment' },
        ],
        team: [
            { name: 'Vyzymz', linkedin: 'https://www.linkedin.com/in/vyzymz/' },
            { name: 'Kyan Villarin', linkedin: 'https://www.linkedin.com/in/kyanvillarin/' },
            { name: 'Jose De Jose', linkedin: 'https://www.linkedin.com/in/dejosejg/' }
        ],
        links: {
            demo: 'https://fitworxgymph.web.app/',
            github: 'https://github.com/deloyxd/ogfmsi'
        }
    },
    grade: {
        title: 'STI Grade Calculator',
        badge: 'Solo Project',
        badgeColor: 'from-green-600 to-teal-600',
        description: 'A specialized calculator tailored for STI College\'s unique grading system, helping students track their academic performance.',
        role: 'Full Stack Developer',
        duration: '2024',
        type: 'Solo Development',
        features: [
            'Custom calculation logic for STI grading system',
            'Local storage for saving calculation history',
            'Responsive design for mobile and desktop',
            'Export grades to PDF format',
            'Dark mode interface',
            'Grade prediction and GPA calculator'
        ],
        techStack: [
            { name: 'JavaScript', icon: 'fab fa-js', description: 'Core logic' },
            { name: 'HTML5', icon: 'fab fa-html5', description: 'Structure' },
            { name: 'CSS3', icon: 'fab fa-css3', description: 'Styling' },
            { name: 'LocalStorage', icon: 'fas fa-save', description: 'Data persistence' }
        ],
        links: {
            demo: 'https://grade-calculator-xi.vercel.app/',
            github: 'https://github.com/EnzoSoti/somethingnew'
        }
    },
    firebase: {
        title: 'Firebase CRUD Application',
        badge: 'Solo Project',
        badgeColor: 'from-green-600 to-teal-600',
        description: 'A real-time data management application showcasing Firebase integration capabilities with authentication and CRUD operations.',
        role: 'Full Stack Developer',
        duration: '2024',
        type: 'Solo Development',
        features: [
            'User authentication with Firebase Auth',
            'Real-time database synchronization',
            'Create, Read, Update, Delete operations',
            'Firestore database integration',
            'Responsive UI with modern design',
            'Secure data validation and error handling'
        ],
        techStack: [
            { name: 'Firebase', icon: 'fas fa-fire', description: 'Backend as a Service' },
            { name: 'JavaScript', icon: 'fab fa-js', description: 'Programming language' },
            { name: 'Firestore', icon: 'fas fa-database', description: 'NoSQL database' },
            { name: 'Firebase Auth', icon: 'fas fa-lock', description: 'Authentication' }
        ],
        links: {
            demo: 'https://firebase-sable-ten.vercel.app/',
            github: 'https://github.com/EnzoSoti/Firebase'
        }
    },
    weather: {
        title: 'React Weather Forecast App',
        badge: 'Solo Project',
        badgeColor: 'from-green-600 to-teal-600',
        description: 'A modern weather application built with React, consuming live weather APIs to provide accurate forecasts with geolocation support.',
        role: 'Frontend Developer',
        duration: '2024',
        type: 'Solo Development',
        features: [
            'Real-time weather data from OpenWeather API',
            'Geolocation-based automatic location detection',
            '5-day weather forecast',
            'Search by city name',
            'Temperature unit conversion (°C/°F)',
            'Beautiful weather animations and icons'
        ],
        techStack: [
            { name: 'React', icon: 'fab fa-react', description: 'Frontend library' },
            { name: 'JavaScript', icon: 'fab fa-js', description: 'Programming language' },
            { name: 'Weather API', icon: 'fas fa-cloud', description: 'Data source' },
            { name: 'CSS3', icon: 'fab fa-css3', description: 'Styling' }
        ],
        links: {
            demo: 'https://weather-project-react-iota.vercel.app/',
            github: 'https://github.com/EnzoSoti/weather-app'
        }
    }
};

// Open modal with project details
viewDetailsBtns.forEach(btn => {
    btn.addEventListener('click', () => {
        const projectId = btn.getAttribute('data-project');
        const project = projectData[projectId];
        
        if (project) {
            // Build modal content
            let teamSection = '';
            if (project.team) {
                teamSection = `
                    <div class="mb-6">
                        <h4 class="text-lg font-bold text-black mb-3 flex items-center">
                            <i class="fas fa-users text-purple-600 mr-2"></i>Team Members
                        </h4>
                        <div class="flex flex-wrap gap-3">
                            ${project.team.map(member => `
                                <a href="${member.linkedin}" target="_blank" 
                                   class="flex items-center gap-2 px-4 py-2 bg-blue-50 hover:bg-blue-100 border border-blue-200 rounded-lg transition-all">
                                    <i class="fab fa-linkedin text-blue-600"></i>
                                    <span class="text-sm text-gray-700">${member.name}</span>
                                </a>
                            `).join('')}
                        </div>
                    </div>
                `;
            }
            
            modalBody.innerHTML = `
                <div class="mb-6">
                    <div class="inline-block bg-gradient-to-r ${project.badgeColor} px-3 py-1 rounded-full text-xs font-bold text-white mb-3">
                        ${project.badge}
                    </div>
                    <h3 class="text-3xl font-bold text-black mb-2">${project.title}</h3>
                    <p class="text-gray-700 mb-4">${project.description}</p>
                    
                    <div class="grid grid-cols-2 gap-4 mb-4">
                        <div class="glass-panel p-3 rounded-lg">
                            <p class="text-xs text-gray-500 mb-1">Role</p>
                            <p class="text-sm font-semibold text-black">${project.role}</p>
                        </div>
                        <div class="glass-panel p-3 rounded-lg">
                            <p class="text-xs text-gray-500 mb-1">Duration</p>
                            <p class="text-sm font-semibold text-black">${project.duration}</p>
                        </div>
                    </div>
                </div>

                ${teamSection}

                <div class="mb-6">
                    <h4 class="text-lg font-bold text-black mb-3 flex items-center">
                        <i class="fas fa-star text-yellow-600 mr-2"></i>Key Features
                    </h4>
                    <ul class="space-y-2">
                        ${project.features.map(feature => `
                            <li class="flex items-start gap-2 text-gray-700 text-sm">
                                <i class="fas fa-check-circle text-green-600 mt-1"></i>
                                <span>${feature}</span>
                            </li>
                        `).join('')}
                    </ul>
                </div>

                <div class="mb-6">
                    <h4 class="text-lg font-bold text-black mb-3 flex items-center">
                        <i class="fas fa-code text-blue-600 mr-2"></i>Tech Stack
                    </h4>
                    <div class="grid grid-cols-2 gap-3">
                        ${project.techStack.map(tech => `
                            <div class="glass-panel p-3 rounded-lg flex items-center gap-3">
                                <i class="${tech.icon} text-2xl text-blue-600"></i>
                                <div>
                                    <p class="text-sm font-semibold text-black">${tech.name}</p>
                                    <p class="text-xs text-gray-600">${tech.description}</p>
                                </div>
                            </div>
                        `).join('')}
                    </div>
                </div>

                <div class="flex gap-3">
                    <a href="${project.links.demo}" target="_blank" 
                       class="flex-1 btn-primary text-center py-3 rounded-lg font-semibold">
                        <i class="fas fa-external-link-alt mr-2"></i>View Live Demo
                    </a>
                    <a href="${project.links.github}" target="_blank" 
                       class="flex-1 btn-secondary text-center py-3 rounded-lg font-semibold">
                        <i class="fab fa-github mr-2"></i>View Source Code
                    </a>
                </div>
            `;
            
            modal.classList.remove('hidden');
            document.body.style.overflow = 'hidden'; // Prevent background scrolling
        }
    });
});

    // Close modal
    function closeModal() {
        modal.classList.add('hidden');
        document.body.style.overflow = ''; // Restore scrolling
    }

    modalClose.addEventListener('click', closeModal);
    modalOverlay.addEventListener('click', closeModal);

    // Close modal on Escape key
    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape' && !modal.classList.contains('hidden')) {
            closeModal();
        }
    });
}

// Projects Modal Handler
document.addEventListener('DOMContentLoaded', () => {
    const viewAllBtn = document.getElementById('viewAllProjectsBtn');
    const projectsModal = document.getElementById('projectsModal');
    const closeModalBtn = document.getElementById('closeProjectsModal');

    if (viewAllBtn && projectsModal && closeModalBtn) {
        // Open modal
        viewAllBtn.addEventListener('click', () => {
            projectsModal.style.display = 'flex';
            document.body.style.overflow = 'hidden';
        });

        // Close modal on button click
        closeModalBtn.addEventListener('click', () => {
            projectsModal.style.display = 'none';
            document.body.style.overflow = '';
        });

        // Close modal on backdrop click
        projectsModal.addEventListener('click', (e) => {
            if (e.target === projectsModal) {
                projectsModal.style.display = 'none';
                document.body.style.overflow = '';
            }
        });

        // Close modal on Escape key
        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape' && projectsModal.style.display === 'flex') {
                projectsModal.style.display = 'none';
                document.body.style.overflow = '';
            }
        });
    }
});

// ========== RANDOM PROJECT ROTATION ==========
document.addEventListener('DOMContentLoaded', () => {
    const projectsGrid = document.getElementById('projectsGrid');
    if (!projectsGrid) return;

    const projectCards = Array.from(projectsGrid.querySelectorAll('.project-card'));
    const totalProjects = projectCards.length;
    const projectsToShow = 2; // Number of projects to display at a time

    function getRandomProjects() {
        // Create array of indices
        const indices = Array.from({ length: totalProjects }, (_, i) => i);
        
        // Shuffle the array
        for (let i = indices.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [indices[i], indices[j]] = [indices[j], indices[i]];
        }
        
        // Return first N indices
        return indices.slice(0, projectsToShow);
    }

    function rotateProjects() {
        const selectedIndices = getRandomProjects();
        
        projectCards.forEach((card, index) => {
            if (selectedIndices.includes(index)) {
                card.classList.remove('hidden');
            } else {
                card.classList.add('hidden');
            }
        });
    }

    // Initial display
    rotateProjects();

    // Rotate projects every 5 seconds
    setInterval(rotateProjects, 5000);
});
