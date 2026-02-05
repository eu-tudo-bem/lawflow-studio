import { createClient } from "npm:@supabase/supabase-js@2";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type",
};

interface CreateClientAccountRequest {
  email: string;
  password: string;
  full_name: string;
  phone: string;
  cpf?: string;
  address?: string;
  notes?: string;
}

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const authHeader = req.headers.get("Authorization");
    if (!authHeader) {
      throw new Error("Missing authorization header");
    }

    // Create client with service role for admin operations
    const supabaseAdmin = createClient(
      Deno.env.get("SUPABASE_URL") ?? "",
      Deno.env.get("SUPABASE_SERVICE_ROLE_KEY") ?? "",
      { auth: { autoRefreshToken: false, persistSession: false } }
    );

    // Verify the requesting user is admin or staff
    const supabaseClient = createClient(
      Deno.env.get("SUPABASE_URL") ?? "",
      Deno.env.get("SUPABASE_ANON_KEY") ?? "",
      {
        global: { headers: { Authorization: authHeader } },
        auth: { autoRefreshToken: false, persistSession: false },
      }
    );

    const { data: { user: requestingUser }, error: authError } = await supabaseClient.auth.getUser();
    if (authError || !requestingUser) {
      throw new Error("Unauthorized");
    }

    // Check if user has admin or staff role
    const { data: roleData } = await supabaseAdmin
      .from("user_roles")
      .select("role")
      .eq("user_id", requestingUser.id)
      .single();

    if (!roleData || (roleData.role !== "admin" && roleData.role !== "staff")) {
      throw new Error("Only admin or staff can create client accounts");
    }

    const body: CreateClientAccountRequest = await req.json();
    const { email, password, full_name, phone, cpf, address, notes } = body;

    if (!email || !password || !full_name || !phone) {
      throw new Error("Missing required fields");
    }

    // Create the auth user
    const { data: authData, error: createError } = await supabaseAdmin.auth.admin.createUser({
      email,
      password,
      email_confirm: true,
      user_metadata: { full_name },
    });

    if (createError) {
      throw new Error(`Failed to create user: ${createError.message}`);
    }

    const newUserId = authData.user.id;

    // Assign client role
    const { error: roleError } = await supabaseAdmin
      .from("user_roles")
      .insert({ user_id: newUserId, role: "client" });

    if (roleError) {
      console.error("Failed to assign client role:", roleError);
    }

    // Create client record linked to the user
    const { data: clientData, error: clientError } = await supabaseAdmin
      .from("clients")
      .insert({
        full_name,
        email,
        phone,
        cpf: cpf || null,
        address: address || null,
        notes: notes || null,
        user_id: newUserId,
        created_by: requestingUser.id,
      })
      .select()
      .single();

    if (clientError) {
      // Rollback: delete the created user if client creation fails
      await supabaseAdmin.auth.admin.deleteUser(newUserId);
      throw new Error(`Failed to create client record: ${clientError.message}`);
    }

    return new Response(
      JSON.stringify({ success: true, client: clientData }),
      { headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  } catch (error: unknown) {
    const errorMessage = error instanceof Error ? error.message : "Unknown error";
    console.error("Error in create-client-account:", errorMessage);
    return new Response(
      JSON.stringify({ error: errorMessage }),
      { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  }
});
