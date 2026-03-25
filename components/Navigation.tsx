'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Heart, Search, MessageCircle, User } from 'lucide-react';

const NAV_ITEMS = [
  { href: '/discover', icon: Search,         label: 'Discover'  },
  { href: '/matches',  icon: Heart,           label: 'Matches'   },
  { href: '/messages', icon: MessageCircle,   label: 'Messages'  },
  { href: '/profile',  icon: User,            label: 'Profile'   },
];

export function Navigation() {
  const pathname = usePathname();

  return (
    <nav className="bottom-nav fixed bottom-0 left-1/2 -translate-x-1/2 w-full max-w-[430px] bg-white border-t border-gray-100 z-50">
      <div className="flex items-center justify-around px-2 py-2">
        {NAV_ITEMS.map(({ href, icon: Icon, label }) => {
          const active = pathname === href || pathname.startsWith(href + '/');
          return (
            <Link
              key={href}
              href={href}
              className={`flex flex-col items-center gap-1 px-4 py-2 rounded-2xl transition-all ${
                active
                  ? 'text-brand-600'
                  : 'text-gray-400 hover:text-gray-600'
              }`}
            >
              <div className="relative">
                <Icon
                  className={`w-6 h-6 transition-all ${active ? 'stroke-brand-600' : ''}`}
                  fill={active && label === 'Matches' ? 'currentColor' : 'none'}
                />
                {active && (
                  <span className="absolute -bottom-0.5 left-1/2 -translate-x-1/2 w-1 h-1 bg-brand-500 rounded-full" />
                )}
              </div>
              <span className={`text-[10px] font-semibold ${active ? 'text-brand-600' : 'text-gray-400'}`}>
                {label}
              </span>
            </Link>
          );
        })}
      </div>
    </nav>
  );
}
