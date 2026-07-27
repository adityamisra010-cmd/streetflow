/* Street Flow, interactions. Plain JS, no dependencies. All motion respects prefers-reduced-motion. */
(function () {
  'use strict';

  /* =====================================================================
     CONFIG - the only block you edit to go live. Drop files in the repo
     root and paste the values here. Everything degrades gracefully when
     a value is left blank.
     ===================================================================== */
  var CONFIG = {
    // Google Apps Script Web App URL that writes enquiries to your Sheet.
    // See BACKEND-SETUP.md for the 5-minute setup. Looks like:
    // https://script.google.com/macros/s/AKfy..../exec
    SHEET_ENDPOINT: '',

    // Intro film for the welcome pop-up. Use ONE of these (checked in this order).
    // Best experience first: a real file autoplays muted and fills the frame.
    INTRO_VIDEO_SRC: '',   // BEST: self-hosted file, e.g. 'intro.mp4'
    INTRO_POSTER: '',      //   optional still frame for the moment before it starts
    INTRO_VIDEO_YT: '',    // GOOD: a YouTube video id, e.g. 'dQw4w9WgXcQ' (unlisted is fine)
    INTRO_VIDEO_IG: '',    // OK:   an Instagram post/reel link, zero uploading, but see the notes
                           //       in CONTENT-TODO.md: it cannot autoplay and shows Instagram's card.

    // Replace the header logo with a looping muted video on arrival.
    LOGO_VIDEO_SRC: '',    // e.g. 'logo-motion.mp4' (poster falls back to logo-mark.png)

    // Social destinations (used by buttons + success screen).
    INSTAGRAM_URL: 'https://www.instagram.com/streetflowdance/',
    YOUTUBE_URL: 'https://youtube.com/@streetflowdance'
  };

  var prefersReduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  var mqPin = window.matchMedia('(min-width:821px)');
  var $ = function (s, r) { return (r || document).querySelector(s); };
  var $$ = function (s, r) { return Array.prototype.slice.call((r || document).querySelectorAll(s)); };

  /* ---------- Watch grid ----------
     PASTE YOUR INSTAGRAM LINKS INTO `ig` BELOW. Nothing to download or re-upload.

       - A POST or REEL link (instagram.com/p/... or instagram.com/reel/...)
         opens and PLAYS INSIDE this website, in a pop-up player.
       - A HIGHLIGHT or profile link (instagram.com/stories/highlights/...) simply
         opens Instagram in a new tab. Instagram does not allow those to be embedded.

     Optional extras per tile: `video` (a short self-hosted mp4 teaser that loops on
     the tile itself) and `poster` (a cover image). With neither, the tile shows the
     flame gradient, which already looks good. */
  var PROFILE = CONFIG.INSTAGRAM_URL;
  var WATCH = [
    { label: 'Dance Reels',        angle: 95,  ig: '', href: PROFILE },
    { label: 'Wedding',            angle: 140, ig: '', href: PROFILE },
    { label: 'Teasers',            angle: 60,  ig: '', href: PROFILE },
    { label: 'Practices',          angle: 110, ig: '', href: PROFILE },
    { label: 'Reviews',            angle: 80,  ig: '', href: PROFILE },
    { label: 'Events',             angle: 150, ig: '', href: PROFILE },
    { label: 'Celeb Interactions', angle: 70,  ig: '', href: PROFILE },
    { label: 'All Posts',          angle: 120, ig: '', href: PROFILE }
  ];

  /* Turn an Instagram permalink into its embeddable player URL.
     Returns null for anything Instagram refuses to embed (highlights, stories,
     profile links), so those gracefully fall back to opening in a new tab. */
  function igEmbedUrl(url) {
    if (!url) return null;
    var m = String(url).match(/instagram\.com\/(?:[A-Za-z0-9_.]+\/)?(p|reel|reels|tv)\/([A-Za-z0-9_-]+)/i);
    if (!m) return null;
    var type = m[1].toLowerCase() === 'reels' ? 'reel' : m[1].toLowerCase();
    return 'https://www.instagram.com/' + type + '/' + m[2] + '/embed';
  }

  var grid = $('.watch-grid');
  if (grid) {
    WATCH.forEach(function (item, i) {
      var embed = igEmbedUrl(item.ig);
      var a = document.createElement('a');
      a.href = item.ig || item.href || PROFILE;
      a.target = '_blank';
      a.rel = 'noopener';
      a.className = 'watch-card';
      a.setAttribute('data-reveal', '');
      a.style.setProperty('--d', (i % 4) * 90 + 'ms');

      var media = '';
      if (item.video) {
        a.classList.add('has-media');
        media = '<video class="teaser" src="' + item.video + '" muted loop playsinline preload="metadata"' +
                (item.poster ? ' poster="' + item.poster + '"' : '') + '></video><span class="scrim"></span>';
      } else if (item.poster) {
        a.classList.add('has-media');
        media = '<img class="cover" src="' + item.poster + '" alt="" loading="lazy"><span class="scrim"></span>';
      } else {
        media = '<div class="bg" style="background:linear-gradient(' + item.angle + 'deg,#ec3f73,#f4a93b ' + (55 + i * 3) + '%,#ffd866)"></div>';
      }

      // embeddable posts play on-site; everything else opens Instagram
      var goLabel = embed ? 'Watch here' : 'View on Instagram';
      var goIcon = embed
        ? '<svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true"><path d="M8 5v14l11-7z"/></svg>'
        : '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" aria-hidden="true"><path d="M7 17L17 7M9 7h8v8"/></svg>';

      a.innerHTML = media +
        (embed ? '<span class="watch-play" aria-hidden="true"><svg viewBox="0 0 24 24" fill="currentColor"><path d="M8 5v14l11-7z"/></svg></span>' : '') +
        '<span class="label"></span>' +
        '<span class="go">' + goLabel + goIcon + '</span>';
      a.querySelector('.label').textContent = item.label;   // label is data, never markup
      grid.appendChild(a);

      if (embed) {
        a.setAttribute('aria-haspopup', 'dialog');
        a.addEventListener('click', function (e) {
          if (e.metaKey || e.ctrlKey || e.shiftKey || e.button === 1) return; // let power users open a new tab
          e.preventDefault();
          openWatch(item.label, embed, a.href);
        });
      }

      // teaser playback: hover on desktop, in-view on touch; paused otherwise
      var vid = a.querySelector('video.teaser');
      if (vid && !prefersReduced) {
        a.addEventListener('mouseenter', function () { vid.play().catch(function () {}); });
        a.addEventListener('mouseleave', function () { vid.pause(); });
      }
    });

    // autoplay teasers while on screen (touch devices), respecting reduced motion
    if (!prefersReduced) {
      var vids = $$('video.teaser', grid);
      if (vids.length) {
        var vo = new IntersectionObserver(function (entries) {
          entries.forEach(function (e) {
            if (e.isIntersecting) { e.target.play().catch(function () {}); }
            else { e.target.pause(); }
          });
        }, { threshold: 0.6 });
        vids.forEach(function (v) { vo.observe(v); });
      }
    }
  }

  /* ---------- Scroll reveal ---------- */
  var io = new IntersectionObserver(function (entries) {
    entries.forEach(function (e) { if (e.isIntersecting) { e.target.classList.add('in'); io.unobserve(e.target); } });
  }, { threshold: 0.15 });
  $$('[data-reveal]').forEach(function (el) { io.observe(el); });

  /* ---------- Logo video swap (optional) ---------- */
  if (CONFIG.LOGO_VIDEO_SRC) {
    var wrap = $('#brandMarkWrap');
    if (wrap) {
      var lv = document.createElement('video');
      lv.className = 'brand-mark';
      lv.muted = true; lv.loop = true; lv.autoplay = true;
      lv.setAttribute('muted', ''); lv.setAttribute('playsinline', ''); lv.setAttribute('autoplay', '');
      lv.setAttribute('aria-hidden', 'true');
      lv.poster = 'logo-mark.png';
      lv.src = CONFIG.LOGO_VIDEO_SRC;
      wrap.innerHTML = '';
      wrap.appendChild(lv);
      lv.play().catch(function () {});
    }
  }

  /* ---------- Mobile menu ---------- */
  var toggle = $('#navToggle');
  var menu = $('#mobileMenu');
  var menuBg = [$('main'), $('footer')].filter(Boolean);
  function setMenu(open) {
    menu.classList.toggle('open', open);
    toggle.setAttribute('aria-expanded', open ? 'true' : 'false');
    toggle.setAttribute('aria-label', open ? 'Close menu' : 'Open menu');
    menu.setAttribute('aria-hidden', open ? 'false' : 'true');
    menu.inert = !open;
    menuBg.forEach(function (el) { el.inert = open; });
    document.body.style.overflow = open ? 'hidden' : '';
  }
  if (toggle && menu) {
    setMenu(false);
    toggle.addEventListener('click', function () { setMenu(!menu.classList.contains('open')); });
    $$('a', menu).forEach(function (a) { a.addEventListener('click', function () { setMenu(false); }); });
    document.addEventListener('keydown', function (e) {
      if (e.key === 'Escape' && menu.classList.contains('open')) { setMenu(false); toggle.focus(); }
    });
  }

  /* ---------- Styles / Fitness tabs ---------- */
  var tablist = $('.track-tabs');
  var tabs = $$('.track-tab');
  var underline = $('.track-underline');
  function positionUnderline(tab) {
    if (!underline || !tab) return;
    underline.style.width = tab.offsetWidth + 'px';
    underline.style.transform = 'translateX(' + tab.offsetLeft + 'px)';
  }
  function staggerChips(panel) {
    var chips = $$('.chip', panel);
    chips.forEach(function (c) { c.classList.remove('in'); });
    requestAnimationFrame(function () {
      chips.forEach(function (c, i) { setTimeout(function () { c.classList.add('in'); }, prefersReduced ? 0 : i * 22); });
    });
  }
  function activateTab(tab) {
    tabs.forEach(function (t) {
      var on = t === tab;
      t.classList.toggle('is-active', on);
      t.setAttribute('aria-selected', on ? 'true' : 'false');
      t.tabIndex = on ? 0 : -1;
      var panel = document.getElementById(t.getAttribute('aria-controls'));
      if (panel) {
        panel.classList.toggle('is-active', on);
        panel.hidden = !on;
        if (on) staggerChips(panel);
      }
    });
    positionUnderline(tab);
  }
  if (tabs.length) {
    tabs.forEach(function (tab) { tab.addEventListener('click', function () { activateTab(tab); }); });
    tablist.addEventListener('keydown', function (e) {
      if (e.key !== 'ArrowRight' && e.key !== 'ArrowLeft') return;
      var i = tabs.indexOf(document.activeElement);
      if (i < 0) return;
      e.preventDefault();
      var ni = e.key === 'ArrowRight' ? (i + 1) % tabs.length : (i - 1 + tabs.length) % tabs.length;
      tabs[ni].focus();
      activateTab(tabs[ni]);
    });
    positionUnderline($('.track-tab.is-active') || tabs[0]);
    if (document.fonts && document.fonts.ready) document.fonts.ready.then(function () { positionUnderline($('.track-tab.is-active') || tabs[0]); });
    window.addEventListener('resize', function () { positionUnderline($('.track-tab.is-active') || tabs[0]); });
    var stylesSec = $('#styles');
    if (stylesSec) {
      var so = new IntersectionObserver(function (entries) {
        entries.forEach(function (e) {
          if (e.isIntersecting) { staggerChips($('.track-panel.is-active')); positionUnderline($('.track-tab.is-active')); so.disconnect(); }
        });
      }, { threshold: 0.2 });
      so.observe(stylesSec);
    }
  }

  /* ---------- Achievements count-up ---------- */
  var countsDone = false;
  function runCounts() {
    if (countsDone) return; countsDone = true;
    $$('.achieve-stat .num').forEach(function (el) {
      var target = +el.dataset.count, suffix = el.dataset.suffix || '';
      if (prefersReduced) { el.textContent = target + suffix; return; }
      var dur = 1200, t0 = performance.now();
      (function step(now) {
        var p = Math.min((now - t0) / dur, 1);
        var eased = 1 - Math.pow(1 - p, 3);
        el.textContent = Math.round(target * eased) + (p === 1 ? suffix : '');
        if (p < 1) requestAnimationFrame(step); else el.textContent = target + suffix;
      })(performance.now());
    });
  }

  /* ---------- About scrollytelling ---------- */
  var scrolly = $('#scrolly');
  if (scrolly) {
    var spanels = $$('.spanel', scrolly);
    var sdots = $$('.scrolly-dot', scrolly);
    var panelsWrap = $('.scrolly-panels', scrolly);
    var n = spanels.length;
    var current = -1;
    function setPanel(i) {
      i = Math.max(0, Math.min(n - 1, i));
      if (i === current) return;
      current = i;
      spanels.forEach(function (p, idx) { p.classList.toggle('is-active', idx === i); });
      sdots.forEach(function (d, idx) {
        var on = idx === i;
        d.classList.toggle('is-active', on);
        if (on) d.setAttribute('aria-current', 'true'); else d.removeAttribute('aria-current');
      });
      if (i === n - 1) runCounts();
    }
    setPanel(0);

    var ticking = false;
    function onScroll() {
      if (!mqPin.matches || prefersReduced) return;
      var rect = scrolly.getBoundingClientRect();
      var total = scrolly.offsetHeight - window.innerHeight;
      var scrolled = Math.min(Math.max(-rect.top, 0), total);
      var progress = total > 0 ? scrolled / total : 0;
      setPanel(Math.min(n - 1, Math.floor(progress * n)));
    }
    window.addEventListener('scroll', function () {
      if (!ticking) { ticking = true; requestAnimationFrame(function () { onScroll(); ticking = false; }); }
    }, { passive: true });

    var cTick = false;
    function onCarousel() {
      if (mqPin.matches) return;
      var wr = panelsWrap.getBoundingClientRect();
      var center = wr.left + wr.width / 2;
      var best = 0, bestD = Infinity;
      spanels.forEach(function (p, idx) {
        var r = p.getBoundingClientRect();
        var d = Math.abs((r.left + r.width / 2) - center);
        if (d < bestD) { bestD = d; best = idx; }
      });
      setPanel(best);
    }
    if (panelsWrap) {
      panelsWrap.addEventListener('scroll', function () {
        if (!cTick) { cTick = true; requestAnimationFrame(function () { onCarousel(); cTick = false; }); }
      }, { passive: true });
    }
    mqPin.addEventListener('change', function () { current = -1; if (mqPin.matches) onScroll(); else onCarousel(); });

    sdots.forEach(function (d) { d.addEventListener('click', function () {
      var i = +d.dataset.i;
      if (mqPin.matches && !prefersReduced) {
        var top = scrolly.getBoundingClientRect().top + window.scrollY;
        var total = scrolly.offsetHeight - window.innerHeight;
        window.scrollTo({ top: top + ((i + 0.5) / n) * total, behavior: 'smooth' });
      } else if (panelsWrap && spanels[i]) {
        spanels[i].scrollIntoView({ behavior: prefersReduced ? 'auto' : 'smooth', inline: 'center', block: 'nearest' });
        setPanel(i);
      }
    }); });

    var achieve = spanels[n - 1];
    if (achieve) {
      var ao = new IntersectionObserver(function (entries) {
        entries.forEach(function (e) {
          if (e.isIntersecting && (!mqPin.matches || prefersReduced)) { runCounts(); ao.disconnect(); }
        });
      }, { threshold: 0.35 });
      ao.observe(achieve);
    }
    onScroll();
  }

  /* =====================================================================
     MODAL SYSTEM (intro + enquiry). Background is made inert so focus
     stays trapped inside the open dialog; Escape and backdrop close it.
     ===================================================================== */
  var openModals = 0;
  var preloaderDone = false;
  var introDismissed = false;
  var sticky = $('.sticky-cta');

  function bgFor(modal) {
    return Array.prototype.slice.call(document.body.children).filter(function (el) { return el !== modal; });
  }
  function updateSticky() {
    if (!sticky) return;
    var show = preloaderDone && openModals === 0 && (window.scrollY > 260 || introDismissed);
    sticky.classList.toggle('show', show);
  }

  function makeModal(modal, closeSel, focusSel, onClose) {
    if (!modal) return null;
    var lastFocus = null;
    var api = {
      isOpen: function () { return !modal.hidden; },
      open: function (returnEl) {
        if (!modal.hidden) return;
        lastFocus = returnEl || document.activeElement;
        modal.hidden = false;
        document.body.style.overflow = 'hidden';
        bgFor(modal).forEach(function (el) { el.inert = true; });
        openModals++;
        updateSticky();
        var f = (focusSel && modal.querySelector(focusSel)) || modal.querySelector('button, [href], input, select, textarea');
        if (f && f.focus) f.focus();
      },
      close: function () {
        if (modal.hidden) return;
        modal.hidden = true;
        openModals = Math.max(0, openModals - 1);
        if (openModals === 0) document.body.style.overflow = '';
        bgFor(modal).forEach(function (el) { el.inert = false; });
        updateSticky();
        if (typeof onClose === 'function') onClose();
        var back = (lastFocus && lastFocus.focus && lastFocus !== document.body && lastFocus.offsetParent !== null) ? lastFocus : (sticky || $('.brand'));
        if (back && back.focus) back.focus();
      }
    };
    $$(closeSel, modal).forEach(function (el) { el.addEventListener('click', api.close); });
    document.addEventListener('keydown', function (e) { if (e.key === 'Escape' && !modal.hidden) api.close(); });
    return api;
  }

  /* ---------- Intro modal (welcome film + pyramid) ---------- */
  var introEl = $('#introModal');
  var introStage = $('#introStage');
  var introPoster = introStage ? introStage.querySelector('.modal-poster') : null;

  // Tear the film down when the pop-up closes, so nothing keeps playing behind the page.
  var intro = makeModal(introEl, '[data-close]', '.modal-close', clearIntroMedia);

  function clearIntroMedia() {
    if (!introStage) return;
    $$('video, iframe', introStage).forEach(function (el) {
      if (el.tagName === 'VIDEO') { try { el.pause(); } catch (e) {} }
      el.removeAttribute('src');
      el.remove();
    });
    var hint = introStage.querySelector('.sound-hint');
    if (hint) hint.remove();
    introStage.classList.remove('is-portrait');
    if (introPoster) introPoster.hidden = false;
  }

  // Build the film inside the stage. Returns true if something was mounted.
  function mountIntroMedia() {
    if (!introStage || introStage.querySelector('video, iframe')) return true;
    var mounted = false;

    if (CONFIG.INTRO_VIDEO_SRC) {
      var v = document.createElement('video');
      v.className = 'intro-video';
      v.src = CONFIG.INTRO_VIDEO_SRC;
      if (CONFIG.INTRO_POSTER) v.poster = CONFIG.INTRO_POSTER;
      v.controls = true;
      v.setAttribute('playsinline', '');
      if (!prefersReduced) {
        // muted autoplay is the only kind browsers allow without a click
        v.muted = true; v.setAttribute('muted', '');
        v.loop = true;
        v.setAttribute('autoplay', '');
      }
      introStage.appendChild(v);
      if (!prefersReduced) {
        v.play().catch(function () {});
        introStage.appendChild(makeSoundHint(v));
      }
      mounted = true;

    } else if (CONFIG.INTRO_VIDEO_YT) {
      var yt = document.createElement('iframe');
      yt.src = 'https://www.youtube-nocookie.com/embed/' + CONFIG.INTRO_VIDEO_YT +
               '?rel=0&playsinline=1&modestbranding=1' + (prefersReduced ? '' : '&autoplay=1&mute=1');
      yt.title = 'Street Flow intro film';
      yt.setAttribute('frameborder', '0');
      yt.setAttribute('allowfullscreen', '');
      yt.setAttribute('allow', 'autoplay; encrypted-media; picture-in-picture; fullscreen');
      introStage.appendChild(yt);
      mounted = true;

    } else if (CONFIG.INTRO_VIDEO_IG) {
      var embed = igEmbedUrl(CONFIG.INTRO_VIDEO_IG);
      if (embed) {
        // Instagram embeds are portrait and cannot autoplay; reshape the stage to suit
        introStage.classList.add('is-portrait');
        var ig = document.createElement('iframe');
        ig.src = embed;
        ig.title = 'Street Flow intro film on Instagram';
        ig.setAttribute('scrolling', 'no');
        ig.setAttribute('frameborder', '0');
        ig.setAttribute('allowfullscreen', '');
        ig.setAttribute('allow', 'autoplay; clipboard-write; encrypted-media; picture-in-picture; web-share');
        introStage.appendChild(ig);
        mounted = true;
      }
    }

    if (mounted && introPoster) introPoster.hidden = true;
    return mounted;
  }

  // "Tap for sound" control, since the film has to start muted to autoplay at all
  function makeSoundHint(video) {
    var hint = document.createElement('button');
    hint.type = 'button';
    hint.className = 'sound-hint mono';
    hint.innerHTML =
      '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" aria-hidden="true">' +
      '<path d="M11 5L6 9H3v6h3l5 4V5z"/><path d="M15.5 8.5a5 5 0 010 7"/></svg>Tap for sound';
    hint.addEventListener('click', function () {
      video.muted = false;
      video.play().catch(function () {});
      hint.remove();
    });
    return hint;
  }

  if (introEl) {
    // the placeholder play button is only reachable when no film is configured yet
    var introPlay = $('.modal-play', introEl);
    if (introPlay) introPlay.addEventListener('click', mountIntroMedia);
    if (CONFIG.INTRO_VIDEO_SRC || CONFIG.INTRO_VIDEO_YT || CONFIG.INTRO_VIDEO_IG) {
      var lbl = $('.modal-poster .mono', introEl);
      if (lbl) lbl.textContent = 'Play the intro';
    }
    // closing the intro (any which way) marks it dismissed so the sticky CTA can appear
    $$('[data-close]', introEl).forEach(function (el) { el.addEventListener('click', function () { introDismissed = true; updateSticky(); }); });
    document.addEventListener('keydown', function (e) { if (e.key === 'Escape' && introEl && !introEl.hidden) { introDismissed = true; } });
  }

  /* ---------- Watch player modal (plays Instagram posts/reels on-site) ----------
     The Instagram iframe is only created when a tile is clicked, so the page stays
     fast and no Instagram cookies load for visitors who never open a video. */
  var watchModal = makeModal($('#watchModal'), '[data-close-watch]', '.modal-close', function () {
    var stage = $('#watchStage');
    if (stage) stage.innerHTML = '';   // unload the iframe so the video stops
  });

  function openWatch(label, embedUrl, permalink) {
    var stage = $('#watchStage');
    var title = $('#watchModalTitle');
    var link = $('#watchOpenLink');
    if (title) title.textContent = label;
    if (link) link.href = permalink || PROFILE;
    if (stage) {
      stage.innerHTML = '';
      var f = document.createElement('iframe');
      f.src = embedUrl;
      f.title = label + ' on Instagram';
      f.setAttribute('scrolling', 'no');
      f.setAttribute('frameborder', '0');
      f.setAttribute('allowfullscreen', '');
      f.setAttribute('allow', 'autoplay; clipboard-write; encrypted-media; picture-in-picture; web-share');
      stage.appendChild(f);
    }
    if (watchModal) watchModal.open();
  }

  /* ---------- Enquiry modal + Google Sheets submission ---------- */
  var enquiryEl = $('#enquiryModal');
  var enquiry = makeModal(enquiryEl, '[data-close-enquiry]', '#ef-name');
  var form = $('#enquiryForm');
  var enquiryBody = $('#enquiryBody');
  var enquirySuccess = $('#enquirySuccess');
  var enquiryError = $('#enquiryError');
  var submitBtn = $('#enquirySubmit');

  function resetEnquiryView() {
    if (enquiryBody) enquiryBody.hidden = false;
    if (enquirySuccess) enquirySuccess.hidden = true;
    if (enquiryError) { enquiryError.hidden = true; enquiryError.textContent = ''; }
    $$('.field-error', form).forEach(function (f) { f.classList.remove('field-error'); });
  }

  function openEnquiry(trigger) {
    // if launched from inside the intro pop-up, close that first
    if (intro && intro.isOpen()) { introDismissed = true; intro.close(); }
    resetEnquiryView();
    if (enquiry) enquiry.open(trigger && trigger.offsetParent !== null ? trigger : null);
  }
  $$('[data-enquire]').forEach(function (btn) {
    btn.addEventListener('click', function () { openEnquiry(btn); });
  });

  function showEnquiryError(msg) {
    if (!enquiryError) return;
    enquiryError.textContent = msg;
    enquiryError.hidden = false;
  }

  function validate() {
    if (!form) return false;
    $$('.field-error', form).forEach(function (f) { f.classList.remove('field-error'); });
    if (enquiryError) { enquiryError.hidden = true; enquiryError.textContent = ''; }
    var required = [['name', 'your name'], ['phone', 'a phone or WhatsApp number'], ['looking_for', 'what you are looking for']];
    var firstBad = null, msg = '';
    required.forEach(function (pair) {
      var el = form.elements[pair[0]];
      if (!el) return;
      if (!String(el.value).trim()) {
        var fld = el.closest('.field'); if (fld) fld.classList.add('field-error');
        if (!firstBad) { firstBad = el; msg = 'Please add ' + pair[1] + '.'; }
      }
    });
    var email = form.elements['email'];
    if (!firstBad && email && email.value.trim() && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.value.trim())) {
      var ef = email.closest('.field'); if (ef) ef.classList.add('field-error');
      firstBad = email; msg = 'That email looks off. Check it, or leave it blank.';
    }
    if (firstBad) { showEnquiryError(msg); firstBad.focus(); return false; }
    return true;
  }

  function setSubmitting(on) {
    if (!submitBtn) return;
    submitBtn.disabled = on;
    var lbl = submitBtn.querySelector('.submit-label');
    if (lbl) lbl.textContent = on ? 'Sending…' : 'Send my enquiry';
  }

  function showSuccess() {
    if (enquiryBody) enquiryBody.hidden = true;
    if (enquirySuccess) {
      enquirySuccess.hidden = false;
      // move focus to the confirmation heading so screen readers announce it
      var heading = enquirySuccess.querySelector('#successHeading') || enquirySuccess.querySelector('h2');
      if (heading && heading.focus) heading.focus();
    }
    setSubmitting(false);
    if (form) form.reset();
  }

  if (form) {
    form.addEventListener('submit', function (e) {
      e.preventDefault();
      // honeypot: bots fill the hidden field; silently accept and drop
      var hp = form.elements['company'];
      if (hp && hp.value) { showSuccess(); return; }
      if (!validate()) return;

      setSubmitting(true);
      var data = new FormData(form);
      data.append('page', location.href);
      data.append('submitted_at', new Date().toISOString());

      var done = function () { showSuccess(); };
      var fail = function () {
        setSubmitting(false);
        showEnquiryError('Could not send just now. Please WhatsApp us at +91 85719 09482 or email streetflowdance@gmail.com and we will sort it.');
      };

      if (CONFIG.SHEET_ENDPOINT) {
        fetch(CONFIG.SHEET_ENDPOINT, { method: 'POST', mode: 'no-cors', body: data }).then(done, fail);
      } else {
        // No backend wired yet: preview the success flow, warn the developer.
        if (window.console) console.warn('Street Flow: CONFIG.SHEET_ENDPOINT is empty, so this enquiry was not delivered. See BACKEND-SETUP.md.');
        setTimeout(done, 400);
      }
    });
  }

  /* ---------- Sticky CTA visibility ---------- */
  if (sticky) {
    window.addEventListener('scroll', function () { updateSticky(); }, { passive: true });
    window.addEventListener('resize', updateSticky);
  }

  /* ---------- Preloader + auto-intro ---------- */
  var preloader = $('#preloader');
  function maybeShowIntro() {
    if (!introEl || !intro) return;
    try {
      if (sessionStorage.getItem('sf_intro_seen')) { introDismissed = true; updateSticky(); return; }
      sessionStorage.setItem('sf_intro_seen', '1');
    } catch (e) { /* private mode: just show it */ }
    mountIntroMedia();   // film is ready (and already rolling) the moment the pop-up appears
    intro.open();
  }

  if (preloader) {
    var hidden = false;
    var hidePreloader = function () {
      if (hidden) return; hidden = true;
      preloader.classList.add('done');
      setTimeout(function () {
        preloader.style.display = 'none';
        preloaderDone = true;
        updateSticky();
        maybeShowIntro();
      }, prefersReduced ? 0 : 620);
    };
    window.addEventListener('load', function () { setTimeout(hidePreloader, prefersReduced ? 120 : 900); });
    setTimeout(hidePreloader, 3500); // safety net if 'load' is slow (e.g. blocked webfonts)
  } else {
    preloaderDone = true;
    updateSticky();
    maybeShowIntro();
  }
})();
