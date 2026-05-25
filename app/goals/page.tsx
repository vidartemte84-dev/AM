'use client';

import { useMemo, useState } from 'react';
import { Plus, Trash2, Target } from 'lucide-react';
import { Header } from '@/components/Header';
import { CategoryIcon } from '@/components/CategoryIcon';
import { Modal } from '@/components/Modal';
import { Goal, LogEntry } from '@/lib/types';
import { newId, startOfPeriod, useStore } from '@/lib/store';

function progressForGoal(goal: Goal, entries: LogEntry[]): number {
  const since = startOfPeriod(goal.period).getTime();
  return entries
    .filter((e) => {
      if (goal.categoryId && e.categoryId !== goal.categoryId) return false;
      return new Date(e.date).getTime() >= since;
    })
    .reduce((sum, e) => sum + (e.value || 0), 0);
}

export default function GoalsPage() {
  const { data, update, hydrated } = useStore();
  const [creating, setCreating] = useState(false);

  // form state
  const [title, setTitle]     = useState('');
  const [target, setTarget]   = useState('');
  const [unit, setUnit]       = useState('');
  const [period, setPeriod]   = useState<'day' | 'week' | 'month'>('week');
  const [catId, setCatId]     = useState<string>('');

  const active   = useMemo(() => data.goals.filter((g) => !g.archived), [data.goals]);
  const archived = useMemo(() => data.goals.filter((g) =>  g.archived), [data.goals]);

  function openCreate(prefill?: string) {
    setTitle('');
    setTarget('');
    setUnit('');
    setPeriod('week');
    setCatId(prefill || '');
    setCreating(true);
  }

  function saveGoal() {
    const t = Number(target);
    if (!title.trim() || !t || Number.isNaN(t)) return;
    const cat = data.categories.find((c) => c.id === catId);
    update((d) => ({
      ...d,
      goals: [
        {
          id: newId(),
          title: title.trim(),
          categoryId: catId || undefined,
          target: t,
          unit: unit.trim() || cat?.unit || 'entries',
          period,
          createdAt: new Date().toISOString(),
        },
        ...d.goals,
      ],
    }));
    setCreating(false);
  }

  function remove(id: string) {
    update((d) => ({ ...d, goals: d.goals.filter((g) => g.id !== id) }));
  }

  function toggleArchive(id: string) {
    update((d) => ({
      ...d,
      goals: d.goals.map((g) => (g.id === id ? { ...g, archived: !g.archived } : g)),
    }));
  }

  if (!hydrated) return null;

  const selectedCat = data.categories.find((c) => c.id === catId);

  return (
    <>
      <Header
        title="Goals"
        subtitle="What you're working toward"
        right={
          <button
            onClick={() => openCreate()}
            className="w-10 h-10 rounded-full bg-brand-600 text-white shadow-card flex items-center justify-center active:scale-95 transition-transform"
            aria-label="New goal"
          >
            <Plus className="w-5 h-5" strokeWidth={2.6} />
          </button>
        }
      />

      <div className="px-5 space-y-6">
        {active.length === 0 && archived.length === 0 ? (
          <div className="bg-white rounded-3xl p-8 text-center border border-dashed border-ink-200">
            <div className="w-14 h-14 rounded-2xl bg-brand-50 text-brand-600 mx-auto flex items-center justify-center mb-3">
              <Target className="w-7 h-7" />
            </div>
            <h3 className="text-base font-bold text-ink-900">Set your first goal</h3>
            <p className="text-sm text-ink-500 mt-1">Track progress toward something you care about.</p>
            <button
              onClick={() => openCreate()}
              className="mt-4 inline-flex items-center gap-1.5 bg-brand-600 text-white font-bold text-sm px-4 py-2.5 rounded-2xl active:scale-95 transition-transform"
            >
              <Plus className="w-4 h-4" /> New goal
            </button>
          </div>
        ) : (
          <>
            {active.length > 0 && (
              <section className="space-y-3">
                {active.map((g) => (
                  <GoalCard
                    key={g.id}
                    goal={g}
                    category={data.categories.find((c) => c.id === g.categoryId)}
                    progress={progressForGoal(g, data.entries)}
                    onDelete={() => remove(g.id)}
                    onArchive={() => toggleArchive(g.id)}
                  />
                ))}
              </section>
            )}

            {archived.length > 0 && (
              <section>
                <h2 className="text-xs font-bold uppercase tracking-wider text-ink-500 mb-2 px-1">Archived</h2>
                <div className="space-y-3 opacity-60">
                  {archived.map((g) => (
                    <GoalCard
                      key={g.id}
                      goal={g}
                      category={data.categories.find((c) => c.id === g.categoryId)}
                      progress={progressForGoal(g, data.entries)}
                      onDelete={() => remove(g.id)}
                      onArchive={() => toggleArchive(g.id)}
                      archived
                    />
                  ))}
                </div>
              </section>
            )}
          </>
        )}
      </div>

      <Modal open={creating} onClose={() => setCreating(false)} title="New goal">
        <div className="space-y-5">
          <div>
            <label className="text-xs font-semibold text-ink-500 uppercase tracking-wider">Title</label>
            <input
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="e.g., Run 30km this week"
              className="mt-2 w-full text-base text-ink-900 bg-ink-50 rounded-2xl px-4 py-3 border border-transparent focus:border-brand-400 focus:bg-white outline-none"
            />
          </div>

          <div>
            <label className="text-xs font-semibold text-ink-500 uppercase tracking-wider">
              Linked category <span className="text-ink-300 font-normal normal-case tracking-normal">(optional)</span>
            </label>
            <div className="mt-2 flex gap-2 flex-wrap">
              <button
                onClick={() => setCatId('')}
                className={`px-3.5 py-2 rounded-full border text-sm font-semibold transition-all ${
                  catId === '' ? 'bg-ink-900 text-white border-transparent' : 'border-ink-200 text-ink-700 bg-white'
                }`}
              >
                None
              </button>
              {data.categories.map((c) => {
                const sel = catId === c.id;
                return (
                  <button
                    key={c.id}
                    onClick={() => {
                      setCatId(c.id);
                      if (!unit) setUnit(c.unit || '');
                    }}
                    className={`flex items-center gap-1.5 px-3.5 py-2 rounded-full border text-sm font-semibold transition-all ${
                      sel ? 'border-transparent text-white shadow-card' : 'border-ink-200 text-ink-700 bg-white'
                    }`}
                    style={sel ? { backgroundColor: c.color } : undefined}
                  >
                    <CategoryIcon name={c.icon} className="w-4 h-4" strokeWidth={2.2} />
                    {c.name}
                  </button>
                );
              })}
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="text-xs font-semibold text-ink-500 uppercase tracking-wider">Target</label>
              <input
                type="number"
                inputMode="decimal"
                value={target}
                onChange={(e) => setTarget(e.target.value)}
                placeholder="0"
                className="mt-2 w-full text-xl font-bold text-ink-900 bg-ink-50 rounded-2xl px-4 py-3 border border-transparent focus:border-brand-400 focus:bg-white outline-none"
              />
            </div>
            <div>
              <label className="text-xs font-semibold text-ink-500 uppercase tracking-wider">Unit</label>
              <input
                value={unit}
                onChange={(e) => setUnit(e.target.value)}
                placeholder={selectedCat?.unit || 'words'}
                className="mt-2 w-full text-base text-ink-900 bg-ink-50 rounded-2xl px-4 py-3 border border-transparent focus:border-brand-400 focus:bg-white outline-none"
              />
            </div>
          </div>

          <div>
            <label className="text-xs font-semibold text-ink-500 uppercase tracking-wider">Per</label>
            <div className="mt-2 grid grid-cols-3 gap-2">
              {(['day', 'week', 'month'] as const).map((p) => (
                <button
                  key={p}
                  onClick={() => setPeriod(p)}
                  className={`py-2.5 rounded-2xl text-sm font-semibold capitalize transition-all ${
                    period === p
                      ? 'bg-brand-600 text-white shadow-card'
                      : 'bg-ink-50 text-ink-700'
                  }`}
                >
                  {p}
                </button>
              ))}
            </div>
          </div>

          <button
            onClick={saveGoal}
            className="w-full bg-brand-600 hover:bg-brand-700 text-white font-bold py-3.5 rounded-2xl shadow-card active:scale-[0.98] transition-transform"
          >
            Save goal
          </button>
        </div>
      </Modal>
    </>
  );
}

function GoalCard({
  goal,
  category,
  progress,
  onDelete,
  onArchive,
  archived,
}: {
  goal: Goal;
  category?: { color: string; icon: string; name: string };
  progress: number;
  onDelete: () => void;
  onArchive: () => void;
  archived?: boolean;
}) {
  const color = category?.color || '#4f46e5';
  const pct = Math.min(100, Math.round((progress / goal.target) * 100));
  const complete = progress >= goal.target;
  return (
    <div className="card-enter group bg-white rounded-2xl p-4 shadow-card border border-ink-100/60">
      <div className="flex items-start gap-3">
        <div
          className="w-10 h-10 rounded-xl flex items-center justify-center shrink-0"
          style={{ backgroundColor: color + '1a', color }}
        >
          <CategoryIcon name={category?.icon || 'Target'} className="w-5 h-5" strokeWidth={2.2} />
        </div>
        <div className="flex-1 min-w-0">
          <div className="flex items-start justify-between gap-2">
            <div className="min-w-0">
              <p className="font-bold text-ink-900 text-sm truncate">{goal.title}</p>
              <p className="text-xs text-ink-500 mt-0.5">
                {progress}/{goal.target} {goal.unit} · this {goal.period}
                {category && <> · {category.name}</>}
              </p>
            </div>
            <div className="text-sm font-bold shrink-0" style={{ color }}>
              {complete ? 'Done' : `${pct}%`}
            </div>
          </div>
          <div className="mt-3 h-2 w-full rounded-full bg-ink-100 overflow-hidden">
            <div
              className="progress-bar h-full rounded-full"
              style={{ width: `${pct}%`, backgroundColor: color }}
            />
          </div>
          <div className="mt-3 flex items-center gap-3 text-xs">
            <button
              onClick={onArchive}
              className="font-semibold text-ink-500 hover:text-ink-900"
            >
              {archived ? 'Reactivate' : 'Archive'}
            </button>
            <button
              onClick={onDelete}
              className="font-semibold text-red-500 hover:text-red-600 inline-flex items-center gap-1"
            >
              <Trash2 className="w-3.5 h-3.5" /> Delete
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
