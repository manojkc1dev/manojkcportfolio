import React, { createContext, useContext, useState, useEffect } from 'react';
import axiosInstance from '../lib/axios';
import {
  HeroData,
  AboutData,
  TechStackItem,
  SkillItem,
  Project,
  BlogPost,
  Certification,
  Experience,
  Education,
  Service,
  Client,
  Testimonial,
  SocialLink,
  ResumeData,
  ContactMessage,
  NewsletterSubscriber,
  MediaFile,
  AuditLog,
  SiteAnalytics,
  SeoConfig,
  User,
  UserRole
} from '../types';
import {
  heroService,
  aboutService,
  projectsService,
  skillsService,
  techstackService,
  experienceService,
  educationService,
  certificationsService,
  blogsService,
  contactService,
  socialsService,
  resumeService,
  newsletterService,
  authService,
} from '../services';
import {
  INITIAL_USER,
  INITIAL_HERO,
  INITIAL_ABOUT,
  INITIAL_TECH_STACK,
  INITIAL_SKILLS,
  INITIAL_PROJECTS,
  INITIAL_BLOGS,
  INITIAL_CERTIFICATIONS,
  INITIAL_EXPERIENCES,
  INITIAL_EDUCATIONS,
  INITIAL_SERVICES,
  INITIAL_CLIENTS,
  INITIAL_TESTIMONIALS,
  INITIAL_SOCIALS,
  INITIAL_RESUME,
  INITIAL_MESSAGES,
  INITIAL_NEWSLETTER,
  INITIAL_MEDIA_FILES,
  INITIAL_AUDIT_LOGS,
  INITIAL_ANALYTICS,
  INITIAL_SEO,
} from '../data/initialData';

interface CMSContextType {
  // Navigation & View State
  currentUser: User;
  activeRole: string;
  setActiveRole: (role: any) => void;
  setCurrentRole: (role: UserRole) => void;
  darkMode: boolean;
  toggleDarkMode: () => void;

  // Data Collections
  hero: HeroData;
  updateHero: (data: Partial<HeroData>) => void;
  about: AboutData;
  updateAbout: (data: Partial<AboutData>) => void;
  techStack: TechStackItem[];
  addTechStackItem: (item: Omit<TechStackItem, 'id'>) => void;
  updateTechStackItem: (id: string, item: Partial<TechStackItem>) => void;
  deleteTechStackItem: (id: string) => void;
  skills: SkillItem[];
  addSkillItem: (skill: Omit<SkillItem, 'id'>) => void;
  updateSkillItem: (id: string, skill: Partial<SkillItem>) => void;
  deleteSkillItem: (id: string) => void;
  projects: Project[];
  addProject: (proj: Omit<Project, 'id' | 'createdAt' | 'updatedAt' | 'viewsCount' | 'likesCount' | 'sharesCount'>) => void;
  updateProject: (id: string, proj: Partial<Project>) => void;
  deleteProject: (id: string) => void;
  blogs: BlogPost[];
  addBlog: (blog: Omit<BlogPost, 'id' | 'viewsCount' | 'likesCount'>) => void;
  updateBlog: (id: string, blog: Partial<BlogPost>) => void;
  deleteBlog: (id: string) => void;
  certifications: Certification[];
  addCertification: (cert: Omit<Certification, 'id'>) => void;
  updateCertification: (id: string, cert: Partial<Certification>) => void;
  deleteCertification: (id: string) => void;
  experiences: Experience[];
  addExperience: (exp: Omit<Experience, 'id'>) => void;
  updateExperience: (id: string, exp: Partial<Experience>) => void;
  deleteExperience: (id: string) => void;
  educations: Education[];
  addEducation: (edu: Omit<Education, 'id'>) => void;
  updateEducation: (id: string, edu: Partial<Education>) => void;
  deleteEducation: (id: string) => void;
  services: Service[];
  addService: (srv: Omit<Service, 'id'>) => void;
  updateService: (id: string, srv: Partial<Service>) => void;
  deleteService: (id: string) => void;
  clients: Client[];
  addClient: (cli: Omit<Client, 'id'>) => void;
  updateClient: (id: string, cli: Partial<Client>) => void;
  deleteClient: (id: string) => void;
  testimonials: Testimonial[];
  addTestimonial: (test: Omit<Testimonial, 'id'>) => void;
  updateTestimonial: (id: string, test: Partial<Testimonial>) => void;
  deleteTestimonial: (id: string) => void;
  socials: SocialLink[];
  updateSocial: (id: string, soc: Partial<SocialLink>) => void;
  resume: ResumeData;
  updateResume: (data: Partial<ResumeData>) => void;
  incrementResumeDownloads: () => void;
  messages: ContactMessage[];
  addContactMessage: (msg: Omit<ContactMessage, 'id' | 'createdAt' | 'ip' | 'country' | 'browser' | 'device' | 'status' | 'starred'>) => void;
  updateContactMessage: (id: string, data: Partial<ContactMessage>) => void;
  deleteContactMessage: (id: string) => void;
  newsletter: NewsletterSubscriber[];
  addNewsletterSubscriber: (email: string, source?: string) => boolean;
  mediaFiles: MediaFile[];
  addMediaFile: (file: Omit<MediaFile, 'id' | 'uploadedAt'>) => void;
  deleteMediaFile: (id: string) => void;
  auditLogs: AuditLog[];
  logAuditAction: (action: AuditLog['action'], module: string, details: string) => void;
  analytics: SiteAnalytics;
  seo: SeoConfig;
  updateSeo: (data: Partial<SeoConfig>) => void;

  // Active Modals & Selection State
  activeProjectModal: Project | null;
  setActiveProjectModal: (proj: Project | null) => void;
  activeBlogModal: BlogPost | null;
  setActiveBlogModal: (blog: BlogPost | null) => void;
  isSearchOpen: boolean;
  setIsSearchOpen: (open: boolean) => void;
  isSeoInspectorOpen: boolean;
  setIsSeoInspectorOpen: (open: boolean) => void;
  isArchitectureDocsOpen: boolean;
  setIsArchitectureDocsOpen: (open: boolean) => void;
  isResumeModalOpen: boolean;
  setIsResumeModalOpen: (open: boolean) => void;

  // Global reset
  resetToDefaultData: () => void;
}

const CMSContext = createContext<CMSContextType | undefined>(undefined);

const LOCAL_STORAGE_KEY = 'portfolio_cms_v1_state';

export const CMSProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [currentUser, setCurrentUser] = useState<User>(INITIAL_USER);
  const [darkMode, setDarkMode] = useState<boolean>(true);

  // Data states
  const [hero, setHero] = useState<HeroData>(INITIAL_HERO);
  const [about, setAbout] = useState<AboutData>(INITIAL_ABOUT);
  const [techStack, setTechStack] = useState<TechStackItem[]>(INITIAL_TECH_STACK);
  const [skills, setSkills] = useState<SkillItem[]>(INITIAL_SKILLS);
  const [projects, setProjects] = useState<Project[]>(INITIAL_PROJECTS);
  const [blogs, setBlogs] = useState<BlogPost[]>(INITIAL_BLOGS);
  const [certifications, setCertifications] = useState<Certification[]>(INITIAL_CERTIFICATIONS);
  const [experiences, setExperiences] = useState<Experience[]>(INITIAL_EXPERIENCES);
  const [educations, setEducations] = useState<Education[]>(INITIAL_EDUCATIONS);
  const [services, setServices] = useState<Service[]>(INITIAL_SERVICES);
  const [clients, setClients] = useState<Client[]>(INITIAL_CLIENTS);
  const [testimonials, setTestimonials] = useState<Testimonial[]>(INITIAL_TESTIMONIALS);
  const [socials, setSocials] = useState<SocialLink[]>(INITIAL_SOCIALS);
  const [resume, setResume] = useState<ResumeData>(INITIAL_RESUME);
  const [messages, setMessages] = useState<ContactMessage[]>(INITIAL_MESSAGES);
  const [newsletter, setNewsletter] = useState<NewsletterSubscriber[]>(INITIAL_NEWSLETTER);
  const [mediaFiles, setMediaFiles] = useState<MediaFile[]>(INITIAL_MEDIA_FILES);
  const [auditLogs, setAuditLogs] = useState<AuditLog[]>(INITIAL_AUDIT_LOGS);
  const [analytics, setAnalytics] = useState<SiteAnalytics>(INITIAL_ANALYTICS);
  const [seo, setSeo] = useState<SeoConfig>(INITIAL_SEO);

  // Modals state
  const [activeProjectModal, setActiveProjectModal] = useState<Project | null>(null);
  const [activeBlogModal, setActiveBlogModal] = useState<BlogPost | null>(null);
  const [isSearchOpen, setIsSearchOpen] = useState<boolean>(false);
  const [isSeoInspectorOpen, setIsSeoInspectorOpen] = useState<boolean>(false);
  const [isArchitectureDocsOpen, setIsArchitectureDocsOpen] = useState<boolean>(false);
  const [isResumeModalOpen, setIsResumeModalOpen] = useState<boolean>(false);

  // Load from API on initial render
  useEffect(() => {
    const fetchInitialData = async () => {
      try {
        // Fetch hero data
        const heroResponse = await heroService.getAll();
        if (heroResponse.success && heroResponse.data && heroResponse.data.length > 0) {
          setHero(heroResponse.data[0]);
        } else {
          setHero(INITIAL_HERO);
        }

        // Fetch about data
        const aboutResponse = await aboutService.getAll();
        if (aboutResponse.success && aboutResponse.data && aboutResponse.data.length > 0) {
          setAbout(aboutResponse.data[0]);
        } else {
          setAbout(INITIAL_ABOUT);
        }

        // Fetch tech stack
        const techStackResponse = await techstackService.getAll();
        if (techStackResponse.success && techStackResponse.data) {
          setTechStack(techStackResponse.data);
        } else {
          setTechStack(INITIAL_TECH_STACK);
        }

        // Fetch skills
        const skillsResponse = await skillsService.getAll();
        if (skillsResponse.success && skillsResponse.data) {
          setSkills(skillsResponse.data);
        } else {
          setSkills(INITIAL_SKILLS);
        }

        // Fetch projects
        const projectsResponse = await projectsService.getAll();
        if (projectsResponse.success && projectsResponse.data) {
          setProjects(projectsResponse.data);
        } else {
          setProjects(INITIAL_PROJECTS);
        }

        // Fetch experience
        const experienceResponse = await experienceService.getAll();
        if (experienceResponse.success && experienceResponse.data) {
          setExperiences(experienceResponse.data);
        } else {
          setExperiences(INITIAL_EXPERIENCES);
        }

        // Fetch education
        const educationResponse = await educationService.getAll();
        if (educationResponse.success && educationResponse.data) {
          setEducations(educationResponse.data);
        } else {
          setEducations(INITIAL_EDUCATIONS);
        }

        // Fetch certifications
        const certificationsResponse = await certificationsService.getAll();
        if (certificationsResponse.success && certificationsResponse.data) {
          setCertifications(certificationsResponse.data);
        } else {
          setCertifications(INITIAL_CERTIFICATIONS);
        }

        // Fetch blogs
        const blogsResponse = await blogsService.getAll();
        if (blogsResponse.success && blogsResponse.data) {
          setBlogs(blogsResponse.data);
        } else {
          setBlogs(INITIAL_BLOGS);
        }

        // Fetch socials
        const socialsResponse = await socialsService.getAll();
        if (socialsResponse.success && socialsResponse.data) {
          setSocials(socialsResponse.data);
        } else {
          setSocials(INITIAL_SOCIALS);
        }

        // Fetch resume
        const resumeResponse = await resumeService.get();
        if (resumeResponse.success && resumeResponse.data) {
          setResume(resumeResponse.data);
        } else {
          setResume(INITIAL_RESUME);
        }

      } catch (error) {
        console.error('Failed to fetch initial data from API:', error);
        // Fallback to initial data if API fails
        setHero(INITIAL_HERO);
        setAbout(INITIAL_ABOUT);
        setTechStack(INITIAL_TECH_STACK);
        setSkills(INITIAL_SKILLS);
        setProjects(INITIAL_PROJECTS);
        setExperiences(INITIAL_EXPERIENCES);
        setEducations(INITIAL_EDUCATIONS);
        setCertifications(INITIAL_CERTIFICATIONS);
        setBlogs(INITIAL_BLOGS);
        setSocials(INITIAL_SOCIALS);
        setResume(INITIAL_RESUME);
      }
    };

    fetchInitialData();
  }, []);

  // Save state to localStorage
  useEffect(() => {
    try {
      const stateToSave = {
        hero, about, techStack, skills, projects, blogs, certifications,
        experiences, educations, services, clients, testimonials,
        socials, resume, messages, newsletter, mediaFiles, auditLogs, analytics, seo
      };
      localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(stateToSave));
    } catch (e) {
      console.error('Failed to save state to local storage', e);
    }
  }, [
    hero, about, techStack, skills, projects, blogs, certifications,
    experiences, educations, services, clients, testimonials,
    socials, resume, messages, newsletter, mediaFiles, auditLogs, analytics, seo
  ]);

  // Dark mode effect
  useEffect(() => {
    const root = document.documentElement;
    if (darkMode) {
      root.classList.add('dark');
    } else {
      root.classList.remove('dark');
    }
  }, [darkMode]);

  const toggleDarkMode = () => setDarkMode(!darkMode);

  const setCurrentRole = (role: UserRole) => {
    setCurrentUser((prev) => ({ ...prev, role }));
    logAuditAction('SETTINGS_CHANGE', 'User Role', `Changed active role to ${role}`);
  };

  const logAuditAction = (action: AuditLog['action'], module: string, details: string) => {
    const newLog: AuditLog = {
      id: 'aud_' + Date.now(),
      userEmail: currentUser.email,
      userRole: currentUser.role,
      action,
      module,
      details,
      ipAddress: '127.0.0.1',
      timestamp: new Date().toISOString()
    };
    setAuditLogs((prev) => [newLog, ...prev]);
  };

  // Updaters & Helpers
  const updateHero = (data: Partial<HeroData>) => {
    setHero((prev) => ({ ...prev, ...data, updatedAt: new Date().toISOString() }));
    logAuditAction('UPDATE', 'Hero Section', 'Updated Hero Section content');
  };

  const updateAbout = (data: Partial<AboutData>) => {
    setAbout((prev) => ({ ...prev, ...data, updatedAt: new Date().toISOString() }));
    logAuditAction('UPDATE', 'About Section', 'Updated About Section bio & highlights');
  };

  const addTechStackItem = (item: Omit<TechStackItem, 'id'>) => {
    const newItem: TechStackItem = { ...item, id: 'ts_' + Date.now() };
    setTechStack((prev) => [...prev, newItem]);
    logAuditAction('CREATE', 'Tech Stack', `Added tech stack item "${newItem.name}"`);
  };

  const updateTechStackItem = (id: string, item: Partial<TechStackItem>) => {
    setTechStack((prev) => prev.map((t) => (t.id === id ? { ...t, ...item } : t)));
    logAuditAction('UPDATE', 'Tech Stack', `Updated tech stack item #${id}`);
  };

  const deleteTechStackItem = (id: string) => {
    setTechStack((prev) => prev.filter((t) => t.id !== id));
    logAuditAction('DELETE', 'Tech Stack', `Deleted tech stack item #${id}`);
  };

  const addSkillItem = (skill: Omit<SkillItem, 'id'>) => {
    const newSkill: SkillItem = { ...skill, id: 'sk_' + Date.now() };
    setSkills((prev) => [...prev, newSkill]);
    logAuditAction('CREATE', 'Skills', `Added skill "${newSkill.name}"`);
  };

  const updateSkillItem = (id: string, skill: Partial<SkillItem>) => {
    setSkills((prev) => prev.map((s) => (s.id === id ? { ...s, ...skill } : s)));
    logAuditAction('UPDATE', 'Skills', `Updated skill #${id}`);
  };

  const deleteSkillItem = (id: string) => {
    setSkills((prev) => prev.filter((s) => s.id !== id));
    logAuditAction('DELETE', 'Skills', `Deleted skill #${id}`);
  };

  const addProject = (proj: Omit<Project, 'id' | 'createdAt' | 'updatedAt' | 'viewsCount' | 'likesCount' | 'sharesCount'>) => {
    const newProject: Project = {
      ...proj,
      id: 'proj_' + Date.now(),
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      viewsCount: 0,
      likesCount: 0,
      sharesCount: 0,
    };
    setProjects((prev) => [newProject, ...prev]);
    logAuditAction('CREATE', 'Projects', `Created new project "${newProject.title}"`);
  };

  const updateProject = (id: string, proj: Partial<Project>) => {
    setProjects((prev) =>
      prev.map((p) => (p.id === id ? { ...p, ...proj, updatedAt: new Date().toISOString() } : p))
    );
    logAuditAction('UPDATE', 'Projects', `Updated project #${id}`);
  };

  const deleteProject = (id: string) => {
    setProjects((prev) => prev.filter((p) => p.id !== id));
    logAuditAction('DELETE', 'Projects', `Deleted project #${id}`);
  };

  const addBlog = (blog: Omit<BlogPost, 'id' | 'viewsCount' | 'likesCount'>) => {
    const newBlog: BlogPost = {
      ...blog,
      id: 'blog_' + Date.now(),
      viewsCount: 0,
      likesCount: 0,
    };
    setBlogs((prev) => [newBlog, ...prev]);
    logAuditAction('CREATE', 'Blog CMS', `Published blog post "${newBlog.title}"`);
  };

  const updateBlog = (id: string, blog: Partial<BlogPost>) => {
    setBlogs((prev) => prev.map((b) => (b.id === id ? { ...b, ...blog } : b)));
    logAuditAction('UPDATE', 'Blog CMS', `Updated blog post #${id}`);
  };

  const deleteBlog = (id: string) => {
    setBlogs((prev) => prev.filter((b) => b.id !== id));
    logAuditAction('DELETE', 'Blog CMS', `Deleted blog post #${id}`);
  };

  const addCertification = (cert: Omit<Certification, 'id'>) => {
    const newCert: Certification = { ...cert, id: 'cert_' + Date.now() };
    setCertifications((prev) => [...prev, newCert]);
    logAuditAction('CREATE', 'Certifications', `Added certification "${newCert.title}"`);
  };

  const updateCertification = (id: string, cert: Partial<Certification>) => {
    setCertifications((prev) => prev.map((c) => (c.id === id ? { ...c, ...cert } : c)));
    logAuditAction('UPDATE', 'Certifications', `Updated certification #${id}`);
  };

  const deleteCertification = (id: string) => {
    setCertifications((prev) => prev.filter((c) => c.id !== id));
    logAuditAction('DELETE', 'Certifications', `Deleted certification #${id}`);
  };

  const addExperience = (exp: Omit<Experience, 'id'>) => {
    const newExp: Experience = { ...exp, id: 'exp_' + Date.now() };
    setExperiences((prev) => [...prev, newExp]);
    logAuditAction('CREATE', 'Experience', `Added experience "${newExp.position} at ${newExp.company}"`);
  };

  const updateExperience = (id: string, exp: Partial<Experience>) => {
    setExperiences((prev) => prev.map((e) => (e.id === id ? { ...e, ...exp } : e)));
    logAuditAction('UPDATE', 'Experience', `Updated experience #${id}`);
  };

  const deleteExperience = (id: string) => {
    setExperiences((prev) => prev.filter((e) => e.id !== id));
    logAuditAction('DELETE', 'Experience', `Deleted experience #${id}`);
  };

  const addEducation = (edu: Omit<Education, 'id'>) => {
    const newEdu: Education = { ...edu, id: 'edu_' + Date.now() };
    setEducations((prev) => [...prev, newEdu]);
    logAuditAction('CREATE', 'Education', `Added education "${newEdu.degree}"`);
  };

  const updateEducation = (id: string, edu: Partial<Education>) => {
    setEducations((prev) => prev.map((e) => (e.id === id ? { ...e, ...edu } : e)));
    logAuditAction('UPDATE', 'Education', `Updated education #${id}`);
  };

  const deleteEducation = (id: string) => {
    setEducations((prev) => prev.filter((e) => e.id !== id));
    logAuditAction('DELETE', 'Education', `Deleted education #${id}`);
  };

  const addService = (srv: Omit<Service, 'id'>) => {
    const newSrv: Service = { ...srv, id: 'srv_' + Date.now() };
    setServices((prev) => [...prev, newSrv]);
    logAuditAction('CREATE', 'Services', `Added service "${newSrv.title}"`);
  };

  const updateService = (id: string, srv: Partial<Service>) => {
    setServices((prev) => prev.map((s) => (s.id === id ? { ...s, ...srv } : s)));
    logAuditAction('UPDATE', 'Services', `Updated service #${id}`);
  };

  const deleteService = (id: string) => {
    setServices((prev) => prev.filter((s) => s.id !== id));
    logAuditAction('DELETE', 'Services', `Deleted service #${id}`);
  };

  const addClient = (cli: Omit<Client, 'id'>) => {
    const newCli: Client = { ...cli, id: 'cli_' + Date.now() };
    setClients((prev) => [...prev, newCli]);
    logAuditAction('CREATE', 'Clients', `Added client "${newCli.name}"`);
  };

  const updateClient = (id: string, cli: Partial<Client>) => {
    setClients((prev) => prev.map((c) => (c.id === id ? { ...c, ...cli } : c)));
    logAuditAction('UPDATE', 'Clients', `Updated client #${id}`);
  };

  const deleteClient = (id: string) => {
    setClients((prev) => prev.filter((c) => c.id !== id));
    logAuditAction('DELETE', 'Clients', `Deleted client #${id}`);
  };

  const addTestimonial = (test: Omit<Testimonial, 'id'>) => {
    const newTest: Testimonial = { ...test, id: 'test_' + Date.now() };
    setTestimonials((prev) => [...prev, newTest]);
    logAuditAction('CREATE', 'Testimonials', `Added testimonial from "${newTest.clientName}"`);
  };

  const updateTestimonial = (id: string, test: Partial<Testimonial>) => {
    setTestimonials((prev) => prev.map((t) => (t.id === id ? { ...t, ...test } : t)));
    logAuditAction('UPDATE', 'Testimonials', `Updated testimonial #${id}`);
  };

  const deleteTestimonial = (id: string) => {
    setTestimonials((prev) => prev.filter((t) => t.id !== id));
    logAuditAction('DELETE', 'Testimonials', `Deleted testimonial #${id}`);
  };

  const updateSocial = (id: string, soc: Partial<SocialLink>) => {
    setSocials((prev) => prev.map((s) => (s.id === id ? { ...s, ...soc } : s)));
    logAuditAction('UPDATE', 'Social Links', `Updated social link #${id}`);
  };

  const updateResume = (data: Partial<ResumeData>) => {
    setResume((prev) => ({ ...prev, ...data }));
    logAuditAction('UPDATE', 'Resume Module', 'Updated Resume PDF/DOCX links & version');
  };

  const incrementResumeDownloads = () => {
    setResume((prev) => ({ ...prev, downloadsCount: prev.downloadsCount + 1 }));
    setAnalytics((prev) => ({ ...prev, resumeDownloads: prev.resumeDownloads + 1 }));
  };

  const addContactMessage = (msg: Omit<ContactMessage, 'id' | 'createdAt' | 'ip' | 'country' | 'browser' | 'device' | 'status' | 'starred'>) => {
    const newMsg: ContactMessage = {
      ...msg,
      id: 'msg_' + Date.now(),
      createdAt: new Date().toISOString(),
      ip: '192.168.1.108',
      country: 'United States 🇺🇸',
      browser: 'Chrome 128 / macOS',
      device: 'Desktop',
      status: 'Unread',
      starred: false,
    };
    setMessages((prev) => [newMsg, ...prev]);
    setAnalytics((prev) => ({ ...prev, contactRequests: prev.contactRequests + 1 }));
  };

  const updateContactMessage = (id: string, data: Partial<ContactMessage>) => {
    setMessages((prev) => prev.map((m) => (m.id === id ? { ...m, ...data } : m)));
    logAuditAction('UPDATE', 'Contact Messages', `Updated status or reply for message #${id}`);
  };

  const deleteContactMessage = (id: string) => {
    setMessages((prev) => prev.filter((m) => m.id !== id));
    logAuditAction('DELETE', 'Contact Messages', `Deleted message #${id}`);
  };

  const addNewsletterSubscriber = (email: string, source = 'Website Footer'): boolean => {
    const exists = newsletter.some((n) => n.email.toLowerCase() === email.toLowerCase());
    if (exists) return false;
    const newSub: NewsletterSubscriber = {
      id: 'nl_' + Date.now(),
      email,
      subscribedAt: new Date().toISOString(),
      status: 'Active',
      source,
    };
    setNewsletter((prev) => [newSub, ...prev]);
    return true;
  };

  const addMediaFile = (file: Omit<MediaFile, 'id' | 'uploadedAt'>) => {
    const newMedia: MediaFile = {
      ...file,
      id: 'med_' + Date.now(),
      uploadedAt: new Date().toISOString(),
    };
    setMediaFiles((prev) => [newMedia, ...prev]);
    logAuditAction('CREATE', 'Media Manager', `Uploaded media file "${newMedia.name}"`);
  };

  const deleteMediaFile = (id: string) => {
    setMediaFiles((prev) => prev.filter((m) => m.id !== id));
    logAuditAction('DELETE', 'Media Manager', `Deleted media file #${id}`);
  };

  const updateSeo = (data: Partial<SeoConfig>) => {
    setSeo((prev) => ({ ...prev, ...data }));
    logAuditAction('UPDATE', 'SEO Module', 'Updated site SEO meta and JSON-LD schema config');
  };

  const resetToDefaultData = () => {
    localStorage.removeItem(LOCAL_STORAGE_KEY);
    setHero(INITIAL_HERO);
    setAbout(INITIAL_ABOUT);
    setTechStack(INITIAL_TECH_STACK);
    setSkills(INITIAL_SKILLS);
    setProjects(INITIAL_PROJECTS);
    setBlogs(INITIAL_BLOGS);
    setCertifications(INITIAL_CERTIFICATIONS);
    setExperiences(INITIAL_EXPERIENCES);
    setEducations(INITIAL_EDUCATIONS);
    setServices(INITIAL_SERVICES);
    setClients(INITIAL_CLIENTS);
    setTestimonials(INITIAL_TESTIMONIALS);
    setSocials(INITIAL_SOCIALS);
    setResume(INITIAL_RESUME);
    setMessages(INITIAL_MESSAGES);
    setNewsletter(INITIAL_NEWSLETTER);
    setMediaFiles(INITIAL_MEDIA_FILES);
    setAuditLogs(INITIAL_AUDIT_LOGS);
    setAnalytics(INITIAL_ANALYTICS);
    setSeo(INITIAL_SEO);
    logAuditAction('SETTINGS_CHANGE', 'System', 'Reset all CMS data to default enterprise seed dataset');
  };

  return (
    <CMSContext.Provider
      value={{
        currentUser,
        activeRole: currentUser.role,
        setActiveRole: (role: any) => setCurrentRole(role),
        setCurrentRole,
        darkMode,
        toggleDarkMode,

        hero,
        updateHero,
        about,
        updateAbout,
        techStack,
        addTechStackItem,
        updateTechStackItem,
        deleteTechStackItem,
        skills,
        addSkillItem,
        updateSkillItem,
        deleteSkillItem,
        projects,
        addProject,
        updateProject,
        deleteProject,
        blogs,
        addBlog,
        updateBlog,
        deleteBlog,
        certifications,
        addCertification,
        updateCertification,
        deleteCertification,
        experiences,
        addExperience,
        updateExperience,
        deleteExperience,
        educations,
        addEducation,
        updateEducation,
        deleteEducation,
        services,
        addService,
        updateService,
        deleteService,
        clients,
        addClient,
        updateClient,
        deleteClient,
        testimonials,
        addTestimonial,
        updateTestimonial,
        deleteTestimonial,
        socials,
        updateSocial,
        resume,
        updateResume,
        incrementResumeDownloads,
        messages,
        addContactMessage,
        updateContactMessage,
        deleteContactMessage,
        newsletter,
        addNewsletterSubscriber,
        mediaFiles,
        addMediaFile,
        deleteMediaFile,
        auditLogs,
        logAuditAction,
        analytics,
        seo,
        updateSeo,

        activeProjectModal,
        setActiveProjectModal,
        activeBlogModal,
        setActiveBlogModal,
        isSearchOpen,
        setIsSearchOpen,
        isSeoInspectorOpen,
        setIsSeoInspectorOpen,
        isArchitectureDocsOpen,
        setIsArchitectureDocsOpen,
        isResumeModalOpen,
        setIsResumeModalOpen,

        resetToDefaultData,
      }}
    >
      {children}
    </CMSContext.Provider>
  );
};

export const useCMS = () => {
  const context = useContext(CMSContext);
  if (!context) {
    throw new Error('useCMS must be used within a CMSProvider');
  }
  return context;
};
