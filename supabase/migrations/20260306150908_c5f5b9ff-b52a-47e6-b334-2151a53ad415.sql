
-- =========================================================
-- Monitor Jurídico Inteligente - tabelas e categoria
-- =========================================================

-- 1. Tabela principal de mudanças jurídicas detectadas
CREATE TABLE public.legal_changes (
  id             UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  titulo         TEXT NOT NULL,
  resumo         TEXT,
  area_direito   TEXT NOT NULL,
  tipo_impacto   TEXT,
  fonte          TEXT,
  url_fonte      TEXT,
  norma_referencia TEXT,
  palavras_chave TEXT[],
  status         TEXT NOT NULL DEFAULT 'detected',
  blog_post_id   UUID REFERENCES public.blog_posts(id) ON DELETE SET NULL,
  leads_gerados  INTEGER NOT NULL DEFAULT 0,
  created_at     TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at     TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

ALTER TABLE public.legal_changes ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Staff can view legal changes"
  ON public.legal_changes FOR SELECT
  USING (has_role(auth.uid(), 'admin'::app_role) OR has_role(auth.uid(), 'staff'::app_role));

CREATE POLICY "Staff can insert legal changes"
  ON public.legal_changes FOR INSERT
  WITH CHECK (has_role(auth.uid(), 'admin'::app_role) OR has_role(auth.uid(), 'staff'::app_role));

CREATE POLICY "Staff can update legal changes"
  ON public.legal_changes FOR UPDATE
  USING (has_role(auth.uid(), 'admin'::app_role) OR has_role(auth.uid(), 'staff'::app_role));

CREATE POLICY "Admins can delete legal changes"
  ON public.legal_changes FOR DELETE
  USING (has_role(auth.uid(), 'admin'::app_role));

CREATE TRIGGER update_legal_changes_updated_at
  BEFORE UPDATE ON public.legal_changes
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

-- 2. Log de execuções do agente de monitoramento
CREATE TABLE public.legal_monitor_logs (
  id              UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  status          TEXT NOT NULL,
  changes_found   INTEGER NOT NULL DEFAULT 0,
  posts_generated INTEGER NOT NULL DEFAULT 0,
  error_message   TEXT,
  duration_ms     INTEGER,
  areas_scanned   TEXT[],
  created_at      TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

ALTER TABLE public.legal_monitor_logs ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Staff can view monitor logs"
  ON public.legal_monitor_logs FOR SELECT
  USING (has_role(auth.uid(), 'admin'::app_role) OR has_role(auth.uid(), 'staff'::app_role));

CREATE POLICY "Service role can insert monitor logs"
  ON public.legal_monitor_logs FOR INSERT
  WITH CHECK (true);

-- 3. Cria categoria "Atualizações da Lei" no blog
INSERT INTO public.blog_categories (name, slug, description)
VALUES (
  'Atualizações da Lei',
  'atualizacoes-da-lei',
  'Mudanças legislativas, novas normas, decisões do STF e STJ com impacto direto para os cidadãos.'
)
ON CONFLICT (slug) DO NOTHING;

-- 4. Índices para performance
CREATE INDEX idx_legal_changes_status ON public.legal_changes(status);
CREATE INDEX idx_legal_changes_area ON public.legal_changes(area_direito);
CREATE INDEX idx_legal_changes_created_at ON public.legal_changes(created_at DESC);
CREATE INDEX idx_legal_monitor_logs_created_at ON public.legal_monitor_logs(created_at DESC);
