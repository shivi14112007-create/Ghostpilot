export interface TelemetryData {
  latency: number;
  packet_loss: number;
  cpu: number;
}

export type NetworkStatusType = 'Healthy' | 'Warning' | 'Critical';

export interface AnalysisRun {
  id: string;
  status: string;
  network_status: NetworkStatusType;
  predicted_risk: number;
  generated_at: string;
  model: string;
  telemetry: TelemetryData;
  reason: string;
  possible_root_cause: string;
  potential_impact: string;
  recommended_actions: string;
  summary: string;
  confidence?: number;
}

export interface TrendDataPoint {
  time: string;
  risk: number;
  latency: number;
  packetLoss: number;
  cpu?: number;
}

export interface NodeHealthPoint {
  name: string;
  value: number;
  color: string;
}

export interface LogEvent {
  id: string;
  timestamp: string;
  level: 'INFO' | 'WARNING' | 'CRITICAL';
  message: string;
  source: string;
}

export interface RecommendedActionItem {
  id: string;
  text: string;
  priority: 'P0' | 'P1' | 'P2';
  completed?: boolean;
}

export type ThemeMode = 'dark' | 'light';
export type SortOrder = 'newest' | 'oldest';


