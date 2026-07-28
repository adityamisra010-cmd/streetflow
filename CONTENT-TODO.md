# CONTENT-TODO - Street Flow

What still needs real input from the studio. Everything else in this redesign is built and working.
Format for each: **what it is, where it lives, what to send me.**

Line references are approximate (against `index.html`, `styles.css`, `script.js`).

---

## Set these in one place: `script.js` → `CONFIG` (top of file)

The whole site is wired to a single config block. Fill these in and the features light up:

| Key | What it turns on | Status |
|---|---|---|
| `SHEET_ENDPOINT` | Sends the Enquiry form to your Google Sheet | **Needed** - see `BACKEND-SETUP.md` |
| `INTRO_VIDEO_SRC` or `INTRO_VIDEO_YT` | The film inside the welcome pop-up | **Needed** |
| `LOGO_VIDEO_SRC` | Replaces the header logo with a looping video on arrival | Optional |
| `INSTAGRAM_URL` / `YOUTUBE_URL` | Social links across the site | **Done** (set to your handles) |

---

## 1. Enquiry backend (Google Sheets) - action needed

- **What it is:** The Enquire button no longer goes to a Google Form. It opens a form **inside the site**
  (name, phone/WhatsApp, email, age, location, what they're looking for, number of sessions, message) and
  posts straight to your Google Sheet.
- **What to do:** Follow `BACKEND-SETUP.md` (5 minutes), then paste the URL into `CONFIG.SHEET_ENDPOINT`.
  Until then the form still works for demos and just warns in the browser console that nothing was delivered.

## 2. Intro film for the welcome pop-up - action needed

A dismissible pop-up opens once per session, with the film on top and the 3-button pyramid below
(Enquire, then Instagram + YouTube). Pick **one** of these three in `script.js` -> `CONFIG`:

| Option | Set this | What visitors get |
|---|---|---|
| **Best: a real file** | `INTRO_VIDEO_SRC: 'intro.mp4'` | Starts **playing by itself** the instant the pop-up opens, muted and looping, filling the frame edge to edge in your dark theme. A "Tap for sound" button turns audio on. |
| **Good: YouTube** | `INTRO_VIDEO_YT: 'VIDEO_ID'` | Also **autoplays** (muted). Free hosting, nothing on your server. An unlisted video works fine. |
| **OK: Instagram** | `INTRO_VIDEO_IG: 'https://instagram.com/reel/XXXX/'` | Zero uploading, but it **cannot autoplay** (Instagram blocks it), the visitor must press play, and it shows Instagram's white card in portrait rather than your branding. |

**My recommendation:** for the *watch grid*, Instagram links are perfect. For *this* pop-up, they are the
weakest of the three, because this is the first three seconds of your brand and Instagram embeds cannot
autoplay or be styled. A single `intro.mp4` uploaded once gives a dramatically stronger first impression.
If you would rather not host a file, put the intro on your YouTube channel as unlisted and use
`INTRO_VIDEO_YT`, which still autoplays.

Optional: `INTRO_POSTER: 'intro-still.jpg'` sets the still frame shown for the split second before playback.
No film configured at all? The pop-up shows a tasteful "coming soon" placeholder, so nothing looks broken.

## 3. Logo-as-video on arrival - optional

- **What it is:** The header logo can become a short looping muted video when someone lands.
- **What to send me / do:** a small looping MP4 (transparent or on-brand background), then set
  `CONFIG.LOGO_VIDEO_SRC = 'logo-motion.mp4'`. Poster falls back to the current `logo-mark.png`, so it never
  looks broken.
- **Note:** this one has to be a real file. An Instagram link cannot work here, because an embed brings
  Instagram's whole card (avatar, username, like count) with it, which cannot be shrunk into a logo. Same
  applies to the loading screen.

## 4. Watch / "See it live" - DONE, your 6 reels are wired in

All six tiles now point at the reels you sent, and every one of them is an embeddable reel, so each tile
shows a play badge, says **"Watch here"**, and plays **inside the website** in a pop-up player.

| Tile | Reel |
|---|---|
| Dance Reels | `reel/DIOT0EiJPSJ` |
| Wedding | `reel/DZxX4EXtxZr` |
| Teasers | `reel/DLEcJR3ooF7` |
| Practices | `reel/DHtDPu2tgFQ` |
| Events | `reel/DUsuROUjVkD` |
| All Posts | `reel/DTsUyExCdJZ` |

**Tile previews are on.** Each tile now shows the reel's own cover frame, pulled from Instagram's embed and
cropped so their avatar bar and like bar sit outside the tile. Nothing to upload. Two things to know:

- It loads one Instagram frame per tile, but only once that tile is about to scroll into view, and it is
  skipped entirely on metered or 2G connections. Clicks still open the on-site player, and the flame gradient
  stays underneath so nothing looks broken while it loads.
- If a visitor's network blocks Instagram, that tile will render blank-ish instead of the gradient. If you
  would rather not take that trade, set `TILE_PREVIEWS: false` in `script.js` -> `CONFIG` and the tiles go
  back to the clean gradient look.
- If the crop ever sits slightly high or low, nudge `TILE_PREVIEW_HEADER` (currently `54`) in the same block.
  That is the height of Instagram's chrome above the video.

### Some reels will not play on the site, and that is Instagram's call

If a tile sends you to Instagram instead of playing, the site is not at fault: all six links are parsed and
wired identically. Instagram refuses to embed certain reels, most often ones using licensed music, and its
own player then bounces the viewer to instagram.com.

**To find out which ones:** open `embed-check.html` (in this repo, not linked from the site) in a browser.
It loads all six exactly as the site does. Press play in each, mark it Plays or Blocked, and send me the
summary it prints. For every blocked reel I will either:

- swap in a replacement reel that does embed, or
- move that tile to a clean "View on Instagram" link, so it behaves consistently instead of opening a player
  that cannot play. (That is a two-word change per tile: clear its `ig:` and put the link in `href:`.)

**The only way to get all six playing reliably on the site** is to not depend on Instagram: send me a short
MP4 per reel and I will set `video:` on those tiles. Then they play inline, loop silently on the tile face,
and no third party can block them.

**Want a guaranteed-quality preview instead?** Send me either a screenshot per reel (portrait 3:4) or a
5-10s muted MP4 per reel. I will set `poster:` or `video:` on the tiles, which is faster than the embed,
fully on-brand, needs no third party, and in the MP4 case actually loops silently on the tile face. That is
the strongest version of this section, and it overrides the embed preview automatically.

## 5. Founder photos - action needed

- **What it is:** Anuj's and Anuja's cards use flame-tinted initials ("AC" / "AV") as photo placeholders.
- **Where:** `index.html` founder cards.
- **What to send me:** one real photo each, portrait 4:5.

## 6. Real testimonials - action needed (placeholder is live)

- **What it is:** A new **Reviews** section is in place with three dashed placeholder cards (and a nav link).
- **What to send me:** 3-6 real quotes with a first name + context (e.g. "Dance Class · Pune", "Wedding
  Choreography"). Screenshots of Instagram/Google reviews work too; I'll format them to match.

## 7. Production domain - before go-live

- **What it is:** Canonical / Open Graph / Twitter / `robots.txt` / `sitemap.xml` still use the placeholder
  `https://streetflow.vercel.app`.
- **What to send me:** the final domain - one find-and-replace.

---

## Done in this pass ✅

- Removed **all em dashes** across the site copy.
- **Enquiry form moved on-site** (no more Google Form redirect); posts to Google Sheets; spam honeypot;
  graceful failure fallback to WhatsApp/email.
- **Neuromarketing layer** (honest, no dark patterns): social-proof stats, low-friction micro-commitment,
  small-batch scarcity, reassurance microcopy, warm success screen.
- **Enquire removed from the top nav**, added as a **sticky button (bottom-right)** with an attention pulse.
- **Intro pop-up** rebuilt: video-ready stage + **3-button pyramid** (Enquire / Instagram / YouTube).
- **Dance Styles** now has an italic "…and many more" chip (matching Fitness); tightened the gap under the
  short Fitness panel.
- **Live contact:** email `streetflowdance@gmail.com`, phone `+91 85719 09482`, WhatsApp `wa.me/918571909482`.
- **YouTube** button now links to `youtube.com/@streetflowdance` (footer + pyramid).
- **Instagram videos play on the site.** Paste a post/reel link into a tile's `ig:` and it opens in an on-site
  player, no downloading or re-uploading. Highlights and profile links fall back to opening Instagram. The
  player loads only when a tile is clicked, so the page stays fast and sets no Instagram cookies otherwise.

---

## Layout & motion pass (this round)

- **Fluid scaling everywhere.** A single token block at the top of `styles.css` drives every size with
  `clamp()`, so type, spacing, radii and the container width interpolate with the viewport. Verified with no
  horizontal overflow at 320, 390, 430, 768, 1024, 1280, 1440, 1920, 2560 and 3840 px. Above 2000px the
  ceilings lift again so a 4K panel does not render laptop-sized text.
- **Icons audited.** `favicon.ico` (16/32/48), `apple-touch-icon` (180), `android-chrome` (192 / 512) and
  `og-image` (1200x630) all match what the markup and manifest declare. `logo-mark.png` is 291x596; the nav
  and footer now declare those true intrinsic dimensions so the logo no longer causes a layout shift.
- **Scroll flow.** Reveals animate only opacity and transform (compositor-friendly), trigger slightly before
  entering the viewport so sections ease in continuously, and release their `will-change` once settled.
  Anchor links now clear the fixed header via `scroll-padding-top`.
- **Ambient cursor flow.** A canvas ribbon in the brand gradient trails the pointer with spring physics and
  sheds sparks on fast movement. Desktop pointers only; it is skipped entirely on touch and for
  `prefers-reduced-motion`, sleeps when the pointer stops, and pauses when the tab is hidden.
- **Hero reordered** to headline, then the four animated numbers, then the paragraph, then the buttons. The
  "Takes 20 seconds" line is gone. Numbers count up on load; the Proof section counts up on scroll.
- **Founders sit side by side**, and **Proof in numbers is its own section** with the irrelevant tag buttons
  removed.
- **Mobile mirrors desktop**: the four hero stats stay on one row, services stay two-up, the watch grid stays
  multi-column, and founder cards keep photo-beside-text. Things only stack where a column would get too
  narrow to read.

---

## Enquiry form changes (this round)

- Removed the promotional strip (700+ dancers / 25+ weddings / limited slots) from the top of the form.
- **Phone** is now a **country code dropdown plus a number field**, labelled "Phone Number (with Country
  Code)". 62 countries, India selected by default. The two are joined into one dialable number before it
  reaches your Sheet, so the `phone` column keeps the same shape (e.g. `+44 7911 123456`). A leading zero is
  stripped automatically, since it is not used in international format.
- **Email, Age and Location are now required**, alongside Name, Phone and "What are you looking for".
  Email format and a 3 to 99 age range are checked, and a number shorter than 6 digits is rejected.
- Removed the **"How many sessions?"** question. Your Apps Script is untouched, so it keeps working as is;
  the `sessions` column will simply sit empty from now on. If you want that column gone, delete `'sessions'`
  from the `FIELDS` array in `google-apps-script.gs` and redeploy.
- After submitting, the message reads "**to book your slot**", and the button is now
  "**Go Back to Home Screen**", which closes the form and returns the visitor to the top of the site.

## Other content updates

- Hero paragraph now reads "at the comfort of your doorstep in Pune or live online anywhere in the world".
- Fitness Sessions is alphabetical and gained **Body Weight Exercises** and **Weight Training** (12 total,
  and the tab counter was updated to match).
- The scrolling white band now lists your 17 services alphabetically. Its animation duration was raised from
  32s to 78s so the longer list scrolls at the same calm speed as before.
- Both founders have a clickable **Instagram** button under their photo, matching in placement and style.
