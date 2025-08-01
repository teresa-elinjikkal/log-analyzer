import React, { useState, useMemo } from 'react';
import { useSelector } from 'react-redux';
import { RootState } from '../redux/store';
import { LogEntry } from '../redux/logsSlice';
import { 
  AlertTriangle, 
  Clock, 
  TrendingUp, 
  Search, 
  Download,
  RefreshCw,
  AlertCircle,
  XCircle,
  Zap,
  Globe,
  Server,
  Database
} from 'lucide-react';

interface ErrorEntry {
  id: string;
  timestamp: string;
  level: 'error' | 'critical' | 'warning';
  message: string;
  source: string;
  statusCode?: number;
  path?: string;
  ip?: string;
  userAgent?: string;
  stackTrace?: string;
  count: number;
  firstSeen: string;
  lastSeen: string;
}

interface Anomaly {
  id: string;
  type: 'spike' | 'pattern' | 'new_error' | 'frequency';
  severity: 'high' | 'medium' | 'low';
  title: string;
  description: string;
  timestamp: string;
  affectedCount: number;
  relatedErrors: string[];
}

export const ErrorsPage: React.FC = () => {
  console.log('ErrorsPage: Component starting to render');
  
  const [selectedTimeRange, setSelectedTimeRange] = useState('24h');
  const [selectedSeverity, setSelectedSeverity] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedError, setSelectedError] = useState<ErrorEntry | null>(null);

  // Get logs from Redux store
  const logs = useSelector((state: RootState) => state.logs.logs);

  // Debug logging
  console.log('ErrorsPage: logs from Redux:', logs);
  console.log('ErrorsPage: logs length:', logs.length);

  try {
    // Parse log message to extract additional information
    const parseLogMessage = (message: string) => {
      const info: any = {};
      
      // Try to extract status code
      const statusMatch = message.match(/status[:\s]*(\d{3})/i);
      if (statusMatch) {
        info.statusCode = parseInt(statusMatch[1]);
      }
      
      // Try to extract path/endpoint
      const pathMatch = message.match(/(?:path|endpoint|route)[:\s]*([^\s]+)/i);
      if (pathMatch) {
        info.path = pathMatch[1];
      }
      
      // Try to extract IP address
      const ipMatch = message.match(/(?:ip|address)[:\s]*(\d{1,3}\.\d{1,3}\.\d{1,3}\.\d{1,3})/i);
      if (ipMatch) {
        info.ip = ipMatch[1];
      }
      
      // Try to extract source/service name
      const sourceMatch = message.match(/(?:service|source|component)[:\s]*([^\s,]+)/i);
      if (sourceMatch) {
        info.source = sourceMatch[1];
      }
      
      // Try to extract user agent
      const uaMatch = message.match(/(?:user.?agent|ua)[:\s]*([^,\n]+)/i);
      if (uaMatch) {
        info.userAgent = uaMatch[1].trim();
      }
      
      // Try to extract stack trace
      const stackMatch = message.match(/(?:stack|trace)[:\s]*([\s\S]+)/i);
      if (stackMatch) {
        info.stackTrace = stackMatch[1].trim();
      }
      
      return info;
    };

    // Process logs to extract error information
    const processedErrors = useMemo(() => {
      console.log('ErrorsPage: Processing logs...');
      const errorMap = new Map<string, ErrorEntry>();
      
      logs.forEach((log: LogEntry) => {
        // Only process ERROR and WARNING level logs
        if (log.level === 'ERROR' || log.level === 'WARNING') {
          // Create a unique key for grouping similar errors
          const errorKey = `${log.level}-${log.message}`;
          
          if (errorMap.has(errorKey)) {
            const existing = errorMap.get(errorKey)!;
            existing.count++;
            existing.lastSeen = log.timestamp;
          } else {
            // Parse additional information from message if available
            const parsedInfo = parseLogMessage(log.message);
            
            errorMap.set(errorKey, {
              id: errorKey,
              timestamp: log.timestamp,
              level: log.level === 'ERROR' ? 'error' : 'warning',
              message: log.message,
              source: parsedInfo.source || 'unknown',
              statusCode: parsedInfo.statusCode,
              path: parsedInfo.path,
              ip: parsedInfo.ip,
              userAgent: parsedInfo.userAgent,
              stackTrace: parsedInfo.stackTrace,
              count: 1,
              firstSeen: log.timestamp,
              lastSeen: log.timestamp
            });
          }
        }
      });
      
      const result = Array.from(errorMap.values()).sort((a, b) => 
        new Date(b.lastSeen).getTime() - new Date(a.lastSeen).getTime()
      );
      
      console.log('ErrorsPage: Processed errors:', result);
      return result;
    }, [logs]);

    // Generate anomalies based on error patterns
    const anomalies = useMemo(() => {
      const anomalyList: Anomaly[] = [];
      
      if (processedErrors.length === 0) return anomalyList;
      
      // Calculate error rate changes
      const now = new Date();
      const oneHourAgo = new Date(now.getTime() - 60 * 60 * 1000);
      const twoHoursAgo = new Date(now.getTime() - 2 * 60 * 60 * 1000);
      
      const recentErrors = processedErrors.filter(error => 
        new Date(error.lastSeen) >= oneHourAgo
      );
      const olderErrors = processedErrors.filter(error => 
        new Date(error.lastSeen) >= twoHoursAgo && new Date(error.lastSeen) < oneHourAgo
      );
      
      const recentCount = recentErrors.reduce((sum, error) => sum + error.count, 0);
      const olderCount = olderErrors.reduce((sum, error) => sum + error.count, 0);
      
      // Detect error rate spikes
      if (olderCount > 0 && recentCount > olderCount * 2) {
        anomalyList.push({
          id: 'spike-1',
          type: 'spike',
          severity: 'high',
          title: 'Error Rate Spike Detected',
          description: `Error rate increased by ${Math.round((recentCount / olderCount - 1) * 100)}% in the last hour`,
          timestamp: new Date().toISOString(),
          affectedCount: recentCount,
          relatedErrors: recentErrors.map(e => e.id)
        });
      }
      
      // Detect new error patterns
      const newErrors = processedErrors.filter(error => 
        new Date(error.firstSeen) >= oneHourAgo
      );
      
      if (newErrors.length > 0) {
        anomalyList.push({
          id: 'new-1',
          type: 'new_error',
          severity: 'medium',
          title: 'New Error Patterns Detected',
          description: `${newErrors.length} new error types started appearing recently`,
          timestamp: new Date().toISOString(),
          affectedCount: newErrors.reduce((sum, error) => sum + error.count, 0),
          relatedErrors: newErrors.map(e => e.id)
        });
      }
      
      // Detect high-frequency errors
      const highFreqErrors = processedErrors.filter(error => error.count > 10);
      if (highFreqErrors.length > 0) {
        anomalyList.push({
          id: 'freq-1',
          type: 'frequency',
          severity: 'medium',
          title: 'High Frequency Errors',
          description: `${highFreqErrors.length} error types occurring frequently`,
          timestamp: new Date().toISOString(),
          affectedCount: highFreqErrors.reduce((sum, error) => sum + error.count, 0),
          relatedErrors: highFreqErrors.map(e => e.id)
        });
      }
      
      return anomalyList;
    }, [processedErrors]);

    // Filter errors based on search and severity
    const filteredErrors = useMemo(() => {
      return processedErrors.filter(error => {
        const matchesSearch = error.message.toLowerCase().includes(searchQuery.toLowerCase()) ||
                             error.source.toLowerCase().includes(searchQuery.toLowerCase()) ||
                             (error.path && error.path.toLowerCase().includes(searchQuery.toLowerCase()));
        const matchesSeverity = selectedSeverity === 'all' || error.level === selectedSeverity;
        return matchesSearch && matchesSeverity;
      });
    }, [processedErrors, searchQuery, selectedSeverity]);

    const getSeverityColor = (level: string) => {
      switch (level) {
        case 'critical': return 'text-red-400 bg-red-900/20 border-red-500/30';
        case 'error': return 'text-orange-400 bg-orange-900/20 border-orange-500/30';
        case 'warning': return 'text-yellow-400 bg-yellow-900/20 border-yellow-500/30';
        default: return 'text-gray-400 bg-gray-900/20 border-gray-500/30';
      }
    };

    const getSeverityIcon = (level: string) => {
      switch (level) {
        case 'critical': return <XCircle className="w-4 h-4" />;
        case 'error': return <AlertCircle className="w-4 h-4" />;
        case 'warning': return <AlertTriangle className="w-4 h-4" />;
        default: return <AlertTriangle className="w-4 h-4" />;
      }
    };

    const getAnomalyIcon = (type: string) => {
      switch (type) {
        case 'spike': return <TrendingUp className="w-4 h-4" />;
        case 'new_error': return <Zap className="w-4 h-4" />;
        case 'frequency': return <Clock className="w-4 h-4" />;
        case 'pattern': return <Globe className="w-4 h-4" />;
        default: return <AlertTriangle className="w-4 h-4" />;
      }
    };

    console.log('ErrorsPage: About to render JSX');
    
    return (
      <div className="space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-white mb-2">Error Analysis</h1>
            <p className="text-gray-400">Monitor and analyze system errors and anomalies</p>
          </div>
          <div className="flex items-center space-x-3">
            <button className="flex items-center space-x-2 px-4 py-2 bg-gray-700 hover:bg-gray-600 text-white rounded-lg transition-colors">
              <Download className="w-4 h-4" />
              <span>Export</span>
            </button>
            <button className="flex items-center space-x-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors">
              <RefreshCw className="w-4 h-4" />
              <span>Refresh</span>
            </button>
          </div>
        </div>

        {/* Debug Info */}
        <div className="bg-gray-800 rounded-xl p-4 border border-gray-700">
          <div className="flex items-center justify-between text-sm">
            <span className="text-gray-400">Total Logs in Store:</span>
            <span className="text-white font-mono">{logs.length}</span>
          </div>
          <div className="flex items-center justify-between text-sm mt-1">
            <span className="text-gray-400">Processed Errors:</span>
            <span className="text-white font-mono">{processedErrors.length}</span>
          </div>
          <div className="flex items-center justify-between text-sm mt-1">
            <span className="text-gray-400">Detected Anomalies:</span>
            <span className="text-white font-mono">{anomalies.length}</span>
          </div>
        </div>

        {/* No Data Message */}
        {logs.length === 0 && (
          <div className="bg-gray-800 rounded-xl p-8 border border-gray-700 text-center">
            <AlertTriangle className="w-12 h-12 text-gray-400 mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-white mb-2">No Logs Available</h3>
            <p className="text-gray-400 mb-4">
              No logs have been ingested yet. Go to the Log Ingestion page to add some logs.
            </p>
            <button 
              onClick={() => window.location.href = '#ingestion'}
              className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-lg transition-colors"
            >
              Go to Log Ingestion
            </button>
          </div>
        )}

        {/* Anomalies Section */}
        {anomalies.length > 0 && (
          <div className="bg-gray-800 rounded-xl p-6 border border-gray-700">
            <div className="flex items-center space-x-2 mb-6">
              <Zap className="w-5 h-5 text-yellow-400" />
              <h2 className="text-xl font-semibold text-white">Detected Anomalies</h2>
              <span className="bg-yellow-500 text-black text-xs px-2 py-1 rounded-full font-medium">
                {anomalies.length}
              </span>
            </div>
            
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
              {anomalies.map((anomaly) => (
                <div key={anomaly.id} className="bg-gray-700 rounded-lg p-4 border border-gray-600 hover:border-gray-500 transition-colors">
                  <div className="flex items-start justify-between mb-3">
                    <div className="flex items-center space-x-2">
                      <div className={`p-2 rounded-lg ${
                        anomaly.severity === 'high' ? 'bg-red-600' :
                        anomaly.severity === 'medium' ? 'bg-yellow-600' : 'bg-blue-600'
                      }`}>
                        {getAnomalyIcon(anomaly.type)}
                      </div>
                      <div>
                        <h3 className="text-white font-medium">{anomaly.title}</h3>
                        <p className="text-gray-400 text-sm">{anomaly.description}</p>
                      </div>
                    </div>
                    <span className={`text-xs px-2 py-1 rounded-full ${
                      anomaly.severity === 'high' ? 'bg-red-900 text-red-300' :
                      anomaly.severity === 'medium' ? 'bg-yellow-900 text-yellow-300' : 'bg-blue-900 text-blue-300'
                    }`}>
                      {anomaly.severity}
                    </span>
                  </div>
                  <div className="flex items-center justify-between text-sm text-gray-400">
                    <span>{anomaly.affectedCount} affected</span>
                    <span>{new Date(anomaly.timestamp).toLocaleTimeString()}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Filters and Search */}
        {logs.length > 0 && (
          <div className="bg-gray-800 rounded-xl p-6 border border-gray-700">
            <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between space-y-4 lg:space-y-0">
              <div className="flex flex-col sm:flex-row sm:items-center space-y-3 sm:space-y-0 sm:space-x-4">
                <div className="relative">
                  <Search className="w-4 h-4 text-gray-400 absolute left-3 top-1/2 transform -translate-y-1/2" />
                  <input
                    type="text"
                    placeholder="Search errors..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="bg-gray-700 text-white rounded-lg pl-10 pr-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 border border-gray-600 w-full sm:w-64"
                  />
                </div>
                
                <div className="flex items-center space-x-3">
                  <select
                    value={selectedSeverity}
                    onChange={(e) => setSelectedSeverity(e.target.value)}
                    className="bg-gray-700 text-white rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 border border-gray-600"
                  >
                    <option value="all">All Severities</option>
                    <option value="error">Error</option>
                    <option value="warning">Warning</option>
                  </select>
                  
                  <select
                    value={selectedTimeRange}
                    onChange={(e) => setSelectedTimeRange(e.target.value)}
                    className="bg-gray-700 text-white rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 border border-gray-600"
                  >
                    <option value="1h">Last Hour</option>
                    <option value="24h">Last 24 Hours</option>
                    <option value="7d">Last 7 Days</option>
                    <option value="30d">Last 30 Days</option>
                  </select>
                </div>
              </div>
              
              <div className="text-sm text-gray-400">
                Showing {filteredErrors.length} of {processedErrors.length} errors
              </div>
            </div>
          </div>
        )}

        {/* Errors List */}
        {logs.length > 0 && (
          <div className="bg-gray-800 rounded-xl border border-gray-700 overflow-hidden">
            <div className="p-6 border-b border-gray-700">
              <h2 className="text-xl font-semibold text-white">Error Log</h2>
              {processedErrors.length === 0 && (
                <p className="text-gray-400 text-sm mt-2">No errors detected in the current logs.</p>
              )}
            </div>
            
            {processedErrors.length > 0 && (
              <div className="divide-y divide-gray-700">
                {filteredErrors.map((error) => (
                  <div 
                    key={error.id} 
                    className="p-6 hover:bg-gray-750 transition-colors cursor-pointer"
                    onClick={() => setSelectedError(error)}
                  >
                    <div className="flex items-start justify-between">
                      <div className="flex items-start space-x-4 flex-1">
                        <div className={`flex items-center space-x-2 px-3 py-1 rounded-full border ${getSeverityColor(error.level)}`}>
                          {getSeverityIcon(error.level)}
                          <span className="text-xs font-medium uppercase">{error.level}</span>
                        </div>
                        
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center space-x-3 mb-2">
                            <h3 className="text-white font-medium truncate">{error.message}</h3>
                            <span className="text-gray-400 text-sm">×{error.count}</span>
                          </div>
                          
                          <div className="flex flex-wrap items-center gap-4 text-sm text-gray-400">
                            <div className="flex items-center space-x-1">
                              <Server className="w-3 h-3" />
                              <span>{error.source}</span>
                            </div>
                            {error.ip && (
                              <div className="flex items-center space-x-1">
                                <Globe className="w-3 h-3" />
                                <span>{error.ip}</span>
                              </div>
                            )}
                            {error.path && (
                              <div className="flex items-center space-x-1">
                                <Database className="w-3 h-3" />
                                <span>{error.path}</span>
                              </div>
                            )}
                            {error.statusCode && (
                              <span className={`px-2 py-1 rounded text-xs ${
                                error.statusCode >= 500 ? 'bg-red-900 text-red-300' :
                                error.statusCode >= 400 ? 'bg-yellow-900 text-yellow-300' : 'bg-green-900 text-green-300'
                              }`}>
                                {error.statusCode}
                              </span>
                            )}
                          </div>
                        </div>
                      </div>
                      
                      <div className="text-right text-sm text-gray-400">
                        <div>{new Date(error.timestamp).toLocaleString()}</div>
                        <div className="mt-1">
                          First: {new Date(error.firstSeen).toLocaleTimeString()}
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* Error Detail Modal */}
        {selectedError && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
            <div className="bg-gray-800 rounded-xl max-w-4xl w-full max-h-[90vh] overflow-y-auto">
              <div className="p-6 border-b border-gray-700 flex items-center justify-between">
                <h2 className="text-xl font-semibold text-white">Error Details</h2>
                <button
                  onClick={() => setSelectedError(null)}
                  className="text-gray-400 hover:text-white transition-colors"
                >
                  <XCircle className="w-6 h-6" />
                </button>
              </div>
              
              <div className="p-6 space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <h3 className="text-white font-medium mb-3">Error Information</h3>
                    <div className="space-y-3 text-sm">
                      <div className="flex justify-between">
                        <span className="text-gray-400">Message:</span>
                        <span className="text-white">{selectedError.message}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-400">Level:</span>
                        <span className={`px-2 py-1 rounded text-xs ${getSeverityColor(selectedError.level)}`}>
                          {selectedError.level}
                        </span>
                      </div>
                      {selectedError.statusCode && (
                        <div className="flex justify-between">
                          <span className="text-gray-400">Status Code:</span>
                          <span className="text-white">{selectedError.statusCode}</span>
                        </div>
                      )}
                      <div className="flex justify-between">
                        <span className="text-gray-400">Source:</span>
                        <span className="text-white">{selectedError.source}</span>
                      </div>
                      {selectedError.path && (
                        <div className="flex justify-between">
                          <span className="text-gray-400">Path:</span>
                          <span className="text-white font-mono text-xs">{selectedError.path}</span>
                        </div>
                      )}
                    </div>
                  </div>
                  
                  <div>
                    <h3 className="text-white font-medium mb-3">Occurrence Details</h3>
                    <div className="space-y-3 text-sm">
                      <div className="flex justify-between">
                        <span className="text-gray-400">Count:</span>
                        <span className="text-white">{selectedError.count}</span>
                      </div>
                      {selectedError.ip && (
                        <div className="flex justify-between">
                          <span className="text-gray-400">IP Address:</span>
                          <span className="text-white font-mono">{selectedError.ip}</span>
                        </div>
                      )}
                      <div className="flex justify-between">
                        <span className="text-gray-400">First Seen:</span>
                        <span className="text-white">{new Date(selectedError.firstSeen).toLocaleString()}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-400">Last Seen:</span>
                        <span className="text-white">{new Date(selectedError.lastSeen).toLocaleString()}</span>
                      </div>
                    </div>
                  </div>
                </div>
                
                {selectedError.stackTrace && (
                  <div>
                    <h3 className="text-white font-medium mb-3">Stack Trace</h3>
                    <div className="bg-gray-900 rounded-lg p-4 overflow-x-auto">
                      <pre className="text-gray-300 text-xs font-mono whitespace-pre-wrap">
                        {selectedError.stackTrace}
                      </pre>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        )}
      </div>
    );
  } catch (error) {
    console.error('ErrorsPage: Error rendering component:', error);
    return (
      <div className="space-y-6">
        <div className="bg-red-900 rounded-xl p-6 border border-red-700">
          <h1 className="text-2xl font-bold text-white mb-4">Error Loading Errors Page</h1>
          <p className="text-red-300 mb-4">There was an error rendering the Errors page:</p>
          <pre className="bg-red-800 p-4 rounded text-red-200 text-sm overflow-auto">
            {error instanceof Error ? error.message : String(error)}
          </pre>
        </div>
      </div>
    );
  }
};