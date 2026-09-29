import type { ResumeData, ResumeCustomization, ResumeSection } from '../types';

export interface AtsAuditResult {
  score: number;
  checks: Array<{
    id: string;
    title: string;
    passed: boolean;
    points: number;
    detail: string;
    recommendation: string;
  }>;
  matchedKeywords: string[];
  missingKeywords: string[];
  jobMatchRate: number;
}

export const ACTION_VERBS = {
  engineering: ['Architected', 'Engineered', 'Developed', 'Deployed', 'Integrated', 'Built', 'Refactored', 'Designed'],
  performance: ['Optimized', 'Accelerated', 'Scaled', 'Streamlined', 'Reduced', 'Eliminated', 'Automated'],
  leadership: ['Spearheaded', 'Orchestrated', 'Led', 'Mentored', 'Established', 'Standardized', 'Delivered'],
};

export const CORE_TECH_KEYWORDS = [
  'python', 'django', 'django rest framework', 'drf', 'postgresql', 'sql',
  'redis', 'celery', 'docker', 'docker compose', 'rest api', 'jwt', 'rbac',
  'git', 'linux', 'bash', 'caching', 'microservices', 'unit testing', 'api security'
];

export function calculateAtsMetrics(resumeData: ResumeData, jobDescriptionText: string = ''): AtsAuditResult {
  const fullText = JSON.stringify(resumeData).toLowerCase();
  
  // Extract keywords from Job Description if provided
  let jdKeywords: string[] = [];
  let matchedKeywords: string[] = [];
  let missingKeywords: string[] = [];
  let jobMatchRate = 100;

  if (jobDescriptionText.trim().length > 20) {
    const jdLower = jobDescriptionText.toLowerCase();
    // Match common tech terms
    const candidateTerms = [
      ...CORE_TECH_KEYWORDS,
      'fastapi', 'flask', 'aws', 'gcp', 'ci/cd', 'kubernetes', 'graphql',
      'pytest', 'nosql', 'mongodb', 'rabbitmq', 'kafka', 'tailwind', 'react', 'typescript'
    ];
    
    jdKeywords = candidateTerms.filter(term => jdLower.includes(term));
    matchedKeywords = jdKeywords.filter(term => fullText.includes(term));
    missingKeywords = jdKeywords.filter(term => !fullText.includes(term));
    jobMatchRate = jdKeywords.length > 0 ? Math.round((matchedKeywords.length / jdKeywords.length) * 100) : 100;
  } else {
    matchedKeywords = CORE_TECH_KEYWORDS.filter(term => fullText.includes(term));
    missingKeywords = CORE_TECH_KEYWORDS.filter(term => !fullText.includes(term));
  }

  const allBullets = resumeData.sections.flatMap(s => s.items.flatMap(i => i.bullets || []));
  const hasActionVerbs = allBullets.filter(b => {
    const firstWord = b.trim().split(' ')[0]?.toLowerCase() || '';
    return Object.values(ACTION_VERBS).flat().some(v => v.toLowerCase() === firstWord);
  }).length >= 3;

  const hasNumbers = allBullets.filter(b => /\d+%?|\$\d+/.test(b)).length >= 3;

  const checks = [
    {
      id: 'headline',
      title: 'Target Professional Headline',
      passed: Boolean(resumeData.targetHeadline && resumeData.targetHeadline.length >= 8),
      points: 15,
      detail: resumeData.targetHeadline || 'Missing target headline',
      recommendation: 'Use industry standard headline (e.g. Backend Software Engineer · Python & Django Specialist)',
    },
    {
      id: 'summary',
      title: 'Executive Professional Summary',
      passed: Boolean(resumeData.summaryText && resumeData.summaryText.length >= 80),
      points: 15,
      detail: `${resumeData.summaryText.length} characters with technical competencies`,
      recommendation: 'Ensure summary covers technical stack, domain focus, and key production impact.',
    },
    {
      id: 'sections',
      title: 'Core ATS Section Hierarchy',
      passed: resumeData.sections.some(s => s.category === 'experience') &&
              resumeData.sections.some(s => s.category === 'education') &&
              resumeData.sections.some(s => s.category === 'skills'),
      points: 20,
      detail: `${resumeData.sections.length} sections defined (Experience, Education, Skills)`,
      recommendation: 'Maintain standard headings (Experience, Education, Skills) for parser accuracy.',
    },
    {
      id: 'action_verbs',
      title: 'Quantified Impact & Action Verbs',
      passed: hasActionVerbs && hasNumbers,
      points: 20,
      detail: hasActionVerbs ? 'Strong action verbs and quantified metrics detected' : 'Bullets should start with action verbs',
      recommendation: 'Start bullets with power verbs (Engineered, Optimized, Scaled) and include % or numbers.',
    },
    {
      id: 'tech_keywords',
      title: 'Core Stack Keyword Density',
      passed: matchedKeywords.length >= 6,
      points: 15,
      detail: `${matchedKeywords.length} core keywords verified`,
      recommendation: 'Include essential backend keywords like Django, PostgreSQL, REST API, Celery, Docker.',
    },
    {
      id: 'jd_match',
      title: jobDescriptionText.trim() ? 'Job Description Target Match' : 'Single Column ATS Parseability',
      passed: jobDescriptionText.trim() ? jobMatchRate >= 70 : true,
      points: 15,
      detail: jobDescriptionText.trim() ? `${jobMatchRate}% match with target JD` : '100% single-column parseable layout',
      recommendation: jobDescriptionText.trim() ? 'Add missing keywords highlighted in the ATS matcher.' : 'Avoid multi-column tables.',
    },
  ];

  const earned = checks.reduce((sum, c) => (c.passed ? sum + c.points : sum), 0);
  const score = Math.min(100, Math.max(50, earned));

  return {
    score,
    checks,
    matchedKeywords,
    missingKeywords,
    jobMatchRate,
  };
}

export function generateWordDocumentBlob(resumeData: ResumeData, customization?: ResumeCustomization): Blob {
  const font = customization?.fontFamily === 'serif' ? 'Georgia, serif' : customization?.fontFamily === 'mono' ? 'Courier New, monospace' : 'Calibri, Arial, sans-serif';
  const paperSize = customization?.paperFormat === 'letter' ? '8.5in 11.0in' : '210mm 297mm';
  const pageLayout = customization?.pageLayout || 'two-page';

  let html = `
    <html xmlns:o='urn:schemas-microsoft-com:office:office' xmlns:w='urn:schemas-microsoft-com:office:word' xmlns='http://www.w3.org/TR/REC-html40'>
    <head>
      <meta charset='utf-8'>
      <title>${resumeData.fileName || 'Resume'}</title>
      <style>
        @page Section1 { size: ${paperSize}; margin: 15mm 15mm 15mm 15mm; mso-header-margin: 10mm; mso-footer-margin: 10mm; }
        div.Section1 { page: Section1; font-family: ${font}; font-size: 10.5pt; line-height: 1.25; color: #111; }
        h1 { font-size: 18pt; text-transform: uppercase; margin: 0 0 2pt 0; text-align: center; font-weight: bold; }
        .headline { font-size: 10.5pt; font-weight: bold; text-align: center; color: #333; margin-bottom: 4pt; }
        .contact { font-size: 9.5pt; text-align: center; color: #555; margin-bottom: 12pt; border-bottom: 1.5pt solid #222; padding-bottom: 6pt; }
        h2 { font-size: 11.5pt; text-transform: uppercase; border-bottom: 1pt solid #444; padding-bottom: 2pt; margin: 12pt 0 4pt 0; color: #111; letter-spacing: 0.5pt; font-weight: bold; }
        .item-title { font-weight: bold; font-size: 10.5pt; }
        .item-meta { font-size: 9.5pt; color: #555; float: right; }
        ul { margin: 2pt 0 6pt 18pt; padding: 0; }
        li { margin-bottom: 2.5pt; font-size: 9.5pt; line-height: 1.3; }
        p { margin: 2pt 0 4pt 0; font-size: 10pt; line-height: 1.35; }
        .page-break { page-break-before: always; mso-special-character: line-break; }
      </style>
    </head>
    <body>
      <div class="Section1">
        <h1>MANOJ KHATRI</h1>
        <div class="headline">${resumeData.targetHeadline}</div>
        <div class="contact">Kathmandu, Nepal · manojkc1dev@gmail.com · +977 9842203976 · manojkc1.com.np · github.com/manojkc1dev</div>

        <h2>PROFESSIONAL SUMMARY</h2>
        <p>${resumeData.summaryText}</p>
  `;

  const visibleSections = resumeData.sections.filter(s => !s.hidden && (!customization?.hiddenSectionIds || !customization.hiddenSectionIds.includes(s.id)));

  let p1Sections: ResumeSection[] = [];
  let p2Sections: ResumeSection[] = [];

  if (pageLayout === 'two-page') {
    if (customization?.page1SectionIds && customization.page1SectionIds.length > 0) {
      p1Sections = visibleSections.filter(s => customization.page1SectionIds!.includes(s.id));
      p2Sections = visibleSections.filter(s => !customization.page1SectionIds!.includes(s.id));
    } else {
      p1Sections = visibleSections.filter(s => s.category === 'experience');
      p2Sections = visibleSections.filter(s => s.category !== 'experience');
      if (p1Sections.length === 0 && visibleSections.length > 1) {
        const mid = Math.ceil(visibleSections.length / 2);
        p1Sections = visibleSections.slice(0, mid);
        p2Sections = visibleSections.slice(mid);
      }
    }
  } else {
    p1Sections = visibleSections;
    p2Sections = [];
  }

  const renderSectionHtml = (sec: ResumeSection) => {
    let secHtml = `<h2>${sec.title.toUpperCase()}</h2>`;
    const visibleItems = sec.items.filter(it => !it.hidden);
    visibleItems.forEach(item => {
      secHtml += `
        <div style="margin-top: 6pt; margin-bottom: 2pt;">
          <span class="item-title">${item.title}</span>
          ${item.subtitle ? `<span> | ${item.subtitle}</span>` : ''}
          <span class="item-meta"> (${item.period || ''}${item.location ? ' · ' + item.location : ''})</span>
        </div>
      `;
      if (item.description) {
        secHtml += `<p>${item.description}</p>`;
      }
      if (item.bullets && item.bullets.length > 0) {
        secHtml += `<ul>`;
        item.bullets.forEach(b => {
          secHtml += `<li>${b}</li>`;
        });
        secHtml += `</ul>`;
      }
    });
    return secHtml;
  };

  p1Sections.forEach(sec => {
    html += renderSectionHtml(sec);
  });

  if (p2Sections.length > 0) {
    html += `
      <br clear="all" style="page-break-before: always; mso-special-character: line-break;" />
      <div style="font-size: 9.5pt; color: #666; text-align: right; margin-bottom: 12pt; border-bottom: 1pt solid #ccc; padding-bottom: 4pt;">
        <strong>MANOJ KHATRI</strong> · ${resumeData.targetHeadline} | Page 2 of 2
      </div>
    `;
    p2Sections.forEach(sec => {
      html += renderSectionHtml(sec);
    });
  }

  html += `
      </div>
    </body>
    </html>
  `;

  return new Blob(['\ufeff', html], { type: 'application/msword;charset=utf-8' });
}

export function generatePlainTextResume(resumeData: ResumeData): string {
  let txt = `MANOJ KHATRI\n`;
  txt += `${resumeData.targetHeadline.toUpperCase()}\n`;
  txt += `Kathmandu, Nepal | manojkc1dev@gmail.com | +977 9842203976\n`;
  txt += `Portfolio: https://manojkc1.com.np | GitHub: https://github.com/manojkc1dev\n`;
  txt += `========================================================================\n\n`;

  txt += `PROFESSIONAL SUMMARY\n--------------------\n`;
  txt += `${resumeData.summaryText}\n\n`;

  const visibleSections = resumeData.sections.filter(s => !s.hidden);
  visibleSections.forEach(sec => {
    txt += `${sec.title.toUpperCase()}\n`;
    txt += `-`.repeat(sec.title.length) + `\n`;
    const visibleItems = sec.items.filter(it => !it.hidden);
    visibleItems.forEach(item => {
      txt += `${item.title}`;
      if (item.subtitle) txt += ` | ${item.subtitle}`;
      if (item.period) txt += ` (${item.period})`;
      if (item.location) txt += ` · ${item.location}`;
      txt += `\n`;
      if (item.description) txt += `${item.description}\n`;
      if (item.bullets && item.bullets.length > 0) {
        item.bullets.forEach(b => {
          txt += `* ${b}\n`;
        });
      }
      txt += `\n`;
    });
  });

  return txt;
}
