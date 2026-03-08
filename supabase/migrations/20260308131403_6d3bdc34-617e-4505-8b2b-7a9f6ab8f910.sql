
-- Drop the overly permissive policy that allows any role to manage the sitemap bucket
DROP POLICY IF EXISTS "Service role can manage sitemap" ON storage.objects;

-- Recreate the policy restricted to service_role only
CREATE POLICY "Service role can manage sitemap"
ON storage.objects FOR ALL
TO service_role
USING (bucket_id = 'sitemap')
WITH CHECK (bucket_id = 'sitemap');

-- Ensure public read access is still available for the sitemap (so search engines can read it)
DROP POLICY IF EXISTS "Public can read sitemap" ON storage.objects;

CREATE POLICY "Public can read sitemap"
ON storage.objects FOR SELECT
TO anon, authenticated
USING (bucket_id = 'sitemap');
