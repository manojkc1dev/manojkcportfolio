-- ==============================================================================
-- Supabase Migration: 004_settings.sql
-- Singleton Settings Table for Global Entity, SEO, and System Configurations
-- ==============================================================================

CREATE TABLE IF NOT EXISTS public.settings (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  key TEXT UNIQUE NOT NULL,
  value JSONB NOT NULL DEFAULT '{}'::jsonb,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Enable RLS
ALTER TABLE public.settings ENABLE ROW LEVEL SECURITY;

-- Public can read settings
DROP POLICY IF EXISTS "Allow public read on settings" ON public.settings;
CREATE POLICY "Allow public read on settings"
  ON public.settings FOR SELECT
  USING (true);

-- Admins can insert, update, delete
DROP POLICY IF EXISTS "Allow admins full access on settings" ON public.settings;
CREATE POLICY "Allow admins full access on settings"
  ON public.settings FOR ALL
  USING (public.is_admin())
  WITH CHECK (public.is_admin());
