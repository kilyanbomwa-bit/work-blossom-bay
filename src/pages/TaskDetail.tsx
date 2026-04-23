import { useEffect, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

interface Task {
  id: string;
  title: string;
  description: string;
  poster_name: string;
  poster_country: string | null;
  category: string;
  budget: number;
  currency: string;
  due_date: string | null;
  created_at: string;
}

const TaskDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [task, setTask] = useState<Task | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    document.title = "Task Details | SWAS Tasks";
    (async () => {
      if (!id) return;
      const { data, error } = await supabase
        .from("tasks")
        .select("*")
        .eq("id", id)
        .maybeSingle();
      if (error || !data) {
        toast.error("Task not found");
        navigate("/dashboard");
        return;
      }
      setTask(data as Task);
      setLoading(false);
    })();
  }, [id, navigate]);

  const handleBid = async () => {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) {
      navigate(`/login?redirect=/tasks/${id}`);
      return;
    }
    const { data: profile } = await supabase
      .from("profiles")
      .select("account_status")
      .eq("user_id", user.id)
      .maybeSingle();

    if (profile?.account_status !== "active") {
      navigate(`/activate?redirect=/tasks/${id}&reason=bid`);
      return;
    }
    toast.success("Bid submitted! (Bidding flow launches in phase 2)");
  };

  if (loading || !task) {
    return (
      <div className="min-h-screen">
        <Header />
        <main className="container flex items-center justify-center py-24">Loading…</main>
        <Footer />
      </div>
    );
  }

  const formattedDate = task.due_date
    ? new Date(task.due_date).toLocaleDateString("en-KE", { month: "short", day: "numeric", year: "numeric" })
    : "Flexible";
  const postedDate = new Date(task.created_at).toLocaleDateString("en-KE", { month: "short", day: "numeric", year: "numeric" });

  return (
    <div className="min-h-screen">
      <Header />
      <main className="container py-16">
        <div className="mx-auto max-w-4xl rounded-2xl border border-primary/20 bg-card/70 p-8 shadow-card">
          <h1 className="text-3xl font-black leading-tight md:text-4xl">{task.title}</h1>

          <div className="mt-4 text-sm text-muted-foreground">
            <p>
              Posted by <span className="font-bold text-foreground">{task.poster_name}</span>
              {task.poster_country ? <> • {task.poster_country}</> : null}
            </p>
            <p>Posted on: {postedDate}</p>
          </div>

          <div className="my-6 h-px bg-primary/20" />

          <div className="flex flex-wrap items-center gap-3">
            <span className="rounded-lg bg-secondary px-4 py-2 text-sm font-bold">{task.category}</span>
            <span className="rounded-lg bg-secondary px-4 py-2 text-sm font-bold">{task.currency} {Number(task.budget).toLocaleString()}</span>
            <span className="rounded-lg bg-secondary px-4 py-2 text-sm font-bold">Due: {formattedDate}</span>
          </div>

          <p className="mt-6 leading-relaxed">{task.description}</p>

          <div className="mt-8 flex items-center justify-between">
            <Button variant="hero" size="lg" onClick={handleBid}>Bid on This Task</Button>
            <Link to="/dashboard" className="text-sm font-semibold text-primary underline-offset-4 hover:underline">
              Back
            </Link>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default TaskDetail;
