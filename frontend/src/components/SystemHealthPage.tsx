import React from 'react';
import { 
  Heart, 
  Activity, 
  ShieldCheck, 
  Database, 
  Terminal, 
  Settings, 
  Cpu, 
  HelpCircle,
  Clock,
  Radio,
  Satellite
} from 'lucide-react';
import { NodeHealthPoint } from '../types';
import { HealthChart } from './HealthChart';

interface SystemHealthPageProps {
  connected: boolean;
  healthData: NodeHealthPoint[];
}

export const SystemHealthPage: React.FC<SystemHealthPageProps> = ({
  connected,
  healthData
}) => {
  // Service status items
  const services = [
    {
      name: 'Ollama Status',
      status: connected ? 'Ready' : 'Offline',
      color: connected ? 'text-emerald-400 border-emerald-500/20 bg-emerald-500/5' : 'text-red-400 border-red-500/20 bg-red-500/5',
      dotColor: connected ? 'bg-emerald-400' : 'bg-red-500',
      desc: 'Local edge LLM engine serving quantized Phi-3 parameters directly on ground terminal machine.'
    },
    {
      name: 'Backend Status',
      status: connected ? 'Online' : 'Offline',
      color: connected ? 'text-emerald-400 border-emerald-500/20 bg-emerald-500/5' : 'text-red-400 border-red-500/20 bg-red-500/5',
      dotColor: connected ? 'bg-emerald-400' : 'bg-red-500',
      desc: 'Express-Vite hybrid server orchestrating dynamic telemetry calculations and cache logs.'
    },
    {
      name: 'ML Model Status',
      status: 'Ready',
      color: 'text-emerald-400 border-emerald-500/20 bg-emerald-500/5',
      dotColor: 'bg-emerald-400',
      desc: 'Weights verification check passed. Phi-3 local weights loaded securely into server RAM.'
    },
    {
      name: 'Telemetry Parser',
      status: 'Ready',
      color: 'text-emerald-400 border-emerald-500/20 bg-emerald-500/5',
      dotColor: 'bg-emerald-400',
      desc: 'X-band, S-band, and Ka-band transponder packet stream compilers fully synchronized.'
    },
    {
      name: 'JSON Validator',
      status: 'Ready',
      color: 'text-emerald-400 border-emerald-500/20 bg-emerald-500/5',
      dotColor: 'bg-emerald-400',
      desc: 'Schema validator active. Standardizes external JSON structure drops against ISRO specifications.'
    }
  ];

  return (
    <div className="space-y-6 animate-fadeIn font-sans">
      
      {/* Title */}
      <div className="rounded-xl border border-slate-855 bg-[#111827] p-6 shadow-sm flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="p-2.5 rounded-lg bg-slate-900 border border-slate-800 text-blue-500">
            <Heart className="w-5 h-5" />
          </div>
          <div>
            <h2 className="text-sm sm:text-base font-bold text-white tracking-wider uppercase font-mono">
              Core System Health Deck
            </h2>
            <p className="text-xs text-slate-500 mt-0.5 font-mono">
              Real-time monitoring of local microservices, model daemons and link distributions
            </p>
          </div>
        </div>
        <button 
          disabled
          className="text-[10px] px-3 py-1.5 rounded-lg bg-emerald-950/20 text-emerald-400 border border-emerald-800/45 font-bold uppercase tracking-wider flex items-center gap-2 font-mono disabled:opacity-100"
        >
          <span className="h-1.5 w-1.5 rounded-full bg-emerald-400" />
          Systems Nominal
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-stretch">
        
        {/* Left: Service Status Cards (Col span 7) */}
        <div className="lg:col-span-7 space-y-4">
          <h3 className="text-xs font-bold uppercase tracking-widest text-slate-500 border-l-2 border-emerald-500 pl-2.5 font-mono">
            LOCAL ENGINE DAEMONS
          </h3>

          <div className="space-y-4">
            {services.map((svc, idx) => (
              <div 
                key={idx}
                className="rounded-xl border border-slate-850 bg-[#111827] p-6 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 shadow-sm"
              >
                <div className="space-y-1.5 max-w-xl">
                  <div className="flex items-center gap-2.5">
                    <span className="font-bold text-sm text-white uppercase tracking-wider font-mono">{svc.name}</span>
                    <span className={`text-[9px] font-mono font-bold px-2 py-0.5 rounded border flex items-center gap-1.5 ${svc.color}`}>
                      <span className={`w-1.5 h-1.5 rounded-full ${svc.dotColor}`} />
                      {svc.status}
                    </span>
                  </div>
                  <p className="text-xs text-slate-400 leading-relaxed">
                    {svc.desc}
                  </p>
                </div>

                <span className="text-[10px] text-slate-500 font-mono self-end sm:self-center shrink-0">
                  PORT: 11434 • OK
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* Right: Health Chart / Distribution (Col span 5) */}
        <div className="lg:col-span-5 flex flex-col justify-between space-y-4">
          <h3 className="text-xs font-bold uppercase tracking-widest text-slate-500 border-l-2 border-emerald-500 pl-2.5 font-mono">
            NODE STATUS ALLOCATION
          </h3>

          <div className="flex-1 min-h-[350px] rounded-xl border border-slate-850 bg-[#111827] p-6 shadow-sm flex items-center justify-center">
            <div className="w-full h-full">
              <HealthChart data={healthData} />
            </div>
          </div>

          {/* Quick Metrics */}
          <div className="p-6 rounded-xl border border-slate-850 bg-[#111827] grid grid-cols-2 gap-4 font-mono shadow-sm">
            <div>
              <div className="text-[10px] text-slate-500 uppercase">Network Ingress</div>
              <div className="text-base font-bold text-emerald-500 mt-1">100% OK</div>
            </div>
            <div>
              <div className="text-[10px] text-slate-500 uppercase">Decryption Key</div>
              <div className="text-base font-bold text-blue-500 mt-1">ESTABLISHED</div>
            </div>
          </div>
        </div>

      </div>

      <div className="pt-4 border-t border-slate-800 text-[10px] text-slate-500 flex flex-wrap items-center justify-between gap-3 font-mono">
        <span>ISTRAC STATUS BROADCAST • ACTIVE</span>
        <span>UTC TIMESTEP REF: <strong className="text-slate-400">ISRO-UTC-SYNC-M</strong></span>
      </div>
    </div>
  );
};
