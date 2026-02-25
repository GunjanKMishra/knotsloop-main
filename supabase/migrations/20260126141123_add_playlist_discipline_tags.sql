/*
  # Add Discipline Tags to Playlists

  1. Changes to Existing Tables
    - Add `primary_discipline_id` to `playlists` table (uuid, foreign key to primary_disciplines)
    - Add `sub_discipline_id` to `playlists` table (uuid, foreign key to sub_disciplines)
    - Add `specific_topic` to `playlists` table (text) - for the most specific tag like "Wittgenstein"

  2. Notes
    - These fields create a hierarchical tagging system for each knot (playlist)
    - The hierarchy is: Primary Discipline → Sub Discipline → Specific Topic
    - Example: Philosophy → Analytic Philosophy → Wittgenstein
*/

-- Add discipline tag fields to playlists table
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'playlists' AND column_name = 'primary_discipline_id'
  ) THEN
    ALTER TABLE playlists ADD COLUMN primary_discipline_id uuid REFERENCES primary_disciplines(id);
  END IF;

  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'playlists' AND column_name = 'sub_discipline_id'
  ) THEN
    ALTER TABLE playlists ADD COLUMN sub_discipline_id uuid REFERENCES sub_disciplines(id);
  END IF;

  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'playlists' AND column_name = 'specific_topic'
  ) THEN
    ALTER TABLE playlists ADD COLUMN specific_topic text;
  END IF;
END $$;