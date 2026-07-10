import { useEffect, useState } from "react";

const PROFILE_KEY = "trudym-profile";
const SETTINGS_KEY = "trudym-settings";
const NOTIFS_KEY = "trudym-notifs";

export type Profile = {
  name: string;
  email: string;
  role: string;
  bio: string;
};

export type Settings = {
  notifications: boolean;
  autoSaveHistory: boolean;
  showDisclaimer: boolean;
  defaultTone: "Formal" | "Friendly" | "Persuasive";
};

export type Notification = {
  id: string;
  title: string;
  body: string;
  createdAt: number;
  read: boolean;
};

const defaultProfile: Profile = {
  name: "Jordan Rivera",
  email: "jordan@company.com",
  role: "Product Manager",
  bio: "Building better workflows with AI.",
};

const defaultSettings: Settings = {
  notifications: true,
  autoSaveHistory: true,
  showDisclaimer: true,
  defaultTone: "Formal",
};

function read<T>(key: string, fallback: T): T {
  if (typeof window === "undefined") return fallback;
  try {
    const raw = localStorage.getItem(key);
    return raw ? { ...fallback, ...(JSON.parse(raw) as T) } : fallback;
  } catch {
    return fallback;
  }
}

const profileListeners = new Set<() => void>();
const settingsListeners = new Set<() => void>();
const notifListeners = new Set<() => void>();

export function useProfile() {
  const [profile, setProfile] = useState<Profile>(defaultProfile);
  useEffect(() => {
    setProfile(read(PROFILE_KEY, defaultProfile));
    const l = () => setProfile(read(PROFILE_KEY, defaultProfile));
    profileListeners.add(l);
    return () => {
      profileListeners.delete(l);
    };
  }, []);
  return {
    profile,
    save: (p: Profile) => {
      localStorage.setItem(PROFILE_KEY, JSON.stringify(p));
      profileListeners.forEach((l) => l());
    },
  };
}

export function useSettings() {
  const [settings, setSettings] = useState<Settings>(defaultSettings);
  useEffect(() => {
    setSettings(read(SETTINGS_KEY, defaultSettings));
    const l = () => setSettings(read(SETTINGS_KEY, defaultSettings));
    settingsListeners.add(l);
    return () => {
      settingsListeners.delete(l);
    };
  }, []);
  return {
    settings,
    update: (patch: Partial<Settings>) => {
      const next = { ...settings, ...patch };
      localStorage.setItem(SETTINGS_KEY, JSON.stringify(next));
      settingsListeners.forEach((l) => l());
    },
  };
}

export function pushNotification(n: Omit<Notification, "id" | "createdAt" | "read">) {
  if (typeof window === "undefined") return;
  const list = readNotifications();
  list.unshift({ ...n, id: crypto.randomUUID(), createdAt: Date.now(), read: false });
  localStorage.setItem(NOTIFS_KEY, JSON.stringify(list.slice(0, 50)));
  notifListeners.forEach((l) => l());
}

function readNotifications(): Notification[] {
  if (typeof window === "undefined") return [];
  try {
    const raw = localStorage.getItem(NOTIFS_KEY);
    return raw ? (JSON.parse(raw) as Notification[]) : seedNotifications();
  } catch {
    return [];
  }
}

function seedNotifications(): Notification[] {
  const seed: Notification[] = [
    {
      id: crypto.randomUUID(),
      title: "Welcome to TrudyM AI",
      body: "Explore the new Grammar Assistant, Document Summarizer, and Analytics.",
      createdAt: Date.now() - 1000 * 60 * 30,
      read: false,
    },
    {
      id: crypto.randomUUID(),
      title: "Tip: Save responses",
      body: "Your generations auto-save to History — search them anytime.",
      createdAt: Date.now() - 1000 * 60 * 60 * 3,
      read: false,
    },
  ];
  localStorage.setItem(NOTIFS_KEY, JSON.stringify(seed));
  return seed;
}

export function useNotifications() {
  const [items, setItems] = useState<Notification[]>([]);
  useEffect(() => {
    setItems(readNotifications());
    const l = () => setItems(readNotifications());
    notifListeners.add(l);
    return () => {
      notifListeners.delete(l);
    };
  }, []);
  return {
    items,
    unread: items.filter((n) => !n.read).length,
    markAllRead: () => {
      const next = readNotifications().map((n) => ({ ...n, read: true }));
      localStorage.setItem(NOTIFS_KEY, JSON.stringify(next));
      notifListeners.forEach((l) => l());
    },
    remove: (id: string) => {
      const next = readNotifications().filter((n) => n.id !== id);
      localStorage.setItem(NOTIFS_KEY, JSON.stringify(next));
      notifListeners.forEach((l) => l());
    },
  };
}
