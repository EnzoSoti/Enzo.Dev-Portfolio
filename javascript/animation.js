// Intersection Observer for scroll animations
const observerOptions = {
    threshold: 0.1,
    rootMargin: '0px 0px -50px 0px'
};

const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.classList.add('animate');
            // Optional: unobserve after animation to prevent re-triggering
            // observer.unobserve(entry.target);
        } else {
            // Remove animate class when element goes out of view (optional)
            // entry.target.classList.remove('animate');
        }
    });
}, observerOptions);

// Function to initialize scroll animations
function initScrollAnimations() {
    // Select all elements with scroll animation classes
    const animatedElements = document.querySelectorAll([
        '.scroll-fade-in',
        '.scroll-slide-left',
        '.scroll-slide-right',
        '.scroll-scale-in',
        '.scroll-bounce-in',
        '.scroll-drop-fade',
        '.scroll-flip-in',
        '.scroll-stagger',
        '.scroll-hero',
        '.scroll-pulse'
    ].join(','));

    // Observe each element
    animatedElements.forEach(el => {
        observer.observe(el);
    });
}

// Initialize when DOM is loaded
document.addEventListener('DOMContentLoaded', initScrollAnimations);

// Alternative: Initialize immediately if DOM is already loaded
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initScrollAnimations);
} else {
    initScrollAnimations();
}