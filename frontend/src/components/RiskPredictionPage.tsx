import React, { useEffect, useState } from 'react';
import { fetchTrajectoryPrediction } from "../services/api";
import { AnalysisRun, TrendDataPoint } from '../types';
import { 
  TrendingUp, 
  Cpu, 
  ShieldCheck, 
  Layers, 
  Info, 
  GitBranch, 
  Sparkles,
  BarChart,
  LineChart as LineChartIcon
} from 'lucide-react';
import { getStatusTextHex } from '../utils/helpers';
import { TrendChart } from './TrendChart';
import {
  ResponsiveContainer,
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
} from "recharts";

interface RiskPredictionPageProps {
  currentRun: AnalysisRun;
  trendData: TrendDataPoint[];
}

export const RiskPredictionPage: React.FC<RiskPredictionPageProps> = ({
  currentRun,
  trendData
}) => {
  const statusColor = getStatusTextHex(currentRun.network_status);
  const risk = currentRun.predicted_risk;
  const confidence = currentRun.confidence ?? 97.4;
  const [trajectoryData, setTrajectoryData] = useState<{
  history: { time: number; risk: number }[];
  prediction: { time: number; risk: number }[];
} | null>(null);
  // Feature Importance weights (summing to 100%)
  const features = [
    { name: 'X-band Packet Frame Drop (packet_loss)', importance: 45, color: 'bg-emerald-500' },
    { name: 'Ground-to-Space Link Latency (latency)', importance: 35, color: 'bg-blue-600' },
    { name: 'Multiplexer Node Thread Load (cpu)', importance: 20, color: 'bg-slate-500' }
  ];
  useEffect(() => {
  const loadTrajectory = async () => {
  try {
    const data = await fetchTrajectoryPrediction();
    setTrajectoryData(data);
  } catch (error) {
    console.error("Failed to load trajectory:", error);
  }
};

  

  loadTrajectory();
}, []);

  return (
    <div className="space-y-8 animate-fade-in font-sans">
      {/* Page Title */}
      <div className="rounded-2xl border border-slate-800 bg-[#040814]/30 backdrop-blur-xl p-6 shadow-md flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="p-2.5 rounded-xl bg-slate-900 border border-slate-800 text-cyan-400">
            <TrendingUp className="w-5 h-5" />
          </div>
          <div>
            <h2 className="text-sm sm:text-base font-extrabold text-white tracking-wider uppercase font-mono">
              Predictive ML Risk Deck
            </h2>
            <p className="text-xs text-cyan-400/80 mt-0.5 font-mono">
              Closed-Loop routing telemetry failure forecasts
            </p>
          </div>
        </div>
        <span className="text-[10px] px-2.5 py-1 rounded bg-[#0b142d] text-cyan-400 border border-slate-800 font-bold uppercase tracking-widest font-mono">
          AUTO RE-EVALUATION REGIME
        </span>
      </div>

      {/* Main Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* ML Risk Score */}
        <div className="rounded-2xl border border-slate-800 bg-[#040814]/30 p-6 shadow-md">
          <span className="text-xs text-slate-400 uppercase tracking-widest font-bold font-mono block mb-1">
            Predicted Link Risk
          </span>
          <div className="my-3 flex items-baseline gap-1.5 font-mono">
            <span className="text-4xl font-bold" style={{ color: statusColor }}>
              {risk}%
            </span>
            <span className="text-xs text-slate-500">FAILURE PROBABILITY</span>
          </div>
          <div className="w-full h-1.5 bg-slate-950 rounded-full overflow-hidden border border-slate-900 mt-4">
            <div 
              className="h-full transition-all duration-1000" 
              style={{ width: `${risk}%`, backgroundColor: statusColor }} 
            />
          </div>
          <p className="text-[10px] text-slate-500 mt-3 font-sans leading-relaxed">
            Derived from continuous feature weighting of orbital downlink nodes and buffer congestion indexes.
          </p>
        </div>

        {/* Model Meta */}
        <div className="rounded-2xl border border-slate-800 bg-[#040814]/30 p-6 shadow-md">
          <span className="text-xs text-slate-400 uppercase tracking-widest font-bold font-mono block mb-1">
            Core ML Model Used
          </span>
          <div className="my-3 flex items-center gap-2 font-mono">
            <div className="p-1.5 rounded bg-slate-900 border border-slate-800 text-cyan-400">
              <Cpu className="w-4 h-4" />
            </div>
            <span className="text-lg font-bold text-white">
              Phi-3 (Quantized Edge)
            </span>
          </div>
          <p className="text-[10px] text-cyan-300 bg-[#0b142d] px-2 py-1.5 rounded border border-slate-800 uppercase font-mono">
            MODEL ARCHITECTURE: <span className="text-slate-300">3.8 Billion Params</span>
          </p>
          <p className="text-[10px] text-slate-500 mt-2 font-sans leading-relaxed">
            Optimized local weights deployed on ground-station edge hardware, bypassed cloud relays.
          </p>
        </div>

        {/* Inference Confidence */}
        <div className="rounded-2xl border border-slate-800 bg-[#040814]/30 p-6 shadow-md">
          <span className="text-xs text-slate-400 uppercase tracking-widest font-bold font-mono block mb-1">
            Model Weight Confidence
          </span>
          <div className="my-3 flex items-baseline gap-1.5 font-mono">
            <span className="text-4xl font-bold text-slate-200">
              {confidence}%
            </span>
            <span className="text-xs text-slate-500">DECISION MATCHING</span>
          </div>
          <div className="w-full h-1.5 bg-slate-950 rounded-full overflow-hidden border border-slate-900 mt-4">
            <div 
              className="h-full bg-gradient-to-r from-cyan-500 to-sky-400 transition-all duration-1000" 
              style={{ width: `${confidence}%` }} 
            />
          </div>
          <p className="text-[10px] text-slate-500 mt-3 font-sans leading-relaxed">
            Statistical consistency level of current node predictions against historic ISRO downlink vectors.
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Feature Importance Panel */}
        <div className="rounded-2xl border border-slate-800 bg-[#060D1F]/80 p-5 backdrop-blur-xl shadow-xl">
          <div className="flex items-center gap-2.5 pb-3 border-b border-slate-800/80 mb-4">
            <Layers className="w-4 h-4 text-cyan-400" />
            <h3 className="font-extrabold text-xs sm:text-sm text-white uppercase tracking-wider font-mono">
              Feature Importance Weights
            </h3>
          </div>

          <div className="space-y-4 pt-1">
            {features.map((feature, idx) => (
              <div key={idx} className="space-y-1.5 font-mono">
                <div className="flex items-center justify-between text-xs">
                  <span className="text-slate-300 font-sans truncate">{feature.name}</span>
                  <span className="text-white font-bold">{feature.importance}%</span>
                </div>
                <div className="w-full h-2 bg-slate-950 rounded-full overflow-hidden border border-slate-900">
                  <div 
                    className={`h-full ${feature.color} rounded-full transition-all duration-500`}
                    style={{ width: `${feature.importance}%` }}
                  />
                </div>
              </div>
            ))}
          </div>

          <div className="mt-5 p-3 rounded-xl bg-blue-950/20 border border-blue-900/30 text-[10px] text-slate-400 flex items-start gap-2 font-sans leading-relaxed">
            <Info className="w-4 h-4 text-cyan-400 shrink-0 mt-0.5" />
            <div>
              <strong>Technical Note:</strong> Feature importances define the relative contribution of each ground link metric to the final risk probability calculated by the model. Packet frame drop remains the primary driver.
            </div>
          </div>
        </div>

        {/* Future Graph Placeholder */}
        <div className="rounded-2xl border border-slate-800 bg-[#060D1F]/80 p-5 backdrop-blur-xl shadow-xl flex flex-col justify-between">
          <div className="flex items-center justify-between pb-3 border-b border-slate-800/80 mb-4">
            <div className="flex items-center gap-2.5">
              <GitBranch className="w-4 h-4 text-cyan-400" />
              <h3 className="font-extrabold text-xs sm:text-sm text-white uppercase tracking-wider font-mono">
                Future ML Trajectory Predictions
              </h3>
            </div>
            <span className="text-[9px] px-1.5 py-0.5 rounded bg-black border border-slate-800 text-slate-400 font-mono">
              SIMULATION ACTIVE
            </span>
          </div>

   <div className="h-[220px]">
  {trajectoryData ? (
    <ResponsiveContainer width="100%" height="100%">
      <LineChart
       data={[
  ...trajectoryData.history.map((p) => ({
    time: p.time,
    risk: p.risk,
    predictedRisk: null,
  })),
  ...trajectoryData.prediction.map((p) => ({
    time: p.time,
    risk: null,
    predictedRisk: p.risk,
  })),
]}
        margin={{ top: 10, right: 20, left: 0, bottom: 10 }}
      >
        <CartesianGrid stroke="#1e293b" strokeDasharray="3 3" />

        <XAxis
          dataKey="time"
          stroke="#94a3b8"
          tickLine={false}
          axisLine={{ stroke: "#334155" }}
        />

        <YAxis
          domain={[0, 100]}
          stroke="#94a3b8"
          tickLine={false}
          axisLine={{ stroke: "#334155" }}
        />

        <Tooltip
          contentStyle={{
            backgroundColor: "#040814",
            borderColor: "#334155",
            borderRadius: "12px",
            color: "#E2E8F0",
          }}
        />

        <Legend />

       <Line
  type="monotone"
  dataKey="risk"
  stroke="#22c55e"
  strokeWidth={3}
  dot={false}
  activeDot={{ r: 5 }}
  name="Historical"
/>

<Line
  type="monotone"
  dataKey="predictedRisk"
  stroke="#38bdf8"
  strokeWidth={3}
  strokeDasharray="6 6"
  dot={false}
  name="Prediction"
/>
      </LineChart>
    </ResponsiveContainer>
  ) : (
    <div className="flex items-center justify-center h-full text-slate-500">
      Loading trajectory...
    </div>
  )}
</div>
      {/* Actual Live/Historical Trend Chart */}
      <div className="min-h-[350px]">
        <TrendChart data={trendData} />
      </div>
    
     </div>
    </div>
  </div>
  );
};
