/* ============================================
   INA-KJ AGRO CONNECT - Main Script
   Language Toggle + Interactions
   ============================================ */

(function () {
  'use strict';

  // ---------- Language System ----------
  const DEFAULT_LANG = 'om'; // Afaan Oromoo default

  function getLang() {
    return localStorage.getItem('ina-kj-lang') || DEFAULT_LANG;
  }

  function setLang(lang) {
    localStorage.setItem('ina-kj-lang', lang);
    document.documentElement.setAttribute('data-lang', lang);
    updateLangButtons(lang);
  }

  function updateLangButtons(lang) {
    document.querySelectorAll('.lang-btn').forEach(btn => {
      btn.classList.toggle('active', btn.dataset.lang === lang);
    });
  }

  function initLanguage() {
    const lang = getLang();
    document.documentElement.setAttribute('data-lang', lang);
    updateLangButtons(lang);

    document.querySelectorAll('.lang-btn').forEach(btn => {
      btn.addEventListener('click', () => {
        setLang(btn.dataset.lang);
      });
    });
  }

  // ---------- Mobile Menu ----------
  function initMobileMenu() {
    const toggle = document.querySelector('.menu-toggle');
    const nav = document.querySelector('.nav');
    if (!toggle || !nav) return;

    toggle.addEventListener('click', () => {
      nav.classList.toggle('open');
      toggle.textContent = nav.classList.contains('open') ? '✕' : '☰';
    });
  }

  // ---------- Search ----------
  function initSearch() {
    const form = document.querySelector('.search-bar');
    if (!form) return;

    form.addEventListener('submit', (e) => {
      e.preventDefault();
      const input = form.querySelector('input');
      const query = input.value.trim();
      if (query) {
        window.location.href = `marketplace.html?q=${encodeURIComponent(query)}`;
      }
    });
  }

  // ---------- Smooth scroll for anchor links ----------
  function initSmoothScroll() {
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
      anchor.addEventListener('click', function (e) {
        const target = document.querySelector(this.getAttribute('href'));
        if (target) {
          e.preventDefault();
          target.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }
      });
    });
  }

  // ---------- Product card click ----------
  function initProductCards() {
    document.querySelectorAll('.product-card').forEach(card => {
      card.addEventListener('click', (e) => {
        // Prevent if clicking a button inside
        if (e.target.closest('button') || e.target.closest('a.btn')) return;
        const id = card.dataset.id || '1';
        window.location.href = `product-details.html?id=${id}`;
      });
    });
  }

  // ---------- PWA Service Worker ----------
  function initServiceWorker() {
    if (!('serviceWorker' in navigator)) return;
    window.addEventListener('load', () => {
      navigator.serviceWorker
        .register('/sw.js')
        .then((reg) => {
          console.log('INA-KJ SW registered', reg.scope);
        })
        .catch((err) => {
          // Relative path fallback for file:// or subfolder deploy
          navigator.serviceWorker.register('sw.js').catch(() => {});
        });
    });
  }

  // ---------- Init ----------
  document.addEventListener('DOMContentLoaded', () => {
    initLanguage();
    initMobileMenu();
    initSearch();
    initSmoothScroll();
    initProductCards();
    initServiceWorker();
  });
})();
