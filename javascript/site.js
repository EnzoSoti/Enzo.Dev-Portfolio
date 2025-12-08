// Mobile Menu Toggle
const mobileMenuBtn = document.getElementById('mobileMenuBtn');
const mobileMenu = document.getElementById('mobileMenu');

if (mobileMenuBtn && mobileMenu) {
    mobileMenuBtn.addEventListener('click', () => {
        mobileMenu.classList.toggle('hidden');
        const icon = mobileMenuBtn.querySelector('i');
        if (mobileMenu.classList.contains('hidden')) {
            icon.classList.remove('fa-times');
            icon.classList.add('fa-bars');
        } else {
            icon.classList.remove('fa-bars');
            icon.classList.add('fa-times');
        }
    });

    // Close menu when clicking a link
    mobileMenu.querySelectorAll('a').forEach(link => {
        link.addEventListener('click', () => {
            mobileMenu.classList.add('hidden');
            const icon = mobileMenuBtn.querySelector('i');
            icon.classList.remove('fa-times');
            icon.classList.add('fa-bars');
        });
    });
}

// Typing Effect
const typingTextElement = document.getElementById('typing-text');
const roles = ["Web Developer", "IT Student", "Backend Specialist", "Creative Problem Solver"];
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
