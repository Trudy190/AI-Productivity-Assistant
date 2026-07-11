import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { Mail } from "lucide-react";
import { AiPanel } from "@/components/ai/AiPanel";

export const Route = createFileRoute("/email")({
  component: EmailPage,
  head: () => ({
    meta: [
      { title: "Smart Email Generator — TrudyM AI" },
      { name: "description", content: "Draft polished workplace emails tuned to audience, tone and length." },
    ],
  }),
});

const audiences = ["Client", "Manager", "Team", "HR", "Supplier", "General Business"] as const;
const tones = ["Formal", "Friendly", "Informal", "Professional", "Persuasive", "Follow-up", "Apologetic"] as const;
const lengths = ["Short", "Medium", "Detailed"] as const;

function EmailPage() {
  const [audience, setAudience] = useState<(typeof audiences)[number]>("Client");
  const [tone, setTone] = useState<(typeof tones)[number]>("Professional");
  const [length, setLength] = useState<(typeof lengths)[number]>("Medium");

  return (
    <AiPanel
      toolId="email"
      title="Smart Email Generator"
      description="Describe the purpose of your email and TrudyM will craft it for your chosen audience, tone and length."
      icon={<Mail className="h-3.5 w-3.5" />}
      inputLabel="What is the email about?"
      inputPlaceholder="e.g. Ask a client to reschedule Friday's review to next Tuesday afternoon."
      ctaLabel="Generate email"
      system="You are an expert business writer. Draft clear, well-structured emails with a subject line, greeting and sign-off placeholder. Match the requested audience, tone and length precisely."
      buildPrompt={(input) =>
        `Write an email for the following context.\n\nAudience: ${audience}\nTone: ${tone}\nLength: ${length} (${length === "Short" ? "under 90 words" : length === "Medium" ? "120-180 words" : "220-320 words"}).\n\nContext / intent:\n${input}\n\nFormat:\n**Subject:** <subject line>\n\n<email body with greeting and [Your name] sign-off placeholder>`
      }
      controls={
        <div className="flex flex-wrap items-center gap-2">
          <Segmented label="Audience" value={audience} options={audiences} onChange={setAudience} />
          <Segmented label="Tone" value={tone} options={tones} onChange={setTone} />
          <Segmented label="Length" value={length} options={lengths} onChange={setLength} />
        </div>
      }
    />
  );
}

function Segmented<T extends string>({
  label,
  value,
  options,
  onChange,
}: {
  label: string;
  value: T;
  options: readonly T[];
  onChange: (v: T) => void;
}) {
  return (
    <label className="flex items-center gap-1.5 text-[11px] text-muted-foreground">
      <span className="uppercase tracking-wide">{label}</span>
      <select
        value={value}
        onChange={(e) => onChange(e.target.value as T)}
        className="h-8 rounded-md border bg-background px-2 text-xs text-foreground focus:outline-none focus:ring-2 focus:ring-primary/40"
      >
        {options.map((o) => (
          <option key={o} value={o}>
            {o}
          </option>
        ))}
      </select>
    </label>
  );
}
