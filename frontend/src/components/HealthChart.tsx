import React from 'react';
import {
  PieChart,
  Pie,
  Cell,
  Tooltip,
  ResponsiveContainer,
  Legend,
} from 'recharts';
import { ShieldCheck, PieChart as PieIcon } from 'lucide-react';
import { NodeHealthPoint } from '../types';

interface HealthChartProps {
  data: NodeHealthPoint[];
}

export const HealthChart: React.FC<HealthChartProps> = ({ data }) => {
  const totalNodes = data.reduce((acc, curr) => acc + curr.value, 0);

  return (
    <div className="rounded-2xl border border-slate-800/80 bg-[#0B132B]/60 backdrop-blur-md p-6 shadow-2xl flex flex-col h-full">
      <div className="flex items-center justify-between pb-4 mb-6 border-b border-slate-800">
        <div className="flex items-center gap-2.5">
          <div className="p-2 rounded-lg bg-emerald-500/10 text-emerald-400 border border-emerald-500/30">
            <PieIcon className="w-5 h-5" />
          </div>
          <div>
            <h3 className="font-bold text-base text-white font-mono tracking-wide uppercase">
              Orbital Node Health
            </h3>
            <p className="text-xs text-slate-400 font-sans">
              Ground station & relay node distribution
            </p>
          </div>
        </div>
        <span className="text-xs font-mono font-bold px-2.5 py-1 rounded bg-slate-900 border border-slate-700 text-cyan-300">
          {totalNodes} NODES
        </span>
      </div>

      <div className="flex-1 w-full min-h-[240px] sm:min-h-[280px] relative flex items-center justify-center">
        <ResponsiveContainer width="100%" height="100%">
          <PieChart>
            <Pie
              data={data}
              cx="50%"
              cy="50%"
              innerRadius={65}
              outerRadius={95}
              paddingAngle={5}
              dataKey="value"
            >
              {data.map((entry, index) => (
                <Cell 
                  key={`cell-${index}`} 
                  fill={entry.color}
                  stroke="#0B132B"
                  strokeWidth={2}
                />
              ))}
            </Pie>
            <Tooltip
              contentStyle={{
                backgroundColor: '#050814',
                borderColor: '#334155',
                borderRadius: '0.75rem',
                fontFamily: 'monospace',
                fontSize: '12px',
                color: '#E2E8F0',
                boxShadow: '0 10px 25px -5px rgba(0, 0, 0, 0.5)',
              }}
              formatter={(value: any) => [`${value}%`, 'Node Distribution']}
            />
            <Legend 
              verticalAlign="bottom" 
              height={36}
              iconType="circle"
              formatter={(value, entry: any) => (
                <span className="text-xs font-mono text-slate-300 ml-1">
                  {value} ({entry.payload.value}%)
                </span>
              )}
            />
          </PieChart>
        </ResponsiveContainer>

        {/* Center Text inside Doughnut */}
        <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none pb-8">
          <span className="text-2xl sm:text-3xl font-extrabold text-white font-mono tracking-tight">
            {data.find(n => n.name.includes('Healthy'))?.value || 92}%
          </span>
          <span className="text-[9px] font-mono text-slate-400 tracking-wider">
            NOMINAL NOC
          </span>
        </div>
      </div>

      <div className="mt-4 pt-3 border-t border-slate-800 flex justify-between text-[11px] font-mono text-slate-400">
        <span>GATEWAY BUS: <strong className="text-emerald-400">NOMINAL</strong></span>
        <span>FAILOVER READY: <strong className="text-cyan-400">ACTIVE</strong></span>
      </div>
    </div>
  );
};
