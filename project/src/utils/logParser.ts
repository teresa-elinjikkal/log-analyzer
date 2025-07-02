import { LogEntry } from '../types';

export const generateMockLogs = (count: number = 100): LogEntry[] => {
  const levels: LogEntry['level'][] = ['ERROR', 'WARN', 'INFO', 'DEBUG'];
  const sources = ['nginx', 'apache', 'application', 'database', 'auth'];
  const paths = ['/api/users', '/login', '/dashboard', '/api/orders', '/static/css', '/api/search'];
  const ips = ['192.168.1.100', '10.0.0.15', '172.16.0.22', '203.0.113.45', '198.51.100.12'];
  const methods = ['GET', 'POST', 'PUT', 'DELETE'];
  const statusCodes = [200, 201, 400, 401, 403, 404, 500, 502, 503];
  
  const messages = {
    ERROR: [
      'Database connection failed',  
      'Authentication error occurred',
      'Failed to process request',
      'Internal server error',
      'Memory allocation failed'
    ],
    WARN: [
      'High memory usage detected',
      'Slow query performance',
      'Deprecated API endpoint used',
      'Rate limit approaching',
      'Cache miss occurred'
    ],
    INFO: [
      'User login successful',
      'Request processed successfully', 
      'File uploaded successfully',
      'Cache invalidated',
      'Backup completed'
    ],
    DEBUG: [
      'Processing user request',
      'Database query executed',
      'Cache lookup performed',
      'Session validated',
      'API endpoint called'
    ]
  };

  return Array.from({ length: count }, (_, i) => {
    const level = levels[Math.floor(Math.random() * levels.length)];
    const source = sources[Math.floor(Math.random() * sources.length)];
    const ip = ips[Math.floor(Math.random() * ips.length)];
    const method = methods[Math.floor(Math.random() * methods.length)];
    const path = paths[Math.floor(Math.random() * paths.length)];
    const statusCode = statusCodes[Math.floor(Math.random() * statusCodes.length)];
    
    return {
      id: `log-${i + 1}`,
      timestamp: new Date(Date.now() - Math.random() * 86400000 * 7), // Last 7 days
      level,
      message: messages[level][Math.floor(Math.random() * messages[level].length)],
      source,
      ip,
      userAgent: 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36',
      responseTime: Math.floor(Math.random() * 2000) + 50,
      statusCode,
      method,
      path
    };
  });
};

export const parseLogLine = (line: string): LogEntry | null => {
  // Simple log parsing - in production this would be more sophisticated
  const timestamp = new Date();
  const level = line.includes('ERROR') ? 'ERROR' : 
                line.includes('WARN') ? 'WARN' :
                line.includes('DEBUG') ? 'DEBUG' : 'INFO';
  
  return {
    id: `parsed-${Date.now()}-${Math.random()}`,
    timestamp,
    level,
    message: line,
    source: 'parsed'
  };
};