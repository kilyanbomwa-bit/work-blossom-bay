import { ArrowUpRight, Newspaper, Monitor, Search, PenTool, Briefcase, ClipboardList } from "lucide-react";

const cats = [
  { icon: Newspaper, title: "Academic Assignments", desc: "Help users complete school or college assignments, research papers, presentations, and coursework." },
  { icon: Monitor, title: "Data Entry", desc: "Input data, organize spreadsheets, convert documents, or update customer information." },
  { icon: Search, title: "Online Research", desc: "Collect information, analyze data, find resources, or compile research notes for clients." },
  { icon: PenTool, title: "Writing", desc: "Articles, blog posts, copywriting, transcription, and proofreading work." },
  { icon: Briefcase, title: "Business Support", desc: "Virtual assistance, scheduling, email handling, and admin tasks for busy professionals." },
  { icon: ClipboardList, title: "Surveys", desc: "Complete short surveys and contribute opinions to earn quick rewards." },
];

export const Categories = () => (
  <section className="container py-24">
    <h2 className="text-center text-4xl font-black md:text-5xl">
      Popular Task <span className="text-gradient-brand">Categories</span>
    </h2>
    <p className="mx-auto mt-4 max-w-2xl text-center text-muted-foreground">
      Earn by completing simple tasks or post your own tasks and let skilled users get the job done for you. Fast, flexible, and secure.
    </p>

    <div className="mt-14 grid gap-6 md:grid-cols-2 lg:grid-cols-3">
      {cats.map((c) => (
        <div key={c.title} className="group relative overflow-hidden rounded-2xl border border-primary/20 bg-card/60 p-8 transition-all hover:-translate-y-1 hover:border-primary/60 hover:shadow-glow">
          <c.icon className="h-12 w-12 text-primary" strokeWidth={1.5} />
          <h3 className="mt-6 text-2xl font-bold">{c.title}</h3>
          <p className="mt-3 text-sm text-muted-foreground">{c.desc}</p>
          <div className="mt-8 flex h-12 w-12 items-center justify-center rounded-full border border-primary/40 text-primary transition-all group-hover:bg-primary group-hover:text-primary-foreground">
            <ArrowUpRight />
          </div>
        </div>
      ))}
    </div>
  </section>
);
