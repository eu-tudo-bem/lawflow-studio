
CREATE TABLE IF NOT EXISTS public.seo_cities (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  slug TEXT NOT NULL UNIQUE,
  name TEXT NOT NULL,
  region TEXT NOT NULL,
  variation_index INTEGER NOT NULL DEFAULT 0,
  nearby_slugs TEXT[] DEFAULT '{}',
  active BOOLEAN NOT NULL DEFAULT true,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE TABLE IF NOT EXISTS public.seo_services (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  slug TEXT NOT NULL UNIQUE,
  name TEXT NOT NULL,
  short_name TEXT NOT NULL,
  icon TEXT NOT NULL DEFAULT '⚖️',
  keyword TEXT NOT NULL,
  area TEXT NOT NULL,
  active BOOLEAN NOT NULL DEFAULT true,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

ALTER TABLE public.seo_cities ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.seo_services ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Staff manages seo_cities"
  ON public.seo_cities FOR ALL
  TO authenticated
  USING (public.has_role(auth.uid(), 'staff') OR public.has_role(auth.uid(), 'admin'))
  WITH CHECK (public.has_role(auth.uid(), 'staff') OR public.has_role(auth.uid(), 'admin'));

CREATE POLICY "Public can read active seo_cities"
  ON public.seo_cities FOR SELECT
  TO anon, authenticated
  USING (active = true);

CREATE POLICY "Staff manages seo_services"
  ON public.seo_services FOR ALL
  TO authenticated
  USING (public.has_role(auth.uid(), 'staff') OR public.has_role(auth.uid(), 'admin'))
  WITH CHECK (public.has_role(auth.uid(), 'staff') OR public.has_role(auth.uid(), 'admin'));

CREATE POLICY "Public can read active seo_services"
  ON public.seo_services FOR SELECT
  TO anon, authenticated
  USING (active = true);

INSERT INTO public.seo_cities (slug, name, region, variation_index, nearby_slugs)
VALUES ('guaira', 'Guaíra', 'Oeste do Paraná', 4, ARRAY['cascavel','toledo','foz-do-iguacu','palotina'])
ON CONFLICT (slug) DO NOTHING;
