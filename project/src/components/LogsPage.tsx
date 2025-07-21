import React, { useState, useEffect } from 'react';
import { 
  Search, 
  Filter, 
  Download, 
  RefreshCw, 
  Calendar,
  Clock,
  AlertTriangle,
  Info,
  CheckCircle,
  XCircle,
  Play,
  Pause,
  ChevronDown,
  ChevronUp,
  Eye,
  Server,
  Globe,
  Database
} from 'lucide-react';

interface LogEntry {
  id: string;
  timestamp: string;
  level: 'info' | 'warn' | 'error' | 'debug';
  message: string;
  source: string;
  ip?: string;
  statusCode?: number;
  responseTime?: number;
  path?: string;
  userAgent?: string;
  details?: any;
}

export const LogsPage: React.FC = () => {
  const [logs, setLogs] = useState<LogEntry[]>([]);
  const [filteredLogs, setFilteredLogs] = useState<LogEntry[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedLevel, setSelectedLevel] = useState('all');
  const [selectedSource, setSelectedSource] = useState('all');
  const [selectedTimeRange, setSelectedTimeRange] = useState('24h');
  const [isStreaming, setIsStreaming] = useState(true);
  const [expandedLog, setExpandedLog] = useState<string | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(50);

  // Mock log data generator
  const generateMockLogs = (): LogEntry[] => {
    const levels: LogEntry['level'][] = ['info', 'warn', 'error', 'debug'];
    const sources = ['api-server', 'auth-service', 'database', 'frontend', 'worker'];
    const paths = ['/api/users', '/api/auth/login', '/api/products', '/health', '/api/orders', '/api/analytics'];
    const messages = [
      'User authentication successful',
      'Database query executed',
      'API request processed',
      'Cache miss for key',
      'File uploaded successfully',
      'Connection timeout',
      'Invalid request parameters',
      'Rate limit exceeded',
      'Memory usage warning',
      'Backup completed successfully'
    ];

    const mockLogs: LogEntry[] = [];
    const now = new Date();

    for (let i = 0; i < 500; i++) {
      const timestamp = new Date(now.getTime() - Math.random() * 24 * 60 * 60 * 1000);
      const level = levels[Math.floor(Math.random() * levels.length)];
      const source = sources[Math.floor(Math.random() * sources.length)];
      const message = messages[Math.floor(Math.random() * messages.length)];
      const path = paths[Math.floor(Math.random() * paths.length)];
      
      mockLogs.push({
        id: `log-${i}`,
        timestamp: timestamp.toISOString(),
        level,
        message,
        source,
        ip: `192.168.1.${Math.floor(Math.random() * 255)}`,
        statusCode: level === 'error' ? 500 : level === 'warn' ? 404 : 200,
        responseTime: Math.floor(Math.random() * 1000) + 50,
        path,
        userAgent: 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36',
        details: {
          userId: `user-${Math.floor(Math.random() * 1000)}`,
          sessionId: `session-${Math.floor(Math.random() * 10000)}`,
          requestId: `req-${Math.floor(Math.random() * 100000)}`
        }
      });
    }

    return mockLogs.sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime());
  };

  useEffect(() => {
    const mockLogs = generateMockLogs();
    setLogs(mockLogs);
    setFilteredLogs(mockLogs);
  }, []);

  // Simulate real-time log streaming
  useEffect(() => {
    if (!isStreaming) return;

    const interval = setInterval(() => {
      const newLog: LogEntry = {
        id: `log-${Date.now()}`,
        timestamp: new Date().toISOString(),
        level: ['info', 'warn', 'error', 'debug'][Math.floor(Math.random() * 4)] as LogEntry['level'],
        message: 'New real-time log entry',
        source: ['api-server', 'auth-service', 'database'][Math.floor(Math.random() * 3)],
        ip: `192.168.1.${Math.floor(Math.random() * 255)}`,
        statusCode: 200,
        responseTime: Math.floor(Math.random() * 500) + 50,
        path: '/api/live',
        details: {
          userId: `user-${Math.floor(Math.random() * 1000)}`,
          requestId: `req-${Math.floor(Math.random() * 100000)}`
        }
      };

      setLogs(prev => [newLog, ...prev.slice(0, 999)]);
    }, 3000);

    return () => clearInterval(interval);
  }, [isStreaming]);

  // Filter logs based on search and filters
  useEffect(() => {
    let filtered = logs;

    if (searchQuery) {
      filtered = filtered.filter(log =>
        log.message.toLowerCase().includes(searchQuery.toLowerCase()) ||
        log.source.toLowerCase().includes(searchQuery.toLowerCase()) ||
        log.path?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        log.ip?.includes(searchQuery)
      );
    }

    if (selectedLevel !== 'all') {
      filtered = filtered.filter(log => log.level === selectedLevel);
    }

    if (selectedSource !== 'all') {
      filtered = filtered.filter(log => log.source === selectedSource);
    }

    setFilteredLogs(filtered);
    setCurrentPage(1);
  }, [logs, searchQuery, selectedLevel, selectedSource]);

  const getLevelIcon = (level: string) => {
    switch (level) {
      case 'error': return <XCircle className="w-4 h-4 text-red-400" />;
      case 'warn': return <AlertTriangle className="w-4 h-4 text-yellow-400" />;
      case 'info': return <Info className="w-4 h-4 text-blue-400" />;
      case 'debug': return <CheckCircle className="w-4 h-4 text-gray-400" />;
      default: return <Info className="w-4 h-4 text-gray-400" />;
    }
  };

  const getLevelColor = (level: string) => {
    switch (level) {
      case 'error': return 'text-red-400 bg-red-900/20 border-red-500/30';
      case 'warn': return 'text-yellow-400 bg-yellow-900/20 border-yellow-500/30';
      case 'info': return 'text-blue-400 bg-blue-900/20 border-blue-500/30';
      case 'debug': return 'text-gray-400 bg-gray-900/20 border-gray-500/30';
      default: return 'text-gray-400 bg-gray-900/20 border-gray-500/30';
    }
  };

  const getStatusCodeColor = (code: number) => {
    if (code >= 500) return 'bg-red-900 text-red-300';
    if (code >= 400) return 'bg-yellow-900 text-yellow-300';
    if (code >= 300) return 'bg-blue-900 text-blue-300';
    return 'bg-green-900 text-green-300';
  };

  const sources = [...new Set(logs.map(log => log.source))];
  const totalPages = Math.ceil(filteredLogs.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const paginatedLogs = filteredLogs.slice(startIndex, startIndex + itemsPerPage);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-white mb-2">Logs</h1>
          <p className="text-gray-400">Real-time log monitoring and search</p>
        </div>
        <div className="flex items-center space-x-3">
          <button
            onClick={() => setIsStreaming(!isStreaming)}
            className={`flex items-center space-x-2 px-4 py-2 rounded-lg font-medium transition-colors ${
              isStreaming
                ? 'bg-red-600 hover:bg-red-700 text-white'
                : 'bg-green-600 hover:bg-green-700 text-white'
            }`}
          >
            {isStreaming ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4" />}
            <span>{isStreaming ? 'Stop Stream' : 'Start Stream'}</span>
          </button>
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

      {/* Filters */}
      <div className="bg-gray-800 rounded-xl p-6 border border-gray-700">
        <div className="grid grid-cols-1 lg:grid-cols-5 gap-4">
          <div className="lg:col-span-2">
            <div className="relative">
              <Search className="w-4 h-4 text-gray-400 absolute left-3 top-1/2 transform -translate-y-1/2" />
              <input
                type="text"
                placeholder="Search logs..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full bg-gray-700 text-white rounded-lg pl-10 pr-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 border border-gray-600"
              />
            </div>
          </div>
          
          <div>
            <select
              value={selectedLevel}
              onChange={(e) => setSelectedLevel(e.target.value)}
              className="w-full bg-gray-700 text-white rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 border border-gray-600"
            >
              <option value="all">All Levels</option>
              <option value="error">Error</option>
              <option value="warn">Warning</option>
              <option value="info">Info</option>
              <option value="debug">Debug</option>
            </select>
          </div>
          
          <div>
            <select
              value={selectedSource}
              onChange={(e) => setSelectedSource(e.target.value)}
              className="w-full bg-gray-700 text-white rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 border border-gray-600"
            >
              <option value="all">All Sources</option>
              {sources.map(source => (
                <option key={source} value={source}>{source}</option>
              ))}
            </select>
          </div>
          
          <div>
            <select
              value={selectedTimeRange}
              onChange={(e) => setSelectedTimeRange(e.target.value)}
              className="w-full bg-gray-700 text-white rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 border border-gray-600"
            >
              <option value="1h">Last Hour</option>
              <option value="24h">Last 24 Hours</option>
              <option value="7d">Last 7 Days</option>
              <option value="30d">Last 30 Days</option>
            </select>
          </div>
        </div>
        
        <div className="flex items-center justify-between mt-4 pt-4 border-t border-gray-700">
          <div className="text-sm text-gray-400">
            Showing {startIndex + 1}-{Math.min(startIndex + itemsPerPage, filteredLogs.length)} of {filteredLogs.length} logs
          </div>
          {isStreaming && (
            <div className="flex items-center space-x-2 text-green-400">
              <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
              <span className="text-sm">Live streaming</span>
            </div>
          )}
        </div>
      </div>

      {/* Logs Table */}
      <div className="bg-gray-800 rounded-xl border border-gray-700 overflow-hidden">
        <div className="overflow-x-auto">
          <div className="divide-y divide-gray-700">
            {paginatedLogs.map((log) => (
              <div key={log.id} className="hover:bg-gray-750 transition-colors">
                <div className="p-4">
                  <div className="flex items-start justify-between">
                    <div className="flex items-start space-x-4 flex-1">
                      <div className={`flex items-center space-x-2 px-2 py-1 rounded-full border text-xs font-medium ${getLevelColor(log.level)}`}>
                        {getLevelIcon(log.level)}
                        <span className="uppercase">{log.level}</span>
                      </div>
                      
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center space-x-3 mb-2">
                          <span className="text-white font-medium">{log.message}</span>
                          {log.statusCode && (
                            <span className={`px-2 py-1 rounded text-xs ${getStatusCodeColor(log.statusCode)}`}>
                              {log.statusCode}
                            </span>
                          )}
                        </div>
                        
                        <div className="flex flex-wrap items-center gap-4 text-sm text-gray-400">
                          <div className="flex items-center space-x-1">
                            <Clock className="w-3 h-3" />
                            <span>{new Date(log.timestamp).toLocaleString()}</span>
                          </div>
                          <div className="flex items-center space-x-1">
                            <Server className="w-3 h-3" />
                            <span>{log.source}</span>
                          </div>
                          {log.ip && (
                            <div className="flex items-center space-x-1">
                              <Globe className="w-3 h-3" />
                              <span>{log.ip}</span>
                            </div>
                          )}
                          {log.path && (
                            <div className="flex items-center space-x-1">
                              <Database className="w-3 h-3" />
                              <span className="font-mono text-xs">{log.path}</span>
                            </div>
                          )}
                          {log.responseTime && (
                            <span>{log.responseTime}ms</span>
                          )}
                        </div>
                      </div>
                    </div>
                    
                    <button
                      onClick={() => setExpandedLog(expandedLog === log.id ? null : log.id)}
                      className="text-gray-400 hover:text-white transition-colors ml-4"
                    >
                      {expandedLog === log.id ? (
                        <ChevronUp className="w-4 h-4" />
                      ) : (
                        <ChevronDown className="w-4 h-4" />
                      )}
                    </button>
                  </div>
                  
                  {expandedLog === log.id && (
                    <div className="mt-4 pt-4 border-t border-gray-700">
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                        <div>
                          <h4 className="text-white font-medium mb-2">Request Details</h4>
                          <div className="space-y-1 text-gray-400">
                            <div><span className="font-medium">ID:</span> {log.id}</div>
                            <div><span className="font-medium">Timestamp:</span> {log.timestamp}</div>
                            <div><span className="font-medium">Source:</span> {log.source}</div>
                            {log.path && <div><span className="font-medium">Path:</span> {log.path}</div>}
                            {log.ip && <div><span className="font-medium">IP:</span> {log.ip}</div>}
                          </div>
                        </div>
                        
                        {log.details && (
                          <div>
                            <h4 className="text-white font-medium mb-2">Additional Details</h4>
                            <div className="bg-gray-900 rounded-lg p-3 overflow-x-auto">
                              <pre className="text-gray-300 text-xs">
                                {JSON.stringify(log.details, null, 2)}
                              </pre>
                            </div>
                          </div>
                        )}
                      </div>
                      
                      {log.userAgent && (
                        <div className="mt-4">
                          <h4 className="text-white font-medium mb-2">User Agent</h4>
                          <div className="bg-gray-900 rounded-lg p-3">
                            <code className="text-gray-300 text-xs break-all">{log.userAgent}</code>
                          </div>
                        </div>
                      )}
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
        
        {/* Pagination */}
        {totalPages > 1 && (
          <div className="p-4 border-t border-gray-700 flex items-center justify-between">
            <div className="text-sm text-gray-400">
              Page {currentPage} of {totalPages}
            </div>
            <div className="flex items-center space-x-2">
              <button
                onClick={() => setCurrentPage(Math.max(1, currentPage - 1))}
                disabled={currentPage === 1}
                className="px-3 py-1 bg-gray-700 hover:bg-gray-600 disabled:bg-gray-800 disabled:text-gray-500 text-white rounded text-sm transition-colors"
              >
                Previous
              </button>
              <button
                onClick={() => setCurrentPage(Math.min(totalPages, currentPage + 1))}
                disabled={currentPage === totalPages}
                className="px-3 py-1 bg-gray-700 hover:bg-gray-600 disabled:bg-gray-800 disabled:text-gray-500 text-white rounded text-sm transition-colors"
              >
                Next
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};