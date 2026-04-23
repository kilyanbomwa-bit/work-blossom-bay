import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { supabase } from "@/integrations/supabase/client";

interface Task {
  id: string;
  title: string;
  poster_name: string;
  budget: number;
  currency: string;
  created_at: string;
  category: string;
}

const Tasks = () => {
  const navigate = useNavigate();
  const [tasks, setTasks] = useState<Task[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    document.title = "Browse Tasks | SWAS Tasks";
    (async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) { navigate("/login?redirect=/tasks"); return; }
      const { data } = await supabase
        .from("tasks")
        .select("id,title,poster_name,budget,currency,created_at,category")
        .eq("status", "open")
        .order("created_at", { ascending: false });
      setTasks((data as Task[]) || []);
      setLoading(false);
    })();
  }, [navigate]);

  return (
    <div className="min-h-screen">
      <Header />
      <main className="container py-12">
        <h1 className="text-4xl font-black">Active Tasks</h1>
        <p className="mt-2 text-muted-foreground">Browse open tasks and place your bid.</p>

        {loading ? (
          <p className="mt-10 text-muted-foreground">Loading…</p>
        ) : (
          <div className="mt-8 space-y-4">
            {tasks.map((t) => (
              <div key={t.id} className="flex flex-col gap-3 rounded-xl border border-primary/10 bg-card/60 p-5 sm:flex-row sm:items-start sm:justify-between">
                <div className="flex-1">
                  <h3 className="font-bold leading-snug">{t.title}</h3>
                  <p className="mt-1 text-sm text-muted-foreground">
                    By {t.poster_name} • {t.category} • Posted {new Date(t.created_at).toLocaleDateString("en-KE", { month: "short", day: "numeric", year: "numeric" })}
                  </p>
                </div>
                <div className="flex flex-col items-end gap-2">
                  <span className="font-black text-primary">{t.currency} {Number(t.budget).toLocaleString()}</span>
                  <Button asChild variant="hero" size="sm">
                    <Link to={`/tasks/${t.id}`}>View / Bid</Link>
                  </Button>
                </div>
              </div>
            ))}
          </div>
        )}
      </main>
      <Footer />
    </div>
  );
};

export default Tasks;
