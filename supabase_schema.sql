-- ==========================================================================
-- Gubat NHS SSLG Hub - Supabase Database Schema
-- Run this SQL in your Supabase SQL Editor:
-- https://supabase.com/dashboard/project/hytqudnepysviczrsmmf/sql
-- ==========================================================================

-- 1. PROJECTS TABLE
CREATE TABLE IF NOT EXISTS public.projects (
  id TEXT PRIMARY KEY,
  title TEXT NOT NULL,
  shortSummary TEXT,
  fullDescription TEXT,
  category TEXT,
  status TEXT DEFAULT 'Active',
  authors JSONB DEFAULT '[]'::jsonb,
  organization TEXT,
  datePublished DATE DEFAULT CURRENT_DATE,
  coverImage TEXT,
  galleryImages JSONB DEFAULT '[]'::jsonb,
  resources JSONB DEFAULT '[]'::jsonb,
  comments JSONB DEFAULT '[]'::jsonb,
  likes INT DEFAULT 0,
  reads INT DEFAULT 0,
  featured BOOLEAN DEFAULT false,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

ALTER TABLE public.projects ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Allow public read on projects" ON public.projects;
CREATE POLICY "Allow public read on projects" ON public.projects FOR SELECT USING (true);

DROP POLICY IF EXISTS "Allow public all on projects" ON public.projects;
CREATE POLICY "Allow public all on projects" ON public.projects FOR ALL USING (true);


-- 2. PUBLICATIONS TABLE
CREATE TABLE IF NOT EXISTS public.publications (
  id TEXT PRIMARY KEY,
  title TEXT NOT NULL,
  journal TEXT,
  year INT,
  doi TEXT,
  abstract TEXT,
  authors JSONB DEFAULT '[]'::jsonb,
  pdfUrl TEXT,
  citation TEXT,
  category TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

ALTER TABLE public.publications ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Allow public read on publications" ON public.publications;
CREATE POLICY "Allow public read on publications" ON public.publications FOR SELECT USING (true);

DROP POLICY IF EXISTS "Allow public all on publications" ON public.publications;
CREATE POLICY "Allow public all on publications" ON public.publications FOR ALL USING (true);


-- 3. GALLERY TABLE
CREATE TABLE IF NOT EXISTS public.gallery (
  id TEXT PRIMARY KEY,
  title TEXT NOT NULL,
  category TEXT,
  url TEXT NOT NULL,
  caption TEXT,
  date DATE DEFAULT CURRENT_DATE,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

ALTER TABLE public.gallery ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Allow public read on gallery" ON public.gallery;
CREATE POLICY "Allow public read on gallery" ON public.gallery FOR SELECT USING (true);

DROP POLICY IF EXISTS "Allow public all on gallery" ON public.gallery;
CREATE POLICY "Allow public all on gallery" ON public.gallery FOR ALL USING (true);


-- 4. FEEDBACK TABLE
CREATE TABLE IF NOT EXISTS public.feedback (
  id TEXT PRIMARY KEY DEFAULT gen_random_uuid()::text,
  category TEXT,
  rating INT,
  message TEXT,
  is_anonymous BOOLEAN DEFAULT true,
  student_id TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

ALTER TABLE public.feedback ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Allow public read on feedback" ON public.feedback;
CREATE POLICY "Allow public read on feedback" ON public.feedback FOR SELECT USING (true);

DROP POLICY IF EXISTS "Allow public insert on feedback" ON public.feedback;
CREATE POLICY "Allow public insert on feedback" ON public.feedback FOR INSERT WITH CHECK (true);


-- 5. TEAM TABLE
CREATE TABLE IF NOT EXISTS public.team (
  id TEXT PRIMARY KEY,
  name TEXT NOT NULL,
  role TEXT,
  avatar TEXT,
  bio TEXT,
  department TEXT,
  email TEXT,
  socials JSONB DEFAULT '{}'::jsonb,
  projectsCount INT DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

ALTER TABLE public.team ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Allow public read on team" ON public.team;
CREATE POLICY "Allow public read on team" ON public.team FOR SELECT USING (true);

DROP POLICY IF EXISTS "Allow public all on team" ON public.team;
CREATE POLICY "Allow public all on team" ON public.team FOR ALL USING (true);
