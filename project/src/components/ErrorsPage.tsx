import React, { useState } from 'react';
import { 
  AlertTriangle, 
  Clock, 
  TrendingUp, 
  Filter, 
  Search, 
  Download,
  RefreshCw,
  ChevronDown,
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
  statusCode: number;
  path: string;
  ip: string;
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
  const [selectedTimeRange, setSelectedTimeRange] = useState('24h');
  const [selectedSeverity, setSelectedSeverity] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedError, setSelectedError] = useState<ErrorEntry | null>(null);

  // Mock error data
  const errors: ErrorEntry[] = [
    {
      id: '1',
      timestamp: '2025-01-13T10:30:00Z',
      level: 'critical',
      message: 'Database connection timeout',
      source: 'api-server',
      statusCode: 500,
      path: '/api/users',
      ip: '192.168.1.100',
      userAgent: 'Mozilla/5.0...',
      stackTrace: 'Error: Connection timeout\n  at Database.connect()\n  at UserService.getUsers()',
      count: 45,
      firstSeen: '2025-01-13T08:15:00Z',
      lastSeen: '2025-01-13T10:30:00Z'
    },
    {
      id: '2',
      timestamp: '2025-01-13T10:25:00Z',
      level: 'error',
      message: 'Authentication failed for user',
      source: 'auth-service',
      statusCode: 401,
      path: '/api/auth/login',
      ip: '203.0.113.42',
      count: 23,
      firstSeen: '2025-01-13T09:00:00Z',
      lastSeen: '2025-01-13T10:25:00Z'
    },
    {
      id: '3',
      timestamp: '2025-01-13T10:20:00Z',
      level: 'error',
      message: 'Rate limit exceeded',
      source: 'api-gateway',
      statusCode: 429,
      path: '/api/products',
      ip: '198.51.100.15',
      count: 67,
      firstSeen: '2025-01-13T07:30:00Z',
      lastSeen: '2025-01-13T10:20:00Z'
    },
    {
      id: '4',
      timestamp: '2025-01-13T10:15:00Z',
      level: 'warning',
      message: 'Slow query detected',
      source: 'database',
      statusCode: 200,
      path: '/api/analytics',
      ip: '172.16.0.23',
      count: 12,
      firstSeen: '2025-01-13T09:45:00Z',
      lastSeen: '2025-01-13T10:15:00Z'
    },
    {
      id: '5',
      timestamp: '2025-01-13T10:10:00Z',
      level: 'critical',
      message: 'Memory usage critical',
      source: 'app-server',
      statusCode: 503,
      path: '/api/reports',
      ip: '10.0.0.45',
      count: 8,
      firstSeen: '2025-01-13T10:05:00Z',
      lastSeen: '2025-01-13T10:10:00Z'
    }
  ];

  // Mock anomaly data
  const anomalies: Anomaly[] = [
    {
      id: '1',
      type: 'spike',
      severity: 'high',
      title: 'Error Rate Spike Detected',
      description: 'Database connection errors increased by 300% in the last hour',
      timestamp: '2025-01-13T10:30:00Z',
      affectedCount: 45,
      relatedErrors: ['1']
    },
    {
      id: '2',
      type: 'new_error',
      severity: 'medium',
      title: 'New Error Pattern',
      description: 'Memory usage critical errors started appearing 25 minutes ago',
      timestamp: '2025-01-13T10:05:00Z',
      affectedCount: 8,
      relatedErrors: ['5']
    },
    {
      id: '3',
      type: 'frequency',
      severity: 'medium',
      title: 'Unusual Error Frequency',
      description: 'Rate limiting errors occurring more frequently than baseline',
      timestamp: '2025-01-13T09:30:00Z',
      affectedCount: 67,
      relatedErrors: ['3']
    },
    {
      id: '4',
      type: 'pattern',
      severity: 'low',
      title: 'Geographic Pattern Detected',
      description: 'Authentication failures clustered from specific IP ranges',
      timestamp: '2025-01-13T09:00:00Z',
      affectedCount: 23,
      relatedErrors: ['2']
    }
  ];

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

  const filteredErrors = errors.filter(error => {
    const matchesSearch = error.message.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         error.source.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         error.path.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesSeverity = selectedSeverity === 'all' || error.level === selectedSeverity;
    return matchesSearch && matchesSeverity;
  });

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

      {/* Anomalies Section */}
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

      {/* Filters and Search */}
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
                <option value="critical">Critical</option>
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
            Showing {filteredErrors.length} of {errors.length} errors
          </div>
        </div>
      </div>

      {/* Errors List */}
      <div className="bg-gray-800 rounded-xl border border-gray-700 overflow-hidden">
        <div className="p-6 border-b border-gray-700">
          <h2 className="text-xl font-semibold text-white">Error Log</h2>
        </div>
        
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
                      <div className="flex items-center space-x-1">
                        <Globe className="w-3 h-3" />
                        <span>{error.ip}</span>
                      </div>
                      <div className="flex items-center space-x-1">
                        <Database className="w-3 h-3" />
                        <span>{error.path}</span>
                      </div>
                      <span className={`px-2 py-1 rounded text-xs ${
                        error.statusCode >= 500 ? 'bg-red-900 text-red-300' :
                        error.statusCode >= 400 ? 'bg-yellow-900 text-yellow-300' : 'bg-green-900 text-green-300'
                      }`}>
                        {error.statusCode}
                      </span>
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
      </div>

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
                    <div className="flex justify-between">
                      <span className="text-gray-400">Status Code:</span>
                      <span className="text-white">{selectedError.statusCode}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-400">Source:</span>
                      <span className="text-white">{selectedError.source}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-400">Path:</span>
                      <span className="text-white font-mono text-xs">{selectedError.path}</span>
                    </div>
                  </div>
                </div>
                
                <div>
                  <h3 className="text-white font-medium mb-3">Occurrence Details</h3>
                  <div className="space-y-3 text-sm">
                    <div className="flex justify-between">
                      <span className="text-gray-400">Count:</span>
                      <span className="text-white">{selectedError.count}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-400">IP Address:</span>
                      <span className="text-white font-mono">{selectedError.ip}</span>
                    </div>
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
};