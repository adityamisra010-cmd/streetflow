/**
 * Street Flow — enquiry backend (Google Apps Script)
 * -------------------------------------------------
 * This receives enquiries from the website form and appends each one as a row
 * in a Google Sheet. It also (optionally) emails you when a new enquiry lands.
 *
 * SETUP (about 5 minutes) — full walkthrough in BACKEND-SETUP.md:
 *   1. Create a Google Sheet. Note its name of the first tab (default "Sheet1").
 *   2. Extensions → Apps Script. Delete the sample code, paste ALL of this file.
 *   3. Set NOTIFY_EMAIL below (or leave '' to skip emails).
 *   4. Deploy → New deployment → type "Web app".
 *        - Execute as: Me
 *        - Who has access: Anyone
 *      Copy the /exec URL it gives you.
 *   5. Paste that URL into script.js → CONFIG.SHEET_ENDPOINT and republish the site.
 *
 * Re-deploy (Manage deployments → edit → Deploy) whenever you change this file.
 */

// ---- settings you can change ----
var SHEET_NAME   = 'Sheet1';            // tab that stores enquiries
var NOTIFY_EMAIL = '';                  // e.g. 'streetflowdance@gmail.com' — leave '' for no email
// Columns are written in this order. Add/remove keys to match the form fields.
var FIELDS = ['submitted_at', 'name', 'phone', 'email', 'age', 'location', 'looking_for', 'sessions', 'message', 'page'];

function doPost(e) {
  var lock = LockService.getScriptLock();
  lock.waitLock(20000); // avoid two submissions clobbering each other
  try {
    var sheet = getSheet_();
    ensureHeader_(sheet);

    var p = (e && e.parameter) ? e.parameter : {};
    // simple honeypot: the form sends an empty "company" field; bots fill it
    if (p.company) {
      return json_({ ok: true, skipped: 'honeypot' });
    }

    var stamp = p.submitted_at || new Date().toISOString();
    var row = FIELDS.map(function (key) {
      if (key === 'submitted_at') return stamp;
      return p[key] || '';
    });
    sheet.appendRow(row);

    if (NOTIFY_EMAIL) {
      try {
        MailApp.sendEmail({
          to: NOTIFY_EMAIL,
          subject: 'New Street Flow enquiry: ' + (p.name || 'someone'),
          body: FIELDS.map(function (k) { return k + ': ' + (p[k] || (k === 'submitted_at' ? stamp : '')); }).join('\n')
        });
      } catch (mailErr) {
        // don't fail the submission just because the email hiccuped
      }
    }

    return json_({ ok: true });
  } catch (err) {
    return json_({ ok: false, error: String(err) });
  } finally {
    lock.releaseLock();
  }
}

// A friendly response if someone opens the URL directly in a browser.
function doGet() {
  return json_({ ok: true, service: 'Street Flow enquiries', hint: 'POST form data here from the website.' });
}

function getSheet_() {
  var ss = SpreadsheetApp.getActiveSpreadsheet();
  var sheet = ss.getSheetByName(SHEET_NAME);
  if (!sheet) sheet = ss.insertSheet(SHEET_NAME);
  return sheet;
}

function ensureHeader_(sheet) {
  if (sheet.getLastRow() === 0) {
    sheet.appendRow(FIELDS);
    sheet.getRange(1, 1, 1, FIELDS.length).setFontWeight('bold');
    sheet.setFrozenRows(1);
  }
}

function json_(obj) {
  return ContentService
    .createTextOutput(JSON.stringify(obj))
    .setMimeType(ContentService.MimeType.JSON);
}
