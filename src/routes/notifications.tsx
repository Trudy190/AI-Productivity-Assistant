import { createFileRoute } from "@tanstack/react-router";
import { Bell, Check, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useNotifications } from "@/lib/settings-store";

export const Route = createFileRoute("/notifications")({
  component: NotificationsPage,
  head: () => ({
    meta: [
      { title: "Notifications — TrudyM AI" },
      { name: "description", content: "Your recent TrudyM AI notifications." },
    ],
  }),
});

function timeAgo(ts: number) {
  const s = Math.floor((Date.now() - ts) / 1000);
  if (s < 60) return `${s}s ago`;
  if (s < 3600) return `${Math.floor(s / 60)}m ago`;
  if (s < 86400) return `${Math.floor(s / 3600)}h ago`;
  return `${Math.floor(s / 86400)}d ago`;
}

function NotificationsPage() {
  const { items, unread, markAllRead, remove } = useNotifications();

  return (
    <div className="mx-auto flex w-full max-w-3xl flex-col gap-6 animate-fade-in">
      <header className="flex flex-col gap-2">
        <div className="flex items-center gap-2 text-xs font-medium text-primary">
          <span className="inline-flex h-6 w-6 items-center justify-center rounded-md bg-primary/10">
            <Bell className="h-3.5 w-3.5" />
          </span>
          Inbox
        </div>
        <div className="flex flex-wrap items-end justify-between gap-3">
          <div>
            <h1 className="text-2xl font-semibold tracking-tight sm:text-3xl">Notifications</h1>
            <p className="text-sm text-muted-foreground">
              {unread > 0 ? `${unread} unread` : "You're all caught up"}
            </p>
          </div>
          {unread > 0 && (
            <Button variant="outline" size="sm" onClick={markAllRead} className="gap-1.5">
              <Check className="h-3.5 w-3.5" /> Mark all read
            </Button>
          )}
        </div>
      </header>

      <div className="flex flex-col gap-2">
        {items.length === 0 && (
          <div className="rounded-xl border bg-card p-10 text-center text-sm text-muted-foreground">
            No notifications yet.
          </div>
        )}
        {items.map((n) => (
          <div
            key={n.id}
            className={
              "flex items-start justify-between gap-3 rounded-xl border p-4 shadow-sm transition hover:shadow-md animate-fade-in " +
              (n.read ? "bg-card" : "bg-primary/[0.03] border-primary/30")
            }
          >
            <div className="min-w-0">
              <div className="flex items-center gap-2">
                {!n.read && <span className="h-2 w-2 rounded-full bg-primary" />}
                <p className="text-sm font-medium">{n.title}</p>
                <span className="text-[11px] text-muted-foreground">{timeAgo(n.createdAt)}</span>
              </div>
              <p className="mt-1 text-sm text-muted-foreground">{n.body}</p>
            </div>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => remove(n.id)}
              className="text-destructive"
            >
              <Trash2 className="h-3.5 w-3.5" />
            </Button>
          </div>
        ))}
      </div>
    </div>
  );
}
