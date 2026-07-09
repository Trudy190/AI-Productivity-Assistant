import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { Mail } from "lucide-react";
import { AiPanel } from "@/components/ai/AiPanel";

export const Route = createFileRoute("/email")({
  component: EmailPage,
  head: () => ({
    meta: [
      { title: "Smart Email Generator — Nimbus AI" },
      { name: "description", content: "Draft polished emails in formal, friendly or persuasive tones." },
    ],
  }),
});

const tones = ["Formal", "Friendly", "Persuasive"] as const;

function EmailPage() {
  const [tone, setTone] = useState<(typeof tones)[number]>("Formal");

  return (
    <AiPanel
      title="Smart Email Generator"
      description="Describe what you want to say and Nimbus will draft an email in your chosen tone."
      icon={<Mail className="h-3.5 w-3.5" />}
      inputLabel="What is the email about?"
      inputPlaceholder="e.g. Ask a client to reschedule Friday's review to next Tuesday afternoon."
      ctaLabel="Generate email"
      system="You are an expert business writer. Draft clear, well-structured emails with a subject line and greeting. Keep them concise, on-brand and free of jargon."
      buildPrompt={(input) =>
        `Write an email in a ${tone.toLowerCase()} tone.\n\nContext / intent:\n${input}\n\nFormat: Provide a Subject line, then the email body with a greeting and sign-off placeholder.`
      }
      controls={
        <div className="flex rounded-lg border bg-background p-0.5 text-xs">
          {tones.map((t) => (
            <button
              key={t}
              onClick={() => setTone(t)}
              className={
                "rounded-md px-2.5 py-1 font-medium transition " +
                (tone === t
                  ? "bg-primary text-primary-foreground"
                  : "text-muted-foreground hover:text-foreground")
              }
            >
              {t}
            </button>
          ))}
        </div>
      }
    />
  );
}
