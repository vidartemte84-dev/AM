'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Home, ListChecks, Target, NotebookPen } from 'lucide-react';

const NAV_ITEMS = [
  { href: '/',       icon: Home,        label: 'Home'  },
  { href: '/log',    icon: ListChecks,  label: 'Log'   },
  { href: '/goals',  icon: Target,      label: 'Goals' },
  { href: '/notes',  icon: NotebookPen, label: 'Notes' },
];

export function Navigation() {
  const pathname = usePathname() || '/';

  return (
    <nav className="bottom-nav fixed bottom-0 left-1/2 -translate-x-1/2 w-full max-w-[480px] bg-white/85 backdrop-blur-lg border-t border-ink-100 z-40">
      <div className="flex items-center justify-around px-2 py-2">
        {NAV_ITEMS.map(({ href, icon: Icon, label }) => {
          const active =
            href === '/'
              ? pathname === '/' || pathname === ''
              : pathname === href || pathname.startsWith(href + '/');
          return (
            <Link
              key={href}
              href={href}
              className="flex flex-col items-center gap-1 px-4 py-1.5 rounded-2xl transition-colors"
            >
              <div className="relative">
                <Icon
                  className={`w-6 h-6 transition-all ${
                    active ? 'text-brand-600' : 'text-ink-400'
                  }`}
                  strokeWidth={active ? 2.2 : 1.8}
                />
                {active && (
                  <span className="absolute -bottom-1.5 left-1/2 -translate-x-1/2 w-1 h-1 bg-brand-600 rounded-full" />
                )}
              </div>
              <span
                className={`text-[10px] font-semibold tracking-wide ${
                  active ? 'text-brand-600' : 'text-ink-400'
                }`}
              >
                {label}
              </span>
            </Link>
          );
        })}
      </div>
    </nav>
  );
}
