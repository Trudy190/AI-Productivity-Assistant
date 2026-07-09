import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { ListChecks } from "lucide-react";
import { AiPanel } from "@/components/ai/AiPanel";

export const Route = createFileRoute("/tasks")({
  component: TasksPage,
  head: () => ({
    meta: [
      { title: "AI Task Planner — Nimbus AI" },
      { name: "description", content: "Turn your goals into a prioritized daily or weekly plan." },
    ],
  }),
});

const modes = ["Daily", "Weekly"] as const;

function TasksPage() {
  const [mode, setMode] = useState<(typeof modes)[number]>("Daily");

  return (
    <AiPanel
      title="AI Task Planner"
      description="List your goals and constraints. Nimbus builds a prioritized schedule you can tweak."
      icon={<ListChecks className="h-3.5 w-3.5" />}
      inputLabel="Goals, tasks and constraints"
      inputPlaceholder="e.g. Ship v2 landing page, prep board deck, 1:1 with Alex, 3 deep-work blocks."
      ctaLabel={`Plan my ${mode.toLowerCase()}`}
      system="You are an executive coach that builds realistic, priority-driven schedules. You respect focus time and buffers, and clearly mark high/medium/low priority."
      buildPrompt={(input) =>
        `Build a ${mode.toLowerCase()} plan in markdown for the tasks below.\n\nRequirements:\n- Group by ${mode === "Daily" ? "time blocks (Morning / Midday / Afternoon)" : "day (Mon–Fri)"}\n- Mark each item with a priority tag: **[High]**, **[Med]**, **[Low]**\n- Add a short "Focus of the ${mode === "Daily" ? "day" : "week"}" line at the top\n- End with 2-3 realistic tips.\n\nTasks:\n${input}`
      }
      controls={
        <div className="flex rounded-lg border bg-background p-0.5 text-xs">
          {modes.map((m) => (
            <button
              key={m}
              onClick={() => setMode(m)}
              className={
                "rounded-md px-2.5 py-1 font-medium transition " +
                (mode === m
                  ? "bg-primary text-primary-foreground"
                  : "text-muted-foreground hover:text-foreground")
              }
            >
              {m}
            </button>
          ))}
        </div>
      }
    />
  );
}
