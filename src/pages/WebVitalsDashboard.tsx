import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import DashboardLayout from "@/components/DashboardLayout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Activity, Gauge, MapPin, Monitor, TrendingUp } from "lucide-react";

// ─── types ────────────────────────────────────────────────────────────────────

interface VitalRow {
  metric_name: string;
  metric_value: number;
  metric_rating: string;
  page_path: string;
  city_slug: string | null;
  device_type: string | null;
  created_at: string;
}

interface CityStats {
  city_slug: string;
  lcp_p75: number;
  fcp_p75: number;
  cls_p75: number;
  inp_p75: number;
  samples: number;
}

interface MetricSummary {
  name: string;
  p75: number;
  rating: string;
  good: number;
  needs_improvement: number;
  poor: number;
}

// ─── helpers ─────────────────────────────────────────────────────────────────

const RATING_COLORS: Record<string, string> = {
  good: "bg-emerald-100 text-emerald-800 border-emerald-200",
  "needs-improvement": "bg-amber-100 text-amber-800 border-amber-200",
  poor: "bg-red-100 text-red-800 border-red-200",
};

const METRIC_LABELS: Record<string, { label: string; unit: string; good: number; poor: number }> = {
  LCP: { label: "Largest Contentful Paint", unit: "ms", good: 2500, poor: 4000 },
  FCP: { label: "First Contentful Paint", unit: "ms", good: 1800, poor: 3000 },
  CLS: { label: "Cumulative Layout Shift", unit: "", good: 0.1, poor: 0.25 },
  TTFB: { label: "Time to First Byte", unit: "ms", good: 800, poor: 1800 },
  INP: { label: "Interaction to Next Paint", unit: "ms", good: 200, poor: 500 },
};

function p75(values: number[]): number {
  if (!values.length) return 0;
  const sorted = [...values].sort((a, b) => a - b);
  const idx = Math.ceil(sorted.length * 0.75) - 1;
  return sorted[idx];
}

function rateValue(name: string, value: number): string {
  const thresholds = METRIC_LABELS[name];
  if (!thresholds) return "unknown";
  if (value <= thresholds.good) return "good";
  if (value <= thresholds.poor) return "needs-improvement";
  return "poor";
}

function formatValue(name: string, value: number): string {
  const meta = METRIC_LABELS[name];
  if (!meta) return value.toFixed(0);
  if (name === "CLS") return value.toFixed(3);
  return `${Math.round(value)}${meta.unit}`;
}

// ─── component ───────────────────────────────────────────────────────────────

const WebVitalsDashboard = () => {
  const [rows, setRows] = useState<VitalRow[]>([]);
  const [loading, setLoading] = useState(true);
  const [days, setDays] = useState(7);

  useEffect(() => {
    const load = async () => {
      setLoading(true);
      const since = new Date(Date.now() - days * 24 * 60 * 60 * 1000).toISOString();
      const { data } = await supabase
        .from("web_vitals")
        .select("metric_name,metric_value,metric_rating,page_path,city_slug,device_type,created_at")
        .gte("created_at", since)
        .order("created_at", { ascending: false })
        .limit(5000);
      setRows((data as VitalRow[]) ?? []);
      setLoading(false);
    };
    load();
  }, [days]);

  // ── aggregate global metric summaries ──────────────────────────────────────
  const metricSummaries: MetricSummary[] = Object.keys(METRIC_LABELS).map((name) => {
    const subset = rows.filter((r) => r.metric_name === name);
    const values = subset.map((r) => r.metric_value);
    const p75val = p75(values);
    return {
      name,
      p75: p75val,
      rating: rateValue(name, p75val),
      good: subset.filter((r) => r.metric_rating === "good").length,
      needs_improvement: subset.filter((r) => r.metric_rating === "needs-improvement").length,
      poor: subset.filter((r) => r.metric_rating === "poor").length,
    };
  });

  // ── aggregate by city (only pages with a city slug) ────────────────────────
  const cityMap: Record<string, CityStats> = {};
  rows
    .filter((r) => r.city_slug)
    .forEach((r) => {
      const key = r.city_slug!;
      if (!cityMap[key]) {
        cityMap[key] = { city_slug: key, lcp_p75: 0, fcp_p75: 0, cls_p75: 0, inp_p75: 0, samples: 0 };
      }
      cityMap[key].samples += 1;
    });

  // compute p75 per city per metric
  Object.keys(cityMap).forEach((city) => {
    const cityRows = rows.filter((r) => r.city_slug === city);
    const vals = (name: string) => cityRows.filter((r) => r.metric_name === name).map((r) => r.metric_value);
    cityMap[city].lcp_p75 = p75(vals("LCP"));
    cityMap[city].fcp_p75 = p75(vals("FCP"));
    cityMap[city].cls_p75 = p75(vals("CLS"));
    cityMap[city].inp_p75 = p75(vals("INP"));
  });

  const cities = Object.values(cityMap).sort((a, b) => b.lcp_p75 - a.lcp_p75);

  // ── top slow pages ──────────────────────────────────────────────────────────
  const pageMap: Record<string, number[]> = {};
  rows
    .filter((r) => r.metric_name === "LCP")
    .forEach((r) => {
      if (!pageMap[r.page_path]) pageMap[r.page_path] = [];
      pageMap[r.page_path].push(r.metric_value);
    });

  const slowPages = Object.entries(pageMap)
    .map(([path, vals]) => ({ path, lcp_p75: p75(vals), samples: vals.length }))
    .sort((a, b) => b.lcp_p75 - a.lcp_p75)
    .slice(0, 10);

  const totalSamples = rows.length;

  // ── Core Web Vitals overall "good sessions" score (LCP + CLS + INP all good) ─
  // A session page-view is "good" if all three CWV metrics for that page load are good.
  // We approximate by checking the intersection of good-rated rows per metric.
  const cwvMetrics = ["LCP", "CLS", "INP"] as const;
  const totalCwvSessions = (() => {
    // Use LCP as session count proxy (every page load that reports LCP)
    const lcpRows = rows.filter((r) => r.metric_name === "LCP");
    return lcpRows.length;
  })();

  const goodCwvPct = (() => {
    if (!totalCwvSessions) return 0;
    // % of sessions where ALL three CWV are rated "good"
    // Since we don't have per-session IDs, use per-metric good% and multiply (independence assumption)
    const perMetricGoodPct = cwvMetrics.map((name) => {
      const subset = rows.filter((r) => r.metric_name === name);
      if (!subset.length) return 1; // no data → don't penalise
      const good = subset.filter((r) => r.metric_rating === "good").length;
      return good / subset.length;
    });
    return Math.round(perMetricGoodPct.reduce((acc, p) => acc * p, 1) * 100);
  })();

  const needsImprovementCwvPct = (() => {
    if (!totalCwvSessions) return 0;
    const perMetricNIPct = cwvMetrics.map((name) => {
      const subset = rows.filter((r) => r.metric_name === name);
      if (!subset.length) return 0;
      const ni = subset.filter((r) => r.metric_rating === "needs-improvement").length;
      return ni / subset.length;
    });
    const avgNI = Math.round((perMetricNIPct.reduce((a, b) => a + b, 0) / perMetricNIPct.length) * 100);
    return Math.min(avgNI, 100 - goodCwvPct);
  })();

  const poorCwvPct = Math.max(0, 100 - goodCwvPct - needsImprovementCwvPct);

  const cwvScoreLabel =
    goodCwvPct >= 75 ? "Bom" : goodCwvPct >= 50 ? "Precisa Melhorar" : "Fraco";
  const cwvScoreColor =
    goodCwvPct >= 75 ? "text-emerald-600" : goodCwvPct >= 50 ? "text-amber-600" : "text-red-600";
  const cwvRingColor =
    goodCwvPct >= 75 ? "stroke-emerald-500" : goodCwvPct >= 50 ? "stroke-amber-500" : "stroke-red-500";

  return (
    <DashboardLayout title="Performance Real (Web Vitals)">
      {/* Header controls */}
      <div className="flex items-center justify-between mb-6 flex-wrap gap-3">
        <div className="flex items-center gap-2 text-muted-foreground text-sm">
          <Activity className="h-4 w-4" />
          <span>{totalSamples.toLocaleString("pt-BR")} eventos coletados</span>
        </div>
        <div className="flex gap-2">
          {[7, 14, 30].map((d) => (
            <button
              key={d}
              onClick={() => setDays(d)}
              className={`px-3 py-1 rounded text-sm font-medium transition-colors ${
                days === d
                  ? "bg-accent text-accent-foreground"
                  : "bg-muted text-muted-foreground hover:bg-muted/80"
              }`}
            >
              {d}d
            </button>
          ))}
        </div>
      </div>

      {loading ? (
        <div className="flex items-center justify-center h-48">
          <div className="w-8 h-8 border-4 border-accent border-t-transparent rounded-full animate-spin" />
        </div>
      ) : (
        <>
          {/* Global metric cards */}
          <div className="grid grid-cols-2 lg:grid-cols-5 gap-4 mb-8">
            {metricSummaries.map((m) => {
              const meta = METRIC_LABELS[m.name];
              const total = m.good + m.needs_improvement + m.poor;
              const goodPct = total ? Math.round((m.good / total) * 100) : 0;
              return (
                <Card key={m.name} className="border-0 shadow-card">
                  <CardContent className="p-4">
                    <div className="flex items-center justify-between mb-1">
                      <span className="text-xs font-semibold text-muted-foreground uppercase tracking-wide">
                        {m.name}
                      </span>
                      <Badge className={`text-xs border ${RATING_COLORS[m.rating] ?? ""}`}>
                        {m.rating === "good" ? "✓" : m.rating === "poor" ? "✗" : "~"}
                      </Badge>
                    </div>
                    <p className="text-2xl font-bold text-foreground">{formatValue(m.name, m.p75)}</p>
                    <p className="text-xs text-muted-foreground mt-0.5">p75 — {meta.label}</p>
                    {total > 0 && (
                      <div className="mt-2 h-1.5 rounded-full bg-muted overflow-hidden">
                        <div
                          className="h-full bg-emerald-500 rounded-full"
                          style={{ width: `${goodPct}%` }}
                        />
                      </div>
                    )}
                    <p className="text-xs text-muted-foreground mt-1">{goodPct}% bom · {total} amostras</p>
                  </CardContent>
                </Card>
              );
            })}
          </div>

          <div className="grid lg:grid-cols-2 gap-6">
            {/* City breakdown */}
            <Card className="border-0 shadow-card">
              <CardHeader className="pb-3">
                <CardTitle className="font-serif text-base flex items-center gap-2">
                  <MapPin className="h-4 w-4 text-accent" />
                  Desempenho por Cidade
                </CardTitle>
              </CardHeader>
              <CardContent>
                {cities.length === 0 ? (
                  <p className="text-sm text-muted-foreground">
                    Sem dados de páginas locais neste período.
                  </p>
                ) : (
                  <div className="space-y-3">
                    {cities.slice(0, 15).map((c) => {
                      const lcpRating = rateValue("LCP", c.lcp_p75);
                      return (
                        <div key={c.city_slug} className="flex items-center gap-3">
                          <div className="flex-1 min-w-0">
                            <div className="flex items-center gap-2">
                              <span className="text-sm font-medium text-foreground truncate capitalize">
                                {c.city_slug.replace(/-/g, " ")}
                              </span>
                              <Badge className={`text-xs border shrink-0 ${RATING_COLORS[lcpRating]}`}>
                                {lcpRating === "good" ? "Bom" : lcpRating === "poor" ? "Lento" : "Regular"}
                              </Badge>
                            </div>
                            <p className="text-xs text-muted-foreground">
                              LCP {formatValue("LCP", c.lcp_p75)} · FCP {formatValue("FCP", c.fcp_p75)} · {c.samples} visitas
                            </p>
                          </div>
                          <div className="w-16 h-1.5 rounded-full bg-muted overflow-hidden shrink-0">
                            <div
                              className={`h-full rounded-full ${
                                lcpRating === "good"
                                  ? "bg-emerald-500"
                                  : lcpRating === "poor"
                                  ? "bg-red-500"
                                  : "bg-amber-500"
                              }`}
                              style={{
                                width: `${Math.min(100, (c.lcp_p75 / 6000) * 100)}%`,
                              }}
                            />
                          </div>
                        </div>
                      );
                    })}
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Slow pages */}
            <Card className="border-0 shadow-card">
              <CardHeader className="pb-3">
                <CardTitle className="font-serif text-base flex items-center gap-2">
                  <Gauge className="h-4 w-4 text-accent" />
                  Páginas com LCP Mais Alto
                </CardTitle>
              </CardHeader>
              <CardContent>
                {slowPages.length === 0 ? (
                  <p className="text-sm text-muted-foreground">Sem dados de LCP neste período.</p>
                ) : (
                  <div className="space-y-3">
                    {slowPages.map((p) => {
                      const rating = rateValue("LCP", p.lcp_p75);
                      return (
                        <div key={p.path} className="flex items-center gap-3">
                          <div className="flex-1 min-w-0">
                            <p className="text-sm font-medium text-foreground truncate" title={p.path}>
                              {p.path || "/"}
                            </p>
                            <p className="text-xs text-muted-foreground">
                              {p.samples} amostra{p.samples !== 1 ? "s" : ""}
                            </p>
                          </div>
                          <Badge className={`text-xs border shrink-0 ${RATING_COLORS[rating]}`}>
                            {formatValue("LCP", p.lcp_p75)}
                          </Badge>
                        </div>
                      );
                    })}
                  </div>
                )}
              </CardContent>
            </Card>
          </div>

          {/* Device breakdown */}
          {rows.length > 0 && (
            <Card className="border-0 shadow-card mt-6">
              <CardHeader className="pb-3">
                <CardTitle className="font-serif text-base flex items-center gap-2">
                  <Monitor className="h-4 w-4 text-accent" />
                  LCP p75 por Tipo de Dispositivo
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-3 gap-4">
                  {(["mobile", "tablet", "desktop"] as const).map((dt) => {
                    const vals = rows
                      .filter((r) => r.metric_name === "LCP" && r.device_type === dt)
                      .map((r) => r.metric_value);
                    const val = p75(vals);
                    const rating = vals.length ? rateValue("LCP", val) : "unknown";
                    return (
                      <div key={dt} className="text-center p-4 rounded-lg bg-muted/40">
                        <p className="text-xs text-muted-foreground uppercase tracking-wide mb-1 capitalize">{dt}</p>
                        {vals.length > 0 ? (
                          <>
                            <p className="text-xl font-bold text-foreground">{formatValue("LCP", val)}</p>
                            <Badge className={`text-xs border mt-1 ${RATING_COLORS[rating] ?? ""}`}>
                              {rating === "good" ? "Bom" : rating === "poor" ? "Lento" : "Regular"}
                            </Badge>
                            <p className="text-xs text-muted-foreground mt-1">{vals.length} amostras</p>
                          </>
                        ) : (
                          <p className="text-sm text-muted-foreground">Sem dados</p>
                        )}
                      </div>
                    );
                  })}
                </div>
              </CardContent>
            </Card>
          )}
        </>
      )}
    </DashboardLayout>
  );
};

export default WebVitalsDashboard;
