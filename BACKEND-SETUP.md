# Street Flow - connecting the Enquiry form to Google Sheets

The site is fully static (host it anywhere: your own server, Netlify, Vercel, GitHub Pages, a VPS). The
"Enquire" form lives **inside the website** now, no Google Form redirect. When someone submits, the browser
sends the details to a tiny Google Apps Script, which writes a row into your Google Sheet and (optionally)
emails you. No paid service, no plugin.

You do this **once**, in about 5 minutes.

---

## Step 1 - Make the Sheet

1. Go to <https://sheets.new> and create a blank spreadsheet. Name it e.g. *Street Flow Enquiries*.
2. Leave the first tab named **Sheet1** (or rename it, but then change `SHEET_NAME` in the script).

## Step 2 - Add the script

1. In that sheet: **Extensions → Apps Script**.
2. Delete whatever sample code is there.
3. Open `google-apps-script.gs` from this repo, copy **everything**, paste it in.
4. (Optional) At the top, set `NOTIFY_EMAIL = 'streetflowdance@gmail.com'` to get an email on every enquiry.
5. Click the **Save** icon.

## Step 3 - Deploy it as a Web App

1. Click **Deploy → New deployment**.
2. Click the gear next to "Select type" → **Web app**.
3. Fill in:
   - **Description:** Street Flow enquiries
   - **Execute as:** **Me**
   - **Who has access:** **Anyone**
4. Click **Deploy**. Google will ask you to authorise, allow it (it's your own script).
5. Copy the **Web app URL**. It ends in `/exec` and looks like:
   `https://script.google.com/macros/s/AKfycb....../exec`

## Step 4 - Tell the website about it

1. Open `script.js`.
2. Near the top, in the `CONFIG` block, paste the URL:
   ```js
   SHEET_ENDPOINT: 'https://script.google.com/macros/s/AKfycb....../exec',
   ```
3. Save, re-upload the site. Done - submit a test enquiry and watch the row appear in your Sheet.

---

## Notes

- **Whenever you edit `google-apps-script.gs`**, re-deploy: *Manage deployments → (edit / pencil) → Deploy*.
  Using the same deployment keeps the same URL.
- The form fields written to the sheet, in order: `submitted_at, name, phone, email, age, location,
  looking_for, sessions, message, page`. Add or reorder columns by editing the `FIELDS` array in the script
  (and the header row regenerates on the next empty sheet).
- **Spam:** the form ships a hidden "honeypot" field. Real people never see it; bots that fill it are
  silently dropped, both in the browser and again in the script.
- **Privacy:** requests go straight from the visitor's browser to *your* Google account. Nothing passes
  through any third party.
- **If a submit ever fails** (visitor offline, script mis-deployed), the form shows a fallback message asking
  them to WhatsApp/email you, so you never lose the lead.

## Why not read the response back?

Google Apps Script web apps don't send CORS headers, so the browser can't *read* the reply cross-origin. We
post with `mode: 'no-cors'` (write-only) and show the success screen optimistically - which is the standard,
reliable pattern for a static site talking to a Sheet. The data still lands every time.
