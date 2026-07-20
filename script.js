/* Street Flow — interactions. Plain JS, no dependencies. All motion respects prefers-reduced-motion. */
(function () {
  'use strict';
  const prefersReduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  const mqPin = window.matchMedia('(min-width:821px)');
  const $ = (s, r) => (r || document).querySelector(s);
  const $$ = (s, r) => Array.prototype.slice.call((r || document).querySelectorAll(s));

  /* ---------- Watch grid (highlight links are placeholders until real reels are added) ---------- */
  const PROFILE = 'https://www.instagram.com/streetflowdance/';
  const WATCH = [
    { label: 'Dance Reels',        angle: 95,  href: PROFILE },
    { label: 'Wedding',            angle: 140, href: PROFILE },
    { label: 'Teasers',            angle: 60,  href: PROFILE },
    { label: 'Practices',          angle: 110, href: PROFILE },
    { label: 'Reviews',            angle: 80,  href: PROFILE },
    { label: 'Events',             angle: 150, href: PROFILE },
    { label: 'Celeb Interactions', angle: 70,  href: PROFILE },
    { label: 'All Posts',          angle: 120, href: PROFILE }
  ];
  const grid = $('.watch-grid');
  if (grid) {
    WATCH.forEach((item, i) => {
      const a = document.createElement('a');
      a.href = item.href;          // TODO: point each at its specific Instagram highlight/reel
      a.target = '_blank';
      a.rel = 'noopener';
      a.className = 'watch-card';
      a.setAttribute('data-reveal', '');
      a.style.setProperty('--d', (i % 4) * 90 + 'ms');
      a.innerHTML =
        '<div class="bg" style="background:linear-gradient(' + item.angle + 'deg,#ec3f73,#f4a93b ' + (55 + i * 3) + '%,#ffd866)"></div>' +
        '<span class="label">' + item.label + '</span>' +
        '<span class="go">View on Instagram' +
        '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M7 17L17 7M9 7h8v8"/></svg></span>';
      grid.appendChild(a);
    });
  }

  /* ---------- Scroll reveal ---------- */
  const io = new IntersectionObserver((entries) => {
    entries.forEach((e) => { if (e.isIntersecting) { e.target.classList.add('in'); io.unobserve(e.target); } });
  }, { threshold: 0.15 });
  $$('[data-reveal]').forEach((el) => io.observe(el));

  /* ---------- Mobile menu ---------- */
  const toggle = $('#navToggle');
  const menu = $('#mobileMenu');
  function setMenu(open) {
    menu.classList.toggle('open', open);
    toggle.setAttribute('aria-expanded', open ? 'true' : 'false');
    toggle.setAttribute('aria-label', open ? 'Close menu' : 'Open menu');
    menu.setAttribute('aria-hidden', open ? 'false' : 'true');
    menu.inert = !open;
  }
  if (toggle && menu) {
    setMenu(false);
    toggle.addEventListener('click', () => setMenu(!menu.classList.contains('open')));
    $$('a', menu).forEach((a) => a.addEventListener('click', () => setMenu(false)));
    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape' && menu.classList.contains('open')) { setMenu(false); toggle.focus(); }
    });
  }

  /* ---------- Styles / Fitness tabs ---------- */
  const tablist = $('.track-tabs');
  const tabs = $$('.track-tab');
  const underline = $('.track-underline');
  function positionUnderline(tab) {
    if (!underline || !tab) return;
    underline.style.width = tab.offsetWidth + 'px';
    underline.style.transform = 'translateX(' + tab.offsetLeft + 'px)';
  }
  function staggerChips(panel) {
    const chips = $$('.chip', panel);
    chips.forEach((c) => c.classList.remove('in'));
    requestAnimationFrame(() => {
      chips.forEach((c, i) => setTimeout(() => c.classList.add('in'), prefersReduced ? 0 : i * 22));
    });
  }
  function activateTab(tab) {
    tabs.forEach((t) => {
      const on = t === tab;
      t.classList.toggle('is-active', on);
      t.setAttribute('aria-selected', on ? 'true' : 'false');
      t.tabIndex = on ? 0 : -1;
      const panel = document.getElementById(t.getAttribute('aria-controls'));
      if (panel) {
        panel.classList.toggle('is-active', on);
        panel.hidden = !on;
        if (on) staggerChips(panel);
      }
    });
    positionUnderline(tab);
  }
  if (tabs.length) {
    tabs.forEach((tab) => tab.addEventListener('click', () => activateTab(tab)));
    tablist.addEventListener('keydown', (e) => {
      if (e.key !== 'ArrowRight' && e.key !== 'ArrowLeft') return;
      const i = tabs.indexOf(document.activeElement);
      if (i < 0) return;
      e.preventDefault();
      const ni = e.key === 'ArrowRight' ? (i + 1) % tabs.length : (i - 1 + tabs.length) % tabs.length;
      tabs[ni].focus();
      activateTab(tabs[ni]);
    });
    // position the active pill once layout + webfonts are ready; stagger chips on first view
    const active0 = tabs.find((t) => t.classList.contains('is-active')) || tabs[0];
    positionUnderline(active0);
    if (document.fonts && document.fonts.ready) document.fonts.ready.then(() => positionUnderline(active0));
    window.addEventListener('resize', () => positionUnderline($('.track-tab.is-active') || tabs[0]));
    const stylesSec = $('#styles');
    if (stylesSec) {
      const so = new IntersectionObserver((entries) => {
        entries.forEach((e) => {
          if (e.isIntersecting) { staggerChips($('.track-panel.is-active')); positionUnderline($('.track-tab.is-active')); so.disconnect(); }
        });
      }, { threshold: 0.2 });
      so.observe(stylesSec);
    }
  }

  /* ---------- Achievements count-up ---------- */
  let countsDone = false;
  function runCounts() {
    if (countsDone) return; countsDone = true;
    $$('.achieve-stat .num').forEach((el) => {
      const target = +el.dataset.count, suffix = el.dataset.suffix || '';
      if (prefersReduced) { el.textContent = target + suffix; return; }
      const dur = 1200, t0 = performance.now();
      (function step(now) {
        const p = Math.min((now - t0) / dur, 1);
        const eased = 1 - Math.pow(1 - p, 3);
        el.textContent = Math.round(target * eased) + (p === 1 ? suffix : '');
        if (p < 1) requestAnimationFrame(step); else el.textContent = target + suffix;
      })(performance.now());
    });
  }

  /* ---------- About scrollytelling (pinned on desktop, swipe carousel on mobile) ---------- */
  const scrolly = $('#scrolly');
  if (scrolly) {
    const spanels = $$('.spanel', scrolly);
    const sdots = $$('.scrolly-dot', scrolly);
    const panelsWrap = $('.scrolly-panels', scrolly);
    const n = spanels.length;
    let current = -1;
    function setPanel(i) {
      i = Math.max(0, Math.min(n - 1, i));
      if (i === current) return;
      current = i;
      spanels.forEach((p, idx) => p.classList.toggle('is-active', idx === i));
      sdots.forEach((d, idx) => d.classList.toggle('is-active', idx === i));
      if (i === n - 1) runCounts();
    }
    setPanel(0);

    // desktop: scroll position within the tall section drives the active panel
    let ticking = false;
    function onScroll() {
      if (!mqPin.matches || prefersReduced) return;
      const rect = scrolly.getBoundingClientRect();
      const total = scrolly.offsetHeight - window.innerHeight;
      const scrolled = Math.min(Math.max(-rect.top, 0), total);
      const progress = total > 0 ? scrolled / total : 0;
      setPanel(Math.min(n - 1, Math.floor(progress * n)));
    }
    window.addEventListener('scroll', () => {
      if (!ticking) { ticking = true; requestAnimationFrame(() => { onScroll(); ticking = false; }); }
    }, { passive: true });

    // mobile: horizontal snap carousel updates the dots
    let cTick = false;
    function onCarousel() {
      if (mqPin.matches) return;
      const wr = panelsWrap.getBoundingClientRect();
      const center = wr.left + wr.width / 2;
      let best = 0, bestD = Infinity;
      spanels.forEach((p, idx) => {
        const r = p.getBoundingClientRect();
        const d = Math.abs((r.left + r.width / 2) - center);
        if (d < bestD) { bestD = d; best = idx; }
      });
      sdots.forEach((d, idx) => d.classList.toggle('is-active', idx === best));
      if (best === n - 1) runCounts();
    }
    if (panelsWrap) {
      panelsWrap.addEventListener('scroll', () => {
        if (!cTick) { cTick = true; requestAnimationFrame(() => { onCarousel(); cTick = false; }); }
      }, { passive: true });
    }

    // dots are clickable in both modes
    sdots.forEach((d) => d.addEventListener('click', () => {
      const i = +d.dataset.i;
      if (mqPin.matches && !prefersReduced) {
        const top = scrolly.getBoundingClientRect().top + window.scrollY;
        const total = scrolly.offsetHeight - window.innerHeight;
        window.scrollTo({ top: top + ((i + 0.5) / n) * total, behavior: 'smooth' });
      } else if (panelsWrap && spanels[i]) {
        spanels[i].scrollIntoView({ behavior: 'smooth', inline: 'center', block: 'nearest' });
        setPanel(i);
      }
    }));

    // reduced motion or mobile: all panels are laid out, so fire counts on real intersection.
    // (On desktop the panels are stacked in the pinned stage, so we rely on setPanel(last) instead
    //  to avoid counting up while the achievements panel is still faded out.)
    const achieve = spanels[n - 1];
    if (achieve) {
      const ao = new IntersectionObserver((entries) => {
        entries.forEach((e) => {
          if (e.isIntersecting && (!mqPin.matches || prefersReduced)) { runCounts(); ao.disconnect(); }
        });
      }, { threshold: 0.35 });
      ao.observe(achieve);
    }
    onScroll();
  }

  /* ---------- Preloader + intro video modal ---------- */
  const preloader = $('#preloader');
  const modal = $('#introModal');
  let lastFocus = null;
  const bgEls = Array.prototype.slice.call(document.body.children)
    .filter((el) => el !== modal && el !== preloader);

  function setBgInert(on) { bgEls.forEach((el) => { el.inert = on; }); }
  function openModal() {
    if (!modal) return;
    lastFocus = document.activeElement;
    modal.hidden = false;
    document.body.style.overflow = 'hidden';
    setBgInert(true);
    const close = $('.modal-close', modal);
    if (close) close.focus();
  }
  function closeModal() {
    if (!modal) return;
    modal.hidden = true;
    document.body.style.overflow = '';
    setBgInert(false);
    if (lastFocus && lastFocus.focus) lastFocus.focus();
  }
  if (modal) {
    $$('[data-close]', modal).forEach((el) => el.addEventListener('click', closeModal));
    document.addEventListener('keydown', (e) => { if (e.key === 'Escape' && !modal.hidden) closeModal(); });
    // Play is a placeholder until the real film is supplied.
    const play = $('.modal-play', modal);
    if (play) play.addEventListener('click', () => { /* TODO: start intro video when provided */ });
  }
  function maybeShowIntro() {
    if (!modal) return;
    try {
      if (sessionStorage.getItem('sf_intro_seen')) return;
      sessionStorage.setItem('sf_intro_seen', '1');
    } catch (e) { /* private mode: just show it */ }
    openModal();
  }

  if (preloader) {
    let hidden = false;
    function hidePreloader() {
      if (hidden) return; hidden = true;
      preloader.classList.add('done');
      setTimeout(() => { preloader.style.display = 'none'; maybeShowIntro(); }, prefersReduced ? 0 : 620);
    }
    window.addEventListener('load', () => setTimeout(hidePreloader, prefersReduced ? 120 : 900));
    setTimeout(hidePreloader, 3500); // safety net if 'load' is slow (e.g. blocked webfonts)
  } else {
    maybeShowIntro();
  }
})();
