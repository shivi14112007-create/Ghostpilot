import React, { useState, useEffect } from 'react';
import { TelemetryData, NetworkStatusType } from '../types';
import { 
  Zap, 
  Activity, 
  Cpu, 
  ShieldCheck, 
  RotateCcw, 
  Sparkles, 
  Radio, 
  Gauge, 
  TrendingUp,
  AlertTriangle,
  AlertOctagon,
  ArrowRight
} from 'lucide-react';
import { getStatusTextHex } from '../utils/helpers';
import { MissionTopology } from './MissionTopology';

interface LiveTelemetryPageProps {
  initialTelemetry: TelemetryData;
  onAnalyze: (telemetry: TelemetryData) => void;
  isAnalyzing: boolean;
  networkStatus: NetworkStatusType;
}

export const LiveTelemetryPage: React.FC<LiveTelemetryPageProps> = ({
  initialTelemetry,
  onAnalyze,
  isAnalyzing,
  networkStatus
}) => {
  const [telemetry, setTelemetry] = useState<TelemetryData>(initialTelemetry);

  useEffect(() => {
    setTelemetry(initialTelemetry);
  }, [initialTelemetry]);

  const handleChange = (field: keyof TelemetryData, val: number) => {
    setTelemetry((prev) => ({
      ...prev,
      [field]: isNaN(val) ? 0 : val
    }));
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

  const handleExecuteAnalysis = () => {
    onAnalyze(telemetry);
  };

  // Metric status checks
  const getMetricLevel = (metric: 'latency' | 'loss' | 'cpu', val: number) => {
    if (metric === 'latency') {
      if (val < 50) return { label: 'NOMINAL', color: 'text-emerald-400 border-emerald-500/20 bg-emerald-500/5' };
      if (val < 100) return { label: 'WARNING', color: 'text-amber-400 border-amber-500/20 bg-amber-500/5' };
      return { label: 'CRITICAL', color: 'text-red-400 border-red-500/30 bg-red-500/10 font-bold' };
    }
    if (metric === 'loss') {
      if (val < 1.0) return { label: 'NOMINAL', color: 'text-emerald-400 border-emerald-500/20 bg-emerald-500/5' };
      if (val < 5.0) return { label: 'WARNING', color: 'text-amber-400 border-amber-500/20 bg-amber-500/5' };
      return { label: 'CRITICAL', color: 'text-red-400 border-red-500/30 bg-red-500/10 font-bold' };
    }
    // cpu
    if (val < 70) return { label: 'NOMINAL', color: 'text-emerald-400 border-emerald-500/20 bg-emerald-500/5' };
    if (val < 85) return { label: 'WARNING', color: 'text-amber-400 border-amber-500/20 bg-amber-500/5' };
    return { label: 'CRITICAL', color: 'text-red-400 border-red-500/30 bg-red-500/10 font-bold' };
  };

  // Instant local risk estimate
  const estimatedRisk = Math.min(
    100,
    Math.round((telemetry.latency / 200) * 40 + (telemetry.packet_loss / 10) * 40 + (telemetry.cpu / 100) * 20)
  );

  const getEstimatedStatus = (): NetworkStatusType => {
    if (telemetry.latency > 100 || telemetry.packet_loss > 5 || telemetry.cpu > 85) return 'Critical';
    if (telemetry.latency > 50 || telemetry.packet_loss > 2.5 || telemetry.cpu > 65) return 'Warning';
    return 'Healthy';
  };

  const estStatus = getEstimatedStatus();
  const estHex = getStatusTextHex(estStatus);

  return (
    <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 animate-fadeIn font-mono">
      {/* LEFT COLUMN: Controls & Sliders (Col span 5) */}
      <div className="lg:col-span-5 space-y-6 flex flex-col justify-between">
        <div className="rounded-xl border border-slate-850 bg-[#111827] p-6 shadow-sm flex flex-col justify-between h-full space-y-6">
          
          {/* Header */}
          <div className="flex items-center justify-between pb-4 border-b border-slate-800">
            <div className="flex items-center gap-2.5">
              <div className="p-2 rounded-lg bg-slate-900 border border-slate-800 text-blue-500">
                <Radio className="w-5 h-5" />
              </div>
              <div>
                <h3 className="font-bold text-xs sm:text-sm text-white uppercase tracking-wider">
                  Telemetry Control Cockpit
                </h3>
                <p className="text-[10px] text-slate-500">
                  Simulate transponder & router packet attributes
                </p>
              </div>
            </div>
            <span className="text-[9px] px-2 py-0.5 rounded bg-slate-900 text-slate-400 border border-slate-800 font-bold tracking-widest">
              X-BAND
            </span>
          </div>

          {/* Scenario Ingestion Presets */}
          <div className="space-y-2">
            <div className="flex items-center justify-between text-[10px] text-slate-500 uppercase tracking-widest">
              <span>⚡ SCENARIO PRESETS</span>
              <span className="text-blue-500">CLICK TO LOAD</span>
            </div>
            <div className="grid grid-cols-3 gap-2">
              <button
                type="button"
                disabled={isAnalyzing}
                onClick={() => loadPreset('nominal')}
                className="px-2 py-1.5 rounded-lg bg-slate-900 border border-slate-800 hover:border-emerald-500/50 hover:bg-emerald-950/20 text-slate-350 text-[10px] font-medium transition-all disabled:opacity-50 text-center cursor-pointer"
              >
                🟢 NOMINAL
              </button>
              <button
                type="button"
                disabled={isAnalyzing}
                onClick={() => loadPreset('warning')}
                className="px-2 py-1.5 rounded-lg bg-slate-900 border border-slate-800 hover:border-amber-500/50 hover:bg-amber-950/20 text-slate-350 text-[10px] font-medium transition-all disabled:opacity-50 text-center cursor-pointer"
              >
                🟡 WARNING
              </button>
              <button
                type="button"
                disabled={isAnalyzing}
                onClick={() => loadPreset('critical')}
                className="px-2 py-1.5 rounded-lg bg-slate-900 border border-slate-800 hover:border-red-500/50 hover:bg-red-950/20 text-slate-355 text-[10px] font-medium transition-all disabled:opacity-50 text-center cursor-pointer"
              >
                🔴 CRITICAL
              </button>
            </div>
          </div>

          {/* Sliders Area */}
          <div className="space-y-4">
            {/* Slider 1: Latency */}
            <div className="rounded-xl border border-slate-800 bg-slate-900/60 p-4 hover:border-blue-500/30 transition-all">
              <div className="flex items-center justify-between mb-1.5">
                <span className="text-xs text-slate-300 font-bold flex items-center gap-1.5">
                  <Zap className="w-3.5 h-3.5 text-blue-550" /> LATENCY
                </span>
                <span className={`text-[9px] font-bold px-1.5 py-0.5 rounded border ${getMetricLevel('latency', telemetry.latency).color}`}>
                  {getMetricLevel('latency', telemetry.latency).label}
                </span>
              </div>
              <div className="flex items-baseline justify-between my-1">
                <span className="text-xl font-bold text-white">
                  {telemetry.latency} <span className="text-xs font-normal text-slate-500">ms</span>
                </span>
                <span className="text-[9px] text-slate-500">
                  Limit: 100ms
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
                className="w-full h-1 bg-slate-850 rounded-lg appearance-none cursor-pointer accent-blue-600"
              />
            </div>

            {/* Slider 2: Packet Loss */}
            <div className="rounded-xl border border-slate-800 bg-slate-900/60 p-4 hover:border-blue-500/30 transition-all">
              <div className="flex items-center justify-between mb-1.5">
                <span className="text-xs text-slate-300 font-bold flex items-center gap-1.5">
                  <Activity className="w-3.5 h-3.5 text-blue-555" /> PACKET LOSS
                </span>
                <span className={`text-[9px] font-bold px-1.5 py-0.5 rounded border ${getMetricLevel('loss', telemetry.packet_loss).color}`}>
                  {getMetricLevel('loss', telemetry.packet_loss).label}
                </span>
              </div>
              <div className="flex items-baseline justify-between my-1">
                <span className="text-xl font-bold text-white">
                  {telemetry.packet_loss.toFixed(1)} <span className="text-xs font-normal text-slate-500">%</span>
                </span>
                <span className="text-[9px] text-slate-500">
                  Limit: 2.5%
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
                className="w-full h-1 bg-slate-850 rounded-lg appearance-none cursor-pointer accent-blue-600"
              />
            </div>

            {/* Slider 3: CPU Usage */}
            <div className="rounded-xl border border-slate-800 bg-slate-900/60 p-4 hover:border-blue-500/30 transition-all">
              <div className="flex items-center justify-between mb-1.5">
                <span className="text-xs text-slate-300 font-bold flex items-center gap-1.5">
                  <Cpu className="w-3.5 h-3.5 text-blue-550" /> CPU UTILIZATION
                </span>
                <span className={`text-[9px] font-bold px-1.5 py-0.5 rounded border ${getMetricLevel('cpu', telemetry.cpu).color}`}>
                  {getMetricLevel('cpu', telemetry.cpu).label}
                </span>
              </div>
              <div className="flex items-baseline justify-between my-1">
                <span className="text-xl font-bold text-white">
                  {Math.round(telemetry.cpu)} <span className="text-xs font-normal text-slate-500">%</span>
                </span>
                <span className="text-[9px] text-slate-500">
                  Limit: 65%
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
                className="w-full h-1 bg-slate-850 rounded-lg appearance-none cursor-pointer accent-blue-600"
              />
            </div>
          </div>

          {/* Submit Trigger Block */}
          <div className="pt-2">
            <button
              onClick={handleExecuteAnalysis}
              disabled={isAnalyzing}
              className="w-full py-3 px-4 rounded-xl font-bold bg-blue-600 text-white font-mono uppercase tracking-widest text-xs transition-all duration-250 disabled:opacity-50 disabled:cursor-not-allowed hover:bg-blue-700 active:scale-[0.98] cursor-pointer shadow-sm flex items-center justify-center gap-2"
            >
              {isAnalyzing ? (
                <>
                  <RotateCcw className="w-4 h-4 animate-spin text-white" />
                  <span>Inference In Progress...</span>
                </>
              ) : (
                <>
                  <Sparkles className="w-4 h-4 text-white" />
                  <span>Analyze using GhostPilot</span>
                </>
              )}
            </button>
          </div>

        </div>
      </div>

      {/* RIGHT COLUMN: Output Telemetry Grid and Topology (Col span 7) */}
      <div className="lg:col-span-7 space-y-6">
        
        {/* Metric Cards Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
          
          {/* Card 1: Latency */}
          <div className="rounded-xl border border-slate-850 bg-[#111827] p-5 relative transition-all duration-300">
            <div className="flex items-center justify-between mb-2">
              <span className="text-[10px] text-slate-500 uppercase tracking-widest font-bold">LATENCY</span>
              <Zap className="w-4 h-4 text-blue-500" />
            </div>
            <div className="text-xl font-bold text-white font-mono">
              {telemetry.latency} <span className="text-xs text-slate-500 font-normal">ms</span>
            </div>
            <div className="mt-2 text-[9px] text-slate-500">
              Downlink payload round-trip
            </div>
          </div>

          {/* Card 2: Packet Loss */}
          <div className="rounded-xl border border-slate-850 bg-[#111827] p-5 relative transition-all duration-300">
            <div className="flex items-center justify-between mb-2">
              <span className="text-[10px] text-slate-500 uppercase tracking-widest font-bold">PACKET LOSS</span>
              <Activity className="w-4 h-4 text-slate-400" />
            </div>
            <div className="text-xl font-bold text-white font-mono">
              {telemetry.packet_loss.toFixed(1)} <span className="text-xs text-slate-500 font-normal">%</span>
            </div>
            <div className="mt-2 text-[9px] text-slate-500">
              X-band frame drop rate
            </div>
          </div>

          {/* Card 3: CPU Usage */}
          <div className="rounded-xl border border-slate-850 bg-[#111827] p-5 relative transition-all duration-300">
            <div className="flex items-center justify-between mb-2">
              <span className="text-[10px] text-slate-500 uppercase tracking-widest font-bold">CPU UTIL</span>
              <Cpu className="w-4 h-4 text-blue-550" />
            </div>
            <div className="text-xl font-bold text-white font-mono">
              {Math.round(telemetry.cpu)} <span className="text-xs text-slate-500 font-normal">%</span>
            </div>
            <div className="mt-2 text-[9px] text-slate-500">
              Model thread allocation
            </div>
          </div>

          {/* Card 4: Estimated Risk */}
          <div className="rounded-xl border border-slate-850 bg-[#111827] p-5 relative transition-all duration-300">
            <div className="flex items-center justify-between mb-2">
              <span className="text-[10px] text-slate-500 uppercase tracking-widest font-bold">EST. RISK</span>
              <Gauge className="w-4 h-4 text-blue-500" />
            </div>
            <div className="text-xl font-bold font-mono text-slate-200">
              {estimatedRisk} <span className="text-xs text-slate-500 font-normal">%</span>
            </div>
            <div className="mt-2 text-[9px] text-slate-500">
              Interactive prediction value
            </div>
          </div>

          {/* Card 5: Estimated Status */}
          <div className="rounded-xl border border-slate-850 bg-[#111827] p-5 relative transition-all duration-300">
            <div className="flex items-center justify-between mb-2">
              <span className="text-[10px] text-slate-500 uppercase tracking-widest font-bold">EST. STATUS</span>
              <Radio className="w-4 h-4 text-blue-500" />
            </div>
            <div className="text-base font-bold uppercase font-mono" style={{ color: estHex }}>
              {estStatus}
            </div>
            <div className="mt-2.5 text-[9px] text-slate-500">
              Interactive rule evaluation
            </div>
          </div>

          {/* Card 6: Ground Station */}
          <div className="rounded-xl border border-slate-850 bg-[#111827] p-5 relative transition-all duration-300">
            <div className="flex items-center justify-between mb-2">
              <span className="text-[10px] text-slate-500 uppercase tracking-widest font-bold">GROUND LINK</span>
              <ShieldCheck className="w-4 h-4 text-slate-400" />
            </div>
            <div className="text-base font-bold text-slate-300 font-mono">
              ISTRAC BLR
            </div>
            <div className="mt-2.5 text-[9px] text-slate-500 font-mono">
              CONSTELLATION SECURE
            </div>
          </div>

        </div>

        {/* Constellation Network Topology Visualizer */}
        <div className="h-[320px] md:h-[400px]">
          <MissionTopology networkStatus={estStatus} />
        </div>

      </div>
    </div>
  );
};
