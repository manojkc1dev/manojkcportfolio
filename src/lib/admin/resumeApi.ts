import { ResumeVersion, ResumeVersionType, UploadResumeInput } from './resumeTypes';

const STORAGE_KEY = 'portfolio_resume_versions_v2';
const RATE_LIMIT_KEY = 'portfolio_resume_upload_limit';

// Compute SHA-256 hash of a file
export async function computeFileSha256(file: File): Promise<string> {
  const buffer = await file.arrayBuffer();
  const hashBuffer = await crypto.subtle.digest('SHA-256', buffer);
  const hashArray = Array.from(new Uint8Array(hashBuffer));
  return hashArray.map((b) => b.toString(16).padStart(2, '0')).join('');
}

// Generate sample initial data for Manoj K.C.
const INITIAL_VERSIONS: ResumeVersion[] = [
  {
    versionId: 'rv-active-01',
    type: 'resume',
    label: 'Backend Engineer - Jan 2026',
    fileName: 'Manoj_KC_Backend_Resume.pdf',
    storagePath: '/resume/resume/rv-active-01.pdf',
    downloadUrl: '/resume.pdf',
    fileSizeBytes: 2451200, // 2.3 MB
    fileHashSha256: 'e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855',
    isActive: true,
    isPublic: true,
    downloadCount: 384,
    uploadedBy: 'manojkc1dev@gmail.com',
    uploadedAt: Date.now() - 1000 * 60 * 60 * 24 * 3, // 3 days ago
    notes: 'Updated with latest PostgreSQL distributed caching metrics and Django REST benchmarks.',
    dailyDownloads: [
      { date: 'Day 1', count: 18 },
      { date: 'Day 2', count: 24 },
      { date: 'Day 3', count: 32 },
      { date: 'Day 4', count: 45 },
      { date: 'Day 5', count: 39 },
      { date: 'Day 6', count: 52 },
      { date: 'Day 7', count: 68 },
    ],
  },
  {
    versionId: 'rv-prev-02',
    type: 'resume',
    label: 'Software Engineer - Q4 2025',
    fileName: 'Manoj_KC_Resume_v2.3.pdf',
    storagePath: '/resume/resume/rv-prev-02.pdf',
    downloadUrl: '/resume.pdf',
    fileSizeBytes: 2198400, // 2.1 MB
    fileHashSha256: 'ca978112ca1bbdcafac231b39a23dc4da786eff8147c4e72b9807785afee48bb',
    isActive: false,
    isPublic: true,
    downloadCount: 290,
    uploadedBy: 'manojkc1dev@gmail.com',
    uploadedAt: Date.now() - 1000 * 60 * 60 * 24 * 45, // 45 days ago
    notes: 'Pre-migration version containing earlier microservice case studies.',
    dailyDownloads: [
      { date: 'Day 1', count: 12 },
      { date: 'Day 2', count: 15 },
      { date: 'Day 3', count: 8 },
      { date: 'Day 4', count: 14 },
      { date: 'Day 5', count: 11 },
      { date: 'Day 6', count: 16 },
      { date: 'Day 7', count: 10 },
    ],
  },
  {
    versionId: 'cv-active-01',
    type: 'cv',
    label: 'Academic & Full Technical CV - 2026',
    fileName: 'Manoj_KC_Curriculum_Vitae_2026.pdf',
    storagePath: '/resume/cv/cv-active-01.pdf',
    downloadUrl: '/cv.pdf',
    fileSizeBytes: 3145728, // 3.0 MB
    fileHashSha256: '4b227777d4dd1fc61c6f884f48641d02b4d121d3fd328cb08b5531fcacdabf8a',
    isActive: true,
    isPublic: true,
    downloadCount: 156,
    uploadedBy: 'manojkc1dev@gmail.com',
    uploadedAt: Date.now() - 1000 * 60 * 60 * 24 * 7, // 7 days ago
    notes: 'Comprehensive 4-page curriculum vitae covering full publications, research, and deep architectural works.',
    dailyDownloads: [
      { date: 'Day 1', count: 5 },
      { date: 'Day 2', count: 12 },
      { date: 'Day 3', count: 14 },
      { date: 'Day 4', count: 19 },
      { date: 'Day 5', count: 22 },
      { date: 'Day 6', count: 28 },
      { date: 'Day 7', count: 31 },
    ],
  },
];

// Helper: load from localStorage with fallback
function loadLocalVersions(): ResumeVersion[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (raw) {
      const parsed = JSON.parse(raw);
      if (Array.isArray(parsed) && parsed.length > 0) return parsed;
    }
  } catch (e) {
    console.warn('Failed to parse local resume versions:', e);
  }
  return INITIAL_VERSIONS;
}

// Helper: save to localStorage
function saveLocalVersions(versions: ResumeVersion[]): void {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(versions));
  } catch (e) {
    console.warn('Failed to save local resume versions:', e);
  }
}

// Check rate limit: 10 uploads per hour
function checkRateLimit(): boolean {
  try {
    const now = Date.now();
    const raw = localStorage.getItem(RATE_LIMIT_KEY);
    let timestamps: number[] = raw ? JSON.parse(raw) : [];
    // Keep only timestamps from last 1 hour
    timestamps = timestamps.filter((t) => now - t < 60 * 60 * 1000);
    if (timestamps.length >= 10) {
      return false;
    }
    timestamps.push(now);
    localStorage.setItem(RATE_LIMIT_KEY, JSON.stringify(timestamps));
    return true;
  } catch {
    return true;
  }
}

/**
 * Fetch all versions (or filtered by type: 'resume' | 'cv')
 */
export async function getResumeVersions(type?: ResumeVersionType): Promise<ResumeVersion[]> {
  const all = loadLocalVersions();
  if (type) {
    return all.filter((v) => v.type === type);
  }
  return all;
}

/**
 * Upload a new resume or CV version
 */
export async function uploadResumeVersion(
  input: UploadResumeInput,
  userEmail = 'manojkc1dev@gmail.com'
): Promise<ResumeVersion> {
  const { file, type, label, notes, isActive, isPublic } = input;

  // Validation: MIME type
  if (file.type !== 'application/pdf' && !file.name.toLowerCase().endsWith('.pdf')) {
    throw new Error('Invalid file format. Only application/pdf files are accepted.');
  }

  // Validation: Max 5 MB
  const maxBytes = 5 * 1024 * 1024;
  if (file.size > maxBytes) {
    throw new Error('Upload failed. File exceeds the maximum 5 MB limit.');
  }

  // Check rate limit
  if (!checkRateLimit()) {
    throw new Error('Rate limit reached: Maximum 10 uploads per hour. Please try again later.');
  }

  // SHA-256 dedupe check
  const fileHashSha256 = await computeFileSha256(file);
  const currentVersions = loadLocalVersions();
  const duplicate = currentVersions.find(
    (v) => v.type === type && v.fileHashSha256 === fileHashSha256
  );
  if (duplicate) {
    throw new Error(
      `Duplicate file detected: Exactly matching file already uploaded as "${duplicate.label}".`
    );
  }

  const versionId = `rv-${Date.now()}-${Math.random().toString(36).substring(2, 7)}`;
  const publicEndpoint = type === 'resume' ? '/resume.pdf' : '/cv.pdf';

  // Create temporary object URL for immediate in-session viewing/downloading
  const blobUrl = URL.createObjectURL(file);

  const newVersion: ResumeVersion = {
    versionId,
    type,
    label: label.trim() || `${type === 'resume' ? 'Resume' : 'CV'} - ${new Date().toLocaleDateString('en-US', { month: 'short', year: 'numeric' })}`,
    fileName: file.name,
    storagePath: `/resume/${type}/${versionId}.pdf`,
    downloadUrl: blobUrl,
    fileSizeBytes: file.size,
    fileHashSha256,
    isActive,
    isPublic,
    downloadCount: 0,
    uploadedBy: userEmail,
    uploadedAt: Date.now(),
    notes: notes?.trim() || undefined,
    dailyDownloads: [
      { date: 'Day 1', count: 0 },
      { date: 'Day 2', count: 0 },
      { date: 'Day 3', count: 0 },
      { date: 'Day 4', count: 0 },
      { date: 'Day 5', count: 0 },
      { date: 'Day 6', count: 0 },
      { date: 'Day 7', count: 0 },
    ],
  };

  // If this version is marked active, unset existing active version of same type
  let updated = currentVersions.map((v) => {
    if (v.type === type && isActive && v.isActive) {
      return { ...v, isActive: false };
    }
    return v;
  });

  // If there are no other versions of this type, force isActive = true
  const sameTypeCount = updated.filter((v) => v.type === type).length;
  if (sameTypeCount === 0) {
    newVersion.isActive = true;
  }

  updated = [newVersion, ...updated];
  saveLocalVersions(updated);

  // Sync to global window state so navigation links can access blob
  try {
    if (newVersion.isActive) {
      (window as unknown as Record<string, unknown>)[`__active_${type}_url`] = blobUrl;
    }
  } catch {
    // Ignore
  }

  return newVersion;
}

/**
 * Set a specific version as the active version for its type
 */
export async function setActiveResumeVersion(
  versionId: string,
  type: ResumeVersionType
): Promise<ResumeVersion[]> {
  const versions = loadLocalVersions();
  const target = versions.find((v) => v.versionId === versionId);
  if (!target) {
    throw new Error('Version not found.');
  }

  const updated = versions.map((v) => {
    if (v.type === type) {
      return { ...v, isActive: v.versionId === versionId };
    }
    return v;
  });

  saveLocalVersions(updated);
  return updated;
}

/**
 * Toggle public availability for a version
 */
export async function toggleResumePublic(
  versionId: string,
  isPublic: boolean
): Promise<ResumeVersion[]> {
  const versions = loadLocalVersions();
  const updated = versions.map((v) => {
    if (v.versionId === versionId) {
      return { ...v, isPublic };
    }
    return v;
  });

  saveLocalVersions(updated);
  return updated;
}

/**
 * Delete a resume or CV version
 */
export async function deleteResumeVersion(versionId: string): Promise<ResumeVersion[]> {
  const versions = loadLocalVersions();
  const target = versions.find((v) => v.versionId === versionId);
  if (!target) {
    throw new Error('Version not found.');
  }

  if (target.isActive) {
    throw new Error('Cannot delete the active version. Please set another version as active first.');
  }

  const updated = versions.filter((v) => v.versionId !== versionId);
  saveLocalVersions(updated);
  return updated;
}

/**
 * Increment simulated download count
 */
export function recordDownload(versionId: string): void {
  const versions = loadLocalVersions();
  const updated = versions.map((v) => {
    if (v.versionId === versionId) {
      return { ...v, downloadCount: v.downloadCount + 1 };
    }
    return v;
  });
  saveLocalVersions(updated);
}

/**
 * Invalidate CDN Cache
 */
export async function purgeResumeCache(): Promise<{ success: boolean; purgedAt: number }> {
  // Simulate CDN edge purge
  await new Promise((resolve) => setTimeout(resolve, 800));
  return { success: true, purgedAt: Date.now() };
}

/**
 * Export all versions metadata as JSON string
 */
export function exportVersionsMetadata(): string {
  const versions = loadLocalVersions();
  return JSON.stringify(versions, null, 2);
}
