import { createClient } from "https://esm.sh/@supabase/supabase-js@2";
import { getCorsHeaders, handleOptions } from "../_shared/cors.ts";

const TJPR_ENDPOINT =
  "https://www.tjpr.jus.br/documents/d/planejamento/processos_tjpr?download=true";

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const supabaseUrl = Deno.env.get("SUPABASE_URL")!;
    const serviceRoleKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!;
    const supabaseAdmin = createClient(supabaseUrl, serviceRoleKey);

    // Check if this is an authenticated user request or a cron job
    const authHeader = req.headers.get("Authorization");
    let userId: string | null = null;

    if (authHeader?.startsWith("Bearer ")) {
      const anonKey = Deno.env.get("SUPABASE_ANON_KEY")!;
      const userClient = createClient(supabaseUrl, anonKey, {
        global: { headers: { Authorization: authHeader } },
      });
      const { data, error } = await userClient.auth.getClaims(
        authHeader.replace("Bearer ", "")
      );
      if (!error && data?.claims) {
        userId = data.claims.sub as string;
      }
    }

    const body = await req.json().catch(() => ({}));
    const processoId = body.processo_id; // optional: update single process

    // Fetch processes to monitor
    let query = supabaseAdmin
      .from("tjpr_processos_monitorados")
      .select("*");

    if (processoId) {
      query = query.eq("id", processoId);
    } else if (userId) {
      query = query.eq("created_by", userId);
    }

    // Rate limit: skip if checked less than 1 hour ago (unless manual)
    if (!processoId) {
      query = query.or(
        `ultima_verificacao.is.null,ultima_verificacao.lt.${new Date(Date.now() - 3600000).toISOString()}`
      );
    }

    const { data: processos, error: fetchErr } = await query;
    if (fetchErr) throw fetchErr;

    const results = [];

    for (const processo of processos || []) {
      try {
        const controller = new AbortController();
        const timeout = setTimeout(() => controller.abort(), 15000);

        const tjprRes = await fetch(TJPR_ENDPOINT, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            query: {
              term: {
                Processos: processo.numero_processo,
              },
            },
          }),
          signal: controller.signal,
        });

        clearTimeout(timeout);

        if (!tjprRes.ok) {
          const errText = await tjprRes.text();
          // Log error but don't erase data
          await supabaseAdmin.from("tjpr_logs_consulta").insert({
            processo_id: processo.id,
            status_anterior: processo.status_atual,
            status_novo: null,
            erro: `HTTP ${tjprRes.status}: ${errText.substring(0, 500)}`,
            sucesso: false,
          });
          results.push({ id: processo.id, success: false, error: `HTTP ${tjprRes.status}` });
          continue;
        }

        const tjprData = await tjprRes.json();

        // Parse response - try to find matching process
        let statusNovo = null;
        let comarca = null;
        let vara = null;
        let matched = false;

        // Handle different possible response formats
        if (Array.isArray(tjprData)) {
          const match = tjprData.find(
            (p: any) =>
              p.Processos === processo.numero_processo ||
              p.numero === processo.numero_processo
          );
          if (match) {
            statusNovo = match.Status || match.status || null;
            comarca = match.Comarca || match.comarca || null;
            vara = match.Vara || match.vara || null;
            matched = true;
          }
        } else if (tjprData.hits?.hits) {
          // Elasticsearch-style response
          const hits = tjprData.hits.hits;
          if (hits.length > 0) {
            const source = hits[0]._source || hits[0];
            statusNovo = source.Status || source.status || null;
            comarca = source.Comarca || source.comarca || null;
            vara = source.Vara || source.vara || null;
            matched = true;
          }
        } else if (tjprData.Processos || tjprData.Status) {
          statusNovo = tjprData.Status || tjprData.status || null;
          comarca = tjprData.Comarca || tjprData.comarca || null;
          vara = tjprData.Vara || tjprData.vara || null;
          matched = true;
        }

        const statusChanged =
          matched && statusNovo && statusNovo !== processo.status_atual;

        // Update process
        const updateData: any = {
          ultima_verificacao: new Date().toISOString(),
        };
        if (matched && statusNovo) updateData.status_atual = statusNovo;
        if (matched && comarca) updateData.comarca = comarca;
        if (matched && vara) updateData.vara = vara;

        await supabaseAdmin
          .from("tjpr_processos_monitorados")
          .update(updateData)
          .eq("id", processo.id);

        // Log consultation
        await supabaseAdmin.from("tjpr_logs_consulta").insert({
          processo_id: processo.id,
          status_anterior: processo.status_atual,
          status_novo: statusNovo,
          comarca,
          vara,
          resposta_raw: tjprData,
          sucesso: true,
        });

        results.push({
          id: processo.id,
          success: true,
          matched,
          statusChanged,
          status: statusNovo,
        });
      } catch (err) {
        const errorMessage =
          err instanceof Error ? err.message : "Unknown error";
        await supabaseAdmin.from("tjpr_logs_consulta").insert({
          processo_id: processo.id,
          status_anterior: processo.status_atual,
          erro: errorMessage,
          sucesso: false,
        });
        results.push({ id: processo.id, success: false, error: errorMessage });
      }
    }

    return new Response(JSON.stringify({ results, total: results.length }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  } catch (error) {
    console.error("TJPR Monitor error:", error);
    return new Response(JSON.stringify({ error: "Erro ao monitorar processos. Tente novamente." }), {
      status: 500,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }
});
