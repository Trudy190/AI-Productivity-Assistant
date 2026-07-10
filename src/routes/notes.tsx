import { createFileRoute } from "@tanstack/react-router";
import { FileText } from "lucide-react";
import { AiPanel } from "@/components/ai/AiPanel";

export const Route = createFileRoute("/notes")({
  component: NotesPage,
  head: () => ({
    meta: [
      { title: "Meeting Notes Summarizer — TrudyM AI" },
      { name: "description", content: "Turn messy meeting notes into a clean recap with action items and deadlines." },
    ],
  }),
});

function NotesPage() {
  return (
    <AiPanel
      title="Meeting Notes Summarizer"
      description="Paste raw notes or a transcript. TrudyM will extract a summary, decisions, action items and deadlines."
      icon={<FileText className="h-3.5 w-3.5" />}
      inputLabel="Meeting notes or transcript"
      inputPlaceholder="Paste your meeting notes or transcript here…"
      ctaLabel="Summarize meeting"
      minInputRows={10}
      system="You are a professional meeting scribe. You produce concise, well-structured recaps that highlight what matters."
      buildPrompt={(input) =>
        `Summarize the following meeting notes into clear markdown with these sections (use ## headings): \n\n## Summary\n## Decisions\n## Action Items (with owner)\n## Deadlines\n\nIf a section has no content, write "None noted".\n\nNotes:\n${input}`
      }
    />
  );
}
