import { createFileRoute } from "@tanstack/react-router";
import { Settings as SettingsIcon, Moon, Sun, Trash2 } from "lucide-react";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { useSettings } from "@/lib/settings-store";
import { useTheme } from "@/lib/theme";
import { clearHistory } from "@/lib/history-store";
import { toast } from "sonner";

export const Route = createFileRoute("/settings")({
  component: SettingsPage,
  head: () => ({
    meta: [
      { title: "Settings — TrudyM AI" },
      { name: "description", content: "Customize TrudyM AI: theme, notifications, history and disclaimers." },
    ],
  }),
});

function SettingsPage() {
  const { settings, update } = useSettings();
  const { theme, toggle, mounted } = useTheme();

  return (
    <div className="mx-auto flex w-full max-w-3xl flex-col gap-6 animate-fade-in">
      <header className="flex flex-col gap-2">
        <div className="flex items-center gap-2 text-xs font-medium text-primary">
          <span className="inline-flex h-6 w-6 items-center justify-center rounded-md bg-primary/10">
            <SettingsIcon className="h-3.5 w-3.5" />
          </span>
          Preferences
        </div>
        <h1 className="text-2xl font-semibold tracking-tight sm:text-3xl">Settings</h1>
        <p className="text-sm text-muted-foreground">Tune TrudyM to fit how you work.</p>
      </header>

      <section className="rounded-xl border bg-card p-6 shadow-sm">
        <h2 className="text-sm font-semibold">Appearance</h2>
        <p className="mt-1 text-xs text-muted-foreground">Switch between light and dark mode.</p>
        <div className="mt-4 flex items-center justify-between rounded-lg border bg-background p-3">
          <div className="flex items-center gap-3">
            {mounted && theme === "dark" ? (
              <Moon className="h-4 w-4" />
            ) : (
              <Sun className="h-4 w-4" />
            )}
            <div>
              <p className="text-sm font-medium">Dark mode</p>
              <p className="text-xs text-muted-foreground">
                Currently {mounted ? theme : "light"}
              </p>
            </div>
          </div>
          <Switch checked={theme === "dark"} onCheckedChange={toggle} />
        </div>
      </section>

      <section className="rounded-xl border bg-card p-6 shadow-sm">
        <h2 className="text-sm font-semibold">Notifications & AI</h2>
        <div className="mt-4 space-y-3">
          <ToggleRow
            id="notifs"
            label="In-app notifications"
            hint="Get notified when an AI response completes."
            checked={settings.notifications}
            onChange={(v) => update({ notifications: v })}
          />
          <ToggleRow
            id="auto"
            label="Auto-save responses to history"
            hint="Every generation is saved locally so you can find it later."
            checked={settings.autoSaveHistory}
            onChange={(v) => update({ autoSaveHistory: v })}
          />
          <ToggleRow
            id="disc"
            label="Show responsible AI disclaimer"
            hint="Display a disclaimer on each AI tool."
            checked={settings.showDisclaimer}
            onChange={(v) => update({ showDisclaimer: v })}
          />
        </div>
      </section>

      <section className="rounded-xl border bg-card p-6 shadow-sm">
        <h2 className="text-sm font-semibold">Data</h2>
        <p className="mt-1 text-xs text-muted-foreground">
          Your history is stored locally in this browser.
        </p>
        <Button
          variant="outline"
          className="mt-4 gap-2 text-destructive"
          onClick={() => {
            clearHistory();
            toast.success("History cleared");
          }}
        >
          <Trash2 className="h-4 w-4" /> Clear response history
        </Button>
      </section>
    </div>
  );
}

function ToggleRow({
  id,
  label,
  hint,
  checked,
  onChange,
}: {
  id: string;
  label: string;
  hint: string;
  checked: boolean;
  onChange: (v: boolean) => void;
}) {
  return (
    <div className="flex items-center justify-between gap-4 rounded-lg border bg-background p-3">
      <div>
        <Label htmlFor={id} className="text-sm font-medium">
          {label}
        </Label>
        <p className="text-xs text-muted-foreground">{hint}</p>
      </div>
      <Switch id={id} checked={checked} onCheckedChange={onChange} />
    </div>
  );
}
