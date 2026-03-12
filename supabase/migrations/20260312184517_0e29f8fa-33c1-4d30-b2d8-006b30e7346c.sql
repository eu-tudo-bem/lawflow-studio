
-- Create web_vitals table for Real User Monitoring (RUM)
CREATE TABLE public.web_vitals (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  metric_name TEXT NOT NULL,
  metric_value NUMERIC NOT NULL,
  metric_rating TEXT NOT NULL,
  metric_delta NUMERIC,
  metric_id TEXT,
  page_url TEXT NOT NULL,
  page_path TEXT NOT NULL,
  city_slug TEXT,
  navigation_type TEXT,
  connection_type TEXT,
  device_type TEXT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

ALTER TABLE public.web_vitals ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can insert web vitals"
  ON public.web_vitals
  FOR INSERT
  TO anon, authenticated
  WITH CHECK (
    metric_name IN ('CLS', 'FCP', 'LCP', 'TTFB', 'INP', 'FID')
    AND metric_value >= 0
    AND length(page_url) > 0
  );

CREATE POLICY "Staff can view web vitals"
  ON public.web_vitals
  FOR SELECT
  TO authenticated
  USING (
    has_role(auth.uid(), 'admin'::app_role)
    OR has_role(auth.uid(), 'staff'::app_role)
  );

CREATE INDEX idx_web_vitals_metric_city ON public.web_vitals (metric_name, city_slug, created_at DESC);
CREATE INDEX idx_web_vitals_page_path ON public.web_vitals (page_path, created_at DESC);
CREATE INDEX idx_web_vitals_created_at ON public.web_vitals (created_at DESC);
