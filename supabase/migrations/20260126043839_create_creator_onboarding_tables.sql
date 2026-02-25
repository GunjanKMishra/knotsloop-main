/*
  # Creator Onboarding Tables

  1. New Tables
    - `creator_profiles`
      - `id` (uuid, primary key, references auth.users)
      - `name` (text)
      - `headline` (text)
      - `biography` (text)
      - `website` (text)
      - `linkedin` (text)
      - `photo_url` (text)
      - `user_type` (text) - 'creator' or 'student'
      - `onboarding_completed` (boolean, default false)
      - `created_at` (timestamptz)
      - `updated_at` (timestamptz)

    - `creator_channels`
      - `id` (uuid, primary key)
      - `creator_id` (uuid, references creator_profiles)
      - `channel_name` (text)
      - `channel_url` (text)
      - `channel_description` (text)
      - `channel_logo_url` (text)
      - `created_at` (timestamptz)
      - `updated_at` (timestamptz)

    - `content_tags`
      - `id` (uuid, primary key)
      - `creator_id` (uuid, references creator_profiles)
      - `domain` (text)
      - `section` (text)
      - `make_private` (boolean, default false)
      - `created_at` (timestamptz)

  2. Security
    - Enable RLS on all tables
    - Add policies for authenticated users to manage their own data
*/

-- Create creator_profiles table
CREATE TABLE IF NOT EXISTS creator_profiles (
  id uuid PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  name text,
  headline text,
  biography text,
  website text,
  linkedin text,
  photo_url text,
  user_type text DEFAULT 'creator',
  onboarding_completed boolean DEFAULT false,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

ALTER TABLE creator_profiles ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view own profile"
  ON creator_profiles FOR SELECT
  TO authenticated
  USING (auth.uid() = id);

CREATE POLICY "Users can insert own profile"
  ON creator_profiles FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = id);

CREATE POLICY "Users can update own profile"
  ON creator_profiles FOR UPDATE
  TO authenticated
  USING (auth.uid() = id)
  WITH CHECK (auth.uid() = id);

-- Create creator_channels table
CREATE TABLE IF NOT EXISTS creator_channels (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  creator_id uuid REFERENCES creator_profiles(id) ON DELETE CASCADE NOT NULL,
  channel_name text,
  channel_url text,
  channel_description text,
  channel_logo_url text,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

ALTER TABLE creator_channels ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view own channels"
  ON creator_channels FOR SELECT
  TO authenticated
  USING (creator_id = auth.uid());

CREATE POLICY "Users can insert own channels"
  ON creator_channels FOR INSERT
  TO authenticated
  WITH CHECK (creator_id = auth.uid());

CREATE POLICY "Users can update own channels"
  ON creator_channels FOR UPDATE
  TO authenticated
  USING (creator_id = auth.uid())
  WITH CHECK (creator_id = auth.uid());

CREATE POLICY "Users can delete own channels"
  ON creator_channels FOR DELETE
  TO authenticated
  USING (creator_id = auth.uid());

-- Create content_tags table
CREATE TABLE IF NOT EXISTS content_tags (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  creator_id uuid REFERENCES creator_profiles(id) ON DELETE CASCADE NOT NULL,
  domain text,
  section text,
  make_private boolean DEFAULT false,
  created_at timestamptz DEFAULT now()
);

ALTER TABLE content_tags ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view own tags"
  ON content_tags FOR SELECT
  TO authenticated
  USING (creator_id = auth.uid());

CREATE POLICY "Users can insert own tags"
  ON content_tags FOR INSERT
  TO authenticated
  WITH CHECK (creator_id = auth.uid());

CREATE POLICY "Users can update own tags"
  ON content_tags FOR UPDATE
  TO authenticated
  USING (creator_id = auth.uid())
  WITH CHECK (creator_id = auth.uid());

CREATE POLICY "Users can delete own tags"
  ON content_tags FOR DELETE
  TO authenticated
  USING (creator_id = auth.uid());