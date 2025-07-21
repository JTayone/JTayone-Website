// index.js

document.addEventListener("DOMContentLoaded", () => {
  // --- DOM Element References ---
  const loadingOverlay = document.getElementById("loading-overlay");
  const body = document.body;
  const modeToggle = document.getElementById("mode-toggle");
  const hamburgerMenu = document.getElementById("hamburger-menu");
  const mobileNavOverlay = document.getElementById("mobile-nav-overlay");
  const mobileNavLinks = document.querySelectorAll(".mobile-nav__link");
  const clickableJasmine = document.querySelector(".clickable-jasmine");
  const nyanExplosionContainer = document.getElementById(
    "nyan-explosion-container"
  );

  // --- Global Constants ---
  const MIN_LOADING_DURATION = 3000; // 3 seconds
  const LOADER_FADE_OUT_DURATION = 500; // Matches CSS transition duration

  // --- Utility Functions ---

  /**
   * Hides the loading overlay and enables page scrolling.
   */
  const hideLoader = () => {
    // Prevent multiple calls if already loaded
    if (body.classList.contains("loaded")) {
      return;
    }

    body.classList.add("loaded"); // Triggers CSS fade out for overlay
    // After CSS transition, remove overlay from DOM and enable scrolling
    setTimeout(() => {
      if (loadingOverlay) {
        loadingOverlay.style.display = "none";
      }
      body.classList.remove("no-scroll");
      // console.log("Loading complete: Content displayed, scrolling enabled."); // Keep for dev, remove for prod if desired
    }, LOADER_FADE_OUT_DURATION);
  };

  /**
   * Initializes the loading screen behavior.
   */
  const initializeLoader = () => {
    body.classList.add("no-scroll"); // Prevent scrolling during load
    const startTime = performance.now();

    window.addEventListener("load", () => {
      const elapsedTime = performance.now() - startTime;
      const remainingTime = MIN_LOADING_DURATION - elapsedTime;

      if (remainingTime > 0) {
        // console.log(`Assets loaded. Waiting for ${remainingTime.toFixed(0)}ms for minimum duration.`);
        setTimeout(hideLoader, remainingTime);
      } else {
        // console.log("Assets loaded after minimum duration. Hiding loader immediately.");
        hideLoader();
      }
    });

    // Fallback to ensure the loader eventually hides, even if 'load' event is delayed
    setTimeout(() => {
      if (!body.classList.contains("loaded")) {
        // console.warn("Forcing loader hide: 'window.load' event might be delayed or failed.");
        hideLoader();
      }
    }, MIN_LOADING_DURATION + LOADER_FADE_OUT_DURATION + 500); // Add extra buffer for robustness
  };

  /**
   * Initializes the dark/light mode toggle functionality.
   */
  const initializeThemeToggle = () => {
    // Apply stored theme on initial load
    const storedTheme = localStorage.getItem("theme");
    if (storedTheme === "light") {
      body.classList.add("light-mode");
    } else {
      body.classList.remove("light-mode"); // Default to dark mode
    }

    if (modeToggle) {
      modeToggle.addEventListener("click", () => {
        body.classList.toggle("light-mode");
        const currentTheme = body.classList.contains("light-mode")
          ? "light"
          : "dark";
        localStorage.setItem("theme", currentTheme);
        // console.log(`Theme set to: ${currentTheme}`); // Keep for dev, remove for prod if desired
      });
    }
  };

  /**
   * Initializes the hamburger menu and mobile navigation overlay.
   */
  const initializeMobileNav = () => {
    if (hamburgerMenu && mobileNavOverlay) {
      hamburgerMenu.addEventListener("click", () => {
        hamburgerMenu.classList.toggle("is-active");
        mobileNavOverlay.classList.toggle("is-active");
        body.classList.toggle("no-scroll"); // Toggle scrolling for mobile menu
        // console.log("Mobile menu toggled."); // Keep for dev, remove for prod if desired
      });

      mobileNavLinks.forEach((link) => {
        link.addEventListener("click", () => {
          // Close menu and re-enable scrolling when a link is clicked
          hamburgerMenu.classList.remove("is-active");
          mobileNavOverlay.classList.remove("is-active");
          body.classList.remove("no-scroll");
          // console.log("Mobile navigation link clicked, menu closed."); // Keep for dev, remove for prod if desired
        });
      });
    }
  };

  /**
   * Initializes the Nyan Cat explosion effect on clickable Jasmine element.
   */
  const initializeNyanCatExplosion = () => {
    if (!clickableJasmine || !nyanExplosionContainer) {
      // console.warn("Nyan Cat logic not initialized: 'clickableJasmine' or 'nyanExplosionContainer' not found.");
      return; // Exit if elements are missing
    }

    const fragmentImages = [
      "./assets/png/nyan cat.gif",
      // Add other Nyan Cat variations or related images here if desired
    ];

    clickableJasmine.addEventListener("click", (event) => {
      const numFragments = 15;
      const containerRect = nyanExplosionContainer.getBoundingClientRect();

      for (let i = 0; i < numFragments; i++) {
        const fragment = document.createElement("img");
        fragment.src =
          fragmentImages[Math.floor(Math.random() * fragmentImages.length)];
        fragment.classList.add("nyan-cat-fragment");

        // Calculate initial positions relative to the *viewport* click event
        const initialX = event.clientX + (Math.random() - 0.5) * 50;
        const initialY = event.clientY + (Math.random() - 0.5) * 50;

        // Convert viewport coordinates to coordinates relative to the *nyanExplosionContainer*
        const relativeX = initialX - containerRect.left;
        const relativeY = initialY - containerRect.top;

        fragment.style.left = `${relativeX}px`;
        fragment.style.top = `${relativeY}px`;

        // Set CSS variables for animation
        fragment.style.setProperty("--x", `${(Math.random() - 0.5) * 800}px`);
        fragment.style.setProperty("--y", `${(Math.random() - 0.5) * 800}px`);
        fragment.style.setProperty("--rot", `${Math.random() * 720 - 360}deg`);

        nyanExplosionContainer.appendChild(fragment);

        // Remove fragment after its animation ends to prevent DOM bloat
        fragment.addEventListener("animationend", () => {
          fragment.remove();
        });
      }
      // console.log("Nyan Cat explosion triggered!"); // Keep for dev, remove for prod if desired
    });
  };

  /**
   * Initializes smooth scrolling for anchor links.
   */
  const initializeSmoothScroll = () => {
    document.querySelectorAll('a[href^="#"]').forEach((anchor) => {
      anchor.addEventListener("click", function (e) {
        e.preventDefault();
        document.querySelector(this.getAttribute("href")).scrollIntoView({
          behavior: "smooth",
        });
      });
    });
  };

  // --- Initialize All Functionalities ---
  initializeLoader();
  initializeThemeToggle();
  initializeMobileNav();
  initializeNyanCatExplosion();
  initializeSmoothScroll();

  // console.log("All functionalities initialized."); // Keep for dev, remove for prod if desired
});
