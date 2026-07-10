import { createFileRoute } from "@tanstack/react-router";
import { useMemo, useState } from "react";
import { History, Search, Copy, Download, Trash2, Check } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useHistory, deleteHistory, clearHistory } from "@/lib/history-store";
import { exportToPDF } from "@/lib/pdf-export";
import { toast } from "sonner";

export const Route = createFileRoute("/history")({
  component: HistoryPage,
  head: () => ({
    meta: [
      { title: "Response History — TrudyM AI" },
      { name: "description", content: "Search, copy and export past AI responses." },
    ],
  }),
});

function HistoryPage() {
  const items = useHistory();
  const [query, setQuery] = useState("");
  const [copiedId, setCopiedId] = useState<string | null>(null);

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return items;
    return items.filter(
      (i) =>
        i.output.toLowerCase().includes(q) ||
        i.input.toLowerCase().includes(q) ||
        i.toolLabel.toLowerCase().includes(q),
    );
  }, [items, query]);

  const copy = async (id: string, text: string) => {
    await navigator.clipboard.writeText(text);
    setCopiedId(id);
    toast.success("Copied to clipboard");
    setTimeout(() => setCopiedId(null), 1500);
  };

  return (
    <div className="mx-auto flex w-full max-w-5xl flex-col gap-6 animate-fade-in">
      <header className="flex flex-col gap-2">
        <div className="flex items-center gap-2 text-xs font-medium text-primary">
          <span className="inline-flex h-6 w-6 items-center justify-center rounded-md bg-primary/10">
            <History className="h-3.5 w-3.5" />
          </span>
          Archive
        </div>
        <div className="flex flex-wrap items-end justify-between gap-3">
          <div>
            <h1 className="text-2xl font-semibold tracking-tight sm:text-3xl">Response History</h1>
            <p className="text-sm text-muted-foreground">
              {items.length} saved response{items.length === 1 ? "" : "s"} · searchable and exportable.
            </p>
          </div>
          {items.length > 0 && (
            <Button
              variant="outline"
              size="sm"
              onClick={() => {
                clearHistory();
                toast.success("History cleared");
              }}
              className="gap-1.5"
            >
              <Trash2 className="h-3.5 w-3.5" /> Clear all
            </Button>
          )}
        </div>
      </header>

      <div className="relative">
        <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
        <Input
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Search previous responses…"
          className="pl-9"
        />
      </div>

      <div className="flex flex-col gap-3">
        {filtered.length === 0 && (
          <div className="rounded-xl border bg-card p-10 text-center text-sm text-muted-foreground">
            {items.length === 0
              ? "No history yet — generate a response and it will appear here."
              : "No matches for your search."}
          </div>
        )}
        {filtered.map((entry) => (
          <details
            key={entry.id}
            className="group rounded-xl border bg-card p-4 shadow-sm transition hover:shadow-md animate-fade-in"
          >
            <summary className="flex cursor-pointer items-center justify-between gap-3 list-none">
              <div className="min-w-0">
                <div className="flex items-center gap-2">
                  <span className="rounded-md bg-primary/10 px-2 py-0.5 text-[10px] font-medium text-primary">
                    {entry.toolLabel}
                  </span>
                  <span className="text-[11px] text-muted-foreground">
                    {new Date(entry.createdAt).toLocaleString()}
                  </span>
                </div>
                <p className="mt-1.5 truncate text-sm font-medium">{entry.input}</p>
              </div>
              <div className="flex shrink-0 items-center gap-1">
                <Button
                  size="sm"
                  variant="ghost"
                  onClick={(e) => {
                    e.preventDefault();
                    copy(entry.id, entry.output);
                  }}
                  className="gap-1.5 text-xs"
                >
                  {copiedId === entry.id ? (
                    <Check className="h-3.5 w-3.5" />
                  ) : (
                    <Copy className="h-3.5 w-3.5" />
                  )}
                </Button>
                <Button
                  size="sm"
                  variant="ghost"
                  onClick={(e) => {
                    e.preventDefault();
                    exportToPDF(entry.toolLabel, entry.output);
                  }}
                  className="gap-1.5 text-xs"
                >
                  <Download className="h-3.5 w-3.5" />
                </Button>
                <Button
                  size="sm"
                  variant="ghost"
                  onClick={(e) => {
                    e.preventDefault();
                    deleteHistory(entry.id);
                  }}
                  className="gap-1.5 text-xs text-destructive"
                >
                  <Trash2 className="h-3.5 w-3.5" />
                </Button>
              </div>
            </summary>
            <div className="mt-4 whitespace-pre-wrap rounded-lg bg-muted/40 p-4 text-sm leading-relaxed">
              {entry.output}
            </div>
          </details>
        ))}
      </div>
    </div>
  );
}
