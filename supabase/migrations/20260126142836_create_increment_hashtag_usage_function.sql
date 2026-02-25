/*
  # Create function to increment hashtag usage

  1. New Function
    - `increment_hashtag_usage` - Increments usage count for suggested hashtags
    - Only increments if hashtag exists in suggested_hashtags table
    - Safe to call even if hashtag doesn't exist
*/

CREATE OR REPLACE FUNCTION increment_hashtag_usage(hashtag_name text)
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
BEGIN
  UPDATE suggested_hashtags
  SET usage_count = usage_count + 1
  WHERE hashtag = hashtag_name;
END;
$$;