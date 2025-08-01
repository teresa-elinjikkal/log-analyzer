export interface LogStats {
  totalLogs: number;          // total log entries
  errorCount: number;
  warningCount: number;
  avgResponseTime: number;    // in ms

  statusCodes: Array<{ code: number; count: number }>;

  topIPs: Array<{ ip: string; count: number }>;
  topPaths: Array<{ path: string; count: number }>;

  // Add these fields for the dashboard metrics
  totalRequests: number;
  totalRequestsChange: number;    // percentage change, e.g. +12.5
  uniqueUsers: number;
  uniqueUsersChange: number;      // percentage change
  errorRate: number;              // 0.0 - 1.0 (e.g., 0.008 means 0.8%)
  errorRateChange: number;        // percentage change
  avgResponseTimeChange: number;  // percentage change
  uptime: number;                 // percent (0-100)
  uptimeChange: number;           // percentage change
  dataTransfer: number;           // in bytes
  dataTransferChange: number;     // percentage change

  // Additional arrays for charts (optional)
  requestsOverTime?: Array<{ label: string; value: number }>;
  topEndpoints?: Array<{ label: string; value: number }>;
  geographicDistribution?: Array<{ label: string; value: number }>;
  deviceTypes?: Array<{ label: string; value: number }>;
}
