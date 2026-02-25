/*
  # Add Philosophy Subdisciplines

  1. New Data
    - Adds subdisciplines under Philosophy primary discipline
    - Categories: Metaphysics, Epistemology, Ethics, Logic, Aesthetics
    - Each category has specific subdisciplines

  2. Subdisciplines Added
    - Metaphysics: Ontology, Philosophy of mind, Philosophy of pain, AI, Perception, Space/time, Teleology, Determinism & Free will, Action
    - Epistemology: Justification, Reasoning errors
    - Ethics: Meta-ethics, Normative ethics, Virtue ethics, Moral psychology, Value theory
    - Logic: Mathematical logic, Philosophical logic
    - Aesthetics: Philosophy of art, Philosophy of music
*/

-- Get Philosophy primary discipline ID
DO $$
DECLARE
  philosophy_id uuid;
BEGIN
  SELECT id INTO philosophy_id FROM primary_disciplines WHERE name = 'Philosophy';
  
  IF philosophy_id IS NOT NULL THEN
    -- Metaphysics subdisciplines
    INSERT INTO sub_disciplines (name, primary_discipline_id, description) VALUES
    ('Ontology', philosophy_id, 'Metaphysics'),
    ('Philosophy of mind', philosophy_id, 'Metaphysics'),
    ('Philosophy of pain', philosophy_id, 'Metaphysics'),
    ('AI', philosophy_id, 'Metaphysics'),
    ('Perception', philosophy_id, 'Metaphysics'),
    ('Space/time', philosophy_id, 'Metaphysics'),
    ('Teleology', philosophy_id, 'Metaphysics'),
    ('Determinism & Free will', philosophy_id, 'Metaphysics'),
    ('Action', philosophy_id, 'Metaphysics')
    ON CONFLICT DO NOTHING;

    -- Epistemology subdisciplines
    INSERT INTO sub_disciplines (name, primary_discipline_id, description) VALUES
    ('Justification', philosophy_id, 'Epistemology'),
    ('Reasoning errors', philosophy_id, 'Epistemology')
    ON CONFLICT DO NOTHING;

    -- Ethics subdisciplines
    INSERT INTO sub_disciplines (name, primary_discipline_id, description) VALUES
    ('Meta-ethics', philosophy_id, 'Ethics'),
    ('Normative ethics', philosophy_id, 'Ethics'),
    ('Virtue ethics', philosophy_id, 'Ethics'),
    ('Moral psychology', philosophy_id, 'Ethics'),
    ('Value theory', philosophy_id, 'Ethics')
    ON CONFLICT DO NOTHING;

    -- Logic subdisciplines
    INSERT INTO sub_disciplines (name, primary_discipline_id, description) VALUES
    ('Mathematical logic', philosophy_id, 'Logic'),
    ('Philosophical logic', philosophy_id, 'Logic')
    ON CONFLICT DO NOTHING;

    -- Aesthetics subdisciplines
    INSERT INTO sub_disciplines (name, primary_discipline_id, description) VALUES
    ('Philosophy of art', philosophy_id, 'Aesthetics'),
    ('Philosophy of music', philosophy_id, 'Aesthetics')
    ON CONFLICT DO NOTHING;
  END IF;
END $$;