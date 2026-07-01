/**
 * Saurabh Shinde — Portfolio
 * Main JS: Navbar scroll, mobile menu, active nav, back-to-top, AOS
 */
(function () {
  'use strict';

  /* ── AOS Init ─────────────────────────────── */
  AOS.init({
    duration: 500,
    easing: 'ease-out-cubic',
    once: true,
    offset: 60,
  });

  /* ── Navbar: add shadow on scroll ─────────── */
  const navbar = document.getElementById('navbar');
  function onScroll() {
    if (window.scrollY > 20) {
      navbar.classList.add('scrolled');
    } else {
      navbar.classList.remove('scrolled');
    }

    /* Back-to-top visibility */
    const btt = document.getElementById('back-to-top');
    if (btt) {
      if (window.scrollY > 400) {
        btt.classList.add('visible');
      } else {
        btt.classList.remove('visible');
      }
    }

    /* Active nav link highlight */
    activateNavLink();
  }

  window.addEventListener('scroll', onScroll, { passive: true });
  onScroll(); // run once on load

  /* ── Active nav link on scroll ─────────────── */
  const sections = document.querySelectorAll('section[id]');
  const navItems = document.querySelectorAll('.nav-item');

  function activateNavLink() {
    const scrollPos = window.scrollY + 100;
    sections.forEach(function (section) {
      const top    = section.offsetTop;
      const bottom = top + section.offsetHeight;
      const id     = section.getAttribute('id');
      if (scrollPos >= top && scrollPos < bottom) {
        navItems.forEach(function (link) {
          link.classList.remove('active');
          if (link.getAttribute('href') === '#' + id) {
            link.classList.add('active');
          }
        });
      }
    });
  }

  /* ── Mobile menu toggle ─────────────────────── */
  const mobileToggle = document.getElementById('mobile-toggle');
  const mobileMenu   = document.getElementById('mobile-menu');

  if (mobileToggle && mobileMenu) {
    mobileToggle.addEventListener('click', function () {
      const isOpen = mobileMenu.classList.toggle('open');
      mobileToggle.querySelector('i').className = isOpen
        ? 'bi bi-x'
        : 'bi bi-list';
    });

    /* Close mobile menu when a link is clicked */
    mobileMenu.querySelectorAll('a').forEach(function (link) {
      link.addEventListener('click', function () {
        mobileMenu.classList.remove('open');
        mobileToggle.querySelector('i').className = 'bi bi-list';
      });
    });
  }

  /* ── Close mobile menu on outside click ──────── */
  document.addEventListener('click', function (e) {
    if (
      mobileMenu &&
      mobileMenu.classList.contains('open') &&
      !mobileMenu.contains(e.target) &&
      !mobileToggle.contains(e.target)
    ) {
      mobileMenu.classList.remove('open');
      mobileToggle.querySelector('i').className = 'bi bi-list';
    }
  });

  /* ── Smooth scroll for all anchor links ──────── */
  document.querySelectorAll('a[href^="#"]').forEach(function (anchor) {
    anchor.addEventListener('click', function (e) {
      const href = anchor.getAttribute('href');
      if (href === '#' || href === '#cv-btn' || anchor.id === 'cv-btn' || anchor.id === 'cv-link') return;
      const target = document.querySelector(href);
      if (target) {
        e.preventDefault();
        const navH = navbar ? navbar.offsetHeight : 68;
        const top  = target.getBoundingClientRect().top + window.scrollY - navH - 16;
        window.scrollTo({ top: top, behavior: 'smooth' });
      }
    });
  });

})();
