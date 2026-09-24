export type AdminTab =
  | 'dashboard'
  | 'projects'
  | 'skills'
  | 'experience'
  | 'about'
  | 'inquiries'
  | 'socials'
  | 'settings'
  | 'security'
  // Legacy / Compatibility aliases
  | 'services'
  | 'blog'
  | 'homepage'
  | 'services-catalog'
  | 'contact-pricing'
  | 'footer-links'
  | 'logo-management'
  | 'company-identity'
  | 'social-media';

export interface AdminProject {
  id: string;
  title: string;
  slug: string;
  category: string;
  status: 'Deployed' | 'In Production' | 'In Development' | 'Completed' | 'Archived';
  visibility: 'Published' | 'Draft';
  featured: boolean;
  thumbnail: string;
  client?: string;
  industry?: string;
  yearDuration?: string;
  shortDescription: string;
  fullCaseStudy?: string;
  liveUrl?: string;
  githubUrl?: string;
  technologies: string[];
  languages: string[];
  keyHighlights?: string;
  gallery?: string[];
}

export interface AdminService {
  id: string;
  order: number;
  title: string;
  slug: string;
  icon: string;
  shortSummary: string;
  detailedScope?: string;
  features: string[];
  deliverables?: string[];
  technologies: string[];
  visibility: 'Published' | 'Draft';
  featured: boolean;
  coverImage?: string;
  metaTitle?: string;
  metaDescription?: string;
}

export interface AdminArticle {
  id: string;
  title: string;
  slug: string;
  category: string;
  date: string;
  visibility: 'Published' | 'Draft';
  featured: boolean;
  excerpt: string;
  content: string;
  headerImage?: string;
  authorName: string;
  authorRole: string;
  tags: string[];
  readTimeMinutes?: number;
}

export interface AdminInquiry {
  id: string;
  name: string;
  company?: string;
  email: string;
  phone?: string;
  hasWhatsApp?: boolean;
  scopeTitle: string;
  budgetRange: string;
  timeline?: string;
  message: string;
  submittedAt: string;
  status: 'New' | 'In Progress' | 'Closed' | 'Won';
  read: boolean;
  replied: boolean;
}

export interface HomepageContentState {
  heroHeading: string;
  heroTagline: string;
  heroDescription: string;
  primaryCtaText: string;
  primaryCtaLink: string;
  secondaryCtaText: string;
  secondaryCtaLink: string;
  aboutSummaryBlock: string;
  servicesSectionHeading: string;
  servicesSectionSubtitle: string;
  bottomCtaHeading: string;
  bottomCtaDescription: string;
  bottomCtaButtonLabel: string;
  bottomCtaButtonLink: string;
}

export interface AboutContentState {
  heading: string;
  subtitle: string;
  introParagraph: string;
  backgroundStory: string;
  mission: string;
  vision: string;
  principles: Array<{
    id: string;
    title: string;
    description: string;
  }>;
  metrics: Array<{
    id: string;
    value: string;
    label: string;
    helperNote: string;
  }>;
}

export interface ContactPricingState {
  officialEmail: string;
  primaryPhone: string;
  whatsappPhone: string;
  whatsappDirectLink: string;
  officeAddress: string;
  cityCountry: string;
  locationStatement: string;
  workingHours: string;
  indicativeBudgetStatement: string;
  budgetTiers: string;
  timelineOptions: string;
  projectTypes: string;
}

export interface FooterContentState {
  companyDescription: string;
  primaryMarket: string;
  targetMarkets: string;
  locationStatement: string;
  copyright: string;
  navigationLinks: Array<{
    id: string;
    title: string;
    url: string;
    category: 'Solutions' | 'Company';
    visible: boolean;
  }>;
}

export interface LogoManagementState {
  logoUrl: string;
  altText: string;
}

export interface CompanyIdentityState {
  companyName: string;
  slogan: string;
  shortDescription: string;
  fullDescription: string;
  primaryMarket: string;
  targetMarketsFormatted: string;
  internationalCountries: string;
}

export interface SocialProfile {
  id: string;
  platform: string;
  url: string;
  visible: boolean;
}

export interface GlobalSettingsState {
  entityName: string;
  tagline: string;
  primaryDomesticMarket: string;
  targetInternationalMarkets: string;
  siteTitleTemplate: string;
  metaDescription: string;
  keywords: string;
}

export interface AdminSiteContent {
  heroBadge: string;
  heroTitle: string;
  heroSubtitle: string;
  primaryCta: string;
  secondaryCta: string;
  stats: Array<{
    value: string;
    label: string;
    description: string;
  }>;
  pillars: Array<{
    title: string;
    description: string;
    focus: string;
  }>;
  contactLocation: string;
  contactEmail: string;
  contactPhone: string;
  whatsappLink: string;
  githubLink: string;
  linkedinLink: string;
}
