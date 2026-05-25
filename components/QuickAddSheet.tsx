'use client';

import { useEffect, useState } from 'react';
import { Modal } from './Modal';
import { CategoryIcon } from './CategoryIcon';
import { Category } from '@/lib/types';
import { newId, todayISO, useStore } from '@/lib/store';

type Props = {
  open: boolean;
  onClose: () => void;
  defaultCategoryId?: string;
};

export function QuickAddSheet({ open, onClose, defaultCategoryId }: Props) {
  const { data, update } = useStore();
  const [categoryId, setCategoryId] = useState<string>('');
  const [value, setValue] = useState<string>('');
  const [note, setNote]   = useState<string>('');
  const [date, setDate]   = useState<string>(todayISO());

  useEffect(() => {
    if (open) {
      setCategoryId(defaultCategoryId || data.categories[0]?.id || '');
      setValue('');
      setNote('');
      setDate(todayISO());
    }
  }, [open, defaultCategoryId, data.categories]);

  const category: Category | undefined = data.categories.find((c) => c.id === categoryId);

  function save() {
    if (!category) return;
    const trimmedNote = note.trim();
    const numericValue = value === '' ? undefined : Number(value);
    if (category.trackValue && (numericValue === undefined || Number.isNaN(numericValue)) && !trimmedNote) {
      return; // nothing to save
    }
    update((d) => ({
      ...d,
      entries: [
        {
          id: newId(),
          categoryId: category.id,
          date,
          value: numericValue,
          note: trimmedNote || undefined,
          createdAt: new Date().toISOString(),
        },
        ...d.entries,
      ],
    }));
    onClose();
  }

  return (
    <Modal open={open} onClose={onClose} title="New entry">
      <div className="space-y-5">
        <div>
          <label className="text-xs font-semibold text-ink-500 uppercase tracking-wider">Category</label>
          <div className="mt-2 flex gap-2 flex-wrap">
            {data.categories.map((c) => {
              const active = c.id === categoryId;
              return (
                <button
                  key={c.id}
                  onClick={() => setCategoryId(c.id)}
                  className={`flex items-center gap-2 px-3.5 py-2 rounded-full border transition-all ${
                    active
                      ? 'border-transparent text-white shadow-card'
                      : 'border-ink-200 text-ink-700 bg-white'
                  }`}
                  style={active ? { backgroundColor: c.color } : undefined}
                >
                  <CategoryIcon name={c.icon} className="w-4 h-4" strokeWidth={2.2} />
                  <span className="text-sm font-semibold">{c.name}</span>
                </button>
              );
            })}
          </div>
        </div>

        {category?.trackValue && (
          <div>
            <label className="text-xs font-semibold text-ink-500 uppercase tracking-wider">
              {category.unit ? `How many ${category.unit}?` : 'Value'}
            </label>
            <input
              type="number"
              inputMode="decimal"
              value={value}
              onChange={(e) => setValue(e.target.value)}
              placeholder="0"
              className="mt-2 w-full text-2xl font-bold text-ink-900 bg-ink-50 rounded-2xl px-4 py-3 border border-transparent focus:border-brand-400 focus:bg-white outline-none"
            />
          </div>
        )}

        <div>
          <label className="text-xs font-semibold text-ink-500 uppercase tracking-wider">Notes <span className="text-ink-300 font-normal normal-case tracking-normal">(optional)</span></label>
          <textarea
            value={note}
            onChange={(e) => setNote(e.target.value)}
            placeholder="How did it go?"
            rows={3}
            className="mt-2 w-full text-base text-ink-900 bg-ink-50 rounded-2xl px-4 py-3 border border-transparent focus:border-brand-400 focus:bg-white outline-none resize-none"
          />
        </div>

        <div>
          <label className="text-xs font-semibold text-ink-500 uppercase tracking-wider">Date</label>
          <input
            type="date"
            value={date}
            onChange={(e) => setDate(e.target.value)}
            className="mt-2 w-full text-base text-ink-900 bg-ink-50 rounded-2xl px-4 py-3 border border-transparent focus:border-brand-400 focus:bg-white outline-none"
          />
        </div>

        <button
          onClick={save}
          className="w-full bg-brand-600 hover:bg-brand-700 text-white font-bold py-3.5 rounded-2xl shadow-card active:scale-[0.98] transition-transform"
        >
          Save entry
        </button>
      </div>
    </Modal>
  );
}
