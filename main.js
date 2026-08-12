/* ============================================================
   PIZA — main.js
   Vanilla JS. No dependencies. No build step.
   ============================================================ */

(function () {
  'use strict';

  var prefersReduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  var isTouch = 'ontouchstart' in window || navigator.maxTouchPoints > 0;

  /* ---------- Unicorn Studio init ----------
     Only initialise elements with a real, published project id. Any value
     starting with "TODO" is a not-yet-published placeholder: strip the
     attribute so the library never tries to fetch it (keeps console clean),
     and let the CSS/canvas fallback carry the section instead. */
  var US_CDN = 'https://cdn.unicorn.studio/v1.4.0/unicornStudio.umd.js';

  function initUnicornStudio() {
    var hasReal = false;
    document.querySelectorAll('[data-us-project]').forEach(function (el) {
      var id = el.getAttribute('data-us-project') || '';
      if (id.indexOf('TODO') === 0 || id === '') {
        el.removeAttribute('data-us-project');
      } else {
        hasReal = true;
        el.setAttribute('data-us-active', '');
      }
    });

    // Nothing published yet — the canvas fallbacks carry the sections. No
    // library load, no network requests, no console noise.
    if (!hasReal) return;

    var s = document.createElement('script');
    s.src = US_CDN;
    s.onload = function () {
      if (typeof UnicornStudio === 'undefined' || !UnicornStudio.init) return;
      UnicornStudio.init();
      // Hide the fallback behind each now-active embed.
      document.querySelectorAll('[data-us-active]').forEach(function (el) {
        var fb = el.parentElement && el.parentElement.querySelector('.hero-fallback, .visual-fallback');
        if (fb) fb.style.display = 'none';
      });
    };
    document.head.appendChild(s);
  }

  /* ---------- Canvas fallback (drifting topographic lines) ---------- */
  function initFallbackCanvas(canvasId) {
    var canvas = document.getElementById(canvasId);
    if (!canvas) return;

    var ctx = canvas.getContext('2d');
    var width, height, time = 0, animId;

    function resize() {
      width = canvas.width = canvas.offsetWidth || window.innerWidth;
      height = canvas.height = canvas.offsetHeight || window.innerHeight;
    }

    function draw() {
      ctx.clearRect(0, 0, width, height);
      ctx.fillStyle = '#2b0d00';
      ctx.fillRect(0, 0, width, height);

      var lines = 22;
      var spacing = height / lines;
      for (var i = 0; i < lines; i++) {
        ctx.beginPath();
        var baseY = i * spacing;
        ctx.moveTo(0, baseY);
        for (var x = 0; x <= width; x += 4) {
          var w1 = Math.sin((x * 0.003) + time + (i * 0.6)) * spacing * 0.38;
          var w2 = Math.sin((x * 0.007) - time * 0.7 + (i * 0.3)) * spacing * 0.16;
          var w3 = Math.cos((x * 0.002) + time * 0.4 + (i * 0.9)) * spacing * 0.22;
          ctx.lineTo(x, baseY + w1 + w2 + w3);
        }
        var alpha = 0.045 + (Math.sin(time * 0.5 + i * 0.4) * 0.02);
        ctx.strokeStyle = 'rgba(147, 15, 18, ' + alpha + ')';
        ctx.lineWidth = 1;
        ctx.stroke();
      }
    }

    function animate() {
      if (prefersReduced) { draw(); return; }
      time += 0.005;
      draw();
      animId = requestAnimationFrame(animate);
    }

    resize();
    window.addEventListener('resize', resize);
    window.addEventListener('load', resize);
    animate();

    // Only run while on-screen; re-measure each time it enters view
    // (the visual section is far down and has no size until scrolled to).
    var obs = new IntersectionObserver(function (entries) {
      if (entries[0].isIntersecting) {
        resize();
        if (!animId && !prefersReduced) animate();
        else if (prefersReduced) draw();
      } else {
        if (animId) { cancelAnimationFrame(animId); animId = null; }
      }
    }, { threshold: 0 });
    obs.observe(canvas);
  }

  /* ---------- Group-triggered staggered reveals ---------- */
  function initReveal() {
    var groups = document.querySelectorAll('[data-reveal]');
    if (!groups.length) return;

    var obs = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (!entry.isIntersecting) return;
        var group = entry.target;
        var items = group.querySelectorAll('.r-line, .r-fade');
        items.forEach(function (el, i) {
          el.style.transitionDelay = (i * 0.085) + 's';
        });
        group.classList.add('is-visible');
        obs.unobserve(group);
      });
    }, { threshold: 0.18, rootMargin: '0px 0px -8% 0px' });

    groups.forEach(function (g) { obs.observe(g); });
  }

  /* ---------- Nav scroll state ---------- */
  function initNavScroll() {
    var nav = document.getElementById('site-nav');
    var hero = document.getElementById('hero');
    if (!nav || !hero) return;

    var navH = nav.getBoundingClientRect().height;
    var obs = new IntersectionObserver(function (entries) {
      nav.classList.toggle('is-scrolled', !entries[0].isIntersecting);
    }, { threshold: 0, rootMargin: '-' + navH + 'px 0px 0px 0px' });
    obs.observe(hero);
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

  /* ---------- HUD: live section index ---------- */
  function initHud() {
    var idxEl = document.getElementById('hud-index');
    var labelEl = document.getElementById('hud-label');
    if (!idxEl || !labelEl) return;

    var panels = document.querySelectorAll('[data-hud-index]');
    var obs = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (!entry.isIntersecting) return;
        var t = entry.target;
        var idx = t.getAttribute('data-hud-index');
        var label = t.getAttribute('data-hud-label');
        if (idxEl.textContent !== idx) {
          labelEl.style.opacity = '0';
          setTimeout(function () {
            idxEl.textContent = idx;
            labelEl.textContent = label;
            labelEl.style.opacity = '';
          }, 200);
        }
      });
    }, { threshold: 0.5 });
    panels.forEach(function (p) { obs.observe(p); });
  }

  /* ---------- Scroll progress bar ---------- */
  function initProgress() {
    var bar = document.getElementById('progress-bar');
    if (!bar) return;
    var ticking = false;

    function update() {
      var h = document.documentElement;
      var max = h.scrollHeight - h.clientHeight;
      var frac = max > 0 ? h.scrollTop / max : 0;
      bar.style.width = (frac * 100) + '%';
      ticking = false;
    }
    window.addEventListener('scroll', function () {
      if (!ticking) { requestAnimationFrame(update); ticking = true; }
    }, { passive: true });
    update();
  }

  /* ---------- Hero cursor parallax ---------- */
  function initHeroParallax() {
    if (prefersReduced || isTouch) return;

    var wordmark = document.querySelector('.hero-wordmark');
    if (!wordmark) return;
    var hero = document.getElementById('hero');
    var ticking = false;

    hero.addEventListener('mousemove', function (e) {
      if (ticking) return;
      ticking = true;
      requestAnimationFrame(function () {
        var rect = hero.getBoundingClientRect();
        var x = (e.clientX - rect.left) / rect.width - 0.5;
        var y = (e.clientY - rect.top) / rect.height - 0.5;
        wordmark.style.transform = 'translate(' + (x * 14) + 'px, ' + (y * 9) + 'px)';
        ticking = false;
      });
    });
    hero.addEventListener('mouseleave', function () {
      wordmark.style.transition = 'transform 0.8s var(--e-out, cubic-bezier(0.16,1,0.3,1))';
      wordmark.style.transform = 'translate(0,0)';
      setTimeout(function () { wordmark.style.transition = ''; }, 800);
    });
  }

  /* ---------- Grain drift (subtle life in the texture) ---------- */
  function initGrainDrift() {
    if (prefersReduced) return;
    var grain = document.querySelector('.grain');
    if (!grain) return;
    var t = 0;
    (function tick() {
      t += 0.016;
      var x = Math.sin(t) * 6;
      var y = Math.cos(t * 0.8) * 6;
      grain.style.transform = 'translate(' + x + 'px,' + y + 'px)';
      requestAnimationFrame(tick);
    })();
  }

  /* ---------- Init ---------- */
  document.addEventListener('DOMContentLoaded', function () {
    initUnicornStudio();
    initFallbackCanvas('hero-canvas');
    initFallbackCanvas('visual-canvas');
    initReveal();
    initNavScroll();
    initMobileNav();
    initHud();
    initProgress();
    initHeroParallax();
    initGrainDrift();
  });
})();
