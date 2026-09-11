# Database Schema Documentation

## Entity Relationship Diagram

This document describes the database schema for the Enterprise Portfolio CMS.

## Core Models

### BaseModel
- **id**: UUID (Primary Key)
- **created_at**: DateTime
- **updated_at**: DateTime

### StatusModel
- **status**: CharField (choices: draft, published, archived)
- **is_active**: BooleanField

### OrderableModel
- **order**: IntegerField

### AuditModel
- **created_by**: ForeignKey(User)
- **updated_by**: ForeignKey(User)

## Apps and Models

### 1. Accounts (User Management)

#### User
- Inherits from AbstractUser
- **id**: UUID
- **role**: CharField (choices: admin, content_manager, user)
- **avatar**: ImageField
- **bio**: TextField
- **website**: URLField
- **linkedin**: URLField
- **github**: URLField
- **twitter**: URLField
- **is_content_manager**: BooleanField (computed from role)

### 2. Hero

#### Hero
- **name**: CharField
- **title**: CharField
- **subtitle**: CharField
- **description**: TextField
- **profile_image**: ImageField
- **background_image**: ImageField
- **availability_status**: CharField (choices: available, busy, offline)
- **resume_button_text**: CharField
- **resume_button_url**: URLField
- **hire_me_button_text**: CharField
- **hire_me_button_url**: URLField
- **show_on_homepage**: BooleanField
- **status**: CharField
- **is_active**: BooleanField
- **order**: IntegerField

### 3. About

#### About
- **name**: CharField
- **title**: CharField
- **bio**: TextField
- **profile_image**: ImageField
- **resume_file**: FileField
- **show_on_homepage**: BooleanField
- **status**: CharField
- **is_active**: BooleanField
- **order**: IntegerField

### 4. Skills

#### SkillCategory
- **name**: CharField
- **slug**: SlugField
- **description**: TextField
- **icon**: CharField
- **status**: CharField
- **is_active**: BooleanField
- **order**: IntegerField

#### Skill
- **category**: ForeignKey(SkillCategory)
- **name**: CharField
- **slug**: SlugField
- **icon**: CharField
- **percentage**: IntegerField
- **proficiency_level**: CharField (choices: beginner, intermediate, advanced, expert)
- **experience_years**: IntegerField
- **is_featured**: BooleanField
- **show_on_homepage**: BooleanField
- **status**: CharField
- **is_active**: BooleanField
- **order**: IntegerField

### 5. Tech Stack

#### TechStackCategory
- **name**: CharField
- **slug**: SlugField
- **description**: TextField
- **icon**: CharField
- **status**: CharField
- **is_active**: BooleanField
- **order**: IntegerField

#### TechStackItem
- **category**: ForeignKey(TechStackCategory)
- **name**: CharField
- **slug**: SlugField
- **icon**: CharField
- **version**: CharField
- **skill_level**: CharField (choices: beginner, intermediate, advanced, expert)
- **documentation_url**: URLField
- **is_featured**: BooleanField
- **show_on_homepage**: BooleanField
- **status**: CharField
- **is_active**: BooleanField
- **order**: IntegerField

### 6. Experience

#### Experience
- **company**: CharField
- **position**: CharField
- **employment_type**: CharField (choices: full_time, part_time, contract, freelance, internship)
- **location**: CharField
- **start_date**: DateField
- **end_date**: DateField
- **is_current**: BooleanField
- **description**: TextField
- **responsibilities**: TextField
- **technologies**: TextField
- **achievements**: TextField
- **company_website**: URLField
- **company_logo**: ImageField
- **show_on_homepage**: BooleanField
- **is_featured**: BooleanField
- **status**: CharField
- **is_active**: BooleanField
- **order**: IntegerField

### 7. Education

#### Education
- **institution**: CharField
- **degree**: CharField
- **major**: CharField
- **field_of_study**: CharField
- **start_date**: DateField
- **end_date**: DateField
- **is_current**: BooleanField
- **cgpa**: DecimalField
- **percentage**: IntegerField
- **grade**: CharField
- **description**: TextField
- **coursework**: TextField
- **achievements**: TextField
- **institution_website**: URLField
- **institution_logo**: ImageField
- **show_on_homepage**: BooleanField
- **status**: CharField
- **is_active**: BooleanField
- **order**: IntegerField

### 8. Certifications

#### Certification
- **name**: CharField
- **issuer**: CharField
- **credential_id**: CharField
- **issue_date**: DateField
- **expiry_date**: DateField
- **does_not_expire**: BooleanField
- **verification_url**: URLField
- **is_verified**: BooleanField
- **description**: TextField
- **skills**: TextField
- **certificate_image**: ImageField
- **issuer_logo**: ImageField
- **badge_url**: URLField
- **certificate_url**: URLField
- **show_on_homepage**: BooleanField
- **is_featured**: BooleanField
- **status**: CharField
- **is_active**: BooleanField
- **order**: IntegerField

### 9. Projects

#### ProjectCategory
- **name**: CharField
- **slug**: SlugField
- **description**: TextField
- **icon**: CharField
- **color**: CharField
- **image**: ImageField
- **is_featured**: BooleanField
- **order**: IntegerField

#### Project
- **category**: ForeignKey(ProjectCategory)
- **title**: CharField
- **slug**: SlugField
- **short_description**: CharField
- **description**: TextField
- **thumbnail**: ImageField
- **github_url**: URLField
- **live_url**: URLField
- **visibility**: CharField (choices: public, private, password_protected)
- **password**: CharField
- **view_count**: IntegerField
- **like_count**: IntegerField
- **share_count**: IntegerField
- **is_featured**: BooleanField
- **is_pinned**: BooleanField
- **status**: CharField
- **is_active**: BooleanField
- **order**: IntegerField

#### ProjectImage
- **project**: ForeignKey(Project)
- **image**: ImageField
- **alt_text**: CharField
- **caption**: TextField
- **is_cover**: BooleanField
- **order**: IntegerField

#### ProjectGallery
- **project**: OneToOneField(Project)
- **title**: CharField
- **description**: TextField

#### ProjectVideo
- **project**: ForeignKey(Project)
- **video_type**: CharField (choices: youtube, vimeo, mp4)
- **video_file**: FileField
- **video_url**: URLField
- **thumbnail**: ImageField
- **title**: CharField
- **description**: TextField
- **duration**: DurationField
- **order**: IntegerField

#### ProjectFeature
- **project**: ForeignKey(Project)
- **title**: CharField
- **description**: TextField
- **icon**: CharField
- **order**: IntegerField

#### ProjectTechnology
- **project**: ForeignKey(Project)
- **name**: CharField
- **category**: CharField
- **version**: CharField
- **icon**: CharField
- **url**: URLField
- **order**: IntegerField

### 10. Achievements

#### Achievement
- **title**: CharField
- **achievement_type**: CharField (choices: award, certification, recognition, milestone)
- **description**: TextField
- **date**: DateField
- **organization**: CharField
- **organization_url**: URLField
- **organization_logo**: ImageField
- **certificate_image**: ImageField
- **badge_url**: URLField
- **url**: URLField
- **show_on_homepage**: BooleanField
- **is_featured**: BooleanField
- **status**: CharField
- **is_active**: BooleanField
- **order**: IntegerField

### 11. Blogs

#### BlogCategory
- **name**: CharField
- **slug**: SlugField
- **description**: TextField
- **icon**: CharField
- **status**: CharField
- **is_active**: BooleanField
- **order**: IntegerField

#### BlogTag
- **name**: CharField
- **slug**: SlugField
- **description**: TextField
- **status**: CharField
- **is_active**: BooleanField

#### Blog
- **category**: ForeignKey(BlogCategory)
- **tags**: ManyToManyField(BlogTag)
- **author**: ForeignKey(User)
- **title**: CharField
- **slug**: SlugField
- **excerpt**: CharField
- **content**: TextField
- **featured_image**: ImageField
- **published_at**: DateTimeField
- **view_count**: IntegerField
- **like_count**: IntegerField
- **share_count**: IntegerField
- **reading_time**: IntegerField
- **is_featured**: BooleanField
- **allow_comments**: BooleanField
- **status**: CharField
- **is_active**: BooleanField
- **order**: IntegerField

### 12. Contact

#### Contact
- **name**: CharField
- **email**: EmailField
- **phone**: CharField
- **subject**: CharField
- **message**: TextField
- **ip_address**: GenericIPAddressField
- **country**: CharField
- **browser**: CharField
- **device**: CharField
- **user_agent**: TextField
- **contact_status**: CharField (choices: pending, in_progress, replied, closed)
- **reply**: TextField
- **replied_at**: DateTimeField
- **replied_by**: ForeignKey(User)
- **is_starred**: BooleanField
- **is_spam**: BooleanField
- **spam_score**: IntegerField
- **status**: CharField
- **is_active**: BooleanField

### 13. Resume

#### Resume
- **title**: CharField
- **description**: TextField
- **resume_file**: FileField
- **file_type**: CharField (choices: pdf, docx, txt)
- **version**: CharField
- **is_default**: BooleanField
- **download_count**: IntegerField
- **last_downloaded_at**: DateTimeField
- **show_on_homepage**: BooleanField
- **status**: CharField
- **is_active**: BooleanField

### 14. Socials

#### SocialLink
- **platform**: CharField (choices: linkedin, github, twitter, instagram, facebook, youtube, dribbble, behance, other)
- **url**: URLField
- **username**: CharField
- **display_name**: CharField
- **icon**: CharField
- **show_on_homepage**: BooleanField
- **status**: CharField
- **is_active**: BooleanField
- **order**: IntegerField

### 15. SEO

#### SEOSettings
- **site_title**: CharField
- **meta_description**: TextField
- **meta_keywords**: TextField
- **og_image**: ImageField
- **og_title**: CharField
- **og_description**: TextField
- **twitter_card**: CharField (choices: summary, summary_large_image, app, player)
- **twitter_image**: ImageField
- **twitter_title**: CharField
- **twitter_description**: TextField
- **canonical_url**: URLField
- **robots_txt**: TextField
- **schema_org_type**: CharField
- **schema_org_json**: JSONField
- **sitemap_enabled**: BooleanField
- **google_analytics_id**: CharField
- **google_tag_manager_id**: CharField

### 16. Analytics

#### Analytics
- **ip_address**: GenericIPAddressField
- **user_agent**: TextField
- **country**: CharField
- **city**: CharField
- **region**: CharField
- **device_type**: CharField
- **browser**: CharField
- **os**: CharField
- **session_id**: CharField
- **referrer**: URLField
- **landing_page**: URLField
- **exit_page**: URLField
- **duration**: DurationField
- **page_views**: IntegerField
- **source**: CharField
- **medium**: CharField
- **campaign**: CharField

### 17. Newsletter

#### Newsletter
- **email**: EmailField
- **name**: CharField
- **is_subscribed**: BooleanField
- **is_verified**: BooleanField
- **verification_token**: CharField
- **verified_at**: DateTimeField
- **unsubscribed_at**: DateTimeField
- **unsubscribe_reason**: TextField
- **source**: CharField
- **status**: CharField
- **is_active**: BooleanField

### 18. Timeline

#### Timeline
- **title**: CharField
- **event_type**: CharField (choices: milestone, achievement, project, publication, other)
- **date**: DateField
- **description**: TextField
- **details**: TextField
- **url**: URLField
- **image**: ImageField
- **icon**: CharField
- **color**: CharField
- **show_on_homepage**: BooleanField
- **status**: CharField
- **is_active**: BooleanField
- **order**: IntegerField

### 19. Testimonials

#### Testimonial
- **client_name**: CharField
- **client_designation**: CharField
- **client_company**: CharField
- **client_photo**: ImageField
- **company_logo**: ImageField
- **review**: TextField
- **rating**: IntegerField
- **linkedin_url**: URLField
- **website_url**: URLField
- **project_name**: CharField
- **project_url**: URLField
- **show_on_homepage**: BooleanField
- **is_featured**: BooleanField
- **status**: CharField
- **is_active**: BooleanField
- **order**: IntegerField

### 20. FAQs

#### FAQCategory
- **name**: CharField
- **slug**: SlugField
- **description**: TextField
- **icon**: CharField
- **status**: CharField
- **is_active**: BooleanField
- **order**: IntegerField

#### FAQ
- **category**: ForeignKey(FAQCategory)
- **question**: CharField
- **answer**: TextField
- **show_on_homepage**: BooleanField
- **is_featured**: BooleanField
- **status**: CharField
- **is_active**: BooleanField
- **order**: IntegerField

### 21. Clients

#### Client
- **name**: CharField
- **company**: CharField
- **designation**: CharField
- **logo**: ImageField
- **photo**: ImageField
- **website**: URLField
- **email**: EmailField
- **linkedin**: URLField
- **review**: TextField
- **rating**: IntegerField
- **project_name**: CharField
- **project_description**: TextField
- **show_on_homepage**: BooleanField
- **is_featured**: BooleanField
- **status**: CharField
- **is_active**: BooleanField
- **order**: IntegerField

### 22. Services

#### Service
- **name**: CharField
- **slug**: SlugField
- **tagline**: CharField
- **description**: TextField
- **icon**: CharField
- **image**: ImageField
- **color**: CharField
- **price**: DecimalField
- **price_type**: CharField (choices: hourly, project, monthly, custom)
- **features**: TextField
- **process_steps**: TextField
- **show_on_homepage**: BooleanField
- **is_featured**: BooleanField
- **status**: CharField
- **is_active**: BooleanField
- **order**: IntegerField
- **meta_title**: CharField
- **meta_description**: TextField
- **meta_keywords**: TextField
- **og_image**: ImageField
- **canonical_url**: URLField
- **no_index**: BooleanField
- **no_follow**: BooleanField

### 23. Media

#### MediaFolder
- **name**: CharField
- **parent**: ForeignKey('self', null=True)
- **path**: CharField
- **status**: CharField
- **is_active**: BooleanField

#### Media
- **folder**: ForeignKey(MediaFolder)
- **name**: CharField
- **file**: FileField
- **file_type**: CharField (choices: image, video, audio, document, other)
- **mime_type**: CharField
- **size**: IntegerField
- **width**: IntegerField
- **height**: IntegerField
- **alt_text**: CharField
- **caption**: TextField
- **is_compressed**: BooleanField
- **original_file**: FileField
- **metadata**: JSONField
- **status**: CharField
- **is_active**: BooleanField

### 24. Search

#### SearchQuery
- **query**: CharField
- **results_count**: IntegerField
- **ip_address**: GenericIPAddressField
- **user_agent**: TextField
- **search_type**: CharField (choices: general, projects, blogs, skills)
- **created_at**: DateTimeField

## Relationships

### One-to-Many
- User → Hero (created_by, updated_by)
- User → Projects (created_by, updated_by)
- User → Blogs (author, created_by, updated_by)
- User → Contact (replied_by)
- SkillCategory → Skills
- TechStackCategory → TechStackItems
- ProjectCategory → Projects
- Project → ProjectImages
- Project → ProjectVideos
- Project → ProjectFeatures
- Project → ProjectTechnologies
- BlogCategory → Blogs
- Blog → BlogTags (Many-to-Many)
- FAQCategory → FAQs
- MediaFolder → Media (Many-to-Many)

### One-to-One
- Project → ProjectGallery

## Indexes

All models have indexes on:
- **id** (Primary Key, UUID)
- **slug** (Unique, where applicable)
- **status** (For filtering)
- **is_active** (For filtering)
- **created_at** (For ordering)
- **order** (For ordering)

Additional indexes:
- **User.email** (Unique)
- **Blog.slug** (Unique)
- **Project.slug** (Unique)
- **Service.slug** (Unique)
- **Skill.slug** (Unique)
- **Contact.email** (For searching)
- **Analytics.session_id** (For tracking)
- **Newsletter.email** (Unique)

## Database Constraints

### Unique Constraints
- User.email
- User.username
- Blog.slug
- Project.slug
- Service.slug
- Skill.slug
- TechStackItem.slug
- BlogTag.slug
- SkillCategory.slug
- ProjectCategory.slug
- FAQCategory.slug
- Newsletter.email

### Foreign Key Constraints
All foreign keys have CASCADE delete behavior unless specified otherwise.

### Check Constraints
- **percentage**: 0 <= value <= 100
- **rating**: 1 <= value <= 5
- **cgpa**: 0 <= value <= 10
- **experience_years**: value >= 0

## Migration Strategy

1. **Initial Migration**: Create all base models (BaseModel, StatusModel, OrderableModel, AuditModel)
2. **User Migration**: Create User model with custom fields
3. **Content Apps**: Migrate content apps in dependency order
4. **Relationship Apps**: Migrate apps with foreign keys after parent apps
5. **Final Migration**: Create indexes and constraints

## Backup Strategy

- **Daily Backups**: Full database backups
- **Weekly Backups**: Archive backups
- **Point-in-Time Recovery**: WAL log archiving
- **Backup Retention**: 30 days daily, 12 weeks weekly

## Performance Considerations

- **Query Optimization**: Use select_related and prefetch_related for foreign keys
- **Indexing**: Strategic indexing on frequently queried fields
- **Partitioning**: Consider partitioning large tables (analytics, search queries)
- **Connection Pooling**: Configure connection pooling for high traffic
- **Caching**: Implement Redis caching for frequently accessed data
