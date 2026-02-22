-- Add explicit policy denying anonymous/public access to messages
CREATE POLICY "Deny public access to messages"
ON public.messages
FOR ALL
TO anon
USING (false)
WITH CHECK (false);