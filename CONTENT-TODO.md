# CONTENT-TODO — Street Flow

Everything below is a **placeholder or unconfirmed fact** still standing in the site.
Nothing here was invented — each item waits on real input from the studio. Format for each:
**what it is → where it lives (line ref) → what to send me.**

Line references are against the current split files: `index.html`, `styles.css`, `script.js`,
plus `robots.txt` / `sitemap.xml`.

---

## 1. The real logo — DONE ✅

- You uploaded `Logos-…zip` straight to the repo (commit `8f31b91`). I unpacked it, extracted just the
  **dancer icon** (dropping the baked-in wordmark, since the site sets "STREET FLOW" in Clash Display),
  keyed the background to transparent, and wired it in everywhere: the **animated preloader** (the icon
  rises in the flame gradient on load), the **nav + footer marks**, all **favicons** (`favicon.svg/.ico`,
  `apple-touch-icon.png`, `android-chrome-192/512.png`), and the **og-image.png**. Derived asset is
  `logo-mark.png` (white silhouette, transparent).
- I removed the 2.6 MB source zip from the web root so it isn't served as a public download — it's still
  in git history at `8f31b91` if you ever need the originals.
- If you'd rather I use a *vector* (SVG) master for even crisper icons at tiny sizes, send the SVG and
  I'll regenerate from it — but the current raster extraction already looks clean at every size.

## 2. Intro film for the landing modal  — REQUIRED

- **What it is:** A dismissible modal auto-opens on landing (once per session) with a placeholder poster
  reading "Intro film — coming soon."
- **Where it lives:** poster block `index.html:71` (see comment at `index.html:70`); play handler
  `script.js:250`.
- **What to send me:** the intro video file (MP4) to self-host, **or** a YouTube/Vimeo link to embed.
  I'll drop it into the modal's 16:9 stage and wire the play button. (Say the word if you'd rather it
  show every visit instead of once per session — one-line change.)

## 3. Founder photos  — REQUIRED

- **What it is:** Anuj's and Anuja's cards use flame-tinted initials tiles ("AC" / "AV") as photo
  placeholders.
- **Where it lives:** `index.html:268` (Anuj), `index.html:285` (Anuja).
- **What to send me:** one real photo each, ideally **portrait 4:5**. I'll swap them into the cards,
  keeping the rounded frame and the scroll/carousel treatment.

## 4. Email + phone / WhatsApp  — REQUIRED

- **What it is:** Contact still runs through the Google Form + Instagram DM; the email and phone rows read
  "coming soon."
- **Where it lives:** `index.html:346` (Email), `index.html:347` (Phone / WhatsApp).
- **What to send me:** the email address and phone number (international format). I'll turn them into live
  `mailto:` / `tel:` / `https://wa.me/…` links in the same style.

## 5. YouTube channel URL  — REQUIRED

- **What it is:** A YouTube icon is in the footer but its link is a placeholder (`href="#"`, labelled
  "link coming soon").
- **Where it lives:** `index.html:369`.
- **What to send me:** the channel URL. One-line swap.

## 6. Watch grid — real reels + highlight links  — REQUIRED (you said you'll add videos directly, so low urgency)

- **What it is:** The 8 "See it live" tiles are flame-gradient placeholders; every tile currently links to
  the Instagram **profile**, not a specific highlight/reel.
- **Where it lives:** tile data `script.js:11–19` (the `WATCH` array); link assignment `script.js:25`
  (`// TODO: point each at its specific Instagram highlight/reel`).
- **What to send me (when ready):** the direct Instagram highlight/reel permalink per tile, and/or real
  cover images (portrait 3:4). I'll swap the gradients for `<img>`s and point each tile at its own link.

## 7. Production domain  — REQUIRED before go-live

- **What it is:** Canonical / Open Graph / Twitter / `robots.txt` / `sitemap.xml` all use the placeholder
  `https://streetflow.vercel.app`. Share previews and the sitemap won't be correct until this is real.
- **Where it lives:** `index.html:8, 22, 23, 33`; `robots.txt:4`; `sitemap.xml:4`.
- **What to send me:** the final domain — one find-and-replace across those 6 lines.

---

## Notes / lower-priority (flagged, not invented)

- **Reviews / testimonials:** still no section with real quotes (only the "Reviews" label in the marquee /
  Watch tiles). Send 3–6 real, attributable quotes and I'll build a section in the dark/gradient style.
- **OG image wordmark:** the share image reuses your dark bg, flame gradient, logomark, and the real hero
  copy, but the "STREET FLOW" wordmark is set in **Space Grotesk** (Fontshare/Clash Display is unreachable
  from the build sandbox). I'll regenerate it in the exact face on request or once you send the logo file.
- **Physical address / map (optional):** the site says "Pune" but lists no street address. Send it if you
  want walk-ins; left out rather than guessed.
