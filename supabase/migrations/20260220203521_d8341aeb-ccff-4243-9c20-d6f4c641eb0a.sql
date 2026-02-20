
-- Storage bucket for client documents
INSERT INTO storage.buckets (id, name, public) VALUES ('client-documents', 'client-documents', false);

-- Storage policies
CREATE POLICY "Clients can upload their documents"
ON storage.objects FOR INSERT
WITH CHECK (bucket_id = 'client-documents' AND auth.uid()::text = (storage.foldername(name))[1]);

CREATE POLICY "Clients can view their documents"
ON storage.objects FOR SELECT
USING (bucket_id = 'client-documents' AND auth.uid()::text = (storage.foldername(name))[1]);

CREATE POLICY "Staff and admins can view all client documents"
ON storage.objects FOR SELECT
USING (bucket_id = 'client-documents' AND (public.has_role(auth.uid(), 'admin') OR public.has_role(auth.uid(), 'staff')));

-- Document submission statuses
CREATE TYPE public.submission_status AS ENUM ('submitted', 'analyzing', 'in_review', 'completed');
CREATE TYPE public.viability_score AS ENUM ('low', 'medium', 'high');
CREATE TYPE public.legal_area AS ENUM ('bancario', 'trabalhista', 'empresarial', 'consumidor', 'familia', 'imobiliario', 'tributario', 'outro');

-- Main submissions table
CREATE TABLE public.document_submissions (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    client_id UUID NOT NULL REFERENCES public.clients(id) ON DELETE CASCADE,
    description TEXT NOT NULL,
    legal_area public.legal_area NOT NULL,
    status public.submission_status NOT NULL DEFAULT 'submitted',
    created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

ALTER TABLE public.document_submissions ENABLE ROW LEVEL SECURITY;

-- Clients see their own submissions
CREATE POLICY "Clients can view own submissions"
ON public.document_submissions FOR SELECT
USING (client_id IN (SELECT id FROM public.clients WHERE user_id = auth.uid()));

-- Clients can create submissions
CREATE POLICY "Clients can create submissions"
ON public.document_submissions FOR INSERT
WITH CHECK (client_id IN (SELECT id FROM public.clients WHERE user_id = auth.uid()));

-- Staff/admin can view all
CREATE POLICY "Staff can view all submissions"
ON public.document_submissions FOR SELECT
USING (public.has_role(auth.uid(), 'admin') OR public.has_role(auth.uid(), 'staff'));

-- Staff/admin can update
CREATE POLICY "Staff can update submissions"
ON public.document_submissions FOR UPDATE
USING (public.has_role(auth.uid(), 'admin') OR public.has_role(auth.uid(), 'staff'));

-- Individual documents per submission
CREATE TABLE public.submission_documents (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    submission_id UUID NOT NULL REFERENCES public.document_submissions(id) ON DELETE CASCADE,
    file_name TEXT NOT NULL,
    file_path TEXT NOT NULL,
    file_type TEXT NOT NULL,
    file_size BIGINT NOT NULL,
    created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

ALTER TABLE public.submission_documents ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Clients can view own documents"
ON public.submission_documents FOR SELECT
USING (submission_id IN (SELECT id FROM public.document_submissions WHERE client_id IN (SELECT id FROM public.clients WHERE user_id = auth.uid())));

CREATE POLICY "Clients can insert documents"
ON public.submission_documents FOR INSERT
WITH CHECK (submission_id IN (SELECT id FROM public.document_submissions WHERE client_id IN (SELECT id FROM public.clients WHERE user_id = auth.uid())));

CREATE POLICY "Staff can view all documents"
ON public.submission_documents FOR SELECT
USING (public.has_role(auth.uid(), 'admin') OR public.has_role(auth.uid(), 'staff'));

-- AI analysis results
CREATE TABLE public.ai_analyses (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    submission_id UUID NOT NULL UNIQUE REFERENCES public.document_submissions(id) ON DELETE CASCADE,
    extracted_data JSONB,
    technical_summary TEXT,
    suggested_thesis TEXT,
    suggested_action_type TEXT,
    draft_document TEXT,
    viability_score public.viability_score,
    reviewed BOOLEAN NOT NULL DEFAULT false,
    reviewed_by UUID REFERENCES auth.users(id),
    reviewed_at TIMESTAMPTZ,
    notes TEXT,
    created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

ALTER TABLE public.ai_analyses ENABLE ROW LEVEL SECURITY;

-- Only staff/admin can see analyses (clients cannot)
CREATE POLICY "Staff can view analyses"
ON public.ai_analyses FOR SELECT
USING (public.has_role(auth.uid(), 'admin') OR public.has_role(auth.uid(), 'staff'));

CREATE POLICY "Staff can update analyses"
ON public.ai_analyses FOR UPDATE
USING (public.has_role(auth.uid(), 'admin') OR public.has_role(auth.uid(), 'staff'));

-- System can insert analyses (edge function with service role)
CREATE POLICY "Service can insert analyses"
ON public.ai_analyses FOR INSERT
WITH CHECK (true);

-- Triggers for updated_at
CREATE TRIGGER update_document_submissions_updated_at
BEFORE UPDATE ON public.document_submissions
FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_ai_analyses_updated_at
BEFORE UPDATE ON public.ai_analyses
FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();
