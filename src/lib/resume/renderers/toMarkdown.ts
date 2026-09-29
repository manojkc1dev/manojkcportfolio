import type { ResumeContent } from '../schema';

function formatDates(startDate?: string, endDate?: string): string {
  if (!startDate && !endDate) return '';
  const start = startDate ? startDate.replace('-', '/') : '';
  const end = endDate ? (endDate.toLowerCase() === 'present' ? 'Present' : endDate.replace('-', '/')) : 'Present';
  return `${start} – ${end}`;
}

export function toMarkdown(content: ResumeContent): string {
  const { header, sections = [] } = content;
  const lines: string[] = [];

  // Header
  lines.push(`# ${header.name}`);
  if (header.title) lines.push(`### ${header.title}`);

  const contactParts: string[] = [];
  if (header.email) contactParts.push(`[${header.email}](mailto:${header.email})`);
  if (header.phone) contactParts.push(header.phone);
  if (header.location) contactParts.push(header.location);
  if (header.linkedin) contactParts.push(`[LinkedIn](${header.linkedin})`);
  if (header.github) contactParts.push(`[GitHub](${header.github})`);
  if (header.website) contactParts.push(`[Portfolio](${header.website})`);

  if (contactParts.length > 0) {
    lines.push(contactParts.join(' • '));
  }

  if (header.summary) {
    lines.push('');
    lines.push('## Summary');
    lines.push(header.summary);
  }

  const visibleSections = [...sections]
    .filter((s) => s.visible !== false)
    .sort((a, b) => (a.order ?? 0) - (b.order ?? 0));

  for (const section of visibleSections) {
    const visibleEntries = (section.entries || []).filter((e) => e.visible !== false);
    if (visibleEntries.length === 0) continue;

    lines.push('');
    lines.push(`## ${section.title}`);

    for (const entry of visibleEntries) {
      if (section.type === 'skills') {
        const text = (entry.bullets || []).join(', ');
        lines.push(`- **${entry.title}:** ${text}`);
        continue;
      }

      const dateStr = formatDates(entry.startDate, entry.endDate);
      lines.push('');
      lines.push(`### ${entry.title}${entry.organization ? ` — *${entry.organization}*` : ''}`);
      if (entry.location || dateStr) {
        lines.push(`*${[entry.location, dateStr].filter(Boolean).join(' | ')}*`);
      }

      for (const bullet of entry.bullets || []) {
        if (bullet && bullet.trim().length > 0) {
          lines.push(`- ${bullet.trim()}`);
        }
      }
    }
  }

  return lines.join('\n').trim() + '\n';
}
