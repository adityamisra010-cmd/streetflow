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

## 5. Founder photos - DONE

Both cards now show the real photos you sent (see "Photos and hero pass" below). The "AC" / "AV" initials
stay underneath and only appear if a photo ever fails to load.

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
- The scrolling white band listed your 17 services alphabetically. It now carries your album photos
  instead (see "Photos and hero pass" below).
- Both founders have a clickable **Instagram** button under their photo, matching in placement and style.

---

## Structure, nav and theming pass (this round)

**Section order** is now: hero (Pune, India) → See It Live → What We Do → What We Teach → Since 2024 →
Loved By Dancers → About Us → Meet the Founders → Let's Move. "Meet the Founders" was split out of the
About section into its own `#founders` section so the nav can link straight to it; the two still read as one
continuous block, exactly as before.

**Nav** now carries eight items in section order: Watch, Services, Styles, Proof, Reviews, About, Founders,
Contact. Shortened where a full title would crowd the bar; "Proof" maps to the "Proof, in numbers." section
that carries the "Since 2024" eyebrow. Verified that all eight resolve to a real section, scroll smoothly,
and land clear of the fixed header, at 821, 900, 1024, 1200 and 1440 px.

**Footer symbol** scaled up from ~54px to ~86px tall, so it reads as the anchor of the footer against the
wordmark rather than a small mark above it.

**Enquiry form** is now white: black headings, labels, inputs and placeholders, with the brand orange as the
accent on the eyebrow, focus rings and borders. Two accent values were deepened so they clear WCAG AA on
white (the raw brand orange only reaches 3.7:1 as small text and under 3:1 as a border). Measured contrast:
headings and labels 19.7:1, body 9.3:1, eyebrow 4.7:1, fineprint 5.6:1, errors 6.9:1. The success screen's
white button was inverted to dark so it stays visible.

### One thing I did not change, and why

The brief asked to lift the Email / Phone / WhatsApp text in **Let's Move** for contrast "against the black
background". That section sits on the **cream panel** (`#ede7d8`), not black, and the values already measured
**15.95:1** against it, which is far above the 4.5:1 standard. Making them light enough for black would have
rendered them close to invisible there, so instead I raised the small mono labels (EMAIL / PHONE / WHATSAPP)
from grey to the same near-black, taking them from 5.74:1 to 15.95:1. Nothing else in that section moved.

If it genuinely looks black on your device, the likely cause is a phone browser's "force dark" mode
re-darkening the cream panel. The page now declares `color-scheme: dark`, which tells those browsers not to
re-theme it. Send a screenshot if it persists.

---

## Photos and hero pass (this round)

**The See It Live grid is unchanged.** It is exactly as it was before the photos arrived: six tall tiles with
their names ("Dance Reels", "Wedding", ...), "Watch here", the reel cover previews and the on-site player.

**The moving band is now a photo strip.** The cream band under the hero used to scroll the 17 service names.
It now scrolls all 11 album photos instead, with no text on it:

- Each photo keeps its own shape (8 wide, 3 tall) at one even height, with rounded corners and even gaps.
- The strip loops seamlessly and pauses while the pointer is over it. Visitors who have "reduce motion"
  switched on see it still.
- To add, remove or reorder photos, edit the `marquee-band` block in `index.html`. The set is written twice
  (so the loop has no seam); keep both copies identical.

**The hero shows the Street Flow dancer.** The abstract flame squiggle in the hero (there since the first
version of the site) is replaced by the logo character itself, traced from the logo into a crisp vector so it
stays sharp on any screen. It rises into view as the loading screen lifts, then dances on a loop: the body
sways from the tip of the foot with a small dip on every beat, the head nods a moment behind, the flame
gradient drifts through the figure, and a warm glow on the floor swells on each dip. It rests while the hero
is scrolled away and stays still for "reduce motion". The gradient dot that sat over the old squiggle now sits
at the centre of the spinning "PUNE" ring.

**How the photos were prepared.** 13 originals (30.7 MB of HEIC, PNG and JPEG) became web files totalling
4.8 MB in `images/`. The browser downloads only the size that fits the screen. Each photo was:

- **Colour-converted** from the iPhone's Display P3 to standard sRGB, so colours look the same in every
  browser instead of going flat or oversaturated.
- **Stripped of all metadata.** 8 of the 13 photos (7 album shots and Anuja's portrait) carried **GPS
  coordinates** of where they were taken, plus camera and phone details. None of that ships to the website.
- **Resized** with a high-quality filter and a light sharpen, then saved as WebP at three widths plus one
  JPEG for very old browsers.
- **Cropped where needed.** Anuj's photo was a phone screenshot, so the home-bar strip at the bottom is cut
  off. Anuja's was a wide travel shot where she was small in the frame, so it is cropped head to mid-thigh.
  The night garba album shot is zoomed in on the group, and the Independence Day shot drops a head that
  was blocking the foreground.

