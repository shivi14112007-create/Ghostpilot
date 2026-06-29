import { NetworkStatusType } from '../types';

export function getStatusColorClass(status: NetworkStatusType): string {
  switch (status) {
    case 'Healthy':
      return 'text-emerald-400 bg-emerald-950/50 border-emerald-500/40 shadow-[0_0_15px_rgba(16,185,129,0.15)]';
    case 'Warning':
      return 'text-amber-400 bg-amber-950/50 border-amber-500/40 shadow-[0_0_15px_rgba(245,158,11,0.15)]';
    case 'Critical':
      return 'text-red-400 bg-red-950/50 border-red-500/40 shadow-[0_0_15px_rgba(239,68,68,0.25)]';
    default:
      return 'text-cyan-400 bg-cyan-950/50 border-cyan-500/40';
  }
}

export function getStatusDotColor(status: NetworkStatusType): string {
  switch (status) {
    case 'Healthy':
      return 'bg-emerald-400 shadow-[0_0_8px_#10B981]';
    case 'Warning':
      return 'bg-amber-400 shadow-[0_0_8px_#F59E0B]';
    case 'Critical':
      return 'bg-red-500 shadow-[0_0_8px_#EF4444] animate-pulse';
    default:
      return 'bg-cyan-400';
  }
}

export function getStatusTextHex(status: NetworkStatusType): string {
  switch (status) {
    case 'Healthy':
      return '#10B981';
    case 'Warning':
      return '#F59E0B';
    case 'Critical':
      return '#EF4444';
    default:
      return '#00F0FF';
  }
}

export function formatISROTimestamp(dateString?: string): string {
  if (!dateString) {
    const now = new Date();
    return `${now.toISOString().replace('T', ' ').substring(0, 19)} UTC`;
  }
  return dateString;
}
