/**
 * EJaytech Concepts - Main Application JS (Phase 1)
 * Handles global UI interactions, dynamic copyright year, active link highlighting, and back-to-top controls.
 */

document.addEventListener("DOMContentLoaded", () => {
  // 1. Initialize current copyright year dynamically
  const currentYearSpan = document.getElementById("current-year");
  if (currentYearSpan) {
    currentYearSpan.textContent = new Date().getFullYear().toString();
  }

  // 2. Active navigation highlighting
  const currentPath = window.location.pathname.split("/").pop() || "index.html";
  const navLinks = document.querySelectorAll(".navbar-nav .nav-link");
  
  navLinks.forEach(link => {
    const href = link.getAttribute("href");
    if (href === currentPath) {
      link.classList.add("active");
    } else {
      link.classList.remove("active");
    }
  });

  // 3. Navbar dynamic scroll effect
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

  // 4. Back-to-top button functionality
  const backToTopBtn = document.getElementById("btn-back-to-top");
  if (backToTopBtn) {
    window.addEventListener("scroll", () => {
      if (window.scrollY > 300) {
        backToTopBtn.style.display = "flex";
      } else {
        backToTopBtn.style.display = "none";
      }
    });

    backToTopBtn.addEventListener("click", () => {
      window.scrollTo({
        top: 0,
        behavior: "smooth"
      });
    });
  }

  console.log("EJaytech Concepts App Initialized successfully (Phase 1).");
});
