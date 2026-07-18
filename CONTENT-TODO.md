# CONTENT-TODO — Street Flow

Everything below is a **placeholder or unconfirmed fact** still standing in the shipped site.
Nothing here was invented or filled with plausible-sounding fiction — each item is waiting on real
input from the studio. Format for each item: **what it is → where it lives (line ref) → what to send me.**

Line references are against the split files as committed:
`index.html`, `script.js`, `styles.css`, plus `robots.txt` / `sitemap.xml`.

---

## 1. Real photos / reel thumbnails for the "Watch" grid  — REQUIRED

- **What it is:** The "See it live" grid is 8 tiles that are currently just **flame-gradient rectangles**
  with a category label (Dance Reels, Wedding, Teasers, Practices, Reviews, Events, Celeb Interactions,
  All Posts). There is **no real imagery** — every tile links to the Instagram profile.
- **Where it lives:**
  - Grid container: `index.html:186` (`<div class="watch-grid">`)
  - Tiles are generated in JS: `script.js:2` (`cats`) and `script.js:3` (`angles`) — the gradient is
    drawn at `script.js:14` (`<div class="bg" style="background:linear-gradient(...)">`).
- **What to send me:** 8 real cover images (reel thumbnails / stills), ideally portrait **3:4** to match
  the tile aspect ratio, plus (optional) the **direct Instagram permalink** for each so a tile can deep-link
  to that specific reel instead of the profile. Name them by category so I can map them 1:1.
  I'll swap the gradient `.bg` for real `<img>`s and keep the exact hover/reveal behavior.

## 2. Real testimonial quotes for a Reviews section  — REQUIRED

- **What it is:** There is **no Reviews section with actual quotes**. "Reviews" appears only as a word in
  the marquee (`index.html:115`) and as one gradient tile in the Watch grid (`script.js:2`), both of which
  just point at Instagram. No client is quoted anywhere.
- **Where it lives:** Would slot in as a new section between `#watch` (ends `index.html:189`) and the
  `#contact` CTA (`index.html:192`).
- **What to send me:** 3–6 **real** testimonial quotes, each with the person's name and context
  (e.g. "Sangeet 2025", "Corporate workshop", "Beginner batch"). Only real, attributable quotes — I will
  not write fake ones. Once you send them I'll build the section in the existing dark/gradient style.

## 3. Phone number / WhatsApp link for direct contact  — REQUIRED

- **What it is:** The only ways to reach the studio are the **Google Form** and an **Instagram DM**.
  There is no phone number or WhatsApp click-to-chat anywhere.
- **Where it lives:** Contact/CTA section `index.html:192`; current contact buttons at
  `index.html:198` (Google Form) and `index.html:199` (Instagram DM). Also referenced in the nav/hero
  "Enquire" buttons (`index.html:59`, `index.html:69`, `index.html:81`).
- **What to send me:** The phone number in international format (e.g. `+91 XXXXXXXXXX`). I'll add a
  `https://wa.me/91XXXXXXXXXX` WhatsApp button (and/or a `tel:` link) alongside the existing buttons —
  same button styling, opens in a new tab.

## 4. Confirm the stat numbers  — CONFIRM (currently presented as fact)

- **What it is:** Two hard numbers are shown as facts and **will drift over time**:
  `77` "Sessions & shows posted" and `400+` "Following the flow".
- **Where it lives:** `index.html:156` (`77`) and `index.html:160` (`400+`).
- **What to send me:** Confirm these are current, or give me updated figures. (If you'd rather not
  maintain them by hand, tell me and I can soften the copy so it doesn't go stale — e.g. drop the exact
  count — but I won't change a stated number without your say-so.)

## 5. Confirm the "EST." badge  — CONFIRM

- **What it is:** The spinning hero badge reads `PUNE · EST. FLOW` — there's **no founding year**, so
  "EST. FLOW" reads as a placeholder for "EST. <year>".
- **Where it lives:** `index.html:100`.
- **What to send me:** The year the studio started (e.g. `EST. 2022`) if you want a real year there, or
  confirm you want to keep the stylized "EST. FLOW" as-is on purpose.

## 6. Production domain  — REQUIRED before go-live

- **What it is:** The canonical URL, Open Graph / Twitter image URLs, `robots.txt`, and `sitemap.xml`
  all use a **placeholder domain** `https://streetflow.vercel.app`. Social share previews and the sitemap
  won't be correct until this is the real domain.
- **Where it lives:** `index.html:8` (canonical), `index.html:22` (og:url), `index.html:23` (og:image),
  `index.html:33` (twitter:image); `robots.txt:4`; `sitemap.xml:4`.
- **What to send me:** The final domain (custom domain like `streetflowdance.com`, or the exact Vercel
  URL). It's a one-shot find-and-replace across those 6 lines.

---

## Notes / lower-priority (flagging, not inventing)

- **OG image wordmark font (build note):** `og-image.png` reuses your dark background, flame gradient,
  logomark, and the real hero headline — but the "STREET FLOW" wordmark is set in **Space Grotesk**, not
  Clash Display, because Fontshare was unreachable from the build sandbox. It looks on-brand, but if you
  want the wordmark in the exact Clash Display face, say so and I'll regenerate it in an environment that
  can load Fontshare (or from a Clash Display file you provide).
- **Physical studio address / map (optional):** The site says "Pune" but lists no street address or
  Google Maps link. If you run a fixed studio and want walk-ins, send the address and I'll add it to the
  footer/contact area. Left out for now rather than guessed.
- **Email contact (optional):** No email is listed (only Form + Instagram + the pending phone/WhatsApp).
  Send one if you want it added.
