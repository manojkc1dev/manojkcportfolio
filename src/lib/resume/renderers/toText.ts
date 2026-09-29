import type { ResumeContent } from '../schema';

function formatDates(startDate?: string, endDate?: string): string {
  if (!startDate && !endDate) return '';
  const start = startDate || '';
  const end = endDate ? (endDate.toLowerCase() === 'present' ? 'Present' : endDate) : 'Present';
  return `${start} - ${end}`;
}

export function toText(content: ResumeContent): string {
  const { header, sections = [] } = content;
  const lines: string[] = [];
  const hiddenFields = new Set(header.hiddenFields || []);

  // Header
  lines.push(header.name.toUpperCase());
  if (header.title && !hiddenFields.has('title')) lines.push(header.title);

  const contactParts: string[] = [];
  if (header.email && !hiddenFields.has('email')) contactParts.push(header.email);
  if (header.phone && !hiddenFields.has('phone')) contactParts.push(header.phone);
  if (header.location && !hiddenFields.has('location')) contactParts.push(header.location);
  if (header.linkedin && !hiddenFields.has('linkedin')) contactParts.push(header.linkedin);
  if (header.github && !hiddenFields.has('github')) contactParts.push(header.github);
  if (header.website && !hiddenFields.has('website')) contactParts.push(header.website);
  if (contactParts.length > 0) lines.push(contactParts.join(' | '));

  if (header.summary && !hiddenFields.has('summary')) {
    lines.push('');
    lines.push('PROFESSIONAL SUMMARY');
    lines.push('----------------------------------------');
    lines.push(header.summary);
  }

  const visibleSections = [...sections]
    .filter((s) => s.visible !== false)
    .sort((a, b) => (a.order ?? 0) - (b.order ?? 0));

  for (const section of visibleSections) {
    const visibleEntries = (section.entries || []).filter((e) => e.visible !== false);
    if (visibleEntries.length === 0) continue;

    lines.push('');
    lines.push(section.title.toUpperCase());
    lines.push('----------------------------------------');

    for (const entry of visibleEntries) {
      const hiddenBullets = new Set(entry.hiddenBullets || []);
      if (section.type === 'skills') {
        const skillsText = (entry.bullets || []).filter((_, idx) => !hiddenBullets.has(idx)).join(', ');
        lines.push(`${entry.title}: ${skillsText}`);
        continue;
      }

      const dateStr = formatDates(entry.startDate, entry.endDate);
      const headline = [entry.title, dateStr].filter(Boolean).join(' | ');
      lines.push(headline);

      if (entry.organization || entry.location) {
        const subline = [entry.organization, entry.location].filter(Boolean).join(' - ');
        lines.push(subline);
      }

      for (let i = 0; i < (entry.bullets || []).length; i++) {
        if (hiddenBullets.has(i)) continue;
        const bullet = entry.bullets[i];
        if (bullet && bullet.trim().length > 0) {
          lines.push(`- ${bullet.trim()}`);
        }
      }
      lines.push('');
    }
  }

  return lines.join('\n').replace(/\n{3,}/g, '\n\n').trim() + '\n';
}
