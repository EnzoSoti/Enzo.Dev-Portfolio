document.addEventListener('DOMContentLoaded', () => {
    // ═══════════════════════════════════════════════════════════
    // Clean URL Router (History API)
    // Maps /about → section#about, /projects → section#projects, etc.
    // ═══════════════════════════════════════════════════════════
    const ROUTE_SECTIONS = ['about', 'projects', 'gallery', 'contact', 'experience', 'testimonials'];

    function getRouteFromPath(pathname) {
        const clean = pathname.replace(/^\//, '').replace(/\.html$/, '').replace(/^index$/, '');
        return ROUTE_SECTIONS.includes(clean) ? clean : null;
    }

    function scrollToSection(sectionId) {
        const section = document.getElementById(sectionId);
        if (section) {
            section.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }
    }

    // Intercept nav link clicks to push clean URLs
    document.addEventListener('click', (e) => {
        const link = e.target.closest('a[data-route]');
        if (!link) return;
        e.preventDefault();
        const route = link.getAttribute('data-route');
        if (route) {
            history.pushState({ route }, '', '/' + route);
            scrollToSection(route);
        }
    });

    // Handle browser back/forward
    window.addEventListener('popstate', (e) => {
        if (e.state && e.state.route) {
            scrollToSection(e.state.route);
        } else {
            // Back to home — scroll to top
            window.scrollTo({ top: 0, behavior: 'smooth' });
        }
    });

    // On initial page load, check if the URL is a section route
    const initialRoute = getRouteFromPath(window.location.pathname);
    if (initialRoute) {
        // Replace current history entry so back goes to actual previous page
        history.replaceState({ route: initialRoute }, '', '/' + initialRoute);
        // Scroll after a short delay to let the page render
        requestAnimationFrame(() => {
            setTimeout(() => scrollToSection(initialRoute), 100);
        });
    }

    // Update URL on scroll to reflect which section is in view
    let scrollUpdateTimer = null;
    window.addEventListener('scroll', () => {
        clearTimeout(scrollUpdateTimer);
        scrollUpdateTimer = setTimeout(() => {
            let currentSection = null;
            for (const id of ROUTE_SECTIONS) {
                const el = document.getElementById(id);
                if (el) {
                    const rect = el.getBoundingClientRect();
                    if (rect.top <= 150 && rect.bottom > 150) {
                        currentSection = id;
                        break;
                    }
                }
            }

            const currentRoute = getRouteFromPath(window.location.pathname);
            if (currentSection && currentSection !== currentRoute) {
                history.replaceState({ route: currentSection }, '', '/' + currentSection);
            } else if (!currentSection && currentRoute) {
                // User scrolled back to top / hero
                history.replaceState(null, '', '/');
            }
        }, 150);
    }, { passive: true });

    // Theme toggle logic
    const toggle = document.getElementById('themeToggle');
    const html = document.documentElement;
    if (localStorage.theme === 'dark' || (!localStorage.theme && window.matchMedia('(prefers-color-scheme: dark)').matches)) {
        html.classList.add('dark');
    }
    if (toggle) {
        toggle.addEventListener('click', (event) => {
            const toggleTheme = () => {
                html.classList.toggle('dark');
                localStorage.theme = html.classList.contains('dark') ? 'dark' : 'light';
            };

            // Respect user preference for reduced motion
            const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

            // If View Transitions API is not supported or user prefers reduced motion, fallback to instant toggle
            if (!document.startViewTransition || prefersReducedMotion) {
                toggleTheme();
                return;
            }

            // Get the click position, or default to center of the toggle button (e.g. keyboard navigation)
            const rect = toggle.getBoundingClientRect();
            const x = event.clientX ?? (rect.left + rect.width / 2);
            const y = event.clientY ?? (rect.top + rect.height / 2);

            // Calculate the distance to the furthest corner of the viewport
            const endRadius = Math.hypot(
                Math.max(x, window.innerWidth - x),
                Math.max(y, window.innerHeight - y)
            );

            // Add transition class to temporarily disable CSS transitions on the layout
            html.classList.add('transitioning');

            const transition = document.startViewTransition(() => {
                toggleTheme();
            });

            transition.ready.then(() => {
                document.documentElement.animate(
                    {
                        clipPath: [
                            `circle(0px at ${x}px ${y}px)`,
                            `circle(${endRadius}px at ${x}px ${y}px)`
                        ],
                    },
                    {
                        duration: 450,
                        easing: 'cubic-bezier(0.4, 0, 0.2, 1)',
                        pseudoElement: '::view-transition-new(root)',
                    }
                );
            });

            // Clean up transitioning class when transition finishes
            transition.finished.then(() => {
                html.classList.remove('transitioning');
            });
        });
    }

    // Scroll animation observer
    const revealObserver = new IntersectionObserver((entries) => {
        entries.forEach(e => {
            if (e.isIntersecting) {
                e.target.classList.add('revealed');
                revealObserver.unobserve(e.target);
            }
        });
    }, { threshold: 0.05, rootMargin: "0px 0px -50px 0px" });
    document.querySelectorAll('.reveal-up, .reveal-fade').forEach(el => revealObserver.observe(el));

    // Prevent page jump for non-deployed project cards (Event Delegation)
    document.body.addEventListener('click', (e) => {
        const card = e.target.closest('a.project-card[href="#"]');
        if (card) e.preventDefault();
    });

    // Image Lightbox Modal logic (Event Delegation)
    const imageModal = document.getElementById('imageModal');
    const modalImage = document.getElementById('modalImage');
    const closeModal = document.getElementById('closeModal');

    if (imageModal && modalImage) {
        document.body.addEventListener('click', (e) => {
            const img = e.target.closest('.previewable-img');
            if (img) {
                e.preventDefault();
                e.stopPropagation();
                
                modalImage.src = img.src;
                modalImage.alt = img.alt;
                imageModal.classList.remove('hidden');
                
                // Trigger reflow to initiate transition
                imageModal.offsetHeight;
                imageModal.classList.remove('opacity-0');
                modalImage.classList.remove('scale-95');
                modalImage.classList.add('scale-100');
                document.body.style.overflow = 'hidden'; // Prevent main page scrolling
            }
        });

        function hideModal() {
            imageModal.classList.add('opacity-0');
            modalImage.classList.remove('scale-100');
            modalImage.classList.add('scale-95');
            setTimeout(() => {
                imageModal.classList.add('hidden');
                document.body.style.overflow = ''; // Restore page scrolling
            }, 300);
        }

        imageModal.addEventListener('click', hideModal);
        if (closeModal) {
            closeModal.addEventListener('click', hideModal);
        }

        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape' && !imageModal.classList.contains('hidden')) {
                hideModal();
            }
        });
    }

    // 1. Preloader fadeout
    const preloader = document.getElementById('preloader');
    if (preloader) {
        preloader.classList.add('opacity-0', 'pointer-events-none');
        setTimeout(() => {
            preloader.remove();
        }, 500);
    }

    // 2. Scroll Progress indicator
    window.addEventListener('scroll', () => {
        const winScroll = document.documentElement.scrollTop || document.body.scrollTop;
        const height = document.documentElement.scrollHeight - document.documentElement.clientHeight;
        const scrolled = height > 0 ? (winScroll / height) * 100 : 0;
        const scrollBar = document.getElementById('scrollProgress');
        if (scrollBar) {
            scrollBar.style.width = scrolled + '%';
        }
    });

    // 3. Custom Fluid Cursor logic
    const cursor = document.getElementById('customCursor');
    const cursorDot = document.getElementById('customCursorDot');
    let mouseX = 0, mouseY = 0;
    let posX = 0, posY = 0;

    document.addEventListener('mousemove', (e) => {
        mouseX = e.clientX;
        mouseY = e.clientY;
        if (cursorDot) {
            cursorDot.style.left = mouseX + 'px';
            cursorDot.style.top = mouseY + 'px';
        }
    });

    function animateCursor() {
        const distX = mouseX - posX;
        const distY = mouseY - posY;
        posX += distX * 0.15;
        posY += distY * 0.15;
        if (cursor) {
            cursor.style.left = posX + 'px';
            cursor.style.top = posY + 'px';
        }
        requestAnimationFrame(animateCursor);
    }
    animateCursor();

    // Cursor interactions (Event Delegation)
    const hoverables = 'a, button, input, textarea, .previewable-img, .filter-btn, #themeToggle, .tech-pill';
    document.addEventListener('mouseover', (e) => {
        const el = e.target.closest(hoverables);
        if (el && cursor) {
            cursor.classList.add('scale-150', 'bg-accent/10');
            if (el.classList.contains('previewable-img') || el.id === 'themeToggle') {
                cursor.classList.add('border-dashed');
            }
        }
    });
    document.addEventListener('mouseout', (e) => {
        const el = e.target.closest(hoverables);
        if (el && cursor) {
            cursor.classList.remove('scale-150', 'bg-accent/10', 'border-dashed');
        }
    });

    // Reusable binding function for interactive cards and dynamic lists
    function bindDynamicInteractions() {
        // 4. 3D Project Card Tilt Effect
        document.querySelectorAll('.project-card').forEach(card => {
            card.addEventListener('mousemove', (e) => {
                const rect = card.getBoundingClientRect();
                const x = e.clientX - rect.left;
                const y = e.clientY - rect.top;
                const xc = rect.width / 2;
                const yc = rect.height / 2;
                const angleX = (yc - y) / 12; // tilt amount
                const angleY = (x - xc) / 12;
                
                card.style.transform = `perspective(1000px) rotateX(${angleX}deg) rotateY(${angleY}deg) scale3d(1.02, 1.02, 1.02)`;
            });
            card.addEventListener('mouseleave', () => {
                card.style.transform = 'perspective(1000px) rotateX(0deg) rotateY(0deg) scale3d(1, 1, 1)';
            });
        });

        // 5. Connected Tech Stack Highlighter
        document.querySelectorAll('.tech-pill').forEach(pill => {
            pill.addEventListener('mouseenter', () => {
                const techName = pill.textContent.trim().toLowerCase();
                document.querySelectorAll('.tech-pill').forEach(other => {
                    if (other.textContent.trim().toLowerCase() === techName) {
                        other.classList.add('bg-accent/20', 'border-accent', 'text-accent');
                    }
                });
            });
            pill.addEventListener('mouseleave', () => {
                document.querySelectorAll('.tech-pill').forEach(other => {
                    other.classList.remove('bg-accent/20', 'border-accent', 'text-accent');
                });
            });
        });

        // Re-observe elements for reveal-up animations
        document.querySelectorAll('.reveal-up, .reveal-fade').forEach(el => revealObserver.observe(el));
    }

    // Dynamic Filter Rebinding Helper
    function setupProjectFilters() {
        const filterButtons = document.querySelectorAll('.filter-btn');
        filterButtons.forEach(btn => {
            btn.addEventListener('click', () => {
                filterButtons.forEach(b => {
                    b.classList.remove('active', 'bg-accent', 'text-cream', 'border-accent');
                    b.classList.add('border-ink/20', 'dark:border-cream/20', 'opacity-60');
                });
                btn.classList.add('active', 'bg-accent', 'text-cream', 'border-accent');
                btn.classList.remove('border-ink/20', 'dark:border-cream/20', 'opacity-60');

                const filterValue = btn.getAttribute('data-filter');
                const filterableProjects = document.querySelectorAll('.filterable-project');

                filterableProjects.forEach(project => {
                    const categories = (project.getAttribute('data-category') || 'all').split(' ');
                    if (filterValue === 'all' || categories.includes(filterValue)) {
                        project.style.display = 'block';
                        setTimeout(() => {
                            project.style.opacity = '1';
                            project.style.transform = 'scale(1)';
                        }, 50);
                    } else {
                        project.style.opacity = '0';
                        project.style.transform = 'scale(0.95)';
                        setTimeout(() => {
                            if (project.style.opacity === '0') {
                                project.style.display = 'none';
                            }
                        }, 300);
                    }
                });
            });
        });
    }

    // API Server Configuration
    const API_BASE_URL = window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1'
        ? 'http://localhost:5000'
        : 'https://enzo-dev-portfolio.onrender.com';

    function normalizeProfileImagePath(value, basePath = './image/') {
        const trimmed = (value || '').trim();
        if (!trimmed) return '';
        if (/^(https?:)?\/\//i.test(trimmed) || trimmed.startsWith('./') || trimmed.startsWith('../') || trimmed.startsWith('/')) {
            return trimmed;
        }
        return `${basePath}${trimmed}`;
    }

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

    function renderGallery(galleryItems) {
        const track = document.getElementById('galleryTrack');
        if (!track) return;
        
        if (!galleryItems || galleryItems.length === 0) {
            track.innerHTML = '<div class="w-full text-center py-12 opacity-40 text-xs">No gallery items available.</div>';
            return;
        }

        track.innerHTML = galleryItems.map((item, index) => {
            const slideNum = String(index + 1).padStart(2, '0');
            return `
                <div class="gallery-slide flex-shrink-0 w-[85vw] sm:w-[70vw] md:w-[45vw] lg:w-[38vw]" data-caption="${item.title}">
                    <div class="gallery-item group overflow-hidden border border-ink/10 dark:border-cream/10 relative font-mono">
                        <div class="overflow-hidden aspect-[3/2]">
                            ${item.imageUrl ? `<img src="${item.imageUrl}" alt="${item.title}" class="previewable-img w-full h-full object-cover grayscale group-hover:grayscale-0 group-hover:scale-105 transition-all duration-700 ease-out">` : `
                            <div class="w-full h-full bg-ink/5 dark:bg-cream/5 flex items-center justify-center">
                                <span class="text-[10px] uppercase tracking-widest opacity-40">Gallery Image</span>
                            </div>`}
                        </div>
                        <div class="absolute inset-0 bg-gradient-to-t from-ink/70 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none flex items-end">
                            <div class="p-5">
                                <p class="text-cream text-[10px] tracking-widest uppercase font-semibold">Scroll to explore →</p>
                            </div>
                        </div>
                    </div>
                    <div class="pt-4 flex items-start justify-between gap-4">
                        <div>
                            <p class="text-xs font-semibold tracking-wider uppercase mb-1">${item.title}</p>
                            <p class="text-[10px] opacity-50 leading-relaxed max-w-xs">${item.description || ''}</p>
                        </div>
                        <span class="text-[10px] opacity-20 font-mono mt-0.5 flex-shrink-0">${slideNum}</span>
                    </div>
                </div>
            `;
        }).join('');

        const totalSlidesEl = document.getElementById('galleryTotalSlides');
        if (totalSlidesEl) {
            totalSlidesEl.textContent = String(galleryItems.length).padStart(2, '0');
        }
    }

    // 6b. Client Hydration logic
    async function hydratePortfolio() {
        try {
            console.log('Hydrating portfolio data from API...');
            const res = await fetch(`${API_BASE_URL}/api/portfolio`);
            if (!res.ok) throw new Error('Failed to fetch portfolio data');
            const data = await res.json();
            
            // 1. Hydrate text fields
            const cfg = data.config;
            if (cfg) {
                if (document.getElementById('dyn-heroLabel')) document.getElementById('dyn-heroLabel').textContent = cfg.heroLabel;
                if (document.getElementById('dyn-heroName1')) document.getElementById('dyn-heroName1').textContent = cfg.heroName1;
                if (document.getElementById('dyn-heroName2')) document.getElementById('dyn-heroName2').textContent = cfg.heroName2;
                if (document.getElementById('dyn-heroTagline')) document.getElementById('dyn-heroTagline').textContent = cfg.heroTagline;
                
                if (document.getElementById('dyn-profileImg') && cfg.profileImg) document.getElementById('dyn-profileImg').src = normalizeProfileImagePath(cfg.profileImg);
                if (document.getElementById('dyn-badgeText')) document.getElementById('dyn-badgeText').textContent = cfg.badgeText;
                
                if (document.getElementById('dyn-school')) document.getElementById('dyn-school').textContent = cfg.school;
                if (document.getElementById('dyn-course')) document.getElementById('dyn-course').textContent = cfg.course;
                if (document.getElementById('dyn-graduated')) document.getElementById('dyn-graduated').textContent = cfg.graduated;
                if (document.getElementById('dyn-location')) document.getElementById('dyn-location').textContent = cfg.location;
                
                if (document.getElementById('dyn-aboutTitle')) document.getElementById('dyn-aboutTitle').textContent = cfg.aboutTitle;
                if (document.getElementById('dyn-aboutText1')) document.getElementById('dyn-aboutText1').textContent = cfg.aboutText1;
                if (document.getElementById('dyn-aboutText2')) document.getElementById('dyn-aboutText2').textContent = cfg.aboutText2;
                
                if (document.getElementById('dyn-contactText')) document.getElementById('dyn-contactText').textContent = cfg.contactText;
                
                if (cfg.email) {
                    if (document.getElementById('dyn-contactEmailLink')) document.getElementById('dyn-contactEmailLink').href = `mailto:${cfg.email}`;
                    if (document.getElementById('dyn-contactEmailText')) document.getElementById('dyn-contactEmailText').textContent = `${cfg.email} ↗`;
                    if (document.getElementById('dyn-hireMeBtn')) document.getElementById('dyn-hireMeBtn').href = `mailto:${cfg.email}`;
                }
            }

            // 2. Hydrate Projects
            const projects = data.projects;
            if (projects && projects.length > 0) {
                const projContainer = document.getElementById('dyn-projectsContainer');
                if (projContainer) {
                    const featured = projects.find(p => p.featured) || projects[0];
                    const rest = projects.filter(p => p !== featured);
                    
                    let projHtml = '';
                    if (featured) {
                        projHtml += `
                            <!-- Featured project -->
                            <a href="${featured.liveUrl || featured.githubUrl || '#'}" target="_blank"
                                class="project-card filterable-project block group mb-6 transition-all duration-300 transform scale-100 opacity-100 reveal-up delay-100"
                                data-category="${featured.category || 'all'}">
                                <div class="overflow-hidden border border-ink/10 dark:border-cream/10">
                                    <div class="relative">
                                        ${featured.imageUrl ? `<img src="${featured.imageUrl}" alt="${featured.title}" class="project-img previewable-img w-full h-72 object-cover">` : `
                                        <div class="w-full h-72 bg-ink/5 dark:bg-cream/5 flex items-center justify-center border-b border-ink/10 dark:border-cream/10">
                                            <span class="text-[10px] uppercase tracking-widest opacity-40">Internal System</span>
                                        </div>`}
                                        <div class="absolute inset-0 bg-ink/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center pointer-events-none">
                                            <span class="text-cream text-sm tracking-widest uppercase">${featured.liveUrl ? 'View Live ↗' : (featured.githubUrl ? 'View Code ↗' : 'Internal System')}</span>
                                        </div>
                                    </div>
                                    <div class="p-6 flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4 border-t border-ink/10 dark:border-cream/10">
                                        <div>
                                            <div class="flex items-center gap-3 mb-2">
                                                <h3 class="text-lg font-semibold">${featured.title}</h3>
                                                ${featured.badge ? `<span class="px-2 py-0.5 bg-accent text-cream text-xs tracking-wider uppercase">${featured.badge}</span>` : ''}
                                            </div>
                                            <p class="text-sm opacity-60 max-w-md">${featured.description}</p>
                                        </div>
                                        <div class="flex flex-wrap gap-2 sm:text-right sm:justify-end">
                                            ${featured.tags.split(',').filter(t => t).map(t => `<span class="tech-pill px-2 py-1 border border-ink/20 dark:border-cream/20 text-xs transition-all duration-200">${t.trim()}</span>`).join('')}
                                        </div>
                                    </div>
                                </div>
                            </a>
                        `;
                    }
                    
                    if (rest.length > 0) {
                        projHtml += `<div class="grid md:grid-cols-3 gap-4 reveal-up delay-200">`;
                        rest.forEach(p => {
                            projHtml += `
                                <a href="${p.liveUrl || p.githubUrl || '#'}" target="_blank"
                                    class="project-card filterable-project group block border border-ink/10 dark:border-cream/10 overflow-hidden transition-all duration-300 transform scale-100 opacity-100"
                                    data-category="${p.category || 'all'}">
                                    <div class="overflow-hidden relative">
                                        ${p.imageUrl ? `<img src="${p.imageUrl}" alt="${p.title}" class="project-img previewable-img w-full h-40 object-cover">` : `
                                        <div class="w-full h-40 bg-ink/5 dark:bg-cream/5 flex flex-col items-center justify-center border-b border-ink/10 dark:border-cream/10 relative transition-colors group-hover:bg-ink/10 dark:group-hover:bg-cream/10">
                                            <span class="text-[10px] uppercase tracking-widest opacity-40">Internal Tool</span>
                                        </div>`}
                                        <div class="absolute inset-0 bg-ink/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center pointer-events-none">
                                            <span class="text-cream text-xs tracking-widest uppercase">${p.liveUrl ? 'View Live ↗' : (p.githubUrl ? 'View Code ↗' : 'Internal System')}</span>
                                        </div>
                                    </div>
                                    <div class="p-4 border-t border-ink/10 dark:border-cream/10">
                                        <div class="flex items-center justify-between gap-2 mb-1">
                                            <h3 class="text-sm font-semibold group-hover:text-accent transition-colors truncate">${p.title}</h3>
                                            ${p.badge ? `<span class="px-1.5 py-0.5 border border-accent/40 text-[9px] uppercase tracking-wider text-accent font-semibold rounded-sm">${p.badge}</span>` : ''}
                                        </div>
                                        <p class="text-xs opacity-50 mb-3">${p.description}</p>
                                        <div class="flex flex-wrap gap-1.5 mt-2">
                                            ${p.tags.split(',').filter(t => t).map(t => `<span class="tech-pill px-1.5 py-0.5 border border-ink/10 dark:border-cream/10 text-[10px] opacity-60 rounded-sm transition-all duration-200">${t.trim()}</span>`).join('')}
                                        </div>
                                    </div>
                                </a>
                            `;
                        });
                        projHtml += `</div>`;
                    }
                    projContainer.innerHTML = projHtml;
                }
            }

            // 3. Hydrate Experiences
            const experiences = data.experiences;
            if (experiences && experiences.length > 0) {
                const expContainer = document.getElementById('dyn-experiencesContainer');
                if (expContainer) {
                    let expHtml = '';
                    experiences.forEach((exp, idx) => {
                        let bullets = [];
                        try { bullets = JSON.parse(exp.bullets); } catch (_) {}
                        
                        const isLast = idx === experiences.length - 1;
                        const borderClass = isLast ? '' : 'border-b border-ink/10 dark:border-cream/10 pb-8';
                        
                        expHtml += `
                            <div class="${borderClass}">
                                <div class="flex items-start gap-4 mb-4">
                                    ${exp.logoUrl ? `<img src="${exp.logoUrl}" alt="${exp.company} Logo" class="w-12 h-12 object-contain bg-white dark:bg-transparent p-1 rounded">` : `
                                    <div class="w-12 h-12 bg-accent/10 flex items-center justify-center text-accent text-lg font-semibold rounded">${exp.company.substring(0,2).toUpperCase()}</div>`}
                                    <div class="flex-1">
                                        <div class="flex flex-col sm:flex-row sm:items-baseline sm:justify-between gap-1">
                                            <h3 class="text-lg font-semibold text-accent">${exp.company}</h3>
                                            <span class="text-xs opacity-50 font-mono">${exp.period}</span>
                                        </div>
                                        <p class="text-sm font-semibold opacity-80">${exp.role}</p>
                                    </div>
                                </div>
                                <ul class="space-y-3">
                                    ${bullets.map(bullet => `
                                        <li class="flex items-start gap-3 text-sm opacity-70">
                                            <span class="text-accent mt-1.5 w-1.5 h-1.5 bg-accent rounded-full flex-shrink-0"></span>
                                            <span>${bullet}</span>
                                        </li>
                                    `).join('')}
                                </ul>
                            </div>
                        `;
                    });
                    expContainer.innerHTML = expHtml;
                }
            }

            // 4. Hydrate Gallery
            const gallery = data.gallery;
            if (gallery && gallery.length > 0) {
                renderGallery(gallery);
            } else {
                renderGallery(DEFAULT_GALLERY);
            }

            console.log('Hydration complete!');
        } catch (err) {
            console.warn('Hydration failed or server is offline, using premium offline fallback.', err);
            renderGallery(DEFAULT_GALLERY);
        } finally {
            // Bind tilt, hover, stack lights, and animations onto either loaded or fallback cards
            bindDynamicInteractions();
            setupProjectFilters();
            initGallerySlider();
        }
    }

    // Initialize Hydration and Page Setup
    hydratePortfolio();

    // 6. Contact Form API Submission & Dispatch
    const contactForm = document.getElementById('contactForm');
    const submitBtn = document.getElementById('formSubmitBtn');
    const submitText = document.getElementById('submitBtnText');
    const submitIcon = document.getElementById('submitBtnIcon');

    if (contactForm && submitBtn) {
        contactForm.addEventListener('submit', async (e) => {
            e.preventDefault();
            
            const name = document.getElementById('formName').value;
            const email = document.getElementById('formEmail').value;
            const message = document.getElementById('formMessage').value;
            
            // Animate to loading state
            submitBtn.disabled = true;
            submitBtn.classList.remove('bg-ink', 'dark:bg-cream');
            submitBtn.classList.add('bg-accent', 'text-cream');
            submitText.textContent = "Sending...";
            submitIcon.innerHTML = `<svg class="animate-spin h-3.5 w-3.5 text-cream" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24"><circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle><path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path></svg>`;
            submitIcon.classList.remove('transition-transform');
            
            const resetBtn = () => {
                contactForm.reset();
                submitBtn.disabled = false;
                submitBtn.className = "w-full inline-flex items-center justify-center gap-3 px-6 py-3 bg-ink text-cream dark:bg-cream dark:text-ink text-xs tracking-widest uppercase hover:opacity-90 transition-all duration-300 border border-transparent";
                submitText.textContent = "Send Message";
                submitIcon.innerHTML = "→";
                submitIcon.classList.add('transition-transform');
            };

            try {
                // Attempt to send to Express API
                const response = await fetch(`${API_BASE_URL}/api/contact`, {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ name, email, message })
                });

                if (!response.ok) throw new Error('API server returned error');
                
                // Success: Database entry created
                submitBtn.classList.remove('bg-accent');
                submitBtn.classList.add('bg-emerald-600', 'text-cream');
                submitText.textContent = "Message Saved!";
                submitIcon.innerHTML = `<svg class="h-3.5 w-3.5 text-cream" fill="none" stroke="currentColor" stroke-width="3" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" d="M5 13l4 4L19 7"></path></svg>`;
                
                setTimeout(resetBtn, 2000);
            } catch (error) {
                console.warn('API submission failed, falling back to mailto:', error);
                
                // Fallback: Transition to mailto launcher
                submitBtn.classList.remove('bg-accent');
                submitBtn.classList.add('bg-emerald-600', 'text-cream');
                submitText.textContent = "Launching Mail...";
                submitIcon.innerHTML = `<svg class="h-3.5 w-3.5 text-cream" fill="none" stroke="currentColor" stroke-width="3" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" d="M5 13l4 4L19 7"></path></svg>`;
                
                setTimeout(() => {
                    window.location.href = `mailto:parane.enzo@gmail.com?subject=Inquiry from ${encodeURIComponent(name)}&body=${encodeURIComponent(message)}%0A%0AReply to: ${encodeURIComponent(email)}`;
                    setTimeout(resetBtn, 2000);
                }, 800);
            }
        });
    }

    // 6a. Live GitHub Stats API Fetching
    async function initGithubStats() {
        const reposEl = document.getElementById('gh-repos');
        const starsEl = document.getElementById('gh-stars');
        const activityEl = document.getElementById('gh-activity');
        
        try {
            const response = await fetch(`${API_BASE_URL}/api/github-stats`);
            if (!response.ok) throw new Error('API server unreachable');
            const data = await response.json();
            
            if (reposEl) reposEl.textContent = data.repos;
            if (starsEl) starsEl.textContent = data.stars;
            if (activityEl) {
                activityEl.textContent = data.activity;
                activityEl.classList.remove('opacity-80');
                activityEl.classList.add('text-accent', 'font-semibold');
            }
        } catch (error) {
            console.warn('GitHub stats fetch failed. Using fallback:', error);
            // Default static values on failure
            if (reposEl) reposEl.textContent = "12";
            if (starsEl) starsEl.textContent = "3";
            if (activityEl) activityEl.textContent = "Pushed to Enzo.Dev-Portfolio: \"Update theme reveal\"";
        }
    }
    initGithubStats();

    // 6b. Interactive Request-Response Flow Visualizer
    function updateFlowPaths() {
        const svg = document.querySelector('#node-client')?.closest('.relative')?.querySelector('svg');
        if (!svg) return null;
        const rect = svg.getBoundingClientRect();
        
        const clientCircle = document.querySelector('#node-client .node-circle')?.getBoundingClientRect();
        const apiCircle = document.querySelector('#node-api .node-circle')?.getBoundingClientRect();
        const dbCircle = document.querySelector('#node-db .node-circle')?.getBoundingClientRect();
        
        if (!clientCircle || !apiCircle || !dbCircle) return null;
        
        const clientX = (clientCircle.left + clientCircle.right) / 2 - rect.left;
        const clientY = (clientCircle.top + clientCircle.bottom) / 2 - rect.top;
        
        const apiX = (apiCircle.left + apiCircle.right) / 2 - rect.left;
        const apiY = (apiCircle.top + apiCircle.bottom) / 2 - rect.top;
        
        const dbX = (dbCircle.left + dbCircle.right) / 2 - rect.left;
        const dbY = (dbCircle.top + dbCircle.bottom) / 2 - rect.top;
        
        const pathApi = document.getElementById('flow-path-api');
        const pathDb = document.getElementById('flow-path-db');
        
        if (pathApi) pathApi.setAttribute('d', `M ${clientX},${clientY} L ${apiX},${apiY}`);
        if (pathDb) pathDb.setAttribute('d', `M ${apiX},${apiY} L ${dbX},${dbY}`);
        
        return { clientX, clientY, apiX, apiY, dbX, dbY };
    }
    
    // Calculate path locations on load and window resizing
    setTimeout(updateFlowPaths, 500);
    window.addEventListener('resize', updateFlowPaths);
    
    // Packet Animator along visual path
    function animatePacket(packetId, ax, ay, bx, by, duration = 650) {
        const packet = document.getElementById(packetId);
        if (!packet) return Promise.resolve();
        packet.setAttribute('opacity', '1');
        const startTime = performance.now();
        
        return new Promise(resolve => {
            function update(time) {
                const elapsed = time - startTime;
                const progress = Math.min(elapsed / duration, 1);
                
                // Ease-in-out movement interpolation
                const ease = progress < 0.5 ? 2 * progress * progress : 1 - Math.pow(-2 * progress + 2, 2) / 2;
                
                const x = ax + (bx - ax) * ease;
                const y = ay + (by - ay) * ease;
                
                packet.setAttribute('cx', x);
                packet.setAttribute('cy', y);
                
                if (progress < 1) {
                    requestAnimationFrame(update);
                } else {
                    packet.setAttribute('opacity', '0');
                    resolve();
                }
            }
            requestAnimationFrame(update);
        });
    }
    
    // Terminal emulator helper
    const flowConsole = document.getElementById('flow-console');
    function logConsole(message, type = 'accent') {
        if (!flowConsole) return;
        const span = document.createElement('span');
        if (type === 'accent') {
            span.className = 'text-accent';
        } else if (type === 'success') {
            span.className = 'text-emerald-500';
        } else if (type === 'error') {
            span.className = 'text-red-500';
        } else {
            span.className = 'text-cream/70';
        }
        span.textContent = `> ${message}`;
        flowConsole.appendChild(span);
        flowConsole.scrollTop = flowConsole.scrollHeight;
    }
    
    // Simulation Trigger
    const simulateBtn = document.getElementById('simulateBtn');
    let isSimulating = false;
    
    if (simulateBtn) {
        simulateBtn.addEventListener('click', async () => {
            if (isSimulating) return;
            isSimulating = true;
            simulateBtn.disabled = true;
            simulateBtn.textContent = "Simulating...";
            
            if (flowConsole) flowConsole.innerHTML = '';
            
            const coords = updateFlowPaths();
            if (!coords) {
                isSimulating = false;
                simulateBtn.disabled = false;
                simulateBtn.textContent = "Simulate Request";
                return;
            }
            
            const { clientX, clientY, apiX, apiY, dbX, dbY } = coords;
            
            const clientNode = document.getElementById('node-client');
            const apiNode = document.getElementById('node-api');
            const dbNode = document.getElementById('node-db');
            
            // 1. Client Trigger
            clientNode.classList.add('active');
            logConsole('Client initiating GET /api/ping request...', 'info');
            await animatePacket('packet-client-to-api', clientX, clientY, apiX, apiY, 700);
            clientNode.classList.remove('active');
            
            // 2. Express API receive
            apiNode.classList.add('active');
            logConsole('Express Server (PORT 5000): GET /api/ping received.', 'accent');
            logConsole('Express Server: Authenticating database context...', 'accent');
            await new Promise(r => setTimeout(r, 450));
            
            // 3. API Database querying
            await animatePacket('packet-api-to-db', apiX, apiY, dbX, dbY, 700);
            apiNode.classList.remove('active');
            
            // 4. Database execution
            dbNode.classList.add('active');
            logConsole('Firebase Firestore: Querying cached document cache/github-stats...', 'info');
            
            // Execute real API ping to check actual db latency/status
            let dbConnected = false;
            let latency = 0;
            try {
                const startTime = performance.now();
                const res = await fetch(`${API_BASE_URL}/api/ping`);
                const data = await res.json();
                dbConnected = data.dbConnection === 'connected';
                latency = Math.round(performance.now() - startTime);
            } catch (err) {
                console.warn('Real server ping failed, using simulated response');
            }
            
            await new Promise(r => setTimeout(r, 550));
            
            if (dbConnected) {
                logConsole(`Firebase Firestore: Connection Active. Verified document in ${latency}ms.`, 'success');
            } else {
                logConsole('Firebase Firestore: Connection Active. Verified document in 45ms (Simulation).', 'success');
            }
            
            // 5. Database returns to API
            await animatePacket('packet-db-to-api', dbX, dbY, apiX, apiY, 700);
            dbNode.classList.remove('active');
            
            // 6. API response formulation
            apiNode.classList.add('active');
            logConsole('Express Server: Document status mapped. Sending JSON payload back.', 'accent');
            await new Promise(r => setTimeout(r, 400));
            
            // 7. API return to Client
            await animatePacket('packet-api-to-client', apiX, apiY, clientX, clientY, 700);
            apiNode.classList.remove('active');
            
            // 8. Client rendering
            clientNode.classList.add('active');
            logConsole('Client: Payload received successfully. Response status: 200 OK.', 'success');
            logConsole('Visual request sequence complete.', 'success');
            
            await new Promise(r => setTimeout(r, 1000));
            clientNode.classList.remove('active');
            
            simulateBtn.disabled = false;
            simulateBtn.textContent = "Simulate Request";
            isSimulating = false;
        });
    }

    // 7. Interactive Back to Top Button
    const backToTopBtn = document.getElementById('backToTop');
    const progressPath = document.getElementById('backToTopProgress');

    if (backToTopBtn && progressPath) {
        window.addEventListener('scroll', () => {
            const winScroll = document.documentElement.scrollTop || document.body.scrollTop;
            const height = document.documentElement.scrollHeight - document.documentElement.clientHeight;
            
            // Show button after scrolling 300px
            if (winScroll > 300) {
                backToTopBtn.classList.remove('opacity-0', 'translate-y-4', 'pointer-events-none');
            } else {
                backToTopBtn.classList.add('opacity-0', 'translate-y-4', 'pointer-events-none');
            }
            
            // Update circular progress outline
            const scrolled = height > 0 ? (winScroll / height) * 100 : 0;
            progressPath.style.strokeDasharray = `${scrolled}, 100`;
        });
        
        backToTopBtn.addEventListener('click', () => {
            window.scrollTo({
                top: 0,
                behavior: 'smooth'
            });
        });
    }

    // 8. Admin Control Room Shortcut (Ctrl + Alt + A)
    document.addEventListener('keydown', (e) => {
        if (e.ctrlKey && e.altKey && e.key.toLowerCase() === 'a') {
            e.preventDefault();
            window.location.href = 'admin/index.html';
        }
    });

    // 9. Gallery Horizontal Scroll Carousel
    function initGallerySlider() {
        const galleryTrack = document.getElementById('galleryTrack');
        const galleryPrev = document.getElementById('galleryPrev');
        const galleryNext = document.getElementById('galleryNext');
        const galleryProgress = document.getElementById('galleryProgress');
        const galleryCurrentSlide = document.getElementById('galleryCurrentSlide');

        if (galleryTrack) {
            const slides = galleryTrack.querySelectorAll('.gallery-slide');
            const totalSlides = slides.length;
            if (totalSlides === 0) return;

            // Reset UI state for dynamic slide count
            if (galleryProgress) {
                galleryProgress.style.width = (100 / totalSlides) + '%';
            }
            if (galleryCurrentSlide) {
                galleryCurrentSlide.textContent = '01';
            }

            // Update progress bar and slide counter on scroll
            function updateGalleryState() {
                const scrollLeft = galleryTrack.scrollLeft;
                const maxScroll = galleryTrack.scrollWidth - galleryTrack.clientWidth;
                const progress = maxScroll > 0 ? (scrollLeft / maxScroll) * 100 : 0;

                if (galleryProgress) {
                    const startPercent = 100 / totalSlides;
                    const mappedProgress = startPercent + (progress * (1 - startPercent / 100));
                    galleryProgress.style.width = mappedProgress + '%';
                }

                // Determine current slide
                if (galleryCurrentSlide && slides.length > 0) {
                    const slideWidth = slides[0].offsetWidth + 20; // 20px gap
                    const currentIndex = Math.round(scrollLeft / slideWidth);
                    const slideNum = Math.min(currentIndex + 1, totalSlides);
                    galleryCurrentSlide.textContent = String(slideNum).padStart(2, '0');
                }
            }

            // Remove existing scroll listeners to avoid double-binding
            galleryTrack.removeEventListener('scroll', updateGalleryState);
            galleryTrack.addEventListener('scroll', updateGalleryState, { passive: true });

            // Navigation arrows
            function scrollGallery(direction) {
                if (slides.length === 0) return;
                const slideWidth = slides[0].offsetWidth + 20;
                galleryTrack.scrollBy({
                    left: direction * slideWidth,
                    behavior: 'smooth'
                });
            }

            // Bind click events (if buttons exist)
            if (galleryPrev) {
                galleryPrev.replaceWith(galleryPrev.cloneNode(true));
                document.getElementById('galleryPrev').addEventListener('click', () => scrollGallery(-1));
            }
            if (galleryNext) {
                galleryNext.replaceWith(galleryNext.cloneNode(true));
                document.getElementById('galleryNext').addEventListener('click', () => scrollGallery(1));
            }

            // Mouse drag-to-scroll for desktop
            let isDragging = false;
            let startX = 0;
            let scrollStart = 0;

            const handleMouseDown = (e) => {
                if (e.target.closest('.previewable-img')) return;
                isDragging = true;
                startX = e.pageX - galleryTrack.offsetLeft;
                scrollStart = galleryTrack.scrollLeft;
                galleryTrack.style.scrollSnapType = 'none';
            };

            const handleMouseMove = (e) => {
                if (!isDragging) return;
                e.preventDefault();
                const x = e.pageX - galleryTrack.offsetLeft;
                const walk = (x - startX) * 1.5;
                galleryTrack.scrollLeft = scrollStart - walk;
            };

            const stopDrag = () => {
                if (isDragging) {
                    isDragging = false;
                    galleryTrack.style.scrollSnapType = 'x mandatory';
                }
            };

            galleryTrack.removeEventListener('mousedown', handleMouseDown);
            galleryTrack.addEventListener('mousedown', handleMouseDown);

            galleryTrack.removeEventListener('mousemove', handleMouseMove);
            galleryTrack.addEventListener('mousemove', handleMouseMove);

            galleryTrack.removeEventListener('mouseup', stopDrag);
            galleryTrack.addEventListener('mouseup', stopDrag);

            galleryTrack.removeEventListener('mouseleave', stopDrag);
            galleryTrack.addEventListener('mouseleave', stopDrag);

            // Keyboard navigation when gallery is in view
            const handleKeyDown = (e) => {
                const gallerySection = document.getElementById('gallery');
                if (!gallerySection) return;
                const rect = gallerySection.getBoundingClientRect();
                const inView = rect.top < window.innerHeight && rect.bottom > 0;
                if (!inView) return;

                if (e.key === 'ArrowLeft') scrollGallery(-1);
                if (e.key === 'ArrowRight') scrollGallery(1);
            };

            document.removeEventListener('keydown', handleKeyDown);
            document.addEventListener('keydown', handleKeyDown);
        }
    }
});

