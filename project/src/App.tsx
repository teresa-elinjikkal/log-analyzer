import React from 'react';
import { Dashboard } from './Dashboard';
import { Navigation } from './components/Navigation';
import { ErrorsPage } from './components/ErrorsPage';
import { SettingsPage } from './components/SettingsPage';
import { RagQueryPage } from './components/RagQueryPage';
import { LogsPage } from './components/LogsPage';
import { LogIngestionPage } from './components/LogIngestionPage';
import QueryBox from './components/QueryBox';

function App() {
  const [isStreaming, setIsStreaming] = React.useState(true);
  const [activeSection, setActiveSection] = React.useState('dashboard');

  const handleToggleStreaming = () => {
    setIsStreaming(!isStreaming);
  };

  const handleSectionChange = (section: string) => {
    setActiveSection(section);
  };

  const renderContent = () => {
    switch (activeSection) {
      case 'dashboard':
        return (
          <Dashboard 
            isStreaming={isStreaming}
            onToggleStreaming={handleToggleStreaming}
            onNavigateToErrors={() => setActiveSection('errors')}
          />
        );
      case 'logs':
        return <LogsPage />;
      case 'errors':
        return <ErrorsPage />;
      case 'ingestion':
        return <LogIngestionPage />;
      case 'ragquery':
        return <RagQueryPage />;
      case 'settings':
        return <SettingsPage />;
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
      <div className={`flex-1 transition-all duration-300 ${'mr-80'}`}>
        <div className="p-6">
          {renderContent()}
        </div>
      </div>
    </div>
  );
}

export default App;
