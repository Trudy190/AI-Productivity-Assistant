import { createFileRoute } from "@tanstack/react-router";
import { SpellCheck } from "lucide-react";
import { AiPanel } from "@/components/ai/AiPanel";

export const Route = createFileRoute("/grammar")({
  component: GrammarPage,
  head: () => ({
    meta: [
      { title: "Grammar & Writing Assistant — TrudyM AI" },
      { name: "description", content: "Polish grammar, tone and clarity with AI-powered writing suggestions." },
    ],
  }),
});

function GrammarPage() {
  return (
    <AiPanel
      toolId="grammar"
      title="Grammar & Writing Assistant"
      description="Paste any text and TrudyM will fix grammar, improve clarity and suggest style upgrades."
      icon={<SpellCheck className="h-3.5 w-3.5" />}
      inputLabel="Text to improve"
      inputPlaceholder="Paste a paragraph, email, or document snippet…"
      ctaLabel="Improve writing"
      system="You are an expert editor. Correct grammar, spelling and punctuation, then improve clarity, tone and flow. Preserve the original meaning."
      buildPrompt={(input) =>
        `Improve the following text. Return two sections in markdown:\n\n## Corrected version\nThe polished text.\n\n## Key changes\nA short bulleted list of the most important edits.\n\nText:\n${input}`
      }
    />
  );
}
