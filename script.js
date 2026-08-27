/* =========================================================
   DevOps Portfolio — script.js
   Vanilla JS only, no dependencies.
   ========================================================= */

document.addEventListener('DOMContentLoaded', () => {

  /* ---------- 1. Loading screen ---------- */
  (function loaderScreen() {
    const loader = document.getElementById('loader');
    const loaderText = document.getElementById('loaderText');
    const bootLine = 'booting devops-portfolio...';
    let i = 0;

    document.body.style.overflow = 'hidden';

    function typeBoot() {
      if (i <= bootLine.length) {
        loaderText.textContent = bootLine.slice(0, i);
        i++;
        setTimeout(typeBoot, 28);
      }
    }
    typeBoot();

    window.addEventListener('load', () => {
      setTimeout(() => {
        loader.classList.add('is-hidden');
        document.body.style.overflow = '';
      }, 600);
    });

    // Fallback in case 'load' already fired
    setTimeout(() => loader.classList.add('is-hidden'), 3000);
  })();

  /* ---------- 2. Sticky navbar on scroll ---------- */
  const navbar = document.getElementById('navbar');
  function handleNavbarScroll() {
    if (window.scrollY > 40) {
      navbar.classList.add('is-scrolled');
    } else {
      navbar.classList.remove('is-scrolled');
    }
  }
  handleNavbarScroll();
  window.addEventListener('scroll', handleNavbarScroll, { passive: true });

  /* ---------- 3. Mobile nav toggle ---------- */
  const navToggle = document.getElementById('navToggle');
  const navMenu = document.getElementById('navMenu');

  function closeMenu() {
    navMenu.classList.remove('is-open');
    navToggle.classList.remove('is-active');
    navToggle.setAttribute('aria-expanded', 'false');
  }

  navToggle.addEventListener('click', () => {
    const isOpen = navMenu.classList.toggle('is-open');
    navToggle.classList.toggle('is-active', isOpen);
    navToggle.setAttribute('aria-expanded', String(isOpen));
  });

  document.querySelectorAll('.nav__link').forEach(link => {
    link.addEventListener('click', closeMenu);
  });

  /* ---------- 4. Active link on scroll ---------- */
  const sections = document.querySelectorAll('main section[id]');
  const navLinks = document.querySelectorAll('.nav__link');

  function setActiveLink() {
    const scrollPos = window.scrollY + window.innerHeight * 0.35;
    let currentId = sections[0] ? sections[0].id : '';

    sections.forEach(section => {
      if (scrollPos >= section.offsetTop) {
        currentId = section.id;
      }
    });

    navLinks.forEach(link => {
      link.classList.toggle('active-link', link.getAttribute('href') === `#${currentId}`);
    });
  }
  setActiveLink();
  window.addEventListener('scroll', setActiveLink, { passive: true });

  /* ---------- 5. Typing animation (hero role) ---------- */
  (function typingAnimation() {
    const el = document.getElementById('typingText');
    if (!el) return;

    const phrases = [
      'Aspiring DevOps Engineer',
      'Linux & Cloud Enthusiast',
      'AWS Explorer',
      'Automation-first Thinker'
    ];

    let phraseIndex = 0;
    let charIndex = 0;
    let deleting = false;

    function tick() {
      const current = phrases[phraseIndex];

      if (!deleting) {
        charIndex++;
        el.textContent = current.slice(0, charIndex);
        if (charIndex === current.length) {
          deleting = true;
          setTimeout(tick, 1600);
          return;
        }
      } else {
        charIndex--;
        el.textContent = current.slice(0, charIndex);
        if (charIndex === 0) {
          deleting = false;
          phraseIndex = (phraseIndex + 1) % phrases.length;
        }
      }

      setTimeout(tick, deleting ? 35 : 65);
    }
    tick();
  })();

  /* ---------- 6. Terminal hero animation ---------- */
  (function terminalAnimation() {
    const body = document.getElementById('terminalBody');
    if (!body) return;

    const lines = [
      { type: 'cmd', text: 'whoami' },
      { type: 'out', text: 'your-name — aspiring devops engineer' },
      { type: 'cmd', text: 'cat skills.txt' },
      { type: 'out', text: 'linux · aws · docker · git · nginx · ci/cd' },
      { type: 'cmd', text: 'aws ec2 describe-instances --status' },
      { type: 'out', text: 'InstanceState: "running" ✓' },
      { type: 'cmd', text: 'systemctl status nginx' },
      { type: 'out', text: 'active (running) since boot ✓' },
      { type: 'cmd', text: 'echo "let\'s build something reliable"' },
    ];

    let lineIndex = 0;

    function renderNextLine() {
      if (lineIndex >= lines.length) {
        const cursor = document.createElement('span');
        cursor.className = 'terminal__cursor';
        body.appendChild(cursor);
        return;
      }

      const line = lines[lineIndex];
      const row = document.createElement('div');

      if (line.type === 'cmd') {
        row.innerHTML = `<span class="prompt">$</span> <span class="path"></span>`;
        body.appendChild(row);
        const target = row.querySelector('.path');
        typeInto(target, line.text, () => {
          lineIndex++;
          setTimeout(renderNextLine, 260);
        });
      } else {
        row.className = 'out';
        row.textContent = line.text;
        row.style.opacity = '0';
        body.appendChild(row);
        requestAnimationFrame(() => {
          row.style.transition = 'opacity 0.3s ease';
          row.style.opacity = '1';
        });
        lineIndex++;
        setTimeout(renderNextLine, 380);
      }
    }

    function typeInto(target, text, done) {
      let i = 0;
      (function step() {
        if (i <= text.length) {
          target.textContent = text.slice(0, i);
          i++;
          setTimeout(step, 26);
        } else {
          done();
        }
      })();
    }

    // Start once the terminal scrolls into view
    const observer = new IntersectionObserver(entries => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          renderNextLine();
          observer.disconnect();
        }
      });
    }, { threshold: 0.3 });
    observer.observe(body);
  })();

  /* ---------- 7. Scroll reveal ---------- */
  (function scrollReveal() {
    const items = document.querySelectorAll('[data-reveal]');
    if (!items.length) return;

    const observer = new IntersectionObserver(entries => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          const delay = entry.target.getAttribute('data-reveal-delay');
          entry.target.style.transitionDelay = delay ? `${delay}ms` : '0ms';
          entry.target.classList.add('is-visible');
          observer.unobserve(entry.target);
        }
      });
    }, { threshold: 0.15 });

    items.forEach(item => observer.observe(item));
  })();

  /* ---------- 8. Animated skill progress bars ---------- */
  (function skillBars() {
    const cards = document.querySelectorAll('.skill-card');
    if (!cards.length) return;

    const observer = new IntersectionObserver(entries => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          const card = entry.target;
          const fill = card.querySelector('.skill-card__fill');
          const target = card.getAttribute('data-progress') || '0';
          requestAnimationFrame(() => {
            fill.style.width = `${target}%`;
          });
          card.classList.add('is-visible');
          observer.unobserve(card);
        }
      });
    }, { threshold: 0.35 });

    cards.forEach(card => observer.observe(card));
  })();

  /* ---------- 9. Back to top button ---------- */
  const backToTop = document.getElementById('backToTop');
  function toggleBackToTop() {
    backToTop.classList.toggle('is-visible', window.scrollY > 480);
  }
  toggleBackToTop();
  window.addEventListener('scroll', toggleBackToTop, { passive: true });
  backToTop.addEventListener('click', () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  });

  /* ---------- 10. Contact form validation ---------- */
  (function contactForm() {
    const form = document.getElementById('contactForm');
    if (!form) return;

    const nameField = document.getElementById('name');
    const emailField = document.getElementById('email');
    const messageField = document.getElementById('message');
    const submitBtn = document.getElementById('submitBtn');
    const submitLabel = document.getElementById('submitLabel');
    const successMsg = document.getElementById('formSuccess');

    const errors = {
      name: document.getElementById('nameError'),
      email: document.getElementById('emailError'),
      message: document.getElementById('messageError'),
    };

    function setError(field, message) {
      const group = field.closest('.form-group');
      group.classList.toggle('has-error', Boolean(message));
      errors[field.name].textContent = message || '';
    }

    function validEmail(value) {
      return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value);
    }

    function validate() {
      let ok = true;

      if (!nameField.value.trim()) {
        setError(nameField, 'Please enter your name.');
        ok = false;
      } else {
        setError(nameField, '');
      }

      if (!emailField.value.trim()) {
        setError(emailField, 'Please enter your email.');
        ok = false;
      } else if (!validEmail(emailField.value.trim())) {
        setError(emailField, 'Please enter a valid email address.');
        ok = false;
      } else {
        setError(emailField, '');
      }

      if (!messageField.value.trim()) {
        setError(messageField, 'Please add a short message.');
        ok = false;
      } else if (messageField.value.trim().length < 10) {
        setError(messageField, 'Message should be at least 10 characters.');
        ok = false;
      } else {
        setError(messageField, '');
      }

      return ok;
    }

    [nameField, emailField, messageField].forEach(field => {
      field.addEventListener('blur', validate);
      field.addEventListener('input', () => {
        if (field.closest('.form-group').classList.contains('has-error')) validate();
      });
    });

    form.addEventListener('submit', (e) => {
      e.preventDefault();
      successMsg.classList.remove('is-visible');

      if (!validate()) return;

      submitBtn.disabled = true;
      submitLabel.textContent = 'Sending...';

      // Simulated send — replace with a real endpoint (e.g. Formspree, EmailJS) when ready.
      setTimeout(() => {
        submitBtn.disabled = false;
        submitLabel.textContent = 'Send Message';
        successMsg.classList.add('is-visible');
        form.reset();
        setTimeout(() => successMsg.classList.remove('is-visible'), 5000);
      }, 900);
    });
  })();

  /* ---------- 11. Footer year ---------- */
  const yearEl = document.getElementById('year');
  if (yearEl) yearEl.textContent = new Date().getFullYear();

});
