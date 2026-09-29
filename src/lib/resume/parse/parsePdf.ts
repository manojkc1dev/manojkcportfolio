import type { ResumeContent } from '../schema';
import { parseRawTextToResumeContent } from './parseTextToResume';

export async function parsePdf(bufferOrArrayBuffer: ArrayBuffer | Buffer): Promise<ResumeContent> {
  try {
    let rawText = '';

    let buffer: Buffer;
    if (typeof Buffer !== 'undefined' && Buffer.isBuffer(bufferOrArrayBuffer)) {
      buffer = bufferOrArrayBuffer;
    } else {
      buffer = Buffer.from(bufferOrArrayBuffer as ArrayBuffer);
    }

    try {
      const pdfModule: any = await import('pdf-parse');
      if (pdfModule.PDFParse) {
        const parser = new pdfModule.PDFParse({ data: buffer });
        const result = await parser.getText();
        rawText = result.text || '';
        if (parser.destroy) {
          await parser.destroy();
        }
      } else if (typeof pdfModule.default === 'function') {
        const data = await pdfModule.default(buffer);
        rawText = data.text || '';
      } else if (typeof pdfModule === 'function') {
        const data = await pdfModule(buffer);
        rawText = data.text || '';
      }
    } catch (importErr) {
      // Stream fallback if binary string is available
      const binaryString = buffer.toString('binary');
      const textMatches = binaryString.match(/\(([^)]+)\)\s*Tj/g) || binaryString.match(/\(([^)]+)\)\s*'/g);
      if (textMatches) {
        rawText = textMatches
          .map((m) => m.replace(/\(|\)|Tj|'/g, ' ').trim())
          .join('\n');
      } else {
        rawText = binaryString
          .replace(/[^\x20-\x7E\n\r]/g, ' ')
          .replace(/\s{2,}/g, ' ');
      }
    }

    if (!rawText.trim()) {
      throw new Error('PDF file could not be parsed or contains only scanned raster images.');
    }

    return parseRawTextToResumeContent(rawText);
  } catch (err: any) {
    throw new Error(`Failed to parse PDF document: ${err.message || String(err)}`);
  }
}
