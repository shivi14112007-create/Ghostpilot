import React from 'react';
import { Rocket, Cpu, Radio, Sparkles, Satellite } from 'lucide-react';

interface LoadingOverlayProps {
  isVisible: boolean;
}

export const LoadingOverlay: React.FC<LoadingOverlayProps> = ({ isVisible }) => {
  if (!isVisible) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-[#050814]/85 backdrop-blur-lg transition-opacity duration-500 animate-fadeIn p-4">
      <div className="relative max-w-md w-full rounded-3xl border border-cyan-500/50 bg-gradient-to-b from-[#0B132B] via-[#080D21] to-[#050814] p-8 shadow-[0_0_60px_rgba(0,240,255,0.25)] text-center flex flex-col items-center animate-scaleUp">
        
        {/* Pulsing Corner Status Indicator */}
        <div className="absolute top-5 right-5 flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-cyan-500/10 border border-cyan-500/30 text-[10px] font-mono text-cyan-300">
          <span className="w-2 h-2 rounded-full bg-cyan-400 animate-ping" />
          <span>ISRO LINK LIVE</span>
        </div>

        {/* Orbital Satellite Ring Animated Visual */}
        <div className="relative w-28 h-28 my-4 flex items-center justify-center">
          <div className="absolute inset-0 rounded-full border-2 border-dashed border-[#F36F21]/60 animate-spin" style={{ animationDuration: '8s' }} />
          <div className="absolute inset-2 rounded-full border border-cyan-400/40 animate-ping" style={{ animationDuration: '3s' }} />
          <div className="absolute inset-4 rounded-full border-4 border-t-cyan-400 border-r-[#F36F21] border-b-transparent border-l-transparent animate-spin" style={{ animationDuration: '1.8s' }} />
          
          <div className="relative z-10 p-4 rounded-full bg-[#050814] border border-cyan-500/50 shadow-[0_0_20px_rgba(0,240,255,0.3)]">
            <Rocket className="w-8 h-8 text-cyan-300 transform -rotate-45 animate-bounce" />
          </div>
        </div>

        <h3 className="text-base sm:text-lg font-bold font-mono tracking-wider text-white uppercase mb-2 flex items-center justify-center gap-2">
          <Sparkles className="w-4 h-4 text-[#F36F21] animate-pulse" />
          AI Mission Control Inferring...
        </h3>

        <p className="text-xs sm:text-sm text-sky-200/95 font-mono tracking-wide leading-relaxed mb-6 font-semibold">
          AI Mission Control is analyzing telemetry...
        </p>

        {/* Progress Bar Animation */}
        <div className="w-full h-2.5 bg-slate-900 rounded-full overflow-hidden border border-slate-800 mb-5 p-0.5">
          <div className="h-full bg-gradient-to-r from-[#F36F21] via-amber-400 to-cyan-400 animate-pulse rounded-full w-4/5 transition-all duration-300 shadow-[0_0_10px_rgba(0,240,255,0.5)]" />
        </div>

        <div className="flex items-center justify-between w-full text-[11px] font-mono text-slate-400 border-t border-slate-800/80 pt-4">
          <span className="flex items-center gap-1.5">
            <Radio className="w-3.5 h-3.5 text-cyan-400 animate-ping" />
            DOWNLINK QUEUE PROCESSING
          </span>
          <span className="text-[#F36F21] font-semibold tracking-wider">PHI-3 EDGE ENGINE</span>
        </div>
      </div>
    </div>
  );
};

