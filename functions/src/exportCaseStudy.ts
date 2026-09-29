import { onRequest } from 'firebase-functions/v2/https';
import * as logger from 'firebase-functions/logger';
import * as admin from 'firebase-admin';
import crypto from 'node:crypto';
import { projects, type Project } from './data/projects.js';

function sanitizePdfText(str: string): string {
  return str
    .replace(/\\/g, '\\\\')
    .replace(/\(/g, '\\(')
    .replace(/\)/g, '\\)')
    .replace(/[^\x20-\x7E\n]/g, ' '); // ASCII-safe
}

function wrapText(text: string, maxChars: number): string[] {
  const words = text.split(/\s+/);
  const lines: string[] = [];
  let cur = '';

  for (const w of words) {
    if ((cur + ' ' + w).trim().length > maxChars) {
      if (cur) lines.push(cur.trim());
      cur = w;
    } else {
      cur = (cur + ' ' + w).trim();
    }
  }
  if (cur) lines.push(cur.trim());
  return lines;
}

export function generateCaseStudyPdfBuffer(p: Project): Buffer {
  // Page 1 Content Stream
  let p1 = 'BT\n';
  p1 += '/F2 9 Tf\n1 0 0 1 54 745 Tm\n(MANOJ K.C.  |  BACKEND SOFTWARE ENGINEER  |  CASE STUDY) Tj\n';
  p1 += 'ET\n';

  // Title
  p1 += 'BT\n/F2 16 Tf\n1 0 0 1 54 722 Tm\n(' + sanitizePdfText(p.title) + ') Tj\nET\n';

  // Meta row
  const metaLine = [
    p.role ? `Role: ${p.role}` : '',
    p.duration ? `Duration: ${p.duration}` : '',
    p.year ? `Year: ${p.year}` : '',
    p.status ? `Status: ${p.status.toUpperCase()}` : '',
  ].filter(Boolean).join('   |   ');

  p1 += 'BT\n/F1 9 Tf\n0.3 0.3 0.3 rg\n1 0 0 1 54 705 Tm\n(' + sanitizePdfText(metaLine) + ') Tj\n0 0 0 rg\nET\n';

  // Tagline
  p1 += 'BT\n/F1 10.5 Tf\n1 0 0 1 54 688 Tm\n(' + sanitizePdfText(p.tagline) + ') Tj\nET\n';

  // Metrics Bar
  let y = 665;
  if (p.metrics && p.metrics.length > 0) {
    p1 += 'BT\n/F2 10 Tf\n0.31 0.27 0.9 rg\n1 0 0 1 54 ' + y + ' Tm\n(VERIFIED PERFORMANCE METRICS) Tj\n0 0 0 rg\nET\n';
    y -= 14;

    const metricText = p.metrics.map((m) => `[${m.label}: ${m.value}]`).join('   ');
    p1 += 'BT\n/F2 9.5 Tf\n1 0 0 1 54 ' + y + ' Tm\n(' + sanitizePdfText(metricText) + ') Tj\nET\n';
    y -= 20;
  }

  // Section: The Problem
  if (p.problem) {
    p1 += 'BT\n/F2 11 Tf\n1 0 0 1 54 ' + y + ' Tm\n(THE PROBLEM) Tj\nET\n';
    y -= 14;
    const problemLines = wrapText(p.problem, 92);
    p1 += 'BT\n/F1 9 Tf\n12 TL\n1 0 0 1 54 ' + y + ' Tm\n';
    for (const line of problemLines.slice(0, 6)) {
      p1 += '(' + sanitizePdfText(line) + ') \'\n';
      y -= 12;
    }
    p1 += 'ET\n';
    y -= 10;
  }

  // Section: System Design & Solution
  if (p.solution) {
    p1 += 'BT\n/F2 11 Tf\n1 0 0 1 54 ' + y + ' Tm\n(THE ARCHITECTURAL SOLUTION) Tj\nET\n';
    y -= 14;
    const solutionLines = wrapText(p.solution, 92);
    p1 += 'BT\n/F1 9 Tf\n12 TL\n1 0 0 1 54 ' + y + ' Tm\n';
    for (const line of solutionLines.slice(0, 6)) {
      p1 += '(' + sanitizePdfText(line) + ') \'\n';
      y -= 12;
    }
    p1 += 'ET\n';
    y -= 10;
  }

  // Section: What I Built Bullets
  if (p.whatIBuilt && p.whatIBuilt.length > 0) {
    p1 += 'BT\n/F2 11 Tf\n1 0 0 1 54 ' + y + ' Tm\n(WHAT I PERSONALLY SHIPPED) Tj\nET\n';
    y -= 14;
    for (const bullet of p.whatIBuilt.slice(0, 6)) {
      const bLines = wrapText(bullet, 88);
      p1 += 'BT\n/F1 8.5 Tf\n11.5 TL\n1 0 0 1 54 ' + y + ' Tm\n';
      p1 += '(* ) Tj\n';
      for (const bl of bLines) {
        p1 += '(' + sanitizePdfText(bl) + ') \'\n';
        y -= 11.5;
      }
      p1 += 'ET\n';
      y -= 2;
    }
  }

  // Footer Page 1
  p1 += 'BT\n/F1 8 Tf\n0.4 0.4 0.4 rg\n1 0 0 1 54 36 Tm\n(Page 1 of 2  -  https://manojkc1.com.np/projects/' + p.id + ') Tj\n0 0 0 rg\nET\n';

  // Page 2 Content Stream
  let p2 = 'BT\n';
  p2 += '/F2 9 Tf\n1 0 0 1 54 745 Tm\n(MANOJ K.C.  |  TECHNICAL DEEP DIVE  |  ' + sanitizePdfText(p.title.split('|')[0].trim().toUpperCase()) + ') Tj\n';
  p2 += 'ET\n';

  let y2 = 722;

  // Tech Stack Table
  if (p.techStackTable && p.techStackTable.length > 0) {
    p2 += 'BT\n/F2 11 Tf\n1 0 0 1 54 ' + y2 + ' Tm\n(ENGINEERING STACK & DESIGN RATIONALE) Tj\nET\n';
    y2 -= 16;
    for (const row of p.techStackTable.slice(0, 5)) {
      p2 += 'BT\n/F2 9 Tf\n1 0 0 1 54 ' + y2 + ' Tm\n([' + sanitizePdfText(row.layer) + '] ' + sanitizePdfText(row.choice) + ') Tj\nET\n';
      y2 -= 12;
      const whyLines = wrapText(row.why, 90);
      p2 += 'BT\n/F1 8.5 Tf\n11 TL\n1 0 0 1 68 ' + y2 + ' Tm\n';
      for (const wl of whyLines.slice(0, 2)) {
        p2 += '(' + sanitizePdfText(wl) + ') \'\n';
        y2 -= 11;
      }
      p2 += 'ET\n';
      y2 -= 4;
    }
    y2 -= 8;
  }

  // Challenges & Technical Solutions
  if (p.challenges && p.challenges.length > 0) {
    p2 += 'BT\n/F2 11 Tf\n1 0 0 1 54 ' + y2 + ' Tm\n(CORE CHALLENGES & MEASURED OUTCOMES) Tj\nET\n';
    y2 -= 16;
    for (const c of p.challenges.slice(0, 3)) {
      p2 += 'BT\n/F2 9 Tf\n1 0 0 1 54 ' + y2 + ' Tm\n(Challenge: ' + sanitizePdfText(c.title) + ') Tj\nET\n';
      y2 -= 12;

      const appLines = wrapText('Approach: ' + c.approach, 90);
      p2 += 'BT\n/F1 8.5 Tf\n11 TL\n1 0 0 1 68 ' + y2 + ' Tm\n';
      for (const al of appLines.slice(0, 2)) {
        p2 += '(' + sanitizePdfText(al) + ') \'\n';
        y2 -= 11;
      }
      p2 += 'ET\n';

      const outLines = wrapText('Outcome: ' + c.outcome, 90);
      p2 += 'BT\n/F2 8.5 Tf\n0.1 0.5 0.2 rg\n11 TL\n1 0 0 1 68 ' + y2 + ' Tm\n';
      for (const ol of outLines.slice(0, 2)) {
        p2 += '(' + sanitizePdfText(ol) + ') \'\n';
        y2 -= 11;
      }
      p2 += '0 0 0 rg\nET\n';
      y2 -= 4;
    }
    y2 -= 8;
  }

  // Key Lessons Learned
  if (p.lessonsLearned && p.lessonsLearned.length > 0) {
    p2 += 'BT\n/F2 11 Tf\n1 0 0 1 54 ' + y2 + ' Tm\n(KEY LESSONS LEARNED) Tj\nET\n';
    y2 -= 14;
    for (const l of p.lessonsLearned.slice(0, 3)) {
      const lLines = wrapText('- ' + l, 90);
      p2 += 'BT\n/F1 8.5 Tf\n11 TL\n1 0 0 1 54 ' + y2 + ' Tm\n';
      for (const ll of lLines.slice(0, 2)) {
        p2 += '(' + sanitizePdfText(ll) + ') \'\n';
        y2 -= 11;
      }
      p2 += 'ET\n';
      y2 -= 2;
    }
    y2 -= 8;
  }

  // Contact & Verification Box
  p2 += 'BT\n/F2 10 Tf\n1 0 0 1 54 ' + y2 + ' Tm\n(ENGINEER CONTACT & VERIFICATION) Tj\nET\n';
  y2 -= 14;
  p2 += 'BT\n/F1 9 Tf\n1 0 0 1 54 ' + y2 + ' Tm\n(Manoj K.C. | Kathmandu, Nepal | Email: manojkc1@gmail.com | Phone: +977 9842203976) Tj\nET\n';
  y2 -= 13;
  p2 += 'BT\n/F1 9 Tf\n1 0 0 1 54 ' + y2 + ' Tm\n(GitHub: https://github.com/manojkc1dev | Portfolio: https://manojkc1.com.np) Tj\nET\n';

  // Footer Page 2
  p2 += 'BT\n/F1 8 Tf\n0.4 0.4 0.4 rg\n1 0 0 1 54 36 Tm\n(Page 2 of 2  -  Generated live from manojkc1.com.np) Tj\n0 0 0 rg\nET\n';

  const s1Bytes = Buffer.from(p1, 'utf-8');
  const s2Bytes = Buffer.from(p2, 'utf-8');

  // Build PDF 1.4 Object Stream
  const objects: Buffer[] = [];
  const offsets: number[] = [];

  const addObj = (content: string | Buffer) => {
    const buf = typeof content === 'string' ? Buffer.from(content, 'utf-8') : content;
    objects.push(buf);
  };

  addObj('%PDF-1.4\n');

  // 1: Catalog
  addObj('1 0 obj\n<< /Type /Catalog /Pages 2 0 R >>\nendobj\n');

  // 2: Pages
  addObj('2 0 obj\n<< /Type /Pages /Kids [ 3 0 R 4 0 R ] /Count 2 >>\nendobj\n');

  // 3: Page 1
  addObj('3 0 obj\n<< /Type /Page /Parent 2 0 R /MediaBox [ 0 0 612 792 ] /Resources << /Font << /F1 5 0 R /F2 6 0 R >> >> /Contents 7 0 R >>\nendobj\n');

  // 4: Page 2
  addObj('4 0 obj\n<< /Type /Page /Parent 2 0 R /MediaBox [ 0 0 612 792 ] /Resources << /Font << /F1 5 0 R /F2 6 0 R >> >> /Contents 8 0 R >>\nendobj\n');

  // 5: Font F1 (Helvetica)
  addObj('5 0 obj\n<< /Type /Font /Subtype /Type1 /BaseFont /Helvetica >>\nendobj\n');

  // 6: Font F2 (Helvetica-Bold)
  addObj('6 0 obj\n<< /Type /Font /Subtype /Type1 /BaseFont /Helvetica-Bold >>\nendobj\n');

  // 7: Stream Page 1
  addObj(`7 0 obj\n<< /Length ${s1Bytes.length} >>\nstream\n`);
  addObj(s1Bytes);
  addObj('\nendstream\nendobj\n');

  // 8: Stream Page 2
  addObj(`8 0 obj\n<< /Length ${s2Bytes.length} >>\nstream\n`);
  addObj(s2Bytes);
  addObj('\nendstream\nendobj\n');

  // Calculate byte offsets for XRef
  let currentOffset = 0;
  offsets.push(0); // 0th entry

  // Loop through objects to compute exact offsets
  let fullHeader = objects[0];
  currentOffset += fullHeader.length;

  for (let i = 1; i <= 8; i++) {
    offsets.push(currentOffset);
    // Find matching object buffers
    let objBuf: Buffer;
    if (i === 7) {
      objBuf = Buffer.concat([objects[7], objects[8], objects[9]]);
    } else if (i === 8) {
      objBuf = Buffer.concat([objects[10], objects[11], objects[12]]);
    } else {
      objBuf = objects[i];
    }
    currentOffset += objBuf.length;
  }

  // Cross Reference Table
  let xref = 'xref\n0 9\n0000000000 65535 f \n';
  for (let i = 1; i <= 8; i++) {
    xref += String(offsets[i]).padStart(10, '0') + ' 00000 n \n';
  }

  const trailer = `trailer\n<< /Size 9 /Root 1 0 R >>\nstartxref\n${currentOffset}\n%%EOF\n`;

  const finalParts = [
    objects[0], // header
    objects[1], // 1 0 obj
    objects[2], // 2 0 obj
    objects[3], // 3 0 obj
    objects[4], // 4 0 obj
    objects[5], // 5 0 obj
    objects[6], // 6 0 obj
    objects[7], objects[8], objects[9], // 7 0 obj
    objects[10], objects[11], objects[12], // 8 0 obj
    Buffer.from(xref, 'utf-8'),
    Buffer.from(trailer, 'utf-8'),
  ];

  return Buffer.concat(finalParts);
}

export const exportCaseStudy = onRequest(
  {
    cors: true,
    maxInstances: 10,
  },
  async (req, res) => {
    try {
      // Extract slug from URL path or query params
      // Supports /api/projects/:slug/case-study.pdf, /:slug/case-study.pdf, or ?slug=agritech
      let slug = (req.query.slug as string) || '';

      if (!slug) {
        const pathParts = req.path.split('/').filter(Boolean);
        const caseStudyIdx = pathParts.findIndex((part) => part === 'case-study.pdf');
        if (caseStudyIdx > 0) {
          slug = pathParts[caseStudyIdx - 1];
        } else {
          // Fallback to last non-pdf path part
          slug = pathParts[pathParts.length - 1]?.replace('.pdf', '') || '';
        }
      }

      slug = slug.toLowerCase().trim();
      const project = projects.find((p) => p.id === slug);

      if (!project) {
        res.status(404).json({
          error: `Project '${slug}' not found for case study export.`,
          availableProjects: projects.map((p) => p.id),
        });
        return;
      }

      // Check sufficient data for export
      if (!project.tagline || !project.problem || !project.solution) {
        res.status(400).json({
          error: `Project '${slug}' has insufficient case study data to generate a complete PDF.`,
        });
        return;
      }

      const storagePath = `case-studies/${project.id}.pdf`;
      let pdfBuffer: Buffer | null = null;
      let cached = false;

      // Try reading from Firebase Storage if configured
      try {
        const bucket = admin.storage().bucket();
        const file = bucket.file(storagePath);
        const [exists] = await file.exists();
        if (exists) {
          const [metadata] = await file.getMetadata();
          const contentHash = crypto.createHash('md5').update(JSON.stringify(project)).digest('hex');
          if (metadata.metadata?.projectHash === contentHash) {
            const [downloaded] = await file.download();
            pdfBuffer = downloaded;
            cached = true;
          }
        }
      } catch (storageErr) {
        logger.info('Storage cache bypass/fallback:', storageErr);
      }

      if (!pdfBuffer) {
        pdfBuffer = generateCaseStudyPdfBuffer(project);

        // Save to Storage in background
        try {
          const bucket = admin.storage().bucket();
          const file = bucket.file(storagePath);
          const contentHash = crypto.createHash('md5').update(JSON.stringify(project)).digest('hex');
          await file.save(pdfBuffer, {
            contentType: 'application/pdf',
            metadata: {
              metadata: {
                projectHash: contentHash,
                projectId: project.id,
              },
            },
          });
        } catch (saveErr) {
          logger.warn('Storage save notice (non-fatal):', saveErr);
        }
      }

      // Fire-and-forget record update in Firestore /case_study_exports
      try {
        const docRef = admin.firestore().collection('case_study_exports').doc(project.id);
        await docRef.set(
          {
            id: project.id,
            projectId: project.id,
            storagePath,
            downloadUrl: `/api/projects/${project.id}/case-study.pdf`,
            generatedAt: admin.firestore.FieldValue.serverTimestamp(),
            generatedBy: 'system',
            downloadCount: admin.firestore.FieldValue.increment(1),
            cached,
          },
          { merge: true }
        );
      } catch (dbErr) {
        logger.warn('Firestore case study export tracking notice:', dbErr);
      }

      res.setHeader('Content-Type', 'application/pdf');
      res.setHeader('Content-Disposition', `inline; filename="${project.id}-manoj-kc.pdf"`);
      res.setHeader('Cache-Control', 'public, max-age=3600');
      res.status(200).send(pdfBuffer);
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : 'Unknown error';
      logger.error('Error generating case study PDF:', { error: msg });
      res.status(500).json({ error: 'Failed to generate case study PDF.' });
    }
  }
);
