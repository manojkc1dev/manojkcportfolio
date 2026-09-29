import type { ResumeContent } from '../schema';
import { toText } from './toText';

/**
 * Creates a standards-compliant PDF 1.4 buffer with embedded text stream
 * sized in true ISO A4 ratio (210mm x 297mm = 595.28pt x 841.89pt).
 * Includes multi-page pagination when content exceeds 1 page.
 */
export function createAtsPdfBuffer(content: ResumeContent): Buffer {
  const plainText = toText(content);
  const rawLines = plainText.split('\n');

  // Escape parentheses and backslashes for PDF string literals
  const sanitize = (str: string) =>
    str.replace(/\\/g, '\\\\').replace(/\(/g, '\\(').replace(/\)/g, '\\)');

  // A4 geometry in points (72 points = 1 inch, 1 pt = 0.3527 mm)
  // Width: 210mm = 595.28 pt
  // Height: 297mm = 841.89 pt
  const PAGE_WIDTH = 595.28;
  const PAGE_HEIGHT = 841.89;
  const MARGIN_LEFT = 50.0;
  const MARGIN_TOP = 790.0;
  const MARGIN_BOTTOM = 54.0;
  const LINE_HEIGHT = 13.5;

  // Split lines across pages
  const pageStreams: string[] = [];
  let currentStream = '';
  let currentY = MARGIN_TOP;

  const startNewPage = () => {
    if (currentStream) {
      currentStream += 'ET\n';
      pageStreams.push(currentStream);
    }
    currentStream = `BT\n/F1 10 Tf\n14.5 TL\n1 0 0 1 ${MARGIN_LEFT} ${MARGIN_TOP} Tm\n`;
    currentY = MARGIN_TOP;
  };

  startNewPage();

  for (let i = 0; i < rawLines.length; i++) {
    const rawLine = rawLines[i];

    // Check if we need a page break
    if (currentY - LINE_HEIGHT < MARGIN_BOTTOM) {
      startNewPage();
    }

    if (i === 0) {
      // First line: Candidate Name in 18pt Helvetica-Bold
      currentStream += `ET\nBT\n/F2 18 Tf\n1 0 0 1 ${MARGIN_LEFT} ${currentY} Tm\n(${sanitize(rawLine)}) Tj\nET\nBT\n/F1 9.5 Tf\n1 0 0 1 ${MARGIN_LEFT} ${currentY - 22} Tm\n`;
      currentY -= 24;
      continue;
    }

    if (rawLine.startsWith('---') || rawLine.startsWith('===') || rawLine.trim().length === 0) {
      currentY -= 6;
      currentStream += `ET\nBT\n/F1 9.5 Tf\n1 0 0 1 ${MARGIN_LEFT} ${currentY} Tm\n`;
      continue;
    }

    const isSectionHeader = /^[A-Z\s&]{4,}$/.test(rawLine);
    if (isSectionHeader) {
      if (currentY - 32 < MARGIN_BOTTOM) {
        startNewPage();
      }
      currentY -= 12;
      currentStream += `ET\nBT\n/F2 11.5 Tf\n1 0 0 1 ${MARGIN_LEFT} ${currentY} Tm\n(${sanitize(rawLine)}) Tj\nET\nBT\n/F1 9.5 Tf\n1 0 0 1 ${MARGIN_LEFT} ${currentY - 14} Tm\n`;
      currentY -= 15;
      continue;
    }

    // Regular bullet or body line
    if (rawLine.length > 92) {
      const words = rawLine.split(' ');
      let cur = '';
      for (const w of words) {
        if ((cur + ' ' + w).trim().length > 90) {
          if (currentY - LINE_HEIGHT < MARGIN_BOTTOM) {
            startNewPage();
          }
          currentStream += `(${sanitize(cur.trim())}) '\n`;
          currentY -= LINE_HEIGHT;
          cur = w;
        } else {
          cur = (cur + ' ' + w).trim();
        }
      }
      if (cur) {
        if (currentY - LINE_HEIGHT < MARGIN_BOTTOM) {
          startNewPage();
        }
        currentStream += `(${sanitize(cur)}) '\n`;
        currentY -= LINE_HEIGHT;
      }
    } else {
      currentStream += `(${sanitize(rawLine)}) '\n`;
      currentY -= LINE_HEIGHT;
    }
  }

  if (currentStream) {
    currentStream += 'ET\n';
    pageStreams.push(currentStream);
  }

  // Generate PDF Objects
  const totalPages = pageStreams.length;
  const pdfParts: string[] = [];
  const offsets: number[] = [0];
  let curOffset = 0;

  const header = '%PDF-1.4\n%\xE2\xE3\xCF\xD3\n';
  pdfParts.push(header);
  curOffset += Buffer.byteLength(header, 'utf-8');

  const addObj = (objBody: string) => {
    offsets.push(curOffset);
    const chunk = `${offsets.length - 1} 0 obj\n${objBody}\nendobj\n`;
    curOffset += Buffer.byteLength(chunk, 'utf-8');
    pdfParts.push(chunk);
    return offsets.length - 1;
  };

  // Obj 1: Catalog
  addObj('<</Type /Catalog /Pages 2 0 R>>');

  // Object indices mapping
  // Obj 2 is Pages parent. Its Kids will be dynamically computed.
  // Obj 3 and onwards:
  // Font 1 (Helvetica)
  // Font 2 (Helvetica-Bold)
  // For each page: Page obj, Content stream obj

  const font1Id = 3;
  const font2Id = 4;

  addObj('<</Type /Font /Subtype /Type1 /BaseFont /Helvetica /Encoding /WinAnsiEncoding>>');
  addObj('<</Type /Font /Subtype /Type1 /BaseFont /Helvetica-Bold /Encoding /WinAnsiEncoding>>');

  const pageObjIds: number[] = [];
  const streamObjIds: number[] = [];

  let nextId = 5;
  for (let p = 0; p < totalPages; p++) {
    pageObjIds.push(nextId);
    nextId++;
    streamObjIds.push(nextId);
    nextId++;
  }

  // Insert Pages Object (Obj 2)
  const kidsArray = pageObjIds.map((id) => `${id} 0 R`).join(' ');
  const pagesBody = `<</Type /Pages /Kids [${kidsArray}] /Count ${totalPages}>>`;
  // We need obj 2 at index 2
  // Let's rebuild in exact sequential order:
  return buildSequentialPdf(totalPages, pageStreams, PAGE_WIDTH, PAGE_HEIGHT);
}

function buildSequentialPdf(
  totalPages: number,
  pageStreams: string[],
  pageWidth: number,
  pageHeight: number
): Buffer {
  const sanitize = (str: string) =>
    str.replace(/\\/g, '\\\\').replace(/\(/g, '\\(').replace(/\)/g, '\\)');

  // Pre-calculate object ids:
  // 1: Catalog
  // 2: Pages
  // 3: Font Helvetica
  // 4: Font Helvetica-Bold
  // For each page p (0..n-1):
  //   pageId = 5 + (p * 2)
  //   streamId = 5 + (p * 2) + 1

  const header = '%PDF-1.4\n%\xE2\xE3\xCF\xD3\n';
  const chunks: string[] = [header];
  const offsets: number[] = [0]; // offset 0 unused
  let curOffset = Buffer.byteLength(header, 'utf-8');

  const addObj = (id: number, body: string) => {
    offsets[id] = curOffset;
    const str = `${id} 0 obj\n${body}\nendobj\n`;
    curOffset += Buffer.byteLength(str, 'utf-8');
    chunks.push(str);
  };

  // 1: Catalog
  addObj(1, '<</Type /Catalog /Pages 2 0 R>>');

  // 2: Pages
  const pageIds = Array.from({ length: totalPages }, (_, i) => 5 + i * 2);
  const kidsStr = pageIds.map((id) => `${id} 0 R`).join(' ');
  addObj(2, `<</Type /Pages /Kids [${kidsStr}] /Count ${totalPages}>>`);

  // 3: Font 1
  addObj(3, '<</Type /Font /Subtype /Type1 /BaseFont /Helvetica /Encoding /WinAnsiEncoding>>');

  // 4: Font 2
  addObj(4, '<</Type /Font /Subtype /Type1 /BaseFont /Helvetica-Bold /Encoding /WinAnsiEncoding>>');

  // Pages & Streams
  for (let i = 0; i < totalPages; i++) {
    const pageId = 5 + i * 2;
    const streamId = pageId + 1;
    let streamText = pageStreams[i];

    // Add page number footer in A4
    const footerText = `Page ${i + 1} of ${totalPages}`;
    streamText += `BT\n/F1 8.5 Tf\n1 0 0 1 270 30 Tm\n(${sanitize(footerText)}) Tj\nET\n`;

    const streamLen = Buffer.byteLength(streamText, 'utf-8');

    // Page object with ISO A4 MediaBox [0 0 595.28 841.89] (aspect ratio 1 : 1.414)
    addObj(
      pageId,
      `<</Type /Page /Parent 2 0 R /MediaBox [0 0 ${pageWidth.toFixed(2)} ${pageHeight.toFixed(2)}] /Contents ${streamId} 0 R /Resources <</Font <</F1 3 0 R /F2 4 0 R>>>>>>`
    );

    // Stream object
    addObj(streamId, `<</Length ${streamLen}>>\nstream\n${streamText}\nendstream`);
  }

  // Cross-reference table
  const totalObjs = 4 + totalPages * 2;
  const startXref = curOffset;
  let xref = `xref\n0 ${totalObjs + 1}\n0000000000 65535 f \n`;
  for (let i = 1; i <= totalObjs; i++) {
    xref += `${String(offsets[i] || 0).padStart(10, '0')} 00000 n \n`;
  }
  xref += `trailer\n<</Size ${totalObjs + 1} /Root 1 0 R>>\nstartxref\n${startXref}\n%%EOF\n`;
  chunks.push(xref);

  return Buffer.from(chunks.join(''), 'binary');
}

export function createAtsPdfBlob(content: ResumeContent): Blob {
  const buf = createAtsPdfBuffer(content);
  return new Blob([buf], { type: 'application/pdf' });
}
