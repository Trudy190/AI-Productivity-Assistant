import { ShieldAlert } from "lucide-react";

export function AiDisclaimer() {
  return (
    <div className="flex items-start gap-2.5 rounded-lg border border-amber-500/20 bg-amber-500/5 p-3 text-[11px] leading-relaxed text-muted-foreground animate-fade-in">
      <ShieldAlert className="mt-0.5 h-3.5 w-3.5 shrink-0 text-amber-600 dark:text-amber-400" />
      <div>
        <span className="font-medium text-foreground">Responsible AI:</span>{" "}
        Outputs may be inaccurate or biased. Review before sharing and never submit
        confidential or personal data.
      </div>
    </div>
  );
}
