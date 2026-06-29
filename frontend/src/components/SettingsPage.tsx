import React, { useState } from 'react';
import { 
  Settings, 
  Sun, 
  Moon, 
  RefreshCw, 
  Cpu, 
  WifiOff, 
  Bell, 
  Sliders, 
  ShieldAlert, 
  Radio,
  FileText
} from 'lucide-react';
import { ThemeMode } from '../types';

interface SettingsPageProps {
  theme: ThemeMode;
  onToggleTheme: () => void;
  connected: boolean;
  onToggleConnection: () => void;
}

export const SettingsPage: React.FC<SettingsPageProps> = ({
  theme,
  onToggleTheme,
  connected,
  onToggleConnection
}) => {
  const [autoRefresh, setAutoRefresh] = useState(true);
  const [modelName, setModelName] = useState('phi3-edge');
  const [notifications, setNotifications] = useState(true);

  return (
    <div className="space-y-6 animate-fadeIn font-sans">
      
      {/* Page Title */}
      <div className="rounded-xl border border-slate-855 bg-[#111827] p-6 shadow-sm flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="p-2.5 rounded-lg bg-slate-900 border border-slate-800 text-blue-500">
            <Settings className="w-5 h-5" />
          </div>
          <div>
            <h2 className="text-sm sm:text-base font-bold text-white tracking-wider uppercase font-mono">
              Control Station Settings
            </h2>
            <p className="text-xs text-slate-500 mt-0.5 font-mono">
              Configure local parameters and interface weights
            </p>
          </div>
        </div>
        <span className="text-[10px] px-2.5 py-1 rounded bg-slate-900 text-slate-400 border border-slate-800 font-bold uppercase tracking-widest font-mono">
          Local Config Only
        </span>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        
        {/* Core Settings Block */}
        <div className="rounded-xl border border-slate-850 bg-[#111827] p-6 shadow-sm space-y-6">
          <div className="flex items-center gap-2.5 pb-4 border-b border-slate-800">
            <Sliders className="w-4 h-4 text-blue-500" />
            <h3 className="font-bold text-xs sm:text-sm text-white uppercase tracking-wider font-mono">
              Interface Config
            </h3>
          </div>

          <div className="space-y-4">
            
            {/* Setting 1: Theme Mode */}
            <div className="flex items-center justify-between p-4 rounded-lg bg-slate-900 border border-slate-850">
              <div className="space-y-1 max-w-xs pr-4">
                <div className="text-xs font-bold text-white uppercase tracking-wider flex items-center gap-2 font-mono">
                  {theme === 'dark' ? <Moon className="w-3.5 h-3.5 text-blue-500" /> : <Sun className="w-3.5 h-3.5 text-slate-400" />}
                  NOC Color Theme
                </div>
                <p className="text-[10px] text-slate-500 leading-relaxed">
                  Switch the dashboard color scheme between space-dark and high-contrast light.
                </p>
              </div>
              
              <button
                onClick={onToggleTheme}
                className="px-3.5 py-2 rounded-lg bg-slate-800 hover:bg-slate-750 border border-slate-700 text-[10px] text-slate-200 font-bold font-mono tracking-wider transition-all cursor-pointer select-none"
              >
                {theme === 'dark' ? 'LIGHT MODE' : 'DARK MODE'}
              </button>
            </div>

            {/* Setting 2: Auto Refresh */}
            <div className="flex items-center justify-between p-4 rounded-lg bg-slate-900 border border-slate-855">
              <div className="space-y-1 max-w-xs pr-4">
                <div className="text-xs font-bold text-white uppercase tracking-wider flex items-center gap-2 font-mono">
                  <RefreshCw className="w-3.5 h-3.5 text-slate-400" />
                  Auto-Telemetry Refresh
                </div>
                <p className="text-[10px] text-slate-500 leading-relaxed">
                  Automatically refresh and poll ground telemetry links at 5-second increments.
                </p>
              </div>

              <button
                onClick={() => setAutoRefresh(!autoRefresh)}
                className={`px-4 py-2 rounded-lg text-[10px] font-bold font-mono tracking-wider transition-all cursor-pointer border active:scale-95 ${
                  autoRefresh 
                    ? 'bg-blue-600 text-white border-blue-700' 
                    : 'bg-slate-800 text-slate-450 border-slate-700'
                }`}
              >
                {autoRefresh ? 'ACTIVE' : 'DISABLED'}
              </button>
            </div>

            {/* Setting 3: Model Name */}
            <div className="flex items-center justify-between p-4 rounded-lg bg-slate-900 border border-slate-850">
              <div className="space-y-1 max-w-xs pr-4">
                <div className="text-xs font-bold text-white uppercase tracking-wider flex items-center gap-2 font-mono">
                  <Cpu className="w-3.5 h-3.5 text-blue-500" />
                  Local Inference Model
                </div>
                <p className="text-[10px] text-slate-500 leading-relaxed">
                  Select the underlying LLM weights that evaluate parameters in ground segments.
                </p>
              </div>

              <select
                value={modelName}
                onChange={(e) => setModelName(e.target.value)}
                className="px-3 py-2 rounded-lg bg-slate-950 border border-slate-800 hover:border-slate-700 text-[10px] text-slate-200 focus:outline-none font-mono cursor-pointer"
              >
                <option value="phi3-edge">Phi-3 (Quantized Edge)</option>
                <option value="gemma-2b">Gemma-2-2B (Local)</option>
                <option value="llama-8b">Llama-3-8B (Desktop)</option>
              </select>
            </div>

            {/* Setting 4: Offline Mode */}
            <div className="flex items-center justify-between p-4 rounded-lg bg-slate-900 border border-slate-850">
              <div className="space-y-1 max-w-xs pr-4">
                <div className="text-xs font-bold text-white uppercase tracking-wider flex items-center gap-2 font-mono">
                  <WifiOff className="w-3.5 h-3.5 text-blue-500" />
                  Offline Copilot Mode
                </div>
                <p className="text-[10px] text-slate-500 leading-relaxed">
                  Force the dashboard to fully cut off external server connections (Offline AI mode).
                </p>
              </div>

              <button
                onClick={onToggleConnection}
                className={`px-4 py-2 rounded-lg text-[10px] font-bold font-mono tracking-wider transition-all cursor-pointer border active:scale-95 ${
                  !connected 
                    ? 'bg-amber-500/20 text-amber-400 border-amber-500/30' 
                    : 'bg-slate-800 text-slate-500 border-slate-700'
                }`}
              >
                {!connected ? 'OFFLINE ACTIVE' : 'ONLINE'}
              </button>
            </div>

            {/* Setting 5: Notifications */}
            <div className="flex items-center justify-between p-4 rounded-lg bg-slate-900 border border-slate-850">
              <div className="space-y-1 max-w-xs pr-4">
                <div className="text-xs font-bold text-white uppercase tracking-wider flex items-center gap-2 font-mono">
                  <Bell className="w-3.5 h-3.5 text-blue-500" />
                  Inference Alerts
                </div>
                <p className="text-[10px] text-slate-500 leading-relaxed">
                  Trigger warning cues when failure risk score breaches safety thresholds.
                </p>
              </div>

              <button
                onClick={() => setNotifications(!notifications)}
                className={`px-4 py-2 rounded-lg text-[10px] font-bold font-mono tracking-wider transition-all cursor-pointer border active:scale-95 ${
                  notifications 
                    ? 'bg-blue-600 text-white border-blue-700' 
                    : 'bg-slate-800 text-slate-500 border-slate-700'
                }`}
              >
                {notifications ? 'NOTIFY' : 'MUTE'}
              </button>
            </div>

          </div>
        </div>

        {/* Future Settings Placeholders Block */}
        <div className="rounded-xl border border-slate-850 bg-[#111827] p-6 shadow-sm flex flex-col justify-between space-y-6">
          
          <div>
            <div className="flex items-center gap-2.5 pb-4 border-b border-slate-800 mb-5">
              <Radio className="w-4 h-4 text-blue-500" />
              <h3 className="font-bold text-xs sm:text-sm text-white uppercase tracking-wider font-mono">
                Telemetry Link Thresholds
              </h3>
            </div>

            <p className="text-xs text-slate-400 leading-relaxed mb-6 font-sans">
              These values define critical network threshold limits that trigger closed-loop route optimization. Changing these parameters updates classification logic in future runs.
            </p>

            <div className="space-y-5 font-mono">
              {/* Threshold latency */}
              <div className="space-y-2">
                <div className="flex items-center justify-between text-[11px]">
                  <span className="text-slate-400">CRITICAL LATENCY BOUND</span>
                  <span className="text-white font-bold">100 ms</span>
                </div>
                <div className="w-full h-1 bg-slate-900 rounded-full border border-slate-800 relative">
                  <div className="absolute right-1/3 top-0 bottom-0 w-1 bg-red-500" />
                </div>
              </div>

              {/* Threshold loss */}
              <div className="space-y-2">
                <div className="flex items-center justify-between text-[11px]">
                  <span className="text-slate-400">CRITICAL PACKET LOSS BOUND</span>
                  <span className="text-white font-bold">5.0 %</span>
                </div>
                <div className="w-full h-1 bg-slate-900 rounded-full border border-slate-800 relative">
                  <div className="absolute right-1/4 top-0 bottom-0 w-1 bg-red-500" />
                </div>
              </div>

              {/* Threshold CPU */}
              <div className="space-y-2">
                <div className="flex items-center justify-between text-[11px]">
                  <span className="text-slate-400">CRITICAL MULTIPLEXER CPU LIMIT</span>
                  <span className="text-white font-bold">85 %</span>
                </div>
                <div className="w-full h-1 bg-slate-900 rounded-full border border-slate-800 relative">
                  <div className="absolute right-[15%] top-0 bottom-0 w-1 bg-red-500" />
                </div>
              </div>
            </div>
          </div>

          <div className="pt-4 border-t border-slate-800 text-[10px] text-slate-500 flex items-center justify-between font-mono">
            <span>VERSION REF: <strong className="text-slate-400">CFG-GHOST-v1.0</strong></span>
            <span>HARDWARE CAP: <strong className="text-slate-450">8-CORE ARM64</strong></span>
          </div>

        </div>

      </div>
    </div>
  );
};
