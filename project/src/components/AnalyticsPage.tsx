import React, { useState } from 'react';
import { 
  BarChart3, 
  TrendingUp, 
  TrendingDown, 
  Activity, 
  Users, 
  Globe, 
  Clock, 
  Server,
  Database,
  Zap,
  AlertTriangle,
  CheckCircle,
  Calendar,
  Download,
  RefreshCw,
  Filter
} from 'lucide-react';

interface MetricCard {
  title: string;
  value: string;
  change: string;
  trend: 'up' | 'down' | 'neutral';
  icon: React.ReactNode;
  color: string;
}

interface ChartData {
  label: string;
  value: number;
  color: string;
}

export const AnalyticsPage: React.FC = () => {
  const [selectedTimeRange, setSelectedTimeRange] = useState('7d');
  const [selectedMetric, setSelectedMetric] = useState('requests');

  // Mock analytics data
  const metrics: MetricCard[] = [
    {
      title: 'Total Requests',
      value: '2.4M',
      change: '+12.5%',
      trend: 'up',
      icon: <Activity className="w-6 h-6 text-white" />,
      color: 'bg-blue-600'
    },
    {
      title: 'Unique Users',
      value: '45.2K',
      change: '+8.3%',
      trend: 'up',
      icon: <Users className="w-6 h-6 text-white" />,
      color: 'bg-green-600'
    },
    {
      title: 'Error Rate',
      value: '0.8%',
      change: '-2.1%',
      trend: 'down',
      icon: <AlertTriangle className="w-6 h-6 text-white" />,
      color: 'bg-red-600'
    },
    {
      title: 'Avg Response Time',
      value: '245ms',
      change: '-15.2%',
      trend: 'down',
      icon: <Clock className="w-6 h-6 text-white" />,
      color: 'bg-purple-600'
    },
    {
      title: 'Uptime',
      value: '99.9%',
      change: '+0.1%',
      trend: 'up',
      icon: <CheckCircle className="w-6 h-6 text-white" />,
      color: 'bg-emerald-600'
    },
    {
      title: 'Data Transfer',
      value: '1.2TB',
      change: '+18.7%',
      trend: 'up',
      icon: <Database className="w-6 h-6 text-white" />,
      color: 'bg-orange-600'
    }
  ];

  // Mock chart data
  const requestsOverTime = [
    { label: 'Mon', value: 320, color: '#3B82F6' },
    { label: 'Tue', value: 450, color: '#3B82F6' },
    { label: 'Wed', value: 380, color: '#3B82F6' },
    { label: 'Thu', value: 520, color: '#3B82F6' },
    { label: 'Fri', value: 680, color: '#3B82F6' },
    { label: 'Sat', value: 420, color: '#3B82F6' },
    { label: 'Sun', value: 350, color: '#3B82F6' }
  ];

  const topEndpoints = [
    { label: '/api/users', value: 45230, color: '#10B981' },
    { label: '/api/auth/login', value: 32150, color: '#3B82F6' },
    { label: '/api/products', value: 28940, color: '#8B5CF6' },
    { label: '/api/orders', value: 21680, color: '#F59E0B' },
    { label: '/health', value: 18750, color: '#EF4444' }
  ];

  const geographicData = [
    { label: 'United States', value: 35, color: '#3B82F6' },
    { label: 'United Kingdom', value: 18, color: '#10B981' },
    { label: 'Germany', value: 12, color: '#8B5CF6' },
    { label: 'France', value: 10, color: '#F59E0B' },
    { label: 'Canada', value: 8, color: '#EF4444' },
    { label: 'Others', value: 17, color: '#6B7280' }
  ];

  const deviceTypes = [
    { label: 'Desktop', value: 52, color: '#3B82F6' },
    { label: 'Mobile', value: 35, color: '#10B981' },
    { label: 'Tablet', value: 13, color: '#8B5CF6' }
  ];

  const renderBarChart = (data: ChartData[], title: string) => {
    const maxValue = Math.max(...data.map(d => d.value));
    
    return (
      <div className="bg-gray-800 rounded-xl p-6 border border-gray-700">
        <h3 className="text-lg font-semibold text-white mb-6">{title}</h3>
        <div className="space-y-4">
          {data.map((item, index) => (
            <div key={index} className="flex items-center space-x-3">
              <div className="w-20 text-sm text-gray-300 truncate">{item.label}</div>
              <div className="flex-1 flex items-center space-x-2">
                <div className="flex-1 h-6 bg-gray-700 rounded-full overflow-hidden">
                  <div
                    className="h-full transition-all duration-500 rounded-full"
                    style={{
                      width: `${(item.value / maxValue) * 100}%`,
                      backgroundColor: item.color
                    }}
                  />
                </div>
                <div className="w-16 text-sm text-gray-300 text-right">
                  {typeof item.value === 'number' && item.value > 1000 
                    ? `${(item.value / 1000).toFixed(1)}K` 
                    : item.value}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  };

  const renderPieChart = (data: ChartData[], title: string) => {
    const total = data.reduce((sum, item) => sum + item.value, 0);
    let currentAngle = 0;
    
    return (
      <div className="bg-gray-800 rounded-xl p-6 border border-gray-700">
        <h3 className="text-lg font-semibold text-white mb-6">{title}</h3>
        <div className="flex items-center justify-center">
          <div className="relative">
            <svg width="200" height="200" className="transform -rotate-90">
              {data.map((item, index) => {
                const percentage = (item.value / total) * 100;
                const angle = (percentage / 100) * 360;
                const startAngle = currentAngle;
                const endAngle = currentAngle + angle;
                
                const x1 = 100 + 80 * Math.cos((startAngle * Math.PI) / 180);
                const y1 = 100 + 80 * Math.sin((startAngle * Math.PI) / 180);
                const x2 = 100 + 80 * Math.cos((endAngle * Math.PI) / 180);
                const y2 = 100 + 80 * Math.sin((endAngle * Math.PI) / 180);
                
                const largeArcFlag = angle > 180 ? 1 : 0;
                
                const pathData = [
                  `M 100 100`,
                  `L ${x1} ${y1}`,
                  `A 80 80 0 ${largeArcFlag} 1 ${x2} ${y2}`,
                  'Z'
                ].join(' ');
                
                currentAngle += angle;
                
                return (
                  <path
                    key={index}
                    d={pathData}
                    fill={item.color}
                    className="hover:opacity-80 transition-opacity"
                  />
                );
              })}
            </svg>
          </div>
        </div>
        <div className="mt-6 space-y-2">
          {data.map((item, index) => (
            <div key={index} className="flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <div
                  className="w-3 h-3 rounded-full"
                  style={{ backgroundColor: item.color }}
                />
                <span className="text-gray-300 text-sm">{item.label}</span>
              </div>
              <span className="text-white font-medium">{item.value}%</span>
            </div>
          ))}
        </div>
      </div>
    );
  };

  const renderLineChart = (data: ChartData[], title: string) => {
    const maxValue = Math.max(...data.map(d => d.value));
    const points = data.map((point, index) => 
      `${(index / (data.length - 1)) * 300},${150 - (point.value / maxValue) * 120}`
    ).join(' ');
    
    return (
      <div className="bg-gray-800 rounded-xl p-6 border border-gray-700">
        <h3 className="text-lg font-semibold text-white mb-6">{title}</h3>
        <div className="h-48">
          <svg viewBox="0 0 300 150" className="w-full h-full">
            <defs>
              <linearGradient id="lineGradient" x1="0%" y1="0%" x2="0%" y2="100%">
                <stop offset="0%" stopColor="#3B82F6" stopOpacity="0.3" />
                <stop offset="100%" stopColor="#3B82F6" stopOpacity="0" />
              </linearGradient>
            </defs>
            
            {/* Grid lines */}
            {[0, 1, 2, 3, 4].map(i => (
              <line
                key={i}
                x1="0"
                y1={i * 30}
                x2="300"
                y2={i * 30}
                stroke="#374151"
                strokeWidth="1"
                opacity="0.3"
              />
            ))}
            
            {/* Area under curve */}
            <polygon
              points={`0,150 ${points} 300,150`}
              fill="url(#lineGradient)"
            />
            
            {/* Line */}
            <polyline
              points={points}
              fill="none"
              stroke="#3B82F6"
              strokeWidth="2"
            />
            
            {/* Data points */}
            {data.map((point, index) => (
              <circle
                key={index}
                cx={(index / (data.length - 1)) * 300}
                cy={150 - (point.value / maxValue) * 120}
                r="4"
                fill="#3B82F6"
                className="hover:r-6 transition-all duration-200"
              />
            ))}
          </svg>
        </div>
        <div className="flex justify-between mt-4 text-sm text-gray-400">
          {data.map((point, index) => (
            <span key={index}>{point.label}</span>
          ))}
        </div>
      </div>
    );
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-white mb-2">Advanced Analytics</h1>
          <p className="text-gray-400">Comprehensive insights and performance metrics</p>
        </div>
        <div className="flex items-center space-x-3">
          <select
            value={selectedTimeRange}
            onChange={(e) => setSelectedTimeRange(e.target.value)}
            className="bg-gray-700 text-white rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 border border-gray-600"
          >
            <option value="24h">Last 24 Hours</option>
            <option value="7d">Last 7 Days</option>
            <option value="30d">Last 30 Days</option>
            <option value="90d">Last 90 Days</option>
          </select>
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

      {/* Metrics Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {metrics.map((metric, index) => (
          <div key={index} className="bg-gray-800 rounded-xl p-6 border border-gray-700 hover:border-gray-600 transition-all duration-200">
            <div className="flex items-center justify-between mb-4">
              <div className={`p-3 rounded-lg ${metric.color}`}>
                {metric.icon}
              </div>
              <div className={`flex items-center space-x-1 text-sm font-medium ${
                metric.trend === 'up' ? 'text-green-400' :
                metric.trend === 'down' ? 'text-red-400' : 'text-gray-400'
              }`}>
                {metric.trend === 'up' ? <TrendingUp className="w-3 h-3" /> :
                 metric.trend === 'down' ? <TrendingDown className="w-3 h-3" /> : null}
                <span>{metric.change}</span>
              </div>
            </div>
            <div>
              <p className="text-2xl font-bold text-white mb-1">{metric.value}</p>
              <p className="text-gray-400 text-sm">{metric.title}</p>
            </div>
          </div>
        ))}
      </div>

      {/* Charts Row 1 */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {renderLineChart(requestsOverTime, 'Requests Over Time')}
        {renderBarChart(topEndpoints, 'Top API Endpoints')}
      </div>

      {/* Charts Row 2 */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {renderPieChart(geographicData, 'Geographic Distribution')}
        {renderPieChart(deviceTypes, 'Device Types')}
      </div>

      {/* Performance Insights */}
      <div className="bg-gray-800 rounded-xl p-6 border border-gray-700">
        <h3 className="text-lg font-semibold text-white mb-6">Performance Insights</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <div className="text-center">
            <div className="w-16 h-16 bg-blue-600 rounded-full flex items-center justify-center mx-auto mb-3">
              <Zap className="w-8 h-8 text-white" />
            </div>
            <h4 className="text-white font-medium mb-1">Peak Performance</h4>
            <p className="text-gray-400 text-sm">Response times are 15% faster than last month</p>
          </div>
          
          <div className="text-center">
            <div className="w-16 h-16 bg-green-600 rounded-full flex items-center justify-center mx-auto mb-3">
              <TrendingUp className="w-8 h-8 text-white" />
            </div>
            <h4 className="text-white font-medium mb-1">Growing Traffic</h4>
            <p className="text-gray-400 text-sm">User engagement increased by 23% this week</p>
          </div>
          
          <div className="text-center">
            <div className="w-16 h-16 bg-purple-600 rounded-full flex items-center justify-center mx-auto mb-3">
              <Server className="w-8 h-8 text-white" />
            </div>
            <h4 className="text-white font-medium mb-1">System Health</h4>
            <p className="text-gray-400 text-sm">All services running optimally with 99.9% uptime</p>
          </div>
          
          <div className="text-center">
            <div className="w-16 h-16 bg-orange-600 rounded-full flex items-center justify-center mx-auto mb-3">
              <Globe className="w-8 h-8 text-white" />
            </div>
            <h4 className="text-white font-medium mb-1">Global Reach</h4>
            <p className="text-gray-400 text-sm">Serving users across 45+ countries worldwide</p>
          </div>
        </div>
      </div>

      {/* Real-time Metrics */}
      <div className="bg-gray-800 rounded-xl p-6 border border-gray-700">
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-lg font-semibold text-white">Real-time Metrics</h3>
          <div className="flex items-center space-x-2 text-green-400">
            <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
            <span className="text-sm">Live</span>
          </div>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          <div className="text-center">
            <div className="text-3xl font-bold text-blue-400 mb-1">1,247</div>
            <div className="text-gray-400 text-sm">Active Users</div>
          </div>
          <div className="text-center">
            <div className="text-3xl font-bold text-green-400 mb-1">98.7%</div>
            <div className="text-gray-400 text-sm">Success Rate</div>
          </div>
          <div className="text-center">
            <div className="text-3xl font-bold text-purple-400 mb-1">156ms</div>
            <div className="text-gray-400 text-sm">Avg Response</div>
          </div>
          <div className="text-center">
            <div className="text-3xl font-bold text-orange-400 mb-1">2.1GB</div>
            <div className="text-gray-400 text-sm">Data Processed</div>
          </div>
        </div>
      </div>
    </div>
  );
};