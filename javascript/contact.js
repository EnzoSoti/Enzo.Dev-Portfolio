(function () {
    // ========== EmailJS Initialization ==========
    emailjs.init("5xF5tHab9EXUBz8AH");

    // ========== Form Element ==========
    const form = document.getElementById('contactForm');

    if (!form) {
        console.error('Contact form not found in the DOM.');
        return;
    }

    // ========== Sound Setup ==========
    const dingSound = "../sound/Ding Sound Effect.mp3";
    const successSound = new Audio(dingSound);
    successSound.load(); // Preload sound

    // ========== Form Submission Handler ==========
    form.addEventListener('submit', function (event) {
        event.preventDefault();

        // ========== Sending Toast ==========
        Toastify({
            text: "Sending message...",
            duration: 3000,
            gravity: "top",
            position: "center",
            style: {
                background: "#facc15",
                color: "#000",
                borderRadius: "8px",
                boxShadow: "0 4px 12px rgba(0, 0, 0, 0.15)",
                padding: "12px 20px",
                fontSize: "16px"
            },
            stopOnFocus: true
        }).showToast();

        // ========== Get Form Values ==========
        const name = document.getElementById('name').value;
        const email = document.getElementById('email').value;
        const subject = document.getElementById('subject').value || 'Portfolio Contact Form Submission';
        const message = document.getElementById('message').value;

        // ========== Email Template Parameters ==========
        const templateParams = {
            to_email: 'parane.enzo@gmail.com',
            from_name: name,
            from_email: email,
            subject: subject,
            message: message
        };

        // ========== Send Email ==========
        emailjs.send('service_7mkmcyo', 'template_aeft8bi', templateParams)
            .then(response => {
                console.log('SUCCESS!', response.status, response.text);

                // ========== Play Success Sound ==========
                successSound.play().catch(err => {
                    console.error('Failed to play success sound:', err);
                });

                // ========== Success Toast ==========
                Toastify({
                    text: "Your message has been sent successfully! Thank you!",
                    duration: 5000,
                    gravity: "top",
                    position: "center",
                    style: {
                        background: "#10b981",
                        color: "#fff",
                        borderRadius: "8px",
                        boxShadow: "0 4px 12px rgba(0, 0, 0, 0.15)",
                        padding: "12px 20px",
                        fontSize: "16px"
                    },
                    stopOnFocus: true
                }).showToast();

                form.reset(); // Reset the form
            })
            .catch(error => {
                console.error('FAILED...', error);

                // ========== Error Toast ==========
                Toastify({
                    text: "Failed to send message. Try again or email parane.enzo@gmail.com.",
                    duration: 6000,
                    gravity: "top",
                    position: "center",
                    style: {
                        background: "#ef4444",
                        color: "#fff",
                        borderRadius: "8px",
                        boxShadow: "0 4px 12px rgba(0, 0, 0, 0.15)",
                        padding: "12px 20px",
                        fontSize: "16px"
                    },
                    stopOnFocus: true
                }).showToast();
            });
    });
})();
