-- Feed ranking executive KPIs (compact)
-- Exactly 3 result tables for quick daily checks.
--
-- Run in Supabase SQL editor:
-- - Authenticated user: scoped by RLS to auth.uid().
-- - Service/admin sessions can see wider scope.

-- =============================================================
-- KPI 1) 7-day health summary by surface
-- =============================================================
WITH recent AS (
  SELECT *
  FROM public.feed_ranking_telemetry
  WHERE created_at >= now() - interval '7 days'
)
SELECT
  r.surface,
  COUNT(*) AS impressions,
  ROUND(AVG(r.score)::numeric, 3) AS avg_score,
  ROUND(percentile_cont(0.5) WITHIN GROUP (ORDER BY r.score)::numeric, 3) AS p50_score,
  ROUND(percentile_cont(0.9) WITHIN GROUP (ORDER BY r.score)::numeric, 3) AS p90_score,
  ROUND(AVG(r.rank_position)::numeric, 2) AS avg_rank_position,
  ROUND(AVG(CASE WHEN r.rank_position <= 5 THEN r.score END)::numeric, 3) AS avg_top5_score
FROM recent r
GROUP BY r.surface
ORDER BY r.surface;

-- =============================================================
-- KPI 2) Day-over-day trend (last 7 days)
-- =============================================================
WITH daily AS (
  SELECT
    date_trunc('day', frt.created_at)::date AS day,
    frt.surface,
    COUNT(*) AS impressions,
    AVG(frt.score)::double precision AS avg_score,
    AVG(frt.rank_position)::double precision AS avg_rank_position
  FROM public.feed_ranking_telemetry frt
  WHERE frt.created_at >= now() - interval '7 days'
  GROUP BY date_trunc('day', frt.created_at)::date, frt.surface
), trended AS (
  SELECT
    d.*,
    LAG(d.avg_score) OVER (PARTITION BY d.surface ORDER BY d.day) AS prev_avg_score,
    LAG(d.avg_rank_position) OVER (PARTITION BY d.surface ORDER BY d.day) AS prev_avg_rank_position
  FROM daily d
)
SELECT
  t.day,
  t.surface,
  t.impressions,
  ROUND(t.avg_score::numeric, 3) AS avg_score,
  ROUND((t.avg_score - COALESCE(t.prev_avg_score, t.avg_score))::numeric, 3) AS score_delta,
  ROUND(t.avg_rank_position::numeric, 2) AS avg_rank_position,
  ROUND((t.avg_rank_position - COALESCE(t.prev_avg_rank_position, t.avg_rank_position))::numeric, 2) AS rank_delta
FROM trended t
ORDER BY t.day DESC, t.surface;

-- =============================================================
-- KPI 3) Alert counts (last 24 hours)
--    - low_score_top5: top-5 rows with bottom-decile score
--    - rank_inversion: rank n+1 score > rank n score in same request slice proxy
-- =============================================================
WITH recent AS (
  SELECT *
  FROM public.feed_ranking_telemetry
  WHERE created_at >= now() - interval '24 hours'
), thresholds AS (
  SELECT
    surface,
    percentile_cont(0.1) WITHIN GROUP (ORDER BY score) AS p10_score
  FROM recent
  GROUP BY surface
), low_score_top5 AS (
  SELECT
    r.surface,
    COUNT(*) AS cnt
  FROM recent r
  JOIN thresholds t ON t.surface = r.surface
  WHERE r.rank_position <= 5
    AND r.score <= t.p10_score
  GROUP BY r.surface
), inversions AS (
  SELECT
    x.surface,
    COUNT(*) AS cnt
  FROM (
    SELECT
      r.surface,
      r.user_id,
      date_trunc('minute', r.created_at) AS minute_bucket,
      r.rank_position,
      r.score,
      LEAD(r.score) OVER (
        PARTITION BY r.surface, r.user_id, date_trunc('minute', r.created_at)
        ORDER BY r.rank_position
      ) AS next_score
    FROM recent r
    WHERE r.rank_position <= 20
  ) x
  WHERE x.next_score IS NOT NULL
    AND x.next_score > x.score
  GROUP BY x.surface
)
SELECT
  COALESCE(s.surface, l.surface, i.surface) AS surface,
  COALESCE(s.impressions_24h, 0) AS impressions_24h,
  COALESCE(l.low_score_top5_count, 0) AS low_score_top5_count,
  COALESCE(i.rank_inversion_count, 0) AS rank_inversion_count
FROM (
  SELECT surface, COUNT(*) AS impressions_24h
  FROM recent
  GROUP BY surface
) s
FULL OUTER JOIN (
  SELECT surface, cnt AS low_score_top5_count
  FROM low_score_top5
) l ON l.surface = s.surface
FULL OUTER JOIN (
  SELECT surface, cnt AS rank_inversion_count
  FROM inversions
) i ON i.surface = COALESCE(s.surface, l.surface)
ORDER BY surface;
