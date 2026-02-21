
-- Warning 1: blog_topics_used missing anon block + missing write policies
CREATE POLICY "Staff can insert topics"
  ON public.blog_topics_used FOR INSERT
  WITH CHECK (has_role(auth.uid(), 'admin'::app_role) OR has_role(auth.uid(), 'staff'::app_role));

CREATE POLICY "Admins can update topics"
  ON public.blog_topics_used FOR UPDATE
  USING (has_role(auth.uid(), 'admin'::app_role));

CREATE POLICY "Admins can delete topics"
  ON public.blog_topics_used FOR DELETE
  USING (has_role(auth.uid(), 'admin'::app_role));
