/**
 * Real User Monitoring (RUM) — Web Vitals collector
 *
 * Collects CLS, FCP, LCP, TTFB and INP via the web-vitals library and sends
 * them to the `web_vitals` table.  The Supabase client is imported dynamically
 * so this module never adds to the initial JS bundle.
 *
 * Automatically extracts a city_slug from SEO landing-page URLs:
 *   /escritorio-advocacia-{city}  →  city_slug = {city}
 *   /advogado-{service}-{city}    →  city_slug = {city}
 */

import type { Metric } from "web-vitals";

// ─── helpers ──────────────────────────────────────────────────────────────────

function getDeviceType(): "mobile" | "tablet" | "desktop" {
  const w = window.innerWidth;
  if (w < 768) return "mobile";
  if (w < 1024) return "tablet";
  return "desktop";
}

function getConnectionType(): string {
  const nav = navigator as any;
  return nav?.connection?.effectiveType ?? nav?.connection?.type ?? "unknown";
}

function extractCitySlug(pathname: string): string | null {
  // /escritorio-advocacia-{city}
  const escritorioMatch = pathname.match(/^\/escritorio-advocacia-(.+)$/);
  if (escritorioMatch) return escritorioMatch[1];

  // /advogado-{service}-{city}  — city is the last hyphen-separated segment group
  // We rely on the fact that city slugs follow after the second dash-group
  const advogadoMatch = pathname.match(/^\/advogado-[^-]+-(.+)$/);
  if (advogadoMatch) return advogadoMatch[1];

  return null;
}

function getNavigationType(): string {
  try {
    const [entry] = performance.getEntriesByType("navigation") as PerformanceNavigationTiming[];
    return entry?.type ?? "navigate";
  } catch {
    return "navigate";
  }
}

// ─── sender (dynamic import to keep it off the critical path) ─────────────────

async function sendMetric(metric: Metric) {
  try {
    const { supabase } = await import("@/integrations/supabase/client");

    const pathname = window.location.pathname;

    await supabase.from("web_vitals").insert({
      metric_name: metric.name,
      metric_value: metric.value,
      metric_rating: metric.rating,
      metric_delta: metric.delta,
      metric_id: metric.id,
      page_url: window.location.href,
      page_path: pathname,
      city_slug: extractCitySlug(pathname),
      navigation_type: getNavigationType(),
      connection_type: getConnectionType(),
      device_type: getDeviceType(),
    });
  } catch {
    // Never throw — RUM must never break the page
  }
}

// ─── public API ───────────────────────────────────────────────────────────────

/**
 * Call once after the app mounts.  Uses requestIdleCallback (when available)
 * so that registering observers doesn't compete with first render.
 */
export function initWebVitals() {
  const register = () => {
    // Dynamically import web-vitals so it's completely off the critical path
    import("web-vitals").then(({ onCLS, onFCP, onLCP, onTTFB, onINP }) => {
      onCLS(sendMetric, { reportAllChanges: false });
      onFCP(sendMetric);
      onLCP(sendMetric, { reportAllChanges: false });
      onTTFB(sendMetric);
      onINP(sendMetric, { reportAllChanges: false });
    });
  };

  if (typeof window === "undefined") return;

  if ("requestIdleCallback" in window) {
    requestIdleCallback(register, { timeout: 3000 });
  } else {
    setTimeout(register, 0);
  }
}
