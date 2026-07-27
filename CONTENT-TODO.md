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

## 4. Watch / "See it live" - just paste your Instagram links

**Nothing to download or re-upload.** Open `script.js`, find the `WATCH` list near the top, and paste each
section's Instagram link into its `ig: ''`. That is the whole job.

```js
{ label: 'Dance Reels', angle: 95, ig: 'https://www.instagram.com/reel/XXXXXXXXX/', href: PROFILE },
```

What happens depends on the kind of link, automatically:

| Link you paste | What the visitor gets |
|---|---|
| A **post** or **reel** (`instagram.com/p/...` or `/reel/...`) | Tile shows a play badge and says "Watch here". Clicking **plays the video inside your website** in a pop-up player, with "Open on Instagram" and "Book your first session" underneath. |
| A **Highlight** (`instagram.com/stories/highlights/...`) or a profile link | Tile says "View on Instagram" and opens Instagram in a new tab. |

**Important:** Instagram does **not** allow Story Highlights to be embedded anywhere, by anyone. Only
permanent posts and reels can play on-site. So if a section of yours is a Highlight, either paste the link
anyway (it will open Instagram, which is the best available behaviour) or give me the link to one strong
**reel** that represents that section and it will play on the site instead.

Two more things worth knowing:

- The post must be **public** for the on-site player to work.
- The Instagram player is Instagram's own white card, and it needs one click to start (Instagram blocks
  autoplay for embeds). If you ever want a fully seamless, autoplaying, on-brand tile, that is the one case
  where a self-hosted file wins: send me a 5-10s MP4 and I will set `video:` on that tile. Totally optional,
  the embed route needs zero files from you.

Optional per tile: `poster: 'cover.jpg'` for a custom cover image, `video: 'teaser.mp4'` for a looping
teaser on the tile face. With neither, the on-brand flame gradient shows, which already looks good.

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
