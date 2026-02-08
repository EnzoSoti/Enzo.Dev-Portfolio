// Scroll Animations (Intersection Observer)
const observerOptions = {
    threshold: 0.1,
    rootMargin: '0px 0px -50px 0px'
};

const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.classList.add('visible');
        }
    });
}, observerOptions);

const animateElements = document.querySelectorAll('.fade-in-up, .slide-in-left, .slide-in-right');
animateElements.forEach(el => observer.observe(el));

// Skill Bar Animation Trigger
document.querySelectorAll('.skill-bar-fill').forEach(bar => {
    const finalWidth = bar.style.width;
    bar.style.width = '0%'; // Start at 0
    
    // Create a specific observer for this bar
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
