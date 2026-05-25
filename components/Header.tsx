'use client';

import Link from 'next/link';
import { ChevronLeft, Settings } from 'lucide-react';

type Props = {
  title: string;
  subtitle?: string;
  back?: string;
  right?: React.ReactNode;
  showSettings?: boolean;
};

export function Header({ title, subtitle, back, right, showSettings }: Props) {
  return (
    <header className="px-5 pt-8 pb-4 flex items-start justify-between gap-3">
      <div className="min-w-0 flex items-center gap-2">
        {back && (
          <Link
            href={back}
            className="-ml-2 mr-1 w-9 h-9 rounded-full hover:bg-ink-100 flex items-center justify-center text-ink-700"
            aria-label="Back"
          >
            <ChevronLeft className="w-5 h-5" />
          </Link>
        )}
        <div className="min-w-0">
          <h1 className="text-2xl font-bold tracking-tight text-ink-900 truncate">{title}</h1>
          {subtitle && <p className="text-sm text-ink-500 mt-0.5">{subtitle}</p>}
        </div>
      </div>
      <div className="flex items-center gap-2 shrink-0">
        {right}
        {showSettings && (
          <Link
            href="/categories"
            className="w-10 h-10 rounded-full bg-white border border-ink-100 shadow-card flex items-center justify-center text-ink-600 active:scale-95 transition-transform"
            aria-label="Categories"
          >
            <Settings className="w-5 h-5" />
          </Link>
        )}
      </div>
    </header>
  );
}
