const steps = [
  { n: "1", title: "Complete Tasks & Get Paid", desc: "Access hundreds of daily digital tasks. Click, apply, submit, earn." },
  { n: "2", title: "Post Tasks for Other Users", desc: "Need something done? Upload your assignment or task and choose a worker who matches your budget." },
  { n: "3", title: "Bid on Tasks", desc: "Workers can propose their own price, and task owners pick the best offer." },
  { n: "4", title: "Track Everything from Your Dashboard", desc: "View your bids, completed tasks, payments, and notifications — all in one place." },
  { n: "5", title: "Get Fast Payments", desc: "Once your task is approved, funds reflect instantly in your account." },
];

export const HowItWorks = () => (
  <section id="how" className="container py-24">
    <p className="mb-3 text-base font-semibold text-primary">How it works</p>
    <h2 className="mb-12 text-4xl font-black md:text-5xl">
      What You Can Do on <span className="text-gradient-brand">SWAS TASKS</span>
    </h2>

    <div className="space-y-10">
      {steps.map((s) => (
        <div key={s.n} className="border-l-2 border-primary/30 pl-6">
          <h3 className="text-2xl font-bold">{s.n}. {s.title}</h3>
          <p className="mt-2 text-muted-foreground">{s.desc}</p>
        </div>
      ))}
    </div>
  </section>
);
