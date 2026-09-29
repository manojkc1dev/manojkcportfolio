export type Theme = 'dark' | 'light';

export type ProjectCategory = 'backend' | 'fullstack' | 'tools' | 'opensource';
export type ProjectStatus = 'live' | 'ongoing' | 'archived';

export interface ProjectLinks {
  live?: string;
  github?: string;
  caseStudy?: string;
  apiDocs?: string;
  postman?: string;
  video?: string;
}

export interface Metric {
  label: string;
  value: string;
  icon?: 'speed' | 'users' | 'db' | 'payment' | 'uptime';
}

export interface Challenge {
  title: string;
  problem: string;
  approach: string;
  outcome: string;
}

export type ProofBadge =
  | 'live-demo'
  | 'public-repo'
  | 'readme'
  | 'tests'
  | 'ci-passing'
  | 'deployed'
  | 'api-docs'
  | 'docker'
  | 'postman-collection';

export interface TechChoice {
  layer: string;
  choice: string;
  why: string;
}

export interface Project {
  id: string; // kebab-case slug, unique
  title: string;
  tagline: string;
  description: string;
  category?: ProjectCategory;
  year?: number;
  status?: ProjectStatus;
  highlights: string[]; // 3-5 bullet points
  tech: string[];
  links: {
    live?: string;
    github?: string;
    caseStudy?: string;
    apiDocs?: string;
    postman?: string;
    video?: string;
  };
  featured: boolean;
  image: string;

  // Additive Case Study Fields (all optional)
  role?: string; // "Solo" | "Team of 2"
  duration?: string; // "3 months"
  gallery?: string[]; // screenshot paths
  metrics?: Metric[];
  proof?: ProofBadge[];
  problem?: string;
  solution?: string;
  architecture?: string; // mermaid string
  whatIBuilt?: string[];
  techStackTable?: TechChoice[];
  challenges?: Challenge[];
  lessonsLearned?: string[];
  relatedProjects?: string[];
}

export interface SocialLink {
  name: string;
  url: string;
  icon: string;
  handle: string;
}

export interface ProfileStat {
  id: string;
  label: string;
  value: string;
  subtext?: string;
  iconName: string;
}

export interface Profile {
  name: string;
  title: string;
  tagline: string;
  bio: string[];
  photo: string;
  location: string;
  email: string;
  phone?: string;
  availability: string;
  resumeUrl: string;
  stats: ProfileStat[];
  socials: SocialLink[];
}

export type SkillLevel = 'learning' | 'intermediate' | 'advanced' | 'expert';

export interface SkillItem {
  name: string;
  iconName?: string;
  highlight?: boolean;
  proficiency?: 'Advanced' | 'Intermediate' | 'Learning';
  level?: SkillLevel;
  years?: number;
}

export type Skill = SkillItem;

export interface SkillCategory {
  id?: string;
  category: string;
  title?: string;
  description: string;
  skills: SkillItem[];
}

export interface SkillGroup {
  id: string;
  title: string;
  category?: string;
  description?: string;
  skills: SkillItem[];
}

export type ExperienceType = 'fulltime' | 'internship' | 'freelance' | 'education';

export interface Experience {
  id: string;
  role: string;
  company: string;
  companyUrl?: string;
  period?: string;
  start?: string;
  end?: string | 'present';
  location: string;
  type: ExperienceType | string;
  description?: string;
  bullets: string[];
  tech: string[];
}


