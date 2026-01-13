
import React from 'react';

interface ReactorCoreProps {
  status: 'idle' | 'processing' | 'active' | 'warning';
  stability: number;
}

const ReactorCore: React.FC<ReactorCoreProps> = ({ status, stability }) => {
  const getColor = () => {
    if (status === 'processing') return 'stroke-cyan-400 fill-cyan-400/10';
    if (status === 'warning') return 'stroke-orange-500 fill-orange-500/10';
    if (stability < 50) return 'stroke-red-500 fill-red-500/10';
    return 'stroke-cyan-500 fill-cyan-500/5';
  };

  const getAnimationSpeed = () => {
    if (status === 'processing') return 'animate-[spin_1s_linear_infinite]';
    if (status === 'warning') return 'animate-[spin_4s_linear_infinite]';
    return 'animate-[spin_10s_linear_infinite]';
  };

  return (
    <div className="relative flex items-center justify-center h-full w-full">
      {/* Background Glow */}
      <div className={`absolute w-64 h-64 rounded-full blur-3xl transition-colors duration-1000 ${
        status === 'processing' ? 'bg-cyan-500/30' : 
        status === 'warning' ? 'bg-orange-500/30' : 'bg-cyan-900/20'
      }`} />

      {/* SVG Reactor Visual */}
      <svg className={`w-80 h-80 ${getAnimationSpeed()} ${getColor()} transition-all duration-500`} viewBox="0 0 100 100">
        <circle cx="50" cy="50" r="45" fill="none" strokeWidth="0.5" strokeDasharray="5,2" />
        <circle cx="50" cy="50" r="38" fill="none" strokeWidth="1" strokeDasharray="2,8" />
        
        {/* Inner Rings */}
        <g className="animate-pulse">
           <circle cx="50" cy="50" r="25" fill="none" strokeWidth="2" strokeDasharray="10,5" />
           <circle cx="50" cy="50" r="15" fill="none" strokeWidth="1" />
        </g>

        {/* Core Elements */}
        {[0, 60, 120, 180, 240, 300].map((angle) => (
          <line 
            key={angle}
            x1="50" y1="50" 
            x2={50 + 40 * Math.cos(angle * Math.PI / 180)} 
            y2={50 + 40 * Math.sin(angle * Math.PI / 180)} 
            strokeWidth="0.5" 
            className="opacity-50"
          />
        ))}
      </svg>

      {/* Center Label */}
      <div className="absolute flex flex-col items-center">
        <span className="text-[10px] uppercase tracking-widest text-cyan-500 font-bold opacity-70">Core Stability</span>
        <span className="text-4xl font-orbitron font-black text-white drop-shadow-md">
          {Math.round(stability)}%
        </span>
        <span className={`text-[10px] mt-1 font-bold px-2 py-0.5 rounded border ${
          status === 'processing' ? 'bg-cyan-500 text-black animate-pulse' : 'bg-transparent text-cyan-400 border-cyan-400'
        }`}>
          {status.toUpperCase()}
        </span>
      </div>
    </div>
  );
};

export default ReactorCore;
