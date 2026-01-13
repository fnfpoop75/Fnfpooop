
export interface SystemLog {
  id: string;
  timestamp: string;
  message: string;
  type: 'info' | 'warning' | 'error' | 'success';
}

export interface TelemetryData {
  time: string;
  power: number;
  heat: number;
  stability: number;
}

export interface ReactionResponse {
  summary: string;
  analysis: string[];
  threatLevel: 'Low' | 'Medium' | 'High' | 'Critical';
  efficiency: number;
}
