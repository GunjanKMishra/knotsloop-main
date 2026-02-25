/*
  # Create Waitlist Table

  1. New Tables
    - `waitlist`
      - `id` (uuid, primary key)
      - `email` (text, unique, not null)
      - `name` (text, not null)
      - `role` (text, not null) - Can be 'creator', 'student', or 'both'
      - `created_at` (timestamptz, default now())
  
  2. Security
    - Enable RLS on `waitlist` table
    - Add policy for public inserts (anyone can join waitlist)
    - Add policy for authenticated reads only (for admin dashboard later)
*/

CREATE TABLE IF NOT EXISTS waitlist (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  email text UNIQUE NOT NULL,
  name text NOT NULL,
  role text NOT NULL CHECK (role IN ('creator', 'student', 'both')),
  created_at timestamptz DEFAULT now()
);

ALTER TABLE waitlist ENABLE ROW LEVEL SECURITY;

-- Allow anyone to insert into waitlist (join the waitlist)
CREATE POLICY "Anyone can join waitlist"
  ON waitlist
  FOR INSERT
  TO anon
  WITH CHECK (true);

-- Only authenticated users can read waitlist (for future admin dashboard)
CREATE POLICY "Authenticated users can read waitlist"
  ON waitlist
  FOR SELECT
  TO authenticated
  USING (true);