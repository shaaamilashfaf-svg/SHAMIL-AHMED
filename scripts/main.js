/**
 * ==========================================================================
 * SHAMIL ASHFAF — UI/UX DESIGNER PORTFOLIO
 * Architecture: Christoph Nagel Reference (christoph-nagel.dev)
 * Fullscreen Stage Transition Engine, VU Preloader, Drawer & Direct Hash Routing
 * ==========================================================================
 */

(() => {
  "use strict";

  // Case study database
  const caseStudies = {
    haus: {
      kicker: "01 · Mobile App UX & Prototyping",
      title: "Haus — Home Salon Booking App",
      image: "assets/images/haus.jpg",
      overview: "Haus connects clients with verified professionals for haircare, skincare, and wellness treatments delivered directly to their doorstep, creating a serene and luxurious self-care ritual at home.",
      challenge: "In-home personal care requires high trust. Users felt hesitation booking unfamiliar specialists and struggled with confusing multi-step scheduling in legacy apps.",
      solution: "Designed a soothing visual language using soft terracotta, warm alabaster, and organic home-inspired rounded forms. Integrated prominent trust indicators: verified specialist badges, real client photos, and transparent pricing before checkout.",
      tags: ["Figma", "User Research", "Wireframing", "Usability Testing", "Design Systems"],
      metrics: [
        { label: "Usability Completion Rate", val: "94%" },
        { label: "Booking Flow Steps", val: "3 Steps" },
        { label: "User Trust Score", val: "4.9 / 5" }
      ]
    },
    gandaura: {
      kicker: "02 · Luxury E-Commerce & Cultural Branding",
      title: "Gandaura — Natural Fragrance & Authentic Oud",
      image: "assets/images/gandaura.jpg",
      overview: "An immersive e-commerce experience celebrating authentic Middle Eastern oud and botanical fragrance craftsmanship, blending heritage with modern luxury digital standards.",
      challenge: "Fragrance is entirely invisible on digital screens. Communicating complex olfactory profiles and justifying luxury price points without physical sampling was the core UX hurdle.",
      solution: "Engineered an interactive Olfactory Pyramid (Top, Heart, and Base notes), paired with rich macro visual assets, ingredient sourcing transparency, and an intuitive 4-step purchasing journey (Home, Collections, Fragrance Details, Checkout).",
      tags: ["Luxury E-Commerce", "Olfactory UI", "Cultural UX", "Visual Hierarchy", "Information Architecture"],
      metrics: [
        { label: "Sensory Engagement", val: "+45%" },
        { label: "Purchase Flow", val: "4 Seamless Steps" },
        { label: "Brand Resonance", val: "Premium Luxury" }
      ]
    },
    rentbiz: {
      kicker: "03 · SaaS Dashboard & Complex Systems",
      title: "RentBiz — Smart Property Management Platform",
      image: "assets/images/rentbiz.jpg",
      overview: "A clean, modern SaaS platform designed to eliminate cognitive clutter for landlords and multi-unit property managers.",
      challenge: "Property managers juggling dozens of units were burdened by disjointed spreadsheets, missed maintenance requests, and scattered cashflow tracking.",
      solution: "Developed a modular card layout that prioritizes mission-critical metrics: real-time occupancy rates, monthly cashflow charts, and one-click maintenance ticket approval. Soft warm palette prevents visual fatigue during all-day usage.",
      tags: ["SaaS Dashboard", "Data Visualization", "Modular Cards", "Workflow Automation", "Design System"],
      metrics: [
        { label: "Admin Workflow Time", val: "-65%" },
        { label: "Critical Insight Scan Time", val: "< 3 Sec" },
        { label: "System Scalability", val: "100+ Units" }
      ]
    },
    noviindus: {
      kicker: "04 · Tech & App Agency Digital Experience",
      title: "Noviindus — Futuristic Engineering & App Agency",
      image: "assets/images/noviindus.jpg",
      overview: "A bold digital overhaul for a cutting-edge software and mobile engineering studio, conveying technical mastery, reliability, and enterprise credibility.",
      challenge: "The agency's legacy web presence did not reflect their sophisticated engineering caliber or high enterprise delivery capabilities.",
      solution: "Created an immersive dark-mode aesthetic with vibrant cyber accents, high-contrast typography, interactive service matrices, and dynamic client outcome metrics (450+ completed products, 98% happy clients).",
      tags: ["Dark Theme UI", "Creative Direction", "High-Impact Typography", "Agency Branding", "Interactive Showcase"],
      metrics: [
        { label: "Delivered Projects", val: "450+" },
        { label: "Client Satisfaction", val: "98%" },
        { label: "Industry Experience", val: "12+ Yrs" }
      ]
    }
  };

  function boot() {
    const body = document.body;
    const panels = Array.from(document.querySelectorAll(".panel"));
    const navButtons = Array.from(document.querySelectorAll(".site-nav [data-target]"));
    const menuToggle = document.querySelector(".menu-toggle");
    const menuBackdrop = document.querySelector(".menu-backdrop");
    const nextButtons = Array.from(document.querySelectorAll("[data-next]"));
    const previousButton = document.querySelector("[data-previous]");
    const progressBar = document.getElementById("progressBar");
    const activeSectionNum = document.getElementById("activeSectionNum");
    const sectionAnnouncer = document.getElementById("section-announcer");
    const wipeEdge = document.querySelector(".wipe-edge");
    const stages = [
      document.getElementById("background-stage-a"),
      document.getElementById("background-stage-b")
    ];

    // Preloader elements
    const preloader = document.getElementById("preloader");
    const percentage = document.getElementById("load-percentage");
    const vuTrack = document.getElementById("vu-track");

    // Drawer and Modal elements
    const drawerBackdrop = document.getElementById("drawerBackdrop");
    const projectDrawer = document.getElementById("projectDrawer");
    const drawerClose = document.getElementById("drawerClose");
    const drawerBody = document.getElementById("drawerBody");
    const drawerKicker = document.getElementById("drawerKicker");
    const contactModalWrap = document.getElementById("contactModalWrap");
    const contactClose = document.getElementById("contactClose");
    const toastMsg = document.getElementById("toastMsg");

    // Scroll Cursor
    const scrollCursor = document.querySelector(".scroll-cursor");
    const scrollCursorLabel = document.getElementById("scroll-cursor-label");

    const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const hasGsap = typeof window.gsap !== "undefined";

    const state = {
      activeIndex: 0,
      activeStage: 0,
      heroWord: 0,
      transitioning: false,
      wheelLock: false,
      touchStartY: 0,
      touchScrollArea: null,
      touchStartedAtTop: false,
      touchStartedAtBottom: false,
      preloaderDone: false,
      menuOpen: false,
      drawerOpen: false,
      modalOpen: false
    };

    // Build VU segments for preloader
    const segmentCount = 20;
    const segments = [];
    if (vuTrack) {
      for (let i = 0; i < segmentCount; i++) {
        const seg = document.createElement("span");
        seg.className = "vu-segment";
        if (((i + 1) / segmentCount) * 100 >= 85) seg.classList.add("is-danger");
        vuTrack.appendChild(seg);
        segments.push(seg);
      }
    }

    // ------------------------------------------------------------------------
    // Mobile Menu Controls
    // ------------------------------------------------------------------------
    function setMenu(open) {
      state.menuOpen = open;
      body.classList.toggle("menu-open", open);
      menuToggle?.setAttribute("aria-expanded", String(open));
    }

    const mobileNavClose = document.getElementById("mobileNavClose");
    menuToggle?.addEventListener("click", () => setMenu(!state.menuOpen));
    menuBackdrop?.addEventListener("click", () => setMenu(false));
    mobileNavClose?.addEventListener("click", () => setMenu(false));

    // ------------------------------------------------------------------------
    // Dynamic Preloader Engine
    // ------------------------------------------------------------------------
    function setLoadProgress(val) {
      const clamped = Math.max(0, Math.min(100, val));
      const activeCount = Math.round((clamped / 100) * segmentCount);
      if (percentage) {
        percentage.textContent = `${Math.round(clamped)}%`;
        percentage.style.color = clamped >= 85 ? "var(--red)" : "#fff";
      }
      segments.forEach((seg, idx) => {
        seg.classList.toggle("is-active", idx < activeCount);
      });
    }

    function finishPreloader() {
      state.preloaderDone = true;
      body.classList.remove("is-loading");

      if (hasGsap && !reducedMotion) {
        window.gsap.timeline({
          onComplete: () => {
            if (preloader) preloader.style.display = "none";
            revealPanelCopy(panels[state.activeIndex]);
          }
        })
          .to(".preloader-glass", { scale: 0.94, opacity: 0, y: -20, duration: 0.45, ease: "power3.in" })
          .to(preloader, { clipPath: "inset(50% 0% 50% 0%)", duration: 0.6, ease: "expo.inOut" }, "-=0.1")
          .to(stages[0], { filter: "grayscale(0.2) contrast(1.06) brightness(0.65) blur(0px)", scale: 1.02, duration: 0.9, ease: "power3.out" }, "-=0.4");
      } else {
        if (preloader) {
          preloader.style.opacity = "0";
          setTimeout(() => {
            preloader.style.display = "none";
            revealPanelCopy(panels[state.activeIndex]);
          }, 350);
        }
      }
    }

    function runPreloader() {
      let progress = 0;
      let startTime = performance.now();

      function tick(now) {
        const elapsed = now - startTime;
        const target = 100;
        const speed = elapsed > 600 ? 0.08 : 0.045;
        progress += (target - progress) * speed;

        setLoadProgress(progress);

        if (progress >= 98.8 || elapsed > 2400) {
          setLoadProgress(100);
          setTimeout(finishPreloader, reducedMotion ? 50 : 160);
          return;
        }
        requestAnimationFrame(tick);
      }

      requestAnimationFrame(tick);
    }

    // ------------------------------------------------------------------------
    // Navigation & State Management
    // ------------------------------------------------------------------------
    function updateNavigation() {
      const activePanel = panels[state.activeIndex];
      const id = activePanel.id;
      body.dataset.section = id;

      navButtons.forEach((btn) => {
        const isActive = btn.dataset.target === id;
        btn.classList.toggle("is-active", isActive);
        btn.setAttribute("aria-current", isActive ? "page" : "false");
      });

      if (progressBar) {
        const ratio = state.activeIndex / (panels.length - 1);
        progressBar.style.transform = `scaleX(${ratio})`;
      }

      if (activeSectionNum) {
        activeSectionNum.textContent = String(state.activeIndex + 1).padStart(2, "0");
      }

      if (previousButton) {
        previousButton.disabled = state.activeIndex === 0 && state.heroWord === 0;
      }
      nextButtons.forEach((btn) => {
        btn.disabled = state.activeIndex === panels.length - 1;
      });

      if (sectionAnnouncer) {
        sectionAnnouncer.textContent = id;
      }

      if (scrollCursorLabel) {
        scrollCursorLabel.textContent = state.activeIndex === panels.length - 1 ? "Top" : "Scroll";
      }
    }

    function updateHash(id, push = false) {
      const hash = id === "intro" ? "#intro" : `#${id}`;
      if (window.location.hash === hash) return;
      const method = push ? "pushState" : "replaceState";
      history[method](null, "", hash);
    }

    // ------------------------------------------------------------------------
    // Hero Rotating Word Engine
    // ------------------------------------------------------------------------
    function setHeroWord(nextIdx, direction = 1) {
      const words = Array.from(document.querySelectorAll(".hero-word"));
      const bounded = Math.max(0, Math.min(words.length - 1, nextIdx));
      if (bounded === state.heroWord || state.transitioning) return false;

      state.transitioning = true;
      const current = words[state.heroWord];
      const next = words[bounded];
      const incomingY = direction > 0 ? 118 : -118;
      const outgoingY = direction > 0 ? -118 : 118;

      next.classList.add("is-current");

      if (hasGsap && !reducedMotion) {
        window.gsap.set(next, { yPercent: incomingY, opacity: 1 });
        window.gsap.timeline({
          onComplete: () => {
            current.classList.remove("is-current");
            state.heroWord = bounded;
            state.transitioning = false;
            updateNavigation();
          }
        })
          .to(current, { yPercent: outgoingY, opacity: 0, duration: 0.65, ease: "power4.inOut" }, 0)
          .to(next, { yPercent: 0, opacity: 1, duration: 0.72, ease: "power4.inOut" }, 0.04);
      } else {
        current.classList.remove("is-current");
        next.classList.add("is-current");
        state.heroWord = bounded;
        state.transitioning = false;
        updateNavigation();
      }
      return true;
    }

    // Auto-cycle hero words periodically if user stays on intro
    let heroCycleTimer = setInterval(() => {
      if (state.activeIndex === 0 && !state.transitioning && state.preloaderDone) {
        const nextWord = (state.heroWord + 1) % 3;
        setHeroWord(nextWord, 1);
      }
    }, 4200);

    // ------------------------------------------------------------------------
    // Dual-Buffer Stage Background Transition Engine
    // ------------------------------------------------------------------------
    function prepareNextStage(panel, direction) {
      const nextStageIdx = state.activeStage === 0 ? 1 : 0;
      const nextStage = stages[nextStageIdx];
      const bgUrl = panel.dataset.bg || "assets/images/intro.jpg";

      nextStage.style.backgroundImage = `url('${bgUrl}')`;
      nextStage.style.opacity = "1";
      nextStage.style.zIndex = "2";
      nextStage.style.clipPath = direction > 0 ? "inset(0 100% 0 0)" : "inset(0 0 0 100%)";

      return { nextStage, nextStageIdx };
    }

    function revealPanelCopy(panel) {
      const items = Array.from(panel.querySelectorAll(".panel-copy > *"));
      if (hasGsap && !reducedMotion) {
        window.gsap.fromTo(items, 
          { opacity: 0, y: 32 }, 
          { opacity: 1, y: 0, duration: 0.7, stagger: 0.06, ease: "power3.out" }
        );
      } else {
        items.forEach(el => {
          el.style.opacity = "1";
          el.style.transform = "translateY(0)";
        });
      }
    }

    function switchPanel(nextIndex, options = {}) {
      if (nextIndex < 0 || nextIndex >= panels.length || nextIndex === state.activeIndex || state.transitioning) return;
      state.transitioning = true;

      const currentIndex = state.activeIndex;
      const direction = nextIndex > currentIndex ? 1 : -1;
      const currentPanel = panels[currentIndex];
      const nextPanel = panels[nextIndex];
      const currentStage = stages[state.activeStage];
      const { nextStage, nextStageIdx } = prepareNextStage(nextPanel, direction);
      const currentItems = Array.from(currentPanel.querySelectorAll(".panel-copy > *"));
      const nextItems = Array.from(nextPanel.querySelectorAll(".panel-copy > *"));

      nextPanel.classList.add("is-active");
      nextPanel.setAttribute("aria-hidden", "false");

      // Update nav immediately
      navButtons.forEach((btn) => {
        btn.classList.toggle("is-active", btn.dataset.target === nextPanel.id);
      });

      const onTransitionComplete = () => {
        currentPanel.classList.remove("is-active");
        currentPanel.setAttribute("aria-hidden", "true");
        currentStage.classList.remove("is-active");
        currentStage.style.opacity = "0";
        currentStage.style.zIndex = "0";
        nextStage.classList.add("is-active");
        nextStage.style.zIndex = "1";
        nextStage.style.clipPath = "none";
        state.activeStage = nextStageIdx;
        state.activeIndex = nextIndex;
        state.transitioning = false;
        updateNavigation();
        updateHash(nextPanel.id, options.pushHash === true);
      };

      if (hasGsap && !reducedMotion) {
        const edgeStart = direction > 0 ? "0%" : "100%";
        const edgeEnd = direction > 0 ? "100%" : "0%";
        if (wipeEdge) window.gsap.set(wipeEdge, { left: edgeStart, opacity: 0 });

        window.gsap.timeline({ onComplete: onTransitionComplete })
          .to(currentItems, {
            y: direction > 0 ? -20 : 20,
            opacity: 0,
            duration: 0.32,
            stagger: 0.02,
            ease: "power2.in"
          }, 0)
          .to(wipeEdge, { opacity: 0.8, duration: 0.12 }, 0.1)
          .to(wipeEdge, { left: edgeEnd, duration: 0.95, ease: "expo.inOut" }, 0.1)
          .to(nextStage, {
            clipPath: "inset(0% 0% 0% 0%)",
            duration: 0.95,
            ease: "expo.inOut"
          }, 0.1)
          .to(wipeEdge, { opacity: 0, duration: 0.15 }, 0.95)
          .fromTo(nextItems, 
            { y: direction > 0 ? 36 : -36, opacity: 0 }, 
            { y: 0, opacity: 1, duration: 0.7, stagger: 0.06, ease: "power3.out" }, 
            0.62
          );
      } else {
        // Fallback without GSAP
        currentPanel.classList.remove("is-active");
        nextStage.style.clipPath = "none";
        onTransitionComplete();
        revealPanelCopy(nextPanel);
      }
    }

    function step(direction, pushHash = false) {
      if (!state.preloaderDone || state.transitioning || state.drawerOpen || state.modalOpen) return;

      if (state.activeIndex === 0) {
        if (direction > 0 && state.heroWord < 2) {
          setHeroWord(state.heroWord + 1, 1);
          return;
        }
        if (direction < 0 && state.heroWord > 0) {
          setHeroWord(state.heroWord - 1, -1);
          return;
        }
      }
      switchPanel(state.activeIndex + direction, { pushHash });
    }

    function navigateToId(id, pushHash = true) {
      const nextIdx = panels.findIndex((p) => p.id === id);
      if (nextIdx === -1) return;
      if (nextIdx === 0 && state.activeIndex === 0) {
        if (state.heroWord !== 0) setHeroWord(0, -1);
        updateHash("intro", pushHash);
        return;
      }
      switchPanel(nextIdx, { pushHash });
    }

    // ------------------------------------------------------------------------
    // User Input Listeners
    // ------------------------------------------------------------------------
    // Nav Buttons
    navButtons.forEach((btn) => {
      btn.addEventListener("click", () => {
        setMenu(false);
        navigateToId(btn.dataset.target, true);
      });
    });

    // Monogram Home Link
    document.querySelector(".home-mark")?.addEventListener("click", (e) => {
      e.preventDefault();
      setMenu(false);
      navigateToId("intro", true);
    });

    // Prev / Next Arrows
    nextButtons.forEach((btn) => btn.addEventListener("click", () => step(1, true)));
    previousButton?.addEventListener("click", () => step(-1, true));

    // Panel direct target buttons (e.g. intro pills)
    document.querySelectorAll("[data-target]").forEach((btn) => {
      if (!btn.closest(".site-nav") && !btn.classList.contains("home-mark")) {
        btn.addEventListener("click", () => navigateToId(btn.dataset.target, true));
      }
    });

    // Mouse Wheel Listener with Content Panel Scroll Detection
    window.addEventListener("wheel", (event) => {
      if (state.menuOpen || state.drawerOpen || state.modalOpen || !state.preloaderDone || state.wheelLock || Math.abs(event.deltaY) < 18) return;

      const scrollArea = event.target.closest(".content-panel");
      if (scrollArea && scrollArea.scrollHeight > scrollArea.clientHeight) {
        const atTop = scrollArea.scrollTop <= 0;
        const atBottom = Math.ceil(scrollArea.scrollTop + scrollArea.clientHeight) >= scrollArea.scrollHeight;
        if ((event.deltaY < 0 && !atTop) || (event.deltaY > 0 && !atBottom)) return;
      }

      event.preventDefault();
      state.wheelLock = true;
      step(event.deltaY > 0 ? 1 : -1, true);
      setTimeout(() => { state.wheelLock = false; }, reducedMotion ? 80 : 700);
    }, { passive: false });

    // Touch Swipe Listeners
    window.addEventListener("touchstart", (e) => {
      state.touchStartY = e.changedTouches[0].clientY;
      const target = e.target instanceof Element ? e.target.closest(".content-panel") : null;
      const isScrollable = target && target.scrollHeight > target.clientHeight + 2;
      state.touchScrollArea = isScrollable ? target : null;

      if (state.touchScrollArea) {
        state.touchStartedAtTop = state.touchScrollArea.scrollTop <= 1;
        state.touchStartedAtBottom = Math.ceil(state.touchScrollArea.scrollTop + state.touchScrollArea.clientHeight) >= state.touchScrollArea.scrollHeight - 1;
      }
    }, { passive: true });

    window.addEventListener("touchend", (e) => {
      if (state.menuOpen || state.drawerOpen || state.modalOpen || !state.preloaderDone) return;
      const delta = state.touchStartY - e.changedTouches[0].clientY;
      if (Math.abs(delta) <= 50) return;

      const direction = delta > 0 ? 1 : -1;
      if (state.touchScrollArea) {
        const edgeReached = direction > 0 ? state.touchStartedAtBottom : state.touchStartedAtTop;
        if (!edgeReached) return;
      }

      step(direction, true);
    }, { passive: true });

    // Keyboard Arrow Listeners
    window.addEventListener("keydown", (e) => {
      if (state.drawerOpen) {
        if (e.key === "Escape") closeDrawer();
        return;
      }
      if (state.modalOpen) {
        if (e.key === "Escape") closeModal();
        return;
      }
      if (state.menuOpen) {
        if (e.key === "Escape") setMenu(false);
        return;
      }

      if (["ArrowDown", "PageDown", " "].includes(e.key)) {
        e.preventDefault();
        step(1, true);
      } else if (["ArrowUp", "PageUp"].includes(e.key)) {
        e.preventDefault();
        step(-1, true);
      } else if (e.key === "Home") {
        e.preventDefault();
        navigateToId("intro", true);
      }
    });

    // Browser Popstate (Back / Forward button support)
    window.addEventListener("popstate", () => {
      const id = window.location.hash.replace("#", "") || "intro";
      navigateToId(id, false);
    });

    // ------------------------------------------------------------------------
    // Mouse Cursor Tracking
    // ------------------------------------------------------------------------
    const cursorPosition = { currentX: -120, currentY: -120, targetX: -120, targetY: -120 };
    function renderCursor() {
      if (!scrollCursor) return;
      cursorPosition.currentX += (cursorPosition.targetX - cursorPosition.currentX) * 0.22;
      cursorPosition.currentY += (cursorPosition.targetY - cursorPosition.currentY) * 0.22;
      scrollCursor.style.setProperty("--cursor-x", `${cursorPosition.currentX}px`);
      scrollCursor.style.setProperty("--cursor-y", `${cursorPosition.currentY}px`);
      requestAnimationFrame(renderCursor);
    }

    window.addEventListener("pointermove", (e) => {
      cursorPosition.targetX = e.clientX;
      cursorPosition.targetY = e.clientY;
      body.classList.add("cursor-ready");
    }, { passive: true });

    const interactiveSel = 'a, button, [role="button"], input, select, textarea';
    document.addEventListener("pointerover", (e) => {
      body.classList.toggle("cursor-link", Boolean(e.target.closest(interactiveSel)));
    }, { passive: true });
    document.addEventListener("pointerout", (e) => {
      body.classList.toggle("cursor-link", Boolean(e.relatedTarget && e.relatedTarget.closest(interactiveSel)));
    }, { passive: true });

    requestAnimationFrame(renderCursor);

    // ------------------------------------------------------------------------
    // Case Study Slide-Out Drawer
    // ------------------------------------------------------------------------
    function openCaseStudy(projectId) {
      const data = caseStudies[projectId];
      if (!data || !projectDrawer || !drawerBody) return;

      state.drawerOpen = true;
      drawerKicker.textContent = data.kicker;

      drawerBody.innerHTML = `
        <div class="drawer-image-wrap">
          <img src="${data.image}" alt="${data.title}" />
        </div>
        <h3>${data.title}</h3>
        <p class="drawer-overview">${data.overview}</p>

        <div class="drawer-section-title">The Challenge</div>
        <p class="drawer-details-text">${data.challenge}</p>

        <div class="drawer-section-title">The UX & Design Solution</div>
        <p class="drawer-details-text">${data.solution}</p>

        <div class="drawer-section-title">Key Outcome & Metrics</div>
        <div class="skills-matrix" style="grid-template-columns: repeat(auto-fit, minmax(140px, 1fr));">
          ${data.metrics.map(m => `
            <div class="matrix-card">
              <h4>${m.val}</h4>
              <p>${m.label}</p>
            </div>
          `).join("")}
        </div>

        <div class="drawer-section-title">Tools & Competencies</div>
        <div class="drawer-pill-grid">
          ${data.tags.map(t => `<span class="tag-pill">${t}</span>`).join("")}
        </div>

        <div style="margin-top: 2rem;">
          <button type="button" class="btn-pill btn-pill--primary" data-contact-open style="width: 100%; justify-content: center;">
            Discuss This Project ↗
          </button>
        </div>
      `;

      drawerBackdrop?.classList.add("is-open");
      projectDrawer.classList.add("is-open");
      projectDrawer.setAttribute("aria-hidden", "false");

      // Rebind contact buttons inside drawer
      drawerBody.querySelectorAll("[data-contact-open]").forEach(btn => {
        btn.addEventListener("click", () => {
          closeDrawer();
          openModal();
        });
      });
    }

    function closeDrawer() {
      state.drawerOpen = false;
      drawerBackdrop?.classList.remove("is-open");
      projectDrawer?.classList.remove("is-open");
      projectDrawer?.setAttribute("aria-hidden", "true");
    }

    document.querySelectorAll("[data-open-project]").forEach((btn) => {
      btn.addEventListener("click", () => openCaseStudy(btn.dataset.openProject));
    });

    drawerClose?.addEventListener("click", closeDrawer);
    drawerBackdrop?.addEventListener("click", closeDrawer);

    // ------------------------------------------------------------------------
    // Contact Modal & Clipboard Copy
    // ------------------------------------------------------------------------
    function openModal() {
      state.modalOpen = true;
      contactModalWrap?.classList.add("is-open");
      contactModalWrap?.setAttribute("aria-hidden", "false");
    }

    function closeModal() {
      state.modalOpen = false;
      contactModalWrap?.classList.remove("is-open");
      contactModalWrap?.setAttribute("aria-hidden", "true");
    }

    document.querySelectorAll("[data-contact-open]").forEach((btn) => {
      btn.addEventListener("click", (e) => {
        e.preventDefault();
        setMenu(false);
        openModal();
      });
    });

    contactClose?.addEventListener("click", closeModal);
    contactModalWrap?.addEventListener("click", (e) => {
      if (e.target === contactModalWrap) closeModal();
    });

    // Copy to clipboard
    document.querySelectorAll("[data-copy]").forEach((btn) => {
      btn.addEventListener("click", () => {
        const text = btn.dataset.copy;
        navigator.clipboard.writeText(text).then(() => {
          btn.textContent = "Copied!";
          showToast(`Copied ${text} to clipboard!`);
          setTimeout(() => { btn.textContent = "Copy"; }, 2000);
        }).catch(() => {
          showToast(`Direct email: ${text}`);
        });
      });
    });

    function showToast(msg) {
      if (!toastMsg) return;
      toastMsg.textContent = msg;
      toastMsg.classList.add("show");
      setTimeout(() => toastMsg.classList.remove("show"), 2800);
    }

    // ------------------------------------------------------------------------
    // Direct Hash Initialization (e.g. christoph-nagel.dev/#mensch)
    // ------------------------------------------------------------------------
    const initialHash = window.location.hash.replace("#", "");
    if (initialHash && initialHash !== "intro") {
      const targetIdx = panels.findIndex((p) => p.id === initialHash);
      if (targetIdx > 0) {
        state.activeIndex = targetIdx;
        panels.forEach((p, idx) => {
          p.classList.toggle("is-active", idx === targetIdx);
          p.setAttribute("aria-hidden", idx === targetIdx ? "false" : "true");
        });
        const target = panels[targetIdx];
        const targetBg = target.dataset.bg || "assets/images/intro.jpg";
        stages[0].style.backgroundImage = `url('${targetBg}')`;
        body.dataset.section = target.id;
      }
    }

    updateNavigation();
    runPreloader();
  }

  // Boot on DOM ready
  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", boot);
  } else {
    boot();
  }
})();
