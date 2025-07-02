import React from 'react';
import { ViewMode } from '../types';
import { 
  BarChart3, 
  FileText, 
  Search, 
  Settings, 
  Activity,
  Server,
  AlertTriangle,
  TrendingUp
} from 'lucide-react';

interface SidebarProps {
  activeView: ViewMode;
  onViewChange: (view: ViewMode) => void;
  stats: {
    totalLogs: number;
    errorCount: number;
    warningCount: number;
  };
}

export const Sidebar: React.FC<SidebarProps> = ({ activeView, onViewChange, stats }) => {
  const menuItems = [
    { id: 'dashboard' as ViewMode, label: 'Dashboard', icon: BarChart3 },
    { id: 'logs' as ViewMode, label: 'Log Viewer', icon: FileText },
    { id: 'search' as ViewMode, label: 'Search', icon: Search },
    { id: 'analytics' as ViewMode, label: 'Analytics', icon: TrendingUp },
    { id: 'settings' as ViewMode, label: 'Settings', icon: Settings },
  ];

  return (
    <div className="w-64 bg-gray-900 border-r border-gray-700 flex flex-col">
      {/* Logo */}
      <div className="p-6 border-b border-gray-700">
        <div className="flex items-center space-x-3">
          <div className="w-8 h-8 bg-gradient-to-br from-blue-500 to-purple-600 rounded-lg flex items-center justify-center">
            <Server className="w-5 h-5 text-white" />
          </div>
          <div>
            <h1 className="text-xl font-bold text-white">LogScope</h1>
            <p className="text-xs text-gray-400">Advanced Log Analytics</p>
          </div>
        </div>
      </div>

      {/* Stats Overview */}
      <div className="p-4 border-b border-gray-700">
        <div className="space-y-2">
          <div className="flex items-center justify-between text-sm">
            <span className="text-gray-400">Total Logs</span>
            <span className="text-white font-medium">{stats.totalLogs.toLocaleString()}</span>
          </div>
          <div className="flex items-center justify-between text-sm">
            <span className="text-gray-400 flex items-center">
              <AlertTriangle className="w-3 h-3 mr-1 text-red-400" />
              Errors
            </span>
            <span className="text-red-400 font-medium">{stats.errorCount}</span>
          </div>
          <div className="flex items-center justify-between text-sm">
            <span className="text-gray-400 flex items-center">
              <Activity className="w-3 h-3 mr-1 text-yellow-400" />
              Warnings
            </span>
            <span className="text-yellow-400 font-medium">{stats.warningCount}</span>
          </div>
        </div>
      </div>

      {/* Navigation */}
      <nav className="flex-1 p-4">
        <ul className="space-y-2">
          {menuItems.map((item) => {
            const Icon = item.icon;
            const isActive = activeView === item.id;
            
            return (
              <li key={item.id}>
                <button
                  onClick={() => onViewChange(item.id)}
                  className={`w-full flex items-center space-x-3 px-3 py-2 rounded-lg transition-all duration-200 ${
                    isActive
                      ? 'bg-blue-600 text-white shadow-lg'
                      : 'text-gray-400 hover:text-white hover:bg-gray-800'
                  }`}
                >
                  <Icon className="w-5 h-5" />
                  <span className="font-medium">{item.label}</span>
                </button>
              </li>
            );
          })}
        </ul>
      </nav>

      {/* Status Indicator */}
      <div className="p-4 border-t border-gray-700">
        <div className="flex items-center space-x-2 text-sm">
          <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
          <span className="text-gray-400">System Online</span>
        </div>
      </div>
    </div>
  );
};