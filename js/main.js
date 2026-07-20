/* 
================================================================
   JALAPARTHI YASMIN - PREMIUM DEVELOPER PORTFOLIO JAVASCRIPT
   Core interactions, animations, and dynamic behaviors
================================================================
*/

document.addEventListener("DOMContentLoaded", () => {
  
  // ============================================================
  // 1. LOADING SCREEN HANDLER
  // ============================================================
  const loader = document.getElementById("loader");
  const minLoadTime = 1500; // minimum loader display time (ms)
  const startTime = Date.now();

  window.addEventListener("load", hideLoader);
  // Fallback in case load event already fired or is delayed
  setTimeout(hideLoader, 3000);

  function hideLoader() {
    const elapsed = Date.now() - startTime;
    const delay = Math.max(0, minLoadTime - elapsed);
    
    setTimeout(() => {
      if (loader && !loader.classList.contains("fade-out")) {
        loader.classList.add("fade-out");
        // Start counter checks and animations once loaded
        setTimeout(revealOnScroll, 300);
      }
    }, delay);
  }

  // ============================================================
  // 2. STICKY NAV & SCROLL INDICATOR
  // ============================================================
  const header = document.getElementById("header");
  const scrollProgress = document.getElementById("scroll-progress");
  const backToTopBtn = document.getElementById("back-to-top");

  window.addEventListener("scroll", () => {
    const scrollTop = window.scrollY;
    const docHeight = document.documentElement.scrollHeight - window.innerHeight;
    
    // Sticky Header state
    if (scrollTop > 50) {
      header.classList.add("scrolled");
    } else {
      header.classList.remove("scrolled");
    }

    // Scroll Progress bar percentage
    if (docHeight > 0) {
      const scrollPct = (scrollTop / docHeight) * 100;
      scrollProgress.style.width = scrollPct + "%";
    }

    // Back to Top Button display
    if (scrollTop > 500) {
      backToTopBtn.classList.add("active");
    } else {
      backToTopBtn.classList.remove("active");
    }

    // Scroll Spy & Reveal
    scrollSpy();
    revealOnScroll();
  });

  // Smooth Scroll to Top
  backToTopBtn.addEventListener("click", () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  });

  // ============================================================
  // 3. THEME TOGGLE (DARK/LIGHT)
  // ============================================================
  const themeToggle = document.getElementById("theme-toggle");
  const savedTheme = localStorage.getItem("portfolio-theme") || "dark";

  // Init theme
  if (savedTheme === "light") {
    document.body.classList.add("light-mode");
  }

  themeToggle.addEventListener("click", () => {
    document.body.classList.toggle("light-mode");
    const activeTheme = document.body.classList.contains("light-mode") ? "light" : "dark";
    localStorage.setItem("portfolio-theme", activeTheme);
    // Restart particles with correct color colors
    initParticles();
  });

  // ============================================================
  // 4. MOBILE MENU
  // ============================================================
  const menuToggle = document.getElementById("menu-toggle");
  const navMenu = document.getElementById("nav-menu");
  const navLinks = document.querySelectorAll(".nav-link");

  menuToggle.addEventListener("click", () => {
    menuToggle.classList.toggle("active");
    navMenu.classList.toggle("active");
  });

  // Close menu when clicking link
  navLinks.forEach(link => {
    link.addEventListener("click", () => {
      menuToggle.classList.remove("active");
      navMenu.classList.remove("active");
    });
  });

  // ============================================================
  // 5. MOUSE SPOTLIGHT TRACKING
  // ============================================================
  document.addEventListener("mousemove", (e) => {
    document.body.style.setProperty("--mouse-x", `${e.clientX}px`);
    document.body.style.setProperty("--mouse-y", `${e.clientY}px`);
  });

  // ============================================================
  // 6. INTERACTIVE PARTICLES BACKGROUND
  // ============================================================
  const canvas = document.getElementById("particles-canvas");
  const ctx = canvas.getContext("2d");
  let particlesArray = [];
  let mouse = { x: null, y: null, radius: 150 };

  // Set canvas size
  function setCanvasSize() {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
  }
  setCanvasSize();
  window.addEventListener("resize", () => {
    setCanvasSize();
    initParticles();
  });

  // Track mouse coordinates over screen for particle interaction
  window.addEventListener("mousemove", (e) => {
    mouse.x = e.clientX;
    mouse.y = e.clientY;
  });
  window.addEventListener("mouseleave", () => {
    mouse.x = null;
    mouse.y = null;
  });

  // Particle Blueprint
  class Particle {
    constructor(x, y, directionX, directionY, size, color) {
      this.x = x;
      this.y = y;
      this.directionX = directionX;
      this.directionY = directionY;
      this.size = size;
      this.color = color;
    }
    
    // Draw single particle
    draw() {
      ctx.beginPath();
      ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2, false);
      ctx.fillStyle = this.color;
      ctx.fill();
    }

    // Move particles & check bounds
    update() {
      if (this.x > canvas.width || this.x < 0) {
        this.directionX = -this.directionX;
      }
      if (this.y > canvas.height || this.y < 0) {
        this.directionY = -this.directionY;
      }

      // Check mouse proximity effect
      let dx = mouse.x - this.x;
      let dy = mouse.y - this.y;
      let distance = Math.sqrt(dx * dx + dy * dy);
      if (distance < mouse.radius + this.size) {
        if (mouse.x < this.x && this.x < canvas.width - this.size * 10) {
          this.x += 2;
        }
        if (mouse.x > this.x && this.x > this.size * 10) {
          this.x -= 2;
        }
        if (mouse.y < this.y && this.y < canvas.height - this.size * 10) {
          this.y += 2;
        }
        if (mouse.y > this.y && this.y > this.size * 10) {
          this.y -= 2;
        }
      }

      // Increment positions
      this.x += this.directionX;
      this.y += this.directionY;
      this.draw();
    }
  }

  // Populate particles array
  function initParticles() {
    particlesArray = [];
    const numberOfParticles = Math.floor((canvas.width * canvas.height) / 13000);
    const isLight = document.body.classList.contains("light-mode");
    
    // Cyan or blue theme hues
    const colorChoices = isLight 
      ? ["rgba(2, 132, 199, 0.25)", "rgba(37, 99, 235, 0.25)"] 
      : ["rgba(0, 242, 254, 0.2)", "rgba(79, 172, 254, 0.2)"];

    for (let i = 0; i < numberOfParticles; i++) {
      let size = Math.random() * 2 + 1.5;
      let x = Math.random() * (canvas.width - size * 2) + size;
      let y = Math.random() * (canvas.height - size * 2) + size;
      let directionX = (Math.random() * 0.4) - 0.2;
      let directionY = (Math.random() * 0.4) - 0.2;
      let color = colorChoices[Math.floor(Math.random() * colorChoices.length)];

      particlesArray.push(new Particle(x, y, directionX, directionY, size, color));
    }
  }

  // Connect particles within proximity limit
  function connectParticles() {
    const maxDist = 120;
    const isLight = document.body.classList.contains("light-mode");

    for (let a = 0; a < particlesArray.length; a++) {
      for (let b = a; b < particlesArray.length; b++) {
        let dx = particlesArray[a].x - particlesArray[b].x;
        let dy = particlesArray[a].y - particlesArray[b].y;
        let dist = Math.sqrt(dx * dx + dy * dy);

        if (dist < maxDist) {
          let opacityValue = 1 - (dist / maxDist);
          const lineColor = isLight 
            ? `rgba(37, 99, 235, ${opacityValue * 0.08})`
            : `rgba(0, 242, 254, ${opacityValue * 0.08})`;
          
          ctx.strokeStyle = lineColor;
          ctx.lineWidth = 0.8;
          ctx.beginPath();
          ctx.moveTo(particlesArray[a].x, particlesArray[a].y);
          ctx.lineTo(particlesArray[b].x, particlesArray[b].y);
          ctx.stroke();
        }
      }
    }
  }

  // Render loop
  function animateParticles() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    for (let i = 0; i < particlesArray.length; i++) {
      particlesArray[i].update();
    }
    connectParticles();
    requestAnimationFrame(animateParticles);
  }

  initParticles();
  animateParticles();

  // ============================================================
  // 7. TYPING ANIMATION (HERO)
  // ============================================================
  const textElement = document.getElementById("typed-text");
  const words = [
    "Full Stack Developer",
    "BCA Student",
    "Tech Enthusiast",
    "Cybersecurity Learner",
    "Problem Solver"
  ];
  let wordIndex = 0;
  let charIndex = 0;
  let isDeleting = false;
  let typingSpeed = 100;

  function typeEffect() {
    const currentWord = words[wordIndex];
    
    if (isDeleting) {
      // Deleting characters
      textElement.textContent = currentWord.substring(0, charIndex - 1);
      charIndex--;
      typingSpeed = 50;
    } else {
      // Adding characters
      textElement.textContent = currentWord.substring(0, charIndex + 1);
      charIndex++;
      typingSpeed = 120;
    }

    if (!isDeleting && charIndex === currentWord.length) {
      // Stop typing, wait before deleting
      isDeleting = true;
      typingSpeed = 2000;
    } else if (isDeleting && charIndex === 0) {
      // Word fully cleared, switch to next word
      isDeleting = false;
      wordIndex = (wordIndex + 1) % words.length;
      typingSpeed = 500;
    }

    setTimeout(typeEffect, typingSpeed);
  }

  // Launch text typing loop
  setTimeout(typeEffect, 1000);

  // ============================================================
  // 8. SCROLL SPY ACTIVE NAV
  // ============================================================
  const sections = document.querySelectorAll("section");
  
  function scrollSpy() {
    const scrollPos = window.scrollY + varScrollOffset();

    sections.forEach(section => {
      const sectionTop = section.offsetTop;
      const sectionHeight = section.offsetHeight;
      const sectionId = section.getAttribute("id");

      if (scrollPos >= sectionTop && scrollPos < sectionTop + sectionHeight) {
        navLinks.forEach(link => {
          link.classList.remove("active");
          if (link.getAttribute("href") === `#${sectionId}`) {
            link.classList.add("active");
          }
        });
      }
    });
  }

  function varScrollOffset() {
    return header.offsetHeight + 10;
  }

  // ============================================================
  // 9. SCROLL REVEAL & COUNTERS
  // ============================================================
  const revealElements = document.querySelectorAll(".reveal");
  const skillBars = document.querySelectorAll(".skill-progress");
  let statsAnimated = false;

  function revealOnScroll() {
    const triggerBottom = window.innerHeight * 0.88;

    revealElements.forEach(el => {
      const elTop = el.getBoundingClientRect().top;
      if (elTop < triggerBottom) {
        el.classList.add("active");
        
        // Trigger specific animations on child nodes once revealed
        if (el.id === "about" && !statsAnimated) {
          animateStats();
        }
        if (el.id === "skills") {
          animateSkillBars();
        }
      }
    });
  }

  // Animating skill progress bars
  function animateSkillBars() {
    skillBars.forEach(bar => {
      const targetPercent = bar.getAttribute("data-percent");
      bar.style.width = targetPercent + "%";
    });
  }

  // Count up animation for stats
  function animateStats() {
    statsAnimated = true;
    const statCounters = document.querySelectorAll(".stat-number");
    
    statCounters.forEach(counter => {
      const target = parseInt(counter.getAttribute("data-target"), 10);
      const suffix = counter.innerText.replace(/[0-9]/g, ""); // extract + or other suffixes
      let count = 0;
      const duration = 2000; // ms
      const increment = target / (duration / 16); // ~60fps frame rate
      
      const timer = setInterval(() => {
        count += increment;
        if (count >= target) {
          counter.innerText = target + suffix;
          clearInterval(timer);
        } else {
          counter.innerText = Math.floor(count) + suffix;
        }
      }, 16);
    });
  }

  // ============================================================
  // 10. MODAL POPUPS (HIRE ME & LIGHTBOX)
  // ============================================================
  
  // HIRE ME MODAL
  const hireMeBtn = document.getElementById("hire-me-btn");
  const hireMeBtnModal = document.getElementById("hire-me-btn-modal");
  const hireModal = document.getElementById("hire-modal");
  const hireModalClose = document.getElementById("hire-modal-close");

  function openHireModal() {
    hireModal.classList.add("active");
    document.body.style.overflow = "hidden"; // disable scroll
  }

  function closeHireModal() {
    hireModal.classList.remove("active");
    document.body.style.overflow = ""; // enable scroll
  }

  if (hireMeBtn) hireMeBtn.addEventListener("click", openHireModal);
  if (hireMeBtnModal) hireMeBtnModal.addEventListener("click", openHireModal);
  if (hireModalClose) hireModalClose.addEventListener("click", closeHireModal);

  // Close modals clicking on backdrop overlay
  document.querySelectorAll(".modal-overlay").forEach(overlay => {
    overlay.addEventListener("click", (e) => {
      if (e.target === overlay) {
        closeHireModal();
        closeLightbox();
      }
    });
  });

  // LIGHTBOX POPUP FOR CERTIFICATES
  const lightboxModal = document.getElementById("lightbox-modal");
  const lightboxClose = document.getElementById("lightbox-close");
  const lightboxImg = lightboxModal.querySelector(".lightbox-img");
  const lightboxTitle = lightboxModal.querySelector(".lightbox-title");

  function openLightbox(imgSrc, titleText) {
    lightboxImg.src = imgSrc;
    lightboxTitle.innerText = titleText;
    lightboxModal.classList.add("active");
    document.body.style.overflow = "hidden";
  }

  function closeLightbox() {
    lightboxModal.classList.remove("active");
    document.body.style.overflow = "";
    setTimeout(() => {
      lightboxImg.src = "";
    }, 300);
  }

  if (lightboxClose) lightboxClose.addEventListener("click", closeLightbox);

  // Bind view certificate clicks
  document.addEventListener("click", (e) => {
    const viewCertBtn = e.target.closest(".view-cert-btn");
    if (viewCertBtn) {
      e.preventDefault();
      const card = viewCertBtn.closest(".cert-card");
      const img = card.querySelector(".cert-img");
      const title = card.querySelector(".cert-title").innerText;
      openLightbox(img.src || img.getAttribute("src"), title);
    }
  });

  // ============================================================
  // 11. CERTIFICATES FILTER GALLERY
  // ============================================================
  const filterBtns = document.querySelectorAll(".filter-btn");
  const certCards = document.querySelectorAll(".cert-card");

  filterBtns.forEach(btn => {
    btn.addEventListener("click", () => {
      // Set active button style
      filterBtns.forEach(b => b.classList.remove("active"));
      btn.classList.add("active");

      const filterVal = btn.getAttribute("data-filter");

      certCards.forEach(card => {
        const categories = card.getAttribute("data-category").split(" ");
        if (filterVal === "all" || categories.includes(filterVal)) {
          card.classList.remove("hidden");
          // Re-trigger scale reveal
          card.style.animation = "fadeIn 0.4s ease forwards";
        } else {
          card.classList.add("hidden");
        }
      });
    });
  });

  // ============================================================
  // 12. VISITORS MOCK COUNTER
  // ============================================================
  const digitBoxes = document.querySelectorAll(".digit-box");
  let currentViews = parseInt(localStorage.getItem("portfolio-views") || "1337", 10);
  
  // Increment view count on refresh
  currentViews++;
  localStorage.setItem("portfolio-views", currentViews);

  // Render digit values
  const viewStr = String(currentViews).padStart(5, "0");
  digitBoxes.forEach((box, i) => {
    if (viewStr[i]) {
      box.innerText = viewStr[i];
    }
  });

  // ============================================================
  // 13. CONTACT FORM VALIDATION & MOCK SUBMIT
  // ============================================================
  const contactForm = document.getElementById("contact-form");
  const formStatus = document.getElementById("form-status");

  if (contactForm) {
    contactForm.addEventListener("submit", (e) => {
      e.preventDefault();
      
      let isValid = true;
      const nameGroup = document.getElementById("field-name").closest(".form-group");
      const emailGroup = document.getElementById("field-email").closest(".form-group");
      const subjectGroup = document.getElementById("field-subject").closest(".form-group");
      const messageGroup = document.getElementById("field-message").closest(".form-group");

      const nameVal = document.getElementById("field-name").value.trim();
      const emailVal = document.getElementById("field-email").value.trim();
      const subjectVal = document.getElementById("field-subject").value.trim();
      const messageVal = document.getElementById("field-message").value.trim();

      // Reset styles
      nameGroup.classList.remove("error");
      emailGroup.classList.remove("error");
      subjectGroup.classList.remove("error");
      messageGroup.classList.remove("error");
      formStatus.style.display = "none";
      formStatus.className = "form-status";

      // Name check
      if (!nameVal) {
        nameGroup.classList.add("error");
        isValid = false;
      }

      // Email check
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailVal || !emailRegex.test(emailVal)) {
        emailGroup.classList.add("error");
        isValid = false;
      }

      // Subject check
      if (!subjectVal) {
        subjectGroup.classList.add("error");
        isValid = false;
      }

      // Message check
      if (!messageVal) {
        messageGroup.classList.add("error");
        isValid = false;
      }

      if (!isValid) return;

      // Submit Animation/Process Simulation
      const submitBtn = contactForm.querySelector("button[type='submit']");
      const origBtnHTML = submitBtn.innerHTML;
      submitBtn.disabled = true;
      submitBtn.innerHTML = '<i class="fas fa-circle-notch fa-spin"></i> Sending...';

      setTimeout(() => {
        submitBtn.disabled = false;
        submitBtn.innerHTML = origBtnHTML;
        
        // Show success status
        formStatus.innerText = "Thank you! Your message has been sent successfully. Yasmin will get in touch soon.";
        formStatus.classList.add("success");
        contactForm.reset();
        
        // Hide success message after 6s
        setTimeout(() => {
          formStatus.style.display = "none";
        }, 6000);

      }, 1500); // 1.5 second loading latency
    });
  }

  // ============================================================
  // 14. EASTER EGG MANAGER (J + Y SIMULTANEOUS KEY DETECTION)
  // ============================================================
  const activeKeys = {};
  let eggActive = false;
  let matrixTimer = null;

  // Create Matrix Code Canvas Overlay for Easter Egg
  const matrixCanvas = document.createElement("canvas");
  matrixCanvas.className = "party-matrix-canvas";
  document.body.appendChild(matrixCanvas);
  const mCtx = matrixCanvas.getContext("2d");

  function setMatrixCanvasSize() {
    matrixCanvas.width = window.innerWidth;
    matrixCanvas.height = window.innerHeight;
  }

  window.addEventListener("resize", () => {
    if (eggActive) setMatrixCanvasSize();
  });

  // Matrix falling rain logic
  const matrixChars = "010101JYFULLSTACKDEVELOPERBCA2026";
  const charArr = matrixChars.split("");
  const fontSize = 14;
  let columns = 0;
  let drops = [];

  function initMatrix() {
    setMatrixCanvasSize();
    columns = matrixCanvas.width / fontSize;
    drops = [];
    for (let x = 0; x < columns; x++) {
      drops[x] = 1;
    }
  }

  function drawMatrix() {
    mCtx.fillStyle = "rgba(3, 7, 18, 0.06)";
    mCtx.fillRect(0, 0, matrixCanvas.width, matrixCanvas.height);
    
    // Cyber glowing color sequence
    mCtx.fillStyle = "#ff007f"; // cyber pink
    mCtx.font = fontSize + "px monospace";
    
    for (let i = 0; i < drops.length; i++) {
      const text = charArr[Math.floor(Math.random() * charArr.length)];
      
      // Randomize color per columns slightly
      if (i % 3 === 0) mCtx.fillStyle = "#00f2fe"; // cyan
      else if (i % 3 === 1) mCtx.fillStyle = "#ff007f"; // pink
      else mCtx.fillStyle = "#7928ca"; // violet

      mCtx.fillText(text, i * fontSize, drops[i] * fontSize);
      
      if (drops[i] * fontSize > matrixCanvas.height && Math.random() > 0.975) {
        drops[i] = 0;
      }
      drops[i]++;
    }
  }

  // Key tracking
  window.addEventListener("keydown", (e) => {
    const key = e.key.toLowerCase();
    activeKeys[key] = true;

    // Check if both 'j' and 'y' are pressed
    if (activeKeys["j"] && activeKeys["y"] && !eggActive) {
      triggerEasterEgg();
    }
  });

  window.addEventListener("keyup", (e) => {
    const key = e.key.toLowerCase();
    activeKeys[key] = false;
  });

  function triggerEasterEgg() {
    eggActive = true;
    document.body.classList.add("neon-party-active");
    
    // Start Matrix rain overlay
    initMatrix();
    matrixTimer = setInterval(drawMatrix, 33);

    // Audio/beeps feedback (optional, using Web Audio API for a futuristic synth beep!)
    playCyberBeep();

    // Remove party active after 6 seconds
    setTimeout(() => {
      document.body.classList.remove("neon-party-active");
      clearInterval(matrixTimer);
      mCtx.clearRect(0, 0, matrixCanvas.width, matrixCanvas.height);
      eggActive = false;
    }, 6000);
  }

  // Play a simple Web Audio API cyberpunk synthesiser beep
  function playCyberBeep() {
    try {
      const audioCtx = new (window.AudioContext || window.webkitAudioContext)();
      
      // Node 1 - oscillator
      const osc = audioCtx.createOscillator();
      const gain = audioCtx.createGain();
      
      osc.connect(gain);
      gain.connect(audioCtx.destination);
      
      osc.type = "sine";
      // Arpeggio sound
      osc.frequency.setValueAtTime(440, audioCtx.currentTime); // A4
      osc.frequency.exponentialRampToValueAtTime(880, audioCtx.currentTime + 0.15); // A5
      osc.frequency.exponentialRampToValueAtTime(1760, audioCtx.currentTime + 0.3); // A6
      
      gain.gain.setValueAtTime(0.15, audioCtx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.01, audioCtx.currentTime + 0.45);
      
      osc.start();
      osc.stop(audioCtx.currentTime + 0.5);
    } catch (err) {
      // Audio context block fails silently (e.g. user interaction required block)
    }
  }

});
