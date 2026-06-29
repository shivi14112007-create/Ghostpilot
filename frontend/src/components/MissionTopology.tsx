import React from 'react';
import { Satellite, Radio, Router, Monitor, Cpu, ArrowDown, Activity, ShieldCheck, ShieldAlert } from 'lucide-react';
import { NetworkStatusType } from '../types';

interface MissionTopologyProps {
  networkStatus: NetworkStatusType;
}

export const MissionTopology: React.FC<MissionTopologyProps> = ({ networkStatus }) => {
  const isHealthy = networkStatus === 'Healthy';
  const isWarn = networkStatus === 'Warning';
  const isCrit = networkStatus === 'Critical';

  // Helper for color logic
  const getNodeColor = (nodeType: 'sat' | 'ground' | 'router' | 'mcc' | 'ai') => {
    if (isHealthy) {
      return {
        bg: 'bg-emerald-500/10 border-emerald-500/40 shadow-[0_0_20px_rgba(16,185,129,0.15)]',
        text: 'text-emerald-300',
        iconColor: 'text-emerald-400',
        badge: 'bg-emerald-500/20 text-emerald-300 border-emerald-500/40',
        status: 'NOMINAL'
      };
    }
    if (isWarn) {
      // Degrade ground & sat on warning
      if (nodeType === 'sat' || nodeType === 'ground') {
        return {
          bg: 'bg-amber-500/15 border-amber-500/50 shadow-[0_0_20px_rgba(245,158,11,0.2)] animate-pulse',
          text: 'text-amber-300',
          iconColor: 'text-amber-400',
          badge: 'bg-amber-500/25 text-amber-200 border-amber-500/50',
          status: 'ELEVATED QUEUE'
        };
      }
      return {
        bg: 'bg-cyan-500/10 border-cyan-500/30',
        text: 'text-cyan-300',
        iconColor: 'text-cyan-400',
        badge: 'bg-cyan-500/20 text-cyan-300 border-cyan-500/40',
        status: 'STABLE'
      };
    }
    // Critical
    if (nodeType === 'router' || nodeType === 'ground') {
      return {
        bg: 'bg-red-500/20 border-red-500/70 shadow-[0_0_25px_rgba(239,68,68,0.4)] animate-bounce',
        text: 'text-red-300 font-bold',
        iconColor: 'text-red-400',
        badge: 'bg-red-500/30 text-red-200 border-red-500 font-bold',
        status: 'PACKET DROP'
      };
    }
    return {
      bg: 'bg-amber-500/10 border-amber-500/40',
      text: 'text-amber-300',
      iconColor: 'text-amber-400',
      badge: 'bg-amber-500/20 text-amber-300 border-amber-500/40',
      status: 'FAILOVER RE-ROUTE'
    };
  };

  const nodes = [
    { id: 'sat', label: 'ISRO Ka-Band Relay Satellite', sub: 'GSAT-7A / GSAT-24 CONSTELLATION', icon: Satellite },
    { id: 'ground', label: 'ISTRAC Ground Station Downlink', sub: 'BANGALORE / LUCKNOW TRACKING ARRAY', icon: Radio },
    { id: 'router', label: 'Deep Space Network Core Router', sub: 'BACKBONE SWITCH CORE-B', icon: Router },
    { id: 'mcc', label: 'ISRO NOC Mission Control', sub: 'TELEMETRY PROCESSING CLUSTER', icon: Monitor },
    { id: 'ai', label: 'GhostPilot AI Engine', sub: 'PHI-3 EDGE AUTONOMOUS COPILOT', icon: Cpu }
  ] as const;

  return (
    <div className="rounded-2xl border border-slate-800/90 bg-[#050B19]/80 backdrop-blur-xl p-5 shadow-2xl flex flex-col h-full relative overflow-hidden group">
      {/* Background ambient grid pattern */}
      <div className="absolute inset-0 bg-[linear-gradient(to_right,#1f293710_1px,transparent_1px),linear-gradient(to_bottom,#1f293710_1px,transparent_1px)] bg-[size:24px_24px] pointer-events-none" />

      {/* Title */}
      <div className="flex items-center justify-between pb-3 mb-4 border-b border-slate-800/80 z-10">
        <div className="flex items-center gap-2">
          <Activity className="w-4 h-4 text-cyan-400 animate-pulse" />
          <span className="text-xs font-mono font-bold uppercase tracking-wider text-slate-200">
            Mission Topology Link State
          </span>
        </div>
        <span className="text-[10px] font-mono bg-cyan-950/50 text-cyan-300 px-2 py-0.5 rounded border border-cyan-800/60 font-semibold tracking-widest">
          5-STAGE ARCHITECTURE
        </span>
      </div>

      {/* Vertical Animated Chain */}
      <div className="flex-1 flex flex-col items-center justify-between gap-1.5 py-2 z-10 max-w-md mx-auto w-full">
        {nodes.map((node, idx) => {
          const config = getNodeColor(node.id);
          const IconNode = node.icon;
          const isLast = idx === nodes.length - 1;

          return (
            <React.Fragment key={node.id}>
              {/* Node Card */}
              <div className={`w-full rounded-xl border p-3.5 transition-all duration-300 flex items-center justify-between ${config.bg}`}>
                <div className="flex items-center gap-3">
                  <div className={`p-2 rounded-lg bg-black/40 border border-slate-800 shrink-0 ${config.iconColor}`}>
                    <IconNode className="w-5 h-5" />
                  </div>
                  <div>
                    <h4 className="text-xs font-mono font-bold tracking-tight text-white flex items-center gap-2">
                      {node.label}
                    </h4>
                    <p className="text-[10px] font-mono text-slate-400 mt-0.5">
                      {node.sub}
                    </p>
                  </div>
                </div>

                <div className={`text-[9px] font-mono font-extrabold px-2 py-1 rounded border tracking-wider shrink-0 ${config.badge}`}>
                  {config.status}
                </div>
              </div>

              {/* Downward Pulse Arrow */}
              {!isLast && (
                <div className="flex flex-col items-center justify-center -my-1 py-0.5">
                  <div className="w-[2px] h-3 bg-gradient-to-b from-cyan-400 via-sky-500 to-amber-400 animate-pulse" />
                  <ArrowDown className="w-3.5 h-3.5 text-cyan-400 animate-bounce -mt-1" />
                </div>
              )}
            </React.Fragment>
          );
        })}
      </div>

      {/* Footer Legend */}
      <div className="mt-4 pt-3 border-t border-slate-800/80 flex items-center justify-between text-[10px] font-mono text-slate-400 z-10">
        <span className="flex items-center gap-1.5 text-emerald-400">
          <ShieldCheck className="w-3.5 h-3.5" /> Synchronized Lock
        </span>
        <span className="text-slate-500">
          PROPAGATION DELAY: ~1.24s
        </span>
      </div>
    </div>
  );
};
