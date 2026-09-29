import fs from 'fs';
import path from 'path';
import { createDefaultResume } from '../src/lib/resume/schema';
import { createAtsPdfBuffer } from '../src/lib/resume/renderers/createSimplePdf';
import { toHtmlAts } from '../src/lib/resume/renderers/toHtmlAts';
import { toText } from '../src/lib/resume/renderers/toText';
import { toDocxBuffer } from '../src/lib/resume/renderers/toDocx';

async function main() {
  const publicDir = path.resolve(process.cwd(), 'public');
  if (!fs.existsSync(publicDir)) {
    fs.mkdirSync(publicDir, { recursive: true });
  }

  // 1. Resume
  const resume = createDefaultResume('resume', 'backend-engineer');
  const resumePdfBuffer = createAtsPdfBuffer(resume.content);
  fs.writeFileSync(path.join(publicDir, 'resume.pdf'), resumePdfBuffer);

  const resumeHtml = toHtmlAts(resume.content, `${resume.content.header.name} - Resume (ATS)`);
  fs.writeFileSync(path.join(publicDir, 'resume.html'), resumeHtml, 'utf-8');

  const resumeText = toText(resume.content);
  fs.writeFileSync(path.join(publicDir, 'resume.txt'), resumeText, 'utf-8');

  const resumeDocx = await toDocxBuffer(resume.content);
  fs.writeFileSync(path.join(publicDir, 'resume.docx'), resumeDocx);

  // 2. CV
  const cv = createDefaultResume('cv', 'systems-architect');
  cv.content.header.title = 'Senior Backend & Systems Architect';
  const cvPdfBuffer = createAtsPdfBuffer(cv.content);
  fs.writeFileSync(path.join(publicDir, 'cv.pdf'), cvPdfBuffer);

  const cvHtml = toHtmlAts(cv.content, `${cv.content.header.name} - Curriculum Vitae (CV)`);
  fs.writeFileSync(path.join(publicDir, 'cv.html'), cvHtml, 'utf-8');

  const cvText = toText(cv.content);
  fs.writeFileSync(path.join(publicDir, 'cv.txt'), cvText, 'utf-8');

  const cvDocx = await toDocxBuffer(cv.content);
  fs.writeFileSync(path.join(publicDir, 'cv.docx'), cvDocx);

  console.log('Public resume files generated successfully:');
  console.log('resume.pdf, resume.docx, resume.html, resume.txt');
  console.log('cv.pdf, cv.docx, cv.html, cv.txt');
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
