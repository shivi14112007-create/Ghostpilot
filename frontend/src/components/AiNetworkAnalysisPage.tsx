import React, { useState, useEffect } from 'react';
import { AnalysisRun } from '../types';
import { 
  Terminal, 
  Cpu, 
  Clock, 
  FileText, 
  SearchCode, 
  AlertOctagon, 
  CheckCircle2, 
  Copy, 
  Check, 
  ChevronDown, 
  ChevronUp, 
  ShieldCheck, 
  Activity,
  Award
} from 'lucide-react';
import { getStatusTextHex } from '../utils/helpers';

interface AiNetworkAnalysisPageProps {
  analysis: AnalysisRun;
  isAnalyzing: boolean;
}

interface ExpandableSectionCardProps {
  icon: React.ReactNode;
  heading: string;
  content: string | React.ReactNode;
  borderColorClass?: string;
  leftBorderClass?: string;
  bgGlowClass?: string;
}

const ExpandableSectionCard: React.FC<ExpandableSectionCardProps> = ({
  icon,
  heading,
  content,
  borderColorClass = 'border-slate-850',
  leftBorderClass = 'border-l-4 border-l-blue-600',
  bgGlowClass = 'bg-[#111827]'
}) => {
  const [copied, setCopied] = useState(false);
  const [isCollapsed, setIsCollapsed] = useState(false);

  const handleCopy = () => {
    if (typeof content === 'string') {
      navigator.clipboard.writeText(content);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  return (
    <div className={`rounded-xl border ${leftBorderClass} ${bgGlowClass} p-5 transition-all duration-300 shadow-sm ${borderColorClass} group`}>
      <div className="flex items-center justify-between pb-3 mb-2 border-b border-slate-800">
        <div className="flex items-center gap-2.5">
          <div className="p-2 rounded-lg bg-slate-900 border border-slate-800 text-slate-400">
            {icon}
          </div>
          <h4 className="font-bold font-mono text-xs sm:text-sm tracking-wider uppercase text-slate-100">
            {heading}
          </h4>
        </div>

        <div className="flex items-center gap-1.5">
          {typeof content === 'string' && (
            <button
              onClick={handleCopy}
              title="Copy section content"
              className="text-slate-500 hover:text-blue-500 transition-colors p-1.5 rounded bg-slate-900 border border-slate-850 cursor-pointer"
            >
              {copied ? <Check className="w-3.5 h-3.5 text-emerald-500" /> : <Copy className="w-3.5 h-3.5" />}
            </button>
          )}
          <button
            onClick={() => setIsCollapsed(!isCollapsed)}
            title={isCollapsed ? "Expand section" : "Collapse section"}
            className="text-slate-500 hover:text-white transition-colors p-1.5 rounded bg-slate-900 border border-slate-850 cursor-pointer"
          >
            {isCollapsed ? <ChevronDown className="w-3.5 h-3.5" /> : <ChevronUp className="w-3.5 h-3.5" />}
          </button>
        </div>
      </div>

      {!isCollapsed && (
        <div className="text-xs sm:text-sm font-sans text-slate-300 leading-relaxed tracking-wide pt-1 animate-fadeIn">
          {typeof content === 'string' ? (
            <div className="whitespace-pre-line max-h-56 overflow-y-auto pr-2 custom-scrollbar">
              {content}
            </div>
          ) : (
            content
          )}
        </div>
      )}
    </div>
  );
};

export const AiNetworkAnalysisPage: React.FC<AiNetworkAnalysisPageProps> = ({
  analysis,
  isAnalyzing
}) => {
  const [checkedItems, setCheckedItems] = useState<Record<number, boolean>>({});

  useEffect(() => {
    // Reset checks on run change
    setCheckedItems({});
  }, [analysis.id]);

  const toggleCheck = (idx: number) => {
    setCheckedItems((prev) => ({ ...prev, [idx]: !prev[idx] }));
  };

  const actionLines = analysis.recommended_actions
    .split('\n')
    .map((line) => line.replace(/^[-\d.]+\s*/, '').trim())
    .filter(Boolean);

  const renderActionsChecklist = () => (
    <div className="space-y-2.5 max-h-60 overflow-y-auto pr-1">
      {actionLines.map((action, idx) => {
        const isDone = !!checkedItems[idx];
        const priority = idx === 0 ? 'P0' : idx === 1 ? 'P1' : 'P2';
        const badgeColor = priority === 'P0' 
          ? 'bg-red-500/20 text-red-300 border-red-500/50 animate-pulse' 
          : priority === 'P1' 
          ? 'bg-amber-500/20 text-amber-300 border-amber-500/50' 
          : 'bg-cyan-500/20 text-cyan-300 border-cyan-500/50';

        return (
          <div 
            key={idx}
            onClick={() => toggleCheck(idx)}
            className={`flex items-start gap-3 p-3 rounded-xl border cursor-pointer transition-all ${
              isDone 
                ? 'bg-emerald-950/20 border-emerald-800/40 opacity-70 shadow-inner' 
                : 'bg-slate-950/80 border-slate-800/90 hover:border-emerald-500/50'
            }`}
          >
            <div className={`mt-0.5 w-4 h-4 rounded flex items-center justify-center border shrink-0 transition-all ${
              isDone ? 'bg-emerald-500 border-emerald-400 text-slate-950 scale-95' : 'border-slate-700 bg-slate-900'
            }`}>
              {isDone && <Check className="w-3 h-3 font-bold" />}
            </div>

            <span className={`text-[9px] font-mono font-bold px-1.5 py-0.5 rounded border uppercase shrink-0 ${badgeColor}`}>
              {priority}
            </span>

            <span className={`text-xs font-mono transition-colors flex-1 leading-snug ${isDone ? 'line-through text-slate-500' : 'text-slate-200'}`}>
              {action}
            </span>
          </div>
        );
      })}
    </div>
  );

  const statusColor = getStatusTextHex(analysis.network_status);
  const confidence = analysis.confidence ?? 97.4;

  return (
    <div className="space-y-6 animate-fadeIn font-mono">
      {/* Header Info Banner */}
      <div className="rounded-xl border border-slate-850 bg-[#111827] p-6 shadow-sm flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 relative overflow-hidden">
        <div className="absolute top-0 left-0 bottom-0 w-[4px]" style={{ backgroundColor: statusColor }} />
        
        <div className="flex items-center gap-4">
          <div className="p-3 rounded-xl bg-slate-900 border border-slate-800 text-slate-300">
            <Terminal className="w-6 h-6" />
          </div>
          <div>
            <div className="flex flex-wrap items-center gap-2">
              <h2 className="text-base sm:text-lg font-bold text-white tracking-wider uppercase">
                AI CO-PILOT INFERENCE DECK
              </h2>
              <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-slate-900 text-slate-400 border border-slate-800">
                {analysis.model}
              </span>
            </div>
            <p className="text-[10px] text-slate-500 mt-1 uppercase">
              REPORTS CACHED LOCAL ON DISK • GENERATED AT {analysis.generated_at}
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2 self-end sm:self-center">
          <span className="text-[10px] text-slate-500">INFERENCE ID:</span>
          <span className="px-3 py-1 rounded bg-slate-900 border border-slate-800 font-mono text-xs font-bold text-slate-300">
            #{analysis.id}
          </span>
        </div>
      </div>

      {/* Model Confidence Meter */}
      <div className="rounded-xl border border-slate-850 bg-[#111827] p-6 shadow-sm">
        <div className="flex flex-wrap items-center justify-between gap-2 text-xs font-mono mb-3">
          <span className="text-slate-400 flex items-center gap-2 font-bold">
            <Activity className="w-4 h-4 text-blue-500" /> PHI-3 INFERENCE CONFIDENCE INDEX
          </span>
          <span className="text-slate-300 font-extrabold text-sm">{confidence}%</span>
        </div>
        <div className="w-full h-2 bg-slate-900 rounded-full overflow-hidden border border-slate-800">
          <div 
            className="h-full bg-blue-600 transition-all duration-1000"
            style={{ width: `${confidence}%` }}
          />
        </div>
      </div>

      {/* Executive Summary Card (Full Width) */}
      <div>
        <ExpandableSectionCard
          icon={<FileText className="w-4 h-4 text-blue-550" />}
          heading="Executive Summary"
          content={analysis.summary}
          borderColorClass="border-slate-850"
          leftBorderClass="border-l-4 border-l-blue-600"
          bgGlowClass="bg-[#111827]"
        />
      </div>

      {/* Expandable Core Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        
        {/* Network status details */}
        <div className="rounded-xl border border-slate-850 bg-[#111827] p-6 shadow-sm flex flex-col justify-between">
          <div className="flex items-center justify-between pb-3 mb-2 border-b border-slate-800">
            <span className="text-xs text-slate-400 uppercase tracking-widest font-bold">Inference Verdict</span>
            <Award className="w-4 h-4 text-blue-500" />
          </div>
          <div className="mt-2 space-y-3">
            <div className="flex items-center gap-2">
              <span className="inline-block w-2.5 h-2.5 rounded-full" style={{ backgroundColor: statusColor }} />
              <span className="text-xl font-bold uppercase tracking-wider" style={{ color: statusColor }}>
                {analysis.network_status}
              </span>
            </div>
            <p className="text-xs text-slate-400 font-sans leading-relaxed">
              Ground Segment dynamic routing rules determined this telemetry run falls into the <strong style={{ color: statusColor }}>{analysis.network_status}</strong> condition thresholds.
            </p>
          </div>
        </div>

        {/* Reason Card */}
        <ExpandableSectionCard
          icon={<SearchCode className="w-4 h-4 text-blue-550" />}
          heading="Analysis Verdict Reason"
          content={analysis.reason}
          borderColorClass="border-slate-850"
          leftBorderClass="border-l-4 border-l-blue-600"
          bgGlowClass="bg-[#111827]"
        />

        {/* Root Cause Card */}
        <ExpandableSectionCard
          icon={<Cpu className="w-4 h-4 text-blue-550" />}
          heading="Inferred Root Cause"
          content={analysis.possible_root_cause}
          borderColorClass="border-slate-850"
          leftBorderClass="border-l-4 border-l-blue-600"
          bgGlowClass="bg-[#111827]"
        />

        {/* Impact Card */}
        <ExpandableSectionCard
          icon={<AlertOctagon className="w-4 h-4 text-blue-550" />}
          heading="Downlink Operational Impact"
          content={analysis.potential_impact}
          borderColorClass="border-slate-850"
          leftBorderClass="border-l-4 border-l-blue-600"
          bgGlowClass="bg-[#111827]"
        />

        {/* Recommended Actions Checklist Card */}
        <div className="md:col-span-2">
          <ExpandableSectionCard
            icon={<CheckCircle2 className="w-4 h-4 text-blue-550" />}
            heading="Recommended Autonomous Actions Checklist"
            content={renderActionsChecklist()}
            borderColorClass="border-slate-850"
            leftBorderClass="border-l-4 border-l-blue-600"
            bgGlowClass="bg-[#111827]"
          />
        </div>

      </div>

      <div className="pt-3 border-t border-slate-800 text-[10px] text-slate-500 flex flex-wrap items-center justify-between gap-3">
        <span>SECURITY PROTOCOL: <strong className="text-slate-400">ISRO-ISTRAC-ENC-77A</strong></span>
        <span>AI MODEL ENGINE VERSION: <strong className="text-slate-400 font-bold">PHI-3-3.8B-QUANT-v1</strong></span>
      </div>
    </div>
  );
};
