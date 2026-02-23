-- Admin priority moderation queue for faster high-risk handling

CREATE OR REPLACE FUNCTION public.get_priority_video_reports(limit_count INTEGER DEFAULT 25)
RETURNS TABLE (
  report_id UUID,
  video_id UUID,
  reporter_id UUID,
  owner_user_id UUID,
  reason TEXT,
  status TEXT,
  details TEXT,
  created_at TIMESTAMPTZ,
  reporter_username TEXT,
  owner_username TEXT,
  report_count_on_video INTEGER,
  owner_open_reports INTEGER,
  priority_score DOUBLE PRECISION
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
    RETURN;
  END IF;

  SELECT COALESCE(p.is_admin, false)
  INTO viewer_is_admin
  FROM public.profiles p
  WHERE p.user_id = viewer_id;

  IF NOT viewer_is_admin THEN
    RAISE EXCEPTION 'Admin access required';
  END IF;

  RETURN QUERY
  WITH base AS (
    SELECT
      vr.id AS report_id,
      vr.video_id,
      vr.reporter_id,
      v.user_id AS owner_user_id,
      vr.reason,
      vr.status,
      vr.details,
      vr.created_at,
      rp.username AS reporter_username,
      op.username AS owner_username,
      (
        SELECT COUNT(*)::INT
        FROM public.video_reports vr2
        WHERE vr2.video_id = vr.video_id
      ) AS report_count_on_video,
      (
        SELECT COUNT(*)::INT
        FROM public.video_reports vr3
        JOIN public.videos vv3 ON vv3.id = vr3.video_id
        WHERE vv3.user_id = v.user_id
          AND vr3.status IN ('open', 'reviewing')
      ) AS owner_open_reports
    FROM public.video_reports vr
    JOIN public.videos v ON v.id = vr.video_id
    LEFT JOIN public.profiles rp ON rp.user_id = vr.reporter_id
    LEFT JOIN public.profiles op ON op.user_id = v.user_id
    WHERE vr.status IN ('open', 'reviewing')
  )
  SELECT
    b.report_id,
    b.video_id,
    b.reporter_id,
    b.owner_user_id,
    b.reason,
    b.status,
    b.details,
    b.created_at,
    b.reporter_username,
    b.owner_username,
    b.report_count_on_video,
    b.owner_open_reports,
    (
      CASE LOWER(COALESCE(b.reason, ''))
        WHEN 'violence' THEN 45
        WHEN 'hate' THEN 50
        WHEN 'harassment' THEN 35
        WHEN 'self-harm' THEN 55
        WHEN 'sexual' THEN 40
        WHEN 'inappropriate' THEN 25
        WHEN 'spam' THEN 12
        ELSE 18
      END
      + (b.report_count_on_video * 6)
      + (b.owner_open_reports * 4)
      + LEAST(72, EXTRACT(EPOCH FROM (NOW() - b.created_at)) / 3600) * 0.3
      + CASE WHEN b.status = 'reviewing' THEN 5 ELSE 0 END
    )::DOUBLE PRECISION AS priority_score
  FROM base b
  ORDER BY priority_score DESC, b.created_at ASC
  LIMIT GREATEST(1, LEAST(COALESCE(limit_count, 25), 200));
END;
$$;
