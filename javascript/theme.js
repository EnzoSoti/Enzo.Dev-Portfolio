// Theme Toggle and Profile Image Management
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
