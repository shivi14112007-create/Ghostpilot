import React from 'react';
import { 
  Info, 
  Rocket, 
  Cpu, 
  ShieldCheck, 
  Code, 
  Award,
  Globe,
  Database
} from 'lucide-react';

export const AboutPage: React.FC = () => {
  const stack = [
    { name: 'React 19 & TypeScript', category: 'Frontend', desc: 'Component architecture with strict types for mission integrity.' },
    { name: 'Tailwind CSS', category: 'Styling', desc: 'Glassmorphism dark theme suitable for command center monitors.' },
    { name: 'Recharts', category: 'Visualizations', desc: 'Performance-optimized SVG graphing of link parameters over sliding windows.' },
    { name: 'Phi-3 Quantized Edge', category: 'ML Engine', desc: '3.8 Billion parameter local weights served through quantized CPU thread runs.' },
    { name: 'Express.js & Axios', category: 'Backend Seg', desc: 'Pre-engineered router pipeline for closed-loop telemetry handoffs.' }
  ];

  return (
    <div className="space-y-8 animate-fade-in font-sans">
      
      {/* Page Title */}
      <div className="rounded-2xl border border-slate-800 bg-[#040814]/30 backdrop-blur-xl p-6 shadow-md flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="p-2.5 rounded-xl bg-slate-900 border border-slate-800 text-cyan-400">
            <Info className="w-5 h-5" />
          </div>
          <div>
            <h2 className="text-sm sm:text-base font-extrabold text-white tracking-wider uppercase font-mono">
              About GhostPilot Systems
            </h2>
            <p className="text-xs text-cyan-400/80 mt-0.5 font-mono">
              Autonomous self-healing deep space telecommunications
            </p>
          </div>
        </div>
        <span className="text-[10px] px-2.5 py-1 rounded bg-[#F36F21]/10 text-[#F36F21] border border-[#F36F21]/20 font-bold uppercase tracking-widest font-mono">
          PS13 Official Solution
        </span>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-stretch">
        
        {/* Left column: Narrative & Purpose (Col span 7) */}
        <div className="lg:col-span-7 space-y-6">
          {/* Overview */}
          <div className="rounded-2xl border border-slate-800 bg-[#040814]/30 p-6 shadow-md space-y-4">
            <div className="flex items-center gap-2 pb-3 border-b border-slate-800/60">
              <Rocket className="w-4 h-4 text-[#F36F21] transform -rotate-45" />
              <h3 className="font-bold text-xs sm:text-sm text-white uppercase tracking-wider font-mono">
                What is GhostPilot?
              </h3>
            </div>
            <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
              <strong>GhostPilot</strong> is a specialized AI Copilot designed for the <strong>ISRO Ground Segment (ISTRAC)</strong>, addressing the challenges of autonomous fault diagnosis in mission networks. Built to function as an offline-first assistant, GhostPilot processes massive telemetry arrays and coordinates optimal link-switching during real-time tracking passes.
            </p>
          </div>

          {/* Core Philosophy of Offline AI */}
          <div className="rounded-2xl border border-slate-800 bg-[#040814]/30 p-6 shadow-md space-y-4">
            <div className="flex items-center gap-2 pb-3 border-b border-slate-800/60">
              <ShieldCheck className="w-4 h-4 text-emerald-400" />
              <h3 className="font-bold text-xs sm:text-sm text-white uppercase tracking-wider font-mono">
                Offline AI Copilot Philosophy
              </h3>
            </div>
            <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
              During peak spacecraft tracking windows, link-state latency can exceed bounds due to telemetry clutter or solar flares. Relying on remote, internet-dependent AI services introduces risk and latency.
            </p>
            <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
              By deploying lightweight, highly-optimized <strong>4-bit quantized local models (Phi-3)</strong> directly onto ground segment terminal machines, GhostPilot achieves 100% network isolation, zero API subscription costs, and guarantees constant sub-50ms rule evaluations.
            </p>
          </div>

          {/* Hackathon PS13 Context */}
          <div className="rounded-2xl border border-slate-800 bg-[#040814]/30 p-6 shadow-md space-y-4">
            <div className="flex items-center gap-2 pb-3 border-b border-slate-800/60">
              <Award className="w-4 h-4 text-amber-400" />
              <h3 className="font-bold text-xs sm:text-sm text-white uppercase tracking-wider font-mono">
                ISRO Hackathon 2026 • PS13
              </h3>
            </div>
            <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
              Our solution addresses <strong>Problem Statement 13: &quot;Autonomous Fault Detection, Congestion Management, & Self-Healing in Telemetry/Tracking Ground Segment Networks.&quot;</strong> GhostPilot provides an operational control panel matching professional Network Operations Center (NOC) requirements.
            </p>
          </div>
        </div>

        {/* Right column: Tech Stack Card (Col span 5) */}
        <div className="lg:col-span-5 space-y-6">
          
          {/* Tech Stack List */}
          <div className="rounded-2xl border border-slate-800 bg-[#040814]/30 p-6 shadow-md space-y-4">
            <div className="flex items-center gap-2 pb-3 border-b border-slate-800/60">
              <Code className="w-4 h-4 text-cyan-400" />
              <h3 className="font-bold text-xs sm:text-sm text-white uppercase tracking-wider font-mono">
                GhostPilot Tech Stack
              </h3>
            </div>

            <div className="space-y-3.5">
              {stack.map((item, idx) => (
                <div key={idx} className="p-3.5 rounded-xl bg-[#040814]/40 border border-slate-850 flex items-start gap-3">
                  <div className="p-1 rounded bg-slate-900 border border-slate-800 text-[9px] text-cyan-400 shrink-0 font-bold font-mono tracking-wider">
                    0{idx + 1}
                  </div>
                  <div>
                    <div className="flex items-center gap-2 flex-wrap">
                      <span className="text-xs font-bold text-white uppercase tracking-wider font-mono">{item.name}</span>
                      <span className="text-[8px] px-1.5 py-0.2 rounded bg-cyan-950 text-cyan-300 font-mono">
                        {item.category}
                      </span>
                    </div>
                    <p className="text-[10px] text-slate-400 leading-relaxed mt-1">
                      {item.desc}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>

        </div>

      </div>

      <div className="pt-4 border-t border-slate-800/60 text-[10px] text-slate-500 flex flex-wrap items-center justify-between gap-3 font-mono">
        <span>ISTRAC INTERNAL INFO SHEET • GHOSTPILOT-v1</span>
        <span>BANGALORE HEADQUARTERS • INDIA</span>
      </div>
    </div>
  );
};
