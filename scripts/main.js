/**
 * Shamil Ahmed T - Cinematic Portfolio
 * Interactive Scripts & Micro-interactions
 */

document.addEventListener('DOMContentLoaded', () => {
  initScrollProgress();
  initTopbar();
  initMobileNav();
  initIntersectionObserver();
  initHeroParallax();
  initScrollSpy();
  initBackToTop();
  initMagneticCursor();
  initModalLightbox();
  initVideoPreviews();
  initProjectFilters();
  initAboutTabs();
  initPortraitToggle();
});

/* ==========================================================================
   SCROLL PROGRESS BAR
   ========================================================================== */
function initScrollProgress() {
  const bar = document.getElementById('scrollProgress');
  if (!bar) return;

  const updateProgress = () => {
    const totalHeight = document.documentElement.scrollHeight - window.innerHeight;
    if (totalHeight <= 0) return;
    const progress = (window.scrollY / totalHeight) * 100;
    bar.style.width = `${Math.min(100, Math.max(0, progress))}%`;
  };

  window.addEventListener('scroll', updateProgress, { passive: true });
  updateProgress();
}

/* ==========================================================================
   TOPBAR SCROLL EFFECT
   ========================================================================== */
function initTopbar() {
  const topbar = document.getElementById('topbar');
  if (!topbar) return;

  const handleScroll = () => {
    if (window.scrollY > 50) {
      topbar.classList.add('is-scrolled');
    } else {
      topbar.classList.remove('is-scrolled');
    }
  };

  window.addEventListener('scroll', handleScroll, { passive: true });
  handleScroll();
}

/* ==========================================================================
   MOBILE NAVIGATION DRAWER
   ========================================================================== */
function initMobileNav() {
  const toggleBtn = document.getElementById('mobileToggle');
  const drawer = document.getElementById('mobileDrawer');
  const mobileLinks = document.querySelectorAll('.mobile-nav-link');

  if (!toggleBtn || !drawer) return;

  const toggleMenu = () => {
    const isOpen = drawer.classList.contains('is-open');
    if (isOpen) {
      drawer.classList.remove('is-open');
      toggleBtn.classList.remove('is-active');
      document.body.style.overflow = '';
    } else {
      drawer.classList.add('is-open');
      toggleBtn.classList.add('is-active');
      document.body.style.overflow = 'hidden';
    }
  };

  toggleBtn.addEventListener('click', toggleMenu);

  mobileLinks.forEach(link => {
    link.addEventListener('click', () => {
      drawer.classList.remove('is-open');
      toggleBtn.classList.remove('is-active');
      document.body.style.overflow = '';
    });
  });
}

/* ==========================================================================
   INTERSECTION OBSERVER FOR FADE-IN REVEALS & CASCADING STAGGER
   ========================================================================== */
function initIntersectionObserver() {
  const elements = document.querySelectorAll('.animate-on-scroll, .animate-zoom, .animate-slide-left, .animate-slide-right');
  if (!elements.length) return;

  const observer = new IntersectionObserver((entries, obs) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('is-visible');
        // Clear inline transition-delay after reveal so hover transitions are instant
        setTimeout(() => {
          entry.target.style.transitionDelay = '';
        }, 1200);
        obs.unobserve(entry.target);
      }
    });
  }, {
    threshold: 0.08,
    rootMargin: '0px 0px -40px 0px'
  });

  elements.forEach((el) => {
    const parent = el.parentElement;
    if (parent) {
      const siblings = Array.from(parent.children).filter(child =>
        child.matches('.animate-on-scroll, .animate-zoom, .animate-slide-left, .animate-slide-right')
      );
      const indexInParent = siblings.indexOf(el);
      if (indexInParent > 0) {
        const delay = Math.min((indexInParent % 6) * 0.09, 0.45);
        el.style.transitionDelay = `${delay}s`;
      }
    }
    observer.observe(el);
  });
}

/* ==========================================================================
   HERO 3D PARALLAX SCROLL EFFECT
   ========================================================================== */
function initHeroParallax() {
  const heroImg = document.querySelector('.hero-backdrop img');
  const heroContent = document.querySelector('.hero-content');
  if (!heroImg && !heroContent) return;

  let ticking = false;

  const onScroll = () => {
    if (!ticking) {
      window.requestAnimationFrame(() => {
        const scrollY = window.scrollY;
        if (scrollY < window.innerHeight * 1.2) {
          if (heroImg) {
            heroImg.style.transform = `translate3d(0, ${scrollY * 0.28}px, 0)`;
          }
          if (heroContent) {
            const opacity = Math.max(0, 1 - (scrollY / (window.innerHeight * 0.85)));
            heroContent.style.opacity = opacity.toFixed(2);
            heroContent.style.transform = `translate3d(0, ${scrollY * 0.14}px, 0)`;
          }
        }
        ticking = false;
      });
      ticking = true;
    }
  };

  window.addEventListener('scroll', onScroll, { passive: true });
}

/* ==========================================================================
   SCROLLSPY ACTIVE NAVIGATION LINKS
   ========================================================================== */
function initScrollSpy() {
  const sections = document.querySelectorAll('section[id], footer[id]');
  const navLinks = document.querySelectorAll('.nav-link');
  if (!sections.length || !navLinks.length) return;

  const onScroll = () => {
    const scrollPos = window.scrollY + 220;

    sections.forEach(section => {
      const top = section.offsetTop;
      const height = section.offsetHeight;
      const id = section.getAttribute('id');

      if (scrollPos >= top && scrollPos < top + height) {
        navLinks.forEach(link => {
          if (link.getAttribute('href') === `#${id}`) {
            link.classList.add('is-active');
          } else {
            link.classList.remove('is-active');
          }
        });
      }
    });
  };

  window.addEventListener('scroll', onScroll, { passive: true });
  onScroll();
}

/* ==========================================================================
   BACK TO TOP FLOATING BUTTON
   ========================================================================== */
function initBackToTop() {
  const btn = document.getElementById('backToTopBtn');
  if (!btn) return;

  const onScroll = () => {
    if (window.scrollY > 400) {
      btn.classList.add('is-active');
    } else {
      btn.classList.remove('is-active');
    }
  };

  btn.addEventListener('click', () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  });

  window.addEventListener('scroll', onScroll, { passive: true });
}

/* ==========================================================================
   MAGNETIC "VIEW PROJECT" CIRCULAR CURSOR (CAROUSEL TRACK)
   ========================================================================== */
function initMagneticCursor() {
  const cursor = document.getElementById('customCursor');
  const carousel = document.getElementById('personalWorksTrack');

  if (!cursor || !carousel) return;

  // Track mouse position over the document
  let mouseX = -100;
  let mouseY = -100;
  let cursorX = -100;
  let cursorY = -100;

  window.addEventListener('mousemove', (e) => {
    mouseX = e.clientX;
    mouseY = e.clientY;
  }, { passive: true });

  // Smooth lerp loop
  function renderCursor() {
    cursorX += (mouseX - cursorX) * 0.2;
    cursorY += (mouseY - cursorY) * 0.2;
    cursor.style.left = `${cursorX}px`;
    cursor.style.top = `${cursorY}px`;
    requestAnimationFrame(renderCursor);
  }
  requestAnimationFrame(renderCursor);

  // Activate cursor inside the carousel area
  carousel.addEventListener('mouseenter', () => {
    cursor.classList.add('is-active');
  });

  carousel.addEventListener('mouseleave', () => {
    cursor.classList.remove('is-active');
  });
}

/* ==========================================================================
   MODAL LIGHTBOX (VIDEOS & FRAMES)
   ========================================================================== */
function initModalLightbox() {
  const modal = document.getElementById('modalLightbox');
  const modalClose = document.getElementById('modalClose');
  const modalMediaWrap = document.getElementById('modalMediaWrap');
  const modalTitle = document.getElementById('modalTitle');
  const modalCategory = document.getElementById('modalCategory');
  const modalDesc = document.getElementById('modalDesc');

  if (!modal || !modalClose) return;

  const openModal = (data) => {
    modalTitle.textContent = data.title || '';
    modalCategory.textContent = data.category || '';
    modalDesc.textContent = data.desc || '';

    // Clear previous media
    modalMediaWrap.innerHTML = '';

    if (data.type === 'video' && data.videoSrc) {
      const video = document.createElement('video');
      video.src = data.videoSrc;
      video.controls = true;
      video.autoplay = true;
      video.playsInline = true;
      video.style.width = '100%';
      video.style.maxHeight = '70vh';
      video.style.borderRadius = '8px';
      video.style.backgroundColor = '#000';
      modalMediaWrap.appendChild(video);

      const playPromise = video.play();
      if (playPromise !== undefined) {
        playPromise.catch(err => {
          console.warn('Autoplay unmuted blocked by browser policy, fallback to muted autoplay:', err);
          video.muted = true;
          video.play().catch(() => {});
        });
      }
    } else {
      const img = document.createElement('img');
      img.src = data.imgSrc || '';
      img.alt = data.title || '';
      img.className = 'w-full max-h-[70vh] object-contain';
      modalMediaWrap.appendChild(img);
    }

    modal.classList.add('is-open');
    document.body.style.overflow = 'hidden';
  };

  const closeModal = () => {
    modal.classList.remove('is-open');
    document.body.style.overflow = '';
    // Pause any playing video inside modal
    const video = modalMediaWrap.querySelector('video');
    if (video) {
      video.pause();
    }
    setTimeout(() => {
      modalMediaWrap.innerHTML = '';
    }, 300);
  };

  modalClose.addEventListener('click', closeModal);

  modal.addEventListener('click', (e) => {
    if (e.target === modal) {
      closeModal();
    }
  });

  window.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && modal.classList.contains('is-open')) {
      closeModal();
    }
  });

  // Attach click events to all modal trigger elements
  const triggers = document.querySelectorAll('[data-modal-trigger]');
  triggers.forEach(trigger => {
    trigger.addEventListener('click', () => {
      const data = {
        title: trigger.getAttribute('data-title') || '',
        category: trigger.getAttribute('data-category') || '',
        desc: trigger.getAttribute('data-desc') || '',
        imgSrc: trigger.getAttribute('data-img') || '',
        videoSrc: trigger.getAttribute('data-video') || '',
        type: trigger.getAttribute('data-type') || 'image'
      };
      openModal(data);
    });
  });
}

/* ==========================================================================
   ABOUT ME AUDIENCE TABS SWITCHER
   ========================================================================== */
function initAboutTabs() {
  const tabs = document.querySelectorAll('.about-tab-btn');
  const narrative = document.getElementById('aboutNarrative');

  if (!tabs.length || !narrative) return;

  const narratives = {
    anyone: `I am a videographer, editor, and director based in Vazhakkad, Kerala. I bring creative ideas to life through cinematic storytelling, dynamic edits, and thoughtful direction. Having collaborated on television broadcasts, documentaries, and commercial ad films, I move effortlessly between technical camera operations and creative visual vision.`,
    productions: `For production houses and broadcast studios, I bring hands-on experience from Jaihind TV Trivandrum. I understand the pace, precision, and technical rigor required for television programs and creative multi-cam shoots. Dependable under tight schedules and always focused on broadcast-quality delivery.`,
    directors: `For directors, I serve as a trusted creative and technical right hand. I handle camera framing, lighting depth, and rhythm on set, ensuring every frame matches your vision. In post-production, I cut with rhythmic pace and nuanced color grading in Adobe Premiere Pro and After Effects.`,
    brands: `For brands and businesses, I deliver end-to-end visual content that grabs attention and builds prestige. From concept development, directing, and drone cinematography to post-production and social media management (as proven with Paddle Up Kayaking), I craft films that drive real engagement.`
  };

  tabs.forEach(tab => {
    tab.addEventListener('click', () => {
      tabs.forEach(t => t.classList.remove('is-active'));
      tab.classList.add('is-active');

      const key = tab.getAttribute('data-tab');
      if (narratives[key]) {
        narrative.style.opacity = '0';
        narrative.style.transform = 'translateY(8px)';
        setTimeout(() => {
          narrative.textContent = narratives[key];
          narrative.style.opacity = '1';
          narrative.style.transform = 'translateY(0)';
        }, 200);
      }
    });
  });
}

/* ==========================================================================
   PORTRAIT CLICK TO TOGGLE GRAYSCALE/COLOR
   ========================================================================== */
function initPortraitToggle() {
  const wrap = document.getElementById('aboutPortraitWrap');
  if (!wrap) return;

  wrap.addEventListener('click', () => {
    wrap.classList.toggle('is-grayscale');
  });
}

/* ==========================================================================
   VIDEO CARD LAZY LOADING & VIEWPORT PLAYBACK
   ========================================================================== */
function initVideoPreviews() {
  const cards = document.querySelectorAll('.project-card');
  if (!cards.length) return;

  const loadVideoSrc = (video) => {
    if (!video) return;
    if (!video.getAttribute('src') && video.dataset.src) {
      video.setAttribute('src', video.dataset.src);
      video.load();
    }
  };

  if ('IntersectionObserver' in window) {
    // 1. Proximity observer: lazily loads video source when within 250px of viewport
    const lazyObserver = new IntersectionObserver((entries, observer) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          const video = entry.target.querySelector('video.project-card-media');
          if (video) {
            loadVideoSrc(video);
            observer.unobserve(entry.target);
          }
        }
      });
    }, {
      rootMargin: '250px 0px 250px 0px'
    });

    // 2. Playback observer: plays video when visible, pauses when out of view
    const playbackObserver = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        const video = entry.target.querySelector('video.project-card-media');
        if (!video) return;

        if (entry.isIntersecting) {
          loadVideoSrc(video);
          video.muted = true;
          video.playsInline = true;
          const playPromise = video.play();
          if (playPromise !== undefined) {
            playPromise.catch(() => {
              // Autoplay will proceed on user scroll / interaction
            });
          }
        } else {
          if (!video.paused) {
            video.pause();
          }
        }
      });
    }, {
      threshold: 0.15
    });

    cards.forEach(card => {
      const video = card.querySelector('video.project-card-media');
      if (!video) return;

      video.muted = true;
      video.playsInline = true;
      lazyObserver.observe(card);
      playbackObserver.observe(card);

      // On mouse hover, ensure loaded and start playback immediately
      card.addEventListener('mouseenter', () => {
        loadVideoSrc(video);
        video.muted = true;
        video.play().catch(() => {});
      });
    });
  } else {
    // Fallback if IntersectionObserver is not supported
    cards.forEach(card => {
      const video = card.querySelector('video.project-card-media');
      if (video) loadVideoSrc(video);
    });
  }
}

/* ==========================================================================
   PROJECT CATEGORY FILTERS
   ========================================================================== */
function initProjectFilters() {
  const filterBtns = document.querySelectorAll('.filter-btn');
  const cards = document.querySelectorAll('.project-card');
  if (!filterBtns.length || !cards.length) return;

  filterBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      filterBtns.forEach(b => b.classList.remove('is-active'));
      btn.classList.add('is-active');

      const filter = btn.getAttribute('data-filter');

      cards.forEach(card => {
        const group = card.getAttribute('data-group');
        if (filter === 'all' || group === filter) {
          card.style.display = '';
          setTimeout(() => {
            card.style.opacity = '1';
            card.style.transform = 'translateY(0) scale(1)';
          }, 10);
        } else {
          card.style.opacity = '0';
          card.style.transform = 'translateY(10px) scale(0.98)';
          setTimeout(() => {
            card.style.display = 'none';
          }, 250);
        }
      });
    });
  });
}

