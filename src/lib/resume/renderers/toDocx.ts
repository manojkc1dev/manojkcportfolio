import {
  Document,
  Paragraph,
  TextRun,
  HeadingLevel,
  AlignmentType,
  Packer,
  BorderStyle,
} from 'docx';
import type { ResumeContent } from '../schema';

function formatDates(startDate?: string, endDate?: string): string {
  if (!startDate && !endDate) return '';
  const start = startDate ? startDate.replace('-', '/') : '';
  const end = endDate ? (endDate.toLowerCase() === 'present' ? 'Present' : endDate.replace('-', '/')) : 'Present';
  return `${start} – ${end}`;
}

export async function toDocxBlob(content: ResumeContent): Promise<Blob> {
  const doc = createDocxDocument(content);
  return await Packer.toBlob(doc);
}

export async function toDocxBuffer(content: ResumeContent): Promise<Buffer> {
  const doc = createDocxDocument(content);
  return await Packer.toBuffer(doc);
}

export function createDocxDocument(content: ResumeContent): Document {
  const { header, sections = [] } = content;
  const children: Paragraph[] = [];
  const hiddenFields = new Set(header.hiddenFields || []);

  // Name Header (18pt bold)
  children.push(
    new Paragraph({
      alignment: AlignmentType.LEFT,
      spacing: { after: 60 },
      children: [
        new TextRun({
          text: header.name,
          bold: true,
          size: 36, // 18pt
          font: 'Inter',
        }),
      ],
    })
  );

  // Professional Title (12pt)
  if (header.title && !hiddenFields.has('title')) {
    children.push(
      new Paragraph({
        spacing: { after: 60 },
        children: [
          new TextRun({
            text: header.title,
            bold: true,
            size: 24, // 12pt
            font: 'Inter',
            color: '333333',
          }),
        ],
      })
    );
  }

  // Contact line
  const contactParts: string[] = [];
  if (header.email && !hiddenFields.has('email')) contactParts.push(header.email);
  if (header.phone && !hiddenFields.has('phone')) contactParts.push(header.phone);
  if (header.location && !hiddenFields.has('location')) contactParts.push(header.location);
  if (header.linkedin && !hiddenFields.has('linkedin')) contactParts.push(header.linkedin);
  if (header.github && !hiddenFields.has('github')) contactParts.push(header.github);
  if (header.website && !hiddenFields.has('website')) contactParts.push(header.website);

  if (contactParts.length > 0) {
    children.push(
      new Paragraph({
        spacing: { after: 120 },
        border: {
          bottom: {
            color: '000000',
            space: 4,
            style: BorderStyle.SINGLE,
            size: 12,
          },
        },
        children: [
          new TextRun({
            text: contactParts.join('  |  '),
            size: 19, // 9.5pt
            font: 'Inter',
            color: '444444',
          }),
        ],
      })
    );
  }

  // Summary
  if (header.summary && !hiddenFields.has('summary')) {
    children.push(
      new Paragraph({
        spacing: { before: 120, after: 120 },
        children: [
          new TextRun({
            text: header.summary,
            size: 20, // 10pt
            font: 'Inter',
          }),
        ],
      })
    );
  }

  const visibleSections = [...sections]
    .filter((s) => s.visible !== false)
    .sort((a, b) => (a.order ?? 0) - (b.order ?? 0));

  for (const section of visibleSections) {
    const visibleEntries = (section.entries || []).filter((e) => e.visible !== false);
    if (visibleEntries.length === 0) continue;

    // Section Header (12pt all-caps with bottom border)
    children.push(
      new Paragraph({
        heading: HeadingLevel.HEADING_2,
        spacing: { before: 200, after: 80 },
        border: {
          bottom: {
            color: '444444',
            space: 2,
            style: BorderStyle.SINGLE,
            size: 6,
          },
        },
        children: [
          new TextRun({
            text: section.title.toUpperCase(),
            bold: true,
            size: 23, // 11.5pt
            font: 'Inter',
            color: '000000',
          }),
        ],
      })
    );

    for (const entry of visibleEntries) {
      const hiddenBullets = new Set(entry.hiddenBullets || []);
      if (section.type === 'skills') {
        const text = (entry.bullets || []).filter((_, idx) => !hiddenBullets.has(idx)).join(', ');
        children.push(
          new Paragraph({
            spacing: { after: 60 },
            children: [
              new TextRun({
                text: `${entry.title}: `,
                bold: true,
                size: 20,
                font: 'Inter',
              }),
              new TextRun({
                text,
                size: 20,
                font: 'Inter',
              }),
            ],
          })
        );
        continue;
      }

      const dateStr = formatDates(entry.startDate, entry.endDate);

      // Entry title & dates line
      children.push(
        new Paragraph({
          spacing: { before: 80, after: 20 },
          children: [
            new TextRun({
              text: entry.title,
              bold: true,
              size: 21, // 10.5pt
              font: 'Inter',
            }),
            ...(dateStr
              ? [
                  new TextRun({
                    text: `   (${dateStr})`,
                    size: 19,
                    font: 'Inter',
                    color: '555555',
                  }),
                ]
              : []),
          ],
        })
      );

      // Organization & location line
      if (entry.organization || entry.location) {
        children.push(
          new Paragraph({
            spacing: { after: 40 },
            children: [
              new TextRun({
                text: [entry.organization, entry.location].filter(Boolean).join('  —  '),
                italics: true,
                size: 20,
                font: 'Inter',
                color: '333333',
              }),
            ],
          })
        );
      }

      // Bullets
      for (let bIdx = 0; bIdx < (entry.bullets || []).length; bIdx++) {
        if (hiddenBullets.has(bIdx)) continue;
        const bullet = entry.bullets[bIdx];
        if (!bullet || !bullet.trim()) continue;
        children.push(
          new Paragraph({
            bullet: { level: 0 },
            spacing: { after: 40 },
            children: [
              new TextRun({
                text: bullet.trim(),
                size: 20,
                font: 'Inter',
              }),
            ],
          })
        );
      }
    }
  }

  return new Document({
    sections: [
      {
        properties: {
          page: {
            margin: {
              top: 1080, // 0.75 inch
              bottom: 1080,
              left: 720, // 0.5 inch
              right: 720,
            },
          },
        },
        children,
      },
    ],
  });
}
