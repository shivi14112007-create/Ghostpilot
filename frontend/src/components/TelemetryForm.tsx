import React, { useState } from 'react';
import { TelemetryData } from '../types';
import { Cpu, Activity, Zap, RotateCcw, Sparkles, Sliders, ShieldCheck, AlertTriangle, AlertOctagon } from 'lucide-react';

interface TelemetryFormProps {
  initialTelemetry: TelemetryData;
  onAnalyze: (telemetry: TelemetryData) => void;
  isAnalyzing: boolean;
}

export const TelemetryForm: React.FC<TelemetryFormProps> = ({
  initialTelemetry,
  onAnalyze,
  isAnalyzing,
}) => {
  const [telemetry, setTelemetry] = useState<TelemetryData>(initialTelemetry);

  React.useEffect(() => {
    setTelemetry(initialTelemetry);
  }, [initialTelemetry]);

  const handleChange = (field: keyof TelemetryData, numVal: number) => {
    setTelemetry((prev) => ({
      ...prev,
      [field]: isNaN(numVal) ? 0 : numVal,
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onAnalyze(telemetry);
  };

  const loadPreset = (preset: 'nominal' | 'warning' | 'critical') => {
    if (preset === 'nominal') {
      setTelemetry({ latency: 24, packet_loss: 0.2, cpu: 32 });
    } else if (preset === 'warning') {
      setTelemetry({ latency: 68, packet_loss: 3.2, cpu: 74 });
    } else {
      setTelemetry({ latency: 156, packet_loss: 9.4, cpu: 96 });
    }
  };

  // Helper to calculate status badge
  const getMetricStatus = (metric: 'latency' | 'loss' | 'cpu', val: number) => {
    if (metric === 'latency') {
      if (val < 50) return { label: 'NOMINAL', color: 'bg-emerald-500/15 text-emerald-400 border-emerald-500/30' };
      if (val < 100) return { label: 'WARNING', color: 'bg-amber-500/15 text-amber-400 border-amber-500/30 animate-pulse' };
      return { label: 'CRITICAL', color: 'bg-red-500/20 text-red-400 border-red-500/50 font-bold animate-bounce' };
    }
    if (metric === 'loss') {
      if (val < 1.0) return { label: 'NOMINAL', color: 'bg-emerald-500/15 text-emerald-400 border-emerald-500/30' };
      if (val < 5.0) return { label: 'WARNING', color: 'bg-amber-500/15 text-amber-400 border-amber-500/30 animate-pulse' };
      return { label: 'CRITICAL', color: 'bg-red-500/20 text-red-400 border-red-500/50 font-bold animate-bounce' };
    }
    // cpu
    if (val < 70) return { label: 'NOMINAL', color: 'bg-emerald-500/15 text-emerald-400 border-emerald-500/30' };
    if (val < 85) return { label: 'WARNING', color: 'bg-amber-500/15 text-amber-400 border-amber-500/30 animate-pulse' };
    return { label: 'CRITICAL', color: 'bg-red-500/20 text-red-400 border-red-500/50 font-bold animate-bounce' };
  };

  // Simple risk formula for display card
  const estimatedRisk = Math.min(
    100,
    Math.round((telemetry.latency / 200) * 40 + (telemetry.packet_loss / 10) * 40 + (telemetry.cpu / 100) * 20)
  );

  return (
    <div className="rounded-2xl border border-slate-800/90 bg-[#060D1F]/80 backdrop-blur-xl p-5 shadow-2xl flex flex-col justify-between h-full">
      <div>
        {/* Header */}
        <div className="flex items-center justify-between pb-3 mb-4 border-b border-slate-800/80">
          <div className="flex items-center gap-2.5">
            <div className="p-2 rounded-lg bg-[#F36F21]/20 text-[#F36F21] border border-[#F36F21]/30">
              <Sliders className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-bold text-sm text-white font-mono tracking-wider uppercase">
                Satellite Telemetry Relay Ingest
              </h3>
              <p className="text-[11px] text-slate-400 font-mono">
                Interactive X-band & Ka-band parameter simulation
              </p>
            </div>
          </div>
          <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-cyan-950/80 text-cyan-300 border border-cyan-800/60 font-semibold tracking-wider">
            TRANSPONDER #4
          </span>
        </div>

        {/* Preset Scenarios */}
        <div className="mb-4">
          <div className="flex items-center justify-between text-[11px] font-mono text-slate-400 uppercase tracking-wider mb-2">
            <span>⚡ INGESTION PRESETS:</span>
            <span className="text-cyan-400">SELECT SCENARIO</span>
          </div>
          <div className="grid grid-cols-3 gap-2">
            <button
              type="button"
              disabled={isAnalyzing}
              onClick={() => loadPreset('nominal')}
              className="px-2 py-1.5 rounded-xl bg-emerald-950/30 border border-emerald-800/50 hover:border-emerald-400 text-emerald-300 text-xs font-mono font-bold transition-all disabled:opacity-50 text-center cursor-pointer active:scale-95"
            >
              🟢 NOMINAL
            </button>
            <button
              type="button"
              disabled={isAnalyzing}
              onClick={() => loadPreset('warning')}
              className="px-2 py-1.5 rounded-xl bg-amber-950/30 border border-amber-800/50 hover:border-amber-400 text-amber-300 text-xs font-mono font-bold transition-all disabled:opacity-50 text-center cursor-pointer active:scale-95"
            >
              🟡 WARNING
            </button>
            <button
              type="button"
              disabled={isAnalyzing}
              onClick={() => loadPreset('critical')}
              className="px-2 py-1.5 rounded-xl bg-red-950/30 border border-red-800/50 hover:border-red-400 text-red-300 text-xs font-mono font-bold transition-all disabled:opacity-50 text-center cursor-pointer active:scale-95"
            >
              🔴 CRITICAL
            </button>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="space-y-3">
          {/* Telemetry Cards Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            
            {/* Card 1: Latency */}
            <div className="rounded-xl border border-slate-800/80 bg-[#040814] p-3.5 hover:border-cyan-500/40 transition-all">
              <div className="flex items-center justify-between mb-2">
                <span className="text-xs font-mono text-slate-300 font-bold flex items-center gap-1.5">
                  <Zap className="w-3.5 h-3.5 text-cyan-400" /> LATENCY
                </span>
                <span className={`text-[9px] font-mono font-bold px-1.5 py-0.5 rounded border ${getMetricStatus('latency', telemetry.latency).color}`}>
                  {getMetricStatus('latency', telemetry.latency).label}
                </span>
              </div>
              
              <div className="flex items-baseline justify-between my-2">
                <span className="text-2xl font-extrabold font-mono text-white">
                  {telemetry.latency} <span className="text-xs font-normal text-slate-500">ms</span>
                </span>
                <span className="text-[10px] font-mono text-slate-500 bg-slate-900/80 px-1.5 py-0.5 rounded">
                  Normal: &lt;50ms
                </span>
              </div>

              <input
                type="range"
                min="5"
                max="300"
                step="1"
                disabled={isAnalyzing}
                value={telemetry.latency}
                onChange={(e) => handleChange('latency', parseFloat(e.target.value))}
                className="w-full h-1.5 bg-slate-800 rounded-lg appearance-none cursor-pointer accent-cyan-400"
              />
            </div>

            {/* Card 2: Packet Loss */}
            <div className="rounded-xl border border-slate-800/80 bg-[#040814] p-3.5 hover:border-amber-500/40 transition-all">
              <div className="flex items-center justify-between mb-2">
                <span className="text-xs font-mono text-slate-300 font-bold flex items-center gap-1.5">
                  <Activity className="w-3.5 h-3.5 text-amber-400" /> PACKET LOSS
                </span>
                <span className={`text-[9px] font-mono font-bold px-1.5 py-0.5 rounded border ${getMetricStatus('loss', telemetry.packet_loss).color}`}>
                  {getMetricStatus('loss', telemetry.packet_loss).label}
                </span>
              </div>
              
              <div className="flex items-baseline justify-between my-2">
                <span className="text-2xl font-extrabold font-mono text-white">
                  {telemetry.packet_loss.toFixed(1)} <span className="text-xs font-normal text-slate-500">%</span>
                </span>
                <span className="text-[10px] font-mono text-slate-500 bg-slate-900/80 px-1.5 py-0.5 rounded">
                  Normal: &lt;1.0%
                </span>
              </div>

              <input
                type="range"
                min="0"
                max="25"
                step="0.1"
                disabled={isAnalyzing}
                value={telemetry.packet_loss}
                onChange={(e) => handleChange('packet_loss', parseFloat(e.target.value))}
                className="w-full h-1.5 bg-slate-800 rounded-lg appearance-none cursor-pointer accent-amber-400"
              />
            </div>

            {/* Card 3: CPU Usage */}
            <div className="rounded-xl border border-slate-800/80 bg-[#040814] p-3.5 hover:border-[#F36F21]/40 transition-all">
              <div className="flex items-center justify-between mb-2">
                <span className="text-xs font-mono text-slate-300 font-bold flex items-center gap-1.5">
                  <Cpu className="w-3.5 h-3.5 text-[#F36F21]" /> CPU USAGE
                </span>
                <span className={`text-[9px] font-mono font-bold px-1.5 py-0.5 rounded border ${getMetricStatus('cpu', telemetry.cpu).color}`}>
                  {getMetricStatus('cpu', telemetry.cpu).label}
                </span>
              </div>
              
              <div className="flex items-baseline justify-between my-2">
                <span className="text-2xl font-extrabold font-mono text-white">
                  {Math.round(telemetry.cpu)} <span className="text-xs font-normal text-slate-500">%</span>
                </span>
                <span className="text-[10px] font-mono text-slate-500 bg-slate-900/80 px-1.5 py-0.5 rounded">
                  Normal: &lt;70%
                </span>
              </div>

              <input
                type="range"
                min="10"
                max="100"
                step="1"
                disabled={isAnalyzing}
                value={telemetry.cpu}
                onChange={(e) => handleChange('cpu', parseFloat(e.target.value))}
                className="w-full h-1.5 bg-slate-800 rounded-lg appearance-none cursor-pointer accent-[#F36F21]"
              />
            </div>

            {/* Card 4: Live Predicted Risk Preview */}
            <div className="rounded-xl border border-cyan-500/30 bg-gradient-to-br from-cyan-950/20 to-[#040814] p-3.5 flex flex-col justify-between shadow-[0_0_15px_rgba(0,240,255,0.05)]">
              <div className="flex items-center justify-between mb-1">
                <span className="text-xs font-mono text-cyan-300 font-bold uppercase tracking-wider">
                  PREDICTED RISK PREVIEW
                </span>
                <span className="text-[9px] font-mono px-1.5 py-0.5 rounded bg-cyan-400/10 text-cyan-300 border border-cyan-400/30">
                  INSTANT FORECAST
                </span>
              </div>

              <div className="flex items-baseline justify-between my-2">
                <span className={`text-2xl font-extrabold font-mono ${estimatedRisk > 70 ? 'text-red-400 animate-pulse' : estimatedRisk > 30 ? 'text-amber-400' : 'text-emerald-400'}`}>
                  {estimatedRisk} <span className="text-xs font-normal opacity-80">%</span>
                </span>
                <span className="text-[10px] font-mono text-slate-400">
                  {estimatedRisk > 70 ? '⚠️ AUTO-FAILOVER TRIGGER' : estimatedRisk > 30 ? '🟡 MONITOR QUEUE' : '🟢 STABLE ORBITAL BUS'}
                </span>
              </div>

              <div className="w-full h-1.5 bg-slate-900 rounded-full overflow-hidden border border-slate-800">
                <div 
                  className={`h-full transition-all duration-300 ${estimatedRisk > 70 ? 'bg-red-500' : estimatedRisk > 30 ? 'bg-amber-400' : 'bg-emerald-400'}`} 
                  style={{ width: `${estimatedRisk}%` }}
                />
              </div>
            </div>

          </div>

          <div className="pt-3">
            <button
              type="submit"
              disabled={isAnalyzing}
              className="w-full relative group overflow-hidden rounded-xl bg-gradient-to-r from-[#F36F21] via-amber-500 to-cyan-500 p-[1px] font-bold shadow-[0_0_25px_rgba(243,111,33,0.3)] hover:shadow-[0_0_40px_rgba(0,240,255,0.4)] transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer active:scale-[0.98]"
            >
              <div className="flex items-center justify-center gap-2.5 rounded-xl bg-[#050A18]/90 py-3 px-6 transition-all duration-300 group-hover:bg-transparent text-white font-mono uppercase tracking-widest text-sm">
                {isAnalyzing ? (
                  <>
                    <RotateCcw className="w-4 h-4 animate-spin text-cyan-300" />
                    <span>EXECUTING PHI-3 DIAGNOSTIC...</span>
                  </>
                ) : (
                  <>
                    <Sparkles className="w-4 h-4 text-cyan-300 animate-pulse" />
                    <span>ANALYZE CONSTELLATION TELEMETRY</span>
                  </>
                )}
              </div>
            </button>
          </div>
        </form>
      </div>

      <div className="mt-4 pt-3 border-t border-slate-800/80 flex items-center justify-between text-[10px] font-mono text-slate-400">
        <span className="flex items-center gap-1"><ShieldCheck className="w-3 h-3 text-cyan-400" /> CLOSED-LOOP INGEST</span>
        <span>SAMPLING RATE: <strong className="text-cyan-300">1,000 Hz</strong></span>
      </div>
    </div>
  );
};

