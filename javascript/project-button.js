document.addEventListener('DOMContentLoaded', function() {
    const toggleButton = document.getElementById('toggleProjectsBtn');
    const projectsSection = document.getElementById('projects');
    const toggleLabel = document.getElementById('toggleLabel');
    
    // Hide projects initially
    projectsSection.classList.add('hidden');
    toggleButton.setAttribute('aria-expanded', 'false');
    
    toggleButton.addEventListener('click', function() {
        const isHidden = projectsSection.classList.contains('hidden');
        if (isHidden) {
            projectsSection.classList.remove('hidden');
            projectsSection.style.animation = 'fadeIn 0.5s ease-in-out';
            if (toggleLabel) toggleLabel.textContent = 'Hide Projects';
            toggleButton.setAttribute('aria-expanded', 'true');
        } else {
            projectsSection.classList.add('hidden');
            if (toggleLabel) toggleLabel.textContent = 'Show Projects';
            toggleButton.setAttribute('aria-expanded', 'false');
        }
    });
});