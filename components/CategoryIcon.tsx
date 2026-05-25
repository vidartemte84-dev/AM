'use client';

import * as Lucide from 'lucide-react';
import type { LucideIcon } from 'lucide-react';

type Props = {
  name: string;
  className?: string;
  strokeWidth?: number;
};

export function CategoryIcon({ name, className, strokeWidth = 2 }: Props) {
  const Icon =
    ((Lucide as unknown as Record<string, LucideIcon>)[name] as LucideIcon | undefined) ||
    Lucide.Circle;
  return <Icon className={className} strokeWidth={strokeWidth} />;
}
