'use client';

import { useMemo, useState } from 'react';
import { Plus, Trash2, Pencil, Check } from 'lucide-react';
import { Header } from '@/components/Header';
import { CategoryIcon } from '@/components/CategoryIcon';
import { Modal } from '@/components/Modal';
import { Category } from '@/lib/types';
import { CATEGORY_COLORS, CATEGORY_ICONS } from '@/lib/defaults';
import { newId, useStore } from '@/lib/store';

export default function CategoriesPage() {
  const { data, update, hydrated } = useStore();
  const [editing, setEditing] = useState<Category | null>(null);

  // form state
  const [name, setName]               = useState('');
  const [icon, setIcon]               = useState(CATEGORY_ICONS[0]);
  const [color, setColor]             = useState(CATEGORY_COLORS[0]);
  const [unit, setUnit]               = useState('');
  const [trackValue, setTrackValue]   = useState(true);

  const isNew = editing && !data.categories.some((c) => c.id === editing.id);

  function openNew() {
    setName('');
    setIcon(CATEGORY_ICONS[0]);
    setColor(CATEGORY_COLORS[Math.floor(Math.random() * CATEGORY_COLORS.length)]);
    setUnit('');
    setTrackValue(true);
    setEditing({
      id: newId(),
      name: '',
      icon: CATEGORY_ICONS[0],
      color: CATEGORY_COLORS[0],
      trackValue: true,
    });
  }

  function openEdit(c: Category) {
    setName(c.name);
    setIcon(c.icon);
    setColor(c.color);
    setUnit(c.unit || '');
    setTrackValue(c.trackValue);
    setEditing(c);
  }

  function save() {
    if (!editing) return;
    const trimmed = name.trim();
    if (!trimmed) return;
    const next: Category = {
      ...editing,
      name: trimmed,
      icon,
      color,
      unit: trackValue ? (unit.trim() || undefined) : undefined,
      trackValue,
    };
    update((d) => ({
      ...d,
      categories: isNew
        ? [...d.categories, next]
        : d.categories.map((c) => (c.id === next.id ? next : c)),
    }));
    setEditing(null);
  }

  function remove(id: string) {
    update((d) => ({
      ...d,
      categories: d.categories.filter((c) => c.id !== id),
      // keep entries — they'll still reference the deleted categoryId but won't render
    }));
    setEditing(null);
  }

  const entriesByCategory = useMemo(() => {
    const map = new Map<string, number>();
    for (const e of data.entries) {
      map.set(e.categoryId, (map.get(e.categoryId) || 0) + 1);
    }
    return map;
  }, [data.entries]);

  if (!hydrated) return null;

  return (
    <>
      <Header
        title="Categories"
        subtitle="What you want to track"
        back="/"
        right={
          <button
            onClick={openNew}
            className="w-10 h-10 rounded-full bg-brand-600 text-white shadow-card flex items-center justify-center active:scale-95 transition-transform"
            aria-label="New category"
          >
            <Plus className="w-5 h-5" strokeWidth={2.6} />
          </button>
        }
      />

      <div className="px-5">
        <div className="space-y-2.5">
          {data.categories.map((c) => {
            const count = entriesByCategory.get(c.id) || 0;
            return (
              <div
                key={c.id}
                onClick={() => openEdit(c)}
                className="card-enter group bg-white rounded-2xl p-4 shadow-card border border-ink-100/60 flex items-center gap-3 cursor-pointer active:scale-[0.99] transition-transform"
              >
                <div
                  className="w-11 h-11 rounded-xl flex items-center justify-center shrink-0"
                  style={{ backgroundColor: c.color + '1a', color: c.color }}
                >
                  <CategoryIcon name={c.icon} className="w-5 h-5" strokeWidth={2.2} />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="font-bold text-ink-900 text-sm">{c.name}</p>
                  <p className="text-xs text-ink-500 mt-0.5">
                    {c.trackValue
                      ? `Tracks ${c.unit || 'value'}`
                      : 'Simple check-in'}
                    {count > 0 && ` · ${count} ${count === 1 ? 'entry' : 'entries'}`}
                  </p>
                </div>
                <Pencil className="w-4 h-4 text-ink-300 group-hover:text-ink-500" />
              </div>
            );
          })}
        </div>

        <button
          onClick={openNew}
          className="mt-4 w-full py-3 rounded-2xl border-2 border-dashed border-ink-200 text-ink-500 font-semibold text-sm flex items-center justify-center gap-2 hover:border-brand-400 hover:text-brand-600 transition-colors"
        >
          <Plus className="w-4 h-4" /> Add category
        </button>
      </div>

      <Modal open={!!editing} onClose={() => setEditing(null)} title={isNew ? 'New category' : 'Edit category'}>
        <div className="space-y-5">
          {/* Preview */}
          <div className="flex items-center gap-3 bg-ink-50 rounded-2xl p-4">
            <div
              className="w-12 h-12 rounded-2xl flex items-center justify-center shrink-0"
              style={{ backgroundColor: color + '22', color }}
            >
              <CategoryIcon name={icon} className="w-6 h-6" strokeWidth={2.2} />
            </div>
            <div>
              <p className="font-bold text-ink-900">{name || 'Untitled'}</p>
              <p className="text-xs text-ink-500">
                {trackValue ? `Tracks ${unit || 'value'}` : 'Simple check-in'}
              </p>
            </div>
          </div>

          <div>
            <label className="text-xs font-semibold text-ink-500 uppercase tracking-wider">Name</label>
            <input
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="e.g., Meditation"
              className="mt-2 w-full text-base text-ink-900 bg-ink-50 rounded-2xl px-4 py-3 border border-transparent focus:border-brand-400 focus:bg-white outline-none"
            />
          </div>

          <div>
            <label className="text-xs font-semibold text-ink-500 uppercase tracking-wider">Color</label>
            <div className="mt-2 flex gap-2 flex-wrap">
              {CATEGORY_COLORS.map((col) => (
                <button
                  key={col}
                  onClick={() => setColor(col)}
                  className="w-9 h-9 rounded-full flex items-center justify-center transition-transform active:scale-90"
                  style={{ backgroundColor: col, outline: color === col ? `2px solid ${col}` : 'none', outlineOffset: 2 }}
                  aria-label={`Color ${col}`}
                >
                  {color === col && <Check className="w-4 h-4 text-white" strokeWidth={3} />}
                </button>
              ))}
            </div>
          </div>

          <div>
            <label className="text-xs font-semibold text-ink-500 uppercase tracking-wider">Icon</label>
            <div className="mt-2 grid grid-cols-8 gap-2">
              {CATEGORY_ICONS.map((ic) => {
                const sel = icon === ic;
                return (
                  <button
                    key={ic}
                    onClick={() => setIcon(ic)}
                    className={`aspect-square rounded-xl flex items-center justify-center transition-all ${
                      sel ? 'text-white shadow-card' : 'bg-ink-50 text-ink-600'
                    }`}
                    style={sel ? { backgroundColor: color } : undefined}
                    aria-label={ic}
                  >
                    <CategoryIcon name={ic} className="w-5 h-5" strokeWidth={2.2} />
                  </button>
                );
              })}
            </div>
          </div>

          <div>
            <label className="text-xs font-semibold text-ink-500 uppercase tracking-wider">Type</label>
            <div className="mt-2 grid grid-cols-2 gap-2">
              <button
                onClick={() => setTrackValue(true)}
                className={`py-3 rounded-2xl text-sm font-semibold transition-all ${
                  trackValue ? 'bg-brand-600 text-white shadow-card' : 'bg-ink-50 text-ink-700'
                }`}
              >
                Track a number
              </button>
              <button
                onClick={() => setTrackValue(false)}
                className={`py-3 rounded-2xl text-sm font-semibold transition-all ${
                  !trackValue ? 'bg-brand-600 text-white shadow-card' : 'bg-ink-50 text-ink-700'
                }`}
              >
                Just check in
              </button>
            </div>
          </div>

          {trackValue && (
            <div>
              <label className="text-xs font-semibold text-ink-500 uppercase tracking-wider">
                Unit <span className="text-ink-300 font-normal normal-case tracking-normal">(words, minutes, pages…)</span>
              </label>
              <input
                value={unit}
                onChange={(e) => setUnit(e.target.value)}
                placeholder="minutes"
                className="mt-2 w-full text-base text-ink-900 bg-ink-50 rounded-2xl px-4 py-3 border border-transparent focus:border-brand-400 focus:bg-white outline-none"
              />
            </div>
          )}

          <div className="flex items-center justify-between pt-2 gap-3">
            {!isNew && editing ? (
              <button
                onClick={() => remove(editing.id)}
                className="text-sm font-semibold text-red-500 inline-flex items-center gap-1.5"
              >
                <Trash2 className="w-4 h-4" /> Delete
              </button>
            ) : <span />}
            <button
              onClick={save}
              className="bg-brand-600 text-white font-bold px-5 py-3 rounded-2xl text-sm active:scale-95 transition-transform"
            >
              {isNew ? 'Create category' : 'Save changes'}
            </button>
          </div>
        </div>
      </Modal>
    </>
  );
}
