
-- Table for monitored TJPR processes
CREATE TABLE public.tjpr_processos_monitorados (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  numero_processo TEXT NOT NULL,
  cliente_id UUID REFERENCES public.clients(id) ON DELETE SET NULL,
  area_direito TEXT,
  observacoes TEXT,
  status_atual TEXT DEFAULT 'Desconhecido',
  comarca TEXT,
  vara TEXT,
  ultima_verificacao TIMESTAMP WITH TIME ZONE,
  created_by UUID NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  UNIQUE(numero_processo, created_by)
);

ALTER TABLE public.tjpr_processos_monitorados ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Staff can view own monitored processes"
  ON public.tjpr_processos_monitorados FOR SELECT
  USING (has_role(auth.uid(), 'admin'::app_role) OR created_by = auth.uid());

CREATE POLICY "Staff can insert monitored processes"
  ON public.tjpr_processos_monitorados FOR INSERT
  WITH CHECK (has_role(auth.uid(), 'admin'::app_role) OR (has_role(auth.uid(), 'staff'::app_role) AND created_by = auth.uid()));

CREATE POLICY "Staff can update own monitored processes"
  ON public.tjpr_processos_monitorados FOR UPDATE
  USING (has_role(auth.uid(), 'admin'::app_role) OR created_by = auth.uid());

CREATE POLICY "Staff can delete own monitored processes"
  ON public.tjpr_processos_monitorados FOR DELETE
  USING (has_role(auth.uid(), 'admin'::app_role) OR created_by = auth.uid());

CREATE TRIGGER update_tjpr_processos_updated_at
  BEFORE UPDATE ON public.tjpr_processos_monitorados
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

-- Table for consultation logs
CREATE TABLE public.tjpr_logs_consulta (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  processo_id UUID NOT NULL REFERENCES public.tjpr_processos_monitorados(id) ON DELETE CASCADE,
  status_anterior TEXT,
  status_novo TEXT,
  comarca TEXT,
  vara TEXT,
  resposta_raw JSONB,
  erro TEXT,
  sucesso BOOLEAN NOT NULL DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

ALTER TABLE public.tjpr_logs_consulta ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Staff can view logs"
  ON public.tjpr_logs_consulta FOR SELECT
  USING (has_role(auth.uid(), 'admin'::app_role) OR has_role(auth.uid(), 'staff'::app_role));

CREATE POLICY "Service can insert logs"
  ON public.tjpr_logs_consulta FOR INSERT
  WITH CHECK (true);

-- Clients can see simplified status of their processes
CREATE POLICY "Clients can view their process status"
  ON public.tjpr_processos_monitorados FOR SELECT
  USING (cliente_id IN (SELECT id FROM clients WHERE user_id = auth.uid()));
