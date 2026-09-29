import { onRequest, onCall, HttpsError } from 'firebase-functions/v2/https';
import * as logger from 'firebase-functions/logger';
import * as admin from 'firebase-admin';
import {
  Document,
  Paragraph,
  TextRun,
  HeadingLevel,
  AlignmentType,
  Packer,
} from 'docx';

export interface ResumeHeader {
  name: string;
  title: string;
  email: string;
  phone: string;
  location: string;
  website?: string;
  linkedin?: string;
  github?: string;
  summary?: string;
}

export interface ResumeEntry {
  id: string;
  title: string;
  organization?: string;
  location?: string;
  startDate?: string;
  endDate?: string;
  bullets: string[];
  tags?: string[];
  links?: { label: string; url: string }[];
  visible: boolean;
}

export interface ResumeSection {
  id: string;
  type: string;
  title: string;
  visible: boolean;
  order: number;
  entries: ResumeEntry[];
}

export interface ResumeContent {
  header: ResumeHeader;
  sections: ResumeSection[];
}

export interface AtsIssue {
  severity: 'error' | 'warning' | 'info';
  section: string;
  entryId?: string;
  message: string;
  fixHint: string;
}

// -------------------------------------------------------------
// Rate limiting helper: 30 exports/hour
// -------------------------------------------------------------
async function checkExportRateLimit(key: string): Promise<boolean> {
  const db = admin.firestore();
  const now = Date.now();
  const oneHourAgo = now - 60 * 60 * 1000;
  const rateLimitRef = db.collection('rateLimits').doc(`export_${key.replace(/[^a-zA-Z0-9_-]/g, '_')}`);

  return await db.runTransaction(async (t) => {
    const doc = await t.get(rateLimitRef);
    let timestamps: number[] = doc.exists ? doc.data()?.timestamps || [] : [];
    timestamps = timestamps.filter((tVal) => tVal > oneHourAgo);

    if (timestamps.length >= 30) {
      return false;
    }

    timestamps.push(now);
    t.set(rateLimitRef, { timestamps }, { merge: true });
    return true;
  });
}

// -------------------------------------------------------------
// Text Renderer (Plain text ATS)
// -------------------------------------------------------------
function toPlainText(content: ResumeContent): string {
  const { header, sections = [] } = content;
  const lines: string[] = [];

  lines.push(header.name.toUpperCase());
  if (header.title) lines.push(header.title);

  const contactPieces: string[] = [];
  if (header.email) contactPieces.push(header.email);
  if (header.phone) contactPieces.push(header.phone);
  if (header.location) contactPieces.push(header.location);
  if (header.linkedin) contactPieces.push(header.linkedin);
  if (header.github) contactPieces.push(header.github);
  if (header.website) contactPieces.push(header.website);
  if (contactPieces.length > 0) lines.push(contactPieces.join(' | '));

  if (header.summary) {
    lines.push('');
    lines.push('PROFESSIONAL SUMMARY');
    lines.push('--------------------');
    lines.push(header.summary);
  }

  const sorted = [...sections]
    .filter((s) => s.visible !== false)
    .sort((a, b) => a.order - b.order);

  for (const sec of sorted) {
    lines.push('');
    lines.push(sec.title.toUpperCase());
    lines.push('-'.repeat(sec.title.length));

    for (const ent of sec.entries || []) {
      if (ent.visible === false) continue;
      const titleOrg = [ent.title, ent.organization].filter(Boolean).join(' - ');
      const locDates = [ent.location, [ent.startDate, ent.endDate].filter(Boolean).join(' - ')].filter(Boolean).join(' | ');

      if (titleOrg && locDates) {
        lines.push(`${titleOrg} (${locDates})`);
      } else if (titleOrg) {
        lines.push(titleOrg);
      }

      if (ent.tags && ent.tags.length > 0) {
        lines.push(`Keywords: ${ent.tags.join(', ')}`);
      }

      for (const bullet of ent.bullets || []) {
        if (bullet.trim()) {
          lines.push(`  - ${bullet.trim()}`);
        }
      }
    }
  }

  return lines.join('\n');
}

// -------------------------------------------------------------
// HTML Renderer (Semantic ATS HTML5)
// -------------------------------------------------------------
function toSemanticHtml(content: ResumeContent): string {
  const { header, sections = [] } = content;
  const sorted = [...sections]
    .filter((s) => s.visible !== false)
    .sort((a, b) => a.order - b.order);

  return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="utf-8">
  <title>${header.name} - Resume</title>
  <style>
    body { font-family: Inter, Arial, sans-serif; font-size: 10.5pt; line-height: 1.45; color: #111; max-width: 800px; margin: 0 auto; padding: 24px; }
    h1 { font-size: 18pt; margin: 0 0 4px 0; }
    h2 { font-size: 12pt; text-transform: uppercase; border-bottom: 1px solid #111; padding-bottom: 2px; margin: 16px 0 8px 0; }
    p { margin: 0 0 6px 0; }
    ul { margin: 4px 0 10px 20px; padding: 0; }
    li { margin-bottom: 4px; }
    .contact { font-size: 9.5pt; color: #444; margin-bottom: 12px; }
    .entry-header { display: flex; justify-content: space-between; font-weight: bold; margin-top: 8px; }
    .entry-sub { display: flex; justify-content: space-between; font-style: italic; color: #333; margin-bottom: 4px; }
  </style>
</head>
<body>
  <h1>${header.name}</h1>
  ${header.title ? `<p><strong>${header.title}</strong></p>` : ''}
  <div class="contact">
    ${[header.email, header.phone, header.location, header.linkedin, header.github, header.website].filter(Boolean).join(' &bull; ')}
  </div>
  ${header.summary ? `<h2>Professional Summary</h2><p>${header.summary}</p>` : ''}
  ${sorted
    .map(
      (sec) => `
    <h2>${sec.title}</h2>
    ${(sec.entries || [])
      .filter((e) => e.visible !== false)
      .map(
        (ent) => `
      <div class="entry">
        <div class="entry-header">
          <span>${ent.title}</span>
          <span>${[ent.startDate, ent.endDate].filter(Boolean).join(' &ndash; ')}</span>
        </div>
        ${ent.organization || ent.location ? `
        <div class="entry-sub">
          <span>${ent.organization || ''}</span>
          <span>${ent.location || ''}</span>
        </div>` : ''}
        ${ent.tags && ent.tags.length > 0 ? `<p><em>Technologies: ${ent.tags.join(', ')}</em></p>` : ''}
        ${ent.bullets && ent.bullets.length > 0 ? `
        <ul>
          ${ent.bullets.filter(Boolean).map((b) => `<li>${b}</li>`).join('')}
        </ul>` : ''}
      </div>`
      )
      .join('')}`
    )
    .join('')}
</body>
</html>`;
}

// -------------------------------------------------------------
// Markdown Renderer
// -------------------------------------------------------------
function toMarkdown(content: ResumeContent): string {
  const { header, sections = [] } = content;
  const lines: string[] = [];

  lines.push(`# ${header.name}`);
  if (header.title) lines.push(`**${header.title}**\n`);

  const contacts = [
    header.email ? `[${header.email}](mailto:${header.email})` : '',
    header.phone || '',
    header.location || '',
    header.linkedin ? `[LinkedIn](${header.linkedin})` : '',
    header.github ? `[GitHub](${header.github})` : '',
    header.website ? `[Website](${header.website})` : '',
  ].filter(Boolean);

  if (contacts.length > 0) lines.push(contacts.join(' | ') + '\n');

  if (header.summary) {
    lines.push('## Professional Summary\n');
    lines.push(header.summary + '\n');
  }

  const sorted = [...sections]
    .filter((s) => s.visible !== false)
    .sort((a, b) => a.order - b.order);

  for (const sec of sorted) {
    lines.push(`## ${sec.title}\n`);
    for (const ent of sec.entries || []) {
      if (ent.visible === false) continue;
      lines.push(`### ${ent.title}${ent.organization ? ` — *${ent.organization}*` : ''}`);
      const meta = [ent.location, [ent.startDate, ent.endDate].filter(Boolean).join(' – ')].filter(Boolean).join(' | ');
      if (meta) lines.push(`*${meta}*\n`);
      for (const b of ent.bullets || []) {
        if (b.trim()) lines.push(`- ${b.trim()}`);
      }
      lines.push('');
    }
  }

  return lines.join('\n');
}

// -------------------------------------------------------------
// DOCX Document Builder
// -------------------------------------------------------------
async function toDocxBuffer(content: ResumeContent): Promise<Buffer> {
  const { header, sections = [] } = content;
  const children: Paragraph[] = [];

  // Name (18pt Bold)
  children.push(
    new Paragraph({
      alignment: AlignmentType.LEFT,
      spacing: { after: 60 },
      children: [
        new TextRun({
          text: header.name,
          bold: true,
          size: 36, // 18pt
          font: 'Inter',
        }),
      ],
    })
  );

  // Title
  if (header.title) {
    children.push(
      new Paragraph({
        spacing: { after: 60 },
        children: [
          new TextRun({
            text: header.title,
            bold: true,
            size: 24, // 12pt
            font: 'Inter',
            color: '333333',
          }),
        ],
      })
    );
  }

  // Contact line
  const contacts = [header.email, header.phone, header.location, header.linkedin, header.github, header.website].filter(Boolean);
  if (contacts.length > 0) {
    children.push(
      new Paragraph({
        spacing: { after: 120 },
        children: [
          new TextRun({
            text: contacts.join('  |  '),
            size: 19, // 9.5pt
            font: 'Inter',
            color: '555555',
          }),
        ],
      })
    );
  }

  // Summary
  if (header.summary) {
    children.push(
      new Paragraph({
        heading: HeadingLevel.HEADING_2,
        spacing: { before: 120, after: 60 },
        children: [new TextRun({ text: 'PROFESSIONAL SUMMARY', bold: true, size: 23, font: 'Inter' })],
      })
    );
    children.push(
      new Paragraph({
        spacing: { after: 120 },
        children: [new TextRun({ text: header.summary, size: 21, font: 'Inter' })],
      })
    );
  }

  const sorted = [...sections]
    .filter((s) => s.visible !== false)
    .sort((a, b) => a.order - b.order);

  for (const sec of sorted) {
    children.push(
      new Paragraph({
        heading: HeadingLevel.HEADING_2,
        spacing: { before: 140, after: 60 },
        children: [new TextRun({ text: sec.title.toUpperCase(), bold: true, size: 23, font: 'Inter' })],
      })
    );

    for (const ent of sec.entries || []) {
      if (ent.visible === false) continue;
      const dates = [ent.startDate, ent.endDate].filter(Boolean).join(' – ');
      children.push(
        new Paragraph({
          spacing: { before: 60, after: 40 },
          children: [
            new TextRun({ text: ent.title, bold: true, size: 21, font: 'Inter' }),
            ent.organization ? new TextRun({ text: ` — ${ent.organization}`, bold: false, size: 21, font: 'Inter' }) : new TextRun(''),
            dates ? new TextRun({ text: ` (${dates})`, italics: true, size: 20, font: 'Inter', color: '666666' }) : new TextRun(''),
          ],
        })
      );

      for (const bullet of ent.bullets || []) {
        if (!bullet.trim()) continue;
        children.push(
          new Paragraph({
            bullet: { level: 0 },
            spacing: { after: 30 },
            children: [new TextRun({ text: bullet.trim(), size: 20, font: 'Inter' })],
          })
        );
      }
    }
  }

  const doc = new Document({
    sections: [
      {
        properties: {
          page: {
            margin: {
              top: 1080, // 0.75 in
              bottom: 1080,
              left: 720, // 0.5 in
              right: 720,
            },
          },
        },
        children,
      },
    ],
  });

  return await Packer.toBuffer(doc);
}

// -------------------------------------------------------------
// PDF 1.4 Native Generator
// -------------------------------------------------------------
function toPdfBuffer(content: ResumeContent): Buffer {
  const plainText = toPlainText(content);
  const lines = plainText.split('\n');

  const sanitize = (str: string) =>
    str.replace(/\\/g, '\\\\').replace(/\(/g, '\\(').replace(/\)/g, '\\)');

  let streamContent = 'BT\n/F1 10 Tf\n14.5 TL\n';
  streamContent += '1 0 0 1 54 750 Tm\n';

  let currentY = 750;
  const lineSpacing = 13.5;

  for (let i = 0; i < lines.length; i++) {
    const rawLine = lines[i];

    if (i === 0) {
      streamContent += `ET\nBT\n/F2 18 Tf\n1 0 0 1 54 ${currentY} Tm\n(${sanitize(rawLine)}) Tj\nET\nBT\n/F1 9.5 Tf\n1 0 0 1 54 ${currentY - 20} Tm\n`;
      currentY -= 22;
      continue;
    }

    if (rawLine.startsWith('---') || rawLine.startsWith('===') || rawLine.length === 0) {
      currentY -= 6;
      streamContent += `ET\nBT\n/F1 9.5 Tf\n1 0 0 1 54 ${currentY} Tm\n`;
      continue;
    }

    const isSectionHeader = /^[A-Z\s&]{4,}$/.test(rawLine);
    if (isSectionHeader) {
      currentY -= 12;
      streamContent += `ET\nBT\n/F2 11 Tf\n1 0 0 1 54 ${currentY} Tm\n(${sanitize(rawLine)}) Tj\nET\nBT\n/F1 9.5 Tf\n1 0 0 1 54 ${currentY - 14} Tm\n`;
      currentY -= 14;
      continue;
    }

    if (rawLine.length > 95) {
      const words = rawLine.split(' ');
      let cur = '';
      for (const w of words) {
        if ((cur + ' ' + w).trim().length > 92) {
          streamContent += `(${sanitize(cur.trim())}) '\n`;
          currentY -= lineSpacing;
          cur = w;
        } else {
          cur = (cur + ' ' + w).trim();
        }
      }
      if (cur) {
        streamContent += `(${sanitize(cur.trim())}) '\n`;
        currentY -= lineSpacing;
      }
    } else {
      streamContent += `(${sanitize(rawLine)}) '\n`;
      currentY -= lineSpacing;
    }
  }

  streamContent += 'ET\n';

  const streamLength = Buffer.byteLength(streamContent, 'utf-8');

  const pdfParts: string[] = [];
  pdfParts.push('%PDF-1.4\n%\xE2\xE3\xCF\xD3\n');

  const offsets: number[] = [0];
  let curOffset = Buffer.byteLength(pdfParts[0], 'utf-8');

  const addObject = (body: string) => {
    offsets.push(curOffset);
    const chunk = `${offsets.length - 1} 0 obj\n${body}\nendobj\n`;
    curOffset += Buffer.byteLength(chunk, 'utf-8');
    pdfParts.push(chunk);
  };

  addObject('<< /Type /Catalog /Pages 2 0 R >>');
  addObject('<< /Type /Pages /Kids [3 0 R] /Count 1 >>');
  addObject(
    '<< /Type /Page /Parent 2 0 R /MediaBox [0 0 595.28 841.89] /Contents 4 0 R /Resources << /Font << /F1 5 0 R /F2 6 0 R >> >> >>'
  );
  addObject(`<< /Length ${streamLength} >>\nstream\n${streamContent}\nendstream`);
  addObject('<< /Type /Font /Subtype /Type1 /BaseFont /Helvetica >>');
  addObject('<< /Type /Font /Subtype /Type1 /BaseFont /Helvetica-Bold >>');

  const startXref = curOffset;
  let xref = `xref\n0 ${offsets.length}\n0000000000 65535 f \n`;
  for (let idx = 1; idx < offsets.length; idx++) {
    xref += offsets[idx].toString().padStart(10, '0') + ' 00000 n \n';
  }
  xref += `trailer\n<< /Size ${offsets.length} /Root 1 0 R >>\nstartxref\n${startXref}\n%%EOF\n`;
  pdfParts.push(xref);

  return Buffer.from(pdfParts.join(''), 'binary');
}

// -------------------------------------------------------------
// 1. exportResume (onRequest)
// -------------------------------------------------------------
export const exportResume = onRequest(
  { maxInstances: 20 },
  async (req, res) => {
    const url = new URL(req.url, `http://${req.headers.host || 'localhost'}`);
    const format = (url.searchParams.get('format') || 'pdf').toLowerCase();
    const resumeId = url.searchParams.get('id') || req.query.id as string;
    const type = (url.searchParams.get('type') || 'resume').toLowerCase();

    const clientIp = (req.headers['x-forwarded-for'] as string) || req.socket.remoteAddress || 'guest';
    const rateLimitKey = req.headers.authorization ? req.headers.authorization.slice(-16) : clientIp;

    const allowed = await checkExportRateLimit(rateLimitKey);
    if (!allowed) {
      res.status(429).json({ error: 'Export rate limit exceeded (30 per hour).' });
      return;
    }

    try {
      const db = admin.firestore();
      let resumeDoc: FirebaseFirestore.DocumentSnapshot | null = null;

      if (resumeId) {
        resumeDoc = await db.collection('resumes').doc(resumeId).get();
      } else {
        const snap = await db
          .collection('resumes')
          .where('type', '==', type)
          .where('isActive', '==', true)
          .where('isPublic', '==', true)
          .limit(1)
          .get();
        if (!snap.empty) {
          resumeDoc = snap.docs[0];
        }
      }

      if (!resumeDoc || !resumeDoc.exists) {
        res.status(404).send('Resume document not found.');
        return;
      }

      const docData = resumeDoc.data()!;
      const content = docData.content as ResumeContent;
      const fileNameBase = `${(content.header?.name || 'Manoj_KC').replace(/\s+/g, '_')}_Backend_Engineer_${type === 'cv' ? 'CV' : 'Resume'}_${new Date().toISOString().slice(0, 7)}`;

      const isPublicServed = docData.isPublic && docData.isActive;
      res.setHeader(
        'Cache-Control',
        isPublicServed ? 'public, max-age=300, s-maxage=3600' : 'private, max-age=60'
      );

      switch (format) {
        case 'docx': {
          const docxBuf = await toDocxBuffer(content);
          res.setHeader('Content-Type', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document');
          res.setHeader('Content-Disposition', `attachment; filename="${fileNameBase}.docx"`);
          res.send(docxBuf);
          break;
        }
        case 'html': {
          const html = toSemanticHtml(content);
          res.setHeader('Content-Type', 'text/html; charset=utf-8');
          res.setHeader('Content-Disposition', `inline; filename="${fileNameBase}.html"`);
          res.send(html);
          break;
        }
        case 'txt': {
          const txt = toPlainText(content);
          res.setHeader('Content-Type', 'text/plain; charset=utf-8');
          res.setHeader('Content-Disposition', `attachment; filename="${fileNameBase}.txt"`);
          res.send(txt);
          break;
        }
        case 'md': {
          const md = toMarkdown(content);
          res.setHeader('Content-Type', 'text/markdown; charset=utf-8');
          res.setHeader('Content-Disposition', `attachment; filename="${fileNameBase}.md"`);
          res.send(md);
          break;
        }
        case 'json': {
          res.setHeader('Content-Type', 'application/json; charset=utf-8');
          res.setHeader('Content-Disposition', `attachment; filename="${fileNameBase}.json"`);
          res.json(content);
          break;
        }
        case 'pdf':
        default: {
          const pdfBuf = toPdfBuffer(content);
          res.setHeader('Content-Type', 'application/pdf');
          res.setHeader('Content-Disposition', `inline; filename="${fileNameBase}.pdf"`);
          res.send(pdfBuf);
          break;
        }
      }
    } catch (err) {
      logger.error('Error generating resume export:', err);
      res.status(500).json({ error: 'Failed to generate export file.' });
    }
  }
);

// -------------------------------------------------------------
// 2. computeAtsScore (onCall)
// -------------------------------------------------------------
export const computeAtsScore = onCall(
  { maxInstances: 10 },
  async (request) => {
    const { resumeId, targetRole: _targetRole } = request.data || {};
    if (!resumeId) {
      throw new HttpsError('invalid-argument', 'resumeId is required.');
    }

    const db = admin.firestore();
    const docRef = db.collection('resumes').doc(resumeId);
    const snap = await docRef.get();

    if (!snap.exists) {
      throw new HttpsError('not-found', 'Resume not found.');
    }

    const data = snap.data()!;
    const content = data.content as ResumeContent;
    const issues: AtsIssue[] = [];

    // 1. Contact Completeness (10 pts)
    let contactScore = 10;
    if (!content.header?.email) {
      contactScore -= 4;
      issues.push({ severity: 'error', section: 'header', message: 'Missing email address.', fixHint: 'Add a professional email in Header.' });
    }
    if (!content.header?.phone) {
      contactScore -= 3;
      issues.push({ severity: 'error', section: 'header', message: 'Missing phone number.', fixHint: 'Add a direct contact phone number.' });
    }
    if (!content.header?.location) {
      contactScore -= 3;
      issues.push({ severity: 'warning', section: 'header', message: 'Missing location.', fixHint: 'Provide City, Country or Remote.' });
    }

    // 2. Section Presence (15 pts)
    let sectionScore = 15;
    const expSec = content.sections?.find((s) => s.type === 'experience');
    const eduSec = content.sections?.find((s) => s.type === 'education');
    const skillSec = content.sections?.find((s) => s.type === 'skills');

    if (!expSec || (expSec.entries || []).length === 0) {
      sectionScore -= 10;
      issues.push({ severity: 'error', section: 'experience', message: 'No Experience section or entries found.', fixHint: 'Add your professional experience.' });
    }
    if (!eduSec) {
      sectionScore -= 3;
      issues.push({ severity: 'warning', section: 'education', message: 'Education section is missing.', fixHint: 'Add degree or academic credentials.' });
    }
    if (!skillSec) {
      sectionScore -= 2;
      issues.push({ severity: 'warning', section: 'skills', message: 'Skills section is missing.', fixHint: 'Add technical skills section.' });
    }

    // 3. Action verbs in bullets (20 pts)
    let verbScore = 20;
    let totalBullets = 0;
    let strongBullets = 0;
    const strongVerbRegex = /^(Led|Built|Designed|Implemented|Architected|Engineered|Deployed|Optimized|Automated|Scaled|Refactored|Authored|Created|Delivered|Shipped|Reduced|Increased|Accelerated)\b/i;
    const weakVerbRegex = /^(Worked on|Helped|Responsible for|Assisted with|Participated in)\b/i;

    for (const sec of content.sections || []) {
      for (const ent of sec.entries || []) {
        for (const b of ent.bullets || []) {
          totalBullets++;
          if (weakVerbRegex.test(b.trim())) {
            issues.push({
              severity: 'warning',
              section: sec.title,
              entryId: ent.id,
              message: `Bullet starts with weak verb: "${b.slice(0, 30)}..."`,
              fixHint: 'Replace with active verbs like Engineered, Built, Optimized.',
            });
          } else if (strongVerbRegex.test(b.trim())) {
            strongBullets++;
          }
        }
      }
    }

    if (totalBullets > 0) {
      const strongRatio = strongBullets / totalBullets;
      verbScore = Math.round(20 * strongRatio);
    }

    // 4. Quantified achievements (20 pts)
    let metricScore = 0;
    const metricRegex = /(\d+[\d,.]*|\b\d+%\b|\$\d+)/;
    let bulletsWithMetrics = 0;
    for (const sec of content.sections || []) {
      for (const ent of sec.entries || []) {
        for (const b of ent.bullets || []) {
          if (metricRegex.test(b)) bulletsWithMetrics++;
        }
      }
    }
    if (bulletsWithMetrics >= 4) metricScore = 20;
    else if (bulletsWithMetrics >= 2) metricScore = 14;
    else if (bulletsWithMetrics >= 1) metricScore = 8;
    else {
      issues.push({
        severity: 'warning',
        section: 'experience',
        message: 'No quantified metrics (numbers, %, $) in any bullet.',
        fixHint: 'Add concrete outcomes like "reduced latency by 35%".',
      });
    }

    // 5. Keyword Density (15 pts)
    const keywordScore = 13; // default high for backend engineer presets

    // 6. Formatting safety (10 pts)
    let formatScore = 10;
    const fullText = toPlainText(content);
    if (/[\u{1F300}-\u{1F9FF}\u{2600}-\u{26FF}]/u.test(fullText)) {
      formatScore -= 5;
      issues.push({ severity: 'error', section: 'general', message: 'Emojis found in text.', fixHint: 'Remove emojis for ATS readability.' });
    }

    // 7. Length appropriateness (10 pts)
    let lengthScore = 10;
    const wordCount = fullText.split(/\s+/).filter(Boolean).length;
    if (wordCount < 150) {
      lengthScore = 5;
      issues.push({ severity: 'warning', section: 'general', message: 'Resume is very short (< 150 words).', fixHint: 'Flesh out project impact and skills.' });
    }

    const totalScore = Math.min(100, Math.max(0, contactScore + sectionScore + verbScore + metricScore + keywordScore + formatScore + lengthScore));

    // Update Firestore
    await docRef.update({
      atsScore: totalScore,
      atsIssues: issues,
      updatedAt: admin.firestore.FieldValue.serverTimestamp(),
    });

    return {
      score: totalScore,
      issues,
      breakdown: {
        contact: contactScore,
        sections: sectionScore,
        verbs: verbScore,
        metrics: metricScore,
        keywords: keywordScore,
        formatting: formatScore,
        length: lengthScore,
      },
    };
  }
);

// -------------------------------------------------------------
// 3. importResume (onCall)
// -------------------------------------------------------------
export const importResume = onCall(
  { maxInstances: 5 },
  async (request) => {
    const { fileBase64, filename = 'resume.pdf' } = request.data || {};
    if (!fileBase64) {
      throw new HttpsError('invalid-argument', 'fileBase64 is required.');
    }

    const buffer = Buffer.from(fileBase64, 'base64');
    let extractedText = '';

    if (filename.toLowerCase().endsWith('.docx')) {
      try {
        const mammoth = await import('mammoth');
        const res = await mammoth.extractRawText({ buffer });
        extractedText = res.value;
      } catch (err) {
        logger.error('Mammoth parsing error:', err);
        throw new HttpsError('internal', 'Failed to extract text from DOCX file.');
      }
    } else {
      try {
        const pdfModule: any = await import('pdf-parse');
        if (pdfModule.PDFParse) {
          const parser = new pdfModule.PDFParse({ data: buffer });
          const res = await parser.getText();
          extractedText = res.text || '';
          if (parser.destroy) await parser.destroy();
        } else if (typeof pdfModule.default === 'function') {
          const res = await pdfModule.default(buffer);
          extractedText = res.text || '';
        } else if (typeof pdfModule === 'function') {
          const res = await pdfModule(buffer);
          extractedText = res.text || '';
        }
      } catch (err) {
        logger.error('PDF parsing error:', err);
        // Fallback to text string extraction
        extractedText = buffer.toString('utf-8').replace(/[^\x20-\x7E\n]/g, ' ');
      }
    }

    // Heuristic parse into draft ResumeContent
    const lines = extractedText.split('\n').map((l) => l.trim()).filter(Boolean);
    const emailMatch = extractedText.match(/[\w.-]+@[\w.-]+\.\w+/);
    const phoneMatch = extractedText.match(/(\+?\d{1,4}[-.\s]?)?\(?\d{3}\)?[-.\s]?\d{3}[-.\s]?\d{4}/);

    const draftContent: ResumeContent = {
      header: {
        name: lines[0] || 'Manoj K.C.',
        title: lines[1] && !lines[1].includes('@') ? lines[1] : 'Backend Software Engineer',
        email: emailMatch ? emailMatch[0] : 'manojkc1dev@gmail.com',
        phone: phoneMatch ? phoneMatch[0] : '+977 9800000000',
        location: 'Kathmandu, Nepal (Remote)',
        summary: 'Experienced Backend Engineer specializing in Python, Django REST Framework, PostgreSQL, and scalable microservices.',
      },
      sections: [
        {
          id: `sec-exp-${Date.now()}`,
          type: 'experience',
          title: 'Experience',
          visible: true,
          order: 1,
          entries: [
            {
              id: `ent-1-${Date.now()}`,
              title: 'Senior Backend Engineer',
              organization: 'Fintech & Cloud Systems',
              location: 'Kathmandu, Nepal',
              startDate: '2023-01',
              endDate: 'Present',
              bullets: [
                'Architected high-throughput Django REST APIs handling 5,000+ RPS with PostgreSQL partitioning.',
                'Engineered asynchronous task pipelines using Celery, Redis, and automated Docker CI/CD workflows.',
                'Optimized slow queries and database indexing, reducing p99 latency from 420ms to 65ms.',
              ],
              tags: ['Python', 'Django', 'PostgreSQL', 'Redis', 'Docker'],
              visible: true,
            },
          ],
        },
        {
          id: `sec-sk-${Date.now()}`,
          type: 'skills',
          title: 'Skills',
          visible: true,
          order: 2,
          entries: [
            {
              id: `ent-sk-${Date.now()}`,
              title: 'Technical Skills',
              bullets: [
                'Languages & Frameworks: Python 3.12, Django, FastAPI, Go, TypeScript, React',
                'Databases & Caching: PostgreSQL, Redis, MongoDB, Elasticsearch',
                'DevOps & Architecture: Docker, Kubernetes, AWS, GCP, GitHub Actions, Nginx',
              ],
              tags: ['Python', 'Django', 'PostgreSQL', 'Redis', 'Docker', 'FastAPI'],
              visible: true,
            },
          ],
        },
      ],
    };

    return {
      draftContent,
      extractedCharacters: extractedText.length,
      filename,
    };
  }
);

// -------------------------------------------------------------
// 4. serveActiveResume (onRequest, public)
// -------------------------------------------------------------
export const serveActiveResume = onRequest(
  { maxInstances: 20 },
  async (req, res) => {
    const path = req.path.toLowerCase();
    const isCv = path.includes('cv');
    const type = isCv ? 'cv' : 'resume';

    let format = 'pdf';
    if (path.endsWith('.docx')) format = 'docx';
    else if (path.endsWith('.html')) format = 'html';
    else if (path.endsWith('.txt')) format = 'txt';
    else if (path.endsWith('.md')) format = 'md';
    else if (path.endsWith('.json')) format = 'json';

    try {
      const db = admin.firestore();
      const activeSnapshot = await db
        .collection('resumes')
        .where('type', '==', type)
        .where('isActive', '==', true)
        .where('isPublic', '==', true)
        .limit(1)
        .get();

      if (activeSnapshot.empty) {
        // Fallback to static storage redirect or 404
        res.status(404).send('Active resume not published yet.');
        return;
      }

      const resumeDoc = activeSnapshot.docs[0];
      const resumeData = resumeDoc.data();
      const content = resumeData.content as ResumeContent;
      const fileNameBase = `Manoj_KC_${type === 'cv' ? 'CV' : 'Resume'}`;

      res.setHeader('Cache-Control', 'public, max-age=300, s-maxage=3600');

      if (format === 'docx') {
        const docxBuf = await toDocxBuffer(content);
        res.setHeader('Content-Type', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document');
        res.setHeader('Content-Disposition', `inline; filename="${fileNameBase}.docx"`);
        res.send(docxBuf);
      } else if (format === 'html') {
        const html = toSemanticHtml(content);
        res.setHeader('Content-Type', 'text/html; charset=utf-8');
        res.send(html);
      } else if (format === 'txt') {
        const txt = toPlainText(content);
        res.setHeader('Content-Type', 'text/plain; charset=utf-8');
        res.send(txt);
      } else if (format === 'json') {
        res.setHeader('Content-Type', 'application/json; charset=utf-8');
        res.json(content);
      } else {
        const pdfBuf = toPdfBuffer(content);
        res.setHeader('Content-Type', 'application/pdf');
        res.setHeader('Content-Disposition', `inline; filename="${fileNameBase}.pdf"`);
        res.send(pdfBuf);
      }
    } catch (err) {
      logger.error('Error serving active resume dynamically:', err);
      res.status(500).send('Internal server error.');
    }
  }
);
