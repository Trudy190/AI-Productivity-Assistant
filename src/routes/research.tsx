import { createFileRoute } from "@tanstack/react-router";
import { BookOpen } from "lucide-react";
import { AiPanel } from "@/components/ai/AiPanel";

export const Route = createFileRoute("/research")({
  component: ResearchPage,
  head: () => ({
    meta: [
      { title: "AI Research Assistant — Nimbus AI" },
      { name: "description", content: "Get quick summaries, insights and recommendations on any topic." },
    ],
  }),
});

function ResearchPage() {
  return (
    <AiPanel
      title="AI Research Assistant"
      description="Enter a topic or question. Nimbus returns a structured briefing with key insights and next-step recommendations."
      icon={<BookOpen className="h-3.5 w-3.5" />}
      inputLabel="Research topic or question"
      inputPlaceholder="e.g. Trends in employee onboarding automation for mid-size SaaS companies."
      ctaLabel="Research topic"
      system="You are a rigorous research analyst. You are transparent about uncertainty and never fabricate statistics. When you're unsure, say so."
      buildPrompt={(input) =>
        `Research the following topic and respond in markdown with these sections:\n\n## Summary\n## Key Insights (bulleted)\n## Considerations & Risks\n## Recommendations (bulleted, actionable)\n## Suggested Further Reading (topic areas, not fabricated URLs)\n\nTopic:\n${input}`
      }
    />
  );
}
