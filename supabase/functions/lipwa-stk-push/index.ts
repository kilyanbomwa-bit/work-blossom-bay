// Lipwa M-Pesa STK Push initiator
// Authenticated: requires logged-in user. Creates a pending transaction and triggers STK.
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.45.0";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

interface Body {
  amount: number;
  phone_number: string;
  type?: "activation" | "deposit";
}

Deno.serve(async (req: Request) => {
  if (req.method === "OPTIONS") return new Response(null, { headers: corsHeaders });

  try {
    const SUPABASE_URL = Deno.env.get("SUPABASE_URL")!;
    const SUPABASE_ANON_KEY = Deno.env.get("SUPABASE_PUBLISHABLE_KEY") ?? Deno.env.get("SUPABASE_ANON_KEY")!;
    const SERVICE_ROLE = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!;
    const LIPWA_API_KEY = Deno.env.get("LIPWA_API_KEY");
    const LIPWA_CHANNEL_ID = Deno.env.get("LIPWA_CHANNEL_ID");

    if (!LIPWA_API_KEY || !LIPWA_CHANNEL_ID) {
      return new Response(JSON.stringify({ error: "Lipwa credentials not configured" }), {
        status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    const authHeader = req.headers.get("Authorization");
    if (!authHeader) {
      return new Response(JSON.stringify({ error: "Unauthorized" }), {
        status: 401, headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    const userClient = createClient(SUPABASE_URL, SUPABASE_ANON_KEY, {
      global: { headers: { Authorization: authHeader } },
    });
    const { data: userData, error: userErr } = await userClient.auth.getUser();
    if (userErr || !userData.user) {
      return new Response(JSON.stringify({ error: "Unauthorized" }), {
        status: 401, headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }
    const user = userData.user;

    const body = (await req.json()) as Body;
    const amount = Number(body.amount);
    const phone = String(body.phone_number || "").trim();
    const type = body.type ?? "activation";

    if (!Number.isFinite(amount) || amount < 10) {
      return new Response(JSON.stringify({ error: "Amount must be at least KES 10" }), {
        status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }
    if (!/^(?:\+?254|0)?[17]\d{8}$/.test(phone.replace(/\s/g, ""))) {
      return new Response(JSON.stringify({ error: "Invalid M-Pesa phone number" }), {
        status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    const admin = createClient(SUPABASE_URL, SERVICE_ROLE);

    // Create pending transaction first so callback can find it
    const { data: tx, error: txErr } = await admin
      .from("transactions")
      .insert({
        user_id: user.id,
        type,
        amount,
        currency: "KES",
        status: "pending",
        phone_number: phone,
        description: type === "activation" ? "Account activation fee" : "Wallet deposit",
      })
      .select()
      .single();

    if (txErr || !tx) {
      console.error("tx insert failed", txErr);
      return new Response(JSON.stringify({ error: "Failed to create transaction" }), {
        status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    const callbackUrl = `${SUPABASE_URL}/functions/v1/lipwa-callback`;

    const stkResp = await fetch("https://pay.lipwa.app/api/payments", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${LIPWA_API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        amount: Math.round(amount),
        phone_number: phone,
        channel_id: LIPWA_CHANNEL_ID,
        callback_url: callbackUrl,
        api_ref: { tx_id: tx.id, user_id: user.id, type },
      }),
    });

    const stkData = await stkResp.json();
    console.log("Lipwa response", stkResp.status, stkData);

    if (!stkResp.ok) {
      await admin.from("transactions").update({
        status: "failed",
        metadata: { lipwa_error: stkData },
      }).eq("id", tx.id);
      return new Response(JSON.stringify({ error: stkData?.message || "Lipwa request failed", details: stkData }), {
        status: 502, headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    const checkoutId = stkData?.CheckoutRequestID || stkData?.checkout_id || null;
    await admin.from("transactions").update({
      checkout_id: checkoutId,
      metadata: stkData,
    }).eq("id", tx.id);

    return new Response(JSON.stringify({
      success: true,
      tx_id: tx.id,
      checkout_id: checkoutId,
      message: "STK push sent. Check your phone.",
    }), {
      status: 200, headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  } catch (err) {
    console.error("STK push error", err);
    return new Response(JSON.stringify({ error: (err as Error).message }), {
      status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }
});
