/* =========================================================================
   Mueezur Rehman — Portfolio 2026
   Shared interactions
   ========================================================================= */
(function () {
  'use strict';

  /* ---------- THEME ---------- */
  var root = document.documentElement;
  var STORAGE_KEY = 'mr-theme';
  function applyTheme(theme) {
    root.setAttribute('data-theme', theme);
    try { localStorage.setItem(STORAGE_KEY, theme); } catch (e) {}
    document.querySelectorAll('[data-theme-icon]').forEach(function (el) {
      el.style.display = el.getAttribute('data-theme-icon') === theme ? '' : 'none';
    });
  }
  var saved = null;
  try { saved = localStorage.getItem(STORAGE_KEY); } catch (e) {}
  var prefersLight = window.matchMedia && window.matchMedia('(prefers-color-scheme: light)').matches;
  applyTheme(saved || (prefersLight ? 'light' : 'dark'));

  document.querySelectorAll('[data-theme-toggle]').forEach(function (btn) {
    btn.addEventListener('click', function () {
      applyTheme(root.getAttribute('data-theme') === 'dark' ? 'light' : 'dark');
    });
  });

  /* ---------- NAV: scrolled state, progress, mobile menu ---------- */
  var nav = document.getElementById('nav');
  var bar = document.getElementById('progressBar');
  var toTop = document.getElementById('toTop');
  var navCta = document.getElementById('navCta');

  function onScroll() {
    var y = window.scrollY || document.documentElement.scrollTop;
    if (nav) nav.classList.toggle('scrolled', y > 12);
    if (toTop) toTop.classList.toggle('show', y > 700);
    if (navCta) navCta.style.display = y > 480 ? 'inline-flex' : 'none';
    if (bar) {
      var h = document.documentElement.scrollHeight - window.innerHeight;
      bar.style.width = (h > 0 ? (y / h) * 100 : 0) + '%';
    }
  }
  window.addEventListener('scroll', onScroll, { passive: true });
  onScroll();

  if (toTop) toTop.addEventListener('click', function () { window.scrollTo({ top: 0, behavior: 'smooth' }); });

  var menuBtn = document.getElementById('menuBtn');
  var navLinks = document.getElementById('navLinks');
  if (menuBtn && navLinks) {
    menuBtn.addEventListener('click', function () {
      var open = navLinks.classList.toggle('open');
      menuBtn.setAttribute('aria-expanded', String(open));
      var burger = menuBtn.querySelector('.i-burger');
      var close = menuBtn.querySelector('.i-close');
      if (burger && close) { burger.style.display = open ? 'none' : ''; close.style.display = open ? '' : 'none'; }
    });
    navLinks.querySelectorAll('a').forEach(function (a) {
      a.addEventListener('click', function () {
        navLinks.classList.remove('open');
        menuBtn.setAttribute('aria-expanded', 'false');
        var burger = menuBtn.querySelector('.i-burger');
        var close = menuBtn.querySelector('.i-close');
        if (burger && close) { burger.style.display = ''; close.style.display = 'none'; }
      });
    });
  }

  /* ---------- REVEAL ON SCROLL ---------- */
  var revealEls = document.querySelectorAll('.reveal');
  if ('IntersectionObserver' in window) {
    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (en) {
        if (en.isIntersecting) { en.target.classList.add('in'); io.unobserve(en.target); }
      });
    }, { threshold: 0.08, rootMargin: '0px 0px -40px 0px' });
    revealEls.forEach(function (el) { io.observe(el); });
  } else {
    revealEls.forEach(function (el) { el.classList.add('in'); });
  }

  /* ---------- WORK FILTER ---------- */
  var chips = document.querySelectorAll('.chip[data-filter]');
  if (chips.length) {
    chips.forEach(function (chip) {
      chip.addEventListener('click', function () {
        var f = chip.getAttribute('data-filter');
        chips.forEach(function (c) { c.classList.toggle('active', c === chip); });
        document.querySelectorAll('.project[data-cat]').forEach(function (card) {
          var cats = (card.getAttribute('data-cat') || '').split(' ');
          card.hidden = !(f === 'all' || cats.indexOf(f) !== -1);
        });
      });
    });
  }

  /* ---------- FAQ ACCORDION ---------- */
  document.querySelectorAll('.faq-item').forEach(function (item, idx) {
    var q = item.querySelector('.faq-q');
    var a = item.querySelector('.faq-a');
    if (!q || !a) return;
    a.id = a.id || 'faq-a-' + (idx + 1);
    q.setAttribute('aria-controls', a.id);
    q.addEventListener('click', function () {
      var isOpen = item.classList.contains('open');
      item.parentElement.querySelectorAll('.faq-item.open').forEach(function (other) {
        other.classList.remove('open');
        var oa = other.querySelector('.faq-a');
        if (oa) oa.style.maxHeight = null;
        var oq = other.querySelector('.faq-q');
        if (oq) oq.setAttribute('aria-expanded', 'false');
      });
      if (!isOpen) {
        item.classList.add('open');
        a.style.maxHeight = a.scrollHeight + 'px';
        q.setAttribute('aria-expanded', 'true');
      }
    });
  });

  /* ---------- CARD POINTER GLOW ---------- */
  if (window.matchMedia && window.matchMedia('(hover: hover)').matches) {
    document.querySelectorAll('.card-glow').forEach(function (card) {
      card.addEventListener('pointermove', function (e) {
        var r = card.getBoundingClientRect();
        card.style.setProperty('--mx', ((e.clientX - r.left) / r.width) * 100 + '%');
        card.style.setProperty('--my', ((e.clientY - r.top) / r.height) * 100 + '%');
      });
    });
  }

  /* ---------- MAGNETIC BUTTONS ---------- */
  if (window.matchMedia && window.matchMedia('(hover: hover)').matches &&
      !(window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches)) {
    document.querySelectorAll('.btn-primary, .submit').forEach(function (btn) {
      var frame = null;
      btn.addEventListener('pointermove', function (e) {
        var r = btn.getBoundingClientRect();
        var dx = (e.clientX - r.left - r.width / 2) / r.width;
        var dy = (e.clientY - r.top - r.height / 2) / r.height;
        if (frame) cancelAnimationFrame(frame);
        frame = requestAnimationFrame(function () {
          btn.style.transform = 'translate(' + (dx * 6).toFixed(2) + 'px,' + (dy * 4 - 1).toFixed(2) + 'px)';
        });
      });
      btn.addEventListener('pointerleave', function () {
        if (frame) cancelAnimationFrame(frame);
        btn.style.transform = '';
      });
    });
  }

  /* ---------- TOAST ---------- */
  var toast = document.getElementById('toast');
  var toastTitle = document.getElementById('toastTitle');
  var toastMsg = document.getElementById('toastMsg');
  var toastTimer;
  function showToast(title, msg) {
    if (!toast) return;
    if (toastTitle) toastTitle.textContent = title;
    if (toastMsg) toastMsg.textContent = msg;
    toast.classList.add('show');
    clearTimeout(toastTimer);
    toastTimer = setTimeout(function () { toast.classList.remove('show'); }, 5000);
  }
  window.showToast = showToast;

  /* ---------- CONTACT FORM ---------- */
  var form = document.getElementById('contactForm');
  if (form) {
    form.addEventListener('submit', function (e) {
      e.preventDefault();
      var data = new FormData(form);
      var name = (data.get('name') || '').toString().trim();
      var email = (data.get('email') || '').toString().trim();
      var service = (data.get('service') || '').toString();
      var message = (data.get('message') || '').toString();

      var first = name.split(' ')[0] || 'there';
      showToast('Thanks, ' + first + '!', "I'll reply to " + email + ' within 24 hours.');

      var subject = encodeURIComponent('New Project Inquiry — ' + service);
      var body = encodeURIComponent(
        'Hi Mueez,\n\nName: ' + name + '\nEmail: ' + email + '\nService: ' + service +
        '\n\nProject Details:\n' + message + '\n\n— Sent from your portfolio'
      );
      setTimeout(function () {
        window.location.href = 'mailto:mueez.leadsbytech@gmail.com?subject=' + subject + '&body=' + body;
      }, 700);
      form.reset();
    });
  }

  /* ---------- WHATSAPP CLICK TOAST ---------- */
  document.querySelectorAll('a[href*="wa.me"]').forEach(function (el) {
    el.addEventListener('click', function () {
      showToast('Opening WhatsApp…', "Let's talk about your project.");
    });
  });

  /* ---------- COPY EMAIL ---------- */
  document.querySelectorAll('[data-copy]').forEach(function (btn) {
    btn.addEventListener('click', function () {
      var value = btn.getAttribute('data-copy');
      function done() { showToast('Copied', value); }
      if (navigator.clipboard && navigator.clipboard.writeText) {
        navigator.clipboard.writeText(value).then(done).catch(done);
      } else {
        var t = document.createElement('textarea');
        t.value = value; document.body.appendChild(t); t.select();
        try { document.execCommand('copy'); } catch (e) {}
        document.body.removeChild(t); done();
      }
    });
  });

  /* ---------- COMMAND PALETTE ---------- */
  var palette = document.getElementById('palette');
  var paletteInput = document.getElementById('paletteInput');
  var paletteList = document.getElementById('paletteList');
  if (palette && paletteInput && paletteList) {
    var items = Array.prototype.slice.call(paletteList.querySelectorAll('.palette-item'));
    var filtered = items.slice();
    var cursor = 0;
    var isWorkPage = /\/work\//.test(location.pathname);
    var base = isWorkPage ? '../' : './';

    function render() {
      items.forEach(function (it) { it.style.display = 'none'; });
      filtered.forEach(function (it) { it.style.display = ''; });
      var empty = paletteList.querySelector('.palette-empty');
      if (empty) empty.style.display = filtered.length ? 'none' : '';
      filtered.forEach(function (it, i) { it.classList.toggle('active', i === cursor); });
      if (filtered[cursor]) filtered[cursor].scrollIntoView({ block: 'nearest' });
    }
    function openPalette() {
      palette.classList.add('open');
      paletteInput.value = '';
      filtered = items.slice(); cursor = 0; render();
      setTimeout(function () { paletteInput.focus(); }, 30);
    }
    function closePalette() { palette.classList.remove('open'); }

    document.querySelectorAll('[data-palette-open], #paletteBtn').forEach(function (b) { b.addEventListener('click', openPalette); });
    palette.addEventListener('click', function (e) { if (e.target === palette) closePalette(); });

    document.addEventListener('keydown', function (e) {
      var key = e.key ? e.key.toLowerCase() : '';
      if ((e.metaKey || e.ctrlKey) && key === 'k') { e.preventDefault(); palette.classList.contains('open') ? closePalette() : openPalette(); return; }
      if (key === 'escape' && palette.classList.contains('open')) { closePalette(); return; }
      if (!palette.classList.contains('open')) return;
      if (key === 'arrowdown') { e.preventDefault(); cursor = Math.min(cursor + 1, filtered.length - 1); render(); }
      else if (key === 'arrowup') { e.preventDefault(); cursor = Math.max(cursor - 1, 0); render(); }
      else if (key === 'enter' && filtered[cursor]) { e.preventDefault(); activate(filtered[cursor]); }
    });

    function activate(item) {
      var link = item.getAttribute('data-href');
      var action = item.getAttribute('data-action');
      if (link) {
        var hi = link.indexOf('#');
        if (hi !== -1) {
          var path = link.slice(0, hi);
          var hash = link.slice(hi);
          var onIndex = !isWorkPage;
          var targetsIndex = path.indexOf('index.html') !== -1;
          if (onIndex === targetsIndex) {
            var el = document.querySelector(hash);
            if (el) { el.scrollIntoView({ behavior: 'smooth' }); closePalette(); return; }
          }
        }
        window.location.href = link;
        return;
      }
      if (action === 'toggle-theme') { applyTheme(root.getAttribute('data-theme') === 'dark' ? 'light' : 'dark'); closePalette(); return; }
      if (action === 'copy-email') { var v = item.getAttribute('data-copy-value'); if (v && navigator.clipboard) navigator.clipboard.writeText(v); showToast('Copied', 'Email address copied to clipboard.'); closePalette(); return; }
      if (action === 'email') { window.location.href = 'mailto:mueez.leadsbytech@gmail.com'; }
      closePalette();
    }
    items.forEach(function (it) { it.addEventListener('click', function () { activate(it); }); });

    paletteInput.addEventListener('input', function () {
      var q = paletteInput.value.toLowerCase().trim();
      filtered = items.filter(function (it) { return (it.textContent || '').toLowerCase().indexOf(q) !== -1; });
      cursor = 0; render();
    });

    /* resolve palette links relative to the current page depth */
    items.forEach(function (it) {
      var h = it.getAttribute('data-href');
      if (!h || h.charAt(0) === '#') {
        it.setAttribute('data-href', base + 'index.html' + (h || ''));
      } else {
        it.setAttribute('data-href', base + h);
      }
    });
    render();
  }

  /* ---------- CASE STUDY SCROLLSPY ---------- */
  var caseNavLinks = document.querySelectorAll('.case-nav a');
  if (caseNavLinks.length && 'IntersectionObserver' in window) {
    var spy = new IntersectionObserver(function (entries) {
      entries.forEach(function (en) {
        if (en.isIntersecting) {
          caseNavLinks.forEach(function (l) { l.classList.toggle('active', l.getAttribute('href') === '#' + en.target.id); });
        }
      });
    }, { rootMargin: '-30% 0px -60% 0px' });
    caseNavLinks.forEach(function (l) {
      var t = document.querySelector(l.getAttribute('href'));
      if (t) spy.observe(t);
    });
  }

  /* ---------- 3D: TILT CARDS ---------- */
  var reduced = window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  var canHover = window.matchMedia && window.matchMedia('(hover: hover)').matches;
  if (canHover && !reduced) {
    document.querySelectorAll('[data-tilt]').forEach(function (el) {
      var max = parseFloat(el.getAttribute('data-tilt')) || 8;
      el.addEventListener('pointermove', function (e) {
        var r = el.getBoundingClientRect();
        var px = (e.clientX - r.left) / r.width - 0.5;
        var py = (e.clientY - r.top) / r.height - 0.5;
        el.style.transform = 'perspective(900px) rotateX(' + (-py * max).toFixed(2) + 'deg) rotateY(' + (px * max).toFixed(2) + 'deg)';
      });
      el.addEventListener('pointerleave', function () { el.style.transform = ''; });
    });
  }

  /* ---------- 3D: DRAGGABLE CUBE ---------- */
  var cube = document.getElementById('cube');
  if (cube) {
    var rx = -18, ry = 24, dragging = false, lastX = 0, lastY = 0, spin = reduced ? 0 : 0.22;
    function drawCube() { cube.style.transform = 'rotateX(' + rx + 'deg) rotateY(' + ry + 'deg)'; }
    cube.addEventListener('pointerdown', function (e) {
      dragging = true; lastX = e.clientX; lastY = e.clientY;
      if (cube.setPointerCapture) { try { cube.setPointerCapture(e.pointerId); } catch (err) {} }
    });
    cube.addEventListener('pointermove', function (e) {
      if (!dragging) return;
      ry += (e.clientX - lastX) * 0.45;
      rx -= (e.clientY - lastY) * 0.45;
      rx = Math.max(-82, Math.min(82, rx));
      lastX = e.clientX; lastY = e.clientY;
      drawCube();
    });
    function endDrag() { dragging = false; }
    cube.addEventListener('pointerup', endDrag);
    cube.addEventListener('pointercancel', endDrag);
    cube.addEventListener('pointerleave', endDrag);
    var cubeVisible = true;
    if ('IntersectionObserver' in window) {
      var cubeIO = new IntersectionObserver(function (entries) {
        entries.forEach(function (en) { cubeVisible = en.isIntersecting; });
      }, { rootMargin: '160px' });
      cubeIO.observe(cube);
    }
    (function spinLoop() {
      if (!dragging && cubeVisible && spin) { ry += spin; drawCube(); }
      requestAnimationFrame(spinLoop);
    })();
  }

  /* ---------- ORB PARALLAX (pointer) ---------- */
  var orbHost = document.querySelector('[data-orb-parallax]');
  if (orbHost && canHover && !reduced) {
    var orbs = orbHost.querySelectorAll('.aurora');
    orbHost.parentElement.addEventListener('pointermove', function (e) {
      var r = orbHost.parentElement.getBoundingClientRect();
      var dx = (e.clientX - r.left) / r.width - 0.5;
      var dy = (e.clientY - r.top) / r.height - 0.5;
      orbs.forEach(function (orb, i) {
        var depth = (i + 1) * 12;
        orb.style.transform = 'translate3d(' + (dx * depth).toFixed(1) + 'px,' + (dy * depth).toFixed(1) + 'px,0)';
      });
    });
  }

  /* ---------- LOCAL TIME (IST) ---------- */
  var clockEls = document.querySelectorAll('[data-clock]');
  if (clockEls.length) {
    var clockFmt = null;
    try {
      clockFmt = new Intl.DateTimeFormat('en-GB', {
        timeZone: 'Asia/Kolkata', hour: '2-digit', minute: '2-digit', second: '2-digit', hour12: false
      });
    } catch (e) { clockFmt = null; }
    var tickClock = function () {
      var now = new Date();
      var text = clockFmt ? clockFmt.format(now) : now.toTimeString().slice(0, 8);
      clockEls.forEach(function (el) { el.textContent = text; });
    };
    tickClock();
    setInterval(tickClock, 1000);
  }

  /* ---------- YEAR ---------- */
  document.querySelectorAll('[data-year]').forEach(function (el) { el.textContent = new Date().getFullYear(); });

  /* ---------- KEYBOARD SHORTCUTS ---------- */
  var keysSheet = document.getElementById('keysSheet');
  if (keysSheet) {
    var keysOpenBtn = document.getElementById('keysOpen');
    var jumpReady = false;
    var jumpTimer;

    function setKeys(open) {
      keysSheet.classList.toggle('open', open);
      keysSheet.setAttribute('aria-hidden', open ? 'false' : 'true');
      if (open) {
        var x = keysSheet.querySelector('[data-keys-close]');
        if (x) x.focus();
      }
    }
    function keysIsOpen() { return keysSheet.classList.contains('open'); }

    if (keysOpenBtn) keysOpenBtn.addEventListener('click', function () { setKeys(true); });

    keysSheet.addEventListener('click', function (e) {
      if (e.target === keysSheet || (e.target.closest && e.target.closest('[data-keys-close]'))) setKeys(false);
    });

    document.addEventListener('keydown', function (e) {
      var t = e.target;
      if (t && (t.tagName === 'INPUT' || t.tagName === 'TEXTAREA' || t.tagName === 'SELECT' || t.isContentEditable)) return;
      if (e.ctrlKey || e.metaKey || e.altKey) return;
      var k = (e.key || '').toLowerCase();

      if (k === '?') { e.preventDefault(); setKeys(!keysIsOpen()); return; }
      if (k === 'escape' && keysIsOpen()) { setKeys(false); return; }
      if (keysIsOpen()) return;

      if (k === 't') {
        var next = root.getAttribute('data-theme') === 'dark' ? 'light' : 'dark';
        applyTheme(next);
        showToast('Theme switched', next === 'light' ? 'Light mode on.' : 'Dark mode on.');
        return;
      }

      if (k === 'g') {
        jumpReady = true;
        clearTimeout(jumpTimer);
        jumpTimer = setTimeout(function () { jumpReady = false; }, 1400);
        return;
      }
      if (jumpReady) {
        var map = { w: '#work', a: '#about', s: '#services', c: '#contact', t: '#testimonials', f: '#finder', p: '#process' };
        var sel = map[k];
        jumpReady = false;
        clearTimeout(jumpTimer);
        if (sel) {
          var node = document.querySelector(sel);
          if (node) {
            e.preventDefault();
            var reduce = window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;
            node.scrollIntoView({ behavior: reduce ? 'auto' : 'smooth', block: 'start' });
            if (history.replaceState) history.replaceState(null, '', sel);
          }
        }
      }
    });
  }

  /* =====================================================================
     INTERACTIVE MODULES — console, architecture map, solution finder,
     animated counters, section spy rail
     ===================================================================== */

  function escHtml(s) {
    return String(s == null ? '' : s).replace(/[&<>"]/g, function (c) {
      return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c];
    });
  }

  var prefersReduce = window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  var canHover = window.matchMedia && window.matchMedia('(hover: hover)').matches;

  /* ---------- CONSOLE / TERMINAL ---------- */
  (function () {
    var root = document.getElementById('console');
    if (!root) return;
    var out = root.querySelector('[data-con-out]');
    var input = root.querySelector('[data-con-input]');
    var form = root.querySelector('[data-con-form]');
    if (!out || !input || !form) return;

    var history = [];
    var hIndex = 0;
    var booted = false;

    var PROMPT = '<span class="c-prompt">mueezur@portfolio:~$</span> ';

    function line(html, cls) {
      var d = document.createElement('div');
      d.className = 'console-line' + (cls ? ' ' + cls : '');
      d.innerHTML = html;
      out.appendChild(d);
      return d;
    }
    function gap() {
      var d = document.createElement('div');
      d.className = 'console-gap';
      out.appendChild(d);
    }
    function scrollDown() { out.scrollTop = out.scrollHeight; }
    function kv(rows) {
      return '<dl class="console-kv">' + rows.map(function (r) {
        return '<dt>' + r[0] + '</dt><dd>' + r[1] + '</dd>';
      }).join('') + '</dl>';
    }

    var COMMANDS = {
      help: {
        desc: 'list every available command',
        run: function () {
          var keys = Object.keys(COMMANDS);
          var w = keys.reduce(function (m, k) { return Math.max(m, k.length); }, 0);
          line('<span class="c-dim">Available commands</span>');
          keys.forEach(function (k) {
            var pad = new Array(Math.max(1, w - k.length + 3)).join(' ');
            line('<span class="c-key">' + k + '</span>' + pad + '<span class="c-faint">' + escHtml(COMMANDS[k].desc) + '</span>');
          });
        }
      },
      whoami: {
        desc: 'who I am, in one screen',
        run: function () {
          line(kv([
            ['name', 'Mueezur Rehman'],
            ['role', 'Full-Stack Developer &amp; Platform Architect'],
            ['based', 'Burhanpur, MP, India — IST (UTC+5:30)'],
            ['since', '2022, building for the web'],
            ['focus', 'marketplaces · ERP · lead-gen platforms · corporate sites'],
            ['shipped', '15+ projects across 40+ countries']
          ]));
        }
      },
      stack: {
        desc: 'what I actually run in production',
        run: function () {
          line(kv([
            ['backend', 'Python · Django · Django REST Framework'],
            ['frontend', 'React · Next.js · Tailwind CSS · TypeScript'],
            ['data', 'PostgreSQL · Scrapy · Google Sheets'],
            ['automation', 'Google Apps Script · webhooks · AI tooling'],
            ['commerce', 'Noon Payments · Stripe · UPI / Razorpay · WhatsApp API'],
            ['infra', 'zero-cost serverless · multi-tenant · CI/CD']
          ]));
        }
      },
      services: {
        desc: 'what I build for clients',
        run: function () {
          line(kv([
            ['Marketplaces', 'multi-vendor catalogues, checkout, logistics, tax invoicing'],
            ['Management systems', 'school ERP, dealer portals, inventory &amp; billing'],
            ['Lead platforms', 'collection, enrichment, scoring and a built-in CRM'],
            ['Corporate websites', 'bilingual, CMS-driven, SEO-ready'],
            ['Automation', 'reporting, invoicing and WhatsApp workflows']
          ]));
        }
      },
      projects: {
        desc: 'open a case study',
        run: function () {
          [
            ['Al Wholesale', 'work/al-wholesale.html', 'B2B marketplace · UAE'],
            ['Canadatrado', 'work/canadatrado.html', 'food-trading site · 45+ countries'],
            ['LeadGenPro', 'work/leadgenpro.html', 'lead database + CRM'],
            ['Smart School', 'work/smart-school.html', 'school ERP'],
            ['All Cars 365', 'work/all-cars-365.html', 'dealer platform · UAE'],
            ['Eco Choice Group', 'work/eco-choice.html', 'multi-brand corporate site']
          ].forEach(function (x, i) {
            line('<span class="c-faint">0' + (i + 1) + '</span>  <a href="' + x[1] + '">' + x[0] + '</a> <span class="c-faint">— ' + x[2] + '</span>');
          });
        }
      },
      journey: {
        desc: 'the timeline, 2022 → now',
        run: function () {
          line(kv([
            ['2022', 'started out — websites and Python tools for local businesses'],
            ['2023', 'went international — first UAE clients, B2B platforms'],
            ['2024', '15+ projects shipped across UAE, Canada and India'],
            ['2025', 'serverless + AI automation became the default approach']
          ]));
        }
      },
      now: {
        desc: 'what I am doing right now',
        run: function () {
          var local;
          try {
            local = new Intl.DateTimeFormat('en-GB', {
              timeZone: 'Asia/Kolkata', hour: '2-digit', minute: '2-digit', hour12: false
            }).format(new Date());
          } catch (e) {
            local = new Date().toTimeString().slice(0, 5);
          }
          line(kv([
            ['status', '<span class="c-ok">● open for new work</span>'],
            ['local time', escHtml(local) + ' IST'],
            ['reply in', 'under 24 hours, Mon–Sat'],
            ['capacity', 'taking on new projects this quarter']
          ]));
        }
      },
      contact: {
        desc: 'how to reach me',
        run: function () {
          line(kv([
            ['email', '<a href="mailto:mueez.leadsbytech@gmail.com">mueez.leadsbytech@gmail.com</a>'],
            ['phone', '<a href="tel:+919522996669">+91 9522 996 669</a>'],
            ['whatsapp', '<a href="https://wa.me/919522996669" target="_blank" rel="noopener">wa.me/919522996669</a>'],
            ['location', 'Burhanpur, MP, India 450331']
          ]));
        }
      },
      hire: {
        desc: 'start a project',
        run: function () {
          line('<span class="c-ok">→ taking you to the contact form…</span>');
          var target = document.getElementById('contact');
          if (target) {
            setTimeout(function () {
              target.scrollIntoView({ behavior: prefersReduce ? 'auto' : 'smooth', block: 'start' });
            }, 280);
          }
        }
      },
      theme: {
        desc: 'flip between dark and light',
        run: function () {
          var btn = document.querySelector('[data-theme-toggle]');
          if (btn) btn.click();
          line('<span class="c-dim">theme flipped — most visitors keep it dark.</span>');
        }
      },
      clear: {
        desc: 'wipe the screen',
        run: function () { out.innerHTML = ''; }
      },
      sudo: {
        desc: 'do not',
        run: function () {
          line('<span class="c-err">nice try.</span> <span class="c-dim">This console is read-only — real work happens in the contact form.</span>');
          line('<span class="c-faint">type "hire" to go there</span>');
        }
      }
    };

    function execute(raw, echo) {
      var text = String(raw == null ? '' : raw).trim();
      if (!text) return;
      if (echo !== false) line(PROMPT + '<span class="c-cmd">' + escHtml(text) + '</span>');
      var parts = text.split(/\s+/);
      var cmd = parts[0].toLowerCase();
      if (COMMANDS[cmd]) COMMANDS[cmd].run(parts.slice(1));
      else line('<span class="c-err">command not found:</span> ' + escHtml(cmd) + ' <span class="c-faint">— type "help"</span>');
      scrollDown();
    }

    var BOOT = [
      { t: 'boot --profile mueezur', cmd: true },
      { t: 'ok    profile loaded · Mueezur Rehman — Full-Stack Developer', c: 'c-ok' },
      { t: 'ok    15+ projects · 40+ countries · shipping since 2022', c: 'c-ok' },
      { t: 'hint  type "help" or tap a command below', c: 'c-dim' }
    ];

    function boot(instant) {
      if (booted) return;
      booted = true;
      out.setAttribute('aria-live', 'off');

      var staticRender = function () {
        BOOT.forEach(function (b) {
          line((b.cmd ? PROMPT : '') + '<span class="' + (b.c || 'c-cmd') + '">' + escHtml(b.t) + '</span>');
        });
        out.setAttribute('aria-live', 'polite');
        scrollDown();
      };

      if (prefersReduce || instant) { staticRender(); return; }

      var i = 0;
      (function nextLine() {
        if (i >= BOOT.length) { out.setAttribute('aria-live', 'polite'); scrollDown(); return; }
        var b = BOOT[i++];
        var d = document.createElement('div');
        d.className = 'console-line';
        if (b.cmd) d.insertAdjacentHTML('beforeend', PROMPT);
        var span = document.createElement('span');
        span.className = b.c || 'c-cmd';
        d.appendChild(span);
        out.appendChild(d);

        var n = 0;
        (function typeChar() {
          n++;
          span.textContent = b.t.slice(0, n);
          scrollDown();
          if (n < b.t.length) setTimeout(typeChar, b.cmd ? 22 : 7);
          else setTimeout(nextLine, 140);
        })();
      })();
    }

    form.addEventListener('submit', function (e) {
      e.preventDefault();
      var text = input.value.trim();
      input.value = '';
      if (!booted) boot(true);
      if (text) { history.push(text); hIndex = history.length; }
      execute(text);
      gap();
    });

    input.addEventListener('keydown', function (e) {
      if (e.key === 'ArrowUp') {
        if (!history.length) return;
        e.preventDefault();
        hIndex = Math.max(0, hIndex - 1);
        input.value = history[hIndex] || '';
      } else if (e.key === 'ArrowDown') {
        if (!history.length) return;
        e.preventDefault();
        hIndex = Math.min(history.length, hIndex + 1);
        input.value = history[hIndex] || '';
      } else if (e.key === 'Tab') {
        var q = input.value.trim().toLowerCase();
        if (!q) return;
        var hits = Object.keys(COMMANDS).filter(function (k) { return k.indexOf(q) === 0; });
        if (hits.length === 1) { e.preventDefault(); input.value = hits[0]; }
        else if (hits.length > 1) {
          e.preventDefault();
          line('<span class="c-faint">' + hits.join('   ') + '</span>');
          scrollDown();
        }
      }
    });

    root.querySelectorAll('[data-con-run]').forEach(function (btn) {
      btn.addEventListener('click', function () {
        var cmd = btn.getAttribute('data-con-run');
        if (!booted) boot(true);
        history.push(cmd);
        hIndex = history.length;
        execute(cmd);
        gap();
        if (canHover) input.focus();
      });
    });

    if (canHover) {
      out.addEventListener('click', function (e) {
        if (e.target && e.target.closest && e.target.closest('a')) return;
        input.focus();
      });
    }

    if ('IntersectionObserver' in window) {
      var bootIO = new IntersectionObserver(function (entries) {
        entries.forEach(function (en) {
          if (!en.isIntersecting) return;
          bootIO.disconnect();
          setTimeout(function () { boot(); }, 180);
        });
      }, { threshold: 0.15 });
      bootIO.observe(root);
    } else {
      boot();
    }
  })();

  /* ---------- ARCHITECTURE MAP ---------- */
  (function () {
    var root = document.getElementById('architecture');
    if (!root) return;
    var nodes = root.querySelectorAll('[data-arch]');
    var details = root.querySelectorAll('[data-arch-detail]');
    if (!nodes.length || !details.length) return;

    function select(id) {
      nodes.forEach(function (n) {
        var on = n.getAttribute('data-arch') === id;
        n.classList.toggle('active', on);
        n.setAttribute('aria-pressed', String(on));
        n.tabIndex = on ? 0 : -1;
      });
      details.forEach(function (d) {
        d.hidden = d.getAttribute('data-arch-detail') !== id;
      });
    }

    nodes.forEach(function (n, idx) {
      n.addEventListener('click', function () { select(n.getAttribute('data-arch')); });
      n.addEventListener('keydown', function (e) {
        var step = e.key === 'ArrowDown' || e.key === 'ArrowRight' ? 1
                 : e.key === 'ArrowUp' || e.key === 'ArrowLeft' ? -1 : 0;
        if (!step) return;
        e.preventDefault();
        var next = nodes[(idx + step + nodes.length) % nodes.length];
        select(next.getAttribute('data-arch'));
        next.focus();
      });
    });

    var active = root.querySelector('[data-arch].active') || nodes[0];
    select(active.getAttribute('data-arch'));
  })();

  /* ---------- SOLUTION FINDER ---------- */
  (function () {
    var root = document.getElementById('finder');
    if (!root) return;
    var typeButtons = root.querySelectorAll('[data-find-type]');
    var featButtons = root.querySelectorAll('[data-find-feature]');
    var scaleButtons = root.querySelectorAll('[data-find-scale]');
    var body = root.querySelector('[data-find-result]');
    if (!typeButtons.length || !body) return;

    var TYPES = {
      marketplace: {
        label: 'Multi-vendor marketplace',
        blurb: 'Several sellers, one storefront — catalogue, atomic checkout, vendor payouts and logistics.',
        caseName: 'Al Wholesale — B2B marketplace, UAE',
        caseHref: 'work/al-wholesale.html',
        modules: ['Vendor onboarding & approval', 'Catalogue + variants & tiered pricing', 'Guest cart, checkout & orders', 'Dynamic VAT & commission engine', 'Vendor payout ledger', 'Delivery, disputes & reports'],
        stack: ['React', 'Django', 'PostgreSQL', 'Noon Payments', 'DigitalOcean'],
        weeks: 10
      },
      listing: {
        label: 'Dealer & listing platform',
        blurb: 'Dealers publish stock, buyers enquire, and every lead lands in one dashboard.',
        caseName: 'All Cars 365 — dealer platform, UAE',
        caseHref: 'work/all-cars-365.html',
        modules: ['Dealer accounts & permissions', 'Listing creation + media upload', 'Search with smart filters', 'Buyer lead capture', 'Finance enquiry routing', 'Dealer performance dashboard'],
        stack: ['React', 'Django', 'PostgreSQL', 'REST APIs'],
        weeks: 8
      },
      management: {
        label: 'Management system / ERP',
        blurb: 'Run the whole operation — records, staff, stock, billing — from one role-based system.',
        caseName: 'Smart School — school ERP',
        caseHref: 'work/smart-school.html',
        modules: ['Role-based access control', 'Records & master data', 'Attendance / inventory modules', 'Fees & billing', 'Reports and exports', 'Staff + admin dashboards'],
        stack: ['Python', 'Django', 'PostgreSQL', 'REST APIs'],
        weeks: 9
      },
      leads: {
        label: 'Data or lead-generation product',
        blurb: 'Collect, enrich and score prospects automatically — then work them inside a built-in CRM.',
        caseName: 'LeadGenPro — lead database + CRM',
        caseHref: 'work/leadgenpro.html',
        modules: ['Automated data collection', 'Deduplication & enrichment', 'Advanced search and filters', 'Scoring / prioritisation', 'Built-in CRM pipeline', 'Export & API access'],
        stack: ['Python', 'Scrapy', 'Django', 'React', 'PostgreSQL'],
        weeks: 9
      },
      trade: {
        label: 'International trade portal',
        blurb: 'Sourcing, product specification and logistics storytelling for buyers and suppliers across continents.',
        caseName: 'Canadatrado — food-trading website',
        caseHref: 'work/canadatrado.html',
        modules: ['Interactive trade globe', 'Commodity catalogue + modal', 'Search & category filters', 'Product-aware quote flow', 'Supplier onboarding', 'Logistics & compliance pages'],
        stack: ['HTML5', 'Tailwind CSS', 'JavaScript', 'D3.js', 'GSAP'],
        weeks: 5
      },
      website: {
        label: 'Corporate / marketing website',
        blurb: 'A fast, multi-brand corporate site with real storytelling and a working enquiry pipeline.',
        caseName: 'Eco Choice Group — multi-brand corporate site',
        caseHref: 'work/eco-choice.html',
        modules: ['Seven-page architecture', 'Filterable brand portfolio', 'Sustainability & SDG pages', 'Event gallery + lightbox', 'PHP enquiry pipeline', 'Motion & scroll animations'],
        stack: ['HTML5', 'CSS3', 'JavaScript', 'PHP'],
        weeks: 6
      }
    };

    var FEATURES = [
      { id: 'accounts', label: 'User accounts & roles', weeks: 1, mod: 'Accounts & permissions' },
      { id: 'payments', label: 'Online payments', weeks: 1, mod: 'Payment gateway' },
      { id: 'admin', label: 'Admin dashboard', weeks: 1, mod: 'Admin dashboard' },
      { id: 'cms', label: 'Content management', weeks: 1, mod: 'Content management (CMS)' },
      { id: 'bilingual', label: 'Multi-language / RTL', weeks: 1, mod: 'Multi-language + RTL' },
      { id: 'whatsapp', label: 'WhatsApp notifications', weeks: 1, mod: 'WhatsApp notifications' },
      { id: 'ai', label: 'AI / automation', weeks: 2, mod: 'AI-assisted automation' },
      { id: 'analytics', label: 'Analytics & reporting', weeks: 1, mod: 'Analytics & reporting' },
      { id: 'pwa', label: 'Mobile app (PWA)', weeks: 2, mod: 'Installable mobile app' },
      { id: 'integrations', label: 'Third-party integrations', weeks: 1, mod: 'Third-party integrations' },
      { id: 'seo', label: 'SEO & speed pass', weeks: 1, mod: 'SEO + performance pass' }
    ];

    var SCALES = {
      small: { label: 'Single brand', factor: 0.75 },
      medium: { label: 'Growing business', factor: 1 },
      large: { label: 'Multi-team / high volume', factor: 1.35 }
    };

    var state = { type: 'marketplace', features: [], scale: 'medium' };
    var last = null;

    function featureFor(id) {
      for (var i = 0; i < FEATURES.length; i++) { if (FEATURES[i].id === id) return FEATURES[i]; }
      return null;
    }

    function render() {
      var t = TYPES[state.type];
      if (!t) return;

      var extraWeeks = 0;
      var picked = [];
      var extraMods = [];
      state.features.forEach(function (id) {
        var f = featureFor(id);
        if (!f) return;
        extraWeeks += f.weeks;
        picked.push(f.label);
        if (f.mod) extraMods.push(f.mod);
      });

      var total = Math.round((t.weeks + extraWeeks) * SCALES[state.scale].factor);
      var lo = Math.max(2, Math.round(total * 0.85));
      var hi = Math.max(lo + 1, Math.round(total * 1.25));
      var complexity = total <= 5 ? 'Lean' : total <= 11 ? 'Moderate' : 'Substantial';

      var mods = t.modules.concat(extraMods.filter(function (m) { return t.modules.indexOf(m) === -1; }));

      last = { type: t, lo: lo, hi: hi, picked: picked };

      body.innerHTML =
        '<div class="finder-head">' +
          '<span class="hint"><svg aria-hidden="true"><use href="#i-compass"/></svg> Your project shape</span>' +
          '<h3>' + escHtml(t.label) + '</h3>' +
          '<p>' + escHtml(t.blurb) + '</p>' +
        '</div>' +
        '<div class="finder-stats">' +
          '<div class="fstat"><span class="k">Indicative timeline</span><span class="v">' + lo + '–' + hi + ' weeks</span></div>' +
          '<div class="fstat"><span class="k">Scope</span><span class="v">' + complexity + '</span></div>' +
          '<div class="fstat"><span class="k">Features picked</span><span class="v">' + picked.length + '</span></div>' +
        '</div>' +
        '<div class="finder-block"><span class="k">What I would build</span><div class="finder-tags">' +
          mods.map(function (m) { return '<span class="tag">' + escHtml(m) + '</span>'; }).join('') +
        '</div></div>' +
        '<div class="finder-block"><span class="k">Suggested stack</span><div class="finder-tags">' +
          t.stack.map(function (s) { return '<span class="tag">' + escHtml(s) + '</span>'; }).join('') +
        '</div></div>' +
        '<div class="finder-case">' +
          '<div><span class="fc-k">Closest work</span><div class="fc-v">' + escHtml(t.caseName) + '</div></div>' +
          '<a class="btn btn-ghost" href="' + t.caseHref + '">View case study <svg aria-hidden="true"><use href="#i-arrow"/></svg></a>' +
        '</div>' +
        '<div class="finder-actions">' +
          '<a class="btn btn-primary" href="#contact" data-find-cta>Start this project <svg aria-hidden="true"><use href="#i-arrow-ur"/></svg></a>' +
        '</div>';
    }

    function setPressed(nodes, on) {
      nodes.forEach(function (n) { n.setAttribute('aria-pressed', String(n === on)); });
    }

    typeButtons.forEach(function (b) {
      b.addEventListener('click', function () {
        state.type = b.getAttribute('data-find-type');
        setPressed(typeButtons, b);
        render();
      });
    });

    featButtons.forEach(function (b) {
      b.addEventListener('click', function () {
        var id = b.getAttribute('data-find-feature');
        var i = state.features.indexOf(id);
        if (i === -1) { state.features.push(id); b.setAttribute('aria-pressed', 'true'); }
        else { state.features.splice(i, 1); b.setAttribute('aria-pressed', 'false'); }
        render();
      });
    });

    scaleButtons.forEach(function (b) {
      b.addEventListener('click', function () {
        state.scale = b.getAttribute('data-find-scale');
        setPressed(scaleButtons, b);
        render();
      });
    });

    body.addEventListener('click', function (e) {
      var cta = e.target && e.target.closest ? e.target.closest('[data-find-cta]') : null;
      if (!cta || !last) return;
      var msg = document.getElementById('cf-msg');
      if (msg && !msg.value.trim()) {
        var lines = ['Project: ' + last.type.label];
        if (last.picked.length) lines.push('Needs: ' + last.picked.join(', '));
        lines.push('Scale: ' + SCALES[state.scale].label);
        lines.push('Indicative timeline from the site: ' + last.lo + '–' + last.hi + ' weeks');
        msg.value = lines.join('\n');
        msg.dispatchEvent(new Event('input', { bubbles: true }));
      }
    });

    var activeType = root.querySelector('[data-find-type][aria-pressed="true"]') || typeButtons[0];
    state.type = activeType.getAttribute('data-find-type');
    setPressed(typeButtons, activeType);

    var activeScale = root.querySelector('[data-find-scale][aria-pressed="true"]') || scaleButtons[0];
    if (activeScale) { state.scale = activeScale.getAttribute('data-find-scale'); setPressed(scaleButtons, activeScale); }

    render();
  })();

  /* ---------- INSIDE THE BUILD ---------- */
  (function () {
    var root = document.getElementById('anatomy');
    if (!root) return;

    var tabs = Array.prototype.slice.call(root.querySelectorAll('[data-anat]'));
    var views = Array.prototype.slice.call(root.querySelectorAll('[data-anat-view]'));
    var notes = Array.prototype.slice.call(root.querySelectorAll('[data-anat-notes]'));
    var urlEl = document.getElementById('anatUrl');

    function panelFor(id, attr) {
      return root.querySelector('[' + attr + '="' + id + '"]');
    }

    function setNote(id, index) {
      var view = panelFor(id, 'data-anat-view');
      var note = panelFor(id, 'data-anat-notes');
      if (!view || !note) return;

      view.classList.add('has-active');
      Array.prototype.forEach.call(view.querySelectorAll('.hs'), function (h) {
        h.classList.toggle('is-active', Number(h.getAttribute('data-note')) === index);
      });
      Array.prototype.forEach.call(note.querySelectorAll('.anote'), function (n) {
        n.classList.toggle('is-active', Number(n.getAttribute('data-note')) === index);
      });
    }

    function showView(id, moveFocus) {
      tabs.forEach(function (t) {
        var on = t.getAttribute('data-anat') === id;
        t.classList.toggle('active', on);
        t.setAttribute('aria-selected', on ? 'true' : 'false');
        t.tabIndex = on ? 0 : -1;
        if (on && moveFocus) t.focus();
      });
      views.forEach(function (v) {
        v.classList.toggle('active', v.getAttribute('data-anat-view') === id);
      });
      notes.forEach(function (n) {
        n.classList.toggle('active', n.getAttribute('data-anat-notes') === id);
      });

      var view = panelFor(id, 'data-anat-view');
      if (view && urlEl) urlEl.textContent = view.getAttribute('data-url') || '';
      setNote(id, 0);
    }

    tabs.forEach(function (tab, i) {
      tab.addEventListener('click', function () { showView(tab.getAttribute('data-anat')); });
      tab.addEventListener('keydown', function (e) {
        var dir = e.key === 'ArrowRight' ? 1 : (e.key === 'ArrowLeft' ? -1 : 0);
        if (!dir) return;
        e.preventDefault();
        var next = tabs[(i + dir + tabs.length) % tabs.length];
        showView(next.getAttribute('data-anat'), true);
      });
    });

    function handlePoint(e) {
      var target = e.target.closest('.hs, .anote');
      if (!target || !root.contains(target)) return;
      var holder = target.closest('[data-anat-view], [data-anat-notes]');
      if (!holder) return;
      var id = holder.getAttribute('data-anat-view') || holder.getAttribute('data-anat-notes');
      setNote(id, Number(target.getAttribute('data-note')));
    }

    root.addEventListener('mouseover', handlePoint);
    root.addEventListener('focusin', handlePoint);
    root.addEventListener('click', handlePoint);

    setNote('store', 0);
  })();

  /* ---------- ANIMATED COUNTERS ---------- */
  (function () {
    var nums = document.querySelectorAll('[data-count]');
    if (!nums.length) return;

    function run(el) {
      var target = parseFloat(el.getAttribute('data-count'));
      var span = el.querySelector('[data-count-val]');
      if (!span || isNaN(target)) return;
      var dec = parseInt(el.getAttribute('data-decimals') || '0', 10);
      var pre = el.getAttribute('data-prefix') || '';
      var suf = el.getAttribute('data-suffix') || '';
      var format = function (v) { return pre + v.toFixed(dec) + suf; };

      if (prefersReduce) { span.textContent = format(target); return; }

      var start = null;
      var dur = 1300;
      var done = false;
      function finish() {
        if (done) return;
        done = true;
        span.textContent = format(target);
      }
      function step(now) {
        if (done) return;
        if (start === null) start = now;
        var p = Math.min(1, (now - start) / dur);
        span.textContent = format(target * (1 - Math.pow(1 - p, 3)));
        if (p < 1) requestAnimationFrame(step);
        else finish();
      }
      requestAnimationFrame(step);
      /* safety net: if rAF is throttled or starved, never leave a wrong number on screen */
      setTimeout(finish, dur + 500);
    }

    if (!('IntersectionObserver' in window)) { nums.forEach(run); return; }
    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (en) {
        if (!en.isIntersecting) return;
        io.unobserve(en.target);
        run(en.target);
      });
    }, { threshold: 0.55 });
    nums.forEach(function (el) { io.observe(el); });
  })();

  /* ---------- SECTION SPY RAIL ---------- */
  (function () {
    var rail = document.querySelector('[data-spy]');
    if (!rail) return;
    var links = Array.prototype.slice.call(rail.querySelectorAll('a'));
    if (!links.length) return;

    var items = [];
    links.forEach(function (a) {
      var id = (a.getAttribute('href') || '').replace('#', '');
      var el = id ? document.getElementById(id) : null;
      if (el) items.push({ a: a, el: el });
      else a.parentNode.removeChild(a);
    });
    if (!items.length || !('IntersectionObserver' in window)) return;

    var railIO = new IntersectionObserver(function (entries) {
      entries.forEach(function (en) {
        if (!en.isIntersecting) return;
        items.forEach(function (it) { it.a.classList.toggle('active', it.el === en.target); });
      });
    }, { rootMargin: '-45% 0px -45% 0px' });
    items.forEach(function (it) { railIO.observe(it.el); });
  })();
})();
