import { Link, NavLink, useNavigate } from "react-router-dom";
import { ArrowUpRight, Menu, X } from "lucide-react";
import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import logo from "@/assets/logo.png";
import { supabase } from "@/integrations/supabase/client";
import type { Session } from "@supabase/supabase-js";

const navItems = [
  { label: "HOME", to: "/" },
  { label: "ABOUT US", to: "/#about" },
  { label: "HOW IT WORKS", to: "/#how" },
  { label: "CONTACT US", to: "/#contact" },
];

export const Header = () => {
  const [open, setOpen] = useState(false);
  const [session, setSession] = useState<Session | null>(null);
  const navigate = useNavigate();

  useEffect(() => {
    supabase.auth.getSession().then(({ data }) => setSession(data.session));
    const { data: sub } = supabase.auth.onAuthStateChange((_e, s) => setSession(s));
    return () => sub.subscription.unsubscribe();
  }, []);

  return (
    <header className="sticky top-0 z-50 w-full border-b border-border/50 bg-background/80 backdrop-blur-xl">
      <div className="container flex h-20 items-center justify-between">
        <Link to="/" className="flex items-center gap-3">
          <img src={logo} alt="SWAS Tasks logo" width={44} height={44} className="h-11 w-11" />
          <span className="text-2xl font-extrabold text-gradient-brand">SWAS Tasks</span>
        </Link>

        <nav className="hidden items-center gap-8 md:flex">
          {navItems.map((item) => (
            <a
              key={item.label}
              href={item.to}
              className="text-sm font-bold tracking-wide text-foreground/90 transition-colors hover:text-primary"
            >
              {item.label}
            </a>
          ))}
        </nav>

        <div className="hidden items-center gap-3 md:flex">
          {session ? (
            <Button variant="hero" onClick={() => navigate("/dashboard")}>
              Dashboard <ArrowUpRight />
            </Button>
          ) : (
            <>
              <Button variant="hero" onClick={() => navigate("/register")}>
                Join Now <ArrowUpRight />
              </Button>
              <Button variant="glow" onClick={() => navigate("/login")}>
                Login <ArrowUpRight />
              </Button>
            </>
          )}
        </div>

        <button className="md:hidden" onClick={() => setOpen(!open)} aria-label="Toggle menu">
          {open ? <X /> : <Menu />}
        </button>
      </div>

      {open && (
        <div className="border-t border-border/50 bg-background md:hidden">
          <div className="container flex flex-col gap-4 py-6">
            {navItems.map((item) => (
              <a key={item.label} href={item.to} onClick={() => setOpen(false)} className="text-sm font-bold">
                {item.label}
              </a>
            ))}
            {session ? (
              <Button variant="hero" onClick={() => { setOpen(false); navigate("/dashboard"); }}>Dashboard</Button>
            ) : (
              <div className="flex gap-3">
                <Button variant="hero" className="flex-1" onClick={() => { setOpen(false); navigate("/register"); }}>Join Now</Button>
                <Button variant="glow" className="flex-1" onClick={() => { setOpen(false); navigate("/login"); }}>Login</Button>
              </div>
            )}
          </div>
        </div>
      )}
    </header>
  );
};
