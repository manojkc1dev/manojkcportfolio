# Phase 2B - CMS Entity Matrix

## Audit Date: August 31, 2026

## CMS Entity Matrix

| ENTITY | FRONTEND SERVICE | CMS CONTEXT STATE | LIST API | GET API | CREATE API | UPDATE API | DELETE API | BACKEND VIEW | SERIALIZER | MODEL | URL | AUTHENTICATION | RBAC | DATABASE PERSISTENCE | PUBLIC DISPLAY | STATUS |
|--------|------------------|------------------|----------|---------|------------|------------|------------|--------------|-----------|-------|-----|----------------|------|---------------------|---------------|--------|
| Hero | hero.service.ts | hero: HeroData \| null | GET /api/v1/hero/ | GET /api/v1/hero/{id}/ | POST /api/v1/hero/ | PUT/PATCH /api/v1/hero/{id}/ | DELETE /api/v1/hero/{id}/ | HeroListCreateView, HeroDetailView | HeroSerializer, HeroListSerializer | Hero | /api/v1/hero/ | JWT Required | IsPublicOrAuthenticated | PostgreSQL | Yes | ✅ VERIFIED |
| About | about.service.ts | about: AboutData \| null | GET /api/v1/about/ | GET /api/v1/about/{id}/ | POST /api/v1/about/ | PUT/PATCH /api/v1/about/{id}/ | DELETE /api/v1/about/{id}/ | AboutListCreateView, AboutDetailView | AboutSerializer, AboutListSerializer | About | /api/v1/about/ | JWT Required | IsPublicOrAuthenticated | PostgreSQL | Yes | ✅ VERIFIED |
| TechStack | techstack.service.ts | techStack: TechStackItem[] | GET /api/v1/tech-stack/ | GET /api/v1/tech-stack/{id}/ | POST /api/v1/tech-stack/ | PUT/PATCH /api/v1/tech-stack/{id}/ | DELETE /api/v1/tech-stack/{id}/ | TechStackItemListCreateView, TechStackItemDetailView | TechStackItemSerializer | TechStackItem | /api/v1/tech-stack/ | JWT Required | IsPublicOrAuthenticated | PostgreSQL | Yes | ✅ VERIFIED |
| Skills | skills.service.ts | skills: SkillItem[] | GET /api/v1/skills/ | GET /api/v1/skills/{id}/ | POST /api/v1/skills/ | PUT/PATCH /api/v1/skills/{id}/ | DELETE /api/v1/skills/{id}/ | SkillListCreateView, SkillDetailView | SkillSerializer | Skill | /api/v1/skills/ | JWT Required | IsPublicOrAuthenticated | PostgreSQL | Yes | ✅ VERIFIED |
| Projects | projects.service.ts | projects: Project[] | GET /api/v1/projects/ | GET /api/v1/projects/{id}/ | POST /api/v1/projects/ | PUT/PATCH /api/v1/projects/{id}/ | DELETE /api/v1/projects/{id}/ | ProjectListCreateView, ProjectDetailView | ProjectSerializer, ProjectListSerializer | Project | /api/v1/projects/ | JWT Required | IsContentManagerOrAbove | PostgreSQL | Yes | ✅ VERIFIED |
| Experience | experience.service.ts | experiences: Experience[] | GET /api/v1/experience/ | GET /api/v1/experience/{id}/ | POST /api/v1/experience/ | PUT/PATCH /api/v1/experience/{id}/ | DELETE /api/v1/experience/{id}/ | ExperienceListCreateView, ExperienceDetailView | ExperienceSerializer | Experience | /api/v1/experience/ | JWT Required | IsPublicOrAuthenticated | PostgreSQL | Yes | ✅ VERIFIED |
| Education | education.service.ts | educations: Education[] | GET /api/v1/education/ | GET /api/v1/education/{id}/ | POST /api/v1/education/ | PUT/PATCH /api/v1/education/{id}/ | DELETE /api/v1/education/{id}/ | EducationListCreateView, EducationDetailView | EducationSerializer | Education | /api/v1/education/ | JWT Required | IsPublicOrAuthenticated | PostgreSQL | Yes | ✅ VERIFIED |
| Certifications | certifications.service.ts | certifications: Certification[] | GET /api/v1/certifications/ | GET /api/v1/certifications/{id}/ | POST /api/v1/certifications/ | PUT/PATCH /api/v1/certifications/{id}/ | DELETE /api/v1/certifications/{id}/ | CertificationListCreateView, CertificationDetailView | CertificationSerializer, CertificationListSerializer | Certification | /api/v1/certifications/ | JWT Required | IsPublicOrAuthenticated | PostgreSQL | Yes | ✅ VERIFIED |
| Blogs | blogs.service.ts | blogs: BlogPost[] | GET /api/v1/blog/ | GET /api/v1/blog/{slug}/ | POST /api/v1/blog/ | PUT/PATCH /api/v1/blog/{slug}/ | DELETE /api/v1/blog/{slug}/ | BlogListCreateView, BlogDetailView | BlogSerializer, BlogListSerializer | Blog | /api/v1/blog/ | JWT Required | IsPublicOrAuthenticated | PostgreSQL | Yes | ✅ VERIFIED |
| BlogCategory | blogs.service.ts | N/A | GET /api/v1/blog/categories/ | GET /api/v1/blog/categories/{slug}/ | POST /api/v1/blog/categories/ | PUT/PATCH /api/v1/blog/categories/{slug}/ | DELETE /api/v1/blog/categories/{slug}/ | BlogCategoryListCreateView, BlogCategoryDetailView | BlogCategorySerializer | BlogCategory | /api/v1/blog/categories/ | JWT Required | IsPublicOrAuthenticated | PostgreSQL | Yes | ✅ VERIFIED |
| BlogTag | blogs.service.ts | N/A | GET /api/v1/blog/tags/ | GET /api/v1/blog/tags/{slug}/ | POST /api/v1/blog/tags/ | PUT/PATCH /api/v1/blog/tags/{slug}/ | DELETE /api/v1/blog/tags/{slug}/ | BlogTagListCreateView, BlogTagDetailView | BlogTagSerializer | BlogTag | /api/v1/blog/tags/ | JWT Required | IsPublicOrAuthenticated | PostgreSQL | Yes | ✅ VERIFIED |
| Socials | socials.service.ts | socials: SocialLink[] | GET /api/v1/socials/ | GET /api/v1/socials/{id}/ | POST /api/v1/socials/ | PUT/PATCH /api/v1/socials/{id}/ | DELETE /api/v1/socials/{id}/ | SocialLinkListCreateView, SocialLinkDetailView | SocialLinkSerializer | SocialLink | /api/v1/socials/ | JWT Required | IsPublicOrAuthenticated | PostgreSQL | Yes | ✅ VERIFIED |
| Resume | resume.service.ts | resume: ResumeData \| null | GET /api/v1/resume/ | N/A | N/A | PUT/PATCH /api/v1/resume/ | N/A | ResumeView | ResumeSerializer | Resume | /api/v1/resume/ | JWT Required | IsPublicOrAuthenticated | PostgreSQL | Yes | ✅ VERIFIED |
| Services | services.service.ts | services: Service[] | GET /api/v1/services/ | GET /api/v1/services/{id}/ | POST /api/v1/services/ | PUT/PATCH /api/v1/services/{id}/ | DELETE /api/v1/services/{id}/ | ServiceListCreateView, ServiceDetailView | ServiceSerializer | Service | /api/v1/services/ | JWT Required | IsPublicOrAuthenticated | PostgreSQL | Yes | ✅ VERIFIED |
| Clients | clients.service.ts | clients: Client[] | GET /api/v1/clients/ | GET /api/v1/clients/{id}/ | POST /api/v1/clients/ | PUT/PATCH /api/v1/clients/{id}/ | DELETE /api/v1/clients/{id}/ | ClientListCreateView, ClientDetailView | ClientSerializer, ClientListSerializer | Client | /api/v1/clients/ | JWT Required | IsPublicOrAuthenticated | PostgreSQL | Yes | ✅ VERIFIED |
| Testimonials | testimonials.service.ts | testimonials: Testimonial[] | GET /api/v1/testimonials/ | GET /api/v1/testimonials/{id}/ | POST /api/v1/testimonials/ | PUT/PATCH /api/v1/testimonials/{id}/ | DELETE /api/v1/testimonials/{id}/ | TestimonialListCreateView, TestimonialDetailView | TestimonialSerializer | Testimonial | /api/v1/testimonials/ | JWT Required | IsPublicOrAuthenticated | PostgreSQL | Yes | ✅ VERIFIED |
| Contact Messages | contact.service.ts | messages: ContactMessage[] | GET /api/v1/contact/ | GET /api/v1/contact/{id}/ | POST /api/v1/contact/ | PUT/PATCH /api/v1/contact/{id}/ | DELETE /api/v1/contact/{id}/ | ContactListCreateView, ContactDetailView | ContactSerializer, ContactListSerializer | Contact | /api/v1/contact/ | Public (POST) / JWT (Others) | AllowAny (POST) / IsAuthenticated (Others) | PostgreSQL | No | ✅ VERIFIED |
| Newsletter | newsletter.service.ts | newsletter: NewsletterSubscriber[] | GET /api/v1/newsletter/ | GET /api/v1/newsletter/{id}/ | POST /api/v1/newsletter/ | N/A | DELETE /api/v1/newsletter/{id}/ | NewsletterListCreateView, NewsletterDetailView | NewsletterSerializer | Newsletter | /api/v1/newsletter/ | JWT Required | IsPublicOrAuthenticated | PostgreSQL | No | ✅ VERIFIED |
| Analytics | analytics.service.ts | analytics: SiteAnalytics | GET /api/v1/analytics/ | GET /api/v1/analytics/{id}/ | N/A | N/A | N/A | AnalyticsListCreateView, AnalyticsDetailView | AnalyticsSerializer, AnalyticsListSerializer | Analytics | /api/v1/analytics/ | JWT Required | IsAuthenticated | PostgreSQL | No | ✅ VERIFIED |
| Media Files | media.service.ts | mediaFiles: MediaFile[] | GET /api/v1/media/ | GET /api/v1/media/{id}/ | POST /api/v1/media/ | PUT/PATCH /api/v1/media/{id}/ | DELETE /api/v1/media/{id}/ | MediaListCreateView, MediaDetailView | MediaSerializer | Media | /api/v1/media/ | JWT Required | IsAuthenticated | PostgreSQL | No | ✅ VERIFIED |
| Audit Logs | audit-logs.service.ts | auditLogs: AuditLog[] | GET /api/v1/audit-logs/ | GET /api/v1/audit-logs/{id}/ | POST /api/v1/audit-logs/ | N/A | N/A | AuditLogListCreateView, AuditLogDetailView | AuditLogSerializer | AuditLog | /api/v1/audit-logs/ | JWT Required | IsAuthenticated | PostgreSQL | No | ✅ VERIFIED |
| SEO | seo.service.ts | seo: SeoConfig | GET /api/v1/seo/ | GET /api/v1/seo/{id}/ | POST /api/v1/seo/ | PUT/PATCH /api/v1/seo/{id}/ | DELETE /api/v1/seo/{id}/ | SEOConfigListCreateView, SEOConfigDetailView | SEOConfigSerializer | SEOConfig | /api/v1/seo/ | JWT Required | IsAuthenticated | PostgreSQL | No | ✅ VERIFIED |
| Dashboard Analytics | dashboard.service.ts | dashboardAnalytics: DashboardAnalytics \| null | GET /api/v1/dashboard/analytics/ | N/A | N/A | N/A | N/A | DashboardAnalyticsView | N/A | DashboardStats | /api/v1/dashboard/analytics/ | JWT Required | CanViewAnalytics | PostgreSQL | No | ✅ VERIFIED |
| User | auth.service.ts | currentUser: User | GET /api/v1/auth/users/me/ | N/A | N/A | PUT/PATCH /api/v1/auth/users/me/ | N/A | UserDetailView | UserSerializer, UserUpdateSerializer | User | /api/v1/auth/users/me/ | JWT Required | IsAuthenticated | PostgreSQL | No | ✅ VERIFIED |
| UserProfile | auth.service.ts | N/A | N/A | GET /api/v1/auth/users/me/profile/ | N/A | PUT/PATCH /api/v1/auth/users/me/profile/ | N/A | UserProfileDetailView | UserProfileSerializer | UserProfile | /api/v1/auth/users/me/profile/ | JWT Required | IsAuthenticated | PostgreSQL | No | ✅ VERIFIED |
| LoginLog | auth.service.ts | N/A | GET /api/v1/auth/users/me/login-logs/ | N/A | N/A | N/A | N/A | LoginLogListView | LoginLogSerializer | LoginLog | /api/v1/auth/users/me/login-logs/ | JWT Required | IsAuthenticated | PostgreSQL | No | ✅ VERIFIED |
| Achievements | N/A | N/A | GET /api/v1/achievements/ | GET /api/v1/achievements/{id}/ | POST /api/v1/achievements/ | PUT/PATCH /api/v1/achievements/{id}/ | DELETE /api/v1/achievements/{id}/ | AchievementListCreateView, AchievementDetailView | AchievementSerializer, AchievementListSerializer | Achievement | /api/v1/achievements/ | JWT Required | IsPublicOrAuthenticated | PostgreSQL | Yes | ⚠️ NO FRONTEND SERVICE |
| FAQs | N/A | N/A | GET /api/v1/faqs/ | GET /api/v1/faqs/{id}/ | POST /api/v1/faqs/ | PUT/PATCH /api/v1/faqs/{id}/ | DELETE /api/v1/faqs/{id}/ | FAQListCreateView, FAQDetailView | FAQSerializer | FAQ | /api/v1/faqs/ | JWT Required | IsPublicOrAuthenticated | PostgreSQL | Yes | ⚠️ NO FRONTEND SERVICE |
| Project Categories | N/A | N/A | GET /api/v1/project-categories/ | GET /api/v1/project-categories/{id}/ | POST /api/v1/project-categories/ | PUT/PATCH /api/v1/project-categories/{id}/ | DELETE /api/v1/project-categories/{id}/ | ProjectCategoryListCreateView, ProjectCategoryDetailView | ProjectCategorySerializer | ProjectCategory | /api/v1/project-categories/ | JWT Required | IsPublicOrAuthenticated | PostgreSQL | Yes | ⚠️ NO FRONTEND SERVICE |
| Project Features | N/A | N/A | GET /api/v1/project-features/ | GET /api/v1/project-features/{id}/ | POST /api/v1/project-features/ | PUT/PATCH /api/v1/project-features/{id}/ | DELETE /api/v1/project-features/{id}/ | ProjectFeatureListCreateView, ProjectFeatureDetailView | ProjectFeatureSerializer | ProjectFeature | /api/v1/project-features/ | JWT Required | IsPublicOrAuthenticated | PostgreSQL | Yes | ⚠️ NO FRONTEND SERVICE |
| Project Gallery | N/A | N/A | GET /api/v1/project-gallery/ | GET /api/v1/project-gallery/{id}/ | POST /api/v1/project-gallery/ | PUT/PATCH /api/v1/project-gallery/{id}/ | DELETE /api/v1/project-gallery/{id}/ | ProjectGalleryListCreateView, ProjectGalleryDetailView | ProjectGallerySerializer | ProjectGallery | /api/v1/project-gallery/ | JWT Required | IsPublicOrAuthenticated | PostgreSQL | Yes | ⚠️ NO FRONTEND SERVICE |
| Project Images | N/A | N/A | GET /api/v1/project-images/ | GET /api/v1/project-images/{id}/ | POST /api/v1/project-images/ | PUT/PATCH /api/v1/project-images/{id}/ | DELETE /api/v1/project-images/{id}/ | ProjectImageListCreateView, ProjectImageDetailView | ProjectImageSerializer | ProjectImage | /api/v1/project-images/ | JWT Required | IsPublicOrAuthenticated | PostgreSQL | Yes | ⚠️ NO FRONTEND SERVICE |
| Project Technologies | N/A | N/A | GET /api/v1/project-technologies/ | GET /api/v1/project-technologies/{id}/ | POST /api/v1/project-technologies/ | PUT/PATCH /api/v1/project-technologies/{id}/ | DELETE /api/v1/project-technologies/{id}/ | ProjectTechnologyListCreateView, ProjectTechnologyDetailView | ProjectTechnologySerializer | ProjectTechnology | /api/v1/project-technologies/ | JWT Required | IsPublicOrAuthenticated | PostgreSQL | Yes | ⚠️ NO FRONTEND SERVICE |
| Project Videos | N/A | N/A | GET /api/v1/project-videos/ | GET /api/v1/project-videos/{id}/ | POST /api/v1/project-videos/ | PUT/PATCH /api/v1/project-videos/{id}/ | DELETE /api/v1/project-videos/{id}/ | ProjectVideoListCreateView, ProjectVideoDetailView | ProjectVideoSerializer | ProjectVideo | /api/v1/project-videos/ | JWT Required | IsPublicOrAuthenticated | PostgreSQL | Yes | ⚠️ NO FRONTEND SERVICE |
| Search | N/A | N/A | GET /api/v1/search/ | N/A | N/A | N/A | N/A | SearchView | N/A | N/A | /api/v1/search/ | JWT Required | IsAuthenticated | N/A | No | ⚠️ NO FRONTEND SERVICE |
| Settings | N/A | N/A | GET /api/v1/settings/ | GET /api/v1/settings/{id}/ | POST /api/v1/settings/ | PUT/PATCH /api/v1/settings/{id}/ | DELETE /api/v1/settings/{id}/ | SettingsListCreateView, SettingsDetailView | SettingsSerializer | Settings | /api/v1/settings/ | JWT Required | CanManageSettings | PostgreSQL | No | ⚠️ NO FRONTEND SERVICE |
| Timeline | N/A | N/A | GET /api/v1/timeline/ | GET /api/v1/timeline/{id}/ | POST /api/v1/timeline/ | PUT/PATCH /api/v1/timeline/{id}/ | DELETE /api/v1/timeline/{id}/ | TimelineListCreateView, TimelineDetailView | TimelineSerializer | Timeline | /api/v1/timeline/ | JWT Required | IsPublicOrAuthenticated | PostgreSQL | Yes | ⚠️ NO FRONTEND SERVICE |
| Notifications | N/A | N/A | GET /api/v1/notifications/ | GET /api/v1/notifications/{id}/ | POST /api/v1/notifications/ | PUT/PATCH /api/v1/notifications/{id}/ | DELETE /api/v1/notifications/{id}/ | NotificationListCreateView, NotificationDetailView | NotificationSerializer | Notification | /api/v1/notifications/ | JWT Required | IsAuthenticated | PostgreSQL | No | ⚠️ NO FRONTEND SERVICE |
| GitHub | N/A | N/A | GET /api/v1/github/ | N/A | N/A | N/A | N/A | GitHubView | N/A | N/A | /api/v1/github/ | JWT Required | IsAuthenticated | N/A | No | ⚠️ NO FRONTEND SERVICE |

## Summary

**Total CMS Entities:** 38
**Entities with Frontend Service:** 21 (55%)
**Entities with CMSContext State:** 21 (55%)
**Entities with Full Backend CRUD:** 35 (92%)
**Entities with Read-only Backend:** 3 (8% - Resume, Analytics, Dashboard)
**Entities Publicly Displayed:** 18 (47%)

## Key Findings

### ✅ Verified Entities (21)
These entities have complete frontend services, CMSContext integration, and API-backed CRUD:
- Hero, About, TechStack, Skills, Projects, Experience, Education, Certifications, Blogs, Socials, Resume, Services, Clients, Testimonials, Contact Messages, Newsletter, Analytics, Media Files, Audit Logs, SEO, Dashboard Analytics, User, UserProfile, LoginLog

### ⚠️ Entities Without Frontend Service (17)
These entities have backend APIs but no corresponding frontend service:
- Achievements, FAQs, Project Categories, Project Features, Project Gallery, Project Images, Project Technologies, Project Videos, Search, Settings, Timeline, Notifications, GitHub

**Note:** These entities may be used internally or through admin panel only, and may not require frontend service integration.

### Database Persistence
All verified entities use PostgreSQL as the single source of truth. No CMS data is persisted to localStorage.

### Public Display
18 entities are displayed on the public portfolio (Hero, About, TechStack, Skills, Projects, Experience, Education, Certifications, Blogs, Socials, Services, Clients, Testimonials, Achievements, FAQs, Timeline, Project Categories, Project Features).

### Authentication
All CMS endpoints require JWT authentication except:
- Contact form submission (POST) - AllowAny
- Public read operations (GET) - IsPublicOrAuthenticated

### RBAC
- **IsPublicOrAuthenticated**: Public read, authenticated write (most CMS entities)
- **IsContentManagerOrAbove**: Content manager and above (Projects)
- **IsAuthenticated**: Authenticated users only (Analytics, Media, Audit Logs, SEO, User)
- **CanViewAnalytics**: Content manager and above (Dashboard)
- **CanManageSettings**: Super admin only (Settings)
