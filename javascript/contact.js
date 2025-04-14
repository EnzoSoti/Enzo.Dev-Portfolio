(function () {
    // Initialize EmailJS
    emailjs.init("5xF5tHab9EXUBz8AH");

    const form = document.getElementById('contactForm');

    if (!form) {
        console.error('Contact form not found in the DOM.');
        return;
    }

    // variable of the sound
    const dingSound = "../sound/Ding Sound Effect.mp3";

    // Create audio element for success sound
    const successSound = new Audio(dingSound);
    
    // Preload the sound
    successSound.load();

    form.addEventListener('submit', function (event) {
        event.preventDefault();

        // Show "Sending..." toast
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

        // Get form values
        const name = document.getElementById('name').value;
        const email = document.getElementById('email').value;
        const subject = document.getElementById('subject').value || 'Portfolio Contact Form Submission';
        const message = document.getElementById('message').value;

        // Prepare template parameters
        const templateParams = {
            to_email: 'parane.enzo@gmail.com',
            from_name: name,
            from_email: email,
            subject: subject,
            message: message
        };

        // Send email via EmailJS
        emailjs.send('service_7mkmcyo', 'template_aeft8bi', templateParams)
            .then(response => {
                console.log('SUCCESS!', response.status, response.text);

                // Play success sound
                successSound.play().catch(err => {
                    console.error('Failed to play success sound:', err);
                });

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