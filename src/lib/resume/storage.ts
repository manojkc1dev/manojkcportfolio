import type { ResumeDocument, ResumeType } from './schema';
import { createDefaultResume, generateId } from './schema';
import { runAtsAudit } from './ats/rules';

const STORAGE_KEY = 'portfolio_resumes_v2';
const ACTIVE_KEY_PREFIX = 'portfolio_active_resume_';

function getLocalResumes(): ResumeDocument[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (raw) {
      const parsed = JSON.parse(raw);
      if (Array.isArray(parsed) && parsed.length > 0) {
        return parsed;
      }
    }
  } catch (err) {
    console.warn('Failed to load local resumes:', err);
  }

  // Initial seed variants
  const defaultResume = createDefaultResume('resume', 'backend-engineer');
  const defaultCv = createDefaultResume('cv', 'systems-architect');
  defaultCv.variant = 'systems-architect';
  defaultCv.content.header.title = 'Senior Backend & Systems Architect';
  defaultCv.isActive = true;

  const initialList = [defaultResume, defaultCv];
  saveLocalResumes(initialList);
  return initialList;
}

function saveLocalResumes(list: ResumeDocument[]): void {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(list));

    // Sync active resume metadata for Hero & public buttons
    const activeResume = list.find((r) => r.type === 'resume' && r.isActive) || list.find((r) => r.type === 'resume');
    if (activeResume) {
      const fileName = `${activeResume.content.header.name.replace(/\s+/g, '_')}_Backend_Engineer_Resume.pdf`;
      localStorage.setItem(
        'portfolio_resume_data',
        JSON.stringify({
          resumeUrl: '/resume.pdf',
          fileName,
          variant: activeResume.variant,
          updatedAt: activeResume.updatedAt,
        })
      );
    }

    // Broadcast change events
    window.dispatchEvent(new Event('portfolio_resume_updated'));
    window.dispatchEvent(new Event('portfolio_data_updated'));
  } catch (err) {
    console.warn('Failed to save resumes locally:', err);
  }
}

export async function listResumes(_ownerUid?: string): Promise<ResumeDocument[]> {
  return getLocalResumes();
}

export async function getResumeById(id: string): Promise<ResumeDocument | null> {
  const localList = getLocalResumes();
  const localFound = localList.find((r) => r.resumeId === id);
  return localFound || null;
}

export async function saveResume(resume: ResumeDocument): Promise<ResumeDocument> {
  const now = new Date().toISOString();
  // Recalculate ATS score & issues
  const audit = runAtsAudit(resume.content, resume.targetRole || 'Backend Engineer');

  const updated: ResumeDocument = {
    ...resume,
    atsScore: audit.score,
    atsIssues: audit.issues,
    atsBreakdown: audit.breakdown,
    updatedAt: now,
    version: (resume.version || 1) + 1,
    ownerUid: resume.ownerUid || 'admin-manoj-kc',
  };

  // Update local storage
  const list = getLocalResumes();
  const idx = list.findIndex((r) => r.resumeId === updated.resumeId);
  if (idx >= 0) {
    list[idx] = updated;
  } else {
    list.unshift(updated);
  }
  saveLocalResumes(list);

  return updated;
}

export async function deleteResume(id: string): Promise<void> {
  const list = getLocalResumes().filter((r) => r.resumeId !== id);
  saveLocalResumes(list);
}

export async function duplicateResume(id: string): Promise<ResumeDocument> {
  const original = await getResumeById(id);
  if (!original) {
    throw new Error('Original resume not found to duplicate.');
  }

  const newId = generateId(original.type);
  const copy: ResumeDocument = {
    ...original,
    resumeId: newId,
    variant: `${original.variant}-copy`,
    isActive: false,
    content: {
      ...original.content,
      header: {
        ...original.content.header,
        title: `${original.content.header.title || ''} (Copy)`.trim(),
      },
    },
    version: 1,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  };

  return await saveResume(copy);
}

export async function setActiveResume(id: string, type: ResumeType): Promise<void> {
  const list = getLocalResumes();
  for (const item of list) {
    if (item.type === type) {
      item.isActive = item.resumeId === id;
    }
  }
  saveLocalResumes(list);
  try {
    localStorage.setItem(`${ACTIVE_KEY_PREFIX}${type}`, id);
  } catch (e) {
    // ignore
  }
}

export async function togglePublicResume(id: string, isPublic: boolean): Promise<void> {
  const list = getLocalResumes();
  const target = list.find((r) => r.resumeId === id);
  if (target) {
    target.isPublic = isPublic;
    saveLocalResumes(list);
  }
}

export async function getActiveResume(type: ResumeType = 'resume'): Promise<ResumeDocument | null> {
  const list = await listResumes();
  const active = list.find((r) => r.type === type && r.isActive);
  return active || list.find((r) => r.type === type) || list[0] || null;
}

