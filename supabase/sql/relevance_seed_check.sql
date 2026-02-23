-- Deterministic relevance check (fresh vs engaged) for current authenticated user.
-- Run in Supabase SQL editor while authenticated as a normal user.
-- This script rolls back by default so production data is not polluted.

BEGIN;

DO $$
DECLARE
  viewer_id UUID := auth.uid();
  v_recent UUID := gen_random_uuid();
  v_popular UUID := gen_random_uuid();
  v_interest UUID := gen_random_uuid();
BEGIN
  IF viewer_id IS NULL THEN
    RAISE EXCEPTION 'auth.uid() is null. Run this script in an authenticated SQL session.';
  END IF;

  INSERT INTO public.videos (
    id,
    user_id,
    video_url,
    thumbnail_url,
    description,
    music,
    likes_count,
    comments_count,
    shares_count,
    created_at
  ) VALUES
    (
      v_recent,
      viewer_id,
      'https://example.com/relevance/recent.mp4',
      'https://example.com/relevance/recent.jpg',
      'fresh upload with low engagement',
      'ambient',
      1,
      0,
      0,
      now() - interval '2 hours'
    ),
    (
      v_popular,
      viewer_id,
      'https://example.com/relevance/popular.mp4',
      'https://example.com/relevance/popular.jpg',
      'older but high engagement post',
      'bass',
      120,
      35,
      18,
      now() - interval '5 days'
    ),
    (
      v_interest,
      viewer_id,
      'https://example.com/relevance/interest.mp4',
      'https://example.com/relevance/interest.jpg',
      'fitness dance routine for cardio',
      'dance fit',
      20,
      8,
      6,
      now() - interval '18 hours'
    );

  RAISE NOTICE 'Seeded videos: recent=%, popular=%, interest=%', v_recent, v_popular, v_interest;

  RAISE NOTICE 'Step 1 ready: Fresh ranking (no video_events yet).';
  RAISE NOTICE 'Step 2 ready: After fresh snapshot, engagement events will be added.';
END;
$$;

-- Fresh snapshot
SELECT
  'fresh' AS snapshot,
  ranked.video_id,
  ranked.score,
  v.description,
  v.created_at
FROM public.get_for_you_video_ids(20) ranked
JOIN public.videos v ON v.id = ranked.video_id
WHERE v.video_url LIKE 'https://example.com/relevance/%'
ORDER BY ranked.score DESC;

-- Add engagement events after fresh snapshot
INSERT INTO public.video_events (user_id, video_id, event_type, created_at)
SELECT auth.uid(), v.id, 'view_complete', now() - interval '4 minutes'
FROM public.videos v
WHERE v.video_url = 'https://example.com/relevance/interest.mp4';

INSERT INTO public.video_events (user_id, video_id, event_type, created_at)
SELECT auth.uid(), v.id, 'like', now() - interval '3 minutes'
FROM public.videos v
WHERE v.video_url = 'https://example.com/relevance/interest.mp4';

INSERT INTO public.video_events (user_id, video_id, event_type, created_at)
SELECT auth.uid(), v.id, 'share', now() - interval '2 minutes'
FROM public.videos v
WHERE v.video_url = 'https://example.com/relevance/interest.mp4';

-- Engaged snapshot
SELECT
  'engaged' AS snapshot,
  ranked.video_id,
  ranked.score,
  v.description,
  v.created_at
FROM public.get_for_you_video_ids(20) ranked
JOIN public.videos v ON v.id = ranked.video_id
WHERE v.video_url LIKE 'https://example.com/relevance/%'
ORDER BY ranked.score DESC;

-- Keep this rollback for safe dry-runs. Remove it if you want to keep seeded rows.
ROLLBACK;
