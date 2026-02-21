
-- Table to track used blog topics and avoid repetition
CREATE TABLE public.blog_topics_used (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  keyword TEXT NOT NULL,
  secondary_keywords TEXT[] DEFAULT '{}',
  legal_area TEXT NOT NULL,
  post_id UUID REFERENCES public.blog_posts(id) ON DELETE SET NULL,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Index for fast keyword lookup
CREATE UNIQUE INDEX idx_blog_topics_keyword ON public.blog_topics_used(keyword);
CREATE INDEX idx_blog_topics_legal_area ON public.blog_topics_used(legal_area);

-- Enable RLS
ALTER TABLE public.blog_topics_used ENABLE ROW LEVEL SECURITY;

-- Only service role (edge functions) can manage this table
CREATE POLICY "Staff can view topics" ON public.blog_topics_used
  FOR SELECT USING (has_role(auth.uid(), 'admin'::app_role) OR has_role(auth.uid(), 'staff'::app_role));
