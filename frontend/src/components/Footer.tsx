import React from 'react';
import { Rocket, ShieldCheck, Cpu, WifiOff, Sparkles, Terminal, Satellite } from 'lucide-react';

export const Footer: React.FC = () => {
  return (
    <footer className="w-full bg-[#030611] border-t border-slate-800/90 py-5 px-4 lg:px-6 mt-auto text-slate-400 font-mono text-xs z-20">
      <div className="max-w-[1700px] mx-auto flex flex-col md:flex-row items-center justify-between gap-4">
        
        {/* Left branding */}
        <div className="flex items-center gap-3">
          <div className="p-2 rounded-xl bg-gradient-to-br from-[#F36F21]/20 to-cyan-500/20 border border-[#F36F21]/40 shadow-sm">
            <Rocket className="w-4 h-4 text-[#F36F21] transform -rotate-45" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="text-white font-bold tracking-widest uppercase">GHOSTPILOT NOC</span>
              <span className="text-[10px] bg-cyan-950 text-cyan-300 px-1.5 py-0.2 rounded border border-cyan-800 font-bold">FINALIST</span>
            </div>
            <p className="text-[10px] text-slate-500 mt-0.5 font-sans">
              ISRO Autonomous Satellite Monitoring & Self-Healing Network Copilot
            </p>
          </div>
        </div>

        {/* Center Key Hackathon Highlights */}
        <div className="flex flex-wrap items-center justify-center gap-2 sm:gap-3">
          <div className="flex items-center gap-1.5 bg-[#050A19] px-3 py-1 rounded-lg border border-slate-800 text-[11px] text-cyan-300 shadow-inner">
            <WifiOff className="w-3.5 h-3.5 text-emerald-400" />
            <strong className="text-white tracking-wide">Offline AI</strong>
          </div>

          <div className="flex items-center gap-1.5 bg-[#050A19] px-3 py-1 rounded-lg border border-slate-800 text-[11px] text-[#F36F21] shadow-inner">
            <Cpu className="w-3.5 h-3.5 text-[#F36F21]" />
            <strong className="text-white tracking-wide">Phi-3 via Ollama</strong>
          </div>

          <div className="flex items-center gap-1.5 bg-[#050A19] px-3 py-1 rounded-lg border border-slate-800 text-[11px] text-emerald-300 shadow-inner">
            <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
            <strong className="text-white tracking-wide">No Internet Required</strong>
          </div>

          <div className="flex items-center gap-1.5 bg-[#050A19] px-3 py-1 rounded-lg border border-slate-800 text-[11px] text-amber-300 shadow-inner">
            <Sparkles className="w-3.5 h-3.5 text-amber-400" />
            <strong className="text-white tracking-wide">Powered by Local AI</strong>
          </div>
        </div>

        {/* Right copyright / agency */}
        <div className="flex flex-col items-end gap-1 text-[11px] text-slate-500 font-mono">
          <div className="flex items-center gap-1.5">
            <span className="text-slate-400 font-bold">GhostPilot v1.0</span> • <span className="text-cyan-400 font-semibold">Offline AI Copilot</span>
          </div>
          <span className="text-[10px] text-slate-500">ISRO Hackathon 2026 • ISTRAC BLR</span>
        </div>
      </div>
    </footer>
  );
};
