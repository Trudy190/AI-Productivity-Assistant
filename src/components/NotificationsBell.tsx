import { Bell } from "lucide-react";
import { Link } from "@tanstack/react-router";
import { useNotifications } from "@/lib/settings-store";
import { Button } from "@/components/ui/button";

export function NotificationsBell() {
  const { unread } = useNotifications();
  return (
    <Button
      asChild
      variant="ghost"
      size="icon"
      className="relative h-9 w-9"
      aria-label="Notifications"
    >
      <Link to="/notifications">
        <Bell className="h-4 w-4" />
        {unread > 0 && (
          <span className="absolute right-1.5 top-1.5 flex h-4 min-w-4 items-center justify-center rounded-full bg-primary px-1 text-[10px] font-semibold text-primary-foreground animate-scale-in">
            {unread}
          </span>
        )}
      </Link>
    </Button>
  );
}
