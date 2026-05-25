'use client';

import { useMemo, useState } from 'react';
import { Trash2 } from 'lucide-react';
import { Header } from '@/components/Header';
import { CategoryIcon } from '@/components/CategoryIcon';
import { FAB } from '@/components/FAB';
import { QuickAddSheet } from '@/components/QuickAddSheet';
import { useStore } from '@/lib/store';

function formatDateHeader(iso: string): string {
  const d = new Date(iso + 'T00:00:00');
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const yesterday = new Date(today);
  yesterday.setDate(yesterday.getDate() - 1);
  const t = d.getTime();
  if (t === today.getTime()) return 'Today';
  if (t === yesterday.getTime()) return 'Yesterday';
  return d.toLocaleDateString(undefined, { weekday: 'short', month: 'long', day: 'numeric' });
}

export default function LogPage() {
  const { data, update, hydrated } = useStore();
  const [filter, setFilter] = useState<string | null>(null);
  const [adding, setAdding] = useState(false);

  const filtered = useMemo(() => {
    return filter ? data.entries.filter((e) => e.categoryId === filter) : data.entries;
  }, [data.entries, filter]);

  const grouped = useMemo(() => {
    const map = new Map<string, typeof filtered>();
    for (const e of filtered) {
      if (!map.has(e.date)) map.set(e.date, []);
      map.get(e.date)!.push(e);
    }
    return Array.from(map.entries()).sort(([a], [b]) => (a < b ? 1 : -1));
  }, [filtered]);

  function remove(id: string) {
    update((d) => ({ ...d, entries: d.entries.filter((e) => e.id !== id) }));
  }

  if (!hydrated) return null;

  return (
    <>
      <Header title="Log" subtitle="Everything you've tracked" showSettings />

      <div className="px-5">
        {/* Category filters */}
        <div className="flex gap-2 overflow-x-auto pb-3 hide-scrollbar -mx-1 px-1">
          <FilterChip
            label="All"
            active={filter === null}
            onClick={() => setFilter(null)}
          />
          {data.categories.map((c) => (
            <FilterChip
              key={c.id}
              label={c.name}
              color={c.color}
              icon={c.icon}
              active={filter === c.id}
              onClick={() => setFilter(c.id)}
            />
          ))}
        </div>

        {grouped.length === 0 ? (
          <div className="bg-white rounded-2xl p-10 text-center border border-dashed border-ink-200 mt-4">
            <p className="text-ink-500 text-sm">No entries yet.</p>
            <button
              onClick={() => setAdding(true)}
              className="mt-3 inline-flex text-sm font-bold text-brand-600"
            >
              Add your first entry
            </button>
          </div>
        ) : (
          <div className="space-y-6 mt-2">
            {grouped.map(([date, entries]) => (
              <div key={date}>
                <h3 className="text-xs font-bold uppercase tracking-wider text-ink-500 mb-2 px-1">
                  {formatDateHeader(date)}
                </h3>
                <div className="space-y-2">
                  {entries.map((e) => {
                    const cat = data.categories.find((c) => c.id === e.categoryId);
                    if (!cat) return null;
                    return (
                      <div
                        key={e.id}
                        className="card-enter group bg-white rounded-2xl p-3.5 shadow-card border border-ink-100/60 flex items-start gap-3"
                      >
                        <div
                          className="w-10 h-10 rounded-xl flex items-center justify-center shrink-0"
                          style={{ backgroundColor: cat.color + '1a', color: cat.color }}
                        >
                          <CategoryIcon name={cat.icon} className="w-5 h-5" strokeWidth={2.2} />
                        </div>
                        <div className="min-w-0 flex-1">
                          <div className="flex items-baseline gap-2">
                            <p className="font-semibold text-ink-900 text-sm">{cat.name}</p>
                            {cat.trackValue && e.value !== undefined && (
                              <p className="text-xs font-bold text-ink-700">
                                {e.value} <span className="text-ink-400 font-normal">{cat.unit}</span>
                              </p>
                            )}
                          </div>
                          {e.note && (
                            <p className="text-sm text-ink-600 mt-0.5 whitespace-pre-wrap">{e.note}</p>
                          )}
                        </div>
                        <button
                          onClick={() => remove(e.id)}
                          aria-label="Delete entry"
                          className="opacity-0 group-hover:opacity-100 transition-opacity w-8 h-8 rounded-lg hover:bg-red-50 text-ink-400 hover:text-red-600 flex items-center justify-center"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    );
                  })}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      <FAB onClick={() => setAdding(true)} />
      <QuickAddSheet
        open={adding}
        onClose={() => setAdding(false)}
        defaultCategoryId={filter || undefined}
      />
    </>
  );
}

function FilterChip({
  label,
  color,
  icon,
  active,
  onClick,
}: {
  label: string;
  color?: string;
  icon?: string;
  active: boolean;
  onClick: () => void;
}) {
  return (
    <button
      onClick={onClick}
      className={`shrink-0 flex items-center gap-1.5 px-3.5 py-2 rounded-full border text-sm font-semibold transition-all ${
        active
          ? 'border-transparent text-white shadow-card'
          : 'border-ink-200 text-ink-700 bg-white'
      }`}
      style={active && color ? { backgroundColor: color } : active ? { backgroundColor: '#4f46e5' } : undefined}
    >
      {icon && <CategoryIcon name={icon} className="w-4 h-4" strokeWidth={2.2} />}
      {label}
    </button>
  );
}
