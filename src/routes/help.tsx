import { createFileRoute, Link } from "@tanstack/react-router";
import { LifeBuoy, Mail, MessageSquare, ListChecks, ShieldCheck, Sparkles } from "lucide-react";

export const Route = createFileRoute("/help")({
  component: HelpPage,
  head: () => ({
    meta: [
      { title: "Help & Support — TrudyM AI" },
      { name: "description", content: "Guides, FAQs and responsible AI info for TrudyM." },
    ],
  }),
});

const faqs = [
  {
    q: "Do I need an account?",
    a: "No. TrudyM is privacy-first — no login, no database. Your history is stored only in your browser and can be cleared anytime from Settings.",
  },
  {
    q: "Is my data stored anywhere?",
    a: "Prompts are sent to the AI service only to generate a response. TrudyM does not permanently store your emails, plans, or chats.",
  },
  {
    q: "Can I edit AI responses?",
    a: "Yes. Every response can be edited, copied, downloaded as Markdown or PDF, regenerated, cleared, or saved to local history.",
  },
  {
    q: "How accurate are the responses?",
    a: "AI-generated content may contain inaccuracies. Always review, verify and edit before using professionally.",
  },
];

const quickLinks = [
  { title: "Smart Email Generator", url: "/email", icon: Mail, desc: "Draft emails by audience, tone and length." },
  { title: "AI Task Planner", url: "/tasks", icon: ListChecks, desc: "Turn goals into prioritized plans." },
  { title: "TrudyM AI Chat Assistant", url: "/chat", icon: MessageSquare, desc: "Ask, brainstorm, summarize and rewrite." },
];

function HelpPage() {
  return (
    <div className="mx-auto flex w-full max-w-4xl flex-col gap-6 animate-fade-in">
      <header className="flex flex-col gap-2">
        <div className="flex items-center gap-2 text-xs font-medium text-primary">
          <span className="inline-flex h-6 w-6 items-center justify-center rounded-md bg-primary/10">
            <LifeBuoy className="h-3.5 w-3.5" />
          </span>
          Help & Support
        </div>
        <h1 className="text-2xl font-semibold tracking-tight sm:text-3xl">How can we help?</h1>
        <p className="max-w-2xl text-sm text-muted-foreground">
          Everything you need to get the most out of TrudyM — quick tours, FAQs and
          our responsible AI commitments.
        </p>
      </header>

      <section className="grid gap-3 sm:grid-cols-3">
        {quickLinks.map((l) => (
          <Link
            key={l.url}
            to={l.url}
            className="group flex flex-col gap-2 rounded-xl border bg-card p-4 shadow-sm transition hover:-translate-y-0.5 hover:shadow-md"
          >
            <span className="inline-flex h-8 w-8 items-center justify-center rounded-lg bg-primary/10 text-primary">
              <l.icon className="h-4 w-4" />
            </span>
            <p className="text-sm font-semibold">{l.title}</p>
            <p className="text-xs text-muted-foreground">{l.desc}</p>
          </Link>
        ))}
      </section>

      <section className="rounded-xl border bg-card p-6 shadow-sm">
        <div className="flex items-center gap-2">
          <Sparkles className="h-4 w-4 text-primary" />
          <h2 className="text-sm font-semibold">Frequently asked questions</h2>
        </div>
        <div className="mt-4 divide-y">
          {faqs.map((f) => (
            <details key={f.q} className="group py-3">
              <summary className="cursor-pointer list-none text-sm font-medium text-foreground marker:hidden">
                <span className="mr-2 text-muted-foreground group-open:hidden">+</span>
                <span className="mr-2 hidden text-muted-foreground group-open:inline">–</span>
                {f.q}
              </summary>
              <p className="mt-2 pl-5 text-sm text-muted-foreground">{f.a}</p>
            </details>
          ))}
        </div>
      </section>

      <section className="rounded-xl border border-amber-500/20 bg-amber-500/5 p-6">
        <div className="flex items-center gap-2 text-amber-700 dark:text-amber-400">
          <ShieldCheck className="h-4 w-4" />
          <h2 className="text-sm font-semibold">Responsible AI</h2>
        </div>
        <p className="mt-2 text-xs leading-relaxed text-muted-foreground">
          AI-generated content may contain inaccuracies. Review, verify and edit generated
          content before using it professionally. Avoid sharing confidential or sensitive
          business information with the assistant.
        </p>
      </section>
    </div>
  );
}
