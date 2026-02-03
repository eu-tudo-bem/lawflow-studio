-- Fix contact_submissions policies
DROP POLICY IF EXISTS "Anyone can submit contact form" ON public.contact_submissions;
DROP POLICY IF EXISTS "Authenticated users can update contact submissions" ON public.contact_submissions;
DROP POLICY IF EXISTS "Authenticated users can view contact submissions" ON public.contact_submissions;

-- Allow anyone to submit contact form (public form)
CREATE POLICY "Anyone can submit contact form"
ON public.contact_submissions FOR INSERT
TO anon, authenticated
WITH CHECK (true);

-- Only admins can view contact submissions
CREATE POLICY "Admins can view contact submissions"
ON public.contact_submissions FOR SELECT
TO authenticated
USING (public.has_role(auth.uid(), 'admin'));

-- Only admins can update contact submissions (mark as read)
CREATE POLICY "Admins can update contact submissions"
ON public.contact_submissions FOR UPDATE
TO authenticated
USING (public.has_role(auth.uid(), 'admin'));