# Firebase / Local Data to Django REST & PostgreSQL Mapping

This document provides an exhaustive field-level mapping between the existing frontend data structures (Firebase/Firestore, mock data, and localStorage) and the target Django ORM models and PostgreSQL database schema.

---

## 1. Portfolio & Projects

### Model: `apps.portfolio.models.Project` → Table: `portfolio_project`

| Frontend / Firestore Field | Django Model Field | PostgreSQL Column | Data Type | Notes / Constraints |
|---|---|---|---|---|
| `id` / `slug` | `Project.id` | `id` | `VARCHAR(100)` | Primary Key (kebab-case slug) |
| `slug` | `Project.slug` | `slug` | `VARCHAR(100)` | Unique, Indexed |
| `title` | `Project.title` | `title` | `VARCHAR(255)` | Case study title |
| `tagline` | `Project.tagline` | `tagline` | `VARCHAR(255)` | One-liner summary |
| `description` | `Project.description` | `description` | `TEXT` | Abstract overview |
| `category` | `Project.category` | `category` | `VARCHAR(100)` | Indexed ('backend', 'fullstack', 'tools', etc.) |
| `year` | `Project.year` | `year` | `INTEGER` | Nullable positive integer |
| `status` | `Project.status` | `status` | `VARCHAR(50)` | Indexed ('live', 'ongoing', 'archived') |
| `visibility` | `Project.visibility` | `visibility` | `VARCHAR(20)` | Indexed ('Published', 'Draft') |
| `featured` | `Project.featured` | `featured` | `BOOLEAN` | Indexed boolean flag |
| `image` | `Project.image` | `image` | `VARCHAR(500)` | Cover image path |
| `thumbnail` | `Project.thumbnail` | `thumbnail` | `VARCHAR(500)` | Thumbnail path |
| `highlights` | `Project.highlights` | `highlights` | `JSONB` | Array of 3-5 bullet strings |
| `tech` | `Project.tech` | `tech` | `JSONB` | Array of tech stack names |
| `languages` | `Project.languages` | `languages` | `JSONB` | Array of programming languages |
| `links` | `Project.links` | `links` | `JSONB` | Live, GitHub, CaseStudy URLs |
| `gallery` | `Project.gallery` | `gallery` | `JSONB` | Screenshot array |
| `proof` | `Project.proof` | `proof` | `JSONB` | Proof badge identifiers array |
| `role` | `Project.role` | `role` | `VARCHAR(100)` | Team role ('Solo', 'Lead') |
| `duration` | `Project.duration` | `duration` | `VARCHAR(100)` | Duration string ('3 months') |
| `client` | `Project.client` | `client` | `VARCHAR(255)` | Client or organization name |
| `industry` | `Project.industry` | `industry` | `VARCHAR(255)` | Market industry domain |
| `problem` | `Project.problem` | `problem` | `TEXT` | Case study problem description |
| `solution` | `Project.solution` | `solution` | `TEXT` | Architectural solution text |
| `architecture` | `Project.architecture` | `architecture` | `TEXT` | Mermaid.js diagram string |
| `liveUrl` | `Project.live_url` | `live_url` | `VARCHAR(500)` | Live deployment link |
| `githubUrl` | `Project.github_url` | `github_url` | `VARCHAR(500)` | GitHub repository link |
| `order` | `Project.order` | `order` | `INTEGER` | Display order index |
| `createdAt` | `Project.created_at` | `created_at` | `TIMESTAMPTZ` | Auto-generated timestamp |

---

## 2. Technical Skills

### Model: `apps.skills.models.SkillCategory` → Table: `skills_skillcategory`

| Frontend Field | Django Model Field | PostgreSQL Column | Data Type | Notes |
|---|---|---|---|---|
| `id` | `SkillCategory.id` | `id` | `VARCHAR(100)` | Primary Key (slug: 'backend', 'databases') |
| `title` | `SkillCategory.title` | `title` | `VARCHAR(150)` | Display header ('Backend & APIs') |
| `category` | `SkillCategory.category` | `category` | `VARCHAR(150)` | Grouping name |
| `description` | `SkillCategory.description` | `description` | `TEXT` | Category scope summary |
| `order` | `SkillCategory.order` | `order` | `INTEGER` | Sorting sequence |

### Model: `apps.skills.models.SkillItem` → Table: `skills_skillitem`

| Frontend Field | Django Model Field | PostgreSQL Column | Data Type | Notes |
|---|---|---|---|---|
| (auto) | `SkillItem.id` | `id` | `UUID` | Primary Key |
| `category` | `SkillItem.category` | `category_id` | `VARCHAR(100)` | ForeignKey → `skills_skillcategory.id` |
| `name` | `SkillItem.name` | `name` | `VARCHAR(100)` | Name of technology/library |
| `iconName` | `SkillItem.icon_name` | `icon_name` | `VARCHAR(100)` | Lucide icon identifier |
| `highlight` | `SkillItem.highlight` | `highlight` | `BOOLEAN` | Highlighted pill flag |
| `proficiency` | `SkillItem.proficiency` | `proficiency` | `VARCHAR(50)` | 'Advanced', 'Intermediate', 'Learning' |
| `level` | `SkillItem.level` | `level` | `VARCHAR(50)` | 'learning', 'intermediate', 'advanced', 'expert' |
| `years` | `SkillItem.years` | `years` | `DOUBLE PRECISION`| Years of experience |
| `order` | `SkillItem.order` | `order` | `INTEGER` | Display sequence |

---

## 3. Career Experience

### Model: `apps.experience.models.Experience` → Table: `experience_experience`

| Frontend Field | Django Model Field | PostgreSQL Column | Data Type | Notes |
|---|---|---|---|---|
| `id` | `Experience.id` | `id` | `VARCHAR(100)` | Primary Key ('sajha-infotech', 'tu-bit') |
| `role` | `Experience.role` | `role` | `VARCHAR(200)` | Job title or degree designation |
| `company` | `Experience.company` | `company` | `VARCHAR(200)` | Organization or university |
| `companyUrl` | `Experience.company_url` | `company_url` | `VARCHAR(500)` | Optional website URL |
| `period` | `Experience.period` | `period` | `VARCHAR(100)` | Date range string |
| `start` | `Experience.start` | `start` | `VARCHAR(50)` | Start date string |
| `end` | `Experience.end` | `end` | `VARCHAR(50)` | End date or 'present' |
| `location` | `Experience.location` | `location` | `VARCHAR(150)` | Location coordinate |
| `type` | `Experience.type` | `type` | `VARCHAR(50)` | 'fulltime', 'internship', 'freelance', 'education' |
| `description` | `Experience.description` | `description` | `TEXT` | Role summary |
| `bullets` | `Experience.bullets` | `bullets` | `JSONB` | List of achievement strings |
| `tech` | `Experience.tech` | `tech` | `JSONB` | List of technology stack tags |
| `order` | `Experience.order` | `order` | `INTEGER` | Sorting sequence |

---

## 4. Inbound Contact Inquiries

### Model: `apps.inquiries.models.Inquiry` → Table: `inquiries_inquiry`

| Frontend / Form Field | Django Model Field | PostgreSQL Column | Data Type | Notes |
|---|---|---|---|---|
| `id` | `Inquiry.id` | `id` | `UUID` | Primary Key |
| `name` | `Inquiry.name` | `name` | `VARCHAR(200)` | Sender name |
| `email` | `Inquiry.email` | `email` | `VARCHAR(254)` | Sender email address |
| `company` | `Inquiry.company` | `company` | `VARCHAR(200)` | Inquiring company |
| `phone` | `Inquiry.phone` | `phone` | `VARCHAR(50)` | Contact phone |
| `hasWhatsApp` | `Inquiry.has_whatsapp` | `has_whatsapp` | `BOOLEAN` | WhatsApp flag |
| `scopeTitle` | `Inquiry.scope_title` | `scope_title` | `VARCHAR(255)` | Scope or subject |
| `budgetRange` | `Inquiry.budget_range` | `budget_range` | `VARCHAR(100)` | Budget tier |
| `timeline` | `Inquiry.timeline` | `timeline` | `VARCHAR(100)` | Timeline expectation |
| `message` | `Inquiry.message` | `message` | `TEXT` | Full message text |
| `status` | `Inquiry.status` | `status` | `VARCHAR(50)` | 'New', 'In Progress', 'Closed', 'Won' |
| `read` | `Inquiry.read` | `read` | `BOOLEAN` | Read status |
| `replied` | `Inquiry.replied` | `replied` | `BOOLEAN` | Replied status |
| `projectId` | `Inquiry.project_id` | `project_id` | `VARCHAR(100)` | Tagged project slug |
| `projectTitle` | `Inquiry.project_title` | `project_title` | `VARCHAR(255)` | Tagged project title |
| `sourcePage` | `Inquiry.source_page` | `source_page` | `VARCHAR(500)` | Inbound referral URL |
| `createdAt` | `Inquiry.created_at` | `created_at` | `TIMESTAMPTZ` | Submission timestamp |

---

## 5. Technical Blog & Writing

### Model: `apps.blog.models.Article` → Table: `blog_article`

| Frontend Field | Django Model Field | PostgreSQL Column | Data Type | Notes |
|---|---|---|---|---|
| `slug` | `Article.slug` / `Article.id` | `slug` / `id` | `VARCHAR(255)` | Primary Key & URL Slug |
| `title` | `Article.title` | `title` | `VARCHAR(255)` | Post title |
| `category` | `Article.category` | `category` | `VARCHAR(100)` | Post category |
| `excerpt` | `Article.excerpt` | `excerpt` | `TEXT` | Abstract snippet |
| `content` | `Article.content` | `content` | `TEXT` | Full Markdown content |
| `headerImage` | `Article.header_image` | `header_image` | `VARCHAR(500)` | Header image URL |
| `authorName` | `Article.author_name` | `author_name` | `VARCHAR(100)` | Author name |
| `authorRole` | `Article.author_role` | `author_role` | `VARCHAR(100)` | Author title |
| `readingTime` | `Article.read_time_minutes` | `read_time_minutes` | `INTEGER` | Reading time in minutes |
| `tags` | `Article.tags_list` | `tags_list` | `JSONB` | Array of tag strings |
| `visibility` | `Article.visibility` | `visibility` | `VARCHAR(20)` | 'Published', 'Draft' |
| `featured` | `Article.featured` | `featured` | `BOOLEAN` | Featured post flag |

---

## 6. Engineering Services

### Model: `apps.services.models.Service` → Table: `services_service`

| Frontend Field | Django Model Field | PostgreSQL Column | Data Type | Notes |
|---|---|---|---|---|
| `id` / `slug` | `Service.id` / `Service.slug` | `id` / `slug` | `VARCHAR(100)` / `VARCHAR(200)` | Primary Key & URL Slug |
| `order` | `Service.order` | `order` | `INTEGER` | Sorting sequence |
| `title` | `Service.title` | `title` | `VARCHAR(200)` | Service title |
| `icon` | `Service.icon` | `icon` | `VARCHAR(100)` | Lucide icon name |
| `shortSummary` | `Service.short_summary` | `short_summary` | `TEXT` | Brief overview |
| `detailedScope` | `Service.detailed_scope` | `detailed_scope` | `TEXT` | Deep technical scope |
| `features` | `Service.features` | `features` | `JSONB` | Bulleted features array |
| `deliverables` | `Service.deliverables` | `deliverables` | `JSONB` | Tangible deliverables array |
| `technologies` | `Service.technologies` | `technologies` | `JSONB` | Technologies used array |
| `visibility` | `Service.visibility` | `visibility` | `VARCHAR(20)` | 'Published', 'Draft' |

---

## 7. Resume & ATS Studio

### Model: `apps.resume.models.ResumeDocument` → Table: `resume_resumedocument`
Stores binary PDF files uploaded for direct public streaming.

### Model: `apps.resume.models.ResumeDataRecord` → Table: `resume_resumedatarecord`
Stores JSON customizer parameters (`customization`) and section items (`sections_data`) matching the ATS Resume Studio schema.

---

## 8. Site Configuration & Profile

### Model: `apps.siteconfig.models.SiteProfile` → Table: `siteconfig_siteprofile`
Stores bio paragraphs (`bio`), tagline, location, and hero CTA configurations.

### Model: `apps.siteconfig.models.ProfileStat` → Table: `siteconfig_profilestat`
Stores numeric counters and metric cards.

### Model: `apps.siteconfig.models.SocialLink` → Table: `siteconfig_sociallink`
Stores external platforms, handles, and URLs.

### Model: `apps.siteconfig.models.UseCategory` & `UseItem` → Tables: `siteconfig_usecategory` & `siteconfig_useitem`
Stores workstation specs, IDE configurations, and backend tools.

### Model: `apps.siteconfig.models.CurrentItem` → Table: `siteconfig_currentitem`
Stores active development initiatives and progress counters.
