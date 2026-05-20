document.addEventListener('DOMContentLoaded', () => {
    // Theme toggle logic
    const toggle = document.getElementById('themeToggle');
    const html = document.documentElement;
    if (localStorage.theme === 'dark' || (!localStorage.theme && window.matchMedia('(prefers-color-scheme: dark)').matches)) {
        html.classList.add('dark');
    }
    if (toggle) {
        toggle.addEventListener('click', () => {
            html.classList.toggle('dark');
            localStorage.theme = html.classList.contains('dark') ? 'dark' : 'light';
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

    // Project Filtering logic
    const filterButtons = document.querySelectorAll('.filter-btn');
    const filterableProjects = document.querySelectorAll('.filterable-project');

    filterButtons.forEach(btn => {
        btn.addEventListener('click', () => {
            // Update active buttons styling
            filterButtons.forEach(b => {
                b.classList.remove('active', 'bg-accent', 'text-cream', 'border-accent');
                b.classList.add('border-ink/20', 'dark:border-cream/20', 'opacity-60');
            });
            btn.classList.add('active', 'bg-accent', 'text-cream', 'border-accent');
            btn.classList.remove('border-ink/20', 'dark:border-cream/20', 'opacity-60');

            const filterValue = btn.getAttribute('data-filter');

            filterableProjects.forEach(project => {
                const categories = project.getAttribute('data-category').split(' ');
                if (filterValue === 'all' || categories.includes(filterValue)) {
                    project.style.display = 'block';
                    // Let layout recalculate before animating
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

    // Prevent page jump for non-deployed project cards
    document.querySelectorAll('a.project-card[href="#"]').forEach(card => {
        card.addEventListener('click', (e) => {
            e.preventDefault();
        });
    });

    // Image Lightbox Modal logic
    const imageModal = document.getElementById('imageModal');
    const modalImage = document.getElementById('modalImage');
    const closeModal = document.getElementById('closeModal');

    if (imageModal && modalImage) {
        document.querySelectorAll('.previewable-img').forEach(img => {
            img.classList.add('cursor-zoom-in');
            img.addEventListener('click', (e) => {
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
            });
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

    // Cursor interactions
    const hoverables = 'a, button, input, textarea, .previewable-img, .filter-btn, #themeToggle, .tech-pill';
    document.querySelectorAll(hoverables).forEach(el => {
        el.addEventListener('mouseenter', () => {
            if (cursor) {
                cursor.classList.add('scale-150', 'bg-accent/10');
                if (el.classList.contains('previewable-img') || el.id === 'themeToggle') {
                    cursor.classList.add('border-dashed');
                }
            }
        });
        el.addEventListener('mouseleave', () => {
            if (cursor) {
                cursor.classList.remove('scale-150', 'bg-accent/10', 'border-dashed');
            }
        });
    });

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

    // 6. Contact Form Success Animations & Dispatch
    const contactForm = document.getElementById('contactForm');
    const submitBtn = document.getElementById('formSubmitBtn');
    const submitText = document.getElementById('submitBtnText');
    const submitIcon = document.getElementById('submitBtnIcon');

    if (contactForm && submitBtn) {
        contactForm.addEventListener('submit', (e) => {
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
            
            // Simulate network latency
            setTimeout(() => {
                // Transition to green checkmark success state
                submitBtn.classList.remove('bg-accent');
                submitBtn.classList.add('bg-emerald-600', 'text-cream');
                submitText.textContent = "Message Prepared!";
                submitIcon.innerHTML = `<svg class="h-3.5 w-3.5 text-cream" fill="none" stroke="currentColor" stroke-width="3" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" d="M5 13l4 4L19 7"></path></svg>`;
                
                // Fire mailto launch
                setTimeout(() => {
                    window.location.href = `mailto:parane.enzo@gmail.com?subject=Inquiry from ${encodeURIComponent(name)}&body=${encodeURIComponent(message)}%0A%0AReply to: ${encodeURIComponent(email)}`;
                    
                    // Reset button to initial styling
                    setTimeout(() => {
                        contactForm.reset();
                        submitBtn.disabled = false;
                        submitBtn.className = "w-full inline-flex items-center justify-center gap-3 px-6 py-3 bg-ink text-cream dark:bg-cream dark:text-ink text-xs tracking-widest uppercase hover:opacity-90 transition-all duration-300 border border-transparent";
                        submitText.textContent = "Send Message";
                        submitIcon.innerHTML = "→";
                        submitIcon.classList.add('transition-transform');
                    }, 2000);
                }, 800);
            }, 1500);
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
});
