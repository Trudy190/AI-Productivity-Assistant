import { useEffect, useState } from "react";

export type Category = {
  id: string;
  name: string;
  color: string; // oklch or hex
};

export type Task = {
  id: string;
  title: string;
  completed: boolean;
  categoryId: string;
  createdAt: number;
};

const TASKS_KEY = "serene-tasks";
const CATS_KEY = "serene-cats";

const defaultCategories: Category[] = [
  { id: "work", name: "Work", color: "oklch(0.58 0.14 245)" },
  { id: "personal", name: "Personal", color: "oklch(0.65 0.13 195)" },
  { id: "ideas", name: "Ideas", color: "oklch(0.7 0.12 285)" },
];

const defaultTasks: Task[] = [
  { id: "1", title: "Review quarterly design proposal", completed: false, categoryId: "work", createdAt: Date.now() - 3000 },
  { id: "2", title: "Morning walk by the river", completed: true, categoryId: "personal", createdAt: Date.now() - 2000 },
  { id: "3", title: "Sketch onboarding illustrations", completed: false, categoryId: "ideas", createdAt: Date.now() - 1000 },
];

export function useTasksStore() {
  const [tasks, setTasks] = useState<Task[]>(defaultTasks);
  const [categories, setCategories] = useState<Category[]>(defaultCategories);
  const [hydrated, setHydrated] = useState(false);

  useEffect(() => {
    try {
      const t = localStorage.getItem(TASKS_KEY);
      const c = localStorage.getItem(CATS_KEY);
      if (t) setTasks(JSON.parse(t));
      if (c) setCategories(JSON.parse(c));
    } catch {}
    setHydrated(true);
  }, []);

  useEffect(() => {
    if (hydrated) localStorage.setItem(TASKS_KEY, JSON.stringify(tasks));
  }, [tasks, hydrated]);

  useEffect(() => {
    if (hydrated) localStorage.setItem(CATS_KEY, JSON.stringify(categories));
  }, [categories, hydrated]);

  return {
    tasks,
    categories,
    addTask: (title: string, categoryId: string) =>
      setTasks((prev) => [
        { id: crypto.randomUUID(), title, completed: false, categoryId, createdAt: Date.now() },
        ...prev,
      ]),
    toggleTask: (id: string) =>
      setTasks((prev) => prev.map((t) => (t.id === id ? { ...t, completed: !t.completed } : t))),
    deleteTask: (id: string) => setTasks((prev) => prev.filter((t) => t.id !== id)),
    addCategory: (name: string) => {
      const palette = [
        "oklch(0.58 0.14 245)",
        "oklch(0.65 0.13 195)",
        "oklch(0.7 0.12 285)",
        "oklch(0.68 0.14 155)",
        "oklch(0.72 0.14 60)",
        "oklch(0.65 0.18 25)",
      ];
      const color = palette[Math.floor(Math.random() * palette.length)];
      setCategories((prev) => [...prev, { id: crypto.randomUUID(), name, color }]);
    },
  };
}
