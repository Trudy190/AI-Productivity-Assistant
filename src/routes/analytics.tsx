import { createFileRoute } from "@tanstack/react-router";
import { useMemo } from "react";
import { BarChart3, Sparkles, Clock, TrendingUp, FileText } from "lucide-react";
import { useHistory } from "@/lib/history-store";

export const Route = createFileRoute("/analytics")({
  component: AnalyticsPage,
  head: () => ({
    meta: [
      { title: "Productivity Analytics — TrudyM AI" },
      { name: "description", content: "Track AI usage, response volume and productivity trends." },
    ],
  }),
});

function AnalyticsPage() {
  const history = useHistory();

  const stats = useMemo(() => {
    const now = Date.now();
    const weekAgo = now - 7 * 24 * 60 * 60 * 1000;
    const recent = history.filter((h) => h.createdAt >= weekAgo);
    const byTool = new Map<string, number>();
    const byDay = new Map<string, number>();
    for (const h of history) {
      byTool.set(h.toolLabel, (byTool.get(h.toolLabel) ?? 0) + 1);
      const d = new Date(h.createdAt).toISOString().slice(0, 10);
      byDay.set(d, (byDay.get(d) ?? 0) + 1);
    }
    const totalWords = history.reduce((s, h) => s + h.output.split(/\s+/).filter(Boolean).length, 0);
    const days: { label: string; count: number }[] = [];
    for (let i = 6; i >= 0; i--) {
      const d = new Date(now - i * 86400000);
      const key = d.toISOString().slice(0, 10);
      days.push({
        label: d.toLocaleDateString(undefined, { weekday: "short" }),
        count: byDay.get(key) ?? 0,
      });
    }
    const max = Math.max(1, ...days.map((d) => d.count));
    return {
      total: history.length,
      recent: recent.length,
      totalWords,
      avgWords: history.length ? Math.round(totalWords / history.length) : 0,
      byTool: Array.from(byTool.entries()).sort((a, b) => b[1] - a[1]),
      days,
      max,
    };
  }, [history]);

  const cards = [
    { label: "Total responses", value: stats.total, icon: Sparkles, tint: "text-primary" },
    { label: "This week", value: stats.recent, icon: TrendingUp, tint: "text-emerald-500" },
    { label: "Words generated", value: stats.totalWords.toLocaleString(), icon: FileText, tint: "text-violet-500" },
    { label: "Avg words / response", value: stats.avgWords, icon: Clock, tint: "text-amber-500" },
  ];

  return (
    <div className="mx-auto flex w-full max-w-6xl flex-col gap-6 animate-fade-in">
      <header className="flex flex-col gap-2">
        <div className="flex items-center gap-2 text-xs font-medium text-primary">
          <span className="inline-flex h-6 w-6 items-center justify-center rounded-md bg-primary/10">
            <BarChart3 className="h-3.5 w-3.5" />
          </span>
          Insights
        </div>
        <h1 className="text-2xl font-semibold tracking-tight sm:text-3xl">Productivity Analytics</h1>
        <p className="text-sm text-muted-foreground">
          A snapshot of your AI usage across TrudyM tools.
        </p>
      </header>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {cards.map((c) => (
          <div
            key={c.label}
            className="rounded-xl border bg-card p-5 shadow-sm transition hover:-translate-y-0.5 hover:shadow-md"
          >
            <c.icon className={`h-5 w-5 ${c.tint}`} />
            <p className="mt-3 text-2xl font-semibold tracking-tight">{c.value}</p>
            <p className="text-xs text-muted-foreground">{c.label}</p>
          </div>
        ))}
      </div>

      <div className="grid gap-4 lg:grid-cols-2">
        <div className="rounded-xl border bg-card p-5 shadow-sm">
          <h3 className="text-sm font-semibold">Responses in the last 7 days</h3>
          <div className="mt-6 flex h-40 items-end gap-3">
            {stats.days.map((d) => (
              <div key={d.label} className="flex flex-1 flex-col items-center gap-2">
                <div className="flex h-full w-full items-end">
                  <div
                    className="w-full rounded-t-md bg-gradient-to-t from-primary/60 to-primary transition-all"
                    style={{ height: `${(d.count / stats.max) * 100}%`, minHeight: d.count ? 4 : 0 }}
                  />
                </div>
                <span className="text-[10px] text-muted-foreground">{d.label}</span>
              </div>
            ))}
          </div>
        </div>

        <div className="rounded-xl border bg-card p-5 shadow-sm">
          <h3 className="text-sm font-semibold">Usage by tool</h3>
          <div className="mt-4 space-y-3">
            {stats.byTool.length === 0 && (
              <p className="text-xs text-muted-foreground">No data yet. Generate a response to see stats.</p>
            )}
            {stats.byTool.map(([tool, count]) => {
              const pct = (count / stats.total) * 100;
              return (
                <div key={tool}>
                  <div className="flex justify-between text-xs">
                    <span className="font-medium">{tool}</span>
                    <span className="text-muted-foreground">{count}</span>
                  </div>
                  <div className="mt-1 h-2 overflow-hidden rounded-full bg-muted">
                    <div
                      className="h-full rounded-full bg-primary transition-all"
                      style={{ width: `${pct}%` }}
                    />
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
}
