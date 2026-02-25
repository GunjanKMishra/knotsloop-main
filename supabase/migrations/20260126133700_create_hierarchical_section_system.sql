/*
  # Create Hierarchical Section System

  1. New Tables
    - `major_branches`
      - `id` (uuid, primary key)
      - `name` (text) - Humanities, Social Sciences, Natural Sciences, Formal Sciences, Applied Sciences
      - `description` (text)
      - `created_at` (timestamp)
    
    - `primary_disciplines`
      - `id` (uuid, primary key)
      - `name` (text) - Arts, History, Philosophy, Psychology, etc. (21 disciplines)
      - `major_branch_id` (uuid, foreign key)
      - `description` (text)
      - `created_at` (timestamp)
    
    - `sub_disciplines`
      - `id` (uuid, primary key)
      - `name` (text) - Fine arts, Ethics, Cognitive Psychology, etc.
      - `primary_discipline_id` (uuid, foreign key)
      - `description` (text)
      - `details` (jsonb) - Additional structured information
      - `created_at` (timestamp)
    
    - `creator_disciplines`
      - `id` (uuid, primary key)
      - `creator_id` (uuid, foreign key to creator_profiles)
      - `primary_discipline_id` (uuid, foreign key to primary_disciplines)
      - `is_platform_assigned` (boolean) - true if auto-assigned by platform
      - `display_order` (integer)
      - `created_at` (timestamp)
    
    - `content_domains`
      - `id` (uuid, primary key)
      - `creator_id` (uuid, foreign key to creator_profiles)
      - `domain_type` (text) - Tutorial, Lectures, Workshops, Case Studies, Demonstration, Readings, Reviews
      - `created_at` (timestamp)

  2. Changes to Existing Tables
    - Add `major_branch_id` to `creator_profiles`
    - Add `sub_discipline_id` and `subject_name` to `loops`

  3. Security
    - Enable RLS on all new tables
    - Add policies for authenticated creators

  4. Notes
    - Major Branch is platform-assigned (read-only for creators)
    - Primary Disciplines (Sections) are auto-filled but can be managed
    - Content Domains are editable by creators
    - Sub-disciplines are assigned to individual loops
*/

-- Create major_branches table
CREATE TABLE IF NOT EXISTS major_branches (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL UNIQUE,
  description text,
  created_at timestamptz DEFAULT now()
);

ALTER TABLE major_branches ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Major branches are viewable by everyone"
  ON major_branches FOR SELECT
  TO authenticated
  USING (true);

-- Create primary_disciplines table
CREATE TABLE IF NOT EXISTS primary_disciplines (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  major_branch_id uuid REFERENCES major_branches(id) ON DELETE CASCADE,
  description text,
  created_at timestamptz DEFAULT now(),
  UNIQUE(name, major_branch_id)
);

ALTER TABLE primary_disciplines ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Primary disciplines are viewable by everyone"
  ON primary_disciplines FOR SELECT
  TO authenticated
  USING (true);

-- Create sub_disciplines table
CREATE TABLE IF NOT EXISTS sub_disciplines (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  primary_discipline_id uuid REFERENCES primary_disciplines(id) ON DELETE CASCADE,
  description text,
  details jsonb DEFAULT '{}'::jsonb,
  created_at timestamptz DEFAULT now()
);

ALTER TABLE sub_disciplines ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Sub-disciplines are viewable by everyone"
  ON sub_disciplines FOR SELECT
  TO authenticated
  USING (true);

-- Create creator_disciplines table
CREATE TABLE IF NOT EXISTS creator_disciplines (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  creator_id uuid REFERENCES creator_profiles(id) ON DELETE CASCADE NOT NULL,
  primary_discipline_id uuid REFERENCES primary_disciplines(id) ON DELETE CASCADE NOT NULL,
  is_platform_assigned boolean DEFAULT false,
  display_order integer DEFAULT 0,
  created_at timestamptz DEFAULT now(),
  UNIQUE(creator_id, primary_discipline_id)
);

ALTER TABLE creator_disciplines ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Creators can view own disciplines"
  ON creator_disciplines FOR SELECT
  TO authenticated
  USING (auth.uid() = creator_id);

CREATE POLICY "Creators can insert own disciplines"
  ON creator_disciplines FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = creator_id);

CREATE POLICY "Creators can update own disciplines"
  ON creator_disciplines FOR UPDATE
  TO authenticated
  USING (auth.uid() = creator_id)
  WITH CHECK (auth.uid() = creator_id);

CREATE POLICY "Creators can delete own disciplines"
  ON creator_disciplines FOR DELETE
  TO authenticated
  USING (auth.uid() = creator_id);

-- Create content_domains table
CREATE TABLE IF NOT EXISTS content_domains (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  creator_id uuid REFERENCES creator_profiles(id) ON DELETE CASCADE NOT NULL,
  domain_type text NOT NULL CHECK (domain_type IN ('Tutorial', 'Lectures', 'Workshops', 'Case Studies', 'Demonstration', 'Readings', 'Reviews')),
  created_at timestamptz DEFAULT now(),
  UNIQUE(creator_id, domain_type)
);

ALTER TABLE content_domains ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Creators can view own content domains"
  ON content_domains FOR SELECT
  TO authenticated
  USING (auth.uid() = creator_id);

CREATE POLICY "Creators can insert own content domains"
  ON content_domains FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = creator_id);

CREATE POLICY "Creators can delete own content domains"
  ON content_domains FOR DELETE
  TO authenticated
  USING (auth.uid() = creator_id);

-- Add major_branch_id to creator_profiles if not exists
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'creator_profiles' AND column_name = 'major_branch_id'
  ) THEN
    ALTER TABLE creator_profiles ADD COLUMN major_branch_id uuid REFERENCES major_branches(id);
  END IF;
END $$;

-- Add sub_discipline_id and subject_name to loops if not exists
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'loops' AND column_name = 'sub_discipline_id'
  ) THEN
    ALTER TABLE loops ADD COLUMN sub_discipline_id uuid REFERENCES sub_disciplines(id);
  END IF;

  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'loops' AND column_name = 'subject_name'
  ) THEN
    ALTER TABLE loops ADD COLUMN subject_name text;
  END IF;
END $$;