import type { ResumeContent } from '../schema';
import { toHtmlAts } from './toHtmlAts';
import { createAtsPdfBlob } from './createSimplePdf';

/**
 * Downloads a binary ISO A4 PDF directly in the browser with true A4 ratio (1 : 1.414).
 */
export function downloadAtsPdf(content: ResumeContent, filename?: string): void {
  try {
    const blob = createAtsPdfBlob(content);
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = filename || getResumePdfFilename(content);
    document.body.appendChild(a);
    a.click();
    a.remove();
    setTimeout(() => URL.revokeObjectURL(url), 1500);
  } catch (err) {
    console.warn('Direct blob PDF download failed, falling back to print dialog:', err);
    printResumeToPdf(content);
  }
}

/**
 * Prepares the print-ready ATS HTML and opens the browser's native print preview
 * configured for direct ATS-safe single-column PDF export.
 */
export function printResumeToPdf(content: ResumeContent): void {
  const html = toHtmlAts(content, `${content.header.name} - Resume (ATS)`);
  const printWindow = window.open('', '_blank', 'width=850,height=1100');
  if (!printWindow) {
    // If popups are blocked in iframe, print directly in hidden iframe
    const iframe = document.createElement('iframe');
    iframe.style.position = 'fixed';
    iframe.style.right = '0';
    iframe.style.bottom = '0';
    iframe.style.width = '0';
    iframe.style.height = '0';
    iframe.style.border = '0';
    document.body.appendChild(iframe);

    const doc = iframe.contentWindow?.document;
    if (doc) {
      doc.open();
      doc.write(html);
      doc.close();
      setTimeout(() => {
        iframe.contentWindow?.focus();
        iframe.contentWindow?.print();
        setTimeout(() => iframe.remove(), 1000);
      }, 300);
    }
    return;
  }

  printWindow.document.open();
  printWindow.document.write(html);
  printWindow.document.close();

  printWindow.addEventListener('load', () => {
    printWindow.focus();
    printWindow.print();
  });
}

export function getResumePdfFilename(content: ResumeContent, type: 'resume' | 'cv' = 'resume'): string {
  const name = (content.header.name || 'Candidate')
    .replace(/[^a-zA-Z0-9]/g, '_')
    .replace(/_+/g, '_');
  const role = (content.header.title || 'Engineer')
    .replace(/[^a-zA-Z0-9]/g, '_')
    .replace(/_+/g, '_');
  const dateStr = new Date().toISOString().slice(0, 7); // 2026-02

  return `${name}_${role}_${type === 'cv' ? 'CV' : 'Resume'}_${dateStr}.pdf`;
}
