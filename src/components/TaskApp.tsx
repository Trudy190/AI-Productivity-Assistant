import { useMemo, useState } from "react";
import { Check, Plus, Moon, Sun, Trash2, Circle, Sparkles } from "lucide-react";
import { useTheme } from "@/lib/theme";
import { useTasksStore } from "@/lib/tasks-store";

export function TaskApp() {
  const { theme, toggle, mounted } = useTheme();
  const { tasks, categories, addTask, toggleTask, deleteTask, addCategory } = useTasksStore();

  const [activeCategory, setActiveCategory] = useState<string>("all");
  const [newTitle, setNewTitle] = useState("");
  const [newTaskCat, setNewTaskCat] = useState(categories[0]?.id ?? "");
  const [newCatName, setNewCatName] = useState("");
  const [showAddCat, setShowAddCat] = useState(false);

  const filtered = useMemo(
    () => (activeCategory === "all" ? tasks : tasks.filter((t) => t.categoryId === activeCategory)),
    [tasks, activeCategory],
  );

  const remaining = filtered.filter((t) => !t.completed).length;
  const done = filtered.filter((t) => t.completed).length;

  const catById = (id: string) => categories.find((c) => c.id === id);

  const handleAdd = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTitle.trim()) return;
    const cat = newTaskCat || categories[0]?.id;
    if (!cat) return;
    addTask(newTitle.trim(), cat);
    setNewTitle("");
  };

  const handleAddCat = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newCatName.trim()) return;
    addCategory(newCatName.trim());
    setNewCatName("");
    setShowAddCat(false);
  };

  return (
    <div className="min-h-screen bg-background text-foreground">
      <div className="mx-auto flex min-h-screen max-w-5xl flex-col px-6 py-10 sm:px-10">
        {/* Header */}
        <header className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary/10 text-primary">
              <Sparkles className="h-5 w-5" strokeWidth={1.75} />
            </div>
            <div>
              <h1 className="text-lg font-semibold tracking-tight">Serene</h1>
              <p className="text-xs text-muted-foreground">A calmer way to get things done</p>
            </div>
          </div>
          <button
            aria-label="Toggle theme"
            onClick={toggle}
            className="flex h-10 w-10 items-center justify-center rounded-xl border border-border bg-card text-muted-foreground transition hover:text-foreground"
          >
            {mounted && theme === "dark" ? <Sun className="h-4 w-4" /> : <Moon className="h-4 w-4" />}
          </button>
        </header>

        {/* Overview */}
        <section className="mt-10 grid gap-4 sm:grid-cols-3">
          <StatCard label="Open tasks" value={remaining} accent />
          <StatCard label="Completed" value={done} />
          <StatCard label="Categories" value={categories.length} />
        </section>

        {/* Add task */}
        <form
          onSubmit={handleAdd}
          className="mt-8 flex flex-col gap-3 rounded-2xl border border-border bg-card p-3 shadow-sm sm:flex-row sm:items-center"
        >
          <input
            value={newTitle}
            onChange={(e) => setNewTitle(e.target.value)}
            placeholder="What needs to be done?"
            className="flex-1 bg-transparent px-3 py-2 text-sm outline-none placeholder:text-muted-foreground"
          />
          <div className="flex items-center gap-2">
            <select
              value={newTaskCat}
              onChange={(e) => setNewTaskCat(e.target.value)}
              className="rounded-lg border border-border bg-background px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-ring"
            >
              {categories.map((c) => (
                <option key={c.id} value={c.id}>
                  {c.name}
                </option>
              ))}
            </select>
            <button
              type="submit"
              className="inline-flex items-center gap-1.5 rounded-lg bg-primary px-4 py-2 text-sm font-medium text-primary-foreground transition hover:opacity-90"
            >
              <Plus className="h-4 w-4" /> Add
            </button>
          </div>
        </form>

        {/* Categories */}
        <div className="mt-8 flex flex-wrap items-center gap-2">
          <CategoryPill
            label="All"
            active={activeCategory === "all"}
            onClick={() => setActiveCategory("all")}
            count={tasks.length}
          />
          {categories.map((c) => (
            <CategoryPill
              key={c.id}
              label={c.name}
              color={c.color}
              active={activeCategory === c.id}
              onClick={() => setActiveCategory(c.id)}
              count={tasks.filter((t) => t.categoryId === c.id).length}
            />
          ))}
          {showAddCat ? (
            <form onSubmit={handleAddCat} className="flex items-center gap-2">
              <input
                autoFocus
                value={newCatName}
                onChange={(e) => setNewCatName(e.target.value)}
                onBlur={() => !newCatName && setShowAddCat(false)}
                placeholder="Category name"
                className="rounded-full border border-border bg-card px-3 py-1.5 text-xs outline-none focus:ring-2 focus:ring-ring"
              />
            </form>
          ) : (
            <button
              onClick={() => setShowAddCat(true)}
              className="inline-flex items-center gap-1 rounded-full border border-dashed border-border px-3 py-1.5 text-xs text-muted-foreground transition hover:text-foreground"
            >
              <Plus className="h-3 w-3" /> New category
            </button>
          )}
        </div>

        {/* Task list */}
        <section className="mt-6 flex-1 space-y-2">
          {filtered.length === 0 ? (
            <div className="rounded-2xl border border-dashed border-border p-12 text-center">
              <p className="text-sm text-muted-foreground">
                Nothing here yet. Add your first task above.
              </p>
            </div>
          ) : (
            filtered
              .slice()
              .sort((a, b) => Number(a.completed) - Number(b.completed) || b.createdAt - a.createdAt)
              .map((t) => {
                const cat = catById(t.categoryId);
                return (
                  <div
                    key={t.id}
                    className="group flex items-center gap-4 rounded-xl border border-border bg-card px-4 py-3 transition hover:border-primary/40"
                  >
                    <button
                      aria-label={t.completed ? "Mark incomplete" : "Mark complete"}
                      onClick={() => toggleTask(t.id)}
                      className="flex h-6 w-6 items-center justify-center rounded-full border transition"
                      style={{
                        borderColor: t.completed ? cat?.color : "var(--color-border)",
                        backgroundColor: t.completed ? cat?.color : "transparent",
                      }}
                    >
                      {t.completed ? (
                        <Check className="h-3.5 w-3.5 text-white" strokeWidth={3} />
                      ) : (
                        <Circle className="h-3 w-3 opacity-0" />
                      )}
                    </button>
                    <div className="min-w-0 flex-1">
                      <p
                        className={
                          "truncate text-sm transition " +
                          (t.completed ? "text-muted-foreground line-through" : "text-foreground")
                        }
                      >
                        {t.title}
                      </p>
                    </div>
                    {cat && (
                      <span
                        className="inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-[11px] font-medium"
                        style={{
                          backgroundColor: `color-mix(in oklab, ${cat.color} 15%, transparent)`,
                          color: cat.color,
                        }}
                      >
                        <span
                          className="h-1.5 w-1.5 rounded-full"
                          style={{ backgroundColor: cat.color }}
                        />
                        {cat.name}
                      </span>
                    )}
                    <button
                      aria-label="Delete task"
                      onClick={() => deleteTask(t.id)}
                      className="text-muted-foreground opacity-0 transition hover:text-destructive group-hover:opacity-100"
                    >
                      <Trash2 className="h-4 w-4" />
                    </button>
                  </div>
                );
              })
          )}
        </section>

        <footer className="mt-10 text-center text-xs text-muted-foreground">
          {remaining === 0 && tasks.length > 0
            ? "All clear. Take a breath."
            : `${remaining} task${remaining === 1 ? "" : "s"} to focus on today.`}
        </footer>
      </div>
    </div>
  );
}

function StatCard({ label, value, accent }: { label: string; value: number; accent?: boolean }) {
  return (
    <div
      className={
        "rounded-2xl border p-5 transition " +
        (accent
          ? "border-primary/20 bg-primary/5"
          : "border-border bg-card")
      }
    >
      <p className="text-xs uppercase tracking-wider text-muted-foreground">{label}</p>
      <p className="mt-2 text-3xl font-semibold tracking-tight">{value}</p>
    </div>
  );
}

function CategoryPill({
  label,
  color,
  active,
  onClick,
  count,
}: {
  label: string;
  color?: string;
  active: boolean;
  onClick: () => void;
  count: number;
}) {
  return (
    <button
      onClick={onClick}
      className={
        "inline-flex items-center gap-2 rounded-full border px-3 py-1.5 text-xs font-medium transition " +
        (active
          ? "border-primary bg-primary text-primary-foreground"
          : "border-border bg-card text-muted-foreground hover:text-foreground")
      }
    >
      {color && (
        <span
          className="h-1.5 w-1.5 rounded-full"
          style={{ backgroundColor: active ? "currentColor" : color }}
        />
      )}
      {label}
      <span className={active ? "opacity-80" : "opacity-60"}>{count}</span>
    </button>
  );
}
