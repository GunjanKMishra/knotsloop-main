/*
  # Seed Disciplines Reference Data

  1. Insert Major Branches
    - Humanities
    - Social Sciences
    - Natural Sciences
    - Formal Sciences
    - Applied Sciences

  2. Insert Primary Disciplines (21 total)
    - Arts, History, Languages & Literature, Philosophy, Religion (Humanities)
    - Anthropology, Economics, Geography, Political Science, Psychology, Sociology (Social Sciences)
    - Physical Sciences, Life Sciences (Natural Sciences)
    - Mathematics, Computer Science, Logic (Formal Sciences)
    - Engineering, Medicine & Health, Business, Education, Law (Applied Sciences)

  3. Notes
    - This data is platform-managed reference data
    - Sub-disciplines will be added in a future migration due to volume
*/

-- Insert Major Branches
INSERT INTO major_branches (name, description) VALUES
  ('Humanities', 'Studies of human culture, including arts, literature, philosophy, and history'),
  ('Social Sciences', 'Scientific study of human society and social relationships'),
  ('Natural Sciences', 'Sciences concerned with the physical world and its phenomena'),
  ('Formal Sciences', 'Sciences concerned with formal systems and abstract concepts'),
  ('Applied Sciences', 'Sciences that apply existing scientific knowledge to practical applications')
ON CONFLICT (name) DO NOTHING;

-- Insert Primary Disciplines for Humanities
INSERT INTO primary_disciplines (name, major_branch_id, description)
SELECT 'Arts', id, 'Fine arts, performing arts, applied arts, and industrial design'
FROM major_branches WHERE name = 'Humanities'
ON CONFLICT (name, major_branch_id) DO NOTHING;

INSERT INTO primary_disciplines (name, major_branch_id, description)
SELECT 'History', id, 'Study of past events, particularly in human affairs'
FROM major_branches WHERE name = 'Humanities'
ON CONFLICT (name, major_branch_id) DO NOTHING;

INSERT INTO primary_disciplines (name, major_branch_id, description)
SELECT 'Languages & Literature', id, 'Study of languages, linguistics, and literary works'
FROM major_branches WHERE name = 'Humanities'
ON CONFLICT (name, major_branch_id) DO NOTHING;

INSERT INTO primary_disciplines (name, major_branch_id, description)
SELECT 'Philosophy', id, 'Study of fundamental questions about existence, knowledge, and ethics'
FROM major_branches WHERE name = 'Humanities'
ON CONFLICT (name, major_branch_id) DO NOTHING;

INSERT INTO primary_disciplines (name, major_branch_id, description)
SELECT 'Religion', id, 'Study of religious beliefs, practices, and institutions'
FROM major_branches WHERE name = 'Humanities'
ON CONFLICT (name, major_branch_id) DO NOTHING;

-- Insert Primary Disciplines for Social Sciences
INSERT INTO primary_disciplines (name, major_branch_id, description)
SELECT 'Anthropology', id, 'Study of human societies, cultures, and development'
FROM major_branches WHERE name = 'Social Sciences'
ON CONFLICT (name, major_branch_id) DO NOTHING;

INSERT INTO primary_disciplines (name, major_branch_id, description)
SELECT 'Economics', id, 'Study of production, distribution, and consumption of goods and services'
FROM major_branches WHERE name = 'Social Sciences'
ON CONFLICT (name, major_branch_id) DO NOTHING;

INSERT INTO primary_disciplines (name, major_branch_id, description)
SELECT 'Geography', id, 'Study of places and relationships between people and their environments'
FROM major_branches WHERE name = 'Social Sciences'
ON CONFLICT (name, major_branch_id) DO NOTHING;

INSERT INTO primary_disciplines (name, major_branch_id, description)
SELECT 'Political Science', id, 'Study of politics, government systems, and political behavior'
FROM major_branches WHERE name = 'Social Sciences'
ON CONFLICT (name, major_branch_id) DO NOTHING;

INSERT INTO primary_disciplines (name, major_branch_id, description)
SELECT 'Psychology', id, 'Scientific study of mind and behavior'
FROM major_branches WHERE name = 'Social Sciences'
ON CONFLICT (name, major_branch_id) DO NOTHING;

INSERT INTO primary_disciplines (name, major_branch_id, description)
SELECT 'Sociology', id, 'Study of social behavior, society, and social relationships'
FROM major_branches WHERE name = 'Social Sciences'
ON CONFLICT (name, major_branch_id) DO NOTHING;

-- Insert Primary Disciplines for Natural Sciences
INSERT INTO primary_disciplines (name, major_branch_id, description)
SELECT 'Physical Sciences', id, 'Study of non-living systems including physics, chemistry, and astronomy'
FROM major_branches WHERE name = 'Natural Sciences'
ON CONFLICT (name, major_branch_id) DO NOTHING;

INSERT INTO primary_disciplines (name, major_branch_id, description)
SELECT 'Life Sciences', id, 'Study of living organisms including biology, botany, and zoology'
FROM major_branches WHERE name = 'Natural Sciences'
ON CONFLICT (name, major_branch_id) DO NOTHING;

-- Insert Primary Disciplines for Formal Sciences
INSERT INTO primary_disciplines (name, major_branch_id, description)
SELECT 'Mathematics', id, 'Study of numbers, quantities, shapes, and patterns'
FROM major_branches WHERE name = 'Formal Sciences'
ON CONFLICT (name, major_branch_id) DO NOTHING;

INSERT INTO primary_disciplines (name, major_branch_id, description)
SELECT 'Computer Science', id, 'Study of computation, information, and automation'
FROM major_branches WHERE name = 'Formal Sciences'
ON CONFLICT (name, major_branch_id) DO NOTHING;

INSERT INTO primary_disciplines (name, major_branch_id, description)
SELECT 'Logic', id, 'Study of valid reasoning and argumentation'
FROM major_branches WHERE name = 'Formal Sciences'
ON CONFLICT (name, major_branch_id) DO NOTHING;

-- Insert Primary Disciplines for Applied Sciences
INSERT INTO primary_disciplines (name, major_branch_id, description)
SELECT 'Engineering', id, 'Application of science and mathematics to solve practical problems'
FROM major_branches WHERE name = 'Applied Sciences'
ON CONFLICT (name, major_branch_id) DO NOTHING;

INSERT INTO primary_disciplines (name, major_branch_id, description)
SELECT 'Medicine & Health', id, 'Science and practice of diagnosing, treating, and preventing disease'
FROM major_branches WHERE name = 'Applied Sciences'
ON CONFLICT (name, major_branch_id) DO NOTHING;

INSERT INTO primary_disciplines (name, major_branch_id, description)
SELECT 'Business', id, 'Study of commerce, management, and organizational operations'
FROM major_branches WHERE name = 'Applied Sciences'
ON CONFLICT (name, major_branch_id) DO NOTHING;

INSERT INTO primary_disciplines (name, major_branch_id, description)
SELECT 'Education', id, 'Study of teaching, learning, and educational systems'
FROM major_branches WHERE name = 'Applied Sciences'
ON CONFLICT (name, major_branch_id) DO NOTHING;

INSERT INTO primary_disciplines (name, major_branch_id, description)
SELECT 'Law', id, 'System of rules and regulations enforced through institutions'
FROM major_branches WHERE name = 'Applied Sciences'
ON CONFLICT (name, major_branch_id) DO NOTHING;