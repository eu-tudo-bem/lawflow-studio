
-- Tabela para perguntas jurídicas descobertas pelo agente
CREATE TABLE public.legal_questions (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  question text NOT NULL,
  slug text NOT NULL UNIQUE,
  legal_area text NOT NULL,
  status text NOT NULL DEFAULT 'pending',
  page_title text,
  meta_description text,
  content text,
  schema_faq jsonb,
  related_slugs text[] DEFAULT '{}',
  city_slug text,
  source text DEFAULT 'autocomplete',
  cluster_topic text,
  cluster_subtopic boolean DEFAULT false,
  parent_slug text,
  tags text[] DEFAULT '{}',
  views integer DEFAULT 0,
  leads_generated integer DEFAULT 0,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now(),
  published_at timestamptz
);

CREATE INDEX idx_legal_questions_slug ON public.legal_questions(slug);
CREATE INDEX idx_legal_questions_status ON public.legal_questions(status);
CREATE INDEX idx_legal_questions_legal_area ON public.legal_questions(legal_area);
CREATE INDEX idx_legal_questions_city_slug ON public.legal_questions(city_slug);
CREATE INDEX idx_legal_questions_cluster_topic ON public.legal_questions(cluster_topic);

ALTER TABLE public.legal_questions ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can view published questions" ON public.legal_questions FOR SELECT USING (status = 'published');
CREATE POLICY "Staff can view all questions" ON public.legal_questions FOR SELECT USING (has_role(auth.uid(), 'admin'::app_role) OR has_role(auth.uid(), 'staff'::app_role));
CREATE POLICY "Staff can insert questions" ON public.legal_questions FOR INSERT WITH CHECK (has_role(auth.uid(), 'admin'::app_role) OR has_role(auth.uid(), 'staff'::app_role));
CREATE POLICY "Staff can update questions" ON public.legal_questions FOR UPDATE USING (has_role(auth.uid(), 'admin'::app_role) OR has_role(auth.uid(), 'staff'::app_role));
CREATE POLICY "Admins can delete questions" ON public.legal_questions FOR DELETE USING (has_role(auth.uid(), 'admin'::app_role));

CREATE TRIGGER update_legal_questions_updated_at
  BEFORE UPDATE ON public.legal_questions
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

CREATE OR REPLACE TRIGGER trigger_sitemap_on_question_publish
  AFTER INSERT OR UPDATE OF status ON public.legal_questions
  FOR EACH ROW WHEN (NEW.status = 'published')
  EXECUTE FUNCTION public.trigger_sitemap_update();

-- Logs do agente de descoberta
CREATE TABLE public.discovery_agent_logs (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  status text NOT NULL,
  questions_found integer DEFAULT 0,
  pages_generated integer DEFAULT 0,
  areas_scanned text[] DEFAULT '{}',
  duration_ms integer,
  error_message text,
  created_at timestamptz NOT NULL DEFAULT now()
);

ALTER TABLE public.discovery_agent_logs ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Staff can view discovery logs" ON public.discovery_agent_logs FOR SELECT USING (has_role(auth.uid(), 'admin'::app_role) OR has_role(auth.uid(), 'staff'::app_role));
CREATE POLICY "Staff can insert discovery logs" ON public.discovery_agent_logs FOR INSERT WITH CHECK (has_role(auth.uid(), 'admin'::app_role) OR has_role(auth.uid(), 'staff'::app_role));
