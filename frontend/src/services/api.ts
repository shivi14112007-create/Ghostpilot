import axios from 'axios';
import { AnalysisRun, TelemetryData } from '../types';

const BASE_URL = (import.meta as any).env?.VITE_BACKEND_API_URL || 'http://localhost:8000';

export const apiClient = axios.create({
  baseURL: BASE_URL,
  timeout: 120000,
  headers: {
    'Content-Type': 'application/json',
  },
});

export async function submitTelemetryAnalysis(telemetry: TelemetryData): Promise<AnalysisRun> {
  const payload = {
    latency: Math.round(telemetry.latency),
    packet_loss: Math.round(telemetry.packet_loss),
    cpu: Math.round(telemetry.cpu),
  };
  const response = await apiClient.post('/analyze', payload);
  return {
    ...response.data,
    id: `run-${Date.now()}`,
    confidence: undefined,
  } as AnalysisRun;
}

// Fetch analysis history
export async function fetchTelemetryHistory(): Promise<AnalysisRun[]> {
  const response = await apiClient.get('/history');
  return (response.data as any[]).map((item, i) => ({
    ...item,
    id: item.id || `history-${i}`,
    telemetry: item.telemetry || { latency: 0, packet_loss: 0, cpu: 0 },
  })) as AnalysisRun[];
}
export async function fetchTrajectoryPrediction() {
  const response = await apiClient.get("/predict/trajectory");
  return response.data;
}