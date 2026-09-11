import React, { createContext, useContext, useState, useEffect } from "react";
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
  UserRole,
} from "../types";
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
  dashboardService,
  servicesService,
  clientsService,
  testimonialsService,
  analyticsService,
  mediaService,
  auditLogsService,
  seoService,
} from "../services";
import type { DashboardAnalytics } from "../services/dashboard.service";

interface CMSContextType {
  // Navigation & View State
  currentUser: User | null;
  activeRole: string;
  setActiveRole: (role: any) => void;
  setCurrentRole: (role: UserRole) => void;
  darkMode: boolean;
  toggleDarkMode: () => void;

  // Hero & About
  hero: HeroData | null;
  updateHero: (heroData: Partial<HeroData>) => Promise<void>;
  about: AboutData | null;
  updateAbout: (data: Partial<AboutData>) => Promise<void>;
  techStack: TechStackItem[];
  addTechStackItem: (item: Omit<TechStackItem, "id">) => Promise<void>;
  updateTechStackItem: (
    id: string,
    item: Partial<TechStackItem>,
  ) => Promise<void>;
  deleteTechStackItem: (id: string) => Promise<void>;
  skills: SkillItem[];
  addSkillItem: (skill: Omit<SkillItem, "id">) => Promise<void>;
  updateSkillItem: (id: string, skill: Partial<SkillItem>) => Promise<void>;
  deleteSkillItem: (id: string) => Promise<void>;

  // Projects
  projects: Project[];
  addProject: (
    proj: Omit<
      Project,
      | "id"
      | "createdAt"
      | "updatedAt"
      | "viewsCount"
      | "likesCount"
      | "sharesCount"
    >,
  ) => Promise<void>;
  updateProject: (id: string, proj: Partial<Project>) => Promise<void>;
  deleteProject: (id: string) => Promise<void>;

  // Blogs
  blogs: BlogPost[];
  addBlog: (
    blog: Omit<BlogPost, "id" | "viewsCount" | "likesCount">,
  ) => Promise<void>;
  updateBlog: (id: string, blog: Partial<BlogPost>) => Promise<void>;
  deleteBlog: (id: string) => Promise<void>;

  // Certifications
  certifications: Certification[];
  addCertification: (cert: Omit<Certification, "id">) => Promise<void>;
  updateCertification: (
    id: string,
    cert: Partial<Certification>,
  ) => Promise<void>;
  deleteCertification: (id: string) => Promise<void>;

  // Experience & Education
  experiences: Experience[];
  addExperience: (exp: Omit<Experience, "id">) => Promise<void>;
  updateExperience: (id: string, exp: Partial<Experience>) => Promise<void>;
  deleteExperience: (id: string) => Promise<void>;
  educations: Education[];
  addEducation: (edu: Omit<Education, "id">) => Promise<void>;
  updateEducation: (id: string, edu: Partial<Education>) => Promise<void>;
  deleteEducation: (id: string) => Promise<void>;

  // Services, Clients, Testimonials
  services: Service[];
  addService: (srv: Omit<Service, "id">) => Promise<void>;
  updateService: (id: string, srv: Partial<Service>) => Promise<void>;
  deleteService: (id: string) => Promise<void>;
  clients: Client[];
  addClient: (cli: Omit<Client, "id">) => Promise<void>;
  updateClient: (id: string, cli: Partial<Client>) => Promise<void>;
  deleteClient: (id: string) => Promise<void>;
  testimonials: Testimonial[];
  addTestimonial: (test: Omit<Testimonial, "id">) => Promise<void>;
  updateTestimonial: (id: string, test: Partial<Testimonial>) => Promise<void>;
  deleteTestimonial: (id: string) => Promise<void>;
  socials: SocialLink[];
  updateSocial: (id: string, soc: Partial<SocialLink>) => Promise<void>;
  resume: ResumeData | null;
  updateResume: (data: Partial<ResumeData>) => Promise<void>;
  incrementResumeDownloads: () => Promise<void>;
  messages: ContactMessage[];
  addContactMessage: (
    msg: Omit<
      ContactMessage,
      | "id"
      | "createdAt"
      | "ip"
      | "country"
      | "browser"
      | "device"
      | "status"
      | "starred"
    >,
  ) => Promise<void>;
  updateContactMessage: (
    id: string,
    data: Partial<ContactMessage>,
  ) => Promise<void>;
  deleteContactMessage: (id: string) => Promise<void>;
  newsletter: NewsletterSubscriber[];
  addNewsletterSubscriber: (email: string) => Promise<void>;
  mediaFiles: MediaFile[];
  addMediaFile: (file: Omit<MediaFile, "id" | "uploadedAt">) => Promise<void>;
  deleteMediaFile: (id: string) => Promise<void>;
  auditLogs: AuditLog[];
  logAuditAction: (
    action: AuditLog["action"],
    module: string,
    details: string,
  ) => void;
  analytics: SiteAnalytics;
  dashboardAnalytics: DashboardAnalytics | null;
  fetchDashboardAnalytics: () => Promise<void>;
  seo: SeoConfig;
  updateSeo: (data: Partial<SeoConfig>) => Promise<void>;

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
}

const CMSContext = createContext<CMSContextType | undefined>(undefined);

export const CMSProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  // Public frontend does not authenticate a user. currentUser starts null.
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [darkMode, setDarkMode] = useState<boolean>(true);

  // Data states - initialized as empty, will be populated from API
  const [hero, setHero] = useState<HeroData | null>(null);
  const [about, setAbout] = useState<AboutData | null>(null);
  const [techStack, setTechStack] = useState<TechStackItem[]>([]);
  const [skills, setSkills] = useState<SkillItem[]>([]);
  const [projects, setProjects] = useState<Project[]>([]);
  const [blogs, setBlogs] = useState<BlogPost[]>([]);
  const [certifications, setCertifications] = useState<Certification[]>([]);
  const [experiences, setExperiences] = useState<Experience[]>([]);
  const [educations, setEducations] = useState<Education[]>([]);
  const [services, setServices] = useState<Service[]>([]);
  const [clients, setClients] = useState<Client[]>([]);
  const [testimonials, setTestimonials] = useState<Testimonial[]>([]);
  const [socials, setSocials] = useState<SocialLink[]>([]);
  const [resume, setResume] = useState<ResumeData | null>(null);
  const [messages, setMessages] = useState<ContactMessage[]>([]);
  const [newsletter, setNewsletter] = useState<NewsletterSubscriber[]>([]);
  const [mediaFiles, setMediaFiles] = useState<MediaFile[]>([]);
  const [auditLogs, setAuditLogs] = useState<AuditLog[]>([]);
  const [analytics, setAnalytics] = useState<SiteAnalytics>({
    totalVisitors: 0,
    pageViews: 0,
    contactRequests: 0,
    resumeDownloads: 0,
    visitorCountries: [],
    deviceBreakdown: [],
    viewsOverTime: [],
  });
  const [dashboardAnalytics, setDashboardAnalytics] =
    useState<DashboardAnalytics | null>(null);
  const [seo, setSeo] = useState<SeoConfig>({
    siteTitle: "",
    metaDescription: "",
    ogImage: "",
    twitterCard: "",
    canonicalUrl: "",
    robots: "",
    authorName: "",
    schemaType: "",
  });

  // Modals state
  const [activeProjectModal, setActiveProjectModal] = useState<Project | null>(
    null,
  );
  const [activeBlogModal, setActiveBlogModal] = useState<BlogPost | null>(null);
  const [isSearchOpen, setIsSearchOpen] = useState<boolean>(false);
  const [isSeoInspectorOpen, setIsSeoInspectorOpen] = useState<boolean>(false);
  const [isArchitectureDocsOpen, setIsArchitectureDocsOpen] =
    useState<boolean>(false);
  const [isResumeModalOpen, setIsResumeModalOpen] = useState<boolean>(false);

  // Load from API on initial render
  useEffect(() => {
    const fetchInitialData = async () => {
      try {
        const heroResponse = await heroService.getAll();
        if (
          heroResponse.success &&
          heroResponse.data &&
          heroResponse.data.length > 0
        ) {
          setHero(heroResponse.data[0]);
        }

        const aboutResponse = await aboutService.getAll();
        if (
          aboutResponse.success &&
          aboutResponse.data &&
          aboutResponse.data.length > 0
        ) {
          setAbout(aboutResponse.data[0]);
        }

        const techStackResponse = await techstackService.getAll();
        if (techStackResponse.success && techStackResponse.data) {
          setTechStack(techStackResponse.data);
        }

        const skillsResponse = await skillsService.getAll();
        if (skillsResponse.success && skillsResponse.data) {
          setSkills(skillsResponse.data);
        }

        const projectsResponse = await projectsService.getAll();
        if (projectsResponse.success && projectsResponse.data) {
          setProjects(projectsResponse.data);
        }

        const experienceResponse = await experienceService.getAll();
        if (experienceResponse.success && experienceResponse.data) {
          setExperiences(experienceResponse.data);
        }

        const educationResponse = await educationService.getAll();
        if (educationResponse.success && educationResponse.data) {
          setEducations(educationResponse.data);
        }

        const certificationsResponse = await certificationsService.getAll();
        if (certificationsResponse.success && certificationsResponse.data) {
          setCertifications(certificationsResponse.data);
        }

        const blogsResponse = await blogsService.getAll();
        if (blogsResponse.success && blogsResponse.data) {
          setBlogs(blogsResponse.data);
        }

        const socialsResponse = await socialsService.getAll();
        if (socialsResponse.success && socialsResponse.data) {
          setSocials(socialsResponse.data);
        }

        const resumeResponse = await resumeService.get();
        if (resumeResponse.success && resumeResponse.data) {
          setResume(resumeResponse.data);
        }
      } catch (error) {
        console.error("Failed to fetch initial data from API:", error);
        // No fallback - API is the single source of truth
      }
    };

    fetchInitialData();
  }, []);

  // Dark mode effect
  useEffect(() => {
    const root = document.documentElement;
    if (darkMode) {
      root.classList.add("dark");
    } else {
      root.classList.remove("dark");
    }
  }, [darkMode]);

  const toggleDarkMode = () => setDarkMode(!darkMode);

  const setCurrentRole = (role: UserRole) => {
    setCurrentUser((prev) => (prev ? { ...prev, role } : null));
    logAuditAction(
      "SETTINGS_CHANGE",
      "User Role",
      `Changed active role to ${role}`,
    );
  };

  /**
   * Public frontend does not persist audit logs.
   * Audit logging is owned by the admin frontend + backend.
   * Kept as a dev-only console shim so existing callers don't break.
   */
  const logAuditAction = (
    action: AuditLog["action"],
    module: string,
    details: string,
  ) => {
    if (import.meta.env.DEV) {
      console.debug(`[audit] ${action} :: ${module} :: ${details}`);
    }
  };

  const updateHero = async (heroData: Partial<HeroData>) => {
    try {
      const heroId = hero?.id;
      if (!heroId) {
        const response = await heroService.create(heroData);
        if (response.success && response.data) {
          setHero(response.data);
          logAuditAction("CREATE", "Hero Section", "Created hero section");
        }
      } else {
        const response = await heroService.update(heroId, heroData);
        if (response.success && response.data) {
          setHero(response.data);
          logAuditAction("UPDATE", "Hero Section", "Updated hero section");
        }
      }
    } catch (error) {
      console.error("Failed to update hero:", error);
      throw error;
    }
  };

  const updateAbout = async (aboutData: Partial<AboutData>) => {
    try {
      const aboutId = about?.id;
      if (!aboutId) {
        const response = await aboutService.create(aboutData);
        if (response.success && response.data) {
          setAbout(response.data);
          logAuditAction("CREATE", "About Section", "Created about section");
        }
      } else {
        const response = await aboutService.update(aboutId, aboutData);
        if (response.success && response.data) {
          setAbout(response.data);
          logAuditAction("UPDATE", "About Section", "Updated about section");
        }
      }
    } catch (error) {
      console.error("Failed to update about:", error);
      throw error;
    }
  };

  const addTechStackItem = async (item: Omit<TechStackItem, "id">) => {
    try {
      const response = await techstackService.create(item);
      if (response.success && response.data) {
        setTechStack((prev) => [...prev, response.data!]);
        logAuditAction(
          "CREATE",
          "Tech Stack",
          `Added tech stack item "${response.data!.name}"`,
        );
      }
    } catch (error) {
      console.error("Failed to create tech stack item:", error);
      throw error;
    }
  };

  const updateTechStackItem = async (
    id: string,
    item: Partial<TechStackItem>,
  ) => {
    try {
      const response = await techstackService.update(id, item);
      if (response.success && response.data) {
        setTechStack((prev) =>
          prev.map((t) => (t.id === id ? response.data! : t)),
        );
        logAuditAction(
          "UPDATE",
          "Tech Stack",
          `Updated tech stack item #${id}`,
        );
      }
    } catch (error) {
      console.error("Failed to update tech stack item:", error);
      throw error;
    }
  };

  const deleteTechStackItem = async (id: string) => {
    try {
      const response = await techstackService.delete(id);
      if (response.success) {
        setTechStack((prev) => prev.filter((t) => t.id !== id));
        logAuditAction(
          "DELETE",
          "Tech Stack",
          `Deleted tech stack item #${id}`,
        );
      }
    } catch (error) {
      console.error("Failed to delete tech stack item:", error);
      throw error;
    }
  };

  const addSkillItem = async (skill: Omit<SkillItem, "id">) => {
    try {
      const response = await skillsService.create(skill);
      if (response.success && response.data) {
        setSkills((prev) => [...prev, response.data!]);
        logAuditAction(
          "CREATE",
          "Skills",
          `Added skill "${response.data!.name}"`,
        );
      }
    } catch (error) {
      console.error("Failed to create skill:", error);
      throw error;
    }
  };

  const updateSkillItem = async (id: string, skill: Partial<SkillItem>) => {
    try {
      const response = await skillsService.update(id, skill);
      if (response.success && response.data) {
        setSkills((prev) =>
          prev.map((s) => (s.id === id ? response.data! : s)),
        );
        logAuditAction("UPDATE", "Skills", `Updated skill #${id}`);
      }
    } catch (error) {
      console.error("Failed to update skill:", error);
      throw error;
    }
  };

  const deleteSkillItem = async (id: string) => {
    try {
      const response = await skillsService.delete(id);
      if (response.success) {
        setSkills((prev) => prev.filter((s) => s.id !== id));
        logAuditAction("DELETE", "Skills", `Deleted skill #${id}`);
      }
    } catch (error) {
      console.error("Failed to delete skill:", error);
      throw error;
    }
  };

  const addProject = async (
    proj: Omit<
      Project,
      | "id"
      | "createdAt"
      | "updatedAt"
      | "viewsCount"
      | "likesCount"
      | "sharesCount"
    >,
  ) => {
    try {
      const response = await projectsService.create(proj);
      if (response.success && response.data) {
        setProjects((prev) => [response.data!, ...prev]);
        logAuditAction(
          "CREATE",
          "Projects",
          `Created new project "${response.data!.title}"`,
        );
      }
    } catch (error) {
      console.error("Failed to create project:", error);
      throw error;
    }
  };

  const updateProject = async (id: string, proj: Partial<Project>) => {
    try {
      const response = await projectsService.update(id, proj);
      if (response.success && response.data) {
        setProjects((prev) =>
          prev.map((p) => (p.id === id ? response.data! : p)),
        );
        logAuditAction("UPDATE", "Projects", `Updated project #${id}`);
      }
    } catch (error) {
      console.error("Failed to update project:", error);
      throw error;
    }
  };

  const deleteProject = async (id: string) => {
    try {
      const response = await projectsService.delete(id);
      if (response.success) {
        setProjects((prev) => prev.filter((p) => p.id !== id));
        logAuditAction("DELETE", "Projects", `Deleted project #${id}`);
      }
    } catch (error) {
      console.error("Failed to delete project:", error);
      throw error;
    }
  };

  const addBlog = async (
    blog: Omit<BlogPost, "id" | "viewsCount" | "likesCount">,
  ) => {
    try {
      const response = await blogsService.create(blog);
      if (response.success && response.data) {
        setBlogs((prev) => [response.data!, ...prev]);
        logAuditAction(
          "CREATE",
          "Blog CMS",
          `Published blog post "${response.data!.title}"`,
        );
      }
    } catch (error) {
      console.error("Failed to create blog:", error);
      throw error;
    }
  };

  const updateBlog = async (id: string, blog: Partial<BlogPost>) => {
    try {
      const response = await blogsService.update(id, blog);
      if (response.success && response.data) {
        setBlogs((prev) => prev.map((b) => (b.id === id ? response.data! : b)));
        logAuditAction("UPDATE", "Blog CMS", `Updated blog post #${id}`);
      }
    } catch (error) {
      console.error("Failed to update blog:", error);
      throw error;
    }
  };

  const deleteBlog = async (id: string) => {
    try {
      const response = await blogsService.delete(id);
      if (response.success) {
        setBlogs((prev) => prev.filter((b) => b.id !== id));
        logAuditAction("DELETE", "Blog CMS", `Deleted blog post #${id}`);
      }
    } catch (error) {
      console.error("Failed to delete blog:", error);
      throw error;
    }
  };

  const addCertification = async (cert: Omit<Certification, "id">) => {
    try {
      const response = await certificationsService.create(cert);
      if (response.success && response.data) {
        setCertifications((prev) => [...prev, response.data!]);
        logAuditAction(
          "CREATE",
          "Certifications",
          `Added certification "${response.data!.title}"`,
        );
      }
    } catch (error) {
      console.error("Failed to create certification:", error);
      throw error;
    }
  };

  const updateCertification = async (
    id: string,
    cert: Partial<Certification>,
  ) => {
    try {
      const response = await certificationsService.update(id, cert);
      if (response.success && response.data) {
        setCertifications((prev) =>
          prev.map((c) => (c.id === id ? response.data! : c)),
        );
        logAuditAction(
          "UPDATE",
          "Certifications",
          `Updated certification #${id}`,
        );
      }
    } catch (error) {
      console.error("Failed to update certification:", error);
      throw error;
    }
  };

  const deleteCertification = async (id: string) => {
    try {
      const response = await certificationsService.delete(id);
      if (response.success) {
        setCertifications((prev) => prev.filter((c) => c.id !== id));
        logAuditAction(
          "DELETE",
          "Certifications",
          `Deleted certification #${id}`,
        );
      }
    } catch (error) {
      console.error("Failed to delete certification:", error);
      throw error;
    }
  };

  const addExperience = async (exp: Omit<Experience, "id">) => {
    try {
      const response = await experienceService.create(exp);
      if (response.success && response.data) {
        setExperiences((prev) => [...prev, response.data!]);
        logAuditAction(
          "CREATE",
          "Experience",
          `Added experience "${response.data!.position} at ${response.data!.company}"`,
        );
      }
    } catch (error) {
      console.error("Failed to create experience:", error);
      throw error;
    }
  };

  const updateExperience = async (id: string, exp: Partial<Experience>) => {
    try {
      const response = await experienceService.update(id, exp);
      if (response.success && response.data) {
        setExperiences((prev) =>
          prev.map((e) => (e.id === id ? response.data! : e)),
        );
        logAuditAction("UPDATE", "Experience", `Updated experience #${id}`);
      }
    } catch (error) {
      console.error("Failed to update experience:", error);
      throw error;
    }
  };

  const deleteExperience = async (id: string) => {
    try {
      const response = await experienceService.delete(id);
      if (response.success) {
        setExperiences((prev) => prev.filter((e) => e.id !== id));
        logAuditAction("DELETE", "Experience", `Deleted experience #${id}`);
      }
    } catch (error) {
      console.error("Failed to delete experience:", error);
      throw error;
    }
  };

  const addEducation = async (edu: Omit<Education, "id">) => {
    try {
      const response = await educationService.create(edu);
      if (response.success && response.data) {
        setEducations((prev) => [...prev, response.data!]);
        logAuditAction(
          "CREATE",
          "Education",
          `Added education "${response.data!.degree}"`,
        );
      }
    } catch (error) {
      console.error("Failed to create education:", error);
      throw error;
    }
  };

  const updateEducation = async (id: string, edu: Partial<Education>) => {
    try {
      const response = await educationService.update(id, edu);
      if (response.success && response.data) {
        setEducations((prev) =>
          prev.map((e) => (e.id === id ? response.data! : e)),
        );
        logAuditAction("UPDATE", "Education", `Updated education #${id}`);
      }
    } catch (error) {
      console.error("Failed to update education:", error);
      throw error;
    }
  };

  const deleteEducation = async (id: string) => {
    try {
      const response = await educationService.delete(id);
      if (response.success) {
        setEducations((prev) => prev.filter((e) => e.id !== id));
        logAuditAction("DELETE", "Education", `Deleted education #${id}`);
      }
    } catch (error) {
      console.error("Failed to delete education:", error);
      throw error;
    }
  };

  const addService = async (srv: Omit<Service, "id">) => {
    try {
      const response = await servicesService.create(srv);
      if (response.success && response.data) {
        setServices((prev) => [...prev, response.data!]);
        logAuditAction(
          "CREATE",
          "Services",
          `Added service "${response.data!.title}"`,
        );
      }
    } catch (error) {
      console.error("Failed to create service:", error);
      throw error;
    }
  };

  const updateService = async (id: string, srv: Partial<Service>) => {
    try {
      const response = await servicesService.update(id, srv);
      if (response.success && response.data) {
        setServices((prev) =>
          prev.map((s) => (s.id === id ? response.data! : s)),
        );
        logAuditAction("UPDATE", "Services", `Updated service #${id}`);
      }
    } catch (error) {
      console.error("Failed to update service:", error);
      throw error;
    }
  };

  const deleteService = async (id: string) => {
    try {
      const response = await servicesService.delete(id);
      if (response.success) {
        setServices((prev) => prev.filter((s) => s.id !== id));
        logAuditAction("DELETE", "Services", `Deleted service #${id}`);
      }
    } catch (error) {
      console.error("Failed to delete service:", error);
      throw error;
    }
  };

  const addClient = async (cli: Omit<Client, "id">) => {
    try {
      const response = await clientsService.create(cli);
      if (response.success && response.data) {
        setClients((prev) => [...prev, response.data!]);
        logAuditAction(
          "CREATE",
          "Clients",
          `Added client "${response.data!.name}"`,
        );
      }
    } catch (error) {
      console.error("Failed to create client:", error);
      throw error;
    }
  };

  const updateClient = async (id: string, cli: Partial<Client>) => {
    try {
      const response = await clientsService.update(id, cli);
      if (response.success && response.data) {
        setClients((prev) =>
          prev.map((c) => (c.id === id ? response.data! : c)),
        );
        logAuditAction("UPDATE", "Clients", `Updated client #${id}`);
      }
    } catch (error) {
      console.error("Failed to update client:", error);
      throw error;
    }
  };

  const deleteClient = async (id: string) => {
    try {
      const response = await clientsService.delete(id);
      if (response.success) {
        setClients((prev) => prev.filter((c) => c.id !== id));
        logAuditAction("DELETE", "Clients", `Deleted client #${id}`);
      }
    } catch (error) {
      console.error("Failed to delete client:", error);
      throw error;
    }
  };

  const addTestimonial = async (test: Omit<Testimonial, "id">) => {
    try {
      const response = await testimonialsService.create(test);
      if (response.success && response.data) {
        setTestimonials((prev) => [...prev, response.data!]);
        logAuditAction(
          "CREATE",
          "Testimonials",
          `Added testimonial from "${response.data!.clientName}"`,
        );
      }
    } catch (error) {
      console.error("Failed to create testimonial:", error);
      throw error;
    }
  };

  const updateTestimonial = async (id: string, test: Partial<Testimonial>) => {
    try {
      const response = await testimonialsService.update(id, test);
      if (response.success && response.data) {
        setTestimonials((prev) =>
          prev.map((t) => (t.id === id ? response.data! : t)),
        );
        logAuditAction("UPDATE", "Testimonials", `Updated testimonial #${id}`);
      }
    } catch (error) {
      console.error("Failed to update testimonial:", error);
      throw error;
    }
  };

  const deleteTestimonial = async (id: string) => {
    try {
      const response = await testimonialsService.delete(id);
      if (response.success) {
        setTestimonials((prev) => prev.filter((t) => t.id !== id));
        logAuditAction("DELETE", "Testimonials", `Deleted testimonial #${id}`);
      }
    } catch (error) {
      console.error("Failed to delete testimonial:", error);
      throw error;
    }
  };

  const updateSocial = async (id: string, social: Partial<SocialLink>) => {
    try {
      const response = await socialsService.update(id, social);
      if (response.success && response.data) {
        setSocials((prev) =>
          prev.map((s) => (s.id === id ? response.data! : s)),
        );
        logAuditAction("UPDATE", "Social Links", `Updated social link #${id}`);
      }
    } catch (error) {
      console.error("Failed to update social:", error);
      throw error;
    }
  };

  const updateResume = async (resumeData: Partial<ResumeData>) => {
    try {
      const response = await resumeService.update(resumeData);
      if (response.success && response.data) {
        setResume(response.data);
        logAuditAction("UPDATE", "Resume", "Updated resume");
      }
    } catch (error) {
      console.error("Failed to update resume:", error);
      throw error;
    }
  };

  const incrementResumeDownloads = async () => {
    try {
      await resumeService.incrementDownload();
      setResume((prev) =>
        prev ? { ...prev, downloadsCount: prev.downloadsCount + 1 } : null,
      );
      setAnalytics((prev) => ({
        ...prev,
        resumeDownloads: prev.resumeDownloads + 1,
      }));
    } catch (error) {
      console.error("Failed to increment resume downloads:", error);
      throw error;
    }
  };

  const addContactMessage = async (
    msg: Omit<
      ContactMessage,
      | "id"
      | "createdAt"
      | "ip"
      | "country"
      | "browser"
      | "device"
      | "status"
      | "starred"
    >,
  ) => {
    try {
      const response = await contactService.submit(msg);
      if (response.success && response.data) {
        const transformedMessage: ContactMessage = {
          id: response.data.id,
          name: response.data.name,
          email: response.data.email,
          phone: response.data.phone,
          subject: response.data.subject,
          message: response.data.message,
          ip: response.data.ip,
          country: response.data.country,
          browser: response.data.browser,
          device: response.data.device,
          status: response.data.status as ContactMessage["status"],
          starred: response.data.starred,
          createdAt: response.data.created_at,
        };
        setMessages((prev) => [transformedMessage, ...prev]);
        setAnalytics((prev) => ({
          ...prev,
          contactRequests: prev.contactRequests + 1,
        }));
        logAuditAction(
          "CREATE",
          "Contact Messages",
          `Received contact message from "${response.data.name}"`,
        );
      }
    } catch (error) {
      console.error("Failed to create contact message:", error);
      throw error;
    }
  };

  const updateContactMessage = async (
    id: string,
    data: Partial<ContactMessage>,
  ) => {
    try {
      const response = await contactService.update(id, data);
      if (response.success && response.data) {
        const transformedMessage: ContactMessage = {
          id: response.data.id,
          name: response.data.name,
          email: response.data.email,
          phone: response.data.phone,
          subject: response.data.subject,
          message: response.data.message,
          ip: response.data.ip,
          country: response.data.country,
          browser: response.data.browser,
          device: response.data.device,
          status: response.data.status as ContactMessage["status"],
          starred: response.data.starred,
          createdAt: response.data.created_at,
        };
        setMessages((prev) =>
          prev.map((m) => (m.id === id ? transformedMessage : m)),
        );
        logAuditAction(
          "UPDATE",
          "Contact Messages",
          `Updated contact message #${id}`,
        );
      }
    } catch (error) {
      console.error("Failed to update contact message:", error);
      throw error;
    }
  };

  const deleteContactMessage = async (id: string) => {
    try {
      const response = await contactService.delete(id);
      if (response.success) {
        setMessages((prev) => prev.filter((m) => m.id !== id));
        logAuditAction(
          "DELETE",
          "Contact Messages",
          `Deleted contact message #${id}`,
        );
      }
    } catch (error) {
      console.error("Failed to delete contact message:", error);
      throw error;
    }
  };

  const addNewsletterSubscriber = async (email: string) => {
    try {
      const response = await newsletterService.subscribe(email, "Contact Form");
      if (response.success && response.data) {
        const transformedSubscriber: NewsletterSubscriber = {
          id: response.data.id,
          email: response.data.email,
          subscribedAt: response.data.subscribed_at,
          status: response.data.status as NewsletterSubscriber["status"],
          source: response.data.source,
        };
        setNewsletter((prev) => [...prev, transformedSubscriber]);
        logAuditAction("CREATE", "Newsletter", `New subscriber: ${email}`);
      }
    } catch (error) {
      console.error("Failed to add newsletter subscriber:", error);
      throw error;
    }
  };

  const addMediaFile = async (file: Omit<MediaFile, "id" | "uploadedAt">) => {
    try {
      const response = await mediaService.create(file);
      if (response.success && response.data) {
        setMediaFiles((prev) => [...prev, response.data!]);
        logAuditAction(
          "CREATE",
          "Media Files",
          `Uploaded media file "${response.data!.name}"`,
        );
      }
    } catch (error) {
      console.error("Failed to upload media file:", error);
      throw error;
    }
  };

  const deleteMediaFile = async (id: string) => {
    try {
      const response = await mediaService.delete(id);
      if (response.success) {
        setMediaFiles((prev) => prev.filter((f) => f.id !== id));
        logAuditAction("DELETE", "Media Files", `Deleted media file #${id}`);
      }
    } catch (error) {
      console.error("Failed to delete media file:", error);
      throw error;
    }
  };

  const updateSeo = async (seoData: Partial<SeoConfig>) => {
    try {
      const response = await seoService.update("1", seoData);
      if (response.success && response.data) {
        setSeo(response.data);
        logAuditAction("UPDATE", "SEO Settings", "Updated SEO configuration");
      }
    } catch (error) {
      console.error("Failed to update SEO:", error);
      throw error;
    }
  };

  const fetchDashboardAnalytics = async () => {
    try {
      const response = await dashboardService.getAnalytics();
      if (response.success && response.data) {
        setDashboardAnalytics(response.data);
      }
    } catch (error) {
      console.error("Failed to fetch dashboard analytics:", error);
    }
  };

  return (
    <CMSContext.Provider
      value={{
        currentUser,
        activeRole: currentUser?.role ?? "Guest",
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
        dashboardAnalytics,
        fetchDashboardAnalytics,
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
      }}
    >
      {children}
    </CMSContext.Provider>
  );
};

export const useCMS = () => {
  const context = useContext(CMSContext);
  if (!context) {
    throw new Error("useCMS must be used within a CMSProvider");
  }
  return context;
};
