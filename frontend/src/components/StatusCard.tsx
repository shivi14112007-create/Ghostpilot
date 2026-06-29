import React, { useEffect, useState } from 'react';

interface StatusCardProps {
  title: string;
  value: React.ReactNode;
  subtitle?: string;
  icon: React.ReactNode;
  statusClass?: string;
  accentColor?: string;
  badge?: React.ReactNode;
  numericValue?: number;
  suffix?: string;
}

export const StatusCard: React.FC<StatusCardProps> = ({
  title,
  value,
  subtitle,
  icon,
  statusClass = 'border-slate-800/80 bg-[#0B132B]/60 text-white',
  accentColor = 'text-cyan-400',
  badge,
  numericValue,
  suffix = '',
}) => {
  const [displayNum, setDisplayNum] = useState<number | undefined>(numericValue);

  // Animated counter effect
  useEffect(() => {
    if (numericValue === undefined) return;
    let start = displayNum !== undefined ? displayNum : 0;
    const end = numericValue;
    if (start === end) return;

    const duration = 600;
    const startTime = performance.now();

    const animateCount = (currentTime: number) => {
      const elapsed = currentTime - startTime;
      const progress = Math.min(elapsed / duration, 1);
      // Ease out cubic
      const ease = 1 - Math.pow(1 - progress, 3);
      const currentVal = Math.round(start + (end - start) * ease);
      setDisplayNum(currentVal);

      if (progress < 1) {
        requestAnimationFrame(animateCount);
      }
    };

    requestAnimationFrame(animateCount);
  }, [numericValue]);

  return (
    <div 
      role="region"
      aria-label={`Status card for ${title}`}
      tabIndex={0}
      className={`relative overflow-hidden rounded-2xl border p-5 backdrop-blur-xl transition-all duration-300 hover:scale-[1.02] hover:shadow-2xl focus:outline-none focus:ring-2 focus:ring-cyan-400 group ${statusClass}`}
    >
      {/* Subtle top animated glow line */}
      <div className="absolute top-0 left-0 right-0 h-[2px] bg-gradient-to-r from-transparent via-cyan-500/40 to-transparent group-hover:via-cyan-300 transition-all duration-500" />
      
      <div className="flex items-start justify-between gap-4">
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 mb-1.5">
            <span className="text-xs font-mono tracking-wider opacity-80 uppercase font-bold truncate">
              {title}
            </span>
            {badge && <div className="shrink-0">{badge}</div>}
          </div>

          <div className="text-2xl sm:text-3xl font-extrabold tracking-tight font-mono my-1.5">
            {numericValue !== undefined && displayNum !== undefined ? (
              <span>{displayNum}{suffix}</span>
            ) : (
              value
            )}
          </div>

          {subtitle && (
            <p className="text-xs opacity-70 font-sans mt-1 flex items-center gap-1 truncate">
              {subtitle}
            </p>
          )}
        </div>

        <div className={`p-3.5 rounded-xl bg-slate-900/90 border border-slate-700/60 shadow-inner shrink-0 ${accentColor} group-hover:scale-110 group-hover:rotate-3 transition-all duration-300`}>
          {icon}
        </div>
      </div>
    </div>
  );
};

