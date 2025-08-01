import React, { useState } from 'react';
import { 
  Settings, 
  Bell, 
  Database, 
  Palette, 
  Save,
  Check,
  AlertTriangle,
  Info
} from 'lucide-react';

interface SettingSection {
  id: string;
  title: string;
  icon: React.ReactNode;
  description: string;
}

export const SettingsPage: React.FC = () => {
  const [activeSection, setActiveSection] = useState('general');
  const [settings, setSettings] = useState({
    // General Settings
    siteName: 'LogMonitor',
    timezone: 'UTC',
    theme: 'dark',
    
    // Notification Settings
    emailNotifications: true,
    errorAlerts: true,
    alertThreshold: 10,
    
    // Data Settings
    retentionPeriod: 90,
    backupFrequency: 'daily',
    compressionEnabled: true,
    
    // Display Settings
    itemsPerPage: 50,
    defaultTimeRange: '24h',
    showTimestamps: true,
    compactView: false
  });

  const [unsavedChanges, setUnsavedChanges] = useState(false);
  const [saveStatus, setSaveStatus] = useState<'idle' | 'saving' | 'saved' | 'error'>('idle');

  const sections: SettingSection[] = [
    {
      id: 'general',
      title: 'General',
      icon: <Settings className="w-5 h-5" />,
      description: 'Basic application settings and preferences'
    },
    {
      id: 'notifications',
      title: 'Notifications',
      icon: <Bell className="w-5 h-5" />,
      description: 'Configure alerts and notification preferences'
    },
    {
      id: 'data',
      title: 'Data Management',
      icon: <Database className="w-5 h-5" />,
      description: 'Data retention and backup settings'
    },
    {
      id: 'display',
      title: 'Display',
      icon: <Palette className="w-5 h-5" />,
      description: 'UI preferences and display options'
    }
  ];

  const handleSettingChange = (key: string, value: any) => {
    setSettings(prev => ({ ...prev, [key]: value }));
    setUnsavedChanges(true);
  };

  const handleSave = async () => {
    setSaveStatus('saving');
    
    // Simulate saving settings
    setTimeout(() => {
      setUnsavedChanges(false);
      setSaveStatus('saved');
      
      // Reset save status after 2 seconds
      setTimeout(() => {
        setSaveStatus('idle');
      }, 2000);
    }, 1000);
  };

  const renderGeneralSettings = () => (
    <div className="space-y-6">
      <div>
        <label className="block text-sm font-medium text-gray-300 mb-2">Site Name</label>
        <input
          type="text"
          value={settings.siteName}
          onChange={(e) => handleSettingChange('siteName', e.target.value)}
          className="w-full bg-gray-700 text-white rounded-lg px-3 py-2 border border-gray-600 focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
      </div>
      
      <div>
        <label className="block text-sm font-medium text-gray-300 mb-2">Timezone</label>
        <select
          value={settings.timezone}
          onChange={(e) => handleSettingChange('timezone', e.target.value)}
          className="w-full bg-gray-700 text-white rounded-lg px-3 py-2 border border-gray-600 focus:outline-none focus:ring-2 focus:ring-blue-500"
        >
          <option value="UTC">UTC</option>
          <option value="America/New_York">Eastern Time</option>
          <option value="America/Chicago">Central Time</option>
          <option value="America/Denver">Mountain Time</option>
          <option value="America/Los_Angeles">Pacific Time</option>
          <option value="Europe/London">London</option>
          <option value="Europe/Paris">Paris</option>
          <option value="Asia/Tokyo">Tokyo</option>
        </select>
      </div>
      
      <div>
        <label className="block text-sm font-medium text-gray-300 mb-2">Theme</label>
        <div className="flex space-x-4">
          <label className="flex items-center">
            <input
              type="radio"
              name="theme"
              value="dark"
              checked={settings.theme === 'dark'}
              onChange={(e) => handleSettingChange('theme', e.target.value)}
              className="mr-2"
            />
            <span className="text-gray-300">Dark</span>
          </label>
          <label className="flex items-center">
            <input
              type="radio"
              name="theme"
              value="light"
              checked={settings.theme === 'light'}
              onChange={(e) => handleSettingChange('theme', e.target.value)}
              className="mr-2"
            />
            <span className="text-gray-300">Light</span>
          </label>
          <label className="flex items-center">
            <input
              type="radio"
              name="theme"
              value="auto"
              checked={settings.theme === 'auto'}
              onChange={(e) => handleSettingChange('theme', e.target.value)}
              className="mr-2"
            />
            <span className="text-gray-300">Auto</span>
          </label>
        </div>
      </div>
    </div>
  );

  const renderNotificationSettings = () => (
    <div className="space-y-6">
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h4 className="text-white font-medium">Email Notifications</h4>
            <p className="text-gray-400 text-sm">Receive notifications via email</p>
          </div>
          <label className="relative inline-flex items-center cursor-pointer">
            <input
              type="checkbox"
              checked={settings.emailNotifications}
              onChange={(e) => handleSettingChange('emailNotifications', e.target.checked)}
              className="sr-only peer"
            />
            <div className="w-11 h-6 bg-gray-600 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
          </label>
        </div>
        
        <div className="flex items-center justify-between">
          <div>
            <h4 className="text-white font-medium">Error Alerts</h4>
            <p className="text-gray-400 text-sm">Get notified of critical errors</p>
          </div>
          <label className="relative inline-flex items-center cursor-pointer">
            <input
              type="checkbox"
              checked={settings.errorAlerts}
              onChange={(e) => handleSettingChange('errorAlerts', e.target.checked)}
              className="sr-only peer"
            />
            <div className="w-11 h-6 bg-gray-600 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
          </label>
        </div>
      </div>
      
      <div>
        <label className="block text-sm font-medium text-gray-300 mb-2">Alert Threshold</label>
        <div className="flex items-center space-x-3">
          <input
            type="range"
            min="1"
            max="100"
            value={settings.alertThreshold}
            onChange={(e) => handleSettingChange('alertThreshold', parseInt(e.target.value))}
            className="flex-1"
          />
          <span className="text-white font-medium w-12">{settings.alertThreshold}</span>
        </div>
        <p className="text-gray-400 text-sm mt-1">Number of errors before triggering an alert</p>
      </div>
    </div>
  );

  const renderDataSettings = () => (
    <div className="space-y-6">
      <div>
        <label className="block text-sm font-medium text-gray-300 mb-2">Data Retention Period (days)</label>
        <input
          type="number"
          value={settings.retentionPeriod}
          onChange={(e) => handleSettingChange('retentionPeriod', parseInt(e.target.value))}
          className="w-full bg-gray-700 text-white rounded-lg px-3 py-2 border border-gray-600 focus:outline-none focus:ring-2 focus:ring-blue-500"
          min="1"
          max="365"
        />
        <p className="text-gray-400 text-sm mt-1">How long to keep log data before deletion</p>
      </div>
      
      <div>
        <label className="block text-sm font-medium text-gray-300 mb-2">Backup Frequency</label>
        <select
          value={settings.backupFrequency}
          onChange={(e) => handleSettingChange('backupFrequency', e.target.value)}
          className="w-full bg-gray-700 text-white rounded-lg px-3 py-2 border border-gray-600 focus:outline-none focus:ring-2 focus:ring-blue-500"
        >
          <option value="hourly">Hourly</option>
          <option value="daily">Daily</option>
          <option value="weekly">Weekly</option>
          <option value="monthly">Monthly</option>
        </select>
      </div>
      
      <div className="flex items-center justify-between">
        <div>
          <h4 className="text-white font-medium">Enable Compression</h4>
          <p className="text-gray-400 text-sm">Compress logs to save storage space</p>
        </div>
        <label className="relative inline-flex items-center cursor-pointer">
          <input
            type="checkbox"
            checked={settings.compressionEnabled}
            onChange={(e) => handleSettingChange('compressionEnabled', e.target.checked)}
            className="sr-only peer"
          />
          <div className="w-11 h-6 bg-gray-600 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
        </label>
      </div>
    </div>
  );

  const renderDisplaySettings = () => (
    <div className="space-y-6">
      <div>
        <label className="block text-sm font-medium text-gray-300 mb-2">Items Per Page</label>
        <select
          value={settings.itemsPerPage}
          onChange={(e) => handleSettingChange('itemsPerPage', parseInt(e.target.value))}
          className="w-full bg-gray-700 text-white rounded-lg px-3 py-2 border border-gray-600 focus:outline-none focus:ring-2 focus:ring-blue-500"
        >
          <option value={25}>25</option>
          <option value={50}>50</option>
          <option value={100}>100</option>
          <option value={200}>200</option>
        </select>
      </div>
      
      <div>
        <label className="block text-sm font-medium text-gray-300 mb-2">Default Time Range</label>
        <select
          value={settings.defaultTimeRange}
          onChange={(e) => handleSettingChange('defaultTimeRange', e.target.value)}
          className="w-full bg-gray-700 text-white rounded-lg px-3 py-2 border border-gray-600 focus:outline-none focus:ring-2 focus:ring-blue-500"
        >
          <option value="1h">Last Hour</option>
          <option value="24h">Last 24 Hours</option>
          <option value="7d">Last 7 Days</option>
          <option value="30d">Last 30 Days</option>
        </select>
      </div>
      
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h4 className="text-white font-medium">Show Timestamps</h4>
            <p className="text-gray-400 text-sm">Display timestamps in log entries</p>
          </div>
          <label className="relative inline-flex items-center cursor-pointer">
            <input
              type="checkbox"
              checked={settings.showTimestamps}
              onChange={(e) => handleSettingChange('showTimestamps', e.target.checked)}
              className="sr-only peer"
            />
            <div className="w-11 h-6 bg-gray-600 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
          </label>
        </div>
        
        <div className="flex items-center justify-between">
          <div>
            <h4 className="text-white font-medium">Compact View</h4>
            <p className="text-gray-400 text-sm">Use compact layout for more data</p>
          </div>
          <label className="relative inline-flex items-center cursor-pointer">
            <input
              type="checkbox"
              checked={settings.compactView}
              onChange={(e) => handleSettingChange('compactView', e.target.checked)}
              className="sr-only peer"
            />
            <div className="w-11 h-6 bg-gray-600 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
          </label>
        </div>
      </div>
    </div>
  );

  const renderContent = () => {
    switch (activeSection) {
      case 'general': return renderGeneralSettings();
      case 'notifications': return renderNotificationSettings();
      case 'data': return renderDataSettings();
      case 'display': return renderDisplaySettings();
      default: return renderGeneralSettings();
    }
  };

  const getSaveButtonContent = () => {
    switch (saveStatus) {
      case 'saving':
        return (
          <>
            <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
            <span>Saving...</span>
          </>
        );
      case 'saved':
        return (
          <>
            <Check className="w-4 h-4" />
            <span>Saved!</span>
          </>
        );
      case 'error':
        return (
          <>
            <AlertTriangle className="w-4 h-4" />
            <span>Error</span>
          </>
        );
      default:
        return (
          <>
            <Save className="w-4 h-4" />
            <span>Save Changes</span>
          </>
        );
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-white mb-2">Settings</h1>
          <p className="text-gray-400">Configure your application preferences</p>
        </div>
        {unsavedChanges && (
          <button
            onClick={handleSave}
            disabled={saveStatus === 'saving'}
            className={`flex items-center space-x-2 px-4 py-2 rounded-lg transition-colors ${
              saveStatus === 'saving' 
                ? 'bg-gray-600 text-gray-300 cursor-not-allowed'
                : saveStatus === 'saved'
                ? 'bg-green-600 text-white'
                : saveStatus === 'error'
                ? 'bg-red-600 text-white'
                : 'bg-blue-600 hover:bg-blue-700 text-white'
            }`}
          >
            {getSaveButtonContent()}
          </button>
        )}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        {/* Settings Navigation */}
        <div className="lg:col-span-1">
          <div className="bg-gray-800 rounded-xl border border-gray-700 p-4">
            <nav className="space-y-2">
              {sections.map((section) => (
                <button
                  key={section.id}
                  onClick={() => setActiveSection(section.id)}
                  className={`w-full flex items-center space-x-3 px-3 py-2.5 rounded-lg text-left transition-all duration-200 ${
                    activeSection === section.id
                      ? 'bg-blue-600 text-white'
                      : 'text-gray-300 hover:bg-gray-700 hover:text-white'
                  }`}
                >
                  {section.icon}
                  <div className="flex-1">
                    <div className="font-medium">{section.title}</div>
                  </div>
                </button>
              ))}
            </nav>
          </div>
        </div>

        {/* Settings Content */}
        <div className="lg:col-span-3">
          <div className="bg-gray-800 rounded-xl border border-gray-700 p-6">
            <div className="mb-6">
              <h2 className="text-xl font-semibold text-white mb-2">
                {sections.find(s => s.id === activeSection)?.title}
              </h2>
              <p className="text-gray-400 text-sm">
                {sections.find(s => s.id === activeSection)?.description}
              </p>
            </div>
            
            {renderContent()}
          </div>
        </div>
      </div>
    </div>
  );
};