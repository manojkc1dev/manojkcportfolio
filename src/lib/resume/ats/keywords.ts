export interface TargetRolePreset {
  title: string;
  keywords: string[];
}

export const TARGET_ROLE_PRESETS: TargetRolePreset[] = [
  {
    title: 'Backend Engineer',
    keywords: [
      'python',
      'django',
      'django rest framework',
      'fastapi',
      'postgresql',
      'redis',
      'celery',
      'docker',
      'rest api',
      'microservices',
      'sql',
      'git',
      'ci/cd',
      'pytest',
      'unit testing',
      'scalability',
      'database indexing',
      'linux',
    ],
  },
  {
    title: 'Django Developer',
    keywords: [
      'python',
      'django',
      'django rest framework',
      'orm',
      'postgresql',
      'redis',
      'celery',
      'jwt',
      'auth',
      'sqlite',
      'docker',
      'gunicorn',
      'nginx',
      'caching',
      'api design',
      'pytest',
    ],
  },
  {
    title: 'Python Engineer',
    keywords: [
      'python',
      'asyncio',
      'multiprocessing',
      'fastapi',
      'django',
      'flask',
      'sql',
      'postgresql',
      'nosql',
      'pytest',
      'clean code',
      'oop',
      'design patterns',
      'data structures',
      'algorithms',
      'docker',
    ],
  },
  {
    title: 'Full-Stack Engineer',
    keywords: [
      'python',
      'django',
      'react',
      'typescript',
      'javascript',
      'html5',
      'css3',
      'tailwind',
      'postgresql',
      'rest api',
      'state management',
      'responsive design',
      'docker',
      'git',
      'ci/cd',
    ],
  },
];

export function extractKeywordsFromText(text: string): string[] {
  if (!text) return [];
  // Tokenize and clean
  const tokens = text
    .toLowerCase()
    .replace(/[^\w\s-+#.]/g, ' ')
    .split(/\s+/)
    .filter((w) => w.length > 2);

  // Common stop words to omit
  const stopWords = new Set([
    'and', 'the', 'for', 'with', 'that', 'this', 'have', 'from', 'are', 'was',
    'were', 'will', 'been', 'about', 'more', 'into', 'their', 'which', 'than',
    'them', 'when', 'what', 'who', 'your', 'working', 'teams', 'team', 'work',
    'years', 'experience', 'strong', 'ability', 'must', 'skills', 'role', 'looking',
  ]);

  const unique = Array.from(new Set(tokens.filter((w) => !stopWords.has(w))));
  return unique.slice(0, 30);
}

export function matchKeywords(
  resumeText: string,
  targetKeywords: string[]
): {
  matched: string[];
  missing: string[];
  score: number;
} {
  if (!targetKeywords || targetKeywords.length === 0) {
    return { matched: [], missing: [], score: 100 };
  }

  const normalizedResume = resumeText.toLowerCase();
  const matched: string[] = [];
  const missing: string[] = [];

  for (const kw of targetKeywords) {
    const cleanKw = kw.toLowerCase().trim();
    if (!cleanKw) continue;
    // Word boundary or inclusion check
    const regex = new RegExp(`(^|[^a-z0-9])${cleanKw.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')}([^a-z0-9]|$)`, 'i');
    if (regex.test(normalizedResume) || normalizedResume.includes(cleanKw)) {
      matched.push(kw);
    } else {
      missing.push(kw);
    }
  }

  const score = targetKeywords.length > 0 ? Math.round((matched.length / targetKeywords.length) * 100) : 100;

  return { matched, missing, score };
}
