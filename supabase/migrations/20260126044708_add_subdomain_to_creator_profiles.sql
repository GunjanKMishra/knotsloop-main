/*
  # Add Subdomain Field to Creator Profiles

  1. Changes
    - Add `subdomain` column to `creator_profiles` table
    - The subdomain will be used for the creator's custom URL (e.g., subdomain.knotloop.com)
    - Must be unique across all creators

  2. Security
    - No changes to RLS policies needed
*/

DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'creator_profiles' AND column_name = 'subdomain'
  ) THEN
    ALTER TABLE creator_profiles ADD COLUMN subdomain text UNIQUE;
  END IF;
END $$;