
import React, { useState } from 'react';

interface ControlCenterProps {
  onProcess: (input: string) => void;
  isProcessing: boolean;
}

const ControlCenter: React.FC<ControlCenterProps> = ({ onProcess, isProcessing }) => {
  const [input, setInput] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (input.trim() && !isProcessing) {
      onProcess(input);
      setInput('');
    }
  };

  return (
    <div className="glass-panel rounded-lg p-6 flex flex-col h-full border-l-4 border-l-cyan-500">
      <div className="mb-4">
        <h2 className="font-orbitron text-lg font-black text-white tracking-wider flex items-center gap-2">
          <div className={`w-3 h-3 rounded-full ${isProcessing ? 'bg-cyan-500 animate-ping' : 'bg-cyan-500'}`} />
          INJECTION MANIFOLD
        </h2>
        <p className="text-xs text-slate-400 mt-1 uppercase tracking-tighter">Enter raw data for high-energy AI enrichment</p>
      </div>

      <form onSubmit={handleSubmit} className="flex-1 flex flex-col gap-4">
        <div className="relative flex-1 group">
          <textarea
            value={input}
            onChange={(e) => setInput(e.target.value)}
            disabled={isProcessing}
            placeholder="INJECT COMMAND OR DATA STREAM..."
            className="w-full h-full bg-slate-900/50 border border-slate-700 rounded-md p-4 text-cyan-50 font-mono text-sm focus:outline-none focus:border-cyan-500 transition-all resize-none placeholder:text-slate-600 disabled:opacity-50"
          />
          <div className="absolute top-0 right-0 p-2 pointer-events-none">
             <span className="text-[10px] font-bold text-slate-700 font-mono">B-249 // INPUT</span>
          </div>
        </div>

        <button
          type="submit"
          disabled={!input.trim() || isProcessing}
          className={`
            py-4 px-6 rounded font-orbitron font-bold text-sm tracking-widest transition-all
            ${isProcessing 
              ? 'bg-slate-800 text-slate-500 cursor-not-allowed border border-slate-700' 
              : 'bg-cyan-500 text-slate-950 hover:bg-cyan-400 hover:scale-[1.02] shadow-[0_0_20px_rgba(6,182,212,0.4)]'
            }
          `}
        >
          {isProcessing ? 'REACTING...' : 'INITIATE REACTION'}
        </button>
      </form>
    </div>
  );
};

export default ControlCenter;
