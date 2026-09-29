import mammoth from 'mammoth';
import type { ResumeContent } from '../schema';
import { parseRawTextToResumeContent } from './parseTextToResume';

export async function parseDocx(arrayBufferOrBuffer: ArrayBuffer | Buffer): Promise<ResumeContent> {
  try {
    let result: { value: string };
    if (typeof Buffer !== 'undefined' && Buffer.isBuffer(arrayBufferOrBuffer)) {
      result = await mammoth.extractRawText({ buffer: arrayBufferOrBuffer });
    } else {
      result = await mammoth.extractRawText({ arrayBuffer: arrayBufferOrBuffer as ArrayBuffer });
    }

    const rawText = result.value || '';
    if (!rawText.trim()) {
      throw new Error('DOCX document contained no readable text.');
    }

    return parseRawTextToResumeContent(rawText);
  } catch (err: any) {
    throw new Error(`Failed to parse DOCX: ${err.message || String(err)}`);
  }
}
