// Export all services
export { api, apiRequest } from './api';
export type { ApiResponse } from './api';
export { authService } from './auth.service';
export { heroService } from './hero.service';
export { aboutService } from './about.service';
export { projectsService } from './projects.service';
export { skillsService } from './skills.service';
export { techstackService } from './techstack.service';
export { experienceService } from './experience.service';
export { educationService } from './education.service';
export { certificationsService } from './certifications.service';
export { blogsService } from './blogs.service';
export { contactService } from './contact.service';
export { socialsService } from './socials.service';
export { resumeService } from './resume.service';
export { newsletterService } from './newsletter.service';

// Export types
export type { LoginCredentials, RegisterData, AuthResponse, ChangePasswordData } from './auth.service';
export type { HeroData } from '../types';
export type { AboutData } from '../types';
export type { Project } from '../types';
export type { SkillItem } from '../types';
export type { TechStackItem } from '../types';
export type { Experience } from '../types';
export type { Education } from '../types';
export type { Certification } from '../types';
export type { BlogPost } from '../types';
export type { ContactMessage } from '../types';
export type { ContactFormData } from './contact.service';
export type { SocialLink } from '../types';
export type { ResumeData } from '../types';
export type { NewsletterSubscriber } from '../types';
