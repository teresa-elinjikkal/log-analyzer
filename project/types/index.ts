export interface LogEntry {
  id: string;
  timestamp: string;
  level: 'info' | 'warn' | 'error' | 'debug';
  message: string;
  source: string;
  ip?: string;
  statusCode?: number;
  responseTime?: number;
  path?: string;
}

export interface LogStats {
  totalLogs: number;
  errorCount: number;
  warningCount: number;
  avgResponseTime: number;
  statusCodes: Array<{ code: number; count: number }>;
  topIPs: Array<{ ip: string; count: number }>;
  topPaths: Array<{ path: string; count: number }>;
}

export interface ChartDataPoint {
  timestamp: string;
  value: number;
  label: string;
}