/**
 * Dynamic CORS helper.
 *
 * Allows:
 *  - https://fernandezefernandes.adv.br  (production)
 *  - *.lovable.app                        (Lovable preview / dev)
 *  - localhost:* / 127.0.0.1:*           (local development)
 *
 * All other origins receive the production URL as the allowed origin,
 * effectively blocking the request at the browser level.
 */

const PRODUCTION_ORIGIN = "https://fernandezefernandes.adv.br";

const CORS_HEADERS_BASE = {
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type, x-supabase-client-platform, x-supabase-client-platform-version, x-supabase-client-runtime, x-supabase-client-runtime-version",
  "Access-Control-Allow-Methods": "GET, POST, PUT, DELETE, OPTIONS",
};

export function getCorsHeaders(req: Request): Record<string, string> {
  const origin = req.headers.get("Origin") ?? "";

  const isAllowed =
    origin === PRODUCTION_ORIGIN ||
    origin.endsWith(".lovable.app") ||
    /^https?:\/\/(localhost|127\.0\.0\.1)(:\d+)?$/.test(origin);

  return {
    ...CORS_HEADERS_BASE,
    "Access-Control-Allow-Origin": isAllowed ? origin : PRODUCTION_ORIGIN,
  };
}

export function handleOptions(req: Request): Response | null {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: getCorsHeaders(req) });
  }
  return null;
}
