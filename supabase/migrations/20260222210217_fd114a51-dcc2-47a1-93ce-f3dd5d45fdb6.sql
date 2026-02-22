-- Remove the overly broad deny-all for anon on contact_submissions
DROP POLICY "Deny public access to contact_submissions" ON public.contact_submissions;

-- Deny anonymous SELECT, UPDATE, DELETE (but allow INSERT for the public form)
CREATE POLICY "Deny public read on contact_submissions"
ON public.contact_submissions
FOR SELECT
TO anon
USING (false);

CREATE POLICY "Deny public update on contact_submissions"
ON public.contact_submissions
FOR UPDATE
TO anon
USING (false);

CREATE POLICY "Deny public delete on contact_submissions"
ON public.contact_submissions
FOR DELETE
TO anon
USING (false);