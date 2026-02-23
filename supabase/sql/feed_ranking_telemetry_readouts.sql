-- Feed ranking telemetry readouts
-- Use this after migration 20260222183000_feed_ranking_telemetry.sql is deployed.
--
-- Run in Supabase SQL editor:
-- - As authenticated user: queries are scoped to auth.uid() by RLS.
-- - As service role/admin: you can comment in broader filters if needed.

-- =============================================================
-- 1) Daily score distribution (last 14 days)
-- =============================================================
SELECT
  date_trunc('day', frt.created_at)::date AS day,
  frt.surface,
  COUNT(*) AS rows_count,
  ROUND(AVG(frt.score)::numeric, 3) AS avg_score,
  ROUND(percentile_cont(0.5) WITHIN GROUP (ORDER BY frt.score)::numeric, 3) AS p50_score,
  ROUND(percentile_cont(0.9) WITHIN GROUP (ORDER BY frt.score)::numeric, 3) AS p90_score,
  ROUND(percentile_cont(0.99) WITHIN GROUP (ORDER BY frt.score)::numeric, 3) AS p99_score
FROM public.feed_ranking_telemetry frt
WHERE frt.created_at >= now() - interval '14 days'
GROUP BY 1, 2
ORDER BY day DESC, frt.surface;

-- =============================================================
-- 2) Rank quality curve (avg score by rank position)
--    Healthy shape usually means higher ranks have higher scores.
-- =============================================================
SELECT
  frt.surface,
  frt.rank_position,
  COUNT(*) AS rows_count,
  ROUND(AVG(frt.score)::numeric, 3) AS avg_score,
  ROUND(MIN(frt.score)::numeric, 3) AS min_score,
  ROUND(MAX(frt.score)::numeric, 3) AS max_score
FROM public.feed_ranking_telemetry frt
WHERE frt.created_at >= now() - interval '7 days'
  AND frt.rank_position <= 30
GROUP BY frt.surface, frt.rank_position
ORDER BY frt.surface, frt.rank_position;

-- =============================================================
-- 3) Component contribution trends (daily averages)
--    If your component keys differ, adjust JSON key names below.
-- =============================================================
WITH parsed AS (
  SELECT
    date_trunc('day', frt.created_at)::date AS day,
    frt.surface,
    CASE WHEN (frt.components ->> 'affinity') ~ '^-?[0-9]+(\.[0-9]+)?$'
      THEN (frt.components ->> 'affinity')::double precision ELSE NULL END AS affinity,
    CASE WHEN (frt.components ->> 'recency_boost') ~ '^-?[0-9]+(\.[0-9]+)?$'
      THEN (frt.components ->> 'recency_boost')::double precision ELSE NULL END AS recency_boost,
    CASE WHEN (frt.components ->> 'popularity_score') ~ '^-?[0-9]+(\.[0-9]+)?$'
      THEN (frt.components ->> 'popularity_score')::double precision ELSE NULL END AS popularity_score,
    CASE WHEN (frt.components ->> 'follow_boost') ~ '^-?[0-9]+(\.[0-9]+)?$'
      THEN (frt.components ->> 'follow_boost')::double precision ELSE NULL END AS follow_boost,
    CASE WHEN (frt.components ->> 'interest_score') ~ '^-?[0-9]+(\.[0-9]+)?$'
      THEN (frt.components ->> 'interest_score')::double precision ELSE NULL END AS interest_score
  FROM public.feed_ranking_telemetry frt
  WHERE frt.created_at >= now() - interval '14 days'
)
SELECT
  p.day,
  p.surface,
  ROUND(AVG(p.affinity)::numeric, 3) AS avg_affinity,
  ROUND(AVG(p.recency_boost)::numeric, 3) AS avg_recency_boost,
  ROUND(AVG(p.popularity_score)::numeric, 3) AS avg_popularity_score,
  ROUND(AVG(p.follow_boost)::numeric, 3) AS avg_follow_boost,
  ROUND(AVG(p.interest_score)::numeric, 3) AS avg_interest_score
FROM parsed p
GROUP BY p.day, p.surface
ORDER BY p.day DESC, p.surface;

-- =============================================================
-- 4) Rank drift by video (day-over-day)
--    Positive drift means rank_position increased (worse rank).
-- =============================================================
WITH daily_video_rank AS (
  SELECT
    frt.user_id,
    frt.video_id,
    frt.surface,
    date_trunc('day', frt.created_at)::date AS day,
    AVG(frt.rank_position)::double precision AS avg_rank_position,
    COUNT(*) AS impressions
  FROM public.feed_ranking_telemetry frt
  WHERE frt.created_at >= now() - interval '14 days'
    AND frt.video_id IS NOT NULL
  GROUP BY frt.user_id, frt.video_id, frt.surface, date_trunc('day', frt.created_at)::date
), with_lag AS (
  SELECT
    dvr.*,
    LAG(dvr.avg_rank_position) OVER (
      PARTITION BY dvr.user_id, dvr.video_id, dvr.surface
      ORDER BY dvr.day
    ) AS prev_day_avg_rank
  FROM daily_video_rank dvr
)
SELECT
  wl.day,
  wl.surface,
  wl.video_id,
  ROUND(wl.avg_rank_position::numeric, 2) AS avg_rank_position,
  ROUND(wl.prev_day_avg_rank::numeric, 2) AS prev_day_avg_rank,
  ROUND((wl.avg_rank_position - wl.prev_day_avg_rank)::numeric, 2) AS rank_drift,
  wl.impressions
FROM with_lag wl
WHERE wl.prev_day_avg_rank IS NOT NULL
ORDER BY ABS(wl.avg_rank_position - wl.prev_day_avg_rank) DESC, wl.impressions DESC
LIMIT 100;

-- =============================================================
-- 5) Score/rank anomalies (quick sanity check)
--    Finds high-rank (top positions) rows with unusually low score.
-- =============================================================
WITH recent AS (
  SELECT *
  FROM public.feed_ranking_telemetry
  WHERE created_at >= now() - interval '7 days'
), score_stats AS (
  SELECT
    surface,
    percentile_cont(0.1) WITHIN GROUP (ORDER BY score) AS p10_score
  FROM recent
  GROUP BY surface
)
SELECT
  r.created_at,
  r.surface,
  r.rank_position,
  ROUND(r.score::numeric, 3) AS score,
  ROUND(ss.p10_score::numeric, 3) AS p10_score,
  r.video_id,
  r.components
FROM recent r
JOIN score_stats ss ON ss.surface = r.surface
WHERE r.rank_position <= 5
  AND r.score <= ss.p10_score
ORDER BY r.created_at DESC
LIMIT 100;
