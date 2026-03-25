import { ATTACHMENT_INFO } from '@/lib/attachmentStyles';
import type { AttachmentStyle } from '@/lib/types';

interface Props {
  style: AttachmentStyle;
  size?: 'sm' | 'md' | 'lg';
  showEmoji?: boolean;
}

export function AttachmentBadge({ style, size = 'md', showEmoji = true }: Props) {
  const info = ATTACHMENT_INFO[style];

  const sizeClasses = {
    sm: 'text-[10px] px-2 py-1 gap-1',
    md: 'text-xs px-3 py-1.5 gap-1.5',
    lg: 'text-sm px-4 py-2 gap-2',
  };

  return (
    <span
      className={`inline-flex items-center rounded-full font-semibold ${sizeClasses[size]}`}
      style={{ backgroundColor: info.bgColor, color: info.textColor }}
    >
      {showEmoji && <span>{info.emoji}</span>}
      {info.label}
    </span>
  );
}
