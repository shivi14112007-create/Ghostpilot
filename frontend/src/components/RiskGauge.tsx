import React from 'react';
import { AlertTriangle, ShieldCheck, AlertOctagon } from 'lucide-react';

interface RiskGaugeProps {
  riskPercentage: number;
  label?: string;
}

export const RiskGauge: React.FC<RiskGaugeProps> = ({ 
  riskPercentage,
  label = "AI PREDICTIVE RISK"
}) => {
  // Ensure value stays inside bounds
  const clampedValue = Math.min(Math.max(Math.round(riskPercentage), 0), 100);

  // 0–30 Green, 31–70 Yellow, 71–100 Red
  const getGaugeConfig = (val: number) => {
    if (val <= 30) {
      return {
        strokeHex: '#10B981',
        textClass: 'text-emerald-400',
        bgClass: 'bg-emerald-500/10 border-emerald-500/30',
        glowStyle: '0 0 20px rgba(16, 185, 129, 0.35)',
        statusText: 'NOMINAL (LOW RISK)',
        icon: <ShieldCheck className="w-4 h-4 text-emerald-400" />
      };
    }
    if (val <= 70) {
      return {
        strokeHex: '#F59E0B',
        textClass: 'text-amber-400',
        bgClass: 'bg-amber-500/10 border-amber-500/30',
        glowStyle: '0 0 20px rgba(245, 158, 11, 0.35)',
        statusText: 'WARNING (ELEVATED)',
        icon: <AlertTriangle className="w-4 h-4 text-amber-400 animate-pulse" />
      };
    }
    return {
      strokeHex: '#EF4444',
      textClass: 'text-red-400',
      bgClass: 'bg-red-500/15 border-red-500/40',
      glowStyle: '0 0 25px rgba(239, 68, 68, 0.5)',
      statusText: 'CRITICAL THRESHOLD',
      icon: <AlertOctagon className="w-4 h-4 text-red-400 animate-bounce" />
    };
  };

  const config = getGaugeConfig(clampedValue);

  // SVG Circular Math
  const radius = 64;
  const strokeWidth = 12;
  const normalizedRadius = radius - strokeWidth * 0.5;
  const circumference = normalizedRadius * 2 * Math.PI;
  // We use a 240-degree arc (from 150 deg to 390 deg)
  const arcFraction = 240 / 360;
  const maxDash = circumference * arcFraction;
  const strokeDashoffset = maxDash - (clampedValue / 100) * maxDash;

  return (
    <div className="flex flex-col items-center justify-center p-4 rounded-2xl bg-[#050814]/80 border border-slate-800/80 backdrop-blur-md shadow-xl w-full">
      <div className="flex items-center justify-between w-full pb-2 mb-2 border-b border-slate-800 text-xs font-mono">
        <span className="text-slate-400 uppercase tracking-wider font-semibold">{label}</span>
        <span className="text-[10px] bg-slate-900 px-2 py-0.5 rounded text-slate-300 border border-slate-700">
          T+15M FORECAST
        </span>
      </div>

      <div className="relative flex items-center justify-center my-3">
        <svg
          height={radius * 2}
          width={radius * 2}
          viewBox={`0 0 ${radius * 2} ${radius * 2}`}
          className="transform rotate-[150deg] overflow-visible"
        >
          {/* Background Track Arc */}
          <circle
            stroke="#1E293B"
            fill="transparent"
            strokeWidth={strokeWidth}
            strokeDasharray={`${maxDash} ${circumference}`}
            style={{ strokeLinecap: 'round' }}
            r={normalizedRadius}
            cx={radius}
            cy={radius}
          />
          
          {/* Foreground Animated Value Arc */}
          <circle
            stroke={config.strokeHex}
            fill="transparent"
            strokeWidth={strokeWidth}
            strokeDasharray={`${maxDash} ${circumference}`}
            style={{
              strokeDashoffset,
              strokeLinecap: 'round',
              filter: `drop-shadow(${config.glowStyle})`,
              transition: 'stroke-dashoffset 1s cubic-bezier(0.4, 0, 0.2, 1), stroke 0.5s ease'
            }}
            r={normalizedRadius}
            cx={radius}
            cy={radius}
          />
        </svg>

        {/* Center Typography & Counter */}
        <div className="absolute inset-0 flex flex-col items-center justify-center pt-2 pointer-events-none">
          <span className={`text-3xl sm:text-4xl font-extrabold font-mono tracking-tighter transition-colors duration-500 ${config.textClass}`}>
            {clampedValue}<span className="text-xl font-normal opacity-80">%</span>
          </span>
          <span className="text-[10px] font-mono tracking-widest text-slate-500 uppercase mt-0.5">
            RISK PROB
          </span>
        </div>
      </div>

      {/* Status Footer Badge */}
      <div className={`mt-1 px-3 py-1.5 rounded-xl border flex items-center gap-2 text-xs font-mono font-bold tracking-wide transition-all duration-500 ${config.bgClass} ${config.textClass}`}>
        {config.icon}
        <span>{config.statusText}</span>
      </div>

      {/* Scale indicators */}
      <div className="flex justify-between w-full px-4 mt-3 text-[10px] font-mono text-slate-500">
        <span>0%</span>
        <span>30% SAFE</span>
        <span>70% WARN</span>
        <span>100%</span>
      </div>
    </div>
  );
};
