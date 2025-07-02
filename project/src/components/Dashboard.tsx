import React from 'react';
import { LogStats, ChartDataPoint } from '../types';
import { 
  Activity, 
  AlertTriangle, 
  Info, 
  Clock, 
  Globe,
  TrendingUp,
  Server,
  Zap
} from 'lucide-react';

interface DashboardProps {
  stats: LogStats;
  isStreaming: boolean;
  onToggleStreaming: () => void;
}

export const Dashboard: React.FC<DashboardProps> = ({ stats, isStreaming, onToggleStreaming }) => {
  // Generate time series data for the last 24 hours
  const generateTimeSeriesData = (): ChartDataPoint[] => {
    const now = new Date();
    const data: ChartDataPoint[] = [];
    
    for (let i = 23; i >= 0; i--) {
      const timestamp = new Date(now.getTime() - i * 60 * 60 * 1000);
      data.push({
        timestamp: timestamp.toISOString(),
        value: Math.floor(Math.random() * 100) + 20,
        label: timestamp.getHours().toString().padStart(2, '0') + ':00'
      });
    }
    
    return data;
  };

  const timeSeriesData = generateTimeSeriesData();
  const maxValue = Math.max(...timeSeriesData.map(d => d.value));

  const StatCard: React.FC<{
    title: string;
    value: string | number;
    icon: React.ReactNode;
    trend?: string;
    color: string;
  }> = ({ title, value, icon, trend, color }) => (
    <div className="bg-gray-800 rounded-xl p-6 border border-gray-700 hover:border-gray-600 transition-all duration-200 hover:shadow-lg">
      <div className="flex items-center justify-between mb-4">
        <div className={`p-3 rounded-lg ${color}`}>
          {icon}
        </div>
        {trend && (
          <span className="text-xs text-green-400 font-medium flex items-center">
            <TrendingUp className="w-3 h-3 mr-1" />
            {trend}
          </span>
        )}
      </div>
      <div>
        <p className="text-2xl font-bold text-white mb-1">{value}</p>
        <p className="text-gray-400 text-sm">{title}</p>
      </div>
    </div>
  );

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-white mb-2">Dashboard</h1>
          <p className="text-gray-400">Real-time log monitoring and analytics</p>
        </div>
        <button
          onClick={onToggleStreaming}
          className={`flex items-center space-x-2 px-4 py-2 rounded-lg font-medium transition-all duration-200 ${
            isStreaming
              ? 'bg-red-600 hover:bg-red-700 text-white'
              : 'bg-green-600 hover:bg-green-700 text-white'
          }`}
        >
          <Zap className="w-4 h-4" />
          <span>{isStreaming ? 'Stop Streaming' : 'Start Streaming'}</span>
        </button>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard
          title="Total Logs"
          value={stats.totalLogs.toLocaleString()}
          icon={<Activity className="w-6 h-6 text-white" />}
          trend="+12%"
          color="bg-blue-600"
        />
        <StatCard
          title="Errors"
          value={stats.errorCount}
          icon={<AlertTriangle className="w-6 h-6 text-white" />}
          color="bg-red-600"
        />
        <StatCard
          title="Warnings"
          value={stats.warningCount}
          icon={<Info className="w-6 h-6 text-white" />}
          color="bg-yellow-600"
        />
        <StatCard
          title="Avg Response Time"
          value={`${stats.avgResponseTime}ms`}
          icon={<Clock className="w-6 h-6 text-white" />}
          trend="-5%"
          color="bg-green-600"
        />
      </div>

      {/* Charts Row */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Log Volume Chart */}
        <div className="bg-gray-800 rounded-xl p-6 border border-gray-700">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-lg font-semibold text-white">Log Volume (24h)</h3>
            <div className="flex items-center space-x-1">
              <div className="w-2 h-2 bg-blue-400 rounded-full animate-pulse"></div>
              <span className="text-xs text-gray-400">Live</span>
            </div>
          </div>
          <div className="h-64">
            <svg viewBox="0 0 400 200" className="w-full h-full">
              <defs>
                <linearGradient id="chartGradient" x1="0%" y1="0%" x2="0%" y2="100%">
                  <stop offset="0%" stopColor="#3B82F6" stopOpacity="0.3" />
                  <stop offset="100%" stopColor="#3B82F6" stopOpacity="0" />
                </linearGradient>
              </defs>
              
              {/* Grid lines */}
              {[0, 1, 2, 3, 4].map(i => (
                <line
                  key={i}
                  x1="0"
                  y1={i * 40}
                  x2="400"
                  y2={i * 40}
                  stroke="#374151"
                  strokeWidth="1"
                  opacity="0.3"
                />
              ))}
              
              {/* Chart line */}
              <polyline
                fill="url(#chartGradient)"
                stroke="#3B82F6"
                strokeWidth="2"
                points={timeSeriesData.map((point, index) => 
                  `${(index / (timeSeriesData.length - 1)) * 400},${200 - (point.value / maxValue) * 180}`
                ).join(' ')}
              />
              
              {/* Data points */}
              {timeSeriesData.map((point, index) => (
                <circle
                  key={index}
                  cx={(index / (timeSeriesData.length - 1)) * 400}
                  cy={200 - (point.value / maxValue) * 180}
                  r="3"
                  fill="#3B82F6"
                  className="hover:r-5 transition-all duration-200"
                />
              ))}
            </svg>
          </div>
        </div>

        {/* Status Codes Distribution */}
        <div className="bg-gray-800 rounded-xl p-6 border border-gray-700">
          <h3 className="text-lg font-semibold text-white mb-6">Status Code Distribution</h3>
          <div className="space-y-4">
            {stats.statusCodes.slice(0, 6).map((status, index) => {
              const percentage = (status.count / stats.totalLogs) * 100;
              const color = status.code >= 500 ? 'bg-red-500' :
                           status.code >= 400 ? 'bg-yellow-500' :
                           status.code >= 300 ? 'bg-blue-500' : 'bg-green-500';
              
              return (
                <div key={status.code} className="flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    <div className={`w-3 h-3 rounded-full ${color}`}></div>
                    <span className="text-gray-300 font-medium">{status.code}</span>
                  </div>
                  <div className="flex items-center space-x-3">
                    <div className="w-24 h-2 bg-gray-700 rounded-full overflow-hidden">
                      <div 
                        className={`h-full ${color} transition-all duration-500`}
                        style={{ width: `${percentage}%` }}
                      ></div>
                    </div>
                    <span className="text-gray-400 text-sm w-12 text-right">{status.count}</span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* Bottom Row */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Top IPs */}
        <div className="bg-gray-800 rounded-xl p-6 border border-gray-700">
          <div className="flex items-center space-x-2 mb-6">
            <Globe className="w-5 h-5 text-blue-400" />
            <h3 className="text-lg font-semibold text-white">Top IP Addresses</h3>
          </div>
          <div className="space-y-4">
            {stats.topIPs.map((ip, index) => (
              <div key={ip.ip} className="flex items-center justify-between py-2">
                <div className="flex items-center space-x-3">
                  <div className="w-6 h-6 bg-gray-700 rounded text-xs flex items-center justify-center text-gray-300">
                    {index + 1}
                  </div>
                  <span className="text-gray-300 font-mono">{ip.ip}</span>
                </div>
                <span className="text-blue-400 font-medium">{ip.count}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Top Paths */}
        <div className="bg-gray-800 rounded-xl p-6 border border-gray-700">
          <div className="flex items-center space-x-2 mb-6">
            <Server className="w-5 h-5 text-green-400" />
            <h3 className="text-lg font-semibold text-white">Top Requested Paths</h3>
          </div>
          <div className="space-y-4">
            {stats.topPaths.map((path, index) => (
              <div key={path.path} className="flex items-center justify-between py-2">
                <div className="flex items-center space-x-3">
                  <div className="w-6 h-6 bg-gray-700 rounded text-xs flex items-center justify-center text-gray-300">
                    {index + 1}
                  </div>
                  <span className="text-gray-300 font-mono text-sm">{path.path}</span>
                </div>
                <span className="text-green-400 font-medium">{path.count}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};