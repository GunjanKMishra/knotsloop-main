/*
  # Add YouTube Playlist Fields

  1. Changes to Existing Tables
    - Add `youtube_playlist_url` to `playlists` table (text)
    - Add `youtube_playlist_id` to `playlists` table (text)

  2. Notes
    - These fields store the YouTube playlist URL and extracted playlist ID
    - This allows creators to add entire YouTube playlists by URL
    - Individual videos from the playlist can be fetched later via YouTube API
*/

-- Add youtube playlist fields to playlists table
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'playlists' AND column_name = 'youtube_playlist_url'
  ) THEN
    ALTER TABLE playlists ADD COLUMN youtube_playlist_url text;
  END IF;

  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'playlists' AND column_name = 'youtube_playlist_id'
  ) THEN
    ALTER TABLE playlists ADD COLUMN youtube_playlist_id text;
  END IF;
END $$;