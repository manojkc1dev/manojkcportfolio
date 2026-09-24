import { onRequest } from 'firebase-functions/v2/https';
import * as logger from 'firebase-functions/logger';
import * as admin from 'firebase-admin';
import { validateContactInput } from './validate.js';
import { checkRateLimit } from './ratelimit.js';
import { sendContactEmail } from './mailer.js';

const ALLOWED_ORIGINS = [
  'https://manojkc1.com.np',
  'https://www.manojkc1.com.np',
  'http://localhost:5000',
  'http://localhost:5173',
];

export const contact = onRequest(
  {
    cors: ALLOWED_ORIGINS,
    secrets: ['RESEND_API_KEY'],
    maxInstances: 10,
  },
  async (req, res) => {
    // 1. Method verification: Only POST allowed
    if (req.method !== 'POST') {
      res.status(405).json({
        ok: false,
        error: 'Method not allowed. Only POST is accepted.',
      });
      return;
    }

    try {
      const body = req.body || {};

      // 2. Anti-spam Honeypot: if _hp or hp_field is non-empty, silently return fake success
      const honeypot = (body._hp || body.hp_field || '').toString().trim();
      if (honeypot !== '') {
        logger.info('Honeypot triggered by bot submission; returning silent success response.');
        res.status(200).json({ ok: true });
        return;
      }

      // 3. Validation: validate name, email, message
      const validation = validateContactInput(body);
      if (!validation.valid || !validation.data) {
        logger.warn('Validation failed for contact request', {
          error: validation.error,
          ip: req.ip,
        });
        res.status(400).json({
          ok: false,
          error: validation.error || 'Validation failed.',
        });
        return;
      }

      // 4. Rate Limiting: 5 requests / hour per client IP (hashed)
      const rawIp =
        (req.headers['x-forwarded-for'] as string)?.split(',')[0]?.trim() ||
        req.ip ||
        '127.0.0.1';

      const rateLimit = await checkRateLimit(rawIp);
      if (!rateLimit.allowed) {
        logger.warn('Rate limit exceeded for contact request', {
          clientIp: rawIp,
          retryAfter: rateLimit.retryAfterSeconds,
        });
        res.status(429).json({
          ok: false,
          error: `Too many inquiries sent. Please try again in ${rateLimit.retryAfterSeconds ?? 3600} seconds.`,
        });
        return;
      }

      // 5. Persist inquiry to Firestore messages collection for portfolio admin portal
      try {
        await admin.firestore().collection('messages').add({
          name: validation.data.name,
          email: validation.data.email,
          message: validation.data.message,
          read: false,
          replied: false,
          createdAt: admin.firestore.FieldValue.serverTimestamp(),
          source: 'portfolio_contact',
        });
        logger.info('Saved contact inquiry to Firestore messages collection');
      } catch (dbErr) {
        logger.warn('Could not save contact message to Firestore', { error: dbErr });
      }

      // 6. Send email via Resend
      await sendContactEmail(validation.data);

      logger.info('Successfully delivered contact form email via Resend', {
        sender: validation.data.email,
        name: validation.data.name,
      });

      // 7. Return success
      res.status(200).json({ ok: true });
    } catch (error: unknown) {
      // Structured error logging without leaking stack trace to client
      const errMessage = error instanceof Error ? error.message : 'Unknown error';
      logger.error('Unexpected error processing contact form', {
        error: errMessage,
      });

      res.status(500).json({
        ok: false,
        error: 'An internal error occurred while transmitting your message. Please try again later.',
      });
    }
  }
);
