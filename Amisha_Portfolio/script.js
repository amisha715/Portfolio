/* ============================================
   AMISHA MAURYA PORTFOLIO - SCRIPT.JS
   GSAP + ScrollTrigger + Custom Interactions
   ============================================ */

/* ---- GSAP Registration ---- */
gsap.registerPlugin(ScrollTrigger);

/* ============================================
   1. PRELOADER
   ============================================ */
(function initPreloader() {
  const preloader = document.getElementById('preloader');
  const bar = document.querySelector('.preloader-bar');
  const count = document.querySelector('.preloader-count');
  const wipe = document.querySelector('.preloader-wipe');
  let progress = 0;

  const interval = setInterval(() => {
    progress += Math.random() * 8 + 2;
    if (progress >= 100) {
      progress = 100;
      clearInterval(interval);
      bar.style.width = '100%';
      count.textContent = '100%';

      // Wipe out
      setTimeout(() => {
        gsap.to(wipe, {
          scaleY: 1,
          duration: 0.5,
          ease: 'power3.inOut',
          transformOrigin: 'bottom',
          onComplete: () => {
            preloader.style.display = 'none';
            gsap.to(wipe, {
              scaleY: 0,
              duration: 0.5,
              ease: 'power3.inOut',
              transformOrigin: 'top',
              onComplete: () => {
                wipe.style.display = 'none';
                document.body.classList.remove('loading');
                initHeroAnimations();
              }
            });
          }
        });
      }, 400);
    } else {
      bar.style.width = progress + '%';
      count.textContent = Math.floor(progress) + '%';
    }
  }, 40);
})();

/* ============================================
   2. CUSTOM CURSOR
   ============================================ */
(function initCursor() {
  const outer = document.getElementById('cursor-outer');
  const inner = document.getElementById('cursor-inner');
  const glow = document.getElementById('mouse-glow');

  let mouseX = 0, mouseY = 0;
  let outerX = 0, outerY = 0;

  document.addEventListener('mousemove', (e) => {
    mouseX = e.clientX;
    mouseY = e.clientY;
    inner.style.left = mouseX + 'px';
    inner.style.top = mouseY + 'px';
    if (glow) {
      glow.style.left = mouseX + 'px';
      glow.style.top = mouseY + 'px';
    }
  });

  function animateCursor() {
    outerX += (mouseX - outerX) * 0.12;
    outerY += (mouseY - outerY) * 0.12;
    outer.style.left = outerX + 'px';
    outer.style.top = outerY + 'px';
    requestAnimationFrame(animateCursor);
  }
  animateCursor();

  // Hover effects
  const hoverEls = document.querySelectorAll(
    'a, button, .filter-btn, .masonry-item, .project-card, .skill-category-card, .cert-card, .catalogue-card, .social-link'
  );

  hoverEls.forEach(el => {
    el.addEventListener('mouseenter', () => document.body.classList.add('cursor-hover'));
    el.addEventListener('mouseleave', () => document.body.classList.remove('cursor-hover'));
  });
})();

/* ============================================
   3. NAVIGATION
   ============================================ */
(function initNav() {
  const nav = document.getElementById('nav');
  const sections = document.querySelectorAll('section[id]');
  const navLinks = document.querySelectorAll('.nav-links a');

  // Scroll-based styling
  window.addEventListener('scroll', () => {
    if (window.scrollY > 80) {
      nav.classList.add('scrolled');
    } else {
      nav.classList.remove('scrolled');
    }

    // Active link highlight
    let current = '';
    sections.forEach(section => {
      const st = section.offsetTop - 120;
      if (window.scrollY >= st) current = section.getAttribute('id');
    });

    navLinks.forEach(link => {
      link.classList.remove('active');
      if (link.getAttribute('href') === '#' + current) {
        link.classList.add('active');
      }
    });
  });

  // Smooth scroll on nav link click
  navLinks.forEach(link => {
    link.addEventListener('click', (e) => {
      e.preventDefault();
      const target = document.querySelector(link.getAttribute('href'));
      if (target) {
        target.scrollIntoView({ behavior: 'smooth' });
      }
    });
  });

  // Mobile menu toggle
  const menuBtn = document.querySelector('.nav-menu-btn');
  const navLinksWrap = document.querySelector('.nav-links');
  if (menuBtn) {
    menuBtn.addEventListener('click', () => {
      navLinksWrap.style.display = navLinksWrap.style.display === 'flex' ? 'none' : 'flex';
      navLinksWrap.style.flexDirection = 'column';
      navLinksWrap.style.position = 'absolute';
      navLinksWrap.style.top = '70px';
      navLinksWrap.style.left = '0';
      navLinksWrap.style.right = '0';
      navLinksWrap.style.background = 'rgba(10,10,10,0.98)';
      navLinksWrap.style.padding = '24px';
      navLinksWrap.style.borderBottom = '1px solid rgba(255,255,255,0.08)';
      navLinksWrap.style.backdropFilter = 'blur(20px)';
    });
  }
})();

/* ============================================
   4. HERO PARTICLE CANVAS
   ============================================ */
function initParticles() {
  const canvas = document.getElementById('hero-canvas');
  if (!canvas) return;
  const ctx = canvas.getContext('2d');

  function resize() {
    canvas.width = canvas.offsetWidth;
    canvas.height = canvas.offsetHeight;
  }
  resize();
  window.addEventListener('resize', resize);

  const particles = [];
  const count = 80;
  let mouseX = 0, mouseY = 0;

  canvas.addEventListener('mousemove', e => {
    const rect = canvas.getBoundingClientRect();
    mouseX = e.clientX - rect.left;
    mouseY = e.clientY - rect.top;
  });

  for (let i = 0; i < count; i++) {
    particles.push({
      x: Math.random() * canvas.width,
      y: Math.random() * canvas.height,
      vx: (Math.random() - 0.5) * 0.5,
      vy: (Math.random() - 0.5) * 0.5,
      radius: Math.random() * 2 + 0.5,
      alpha: Math.random() * 0.5 + 0.1,
    });
  }

  function draw() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    particles.forEach((p, i) => {
      p.x += p.vx;
      p.y += p.vy;

      // Mouse repulsion
      const dx = p.x - mouseX;
      const dy = p.y - mouseY;
      const dist = Math.sqrt(dx * dx + dy * dy);
      if (dist < 100) {
        p.vx += (dx / dist) * 0.3;
        p.vy += (dy / dist) * 0.3;
      }

      // Boundary bounce
      if (p.x < 0 || p.x > canvas.width) p.vx *= -1;
      if (p.y < 0 || p.y > canvas.height) p.vy *= -1;

      // Dampen speed
      p.vx *= 0.995;
      p.vy *= 0.995;

      // Draw particle
      ctx.beginPath();
      ctx.arc(p.x, p.y, p.radius, 0, Math.PI * 2);
      ctx.fillStyle = `rgba(255, 107, 53, ${p.alpha})`;
      ctx.fill();

      // Draw connections
      particles.slice(i + 1).forEach(p2 => {
        const dx = p.x - p2.x;
        const dy = p.y - p2.y;
        const d = Math.sqrt(dx * dx + dy * dy);
        if (d < 120) {
          ctx.beginPath();
          ctx.moveTo(p.x, p.y);
          ctx.lineTo(p2.x, p2.y);
          ctx.strokeStyle = `rgba(255, 107, 53, ${0.08 * (1 - d / 120)})`;
          ctx.lineWidth = 0.5;
          ctx.stroke();
        }
      });
    });

    requestAnimationFrame(draw);
  }
  draw();
}

/* ============================================
   5. HERO ANIMATIONS
   ============================================ */
function initHeroAnimations() {
  // Init particles
  initParticles();

  // Hero elements entrance
  const tl = gsap.timeline({ defaults: { ease: 'power3.out' } });

  tl.from('.hero-badge', { y: 30, opacity: 0, duration: 0.8, delay: 0.2 })
    .from('.hero-title', { y: 50, opacity: 0, duration: 1 }, '-=0.4')
    .from('.hero-sub', { y: 30, opacity: 0, duration: 0.8 }, '-=0.6')
    .from('.hero-btns', { y: 30, opacity: 0, duration: 0.8 }, '-=0.5')
    .from('.hero-identity', { y: 20, opacity: 0, duration: 0.6 }, '-=0.4')
    .from('.hero-portrait-frame', { scale: 0.9, opacity: 0, duration: 1 }, '-=0.8')
    .from('.tool-badge', { scale: 0, opacity: 0, duration: 0.5, stagger: 0.15 }, '-=0.5');

  // Init all scroll-based animations
  initScrollAnimations();
}

/* ============================================
   6. SCROLL ANIMATIONS (GSAP ScrollTrigger)
   ============================================ */
function initScrollAnimations() {
  // Generic reveal elements
  gsap.utils.toArray('.reveal').forEach(el => {
    gsap.to(el, {
      y: 0,
      opacity: 1,
      duration: 0.9,
      ease: 'power3.out',
      scrollTrigger: {
        trigger: el,
        start: 'top 88%',
        toggleActions: 'play none none none'
      }
    });
  });

  // Section headings — Y slide only, no opacity
  gsap.utils.toArray('.section-tag, .section-title, .section-desc').forEach((el) => {
    gsap.fromTo(el,
      { y: 24 },
      {
        y: 0,
        duration: 0.7,
        ease: 'power3.out',
        immediateRender: false,
        clearProps: 'transform',
        scrollTrigger: {
          trigger: el,
          start: 'top 98%',
          toggleActions: 'play none none none'
        }
      }
    );
  });

  // Stats Counter Animation
  initCounters();

  // Skills bars
  initSkillBars();

  // Timeline draw
  initTimeline();

  // Stagger cards — animate Y only, NEVER opacity, so all cards stay fully visible at all times
  [
    '#skills .skill-category-card',
    '#projects .project-card',
    '#certifications .cert-card',
    '#catalogue .catalogue-card'
  ].forEach(selector => {
    const cards = gsap.utils.toArray(selector);
    if (!cards.length) return;
    const section = cards[0].closest('section') || cards[0];
    // Ensure all cards are fully visible before any animation
    cards.forEach(c => {
      c.style.opacity = '1';
      c.style.visibility = 'visible';
    });
    gsap.fromTo(cards,
      { y: 40 },
      {
        y: 0,
        duration: 0.7,
        stagger: 0.1,
        ease: 'power3.out',
        immediateRender: false,
        clearProps: 'transform',
        scrollTrigger: {
          trigger: section,
          start: 'top 95%',
          toggleActions: 'play none none none'
        }
      }
    );
  });

  // About section — Y slide only, no opacity change
  gsap.fromTo('.about-image-side',
    { x: -40 },
    { x: 0, duration: 1, ease: 'power3.out', immediateRender: false, clearProps: 'transform',
      scrollTrigger: { trigger: '#about', start: 'top 90%', toggleActions: 'play none none none' }
    }
  );

  gsap.utils.toArray('.about-content > *').forEach((el, i) => {
    gsap.fromTo(el,
      { x: 30 },
      { x: 0, duration: 0.7, delay: i * 0.06, ease: 'power3.out', immediateRender: false, clearProps: 'transform',
        scrollTrigger: { trigger: '#about', start: 'top 90%', toggleActions: 'play none none none' }
      }
    );
  });

  // Philosophy parallax
  gsap.to('.philosophy-quote', {
    y: -40,
    ease: 'none',
    scrollTrigger: {
      trigger: '#philosophy',
      start: 'top bottom',
      end: 'bottom top',
      scrub: true
    }
  });

  // Masonry items — scale-up only, no opacity
  const masonryItems = gsap.utils.toArray('.masonry-item');
  masonryItems.forEach((item) => {
    gsap.fromTo(item,
      { scale: 0.94 },
      {
        scale: 1,
        duration: 0.5,
        ease: 'power2.out',
        immediateRender: false,
        clearProps: 'transform',
        scrollTrigger: {
          trigger: item,
          start: 'top 99%',
          toggleActions: 'play none none none'
        }
      }
    );
  });
}

/* ============================================
   7. COUNTER ANIMATION
   ============================================ */
function initCounters() {
  const counters = document.querySelectorAll('.stat-number');
  counters.forEach(counter => {
    const target = parseInt(counter.getAttribute('data-target'));
    const suffix = counter.getAttribute('data-suffix') || '';

    ScrollTrigger.create({
      trigger: counter,
      start: 'top 85%',
      onEnter: () => {
        gsap.to({ val: 0 }, {
          val: target,
          duration: 2,
          ease: 'power2.out',
          onUpdate: function () {
            counter.textContent = Math.ceil(this.targets()[0].val) + suffix;
          }
        });
      }
    });
  });
}

/* ============================================
   8. SKILL BARS
   ============================================ */
function initSkillBars() {
  const bars = document.querySelectorAll('.skill-bar-fill');
  bars.forEach(bar => {
    const target = bar.getAttribute('data-width');
    ScrollTrigger.create({
      trigger: bar,
      start: 'top 85%',
      onEnter: () => {
        bar.style.width = target + '%';
      }
    });
  });
}

/* ============================================
   9. TIMELINE DRAW ANIMATION
   ============================================ */
function initTimeline() {
  const line = document.querySelector('.timeline-line');
  if (!line) return;

  ScrollTrigger.create({
    trigger: '.timeline',
    start: 'top 70%',
    end: 'bottom 30%',
    scrub: 0.5,
    onUpdate: self => {
      line.style.height = (self.progress * 100) + '%';
    }
  });

  gsap.utils.toArray('.timeline-item').forEach((item) => {
    gsap.fromTo(item,
      { x: 30 },
      {
        x: 0,
        duration: 0.7,
        ease: 'power3.out',
        immediateRender: false,
        clearProps: 'transform',
        scrollTrigger: {
          trigger: item,
          start: 'top 92%',
          toggleActions: 'play none none none'
        }
      }
    );
  });
}

/* ============================================
   10. MASONRY FILTER
   ============================================ */
(function initMasonryFilter() {
  const filterBtns = document.querySelectorAll('.filter-btn');
  const masonryItems = document.querySelectorAll('.masonry-item');

  filterBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      filterBtns.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');

      const filter = btn.getAttribute('data-filter');

      masonryItems.forEach(item => {
        const cat = item.getAttribute('data-category');
        if (filter === 'all' || cat === filter) {
          gsap.to(item, { opacity: 1, scale: 1, duration: 0.4, ease: 'power2.out', display: 'block' });
          item.style.display = 'block';
        } else {
          gsap.to(item, {
            opacity: 0, scale: 0.85, duration: 0.3, ease: 'power2.in',
            onComplete: () => { item.style.display = 'none'; }
          });
        }
      });
    });
  });
})();

/* ============================================
   11. LIGHTBOX
   ============================================ */
(function initLightbox() {
  const lightbox = document.getElementById('lightbox');
  const lightboxImg = document.querySelector('.lightbox-img');
  const closeBtn = document.querySelector('.lightbox-close');

  document.querySelectorAll('.masonry-item').forEach(item => {
    item.addEventListener('click', () => {
      const src = item.querySelector('img')?.src;
      if (src && lightboxImg && lightbox) {
        lightboxImg.src = src;
        lightbox.classList.add('active');
        document.body.style.overflow = 'hidden';
        gsap.from(lightboxImg, { scale: 0.85, opacity: 0, duration: 0.4, ease: 'back.out(1.5)' });
      }
    });
  });

  if (closeBtn) {
    closeBtn.addEventListener('click', () => {
      lightbox.classList.remove('active');
      document.body.style.overflow = '';
    });
  }

  if (lightbox) {
    lightbox.addEventListener('click', (e) => {
      if (e.target === lightbox) {
        lightbox.classList.remove('active');
        document.body.style.overflow = '';
      }
    });
  }

  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && lightbox?.classList.contains('active')) {
      lightbox.classList.remove('active');
      document.body.style.overflow = '';
    }
  });
})();

/* ============================================
   12. ABOUT IMAGE 3D TILT
   ============================================ */
(function initTilt() {
  const tiltEls = document.querySelectorAll('.about-portrait-wrap, .hero-portrait-frame');
  tiltEls.forEach(el => {
    el.addEventListener('mousemove', e => {
      const rect = el.getBoundingClientRect();
      const x = (e.clientX - rect.left) / rect.width - 0.5;
      const y = (e.clientY - rect.top) / rect.height - 0.5;
      gsap.to(el, {
        rotateY: x * 10,
        rotateX: -y * 10,
        transformPerspective: 700,
        duration: 0.5,
        ease: 'power2.out'
      });
    });
    el.addEventListener('mouseleave', () => {
      gsap.to(el, { rotateY: 0, rotateX: 0, duration: 0.5, ease: 'power2.out' });
    });
  });
})();

/* ============================================
   13. CONTACT FORM
   ============================================ */
(function initContactForm() {
  const form = document.getElementById('contact-form');
  if (!form) return;

  form.addEventListener('submit', (e) => {
    e.preventDefault();
    const btn = form.querySelector('.form-submit');
    const originalText = btn.innerHTML;

    btn.innerHTML = `<svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M20 6L9 17l-5-5"/></svg> Message Sent!`;
    btn.style.background = '#22c55e';

    setTimeout(() => {
      btn.innerHTML = originalText;
      btn.style.background = '';
      form.reset();
    }, 3000);
  });
})();

/* ============================================
   14. MAGNETIC BUTTONS
   ============================================ */
(function initMagnetic() {
  const buttons = document.querySelectorAll('.btn-primary, .btn-secondary, .nav-cta');
  buttons.forEach(btn => {
    btn.addEventListener('mousemove', e => {
      const rect = btn.getBoundingClientRect();
      const x = e.clientX - rect.left - rect.width / 2;
      const y = e.clientY - rect.top - rect.height / 2;
      gsap.to(btn, {
        x: x * 0.25,
        y: y * 0.25,
        duration: 0.3,
        ease: 'power2.out'
      });
    });
    btn.addEventListener('mouseleave', () => {
      gsap.to(btn, { x: 0, y: 0, duration: 0.5, ease: 'elastic.out(1, 0.5)' });
    });
  });
})();

/* ============================================
   15. SMOOTH SCROLL CTA BUTTONS
   ============================================ */
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
  anchor.addEventListener('click', function (e) {
    e.preventDefault();
    const target = document.querySelector(this.getAttribute('href'));
    if (target) target.scrollIntoView({ behavior: 'smooth' });
  });
});
