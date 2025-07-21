import React, { useState, useRef } from 'react';
import { 
  Upload, 
  FileText, 
  Code, 
  Globe, 
  Key, 
  Copy, 
  Check, 
  AlertTriangle, 
  Info, 
  Download,
  RefreshCw,
  Play,
  Settings,
  Database,
  Zap,
  Terminal,
  Cloud,
  Server,
  Activity,
  Clock
} from 'lucide-react';

interface LogSource {
  id: string;
  name: string;
  type: 'file' | 'api' | 'webhook' | 'agent';
  status: 'active' | 'inactive' | 'error';
  lastActivity: string;
  logsReceived: number;
  icon: React.ReactNode;
}

export const LogIngestionPage: React.FC = () => {
  const [activeTab, setActiveTab] = useState('upload');
  const [dragActive, setDragActive] = useState(false);
  const [uploadedFiles, setUploadedFiles] = useState<File[]>([]);
  const [apiKey] = useState('sk-1234567890abcdef1234567890abcdef');
  const [copied, setCopied] = useState(false);
  const [webhookUrl] = useState('https://your-domain.com/webhook/logs');
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Mock log sources
  const logSources: LogSource[] = [
    {
      id: '1',
      name: 'Production API Server',
      type: 'api',
      status: 'active',
      lastActivity: '2 minutes ago',
      logsReceived: 15420,
      icon: <Server className="w-5 h-5" />
    },
    {
      id: '2',
      name: 'Frontend Application',
      type: 'webhook',
      status: 'active',
      lastActivity: '5 minutes ago',
      logsReceived: 8930,
      icon: <Globe className="w-5 h-5" />
    },
    {
      id: '3',
      name: 'Database Logs',
      type: 'agent',
      status: 'inactive',
      lastActivity: '1 hour ago',
      logsReceived: 2340,
      icon: <Database className="w-5 h-5" />
    },
    {
      id: '4',
      name: 'Manual Upload',
      type: 'file',
      status: 'active',
      lastActivity: '30 minutes ago',
      logsReceived: 450,
      icon: <FileText className="w-5 h-5" />
    }
  ];

  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === 'dragenter' || e.type === 'dragover') {
      setDragActive(true);
    } else if (e.type === 'dragleave') {
      setDragActive(false);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      const files = Array.from(e.dataTransfer.files);
      setUploadedFiles(prev => [...prev, ...files]);
    }
  };

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      const files = Array.from(e.target.files);
      setUploadedFiles(prev => [...prev, ...files]);
    }
  };

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active': return 'text-green-400 bg-green-900/20';
      case 'inactive': return 'text-gray-400 bg-gray-900/20';
      case 'error': return 'text-red-400 bg-red-900/20';
      default: return 'text-gray-400 bg-gray-900/20';
    }
  };

  const renderFileUpload = () => (
    <div className="space-y-6">
      {/* Drag and Drop Area */}
      <div
        className={`border-2 border-dashed rounded-xl p-8 text-center transition-all duration-200 ${
          dragActive
            ? 'border-blue-500 bg-blue-500/10'
            : 'border-gray-600 hover:border-gray-500'
        }`}
        onDragEnter={handleDrag}
        onDragLeave={handleDrag}
        onDragOver={handleDrag}
        onDrop={handleDrop}
      >
        <Upload className="w-12 h-12 text-gray-400 mx-auto mb-4" />
        <h3 className="text-lg font-semibold text-white mb-2">
          Drop log files here or click to browse
        </h3>
        <p className="text-gray-400 mb-4">
          Supports .log, .txt, .json, .csv files up to 100MB each
        </p>
        <button
          onClick={() => fileInputRef.current?.click()}
          className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-lg transition-colors"
        >
          Select Files
        </button>
        <input
          ref={fileInputRef}
          type="file"
          multiple
          accept=".log,.txt,.json,.csv"
          onChange={handleFileSelect}
          className="hidden"
        />
      </div>

      {/* Uploaded Files */}
      {uploadedFiles.length > 0 && (
        <div className="bg-gray-800 rounded-xl p-6 border border-gray-700">
          <h4 className="text-white font-semibold mb-4">Uploaded Files ({uploadedFiles.length})</h4>
          <div className="space-y-3">
            {uploadedFiles.map((file, index) => (
              <div key={index} className="flex items-center justify-between p-3 bg-gray-700 rounded-lg">
                <div className="flex items-center space-x-3">
                  <FileText className="w-5 h-5 text-blue-400" />
                  <div>
                    <p className="text-white font-medium">{file.name}</p>
                    <p className="text-gray-400 text-sm">{(file.size / 1024 / 1024).toFixed(2)} MB</p>
                  </div>
                </div>
                <div className="flex items-center space-x-2">
                  <span className="text-green-400 text-sm">✓ Ready</span>
                  <button className="text-red-400 hover:text-red-300">
                    <span className="text-lg">×</span>
                  </button>
                </div>
              </div>
            ))}
          </div>
          <button className="w-full mt-4 bg-green-600 hover:bg-green-700 text-white py-2 rounded-lg transition-colors">
            Process Files
          </button>
        </div>
      )}

      {/* Supported Formats */}
      <div className="bg-gray-800 rounded-xl p-6 border border-gray-700">
        <h4 className="text-white font-semibold mb-4">Supported Log Formats</h4>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-3">
            <div className="flex items-center space-x-2">
              <Check className="w-4 h-4 text-green-400" />
              <span className="text-gray-300">Apache/Nginx Access Logs</span>
            </div>
            <div className="flex items-center space-x-2">
              <Check className="w-4 h-4 text-green-400" />
              <span className="text-gray-300">JSON Structured Logs</span>
            </div>
            <div className="flex items-center space-x-2">
              <Check className="w-4 h-4 text-green-400" />
              <span className="text-gray-300">Syslog Format</span>
            </div>
          </div>
          <div className="space-y-3">
            <div className="flex items-center space-x-2">
              <Check className="w-4 h-4 text-green-400" />
              <span className="text-gray-300">Application Logs (Plain Text)</span>
            </div>
            <div className="flex items-center space-x-2">
              <Check className="w-4 h-4 text-green-400" />
              <span className="text-gray-300">CSV Format</span>
            </div>
            <div className="flex items-center space-x-2">
              <Check className="w-4 h-4 text-green-400" />
              <span className="text-gray-300">Custom Delimited Formats</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );

  const renderAPIIntegration = () => (
    <div className="space-y-6">
      {/* API Key Section */}
      <div className="bg-gray-800 rounded-xl p-6 border border-gray-700">
        <h4 className="text-white font-semibold mb-4">API Authentication</h4>
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">API Key</label>
            <div className="flex space-x-2">
              <input
                type="text"
                value={apiKey}
                readOnly
                className="flex-1 bg-gray-700 text-white rounded-lg px-3 py-2 border border-gray-600 font-mono text-sm"
              />
              <button
                onClick={() => copyToClipboard(apiKey)}
                className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg transition-colors flex items-center space-x-2"
              >
                {copied ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
                <span>{copied ? 'Copied!' : 'Copy'}</span>
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* API Endpoints */}
      <div className="bg-gray-800 rounded-xl p-6 border border-gray-700">
        <h4 className="text-white font-semibold mb-4">API Endpoints</h4>
        <div className="space-y-4">
          <div className="bg-gray-700 rounded-lg p-4">
            <div className="flex items-center justify-between mb-2">
              <span className="text-green-400 font-mono text-sm">POST</span>
              <span className="text-gray-400 text-sm">Send single log entry</span>
            </div>
            <code className="text-gray-300 text-sm break-all">
              https://api.logmonitor.com/v1/logs
            </code>
          </div>
          <div className="bg-gray-700 rounded-lg p-4">
            <div className="flex items-center justify-between mb-2">
              <span className="text-blue-400 font-mono text-sm">POST</span>
              <span className="text-gray-400 text-sm">Batch upload logs</span>
            </div>
            <code className="text-gray-300 text-sm break-all">
              https://api.logmonitor.com/v1/logs/batch
            </code>
          </div>
        </div>
      </div>

      {/* Code Examples */}
      <div className="bg-gray-800 rounded-xl p-6 border border-gray-700">
        <h4 className="text-white font-semibold mb-4">Code Examples</h4>
        <div className="space-y-4">
          <div>
            <h5 className="text-gray-300 font-medium mb-2">cURL</h5>
            <div className="bg-gray-900 rounded-lg p-4 overflow-x-auto">
              <pre className="text-gray-300 text-sm">
{`curl -X POST https://api.logmonitor.com/v1/logs \\
  -H "Authorization: Bearer ${apiKey}" \\
  -H "Content-Type: application/json" \\
  -d '{
    "timestamp": "2025-01-13T10:30:00Z",
    "level": "info",
    "message": "User login successful",
    "source": "auth-service",
    "metadata": {
      "userId": "12345",
      "ip": "192.168.1.100"
    }
  }'`}
              </pre>
            </div>
          </div>
          
          <div>
            <h5 className="text-gray-300 font-medium mb-2">JavaScript</h5>
            <div className="bg-gray-900 rounded-lg p-4 overflow-x-auto">
              <pre className="text-gray-300 text-sm">
{`const response = await fetch('https://api.logmonitor.com/v1/logs', {
  method: 'POST',
  headers: {
    'Authorization': 'Bearer ${apiKey}',
    'Content-Type': 'application/json'
  },
  body: JSON.stringify({
    timestamp: new Date().toISOString(),
    level: 'info',
    message: 'API request processed',
    source: 'web-app',
    metadata: { requestId: '12345' }
  })
});`}
              </pre>
            </div>
          </div>
        </div>
      </div>
    </div>
  );

  const renderWebhooks = () => (
    <div className="space-y-6">
      {/* Webhook URL */}
      <div className="bg-gray-800 rounded-xl p-6 border border-gray-700">
        <h4 className="text-white font-semibold mb-4">Webhook Configuration</h4>
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">Webhook URL</label>
            <div className="flex space-x-2">
              <input
                type="text"
                value={webhookUrl}
                readOnly
                className="flex-1 bg-gray-700 text-white rounded-lg px-3 py-2 border border-gray-600 font-mono text-sm"
              />
              <button
                onClick={() => copyToClipboard(webhookUrl)}
                className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg transition-colors flex items-center space-x-2"
              >
                {copied ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
                <span>{copied ? 'Copied!' : 'Copy'}</span>
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Webhook Setup Instructions */}
      <div className="bg-gray-800 rounded-xl p-6 border border-gray-700">
        <h4 className="text-white font-semibold mb-4">Setup Instructions</h4>
        <div className="space-y-4">
          <div className="flex items-start space-x-3">
            <div className="w-6 h-6 bg-blue-600 rounded-full flex items-center justify-center text-white text-sm font-bold">1</div>
            <div>
              <h5 className="text-white font-medium">Configure Your Application</h5>
              <p className="text-gray-400 text-sm">Set up your application to send HTTP POST requests to the webhook URL above.</p>
            </div>
          </div>
          <div className="flex items-start space-x-3">
            <div className="w-6 h-6 bg-blue-600 rounded-full flex items-center justify-center text-white text-sm font-bold">2</div>
            <div>
              <h5 className="text-white font-medium">Include Authentication</h5>
              <p className="text-gray-400 text-sm">Add your API key in the Authorization header: <code className="bg-gray-700 px-1 rounded">Bearer {apiKey}</code></p>
            </div>
          </div>
          <div className="flex items-start space-x-3">
            <div className="w-6 h-6 bg-blue-600 rounded-full flex items-center justify-center text-white text-sm font-bold">3</div>
            <div>
              <h5 className="text-white font-medium">Test the Connection</h5>
              <p className="text-gray-400 text-sm">Send a test log entry to verify the webhook is working correctly.</p>
            </div>
          </div>
        </div>
      </div>

      {/* Webhook Payload Example */}
      <div className="bg-gray-800 rounded-xl p-6 border border-gray-700">
        <h4 className="text-white font-semibold mb-4">Expected Payload Format</h4>
        <div className="bg-gray-900 rounded-lg p-4 overflow-x-auto">
          <pre className="text-gray-300 text-sm">
{`{
  "timestamp": "2025-01-13T10:30:00Z",
  "level": "info",
  "message": "User action completed",
  "source": "web-application",
  "ip": "192.168.1.100",
  "statusCode": 200,
  "responseTime": 245,
  "path": "/api/users",
  "userAgent": "Mozilla/5.0...",
  "metadata": {
    "userId": "user-12345",
    "sessionId": "session-67890",
    "requestId": "req-abcdef"
  }
}`}
          </pre>
        </div>
      </div>
    </div>
  );

  const renderAgents = () => (
    <div className="space-y-6">
      {/* Agent Download */}
      <div className="bg-gray-800 rounded-xl p-6 border border-gray-700">
        <h4 className="text-white font-semibold mb-4">Log Collection Agents</h4>
        <p className="text-gray-400 mb-6">
          Install our lightweight agents to automatically collect and forward logs from your servers.
        </p>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="bg-gray-700 rounded-lg p-4 text-center">
            <Terminal className="w-8 h-8 text-blue-400 mx-auto mb-3" />
            <h5 className="text-white font-medium mb-2">Linux Agent</h5>
            <p className="text-gray-400 text-sm mb-4">For Ubuntu, CentOS, RHEL</p>
            <button className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg transition-colors w-full">
              Download
            </button>
          </div>
          
          <div className="bg-gray-700 rounded-lg p-4 text-center">
            <Cloud className="w-8 h-8 text-green-400 mx-auto mb-3" />
            <h5 className="text-white font-medium mb-2">Windows Agent</h5>
            <p className="text-gray-400 text-sm mb-4">For Windows Server</p>
            <button className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg transition-colors w-full">
              Download
            </button>
          </div>
          
          <div className="bg-gray-700 rounded-lg p-4 text-center">
            <Database className="w-8 h-8 text-purple-400 mx-auto mb-3" />
            <h5 className="text-white font-medium mb-2">Docker Agent</h5>
            <p className="text-gray-400 text-sm mb-4">Container deployment</p>
            <button className="bg-purple-600 hover:bg-purple-700 text-white px-4 py-2 rounded-lg transition-colors w-full">
              Download
            </button>
          </div>
        </div>
      </div>

      {/* Installation Instructions */}
      <div className="bg-gray-800 rounded-xl p-6 border border-gray-700">
        <h4 className="text-white font-semibold mb-4">Quick Installation</h4>
        <div className="space-y-4">
          <div>
            <h5 className="text-gray-300 font-medium mb-2">Linux/macOS</h5>
            <div className="bg-gray-900 rounded-lg p-4">
              <code className="text-gray-300 text-sm">
                curl -sSL https://install.logmonitor.com/agent.sh | bash -s -- --token={apiKey}
              </code>
            </div>
          </div>
          
          <div>
            <h5 className="text-gray-300 font-medium mb-2">Docker</h5>
            <div className="bg-gray-900 rounded-lg p-4">
              <code className="text-gray-300 text-sm">
                docker run -d --name logmonitor-agent -e TOKEN={apiKey} logmonitor/agent:latest
              </code>
            </div>
          </div>
        </div>
      </div>

      {/* Agent Configuration */}
      <div className="bg-gray-800 rounded-xl p-6 border border-gray-700">
        <h4 className="text-white font-semibold mb-4">Agent Configuration</h4>
        <div className="bg-gray-900 rounded-lg p-4 overflow-x-auto">
          <pre className="text-gray-300 text-sm">
{`# /etc/logmonitor/agent.conf
[general]
api_key = ${apiKey}
endpoint = https://api.logmonitor.com/v1/logs

[logs]
# Application logs
/var/log/app/*.log
/var/log/nginx/access.log
/var/log/nginx/error.log

# System logs
/var/log/syslog
/var/log/auth.log

[filters]
exclude_patterns = ["DEBUG", "TRACE"]
include_levels = ["INFO", "WARN", "ERROR"]`}
          </pre>
        </div>
      </div>
    </div>
  );

  const renderLogSources = () => (
    <div className="space-y-6">
      {/* Active Sources */}
      <div className="bg-gray-800 rounded-xl p-6 border border-gray-700">
        <div className="flex items-center justify-between mb-6">
          <h4 className="text-white font-semibold">Active Log Sources</h4>
          <button className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg transition-colors flex items-center space-x-2">
            <RefreshCw className="w-4 h-4" />
            <span>Refresh</span>
          </button>
        </div>
        
        <div className="space-y-4">
          {logSources.map((source) => (
            <div key={source.id} className="bg-gray-700 rounded-lg p-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <div className="p-2 bg-gray-600 rounded-lg">
                    {source.icon}
                  </div>
                  <div>
                    <h5 className="text-white font-medium">{source.name}</h5>
                    <p className="text-gray-400 text-sm capitalize">{source.type} • {source.lastActivity}</p>
                  </div>
                </div>
                <div className="flex items-center space-x-4">
                  <div className="text-right">
                    <p className="text-white font-medium">{source.logsReceived.toLocaleString()}</p>
                    <p className="text-gray-400 text-sm">logs received</p>
                  </div>
                  <span className={`px-3 py-1 rounded-full text-xs font-medium ${getStatusColor(source.status)}`}>
                    {source.status}
                  </span>
                  <button className="text-gray-400 hover:text-white">
                    <Settings className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Quick Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="bg-gray-800 rounded-xl p-4 border border-gray-700">
          <div className="flex items-center space-x-3">
            <Zap className="w-8 h-8 text-blue-400" />
            <div>
              <p className="text-2xl font-bold text-white">4</p>
              <p className="text-gray-400 text-sm">Active Sources</p>
            </div>
          </div>
        </div>
        
        <div className="bg-gray-800 rounded-xl p-4 border border-gray-700">
          <div className="flex items-center space-x-3">
            <Activity className="w-8 h-8 text-green-400" />
            <div>
              <p className="text-2xl font-bold text-white">27.1K</p>
              <p className="text-gray-400 text-sm">Total Logs</p>
            </div>
          </div>
        </div>
        
        <div className="bg-gray-800 rounded-xl p-4 border border-gray-700">
          <div className="flex items-center space-x-3">
            <Clock className="w-8 h-8 text-purple-400" />
            <div>
              <p className="text-2xl font-bold text-white">2.3s</p>
              <p className="text-gray-400 text-sm">Avg Latency</p>
            </div>
          </div>
        </div>
        
        <div className="bg-gray-800 rounded-xl p-4 border border-gray-700">
          <div className="flex items-center space-x-3">
            <Database className="w-8 h-8 text-orange-400" />
            <div>
              <p className="text-2xl font-bold text-white">1.2GB</p>
              <p className="text-gray-400 text-sm">Data Today</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );

  const tabs = [
    { id: 'upload', label: 'File Upload', icon: <Upload className="w-4 h-4" /> },
    { id: 'api', label: 'API Integration', icon: <Code className="w-4 h-4" /> },
    { id: 'webhooks', label: 'Webhooks', icon: <Globe className="w-4 h-4" /> },
    { id: 'agents', label: 'Agents', icon: <Terminal className="w-4 h-4" /> },
    { id: 'sources', label: 'Log Sources', icon: <Server className="w-4 h-4" /> }
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-white mb-2">Log Ingestion</h1>
          <p className="text-gray-400">Upload and configure log sources for monitoring</p>
        </div>
        <div className="flex items-center space-x-3">
          <button className="flex items-center space-x-2 px-4 py-2 bg-gray-700 hover:bg-gray-600 text-white rounded-lg transition-colors">
            <Download className="w-4 h-4" />
            <span>Documentation</span>
          </button>
        </div>
      </div>

      {/* Tabs */}
      <div className="bg-gray-800 rounded-xl border border-gray-700">
        <div className="flex border-b border-gray-700">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex items-center space-x-2 px-6 py-4 font-medium transition-colors ${
                activeTab === tab.id
                  ? 'text-blue-400 border-b-2 border-blue-400'
                  : 'text-gray-400 hover:text-white'
              }`}
            >
              {tab.icon}
              <span>{tab.label}</span>
            </button>
          ))}
        </div>
        
        <div className="p-6">
          {activeTab === 'upload' && renderFileUpload()}
          {activeTab === 'api' && renderAPIIntegration()}
          {activeTab === 'webhooks' && renderWebhooks()}
          {activeTab === 'agents' && renderAgents()}
          {activeTab === 'sources' && renderLogSources()}
        </div>
      </div>
    </div>
  );
};