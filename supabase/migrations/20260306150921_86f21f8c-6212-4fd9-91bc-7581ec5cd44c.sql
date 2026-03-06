
-- Fix: replace permissive INSERT policy on legal_monitor_logs
-- Service role bypasses RLS by default, so we restrict INSERT to staff only
DROP POLICY IF EXISTS "Service role can insert monitor logs" ON public.legal_monitor_logs;

CREATE POLICY "Staff can insert monitor logs"
  ON public.legal_monitor_logs FOR INSERT
  WITH CHECK (has_role(auth.uid(), 'admin'::app_role) OR has_role(auth.uid(), 'staff'::app_role));
