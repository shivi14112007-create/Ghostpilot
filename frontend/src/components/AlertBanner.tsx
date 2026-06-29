import React from 'react';
import { ShieldCheck, AlertTriangle, AlertOctagon, Activity, ChevronRight } from 'lucide-react';
import { NetworkStatusType } from '../types';

interface AlertBannerProps {
  status: NetworkStatusType;
  reason?: string;
}

export const AlertBanner: React.FC<AlertBannerProps> = ({ status, reason }) => {
  const getBannerConfig = () => {
    switch (status) {
      case 'Healthy':
        return {
          bgClass: 'bg-[#111827]/80 border-b border-slate-800 text-emerald-500',
          badgeClass: 'bg-emerald-500/10 text-emerald-500 border-emerald-500/20',
          pulseDot: 'bg-emerald-500',
          icon: <ShieldCheck className="w-3.5 h-3.5 text-emerald-500 shrink-0" />,
          title: 'HEALTHY NOMINAL LINK',
          message: reason || 'All satellites and ground tracking links operating optimally.',
        };
      case 'Warning':
        return {
          bgClass: 'bg-[#111827]/80 border-b border-slate-800 text-amber-500',
          badgeClass: 'bg-amber-500/10 text-amber-500 border-amber-500/20',
          pulseDot: 'bg-amber-500',
          icon: <AlertTriangle className="w-3.5 h-3.5 text-amber-500 shrink-0" />,
          title: 'WARNING DEGRADED RELAY',
          message: reason || 'Anomalous buffer queues and packet jitters observed.',
        };
      case 'Critical':
        return {
          bgClass: 'bg-[#111827]/80 border-b border-slate-800 text-red-500',
          badgeClass: 'bg-red-500/10 text-red-500 border-red-500/20',
          pulseDot: 'bg-red-500',
          icon: <AlertOctagon className="w-3.5 h-3.5 text-red-500 shrink-0" />,
          title: 'CRITICAL LINK LOSS',
          message: reason || 'Severe packet drop rates threat command lock sequences.',
        };
      default:
        return {
          bgClass: 'bg-[#111827]/80 border-b border-slate-800 text-blue-500',
          badgeClass: 'bg-blue-500/10 text-blue-500 border-blue-500/20',
          pulseDot: 'bg-blue-500',
          icon: <Activity className="w-3.5 h-3.5 text-blue-500 shrink-0" />,
          title: 'STANDBY MODE',
          message: 'Waiting for ground segment telemetry ingest.',
        };
    }
  };

  const config = getBannerConfig();

  return (
    <div className={`w-full backdrop-blur-md transition-all duration-300 ${config.bgClass} py-3 px-6`}>
      <div className="max-w-[1300px] mx-auto flex flex-col md:flex-row items-center justify-between gap-4 text-xs font-mono">
        
        <div className="flex items-center gap-4 w-full md:w-auto">
          <span className={`px-2.5 py-1 rounded-lg border font-bold flex items-center gap-2 shrink-0 text-[10px] ${config.badgeClass}`}>
            <span className={`h-1.5 w-1.5 rounded-full ${config.pulseDot}`} />
            {config.icon}
            <span>{config.title}</span>
          </span>

          <div className="flex items-center gap-2 min-w-0">
            <span className="font-sans font-medium text-slate-300 text-xs truncate">
              {config.message}
            </span>
          </div>
        </div>

        <div className="flex items-center gap-1.5 text-[10px] text-slate-500 shrink-0 bg-[#0b1220]/50 px-3 py-1 rounded-full border border-slate-800">
          <span>AI ENGINE:</span>
          <span className="text-slate-300 font-bold flex items-center gap-1">
            PHI-3 ACTIVE <ChevronRight className="w-3.5 h-3.5 text-slate-500" />
          </span>
        </div>

      </div>
    </div>
  );
};
