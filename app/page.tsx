'use client';

import { useMemo, useState } from 'react';
import Link from 'next/link';
import { ArrowRight, Flame } from 'lucide-react';
import { Header } from '@/components/Header';
import { CategoryIcon } from '@/components/CategoryIcon';
import { FAB } from '@/components/FAB';
import { QuickAddSheet } from '@/components/QuickAddSheet';
import { useStore, todayISO, startOfPeriod } from '@/lib/store';
import { Category, Goal, LogEntry } from '@/lib/types';

function greeting() {
  const h = new Date().getHours();
  if (h < 5)  return 'Late night';
  if (h < 12) return 'Good morning';
  if (h < 17) return 'Good afternoon';
  if (h < 22) return 'Good evening';
  return 'Late night';
}

function todayLabel() {
  return new Date().toLocaleDateString(undefined, { weekday: 'long', month: 'long', day: 'numeric' });
}

function progressForGoal(goal: Goal, entries: LogEntry[]): number {
  const since = startOfPeriod(goal.period).getTime();
  return entries
    .filter((e) => {
      if (goal.categoryId && e.categoryId !== goal.categoryId) return false;
      return new Date(e.date).getTime() >= since;
    })
    .reduce((sum, e) => sum + (e.value || 0), 0);
}

function streakDays(entries: LogEntry[]): number {
  if (!entries.length) return 0;
  const dates = new Set(entries.map((e) => e.date));
  let count = 0;
  const d = new Date();
  while (true) {
    const y = d.getFullYear();
    const m = String(d.getMonth() + 1).padStart(2, '0');
    const day = String(d.getDate()).padStart(2, '0');
    const iso = `${y}-${m}-${day}`;
    if (dates.has(iso)) {
      count++;
      d.setDate(d.getDate() - 1);
    } else if (count === 0 && iso === todayISO()) {
      // allow today to be skipped if streak continues from yesterday
      d.setDate(d.getDate() - 1);
    } else {
      break;
    }
  }
  return count;
}

export default function Dashboard() {
  const { data, hydrated } = useStore();
  const [adding, setAdding] = useState(false);
  const [presetCategory, setPresetCategory] = useState<string | undefined>();

  const today = todayISO();
  const todayEntries = useMemo(
    () => data.entries.filter((e) => e.date === today),
    [data.entries, today]
  );
  const streak = useMemo(() => streakDays(data.entries), [data.entries]);

  const byCategory = useMemo(() => {
    const map = new Map<string, { category: Category; total: number; count: number }>();
    for (const c of data.categories) map.set(c.id, { category: c, total: 0, count: 0 });
    for (const e of todayEntries) {
      const slot = map.get(e.categoryId);
      if (!slot) continue;
      slot.count += 1;
      slot.total += e.value || 0;
    }
    return Array.from(map.values());
  }, [data.categories, todayEntries]);

  const activeGoals = useMemo(
    () => data.goals.filter((g) => !g.archived).slice(0, 3),
    [data.goals]
  );

  function openAdd(catId?: string) {
    setPresetCategory(catId);
    setAdding(true);
  }

  if (!hydrated) return null;

  return (
    <>
      <Header
        title={greeting()}
        subtitle={todayLabel()}
        showSettings
      />

      <div className="px-5 space-y-6">
        {/* Streak card */}
        <div className="card-enter bg-gradient-to-br from-brand-600 to-brand-500 text-white rounded-3xl p-5 shadow-card relative overflow-hidden">
          <div className="absolute -right-6 -top-6 w-32 h-32 bg-white/10 rounded-full" />
          <div className="absolute -right-12 -bottom-12 w-40 h-40 bg-white/5 rounded-full" />
          <div className="relative flex items-center justify-between">
            <div>
              <p className="text-xs font-semibold uppercase tracking-widest text-white/70">Current streak</p>
              <p className="text-4xl font-extrabold mt-1">{streak} <span className="text-lg font-semibold text-white/80">{streak === 1 ? 'day' : 'days'}</span></p>
              <p className="text-sm text-white/80 mt-1">
                {todayEntries.length > 0
                  ? `${todayEntries.length} entr${todayEntries.length === 1 ? 'y' : 'ies'} today`
                  : 'Log something to keep it going'}
              </p>
            </div>
            <div className="w-14 h-14 rounded-2xl bg-white/20 flex items-center justify-center backdrop-blur-sm">
              <Flame className="w-7 h-7 text-white" strokeWidth={2.2} />
            </div>
          </div>
        </div>

        {/* Quick log by category */}
        <section>
          <div className="flex items-center justify-between mb-3">
            <h2 className="text-sm font-bold uppercase tracking-wider text-ink-500">Quick log</h2>
            <Link href="/categories" className="text-xs font-semibold text-brand-600">
              Manage
            </Link>
          </div>
          <div className="grid grid-cols-2 gap-3">
            {byCategory.map(({ category, total, count }) => (
              <button
                key={category.id}
                onClick={() => openAdd(category.id)}
                className="card-enter group bg-white rounded-2xl p-4 shadow-card border border-ink-100/60 text-left active:scale-[0.98] transition-transform"
              >
                <div
                  className="w-10 h-10 rounded-xl flex items-center justify-center mb-3"
                  style={{ backgroundColor: category.color + '1a', color: category.color }}
                >
                  <CategoryIcon name={category.icon} className="w-5 h-5" strokeWidth={2.2} />
                </div>
                <p className="font-bold text-ink-900 text-sm">{category.name}</p>
                <p className="text-xs text-ink-500 mt-0.5">
                  {count === 0
                    ? 'Tap to log'
                    : category.trackValue
                      ? `${total} ${category.unit || ''} today`
                      : `${count} today`}
                </p>
              </button>
            ))}
          </div>
        </section>

        {/* Active goals */}
        {activeGoals.length > 0 && (
          <section>
            <div className="flex items-center justify-between mb-3">
              <h2 className="text-sm font-bold uppercase tracking-wider text-ink-500">Active goals</h2>
              <Link href="/goals" className="text-xs font-semibold text-brand-600 flex items-center gap-0.5">
                All <ArrowRight className="w-3 h-3" />
              </Link>
            </div>
            <div className="space-y-2.5">
              {activeGoals.map((g) => {
                const cat = data.categories.find((c) => c.id === g.categoryId);
                const progress = progressForGoal(g, data.entries);
                const pct = Math.min(100, Math.round((progress / g.target) * 100));
                const color = cat?.color || '#4f46e5';
                return (
                  <Link
                    key={g.id}
                    href="/goals"
                    className="card-enter block bg-white rounded-2xl p-4 shadow-card border border-ink-100/60"
                  >
                    <div className="flex items-center justify-between gap-3">
                      <div className="min-w-0">
                        <p className="font-bold text-ink-900 text-sm truncate">{g.title}</p>
                        <p className="text-xs text-ink-500 mt-0.5">
                          {progress}/{g.target} {g.unit} · this {g.period}
                        </p>
                      </div>
                      <div className="text-sm font-bold" style={{ color }}>{pct}%</div>
                    </div>
                    <div className="mt-3 h-2 w-full rounded-full bg-ink-100 overflow-hidden">
                      <div
                        className="progress-bar h-full rounded-full"
                        style={{ width: `${pct}%`, backgroundColor: color }}
                      />
                    </div>
                  </Link>
                );
              })}
            </div>
          </section>
        )}

        {/* Today's entries */}
        <section>
          <div className="flex items-center justify-between mb-3">
            <h2 className="text-sm font-bold uppercase tracking-wider text-ink-500">Today</h2>
            <Link href="/log" className="text-xs font-semibold text-brand-600 flex items-center gap-0.5">
              History <ArrowRight className="w-3 h-3" />
            </Link>
          </div>
          {todayEntries.length === 0 ? (
            <div className="bg-white rounded-2xl p-6 text-center border border-dashed border-ink-200">
              <p className="text-ink-500 text-sm">Nothing logged yet today.</p>
              <button
                onClick={() => openAdd()}
                className="mt-3 inline-flex items-center gap-1 text-sm font-bold text-brand-600"
              >
                Add the first entry <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          ) : (
            <div className="space-y-2">
              {todayEntries.map((e) => {
                const cat = data.categories.find((c) => c.id === e.categoryId);
                if (!cat) return null;
                return (
                  <div
                    key={e.id}
                    className="card-enter bg-white rounded-2xl p-3.5 shadow-card border border-ink-100/60 flex items-center gap-3"
                  >
                    <div
                      className="w-10 h-10 rounded-xl flex items-center justify-center shrink-0"
                      style={{ backgroundColor: cat.color + '1a', color: cat.color }}
                    >
                      <CategoryIcon name={cat.icon} className="w-5 h-5" strokeWidth={2.2} />
                    </div>
                    <div className="min-w-0 flex-1">
                      <p className="font-semibold text-ink-900 text-sm">{cat.name}</p>
                      {e.note && <p className="text-xs text-ink-500 truncate">{e.note}</p>}
                    </div>
                    {cat.trackValue && e.value !== undefined && (
                      <div className="text-right">
                        <p className="font-bold text-ink-900 text-sm">{e.value}</p>
                        <p className="text-[10px] text-ink-400 uppercase tracking-wider">{cat.unit}</p>
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          )}
        </section>
      </div>

      <FAB onClick={() => openAdd()} />
      <QuickAddSheet
        open={adding}
        onClose={() => setAdding(false)}
        defaultCategoryId={presetCategory}
      />
    </>
  );
}
