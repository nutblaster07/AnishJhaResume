/**
 * Anish Jha — Digital Resume
 * script.js  |  Navigation, scroll-reveal, and micro-interactions
 */

document.addEventListener('DOMContentLoaded', () => {

  /* ── Activate reveal animations only when JS is running ── */
  document.body.classList.add('js-loaded');

  /* ── Footer year ─────────────────────────────────────────── */
  const footerYear = document.getElementById('footerYear');
  if (footerYear) footerYear.textContent = `© ${new Date().getFullYear()}`;

  /* ── Navbar: scroll glass effect ──────────────────────────── */
  const navbar = document.getElementById('navbar');

  function handleNavScroll() {
    if (window.scrollY > 40) {
      navbar.classList.add('scrolled');
    } else {
      navbar.classList.remove('scrolled');
    }
  }

  window.addEventListener('scroll', handleNavScroll, { passive: true });
  handleNavScroll(); // run once on load

  /* ── Navbar: mobile toggle ────────────────────────────────── */
  const navToggle = document.getElementById('navToggle');
  const navLinks  = document.getElementById('navLinks');

  navToggle.addEventListener('click', () => {
    const isOpen = navLinks.classList.toggle('open');
    navToggle.setAttribute('aria-expanded', isOpen);

    // Animate hamburger → X
    const spans = navToggle.querySelectorAll('span');
    if (isOpen) {
      spans[0].style.transform = 'translateY(7px) rotate(45deg)';
      spans[1].style.opacity   = '0';
      spans[2].style.transform = 'translateY(-7px) rotate(-45deg)';
    } else {
      spans[0].style.transform = '';
      spans[1].style.opacity   = '';
      spans[2].style.transform = '';
    }
  });

  // Close menu on link click
  navLinks.querySelectorAll('a').forEach(link => {
    link.addEventListener('click', () => {
      navLinks.classList.remove('open');
      navToggle.setAttribute('aria-expanded', false);
      navToggle.querySelectorAll('span').forEach(s => {
        s.style.transform = '';
        s.style.opacity   = '';
      });
    });
  });

  /* ── Active nav link on scroll ────────────────────────────── */
  const sections = document.querySelectorAll('section[id]');
  const navAnchors = document.querySelectorAll('.nav-links a[href^="#"]');

  function setActiveLink() {
    let current = '';
    sections.forEach(section => {
      const top = section.offsetTop - 100;
      if (window.scrollY >= top) {
        current = section.getAttribute('id');
      }
    });

    navAnchors.forEach(a => {
      a.classList.toggle('active', a.getAttribute('href') === `#${current}`);
    });
  }

  window.addEventListener('scroll', setActiveLink, { passive: true });
  setActiveLink();

  /* ── Scroll-reveal (IntersectionObserver) ─────────────────── */
  const reveals = document.querySelectorAll('.reveal');

  // Hero elements are already in viewport — reveal them immediately
  // (small timeout lets the CSS transition still play as an entry animation)
  document.querySelectorAll('.hero .reveal').forEach((el, i) => {
    setTimeout(() => el.classList.add('visible'), 120 + i * 80);
  });

  const revealObserver = new IntersectionObserver(
    (entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('visible');
          revealObserver.unobserve(entry.target);
        }
      });
    },
    {
      threshold: 0.1,
      rootMargin: '0px 0px -30px 0px',
    }
  );

  // Only observe elements outside the hero
  reveals.forEach(el => {
    if (!el.closest('.hero')) revealObserver.observe(el);
  });

  /* ── Stagger children inside timeline & grids ──────────────── */
  // When a parent comes into view, stagger its direct reveal children
  const staggerParents = document.querySelectorAll('.timeline, .edu-grid, .skills-grid, .about-stats, .contact-cards, .lang-row');

  staggerParents.forEach(parent => {
    const children = parent.querySelectorAll('.reveal, .timeline-item, .edu-card, .skill-card, .stat-card, .contact-card, .lang-item');
    children.forEach((child, i) => {
      // Add inline delay for natural stagger
      child.style.transitionDelay = `${i * 0.08}s`;
    });
  });

  /* ── Smooth hover ripple on skill cards ───────────────────── */
  document.querySelectorAll('.skill-card').forEach(card => {
    card.addEventListener('mouseenter', function(e) {
      const rect = this.getBoundingClientRect();
      const ripple = document.createElement('span');
      ripple.style.cssText = `
        position: absolute;
        border-radius: 50%;
        width: 120px; height: 120px;
        background: rgba(245, 166, 35, 0.06);
        top: ${e.clientY - rect.top - 60}px;
        left: ${e.clientX - rect.left - 60}px;
        transform: scale(0);
        transition: transform 0.5s ease, opacity 0.5s ease;
        pointer-events: none;
        opacity: 1;
      `;
      // need relative on card
      this.style.position = 'relative';
      this.style.overflow  = 'hidden';
      this.appendChild(ripple);
      requestAnimationFrame(() => {
        ripple.style.transform = 'scale(4)';
        ripple.style.opacity   = '0';
      });
      setTimeout(() => ripple.remove(), 600);
    });
  });

  /* ── Typing cursor blink effect on hero name ──────────────── */
  // After all hero reveals complete, add subtle pulse to italic "Jha"
  const heroEm = document.querySelector('.hero-name em');
  if (heroEm) {
    setTimeout(() => {
      heroEm.style.transition = 'color 2s ease';
    }, 1200);
  }

  /* ── Keyboard navigation: close mobile menu on Escape ─────── */
  document.addEventListener('keydown', e => {
    if (e.key === 'Escape' && navLinks.classList.contains('open')) {
      navLinks.classList.remove('open');
      navToggle.setAttribute('aria-expanded', false);
      navToggle.querySelectorAll('span').forEach(s => {
        s.style.transform = '';
        s.style.opacity   = '';
      });
    }
  });

  /* ── Parallax micro-shift on hero blobs (desktop only) ───── */
  if (window.matchMedia('(min-width: 900px) and (prefers-reduced-motion: no-preference)').matches) {
    const blobs = document.querySelectorAll('.blob');
    window.addEventListener('mousemove', e => {
      const cx = window.innerWidth  / 2;
      const cy = window.innerHeight / 2;
      const dx = (e.clientX - cx) / cx;
      const dy = (e.clientY - cy) / cy;

      blobs.forEach((blob, i) => {
        const factor = (i + 1) * 10;
        blob.style.transform = `translate(${dx * factor}px, ${dy * factor}px)`;
      });
    }, { passive: true });
  }

  /* ── Contact card: copy email on click ───────────────────── */
  document.querySelectorAll('.contact-card').forEach(card => {
    const val = card.querySelector('.cc-value');
    if (!val) return;
    const isEmail = val.textContent.includes('@');
    if (!isEmail) return;

    card.style.cursor = 'pointer';
    card.addEventListener('click', async (e) => {
      e.preventDefault();
      try {
        await navigator.clipboard.writeText(val.textContent.trim());
        const original = val.textContent;
        val.textContent = 'Copied! ✓';
        setTimeout(() => (val.textContent = original), 1600);
      } catch {
        // fallback: just follow mailto
        window.location.href = `mailto:${val.textContent.trim()}`;
      }
    });
  });

});