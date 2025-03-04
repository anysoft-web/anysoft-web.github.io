document.addEventListener("DOMContentLoaded", function() {
    document.querySelectorAll(".signup-btn").forEach(button => {
        button.addEventListener("click", function() {
            alert("The trial is coming soon! Sign up to be the first to know.");
        });
    });

    document.getElementById("signup-form").addEventListener("submit", function(event) {
        event.preventDefault();
        alert("Thank you for signing up! We'll notify you once the trial is live.");
    });
});
