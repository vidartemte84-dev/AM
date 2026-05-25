'use client';

import { useCallback, useEffect, useState } from 'react';
import { AppData } from './types';
import { DEFAULT_CATEGORIES } from './defaults';

const STORAGE_KEY = 'pl_app_data_v1';

const EMPTY: AppData = {
  categories: DEFAULT_CATEGORIES,
  entries: [],
  goals: [],
  notes: [],
};

function load(): AppData {
  if (typeof window === 'undefined') return EMPTY;
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    if (!raw) return EMPTY;
    const parsed = JSON.parse(raw) as Partial<AppData>;
    return {
      categories: parsed.categories?.length ? parsed.categories : DEFAULT_CATEGORIES,
      entries:    parsed.entries  ?? [],
      goals:      parsed.goals    ?? [],
      notes:      parsed.notes    ?? [],
    };
  } catch {
    return EMPTY;
  }
}

function persist(data: AppData) {
  if (typeof window === 'undefined') return;
  window.localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
}

type Listener = (d: AppData) => void;
const listeners = new Set<Listener>();

export function useStore() {
  const [data, setData] = useState<AppData>(EMPTY);
  const [hydrated, setHydrated] = useState(false);

  useEffect(() => {
    setData(load());
    setHydrated(true);
    const l: Listener = (d) => setData(d);
    listeners.add(l);
    return () => { listeners.delete(l); };
  }, []);

  const update = useCallback((updater: (d: AppData) => AppData) => {
    const next = updater(load());
    persist(next);
    listeners.forEach((l) => l(next));
  }, []);

  return { data, hydrated, update };
}

export const newId = () =>
  Math.random().toString(36).slice(2, 9) + Date.now().toString(36).slice(-4);

export function todayISO(): string {
  const d = new Date();
  const y = d.getFullYear();
  const m = String(d.getMonth() + 1).padStart(2, '0');
  const day = String(d.getDate()).padStart(2, '0');
  return `${y}-${m}-${day}`;
}

export function startOfPeriod(period: 'day' | 'week' | 'month'): Date {
  const d = new Date();
  d.setHours(0, 0, 0, 0);
  if (period === 'day') return d;
  if (period === 'week') {
    const day = d.getDay(); // 0 = Sun
    const diff = (day + 6) % 7; // make Monday = 0
    d.setDate(d.getDate() - diff);
    return d;
  }
  d.setDate(1);
  return d;
}
