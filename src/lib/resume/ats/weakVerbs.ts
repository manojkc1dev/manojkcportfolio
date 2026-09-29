export const WEAK_VERB_PATTERNS = [
  'worked on',
  'helped with',
  'helped',
  'assisted with',
  'assisted',
  'responsible for',
  'tasked with',
  'involved in',
  'participated in',
  'did',
  'made',
  'tried to',
  'attempted to',
  'was part of',
  'duties included',
  'handled',
];

export const FIRST_PERSON_PATTERNS = [
  /^i\s+/i,
  /^my\s+/i,
  /^we\s+/i,
  /^our\s+/i,
  /^i've\s+/i,
  /^i'm\s+/i,
  /\bi\s+built\b/i,
  /\bi\s+developed\b/i,
  /\bi\s+managed\b/i,
  /\bi\s+worked\b/i,
  /\bi\s+created\b/i,
];

export function checkWeakBullet(bullet: string): { isWeak: boolean; reason?: string } {
  const trimmed = bullet.trim().toLowerCase();
  if (!trimmed) return { isWeak: false };

  for (const pattern of FIRST_PERSON_PATTERNS) {
    if (pattern.test(trimmed)) {
      return {
        isWeak: true,
        reason: 'Bullet uses first-person pronouns ("I", "my", "we"). Start directly with a strong action verb.',
      };
    }
  }

  for (const weak of WEAK_VERB_PATTERNS) {
    if (trimmed.startsWith(weak)) {
      return {
        isWeak: true,
        reason: `Bullet starts with passive phrase "${weak}". Replace with an active power verb like "Architected", "Engineered", or "Implemented".`,
      };
    }
  }

  return { isWeak: false };
}
