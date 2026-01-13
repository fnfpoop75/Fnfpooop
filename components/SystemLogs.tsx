
import React, { useEffect, useRef } from 'react';
import { SystemLog } from '../types';

interface SystemLogsProps {
  logs: SystemLog[];
}

const SystemLogs: React.FC<SystemLogsProps> = ({ logs }) => {
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [logs]);

  const getLogColor = (type: SystemLog['type']) => {
    switch (type) {
      case 'success': return 'text-emerald-400';
      case 'error': return 'text-red-400';
      case 'warning': return 'text-orange-400';
      default: return 'text-cyan-400';
    }
  };

  return (
    <div className="glass-panel rounded-lg p-4 flex flex-col h-full font-mono text-[10px]">
      <div className="flex justify-between items-center mb-2 border-b border-slate-800 pb-2">
        <span className="text-slate-500 uppercase tracking-widest font-bold">System Output Log</span>
        <span className="text-slate-700">v4.2.0-STABLE</span>
      </div>
      
      <div 
        ref={scrollRef}
        className="flex-1 overflow-y-auto space-y-1 pr-2 scrollbar-thin scrollbar-thumb-slate-800"
      >
        {logs.map((log) => (
          <div key={log.id} className="flex gap-3 leading-relaxed">
            <span className="text-slate-600 shrink-0">[{log.timestamp}]</span>
            <span className={`${getLogColor(log.type)}`}>
              <span className="uppercase font-bold">[{log.type}]</span> {log.message}
            </span>
          </div>
        ))}
        {logs.length === 0 && (
          <div className="text-slate-800 italic">SYSTEM IDLE. AWAITING INPUT...</div>
        )}
      </div>
    </div>
  );
};

export default SystemLogs;
