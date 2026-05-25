'use client';

import { Plus } from 'lucide-react';

type Props = {
  onClick: () => void;
  label?: string;
};

export function FAB({ onClick, label = 'Add' }: Props) {
  return (
    <button
      onClick={onClick}
      aria-label={label}
      className="fab-in fixed bottom-24 right-4 sm:right-[calc(50%-216px)] z-30 w-14 h-14 rounded-full bg-brand-600 text-white shadow-fab flex items-center justify-center active:scale-95 transition-transform"
    >
      <Plus className="w-7 h-7" strokeWidth={2.6} />
    </button>
  );
}
