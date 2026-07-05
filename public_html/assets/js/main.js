/**
 * EJaytech Concepts - Client Side Interactions
 * Year: 2026
 */

document.addEventListener('DOMContentLoaded', () => {
    // Form verification rules validation checks
    const forms = document.querySelectorAll('.needs-validation');
    Array.from(forms).forEach(form => {
        form.addEventListener('submit', event => {
            if (!form.checkValidity()) {
                event.preventDefault();
                event.stopPropagation();
            }
            form.classList.add('was-validated');
        }, false);
    });

    // Toggle scroll modifications on sticky headers
    const navbar = document.querySelector('.sticky-navbar');
    if (navbar) {
        window.addEventListener('scroll', () => {
            if (window.scrollY > 50) {
                navbar.classList.add('shadow-md');
                navbar.style.backgroundColor = 'rgba(255, 255, 255, 0.98)';
            } else {
                navbar.classList.remove('shadow-md');
                navbar.style.backgroundColor = 'rgba(255, 255, 255, 0.95)';
            }
        });
    }
});
