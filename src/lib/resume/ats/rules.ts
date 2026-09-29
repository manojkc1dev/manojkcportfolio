import type {
  ResumeContent,
  AtsIssue,
  AtsScoreBreakdown,
  ResumeSection,
} from '../schema';
import { checkWeakBullet } from './weakVerbs';
import { isActionVerb } from './actionVerbs';
import { matchKeywords, TARGET_ROLE_PRESETS } from './keywords';

const STANDARD_SECTION_TITLES = new Set([
  'experience',
  'work experience',
  'employment history',
  'professional experience',
  'education',
  'academic background',
  'skills',
  'technical skills',
  'core competencies',
  'projects',
  'key projects',
  'selected projects',
  'certifications',
  'licenses & certifications',
  'awards',
  'honors & awards',
]);

const QUANT_REGEX = /(\b\d+(\.\d+)?%|\$\d+(,\d{3})*(\.\d+)?|\b\d+([kmb])\b|\b\d+\+?\b|\b\d+\s*(users|requests|ms|seconds|minutes|hours|days|fold|percent|clients|records))/i;
const EMOJI_REGEX = /[\u{1F300}-\u{1F9FF}\u{2600}-\u{26FF}\u{2700}-\u{27BF}]/u;

export interface AtsAuditResult {
  score: number;
  breakdown: AtsScoreBreakdown;
  issues: AtsIssue[];
  targetRole?: string;
  matchedKeywords: string[];
  missingKeywords: string[];
}

export function runAtsAudit(content: ResumeContent, targetRole = 'Backend Engineer', customJdKeywords?: string[]): AtsAuditResult {
  const issues: AtsIssue[] = [];

  let contactScore = 10;
  let sectionScore = 15;
  let actionVerbScore = 20;
  let quantifiedScore = 20;
  let keywordScore = 15;
  let formattingScore = 10;
  let lengthScore = 10;

  const header = content.header || { name: '', title: '', email: '', phone: '', location: '' };
  const sections = content.sections || [];

  // ================= 1. CONTACT COMPLETENESS (weight 10) =================
  if (!header.email || !header.email.trim()) {
    contactScore -= 4;
    issues.push({
      severity: 'error',
      section: 'header',
      message: 'Missing contact email address in header.',
      fixHint: 'Provide a professional direct email (e.g. name@domain.com) so applicant tracking systems can create a candidate profile.',
    });
  } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(header.email.trim())) {
    contactScore -= 2;
    issues.push({
      severity: 'error',
      section: 'header',
      message: 'Email address appears improperly formatted.',
      fixHint: 'Ensure your email matches the standard user@domain.com syntax.',
    });
  }

  if (!header.phone || !header.phone.trim()) {
    contactScore -= 3;
    issues.push({
      severity: 'error',
      section: 'header',
      message: 'Missing contact phone number in header.',
      fixHint: 'Add an international phone number (e.g. +977-9800000000) for recruiter phone screens.',
    });
  }

  if (!header.name || !header.name.trim()) {
    contactScore -= 3;
    issues.push({
      severity: 'error',
      section: 'header',
      message: 'Missing candidate full name.',
      fixHint: 'Enter your legal first and last name at the very top of your resume.',
    });
  }

  if (!header.linkedin || !header.linkedin.trim()) {
    issues.push({
      severity: 'info',
      section: 'header',
      message: 'No LinkedIn profile URL provided.',
      fixHint: 'Adding a customized LinkedIn URL increases recruiter engagement by 38%.',
    });
  }

  if (!header.github || !header.github.trim()) {
    issues.push({
      severity: 'info',
      section: 'header',
      message: 'No GitHub profile URL provided.',
      fixHint: 'Engineering ATS parsers look for code repository links to verify technical competence.',
    });
  }

  contactScore = Math.max(0, contactScore);

  // ================= 2. SECTION PRESENCE (weight 15) =================
  const visibleSections = sections.filter((s) => s.visible !== false);
  const expSection = visibleSections.find((s) => s.type === 'experience');
  const eduSection = visibleSections.find((s) => s.type === 'education');
  const skillsSection = visibleSections.find((s) => s.type === 'skills');
  const certSection = visibleSections.find((s) => s.type === 'certifications');

  if (!expSection || expSection.entries.length === 0) {
    sectionScore -= 8;
    issues.push({
      severity: 'error',
      section: 'experience',
      message: 'No Experience section found or section has zero entries.',
      fixHint: 'ATS algorithms immediately rank resumes without verified work experience at the bottom.',
    });
  }

  if (!skillsSection || skillsSection.entries.length === 0) {
    sectionScore -= 4;
    issues.push({
      severity: 'warning',
      section: 'skills',
      message: 'No dedicated Skills section found.',
      fixHint: 'Add a dedicated Technical Skills section grouped by category to pass automated keyword screens.',
    });
  }

  if (!eduSection || eduSection.entries.length === 0) {
    sectionScore -= 3;
    issues.push({
      severity: 'warning',
      section: 'education',
      message: 'Education section is absent or empty.',
      fixHint: 'Most ATS job filters require degree verification. Add your highest degree.',
    });
  }

  if (!certSection || certSection.entries.length === 0) {
    issues.push({
      severity: 'info',
      section: 'certifications',
      message: 'Certifications section absent.',
      fixHint: 'Adding vendor-neutral or cloud credentials (AWS, Python, Kubernetes) boosts profile ranking.',
    });
  }

  sectionScore = Math.max(0, sectionScore);

  // ================= 3. ACTION VERBS & FIRST PERSON (weight 20) =================
  let totalBullets = 0;
  let weakBulletsCount = 0;
  let nonActionVerbCount = 0;
  let hasFirstPerson = false;

  for (const section of visibleSections) {
    for (const entry of section.entries.filter((e) => e.visible !== false)) {
      for (const bullet of entry.bullets || []) {
        if (!bullet || !bullet.trim()) continue;
        totalBullets++;
        const trimmed = bullet.trim();

        const weakCheck = checkWeakBullet(trimmed);
        if (weakCheck.isWeak) {
          weakBulletsCount++;
          if (weakCheck.reason?.includes('first-person')) {
            hasFirstPerson = true;
            issues.push({
              severity: 'error',
              section: section.type,
              entryId: entry.id,
              message: `Bullet uses first-person pronouns: "${trimmed.substring(0, 40)}..."`,
              fixHint: weakCheck.reason,
            });
          } else {
            issues.push({
              severity: 'warning',
              section: section.type,
              entryId: entry.id,
              message: `Bullet starts with weak phrasing: "${trimmed.substring(0, 40)}..."`,
              fixHint: weakCheck.reason || 'Start bullet directly with an action verb.',
            });
          }
        } else {
          // Check if first word is an action verb
          const firstWord = trimmed.split(/\s+/)[0];
          if (!isActionVerb(firstWord)) {
            nonActionVerbCount++;
          }
        }
      }
    }
  }

  if (hasFirstPerson) {
    actionVerbScore -= 8;
  }
  if (weakBulletsCount > 0) {
    actionVerbScore -= Math.min(6, weakBulletsCount * 2);
  }
  if (nonActionVerbCount > 0 && totalBullets > 0) {
    const ratio = nonActionVerbCount / totalBullets;
    if (ratio > 0.4) {
      actionVerbScore -= 4;
      issues.push({
        severity: 'warning',
        section: 'experience',
        message: `${Math.round(ratio * 100)}% of bullet points do not start with a recognized past-tense action verb.`,
        fixHint: 'Begin bullets with powerful action verbs like "Architected", "Engineered", "Optimized", or "Delivered".',
      });
    }
  }

  actionVerbScore = Math.max(0, actionVerbScore);

  // ================= 4. QUANTIFIED ACHIEVEMENTS (weight 20) =================
  let quantifiedBulletsCount = 0;
  for (const section of visibleSections) {
    for (const entry of section.entries.filter((e) => e.visible !== false)) {
      for (const bullet of entry.bullets || []) {
        if (QUANT_REGEX.test(bullet)) {
          quantifiedBulletsCount++;
        }
      }
    }
  }

  if (totalBullets > 0 && quantifiedBulletsCount === 0) {
    quantifiedScore -= 16;
    issues.push({
      severity: 'warning',
      section: 'experience',
      message: 'No quantified metrics (numbers, %, $, latency ms, users) found in any bullet points.',
      fixHint: 'High-scoring ATS resumes quantify impact (e.g. "Reduced query latency by 42%", "Processed 2.4M requests/month").',
    });
  } else if (quantifiedBulletsCount < 3) {
    quantifiedScore -= 6;
    issues.push({
      severity: 'warning',
      section: 'experience',
      message: `Only ${quantifiedBulletsCount} bullet point(s) contain measurable metrics. Aim for at least 3 to 5.`,
      fixHint: 'Include concrete metrics like percentage performance gain, cost reduction, or transaction volume.',
    });
  }

  quantifiedScore = Math.max(0, quantifiedScore);

  // ================= 5. FORMATTING SAFETY (weight 10) =================
  // Check for emojis, tabs, non-standard section titles
  let hasEmojiOrTabs = false;
  for (const section of visibleSections) {
    const cleanTitle = section.title.toLowerCase().trim();
    if (!STANDARD_SECTION_TITLES.has(cleanTitle) && section.type !== 'custom') {
      formattingScore -= 2;
      issues.push({
        severity: 'warning',
        section: section.type,
        message: `Section title "${section.title}" is not a recognized standard ATS label.`,
        fixHint: `ATS parsers look for standard headers like "Experience", "Education", or "Skills". Avoid creative labels like "My Journey" or "What I Do".`,
      });
    }

    for (const entry of section.entries) {
      if (EMOJI_REGEX.test(entry.title || '') || (entry.organization && EMOJI_REGEX.test(entry.organization))) {
        hasEmojiOrTabs = true;
      }
      for (const b of entry.bullets || []) {
        if (EMOJI_REGEX.test(b) || b.includes('\t')) {
          hasEmojiOrTabs = true;
        }
      }
    }
  }

  if (hasEmojiOrTabs) {
    formattingScore -= 6;
    issues.push({
      severity: 'error',
      section: 'formatting',
      message: 'Resume text contains emojis or raw tab characters.',
      fixHint: 'Remove all emojis and tabs. Parsing software corrupts character encoding when encountering non-ASCII symbols.',
    });
  }

  formattingScore = Math.max(0, formattingScore);

  // ================= 6. LENGTH APPROPRIATENESS & TOP ROLE (weight 10) =================
  if (expSection && expSection.entries.length > 0) {
    const topRole = expSection.entries[0];
    const topBullets = (topRole.bullets || []).filter((b) => b.trim().length > 0);
    if (topBullets.length === 0) {
      lengthScore -= 5;
      issues.push({
        severity: 'error',
        section: 'experience',
        entryId: topRole.id,
        message: `No bullet points in top/most recent role ("${topRole.title}").`,
        fixHint: 'Add at least 3 descriptive bullet points showing recent architectural accomplishments.',
      });
    } else if (topBullets.length < 3) {
      lengthScore -= 2;
      issues.push({
        severity: 'warning',
        section: 'experience',
        entryId: topRole.id,
        message: `Fewer than 3 bullets in your primary role ("${topRole.title}").`,
        fixHint: 'Include 3 to 5 bullets for your latest role detailing system impact and technologies used.',
      });
    }

    // Check dates missing month
    for (const entry of expSection.entries) {
      if (entry.startDate && !/^\d{4}-\d{2}$/.test(entry.startDate) && !/^[A-Za-z]{3}\s+\d{4}$/.test(entry.startDate)) {
        issues.push({
          severity: 'warning',
          section: 'experience',
          entryId: entry.id,
          message: `Role "${entry.title}" date "${entry.startDate}" is missing month specification.`,
          fixHint: 'Use "YYYY-MM" (e.g. "2023-08") or "Mon YYYY" so ATS tools can accurately calculate months of experience.',
        });
      }
    }
  }

  // Summary word count
  if (header.summary && header.summary.trim()) {
    const words = header.summary.trim().split(/\s+/).length;
    if (words < 40) {
      lengthScore -= 2;
      issues.push({
        severity: 'warning',
        section: 'header',
        message: `Professional summary is too brief (${words} words).`,
        fixHint: 'Expand summary to 40-120 words highlighting core backend technologies, scale handled, and years of experience.',
      });
    } else if (words > 120) {
      lengthScore -= 2;
      issues.push({
        severity: 'warning',
        section: 'header',
        message: `Professional summary is too long (${words} words).`,
        fixHint: 'Keep summary under 120 words so recruiters and ATS summary parsers extract high-density value quickly.',
      });
    }
  }

  // Skills item count
  if (skillsSection) {
    let skillCount = 0;
    for (const e of skillsSection.entries) {
      for (const b of e.bullets || []) {
        skillCount += b.split(/[,|;/]+/).filter((s) => s.trim().length > 1).length;
      }
      if (e.tags) skillCount += e.tags.length;
    }
    if (skillCount > 0 && skillCount < 8) {
      issues.push({
        severity: 'warning',
        section: 'skills',
        message: `Skills section has fewer than 8 items (${skillCount} found).`,
        fixHint: 'Add key languages, frameworks, databases, and DevOps tools to meet minimum keyword criteria.',
      });
    }
  }

  // Check total bullet lines estimate (exceeds 2 pages check)
  if (totalBullets > 22) {
    issues.push({
      severity: 'info',
      section: 'formatting',
      message: 'Resume exceeds 2 pages when rendered in standard 10pt typography.',
      fixHint: 'Condense older positions to 1-2 bullets to ensure clean 1-2 page presentation.',
    });
  }

  lengthScore = Math.max(0, lengthScore);

  // ================= 7. KEYWORD DENSITY VS TARGET ROLE (weight 15) =================
  let targetKeywords: string[] = [];
  if (customJdKeywords && customJdKeywords.length > 0) {
    targetKeywords = customJdKeywords;
  } else {
    const preset = TARGET_ROLE_PRESETS.find((p) => p.title.toLowerCase() === targetRole.toLowerCase()) || TARGET_ROLE_PRESETS[0];
    targetKeywords = preset.keywords;
  }

  // Build full text of resume
  const textCorpus = [
    header.name,
    header.title,
    header.summary,
    ...sections.flatMap((s) => [
      s.title,
      ...s.entries.flatMap((e) => [e.title, e.organization, ...(e.bullets || []), ...(e.tags || [])]),
    ]),
  ].filter(Boolean).join(' ');

  const keywordMatchResult = matchKeywords(textCorpus, targetKeywords);
  const matchRatio = targetKeywords.length > 0 ? keywordMatchResult.matched.length / targetKeywords.length : 1;
  keywordScore = Math.round(matchRatio * 15);

  if (keywordMatchResult.missing.length > 0) {
    issues.push({
      severity: matchRatio < 0.5 ? 'warning' : 'info',
      section: 'skills',
      message: `Missing ${keywordMatchResult.missing.length} target role keyword(s): ${keywordMatchResult.missing.slice(0, 4).join(', ')}${keywordMatchResult.missing.length > 4 ? '...' : ''}.`,
      fixHint: 'Add missing target keywords to your Skills section or relevant bullet points to increase recruiter match percentage.',
    });
  }

  const breakdown: AtsScoreBreakdown = {
    contactCompleteness: contactScore,
    sectionPresence: sectionScore,
    actionVerbs: actionVerbScore,
    quantifiedAchievements: quantifiedScore,
    keywordDensity: keywordScore,
    formattingSafety: formattingScore,
    lengthAppropriateness: lengthScore,
    total: Math.min(100, Math.max(0, contactScore + sectionScore + actionVerbScore + quantifiedScore + keywordScore + formattingScore + lengthScore)),
  };

  return {
    score: breakdown.total,
    breakdown,
    issues,
    targetRole,
    matchedKeywords: keywordMatchResult.matched,
    missingKeywords: keywordMatchResult.missing,
  };
}
