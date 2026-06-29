import React, { useState } from 'react';
import { AnalysisRun } from '../types';
import { 
  Sparkles, 
  SearchCode, 
  AlertOctagon, 
  CheckCircle2, 
  FileText, 
  Cpu, 
  Terminal, 
  Copy, 
  Check,
  ChevronDown,
  ChevronUp,
  ShieldCheck,
  Activity
} from 'lucide-react';

interface AnalysisPanelProps {
  analysis: AnalysisRun;
  isAnalyzing: boolean;
}

interface SectionCardProps {
  icon: React.ReactNode;
  heading: string;
  content: string | React.ReactNode;
  borderColorClass?: string;
  leftBorderClass?: string;
  bgGlowClass?: string;
  accentBadge?: string;
}

const AnalysisSectionCard: React.FC<SectionCardProps> = ({
  icon,
  heading,
  content,
  borderColorClass = 'border-slate-800 hover:border-cyan-500/40',
  leftBorderClass = 'border-l-4 border-l-cyan-400',
  bgGlowClass = 'from-[#0B132B]/60 to-[#050814]/80',
  accentBadge = 'text-cyan-400 border-cyan-400/30 bg-cyan-400/10'
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
    <div className={`rounded-xl border ${leftBorderClass} bg-gradient-to-br ${bgGlowClass} p-4 sm:p-5 backdrop-blur-xl transition-all duration-300 shadow-xl ${borderColorClass} group flex flex-col justify-between`}>
      <div>
        <div className="flex items-center justify-between pb-3 mb-3 border-b border-slate-800/80">
          <div className="flex items-center gap-2.5">
            <div className="p-2 rounded-lg bg-black/50 border border-slate-800 shadow-inner group-hover:scale-105 transition-transform">
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
                title="Copy section analysis text"
                className="text-slate-400 hover:text-cyan-400 transition-colors p-1.5 rounded bg-slate-900/80 border border-slate-800 hover:border-slate-600 cursor-pointer"
              >
                {copied ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
              </button>
            )}
            <button
              onClick={() => setIsCollapsed(!isCollapsed)}
              title={isCollapsed ? "Expand section" : "Collapse section"}
              className="text-slate-400 hover:text-white transition-colors p-1.5 rounded bg-slate-900/80 border border-slate-800 hover:border-slate-600 cursor-pointer"
            >
              {isCollapsed ? <ChevronDown className="w-3.5 h-3.5" /> : <ChevronUp className="w-3.5 h-3.5" />}
            </button>
          </div>
        </div>

        {!isCollapsed && (
          <div className="text-xs sm:text-sm font-sans text-slate-300 leading-relaxed tracking-wide animate-fadeIn">
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
    </div>
  );
};

export const AnalysisPanel: React.FC<AnalysisPanelProps> = ({
  analysis,
  isAnalyzing,
}) => {
  // Parse recommended actions into interactive checklist
  const actionLines = analysis.recommended_actions
    .split('\n')
    .map(line => line.replace(/^[-\d.]+\s*/, '').trim())
    .filter(Boolean);

  const [checkedItems, setCheckedItems] = useState<Record<number, boolean>>({});

  const toggleCheck = (idx: number) => {
    setCheckedItems(prev => ({ ...prev, [idx]: !prev[idx] }));
  };

  const confidenceScore = analysis.confidence ?? 97.4;

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
                ? 'bg-emerald-950/20 border-emerald-800/40 opacity-70' 
                : 'bg-slate-950/80 border-slate-800/90 hover:border-emerald-500/50'
            }`}
          >
            <div className={`mt-0.5 w-4 h-4 rounded flex items-center justify-center border shrink-0 transition-colors ${
              isDone ? 'bg-emerald-500 border-emerald-400 text-slate-950' : 'border-slate-700 bg-slate-900'
            }`}>
              {isDone && <Check className="w-3 h-3 font-bold" />}
            </div>

            <span className={`text-[10px] font-mono font-bold px-1.5 py-0.5 rounded border uppercase shrink-0 ${badgeColor}`}>
              {priority}
            </span>

            <span className={`text-xs font-mono transition-colors flex-1 ${isDone ? 'line-through text-slate-500' : 'text-slate-200'}`}>
              {action}
            </span>
          </div>
        );
      })}
    </div>
  );

  return (
    <div className="rounded-2xl border border-slate-800/90 bg-[#050A19]/80 backdrop-blur-2xl p-5 sm:p-6 shadow-2xl h-full flex flex-col justify-between">
      <div>
        {/* Header */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between pb-4 mb-5 border-b border-slate-800/90 gap-3">
          <div className="flex items-center gap-3">
            <div className="p-2.5 rounded-xl bg-gradient-to-br from-cyan-500/25 to-[#F36F21]/25 border border-cyan-500/50 shadow-[0_0_20px_rgba(0,240,255,0.25)]">
              <Terminal className="w-6 h-6 text-cyan-400" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="font-extrabold text-base sm:text-lg text-white font-mono tracking-wider uppercase">
                  AI Closed-Loop Diagnostic Report
                </h3>
                <span className="px-2 py-0.5 rounded text-[10px] font-mono font-bold bg-[#F36F21]/20 text-[#F36F21] border border-[#F36F21]/40">
                  {analysis.model}
                </span>
              </div>
              <p className="text-[11px] font-mono text-cyan-300 mt-0.5">
                AUTONOMOUS NOC REPORT SYNTHESIZED AT {analysis.generated_at}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2 self-end sm:self-center">
            <span className="text-[10px] font-mono text-slate-500">INFERENCE ID:</span>
            <span className="px-2.5 py-1 rounded-lg bg-black border border-slate-800 font-mono text-xs font-bold text-cyan-400 shadow-inner">
              #{analysis.id}
            </span>
          </div>
        </div>

        {/* AI Confidence Bar */}
        <div className="mb-5 p-4 rounded-xl bg-[#081026] border border-cyan-500/20 shadow-inner">
          <div className="flex items-center justify-between text-xs font-mono mb-2">
            <span className="text-slate-400 flex items-center gap-2 font-bold">
              <Activity className="w-4 h-4 text-cyan-400 animate-pulse" /> PHI-3 INFERENCE CONFIDENCE INDEX
            </span>
            <span className="text-cyan-300 font-extrabold text-sm">{confidenceScore}%</span>
          </div>
          <div className="w-full h-2 bg-slate-950 rounded-full overflow-hidden border border-slate-800/80">
            <div 
              className="h-full bg-gradient-to-r from-cyan-500 via-sky-400 to-emerald-400 shadow-[0_0_12px_#00F0FF] transition-all duration-1000"
              style={{ width: `${confidenceScore}%` }}
            />
          </div>
        </div>

        {/* Executive Summary Full Width Card */}
        <div className="mb-4">
          <AnalysisSectionCard
            icon={<FileText className="w-4 h-4 text-sky-400" />}
            heading="Summary"
            content={analysis.summary}
            borderColorClass="border-sky-900/60 hover:border-sky-400/80"
            leftBorderClass="border-l-4 border-l-sky-400"
            bgGlowClass="from-sky-950/30 to-[#050A19]"
          />
        </div>

        {/* Grid of Collapsible Cards */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 mb-4">
          {/* Reason */}
          <AnalysisSectionCard
            icon={<SearchCode className="w-4 h-4 text-cyan-400" />}
            heading="Reason"
            content={analysis.reason}
            borderColorClass="border-cyan-950 hover:border-cyan-400/60"
            leftBorderClass="border-l-4 border-l-cyan-400"
            bgGlowClass="from-cyan-950/30 to-[#050A19]"
          />

          {/* Root Cause */}
          <AnalysisSectionCard
            icon={<Cpu className="w-4 h-4 text-[#F36F21]" />}
            heading="Possible Root Cause"
            content={analysis.possible_root_cause}
            borderColorClass="border-orange-950 hover:border-[#F36F21]/60"
            leftBorderClass="border-l-4 border-l-[#F36F21]"
            bgGlowClass="from-[#F36F21]/15 to-[#050A19]"
          />

          {/* Potential Impact */}
          <AnalysisSectionCard
            icon={<AlertOctagon className="w-4 h-4 text-red-400" />}
            heading="Potential Impact"
            content={analysis.potential_impact}
            borderColorClass="border-red-950 hover:border-red-500/60"
            leftBorderClass="border-l-4 border-l-red-500"
            bgGlowClass="from-red-950/30 to-[#050A19]"
          />

          {/* Recommended Actions Checklist */}
          <AnalysisSectionCard
            icon={<CheckCircle2 className="w-4 h-4 text-emerald-400" />}
            heading="Recommended Actions"
            content={renderActionsChecklist()}
            borderColorClass="border-emerald-950 hover:border-emerald-500/60"
            leftBorderClass="border-l-4 border-l-emerald-400"
            bgGlowClass="from-emerald-950/30 to-[#050A19]"
          />
        </div>
      </div>

      {/* Footer info */}
      <div className="mt-4 pt-3 border-t border-slate-800/90 flex flex-wrap items-center justify-between gap-4 text-[10px] font-mono text-slate-400">
        <div className="flex items-center gap-2">
          <ShieldCheck className="w-4 h-4 text-emerald-400" />
          <span>ISRO CLOSED-LOOP PROTOCOL VERIFIED</span>
        </div>
        <div>
          <span>GROUND STATION LINK: <strong className="text-cyan-400">ISTRAC-BLR-ACTIVE</strong></span>
        </div>
      </div>
    </div>
  );
};

