-- Add function to increment story view count
CREATE OR REPLACE FUNCTION public.increment_story_view_count(story_id UUID)
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
BEGIN
  UPDATE public.stories
  SET view_count = view_count + 1
  WHERE id = story_id;
END;
$$;
