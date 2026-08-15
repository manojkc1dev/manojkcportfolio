export type UserRole = 'Super Admin' | 'Admin' | 'Editor' | 'Content Manager';

export interface User {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  avatar: string;
}

export interface HeroData {
  id: string;
  name: string;
  title: string;
  subtitle: string;
  description: string;
  availabilityBadge: string;
  location: string;
  profileImage: string;
  backgroundImage: string;
  resumeUrl: string;
  hireMeUrl: string;
  githubUrl: string;
  linkedinUrl: string;
  emailUrl: string;
  whatsappUrl: string;
  typingTexts: string[];
  status: 'Published' | 'Draft';
  order: number;
  updatedAt: string;
}

export interface AboutData {
  id: string;
  photo: string;
  bio: string;
  longDescription: string;
  mission: string;
  vision: string;
  yearsExperience: number;
  projectsCompleted: number;
  quote: string;
  highlights: string[];
  updatedAt: string;
}

export type TechCategory = 
  | 'Language' 
  | 'Framework' 
  | 'Library' 
  | 'Database' 
  | 'Cloud' 
  | 'DevOps' 
  | 'Tool' 
  | 'Testing' 
  | 'AI' 
  | 'Data Science'
  | 'Security'
  | 'Payments'
  | 'Frontend';

export interface TechStackItem {
  id: string;
  name: string;
  category: TechCategory;
  iconName: string; // Lucide icon or custom key
  color: string;
  officialWebsite: string;
  skillLevel: number; // 0-100
  yearsOfExperience: number;
  displayOrder: number;
  showOnHomepage: boolean;
  featured: boolean;
  status: 'Active' | 'Archived';
}

export interface SkillItem {
  id: string;
  name: string;
  category: string;
  percentage: number;
  yearsExperience: number;
  iconName: string;
  priority: number;
  featured: boolean;
}

export interface ProjectArchitectureNode {
  id: string;
  label: string;
  tech: string;
  type: 'client' | 'api' | 'cache' | 'db' | 'queue' | 'worker' | string;
}

export type ArchitectureNode = ProjectArchitectureNode;

export interface Project {
  id: string;
  title: string;
  slug: string;
  category: string; // e.g. "Distributed Systems", "AI / LLM", "FinTech SaaS"
  thumbnail: string;
  coverImage: string;
  gallery: string[];
  videoUrl?: string;
  description: string;
  problem: string;
  solution: string;
  architectureNodes?: ProjectArchitectureNode[];
  architectureDescription?: string;
  features: string[];
  challenges: string[];
  futureImprovements: string[];
  role: string;
  client?: string;
  company?: string;
  duration: string;
  teamSize: number;
  responsibilities: string[];
  techStack: string[]; // references TechStackItem names
  programmingLanguages: string[];
  frameworks: string[];
  databases: string[];
  apis: string[];
  authentication: string;
  deployment: string;
  githubUrl: string;
  liveDemoUrl: string;
  documentationUrl?: string;
  figmaUrl?: string;
  caseStudyUrl?: string;
  status: 'Published' | 'Draft' | 'Archived';
  isPrivate: boolean;
  featured: boolean;
  pinned: boolean;
  order: number;
  viewsCount: number;
  likesCount: number;
  sharesCount: number;
  seoTitle: string;
  seoDescription: string;
  createdAt: string;
  updatedAt: string;
}

export interface BlogPost {
  id: string;
  title: string;
  slug: string;
  content: string; // Markdown or Rich Text
  excerpt: string;
  tags: string[];
  category: string;
  readingTimeMinutes: number;
  featuredImage: string;
  status: 'Published' | 'Draft' | 'Scheduled';
  publishedAt: string;
  seoTitle: string;
  seoDescription: string;
  viewsCount: number;
  likesCount: number;
  authorName: string;
}

export interface Certification {
  id: string;
  title: string;
  issuer: string;
  credentialId: string;
  verificationUrl: string;
  issueDate: string;
  expiryDate?: string;
  logoUrl: string;
  status: 'Active' | 'Expired';
}

export interface Experience {
  id: string;
  company: string;
  position: string;
  employmentType: 'Full-Time' | 'Contract' | 'Consultant' | 'Part-Time';
  location: string;
  duration: string; // e.g., "2022 - Present"
  isCurrent: boolean;
  description: string;
  technologiesUsed: string[];
  achievements: string[];
  order: number;
}

export interface Education {
  id: string;
  institute: string;
  degree: string;
  major: string;
  duration: string;
  cgpa: string;
  description: string;
}

export interface Service {
  id: string;
  title: string;
  description: string;
  iconName: string;
  features: string[];
  deliverables: string[];
  startingPrice?: string;
}

export interface Client {
  id: string;
  name: string;
  logo: string;
  website: string;
  review?: string;
  industry: string;
}

export interface Testimonial {
  id: string;
  clientName: string;
  designation: string;
  company: string;
  photo: string;
  review: string;
  rating: number;
  featured: boolean;
}

export interface SocialLink {
  id: string;
  platform: string;
  url: string;
  iconName: string;
  enabled: boolean;
}

export interface ResumeData {
  id: string;
  pdfUrl: string;
  docxUrl: string;
  version: string;
  lastUpdated: string;
  downloadsCount: number;
}

export interface ContactMessage {
  id: string;
  name: string;
  email: string;
  phone?: string;
  subject: string;
  message: string;
  ip: string;
  country: string;
  browser: string;
  device: string;
  status: 'Unread' | 'Read' | 'Replied' | 'Spam';
  starred: boolean;
  replyText?: string;
  createdAt: string;
}

export interface NewsletterSubscriber {
  id: string;
  email: string;
  subscribedAt: string;
  status: 'Active' | 'Unsubscribed';
  source: string;
}

export interface MediaFile {
  id: string;
  name: string;
  url: string;
  folder: string;
  fileType: 'image' | 'video' | 'document';
  sizeBytes: number;
  dimensions?: string;
  altText: string;
  uploadedAt: string;
}

export interface AuditLog {
  id: string;
  userEmail: string;
  userRole: UserRole;
  action: 'LOGIN' | 'LOGOUT' | 'CREATE' | 'UPDATE' | 'DELETE' | 'EXPORT' | 'SETTINGS_CHANGE';
  module: string;
  details: string;
  ipAddress: string;
  timestamp: string;
}

export interface SiteAnalytics {
  totalVisitors: number;
  pageViews: number;
  contactRequests: number;
  resumeDownloads: number;
  visitorCountries: { country: string; code: string; count: number }[];
  deviceBreakdown: { name: string; count: number }[];
  viewsOverTime: { date: string; views: number; uniqueVisitors: number }[];
}

export interface SeoConfig {
  siteTitle: string;
  metaDescription: string;
  ogImage: string;
  twitterCard: string;
  canonicalUrl: string;
  robots: string;
  authorName: string;
  schemaType: string;
}
