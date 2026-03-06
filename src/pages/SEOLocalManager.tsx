import { useState, useEffect } from "react";
import { Plus, Trash2, Globe, MapPin, ExternalLink, CheckCircle2, AlertCircle, Info, Zap, RefreshCw, Rocket } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { useToast } from "@/hooks/use-toast";
import DashboardLayout from "@/components/DashboardLayout";
import { PARANA_CITIES, LEGAL_SERVICES } from "@/data/localSEOCities";
import { supabase } from "@/integrations/supabase/client";

/* ------------------------------------------------------------------ */
/* Helpers                                                              */
/* ------------------------------------------------------------------ */
function slugify(text: string): string {
  return text
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[^a-z0-9\s-]/g, "")
    .trim()
    .replace(/\s+/g, "-")
    .replace(/-+/g, "-");
}

const REGION_OPTIONS = [
  "Grande Curitiba",
  "Norte do Paraná",
  "Noroeste do Paraná",
  "Oeste do Paraná",
  "Centro do Paraná",
  "Centro-Sul do Paraná",
  "Sudoeste do Paraná",
  "Litoral do Paraná",
  "Norte Pioneiro do Paraná",
  "Centro-Oeste do Paraná",
];

const AREA_OPTIONS = [
  "Direito de Família",
  "Direito do Trabalho",
  "Direito Imobiliário",
  "Direito Civil",
  "Direito do Consumidor",
  "Direito Penal",
  "Direito Agrário",
  "Direito Tributário",
  "Direito Empresarial",
  "Direito Previdenciário",
];

const ICON_OPTIONS = [
  "⚖️","👨‍👩‍👧","🏠","🚗","🌾","📋","💼","🏛️","📜","🤝","💰","🩺","🚌","💻","🏗️",
];

interface DbCity {
  id: string;
  slug: string;
  name: string;
  region: string;
  active: boolean;
}

interface DbService {
  id: string;
  slug: string;
  name: string;
  short_name: string;
  icon: string;
  keyword: string;
  area: string;
  active: boolean;
}

/* ------------------------------------------------------------------ */
/* Component                                                            */
/* ------------------------------------------------------------------ */
const SEOLocalManager = () => {
  const { toast } = useToast();

  const [tab, setTab] = useState<"cities" | "services">("cities");

  /* --- Dynamic cities from DB ---------------------------------------- */
  const [dbCities, setDbCities] = useState<DbCity[]>([]);
  const [dbServices, setDbServices] = useState<DbService[]>([]);
  const [loadingDb, setLoadingDb] = useState(true);

  /* --- Form state --------------------------------------------------- */
  const [newCity, setNewCity] = useState({ name: "", region: REGION_OPTIONS[3] });
  const [cityError, setCityError] = useState("");
  const [savingCity, setSavingCity] = useState(false);

  const [newService, setNewService] = useState({ name: "", area: AREA_OPTIONS[0], icon: "⚖️" });
  const [serviceError, setServiceError] = useState("");
  const [savingService, setSavingService] = useState(false);

  /* --- Load dynamic data from DB ------------------------------------ */
  const loadDbData = async () => {
    setLoadingDb(true);
    const [citiesRes, servicesRes] = await Promise.all([
      supabase.from("seo_cities" as any).select("*").order("created_at"),
      supabase.from("seo_services" as any).select("*").order("created_at"),
    ]);
    setDbCities((citiesRes.data || []) as unknown as DbCity[]);
    setDbServices((servicesRes.data || []) as unknown as DbService[]);
    setLoadingDb(false);
  };

  useEffect(() => { loadDbData(); }, []);

  /* --- All cities (native + dynamic) -------------------------------- */
  const nativeCitySlugs = new Set(PARANA_CITIES.map((c) => c.slug));
  const nativeServiceSlugs = new Set(LEGAL_SERVICES.map((s) => s.slug));

  const allCities = [
    ...PARANA_CITIES.map((c) => ({ slug: c.slug, name: c.name, region: c.region, isDynamic: false })),
    ...dbCities.filter((c) => !nativeCitySlugs.has(c.slug)).map((c) => ({ slug: c.slug, name: c.name, region: c.region, isDynamic: true, id: c.id })),
  ];

  const allServices = [
    ...LEGAL_SERVICES.map((s) => ({ slug: s.slug, name: s.name, icon: s.icon, area: s.area, isDynamic: false })),
    ...dbServices.filter((s) => !nativeServiceSlugs.has(s.slug)).map((s) => ({ slug: s.slug, name: s.name, icon: s.icon, area: s.area, isDynamic: true, id: s.id })),
  ];

  const totalRoutes = allCities.length * allServices.length + allCities.length;

  /* ------------------------------------------------------------------ */
  /* Add city — saves directly to DB                                     */
  /* ------------------------------------------------------------------ */
  const addCity = async () => {
    setCityError("");
    if (!newCity.name.trim()) { setCityError("Informe o nome da cidade."); return; }
    const slug = slugify(newCity.name);
    if (allCities.some((c) => c.slug === slug)) {
      setCityError("Essa cidade já existe na lista."); return;
    }
    setSavingCity(true);
    try {
      const { error } = await supabase.from("seo_cities" as any).insert({
        slug,
        name: newCity.name.trim(),
        region: newCity.region,
        variation_index: dbCities.length % 5,
        nearby_slugs: [],
        active: true,
      });
      if (error) throw error;
      await loadDbData();
      setNewCity({ name: "", region: REGION_OPTIONS[3] });
      toast({
        title: `✅ ${newCity.name.trim()} adicionada!`,
        description: `As páginas /escritorio-advocacia-${slug} e /advogado-*-${slug} já estão ativas.`,
      });
    } catch (e: any) {
      setCityError(e.message || "Erro ao salvar.");
    } finally {
      setSavingCity(false);
    }
  };

  /* ------------------------------------------------------------------ */
  /* Remove city                                                          */
  /* ------------------------------------------------------------------ */
  const removeCity = async (city: { slug: string; isDynamic: boolean; id?: string }) => {
    if (!city.isDynamic) {
      toast({ title: "Cidade nativa", description: "Não é possível remover cidades nativas.", variant: "destructive" });
      return;
    }
    await supabase.from("seo_cities" as any).delete().eq("id", city.id);
    await loadDbData();
    toast({ title: `Cidade removida`, description: city.slug });
  };

  /* ------------------------------------------------------------------ */
  /* Add service — saves directly to DB                                  */
  /* ------------------------------------------------------------------ */
  const addService = async () => {
    setServiceError("");
    if (!newService.name.trim()) { setServiceError("Informe o nome do serviço."); return; }
    const slug = slugify(newService.name);
    if (allServices.some((s) => s.slug === slug)) {
      setServiceError("Esse serviço já existe."); return;
    }
    setSavingService(true);
    try {
      const { error } = await supabase.from("seo_services" as any).insert({
        slug,
        name: newService.name.trim(),
        short_name: newService.name.trim(),
        icon: newService.icon,
        keyword: slug,
        area: newService.area,
        active: true,
      });
      if (error) throw error;
      await loadDbData();
      setNewService({ name: "", area: AREA_OPTIONS[0], icon: "⚖️" });
      toast({
        title: `✅ Serviço "${newService.name.trim()}" adicionado!`,
        description: `${allCities.length} páginas /advogado-${slug}-{cidade} já estão ativas.`,
      });
    } catch (e: any) {
      setServiceError(e.message || "Erro ao salvar.");
    } finally {
      setSavingService(false);
    }
  };

  const removeService = async (svc: { slug: string; isDynamic: boolean; id?: string }) => {
    if (!svc.isDynamic) {
      toast({ title: "Serviço nativo", description: "Não é possível remover serviços nativos.", variant: "destructive" });
      return;
    }
    await supabase.from("seo_services" as any).delete().eq("id", svc.id);
    await loadDbData();
    toast({ title: `Serviço removido`, description: svc.slug });
  };

  /* ------------------------------------------------------------------ */
  /* Render                                                               */
  /* ------------------------------------------------------------------ */
  return (
    <DashboardLayout title="SEO Programático — Hiperlocal">
      {/* Stats strip */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        {[
          { label: "Cidades Ativas", value: allCities.length, icon: MapPin, color: "text-accent" },
          { label: "Serviços Ativos", value: allServices.length, icon: Globe, color: "text-green-600" },
          { label: "Rotas Totais", value: totalRoutes, icon: Zap, color: "text-blue-600" },
          { label: "Cidades Dinâmicas", value: dbCities.filter((c) => !nativeCitySlugs.has(c.slug)).length, icon: Rocket, color: "text-amber-600" },
        ].map(({ label, value, icon: Icon, color }) => (
          <Card key={label} className="border-0 shadow-card">
            <CardContent className="p-5 flex items-center gap-3">
              <div className="p-2.5 bg-accent/10 rounded-lg">
                <Icon className={`h-5 w-5 ${color}`} />
              </div>
              <div>
                <p className="text-xl font-bold text-foreground">{value}</p>
                <p className="text-xs text-muted-foreground">{label}</p>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* How it works banner */}
      <Card className="border-0 shadow-card bg-primary/5 border-primary/20 mb-6">
        <CardContent className="p-4 flex items-start gap-3">
          <Rocket className="h-5 w-5 text-primary shrink-0 mt-0.5" />
          <div>
            <p className="font-semibold text-foreground text-sm">Totalmente automático</p>
            <p className="text-xs text-muted-foreground mt-0.5">
              Ao adicionar uma cidade ou serviço, as páginas SEO são criadas <strong>instantaneamente</strong> — sem copiar código, sem reiniciar o sistema.
            </p>
          </div>
        </CardContent>
      </Card>

      {/* Tabs */}
      <div className="flex gap-1 p-1 bg-muted rounded-lg mb-6 w-fit">
        {(["cities", "services"] as const).map((t) => (
          <button
            key={t}
            onClick={() => setTab(t)}
            className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${
              tab === t ? "bg-background text-foreground shadow-sm" : "text-muted-foreground hover:text-foreground"
            }`}
          >
            {t === "cities" ? `🏙️ Cidades (${allCities.length})` : `⚖️ Serviços (${allServices.length})`}
          </button>
        ))}
      </div>

      {/* ── CITIES TAB ─────────────────────────────────────── */}
      {tab === "cities" && (
        <div className="grid lg:grid-cols-3 gap-6">
          {/* Add form */}
          <Card className="border-0 shadow-card">
            <CardHeader>
              <CardTitle className="text-base flex items-center gap-2">
                <Plus className="h-4 w-4 text-accent" /> Adicionar Nova Cidade
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-1.5">
                <Label htmlFor="city-name">Nome da Cidade *</Label>
                <Input
                  id="city-name"
                  placeholder="Ex: Marechal Cândido Rondon"
                  value={newCity.name}
                  onChange={(e) => { setNewCity((p) => ({ ...p, name: e.target.value })); setCityError(""); }}
                  onKeyDown={(e) => e.key === "Enter" && addCity()}
                />
                {newCity.name && (
                  <p className="text-xs text-muted-foreground">
                    Slug: <code className="bg-muted px-1 rounded">{slugify(newCity.name)}</code>
                  </p>
                )}
              </div>

              <div className="space-y-1.5">
                <Label htmlFor="city-region">Região</Label>
                <select
                  id="city-region"
                  value={newCity.region}
                  onChange={(e) => setNewCity((p) => ({ ...p, region: e.target.value }))}
                  className="w-full border border-border rounded-md px-3 py-2 text-sm bg-background text-foreground"
                >
                  {REGION_OPTIONS.map((r) => <option key={r}>{r}</option>)}
                </select>
              </div>

              {cityError && (
                <p className="text-xs text-destructive flex items-center gap-1">
                  <AlertCircle className="h-3 w-3" /> {cityError}
                </p>
              )}

              <Button
                className="w-full bg-accent text-accent-foreground hover:bg-accent/90"
                onClick={addCity}
                disabled={savingCity}
              >
                {savingCity ? (
                  <><RefreshCw className="h-4 w-4 mr-2 animate-spin" /> Salvando…</>
                ) : (
                  <><Plus className="h-4 w-4 mr-2" /> Adicionar Cidade</>
                )}
              </Button>

              <div className="p-3 bg-accent/5 rounded-lg border border-accent/20 text-xs text-muted-foreground space-y-1">
                <p className="flex items-start gap-1.5 font-medium text-foreground">
                  <Info className="h-3.5 w-3.5 text-accent shrink-0 mt-0.5" />
                  O que é criado automaticamente
                </p>
                <ul className="ml-3 space-y-0.5">
                  <li>• <code>/escritorio-advocacia-{`{cidade}`}</code></li>
                  <li>• {allServices.length} páginas de serviço × cidade</li>
                </ul>
                <p className="font-medium text-foreground mt-1">Sem copiar código. Instantâneo. ✅</p>
              </div>
            </CardContent>
          </Card>

          {/* City list */}
          <div className="lg:col-span-2">
            <Card className="border-0 shadow-card">
              <CardHeader className="flex flex-row items-center justify-between">
                <CardTitle className="text-base">Cidades Cadastradas</CardTitle>
                <Button variant="ghost" size="sm" onClick={loadDbData} disabled={loadingDb}>
                  <RefreshCw className={`h-4 w-4 ${loadingDb ? "animate-spin" : ""}`} />
                </Button>
              </CardHeader>
              <CardContent>
                <div className="grid sm:grid-cols-2 gap-2 max-h-[520px] overflow-y-auto pr-1">
                  {allCities.map((city) => (
                    <div
                      key={city.slug}
                      className={`flex items-center justify-between gap-2 p-3 rounded-lg border transition-colors ${
                        city.isDynamic
                          ? "border-accent/50 bg-accent/5"
                          : "border-border bg-card"
                      }`}
                    >
                      <div className="min-w-0">
                        <div className="flex items-center gap-1.5">
                          <p className="font-medium text-sm text-foreground truncate">{city.name}</p>
                          {city.isDynamic && (
                            <Badge className="bg-accent/20 text-accent border-0 text-xs px-1.5">Dinâmica</Badge>
                          )}
                        </div>
                        <p className="text-xs text-muted-foreground truncate">{city.region}</p>
                        <p className="text-xs font-mono text-muted-foreground/70">/{city.slug}</p>
                      </div>
                      <div className="flex items-center gap-1 shrink-0">
                        <a
                          href={`/escritorio-advocacia-${city.slug}`}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="p-1.5 rounded hover:bg-muted transition-colors text-muted-foreground hover:text-foreground"
                          title="Abrir página"
                        >
                          <ExternalLink className="h-3.5 w-3.5" />
                        </a>
                        {city.isDynamic && (
                          <button
                            onClick={() => removeCity(city as any)}
                            className="p-1.5 rounded hover:bg-destructive/10 transition-colors text-muted-foreground hover:text-destructive"
                            title="Remover"
                          >
                            <Trash2 className="h-3.5 w-3.5" />
                          </button>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      )}

      {/* ── SERVICES TAB ───────────────────────────────────── */}
      {tab === "services" && (
        <div className="grid lg:grid-cols-3 gap-6">
          <Card className="border-0 shadow-card">
            <CardHeader>
              <CardTitle className="text-base flex items-center gap-2">
                <Plus className="h-4 w-4 text-accent" /> Adicionar Novo Serviço
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-1.5">
                <Label htmlFor="svc-name">Nome do Serviço *</Label>
                <Input
                  id="svc-name"
                  placeholder="Ex: Inventário Extrajudicial"
                  value={newService.name}
                  onChange={(e) => { setNewService((p) => ({ ...p, name: e.target.value })); setServiceError(""); }}
                  onKeyDown={(e) => e.key === "Enter" && addService()}
                />
                {newService.name && (
                  <p className="text-xs text-muted-foreground">
                    URL: <code className="bg-muted px-1 rounded">/advogado-{slugify(newService.name)}-curitiba</code>
                  </p>
                )}
              </div>

              <div className="space-y-1.5">
                <Label htmlFor="svc-area">Área do Direito</Label>
                <select
                  id="svc-area"
                  value={newService.area}
                  onChange={(e) => setNewService((p) => ({ ...p, area: e.target.value }))}
                  className="w-full border border-border rounded-md px-3 py-2 text-sm bg-background text-foreground"
                >
                  {AREA_OPTIONS.map((a) => <option key={a}>{a}</option>)}
                </select>
              </div>

              <div className="space-y-1.5">
                <Label>Ícone</Label>
                <div className="flex flex-wrap gap-2">
                  {ICON_OPTIONS.map((icon) => (
                    <button
                      key={icon}
                      onClick={() => setNewService((p) => ({ ...p, icon }))}
                      className={`text-xl p-1.5 rounded-lg border-2 transition-colors ${
                        newService.icon === icon ? "border-accent bg-accent/10" : "border-border hover:border-accent/40"
                      }`}
                    >
                      {icon}
                    </button>
                  ))}
                </div>
              </div>

              {serviceError && (
                <p className="text-xs text-destructive flex items-center gap-1">
                  <AlertCircle className="h-3 w-3" /> {serviceError}
                </p>
              )}

              <Button
                className="w-full bg-accent text-accent-foreground hover:bg-accent/90"
                onClick={addService}
                disabled={savingService}
              >
                {savingService ? (
                  <><RefreshCw className="h-4 w-4 mr-2 animate-spin" /> Salvando…</>
                ) : (
                  <><Plus className="h-4 w-4 mr-2" /> Adicionar Serviço</>
                )}
              </Button>

              <div className="p-3 bg-accent/5 rounded-lg border border-accent/20 text-xs text-muted-foreground space-y-1">
                <p className="flex items-start gap-1.5 font-medium text-foreground">
                  <Info className="h-3.5 w-3.5 text-accent shrink-0 mt-0.5" />
                  O que é criado automaticamente
                </p>
                <p>Cada serviço gera <strong>{allCities.length}</strong> páginas:</p>
                <p className="font-mono">/advogado-{`{serviço}`}-{`{cidade}`}</p>
                <p className="font-medium text-foreground mt-1">Sem copiar código. Instantâneo. ✅</p>
              </div>
            </CardContent>
          </Card>

          <div className="lg:col-span-2">
            <Card className="border-0 shadow-card">
              <CardHeader className="flex flex-row items-center justify-between">
                <CardTitle className="text-base">Serviços Cadastrados</CardTitle>
                <Button variant="ghost" size="sm" onClick={loadDbData} disabled={loadingDb}>
                  <RefreshCw className={`h-4 w-4 ${loadingDb ? "animate-spin" : ""}`} />
                </Button>
              </CardHeader>
              <CardContent>
                <div className="space-y-2 max-h-[520px] overflow-y-auto pr-1">
                  {allServices.map((svc) => (
                    <div
                      key={svc.slug}
                      className={`flex items-center justify-between gap-3 p-3 rounded-lg border transition-colors ${
                        svc.isDynamic ? "border-accent/50 bg-accent/5" : "border-border bg-card"
                      }`}
                    >
                      <div className="flex items-center gap-3 min-w-0">
                        <span className="text-2xl shrink-0">{svc.icon}</span>
                        <div className="min-w-0">
                          <div className="flex items-center gap-1.5">
                            <p className="font-medium text-sm text-foreground">{svc.name}</p>
                            {svc.isDynamic && (
                              <Badge className="bg-accent/20 text-accent border-0 text-xs px-1.5">Dinâmico</Badge>
                            )}
                          </div>
                          <p className="text-xs text-muted-foreground">{svc.area}</p>
                          <p className="text-xs font-mono text-muted-foreground/70">/advogado-{svc.slug}-{"{cidade}"}</p>
                        </div>
                      </div>
                      <div className="flex items-center gap-1 shrink-0">
                        <a
                          href={`/advogado-${svc.slug}-curitiba`}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="p-1.5 rounded hover:bg-muted transition-colors text-muted-foreground hover:text-foreground"
                          title="Abrir exemplo Curitiba"
                        >
                          <ExternalLink className="h-3.5 w-3.5" />
                        </a>
                        {svc.isDynamic && (
                          <button
                            onClick={() => removeService(svc as any)}
                            className="p-1.5 rounded hover:bg-destructive/10 transition-colors text-muted-foreground hover:text-destructive"
                            title="Remover"
                          >
                            <Trash2 className="h-3.5 w-3.5" />
                          </button>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      )}
    </DashboardLayout>
  );
};

export default SEOLocalManager;
