// Lipwa callback receiver — public, no JWT.
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.45.0";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

Deno.serve(async (req: Request) => {
  if (req.method === "OPTIONS") return new Response(null, { headers: corsHeaders });

  try {
    const SUPABASE_URL = Deno.env.get("SUPABASE_URL")!;
    const SERVICE_ROLE = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!;
    const admin = createClient(SUPABASE_URL, SERVICE_ROLE);

    const payload = await req.json();
    console.log("Lipwa callback", JSON.stringify(payload));

    const checkoutId: string | undefined = payload?.checkout_id;
    const status: string | undefined = payload?.status;
    const mpesaCode: string | null = payload?.mpesa_code ?? null;
    const apiRef = payload?.api_ref ?? {};
    const txId: string | undefined = apiRef?.tx_id;

    // Find transaction
    let tx: any = null;
    if (txId) {
      const { data } = await admin.from("transactions").select("*").eq("id", txId).maybeSingle();
      tx = data;
    }
    if (!tx && checkoutId) {
      const { data } = await admin.from("transactions").select("*").eq("checkout_id", checkoutId).maybeSingle();
      tx = data;
    }

    if (!tx) {
      console.warn("No matching transaction for callback");
      return new Response(JSON.stringify({ ok: true }), {
        status: 200, headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    if (status === "payment.success") {
      await admin.from("transactions").update({
        status: "success",
        mpesa_code: mpesaCode,
        metadata: payload,
      }).eq("id", tx.id);

      // Activation flow: mark profile active
      if (tx.type === "activation") {
        await admin.from("profiles").update({
          account_status: "active",
          activated_at: new Date().toISOString(),
        }).eq("user_id", tx.user_id);
      }

      // Deposit flow: credit wallet
      if (tx.type === "deposit") {
        const { data: wallet } = await admin.from("wallets").select("balance").eq("user_id", tx.user_id).maybeSingle();
        const newBalance = Number(wallet?.balance ?? 0) + Number(tx.amount);
        await admin.from("wallets").update({ balance: newBalance }).eq("user_id", tx.user_id);
      }
    } else if (status === "payment.failed") {
      await admin.from("transactions").update({
        status: "failed",
        metadata: payload,
      }).eq("id", tx.id);
    }

    return new Response(JSON.stringify({ ok: true }), {
      status: 200, headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  } catch (err) {
    console.error("Callback error", err);
    return new Response(JSON.stringify({ error: (err as Error).message }), {
      status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }
});
