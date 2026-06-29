import React, { useState, useEffect } from 'react';
import { 
  LayoutDashboard, 
  Radio, 
  Cpu, 
  TrendingUp, 
  History, 
  Activity, 
  Settings, 
  Info,
  ChevronLeft,
  ChevronRight,
  ShieldCheck,
  ShieldAlert,
  HelpCircle
} from 'lucide-react';

export type NavTab = 'dashboard' | 'telemetry' | 'analysis' | 'prediction' | 'history' | 'health' | 'settings' | 'about';

interface SidebarNavProps {
  activeTab: NavTab;
  onSelectTab: (tab: NavTab) => void;
  runCount: number;
  networkStatus: string;
  riskScore: number;
  isMobileOpen?: boolean;
  onCloseMobile?: () => void;
}

export const SidebarNav: React.FC<SidebarNavProps> = ({
  activeTab,
  onSelectTab,
  runCount,
  networkStatus,
  riskScore,
  isMobileOpen = false,
  onCloseMobile
}) => {
  // Read collapse state from localStorage to remember user's last state
  const [isCollapsed, setIsCollapsed] = useState<boolean>(() => {
    const saved = localStorage.getItem('ghostpilot_sidebar_collapsed');
    return saved === 'true';
  });

  // Sync state to localStorage
  useEffect(() => {
    localStorage.setItem('ghostpilot_sidebar_collapsed', String(isCollapsed));
  }, [isCollapsed]);

  const navItems = [
    {
      id: 'dashboard' as NavTab,
      label: 'Dashboard',
      description: 'Landing, Welcome & Key Metrics',
      icon: LayoutDashboard
    },
    {
      id: 'telemetry' as NavTab,
      label: 'Live Telemetry',
      description: 'Configure Parameters & Ingest',
      icon: Radio
    },
    {
      id: 'analysis' as NavTab,
      label: 'AI Network Analysis',
      description: 'Phi-3 Closed-Loop Inference',
      icon: Cpu
    },
    {
      id: 'prediction' as NavTab,
      label: 'Risk Prediction',
      description: 'ML Weights & Forecast Curves',
      icon: TrendingUp
    },
    {
      id: 'history' as NavTab,
      label: 'Analysis History',
      description: 'Search & Filter Past Inferences',
      icon: History,
      count: runCount
    },
    {
      id: 'health' as NavTab,
      label: 'System Health',
      description: 'Ollama, Express & Node Metrics',
      icon: Activity
    },
    {
      id: 'settings' as NavTab,
      label: 'Settings',
      description: 'Interactive UI Config & Model Select',
      icon: Settings
    },
    {
      id: 'about' as NavTab,
      label: 'About GhostPilot',
      description: 'ISRO Hackathon PS13 & Tech Stack',
      icon: Info
    }
  ];

  const toggleCollapse = () => {
    setIsCollapsed(!isCollapsed);
  };

  return (
    <>
      {/* Mobile Backdrop Drawer */}
      {isMobileOpen && (
        <div 
          onClick={onCloseMobile}
          className="fixed inset-0 bg-black/80 backdrop-blur-sm z-40 lg:hidden animate-fade-in"
        />
      )}

      {/* Sidebar Container */}
      <aside 
        className={`fixed lg:sticky top-16 left-0 z-40 h-[calc(100vh-64px)] bg-[#0b1220]/95 lg:bg-[#0b1220] border-r border-slate-800/80 flex flex-col justify-between p-4 transition-all duration-300 ease-in-out shrink-0 select-none ${
          isMobileOpen 
            ? 'translate-x-0 w-[260px] shadow-xl' 
            : '-translate-x-full lg:translate-x-0'
        } ${
          !isMobileOpen && isCollapsed ? 'lg:w-[72px]' : 'lg:w-[260px]'
        }`}
      >
        <div className="space-y-4 overflow-y-auto pr-1 flex-1 scrollbar-none">
          
          {/* Collapse toggle button for Desktop */}
          <div className="hidden lg:flex justify-end mb-1">
            <button
              onClick={toggleCollapse}
              className="p-1.5 rounded-lg bg-slate-900 border border-slate-800 text-slate-400 hover:text-blue-500 hover:border-slate-700 transition-all cursor-pointer active:scale-95"
              title={isCollapsed ? "Expand Sidebar" : "Collapse Sidebar"}
            >
              {isCollapsed ? <ChevronRight className="w-3.5 h-3.5" /> : <ChevronLeft className="w-3.5 h-3.5" />}
            </button>
          </div>

          {/* Navigation Section Title */}
          <div className="px-2">
            <span className={`text-[10px] font-mono font-bold uppercase tracking-widest text-slate-500 flex items-center gap-2 transition-all ${
              isCollapsed && !isMobileOpen ? 'justify-center' : ''
            }`}>
              <Activity className="w-3.5 h-3.5 text-slate-400 shrink-0" />
              {(!isCollapsed || isMobileOpen) && <span className="text-slate-500 font-mono">MCC INTERFACES</span>}
            </span>
          </div>

          {/* Nav List */}
          <nav className="space-y-1">
            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive = activeTab === item.id;
              const showLabels = !isCollapsed || isMobileOpen;

              return (
                <button
                  key={item.id}
                  onClick={() => {
                    onSelectTab(item.id);
                    if (onCloseMobile) onCloseMobile();
                  }}
                  aria-current={isActive ? 'page' : undefined}
                  className={`w-full text-left p-2 rounded-xl transition-all duration-200 flex items-center group relative cursor-pointer ${
                    showLabels ? 'gap-3' : 'justify-center'
                  } ${
                    isActive
                      ? 'bg-blue-600/10 border border-blue-500/30 text-white font-medium'
                      : 'border border-transparent hover:border-slate-800 hover:bg-slate-900/40 text-slate-400 hover:text-slate-200'
                  }`}
                  title={!showLabels ? item.label : undefined}
                >
                  {/* Active Indicator Bar */}
                  {isActive && (
                    <div className="absolute left-0 top-1.5 bottom-1.5 w-[3px] bg-blue-600 rounded-r-full" />
                  )}

                  <div className={`p-2 rounded-lg shrink-0 transition-all duration-200 group-hover:scale-105 ${
                    isActive 
                      ? 'bg-blue-600 text-white shadow-sm' 
                      : 'bg-slate-900 border border-slate-800 text-slate-500 group-hover:text-blue-500 group-hover:border-slate-700'
                  }`}>
                    <Icon className="w-4 h-4" />
                  </div>

                  {showLabels && (
                    <div className="flex-1 min-w-0 transition-opacity duration-200 animate-fade-in">
                      <div className="flex items-center justify-between gap-1.5">
                        <span className={`text-xs font-mono tracking-tight truncate ${isActive ? 'text-white font-semibold' : 'text-slate-300'}`}>
                          {item.label}
                        </span>
                        
                        {item.count !== undefined && (
                          <span className={`text-[9px] font-mono px-1.5 py-0.2 rounded-full border ${
                            isActive 
                              ? 'bg-blue-600/15 text-blue-400 border-blue-500/20 font-bold' 
                              : 'bg-slate-900 text-slate-500 border-slate-800/80'
                          }`}>
                            {item.count}
                          </span>
                        )}
                      </div>
                      <p className="text-[10px] text-slate-500 font-sans truncate mt-0.5 group-hover:text-slate-400 transition-colors">
                        {item.description}
                      </p>
                    </div>
                  )}
                </button>
              );
            })}
          </nav>
        </div>
      </aside>
    </>
  );
};
