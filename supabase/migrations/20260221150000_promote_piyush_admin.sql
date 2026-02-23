-- Promote specific user to platform admin

DO $$
DECLARE
  target_user_id UUID;
BEGIN
  ALTER TABLE public.profiles DISABLE TRIGGER trg_prevent_non_admin_profile_status_changes;

  SELECT id
  INTO target_user_id
  FROM auth.users
  WHERE email = 'piyushvikramsingh001@gmail.com'
  LIMIT 1;

  IF target_user_id IS NULL THEN
    RAISE EXCEPTION 'No auth user found for email: %', 'piyushvikramsingh001@gmail.com';
  END IF;

  UPDATE public.profiles
  SET is_admin = true
  WHERE user_id = target_user_id;

  IF NOT FOUND THEN
    ALTER TABLE public.profiles ENABLE TRIGGER trg_prevent_non_admin_profile_status_changes;
    RAISE EXCEPTION 'No profile row found for user email: %', 'piyushvikramsingh001@gmail.com';
  END IF;

  ALTER TABLE public.profiles ENABLE TRIGGER trg_prevent_non_admin_profile_status_changes;
END;
$$;
