-- Opium relevance scenario comparison
-- Compares the same candidate videos under two scoring modes:
-- 1) following_heavy: stronger boost for followed creators
-- 2) interest_heavy: stronger boost for interest/topic and affinity
--
-- Run in Supabase SQL editor as an authenticated user.

WITH viewer AS (
  SELECT auth.uid() AS user_id
),
events AS (
  SELECT
    ve.video_id,
    SUM(
      (
        CASE ve.event_type
          WHEN 'view_start' THEN 0.4
          WHEN 'view_3s' THEN 1.5
          WHEN 'view_complete' THEN 7
          WHEN 'like' THEN 8
          WHEN 'share' THEN 14
          WHEN 'follow' THEN 18
          WHEN 'hide' THEN -20
          WHEN 'report' THEN -28
          ELSE 0
        END
      )
      * GREATEST(0.2, 1 - ((ROW_NUMBER() OVER (ORDER BY ve.created_at DESC) - 1) * 0.0025))
    )::DOUBLE PRECISION AS affinity
  FROM public.video_events ve
  JOIN viewer vw ON vw.user_id IS NOT NULL AND ve.user_id = vw.user_id
  GROUP BY ve.video_id
),
followed AS (
  SELECT f.following_id AS user_id
  FROM public.follows f
  JOIN viewer vw ON vw.user_id IS NOT NULL AND f.follower_id = vw.user_id
),
interests AS (
  SELECT LOWER(UNNEST(COALESCE(p.interests, ARRAY[]::TEXT[]))) AS interest
  FROM public.profiles p
  JOIN viewer vw ON vw.user_id IS NOT NULL AND p.user_id = vw.user_id
),
safety AS (
  SELECT
    ARRAY(
      SELECT hv.video_id
      FROM public.hidden_videos hv
      JOIN viewer vw ON vw.user_id IS NOT NULL AND hv.user_id = vw.user_id
    ) AS hidden_video_ids,
    ARRAY(
      SELECT ub.blocked_user_id
      FROM public.user_blocks ub
      JOIN viewer vw ON vw.user_id IS NOT NULL AND ub.user_id = vw.user_id
    ) AS blocked_user_ids,
    ARRAY(
      SELECT um.muted_user_id
      FROM public.user_mutes um
      JOIN viewer vw ON vw.user_id IS NOT NULL AND um.user_id = vw.user_id
    ) AS muted_user_ids
),
candidate_videos AS (
  SELECT
    v.id AS video_id,
    v.user_id,
    v.created_at,
    v.description,
    v.music,
    COALESCE(v.likes_count, 0) AS likes_count,
    COALESCE(v.comments_count, 0) AS comments_count,
    COALESCE(v.shares_count, 0) AS shares_count,
    COALESCE(e.affinity, 0) AS affinity,
    CASE WHEN f.user_id IS NOT NULL THEN 1 ELSE 0 END AS is_followed_creator,
    (
      SELECT COUNT(*)::INT
      FROM interests i
      WHERE LOWER(COALESCE(v.description, '') || ' ' || COALESCE(v.music, '')) LIKE '%' || i.interest || '%'
    ) AS interest_matches,
    (22 / SQRT(GREATEST(1::DOUBLE PRECISION, EXTRACT(EPOCH FROM (NOW() - v.created_at)) / 3600::DOUBLE PRECISION)))::DOUBLE PRECISION AS recency_boost,
    ((COALESCE(v.likes_count, 0) * 1.1) + (COALESCE(v.comments_count, 0) * 1.6) + (COALESCE(v.shares_count, 0) * 2.2))::DOUBLE PRECISION AS popularity_score
  FROM public.videos v
  CROSS JOIN safety s
  LEFT JOIN events e ON e.video_id = v.id
  LEFT JOIN followed f ON f.user_id = v.user_id
  WHERE NOT (v.id = ANY(COALESCE(s.hidden_video_ids, ARRAY[]::UUID[])))
    AND NOT (v.user_id = ANY(COALESCE(s.blocked_user_ids, ARRAY[]::UUID[])))
    AND NOT (v.user_id = ANY(COALESCE(s.muted_user_ids, ARRAY[]::UUID[])))
),
following_heavy AS (
  SELECT
    'following_heavy'::TEXT AS scenario,
    cv.video_id,
    (
      cv.popularity_score
      + cv.recency_boost
      + (cv.affinity * 2.1)
      + (cv.is_followed_creator * 18)
      + (cv.interest_matches * 6)
    )::DOUBLE PRECISION AS score
  FROM candidate_videos cv
),
interest_heavy AS (
  SELECT
    'interest_heavy'::TEXT AS scenario,
    cv.video_id,
    (
      cv.popularity_score
      + cv.recency_boost
      + (cv.affinity * 3.2)
      + (cv.is_followed_creator * 6)
      + (cv.interest_matches * 16)
    )::DOUBLE PRECISION AS score
  FROM candidate_videos cv
),
combined AS (
  SELECT * FROM following_heavy
  UNION ALL
  SELECT * FROM interest_heavy
),
ranked AS (
  SELECT
    c.scenario,
    c.video_id,
    c.score,
    ROW_NUMBER() OVER (PARTITION BY c.scenario ORDER BY c.score DESC) AS rank
  FROM combined c
),
topn AS (
  SELECT *
  FROM ranked
  WHERE rank <= 20
),
pivoted AS (
  SELECT
    COALESCE(f.video_id, i.video_id) AS video_id,
    f.rank AS following_rank,
    f.score AS following_score,
    i.rank AS interest_rank,
    i.score AS interest_score
  FROM (SELECT * FROM topn WHERE scenario = 'following_heavy') f
  FULL OUTER JOIN (SELECT * FROM topn WHERE scenario = 'interest_heavy') i
    ON i.video_id = f.video_id
)
SELECT
  p.video_id,
  p.following_rank,
  ROUND(COALESCE(p.following_score, 0)::NUMERIC, 2) AS following_score,
  p.interest_rank,
  ROUND(COALESCE(p.interest_score, 0)::NUMERIC, 2) AS interest_score,
  CASE
    WHEN p.following_rank IS NULL THEN NULL
    WHEN p.interest_rank IS NULL THEN NULL
    ELSE (p.following_rank - p.interest_rank)
  END AS rank_shift_toward_interest,
  LEFT(COALESCE(v.description, ''), 80) AS sample_description,
  v.user_id,
  v.created_at
FROM pivoted p
JOIN public.videos v ON v.id = p.video_id
ORDER BY
  COALESCE(LEAST(p.following_rank, p.interest_rank), 999),
  p.video_id;
