-- Follow recommendations RPC for social graph growth

CREATE OR REPLACE FUNCTION public.get_follow_recommendations(limit_count INTEGER DEFAULT 12)
RETURNS TABLE (
  user_id UUID,
  username TEXT,
  display_name TEXT,
  avatar_url TEXT,
  is_private BOOLEAN,
  is_verified BOOLEAN,
  score DOUBLE PRECISION
)
LANGUAGE sql
SECURITY INVOKER
SET search_path = public
AS $$
  WITH viewer AS (
    SELECT auth.uid() AS uid
  ),
  my_following AS (
    SELECT f.following_id
    FROM public.follows f
    JOIN viewer v ON v.uid IS NOT NULL AND f.follower_id = v.uid
  ),
  candidate_base AS (
    SELECT
      p.user_id,
      p.username,
      p.display_name,
      p.avatar_url,
      COALESCE(p.is_private, false) AS is_private,
      COALESCE(p.is_verified, false) AS is_verified,
      (
        SELECT COUNT(*)::DOUBLE PRECISION
        FROM public.follows ff
        WHERE ff.following_id = p.user_id
      ) AS follower_count,
      (
        SELECT COUNT(*)::DOUBLE PRECISION
        FROM public.videos vv
        WHERE vv.user_id = p.user_id
      ) AS video_count,
      (
        SELECT MAX(vv.created_at)
        FROM public.videos vv
        WHERE vv.user_id = p.user_id
      ) AS last_post_at
    FROM public.profiles p
    JOIN viewer v ON v.uid IS NOT NULL
    WHERE p.user_id <> v.uid
      AND NOT EXISTS (
        SELECT 1
        FROM my_following mf
        WHERE mf.following_id = p.user_id
      )
  ),
  mutuals AS (
    SELECT
      f2.following_id AS candidate_id,
      COUNT(*)::DOUBLE PRECISION AS mutual_count
    FROM public.follows f2
    JOIN my_following mf ON mf.following_id = f2.follower_id
    GROUP BY f2.following_id
  ),
  scored AS (
    SELECT
      cb.user_id,
      cb.username,
      cb.display_name,
      cb.avatar_url,
      cb.is_private,
      cb.is_verified,
      (
        COALESCE(m.mutual_count, 0) * 25
        + LEAST(COALESCE(cb.follower_count, 0), 5000) * 0.01
        + COALESCE(cb.video_count, 0) * 2
        + CASE
            WHEN cb.last_post_at >= NOW() - interval '7 days' THEN 8
            WHEN cb.last_post_at >= NOW() - interval '30 days' THEN 3
            ELSE 0
          END
        + CASE WHEN cb.is_verified THEN 4 ELSE 0 END
      )::DOUBLE PRECISION AS score
    FROM candidate_base cb
    LEFT JOIN mutuals m ON m.candidate_id = cb.user_id
  )
  SELECT
    s.user_id,
    s.username,
    s.display_name,
    s.avatar_url,
    s.is_private,
    s.is_verified,
    s.score
  FROM scored s
  ORDER BY s.score DESC, s.user_id
  LIMIT GREATEST(1, LEAST(COALESCE(limit_count, 12), 50));
$$;
