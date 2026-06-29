import React, { useState, useEffect } from 'react';
import { 
  Rocket, 
  Satellite, 
  Clock, 
  Cpu, 
  Wifi, 
  WifiOff, 
  Menu, 
  Sun, 
  Moon, 
  ChevronRight,
  ShieldCheck,
  User
} from 'lucide-react';
import { ThemeMode } from '../types';

interface NavbarProps {
  connected?: boolean;
  onToggleConnection?: () => void;
  theme?: ThemeMode;
  onToggleTheme?: () => void;
  missionName?: string;
  onToggleMobileSidebar?: () => void;
  activeTab: string;
}

export const Navbar: React.FC<NavbarProps> = ({ 
  connected = true, 
  onToggleConnection,
  theme = 'dark',
  onToggleTheme,
  missionName = "GAGANYAAN-3 RELAY NETWORK",
  onToggleMobileSidebar,
  activeTab
}) => {
  const [timeStr, setTimeStr] = useState('');
  const [istStr, setIstStr] = useState('');

  // Real-time ticking UTC & IST clock using system clock
  useEffect(() => {
    const updateTime = () => {
      const now = new Date();
      
      // True UTC format: HH:MM:SS UTC
      const utcHours = String(now.getUTCHours()).padStart(2, '0');
      const utcMinutes = String(now.getUTCMinutes()).padStart(2, '0');
      const utcSeconds = String(now.getUTCSeconds()).padStart(2, '0');
      setTimeStr(`${utcHours}:${utcMinutes}:${utcSeconds} UTC`);

      // Local IST time (Asia/Kolkata timezone)
      try {
        const istFormatter = new Intl.DateTimeFormat('en-US', {
          timeZone: 'Asia/Kolkata',
          hour12: false,
          hour: '2-digit',
          minute: '2-digit',
          second: '2-digit'
        });
        setIstStr(`${istFormatter.format(now)} IST`);
      } catch (e) {
        // Fallback offset calculation (UTC+5:30) if Intl is not supported or fails
        const istOffset = 5.5 * 60 * 60 * 1000;
        const istDate = new Date(now.getTime() + istOffset);
        const istH = String(istDate.getUTCHours()).padStart(2, '0');
        const istM = String(istDate.getUTCMinutes()).padStart(2, '0');
        const istS = String(istDate.getUTCSeconds()).padStart(2, '0');
        setIstStr(`${istH}:${istM}:${istS} IST`);
      }
    };
    
    updateTime();
    const interval = setInterval(updateTime, 1000);
    return () => clearInterval(interval);
  }, []);

  const isLight = theme === 'light';

  // Generate friendly breadcrumb name
  const getTabLabel = (tab: string) => {
    switch (tab) {
      case 'dashboard': return 'Dashboard';
      case 'telemetry': return 'Live Telemetry';
      case 'analysis': return 'AI Network Analysis';
      case 'prediction': return 'Risk Prediction';
      case 'history': return 'Analysis History';
      case 'health': return 'System Health';
      case 'settings': return 'Settings';
      case 'about': return 'About GhostPilot';
      default: return 'Dashboard';
    }
  };

  return (
    <header className={`sticky top-0 z-50 w-full backdrop-blur-md border-b transition-all duration-300 ${
      isLight 
        ? 'bg-white/80 border-slate-200/80 text-slate-900 shadow-sm' 
        : 'bg-[#030611]/85 border-slate-800/80 text-white shadow-[0_4px_30px_rgba(0,0,0,0.4)]'
    }`}>
      <div className="max-w-[1500px] mx-auto px-4 lg:px-6 h-16 flex items-center justify-between gap-4">
        
        {/* Left Section: Logo & Breadcrumbs */}
        <div className="flex items-center gap-3 md:gap-5 min-w-0">
          {/* Mobile Sidebar Toggle */}
          {onToggleMobileSidebar && (
            <button 
              onClick={onToggleMobileSidebar}
              className={`lg:hidden p-2 rounded-lg border transition-all active:scale-95 cursor-pointer shrink-0 ${
                isLight
                  ? 'bg-slate-100 hover:bg-slate-200 border-slate-200 text-slate-700'
                  : 'bg-slate-900/60 hover:bg-slate-800/60 border-slate-800 text-slate-300 hover:text-white'
              }`}
              title="Toggle Menu"
            >
              <Menu className="w-5 h-5 text-cyan-400" />
            </button>
          )}

          {/* Logo */}
          <div className="flex items-center gap-2.5 shrink-0">
            <div className="relative flex items-center justify-center p-1.5 bg-slate-850 rounded-lg border border-slate-700/80 group">
              <Rocket className="w-4 h-4 text-blue-500 transform -rotate-45" />
            </div>
            <div className="hidden sm:block">
              <div className="flex items-center gap-1.5">
                <span className="font-bold tracking-wider text-sm font-mono uppercase text-slate-200">
                  GHOST<span className="text-blue-500">PILOT</span>
                </span>
                <span className="text-[8px] tracking-widest font-bold bg-slate-800 text-slate-400 px-1.5 py-0.5 rounded border border-slate-700 font-mono">
                  ISTRAC
                </span>
              </div>
            </div>
          </div>

          {/* Vertical Separator for Breadcrumbs */}
          <div className="hidden sm:block h-6 w-[1px] bg-slate-700/50" />

          {/* Breadcrumb Navigation */}
          <div className="hidden sm:flex items-center gap-1 text-[11px] font-mono text-slate-500 truncate">
            <span>Mission Control</span>
            <ChevronRight className="w-3 h-3 text-slate-600" />
            <span className={`font-semibold ${isLight ? 'text-slate-850 font-bold' : 'text-slate-300'}`}>
              {getTabLabel(activeTab)}
            </span>
          </div>
        </div>

        {/* Center Section: UTC Time & Model Badge */}
        <div className="hidden md:flex items-center gap-3">
          {/* UTC Clock */}
          <div className={`flex items-center gap-2.5 px-3 py-1.5 rounded-xl border font-mono transition-colors ${
            isLight
              ? 'bg-slate-50 border-slate-200 text-slate-600'
              : 'bg-[#111827]/60 border-slate-800/80 text-slate-400'
          }`}>
            <Clock className="w-4 h-4 text-cyan-400 shrink-0" />
            <div className="flex flex-col text-left">
              <div className="text-[11px] leading-tight flex items-center gap-1.5">
                <span className="opacity-70 text-[10px]">UTC:</span>
                <strong className={`${isLight ? 'text-slate-900' : 'text-slate-100'} font-bold`}>{timeStr || '12:00:00 UTC'}</strong>
              </div>
              <div className="text-[9px] leading-none opacity-60 mt-0.5 flex items-center gap-1.5">
                <span className="text-[8px]">IST:</span>
                <span className="font-medium text-slate-300">{istStr || '17:30:00 IST'}</span>
              </div>
            </div>
          </div>

          {/* Model Badge */}
          <div className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl border font-mono text-[11px] transition-colors ${
            isLight
              ? 'bg-slate-50 border-slate-200 text-slate-600'
              : 'bg-[#111827]/60 border-slate-800/80 text-slate-400'
          }`}>
            <Cpu className="w-3.5 h-3.5 text-blue-500" />
            <span>MODEL:</span>
            <strong className={`${isLight ? 'text-slate-800' : 'text-slate-300'} font-medium`}>Phi-3 (Local)</strong>
          </div>
        </div>

        {/* Right Section: Badges & Profile */}
        <div className="flex items-center gap-3">
          
          {/* Offline Mode / NOC Status Badge */}
          <button
            onClick={onToggleConnection}
            title={connected ? "NOC Network Ingress Active. Click to disconnect." : "NOC Network Ingress Offline. Click to reconnect."}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl border text-[10px] font-mono font-bold uppercase transition-all duration-300 cursor-pointer active:scale-95 ${
              connected 
                ? isLight 
                  ? 'bg-emerald-50 border-emerald-200 text-emerald-700' 
                  : 'bg-emerald-950/25 border-emerald-800/40 text-emerald-300 shadow-[0_0_12px_rgba(16,185,129,0.05)]'
                : isLight
                  ? 'bg-red-50 border-red-200 text-red-700 animate-pulse'
                  : 'bg-red-950/25 border-red-800/40 text-red-300 shadow-[0_0_12px_rgba(239,68,68,0.05)] animate-pulse'
            }`}
          >
            <span className={`w-2 h-2 rounded-full ${connected ? 'bg-emerald-400 animate-pulse' : 'bg-red-500'}`} />
            <span className="hidden sm:inline">
              {connected ? 'NOC Online' : 'Offline Mode'}
            </span>
          </button>

          {/* Theme Toggle Button */}
          {onToggleTheme && (
            <button
              onClick={onToggleTheme}
              title={`Switch to ${isLight ? 'Dark Space' : 'Light'} NOC Theme`}
              className={`p-2 rounded-xl border transition-all cursor-pointer active:scale-95 ${
                isLight 
                  ? 'bg-slate-50 hover:bg-slate-100 border-slate-200 text-slate-700' 
                  : 'bg-[#111827] hover:bg-slate-800 border-slate-800 text-slate-400 hover:text-white'
              }`}
            >
              {isLight ? <Moon className="w-4 h-4 text-blue-500" /> : <Sun className="w-4 h-4 text-amber-500" />}
            </button>
          )}

          {/* User Avatar Placeholder */}
          <div className="flex items-center gap-2">
            <div className={`h-8 w-8 rounded-full flex items-center justify-center border font-mono text-[10px] font-bold ${
              isLight
                ? 'bg-slate-100 border-slate-200 text-slate-700'
                : 'bg-[#111827] border-slate-800 text-slate-300'
            }`} title="Logged in as ISRO Ground Operations Controller">
              IC
            </div>
          </div>
        </div>

      </div>
    </header>
  );
};
