// Project Detail Modal Handler
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
