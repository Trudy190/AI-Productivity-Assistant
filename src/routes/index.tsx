import { createFileRoute, Link } from "@tanstack/react-router";
import { Mail, FileText, ListChecks, BookOpen, MessageSquare, ArrowRight, Sparkles, SpellCheck, FileSearch, BarChart3, History } from "lucide-react";

export const Route = createFileRoute("/")({
  component: Dashboard,
  head: () => ({
    meta: [
      { title: "TrudyM AI — Workplace Productivity Assistant" },
      {
        name: "description",
        content:
          "TrudyM AI helps you write emails, summarize meetings, plan tasks, and research faster with AI.",
      },
      { property: "og:title", content: "TrudyM AI — Workplace Productivity Assistant" },
      {
        property: "og:description",
        content: "AI email, meeting notes, task planning, research, and chat in one workspace.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
});

const tools = [
  {
    title: "Smart Email Generator",
    desc: "Draft formal, friendly, or persuasive emails in seconds.",
    href: "/email",
    icon: Mail,
    tint: "from-sky-500/15 to-blue-500/5 text-sky-600 dark:text-sky-300",
  },
  {
    title: "Meeting Notes Summarizer",
    desc: "Turn raw notes into summaries, decisions and action items.",
    href: "/notes",
    icon: FileText,
    tint: "from-violet-500/15 to-fuchsia-500/5 text-violet-600 dark:text-violet-300",
  },
  {
    title: "AI Task Planner",
    desc: "Build prioritized daily or weekly schedules from a goal list.",
    href: "/tasks",
    icon: ListChecks,
    tint: "from-emerald-500/15 to-teal-500/5 text-emerald-600 dark:text-emerald-300",
  },
  {
    title: "Research Assistant",
    desc: "Summaries, key insights and recommendations on any topic.",
    href: "/research",
    icon: BookOpen,
    tint: "from-amber-500/15 to-orange-500/5 text-amber-600 dark:text-amber-300",
  },
  {
    title: "Workplace Chatbot",
    desc: "An interactive assistant for the day-to-day questions.",
    href: "/chat",
    icon: MessageSquare,
    tint: "from-rose-500/15 to-pink-500/5 text-rose-600 dark:text-rose-300",
  },
] as const;

function Dashboard() {
  return (
    <div className="mx-auto w-full max-w-6xl space-y-8">
      <section className="relative overflow-hidden rounded-2xl border bg-gradient-to-br from-primary/10 via-background to-background p-8 shadow-sm">
        <div className="flex items-center gap-2 text-xs font-medium text-primary">
          <Sparkles className="h-3.5 w-3.5" /> Your AI workplace copilot
        </div>
        <h1 className="mt-3 text-3xl font-semibold tracking-tight sm:text-4xl">
          Do focused work, faster.
        </h1>
        <p className="mt-2 max-w-2xl text-sm text-muted-foreground sm:text-base">
          TrudyM AI brings email drafting, meeting recaps, planning, research and chat into a single
          calm, professional workspace.
        </p>
        <div className="mt-6 flex flex-wrap gap-2">
          <Link
            to="/chat"
            className="inline-flex items-center gap-1.5 rounded-lg bg-primary px-4 py-2 text-sm font-medium text-primary-foreground shadow-sm transition hover:opacity-90"
          >
            Start chatting <ArrowRight className="h-4 w-4" />
          </Link>
          <Link
            to="/email"
            className="inline-flex items-center gap-1.5 rounded-lg border bg-background px-4 py-2 text-sm font-medium transition hover:bg-muted"
          >
            Draft an email
          </Link>
        </div>
      </section>

      <section>
        <h2 className="mb-4 text-sm font-medium uppercase tracking-wider text-muted-foreground">
          Tools
        </h2>
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {tools.map((t) => (
            <Link
              key={t.href}
              to={t.href}
              className="group relative overflow-hidden rounded-xl border bg-card p-5 shadow-sm transition hover:-translate-y-0.5 hover:shadow-md"
            >
              <div
                className={`inline-flex h-10 w-10 items-center justify-center rounded-lg bg-gradient-to-br ${t.tint}`}
              >
                <t.icon className="h-5 w-5" />
              </div>
              <h3 className="mt-4 font-semibold tracking-tight">{t.title}</h3>
              <p className="mt-1 text-sm text-muted-foreground">{t.desc}</p>
              <div className="mt-4 inline-flex items-center gap-1 text-xs font-medium text-primary opacity-70 transition group-hover:opacity-100">
                Open <ArrowRight className="h-3.5 w-3.5" />
              </div>
            </Link>
          ))}
        </div>
      </section>

      <section className="rounded-xl border bg-muted/30 p-5 text-xs leading-relaxed text-muted-foreground">
        <p className="font-medium text-foreground">Responsible AI disclaimer</p>
        <p className="mt-1">
          TrudyM AI generates content using large language models. Outputs can be inaccurate or
          biased and should be reviewed by a human before being sent, published or acted on. Do not
          submit confidential information you would not share with a third-party service.
        </p>
      </section>
    </div>
  );
}
