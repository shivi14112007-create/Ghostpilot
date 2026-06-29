import React, { useState, useEffect, useRef } from 'react';
import { Terminal, Activity, ChevronRight, Filter, Play, Pause, Radio, ShieldAlert } from 'lucide-react';
import { NetworkStatusType } from '../types';

interface TerminalConsoleProps {
  networkStatus: NetworkStatusType;
  isAnalyzing: boolean;
}

interface LogEntry {
  id: string;
  time: string;
  type: 'FEED' | 'LOG';
  level: 'INFO' | 'WARNING' | 'CRITICAL';
  msg: string;
  source: string;
}

export const TerminalConsole: React.FC<TerminalConsoleProps> = ({ networkStatus, isAnalyzing }) => {
  const [activeView, setActiveView] = useState<'feed' | 'log'>('feed');
  const [isPaused, setIsPaused] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);

  // Seed initial logs
  const [logs, setLogs] = useState<LogEntry[]>([
    { id: '1', time: '23:41:00', type: 'FEED', level: 'INFO', msg: 'Telemetry Broadcast Received (Ka-Band Bus 4)', source: 'ISTRAC-BLR' },
    { id: '2', time: '23:41:01', type: 'FEED', level: 'INFO', msg: 'Deterministic Rule Engine Validation Passed', source: 'CORE-SW-1' },
    { id: '3', time: '23:41:03', type: 'FEED', level: 'INFO', msg: 'Phi-3 Edge Inference Started Pipeline', source: 'GHOSTPILOT' },
    { id: '4', time: '23:41:05', type: 'FEED', level: 'INFO', msg: 'Closed-Loop Prediction Report Synthesized', source: 'GHOSTPILOT' },
    { id: '5', time: '23:40:55', type: 'LOG', level: 'INFO', msg: 'System Downlink Transponder Synchronized at 4,820 pps', source: 'GSAT-7A' },
    { id: '6', time: '23:40:58', type: 'LOG', level: 'WARNING', msg: 'Queuing Latency Spiked to 42ms on Router Node 3', source: 'DSN-CORE' },
    { id: '7', time: '23:41:02', type: 'LOG', level: 'INFO', msg: 'Autonomous Route Optimization Matrix Computed', source: 'AI-NOC' }
  ]);

  // Append simulated events
  useEffect(() => {
    if (isPaused) return;

    const interval = setInterval(() => {
      const now = new Date();
      const timeStr = now.toTimeString().substring(0, 8);
      const isLog = Math.random() > 0.5;

      let level: 'INFO' | 'WARNING' | 'CRITICAL' = 'INFO';
      let msg = 'Routine orbital heartbeat frame processed';
      let source = 'GSAT-CONSTELLATION';

      if (networkStatus === 'Warning') {
        level = Math.random() > 0.3 ? 'WARNING' : 'INFO';
        msg = level === 'WARNING' ? 'Buffer saturation warning threshold (78%) reached on Sat-9' : 'Downlink frame FEC error corrected';
        source = 'DSN-ROUTER-B';
      } else if (networkStatus === 'Critical') {
        level = Math.random() > 0.4 ? 'CRITICAL' : 'WARNING';
        msg = level === 'CRITICAL' ? 'EMERGENCY: Packet drop limit exceeded! Re-routing via backup X-band link' : 'Link quality degradation alarm active';
        source = 'ISTRAC-LUCKNOW';
      } else if (isAnalyzing) {
        msg = 'AI Copilot analyzing multi-node topology state vector...';
        source = 'PHI-3-ENGINE';
      }

      const newEntry: LogEntry = {
        id: Math.random().toString(36).substring(7),
        time: timeStr,
        type: isLog ? 'LOG' : 'FEED',
        level,
        msg,
        source
      };

      setLogs((prev) => [...prev.slice(-40), newEntry]);
    }, 2500);

    return () => clearInterval(interval);
  }, [isPaused, networkStatus, isAnalyzing]);

  // Auto scroll
  useEffect(() => {
    if (scrollRef.current && !isPaused) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [logs, activeView, isPaused]);

  const filtered = logs.filter(l => activeView === 'feed' ? l.type === 'FEED' : l.type === 'LOG');

  return (
    <div className="rounded-2xl border border-slate-800/90 bg-[#040814]/90 backdrop-blur-xl p-4 sm:p-5 shadow-2xl flex flex-col h-full overflow-hidden font-mono text-xs">
      {/* Header controls */}
      <div className="flex flex-wrap items-center justify-between pb-3 mb-3 border-b border-slate-800/80 gap-2">
        <div className="flex items-center gap-3">
          <Terminal className="w-4 h-4 text-cyan-400 animate-pulse" />
          <div className="flex rounded-lg bg-slate-900/90 p-1 border border-slate-800">
            <button
              onClick={() => setActiveView('feed')}
              className={`px-3 py-1 rounded text-[11px] font-bold tracking-wider cursor-pointer transition-all ${
                activeView === 'feed' ? 'bg-cyan-400 text-slate-950 shadow-md' : 'text-slate-400 hover:text-white'
              }`}
            >
              LIVE TELEMETRY FEED
            </button>
            <button
              onClick={() => setActiveView('log')}
              className={`px-3 py-1 rounded text-[11px] font-bold tracking-wider cursor-pointer transition-all ${
                activeView === 'log' ? 'bg-[#F36F21] text-white shadow-md' : 'text-slate-400 hover:text-white'
              }`}
            >
              MISSION TERMINAL LOG
            </button>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => setIsPaused(!isPaused)}
            className="flex items-center gap-1.5 px-2.5 py-1 rounded bg-slate-900 border border-slate-800 text-slate-300 hover:text-white text-[10px] cursor-pointer"
          >
            {isPaused ? <Play className="w-3 h-3 text-emerald-400" /> : <Pause className="w-3 h-3 text-amber-400" />}
            <span>{isPaused ? 'RESUME STREAM' : 'PAUSE'}</span>
          </button>
          <span className="flex h-2 w-2 rounded-full bg-cyan-400 animate-ping" />
        </div>
      </div>

      {/* Scrollable Output Box */}
      <div 
        ref={scrollRef}
        className="flex-1 overflow-y-auto space-y-2 pr-1 scrollbar-thin scrollbar-thumb-slate-800 max-h-[260px] min-h-[180px]"
      >
        {filtered.map((item) => (
          <div 
            key={item.id}
            className="flex items-start gap-3 p-2 rounded-lg bg-slate-950/60 hover:bg-slate-900/60 border border-slate-900 transition-colors animate-fadeIn"
          >
            <span className="text-slate-500 shrink-0 select-none">
              {item.time}
            </span>

            {/* Level Badge */}
            <span className={`px-1.5 py-0.5 rounded text-[9px] font-extrabold uppercase shrink-0 ${
              item.level === 'INFO'
                ? 'bg-cyan-500/10 text-cyan-400 border border-cyan-500/30'
                : item.level === 'WARNING'
                ? 'bg-amber-500/15 text-amber-400 border border-amber-500/40 animate-pulse'
                : 'bg-red-500/20 text-red-400 border border-red-500/50 font-bold'
            }`}>
              [{item.level}]
            </span>

            <span className="text-slate-300 flex-1 break-all font-sans text-xs">
              {item.msg}
            </span>

            <span className="text-[10px] text-slate-600 shrink-0 hidden sm:inline">
              #{item.source}
            </span>
          </div>
        ))}
      </div>

      {/* Status Bar */}
      <div className="mt-3 pt-2.5 border-t border-slate-900 flex items-center justify-between text-[10px] text-slate-500">
        <span>STATUS: <strong className={isPaused ? "text-amber-400" : "text-emerald-400"}>{isPaused ? 'STREAM HOLD' : 'STREAMING LIVE'}</strong></span>
        <span>BUFFER: <strong className="text-slate-400">1024 KB</strong></span>
      </div>
    </div>
  );
};
