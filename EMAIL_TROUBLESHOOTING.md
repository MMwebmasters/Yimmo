# Email Configuration Troubleshooting

## Current Issue
**Error:** `ETIMEDOUT` or `ESOCKET` - Network connection issue connecting to Gmail SMTP server on port 587

## Root Cause
Your network or ISP is likely **blocking outgoing SMTP connections on port 587**. This is common with:
- Corporate firewalls
- ISP restrictions
- Network security policies

## Solutions to Try (in order)

### Solution 1: Try Port 465 (SSL)
Gmail also supports port 465 with SSL encryption. This port sometimes works when 587 is blocked.

**Edit `.env` file:**
```
SMTP_PORT=465
SMTP_SECURE=true
```

Then restart the application:
```bash
npm start
```

Test by submitting a contact form or appointment request.

---

### Solution 2: Disable 2-Step Verification Temporarily (Not Recommended)
If you don't have 2-step verification enabled, Gmail might be blocking the connection due to "less secure" apps.

1. Go to https://myaccount.google.com/security
2. Scroll down to "Less secure app access"
3. Enable it temporarily for testing

**OR** use an App Password (more secure):
1. Go to https://myaccount.google.com/apppasswords
2. Select "Mail" and "Windows Computer"
3. Google will generate a 16-character password
4. Copy it WITHOUT spaces and paste into `.env` as `SMTP_PASS`

---

### Solution 3: Use a Different Email Service
If Gmail doesn't work, switch to a free email service that's more reliable:

#### Option A: SendGrid (Recommended)
1. Sign up for free at https://sendgrid.com (100 emails/day)
2. Create API key at https://app.sendgrid.com/settings/api_keys
3. Update `.env`:
```
SMTP_HOST=smtp.sendgrid.net
SMTP_PORT=587
SMTP_SECURE=false
SMTP_USER=apikey
SMTP_PASS=SG.xxxxxxxxxxxxxxxxxxxxx
SMTP_FROM_EMAIL=noreply@yimmosarl.com
SMTP_FROM_NAME=Yimmo Menuiserie
```

#### Option B: Mailgun (Free)
1. Sign up at https://www.mailgun.com
2. Get credentials from dashboard
3. Update `.env`:
```
SMTP_HOST=smtp.mailgun.org
SMTP_PORT=587
SMTP_SECURE=false
SMTP_USER=postmaster@mg.yimmosarl.com
SMTP_PASS=your_mailgun_password
```

#### Option C: Brevo (Sendinblue) - French Company
1. Sign up at https://www.brevo.com (free tier available)
2. Get SMTP credentials from settings
3. Update `.env` with their SMTP details

---

### Solution 4: Contact Your ISP
If you want to keep using Gmail:
- Contact your ISP and ask to unblock SMTP port 587/465
- Explain it's for business email notifications
- They may whitelist your account

---

## How to Test
1. Restart the application: `npm start`
2. Submit a contact form or appointment request
3. Check the server console for:
   - ✓ Success message: `✓ Contact form confirmation email sent to...`
   - ❌ Error message: `❌ Error sending contact form confirmation email:`

4. Also check the user's **spam/junk folder** - emails might be filtered there

---

## Email Credentials in Use
- **From Email:** mugiwaranomohameddo@gmail.com
- **Gmail App Password:** zbfflhewpzyvgmka (no spaces!)
- **Current Port:** 587 (failing) - Try 465 instead

---

## Production Recommendation
For production, use a professional email service like **SendGrid**, **Mailgun**, or **AWS SES**. These are:
- More reliable (99.9% delivery)
- Better spam score
- Support for DKIM/SPF authentication
- Analytics and tracking

For development, SendGrid's free tier (100 emails/day) is perfect.

---

## Need Help?
If none of these solutions work:
1. Check your network firewall settings
2. Verify the app password is correct (16 characters, no spaces)
3. Try from a different network (mobile hotspot) to rule out ISP blocking
4. Consider using a different email service
