/*
  # Create Loops and Playlists Schema

  1. New Tables
    - `loops`
      - `id` (uuid, primary key)
      - `creator_profile_id` (uuid, foreign key to creator_profiles)
      - `title` (text)
      - `thumbnail_url` (text, nullable)
      - `status` (text, default 'draft') - 'draft' or 'published'
      - `order_index` (integer, for ordering loops)
      - `created_at` (timestamptz)
      - `updated_at` (timestamptz)
    
    - `playlists`
      - `id` (uuid, primary key)
      - `creator_profile_id` (uuid, foreign key to creator_profiles)
      - `title` (text)
      - `platform_id` (text, nullable) - YouTube playlist ID
      - `url` (text, nullable)
      - `created_at` (timestamptz)
      - `updated_at` (timestamptz)
    
    - `loop_playlists`
      - `id` (uuid, primary key)
      - `loop_id` (uuid, foreign key to loops)
      - `playlist_id` (uuid, foreign key to playlists)
      - `order_index` (integer, for ordering playlists within a loop)
      - `created_at` (timestamptz)
    
    - `playlist_videos`
      - `id` (uuid, primary key)
      - `playlist_id` (uuid, foreign key to playlists)
      - `title` (text)
      - `url` (text)
      - `video_id` (text, nullable) - YouTube video ID
      - `order_index` (integer, for ordering videos)
      - `created_at` (timestamptz)

  2. Security
    - Enable RLS on all tables
    - Add policies for creators to manage their own content
*/

-- Create loops table
CREATE TABLE IF NOT EXISTS loops (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  creator_profile_id uuid NOT NULL REFERENCES creator_profiles(id) ON DELETE CASCADE,
  title text NOT NULL DEFAULT '',
  thumbnail_url text,
  status text NOT NULL DEFAULT 'draft',
  order_index integer NOT NULL DEFAULT 0,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Create playlists table
CREATE TABLE IF NOT EXISTS playlists (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  creator_profile_id uuid NOT NULL REFERENCES creator_profiles(id) ON DELETE CASCADE,
  title text NOT NULL DEFAULT '',
  platform_id text,
  url text,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Create loop_playlists junction table
CREATE TABLE IF NOT EXISTS loop_playlists (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  loop_id uuid NOT NULL REFERENCES loops(id) ON DELETE CASCADE,
  playlist_id uuid NOT NULL REFERENCES playlists(id) ON DELETE CASCADE,
  order_index integer NOT NULL DEFAULT 0,
  created_at timestamptz DEFAULT now(),
  UNIQUE(loop_id, playlist_id)
);

-- Create playlist_videos table
CREATE TABLE IF NOT EXISTS playlist_videos (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  playlist_id uuid NOT NULL REFERENCES playlists(id) ON DELETE CASCADE,
  title text NOT NULL DEFAULT '',
  url text NOT NULL,
  video_id text,
  order_index integer NOT NULL DEFAULT 0,
  created_at timestamptz DEFAULT now()
);

-- Enable RLS
ALTER TABLE loops ENABLE ROW LEVEL SECURITY;
ALTER TABLE playlists ENABLE ROW LEVEL SECURITY;
ALTER TABLE loop_playlists ENABLE ROW LEVEL SECURITY;
ALTER TABLE playlist_videos ENABLE ROW LEVEL SECURITY;

-- RLS Policies for loops
CREATE POLICY "Creators can view own loops"
  ON loops FOR SELECT
  TO authenticated
  USING (creator_profile_id = auth.uid());

CREATE POLICY "Creators can insert own loops"
  ON loops FOR INSERT
  TO authenticated
  WITH CHECK (creator_profile_id = auth.uid());

CREATE POLICY "Creators can update own loops"
  ON loops FOR UPDATE
  TO authenticated
  USING (creator_profile_id = auth.uid())
  WITH CHECK (creator_profile_id = auth.uid());

CREATE POLICY "Creators can delete own loops"
  ON loops FOR DELETE
  TO authenticated
  USING (creator_profile_id = auth.uid());

-- RLS Policies for playlists
CREATE POLICY "Creators can view own playlists"
  ON playlists FOR SELECT
  TO authenticated
  USING (creator_profile_id = auth.uid());

CREATE POLICY "Creators can insert own playlists"
  ON playlists FOR INSERT
  TO authenticated
  WITH CHECK (creator_profile_id = auth.uid());

CREATE POLICY "Creators can update own playlists"
  ON playlists FOR UPDATE
  TO authenticated
  USING (creator_profile_id = auth.uid())
  WITH CHECK (creator_profile_id = auth.uid());

CREATE POLICY "Creators can delete own playlists"
  ON playlists FOR DELETE
  TO authenticated
  USING (creator_profile_id = auth.uid());

-- RLS Policies for loop_playlists
CREATE POLICY "Creators can view own loop playlists"
  ON loop_playlists FOR SELECT
  TO authenticated
  USING (
    loop_id IN (
      SELECT id FROM loops WHERE creator_profile_id = auth.uid()
    )
  );

CREATE POLICY "Creators can insert own loop playlists"
  ON loop_playlists FOR INSERT
  TO authenticated
  WITH CHECK (
    loop_id IN (
      SELECT id FROM loops WHERE creator_profile_id = auth.uid()
    )
  );

CREATE POLICY "Creators can update own loop playlists"
  ON loop_playlists FOR UPDATE
  TO authenticated
  USING (
    loop_id IN (
      SELECT id FROM loops WHERE creator_profile_id = auth.uid()
    )
  )
  WITH CHECK (
    loop_id IN (
      SELECT id FROM loops WHERE creator_profile_id = auth.uid()
    )
  );

CREATE POLICY "Creators can delete own loop playlists"
  ON loop_playlists FOR DELETE
  TO authenticated
  USING (
    loop_id IN (
      SELECT id FROM loops WHERE creator_profile_id = auth.uid()
    )
  );

-- RLS Policies for playlist_videos
CREATE POLICY "Creators can view own playlist videos"
  ON playlist_videos FOR SELECT
  TO authenticated
  USING (
    playlist_id IN (
      SELECT id FROM playlists WHERE creator_profile_id = auth.uid()
    )
  );

CREATE POLICY "Creators can insert own playlist videos"
  ON playlist_videos FOR INSERT
  TO authenticated
  WITH CHECK (
    playlist_id IN (
      SELECT id FROM playlists WHERE creator_profile_id = auth.uid()
    )
  );

CREATE POLICY "Creators can update own playlist videos"
  ON playlist_videos FOR UPDATE
  TO authenticated
  USING (
    playlist_id IN (
      SELECT id FROM playlists WHERE creator_profile_id = auth.uid()
    )
  )
  WITH CHECK (
    playlist_id IN (
      SELECT id FROM playlists WHERE creator_profile_id = auth.uid()
    )
  );

CREATE POLICY "Creators can delete own playlist videos"
  ON playlist_videos FOR DELETE
  TO authenticated
  USING (
    playlist_id IN (
      SELECT id FROM playlists WHERE creator_profile_id = auth.uid()
    )
  );

-- Create indexes for better query performance
CREATE INDEX IF NOT EXISTS idx_loops_creator_profile_id ON loops(creator_profile_id);
CREATE INDEX IF NOT EXISTS idx_playlists_creator_profile_id ON playlists(creator_profile_id);
CREATE INDEX IF NOT EXISTS idx_loop_playlists_loop_id ON loop_playlists(loop_id);
CREATE INDEX IF NOT EXISTS idx_loop_playlists_playlist_id ON loop_playlists(playlist_id);
CREATE INDEX IF NOT EXISTS idx_playlist_videos_playlist_id ON playlist_videos(playlist_id);