import type { ResumeContent, ResumeSection, ResumeEntry } from '../schema';
import { generateId } from '../schema';

export function parseRawTextToResumeContent(rawText: string): ResumeContent {
  const lines = rawText
    .split(/\r?\n/)
    .map((l) => l.trim())
    .filter(Boolean);

  let name = 'Manoj Khatri';
  let title = 'Backend Software Engineer';
  let email = '';
  let phone = '';
  let location = '';
  let linkedin = '';
  let github = '';
  let website = '';
  let summary = '';

  // Extract contact info using regular expressions
  const fullText = lines.join('\n');

  const emailMatch = fullText.match(/[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}/);
  if (emailMatch) email = emailMatch[0];

  const phoneMatch = fullText.match(/(?:\+?\d{1,3}[-.\s]?)?\(?\d{2,4}\)?[-.\s]?\d{3,4}[-.\s]?\d{3,4}/);
  if (phoneMatch) phone = phoneMatch[0];

  const linkedinMatch = fullText.match(/linkedin\.com\/in\/[a-zA-Z0-9_-]+/i);
  if (linkedinMatch) linkedin = `https://${linkedinMatch[0]}`;

  const githubMatch = fullText.match(/github\.com\/[a-zA-Z0-9_-]+/i);
  if (githubMatch) github = `https://${githubMatch[0]}`;

  // Name heuristic: usually the very first non-empty line without email/phone/url
  if (lines.length > 0) {
    const candidateName = lines[0];
    if (!candidateName.includes('@') && !candidateName.includes('http') && candidateName.length < 50) {
      name = candidateName.replace(/^#+\s*/, '').trim();
    }
  }

  // Title heuristic: second line if short and not contact info
  if (lines.length > 1) {
    const candidateTitle = lines[1];
    if (
      !candidateTitle.includes('@') &&
      !candidateTitle.includes('http') &&
      !candidateTitle.includes('+') &&
      candidateTitle.length < 60
    ) {
      title = candidateTitle;
    }
  }

  // Section splitting
  const SECTION_KEYWORDS: Record<string, 'experience' | 'education' | 'skills' | 'projects' | 'certifications' | 'custom'> = {
    experience: 'experience',
    'work experience': 'experience',
    'professional experience': 'experience',
    'employment history': 'experience',
    education: 'education',
    skills: 'skills',
    'technical skills': 'skills',
    projects: 'projects',
    'key projects': 'projects',
    certifications: 'certifications',
    certificates: 'certifications',
    summary: 'custom',
    'professional summary': 'custom',
  };

  const sections: ResumeSection[] = [];
  let currentSectionType: string | null = null;
  let currentSectionTitle = '';
  let currentLines: string[] = [];

  const flushSection = () => {
    if (!currentSectionType || currentLines.length === 0) return;

    if (currentSectionType === 'summary') {
      summary = currentLines.join(' ');
      return;
    }

    const entries: ResumeEntry[] = [];
    let currentEntry: Partial<ResumeEntry> | null = null;

    for (const line of currentLines) {
      const isBullet = /^[-*•▪–—]\s+/.test(line);

      if (isBullet) {
        const bulletText = line.replace(/^[-*•▪–—]\s+/, '').trim();
        if (currentEntry) {
          currentEntry.bullets = currentEntry.bullets || [];
          currentEntry.bullets.push(bulletText);
        } else {
          // Create entry on the fly
          currentEntry = {
            id: generateId('entry'),
            title: currentSectionTitle,
            bullets: [bulletText],
            visible: true,
          };
          entries.push(currentEntry as ResumeEntry);
        }
      } else {
        // Line might be an entry header (e.g. "Senior Backend Engineer | LightCode | 2023 - Present")
        if (currentSectionType === 'skills' && line.includes(':')) {
          const [cat, items] = line.split(':');
          entries.push({
            id: generateId('entry-skill'),
            title: cat.trim(),
            bullets: [items.trim()],
            visible: true,
          });
          currentEntry = null;
          continue;
        }

        // New role/degree entry
        const parts = line.split(/[|•–—-]/).map((p) => p.trim()).filter(Boolean);
        currentEntry = {
          id: generateId('entry'),
          title: parts[0] || line,
          organization: parts[1] || '',
          startDate: parts[2] || '',
          bullets: [],
          visible: true,
        };
        entries.push(currentEntry as ResumeEntry);
      }
    }

    if (entries.length > 0) {
      sections.push({
        id: generateId('sec'),
        type: (SECTION_KEYWORDS[currentSectionTitle.toLowerCase()] as any) || 'experience',
        title: currentSectionTitle,
        visible: true,
        order: sections.length,
        entries,
      });
    }
  };

  for (let i = 0; i < lines.length; i++) {
    const line = lines[i];
    const cleanLower = line.toLowerCase().replace(/[^a-z\s]/g, '').trim();

    if (SECTION_KEYWORDS[cleanLower]) {
      flushSection();
      currentSectionTitle = line.replace(/^[#\s]+/, '').replace(/[-_:]+$/, '').trim();
      currentSectionType = cleanLower.includes('summary') ? 'summary' : SECTION_KEYWORDS[cleanLower];
      currentLines = [];
    } else if (currentSectionType) {
      currentLines.push(line);
    }
  }
  flushSection();

  // If no sections were identified, create fallback sections
  if (sections.length === 0) {
    sections.push({
      id: generateId('sec-exp'),
      type: 'experience',
      title: 'Experience',
      visible: true,
      order: 0,
      entries: [
        {
          id: generateId('entry-exp'),
          title: title || 'Software Engineer',
          bullets: lines.slice(3, 10).filter((l) => l.length > 10),
          visible: true,
        },
      ],
    });
  }

  return {
    header: {
      name,
      title,
      email,
      phone,
      location,
      linkedin,
      github,
      website,
      summary,
    },
    sections,
  };
}
