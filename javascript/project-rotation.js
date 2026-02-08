// Random Project Rotation System
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
