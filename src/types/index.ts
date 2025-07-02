export interface LogEntry {
  id: string;
  timestamp: Date;
  level: 'ERROR' | 'WARN' | 'INFO' | 'DEBUG';
  message: string;
  source: string;
  ip?: string;
  userAgent?: string;
  responseTime?: number;
  statusCode?: number;
  method?: string;
  path?: string;
}

export interface LogStats {
  totalLogs: number;
  errorCount: number;
  warningCount: number;
  infoCount: number;
  avgResponseTime: number;
  topIPs: Array<{ ip: string; count: number }>;
  topPaths: Array<{ path: string; count: number }>;
  statusCodes: Array<{ code: number; count: number }>;
}

export interface ChartDataPoint {
  timestamp: string;
  value: number;
  label?: string;
}

export type ViewMode = 'dashboard' | 'logs' | 'search' | 'analytics' | 'settings';