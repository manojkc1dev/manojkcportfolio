export type ResumeVersionType = 'resume' | 'cv';

export interface DailyDownloadStat {
  date: string; // YYYY-MM-DD
  count: number;
}

export interface ResumeVersion {
  versionId: string;
  type: ResumeVersionType;
  label: string;
  fileName: string;
  storagePath: string;
  downloadUrl: string;
  fileSizeBytes: number;
  fileHashSha256: string;
  isActive: boolean;
  isPublic: boolean;
  downloadCount: number;
  uploadedBy: string;
  uploadedAt: number; // Unix timestamp in milliseconds
  notes?: string;
  dailyDownloads?: DailyDownloadStat[];
}

export interface UploadResumeInput {
  file: File;
  type: ResumeVersionType;
  label: string;
  notes?: string;
  isActive: boolean;
  isPublic: boolean;
}

export interface VersionComparisonDelta {
  v1: ResumeVersion;
  v2: ResumeVersion;
  sizeDiffBytes: number;
  sizeDiffFormatted: string;
  downloadDiff: number;
  timeDiffDays: number;
}
