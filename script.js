/* =========================================================
   IRON PULSE FITNESS — script.js
========================================================= */

document.addEventListener('DOMContentLoaded', () => {

  /* ---------- Footer year ---------- */
  const yearEl = document.getElementById('year');
  if (yearEl) yearEl.textContent = new Date().getFullYear();

  /* ---------- Navbar background on scroll ---------- */
  const navbar = document.getElementById('navbar');
  const onScroll = () => {
    if (window.scrollY > 30) navbar.classList.add('scrolled');
    else navbar.classList.remove('scrolled');

    backToTop.classList.toggle('show', window.scrollY > 500);
  };

  /* ---------- Mobile menu ---------- */
  const hamburger = document.getElementById('hamburger');
  const navLinks = document.getElementById('navLinks');

  hamburger.addEventListener('click', () => {
    const isOpen = navLinks.classList.toggle('open');
    hamburger.classList.toggle('active', isOpen);
    hamburger.setAttribute('aria-expanded', isOpen);
    document.body.style.overflow = isOpen ? 'hidden' : '';
  });

  navLinks.querySelectorAll('a').forEach(link => {
    link.addEventListener('click', () => {
      navLinks.classList.remove('open');
      hamburger.classList.remove('active');
      hamburger.setAttribute('aria-expanded', 'false');
      document.body.style.overflow = '';
    });
  });

  /* ---------- Smooth scroll (with fixed navbar offset) ---------- */
  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
      const targetId = this.getAttribute('href');
      if (targetId.length <= 1) return;
      const target = document.querySelector(targetId);
      if (!target) return;
      e.preventDefault();
      const offset = 80;
      const top = target.getBoundingClientRect().top + window.pageYOffset - offset;
      window.scrollTo({ top, behavior: 'smooth' });
    });
  });

  /* ---------- Scroll reveal animations ---------- */
  const revealEls = document.querySelectorAll('.reveal, .reveal-up');
  const io = new IntersectionObserver((entries) => {
    entries.forEach((entry, i) => {
      if (entry.isIntersecting) {
        setTimeout(() => entry.target.classList.add('in-view'), i * 60);
        io.unobserve(entry.target);
      }
    });
  }, { threshold: 0.15, rootMargin: '0px 0px -60px 0px' });

  revealEls.forEach(el => io.observe(el));

  /* ---------- Back to top button ---------- */
  const backToTop = document.getElementById('backToTop');
  backToTop.addEventListener('click', () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  });

  window.addEventListener('scroll', onScroll);
  onScroll();

  /* ---------- Contact form validation ---------- */
  const form = document.getElementById('contactForm');
  const successMsg = document.getElementById('formSuccess');

  const fields = {
    name: {
      input: document.getElementById('name'),
      error: document.getElementById('nameError'),
      validate: (v) => v.trim().length >= 2,
      message: 'Please enter your full name (min 2 characters).'
    },
    email: {
      input: document.getElementById('email'),
      error: document.getElementById('emailError'),
      validate: (v) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v.trim()),
      message: 'Please enter a valid email address.'
    },
    phone: {
      input: document.getElementById('phone'),
      error: document.getElementById('phoneError'),
      validate: (v) => /^[+\d][\d\s-]{7,}$/.test(v.trim()),
      message: 'Please enter a valid phone number.'
    },
    message: {
      input: document.getElementById('message'),
      error: document.getElementById('messageError'),
      validate: (v) => v.trim().length >= 10,
      message: 'Message should be at least 10 characters.'
    }
  };

  function validateField(key) {
    const field = fields[key];
    const value = field.input.value;
    const isValid = field.validate(value);
    field.input.classList.toggle('invalid', !isValid);
    field.error.textContent = isValid ? '' : field.message;
    return isValid;
  }

  Object.keys(fields).forEach(key => {
    fields[key].input.addEventListener('blur', () => validateField(key));
    fields[key].input.addEventListener('input', () => {
      if (fields[key].input.classList.contains('invalid')) validateField(key);
    });
  });

  if (form) {
    form.addEventListener('submit', (e) => {
      e.preventDefault();
      let allValid = true;
      Object.keys(fields).forEach(key => {
        if (!validateField(key)) allValid = false;
      });

      if (allValid) {
        successMsg.classList.add('show');
        form.reset();
        setTimeout(() => successMsg.classList.remove('show'), 5000);
      } else {
        successMsg.classList.remove('show');
        const firstInvalid = form.querySelector('.invalid');
        if (firstInvalid) firstInvalid.focus();
      }
    });
  }

});
