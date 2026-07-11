import { useEffect, useState, type ReactNode } from "react";
import ReactMarkdown from "react-markdown";
import { Copy, Check, Sparkles, Loader2, RotateCcw, Download, Save, RefreshCw, Trash2, FileDown } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "sonner";
import { generateAI } from "@/lib/ai-client";
import { saveHistory } from "@/lib/history-store";
import { exportToPDF } from "@/lib/pdf-export";
import { AiDisclaimer } from "@/components/AiDisclaimer";
import { pushNotification, useSettings } from "@/lib/settings-store";

type Props = {
  title: string;
  description: string;
  icon: ReactNode;
  inputLabel: string;
  inputPlaceholder: string;
  ctaLabel: string;
  system: string;
  buildPrompt: (input: string) => string;
  controls?: ReactNode;
  minInputRows?: number;
  toolId: string;
};

export function AiPanel({
  title,
  description,
  icon,
  inputLabel,
  inputPlaceholder,
  ctaLabel,
  system,
  buildPrompt,
  controls,
  minInputRows = 6,
  toolId,
}: Props) {
  const [input, setInput] = useState("");
  const [output, setOutput] = useState("");
  const [loading, setLoading] = useState(false);
  const [copied, setCopied] = useState(false);
  const [editing, setEditing] = useState(false);
  const { settings } = useSettings();

  const run = async () => {
    if (!input.trim()) {
      toast.error("Please add some input first");
      return;
    }
    setLoading(true);
    setOutput("");
    setEditing(false);
    try {
      const text = await generateAI({ system, prompt: buildPrompt(input) });
      setOutput(text);
      if (settings.autoSaveHistory) {
        saveHistory({ tool: toolId, toolLabel: title, input, output: text });
      }
      if (settings.notifications) {
        pushNotification({
          title: `${title} completed`,
          body: text.slice(0, 120) + (text.length > 120 ? "…" : ""),
        });
      }
    } catch (e) {
      toast.error(e instanceof Error ? e.message : "Failed to generate");
    } finally {
      setLoading(false);
    }
  };

  const copy = async () => {
    if (!output) return;
    await navigator.clipboard.writeText(output);
    setCopied(true);
    toast.success("Copied to clipboard");
    setTimeout(() => setCopied(false), 1600);
  };

  useEffect(() => {
    setCopied(false);
  }, [output]);

  return (
    <div className="mx-auto flex w-full max-w-6xl flex-col gap-6 animate-fade-in">
      <header className="flex flex-col gap-2">
        <div className="flex items-center gap-2 text-xs font-medium text-primary">
          <span className="inline-flex h-6 w-6 items-center justify-center rounded-md bg-primary/10">
            {icon}
          </span>
          AI Workspace
        </div>
        <h1 className="text-2xl font-semibold tracking-tight sm:text-3xl">{title}</h1>
        <p className="max-w-2xl text-sm text-muted-foreground">{description}</p>
      </header>

      {settings.showDisclaimer && <AiDisclaimer />}

      <div className="grid gap-5 lg:grid-cols-2">
        {/* Input */}
        <div className="flex flex-col gap-3 rounded-xl border bg-card p-5 shadow-sm transition hover:shadow-md">
          <div className="flex items-center justify-between gap-2">
            <label className="text-sm font-medium">{inputLabel}</label>
            {controls}
          </div>
          <Textarea
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder={inputPlaceholder}
            rows={minInputRows}
            className="min-h-[180px] resize-y bg-background text-sm"
          />
          <div className="flex items-center justify-between gap-2">
            <p className="text-xs text-muted-foreground">{input.length} characters</p>
            <Button onClick={run} disabled={loading} className="gap-2">
              {loading ? (
                <Loader2 className="h-4 w-4 animate-spin" />
              ) : (
                <Sparkles className="h-4 w-4" />
              )}
              {loading ? "Generating…" : ctaLabel}
            </Button>
          </div>
        </div>

        {/* Output */}
        <div className="flex flex-col gap-3 rounded-xl border bg-card p-5 shadow-sm transition hover:shadow-md">
          <div className="flex flex-wrap items-center justify-between gap-2">
            <label className="text-sm font-medium">AI response</label>
            <div className="flex flex-wrap items-center gap-1">
              {output && (
                <>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => setEditing((v) => !v)}
                    className="gap-1.5 text-xs"
                  >
                    <RotateCcw className="h-3.5 w-3.5" />
                    {editing ? "Preview" : "Edit"}
                  </Button>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => {
                      saveHistory({ tool: toolId, toolLabel: title, input, output });
                      toast.success("Saved to history");
                    }}
                    className="gap-1.5 text-xs"
                  >
                    <Save className="h-3.5 w-3.5" />
                    Save
                  </Button>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => exportToPDF(title, output)}
                    className="gap-1.5 text-xs"
                  >
                    <Download className="h-3.5 w-3.5" />
                    PDF
                  </Button>
                  <Button variant="ghost" size="sm" onClick={copy} className="gap-1.5 text-xs">
                    {copied ? (
                      <Check className="h-3.5 w-3.5" />
                    ) : (
                      <Copy className="h-3.5 w-3.5" />
                    )}
                    {copied ? "Copied" : "Copy"}
                  </Button>
                </>
              )}
            </div>
          </div>

          <div className="min-h-[280px] rounded-lg border bg-background/60 p-4 text-sm">
            {loading ? (
              <div className="flex h-full min-h-[240px] items-center justify-center gap-2 text-muted-foreground">
                <Loader2 className="h-4 w-4 animate-spin" />
                <span className="text-xs">Thinking through your request…</span>
              </div>
            ) : output ? (
              editing ? (
                <Textarea
                  value={output}
                  onChange={(e) => setOutput(e.target.value)}
                  rows={14}
                  className="min-h-[260px] resize-y border-0 bg-transparent p-0 focus-visible:ring-0"
                />
              ) : (
                <article className="animate-fade-in text-sm leading-relaxed [&_h1]:mt-4 [&_h1]:mb-2 [&_h1]:text-lg [&_h1]:font-semibold [&_h2]:mt-4 [&_h2]:mb-2 [&_h2]:text-base [&_h2]:font-semibold [&_h3]:mt-3 [&_h3]:mb-1.5 [&_h3]:font-semibold [&_p]:my-2 [&_ul]:my-2 [&_ul]:list-disc [&_ul]:pl-5 [&_ol]:my-2 [&_ol]:list-decimal [&_ol]:pl-5 [&_li]:my-0.5 [&_strong]:font-semibold [&_code]:rounded [&_code]:bg-muted [&_code]:px-1 [&_code]:py-0.5 [&_code]:text-[0.85em] [&_a]:text-primary [&_a]:underline">
                  <ReactMarkdown>{output}</ReactMarkdown>
                </article>
              )
            ) : (
              <div className="flex h-full min-h-[240px] flex-col items-center justify-center text-center text-xs text-muted-foreground">
                <Sparkles className="mb-2 h-5 w-5 opacity-40" />
                Your AI-generated response will appear here.
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
