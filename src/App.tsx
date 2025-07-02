import React, { useState } from 'react';
import { ViewMode } from './types';
import { useLogs } from './hooks/useLogs';
import { Sidebar } from './components/Sidebar';
import { Dashboard } from './components/Dashboard';
import { LogViewer } from './components/LogViewer';
import { SearchView } from './components/SearchView';

function App() {
  const [activeView, setActiveView] = useState<ViewMode>('dashboard');
  const {
    logs,
    allLogs,
    isStreaming,
    setIsStreaming,
    searchQuery,
    setSearchQuery,
    levelFilter,
    setLevelFilter,
    stats
  } = useLogs();

  const renderActiveView = () => {
    switch (activeView) {
      case 'dashboard':
        return (
          <Dashboard
            stats={stats}
            isStreaming={isStreaming}
            onToggleStreaming={() => setIsStreaming(!isStreaming)}
          />
        );
      case 'logs':
        return (
          <LogViewer
            logs={logs}
            searchQuery={searchQuery}
            onSearchChange={setSearchQuery}
            levelFilter={levelFilter}
            onLevelFilterChange={setLevelFilter}
          />
        );
      case 'search':
        return <SearchView logs={allLogs} />;
      case 'analytics':
        return (
          <div className="space-y-6">
            <div>
              <h1 className="text-3xl font-bold text-white mb-2">Analytics</h1>
              <p className="text-gray-400">Advanced log analytics and insights</p>
            </div>
            <div className="bg-gray-800 rounded-xl p-8 border border-gray-700 text-center">
              <div className="w-16 h-16 bg-gradient-to-br from-purple-500 to-pink-500 rounded-full mx-auto mb-4 flex items-center justify-center">
                <span className="text-2xl">📊</span>
              </div>
              <h3 className="text-xl font-semibold text-white mb-2">Coming Soon</h3>
              <p className="text-gray-400">Advanced analytics and machine learning insights</p>
            </div>
          </div>
        );
      case 'settings':
        return (
          <div className="space-y-6">
            <div>
              <h1 className="text-3xl font-bold text-white mb-2">Settings</h1>
              <p className="text-gray-400">Configure your log analyzer preferences</p>
            </div>
            <div className="bg-gray-800 rounded-xl p-8 border border-gray-700 text-center">
              <div className="w-16 h-16 bg-gradient-to-br from-blue-500 to-teal-500 rounded-full mx-auto mb-4 flex items-center justify-center">
                <span className="text-2xl">⚙️</span>
              </div>
              <h3 className="text-xl font-semibold text-white mb-2">Settings Panel</h3>
              <p className="text-gray-400">Log sources, alerts, and system configuration</p>
            </div>
          </div>
        );
      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen bg-gray-900 flex">
      <Sidebar
        activeView={activeView}
        onViewChange={setActiveView}
        stats={stats}
      />
      
      <main className="flex-1 overflow-hidden">
        <div className="h-full overflow-y-auto">
          <div className="p-8">
            {renderActiveView()}
          </div>
        </div>
      </main>
    </div>
  );
}

export default App;