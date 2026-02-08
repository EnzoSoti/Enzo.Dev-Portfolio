// Projects Gallery Modal Handler
document.addEventListener('DOMContentLoaded', () => {
    const viewAllBtn = document.getElementById('viewAllProjectsBtn');
    const projectsModal = document.getElementById('projectsModal');
    const closeModalBtn = document.getElementById('closeProjectsModal');

    if (viewAllBtn && projectsModal && closeModalBtn) {
        // Open modal
        viewAllBtn.addEventListener('click', () => {
            projectsModal.style.display = 'flex';
            document.body.style.overflow = 'hidden';
        });

        // Close modal on button click
        closeModalBtn.addEventListener('click', () => {
            projectsModal.style.display = 'none';
            document.body.style.overflow = '';
        });

        // Close modal on backdrop click
        projectsModal.addEventListener('click', (e) => {
            if (e.target === projectsModal) {
                projectsModal.style.display = 'none';
                document.body.style.overflow = '';
            }
        });

        // Close modal on Escape key
        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape' && projectsModal.style.display === 'flex') {
                projectsModal.style.display = 'none';
                document.body.style.overflow = '';
            }
        });
    }
});
