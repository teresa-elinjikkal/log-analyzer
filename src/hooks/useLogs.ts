import { useState, useEffect, useCallback } from 'react';
import { LogEntry, LogStats } from '../types';
import { generateMockLogs } from '../utils/logParser';

export const useLogs = () => {
  const [logs, setLogs] = useState<LogEntry[]>([]);
  const [filteredLogs, setFilteredLogs] = useState<LogEntry[]>([]);
  const [isStreaming, setIsStreaming] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [levelFilter, setLevelFilter] = useState<string>('all');

  // Initialize with mock data
  useEffect(() => {
    const mockLogs = generateMockLogs(500);
    setLogs(mockLogs.sort((a, b) => b.timestamp.getTime() - a.timestamp.getTime()));
  }, []);

  // Filter logs based on search and level
  useEffect(() => {
    let filtered = logs;
    
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      filtered = filtered.filter(log => 
        log.message.toLowerCase().includes(query) ||
        log.source.toLowerCase().includes(query) ||
        (log.ip && log.ip.includes(query)) ||
        (log.path && log.path.toLowerCase().includes(query))
      );
    }
    
    if (levelFilter !== 'all') {
      filtered = filtered.filter(log => log.level === levelFilter);
    }
    
    setFilteredLogs(filtered);
  }, [logs, searchQuery, levelFilter]);

  // Simulate real-time log streaming
  useEffect(() => {
    if (!isStreaming) return;
    
    const interval = setInterval(() => {
      const newLog = generateMockLogs(1)[0];
      newLog.timestamp = new Date();
      setLogs(prev => [newLog, ...prev].slice(0, 1000)); // Keep last 1000 logs
    }, 2000);
    
    return () => clearInterval(interval);
  }, [isStreaming]);

  const getStats = useCallback((): LogStats => {
    const errorCount = logs.filter(log => log.level === 'ERROR').length;
    const warningCount = logs.filter(log => log.level === 'WARN').length;
    const infoCount = logs.filter(log => log.level === 'INFO').length;
    
    const responseTimes = logs.filter(log => log.responseTime).map(log => log.responseTime!);
    const avgResponseTime = responseTimes.reduce((a, b) => a + b, 0) / responseTimes.length || 0;
    
    // Top IPs
    const ipCounts = logs.reduce((acc, log) => {
      if (log.ip) {
        acc[log.ip] = (acc[log.ip] || 0) + 1;
      }
      return acc;
    }, {} as Record<string, number>);
    const topIPs = Object.entries(ipCounts)
      .sort(([,a], [,b]) => b - a)
      .slice(0, 5)
      .map(([ip, count]) => ({ ip, count }));
    
    // Top paths
    const pathCounts = logs.reduce((acc, log) => {
      if (log.path) {
        acc[log.path] = (acc[log.path] || 0) + 1;
      }
      return acc;
    }, {} as Record<string, number>);
    const topPaths = Object.entries(pathCounts)
      .sort(([,a], [,b]) => b - a)
      .slice(0, 5)
      .map(([path, count]) => ({ path, count }));
    
    // Status codes
    const statusCounts = logs.reduce((acc, log) => {
      if (log.statusCode) {
        acc[log.statusCode] = (acc[log.statusCode] || 0) + 1;
      }
      return acc;
    }, {} as Record<number, number>);
    const statusCodes = Object.entries(statusCounts)
      .sort(([,a], [,b]) => b - a)
      .map(([code, count]) => ({ code: parseInt(code), count }));
    
    return {
      totalLogs: logs.length,
      errorCount,
      warningCount,
      infoCount,
      avgResponseTime: Math.round(avgResponseTime),
      topIPs,
      topPaths,
      statusCodes
    };
  }, [logs]);

  return {
    logs: filteredLogs,
    allLogs: logs,
    isStreaming,
    setIsStreaming,
    searchQuery,
    setSearchQuery,
    levelFilter,
    setLevelFilter,
    stats: getStats()
  };
};