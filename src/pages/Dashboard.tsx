import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

const Dashboard = () => {
  const navigate = useNavigate();
  const [profile, setProfile] = useState<any>(null);
  const [wallet, setWallet] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    document.title = "Dashboard | SWAS Tasks";
    (async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) { navigate("/login"); return; }
      const [{ data: p }, { data: w }] = await Promise.all([
        supabase.from("profiles").select("*").eq("user_id", user.id).maybeSingle(),
        supabase.from("wallets").select("*").eq("user_id", user.id).maybeSingle(),
      ]);
      setProfile(p);
      setWallet(w);
      setLoading(false);
      if (p?.account_status !== "active") navigate("/activate");
    })();
  }, [navigate]);

  const logout = async () => {
    await supabase.auth.signOut();
    toast.success("Logged out");
    navigate("/");
  };

  if (loading) return <div className="flex min-h-screen items-center justify-center">Loading…</div>;

  return (
    <div className="min-h-screen">
      <Header />
      <main className="container py-12">
        <div className="flex flex-wrap items-start justify-between gap-4">
          <div>
            <h1 className="text-4xl font-black">Hello, {profile?.full_name?.toUpperCase()}</h1>
            <p className="mt-2 text-muted-foreground">Welcome back. Quick overview of your activity.</p>
          </div>
          <div className="flex gap-3">
            <Button variant="hero" disabled>Start Tasking</Button>
            <Button variant="glow" disabled>Post Task</Button>
          </div>
        </div>

        <div className="mt-10 grid gap-6 lg:grid-cols-3">
          <div className="rounded-2xl border border-primary/20 bg-card/70 p-6 shadow-card">
            <div className="mx-auto flex h-20 w-20 items-center justify-center rounded-2xl bg-gradient-brand text-3xl font-black text-primary-foreground">
              {profile?.full_name?.[0]?.toUpperCase() || "U"}
            </div>
            <h2 className="mt-4 text-center text-xl font-bold">{profile?.full_name?.toUpperCase()}</h2>
            <p className="text-center text-sm text-muted-foreground">{profile?.email}</p>
            <p className="text-center text-sm text-muted-foreground">{profile?.country}</p>

            <div className="mt-6 grid grid-cols-3 gap-2 text-center">
              <div className="rounded-lg bg-secondary/50 p-3"><p className="text-2xl font-black">0</p><p className="text-xs text-muted-foreground">Tasks Posted</p></div>
              <div className="rounded-lg bg-secondary/50 p-3"><p className="text-2xl font-black">0</p><p className="text-xs text-muted-foreground">Tasks Completed</p></div>
              <div className="rounded-lg bg-secondary/50 p-3"><p className="text-2xl font-black">0</p><p className="text-xs text-muted-foreground">Bids Made</p></div>
            </div>

            <div className="mt-6 rounded-xl bg-gradient-brand py-3 text-center font-bold text-primary-foreground">
              Balance: KES {Number(wallet?.balance ?? 0).toFixed(2)}
            </div>

            <Button onClick={logout} variant="destructive" className="mt-4 w-full">Logout</Button>
          </div>

          <div className="lg:col-span-2 space-y-6">
            <div className="rounded-2xl border border-primary/20 bg-card/70 p-6">
              <h2 className="text-2xl font-bold">Your Bidded Tasks</h2>
              <p className="mt-1 text-sm text-muted-foreground">Recent bids you made</p>
              <p className="mt-6 text-sm text-muted-foreground">You have not placed any bids yet.</p>
            </div>

            <div className="rounded-2xl border border-primary/20 bg-card/70 p-6">
              <h2 className="text-2xl font-bold">Active Tasks</h2>
              <p className="mt-1 text-sm text-muted-foreground">Latest tasks open for bidding</p>
              <p className="mt-6 text-sm text-muted-foreground">Task marketplace launches in phase 2 — stay tuned!</p>
            </div>

            <div className="rounded-2xl border border-primary/20 bg-card/70 p-6">
              <h2 className="text-2xl font-bold">Your Posted Tasks</h2>
              <p className="mt-1 text-sm text-muted-foreground">Tasks you have created</p>
              <p className="mt-6 text-sm text-muted-foreground">You haven't posted any tasks yet.</p>
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default Dashboard;
