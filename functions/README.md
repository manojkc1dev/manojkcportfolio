# Portfolio Contact Cloud Function v2

Firebase Cloud Functions v2 (Node.js 20, TypeScript) for handling portfolio contact form inquiries.

## Architecture & Features

- **Runtime**: Node.js 20 on Cloud Functions v2 (`onRequest` HTTPS handler).
- **Transport**: [Resend](https://resend.com) API for fast, transactional email delivery.
- **Rate Limiting**: Sliding-window rate limiting stored in Firestore (`rateLimits/contact_{ipHash}`, 5 requests/hour per hashed IP).
- **Security & Spam Protection**:
  - **Honeypot**: Silent fake success if `_hp` is populated by bots.
  - **Sanitization**: Strips HTML tags from the message; rejects HTML tags in name.
  - **Input Boundaries**: Name (2-80 chars), Email (RFC-compliant regex, ≤254 chars), Message (10-2000 chars).
  - **Strict CORS**: Whitelists `https://manojkc1.com.np`, `https://www.manojkc1.com.np`, and local development ports.
  - **No Stack Leaks**: Structured JSON error logging via `firebase-functions/logger` without exposing runtime internals to callers.

---

## 1. Setting Up `RESEND_API_KEY` Secret

The function accesses the Resend API key via Google Cloud Secret Manager.

### Step 1: Set the Secret in Firebase

Run the following command in your terminal:

```bash
firebase functions:secrets:set RESEND_API_KEY
```

When prompted, paste your Resend API key (starts with `re_...`).

### Step 2: Verify the Secret is Configured

```bash
firebase functions:secrets:access RESEND_API_KEY
```

---

## 2. Verifying the Domain in Resend

To deliver emails from `portfolio@manojkc1.com.np` directly to `manojkc1@gmail.com` with optimal deliverability:

1. **Log in to Resend**: Go to [resend.com/domains](https://resend.com/domains).
2. **Add Domain**: Click **Add Domain** and enter:
   ```text
   manojkc1.com.np
   ```
3. **Add DNS Records at Your Registrar / DNS Host (Cloudflare, Nepal Domain Hosting, etc.)**:
   Resend will provide DNS records:
   - **DKIM** (TXT / CNAME): Verifies cryptographic signing for outgoing mail.
   - **SPF** (TXT): Authorizes Resend mail servers (`include:amazonses.com` or custom Resend include).
   - **DMARC** (TXT): Recommended policy (`v=DMARC1; p=none; rua=mailto:manojkc1@gmail.com`).
   - **MX** (Optional / Return-Path): Ensures bounce handling works smoothly.
4. **Verify**: Click **Verify Records** in the Resend dashboard. Once verified (usually within 5-15 minutes), emails from `portfolio@manojkc1.com.np` will be delivered cleanly to your inbox without spam flags.

---

## 3. Local Development & Testing

You can run the function locally with the Firebase Emulator Suite:

```bash
# Navigate to functions folder
cd functions

# Install dependencies
npm install

# Build TypeScript
npm run build

# Start emulator with local secret
RESEND_API_KEY="re_test_xxx" firebase emulators:start --only functions,firestore
```

Test with `curl`:

```bash
curl -X POST http://localhost:5001/<your-project-id>/us-central1/contact \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Alex Test",
    "email": "alex@example.com",
    "message": "Hi Manoj, I would like to discuss a Django backend contract."
  }'
```

---

## 4. Deploying to Firebase

Deploy only the contact function:

```bash
firebase deploy --only functions:contact
```

Or deploy all functions alongside hosting:

```bash
firebase deploy
```
