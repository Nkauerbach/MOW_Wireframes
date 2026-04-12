/* ══════════════════════════════════════════════════════════════
   MOW Wake County — Shared JavaScript
   Auto-detects page components. No page-specific config needed.
   ══════════════════════════════════════════════════════════════ */

document.addEventListener('DOMContentLoaded', () => {

  /* ── 1. Mobile Hamburger Menu ──────────────────────────────── */
  const navInner = document.querySelector('.nav-inner');
  const navCenter = document.querySelector('.nav-center');
  if (navInner && navCenter) {
    const hamburger = document.createElement('button');
    hamburger.className = 'hamburger';
    hamburger.setAttribute('aria-label', 'Toggle navigation');
    hamburger.innerHTML = '<span></span><span></span><span></span>';
    navInner.insertBefore(hamburger, navCenter);

    hamburger.addEventListener('click', (e) => {
      e.stopPropagation();
      navCenter.classList.toggle('open');
    });

    // Close menu when clicking a nav link (mobile)
    navCenter.querySelectorAll('a').forEach(link => {
      link.addEventListener('click', () => {
        if (window.innerWidth <= 768) navCenter.classList.remove('open');
      });
    });

    // Close menu when clicking outside
    document.addEventListener('click', (e) => {
      if (!e.target.closest('.navbar')) navCenter.classList.remove('open');
    });
  }

  /* ── 2. Dropdown Click Support (touch / accessibility) ─────── */
  document.querySelectorAll('.nav-item > a').forEach(toggle => {
    toggle.addEventListener('click', (e) => {
      const item = toggle.parentElement;
      const dropdown = item.querySelector('.dropdown');
      if (!dropdown) return;

      // On mobile or if it's a parent-level link with children, toggle dropdown
      if (window.innerWidth <= 768) {
        e.preventDefault();
        const wasOpen = item.classList.contains('open');
        // Close all other dropdowns
        document.querySelectorAll('.nav-item.open').forEach(el => {
          if (el !== item) el.classList.remove('open');
        });
        item.classList.toggle('open', !wasOpen);
      }
    });
  });

  /* ── 3. Smooth Scroll for Anchor Links ─────────────────────── */
  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', (e) => {
      const id = anchor.getAttribute('href');
      if (id === '#' || id.length < 2) return; // skip dead links
      const target = document.querySelector(id);
      if (!target) return;
      e.preventDefault();
      const navbarH = 90;
      const y = target.getBoundingClientRect().top + window.scrollY - navbarH - 12;
      window.scrollTo({ top: y, behavior: 'smooth' });
    });
  });

  /* ── 4. News Filter Bar ────────────────────────────────────── */
  const filterBar = document.querySelector('.filter-bar');
  if (filterBar) {
    const chips = filterBar.querySelectorAll('.filter-chip');
    const stories = document.querySelectorAll('.story-card');

    chips.forEach(chip => {
      chip.addEventListener('click', () => {
        // Update active chip
        chips.forEach(c => c.classList.remove('active'));
        chip.classList.add('active');

        const filter = chip.dataset.filter || 'all';
        stories.forEach(card => {
          if (filter === 'all' || card.classList.contains(filter)) {
            card.style.display = '';
          } else {
            card.style.display = 'none';
          }
        });
      });
    });
  }

  /* ── 5. FAQ Accordion ──────────────────────────────────────── */
  const faqSection = document.querySelector('.faq-section');
  if (faqSection) {
    faqSection.querySelectorAll('.faq-item').forEach(item => {
      const question = item.querySelector('.faq-q');
      const answer = item.querySelector('.faq-a');
      if (!question || !answer) return;

      // Set initial state — expanded by default on load
      answer.style.maxHeight = answer.scrollHeight + 'px';
      answer.style.opacity = '1';

      question.addEventListener('click', () => {
        const isOpen = answer.style.maxHeight !== '0px';
        if (isOpen) {
          answer.style.maxHeight = '0px';
          answer.style.opacity = '0';
        } else {
          answer.style.maxHeight = answer.scrollHeight + 'px';
          answer.style.opacity = '1';
        }
      });
    });
  }

  /* ── 6. Anchor Bar Highlighting ──────────────────────────────── */
  const anchorBar = document.querySelector('.anchor-bar');
  if (anchorBar) {
    const barLinks = anchorBar.querySelectorAll('a[href^="#"]');
    const sections = [];

    barLinks.forEach(link => {
      const id = link.getAttribute('href');
      const target = document.querySelector(id);
      if (target) sections.push({ el: target, link: link });
    });

    // Set first link active by default
    if (barLinks.length > 0) barLinks[0].classList.add('active');

    if (sections.length > 0) {
      const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
          if (entry.isIntersecting) {
            const match = sections.find(s => s.el === entry.target);
            if (match) {
              barLinks.forEach(l => l.classList.remove('active'));
              match.link.classList.add('active');
            }
          }
        });
      }, { rootMargin: '-158px 0px -55% 0px', threshold: 0 });

      sections.forEach(s => observer.observe(s.el));
    }
  }

  /* ── 6. Scroll Reveal Animations ───────────────────────────── */
  const revealEls = document.querySelectorAll('[data-reveal]');
  if (revealEls.length) {
    const revealObs = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          const delay = parseInt(entry.target.dataset.revealDelay || '0', 10);
          if (delay) {
            setTimeout(() => entry.target.classList.add('revealed'), delay);
          } else {
            entry.target.classList.add('revealed');
          }
          revealObs.unobserve(entry.target);
        }
      });
    }, { threshold: 0.12, rootMargin: '0px 0px -60px 0px' });
    revealEls.forEach(el => revealObs.observe(el));
  }

});
