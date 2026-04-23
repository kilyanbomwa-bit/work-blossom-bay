import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { ArrowUpRight } from "lucide-react";

const features = [
  { title: "Work From Anywhere", desc: "On your phone, laptop, or tablet, earn from wherever you are." },
  { title: "Secure & Transparent", desc: "No scams, no hidden fees, and your payments are protected." },
  { title: "A Community of Earners", desc: "Thousands of real users working daily and making money." },
  { title: "Perfect for Everyone", desc: "Students, freelancers, job seekers, stay-at-home parents, or professionals." },
];

export const WhyUs = () => (
  <section id="about" className="container py-24">
    <div className="grid items-center gap-12 lg:grid-cols-2">
      <div>
        <h2 className="text-4xl font-black md:text-5xl">
          Why <span className="text-gradient-brand">SWAS TASKS</span> is the Best Choice
        </h2>

        <div className="mt-10 grid gap-8 sm:grid-cols-2">
          {features.map((f) => (
            <div key={f.title} className="border-l-2 border-primary/40 pl-5">
              <h3 className="text-lg font-bold">{f.title}</h3>
              <p className="mt-2 text-sm text-muted-foreground">{f.desc}</p>
            </div>
          ))}
        </div>

        <div className="mt-10 flex gap-4">
          <Button asChild variant="hero" size="lg">
            <Link to="/register">Sign up <ArrowUpRight /></Link>
          </Button>
          <Button asChild variant="glow" size="lg">
            <Link to="/login">Login <ArrowUpRight /></Link>
          </Button>
        </div>
      </div>

      <div className="relative aspect-[4/3] overflow-hidden rounded-2xl border border-primary/20 shadow-card">
        <img
          src="https://images.unsplash.com/photo-1486312338219-ce68d2c6f44d?auto=format&fit=crop&w=1200&q=80"
          alt="Person working on laptop earning from home"
          className="h-full w-full object-cover"
          loading="lazy"
        />
      </div>
    </div>
  </section>
);
