import React, { useState, useMemo, useEffect } from 'react';
import { Navbar } from './components/Navbar';
import { AlertBanner } from './components/AlertBanner';
import { SidebarNav, NavTab } from './components/SidebarNav';
import { LoadingOverlay } from './components/LoadingOverlay';
import { Footer } from './components/Footer';
import { submitTelemetryAnalysis, fetchTelemetryHistory } from './services/api';
// Ingest page components
import { DashboardPage } from './components/DashboardPage';
import { LiveTelemetryPage } from './components/LiveTelemetryPage';
import { AiNetworkAnalysisPage } from './components/AiNetworkAnalysisPage';
import { RiskPredictionPage } from './components/RiskPredictionPage';
import { AnalysisHistoryPage } from './components/AnalysisHistoryPage';
import { SystemHealthPage } from './components/SystemHealthPage';
import { SettingsPage } from './components/SettingsPage';
import { AboutPage } from './components/AboutPage';

import mockHistoryData from './data/mockTelemetry.json';
import { AnalysisRun, TelemetryData, TrendDataPoint, NodeHealthPoint, NetworkStatusType, ThemeMode } from './types';
import { getStatusTextHex, formatISROTimestamp } from './utils/helpers';
import { 
  Activity, 
  ShieldCheck, 
  AlertTriangle, 
  AlertOctagon 
} from 'lucide-react';

export default function App() {
  // State for historic analyses
  const [history, setHistory] = useState<AnalysisRun[]>(mockHistoryData as AnalysisRun[]);
  
  // Currently active analysis run displayed in dashboard
  const [currentRun, setCurrentRun] = useState<AnalysisRun>(mockHistoryData[0] as AnalysisRun);
  
  // Loading simulation state
  const [isAnalyzing, setIsAnalyzing] = useState<boolean>(false);
  
  // Simulated backend connection state toggle
  const [connected, setConnected] = useState<boolean>(true);

  // Theme state
  const [theme, setTheme] = useState<ThemeMode>('dark');

  // Active MCC interface tab (defaulting to landing dashboard)
  const [activeTab, setActiveTab] = useState<NavTab>('dashboard');
  
  // Mobile sidebar drawer state
  const [mobileSidebarOpen, setMobileSidebarOpen] = useState<boolean>(false);
 useEffect(() => {
  fetchTelemetryHistory().then(data => {
    if (data.length > 0) {
      setHistory(data);
      setCurrentRun(data[0]);
    }
  }).catch(() => {});
}, []);
  // Trigger simulated AI Analysis
  const handleAnalyze = async (telemetry: TelemetryData) => {
    setIsAnalyzing(true);
    try {
      const result = await submitTelemetryAnalysis(telemetry);
      setHistory((prev) => [result, ...prev]);
      setCurrentRun(result);
      setActiveTab('analysis');
    } catch (error) {
      console.error('Analysis failed:', error);
    } finally {
      setIsAnalyzing(false);
    }
  };

  // Generate mock trend chart data ending at current run's risk
  const trendChartData: TrendDataPoint[] = useMemo(() => {
    const times = ['T-5m', 'T-4m', 'T-3m', 'T-2m', 'T-1m', 'Current'];
    const baseRisk = currentRun.predicted_risk;
    const baseLatency = currentRun.telemetry.latency;
    const baseCpu = currentRun.telemetry.cpu;
    
    return times.map((t, idx) => {
      if (idx === times.length - 1) {
        return {
          time: t,
          risk: baseRisk,
          latency: baseLatency,
          packetLoss: currentRun.telemetry.packet_loss,
          cpu: baseCpu,
        };
      }
      // Create smooth trajectory variations
      const factor = (idx - 2.5) * 8;
      const r = Math.min(99, Math.max(5, Math.round(baseRisk + factor * (Math.random() > 0.5 ? 1 : -0.5))));
      const l = Math.max(10, Math.round(baseLatency + factor * 1.5));
      const c = Math.min(100, Math.max(10, Math.round(baseCpu + factor * 0.5)));
      
      return {
        time: t,
        risk: r,
        latency: l,
        packetLoss: Math.max(0, parseFloat((currentRun.telemetry.packet_loss * 0.8).toFixed(1))),
        cpu: c,
      };
    });
  }, [currentRun]);

  // Generate doughnut chart health data based on current status
  const healthChartData: NodeHealthPoint[] = useMemo(() => {
    if (currentRun.network_status === 'Healthy') {
      return [
        { name: 'Healthy Nodes', value: 92, color: '#10B981' },
        { name: 'Warning Nodes', value: 7, color: '#F59E0B' },
        { name: 'Critical Nodes', value: 1, color: '#EF4444' },
      ];
    } else if (currentRun.network_status === 'Warning') {
      return [
        { name: 'Healthy Nodes', value: 68, color: '#10B981' },
        { name: 'Warning Nodes', value: 27, color: '#F59E0B' },
        { name: 'Critical Nodes', value: 5, color: '#EF4444' },
      ];
    } else {
      return [
        { name: 'Healthy Nodes', value: 45, color: '#10B981' },
        { name: 'Warning Nodes', value: 34, color: '#F59E0B' },
        { name: 'Critical Nodes', value: 21, color: '#EF4444' },
      ];
    }
  }, [currentRun.network_status]);

  // Status Icon helper
  const getStatusIcon = (status: NetworkStatusType) => {
    if (status === 'Healthy') return <ShieldCheck className="w-5 h-5 text-emerald-400" />;
    if (status === 'Warning') return <AlertTriangle className="w-5 h-5 text-amber-400" />;
    return <AlertOctagon className="w-5 h-5 text-red-400 animate-pulse" />;
  };

  const statusHex = getStatusTextHex(currentRun.network_status);

  // Inbound telemetry configuration from uploaded JSON files
  const handleLoadTelemetry = (telemetry: TelemetryData) => {
    setCurrentRun((prev) => ({
      ...prev,
      telemetry: { ...telemetry }
    }));
  };

  return (
    <div className={`min-h-screen font-sans flex flex-col selection:bg-cyan-500 selection:text-black antialiased transition-colors duration-300 ${
      theme === 'light' ? 'bg-slate-100 text-slate-900' : 'bg-[#030611] text-slate-100'
    }`}>
      {/* Top Professional Navigation Bar */}
      <Navbar 
        connected={connected} 
        onToggleConnection={() => setConnected(!connected)}
        theme={theme}
        onToggleTheme={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
        onToggleMobileSidebar={() => setMobileSidebarOpen(!mobileSidebarOpen)}
        activeTab={activeTab}
      />

      {/* Main Structural Layout: Persistent Left Sidebar + Main Scrollable Display Area */}
      <div className="flex-1 flex flex-row relative">
        
        {/* Permanent Left Sidebar (with absolute responsive overlay on mobile) */}
        <SidebarNav
          activeTab={activeTab}
          onSelectTab={setActiveTab}
          runCount={history.length}
          networkStatus={currentRun.network_status}
          riskScore={currentRun.predicted_risk}
          isMobileOpen={mobileSidebarOpen}
          onCloseMobile={() => setMobileSidebarOpen(false)}
        />

        {/* Core Scrollable Content Area */}
        <div className="flex-1 flex flex-col min-w-0">
          
          {/* Real-time Dynamic Link Alert Banner at the absolute top of the Workspace */}
          <AlertBanner 
            status={currentRun.network_status} 
            reason={currentRun.summary} 
          />

          {/* Core Page Router Viewport */}
          <main className="flex-1 max-w-[1350px] w-full mx-auto px-6 sm:px-8 lg:px-12 py-8 lg:py-12 space-y-10 overflow-y-auto scroll-smooth">
            
            {/* 1. DASHBOARD PAGE */}
            {activeTab === 'dashboard' && (
              <DashboardPage 
                currentRun={currentRun}
                historyCount={history.length}
                onNavigate={setActiveTab}
                onLoadTelemetry={handleLoadTelemetry}
              />
            )}

            {/* 2. LIVE TELEMETRY PAGE */}
            {activeTab === 'telemetry' && (
              <LiveTelemetryPage 
                initialTelemetry={currentRun.telemetry}
                onAnalyze={handleAnalyze}
                isAnalyzing={isAnalyzing}
                networkStatus={currentRun.network_status}
              />
            )}

            {/* 3. AI NETWORK ANALYSIS PAGE */}
            {activeTab === 'analysis' && (
              <AiNetworkAnalysisPage 
                analysis={currentRun}
                isAnalyzing={isAnalyzing}
              />
            )}

            {/* 4. RISK PREDICTION PAGE */}
            {activeTab === 'prediction' && (
              <RiskPredictionPage 
                currentRun={currentRun}
                trendData={trendChartData}
              />
            )}

            {/* 5. ANALYSIS HISTORY PAGE */}
            {activeTab === 'history' && (
              <AnalysisHistoryPage 
                history={history}
                selectedId={currentRun.id}
                onSelectRun={setCurrentRun}
                onNavigate={setActiveTab}
              />
            )}

            {/* 6. SYSTEM HEALTH PAGE */}
            {activeTab === 'health' && (
              <SystemHealthPage 
                connected={connected}
                healthData={healthChartData}
              />
            )}

            {/* 7. SETTINGS PAGE */}
            {activeTab === 'settings' && (
              <SettingsPage 
                theme={theme}
                onToggleTheme={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
                connected={connected}
                onToggleConnection={() => setConnected(!connected)}
              />
            )}

            {/* 8. ABOUT PAGE */}
            {activeTab === 'about' && (
              <AboutPage />
            )}

          </main>

          {/* Unified Mission Spaceflight Footer */}
          <Footer />
        </div>
      </div>

      {/* Full-screen Closed-Loop Ingest Loader Overlay */}
      <LoadingOverlay isVisible={isAnalyzing} />
    </div>
  );
}
