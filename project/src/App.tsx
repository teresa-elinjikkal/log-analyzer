import React from 'react';
import { Dashboard } from './Dashboard';
import { Chatbot } from './components/Chatbot';
import { Navigation } from './components/Navigation';
import { ErrorsPage } from './components/ErrorsPage';
import { SettingsPage } from './components/SettingsPage';
import { LogsPage } from './components/LogsPage';
import { AnalyticsPage } from './components/AnalyticsPage';
import { LogIngestionPage } from './components/LogIngestionPage';
import { LogStats } from '../types';

// Mock data for demonstration
const mockStats: LogStats = {
  totalLogs: 45672,
  errorCount: 234,
  warningCount: 1456,
  avgResponseTime: 245,
  statusCodes: [
    { code: 200, count: 38945 },
    { code: 404, count: 3421 },
    { code: 500, count: 1876 },
    { code: 301, count: 987 },
    { code: 403, count: 443 },
  ],
  topIPs: [
    { ip: '192.168.1.100', count: 2341 },
    { ip: '10.0.0.45', count: 1876 },
    { ip: '172.16.0.23', count: 1654 },
    { ip: '203.0.113.42', count: 1432 },
    { ip: '198.51.100.15', count: 1298 },
  ],
  topPaths: [
    { path: '/api/users', count: 8765 },
    { path: '/api/auth/login', count: 6543 },
    { path: '/api/products', count: 5432 },
    { path: '/health', count: 4321 },
    { path: '/api/orders', count: 3210 },
  ],
};

function App() {
  const [isStreaming, setIsStreaming] = React.useState(true);
  const [isChatMinimized, setIsChatMinimized] = React.useState(false);
  const [activeSection, setActiveSection] = React.useState('dashboard');

  const handleToggleStreaming = () => {
    setIsStreaming(!isStreaming);
  };

  const handleToggleChatMinimize = () => {
    setIsChatMinimized(!isChatMinimized);
  };

  const handleSectionChange = (section: string) => {
    setActiveSection(section);
  };

  const renderContent = () => {
    switch (activeSection) {
      case 'dashboard':
        return (
          <Dashboard 
            stats={mockStats}
            isStreaming={isStreaming}
            onToggleStreaming={handleToggleStreaming}
            onNavigateToErrors={() => setActiveSection('errors')}
          />
        );
      case 'logs':
        return (
          <LogsPage />
        );
      case 'errors':
        return (
          <ErrorsPage />
        );
      case 'analytics':
        return (
          <AnalyticsPage />
        );
      case 'ingestion':
        return (
          <LogIngestionPage />
        );
      case 'chatbot':
        return (
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <div>
                <h1 className="text-3xl font-bold text-white mb-2">AI Assistant</h1>
                <p className="text-gray-400">Full-screen chat experience with your log analysis assistant</p>
              </div>
            </div>
            <div className="bg-gray-800 rounded-xl border border-gray-700 h-[calc(100vh-200px)]">
              <Chatbot 
                isMinimized={false}
                onToggleMinimize={() => {}}
              />
            </div>
          </div>
        );
      case 'settings':
        return (
          <SettingsPage />
        );
      default:
        return (
          <div className="space-y-6">
            <h1 className="text-3xl font-bold text-white">{activeSection.charAt(0).toUpperCase() + activeSection.slice(1)}</h1>
            <div className="bg-gray-800 rounded-xl p-6 border border-gray-700">
              <p className="text-gray-300">This section is under development...</p>
            </div>
          </div>
        );
    }
  };
  return (
    <div className="min-h-screen bg-gray-900 flex">
      {/* Left Navigation Sidebar */}
      <Navigation 
        activeSection={activeSection}
        onSectionChange={handleSectionChange}
      />

      {/* Main Dashboard Area */}
      <div className={`flex-1 transition-all duration-300 ${isChatMinimized ? 'mr-0' : 'mr-80'}`}>
        <div className="p-6">
          {renderContent()}
        </div>
      </div>

      {/* Chatbot Sidebar */}
      {!isChatMinimized && (
        <div className="w-80 fixed right-0 top-0 h-full">
          <Chatbot 
            isMinimized={isChatMinimized}
            onToggleMinimize={handleToggleChatMinimize}
          />
        </div>
      )}

      {/* Minimized Chatbot Button */}
      {isChatMinimized && (
        <Chatbot 
          isMinimized={isChatMinimized}
          onToggleMinimize={handleToggleChatMinimize}
        />
      )}
    </div>
  );
}

export default App;
