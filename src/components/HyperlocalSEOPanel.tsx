import { useState } from "react";
import { Plus, Trash2, Globe, MapPin, Copy, CheckCircle2, AlertCircle, Zap, ArrowUpRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Link } from "react-router-dom";
import { useToast } from "@/hooks/use-toast";
import { PARANA_CITIES, LEGAL_SERVICES, getServiceCitySlug, type CityData, type ServiceData } from "@/data/localSEOCities";

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
  "Grande Curitiba", "Norte do Paraná", "Noroeste do Paraná", "Oeste do Paraná",
  "Centro do Paraná", "Centro-Sul do Paraná", "Sudoeste do Paraná",
  "Litoral do Paraná", "Norte Pioneiro do Paraná", "Centro-Oeste do Paraná",
];

const AREA_OPTIONS = [
  "Direito de Família", "Direito do Trabalho", "Direito Imobiliário", "Direito Civil",
  "Direito do Consumidor", "Direito Penal", "Direito Agrário", "Direito Tributário",
  "Direito Empresarial", "Direito Previdenciário",
];

const ICON_OPTIONS = ["⚖️", "👨‍👩‍👧", "🏠", "🚗", "🌾", "📋", "💼", "🏛️", "📜", "🤝", "💰", "🩺", "🚌", "💻", "🏗️"];

interface PendingCity extends Omit<CityData, "variationIndex" | "nearbySlug"> {
  isNew?: boolean;
}

interface PendingService extends ServiceData {
  isNew?: boolean;
}

export const HyperlocalSEOPanel = () => {
  const { toast } = useToast();

  const [subtab, setSubtab] = useState<"overview" | "cities" | "services" | "code">("overview");

  /* Cities */
  const [cities, setCities] = useState<PendingCity[]>(
    PARANA_CITIES.map((c) => ({ slug: c.slug, name: c.name, region: c.region }))
  );
  const [newCity, setNewCity] = useState({ name: "", region: REGION_OPTIONS[0] });
  const [cityError, setCityError] = useState("");

  /* Services */
  const [services, setServices] = useState<PendingService[]>(
    LEGAL_SERVICES.map((s) => ({ ...s }))
  );
  const [newService, setNewService] = useState({ name: "", area: AREA_OPTIONS[0], icon: "⚖️" });
  const [serviceError, setServiceError] = useState("");

  const [copied, setCopied] = useState(false);

  /* ---- Add city ---------------------------------------------------- */
  const addCity = () => {
    setCityError("");
    if (!newCity.name.trim()) { setCityError("Informe o nome da cidade."); return; }
    const slug = slugify(newCity.name);
    if (cities.some((c) => c.slug === slug)) { setCityError("Essa cidade já existe."); return; }
    setCities((prev) => [...prev, { slug, name: newCity.name.trim(), region: newCity.region, isNew: true }]);
    setNewCity({ name: "", region: REGION_OPTIONS[0] });
    toast({ title: `Cidade "${newCity.name.trim()}" adicionada ✅`, description: "Copie o código gerado para ativar as rotas." });
  };

  const removeCity = (slug: string) => {
    if (PARANA_CITIES.some((c) => c.slug === slug)) {
      toast({ title: "Cidade nativa", description: "Não é possível remover cidades nativas.", variant: "destructive" }); return;
    }
    setCities((prev) => prev.filter((c) => c.slug !== slug));
  };

  /* ---- Add service ------------------------------------------------- */
  const addService = () => {
    setServiceError("");
    if (!newService.name.trim()) { setServiceError("Informe o nome do serviço."); return; }
    const slug = slugify(newService.name);
    if (services.some((s) => s.slug === slug)) { setServiceError("Esse serviço já existe."); return; }
    setServices((prev) => [
      ...prev,
      { slug, name: newService.name.trim(), shortName: newService.name.trim(), icon: newService.icon, keyword: slug, area: newService.area, isNew: true },
    ]);
    setNewService({ name: "", area: AREA_OPTIONS[0], icon: "⚖️" });
    toast({ title: `Serviço "${newService.name.trim()}" adicionado ✅`, description: "Copie o código gerado para ativar as rotas." });
  };

  const removeService = (slug: string) => {
    if (LEGAL_SERVICES.some((s) => s.slug === slug)) {
      toast({ title: "Serviço nativo", description: "Não é possível remover serviços nativos.", variant: "destructive" }); return;
    }
    setServices((prev) => prev.filter((s) => s.slug !== slug));
  };

  /* ---- Code generator ---------------------------------------------- */
  const newCities = cities.filter((c) => c.isNew);
  const newServices = services.filter((s) => s.isNew);

  const generateCode = () => {
    if (newCities.length === 0 && newServices.length === 0) return "// Nenhuma cidade ou serviço novo adicionado ainda.";

    const cityEntries = newCities.map((c) =>
      `  { slug: "${c.slug}", name: "${c.name}", region: "${c.region}", variationIndex: 0 },`
    ).join("\n");

    const cityList = newCities.map((c) => `"${c.slug}"`).join(", ");
    const svcList = newServices.map((s) => `"${s.slug}"`).join(", ");
    const allCitySlugs = cities.map((c) => `"${c.slug}"`).join(", ");

    let code = "";

    if (newCities.length > 0) {
      code += `/* PASSO 1 — Adicione em src/data/localSEOCities.ts dentro de PARANA_CITIES: */\n`;
      code += `${cityEntries}\n\n`;
      code += `/* PASSO 2 — Adicione em src/App.tsx (antes do <Route path="*">): */\n`;
      code += `{[${cityList}].map((city) => (\n`;
      code += `  <Route key={city} path={\`/escritorio-advocacia-\${city}\`} element={<LocalAdvocaciaPage citySlugOverride={city} />} />\n`;
      code += `))}\n`;
      if (newServices.length > 0) code += "\n";
    }

    if (newServices.length > 0) {
      if (newCities.length === 0) code += `/* PASSO 1 — Adicione em src/App.tsx (antes do <Route path="*">): */\n`;
      code += `{([${svcList}] as const).flatMap((svc) =>\n`;
      code += `  [${allCitySlugs}].map((city) => (\n`;
      code += `    <Route key={\`\${svc}-\${city}\`} path={\`/advogado-\${svc}-\${city}\`} element={<ServiceLocalPage serviceSlug={svc} citySlug={city} />} />\n`;
      code += `  ))\n`;
      code += `)}\n`;
    }

    return code;
  };

  const copyCode = async () => {
    await navigator.clipboard.writeText(generateCode());
    setCopied(true);
    setTimeout(() => setCopied(false), 2500);
    toast({ title: "Código copiado! ✅" });
  };

  const totalRoutes = PARANA_CITIES.length * LEGAL_SERVICES.length + PARANA_CITIES.length;
  const newRoutes = newCities.length * services.length + cities.length * newServices.length + newCities.length;

  return (
    <div className="space-y-6">
      {/* Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {[
          { label: "Cidades ativas", value: PARANA_CITIES.length, icon: MapPin, color: "text-accent" },
          { label: "Serviços ativos", value: LEGAL_SERVICES.length, icon: Globe, color: "text-green-600" },
          { label: "Rotas totais", value: totalRoutes, icon: Zap, color: "text-blue-600" },
          { label: "Novas rotas pendentes", value: newRoutes, icon: Plus, color: "text-amber-600" },
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

      {/* Sub-tabs */}
      <div className="flex gap-1 p-1 bg-muted rounded-lg w-fit">
        {(["overview", "cities", "services", "code"] as const).map((t) => (
          <button
            key={t}
            onClick={() => setSubtab(t)}
            className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${
              subtab === t ? "bg-background text-foreground shadow-sm" : "text-muted-foreground hover:text-foreground"
            }`}
          >
            {t === "overview" ? "📊 Visão Geral"
              : t === "cities" ? `🏙️ Cidades (${cities.length})`
              : t === "services" ? `⚖️ Serviços (${services.length})`
              : "📋 Código"}
          </button>
        ))}
      </div>

      {/* ── Overview ── */}
      {subtab === "overview" && (
        <Card className="border-0 shadow-card">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <MapPin className="h-5 w-5 text-accent" />
              Cidades e Páginas de Serviço
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="mb-4">
              <p className="text-sm text-muted-foreground mb-3">
                Serviços disponíveis:
              </p>
              <div className="flex flex-wrap gap-2 mb-6">
                {LEGAL_SERVICES.map((svc) => (
                  <Badge key={svc.slug} variant="secondary" className="text-xs">
                    {svc.icon} {svc.name}
                  </Badge>
                ))}
              </div>
            </div>
            <div className="space-y-2 max-h-96 overflow-y-auto pr-1">
              {PARANA_CITIES.map((city) => (
                <div key={city.slug} className="border border-border rounded-lg p-3 hover:border-accent/40 transition-colors">
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center gap-2">
                      <MapPin className="h-3.5 w-3.5 text-accent" />
                      <span className="font-medium text-sm text-foreground">{city.name}</span>
                      <span className="text-xs text-muted-foreground">· {city.region}</span>
                    </div>
                    <Link
                      to={`/escritorio-advocacia-${city.slug}`}
                      target="_blank"
                      className="text-xs text-accent hover:underline flex items-center gap-1"
                    >
                      Página geral <ArrowUpRight className="h-3 w-3" />
                    </Link>
                  </div>
                  <div className="flex flex-wrap gap-1.5">
                    {LEGAL_SERVICES.map((svc) => (
                      <Link
                        key={svc.slug}
                        to={`/${getServiceCitySlug(svc.slug, city.slug)}`}
                        target="_blank"
                        className="text-xs bg-muted hover:bg-accent/10 hover:text-accent text-muted-foreground px-2 py-0.5 rounded transition-colors"
                      >
                        {svc.icon} {svc.shortName}
                      </Link>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {/* ── Cities ── */}
      {subtab === "cities" && (
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
                <Label htmlFor="hl-city-name">Nome da Cidade *</Label>
                <Input
                  id="hl-city-name"
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
                <Label htmlFor="hl-city-region">Região</Label>
                <select
                  id="hl-city-region"
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
              <p className="text-xs text-muted-foreground bg-muted/50 rounded-lg p-3">
                💡 Após adicionar, acesse a aba <strong>Código</strong> e copie o trecho para ativar as rotas.
              </p>
            </CardContent>
          </Card>

          {/* Cities list */}
          <Card className="border-0 shadow-card lg:col-span-2">
            <CardHeader>
              <CardTitle className="text-base">Cidades Cadastradas ({cities.length})</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-2 max-h-[480px] overflow-y-auto pr-1">
                {cities.map((city) => (
                  <div key={city.slug} className="flex items-center justify-between border border-border rounded-lg px-3 py-2.5 hover:border-accent/40 transition-colors">
                    <div className="flex items-center gap-3">
                      <MapPin className="h-3.5 w-3.5 text-accent shrink-0" />
                      <div>
                        <p className="text-sm font-medium text-foreground">{city.name}</p>
                        <p className="text-xs text-muted-foreground">{city.region} · <code className="bg-muted px-0.5 rounded">{city.slug}</code></p>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      {city.isNew && (
                        <Badge className="bg-green-100 text-green-800 border-0 text-xs">Nova</Badge>
                      )}
                      <Button
                        variant="ghost"
                        size="sm"
                        className="h-7 w-7 p-0 text-muted-foreground hover:text-destructive"
                        onClick={() => removeCity(city.slug)}
                      >
                        <Trash2 className="h-3.5 w-3.5" />
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>
      )}

      {/* ── Services ── */}
      {subtab === "services" && (
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
                <Label htmlFor="hl-svc-name">Nome do Serviço *</Label>
                <Input
                  id="hl-svc-name"
                  placeholder="Ex: Inventário Extrajudicial"
                  value={newService.name}
                  onChange={(e) => { setNewService((p) => ({ ...p, name: e.target.value })); setServiceError(""); }}
                  onKeyDown={(e) => e.key === "Enter" && addService()}
                />
                {newService.name && (
                  <p className="text-xs text-muted-foreground">
                    Slug: <code className="bg-muted px-1 rounded">/advogado-{slugify(newService.name)}-curitiba</code>
                  </p>
                )}
              </div>
              <div className="space-y-1.5">
                <Label htmlFor="hl-svc-area">Área do Direito</Label>
                <select
                  id="hl-svc-area"
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
                      className={`text-xl p-1.5 rounded-md border transition-colors ${
                        newService.icon === icon ? "border-accent bg-accent/10" : "border-border hover:border-accent/50"
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
            </CardContent>
          </Card>

          {/* Services list */}
          <Card className="border-0 shadow-card lg:col-span-2">
            <CardHeader>
              <CardTitle className="text-base">Serviços Cadastrados ({services.length})</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-2 max-h-[480px] overflow-y-auto pr-1">
                {services.map((svc) => (
                  <div key={svc.slug} className="flex items-center justify-between border border-border rounded-lg px-3 py-2.5 hover:border-accent/40 transition-colors">
                    <div className="flex items-center gap-3">
                      <span className="text-xl">{svc.icon}</span>
                      <div>
                        <p className="text-sm font-medium text-foreground">{svc.name}</p>
                        <p className="text-xs text-muted-foreground">{svc.area} · <code className="bg-muted px-0.5 rounded">{svc.slug}</code></p>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      {svc.isNew && (
                        <Badge className="bg-green-100 text-green-800 border-0 text-xs">Novo</Badge>
                      )}
                      <Button
                        variant="ghost"
                        size="sm"
                        className="h-7 w-7 p-0 text-muted-foreground hover:text-destructive"
                        onClick={() => removeService(svc.slug)}
                      >
                        <Trash2 className="h-3.5 w-3.5" />
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>
      )}

      {/* ── Code ── */}
      {subtab === "code" && (
        <Card className="border-0 shadow-card">
          <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle className="flex items-center gap-2">
              📋 Código para Ativar as Rotas
              {(newCities.length > 0 || newServices.length > 0) && (
                <Badge className="bg-amber-100 text-amber-800 border-0 text-xs ml-2">
                  {newCities.length + newServices.length} pendente(s)
                </Badge>
              )}
            </CardTitle>
            <Button
              variant="outline"
              size="sm"
              onClick={copyCode}
              disabled={newCities.length === 0 && newServices.length === 0}
              className="flex items-center gap-2"
            >
              {copied ? <CheckCircle2 className="h-4 w-4 text-green-500" /> : <Copy className="h-4 w-4" />}
              {copied ? "Copiado!" : "Copiar Código"}
            </Button>
          </CardHeader>
          <CardContent>
            {newCities.length === 0 && newServices.length === 0 ? (
              <div className="text-center py-12 text-muted-foreground">
                <Globe className="h-10 w-10 mx-auto mb-3 opacity-30" />
                <p className="text-sm">Adicione cidades ou serviços nas abas anteriores para gerar o código.</p>
              </div>
            ) : (
              <>
                <p className="text-sm text-muted-foreground mb-4">
                  Copie o código abaixo e cole nos arquivos indicados para ativar as {newRoutes} nova(s) rota(s):
                </p>
                <pre className="bg-muted rounded-lg p-4 text-xs overflow-x-auto whitespace-pre-wrap font-mono text-foreground border border-border">
                  {generateCode()}
                </pre>
              </>
            )}
          </CardContent>
        </Card>
      )}
    </div>
  );
};
