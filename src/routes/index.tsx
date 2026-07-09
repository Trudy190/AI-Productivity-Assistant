import { createFileRoute } from "@tanstack/react-router";
import { TaskApp } from "@/components/TaskApp";

export const Route = createFileRoute("/")({
  component: TaskApp,
  head: () => ({
    meta: [
      { title: "Serene — A calmer task manager" },
      {
        name: "description",
        content:
          "Serene is a minimal task manager with categories, dark mode, and a calming blue palette to help you focus.",
      },
      { property: "og:title", content: "Serene — A calmer task manager" },
      {
        property: "og:description",
        content: "Minimal tasks, categories, and dark mode in a calming blue palette.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
});
