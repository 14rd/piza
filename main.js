/* ============================================================
   PIZA — main.js
   Vanilla JS. No dependencies. No build step.
   ============================================================ */

(function () {
  'use strict';

  var prefersReduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  var isTouch = 'ontouchstart' in window || navigator.maxTouchPoints > 0;

  /* ---------- Unicorn Studio init ---------- */
  function initUnicornStudio() {
    var el = document.querySelector('[data-us-project]');
    if (!el) return;
    var projectId = el.getAttribute('data-us-project');

    if (!projectId || projectId === 'TODO_UNICORN_PROJECT_ID') {
      el.style.display = 'none';
      return;
    }

    if (typeof UnicornStudio !== 'undefined' && UnicornStudio.init) {
      UnicornStudio.init();
      var fallback = document.querySelector('.hero-fallback');
      if (fallback) fallback.style.display = 'none';
    }
  }

  /* ---------- Canvas fallback ---------- */
  function initFallbackCanvas() {
    var canvas = document.getElementById('hero-canvas');
    if (!canvas) return;

    var el = document.querySelector('[data-us-project]');
    var projectId = el ? el.getAttribute('data-us-project') : '';
    if (projectId && projectId !== 'TODO_UNICORN_PROJECT_ID') return;

    var ctx = canvas.getContext('2d');
    var width, height;
    var time = 0;
    var animId;

    function resize() {
      width = canvas.width = canvas.offsetWidth;
      height = canvas.height = canvas.offsetHeight;
    }

    function drawTopoLines() {
      ctx.clearRect(0, 0, width, height);

      ctx.fillStyle = '#2F0E00';
      ctx.fillRect(0, 0, width, height);

      var lineCount = 18;
      var spacing = height / lineCount;

      for (var i = 0; i < lineCount; i++) {
        ctx.beginPath();
        var baseY = i * spacing;
        ctx.moveTo(0, baseY);

        for (var x = 0; x <= width; x += 4) {
          var wave1 = Math.sin((x * 0.003) + time + (i * 0.6)) * spacing * 0.35;
          var wave2 = Math.sin((x * 0.007) - time * 0.7 + (i * 0.3)) * spacing * 0.15;
          var wave3 = Math.cos((x * 0.002) + time * 0.4 + (i * 0.9)) * spacing * 0.2;
          ctx.lineTo(x, baseY + wave1 + wave2 + wave3);
        }

        var alpha = 0.04 + (Math.sin(time * 0.5 + i * 0.4) * 0.02);
        ctx.strokeStyle = 'rgba(147, 15, 18, ' + alpha + ')';
        ctx.lineWidth = 1;
        ctx.stroke();
      }
    }

    function animate() {
      if (prefersReduced) {
        drawTopoLines();
        return;
      }
      time += 0.008;
      drawTopoLines();
      animId = requestAnimationFrame(animate);
    }

    resize();
    window.addEventListener('resize', resize);
    animate();

    var observer = new IntersectionObserver(function (entries) {
      if (entries[0].isIntersecting) {
        if (!animId && !prefersReduced) animate();
      } else {
        if (animId) { cancelAnimationFrame(animId); animId = null; }
      }
    }, { threshold: 0 });
    observer.observe(canvas);
  }

  /* ---------- Nav scroll state ---------- */
  function initNavScroll() {
    var nav = document.getElementById('site-nav');
    var hero = document.getElementById('hero');
    if (!nav || !hero) return;

    var navH = nav.getBoundingClientRect().height;
    var observer = new IntersectionObserver(function (entries) {
      nav.classList.toggle('is-scrolled', !entries[0].isIntersecting);
    }, { threshold: 0, rootMargin: '-' + navH + 'px 0px 0px 0px' });

    observer.observe(hero);
  }

  /* ---------- Mobile nav toggle ---------- */
  function initMobileNav() {
    var toggle = document.getElementById('nav-toggle');
    var links = document.querySelector('.nav-links');
    if (!toggle || !links) return;

    toggle.addEventListener('click', function () {
      var open = toggle.getAttribute('aria-expanded') === 'true';
      toggle.setAttribute('aria-expanded', String(!open));
      links.classList.toggle('is-open', !open);
      document.body.style.overflow = !open ? 'hidden' : '';
    });

    links.querySelectorAll('a').forEach(function (a) {
      a.addEventListener('click', function () {
        toggle.setAttribute('aria-expanded', 'false');
        links.classList.remove('is-open');
        document.body.style.overflow = '';
      });
    });
  }

  /* ---------- Scroll reveal ---------- */
  function initReveal() {
    var reveals = document.querySelectorAll('.reveal');
    if (!reveals.length) return;

    var observer = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) {
          entry.target.classList.add('is-visible');
          observer.unobserve(entry.target);
        }
      });
    }, { threshold: 0.15, rootMargin: '0px 0px -60px 0px' });

    reveals.forEach(function (el) { observer.observe(el); });
  }

  /* ---------- Hero parallax / tilt on cursor ---------- */
  function initHeroParallax() {
    if (prefersReduced || isTouch) return;

    var wordmark = document.querySelector('.hero-wordmark');
    if (!wordmark) return;

    var hero = document.querySelector('.hero');
    var ticking = false;

    hero.addEventListener('mousemove', function (e) {
      if (ticking) return;
      ticking = true;

      requestAnimationFrame(function () {
        var rect = hero.getBoundingClientRect();
        var x = (e.clientX - rect.left) / rect.width - 0.5;
        var y = (e.clientY - rect.top) / rect.height - 0.5;

        wordmark.style.transform =
          'translate(' + (x * 12) + 'px, ' + (y * 8) + 'px)';

        ticking = false;
      });
    });

    hero.addEventListener('mouseleave', function () {
      wordmark.style.transition = 'transform 0.6s cubic-bezier(0.16,1,0.3,1)';
      wordmark.style.transform = 'translate(0,0)';
      setTimeout(function () { wordmark.style.transition = ''; }, 600);
    });
  }

  /* ---------- Init ---------- */
  document.addEventListener('DOMContentLoaded', function () {
    initUnicornStudio();
    initFallbackCanvas();
    initNavScroll();
    initMobileNav();
    initReveal();
    initHeroParallax();
  });
})();
