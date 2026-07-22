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

- **What it is:** A dismissible pop-up opens once per session with a play button and a 3-button pyramid
  (Enquire on top, Instagram + YouTube below).
- **What to send me / do:** an MP4 to self-host (set `CONFIG.INTRO_VIDEO_SRC = 'intro.mp4'`) **or** a YouTube
  id (set `CONFIG.INTRO_VIDEO_YT = 'xxxx'`). The play button then plays it. No file? It shows a tasteful
  "coming soon" placeholder.

## 3. Logo-as-video on arrival - optional

- **What it is:** The header logo can become a short looping muted video when someone lands.
- **What to send me / do:** a small looping MP4 (transparent or on-brand background), then set
  `CONFIG.LOGO_VIDEO_SRC = 'logo-motion.mp4'`. Poster falls back to the current `logo-mark.png`, so it never
  looks broken.

## 4. Watch / "See it live" teasers - low urgency

- **What it is:** The tiles support a short **teaser video loop** OR a **cover image**, and each links to the
  full post. Right now they're flame-gradient placeholders linking to the Instagram profile, plus buttons to
  Instagram and YouTube below the grid.
- **Recommended approach (my pick):** upload short 5-10s **teasers** (muted, looping) to the site and link
  each tile to the full reel on Instagram/YouTube. Motion pulls the eye far better than a static image, the
  page stays light, and the full videos still drive follows/subscribers where the algorithm rewards them.
- **What to send me:** per tile, a short MP4 teaser (or a cover image, portrait 3:4) and the direct
  reel/highlight link. I'll drop them into the `WATCH` array in `script.js`.

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
