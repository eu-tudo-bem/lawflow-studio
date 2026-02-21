-- Create public bucket for sitemap
INSERT INTO storage.buckets (id, name, public) VALUES ('sitemap', 'sitemap', true)
ON CONFLICT (id) DO NOTHING;

-- Allow anyone to read sitemap files
CREATE POLICY "Sitemap files are publicly accessible"
ON storage.objects FOR SELECT
USING (bucket_id = 'sitemap');

-- Allow service role to manage sitemap (edge functions use service role)
CREATE POLICY "Service role can manage sitemap"
ON storage.objects FOR ALL
USING (bucket_id = 'sitemap')
WITH CHECK (bucket_id = 'sitemap');