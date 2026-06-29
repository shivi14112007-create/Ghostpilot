import React, { useState } from 'react';
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  ReferenceLine,
  Legend
} from 'recharts';
import { Activity, TrendingUp, Cpu, Zap } from 'lucide-react';
import { TrendDataPoint } from '../types';

interface TrendChartProps {
  data: TrendDataPoint[];
}

export const TrendChart: React.FC<TrendChartProps> = ({ data }) => {
  const [activeMetric, setActiveMetric] = useState<'all' | 'risk' | 'cpu' | 'latency' | 'loss'>('all');

  return (
    <div className="rounded-2xl border border-slate-800/90 bg-[#050A19]/80 backdrop-blur-2xl p-5 sm:p-6 shadow-2xl flex flex-col h-full font-mono">
      {/* Header Controls */}
      <div className="flex flex-wrap items-center justify-between pb-4 mb-4 border-b border-slate-800/90 gap-3">
        <div className="flex items-center gap-2.5">
          <div className="p-2 rounded-lg bg-cyan-500/15 text-cyan-400 border border-cyan-500/40 shadow-[0_0_15px_rgba(0,240,255,0.2)]">
            <TrendingUp className="w-5 h-5" />
          </div>
          <div>
            <h3 className="font-extrabold text-sm sm:text-base text-white tracking-wider uppercase">
              Orbital NOC Telemetry Trajectory
            </h3>
            <p className="text-[11px] text-slate-400">
              Real-time 15-minute sliding window multi-parameter graph
            </p>
          </div>
        </div>

        {/* Metric Filter Buttons */}
        <div className="flex flex-wrap items-center gap-1 bg-black/60 p-1 rounded-xl border border-slate-800">
          {[
            { id: 'all', label: 'ALL' },
            { id: 'risk', label: 'RISK %', color: 'text-cyan-400' },
            { id: 'cpu', label: 'CPU %', color: 'text-[#F36F21]' },
            { id: 'latency', label: 'LATENCY', color: 'text-amber-400' },
            { id: 'loss', label: 'LOSS %', color: 'text-emerald-400' }
          ].map(tab => (
            <button
              key={tab.id}
              onClick={() => setActiveMetric(tab.id as any)}
              className={`px-2.5 py-1 rounded-lg text-[10px] font-bold tracking-wider cursor-pointer transition-all ${
                activeMetric === tab.id
                  ? 'bg-slate-800 text-white shadow border border-slate-700 font-extrabold'
                  : 'text-slate-500 hover:text-slate-300'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>
      </div>

      {/* Recharts Container */}
      <div className="flex-1 w-full min-h-[260px] sm:min-h-[300px]">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={data} margin={{ top: 15, right: 15, left: -15, bottom: 5 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="#1E293B" vertical={false} />
            <XAxis
              dataKey="time"
              stroke="#64748B"
              fontSize={11}
              tickLine={false}
              axisLine={{ stroke: '#334155' }}
            />
            <YAxis
              stroke="#64748B"
              fontSize={11}
              tickLine={false}
              axisLine={{ stroke: '#334155' }}
              domain={[0, 100]}
            />
            <Tooltip
              contentStyle={{
                backgroundColor: '#040814',
                borderColor: '#334155',
                borderRadius: '0.75rem',
                fontFamily: 'monospace',
                fontSize: '12px',
                color: '#E2E8F0',
                boxShadow: '0 10px 30px -5px rgba(0, 0, 0, 0.7)',
              }}
              formatter={(val: any, name: any) => [
                `${val}${name.includes('Loss') || name.includes('Risk') || name.includes('CPU') ? '%' : ' ms'}`,
                name
              ]}
            />
            <ReferenceLine y={80} stroke="#EF4444" strokeDasharray="3 3" label={{ value: 'CRIT LIMIT', fill: '#EF4444', fontSize: 9, position: 'insideTopRight' }} />
            
            {(activeMetric === 'all' || activeMetric === 'risk') && (
              <Line
                type="monotone"
                dataKey="risk"
                name="Risk Score"
                stroke="#00F0FF"
                strokeWidth={2.5}
                dot={{ r: 3, fill: '#040814', stroke: '#00F0FF', strokeWidth: 2 }}
                activeDot={{ r: 6, fill: '#00F0FF' }}
                animationDuration={800}
              />
            )}

            {(activeMetric === 'all' || activeMetric === 'cpu') && (
              <Line
                type="monotone"
                dataKey="cpu"
                name="CPU Usage"
                stroke="#F36F21"
                strokeWidth={2}
                dot={false}
                activeDot={{ r: 5, fill: '#F36F21' }}
                animationDuration={800}
              />
            )}

            {(activeMetric === 'all' || activeMetric === 'latency') && (
              <Line
                type="monotone"
                dataKey="latency"
                name="Latency Index"
                stroke="#F59E0B"
                strokeWidth={2}
                strokeDasharray="4 4"
                dot={false}
                activeDot={{ r: 5, fill: '#F59E0B' }}
                animationDuration={800}
              />
            )}

            {(activeMetric === 'all' || activeMetric === 'loss') && (
              <Line
                type="monotone"
                dataKey="packetLoss"
                name="Packet Loss"
                stroke="#10B981"
                strokeWidth={2}
                dot={false}
                activeDot={{ r: 5, fill: '#10B981' }}
                animationDuration={800}
              />
            )}
          </LineChart>
        </ResponsiveContainer>
      </div>

      <div className="mt-4 pt-3 border-t border-slate-800/80 flex flex-wrap items-center justify-between text-[10px] text-slate-500">
        <span>INTERPOLATION: <strong className="text-slate-300">MONOTONIC SPLINE</strong></span>
        <span>PEAK RISK DETECTED: <strong className="text-cyan-400">88.2%</strong></span>
      </div>
    </div>
  );
};

