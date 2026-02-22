-- Deny anonymous access to profiles
CREATE POLICY "Deny public access to profiles"
ON public.profiles
FOR ALL
TO anon
USING (false)
WITH CHECK (false);

-- Deny anonymous access to contact_submissions
CREATE POLICY "Deny public access to contact_submissions"
ON public.contact_submissions
FOR ALL
TO anon
USING (false)
WITH CHECK (false);