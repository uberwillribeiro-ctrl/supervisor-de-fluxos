import { cn } from '@/utils/cn';

interface LogoMarkProps {
  className?: string;
  size?: 'sm' | 'md' | 'lg';
}

const sizeMap = {
  sm: 'size-8',
  md: 'size-11',
  lg: 'size-14',
};

const iconSizeMap = {
  sm: 14,
  md: 20,
  lg: 26,
};

export function LogoMark({ className, size = 'md' }: LogoMarkProps) {
  const iconSize = iconSizeMap[size];

  return (
    <div
      className={cn(
        'inline-flex items-center justify-center rounded-2xl',
        'bg-indigo-600 shadow-lg shadow-indigo-600/30',
        sizeMap[size],
        className,
      )}
    >
      {/* Ícone de fluxo customizado — dois nós conectados por uma linha */}
      <svg width={iconSize} height={iconSize} viewBox="0 0 20 20" fill="none" aria-hidden="true">
        <circle cx="4" cy="10" r="3" fill="white" fillOpacity="0.9" />
        <circle cx="16" cy="4" r="2.5" fill="white" fillOpacity="0.7" />
        <circle cx="16" cy="16" r="2.5" fill="white" fillOpacity="0.7" />
        <line
          x1="7"
          y1="10"
          x2="13.5"
          y2="5"
          stroke="white"
          strokeOpacity="0.6"
          strokeWidth="1.5"
          strokeLinecap="round"
        />
        <line
          x1="7"
          y1="10"
          x2="13.5"
          y2="15"
          stroke="white"
          strokeOpacity="0.6"
          strokeWidth="1.5"
          strokeLinecap="round"
        />
      </svg>
    </div>
  );
}
