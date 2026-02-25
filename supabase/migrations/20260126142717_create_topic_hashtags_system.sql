/*
  # Create Topic Hashtags System

  1. New Tables
    - `topic_hashtags`
      - `id` (uuid, primary key)
      - `playlist_id` (uuid, foreign key to playlists)
      - `hashtag` (text, the hashtag without #)
      - `created_at` (timestamp)
    
    - `suggested_hashtags`
      - `id` (uuid, primary key)
      - `hashtag` (text, system suggested hashtag)
      - `sub_discipline_id` (uuid, foreign key to sub_disciplines, nullable)
      - `usage_count` (integer, tracks popularity)
      - `created_at` (timestamp)

  2. Security
    - Enable RLS on both tables
    - Add policies for authenticated users

  3. Indexes
    - Index on playlist_id for fast lookup
    - Index on hashtag for searching
    - Index on sub_discipline_id for suggestions
*/

-- Create topic_hashtags table
CREATE TABLE IF NOT EXISTS topic_hashtags (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  playlist_id uuid REFERENCES playlists(id) ON DELETE CASCADE NOT NULL,
  hashtag text NOT NULL,
  created_at timestamptz DEFAULT now()
);

-- Create suggested_hashtags table
CREATE TABLE IF NOT EXISTS suggested_hashtags (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  hashtag text UNIQUE NOT NULL,
  sub_discipline_id uuid REFERENCES sub_disciplines(id) ON DELETE SET NULL,
  usage_count integer DEFAULT 0,
  created_at timestamptz DEFAULT now()
);

-- Enable RLS
ALTER TABLE topic_hashtags ENABLE ROW LEVEL SECURITY;
ALTER TABLE suggested_hashtags ENABLE ROW LEVEL SECURITY;

-- Policies for topic_hashtags
CREATE POLICY "Users can view topic hashtags for their playlists"
  ON topic_hashtags FOR SELECT
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM playlists
      WHERE playlists.id = topic_hashtags.playlist_id
      AND playlists.creator_profile_id = auth.uid()
    )
  );

CREATE POLICY "Users can insert topic hashtags for their playlists"
  ON topic_hashtags FOR INSERT
  TO authenticated
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM playlists
      WHERE playlists.id = topic_hashtags.playlist_id
      AND playlists.creator_profile_id = auth.uid()
    )
  );

CREATE POLICY "Users can delete topic hashtags for their playlists"
  ON topic_hashtags FOR DELETE
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM playlists
      WHERE playlists.id = topic_hashtags.playlist_id
      AND playlists.creator_profile_id = auth.uid()
    )
  );

-- Policies for suggested_hashtags (read-only for users)
CREATE POLICY "Anyone can view suggested hashtags"
  ON suggested_hashtags FOR SELECT
  TO authenticated
  USING (true);

-- Indexes
CREATE INDEX IF NOT EXISTS idx_topic_hashtags_playlist_id ON topic_hashtags(playlist_id);
CREATE INDEX IF NOT EXISTS idx_topic_hashtags_hashtag ON topic_hashtags(hashtag);
CREATE INDEX IF NOT EXISTS idx_suggested_hashtags_sub_discipline ON suggested_hashtags(sub_discipline_id);
CREATE INDEX IF NOT EXISTS idx_suggested_hashtags_usage_count ON suggested_hashtags(usage_count DESC);

-- Seed some system suggested hashtags for Philosophy subdisciplines
DO $$
DECLARE
  metaphysics_ids uuid[];
  epistemology_ids uuid[];
  ethics_ids uuid[];
  logic_ids uuid[];
  aesthetics_ids uuid[];
BEGIN
  -- Get subdiscipline IDs
  SELECT array_agg(id) INTO metaphysics_ids FROM sub_disciplines WHERE description = 'Metaphysics';
  SELECT array_agg(id) INTO epistemology_ids FROM sub_disciplines WHERE description = 'Epistemology';
  SELECT array_agg(id) INTO ethics_ids FROM sub_disciplines WHERE description = 'Ethics';
  SELECT array_agg(id) INTO logic_ids FROM sub_disciplines WHERE description = 'Logic';
  SELECT array_agg(id) INTO aesthetics_ids FROM sub_disciplines WHERE description = 'Aesthetics';

  -- Metaphysics hashtags
  INSERT INTO suggested_hashtags (hashtag, sub_discipline_id, usage_count) VALUES
  ('Wittgenstein', (SELECT id FROM sub_disciplines WHERE name = 'Philosophy of mind' LIMIT 1), 0),
  ('consciousness', (SELECT id FROM sub_disciplines WHERE name = 'Philosophy of mind' LIMIT 1), 0),
  ('dualism', (SELECT id FROM sub_disciplines WHERE name = 'Philosophy of mind' LIMIT 1), 0),
  ('being', (SELECT id FROM sub_disciplines WHERE name = 'Ontology' LIMIT 1), 0),
  ('existence', (SELECT id FROM sub_disciplines WHERE name = 'Ontology' LIMIT 1), 0),
  ('categories', (SELECT id FROM sub_disciplines WHERE name = 'Ontology' LIMIT 1), 0),
  ('qualia', (SELECT id FROM sub_disciplines WHERE name = 'Philosophy of pain' LIMIT 1), 0),
  ('suffering', (SELECT id FROM sub_disciplines WHERE name = 'Philosophy of pain' LIMIT 1), 0),
  ('machine-learning', (SELECT id FROM sub_disciplines WHERE name = 'AI' LIMIT 1), 0),
  ('artificial-consciousness', (SELECT id FROM sub_disciplines WHERE name = 'AI' LIMIT 1), 0),
  ('sensory-experience', (SELECT id FROM sub_disciplines WHERE name = 'Perception' LIMIT 1), 0),
  ('illusion', (SELECT id FROM sub_disciplines WHERE name = 'Perception' LIMIT 1), 0),
  ('relativity', (SELECT id FROM sub_disciplines WHERE name = 'Space/time' LIMIT 1), 0),
  ('causation', (SELECT id FROM sub_disciplines WHERE name = 'Space/time' LIMIT 1), 0),
  ('purpose', (SELECT id FROM sub_disciplines WHERE name = 'Teleology' LIMIT 1), 0),
  ('design', (SELECT id FROM sub_disciplines WHERE name = 'Teleology' LIMIT 1), 0),
  ('free-will', (SELECT id FROM sub_disciplines WHERE name = 'Determinism & Free will' LIMIT 1), 0),
  ('compatibilism', (SELECT id FROM sub_disciplines WHERE name = 'Determinism & Free will' LIMIT 1), 0),
  ('agency', (SELECT id FROM sub_disciplines WHERE name = 'Action' LIMIT 1), 0),
  ('intention', (SELECT id FROM sub_disciplines WHERE name = 'Action' LIMIT 1), 0)
  ON CONFLICT (hashtag) DO NOTHING;

  -- Epistemology hashtags
  INSERT INTO suggested_hashtags (hashtag, sub_discipline_id, usage_count) VALUES
  ('knowledge', (SELECT id FROM sub_disciplines WHERE name = 'Justification' LIMIT 1), 0),
  ('belief', (SELECT id FROM sub_disciplines WHERE name = 'Justification' LIMIT 1), 0),
  ('truth', (SELECT id FROM sub_disciplines WHERE name = 'Justification' LIMIT 1), 0),
  ('fallacies', (SELECT id FROM sub_disciplines WHERE name = 'Reasoning errors' LIMIT 1), 0),
  ('cognitive-bias', (SELECT id FROM sub_disciplines WHERE name = 'Reasoning errors' LIMIT 1), 0),
  ('logic-errors', (SELECT id FROM sub_disciplines WHERE name = 'Reasoning errors' LIMIT 1), 0)
  ON CONFLICT (hashtag) DO NOTHING;

  -- Ethics hashtags
  INSERT INTO suggested_hashtags (hashtag, sub_discipline_id, usage_count) VALUES
  ('moral-realism', (SELECT id FROM sub_disciplines WHERE name = 'Meta-ethics' LIMIT 1), 0),
  ('moral-relativism', (SELECT id FROM sub_disciplines WHERE name = 'Meta-ethics' LIMIT 1), 0),
  ('utilitarianism', (SELECT id FROM sub_disciplines WHERE name = 'Normative ethics' LIMIT 1), 0),
  ('deontology', (SELECT id FROM sub_disciplines WHERE name = 'Normative ethics' LIMIT 1), 0),
  ('Kant', (SELECT id FROM sub_disciplines WHERE name = 'Normative ethics' LIMIT 1), 0),
  ('Aristotle', (SELECT id FROM sub_disciplines WHERE name = 'Virtue ethics' LIMIT 1), 0),
  ('character', (SELECT id FROM sub_disciplines WHERE name = 'Virtue ethics' LIMIT 1), 0),
  ('emotions', (SELECT id FROM sub_disciplines WHERE name = 'Moral psychology' LIMIT 1), 0),
  ('moral-motivation', (SELECT id FROM sub_disciplines WHERE name = 'Moral psychology' LIMIT 1), 0),
  ('well-being', (SELECT id FROM sub_disciplines WHERE name = 'Value theory' LIMIT 1), 0),
  ('good-life', (SELECT id FROM sub_disciplines WHERE name = 'Value theory' LIMIT 1), 0)
  ON CONFLICT (hashtag) DO NOTHING;

  -- Logic hashtags
  INSERT INTO suggested_hashtags (hashtag, sub_discipline_id, usage_count) VALUES
  ('set-theory', (SELECT id FROM sub_disciplines WHERE name = 'Mathematical logic' LIMIT 1), 0),
  ('proof-theory', (SELECT id FROM sub_disciplines WHERE name = 'Mathematical logic' LIMIT 1), 0),
  ('modal-logic', (SELECT id FROM sub_disciplines WHERE name = 'Philosophical logic' LIMIT 1), 0),
  ('possible-worlds', (SELECT id FROM sub_disciplines WHERE name = 'Philosophical logic' LIMIT 1), 0)
  ON CONFLICT (hashtag) DO NOTHING;

  -- Aesthetics hashtags
  INSERT INTO suggested_hashtags (hashtag, sub_discipline_id, usage_count) VALUES
  ('beauty', (SELECT id FROM sub_disciplines WHERE name = 'Philosophy of art' LIMIT 1), 0),
  ('representation', (SELECT id FROM sub_disciplines WHERE name = 'Philosophy of art' LIMIT 1), 0),
  ('expression', (SELECT id FROM sub_disciplines WHERE name = 'Philosophy of music' LIMIT 1), 0),
  ('emotion-in-music', (SELECT id FROM sub_disciplines WHERE name = 'Philosophy of music' LIMIT 1), 0)
  ON CONFLICT (hashtag) DO NOTHING;
END $$;