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

  /* ── Active nav link on scroll ─────────────── */
  const sections = document.querySelectorAll('section[id]');
  const navItems = document.querySelectorAll('.nav-item');

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
    mobileToggle.addEventListener('click', function (e) {
      e.stopPropagation();
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

  /* ── Stat count-up on first view ─────────────── */
  const countEls = document.querySelectorAll('.stat-number[data-count]');
  if (countEls.length && 'IntersectionObserver' in window) {
    const counted = new WeakSet();
    const counterObserver = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (!entry.isIntersecting || counted.has(entry.target)) return;
        counted.add(entry.target);
        animateCount(entry.target);
      });
    }, { threshold: 0.4 });
    countEls.forEach(function (el) { counterObserver.observe(el); });
  }

  function animateCount(el) {
    const target = parseFloat(el.getAttribute('data-count'));
    const suffix = el.getAttribute('data-suffix') || '';
    const duration = 1100;
    const start = performance.now();

    function tick(now) {
      const progress = Math.min((now - start) / duration, 1);
      const eased = 1 - Math.pow(1 - progress, 3);
      el.textContent = Math.round(target * eased) + suffix;
      if (progress < 1) requestAnimationFrame(tick);
    }
    requestAnimationFrame(tick);
  }

  /* ── Chat widget ──────────────────────────────
     Layout/UI only for now — sendMessage() below is a stub.
     Swap its body for a fetch() to the Netlify Function once wired up. */
  const chatFab      = document.getElementById('chat-fab');
  const chatPanel     = document.getElementById('chat-panel');
  const chatClose     = document.getElementById('chat-close');
  const chatForm      = document.getElementById('chat-form');
  const chatInput     = document.getElementById('chat-input');
  const chatMessages  = document.getElementById('chat-messages');

  function openChat() {
    chatPanel.classList.add('open');
    chatFab.setAttribute('aria-expanded', 'true');
    chatFab.querySelector('i').className = 'bi bi-x-lg';
    setTimeout(function () { chatInput.focus(); }, 220);
  }

  function closeChat() {
    chatPanel.classList.remove('open');
    chatFab.setAttribute('aria-expanded', 'false');
    chatFab.querySelector('i').className = 'bi bi-chat-dots-fill';
  }

  function appendBubble(text, role) {
    const bubble = document.createElement('div');
    bubble.className = 'chat-bubble chat-bubble-' + role;
    bubble.textContent = text;
    chatMessages.appendChild(bubble);
    chatMessages.scrollTop = chatMessages.scrollHeight;
    return bubble;
  }

  // Stub: replace with a fetch() to your Netlify Function + LLM call.
  function sendMessage(text) {
    appendBubble(text, 'user');
    setTimeout(function () {
      appendBubble("This is just the UI preview — I'm not connected to a live model yet. Ask Saurabh directly for now!", 'bot');
    }, 500);
  }

  if (chatFab && chatPanel) {
    chatFab.addEventListener('click', function (e) {
      e.stopPropagation();
      if (chatPanel.classList.contains('open')) {
        closeChat();
      } else {
        openChat();
      }
    });

    chatClose.addEventListener('click', function (e) {
      e.stopPropagation();
      closeChat();
    });

    document.addEventListener('click', function (e) {
      if (
        chatPanel.classList.contains('open') &&
        !chatPanel.contains(e.target) &&
        !chatFab.contains(e.target)
      ) {
        closeChat();
      }
    });

    document.querySelectorAll('.chat-chip').forEach(function (chip) {
      chip.addEventListener('click', function () {
        sendMessage(chip.getAttribute('data-prompt') || chip.textContent);
      });
    });

    chatForm.addEventListener('submit', function (e) {
      e.preventDefault();
      const text = chatInput.value.trim();
      if (!text) return;
      chatInput.value = '';
      sendMessage(text);
    });
  }

})();
