import React, { useState } from 'react';
import { AnalysisRun } from '../types';
import { 
  Rocket, 
  Activity, 
  Cpu, 
  ShieldCheck, 
  Clock, 
  ArrowRight, 
  Upload, 
  History, 
  Database,
  Sliders,
  CheckCircle,
  FileJson,
  AlertCircle,
  Radio,
  BarChart3,
  BrainCircuit,
  TrendingUp,
  FileText
} from 'lucide-react';
import { getStatusTextHex } from '../utils/helpers';

interface DashboardPageProps {
  currentRun: AnalysisRun;
  historyCount: number;
  onNavigate: (tab: any) => void;
  onLoadTelemetry: (telemetry: { latency: number; packet_loss: number; cpu: number }) => void;
}

export const DashboardPage: React.FC<DashboardPageProps> = ({
  currentRun,
  historyCount,
  onNavigate,
  onLoadTelemetry
}) => {
  const [jsonError, setJsonError] = useState<string | null>(null);
  const [jsonSuccess, setJsonSuccess] = useState<boolean>(false);

  const handleJsonUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    setJsonError(null);
    setJsonSuccess(false);
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      try {
        const text = event.target?.result as string;
        const data = JSON.parse(text);
        
        // Validation of fields
        const latency = typeof data.latency === 'number' ? data.latency : null;
        const packet_loss = typeof data.packet_loss === 'number' ? data.packet_loss : (typeof data.packetLoss === 'number' ? data.packetLoss : null);
        const cpu = typeof data.cpu === 'number' ? data.cpu : null;

        if (latency === null || packet_loss === null || cpu === null) {
          setJsonError("Invalid telemetry schema. JSON must contain numeric 'latency', 'packet_loss' and 'cpu'.");
          return;
        }

        // Successfully loaded
        onLoadTelemetry({ latency, packet_loss, cpu });
        setJsonSuccess(true);
        setTimeout(() => {
          setJsonSuccess(false);
          onNavigate('telemetry');
        }, 1500);

      } catch (err) {
        setJsonError("Unable to parse JSON file. Ensure file contains a valid JSON object.");
      }
    };
    reader.readAsText(file);
  };

  const statusColor = getStatusTextHex(currentRun.network_status);

  return (
    <div className="space-y-10 animate-fade-in max-w-[1300px] mx-auto font-sans">
      
      {/* 1. Welcome Section & Mission Overview */}
      <div className="relative overflow-hidden rounded-2xl border border-slate-800 bg-gradient-to-br from-[#0B132B]/60 to-[#050814]/80 backdrop-blur-xl p-6 sm:p-8 shadow-2xl">
        <div className="relative flex flex-col lg:flex-row items-start lg:items-center justify-between gap-6">
          <div className="space-y-3 max-w-3xl">
            <div className="flex flex-wrap items-center gap-2">
              <span className="text-[9px] font-mono font-bold uppercase tracking-widest text-[#F36F21] bg-[#F36F21]/10 border border-[#F36F21]/20 px-2.5 py-0.5 rounded shadow-[0_0_15px_rgba(243,111,33,0.1)]">
                ISRO Ground Control Segment
              </span>
              <span className="text-[9px] font-mono font-bold uppercase tracking-widest text-cyan-400 bg-cyan-950/40 border border-cyan-800/40 px-2.5 py-0.5 rounded shadow-[0_0_15px_rgba(6,182,212,0.1)]">
                Gaganyaan MCC Gateway
              </span>
            </div>
            
            <h1 className="text-xl sm:text-2xl font-bold tracking-tight text-white font-mono uppercase">
              GhostPilot Control System
            </h1>
            
            <p className="text-xs text-slate-400 leading-relaxed max-w-2xl">
              Predictive Ground Segment Network Management console powered by quantized local AI.
              GhostPilot optimizes spacecraft downlinks, telemetry buffers, and ground transponder allocations during active tracking passes.
            </p>
          </div>

          <div className="flex items-center gap-2 self-start lg:self-center">
            <label className="flex items-center gap-2 px-3.5 py-2 rounded-xl bg-slate-950 hover:bg-slate-900 border border-slate-800 text-slate-350 hover:text-white text-[10px] font-mono transition-all cursor-pointer select-none active:scale-95 shadow-md hover:border-cyan-500/30 shrink-0">
              <input 
                type="file" 
                accept=".json" 
                onChange={handleJsonUpload}
                className="hidden" 
              />
              <Upload className="w-3 h-3 text-cyan-400" />
              <span>LOAD TELEMETRY FILE</span>
            </label>
          </div>
        </div>

        {jsonError && (
          <div className="mt-4 p-3 rounded-xl border border-red-500/20 bg-red-950/20 text-red-450 text-xs flex items-center gap-2 animate-fade-in font-mono">
            <AlertCircle className="w-3.5 h-3.5 text-red-400 shrink-0" />
            <span>{jsonError}</span>
          </div>
        )}
        {jsonSuccess && (
          <div className="mt-4 p-3 rounded-xl border border-emerald-500/20 bg-emerald-950/20 text-emerald-400 text-xs flex items-center gap-2 animate-pulse font-mono">
            <CheckCircle className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
            <span>Inbound JSON ingested. Transferring to Telemetry Deck...</span>
          </div>
        )}
      </div>

      {/* 2. Current Status Summary Panel */}
      <div className="space-y-4">
        <h2 className="text-[10px] font-mono font-bold uppercase tracking-widest text-slate-500 border-l-2 border-[#F36F21] pl-2.5">
          CURRENT MISSION STATUS
        </h2>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          
          {/* Current System Status */}
          <div className="rounded-2xl border border-slate-800 bg-[#040814]/30 backdrop-blur-xl p-6 shadow-md flex items-center gap-5 hover:border-cyan-500/25 transition-all duration-300">
            <div className="p-3.5 rounded-xl bg-slate-950 border border-slate-900 text-cyan-400 shadow-inner">
              <Activity className="w-5 h-5 text-cyan-400" />
            </div>
            <div>
              <span className="text-[10px] font-mono text-slate-500 uppercase tracking-wider block">Network Status</span>
              <span className="text-base font-bold uppercase tracking-wide font-mono" style={{ color: statusColor }}>
                {currentRun.network_status}
              </span>
              <p className="text-[10px] text-slate-500 mt-0.5">X-band ground link condition</p>
            </div>
          </div>

          {/* Current Risk Score */}
          <div className="rounded-2xl border border-slate-800 bg-[#040814]/30 backdrop-blur-xl p-6 shadow-md flex flex-col justify-center hover:border-cyan-500/25 transition-all duration-300">
            <div className="flex items-center justify-between mb-2">
              <span className="text-[10px] font-mono text-slate-500 uppercase tracking-wider">Predictive Failure Risk</span>
              <span className="text-xs font-mono text-slate-300 font-semibold">{currentRun.predicted_risk}%</span>
            </div>
            <div className="flex items-center gap-3">
              <div className="flex-1 h-1.5 bg-slate-950 border border-slate-900 rounded-full overflow-hidden">
                <div 
                  className="h-full transition-all duration-700" 
                  style={{ width: `${currentRun.predicted_risk}%`, backgroundColor: statusColor }} 
                />
              </div>
              <span className="text-xs font-bold font-mono text-slate-300 shrink-0 uppercase">
                {currentRun.predicted_risk < 35 ? 'LOW' : currentRun.predicted_risk < 70 ? 'MODERATE' : 'CRITICAL'}
              </span>
            </div>
          </div>

          {/* Current AI Model Status */}
          <div className="rounded-2xl border border-slate-800 bg-[#040814]/30 backdrop-blur-xl p-6 shadow-md flex items-center gap-5 hover:border-cyan-500/25 transition-all duration-300">
            <div className="p-3.5 rounded-xl bg-slate-950 border border-slate-900 text-cyan-400 shadow-inner">
              <Cpu className="w-5 h-5 text-cyan-400" />
            </div>
            <div className="min-w-0">
              <span className="text-[10px] font-mono text-slate-500 uppercase tracking-wider block">AI Model Status</span>
              <span className="text-xs font-bold text-slate-200 font-mono block">
                Phi-3 Edge (Local)
              </span>
              <p className="text-[10px] text-emerald-550 mt-0.5 flex items-center gap-1">
                <span className="w-1 h-1 rounded-full bg-emerald-500 animate-pulse" /> Active ({currentRun.confidence}% conf)
              </p>
            </div>
          </div>

        </div>
      </div>

      {/* 3. Four Quick Action Cards */}
      <div className="space-y-4">
        <h2 className="text-[10px] font-mono font-bold uppercase tracking-widest text-slate-500 border-l-2 border-[#F36F21] pl-2.5">
          MISSION CONTROL QUICK ACTIONS
        </h2>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          
          {/* Action 1: Telemetry Controls */}
          <button 
            onClick={() => onNavigate('telemetry')}
            className="group relative overflow-hidden rounded-2xl border border-slate-800 bg-[#040814]/30 backdrop-blur-xl p-6 text-left transition-all duration-350 hover:border-cyan-500/35 hover:-translate-y-0.5 shadow-md hover:shadow-cyan-500/5 active:scale-[0.98] cursor-pointer"
          >
            <div className="flex items-center justify-between mb-4">
              <div className="p-2 rounded-lg bg-[#F36F21]/5 border border-[#F36F21]/15 text-[#F36F21] shadow-sm">
                <Sliders className="w-4 h-4" />
              </div>
              <ArrowRight className="w-3.5 h-3.5 text-slate-500 group-hover:translate-x-1 group-hover:text-[#F36F21] transition-all" />
            </div>
            <h3 className="font-bold text-xs text-slate-200 uppercase tracking-wider mb-1 font-mono">
              Telemetry Controls
            </h3>
            <p className="text-[11px] text-slate-500 leading-relaxed font-sans">
              Inject telemetry values manually & trigger local neural inference model.
            </p>
          </button>

          {/* Action 2: AI Analysis Verdict */}
          <button 
            onClick={() => onNavigate('analysis')}
            className="group relative overflow-hidden rounded-2xl border border-slate-800 bg-[#040814]/30 backdrop-blur-xl p-6 text-left transition-all duration-350 hover:border-cyan-500/35 hover:-translate-y-0.5 shadow-md hover:shadow-cyan-500/5 active:scale-[0.98] cursor-pointer"
          >
            <div className="flex items-center justify-between mb-4">
              <div className="p-2 rounded-lg bg-cyan-500/5 border border-cyan-500/15 text-cyan-400 shadow-sm">
                <BrainCircuit className="w-4 h-4" />
              </div>
              <ArrowRight className="w-3.5 h-3.5 text-slate-500 group-hover:translate-x-1 group-hover:text-cyan-400 transition-all" />
            </div>
            <h3 className="font-bold text-xs text-slate-200 uppercase tracking-wider mb-1 font-mono">
              AI Analysis Report
            </h3>
            <p className="text-[11px] text-slate-500 leading-relaxed font-sans">
              Review current neural node verdict, suggested actions, and impact assessments.
            </p>
          </button>

          {/* Action 3: Risk Forecasting */}
          <button 
            onClick={() => onNavigate('prediction')}
            className="group relative overflow-hidden rounded-2xl border border-slate-800 bg-[#040814]/30 backdrop-blur-xl p-6 text-left transition-all duration-350 hover:border-cyan-500/35 hover:-translate-y-0.5 shadow-md hover:shadow-cyan-500/5 active:scale-[0.98] cursor-pointer"
          >
            <div className="flex items-center justify-between mb-4">
              <div className="p-2 rounded-lg bg-amber-500/5 border border-amber-500/15 text-amber-400 shadow-sm">
                <TrendingUp className="w-4 h-4" />
              </div>
              <ArrowRight className="w-3.5 h-3.5 text-slate-500 group-hover:translate-x-1 group-hover:text-amber-400 transition-all" />
            </div>
            <h3 className="font-bold text-xs text-slate-200 uppercase tracking-wider mb-1 font-mono">
              Predictive ML Risk
            </h3>
            <p className="text-[11px] text-slate-500 leading-relaxed font-sans">
              Analyze statistical feature importance weights and temporal link trends.
            </p>
          </button>

          {/* Action 4: Analysis History Log */}
          <button 
            onClick={() => onNavigate('history')}
            className="group relative overflow-hidden rounded-2xl border border-slate-800 bg-[#040814]/30 backdrop-blur-xl p-6 text-left transition-all duration-350 hover:border-cyan-500/35 hover:-translate-y-0.5 shadow-md hover:shadow-cyan-500/5 active:scale-[0.98] cursor-pointer"
          >
            <div className="flex items-center justify-between mb-4">
              <div className="p-2 rounded-lg bg-emerald-500/5 border border-emerald-500/15 text-emerald-400 shadow-sm">
                <History className="w-4 h-4" />
              </div>
              <ArrowRight className="w-3.5 h-3.5 text-slate-500 group-hover:translate-x-1 group-hover:text-emerald-400 transition-all" />
            </div>
            <h3 className="font-bold text-xs text-slate-200 uppercase tracking-wider mb-1 font-mono">
              Inference History
            </h3>
            <p className="text-[11px] text-slate-500 leading-relaxed font-sans">
              Audit the registry of telemetry logs and prior neural conclusions.
            </p>
          </button>

        </div>
      </div>

    </div>
  );
};
