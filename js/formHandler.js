/**
 * AnySoft Form Handler
 * Handles form submissions with inline success/error messages
 */

document.addEventListener('DOMContentLoaded', function() {
    // Initialize both forms with custom handling
    initFormHandler('contact-form', 'contact-form-message');
    initFormHandler('footer-form', 'footer-form-message');
});

/**
 * Set up custom form handling for a specific form
 * @param {string} formId - The ID of the form element
 * @param {string} messageId - The ID of the element to show messages in
 */
function initFormHandler(formId, messageId) {
    const form = document.getElementById(formId);
    const messageElement = document.getElementById(messageId);
    
    if (!form || !messageElement) return;
    
    form.addEventListener('submit', function(e) {
        e.preventDefault();
        
        // Disable form while submitting
        const submitButton = form.querySelector('button[type="submit"]');
        const originalButtonText = submitButton.innerHTML;
        submitButton.disabled = true;
        submitButton.innerHTML = 'Sending...';
        
        // Collect form data
        const formData = new FormData(form);
        
        // Send form data to Formspree
        fetch(form.action, {
            method: 'POST',
            body: formData,
            headers: {
                'Accept': 'application/json'
            }
        })
        .then(response => {
            if (response.ok) {
                // Success - show message and reset form
                messageElement.textContent = 'Thanks for signing up! We\'ll be in touch soon.';
                messageElement.className = 'mt-4 text-green-500 text-sm';
                form.reset();
            } else {
                // Error from server
                return response.json().then(data => {
                    throw new Error(data.error || 'Form submission failed');
                });
            }
        })
        .catch(error => {
            // Show error message
            messageElement.textContent = 'Oops! There was a problem submitting your form. Please try again.';
            messageElement.className = 'mt-4 text-red-500 text-sm';
            console.error('Form error:', error);
        })
        .finally(() => {
            // Re-enable form
            submitButton.disabled = false;
            submitButton.innerHTML = originalButtonText;
            
            // Hide success message after 5 seconds
            if (messageElement.classList.contains('text-green-500')) {
                setTimeout(() => {
                    messageElement.textContent = '';
                }, 5000);
            }
        });
    });
}
