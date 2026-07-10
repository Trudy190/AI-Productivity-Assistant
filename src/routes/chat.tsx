import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useRef, useState } from "react";
import ReactMarkdown from "react-markdown";
import { Copy, Loader2, MessageSquare, Send, Sparkles, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "sonner";
import { generateAI, type ChatMessage } from "@/lib/ai-client";

export const Route = createFileRoute("/chat")({
  component: ChatPage,
  head: () => ({
    meta: [
      { title: "Workplace Chatbot — TrudyM AI" },
      { name: "description", content: "Chat with TrudyM, your interactive workplace assistant." },
    ],
  }),
});

const SYSTEM: ChatMessage = {
  role: "system",
  content:
    "You are TrudyM, a helpful, concise workplace productivity assistant. Format responses in short paragraphs and bullet lists when useful. Be practical and professional.",
};

const suggestions = [
  "Draft a polite nudge to a teammate who missed a deadline.",
  "Give me 5 icebreakers for a remote team stand-up.",
  "Explain OKRs in 3 sentences.",
  "Suggest a weekly rhythm for a 6-person product team.",
];

function ChatPage() {
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const scrollerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    scrollerRef.current?.scrollTo({ top: scrollerRef.current.scrollHeight, behavior: "smooth" });
  }, [messages, loading]);

  const send = async (text: string) => {
    if (!text.trim() || loading) return;
    const next: ChatMessage[] = [...messages, { role: "user", content: text.trim() }];
    setMessages(next);
    setInput("");
    setLoading(true);
    try {
      const reply = await generateAI({ messages: [SYSTEM, ...next] });
      setMessages((m) => [...m, { role: "assistant", content: reply }]);
    } catch (e) {
      toast.error(e instanceof Error ? e.message : "Failed to reply");
      setMessages((m) => m.slice(0, -1));
      setInput(text);
    } finally {
      setLoading(false);
    }
  };

  const copy = async (t: string) => {
    await navigator.clipboard.writeText(t);
    toast.success("Copied");
  };

  return (
    <div className="mx-auto flex h-[calc(100vh-8rem)] w-full max-w-4xl flex-col gap-4">
      <header className="flex items-center gap-2 text-xs font-medium text-primary">
        <span className="inline-flex h-6 w-6 items-center justify-center rounded-md bg-primary/10">
          <MessageSquare className="h-3.5 w-3.5" />
        </span>
        Workplace Chatbot
        {messages.length > 0 && (
          <button
            onClick={() => setMessages([])}
            className="ml-auto inline-flex items-center gap-1 rounded-md px-2 py-1 text-xs text-muted-foreground hover:text-foreground"
          >
            <Trash2 className="h-3.5 w-3.5" /> Clear
          </button>
        )}
      </header>

      <div className="flex flex-1 flex-col overflow-hidden rounded-xl border bg-card shadow-sm">
        <div ref={scrollerRef} className="flex-1 overflow-y-auto p-5">
          {messages.length === 0 ? (
            <div className="mx-auto flex h-full max-w-lg flex-col items-center justify-center text-center">
              <div className="mb-3 flex h-12 w-12 items-center justify-center rounded-2xl bg-primary/10 text-primary">
                <Sparkles className="h-5 w-5" />
              </div>
              <h2 className="text-lg font-semibold">How can I help you today?</h2>
              <p className="mt-1 text-sm text-muted-foreground">
                Ask about drafting messages, team rituals, planning, or anything work-related.
              </p>
              <div className="mt-6 grid w-full gap-2 sm:grid-cols-2">
                {suggestions.map((s) => (
                  <button
                    key={s}
                    onClick={() => send(s)}
                    className="rounded-lg border bg-background p-3 text-left text-xs text-muted-foreground transition hover:border-primary/50 hover:text-foreground"
                  >
                    {s}
                  </button>
                ))}
              </div>
            </div>
          ) : (
            <div className="space-y-5">
              {messages.map((m, i) => (
                <div key={i} className={m.role === "user" ? "flex justify-end" : "group"}>
                  {m.role === "user" ? (
                    <div className="max-w-[85%] rounded-2xl rounded-tr-sm bg-primary px-4 py-2.5 text-sm text-primary-foreground shadow-sm">
                      {m.content}
                    </div>
                  ) : (
                    <div className="flex gap-3">
                      <div className="mt-0.5 flex h-7 w-7 shrink-0 items-center justify-center rounded-lg bg-primary/10 text-primary">
                        <Sparkles className="h-3.5 w-3.5" />
                      </div>
                      <div className="min-w-0 flex-1">
                        <div className="text-sm leading-relaxed [&_p]:my-2 [&_ul]:my-2 [&_ul]:list-disc [&_ul]:pl-5 [&_ol]:my-2 [&_ol]:list-decimal [&_ol]:pl-5 [&_li]:my-0.5 [&_strong]:font-semibold [&_code]:rounded [&_code]:bg-muted [&_code]:px-1 [&_code]:py-0.5">
                          <ReactMarkdown>{m.content}</ReactMarkdown>
                        </div>
                        <button
                          onClick={() => copy(m.content)}
                          className="mt-1 inline-flex items-center gap-1 rounded-md px-1.5 py-0.5 text-[11px] text-muted-foreground opacity-0 transition hover:text-foreground group-hover:opacity-100"
                        >
                          <Copy className="h-3 w-3" /> Copy
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              ))}
              {loading && (
                <div className="flex gap-3">
                  <div className="mt-0.5 flex h-7 w-7 shrink-0 items-center justify-center rounded-lg bg-primary/10 text-primary">
                    <Sparkles className="h-3.5 w-3.5" />
                  </div>
                  <div className="flex items-center gap-2 text-sm text-muted-foreground">
                    <Loader2 className="h-3.5 w-3.5 animate-spin" /> Thinking…
                  </div>
                </div>
              )}
            </div>
          )}
        </div>

        <form
          onSubmit={(e) => {
            e.preventDefault();
            send(input);
          }}
          className="border-t bg-background/60 p-3"
        >
          <div className="flex items-end gap-2">
            <Textarea
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter" && !e.shiftKey) {
                  e.preventDefault();
                  send(input);
                }
              }}
              placeholder="Ask TrudyM anything…"
              rows={1}
              className="min-h-[44px] flex-1 resize-none border-0 bg-transparent text-sm shadow-none focus-visible:ring-0"
            />
            <Button type="submit" disabled={loading || !input.trim()} size="icon" className="shrink-0">
              {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : <Send className="h-4 w-4" />}
            </Button>
          </div>
          <p className="mt-2 text-[11px] text-muted-foreground">
            AI-generated. Verify important info before acting on it.
          </p>
        </form>
      </div>
    </div>
  );
}
