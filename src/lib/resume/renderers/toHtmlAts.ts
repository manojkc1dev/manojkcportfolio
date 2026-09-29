import type { ResumeContent, ResumeEntry } from '../schema';

function formatDates(startDate?: string, endDate?: string): string {
  if (!startDate && !endDate) return '';
  const start = startDate ? startDate.replace('-', '/') : '';
  const end = endDate ? (endDate.toLowerCase() === 'present' ? 'Present' : endDate.replace('-', '/')) : 'Present';
  return `${start} – ${end}`;
}

export interface ToHtmlAtsOptions {
  paperFormat?: 'a4' | 'letter';
  showMarginGuides?: boolean;
  showHidden?: boolean;
}

export function toHtmlAts(
  content: ResumeContent,
  pageTitle?: string,
  options: ToHtmlAtsOptions = {}
): string {
  const { header, sections = [] } = content;
  const title = pageTitle || `${header.name} - Resume`;
  const paperFormat = options.paperFormat || 'a4';
  const isLetter = paperFormat === 'letter';
  const showHidden = options.showHidden || false;
  const showMarginGuides = options.showMarginGuides || false;

  const hiddenFields = new Set(header.hiddenFields || []);

  const contactItems: string[] = [];
  if (header.email && (showHidden || !hiddenFields.has('email'))) {
    const isFieldHidden = hiddenFields.has('email');
    contactItems.push(
      `<a href="mailto:${escapeHtml(header.email)}" class="${isFieldHidden ? 'field-hidden' : ''}">${escapeHtml(header.email)}${isFieldHidden ? ' (hidden)' : ''}</a>`
    );
  }
  if (header.phone && (showHidden || !hiddenFields.has('phone'))) {
    const isFieldHidden = hiddenFields.has('phone');
    contactItems.push(
      `<span class="${isFieldHidden ? 'field-hidden' : ''}">${escapeHtml(header.phone)}${isFieldHidden ? ' (hidden)' : ''}</span>`
    );
  }
  if (header.location && (showHidden || !hiddenFields.has('location'))) {
    const isFieldHidden = hiddenFields.has('location');
    contactItems.push(
      `<span class="${isFieldHidden ? 'field-hidden' : ''}">${escapeHtml(header.location)}${isFieldHidden ? ' (hidden)' : ''}</span>`
    );
  }
  if (header.linkedin && (showHidden || !hiddenFields.has('linkedin'))) {
    const isFieldHidden = hiddenFields.has('linkedin');
    contactItems.push(
      `<a href="${escapeHtml(header.linkedin)}" target="_blank" rel="noopener" class="${isFieldHidden ? 'field-hidden' : ''}">LinkedIn${isFieldHidden ? ' (hidden)' : ''}</a>`
    );
  }
  if (header.github && (showHidden || !hiddenFields.has('github'))) {
    const isFieldHidden = hiddenFields.has('github');
    contactItems.push(
      `<a href="${escapeHtml(header.github)}" target="_blank" rel="noopener" class="${isFieldHidden ? 'field-hidden' : ''}">GitHub${isFieldHidden ? ' (hidden)' : ''}</a>`
    );
  }
  if (header.website && (showHidden || !hiddenFields.has('website'))) {
    const isFieldHidden = hiddenFields.has('website');
    contactItems.push(
      `<a href="${escapeHtml(header.website)}" target="_blank" rel="noopener" class="${isFieldHidden ? 'field-hidden' : ''}">${escapeHtml(header.website.replace(/^https?:\/\//, ''))}${isFieldHidden ? ' (hidden)' : ''}</a>`
    );
  }

  const visibleSections = [...sections]
    .filter((s) => showHidden || s.visible !== false)
    .sort((a, b) => (a.order ?? 0) - (b.order ?? 0));

  const sectionsHtml = visibleSections
    .map((section) => {
      const isSecHidden = section.visible === false;
      const visibleEntries = (section.entries || []).filter((e) => showHidden || e.visible !== false);
      if (visibleEntries.length === 0 && !showHidden) return '';

      const entriesHtml = visibleEntries
        .map((entry) => renderEntryHtml(entry, section.type, showHidden))
        .join('\n');

      return `
    <section class="resume-section ${isSecHidden ? 'section-hidden' : ''}">
      <h2 class="section-title">
        ${escapeHtml(section.title.toUpperCase())}
        ${isSecHidden ? '<span class="hidden-pill">[HIDDEN IN EXPORT]</span>' : ''}
      </h2>
      ${entriesHtml}
    </section>`;
    })
    .join('\n');

  const summaryHidden = hiddenFields.has('summary');
  const showSummary = header.summary && (showHidden || !summaryHidden);

  return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>${escapeHtml(title)}</title>
  <meta name="description" content="${escapeHtml(header.name)} - ${escapeHtml(header.title)}">
  <style>
    /* ISO Standard A4 Paper Ratio: 210mm x 297mm (1 : 1.414) */
    @page {
      size: ${isLetter ? 'letter portrait' : 'A4 portrait'};
      margin: 15mm;
    }
    *, *::before, *::after {
      box-sizing: border-box;
      margin: 0;
      padding: 0;
    }
    html {
      background: #f1f5f9;
      display: flex;
      justify-content: center;
      padding: 0;
      min-height: 100%;
      overflow-x: hidden;
    }
    body {
      background: #ffffff;
      color: #09090b;
      font-family: 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif;
      font-size: 10pt;
      line-height: 1.45;
      text-rendering: optimizeLegibility;
      -webkit-font-smoothing: antialiased;
      width: ${isLetter ? '8.5in' : '210mm'};
      min-height: ${isLetter ? '11in' : '297mm'};
      margin: 0 auto;
      padding: 16mm 15mm;
      box-shadow: 0 4px 20px rgba(0, 0, 0, 0.08);
      position: relative;
      overflow-x: hidden;
    }
    ${
      showMarginGuides
        ? `body::before {
      content: '';
      position: absolute;
      top: 15mm;
      bottom: 15mm;
      left: 15mm;
      right: 15mm;
      border: 1px dashed rgba(99, 102, 241, 0.35);
      pointer-events: none;
    }`
        : ''
    }
    header {
      margin-bottom: 14pt;
      border-bottom: 1.5pt solid #18181b;
      padding-bottom: 8pt;
    }
    h1.candidate-name {
      font-size: 20pt;
      font-weight: 800;
      letter-spacing: -0.025em;
      margin-bottom: 2pt;
      color: #09090b;
      text-transform: none;
      line-height: 1.15;
    }
    .candidate-title {
      font-size: 11.5pt;
      font-weight: 600;
      color: #27272a;
      margin-bottom: 4pt;
    }
    .contact-line {
      font-size: 9pt;
      color: #3f3f46;
      margin-top: 4pt;
      word-spacing: 1pt;
    }
    .contact-line a {
      color: #09090b;
      text-decoration: underline;
    }
    .summary-text {
      margin-top: 8pt;
      font-size: 9.5pt;
      line-height: 1.45;
      color: #18181b;
      text-align: justify;
    }
    .resume-section {
      margin-top: 13pt;
      margin-bottom: 6pt;
    }
    h2.section-title {
      font-size: 11pt;
      font-weight: 700;
      text-transform: uppercase;
      letter-spacing: 0.04em;
      border-bottom: 1pt solid #27272a;
      padding-bottom: 2.5pt;
      margin-bottom: 6pt;
      color: #09090b;
      display: flex;
      align-items: center;
      justify-content: space-between;
    }
    .entry-item {
      margin-bottom: 8pt;
      page-break-inside: avoid;
    }
    .entry-header {
      display: flex;
      justify-content: space-between;
      align-items: baseline;
      font-weight: 700;
      font-size: 10pt;
    }
    .entry-title {
      font-weight: 700;
      color: #09090b;
    }
    .entry-dates {
      font-weight: 500;
      font-size: 9pt;
      color: #3f3f46;
      white-space: nowrap;
    }
    .entry-subhead {
      display: flex;
      justify-content: space-between;
      font-style: italic;
      font-size: 9.5pt;
      color: #27272a;
      margin-bottom: 3pt;
    }
    .entry-org {
      font-weight: 600;
      font-style: normal;
    }
    .entry-location {
      font-size: 8.5pt;
      color: #52525b;
    }
    ul.bullet-list {
      list-style-type: disc;
      margin-left: 16pt;
      margin-top: 2.5pt;
    }
    ul.bullet-list li {
      margin-bottom: 2pt;
      font-size: 9.5pt;
      line-height: 1.42;
      color: #18181b;
    }
    .skills-line {
      font-size: 9.5pt;
      line-height: 1.42;
      margin-bottom: 3.5pt;
    }
    .skills-category {
      font-weight: 700;
      color: #09090b;
    }
    /* Hidden items inspection indicators */
    .field-hidden, .section-hidden, .entry-hidden, .bullet-hidden {
      opacity: 0.45;
      text-decoration: line-through;
    }
    .hidden-pill {
      font-size: 7.5pt;
      color: #e11d48;
      background: #ffe4e6;
      border: 1px solid #fecdd3;
      padding: 1px 5px;
      border-radius: 4px;
      font-weight: 600;
      text-decoration: none;
      letter-spacing: 0;
    }
    @media print {
      html {
        background: #ffffff;
      }
      body {
        padding: 0;
        margin: 0;
        width: 100% !important;
        min-height: auto !important;
        box-shadow: none !important;
      }
      a {
        text-decoration: none;
        color: #000000;
      }
      .field-hidden, .section-hidden, .entry-hidden, .bullet-hidden, .hidden-pill {
        display: none !important;
      }
    }
  </style>
</head>
<body>
  <header>
    <h1 class="candidate-name">${escapeHtml(header.name)}</h1>
    <div class="candidate-title">${escapeHtml(header.title)}</div>
    <div class="contact-line">${contactItems.join(' &nbsp;|&nbsp; ')}</div>
    ${showSummary ? `<p class="summary-text ${summaryHidden ? 'field-hidden' : ''}">${escapeHtml(header.summary!)}</p>` : ''}
  </header>
  <main>
    ${sectionsHtml}
  </main>
</body>
</html>`;
}

function renderEntryHtml(entry: ResumeEntry, sectionType: string, showHidden = false): string {
  const dates = formatDates(entry.startDate, entry.endDate);
  const isEntryHidden = entry.visible === false;
  const hiddenBullets = new Set(entry.hiddenBullets || []);

  if (sectionType === 'skills') {
    const text = (entry.bullets || []).join(', ');
    return `
    <div class="skills-line ${isEntryHidden ? 'entry-hidden' : ''}">
      <span class="skills-category">${escapeHtml(entry.title)}:</span> ${escapeHtml(text)}
      ${isEntryHidden ? '<span class="hidden-pill">[HIDDEN]</span>' : ''}
    </div>`;
  }

  const bulletsHtml = (entry.bullets || [])
    .map((b, idx) => {
      if (!b || b.trim().length === 0) return '';
      const isBulletHidden = hiddenBullets.has(idx);
      if (isBulletHidden && !showHidden) return '';
      return `<li class="${isBulletHidden ? 'bullet-hidden' : ''}">${escapeHtml(b)}${isBulletHidden ? ' <span class="hidden-pill">[HIDDEN]</span>' : ''}</li>`;
    })
    .filter(Boolean)
    .join('\n');

  return `
    <div class="entry-item ${isEntryHidden ? 'entry-hidden' : ''}">
      <div class="entry-header">
        <span class="entry-title">${escapeHtml(entry.title)}${isEntryHidden ? ' <span class="hidden-pill">[HIDDEN]</span>' : ''}</span>
        ${dates ? `<span class="entry-dates">${escapeHtml(dates)}</span>` : ''}
      </div>
      ${
        entry.organization || entry.location
          ? `
      <div class="entry-subhead">
        ${entry.organization ? `<span class="entry-org">${escapeHtml(entry.organization)}</span>` : '<span></span>'}
        ${entry.location ? `<span class="entry-location">${escapeHtml(entry.location)}</span>` : ''}
      </div>`
          : ''
      }
      ${bulletsHtml ? `<ul class="bullet-list">\n${bulletsHtml}\n</ul>` : ''}
    </div>`;
}

function escapeHtml(str: string): string {
  return (str || '')
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#039;');
}
