import type { Project } from '../types';

/**
 * Generates an executive, print-optimized HTML case study document.
 */
export function generateCaseStudyHtml(project: Project): string {
  const metricsHtml = project.metrics && project.metrics.length > 0
    ? `
      <div class="metrics-grid">
        ${project.metrics.map(m => `
          <div class="metric-card">
            <div class="metric-value">${m.value}</div>
            <div class="metric-label">${m.label}</div>
          </div>
        `).join('')}
      </div>
    `
    : '';

  const whatIBuiltHtml = project.whatIBuilt && project.whatIBuilt.length > 0
    ? `
      <section class="section">
        <h2 class="section-title">What I Personally Shipped</h2>
        <ul class="bullet-list">
          ${project.whatIBuilt.map(item => `<li>${item}</li>`).join('')}
        </ul>
      </section>
    `
    : '';

  const techStackHtml = project.techStackTable && project.techStackTable.length > 0
    ? `
      <section class="section">
        <h2 class="section-title">Technical Architecture &amp; Stack</h2>
        <table class="tech-table">
          <thead>
            <tr>
              <th>Layer / Component</th>
              <th>Selected Technology</th>
              <th>Engineering Rationale</th>
            </tr>
          </thead>
          <tbody>
            ${project.techStackTable.map(t => `
              <tr>
                <td><strong>${t.layer}</strong></td>
                <td><span class="badge">${t.choice}</span></td>
                <td>${t.why}</td>
              </tr>
            `).join('')}
          </tbody>
        </table>
      </section>
    `
    : project.tech && project.tech.length > 0
    ? `
      <section class="section">
        <h2 class="section-title">Technical Stack</h2>
        <div style="display: flex; flex-wrap: wrap; gap: 4pt;">
          ${project.tech.map(t => `<span class="badge">${t}</span>`).join(' ')}
        </div>
      </section>
    `
    : '';

  const challengesHtml = project.challenges && project.challenges.length > 0
    ? `
      <section class="section">
        <h2 class="section-title">Engineering Challenges &amp; Strategic Solutions</h2>
        <div class="challenges-list">
          ${project.challenges.map(c => `
            <div class="challenge-item">
              <h3 class="challenge-title">${c.title}</h3>
              <div class="challenge-sub"><span class="label">Challenge:</span> ${c.problem}</div>
              <div class="challenge-sub"><span class="label">Approach:</span> ${c.approach}</div>
              <div class="challenge-sub outcome"><span class="label">Verified Outcome:</span> ${c.outcome}</div>
            </div>
          `).join('')}
        </div>
      </section>
    `
    : '';

  const lessonsHtml = project.lessonsLearned && project.lessonsLearned.length > 0
    ? `
      <section class="section">
        <h2 class="section-title">Lessons Learned &amp; Takeaways</h2>
        <ul class="bullet-list">
          ${project.lessonsLearned.map(l => `<li>${l}</li>`).join('')}
        </ul>
      </section>
    `
    : '';

  const proofHtml = project.proof && project.proof.length > 0
    ? `
      <div class="proof-bar">
        <strong>Verified Artifacts:</strong>
        ${project.proof.map(p => `<span class="proof-pill">${p}</span>`).join(' ')}
      </div>
    `
    : '';

  return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <title>${project.title} — Technical Case Study | Manoj K.C.</title>
  <style>
    @page {
      size: A4;
      margin: 18mm 18mm 20mm 18mm;
    }
    *, *::before, *::after {
      box-sizing: border-box;
    }
    body {
      font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif;
      color: #111827;
      background: #ffffff;
      line-height: 1.55;
      font-size: 10.5pt;
      margin: 0;
      padding: 0;
    }
    .header-bar {
      border-bottom: 2pt solid #4f46e5;
      padding-bottom: 12pt;
      margin-bottom: 16pt;
      display: flex;
      justify-content: space-between;
      align-items: flex-start;
    }
    .author-name {
      font-size: 14pt;
      font-weight: 800;
      color: #111827;
      letter-spacing: -0.02em;
    }
    .author-title {
      font-size: 9.5pt;
      color: #4f46e5;
      font-weight: 600;
    }
    .author-contact {
      text-align: right;
      font-size: 8.5pt;
      color: #4b5563;
      line-height: 1.4;
    }
    .author-contact a {
      color: #4f46e5;
      text-decoration: none;
    }
    h1 {
      font-size: 18pt;
      font-weight: 800;
      margin: 0 0 4pt 0;
      color: #111827;
      letter-spacing: -0.02em;
    }
    .tagline {
      font-size: 11pt;
      color: #4b5563;
      margin: 0 0 12pt 0;
      font-weight: 500;
    }
    .meta-row {
      display: flex;
      flex-wrap: wrap;
      gap: 12pt;
      font-size: 9pt;
      color: #6b7280;
      margin-bottom: 14pt;
      padding: 6pt 10pt;
      background: #f9fafb;
      border-radius: 6pt;
      border: 1px solid #e5e7eb;
    }
    .meta-row strong {
      color: #111827;
    }
    .metrics-grid {
      display: grid;
      grid-template-columns: repeat(4, 1fr);
      gap: 8pt;
      margin-bottom: 16pt;
    }
    .metric-card {
      border: 1px solid #e5e7eb;
      background: #fdfdfd;
      padding: 8pt 10pt;
      border-radius: 6pt;
      text-align: center;
    }
    .metric-value {
      font-size: 14pt;
      font-weight: 800;
      color: #4f46e5;
      line-height: 1.2;
    }
    .metric-label {
      font-size: 8pt;
      color: #6b7280;
      margin-top: 2pt;
      text-transform: uppercase;
      letter-spacing: 0.04em;
    }
    .section {
      margin-bottom: 16pt;
      page-break-inside: avoid;
    }
    .section-title {
      font-size: 11.5pt;
      font-weight: 700;
      text-transform: uppercase;
      letter-spacing: 0.05em;
      color: #1f2937;
      border-bottom: 1px solid #e5e7eb;
      padding-bottom: 4pt;
      margin: 0 0 8pt 0;
    }
    .section-p {
      margin: 0 0 8pt 0;
      color: #374151;
      text-align: justify;
    }
    .bullet-list {
      margin: 0 0 8pt 0;
      padding-left: 18pt;
      color: #374151;
    }
    .bullet-list li {
      margin-bottom: 4pt;
    }
    .tech-table {
      width: 100%;
      border-collapse: collapse;
      font-size: 9pt;
      margin-top: 6pt;
    }
    .tech-table th {
      background: #f3f4f6;
      color: #111827;
      text-align: left;
      padding: 5pt 8pt;
      font-weight: 700;
      border-bottom: 1.5pt solid #d1d5db;
    }
    .tech-table td {
      padding: 5pt 8pt;
      border-bottom: 1px solid #e5e7eb;
      vertical-align: top;
    }
    .badge {
      display: inline-block;
      background: #e0e7ff;
      color: #3730a3;
      padding: 1pt 5pt;
      border-radius: 4pt;
      font-weight: 600;
      font-size: 8pt;
      font-family: monospace;
    }
    .challenges-list {
      display: flex;
      flex-direction: column;
      gap: 10pt;
    }
    .challenge-item {
      border-left: 3pt solid #4f46e5;
      padding-left: 8pt;
      background: #fbfbfb;
      padding-top: 4pt;
      padding-bottom: 4pt;
    }
    .challenge-title {
      font-size: 10pt;
      font-weight: 700;
      margin: 0 0 3pt 0;
      color: #111827;
    }
    .challenge-sub {
      font-size: 9pt;
      color: #4b5563;
      margin-bottom: 2pt;
    }
    .challenge-sub .label {
      font-weight: 600;
      color: #374151;
    }
    .challenge-sub.outcome {
      color: #065f46;
      font-weight: 500;
    }
    .proof-bar {
      margin-top: 14pt;
      padding: 6pt 10pt;
      background: #f0fdf4;
      border: 1px solid #bbf7d0;
      border-radius: 6pt;
      font-size: 8.5pt;
      color: #166534;
    }
    .proof-pill {
      display: inline-block;
      background: #dcfce7;
      color: #15803d;
      padding: 1pt 5pt;
      border-radius: 3pt;
      font-family: monospace;
      font-weight: 600;
      font-size: 8pt;
      margin: 0 2pt;
    }
    .footer-bar {
      margin-top: 20pt;
      padding-top: 8pt;
      border-top: 1px solid #e5e7eb;
      display: flex;
      justify-content: space-between;
      font-size: 8pt;
      color: #9ca3af;
    }
    @media print {
      body {
        -webkit-print-color-adjust: exact;
        print-color-adjust: exact;
      }
      .no-print {
        display: none !important;
      }
    }
  </style>
</head>
<body>
  <div class="header-bar">
    <div>
      <div class="author-name">MANOJ K.C. (Manoj Khatri)</div>
      <div class="author-title">Python/Django Backend Software Engineer · Kathmandu, Nepal</div>
    </div>
    <div class="author-contact">
      <div>Email: <a href="mailto:manojkc1dev@gmail.com">manojkc1dev@gmail.com</a></div>
      <div>Portfolio: <a href="https://manojkc1.com.np">https://manojkc1.com.np</a></div>
      <div>GitHub: <a href="https://github.com/manojkc1dev">github.com/manojkc1dev</a></div>
    </div>
  </div>

  <h1>${project.title}</h1>
  <div class="tagline">${project.tagline}</div>

  <div class="meta-row">
    <div><strong>Status:</strong> ${project.status || 'Production'}</div>
    ${project.role ? `<div><strong>Role:</strong> ${project.role}</div>` : ''}
    ${project.duration ? `<div><strong>Duration:</strong> ${project.duration}</div>` : ''}
    ${project.year ? `<div><strong>Year:</strong> ${project.year}</div>` : ''}
    ${project.links.live ? `<div><strong>Live:</strong> ${project.links.live}</div>` : ''}
    ${project.links.github ? `<div><strong>Source:</strong> ${project.links.github}</div>` : ''}
  </div>

  ${metricsHtml}

  ${project.problem ? `
    <section class="section">
      <h2 class="section-title">The Engineering Problem</h2>
      <p class="section-p">${project.problem}</p>
    </section>
  ` : ''}

  ${project.solution ? `
    <section class="section">
      <h2 class="section-title">The Solution &amp; Technical Approach</h2>
      <p class="section-p">${project.solution}</p>
    </section>
  ` : ''}

  ${whatIBuiltHtml}

  ${techStackHtml}

  ${challengesHtml}

  ${lessonsHtml}

  ${proofHtml}

  <div class="footer-bar">
    <div>Technical Case Study · Manoj K.C. · Generated for Recruiter &amp; Engineering Review</div>
    <div>Page 1 of 1 · Verified at https://manojkc1.com.np</div>
  </div>
</body>
</html>`;
}

/**
 * Triggers PDF export via the browser's native print engine.
 * Opens a clean printable window and executes window.print().
 */
export function exportCaseStudyAsPdf(project: Project): void {
  const htmlContent = generateCaseStudyHtml(project);

  // Try creating an invisible printable iframe first (seamless print dialog)
  try {
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
      doc.write(htmlContent);
      doc.close();

      setTimeout(() => {
        try {
          iframe.contentWindow?.focus();
          iframe.contentWindow?.print();
        } catch (_) {
          // If iframe print fails due to browser restrictions, fallback to new window
          openPrintWindow(htmlContent);
        } finally {
          setTimeout(() => {
            document.body.removeChild(iframe);
          }, 60000);
        }
      }, 350);
      return;
    }
  } catch (_) {
    // fallback
  }

  // Fallback: new window print
  openPrintWindow(htmlContent);
}

function openPrintWindow(htmlContent: string) {
  const printWindow = window.open('', '_blank');
  if (printWindow) {
    printWindow.document.write(htmlContent);
    printWindow.document.close();
    printWindow.focus();
    setTimeout(() => {
      printWindow.print();
    }, 400);
  } else {
    // If popups blocked, download as printable HTML
    downloadCaseStudyHtml(htmlContent, 'case-study.html');
  }
}

/**
 * Downloads the case study as a standalone offline HTML document.
 */
export function downloadCaseStudyHtml(htmlContent: string, fileName: string): void {
  const blob = new Blob([htmlContent], { type: 'text/html;charset=utf-8' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = fileName;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
}

/**
 * Downloads the case study in Markdown format.
 */
export function downloadCaseStudyMarkdown(project: Project): void {
  let md = `# ${project.title}\n`;
  md += `**${project.tagline}**\n\n`;
  md += `Author: Manoj K.C. (Manoj Khatri) — Python/Django Backend Engineer, Kathmandu, Nepal\n`;
  md += `Email: manojkc1dev@gmail.com | Portfolio: https://manojkc1.com.np\n`;
  md += `Status: ${project.status || 'Production'} | Role: ${project.role || 'Solo'} | Duration: ${project.duration || 'N/A'}\n\n`;

  if (project.metrics && project.metrics.length > 0) {
    md += `## Key Metrics\n`;
    project.metrics.forEach(m => {
      md += `- **${m.value}**: ${m.label}\n`;
    });
    md += `\n`;
  }

  if (project.problem) {
    md += `## Problem\n${project.problem}\n\n`;
  }

  if (project.solution) {
    md += `## Solution\n${project.solution}\n\n`;
  }

  if (project.whatIBuilt && project.whatIBuilt.length > 0) {
    md += `## What I Shipped\n`;
    project.whatIBuilt.forEach(item => {
      md += `- ${item}\n`;
    });
    md += `\n`;
  }

  if (project.techStackTable && project.techStackTable.length > 0) {
    md += `## Technical Stack\n`;
    project.techStackTable.forEach(t => {
      md += `- **${t.layer}**: ${t.choice} — ${t.why}\n`;
    });
    md += `\n`;
  } else if (project.tech && project.tech.length > 0) {
    md += `## Technical Stack\n`;
    md += `${project.tech.join(', ')}\n\n`;
  }

  if (project.challenges && project.challenges.length > 0) {
    md += `## Key Challenges\n`;
    project.challenges.forEach(c => {
      md += `### ${c.title}\n`;
      md += `- **Problem**: ${c.problem}\n`;
      md += `- **Approach**: ${c.approach}\n`;
      md += `- **Outcome**: ${c.outcome}\n\n`;
    });
  }

  const blob = new Blob([md], { type: 'text/markdown;charset=utf-8' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = `${project.id}-case-study.md`;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
}
