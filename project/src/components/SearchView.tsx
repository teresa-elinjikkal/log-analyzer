import React, { useState } from 'react';
import { LogEntry } from '../types';
import { Search, Calendar, Filter, Download, Zap } from 'lucide-react';

interface SearchViewProps {
  logs: LogEntry[];
}

export const SearchView: React.FC<SearchViewProps> = ({ logs }) => {
  const [query, setQuery] = useState('');
  const [regexMode, setRegexMode] = useState(false);
  const [dateRange, setDateRange] = useState({ start: '', end: '' });
  const [sourceFilter, setSourceFilter] = useState('all');
  const [results, setResults] = useState<LogEntry[]>([]);

  const sources = Array.from(new Set(logs.map(log => log.source)));

  const handleSearch = () => {
    let filtered = logs;

    // Apply date range filter
    if (dateRange.start) {
      const startDate = new Date(dateRange.start);
      filtered = filtered.filter(log => log.timestamp >= startDate);
    }
    if (dateRange.end) {
      const endDate = new Date(dateRange.end);
      filtered = filtered.filter(log => log.timestamp <= endDate);
    }

    // Apply source filter
    if (sourceFilter !== 'all') {
      filtered = filtered.filter(log => log.source === sourceFilter);
    }

    // Apply search query
    if (query) {
      if (regexMode) {
        try {
          const regex = new RegExp(query, 'i');
          filtered = filtered.filter(log => 
            regex.test(log.message) || 
            regex.test(log.source) ||
            (log.ip && regex.test(log.ip)) ||
            (log.path && regex.test(log.path))
          );
        } catch (e) {
          // Invalid regex, fall back to simple search
          const lowerQuery = query.toLowerCase();
          filtered = filtered.filter(log => 
            log.message.toLowerCase().includes(lowerQuery) ||
            log.source.toLowerCase().includes(lowerQuery) ||
            (log.ip && log.ip.includes(lowerQuery)) ||
            (log.path && log.path.toLowerCase().includes(lowerQuery))
          );
        }
      } else {
        const lowerQuery = query.toLowerCase();
        filtered = filtered.filter(log => 
          log.message.toLowerCase().includes(lowerQuery) ||
          log.source.toLowerCase().includes(lowerQuery) ||
          (log.ip && log.ip.includes(lowerQuery)) ||
          (log.path && log.path.toLowerCase().includes(lowerQuery))
        );
      }
    }

    setResults(filtered.slice(0, 1000)); // Limit results for performance
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-white mb-2">Advanced Search</h1>
          <p className="text-gray-400">Search and filter logs with advanced criteria</p>
        </div>
        <button className="flex items-center space-x-2 px-4 py-2 bg-green-600 hover:bg-green-700 text-white rounded-lg transition-colors">
          <Download className="w-4 h-4" />
          <span>Export Results</span>
        </button>
      </div>

      {/* Search Form */}
      <div className="bg-gray-800 rounded-xl p-6 border border-gray-700">
        <div className="space-y-4">
          {/* Search Query */}
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">
              Search Query
            </label>
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
              <input
                type="text"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Enter search terms or regex pattern..."
                className="w-full pl-10 pr-4 py-3 bg-gray-700 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>
            <div className="mt-2">
              <label className="flex items-center space-x-2">
                <input
                  type="checkbox"
                  checked={regexMode}
                  onChange={(e) => setRegexMode(e.target.checked)}
                  className="rounded bg-gray-700 border-gray-600 text-blue-600 focus:ring-blue-500"
                />
                <span className="text-sm text-gray-400">Use regular expressions</span>
              </label>
            </div>
          </div>

          {/* Filters Row */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {/* Date Range */}
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                Start Date
              </label>
              <div className="relative">
                <Calendar className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                <input
                  type="datetime-local"
                  value={dateRange.start}
                  onChange={(e) => setDateRange(prev => ({ ...prev, start: e.target.value }))}
                  className="w-full pl-10 pr-4 py-3 bg-gray-700 border border-gray-600 rounded-lg text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                End Date
              </label>
              <div className="relative">
                <Calendar className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                <input
                  type="datetime-local"
                  value={dateRange.end}
                  onChange={(e) => setDateRange(prev => ({ ...prev, end: e.target.value }))}
                  className="w-full pl-10 pr-4 py-3 bg-gray-700 border border-gray-600 rounded-lg text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>
            </div>

            {/* Source Filter */}
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                Source
              </label>
              <div className="relative">
                <Filter className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                <select
                  value={sourceFilter}
                  onChange={(e) => setSourceFilter(e.target.value)}
                  className="w-full pl-10 pr-4 py-3 bg-gray-700 border border-gray-600 rounded-lg text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                >
                  <option value="all">All Sources</option>
                  {sources.map(source => (
                    <option key={source} value={source}>{source}</option>
                  ))}
                </select>
              </div>
            </div>
          </div>

          {/* Search Button */}
          <div className="flex justify-end">
            <button
              onClick={handleSearch}
              className="flex items-center space-x-2 px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors font-medium"
            >
              <Zap className="w-4 h-4" />
              <span>Search Logs</span>
            </button>
          </div>
        </div>
      </div>

      {/* Results */}
      {results.length > 0 && (
        <div className="bg-gray-800 rounded-xl border border-gray-700">
          <div className="p-4 border-b border-gray-700">
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-semibold text-white">
                Search Results ({results.length} entries)
              </h3>
              <span className="text-sm text-gray-400">
                Showing first 1000 matches
              </span>
            </div>
          </div>
          
          <div className="max-h-96 overflow-y-auto">
            <div className="divide-y divide-gray-700">
              {results.map((log) => (
                <div key={log.id} className="p-4 hover:bg-gray-750 transition-colors">
                  <div className="flex items-start space-x-4">
                    {/* Level Badge */}
                    <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium border ${
                      log.level === 'ERROR' ? 'bg-red-900 text-red-200 border-red-700' :
                      log.level === 'WARN' ? 'bg-yellow-900 text-yellow-200 border-yellow-700' :
                      log.level === 'DEBUG' ? 'bg-purple-900 text-purple-200 border-purple-700' :
                      'bg-blue-900 text-blue-200 border-blue-700'
                    }`}>
                      {log.level}
                    </span>

                    {/* Content */}
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center space-x-3 mb-1 text-sm text-gray-400">
                        <span>{log.timestamp.toLocaleString()}</span>
                        <span className="font-mono">{log.source}</span>
                        {log.ip && <span className="font-mono">{log.ip}</span>}
                      </div>
                      <p className="text-white text-sm break-words">{log.message}</p>
                      {log.method && log.path && (
                        <p className="text-gray-400 text-sm font-mono mt-1">
                          {log.method} {log.path}
                          {log.statusCode && (
                            <span className="ml-2 text-xs px-1 py-0.5 rounded bg-gray-700">
                              {log.statusCode}
                            </span>
                          )}
                        </p>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* No Results */}
      {query && results.length === 0 && (
        <div className="bg-gray-800 rounded-xl p-8 border border-gray-700 text-center">
          <Search className="w-12 h-12 text-gray-400 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-white mb-2">No Results Found</h3>
          <p className="text-gray-400">
            Try adjusting your search criteria or date range
          </p>
        </div>
      )}
    </div>
  );
};