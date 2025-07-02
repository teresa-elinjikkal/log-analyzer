import React, { useState } from 'react';
import { LogEntry } from '../types';
import { 
  Search, 
  Filter, 
  Download, 
  AlertTriangle, 
  Info, 
  Bug,
  Activity,
  RefreshCw,
  Calendar
} from 'lucide-react';

interface LogViewerProps {
  logs: LogEntry[];
  searchQuery: string;
  onSearchChange: (query: string) => void;
  levelFilter: string;
  onLevelFilterChange: (level: string) => void;
}

export const LogViewer: React.FC<LogViewerProps> = ({
  logs,
  searchQuery,
  onSearchChange,
  levelFilter,
  onLevelFilterChange
}) => {
  const [selectedLog, setSelectedLog] = useState<LogEntry | null>(null);

  const getLevelIcon = (level: LogEntry['level']) => {
    switch (level) {
      case 'ERROR': return <AlertTriangle className="w-4 h-4 text-red-400" />;
      case 'WARN': return <Info className="w-4 h-4 text-yellow-400" />;
      case 'DEBUG': return <Bug className="w-4 h-4 text-purple-400" />;
      default: return <Activity className="w-4 h-4 text-blue-400" />;
    }
  };

  const getLevelColor = (level: LogEntry['level']) => {
    switch (level) {
      case 'ERROR': return 'bg-red-900 text-red-200 border-red-700';
      case 'WARN': return 'bg-yellow-900 text-yellow-200 border-yellow-700';
      case 'DEBUG': return 'bg-purple-900 text-purple-200 border-purple-700';
      default: return 'bg-blue-900 text-blue-200 border-blue-700';
    }
  };

  const formatTimestamp = (date: Date) => {
    return date.toLocaleString('en-US', {
      month: 'short',
      day: '2-digit',
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit',
      hour12: false
    });
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-white mb-2">Log Viewer</h1>
          <p className="text-gray-400">Browse and analyze log entries</p>
        </div>
        <button className="flex items-center space-x-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors">
          <Download className="w-4 h-4" />
          <span>Export Logs</span>
        </button>
      </div>

      {/* Filters */}
      <div className="bg-gray-800 rounded-xl p-6 border border-gray-700">
        <div className="flex flex-col lg:flex-row gap-4">
          {/* Search */}
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => onSearchChange(e.target.value)}
              placeholder="Search logs by message, source, IP, or path..."
              className="w-full pl-10 pr-4 py-3 bg-gray-700 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>

          {/* Level Filter */}
          <div className="flex items-center space-x-2">
            <Filter className="text-gray-400 w-5 h-5" />
            <select
              value={levelFilter}
              onChange={(e) => onLevelFilterChange(e.target.value)}
              className="px-4 py-3 bg-gray-700 border border-gray-600 rounded-lg text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              <option value="all">All Levels</option>
              <option value="ERROR">Error</option>
              <option value="WARN">Warning</option>
              <option value="INFO">Info</option>
              <option value="DEBUG">Debug</option>
            </select>
          </div>

          {/* Refresh */}
          <button className="flex items-center space-x-2 px-4 py-3 bg-gray-700 hover:bg-gray-600 text-white rounded-lg transition-colors">
            <RefreshCw className="w-4 h-4" />
            <span>Refresh</span>
          </button>
        </div>
      </div>

      {/* Results Info */}
      <div className="flex items-center justify-between text-sm text-gray-400">
        <span>Showing {logs.length} log entries</span>
        <div className="flex items-center space-x-4">
          <div className="flex items-center space-x-2">
            <div className="w-2 h-2 bg-red-400 rounded-full"></div>
            <span>Error</span>
          </div>
          <div className="flex items-center space-x-2">
            <div className="w-2 h-2 bg-yellow-400 rounded-full"></div>
            <span>Warning</span>
          </div>
          <div className="flex items-center space-x-2">
            <div className="w-2 h-2 bg-blue-400 rounded-full"></div>
            <span>Info</span>
          </div>
          <div className="flex items-center space-x-2">
            <div className="w-2 h-2 bg-purple-400 rounded-full"></div>
            <span>Debug</span>
          </div>
        </div>
      </div>

      {/* Log Entries */}
      <div className="bg-gray-800 rounded-xl border border-gray-700 overflow-hidden">
        <div className="max-h-96 overflow-y-auto">
          {logs.length === 0 ? (
            <div className="p-8 text-center text-gray-400">
              <Activity className="w-12 h-12 mx-auto mb-4 opacity-50" />
              <p>No logs found matching your criteria</p>
            </div>
          ) : (
            <div className="divide-y divide-gray-700">
              {logs.slice(0, 100).map((log) => (
                <div
                  key={log.id}
                  onClick={() => setSelectedLog(log)}
                  className="p-4 hover:bg-gray-750 cursor-pointer transition-colors"
                >
                  <div className="flex items-start space-x-4">
                    {/* Level Icon */}
                    <div className="flex-shrink-0 mt-1">
                      {getLevelIcon(log.level)}
                    </div>

                    {/* Main Content */}
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center space-x-3 mb-2">
                        <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium border ${getLevelColor(log.level)}`}>
                          {log.level}
                        </span>
                        <span className="text-gray-400 text-sm font-mono">
                          {log.source}
                        </span>
                        {log.ip && (
                          <span className="text-gray-500 text-sm font-mono">
                            {log.ip}
                          </span>
                        )}
                        {log.responseTime && (
                          <span className="text-gray-500 text-sm">
                            {log.responseTime}ms
                          </span>
                        )}
                      </div>
                      
                      <p className="text-white text-sm mb-1 break-words">
                        {log.message}
                      </p>
                      
                      <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-4 text-xs text-gray-400">
                          <span className="flex items-center space-x-1">
                            <Calendar className="w-3 h-3" />
                            <span>{formatTimestamp(log.timestamp)}</span>
                          </span>
                          {log.method && log.path && (
                            <span className="font-mono">
                              {log.method} {log.path}
                            </span>
                          )}
                          {log.statusCode && (
                            <span className={`font-mono px-1 rounded ${
                              log.statusCode >= 500 ? 'bg-red-900 text-red-200' :
                              log.statusCode >= 400 ? 'bg-yellow-900 text-yellow-200' :
                              'bg-green-900 text-green-200'
                            }`}>
                              {log.statusCode}
                            </span>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Log Detail Modal */}
      {selectedLog && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-gray-800 rounded-xl p-6 max-w-2xl w-full max-h-96 overflow-y-auto border border-gray-700">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-xl font-bold text-white">Log Details</h3>
              <button
                onClick={() => setSelectedLog(null)}
                className="text-gray-400 hover:text-white transition-colors"
              >
                ×
              </button>
            </div>
            
            <div className="space-y-4">
              <div>
                <label className="text-sm font-medium text-gray-400">Level</label>
                <div className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium border mt-1 ${getLevelColor(selectedLog.level)}`}>
                  {selectedLog.level}
                </div>
              </div>
              
              <div>
                <label className="text-sm font-medium text-gray-400">Timestamp</label>
                <p className="text-white font-mono">{selectedLog.timestamp.toISOString()}</p>
              </div>
              
              <div>
                <label className="text-sm font-medium text-gray-400">Message</label>
                <p className="text-white">{selectedLog.message}</p>
              </div>
              
              <div>
                <label className="text-sm font-medium text-gray-400">Source</label>
                <p className="text-white font-mono">{selectedLog.source}</p>
              </div>
              
              {selectedLog.ip && (
                <div>
                  <label className="text-sm font-medium text-gray-400">IP Address</label>
                  <p className="text-white font-mono">{selectedLog.ip}</p>
                </div>
              )}
              
              {selectedLog.method && selectedLog.path && (
                <div>
                  <label className="text-sm font-medium text-gray-400">Request</label>
                  <p className="text-white font-mono">{selectedLog.method} {selectedLog.path}</p>
                </div>
              )}
              
              {selectedLog.statusCode && (
                <div>
                  <label className="text-sm font-medium text-gray-400">Status Code</label>
                  <p className="text-white font-mono">{selectedLog.statusCode}</p>
                </div>
              )}
              
              {selectedLog.responseTime && (
                <div>
                  <label className="text-sm font-medium text-gray-400">Response Time</label>
                  <p className="text-white font-mono">{selectedLog.responseTime}ms</p>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};