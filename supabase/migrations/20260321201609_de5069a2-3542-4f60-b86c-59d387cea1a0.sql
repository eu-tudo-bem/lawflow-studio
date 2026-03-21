-- Enable pg_net extension if not already enabled (needed for HTTP calls)
CREATE EXTENSION IF NOT EXISTS pg_net WITH SCHEMA extensions;

-- Function: fires the ads-offline-conversion Edge Function when a case
-- moves into a "closed-won" status.
CREATE OR REPLACE FUNCTION public.trigger_ads_offline_conversion()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  conversion_statuses TEXT[] := ARRAY['completed', 'GANHO', 'CONTRATO_FECHADO'];
BEGIN
  -- Only fire when status actually changed to a conversion value
  IF (NEW.status::text = ANY(conversion_statuses))
     AND (OLD.status::text IS DISTINCT FROM NEW.status::text) THEN

    PERFORM net.http_post(
      url     := 'https://eojgjfefbjhslyeodcls.supabase.co/functions/v1/ads-offline-conversion',
      headers := jsonb_build_object(
        'Content-Type',  'application/json',
        'Authorization', 'Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImVvamdqZmVmYmpoc2x5ZW9kY2xzIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzAwNjQ5OTUsImV4cCI6MjA4NTY0MDk5NX0.KJWyQPznZkdcJ0cWNe2NhzdQTx1ep2twmmg3eL26KGI'
      ),
      body    := jsonb_build_object(
        'type',       'UPDATE',
        'table',      TG_TABLE_NAME,
        'schema',     TG_TABLE_SCHEMA,
        'record',     row_to_json(NEW),
        'old_record', row_to_json(OLD)
      )
    );

  END IF;

  RETURN NEW;
END;
$$;

-- Trigger: attach to cases table on every UPDATE
DROP TRIGGER IF EXISTS on_case_status_conversion ON public.cases;

CREATE TRIGGER on_case_status_conversion
  AFTER UPDATE ON public.cases
  FOR EACH ROW
  EXECUTE FUNCTION public.trigger_ads_offline_conversion();