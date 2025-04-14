(function () {
    // Initialize EmailJS with your public user ID
    emailjs.init("5xF5tHab9EXUBz8AH");

    // Get references to the contact form and status display element
    const form = document.getElementById('contactForm');
    const statusDiv = document.getElementById('formStatus');

    // If elements are not found, log an error and stop the script
    if (!form || !statusDiv) {
        console.error('Contact form or status div not found in the DOM.');
        return;
    }

    // Listen for the form's submit event
    form.addEventListener('submit', function (event) {
        event.preventDefault(); // Prevent default form submission behavior

        // Show a "sending" status message
        statusDiv.classList.remove('hidden');
        statusDiv.className = 'mt-4 text-center';
        statusDiv.innerHTML = '<p class="text-yellow-600">Sending message...</p>';

        // Collect form field values
        const name = document.getElementById('name').value;
        const email = document.getElementById('email').value;
        const subject = document.getElementById('subject').value || 'Portfolio Contact Form Submission';
        const message = document.getElementById('message').value;

        // Prepare parameters to send via EmailJS
        const templateParams = {
            to_email: 'parane.enzo@gmail.com',     // Destination email (can also be set in EmailJS template)
            from_name: name,                        // Sender's name from the form
            from_email: email,                      // Sender's email address
            subject: subject,                       // Email subject (optional, fallback provided)
            message: message                        // Message content from the user
        };

        // Send the email using EmailJS
        emailjs.send('service_7mkmcyo', 'template_aeft8bi', templateParams)
            .then(response => {
                // On success: show a success message and reset the form
                console.log('SUCCESS!', response.status, response.text);
                statusDiv.innerHTML = `
                    <p class="text-green-600">
                        Your message has been sent successfully! I’ll get back to you soon.
                    </p>`;
                form.reset(); // Clear all form fields

                // Automatically hide the status message after 5 seconds
                setTimeout(() => {
                    statusDiv.classList.add('hidden');
                }, 5000);
            })
            .catch(error => {
                // On failure: show an error message with a fallback email contact
                console.error('FAILED...', error);
                statusDiv.innerHTML = `
                    <p class="text-red-600">
                        Failed to send message. Please try again later or contact me directly at 
                        <a href="mailto:parane.enzo@gmail.com" class="underline">parane.enzo@gmail.com</a>.
                    </p>`;
            });
    });
})();
