import React, { useState } from 'react';
import { AnalysisRun, NetworkStatusType } from '../types';
import { 
  History, 
  Search, 
  Filter, 
  ArrowRight, 
  Calendar, 
  Cpu, 
  Activity, 
  Trash2,
  FileCheck,
  AlertTriangle,
  AlertOctagon,
  Clock
} from 'lucide-react';
import { getStatusTextHex } from '../utils/helpers';

interface AnalysisHistoryPageProps {
  history: AnalysisRun[];
  selectedId: string;
  onSelectRun: (run: AnalysisRun) => void;
  onNavigate: (tab: any) => void;
}

export const AnalysisHistoryPage: React.FC<AnalysisHistoryPageProps> = ({
  history,
  selectedId,
  onSelectRun,
  onNavigate
}) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<'ALL' | NetworkStatusType>('ALL');

  // Filter history runs
  const filteredHistory = history.filter((run) => {
    const matchesSearch = 
      run.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
      run.summary.toLowerCase().includes(searchTerm.toLowerCase()) ||
      run.reason.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesStatus = statusFilter === 'ALL' || run.network_status === statusFilter;

    return matchesSearch && matchesStatus;
  });

  const getStatusIcon = (status: NetworkStatusType) => {
    const color = getStatusTextHex(status);
    if (status === 'Healthy') {
      return <FileCheck className="w-4 h-4 text-emerald-400" />;
    } else if (status === 'Warning') {
      return <AlertTriangle className="w-4 h-4 text-amber-400" />;
    } else {
      return <AlertOctagon className="w-4 h-4 text-red-400" />;
    }
  };

  return (
    <div className="space-y-6 animate-fadeIn font-sans">
      
      {/* Title */}
      <div className="rounded-xl border border-slate-855 bg-[#111827] p-6 shadow-sm flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="p-2.5 rounded-lg bg-slate-900 border border-slate-800 text-blue-500">
            <History className="w-5 h-5" />
          </div>
          <div>
            <h2 className="text-sm sm:text-base font-bold text-white tracking-wider uppercase font-mono">
              Analysis History Log
            </h2>
            <p className="text-xs text-slate-500 mt-0.5 font-mono">
              Audit trails and cached local neural network inferences
            </p>
          </div>
        </div>
        <div className="flex items-center gap-2 font-mono text-[10px] text-slate-500">
          <span>REGISTRY COUNT:</span>
          <span className="px-3 py-1 rounded bg-slate-900 border border-slate-800 font-bold text-slate-350">
            {history.length} RECORDS
          </span>
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="grid grid-cols-1 md:grid-cols-12 gap-4 items-center">
        {/* Search */}
        <div className="md:col-span-6 relative">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
          <input
            type="text"
            placeholder="Search by ID, summary, or reason..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-11 pr-4 py-3 bg-[#111827] border border-slate-800 hover:border-slate-700 focus:border-blue-600/60 focus:outline-none rounded-lg text-xs font-mono text-slate-200 placeholder-slate-500 transition-all shadow-sm"
          />
        </div>

        {/* Status Filters */}
        <div className="md:col-span-6 flex flex-wrap gap-2 md:justify-end">
          {(['ALL', 'Healthy', 'Warning', 'Critical'] as const).map((filter) => {
            const isActive = statusFilter === filter;
            return (
              <button
                key={filter}
                onClick={() => setStatusFilter(filter)}
                className={`px-3 py-2 rounded-lg text-[10px] font-bold font-mono tracking-wider transition-all cursor-pointer active:scale-95 ${
                  isActive 
                    ? 'bg-blue-600 text-white' 
                    : 'bg-slate-900 hover:bg-slate-800 border border-slate-800 text-slate-400 hover:text-slate-300'
                }`}
              >
                {filter.toUpperCase()}
              </button>
            );
          })}
        </div>
      </div>

      {/* Table/List view of runs */}
      <div className="rounded-xl border border-slate-850 bg-[#111827] overflow-hidden shadow-sm">
        {filteredHistory.length > 0 ? (
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse font-mono">
              <thead>
                <tr className="border-b border-slate-800 text-[10px] text-slate-500 uppercase tracking-widest bg-slate-900/40">
                  <th className="py-4 px-6 font-bold">Inference ID</th>
                  <th className="py-4 px-6 font-bold">Timestamp</th>
                  <th className="py-4 px-6 font-bold">Status</th>
                  <th className="py-4 px-6 font-bold">Telemetry Params</th>
                  <th className="py-4 px-6 font-bold">Summary Verdict</th>
                  <th className="py-4 px-6 text-right font-bold">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800/40 text-xs text-slate-300">
                {filteredHistory.map((run) => {
                  const isSelected = run.id === selectedId;
                  const statusColor = getStatusTextHex(run.network_status);
                  
                  return (
                    <tr 
                      key={run.id}
                      className={`hover:bg-slate-900/40 transition-all ${
                        isSelected ? 'bg-slate-900/30' : ''
                      }`}
                    >
                      {/* ID */}
                      <td className="py-4 px-6 font-bold text-blue-500">
                        #{run.id}
                      </td>

                      {/* Timestamp */}
                      <td className="py-4 px-6 text-slate-400 font-mono text-[10px]">
                        <span className="flex items-center gap-1.5">
                          <Clock className="w-3 h-3 text-slate-500" />
                          {run.generated_at}
                        </span>
                      </td>

                      {/* Status */}
                      <td className="py-4 px-6">
                        <span 
                          className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full border text-[9px] font-bold uppercase tracking-wider bg-slate-900/80"
                          style={{ borderColor: `${statusColor}20`, color: statusColor }}
                        >
                          <span className="w-1.5 h-1.5 rounded-full" style={{ backgroundColor: statusColor }} />
                          {run.network_status}
                        </span>
                      </td>

                      {/* Telemetry Params */}
                      <td className="py-4 px-6 text-[10px] text-slate-400">
                        <span>{run.telemetry.latency}ms</span> • <span>{run.telemetry.packet_loss}% loss</span> • <span>{Math.round(run.telemetry.cpu)}% cpu</span>
                      </td>

                      {/* Summary */}
                      <td className="py-4 px-6 max-w-xs font-sans truncate text-slate-400 text-xs">
                        {run.summary}
                      </td>

                      {/* Action trigger */}
                      <td className="py-4 px-6 text-right">
                        <button
                          onClick={() => {
                            onSelectRun(run);
                            onNavigate('analysis');
                          }}
                          className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-[10px] font-bold uppercase tracking-wider transition-all cursor-pointer active:scale-95 ${
                            isSelected
                              ? 'bg-blue-600 text-white'
                              : 'bg-slate-900 hover:bg-slate-800 border border-slate-800 text-slate-400 hover:text-white'
                          }`}
                        >
                          <span>Review</span>
                          <ArrowRight className="w-3 h-3" />
                        </button>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        ) : (
          /* Empty state */
          <div className="py-16 text-center">
            <History className="w-10 h-10 text-slate-600 mx-auto mb-4" />
            <div className="text-xs font-bold text-slate-400 uppercase tracking-widest font-mono">
              No telemetry runs matched search query
            </div>
            <p className="text-xs text-slate-500 font-sans mt-1.5 max-w-sm mx-auto">
              Clear your filters or head to Telemetry Control to simulate and record a new downlink packet sequence.
            </p>
            <button
              onClick={() => onNavigate('telemetry')}
              className="mt-5 inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-blue-600 hover:bg-blue-500 text-white font-bold text-[10px] font-mono uppercase tracking-wider transition-all cursor-pointer"
            >
              <span>Go to Telemetry</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>
        )}
      </div>

    </div>
  );
};
