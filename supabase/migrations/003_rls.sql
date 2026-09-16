-- ==============================================================================
-- Supabase Migration: 003_rls.sql
-- Production Row Level Security (RLS) & Role-Based Access Control Policies
-- ==============================================================================

-- 1. Helper function: is_admin() (SECURITY DEFINER to safely read role from profiles)
CREATE OR REPLACE FUNCTION public.is_admin()
RETURNS BOOLEAN
LANGUAGE sql
SECURITY DEFINER
STABLE
SET search_path = public
AS $$
  SELECT EXISTS (
    SELECT 1 FROM public.profiles
    WHERE id = auth.uid() AND role = 'admin'
  );
$$;

-- 2. Enable Row Level Security on all content and operational tables
ALTER TABLE IF EXISTS public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE IF EXISTS public.projects ENABLE ROW LEVEL SECURITY;
ALTER TABLE IF EXISTS public.services ENABLE ROW LEVEL SECURITY;
ALTER TABLE IF EXISTS public.blogs ENABLE ROW LEVEL SECURITY;
ALTER TABLE IF EXISTS public.skills ENABLE ROW LEVEL SECURITY;
ALTER TABLE IF EXISTS public.testimonials ENABLE ROW LEVEL SECURITY;
ALTER TABLE IF EXISTS public.social_links ENABLE ROW LEVEL SECURITY;
ALTER TABLE IF EXISTS public.contact_submissions ENABLE ROW LEVEL SECURITY;
ALTER TABLE IF EXISTS public.contact_messages ENABLE ROW LEVEL SECURITY;
ALTER TABLE IF EXISTS public.site_settings ENABLE ROW LEVEL SECURITY;
ALTER TABLE IF EXISTS public.settings ENABLE ROW LEVEL SECURITY;

-- 3. PROFILES POLICIES
-- Users can read their own profile; admins can read all profiles; public can read basic info
DROP POLICY IF EXISTS "Users can read own profile" ON public.profiles;
CREATE POLICY "Users can read own profile"
  ON public.profiles FOR SELECT
  USING (auth.uid() = id OR public.is_admin());

DROP POLICY IF EXISTS "Users can update own profile" ON public.profiles;
CREATE POLICY "Users can update own profile"
  ON public.profiles FOR UPDATE
  USING (auth.uid() = id OR public.is_admin())
  WITH CHECK (auth.uid() = id OR public.is_admin());

DROP POLICY IF EXISTS "Admins have full access to profiles" ON public.profiles;
CREATE POLICY "Admins have full access to profiles"
  ON public.profiles FOR ALL
  USING (public.is_admin())
  WITH CHECK (public.is_admin());

-- 4. PROJECTS POLICIES
-- Public reads published; admins have full access
DROP POLICY IF EXISTS "Public can view published projects" ON public.projects;
CREATE POLICY "Public can view published projects"
  ON public.projects FOR SELECT
  USING (COALESCE(published, true) = true OR public.is_admin());

DROP POLICY IF EXISTS "Admins manage all projects" ON public.projects;
CREATE POLICY "Admins manage all projects"
  ON public.projects FOR ALL
  USING (public.is_admin())
  WITH CHECK (public.is_admin());

-- 5. SERVICES POLICIES
-- Public reads published; admins have full access
DROP POLICY IF EXISTS "Public can view published services" ON public.services;
CREATE POLICY "Public can view published services"
  ON public.services FOR SELECT
  USING (COALESCE(published, true) = true OR public.is_admin());

DROP POLICY IF EXISTS "Admins manage all services" ON public.services;
CREATE POLICY "Admins manage all services"
  ON public.services FOR ALL
  USING (public.is_admin())
  WITH CHECK (public.is_admin());

-- 6. BLOGS POLICIES
-- Public reads published; admins have full access
DROP POLICY IF EXISTS "Public can view published blogs" ON public.blogs;
CREATE POLICY "Public can view published blogs"
  ON public.blogs FOR SELECT
  USING (COALESCE(published, true) = true OR public.is_admin());

DROP POLICY IF EXISTS "Admins manage all blogs" ON public.blogs;
CREATE POLICY "Admins manage all blogs"
  ON public.blogs FOR ALL
  USING (public.is_admin())
  WITH CHECK (public.is_admin());

-- 7. CONTACT SUBMISSIONS / INQUIRIES POLICIES
-- Anyone can submit (INSERT); only authenticated admins can view (SELECT), update, or delete
DROP POLICY IF EXISTS "Public can submit contact form" ON public.contact_submissions;
CREATE POLICY "Public can submit contact form"
  ON public.contact_submissions FOR INSERT
  WITH CHECK (true);

DROP POLICY IF EXISTS "Admins can view contact submissions" ON public.contact_submissions;
CREATE POLICY "Admins can view contact submissions"
  ON public.contact_submissions FOR SELECT
  USING (public.is_admin());

DROP POLICY IF EXISTS "Admins manage contact submissions" ON public.contact_submissions;
CREATE POLICY "Admins manage contact submissions"
  ON public.contact_submissions FOR ALL
  USING (public.is_admin())
  WITH CHECK (public.is_admin());

-- Contact messages table alias (if present)
DROP POLICY IF EXISTS "Public can submit contact messages" ON public.contact_messages;
CREATE POLICY "Public can submit contact messages"
  ON public.contact_messages FOR INSERT
  WITH CHECK (true);

DROP POLICY IF EXISTS "Admins manage contact messages" ON public.contact_messages;
CREATE POLICY "Admins manage contact messages"
  ON public.contact_messages FOR ALL
  USING (public.is_admin())
  WITH CHECK (public.is_admin());

-- 8. SKILLS, TESTIMONIALS, SOCIAL LINKS & SETTINGS POLICIES
-- Public can view; admins manage all
DROP POLICY IF EXISTS "Public can view skills" ON public.skills;
CREATE POLICY "Public can view skills"
  ON public.skills FOR SELECT
  USING (true);

DROP POLICY IF EXISTS "Admins manage skills" ON public.skills;
CREATE POLICY "Admins manage skills"
  ON public.skills FOR ALL
  USING (public.is_admin())
  WITH CHECK (public.is_admin());

DROP POLICY IF EXISTS "Public can view testimonials" ON public.testimonials;
CREATE POLICY "Public can view testimonials"
  ON public.testimonials FOR SELECT
  USING (true);

DROP POLICY IF EXISTS "Admins manage testimonials" ON public.testimonials;
CREATE POLICY "Admins manage testimonials"
  ON public.testimonials FOR ALL
  USING (public.is_admin())
  WITH CHECK (public.is_admin());

DROP POLICY IF EXISTS "Public can view social links" ON public.social_links;
CREATE POLICY "Public can view social links"
  ON public.social_links FOR SELECT
  USING (true);

DROP POLICY IF EXISTS "Admins manage social links" ON public.social_links;
CREATE POLICY "Admins manage social links"
  ON public.social_links FOR ALL
  USING (public.is_admin())
  WITH CHECK (public.is_admin());

DROP POLICY IF EXISTS "Public can view site settings" ON public.site_settings;
CREATE POLICY "Public can view site settings"
  ON public.site_settings FOR SELECT
  USING (true);

DROP POLICY IF EXISTS "Admins manage site settings" ON public.site_settings;
CREATE POLICY "Admins manage site settings"
  ON public.site_settings FOR ALL
  USING (public.is_admin())
  WITH CHECK (public.is_admin());

DROP POLICY IF EXISTS "Public can view settings" ON public.settings;
CREATE POLICY "Public can view settings"
  ON public.settings FOR SELECT
  USING (true);

DROP POLICY IF EXISTS "Admins manage settings" ON public.settings;
CREATE POLICY "Admins manage settings"
  ON public.settings FOR ALL
  USING (public.is_admin())
  WITH CHECK (public.is_admin());
