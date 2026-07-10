import { useEffect, useState } from "react";

const KEY = "trudym-history";

export type HistoryEntry = {
  id: string;
  tool: string;
  toolLabel: string;
  input: string;
  output: string;
  createdAt: number;
};

type Listener = () => void;
const listeners = new Set<Listener>();

function read(): HistoryEntry[] {
  if (typeof window === "undefined") return [];
  try {
    const raw = localStorage.getItem(KEY);
    return raw ? (JSON.parse(raw) as HistoryEntry[]) : [];
  } catch {
    return [];
  }
}

function write(entries: HistoryEntry[]) {
  localStorage.setItem(KEY, JSON.stringify(entries));
  listeners.forEach((l) => l());
}

export function saveHistory(entry: Omit<HistoryEntry, "id" | "createdAt">) {
  const all = read();
  const next: HistoryEntry = {
    ...entry,
    id: crypto.randomUUID(),
    createdAt: Date.now(),
  };
  all.unshift(next);
  write(all.slice(0, 200));
  return next;
}

export function deleteHistory(id: string) {
  write(read().filter((e) => e.id !== id));
}

export function clearHistory() {
  write([]);
}

export function useHistory() {
  const [entries, setEntries] = useState<HistoryEntry[]>([]);
  useEffect(() => {
    setEntries(read());
    const l = () => setEntries(read());
    listeners.add(l);
    return () => {
      listeners.delete(l);
    };
  }, []);
  return entries;
}
