/**
 * EJaytech Concepts - Main Application JavaScript (Vanilla JS)
 * Handles global UI interactions, dynamic copyright year, active link highlighting,
 * dynamic scroll navbar effect, back-to-top controls, and high-performance intersection-observed stats counters.
 */

document.addEventListener("DOMContentLoaded", () => {
  // 1. Dynamic Copyright Year
  const currentYearSpan = document.getElementById("current-year");
  if (currentYearSpan) {
    currentYearSpan.textContent = new Date().getFullYear().toString();
  }

  // 2. Active Link Highlighting
  const currentPath = window.location.pathname.split("/").pop() || "index.html";
  const navLinks = document.querySelectorAll(".navbar-nav .nav-link");
  
  navLinks.forEach(link => {
    const href = link.getAttribute("href");
    if (href === currentPath || (currentPath === "" && href === "index.html")) {
      link.classList.add("active");
    } else {
      link.classList.remove("active");
    }
  });

  // 3. Dynamic Scroll Navbar Effect
  const navbar = document.querySelector(".navbar-custom");
  if (navbar) {
    const handleScroll = () => {
      if (window.scrollY > 40) {
        navbar.classList.add("navbar-scrolled");
      } else {
        navbar.classList.remove("navbar-scrolled");
      }
    };
    window.addEventListener("scroll", handleScroll);
    handleScroll(); // Run initially to set correct state
  }

  // 4. Back-to-top Button
  const backToTopBtn = document.getElementById("btn-back-to-top");
  if (backToTopBtn) {
    window.addEventListener("scroll", () => {
      if (window.scrollY > 300) {
        backToTopBtn.classList.add("show");
      } else {
        backToTopBtn.classList.remove("show");
      }
    });

    backToTopBtn.addEventListener("click", () => {
      window.scrollTo({
        top: 0,
        behavior: "smooth"
      });
    });
  }

  // 5. High-Performance Animated Counters
  const counters = document.querySelectorAll(".counter-number");
  
  const animateCounter = (counter) => {
    const target = parseInt(counter.getAttribute("data-target"), 10);
    const suffix = counter.getAttribute("data-suffix") || "";
    const duration = 2000; // 2 seconds animation
    const stepTime = 15; // ms per step
    const steps = duration / stepTime;
    const increment = target / steps;
    let current = 0;
    
    const timer = setInterval(() => {
      current += increment;
      if (current >= target) {
        counter.textContent = target + suffix;
        clearInterval(timer);
      } else {
        counter.textContent = Math.floor(current) + suffix;
      }
    }, stepTime);
  };

  // Trigger counter animation when in viewport
  if (counters.length > 0) {
    if ('IntersectionObserver' in window) {
      const observerOptions = {
        root: null,
        threshold: 0.1,
        rootMargin: "0px"
      };

      const observer = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
          if (entry.isIntersecting) {
            animateCounter(entry.target);
            observer.unobserve(entry.target); // Only animate once
          }
        });
      }, observerOptions);

      counters.forEach(counter => observer.observe(counter));
    } else {
      // Fallback for older browsers
      counters.forEach(counter => {
        const target = counter.getAttribute("data-target");
        const suffix = counter.getAttribute("data-suffix") || "";
        counter.textContent = target + suffix;
      });
    }
  }

  // 6. Smooth Scrolling for Anchor Links
  const anchorLinks = document.querySelectorAll('a[href^="#"]');
  anchorLinks.forEach(link => {
    link.addEventListener("click", function(e) {
      const href = this.getAttribute("href");
      if (href === "#") return;
      
      const targetElement = document.querySelector(href);
      if (targetElement) {
        e.preventDefault();
        const headerOffset = 80;
        const elementPosition = targetElement.getBoundingClientRect().top;
        const offsetPosition = elementPosition + window.pageYOffset - headerOffset;
        
        window.scrollTo({
          top: offsetPosition,
          behavior: "smooth"
        });
      }
    });
  });

  // 7. Dynamic WhatsApp Floating Button Injection
  const injectWhatsAppButton = () => {
    // Check if it already exists or if we are in an print/iframe layout where we don't want it (optional)
    if (document.getElementById("whatsapp-container")) return;

    // Create container
    const container = document.createElement("div");
    container.id = "whatsapp-container";
    container.className = "whatsapp-container no-print";
    
    // Create Tooltip HTML
    const tooltip = document.createElement("div");
    tooltip.className = "whatsapp-tooltip";
    tooltip.innerHTML = "💬 Chat with Us on WhatsApp";
    container.appendChild(tooltip);

    // Create Welcome Bubble HTML
    const welcome = document.createElement("div");
    welcome.id = "whatsapp-welcome";
    welcome.className = "whatsapp-welcome";
    welcome.innerHTML = `
      <div class="whatsapp-welcome-header">
        <span>EJaytech Concepts</span>
        <button id="whatsapp-welcome-close" class="whatsapp-welcome-close" aria-label="Close welcome message">&times;</button>
      </div>
      <div class="whatsapp-welcome-body">
        👋 Need help?<br>Chat with us on WhatsApp.
      </div>
    `;
    container.appendChild(welcome);

    // Create Button Anchor
    const btn = document.createElement("a");
    btn.href = "https://wa.me/2347033719342?text=Hello%20EJaytech%20Concepts%2C%0AI%20visited%20your%20website%20and%20would%20like%20to%20make%20an%20enquiry.";
    btn.target = "_blank";
    btn.rel = "noopener noreferrer";
    btn.className = "whatsapp-btn whatsapp-btn-bounce";
    btn.setAttribute("aria-label", "Chat with EJaytech Concepts on WhatsApp");
    btn.innerHTML = `<i class="bi bi-whatsapp"></i>`;
    container.appendChild(btn);

    // Append container to body
    document.body.appendChild(container);

    // Handle Close welcome bubble
    const closeBtn = welcome.querySelector("#whatsapp-welcome-close");
    const closeWelcome = () => {
      welcome.classList.remove("show");
      container.classList.remove("welcome-active");
      sessionStorage.setItem("whatsapp_bubble_shown", "true");
    };
    if (closeBtn) {
      closeBtn.addEventListener("click", (e) => {
        e.preventDefault();
        e.stopPropagation();
        closeWelcome();
      });
    }

    // Trigger welcome bubble after 5 seconds if not shown in this session
    if (!sessionStorage.getItem("whatsapp_bubble_shown")) {
      setTimeout(() => {
        // Double check container still exists
        if (document.getElementById("whatsapp-container")) {
          welcome.classList.add("show");
          container.classList.add("welcome-active");

          // Auto-dismiss after 8 seconds
          setTimeout(() => {
            if (welcome.classList.contains("show")) {
              closeWelcome();
            }
          }, 8000);
        }
      }, 5000);
    }
  };

  // Run the WhatsApp button injection
  injectWhatsAppButton();

  console.log("EJaytech Concepts App Initialized.");
});
