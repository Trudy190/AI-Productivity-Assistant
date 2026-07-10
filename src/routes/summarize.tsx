import { createFileRoute } from "@tanstack/react-router";
import { FileSearch } from "lucide-react";
import { useState } from "react";
import { AiPanel } from "@/components/ai/AiPanel";

const lengths = ["Short", "Medium", "Detailed"] as const;

export const Route = createFileRoute("/summarize")({
  component: SummarizePage,
  head: () => ({
    meta: [
      { title: "Document Summarizer — TrudyM AI" },
      { name: "description", content: "Summarize long documents into concise, structured briefs." },
    ],
  }),
});

function SummarizePage() {
  const [length, setLength] = useState<(typeof lengths)[number]>("Medium");
  return (
    <AiPanel
      toolId="summarize"
      title="Document Summarizer"
      description="Paste a long document and get a structured summary with key points and takeaways."
      icon={<FileSearch className="h-3.5 w-3.5" />}
      inputLabel="Document text"
      inputPlaceholder="Paste the full document text here…"
      ctaLabel="Summarize"
      minInputRows={10}
      system="You are an expert analyst. Produce accurate, well-structured summaries that preserve the original meaning and highlight the most important information."
      buildPrompt={(input) =>
        `Summarize the following document at ${length.toLowerCase()} length. Use markdown with these sections:\n\n## Overview\n## Key points (bulleted)\n## Takeaways\n\nDocument:\n${input}`
      }
      controls={
        <div className="flex rounded-lg border bg-background p-0.5 text-xs">
          {lengths.map((l) => (
            <button
              key={l}
              onClick={() => setLength(l)}
              className={
                "rounded-md px-2.5 py-1 font-medium transition " +
                (length === l
                  ? "bg-primary text-primary-foreground"
                  : "text-muted-foreground hover:text-foreground")
              }
            >
              {l}
            </button>
          ))}
        </div>
      }
    />
  );
}
