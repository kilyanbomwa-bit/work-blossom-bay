import { ArrowUpRight } from "lucide-react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";

export const Hero = () => {
  return (
    <section className="relative overflow-hidden">
      <div className="swirl-bg animate-spin-slow" aria-hidden />
      <div className="bg-gradient-hero absolute inset-0" aria-hidden />

      <div className="container relative z-10 flex min-h-[88vh] flex-col items-center justify-center py-20 text-center">
        <p className="mb-6 text-base font-medium text-primary md:text-lg">
          Empowers everyone to <span className="font-bold">work and earn</span>
        </p>
        <p className="mb-8 text-sm text-foreground/80 md:text-base">
          Work using a laptop or a smartphone.
        </p>

        <h1 className="mx-auto max-w-5xl text-4xl font-black leading-[1.05] sm:text-6xl md:text-7xl lg:text-[5.5rem]">
          All-in-one <span className="text-gradient-brand">Digital</span> platform for{" "}
          Tasks &amp; <span className="text-gradient-brand">Assignments</span>
        </h1>

        <p className="mx-auto mt-8 max-w-3xl text-base text-muted-foreground md:text-lg">
          Turn your skills and free time into earnings. Whether you want to{" "}
          <strong className="text-foreground">complete tasks for money</strong> or{" "}
          <strong className="text-foreground">post tasks for others</strong>, SWAS TASKS makes work easy, fast, and secure.
        </p>

        <div className="mt-12 flex flex-col gap-4 sm:flex-row">
          <Button asChild variant="hero" size="xl">
            <Link to="/register">Available Tasks <ArrowUpRight /></Link>
          </Button>
          <Button asChild variant="glow" size="xl">
            <Link to="/register">Post Tasks <ArrowUpRight /></Link>
          </Button>
        </div>
      </div>
    </section>
  );
};
