CREATE TABLE public.document_generations (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  document_type TEXT NOT NULL,
  document_label TEXT NOT NULL,
  lead_name TEXT NOT NULL,
  lead_email TEXT NOT NULL,
  lead_whatsapp TEXT NOT NULL,
  form_data JSONB,
  converted BOOLEAN NOT NULL DEFAULT false,
  converted_at TIMESTAMP WITH TIME ZONE,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

ALTER TABLE public.document_generations ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can generate a document"
  ON public.document_generations FOR INSERT
  WITH CHECK (length(lead_name) > 0 AND length(lead_email) > 0 AND length(lead_whatsapp) > 0);

CREATE POLICY "Staff can view document generations"
  ON public.document_generations FOR SELECT
  USING (has_role(auth.uid(), 'admin'::app_role) OR has_role(auth.uid(), 'staff'::app_role));

CREATE POLICY "Staff can update document generations"
  ON public.document_generations FOR UPDATE
  USING (has_role(auth.uid(), 'admin'::app_role) OR has_role(auth.uid(), 'staff'::app_role));

CREATE POLICY "Admins can delete document generations"
  ON public.document_generations FOR DELETE
  USING (has_role(auth.uid(), 'admin'::app_role));