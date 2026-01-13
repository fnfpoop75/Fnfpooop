
import React from 'react';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { TelemetryData } from '../types';

interface TelemetryPanelProps {
  data: TelemetryData[];
}

const TelemetryPanel: React.FC<TelemetryPanelProps> = ({ data }) => {
  return (
    <div className="h-full w-full flex flex-col p-4">
      <div className="flex justify-between items-center mb-4">
        <h3 className="font-orbitron text-xs font-bold tracking-widest text-cyan-400 uppercase">Energy Telemetry</h3>
        <div className="flex gap-4">
          <div className="flex items-center gap-1">
            <div className="w-2 h-2 rounded-full bg-cyan-500"></div>
            <span className="text-[10px] text-slate-400 uppercase">Power Output</span>
          </div>
          <div className="flex items-center gap-1">
            <div className="w-2 h-2 rounded-full bg-orange-500"></div>
            <span className="text-[10px] text-slate-400 uppercase">Core Heat</span>
          </div>
        </div>
      </div>
      
      <div className="flex-1 w-full min-h-[150px]">
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart data={data}>
            <defs>
              <linearGradient id="colorPower" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#06b6d4" stopOpacity={0.3}/>
                <stop offset="95%" stopColor="#06b6d4" stopOpacity={0}/>
              </linearGradient>
              <linearGradient id="colorHeat" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#f97316" stopOpacity={0.2}/>
                <stop offset="95%" stopColor="#f97316" stopOpacity={0}/>
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" vertical={false} />
            <XAxis dataKey="time" hide />
            <YAxis hide domain={[0, 100]} />
            <Tooltip 
              contentStyle={{ backgroundColor: '#0f172a', border: '1px solid #334155', borderRadius: '4px', fontSize: '10px' }}
              itemStyle={{ fontSize: '10px' }}
            />
            <Area 
              type="monotone" 
              dataKey="power" 
              stroke="#06b6d4" 
              fillOpacity={1} 
              fill="url(#colorPower)" 
              strokeWidth={2}
              isAnimationActive={false}
            />
            <Area 
              type="monotone" 
              dataKey="heat" 
              stroke="#f97316" 
              fillOpacity={1} 
              fill="url(#colorHeat)" 
              strokeWidth={1}
              isAnimationActive={false}
            />
          </AreaChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};

export default TelemetryPanel;
