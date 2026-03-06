import { useState } from "react";
import { Plus, Trash2, Globe, MapPin, ExternalLink, Copy, CheckCircle2, AlertCircle, Info, Zap } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { useToast } from "@/hooks/use-toast";
import DashboardLayout from "@/components/DashboardLayout";
import { PARANA_CITIES, LEGAL_SERVICES, type CityData, type ServiceData } from "@/data/localSEOCities";

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

/* ------------------------------------------------------------------ */
/* Types                                                                */
/* ------------------------------------------------------------------ */
interface PendingCity extends Omit<CityData, "variationIndex" | "nearbySlug"> {
  region: string;
  isNew?: boolean;
}

interface PendingService extends Omit<ServiceData, "keyword"> {
  keyword: string;
  isNew?: boolean;
}

/* ------------------------------------------------------------------ */
/* Component                                                            */
/* ------------------------------------------------------------------ */
const SEOLocalManager = () => {
  const { toast } = useToast();

  /* --- Active tab --------------------------------------------------- */
  const [tab, setTab] = useState<"cities" | "services" | "preview">("cities");

  /* --- Cities state ------------------------------------------------- */
  const [cities, setCities] = useState<PendingCity[]>(
    PARANA_CITIES.map((c) => ({ slug: c.slug, name: c.name, region: c.region }))
  );
  const [newCity, setNewCity] = useState({ name: "", region: REGION_OPTIONS[0] });
  const [cityError, setCityError] = useState("");

  /* --- Services state ----------------------------------------------- */
  const [services, setServices] = useState<PendingService[]>(
    LEGAL_SERVICES.map((s) => ({ ...s }))
  );
  const [newService, setNewService] = useState({
    name: "", area: AREA_OPTIONS[0], icon: "⚖️",
  });
  const [serviceError, setServiceError] = useState("");

  /* --- Copied state -------------------------------------------------- */
  const [copied, setCopied] = useState(false);

  /* ------------------------------------------------------------------ */
  /* Add city                                                             */
  /* ------------------------------------------------------------------ */
  const addCity = () => {
    setCityError("");
    if (!newCity.name.trim()) { setCityError("Informe o nome da cidade."); return; }
    const slug = slugify(newCity.name);
    if (cities.some((c) => c.slug === slug)) {
      setCityError("Essa cidade já existe na lista."); return;
    }
    setCities((prev) => [...prev, { slug, name: newCity.name.trim(), region: newCity.region, isNew: true }]);
    setNewCity({ name: "", region: REGION_OPTIONS[0] });
    toast({ title: `Cidade "${newCity.name.trim()}" adicionada ✅`, description: "Adicione ao App.tsx para ativar as rotas." });
  };

  const removeCity = (slug: string) => {
    if (PARANA_CITIES.some((c) => c.slug === slug)) {
      toast({ title: "Cidade nativa", description: "Não é possível remover cidades nativas aqui.", variant: "destructive" }); return;
    }
    setCities((prev) => prev.filter((c) => c.slug !== slug));
  };

  /* ------------------------------------------------------------------ */
  /* Add service                                                          */
  /* ------------------------------------------------------------------ */
  const addService = () => {
    setServiceError("");
    if (!newService.name.trim()) { setServiceError("Informe o nome do serviço."); return; }
    const slug = slugify(newService.name);
    if (services.some((s) => s.slug === slug)) {
      setServiceError("Esse serviço já existe na lista."); return;
    }
    const keyword = slug;
    setServices((prev) => [
      ...prev,
      { slug, name: newService.name.trim(), shortName: newService.name.trim(), icon: newService.icon, keyword, area: newService.area, isNew: true },
    ]);
    setNewService({ name: "", area: AREA_OPTIONS[0], icon: "⚖️" });
    toast({ title: `Serviço "${newService.name.trim()}" adicionado ✅`, description: "Copie o código gerado e cole no App.tsx." });
  };

  const removeService = (slug: string) => {
    if (LEGAL_SERVICES.some((s) => s.slug === slug)) {
      toast({ title: "Serviço nativo", description: "Não é possível remover serviços nativos aqui.", variant: "destructive" }); return;
    }
    setServices((prev) => prev.filter((s) => s.slug !== slug));
  };

  /* ------------------------------------------------------------------ */
  /* Code generators                                                      */
  /* ------------------------------------------------------------------ */
  const newCities = cities.filter((c) => c.isNew);
  const newServices = services.filter((s) => s.isNew);

  const generateCityDataCode = () => {
    if (newCities.length === 0) return "// Nenhuma nova cidade adicionada.";
    return newCities
      .map((c) => `  { slug: "${c.slug}", name: "${c.name}", region: "${c.region}", variationIndex: 0 },`)
      .join("\n");
  };

  const generateAppRoutesCode = () => {
    if (newCities.length === 0 && newServices.length === 0) return "// Nenhuma rota nova gerada.";

    const cityList = newCities.map((c) => `"${c.slug}"`).join(",");
    const svcList = newServices.map((s) => `"${s.slug}"`).join(",");

    let code = "";

    if (newCities.length > 0) {
      code += `// ▸ Novas rotas de escritório por cidade\n`;
      code += `{[${cityList}].map((city) => (\n`;
      code += `  <Route key={city} path={\`/escritorio-advocacia-\${city}\`} element={<LocalAdvocaciaPage citySlugOverride={city} />} />\n`;
      code += `))}\n\n`;
    }

    if (newServices.length > 0) {
      const allCitySlugs = cities.map((c) => `"${c.slug}"`).join(",");
      code += `// ▸ Novas rotas de serviço × cidade\n`;
      code += `{([${svcList}] as const).flatMap((svc) =>\n`;
      code += `  [${allCitySlugs}].map((city) => (\n`;
      code += `    <Route key={\`\${svc}-\${city}\`} path={\`/advogado-\${svc}-\${city}\`} element={<ServiceLocalPage serviceSlug={svc} citySlug={city} />} />\n`;
      code += `  ))\n`;
      code += `)}\n`;
    }

    return code;
  };

  const generateLocalSEOCitiesEntry = () => {
    if (newCities.length === 0) return "";
    return `// Cole dentro de PARANA_CITIES em src/data/localSEOCities.ts:\n` + generateCityDataCode();
  };

  const fullCode = `/* ═══════════════════════════════════════════════════
   PASSO 1 — src/data/localSEOCities.ts
   Adicione dentro do array PARANA_CITIES:
═══════════════════════════════════════════════════ */
${generateCityDataCode()}

/* ═══════════════════════════════════════════════════
   PASSO 2 — src/App.tsx
   Adicione as rotas abaixo (antes do <Route path="*">):
═══════════════════════════════════════════════════ */
${generateAppRoutesCode()}`;

  const copyCode = async () => {
    await navigator.clipboard.writeText(fullCode);
    setCopied(true);
    setTimeout(() => setCopied(false), 2500);
    toast({ title: "Código copiado! ✅", description: "Cole nos arquivos indicados para ativar as rotas." });
  };

  /* ------------------------------------------------------------------ */
  /* Stats                                                                */
  /* ------------------------------------------------------------------ */
  const totalRoutes = cities.length * services.length + cities.length;
  const newRoutes = (newCities.length + newServices.length > 0)
    ? newCities.length * services.length + cities.length * newServices.length + newCities.length
    : 0;

  /* ------------------------------------------------------------------ */
  /* Render                                                               */
  /* ------------------------------------------------------------------ */
  return (
    <DashboardLayout title="SEO Programático — Hiperlocal">
      {/* Stats strip */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        {[
          { label: "Cidades Ativas", value: PARANA_CITIES.length, icon: MapPin, color: "text-accent" },
          { label: "Serviços Ativos", value: LEGAL_SERVICES.length, icon: Globe, color: "text-green-600" },
          { label: "Rotas Totais (atual)", value: totalRoutes, icon: Zap, color: "text-blue-600" },
          { label: "Novas Rotas Geradas", value: newRoutes, icon: Plus, color: "text-amber-600" },
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

      {/* Tabs */}
      <div className="flex gap-1 p-1 bg-muted rounded-lg mb-6 w-fit">
        {(["cities", "services", "preview"] as const).map((t) => (
          <button
            key={t}
            onClick={() => setTab(t)}
            className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${
              tab === t ? "bg-background text-foreground shadow-sm" : "text-muted-foreground hover:text-foreground"
            }`}
          >
            {t === "cities" ? `🏙️ Cidades (${cities.length})` : t === "services" ? `⚖️ Serviços (${services.length})` : "📋 Código Gerado"}
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

              <Button className="w-full bg-accent text-accent-foreground hover:bg-accent/90" onClick={addCity}>
                <Plus className="h-4 w-4 mr-2" /> Adicionar Cidade
              </Button>

              {/* Info */}
              <div className="p-3 bg-accent/5 rounded-lg border border-accent/20 text-xs text-muted-foreground space-y-1">
                <p className="flex items-start gap-1.5 font-medium text-foreground">
                  <Info className="h-3.5 w-3.5 text-accent shrink-0 mt-0.5" />
                  Como funciona
                </p>
                <p>Cada cidade gera automaticamente:</p>
                <ul className="ml-3 space-y-0.5">
                  <li>• <code>/escritorio-advocacia-{`{cidade}`}</code></li>
                  <li>• {services.length} páginas de serviço</li>
                </ul>
                <p>Após adicionar, copie o código na aba "Código Gerado".</p>
              </div>
            </CardContent>
          </Card>

          {/* City list */}
          <div className="lg:col-span-2">
            <Card className="border-0 shadow-card">
              <CardHeader>
                <CardTitle className="text-base">Cidades Cadastradas</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid sm:grid-cols-2 gap-2 max-h-[520px] overflow-y-auto pr-1">
                  {cities.map((city) => {
                    const isNative = PARANA_CITIES.some((c) => c.slug === city.slug);
                    return (
                      <div
                        key={city.slug}
                        className={`flex items-center justify-between gap-2 p-3 rounded-lg border transition-colors ${
                          city.isNew
                            ? "border-accent/50 bg-accent/5"
                            : "border-border bg-card"
                        }`}
                      >
                        <div className="min-w-0">
                          <div className="flex items-center gap-1.5">
                            <p className="font-medium text-sm text-foreground truncate">{city.name}</p>
                            {city.isNew && <Badge className="bg-accent/20 text-accent border-0 text-xs px-1.5">Nova</Badge>}
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
                          {!isNative && (
                            <button
                              onClick={() => removeCity(city.slug)}
                              className="p-1.5 rounded hover:bg-destructive/10 transition-colors text-muted-foreground hover:text-destructive"
                              title="Remover"
                            >
                              <Trash2 className="h-3.5 w-3.5" />
                            </button>
                          )}
                        </div>
                      </div>
                    );
                  })}
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      )}

      {/* ── SERVICES TAB ───────────────────────────────────── */}
      {tab === "services" && (
        <div className="grid lg:grid-cols-3 gap-6">
          {/* Add form */}
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

              <Button className="w-full bg-accent text-accent-foreground hover:bg-accent/90" onClick={addService}>
                <Plus className="h-4 w-4 mr-2" /> Adicionar Serviço
              </Button>

              <div className="p-3 bg-accent/5 rounded-lg border border-accent/20 text-xs text-muted-foreground space-y-1">
                <p className="flex items-start gap-1.5 font-medium text-foreground">
                  <Info className="h-3.5 w-3.5 text-accent shrink-0 mt-0.5" />
                  Como funciona
                </p>
                <p>Cada serviço gera <strong>{cities.length}</strong> páginas:</p>
                <p className="font-mono">/advogado-{`{serviço}`}-{`{cidade}`}</p>
                <p>Ex: <code>/advogado-inventario-extrajudicial-curitiba</code></p>
              </div>
            </CardContent>
          </Card>

          {/* Service list */}
          <div className="lg:col-span-2">
            <Card className="border-0 shadow-card">
              <CardHeader>
                <CardTitle className="text-base">Serviços Cadastrados</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-2 max-h-[520px] overflow-y-auto pr-1">
                  {services.map((svc) => {
                    const isNative = LEGAL_SERVICES.some((s) => s.slug === svc.slug);
                    return (
                      <div
                        key={svc.slug}
                        className={`flex items-center justify-between gap-3 p-3 rounded-lg border transition-colors ${
                          svc.isNew ? "border-accent/50 bg-accent/5" : "border-border bg-card"
                        }`}
                      >
                        <div className="flex items-center gap-3 min-w-0">
                          <span className="text-2xl shrink-0">{svc.icon}</span>
                          <div className="min-w-0">
                            <div className="flex items-center gap-1.5">
                              <p className="font-medium text-sm text-foreground">{svc.name}</p>
                              {svc.isNew && <Badge className="bg-accent/20 text-accent border-0 text-xs px-1.5">Novo</Badge>}
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
                          {!isNative && (
                            <button
                              onClick={() => removeService(svc.slug)}
                              className="p-1.5 rounded hover:bg-destructive/10 transition-colors text-muted-foreground hover:text-destructive"
                              title="Remover"
                            >
                              <Trash2 className="h-3.5 w-3.5" />
                            </button>
                          )}
                        </div>
                      </div>
                    );
                  })}
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      )}

      {/* ── CODE PREVIEW TAB ───────────────────────────────── */}
      {tab === "preview" && (
        <div className="space-y-6">
          {newCities.length === 0 && newServices.length === 0 ? (
            <Card className="border-0 shadow-card">
              <CardContent className="py-16 text-center">
                <CheckCircle2 className="h-12 w-12 text-muted-foreground/30 mx-auto mb-4" />
                <p className="text-muted-foreground font-medium">Nenhuma adição pendente.</p>
                <p className="text-sm text-muted-foreground mt-1">
                  Adicione cidades ou serviços nas outras abas para gerar o código.
                </p>
              </CardContent>
            </Card>
          ) : (
            <>
              {/* Summary */}
              <Card className="border-0 shadow-card bg-accent/5 border-accent/20">
                <CardContent className="p-5">
                  <div className="flex items-start gap-3">
                    <Zap className="h-5 w-5 text-accent shrink-0 mt-0.5" />
                    <div>
                      <p className="font-semibold text-foreground mb-1">Resumo das novas rotas</p>
                      <ul className="text-sm text-muted-foreground space-y-1">
                        {newCities.length > 0 && (
                          <li>• <strong>{newCities.length}</strong> nova(s) cidade(s): {newCities.map((c) => c.name).join(", ")}</li>
                        )}
                        {newServices.length > 0 && (
                          <li>• <strong>{newServices.length}</strong> novo(s) serviço(s): {newServices.map((s) => s.name).join(", ")}</li>
                        )}
                        <li>• <strong>{newRoutes}</strong> novas rotas SEO serão criadas</li>
                      </ul>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Steps */}
              <div className="grid lg:grid-cols-2 gap-4">
                <Card className="border-0 shadow-card">
                  <CardHeader className="pb-2">
                    <CardTitle className="text-sm flex items-center gap-2">
                      <span className="w-5 h-5 rounded-full bg-accent text-accent-foreground text-xs flex items-center justify-center font-bold">1</span>
                      Adicionar em <code className="text-xs bg-muted px-1 rounded">src/data/localSEOCities.ts</code>
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-xs text-muted-foreground mb-3">
                      Cole dentro do array <code>PARANA_CITIES</code>:
                    </p>
                    <pre className="bg-muted rounded-lg p-3 text-xs overflow-x-auto font-mono text-foreground">
                      {generateCityDataCode()}
                    </pre>
                  </CardContent>
                </Card>

                <Card className="border-0 shadow-card">
                  <CardHeader className="pb-2">
                    <CardTitle className="text-sm flex items-center gap-2">
                      <span className="w-5 h-5 rounded-full bg-accent text-accent-foreground text-xs flex items-center justify-center font-bold">2</span>
                      Adicionar em <code className="text-xs bg-muted px-1 rounded">src/App.tsx</code>
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-xs text-muted-foreground mb-3">
                      Cole antes de <code>{`<Route path="*" />`}</code>:
                    </p>
                    <pre className="bg-muted rounded-lg p-3 text-xs overflow-x-auto font-mono text-foreground whitespace-pre-wrap">
                      {generateAppRoutesCode()}
                    </pre>
                  </CardContent>
                </Card>
              </div>

              {/* Copy all */}
              <Button
                size="lg"
                className="w-full bg-accent text-accent-foreground hover:bg-accent/90"
                onClick={copyCode}
              >
                {copied ? (
                  <><CheckCircle2 className="h-5 w-5 mr-2" /> Código Copiado!</>
                ) : (
                  <><Copy className="h-5 w-5 mr-2" /> Copiar Todo o Código</>
                )}
              </Button>

              <p className="text-xs text-center text-muted-foreground">
                Após colar os trechos e salvar, as rotas serão criadas automaticamente no próximo build.
              </p>
            </>
          )}
        </div>
      )}
    </DashboardLayout>
  );
};

export default SEOLocalManager;
