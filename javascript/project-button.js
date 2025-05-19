document.addEventListener('DOMContentLoaded', function() {
    const toggleButton = document.getElementById('toggleProjectsBtn');
    const projectsSection = document.getElementById('projects');
    
    // Hide projects initially
    projectsSection.classList.add('hidden');
    
    toggleButton.addEventListener('click', function() {
        if (projectsSection.classList.contains('hidden')) {
            projectsSection.classList.remove('hidden');
            projectsSection.style.animation = 'fadeIn 0.5s ease-in-out';
            toggleButton.textContent = 'Hide Projects';
        } else {
            projectsSection.classList.add('hidden');
            toggleButton.textContent = 'Show Projects';
        }
    });
});