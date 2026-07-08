/**
 * EJaytech Concepts - Main Application JS (Phase 1)
 * Handles global UI interactions, dynamic copyright year, and responsive mobile menu behaviors.
 */

document.addEventListener("DOMContentLoaded", () => {
  // Initialize current copyright year dynamically
  const currentYearSpan = document.getElementById("current-year");
  if (currentYearSpan) {
    currentYearSpan.textContent = new Date().getFullYear().toString();
  }

  // Navbar dynamic scroll effect
  const navbar = document.querySelector(".navbar-custom");
  if (navbar) {
    window.addEventListener("scroll", () => {
      if (window.scrollY > 20) {
        navbar.style.boxShadow = "0 4px 12px rgba(0, 0, 0, 0.08)";
        navbar.style.padding = "0.7rem 1.5rem";
      } else {
        navbar.style.boxShadow = "0 1px 3px rgba(0, 0, 0, 0.05)";
        navbar.style.padding = "0.85rem 1.5rem";
      }
    });
  }

  console.log("EJaytech Concepts App Initialized successfully (Phase 1).");
});
