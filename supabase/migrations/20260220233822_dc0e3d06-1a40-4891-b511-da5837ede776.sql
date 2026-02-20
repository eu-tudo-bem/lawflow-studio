
-- Fix ai_analyses: restrict INSERT to staff/admin (edge functions use service role anyway)
DROP POLICY "Service can insert analyses" ON public.ai_analyses;
CREATE POLICY "Staff can insert analyses" ON public.ai_analyses
  FOR INSERT TO authenticated
  WITH CHECK (has_role(auth.uid(), 'admin'::app_role) OR has_role(auth.uid(), 'staff'::app_role));

-- Fix tjpr_logs_consulta: restrict INSERT to staff/admin
DROP POLICY "Service can insert logs" ON public.tjpr_logs_consulta;
CREATE POLICY "Staff can insert logs" ON public.tjpr_logs_consulta
  FOR INSERT TO authenticated
  WITH CHECK (has_role(auth.uid(), 'admin'::app_role) OR has_role(auth.uid(), 'staff'::app_role));

-- Fix blog_leads: restrict insertable columns by requiring non-empty values
DROP POLICY "Anyone can submit blog lead" ON public.blog_leads;
CREATE POLICY "Anyone can submit blog lead" ON public.blog_leads
  FOR INSERT TO anon, authenticated
  WITH CHECK (
    length(name) > 0 AND length(email) > 0 AND length(whatsapp) > 0
  );

-- Fix contact_submissions: restrict insertable columns by requiring non-empty values
DROP POLICY "Anyone can submit contact form" ON public.contact_submissions;
CREATE POLICY "Anyone can submit contact form" ON public.contact_submissions
  FOR INSERT TO anon, authenticated
  WITH CHECK (
    length(full_name) > 0 AND length(email) > 0 AND length(phone) > 0 AND length(message) > 0
  );
