import React from 'react';
import { 
  BarChart3, 
  Database, 
  Zap, 
  Satellite, 
  Radio, 
  Clock, 
  Cpu, 
  Activity, 
  AlertTriangle,
  TrendingUp,
  TrendingDown
} from 'lucide-react';
import { TelemetryData } from '../types';

interface MissionStatisticsProps {
  currentTelemetry: TelemetryData;
  runCount: number;
}

export const MissionStatistics: React.FC<MissionStatisticsProps> = ({ currentTelemetry, runCount }) => {
  const stats = [
    {
      label: 'TELEMETRY PROCESSED',
      value: (14284920 + runCount * 1250).toLocaleString(),
      sub: 'Total NOC frames archived',
      icon: Database,
      accent: 'text-cyan-400 border-cyan-500/30 bg-cyan-950/40',
      trend: '+12.4% vs nominal'
    },
    {
      label: 'PACKETS / SEC',
      value: '4,820 Hz',
      sub: 'Downlink Ka-band sampling',
      icon: Zap,
      accent: 'text-emerald-400 border-emerald-500/30 bg-emerald-950/40',
      trend: '0.00% frame jitter'
    },
    {
      label: 'SATELLITES ONLINE',
      value: '24 / 24 ACTIVE',
      sub: 'GSAT relay constellation',
      icon: Satellite,
      accent: 'text-sky-400 border-sky-500/30 bg-sky-950/40',
      trend: '100% orbital lock'
    },
    {
      label: 'GROUND STATIONS',
      value: '6 / 6 SYNCED',
      sub: 'ISTRAC tracking array',
      icon: Radio,
      accent: 'text-amber-400 border-amber-500/30 bg-amber-950/40',
      trend: 'BLR / LKO / PB / MAU'
    },
    {
      label: 'AVERAGE LATENCY',
      value: `${currentTelemetry.latency} ms`,
      sub: 'Ka-band roundtrip bus',
      icon: Clock,
      accent: currentTelemetry.latency > 100 ? 'text-red-400 border-red-500/40 bg-red-950/40' : 'text-cyan-300 border-cyan-500/30 bg-cyan-950/30',
      trend: currentTelemetry.latency < 50 ? '🟢 Nominal link' : '🟡 Elevated delay'
    },
    {
      label: 'AVERAGE CPU',
      value: `${Math.round(currentTelemetry.cpu)}%`,
      sub: 'Router Core processor load',
      icon: Cpu,
      accent: currentTelemetry.cpu > 80 ? 'text-red-400 border-red-500/40 bg-red-950/40' : 'text-[#F36F21] border-[#F36F21]/40 bg-orange-950/30',
      trend: 'Phi-3 Edge accelerated'
    },
    {
      label: 'AVG PACKET LOSS',
      value: `${currentTelemetry.packet_loss.toFixed(2)}%`,
      sub: 'Downlink frame drop rate',
      icon: Activity,
      accent: currentTelemetry.packet_loss > 3 ? 'text-red-400 border-red-500/40 bg-red-950/40' : 'text-emerald-400 border-emerald-500/30 bg-emerald-950/30',
      trend: '&lt; 0.05% FEC correction'
    },
    {
      label: 'RECENT ALERTS',
      value: '2 ACTIVE WARNS',
      sub: 'Autonomous self-healing active',
      icon: AlertTriangle,
      accent: 'text-amber-300 border-amber-500/40 bg-amber-950/40',
      trend: 'Standby failover ready'
    }
  ];

  return (
    <div className="rounded-2xl border border-slate-800/90 bg-[#050A19]/80 backdrop-blur-2xl p-5 sm:p-6 shadow-2xl h-full flex flex-col justify-between">
      <div>
        {/* Header */}
        <div className="flex items-center justify-between pb-4 mb-5 border-b border-slate-800/90">
          <div className="flex items-center gap-3">
            <div className="p-2.5 rounded-xl bg-gradient-to-br from-cyan-500/20 to-[#F36F21]/20 border border-cyan-500/40 shadow-[0_0_15px_rgba(0,240,255,0.15)]">
              <BarChart3 className="w-5 h-5 text-cyan-400" />
            </div>
            <div>
              <h3 className="font-extrabold text-base sm:text-lg text-white font-mono tracking-wider uppercase">
                ISRO Constellation Mission Statistics
              </h3>
              <p className="text-[11px] font-mono text-slate-400">
                Real-time orbital network aggregate telemetry metrics
              </p>
            </div>
          </div>

          <span className="text-[10px] font-mono bg-cyan-950/80 text-cyan-300 px-2.5 py-1 rounded border border-cyan-800/80 font-bold tracking-wider">
            LIVE AGGREGATE BUS
          </span>
        </div>

        {/* Bento Grid of Stats */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
          {stats.map((stat, i) => {
            const Icon = stat.icon;

            return (
              <div 
                key={i}
                className="rounded-xl border border-slate-800/90 bg-[#040814]/90 p-4 hover:border-slate-700 transition-all flex flex-col justify-between group shadow-lg relative overflow-hidden"
              >
                <div className="flex items-start justify-between gap-2 mb-3">
                  <span className="text-[11px] font-mono font-bold tracking-tight text-slate-400 uppercase">
                    {stat.label}
                  </span>
                  <div className={`p-2 rounded-lg border shrink-0 group-hover:scale-110 transition-transform ${stat.accent}`}>
                    <Icon className="w-4 h-4" />
                  </div>
                </div>

                <div>
                  <div className="text-xl sm:text-2xl font-extrabold font-mono text-white tracking-tight">
                    {stat.value}
                  </div>
                  <div className="flex items-center justify-between mt-2 pt-2 border-t border-slate-900/90 text-[10px] font-mono">
                    <span className="text-slate-500 truncate pr-1">
                      {stat.sub}
                    </span>
                    <span className="text-cyan-400/90 shrink-0 font-semibold">
                      {stat.trend}
                    </span>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      <div className="mt-6 pt-3 border-t border-slate-800/80 flex items-center justify-between text-[10px] font-mono text-slate-500">
        <span>AGENCY: <strong className="text-slate-300">INDIAN SPACE RESEARCH ORGANISATION (ISRO)</strong></span>
        <span>TELEMETRY STANDARD: <strong className="text-cyan-400">CCSDS PACKET PROTOCOL v4</strong></span>
      </div>
    </div>
  );
};
