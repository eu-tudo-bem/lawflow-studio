-- Fix: Restrict sitemap bucket management to service_role only
-- Drop the overly permissive policy that applies to ALL roles
DROP POLICY IF EXISTS "Service role can manage sitemap" ON storage.objects;

-- Recreate with explicit TO service_role — service_role bypasses RLS anyway,
-- so this policy only tightens access for anon/authenticated users.
CREATE POLICY "Service role can manage sitemap"
ON storage.objects
FOR ALL
TO service_role
USING (bucket_id = 'sitemap')
WITH CHECK (bucket_id = 'sitemap');

-- Ensure authenticated non-service users can still READ the sitemap publicly
-- (the bucket is public, but belt-and-suspenders for authenticated reads)
DROP POLICY IF EXISTS "Public can read sitemap" ON storage.objects;

CREATE POLICY "Public can read sitemap"
ON storage.objects
FOR SELECT
TO anon, authenticated
USING (bucket_id = 'sitemap');