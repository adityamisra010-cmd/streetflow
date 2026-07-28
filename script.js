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
    YOUTUBE_URL: 'https://youtube.com/@streetflowdance',

    // Show each reel's real cover frame inside its "See it live" tile, using
    // Instagram's own embed cropped to hide their chrome. Costs nothing to set
    // up, but it does load one Instagram frame per visible tile.
    // Set to false to go back to the plain flame-gradient tiles.
    TILE_PREVIEWS: true,
    // Pixels of Instagram chrome (avatar + username bar) above the video in
    // their embed. Nudge this if the crop ever sits high or low.
    TILE_PREVIEW_HEADER: 54
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
    { label: 'Dance Reels', angle: 95,  ig: 'https://www.instagram.com/reel/DIOT0EiJPSJ/?igsh=d3o3NTd1c2N2aHN2',        href: PROFILE },
    { label: 'Wedding',     angle: 140, ig: 'https://www.instagram.com/reel/DZxX4EXtxZr/?igsh=MXJsMTlpdThrdmRyYg==',    href: PROFILE },
    { label: 'Teasers',     angle: 60,  ig: 'https://www.instagram.com/reel/DLEcJR3ooF7/?igsh=MXZnajdwcXY1aDZ4OQ==',    href: PROFILE },
    { label: 'Practices',   angle: 110, ig: 'https://www.Instagram.com/reel/DHtDPu2tgFQ/?igsh=enZobmY1bXFqM2pr',        href: PROFILE },
    { label: 'Events',      angle: 150, ig: 'https://www.instagram.com/reel/DUsuROUjVkD/?igsh=d2J3OGk4bzA4bWxn',        href: PROFILE },
    { label: 'All Posts',   angle: 120, ig: 'https://www.instagram.com/reel/DTsUyExCdJZ/?igsh=MTEzdGE1cXdwNmFkeg==',    href: PROFILE }
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

  /* Tile previews are a nice-to-have, so skip them when the visitor is on a
     metered or slow connection rather than spending their data on decoration. */
  function previewsAllowed() {
    var c = navigator.connection || navigator.mozConnection || navigator.webkitConnection;
    if (!c) return true;
    if (c.saveData) return false;
    return !/(^|-)(2g|slow-2g)$/.test(c.effectiveType || '');
  }

  /* Instagram's embed is a card: chrome on top, then the video, then a like bar.
     We scale it up and pull it into place so only the video fills the tile. */
  function fitTilePreview(box) {
    var frame = box.querySelector('iframe');
    if (!frame) return;
    var w = box.clientWidth, h = box.clientHeight;
    if (!w || !h) return;
    var IW = 400;                                   // css width we render the embed at
    var HEAD = CONFIG.TILE_PREVIEW_HEADER || 54;    // chrome above the video
    var MEDIA = IW * 16 / 9;                        // reels are 9:16
    var s = Math.max(w / IW, h / MEDIA);            // cover the tile
    frame.style.width = IW + 'px';
    frame.style.height = (HEAD + MEDIA + 90) + 'px';
    frame.style.transformOrigin = 'top left';
    frame.style.transform = 'scale(' + s + ')';
    frame.style.left = ((w - IW * s) / 2) + 'px';
    frame.style.top = ((h - MEDIA * s) / 2 - HEAD * s) + 'px';
  }

  function mountTilePreview(box) {
    if (box.dataset.mounted) return;
    box.dataset.mounted = '1';
    var frame = document.createElement('iframe');
    frame.src = box.getAttribute('data-embed');
    frame.setAttribute('scrolling', 'no');
    frame.setAttribute('frameborder', '0');
    frame.setAttribute('tabindex', '-1');           // never a focus stop, it is decoration
    frame.setAttribute('aria-hidden', 'true');
    frame.setAttribute('loading', 'lazy');
    frame.title = '';
    frame.addEventListener('load', function () {
      fitTilePreview(box);
      box.classList.add('is-ready');
      var card = box.closest('.watch-card');
      if (card) card.classList.add('has-cover');
    });
    box.appendChild(frame);
    fitTilePreview(box);
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

      // real cover frame from Instagram, cropped into the tile. The gradient
      // above stays underneath, so if Instagram never loads nothing looks broken.
      var wantsPreview = embed && CONFIG.TILE_PREVIEWS && !item.video && !item.poster && previewsAllowed();
      if (wantsPreview) media += '<span class="tile-embed" data-embed="' + embed + '"></span>';

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

    // mount each cover only as its tile approaches the viewport
    var previewBoxes = $$('.tile-embed', grid);
    if (previewBoxes.length) {
      var po = new IntersectionObserver(function (entries) {
        entries.forEach(function (e) {
          if (!e.isIntersecting) return;
          mountTilePreview(e.target);
          po.unobserve(e.target);
        });
      }, { rootMargin: '300px 0px' });
      previewBoxes.forEach(function (box) { po.observe(box); });

      var rTick;
      window.addEventListener('resize', function () {
        clearTimeout(rTick);
        rTick = setTimeout(function () { previewBoxes.forEach(fitTilePreview); }, 150);
      });
    }

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

  /* ---------- Scroll reveal ----------
     rootMargin lifts the trigger line above the fold so a section is already
     easing in as it enters, which reads as one continuous flow rather than a
     pop. `settled` drops the compositor hint once the element has arrived. */
  var io = new IntersectionObserver(function (entries) {
    entries.forEach(function (e) {
      if (!e.isIntersecting) return;
      var el = e.target;
      el.classList.add('in');
      io.unobserve(el);
      var delay = parseFloat(el.style.getPropertyValue('--d')) || 0;
      setTimeout(function () { el.classList.add('settled'); }, 1100 + delay);
    });
  }, { threshold: 0.12, rootMargin: '0px 0px -8% 0px' });
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

  /* ---------- Count-up animation (hero stats + proof in numbers) ---------- */
  function countUp(el, dur) {
    var target = +el.dataset.count, suffix = el.dataset.suffix || '';
    if (prefersReduced || !target) { el.textContent = target + suffix; return; }
    var t0 = performance.now();
    (function step(now) {
      var p = Math.min((now - t0) / dur, 1);
      var eased = 1 - Math.pow(1 - p, 3);
      el.textContent = Math.round(target * eased) + (p === 1 ? suffix : '');
      if (p < 1) requestAnimationFrame(step); else el.textContent = target + suffix;
    })(performance.now());
  }

  // fires once, when the block scrolls into view
  function countOnView(sel, numSel, dur) {
    var sec = $(sel);
    if (!sec) return;
    var done = false;
    var ob = new IntersectionObserver(function (entries) {
      entries.forEach(function (e) {
        if (!e.isIntersecting || done) return;
        done = true;
        $$(numSel, sec).forEach(function (el) { countUp(el, dur); });
        ob.disconnect();
      });
    }, { threshold: 0.3 });
    ob.observe(sec);
  }

  countOnView('#proof', '.achieve-stat .num', 1200);

  // hero stats are above the fold: run them just after the entrance animation
  (function () {
    var hero = $('#heroStats');
    if (!hero) return;
    var nums = $$('.hero-num', hero);
    if (prefersReduced) { nums.forEach(function (el) { countUp(el, 0); }); return; }
    nums.forEach(function (el, i) {
      setTimeout(function () { countUp(el, 1100); }, 320 + i * 110);
    });
  })();

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
    var required = [
      ['name', 'your name'],
      ['phone', 'your phone number'],
      ['email', 'your email'],
      ['age', 'your age'],
      ['location', 'your location'],
      ['looking_for', 'what you are looking for']
    ];
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
    if (!firstBad && email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.value.trim())) {
      var ef = email.closest('.field'); if (ef) ef.classList.add('field-error');
      firstBad = email; msg = 'That email looks off. Please check it.';
    }
    var age = form.elements['age'];
    if (!firstBad && age && age.value.trim()) {
      var n = Number(age.value);
      if (!isFinite(n) || n < 3 || n > 99) {
        var af = age.closest('.field'); if (af) af.classList.add('field-error');
        firstBad = age; msg = 'Please enter an age between 3 and 99.';
      }
    }
    var phone = form.elements['phone'];
    if (!firstBad && phone && String(phone.value).replace(/\D/g, '').length < 6) {
      var pf = phone.closest('.field'); if (pf) pf.classList.add('field-error');
      firstBad = phone; msg = 'That phone number looks too short. Please check it.';
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

  // success screen: close the dialog and return the visitor to the top of the site
  var successHome = $('.success-home');
  if (successHome) {
    successHome.addEventListener('click', function () {
      if (enquiry) enquiry.close();
      if (history.replaceState) history.replaceState(null, '', '#home');
      window.scrollTo({ top: 0, behavior: prefersReduced ? 'auto' : 'smooth' });
    });
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
      // store one dialable number, so the sheet keeps working unchanged
      var ccEl = form.elements['country_code'];
      var phoneEl = form.elements['phone'];
      if (ccEl && phoneEl) {
        var national = String(phoneEl.value).trim().replace(/^\+?0+/, '');
        data.set('phone', ccEl.value + ' ' + national);
      }
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

  /* =====================================================================
     AMBIENT CURSOR FLOW
     A ribbon of light trails the pointer, like the motion-blur streak a
     dancer leaves behind, drawn in the brand's flame gradient. Sparks peel
     off on fast movement. Desktop pointers only, and it idles down to zero
     cost when the pointer stops or the tab is hidden.
     ===================================================================== */
  (function () {
    var canvas = $('#cursorFx');
    if (!canvas || prefersReduced) return;
    // fine pointer only: no trail on touch, where there is no cursor to follow
    if (!window.matchMedia('(hover:hover) and (pointer:fine)').matches) return;

    var ctx = canvas.getContext('2d', { alpha: true });
    if (!ctx) return;

    var dpr = Math.min(window.devicePixelRatio || 1, 2);
    var w = 0, h = 0;
    function resize() {
      w = window.innerWidth; h = window.innerHeight;
      canvas.width = Math.round(w * dpr);
      canvas.height = Math.round(h * dpr);
      canvas.style.width = w + 'px';
      canvas.style.height = h + 'px';
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    }
    resize();
    window.addEventListener('resize', resize);

    var TRAIL = 26;
    var pts = [];                 // smoothed trail, newest first
    var sparks = [];
    var mx = -999, my = -999;     // raw pointer
    var sx = -999, sy = -999;     // spring-followed pointer
    var seen = false, idle = 0, raf = null, hidden = false;

    function onMove(e) {
      mx = e.clientX; my = e.clientY;
      if (!seen) {                // first sighting: start the trail where the cursor is
        seen = true; sx = mx; sy = my;
        for (var i = 0; i < TRAIL; i++) pts.push({ x: mx, y: my });
        canvas.classList.add('is-live');
        start();
      }
      idle = 0;
      start();
    }
    window.addEventListener('pointermove', onMove, { passive: true });
    window.addEventListener('pointerdown', function (e) {
      onMove(e);
      // a click blooms a few sparks
      for (var i = 0; i < 10; i++) {
        var a = (Math.PI * 2 * i) / 10;
        sparks.push({ x: mx, y: my, vx: Math.cos(a) * 2.4, vy: Math.sin(a) * 2.4, life: 1, hue: i / 10 });
      }
      start();
    }, { passive: true });

    document.addEventListener('visibilitychange', function () {
      hidden = document.hidden;
      if (!hidden) start();
    });

    var STOPS = ['#ec3f73', '#f4a93b', '#ffd866'];
    function mixStop(t) {                 // t in 0..1 across the flame gradient
      var i = Math.min(STOPS.length - 1, Math.max(0, Math.floor(t * (STOPS.length - 1))));
      return STOPS[i];
    }

    function frame() {
      raf = null;
      if (hidden) return;

      // spring the follower toward the pointer, then push the trail along
      sx += (mx - sx) * 0.22;
      sy += (my - sy) * 0.22;
      pts.unshift({ x: sx, y: sy });
      if (pts.length > TRAIL) pts.pop();

      ctx.clearRect(0, 0, w, h);

      // the ribbon: tapered, additive, drawn as overlapping segments
      ctx.globalCompositeOperation = 'lighter';
      ctx.lineCap = 'round';
      ctx.lineJoin = 'round';
      for (var i = pts.length - 1; i > 0; i--) {
        var t = i / pts.length;               // 0 at head, 1 at tail
        var a = pts[i], b = pts[i - 1];
        ctx.strokeStyle = mixStop(t);
        ctx.globalAlpha = (1 - t) * 0.40;
        ctx.lineWidth = (1 - t) * 16 + 1;
        ctx.beginPath();
        ctx.moveTo(a.x, a.y);
        ctx.lineTo(b.x, b.y);
        ctx.stroke();
      }

      // a soft core glow at the head
      var head = pts[0];
      var g = ctx.createRadialGradient(head.x, head.y, 0, head.x, head.y, 40);
      g.addColorStop(0, 'rgba(255,216,102,0.38)');
      g.addColorStop(0.5, 'rgba(236,63,115,0.17)');
      g.addColorStop(1, 'rgba(236,63,115,0)');
      ctx.globalAlpha = 1;
      ctx.fillStyle = g;
      ctx.beginPath();
      ctx.arc(head.x, head.y, 40, 0, Math.PI * 2);
      ctx.fill();

      // speed sheds sparks
      var speed = Math.hypot(mx - sx, my - sy);
      if (speed > 9 && sparks.length < 70) {
        sparks.push({
          x: head.x, y: head.y,
          vx: (Math.random() - 0.5) * 2.2 + (mx - sx) * 0.05,
          vy: (Math.random() - 0.5) * 2.2 + (my - sy) * 0.05,
          life: 1, hue: Math.random()
        });
      }
      for (var s = sparks.length - 1; s >= 0; s--) {
        var p = sparks[s];
        p.x += p.vx; p.y += p.vy;
        p.vx *= 0.95; p.vy = p.vy * 0.95 + 0.035;   // drag + a little gravity
        p.life -= 0.022;
        if (p.life <= 0) { sparks.splice(s, 1); continue; }
        ctx.globalAlpha = p.life * 0.65;
        ctx.fillStyle = mixStop(p.hue);
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.life * 2.4, 0, Math.PI * 2);
        ctx.fill();
      }

      ctx.globalAlpha = 1;
      ctx.globalCompositeOperation = 'source-over';

      // keep animating while there is anything left to settle, then sleep
      idle++;
      var moving = speed > 0.4 || sparks.length > 0 || idle < 70;
      if (moving) start();
      else { ctx.clearRect(0, 0, w, h); }
    }

    function start() { if (raf === null && !hidden) raf = requestAnimationFrame(frame); }
  })();

  /* ---------- Footer year ---------- */
  (function () {
    var y = $('#footerYear');
    if (y) y.textContent = String(new Date().getFullYear());
  })();

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
