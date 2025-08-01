// src/redux/logsSlice.ts
import { createSlice, PayloadAction } from '@reduxjs/toolkit';

export interface LogEntry {
  id: string;
  timestamp: string;
  level: string;
  message: string;
  source: string;
  ip?: string;
  statusCode?: number;
  responseTime?: number;
  path?: string;
  userAgent?: string;
  details?: any;
}

interface LogsState {
  logs: LogEntry[];
}

const initialState: LogsState = {
  logs: [],
};

export const logsSlice = createSlice({
  name: 'logs',
  initialState,
  reducers: {
    setLogs: (state, action: PayloadAction<LogEntry[]>) => {
      state.logs = action.payload;
    },
    addLog: (state, action: PayloadAction<LogEntry>) => {
      state.logs.push(action.payload);
    },
    addLogs: (state, action: PayloadAction<LogEntry[]>) => {
      state.logs.push(...action.payload);
    },
    clearLogs: (state) => {
      state.logs = [];
    },
  },
});

export const { setLogs, addLog, addLogs, clearLogs } = logsSlice.actions;
export default logsSlice.reducer;
