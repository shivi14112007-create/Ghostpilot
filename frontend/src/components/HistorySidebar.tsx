import React, { useState } from 'react';
import { AnalysisRun, SortOrder } from '../types';
import { History, Clock, ChevronRight, Search, ArrowUpDown, ShieldAlert, ShieldCheck } from 'lucide-react';
import { getStatusTextHex } from '../utils/helpers';

interface HistorySidebarProps {
  history: AnalysisRun[];
  selectedId: string;
  onSelectRun: (run: AnalysisRun) => void;
}

export const HistorySidebar: React.FC<HistorySidebarProps> = ({
  history,
  selectedId,
  onSelectRun,
}) => {
  const [search, setSearch] = useState('');
  const [sortOrder, setSortOrder] = useState<SortOrder>('newest');

  // Filter & Sort
  const filteredHistory = history
    .filter((run) => {
      if (!search.trim()) return true;
      const q = search.toLowerCase();
      return (
        run.id.toLowerCase().includes(q) ||
        run.network_status.toLowerCase().includes(q) ||
        run.reason.toLowerCase().includes(q)
      );
    })
    .sort((a, b) => {
      // Assuming IDs or timestamps can determine order
      const idA = parseInt(a.id) || 0;
      const idB = parseInt(b.id) || 0;
      return sortOrder === 'newest' ? idB - idA : idA - idB;
    });

  return (
    <aside className="rounded-2xl border border-slate-800/80 bg-[#0B132B]/60 backdrop-blur-md p-5 shadow-2xl flex flex-col h-full">
      <div className="flex items-center justify-between pb-3 mb-3 border-b border-slate-800">
        <div className="flex items-center gap-2.5">
          <div className="p-2 rounded-lg bg-cyan-500/10 text-cyan-400 border border-cyan-500/30">
            <History className="w-5 h-5" />
          </div>
          <div>
            <h3 className="font-bold text-base text-white font-mono tracking-wide uppercase">
              Inference Logs
            </h3>
            <p className="text-xs text-slate-400 font-sans">
              Recent telemetry predictions
            </p>
          </div>
        </div>
        <span className="text-xs font-mono bg-slate-900 px-2 py-0.5 rounded border border-slate-700 text-slate-300">
          {filteredHistory.length} / {history.length}
        </span>
      </div>

      {/* Search and Sort Toolbar */}
      <div className="flex flex-col gap-2 mb-3">
        <div className="relative">
          <Search className="w-3.5 h-3.5 text-slate-500 absolute left-3 top-2.5" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search run #, status, reason..."
            aria-label="Search inference logs"
            className="w-full pl-8 pr-3 py-1.5 rounded-xl bg-[#050814] border border-slate-800 text-xs text-slate-200 font-mono placeholder:text-slate-600 focus:outline-none focus:border-cyan-500/60 transition-all"
          />
          {search && (
            <button 
              onClick={() => setSearch('')}
              className="absolute right-2.5 top-2 text-[10px] text-slate-500 hover:text-slate-300 font-mono"
            >
              ✕
            </button>
          )}
        </div>

        <div className="flex items-center justify-between text-[11px] font-mono text-slate-400 px-1">
          <span className="flex items-center gap-1">
            <ArrowUpDown className="w-3 h-3 text-cyan-400" /> Sort:
          </span>
          <div className="flex bg-slate-950 rounded-lg p-0.5 border border-slate-800">
            <button
              type="button"
              onClick={() => setSortOrder('newest')}
              className={`px-2 py-0.5 rounded text-[10px] transition-all ${sortOrder === 'newest' ? 'bg-cyan-500/20 text-cyan-300 font-bold' : 'text-slate-500 hover:text-slate-300'}`}
            >
              Newest
            </button>
            <button
              type="button"
              onClick={() => setSortOrder('oldest')}
              className={`px-2 py-0.5 rounded text-[10px] transition-all ${sortOrder === 'oldest' ? 'bg-cyan-500/20 text-cyan-300 font-bold' : 'text-slate-500 hover:text-slate-300'}`}
            >
              Oldest
            </button>
          </div>
        </div>
      </div>

      {/* List */}
      <div className="flex-1 overflow-y-auto space-y-2 pr-1 max-h-[440px] lg:max-h-[580px] custom-scrollbar">
        {filteredHistory.length === 0 ? (
          <div className="p-8 text-center text-slate-500 font-mono text-xs">
            No telemetry records match your search query.
          </div>
        ) : (
          filteredHistory.map((run) => {
            const isSelected = run.id === selectedId;
            const statusHex = getStatusTextHex(run.network_status);
            const isHealthy = run.network_status === 'Healthy';

            return (
              <button
                key={run.id}
                type="button"
                onClick={() => onSelectRun(run)}
                className={`w-full text-left rounded-xl border p-3 transition-all duration-200 flex items-center justify-between group cursor-pointer ${
                  isSelected
                    ? 'bg-gradient-to-r from-cyan-950/80 to-[#050814] border-cyan-500/80 shadow-[0_0_15px_rgba(0,240,255,0.15)] scale-[1.01]'
                    : 'bg-[#050814]/60 border-slate-800/80 hover:border-slate-700 hover:bg-[#050814]'
                }`}
              >
                <div className="flex items-start gap-2.5 w-full">
                  {/* Small Status Icon */}
                  <div className="mt-0.5 shrink-0">
                    {isHealthy ? (
                      <ShieldCheck className="w-4 h-4 text-emerald-400" />
                    ) : (
                      <ShieldAlert className="w-4 h-4" style={{ color: statusHex }} />
                    )}
                  </div>

                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between mb-1 gap-1">
                      <span className="text-xs font-mono font-bold text-slate-200 truncate">
                        Run #{run.id}
                      </span>
                      <span 
                        className="text-[9px] font-mono px-1.5 py-0.5 rounded font-bold uppercase shrink-0"
                        style={{ color: statusHex, backgroundColor: `${statusHex}1A`, border: `1px solid ${statusHex}4D` }}
                      >
                        {run.network_status}
                      </span>
                    </div>

                    <div className="flex items-center justify-between text-[11px] font-mono text-slate-400">
                      <span className="flex items-center gap-1 text-[10px] text-slate-500">
                        <Clock className="w-2.5 h-2.5" />
                        {run.generated_at.split(' ')[1] || run.generated_at}
                      </span>
                      <span className="text-slate-300 font-semibold text-[11px]">
                        Risk: <span style={{ color: statusHex }}>{run.predicted_risk}%</span>
                      </span>
                    </div>
                  </div>
                </div>

                <ChevronRight className={`w-4 h-4 ml-1.5 transition-transform duration-200 shrink-0 ${isSelected ? 'text-cyan-400 translate-x-1' : 'text-slate-600 group-hover:text-slate-400'}`} />
              </button>
            );
          })
        )}
      </div>

      <div className="mt-3 pt-2.5 border-t border-slate-800/80 text-[10px] font-mono text-slate-500 text-center">
        CLICK ITEM TO INSTANTLY LOAD MISSION REPORT
      </div>
    </aside>
  );
};

