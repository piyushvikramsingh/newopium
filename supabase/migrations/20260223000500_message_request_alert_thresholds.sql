-- Alert thresholds for message request delete-rate spikes.

CREATE OR REPLACE FUNCTION public.get_message_request_alerts(
  window_days INTEGER DEFAULT 7,
  delete_rate_threshold_percent NUMERIC DEFAULT 70,
  min_actions INTEGER DEFAULT 20
)
RETURNS TABLE (
  warning_level TEXT,
  message TEXT,
  total_actions BIGINT,
  accept_actions BIGINT,
  delete_actions BIGINT,
  accept_rate_percent NUMERIC,
  delete_rate_percent NUMERIC,
  threshold_percent NUMERIC
)
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  actor_user_id UUID;
  metrics_row RECORD;
  bounded_threshold NUMERIC;
  bounded_min_actions INTEGER;
  computed_delete_rate NUMERIC;
BEGIN
  actor_user_id := auth.uid();
  IF actor_user_id IS NULL OR NOT public.is_current_user_admin() THEN
    RAISE EXCEPTION 'Admin access required';
  END IF;

  bounded_threshold := GREATEST(10, LEAST(COALESCE(delete_rate_threshold_percent, 70), 95));
  bounded_min_actions := GREATEST(1, LEAST(COALESCE(min_actions, 20), 500));

  SELECT *
  INTO metrics_row
  FROM public.get_message_request_admin_metrics(window_days)
  LIMIT 1;

  IF metrics_row IS NULL THEN
    RETURN QUERY
    SELECT
      'info'::TEXT,
      'No message request actions yet.'::TEXT,
      0::BIGINT,
      0::BIGINT,
      0::BIGINT,
      0::NUMERIC,
      0::NUMERIC,
      bounded_threshold;
    RETURN;
  END IF;

  computed_delete_rate := GREATEST(0, 100 - COALESCE(metrics_row.accept_rate_percent, 0));

  IF COALESCE(metrics_row.total_actions, 0) < bounded_min_actions THEN
    RETURN QUERY
    SELECT
      'info'::TEXT,
      format('Collecting signal: %s actions so far (minimum %s needed).', COALESCE(metrics_row.total_actions, 0), bounded_min_actions),
      COALESCE(metrics_row.total_actions, 0)::BIGINT,
      COALESCE(metrics_row.accept_actions, 0)::BIGINT,
      COALESCE(metrics_row.delete_actions, 0)::BIGINT,
      COALESCE(metrics_row.accept_rate_percent, 0)::NUMERIC,
      computed_delete_rate::NUMERIC,
      bounded_threshold;
    RETURN;
  END IF;

  IF computed_delete_rate >= bounded_threshold + 15 THEN
    RETURN QUERY
    SELECT
      'critical'::TEXT,
      format('Critical: message request delete rate %.2f%% exceeds threshold %.2f%%.', computed_delete_rate, bounded_threshold),
      COALESCE(metrics_row.total_actions, 0)::BIGINT,
      COALESCE(metrics_row.accept_actions, 0)::BIGINT,
      COALESCE(metrics_row.delete_actions, 0)::BIGINT,
      COALESCE(metrics_row.accept_rate_percent, 0)::NUMERIC,
      computed_delete_rate::NUMERIC,
      bounded_threshold;
    RETURN;
  END IF;

  IF computed_delete_rate >= bounded_threshold THEN
    RETURN QUERY
    SELECT
      'warning'::TEXT,
      format('Warning: message request delete rate %.2f%% is above threshold %.2f%%.', computed_delete_rate, bounded_threshold),
      COALESCE(metrics_row.total_actions, 0)::BIGINT,
      COALESCE(metrics_row.accept_actions, 0)::BIGINT,
      COALESCE(metrics_row.delete_actions, 0)::BIGINT,
      COALESCE(metrics_row.accept_rate_percent, 0)::NUMERIC,
      computed_delete_rate::NUMERIC,
      bounded_threshold;
    RETURN;
  END IF;

  RETURN QUERY
  SELECT
    'healthy'::TEXT,
    format('Healthy: message request delete rate %.2f%% is below threshold %.2f%%.', computed_delete_rate, bounded_threshold),
    COALESCE(metrics_row.total_actions, 0)::BIGINT,
    COALESCE(metrics_row.accept_actions, 0)::BIGINT,
    COALESCE(metrics_row.delete_actions, 0)::BIGINT,
    COALESCE(metrics_row.accept_rate_percent, 0)::NUMERIC,
    computed_delete_rate::NUMERIC,
    bounded_threshold;
END;
$$;
