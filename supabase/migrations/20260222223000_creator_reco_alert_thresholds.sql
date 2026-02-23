-- Admin alert thresholds for creator recommendation experiments

CREATE OR REPLACE FUNCTION public.get_creator_recommendation_experiment_alerts(
  window_days INTEGER DEFAULT 7,
  ctr_drop_threshold_percent DOUBLE PRECISION DEFAULT 10
)
RETURNS TABLE (
  warning_level TEXT,
  message TEXT,
  threshold_percent DOUBLE PRECISION,
  control_ctr_percent DOUBLE PRECISION,
  variant_ctr_percent DOUBLE PRECISION,
  ctr_drop_percent DOUBLE PRECISION,
  control_follow_conversion_percent DOUBLE PRECISION,
  variant_follow_conversion_percent DOUBLE PRECISION
)
LANGUAGE plpgsql
SECURITY INVOKER
SET search_path = public
AS $$
DECLARE
  viewer_id UUID := auth.uid();
  viewer_is_admin BOOLEAN := false;
BEGIN
  IF viewer_id IS NULL THEN
    RAISE EXCEPTION 'Not authenticated';
  END IF;

  SELECT COALESCE(p.is_admin, false)
  INTO viewer_is_admin
  FROM public.profiles p
  WHERE p.user_id = viewer_id;

  IF NOT viewer_is_admin THEN
    RAISE EXCEPTION 'Admin access required';
  END IF;

  RETURN QUERY
  WITH metrics AS (
    SELECT *
    FROM public.get_creator_recommendation_experiment_metrics(
      GREATEST(1, LEAST(COALESCE(window_days, 7), 90))
    )
  ), control_row AS (
    SELECT * FROM metrics WHERE variant = 'control' LIMIT 1
  ), variant_row AS (
    SELECT * FROM metrics WHERE variant <> 'control' ORDER BY exposures DESC LIMIT 1
  ), evaluated AS (
    SELECT
      COALESCE(c.ctr_percent, 0)::DOUBLE PRECISION AS control_ctr,
      COALESCE(v.ctr_percent, 0)::DOUBLE PRECISION AS variant_ctr,
      COALESCE(c.follow_conversion_percent, 0)::DOUBLE PRECISION AS control_cvr,
      COALESCE(v.follow_conversion_percent, 0)::DOUBLE PRECISION AS variant_cvr,
      GREATEST(0, COALESCE(c.ctr_percent, 0) - COALESCE(v.ctr_percent, 0))::DOUBLE PRECISION AS ctr_drop,
      COALESCE(ctr_drop_threshold_percent, 10)::DOUBLE PRECISION AS threshold_pct,
      COALESCE(v.exposures, 0)::BIGINT AS variant_exposures
    FROM control_row c
    FULL OUTER JOIN variant_row v ON true
  )
  SELECT
    CASE
      WHEN e.variant_exposures < 50 THEN 'info'
      WHEN e.ctr_drop >= (e.threshold_pct * 1.5) THEN 'critical'
      WHEN e.ctr_drop >= e.threshold_pct THEN 'warning'
      ELSE 'ok'
    END AS warning_level,
    CASE
      WHEN e.variant_exposures < 50 THEN 'Not enough variant exposures for reliable alerting yet.'
      WHEN e.ctr_drop >= (e.threshold_pct * 1.5) THEN 'Variant CTR is significantly below control. Consider pausing experiment.'
      WHEN e.ctr_drop >= e.threshold_pct THEN 'Variant CTR is below control threshold. Monitor closely.'
      ELSE 'Variant CTR is within acceptable threshold.'
    END AS message,
    e.threshold_pct AS threshold_percent,
    e.control_ctr AS control_ctr_percent,
    e.variant_ctr AS variant_ctr_percent,
    e.ctr_drop AS ctr_drop_percent,
    e.control_cvr AS control_follow_conversion_percent,
    e.variant_cvr AS variant_follow_conversion_percent
  FROM evaluated e;
END;
$$;
