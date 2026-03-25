import { getCompatibilityLabel } from '@/lib/attachmentStyles';

interface Props {
  score: number;
  size?: number;
}

export function CompatibilityRing({ score, size = 56 }: Props) {
  const { label, color } = getCompatibilityLabel(score);
  const radius      = (size - 8) / 2;
  const circumference = 2 * Math.PI * radius;
  const strokeDash  = (score / 100) * circumference;

  return (
    <div className="flex flex-col items-center gap-1">
      <div className="relative" style={{ width: size, height: size }}>
        <svg width={size} height={size} className="-rotate-90">
          <circle
            cx={size / 2}
            cy={size / 2}
            r={radius}
            fill="none"
            stroke="#f1f5f9"
            strokeWidth={6}
          />
          <circle
            cx={size / 2}
            cy={size / 2}
            r={radius}
            fill="none"
            stroke={color}
            strokeWidth={6}
            strokeLinecap="round"
            strokeDasharray={`${strokeDash} ${circumference}`}
            style={{ transition: 'stroke-dasharray 1s ease' }}
          />
        </svg>
        <div className="absolute inset-0 flex items-center justify-center">
          <span className="text-xs font-extrabold" style={{ color }}>
            {score}%
          </span>
        </div>
      </div>
      <span className="text-[9px] font-semibold text-center leading-tight" style={{ color }}>
        {label}
      </span>
    </div>
  );
}
