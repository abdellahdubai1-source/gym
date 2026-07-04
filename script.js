/* IRON PULSE FITNESS — script.js */

document.addEventListener('DOMContentLoaded', () => {

  /* ---------- Loader ---------- */
  const loader = document.querySelector('.loader');
  if (loader) {
    window.addEventListener('load', () => setTimeout(() => loader.classList.add('hide'), 400));
  }

  /* ---------- Sticky nav ---------- */
  const nav = document.querySelector('.nav');
  const onScroll = () => {
    if (!nav) return;
    if (window.scrollY > 40) nav.classList.add('scrolled');
    else nav.classList.remove('scrolled');
    backTop && backTop.classList.toggle('show', window.scrollY > 600);
  };
  document.addEventListener('scroll', onScroll, { passive: true });
  onScroll();

  /* ---------- Mobile menu ---------- */
  const burger = document.querySelector('.burger');
  const mobileMenu = document.querySelector('.mobile-menu');
  if (burger && mobileMenu) {
    burger.addEventListener('click', () => mobileMenu.classList.toggle('open'));
    mobileMenu.querySelectorAll('a').forEach(a => a.addEventListener('click', () => mobileMenu.classList.remove('open')));
  }

  /* ---------- Active nav link ---------- */
  const current = location.pathname.split('/').pop() || 'index.html';
  document.querySelectorAll('.nav-links a, .mobile-menu a').forEach(a => {
    const href = a.getAttribute('href');
    if (href === current || (current === '' && href === 'index.html')) a.classList.add('active');
  });

  /* ---------- Scroll reveal ---------- */
  const revealEls = document.querySelectorAll('.reveal, .pulse-divider');
  if ('IntersectionObserver' in window) {
    const io = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.remove('pre');
          entry.target.classList.add('in');
          entry.target.classList.add('in-view');
          io.unobserve(entry.target);
        }
      });
    }, { threshold: 0.12, rootMargin: '0px 0px -40px 0px' });

    revealEls.forEach(el => {
      const rect = el.getBoundingClientRect();
      const alreadyVisible = rect.top < window.innerHeight * 0.92;
      if (!alreadyVisible) {
        // Only hide elements that are below the fold, then animate them
        // in on scroll. Anything already on screen stays visible.
        el.classList.add('pre');
      } else {
        el.classList.add('in', 'in-view');
      }
      io.observe(el);
    });
  }
  // If IntersectionObserver isn't supported, elements simply stay at
  // their CSS default (fully visible) — no animation, no missing content.

  /* ---------- Animated counters ---------- */
  const counters = document.querySelectorAll('[data-count]');
  const counterIO = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (!entry.isIntersecting) return;
      const el = entry.target;
      const target = parseInt(el.dataset.count, 10);
      const duration = 1600;
      const start = performance.now();
      const step = (now) => {
        const progress = Math.min((now - start) / duration, 1);
        const eased = 1 - Math.pow(1 - progress, 3);
        el.textContent = Math.floor(eased * target);
        if (progress < 1) requestAnimationFrame(step);
        else el.textContent = target;
      };
      requestAnimationFrame(step);
      counterIO.unobserve(el);
    });
  }, { threshold: 0.5 });
  counters.forEach(el => counterIO.observe(el));

  /* ---------- Back to top ---------- */
  const backTop = document.querySelector('.back-top');
  if (backTop) backTop.addEventListener('click', () => window.scrollTo({ top: 0, behavior: 'smooth' }));

  /* ---------- Button ripple glow position ---------- */
  document.querySelectorAll('.btn').forEach(btn => {
    btn.addEventListener('pointermove', (e) => {
      const r = btn.getBoundingClientRect();
      btn.style.setProperty('--rx', `${e.clientX - r.left}px`);
      btn.style.setProperty('--ry', `${e.clientY - r.top}px`);
    });
  });

  /* ---------- Testimonial slider ---------- */
  const track = document.querySelector('.testi-track');
  if (track) {
    const slides = track.querySelectorAll('.testi-slide');
    const dotsWrap = document.querySelector('.testi-dots');
    let idx = 0;
    slides.forEach((_, i) => {
      const dot = document.createElement('button');
      if (i === 0) dot.classList.add('active');
      dot.addEventListener('click', () => goTo(i));
      dotsWrap.appendChild(dot);
    });
    const dots = dotsWrap.querySelectorAll('button');
    function goTo(i) {
      idx = (i + slides.length) % slides.length;
      track.style.transform = `translateX(-${idx * 100}%)`;
      dots.forEach(d => d.classList.remove('active'));
      dots[idx].classList.add('active');
    }
    let auto = setInterval(() => goTo(idx + 1), 5500);
    document.querySelector('.testi-slider').addEventListener('mouseenter', () => clearInterval(auto));
    document.querySelector('.testi-slider').addEventListener('mouseleave', () => auto = setInterval(() => goTo(idx + 1), 5500));
  }

  /* ---------- Gallery lightbox ---------- */
  const gItems = document.querySelectorAll('.masonry .g-item img');
  const lightbox = document.querySelector('.lightbox');
  if (gItems.length && lightbox) {
    const lbImg = lightbox.querySelector('img');
    let current = 0;
    const imgs = Array.from(gItems).map(i => i.src);
    const open = (i) => { current = i; lbImg.src = imgs[i]; lightbox.classList.add('open'); };
    gItems.forEach((img, i) => img.parentElement.addEventListener('click', () => open(i)));
    lightbox.querySelector('.lb-close').addEventListener('click', () => lightbox.classList.remove('open'));
    lightbox.querySelector('.lb-next').addEventListener('click', () => open((current + 1) % imgs.length));
    lightbox.querySelector('.lb-prev').addEventListener('click', () => open((current - 1 + imgs.length) % imgs.length));
    lightbox.addEventListener('click', (e) => { if (e.target === lightbox) lightbox.classList.remove('open'); });
  }

  /* ---------- FAQ accordion ---------- */
  document.querySelectorAll('.acc-item').forEach(item => {
    const q = item.querySelector('.acc-q');
    const a = item.querySelector('.acc-a');
    q.addEventListener('click', () => {
      const isOpen = item.classList.contains('open');
      document.querySelectorAll('.acc-item.open').forEach(o => {
        o.classList.remove('open');
        o.querySelector('.acc-a').style.maxHeight = null;
      });
      if (!isOpen) {
        item.classList.add('open');
        a.style.maxHeight = a.scrollHeight + 'px';
      }
    });
  });

  /* ---------- BMI Calculator ---------- */
  const bmiForm = document.querySelector('#bmi-form');
  if (bmiForm) {
    let unit = 'metric';
    const unitBtns = bmiForm.querySelectorAll('.unit-toggle button');
    unitBtns.forEach(b => b.addEventListener('click', () => {
      unitBtns.forEach(x => x.classList.remove('active'));
      b.classList.add('active');
      unit = b.dataset.unit;
      document.querySelector('.metric-fields').style.display = unit === 'metric' ? 'block' : 'none';
      document.querySelector('.imperial-fields').style.display = unit === 'imperial' ? 'block' : 'none';
    }));

    bmiForm.addEventListener('submit', (e) => {
      e.preventDefault();
      let bmi;
      if (unit === 'metric') {
        const h = parseFloat(document.querySelector('#height-cm').value) / 100;
        const w = parseFloat(document.querySelector('#weight-kg').value);
        if (!h || !w) return;
        bmi = w / (h * h);
      } else {
        const h = parseFloat(document.querySelector('#height-in').value);
        const w = parseFloat(document.querySelector('#weight-lb').value);
        if (!h || !w) return;
        bmi = (w / (h * h)) * 703;
      }
      bmi = Math.round(bmi * 10) / 10;
      const scoreEl = document.querySelector('.bmi-result .score');
      const statusEl = document.querySelector('.bmi-result .status');
      const tipEl = document.querySelector('.bmi-result .tip');
      const marker = document.querySelector('.bmi-gauge .marker');
      scoreEl.textContent = bmi;

      let status, tip, pct;
      if (bmi < 18.5) { status = 'Underweight'; tip = 'Focus on structured strength training and a calorie-surplus nutrition plan to build lean mass safely. Book a session with an Iron Pulse trainer to design a gain-phase program.'; pct = (bmi / 18.5) * 20; }
      else if (bmi < 25) { status = 'Healthy Range'; tip = 'You are in a healthy range — keep training consistently and maintain balanced nutrition. Consider our performance programs to push toward specific strength or conditioning goals.'; pct = 20 + ((bmi - 18.5) / (25 - 18.5)) * 30; }
      else if (bmi < 30) { status = 'Overweight'; tip = 'A combination of resistance training and structured cardio, paired with our Weight Loss Diet plan, will help move your BMI toward the healthy range.'; pct = 50 + ((bmi - 25) / (30 - 25)) * 25; }
      else { status = 'Obese'; tip = 'We recommend a personalised consultation with an Iron Pulse trainer and nutritionist to build a safe, sustainable weight-loss and training program.'; pct = 75 + Math.min(((bmi - 30) / 15) * 25, 25); }

      statusEl.textContent = status;
      tipEl.textContent = tip;
      marker.style.left = `calc(${Math.min(pct, 100)}% - 1px)`;
    });
  }

  /* ---------- Contact form validation ---------- */
  const contactForm = document.querySelector('.contact-form');
  if (contactForm) {
    contactForm.addEventListener('submit', (e) => {
      e.preventDefault();
      let valid = true;
      contactForm.querySelectorAll('[required]').forEach(input => {
        const field = input.closest('.field');
        const isEmail = input.type === 'email';
        const emailOk = !isEmail || /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(input.value);
        if (!input.value.trim() || !emailOk) {
          field.classList.add('invalid');
          valid = false;
        } else {
          field.classList.remove('invalid');
        }
      });
      const success = document.querySelector('.form-success');
      if (valid) {
        success.classList.add('show');
        contactForm.reset();
        setTimeout(() => success.classList.remove('show'), 5000);
      }
    });
  }

  /* ---------- Newsletter ---------- */
  document.querySelectorAll('.newsletter').forEach(form => {
    form.addEventListener('submit', (e) => {
      e.preventDefault();
      const input = form.querySelector('input');
      if (input.value.trim()) {
        input.value = '';
        input.placeholder = 'Subscribed ✓';
      }
    });
  });

  // Safety net: force-reveal anything still hidden after 2s no matter what
  // (covers slow devices, tab throttling, or edge-case observer misses).
  setTimeout(() => {
    document.querySelectorAll('.reveal.pre, .pulse-divider.pre').forEach(el => {
      el.classList.remove('pre');
      el.classList.add('in', 'in-view');
    });
  }, 2000);

});
