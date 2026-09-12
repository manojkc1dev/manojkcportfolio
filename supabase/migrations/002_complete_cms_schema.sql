-- ==============================================================================
-- Supabase Migration: 002_complete_cms_schema.sql
-- Complete CMS Schema for Manoj K.C. Portfolio
-- Phase 1 profiles table and auth trigger already exist.
-- ==============================================================================

-- Ensure uuid extension exists
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Helper trigger for automatic updated_at timestamp updates
CREATE OR REPLACE FUNCTION public.handle_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Ensure is_admin() helper function exists
CREATE OR REPLACE FUNCTION public.is_admin()
RETURNS BOOLEAN AS $$
BEGIN
  RETURN EXISTS (
    SELECT 1 FROM public.profiles
    WHERE id = auth.uid() AND role = 'admin'
  );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Drop previous simple tables if they exist to apply complete CMS schema cleanly
DROP TABLE IF EXISTS public.projects CASCADE;
DROP TABLE IF EXISTS public.skills CASCADE;
DROP TABLE IF EXISTS public.social_links CASCADE;
DROP TABLE IF EXISTS public.socials CASCADE;
DROP TABLE IF EXISTS public.site_settings CASCADE;

-- ==============================================================================
-- 1. CONTENT TABLES
-- Each includes: id uuid, slug unique, status 'draft'|'published', published_at,
-- seo_title, seo_description, created_at, updated_at
-- ==============================================================================

-- 1. Hero
CREATE TABLE IF NOT EXISTS public.hero (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  slug TEXT UNIQUE NOT NULL DEFAULT 'home-hero',
  status TEXT NOT NULL DEFAULT 'published' CHECK (status IN ('draft', 'published')),
  published_at TIMESTAMPTZ DEFAULT NOW(),
  seo_title TEXT,
  seo_description TEXT,
  headline TEXT NOT NULL,
  subheadline TEXT,
  intro TEXT,
  cta_primary_text TEXT,
  cta_primary_url TEXT,
  cta_secondary_text TEXT,
  cta_secondary_url TEXT,
  availability_badge TEXT,
  hero_image_url TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- 2. About
CREATE TABLE IF NOT EXISTS public.about (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  slug TEXT UNIQUE NOT NULL DEFAULT 'about-manoj',
  status TEXT NOT NULL DEFAULT 'published' CHECK (status IN ('draft', 'published')),
  published_at TIMESTAMPTZ DEFAULT NOW(),
  seo_title TEXT,
  seo_description TEXT,
  long_form TEXT NOT NULL,
  pull_quote TEXT,
  location TEXT,
  availability_note TEXT,
  photo_url TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- 3. Skills
CREATE TABLE IF NOT EXISTS public.skills (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  slug TEXT UNIQUE NOT NULL,
  status TEXT NOT NULL DEFAULT 'published' CHECK (status IN ('draft', 'published')),
  published_at TIMESTAMPTZ DEFAULT NOW(),
  seo_title TEXT,
  seo_description TEXT,
  name TEXT NOT NULL,
  category TEXT NOT NULL CHECK (category IN ('language', 'framework', 'database', 'tool')),
  proficiency INT CHECK (proficiency BETWEEN 1 AND 5),
  icon TEXT,
  sort_order INT NOT NULL DEFAULT 0,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- 4. Experiences
CREATE TABLE IF NOT EXISTS public.experiences (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  slug TEXT UNIQUE NOT NULL,
  status TEXT NOT NULL DEFAULT 'published' CHECK (status IN ('draft', 'published')),
  published_at TIMESTAMPTZ DEFAULT NOW(),
  seo_title TEXT,
  seo_description TEXT,
  company TEXT NOT NULL,
  role TEXT NOT NULL,
  start_date DATE NOT NULL,
  end_date DATE,
  description TEXT,
  current BOOLEAN NOT NULL DEFAULT FALSE,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- 5. Education
CREATE TABLE IF NOT EXISTS public.education (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  slug TEXT UNIQUE NOT NULL,
  status TEXT NOT NULL DEFAULT 'published' CHECK (status IN ('draft', 'published')),
  published_at TIMESTAMPTZ DEFAULT NOW(),
  seo_title TEXT,
  seo_description TEXT,
  institution TEXT NOT NULL,
  degree TEXT NOT NULL,
  field TEXT NOT NULL,
  start_date DATE,
  end_date DATE,
  description TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- 6. Projects
CREATE TABLE IF NOT EXISTS public.projects (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  title TEXT NOT NULL,
  slug TEXT UNIQUE NOT NULL,
  status TEXT NOT NULL DEFAULT 'published' CHECK (status IN ('draft', 'published')),
  published_at TIMESTAMPTZ DEFAULT NOW(),
  seo_title TEXT,
  seo_description TEXT,
  tagline TEXT,
  description TEXT NOT NULL,
  cover_url TEXT,
  category TEXT,
  featured BOOLEAN NOT NULL DEFAULT FALSE,
  live_url TEXT,
  github_url TEXT,
  tech TEXT[] NOT NULL DEFAULT '{}',
  tags TEXT[] NOT NULL DEFAULT '{}',
  sort_order INT NOT NULL DEFAULT 0,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- 7. Certifications
CREATE TABLE IF NOT EXISTS public.certifications (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  slug TEXT UNIQUE NOT NULL,
  status TEXT NOT NULL DEFAULT 'published' CHECK (status IN ('draft', 'published')),
  published_at TIMESTAMPTZ DEFAULT NOW(),
  seo_title TEXT,
  seo_description TEXT,
  name TEXT NOT NULL,
  issuer TEXT NOT NULL,
  issue_date DATE,
  credential_url TEXT,
  sort_order INT NOT NULL DEFAULT 0,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- 8. Services
CREATE TABLE IF NOT EXISTS public.services (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  slug TEXT UNIQUE NOT NULL,
  status TEXT NOT NULL DEFAULT 'published' CHECK (status IN ('draft', 'published')),
  published_at TIMESTAMPTZ DEFAULT NOW(),
  seo_title TEXT,
  seo_description TEXT,
  title TEXT NOT NULL,
  description TEXT NOT NULL,
  icon TEXT,
  sort_order INT NOT NULL DEFAULT 0,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- 9. Testimonials
CREATE TABLE IF NOT EXISTS public.testimonials (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  slug TEXT UNIQUE NOT NULL,
  status TEXT NOT NULL DEFAULT 'published' CHECK (status IN ('draft', 'published')),
  published_at TIMESTAMPTZ DEFAULT NOW(),
  seo_title TEXT,
  seo_description TEXT,
  name TEXT NOT NULL,
  role TEXT NOT NULL,
  company TEXT,
  quote TEXT NOT NULL,
  avatar_url TEXT,
  rating INT CHECK (rating BETWEEN 1 AND 5),
  sort_order INT NOT NULL DEFAULT 0,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- 10. Blogs
CREATE TABLE IF NOT EXISTS public.blogs (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  title TEXT NOT NULL,
  slug TEXT UNIQUE NOT NULL,
  status TEXT NOT NULL DEFAULT 'published' CHECK (status IN ('draft', 'published')),
  published_at TIMESTAMPTZ DEFAULT NOW(),
  seo_title TEXT,
  seo_description TEXT,
  excerpt TEXT,
  content TEXT, -- MDX content
  cover_url TEXT,
  tags TEXT[] NOT NULL DEFAULT '{}',
  reading_time INT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- 11. FAQs
CREATE TABLE IF NOT EXISTS public.faqs (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  slug TEXT UNIQUE NOT NULL,
  status TEXT NOT NULL DEFAULT 'published' CHECK (status IN ('draft', 'published')),
  published_at TIMESTAMPTZ DEFAULT NOW(),
  seo_title TEXT,
  seo_description TEXT,
  question TEXT NOT NULL,
  answer TEXT NOT NULL,
  category TEXT,
  sort_order INT NOT NULL DEFAULT 0,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- 12. Socials
CREATE TABLE IF NOT EXISTS public.socials (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  slug TEXT UNIQUE NOT NULL,
  status TEXT NOT NULL DEFAULT 'published' CHECK (status IN ('draft', 'published')),
  published_at TIMESTAMPTZ DEFAULT NOW(),
  seo_title TEXT,
  seo_description TEXT,
  platform TEXT NOT NULL,
  url TEXT NOT NULL,
  icon TEXT,
  sort_order INT NOT NULL DEFAULT 0,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- ==============================================================================
-- 2. SYSTEM & INTERACTION TABLES
-- ==============================================================================

-- 13. Contact Submissions
CREATE TABLE IF NOT EXISTS public.contact_submissions (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name TEXT NOT NULL,
  email TEXT NOT NULL,
  subject TEXT,
  message TEXT NOT NULL,
  status TEXT NOT NULL DEFAULT 'new' CHECK (status IN ('new', 'read', 'replied')),
  ip TEXT,
  user_agent TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- 14. Newsletter Subscribers
CREATE TABLE IF NOT EXISTS public.newsletter_subscribers (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  email TEXT UNIQUE NOT NULL,
  confirmed BOOLEAN NOT NULL DEFAULT FALSE,
  confirmed_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- 15. Navigation
CREATE TABLE IF NOT EXISTS public.navigation (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  location TEXT NOT NULL CHECK (location IN ('header', 'footer')),
  label TEXT NOT NULL,
  href TEXT NOT NULL,
  sort_order INT NOT NULL DEFAULT 0,
  is_cta BOOLEAN NOT NULL DEFAULT FALSE,
  status TEXT NOT NULL DEFAULT 'published' CHECK (status IN ('draft', 'published')),
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- 16. SEO Pages
CREATE TABLE IF NOT EXISTS public.seo_pages (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  path TEXT UNIQUE NOT NULL,
  title TEXT NOT NULL,
  description TEXT NOT NULL,
  og_image TEXT,
  canonical TEXT,
  noindex BOOLEAN NOT NULL DEFAULT FALSE,
  json_ld JSONB NOT NULL DEFAULT '{}'::jsonb,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- 17. Theme
CREATE TABLE IF NOT EXISTS public.theme (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name TEXT NOT NULL,
  is_active BOOLEAN NOT NULL DEFAULT FALSE,
  light JSONB NOT NULL DEFAULT '{}'::jsonb,
  dark JSONB NOT NULL DEFAULT '{}'::jsonb,
  typography JSONB NOT NULL DEFAULT '{}'::jsonb,
  motion JSONB NOT NULL DEFAULT '{}'::jsonb,
  effects JSONB NOT NULL DEFAULT '{}'::jsonb,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- 18. Page Layouts
CREATE TABLE IF NOT EXISTS public.page_layouts (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  page TEXT UNIQUE NOT NULL,
  sections JSONB NOT NULL DEFAULT '[]'::jsonb,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- 19. Audit Log
CREATE TABLE IF NOT EXISTS public.audit_log (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES auth.users(id) ON DELETE SET NULL,
  action TEXT NOT NULL,
  entity TEXT NOT NULL,
  entity_id TEXT,
  diff JSONB NOT NULL DEFAULT '{}'::jsonb,
  ip TEXT,
  user_agent TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- 20. Revisions
CREATE TABLE IF NOT EXISTS public.revisions (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  entity TEXT NOT NULL,
  entity_id TEXT NOT NULL,
  diff JSONB NOT NULL DEFAULT '{}'::jsonb,
  user_id UUID REFERENCES auth.users(id) ON DELETE SET NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- 21. Media Assets
CREATE TABLE IF NOT EXISTS public.media_assets (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  public_id TEXT UNIQUE NOT NULL,
  url TEXT NOT NULL,
  format TEXT,
  bytes BIGINT,
  width INT,
  height INT,
  folder TEXT DEFAULT 'general',
  alt TEXT,
  caption TEXT,
  tags TEXT[] NOT NULL DEFAULT '{}',
  uploaded_by UUID REFERENCES auth.users(id) ON DELETE SET NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- 22. Chat Sessions
CREATE TABLE IF NOT EXISTS public.chat_sessions (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  session_id TEXT UNIQUE NOT NULL,
  visitor_meta JSONB NOT NULL DEFAULT '{}'::jsonb,
  message_count INT NOT NULL DEFAULT 0,
  started_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  ended_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- 23. Chat Messages
CREATE TABLE IF NOT EXISTS public.chat_messages (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  session_id TEXT NOT NULL REFERENCES public.chat_sessions(session_id) ON DELETE CASCADE,
  role TEXT NOT NULL CHECK (role IN ('user', 'assistant')),
  content TEXT NOT NULL,
  tokens INT,
  model TEXT,
  latency_ms INT,
  flagged BOOLEAN NOT NULL DEFAULT FALSE,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- ==============================================================================
-- 3. TRIGGERS (Auto updated_at)
-- ==============================================================================

DO $$
DECLARE
  tbl TEXT;
BEGIN
  FOR tbl IN
    SELECT tablename FROM pg_tables
    WHERE schemaname = 'public'
      AND tablename IN (
        'hero', 'about', 'skills', 'experiences', 'education', 'projects',
        'certifications', 'services', 'testimonials', 'blogs', 'faqs', 'socials',
        'contact_submissions', 'newsletter_subscribers', 'navigation', 'seo_pages',
        'theme', 'page_layouts', 'media_assets', 'chat_sessions'
      )
  LOOP
    EXECUTE format('DROP TRIGGER IF EXISTS trigger_updated_at ON public.%I;', tbl);
    EXECUTE format('CREATE TRIGGER trigger_updated_at BEFORE UPDATE ON public.%I FOR EACH ROW EXECUTE FUNCTION public.handle_updated_at();', tbl);
  END LOOP;
END $$;

-- ==============================================================================
-- 4. INDEXES
-- ==============================================================================

-- A. Unique Indexes on slugs (covered by table constraints, adding explicit named indexes if needed)
CREATE UNIQUE INDEX IF NOT EXISTS idx_hero_slug ON public.hero (slug);
CREATE UNIQUE INDEX IF NOT EXISTS idx_about_slug ON public.about (slug);
CREATE UNIQUE INDEX IF NOT EXISTS idx_skills_slug ON public.skills (slug);
CREATE UNIQUE INDEX IF NOT EXISTS idx_experiences_slug ON public.experiences (slug);
CREATE UNIQUE INDEX IF NOT EXISTS idx_education_slug ON public.education (slug);
CREATE UNIQUE INDEX IF NOT EXISTS idx_projects_slug ON public.projects (slug);
CREATE UNIQUE INDEX IF NOT EXISTS idx_certifications_slug ON public.certifications (slug);
CREATE UNIQUE INDEX IF NOT EXISTS idx_services_slug ON public.services (slug);
CREATE UNIQUE INDEX IF NOT EXISTS idx_testimonials_slug ON public.testimonials (slug);
CREATE UNIQUE INDEX IF NOT EXISTS idx_blogs_slug ON public.blogs (slug);
CREATE UNIQUE INDEX IF NOT EXISTS idx_faqs_slug ON public.faqs (slug);
CREATE UNIQUE INDEX IF NOT EXISTS idx_socials_slug ON public.socials (slug);

-- B. Compound Indexes on (status, published_at)
CREATE INDEX IF NOT EXISTS idx_hero_status_published_at ON public.hero (status, published_at);
CREATE INDEX IF NOT EXISTS idx_about_status_published_at ON public.about (status, published_at);
CREATE INDEX IF NOT EXISTS idx_skills_status_published_at ON public.skills (status, published_at);
CREATE INDEX IF NOT EXISTS idx_experiences_status_published_at ON public.experiences (status, published_at);
CREATE INDEX IF NOT EXISTS idx_education_status_published_at ON public.education (status, published_at);
CREATE INDEX IF NOT EXISTS idx_projects_status_published_at ON public.projects (status, published_at);
CREATE INDEX IF NOT EXISTS idx_certifications_status_published_at ON public.certifications (status, published_at);
CREATE INDEX IF NOT EXISTS idx_services_status_published_at ON public.services (status, published_at);
CREATE INDEX IF NOT EXISTS idx_testimonials_status_published_at ON public.testimonials (status, published_at);
CREATE INDEX IF NOT EXISTS idx_blogs_status_published_at ON public.blogs (status, published_at);
CREATE INDEX IF NOT EXISTS idx_faqs_status_published_at ON public.faqs (status, published_at);
CREATE INDEX IF NOT EXISTS idx_socials_status_published_at ON public.socials (status, published_at);
CREATE INDEX IF NOT EXISTS idx_navigation_status_sort ON public.navigation (status, sort_order);

-- C. GIN Indexes on array tags columns
CREATE INDEX IF NOT EXISTS idx_projects_tech_gin ON public.projects USING GIN (tech);
CREATE INDEX IF NOT EXISTS idx_projects_tags_gin ON public.projects USING GIN (tags);
CREATE INDEX IF NOT EXISTS idx_blogs_tags_gin ON public.blogs USING GIN (tags);
CREATE INDEX IF NOT EXISTS idx_media_assets_tags_gin ON public.media_assets USING GIN (tags);

-- D. Full Text Search Indexes on projects.title, blogs.title, blogs.content
CREATE INDEX IF NOT EXISTS idx_projects_title_fts ON public.projects USING GIN (to_tsvector('english', title));
CREATE INDEX IF NOT EXISTS idx_blogs_title_fts ON public.blogs USING GIN (to_tsvector('english', title));
CREATE INDEX IF NOT EXISTS idx_blogs_content_fts ON public.blogs USING GIN (to_tsvector('english', coalesce(content, '')));
CREATE INDEX IF NOT EXISTS idx_blogs_title_content_fts ON public.blogs USING GIN (to_tsvector('english', coalesce(title, '') || ' ' || coalesce(content, '')));

-- E. Foreign key and lookup performance indexes
CREATE INDEX IF NOT EXISTS idx_chat_messages_session_id ON public.chat_messages (session_id);
CREATE INDEX IF NOT EXISTS idx_audit_log_user_id ON public.audit_log (user_id);
CREATE INDEX IF NOT EXISTS idx_audit_log_entity ON public.audit_log (entity, entity_id);
CREATE INDEX IF NOT EXISTS idx_revisions_entity ON public.revisions (entity, entity_id);

-- ==============================================================================
-- 5. ROW LEVEL SECURITY (RLS) POLICIES
-- ==============================================================================

-- Enable RLS on all tables
ALTER TABLE public.hero ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.about ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.skills ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.experiences ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.education ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.projects ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.certifications ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.services ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.testimonials ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.blogs ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.faqs ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.socials ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.contact_submissions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.newsletter_subscribers ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.navigation ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.seo_pages ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.theme ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.page_layouts ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.audit_log ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.revisions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.media_assets ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.chat_sessions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.chat_messages ENABLE ROW LEVEL SECURITY;

-- ------------------------------------------------------------------------------
-- Content Tables: Public SELECT WHERE status='published', Admin full access
-- ------------------------------------------------------------------------------

-- hero
CREATE POLICY "Public can view published hero" ON public.hero FOR SELECT USING (status = 'published');
CREATE POLICY "Admin full access on hero" ON public.hero FOR ALL USING (public.is_admin()) WITH CHECK (public.is_admin());

-- about
CREATE POLICY "Public can view published about" ON public.about FOR SELECT USING (status = 'published');
CREATE POLICY "Admin full access on about" ON public.about FOR ALL USING (public.is_admin()) WITH CHECK (public.is_admin());

-- skills
CREATE POLICY "Public can view published skills" ON public.skills FOR SELECT USING (status = 'published');
CREATE POLICY "Admin full access on skills" ON public.skills FOR ALL USING (public.is_admin()) WITH CHECK (public.is_admin());

-- experiences
CREATE POLICY "Public can view published experiences" ON public.experiences FOR SELECT USING (status = 'published');
CREATE POLICY "Admin full access on experiences" ON public.experiences FOR ALL USING (public.is_admin()) WITH CHECK (public.is_admin());

-- education
CREATE POLICY "Public can view published education" ON public.education FOR SELECT USING (status = 'published');
CREATE POLICY "Admin full access on education" ON public.education FOR ALL USING (public.is_admin()) WITH CHECK (public.is_admin());

-- projects
CREATE POLICY "Public can view published projects" ON public.projects FOR SELECT USING (status = 'published');
CREATE POLICY "Admin full access on projects" ON public.projects FOR ALL USING (public.is_admin()) WITH CHECK (public.is_admin());

-- certifications
CREATE POLICY "Public can view published certifications" ON public.certifications FOR SELECT USING (status = 'published');
CREATE POLICY "Admin full access on certifications" ON public.certifications FOR ALL USING (public.is_admin()) WITH CHECK (public.is_admin());

-- services
CREATE POLICY "Public can view published services" ON public.services FOR SELECT USING (status = 'published');
CREATE POLICY "Admin full access on services" ON public.services FOR ALL USING (public.is_admin()) WITH CHECK (public.is_admin());

-- testimonials
CREATE POLICY "Public can view published testimonials" ON public.testimonials FOR SELECT USING (status = 'published');
CREATE POLICY "Admin full access on testimonials" ON public.testimonials FOR ALL USING (public.is_admin()) WITH CHECK (public.is_admin());

-- blogs
CREATE POLICY "Public can view published blogs" ON public.blogs FOR SELECT USING (status = 'published');
CREATE POLICY "Admin full access on blogs" ON public.blogs FOR ALL USING (public.is_admin()) WITH CHECK (public.is_admin());

-- faqs
CREATE POLICY "Public can view published faqs" ON public.faqs FOR SELECT USING (status = 'published');
CREATE POLICY "Admin full access on faqs" ON public.faqs FOR ALL USING (public.is_admin()) WITH CHECK (public.is_admin());

-- socials
CREATE POLICY "Public can view published socials" ON public.socials FOR SELECT USING (status = 'published');
CREATE POLICY "Admin full access on socials" ON public.socials FOR ALL USING (public.is_admin()) WITH CHECK (public.is_admin());

-- ------------------------------------------------------------------------------
-- Public Site Config: navigation, seo_pages, theme, page_layouts, media_assets
-- ------------------------------------------------------------------------------

-- navigation
CREATE POLICY "Public can view published navigation" ON public.navigation FOR SELECT USING (status = 'published');
CREATE POLICY "Admin full access on navigation" ON public.navigation FOR ALL USING (public.is_admin()) WITH CHECK (public.is_admin());

-- seo_pages
CREATE POLICY "Public can view indexed seo_pages" ON public.seo_pages FOR SELECT USING (noindex = false);
CREATE POLICY "Admin full access on seo_pages" ON public.seo_pages FOR ALL USING (public.is_admin()) WITH CHECK (public.is_admin());

-- theme
CREATE POLICY "Public can view active theme" ON public.theme FOR SELECT USING (is_active = true);
CREATE POLICY "Admin full access on theme" ON public.theme FOR ALL USING (public.is_admin()) WITH CHECK (public.is_admin());

-- page_layouts
CREATE POLICY "Public can view page_layouts" ON public.page_layouts FOR SELECT USING (true);
CREATE POLICY "Admin full access on page_layouts" ON public.page_layouts FOR ALL USING (public.is_admin()) WITH CHECK (public.is_admin());

-- media_assets
CREATE POLICY "Public can view media_assets" ON public.media_assets FOR SELECT USING (true);
CREATE POLICY "Admin full access on media_assets" ON public.media_assets FOR ALL USING (public.is_admin()) WITH CHECK (public.is_admin());

-- ------------------------------------------------------------------------------
-- User Interactions: contact_submissions & newsletter_subscribers
-- (Public INSERT, Admin full access / SELECT only)
-- ------------------------------------------------------------------------------

-- contact_submissions: INSERT public, SELECT admin only
CREATE POLICY "Public can insert contact submissions" ON public.contact_submissions FOR INSERT WITH CHECK (true);
CREATE POLICY "Admin full access on contact submissions" ON public.contact_submissions FOR ALL USING (public.is_admin()) WITH CHECK (public.is_admin());

-- newsletter_subscribers: INSERT public, SELECT admin only
CREATE POLICY "Public can subscribe to newsletter" ON public.newsletter_subscribers FOR INSERT WITH CHECK (true);
CREATE POLICY "Admin full access on newsletter subscribers" ON public.newsletter_subscribers FOR ALL USING (public.is_admin()) WITH CHECK (public.is_admin());

-- ------------------------------------------------------------------------------
-- Admin-only tables: audit_log, revisions, chat_sessions, chat_messages
-- ------------------------------------------------------------------------------

CREATE POLICY "Admin full access on audit_log" ON public.audit_log FOR ALL USING (public.is_admin()) WITH CHECK (public.is_admin());
CREATE POLICY "Admin full access on revisions" ON public.revisions FOR ALL USING (public.is_admin()) WITH CHECK (public.is_admin());
CREATE POLICY "Admin full access on chat_sessions" ON public.chat_sessions FOR ALL USING (public.is_admin()) WITH CHECK (public.is_admin());
CREATE POLICY "Admin full access on chat_messages" ON public.chat_messages FOR ALL USING (public.is_admin()) WITH CHECK (public.is_admin());
