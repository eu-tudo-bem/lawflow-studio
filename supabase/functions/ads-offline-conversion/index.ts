/**
 * ads-offline-conversion
 *
 * Supabase Database Webhook handler.
 * Triggered when a `cases` row is updated to a "closed-won" status.
 *
 * Flow:
 *   Supabase Webhook (cases UPDATE) → this function
 *     → GA4 Measurement Protocol  (feeds Google Ads Offline Conversions)
 *
 * Environment variables required:
 *   GA4_API_SECRET    — Measurement Protocol API secret (GA4 Admin → Data Streams)
 *   GA4_MEASUREMENT_ID — e.g. "G-Q4YKZJFPKY"
 */

import { getCorsHeaders, handleOptions } from "../_shared/cors.ts";

// ─── Types ────────────────────────────────────────────────────────────────────

interface WebhookPayload {
  type: "INSERT" | "UPDATE" | "DELETE";
  table: string;
  schema: string;
  record: Record<string, unknown> | null;
  old_record: Record<string, unknown> | null;
}

interface GA4Event {
  name: string;
  params: Record<string, unknown>;
}

// ─── Constants ────────────────────────────────────────────────────────────────

/** Status values considered a "closed-won" conversion. */
const CONVERSION_STATUSES = new Set([
  "completed",  // matches the case_status enum
  "GANHO",
  "CONTRATO_FECHADO",
]);

/**
 * Default contract value (BRL) when the record does not carry one.
 * Adjust to your average ticket.
 */
const DEFAULT_CONTRACT_VALUE = 1500;

// ─── GA4 Measurement Protocol helper ─────────────────────────────────────────

async function sendGA4Event(
  measurementId: string,
  apiSecret: string,
  clientId: string,
  events: GA4Event[],
): Promise<{ ok: boolean; status: number; body: string }> {
  const url = new URL("https://www.google-analytics.com/mp/collect");
  url.searchParams.set("measurement_id", measurementId);
  url.searchParams.set("api_secret", apiSecret);

  const payload = {
    client_id: clientId,
    non_personalized_ads: false,
    events,
  };

  const res = await fetch(url.toString(), {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload),
  });

  const body = await res.text();
  return { ok: res.ok, status: res.status, body };
}

// ─── Main handler ─────────────────────────────────────────────────────────────

Deno.serve(async (req: Request) => {
  // CORS preflight
  const optionsResponse = handleOptions(req);
  if (optionsResponse) return optionsResponse;

  const corsHeaders = getCorsHeaders(req);

  // Only accept POST (Supabase webhooks always POST)
  if (req.method !== "POST") {
    return new Response(JSON.stringify({ error: "Method not allowed" }), {
      status: 405,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }

  // ── Read + validate webhook payload ──────────────────────────────────────
  let payload: WebhookPayload;
  try {
    payload = await req.json();
  } catch {
    return new Response(JSON.stringify({ error: "Invalid JSON body" }), {
      status: 400,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }

  const { type, record, old_record } = payload;

  // We only act on UPDATE events where status changed to a conversion value
  if (type !== "UPDATE" || !record) {
    return new Response(
      JSON.stringify({ skipped: true, reason: "Not an UPDATE event or missing record" }),
      { status: 200, headers: { ...corsHeaders, "Content-Type": "application/json" } },
    );
  }

  const newStatus = String(record.status ?? "");
  const oldStatus = String(old_record?.status ?? "");

  if (!CONVERSION_STATUSES.has(newStatus) || newStatus === oldStatus) {
    return new Response(
      JSON.stringify({ skipped: true, reason: `Status '${newStatus}' is not a conversion trigger or unchanged` }),
      { status: 200, headers: { ...corsHeaders, "Content-Type": "application/json" } },
    );
  }

  // ── Resolve env vars ──────────────────────────────────────────────────────
  const GA4_MEASUREMENT_ID = Deno.env.get("GA4_MEASUREMENT_ID");
  const GA4_API_SECRET = Deno.env.get("GA4_API_SECRET");

  if (!GA4_MEASUREMENT_ID || !GA4_API_SECRET) {
    console.error("[ads-offline-conversion] Missing GA4_MEASUREMENT_ID or GA4_API_SECRET");
    return new Response(
      JSON.stringify({ error: "Server misconfiguration: missing GA4 credentials" }),
      { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } },
    );
  }

  // ── Build GA4 event ───────────────────────────────────────────────────────
  // Use the case/client id as a stable client_id so GA4 can deduplicate
  const clientId = String(record.id ?? record.client_id ?? crypto.randomUUID());

  const contractValue =
    typeof record.value === "number"
      ? record.value
      : DEFAULT_CONTRACT_VALUE;

  const caseTitle = String(record.title ?? "Caso sem título");

  const ga4Event: GA4Event = {
    name: "purchase",          // "purchase" is recognised by Google Ads offline import
    params: {
      transaction_id: clientId,
      value: contractValue,
      currency: "BRL",
      items: [
        {
          item_id: clientId,
          item_name: caseTitle,
          item_category: "Advocacia",
          price: contractValue,
          quantity: 1,
        },
      ],
      // Custom dimensions for segmentation in GA4 / Ads
      case_status: newStatus,
      previous_status: oldStatus,
      conversion_source: "server_side_webhook",
    },
  };

  // ── Send to GA4 Measurement Protocol ─────────────────────────────────────
  try {
    const result = await sendGA4Event(
      GA4_MEASUREMENT_ID,
      GA4_API_SECRET,
      clientId,
      [ga4Event],
    );

    if (!result.ok && result.status !== 204) {
      // GA4 MP returns 204 on success (no body); any non-2xx is an error
      console.error(
        `[ads-offline-conversion] GA4 returned ${result.status}: ${result.body}`,
      );
      return new Response(
        JSON.stringify({
          error: "GA4 Measurement Protocol rejected the event",
          ga4_status: result.status,
          ga4_body: result.body,
        }),
        { status: 502, headers: { ...corsHeaders, "Content-Type": "application/json" } },
      );
    }

    console.log(
      `[ads-offline-conversion] ✅ Conversion sent | case=${clientId} | status=${newStatus} | value=${contractValue} BRL`,
    );

    return new Response(
      JSON.stringify({
        success: true,
        conversion_sent: true,
        case_id: clientId,
        status: newStatus,
        value: contractValue,
        currency: "BRL",
      }),
      { status: 200, headers: { ...corsHeaders, "Content-Type": "application/json" } },
    );
  } catch (err) {
    const message = err instanceof Error ? err.message : String(err);
    console.error(`[ads-offline-conversion] Fetch error: ${message}`);
    return new Response(
      JSON.stringify({ error: "Failed to reach GA4 Measurement Protocol", detail: message }),
      { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } },
    );
  }
});
