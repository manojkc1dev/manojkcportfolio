import { createHash } from 'crypto';
import * as admin from 'firebase-admin';
import type { RateLimitResult } from './types.js';

const WINDOW_MS = 60 * 60 * 1000; // 1 hour sliding window
const MAX_REQUESTS_PER_WINDOW = 5;

/**
 * Checks and records rate limiting for an incoming IP address.
 * Uses a sliding-window algorithm stored in Firestore at:
 * `rateLimits/contact_{ipHash}`
 */
export async function checkRateLimit(clientIp: string): Promise<RateLimitResult> {
  const ipHash = createHash('sha256').update(clientIp).digest('hex');
  const docRef = admin.firestore().collection('rateLimits').doc(`contact_${ipHash}`);

  const now = Date.now();
  const windowStart = now - WINDOW_MS;

  try {
    const snapshot = await docRef.get();
    const data = snapshot.data();

    const rawTimestamps: number[] = Array.isArray(data?.timestamps)
      ? (data.timestamps as number[])
      : [];

    // Retain only requests within the active 1-hour sliding window
    const activeTimestamps = rawTimestamps.filter((ts) => typeof ts === 'number' && ts > windowStart);

    if (activeTimestamps.length >= MAX_REQUESTS_PER_WINDOW) {
      // Find oldest timestamp in current window to calculate exact retry delay
      const oldestActive = Math.min(...activeTimestamps);
      const retryAfterMs = oldestActive + WINDOW_MS - now;
      const retryAfterSeconds = Math.max(1, Math.ceil(retryAfterMs / 1000));

      return {
        allowed: false,
        retryAfterSeconds,
      };
    }

    // Append current timestamp and save back to Firestore
    activeTimestamps.push(now);

    await docRef.set(
      {
        ipHash,
        timestamps: activeTimestamps,
        updatedAt: admin.firestore.FieldValue.serverTimestamp(),
      },
      { merge: true }
    );

    return {
      allowed: true,
    };
  } catch (error) {
    // If Firestore fails, log and permit request to avoid blocking legitimate users on transient DB glitches
    console.error('Rate limit Firestore lookup error:', error);
    return {
      allowed: true,
    };
  }
}
