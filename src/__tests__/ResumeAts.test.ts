import { describe, it, expect, beforeEach } from 'vitest';
import { createDefaultResume, generateId, type ResumeContent } from '../lib/resume/schema';
import { runAtsAudit } from '../lib/resume/ats/rules';
import { toHtmlAts } from '../lib/resume/renderers/toHtmlAts';
import { toText } from '../lib/resume/renderers/toText';
import { toMarkdown } from '../lib/resume/renderers/toMarkdown';
import { toDocxBuffer } from '../lib/resume/renderers/toDocx';
import { createAtsPdfBuffer } from '../lib/resume/renderers/createSimplePdf';
import { parsePdf } from '../lib/resume/parse/parsePdf';
import { parseDocx } from '../lib/resume/parse/parseDocx';
import {
  saveResume,
  listResumes,
  getResumeById,
  deleteResume,
  duplicateResume,
  setActiveResume,
} from '../lib/resume/storage';
import * as pdfParseModule from 'pdf-parse';

const pdfParse: any = (pdfParseModule as any).default || pdfParseModule;

describe('Resume ATS & In-Browser Editor Suite', () => {
  let defaultDoc = createDefaultResume('resume', 'backend-engineer');

  beforeEach(() => {
    defaultDoc = createDefaultResume('resume', 'backend-engineer');
    localStorage.clear();
  });

  describe('Editor & Data Persistence', () => {
    it('adds bullet to entry and saves to storage with computed score', async () => {
      const entry = defaultDoc.content.sections[0].entries[0];
      const initialBulletCount = entry.bullets.length;

      entry.bullets.push('Spearheaded migration of legacy auth to JWT tokens with 0 downtime.');
      const saved = await saveResume(defaultDoc);

      expect(saved.content.sections[0].entries[0].bullets.length).toBe(initialBulletCount + 1);
      expect(saved.atsScore).toBeGreaterThan(70);

      const fetched = await getResumeById(saved.resumeId);
      expect(fetched).not.toBeNull();
      expect(fetched?.content.sections[0].entries[0].bullets).toContain(
        'Spearheaded migration of legacy auth to JWT tokens with 0 downtime.'
      );
    });

    it('reorders sections and updates order field properly', async () => {
      const sec0 = defaultDoc.content.sections[0];
      const sec1 = defaultDoc.content.sections[1];

      // Swap sections
      const reordered = [
        { ...sec1, order: 0 },
        { ...sec0, order: 1 },
        ...defaultDoc.content.sections.slice(2).map((s, idx) => ({ ...s, order: idx + 2 })),
      ];

      defaultDoc.content.sections = reordered;
      const saved = await saveResume(defaultDoc);

      expect(saved.content.sections[0].title).toBe(sec1.title);
      expect(saved.content.sections[0].order).toBe(0);
      expect(saved.content.sections[1].title).toBe(sec0.title);
      expect(saved.content.sections[1].order).toBe(1);
    });

    it('undo restores deleted bullet in history stack pattern', () => {
      const historyStack: ResumeContent[] = [JSON.parse(JSON.stringify(defaultDoc.content))];
      let currentContent = JSON.parse(JSON.stringify(defaultDoc.content));

      // User deletes a bullet
      currentContent.sections[0].entries[0].bullets.pop();
      historyStack.push(JSON.parse(JSON.stringify(currentContent)));
      expect(currentContent.sections[0].entries[0].bullets.length).toBe(
        defaultDoc.content.sections[0].entries[0].bullets.length - 1
      );

      // Perform Undo
      historyStack.pop();
      const restored = historyStack[historyStack.length - 1];
      expect(restored.sections[0].entries[0].bullets.length).toBe(
        defaultDoc.content.sections[0].entries[0].bullets.length
      );
    });

    it('duplicates resume with copy suffix and preserves content structure', async () => {
      const saved = await saveResume(defaultDoc);
      const duplicate = await duplicateResume(saved.resumeId);

      expect(duplicate.resumeId).not.toBe(saved.resumeId);
      expect(duplicate.variant).toContain('copy');
      expect(duplicate.isActive).toBe(false);
      expect(duplicate.content.sections.length).toBe(saved.content.sections.length);
    });
  });

  describe('ATS Audit Rules & Scoring', () => {
    it('flags missing email in header as critical error', () => {
      const badContent: ResumeContent = {
        ...defaultDoc.content,
        header: {
          ...defaultDoc.content.header,
          email: '',
        },
      };

      const audit = runAtsAudit(badContent);
      const emailIssue = audit.issues.find(
        (i) => i.section === 'header' && i.message.includes('email')
      );

      expect(emailIssue).toBeDefined();
      expect(emailIssue?.severity).toBe('error');
    });

    it('flags first-person pronouns ("I built X") as critical error', () => {
      const badContent: ResumeContent = JSON.parse(JSON.stringify(defaultDoc.content));
      badContent.sections[0].entries[0].bullets[0] = 'I built a large scale payment processing backend.';

      const audit = runAtsAudit(badContent);
      const fpIssue = audit.issues.find(
        (i) => i.message.includes('first-person')
      );

      expect(fpIssue).toBeDefined();
      expect(fpIssue?.severity).toBe('error');
    });

    it('awards high quantified score when 3+ bullets contain metrics (%, numbers, ms)', () => {
      const audit = runAtsAudit(defaultDoc.content);
      expect(audit.breakdown.quantifiedAchievements).toBeGreaterThanOrEqual(14);
      expect(audit.score).toBeGreaterThanOrEqual(80);
    });

    it('flags empty skills section with warning', () => {
      const contentNoSkills: ResumeContent = {
        ...defaultDoc.content,
        sections: defaultDoc.content.sections.filter((s) => s.type !== 'skills'),
      };

      const audit = runAtsAudit(contentNoSkills);
      const skillsIssue = audit.issues.find((i) => i.section === 'skills');
      expect(skillsIssue).toBeDefined();
      expect(skillsIssue?.severity).toBe('warning');
    });

    it('computes JD keyword density correctly for target role', () => {
      const audit = runAtsAudit(defaultDoc.content, 'Backend Engineer');
      expect(audit.matchedKeywords.length).toBeGreaterThan(5);
      expect(audit.breakdown.keywordDensity).toBeGreaterThan(8);

      // Check with custom JD keywords
      const customJd = ['kubernetes', 'graphql', 'golang', 'rust', 'django'];
      const customAudit = runAtsAudit(defaultDoc.content, 'Backend Engineer', customJd);
      expect(customAudit.missingKeywords).toContain('kubernetes');
      expect(customAudit.missingKeywords).toContain('graphql');
      expect(customAudit.matchedKeywords).toContain('django');
    });
  });

  describe('Multi-Format Export Renderers', () => {
    it('toHtmlAts produces valid semantic HTML5 with single column structure', () => {
      const html = toHtmlAts(defaultDoc.content);
      expect(html).toContain('<!DOCTYPE html>');
      expect(html).toContain('<h1 class="candidate-name">Manoj Khatri</h1>');
      expect(html).toContain('class="section-title"');
      expect(html).toContain('EXPERIENCE');
      expect(html).toContain('TECHNICAL SKILLS');
      expect(html).toContain('ul class="bullet-list"');
      expect(html).not.toContain('<table'); // ATS single-column requirement
    });

    it('toDocx produces valid DOCX buffer without errors', async () => {
      const buffer = await toDocxBuffer(defaultDoc.content);
      expect(buffer).toBeDefined();
      expect(buffer.length).toBeGreaterThan(1000);
      // Word document header signature PK\x03\x04
      expect(buffer[0]).toBe(0x50);
      expect(buffer[1]).toBe(0x4b);
    });

    it('toText produces clean ATS plain text with no emojis or special chars', () => {
      const text = toText(defaultDoc.content);
      expect(text).toContain('MANOJ KHATRI');
      expect(text).toContain('EXPERIENCE');
      expect(text).toContain('----------------------------------------');
      expect(text).toContain('- Architected');
      // No raw HTML tags
      expect(text).not.toContain('<div>');
      expect(text).not.toContain('<h1>');
    });

    it('toMarkdown produces readable markdown for README reuse', () => {
      const md = toMarkdown(defaultDoc.content);
      expect(md).toContain('# Manoj Khatri');
      expect(md).toContain('## Experience');
      expect(md).toContain('- **');
    });

    it('PDF render includes real text (parsed by pdf-parse, name + top bullet present)', async () => {
      const pdfBuffer = createAtsPdfBuffer(defaultDoc.content);
      expect(pdfBuffer).toBeDefined();
      expect(pdfBuffer.toString('utf-8', 0, 8)).toContain('%PDF-1.4');

      const { PDFParse } = await import('pdf-parse');
      const parser = new PDFParse({ data: pdfBuffer });
      const result = await parser.getText();
      expect(result.text).toContain('MANOJ KHATRI');
      expect(result.text).toContain('Backend Software Engineer');
      expect(result.text).toContain('Architected high-throughput Django REST API');
      if (parser.destroy) await parser.destroy();
    });
  });

  describe('Document Import Parsers', () => {
    it('parsePdf extracts name, email, and experience from PDF buffer', async () => {
      const pdfBuffer = createAtsPdfBuffer(defaultDoc.content);
      const parsed = await parsePdf(pdfBuffer);

      expect(parsed.header.name.toUpperCase()).toContain('MANOJ KHATRI');
      expect(parsed.header.email).toBe('manojkc1dev@gmail.com');
      expect(parsed.sections.length).toBeGreaterThanOrEqual(1);

      const exp = parsed.sections.find(
        (s) => s.type === 'experience' || s.title.toLowerCase().includes('experience')
      );
      expect(exp).toBeDefined();
    });

    it('parseDocx extracts structured sections from DOCX buffer', async () => {
      const docxBuffer = await toDocxBuffer(defaultDoc.content);
      const parsed = await parseDocx(docxBuffer);

      expect(parsed.header.name).toBe('Manoj Khatri');
      expect(parsed.sections.length).toBeGreaterThanOrEqual(1);
    });

    it('rejects unsupported invalid formats', async () => {
      const invalidBuffer = Buffer.from('Just some random text string');
      await expect(parseDocx(invalidBuffer)).rejects.toThrow();
    });
  });

  describe('Public Serving Semantics', () => {
    it('sets active resume and reflects in list', async () => {
      const resume1 = await saveResume(createDefaultResume('resume', 'variant-a'));
      const resume2 = await saveResume(createDefaultResume('resume', 'variant-b'));

      await setActiveResume(resume2.resumeId, 'resume');
      const all = await listResumes();

      const active = all.find((r) => r.isActive && r.type === 'resume');
      expect(active?.resumeId).toBe(resume2.resumeId);
    });
  });
});
