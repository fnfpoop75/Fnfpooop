
import React, { useState, useEffect, useCallback } from 'react';
import { SystemLog, TelemetryData, ReactionResponse } from './types';
import ReactorCore from './components/ReactorCore';
import TelemetryPanel from './components/TelemetryPanel';
import ControlCenter from './components/ControlCenter';
import SystemLogs from './components/SystemLogs';
import { processReaction, speakStatus } from './services/geminiService';

const App: React.FC = () => {
  const [logs, setLogs] = useState<SystemLog[]>([]);
  const [telemetry, setTelemetry] = useState<TelemetryData[]>([]);
  const [stability, setStability] = useState(100);
  const [coreStatus, setCoreStatus] = useState<'idle' | 'processing' | 'active' | 'warning'>('idle');
  const [lastResponse, setLastResponse] = useState<ReactionResponse | null>(null);

  // Initialize Telemetry
  useEffect(() => {
    const initialData = Array.from({ length: 20 }, (_, i) => ({
      time: i.toString(),
      power: 20 + Math.random() * 10,
      heat: 15 + Math.random() * 5,
      stability: 100
    }));
    setTelemetry(initialData);

    const interval = setInterval(() => {
      setTelemetry(prev => {
        const last = prev[prev.length - 1];
        const nextTime = (parseInt(last.time) + 1).toString();
        
        // Base fluctuation
        let pFactor = coreStatus === 'processing' ? 20 : 0;
        let hFactor = coreStatus === 'processing' ? 30 : 0;
        
        const newData = {
          time: nextTime,
          power: Math.max(0, Math.min(100, last.power + (Math.random() - 0.5) * 5 + pFactor)),
          heat: Math.max(0, Math.min(100, last.heat + (Math.random() - 0.5) * 3 + hFactor)),
          stability: stability
        };
        
        // Return sliding window
        return [...prev.slice(1), newData];
      });
    }, 1000);

    return () => clearInterval(interval);
  }, [coreStatus, stability]);

  const addLog = useCallback((message: string, type: SystemLog['type'] = 'info') => {
    const newLog: SystemLog = {
      id: Date.now().toString() + Math.random(),
      timestamp: new Date().toLocaleTimeString('en-GB', { hour12: false }),
      message,
      type
    };
    setLogs(prev => [...prev.slice(-49), newLog]);
  }, []);

  const handleProcess = async (input: string) => {
    setCoreStatus('processing');
    setStability(prev => prev - 15);
    addLog(`Initiating injection sequence: "${input.substring(0, 30)}..."`, 'info');
    
    try {
      const result = await processReaction(input);
      setLastResponse(result);
      
      // Update UI based on AI response
      if (result.threatLevel === 'Critical' || result.threatLevel === 'High') {
        setCoreStatus('warning');
        addLog(`THREAT DETECTED: Core equilibrium unstable. [${result.threatLevel}]`, 'error');
        setStability(Math.max(10, 80 - result.efficiency / 2));
      } else {
        setCoreStatus('active');
        addLog(`Reaction complete. Efficiency: ${result.efficiency}%`, 'success');
        setStability(Math.min(100, 90 + result.efficiency / 10));
      }

      result.analysis.forEach((insight: string) => {
        addLog(`Isotope extracted: ${insight}`, 'success');
      });

      // Voice feedback
      speakStatus(result.summary);

      // Back to active/idle after a while
      setTimeout(() => {
        if (coreStatus !== 'warning') setCoreStatus('idle');
      }, 5000);

    } catch (error) {
      addLog(`Reaction failed: Fission failure in CORE-1.`, 'error');
      setCoreStatus('warning');
      setStability(prev => Math.max(0, prev - 20));
    }
  };

  return (
    <div className="min-h-screen p-4 md:p-8 flex flex-col gap-6 relative">
      <div className="scanline" />
      
      {/* Header */}
      <header className="flex flex-col md:flex-row justify-between items-start md:items-center glass-panel p-6 rounded-lg border-t-4 border-t-cyan-500 shadow-lg">
        <div>
          <h1 className="font-orbitron text-3xl font-black tracking-tighter text-white flex items-center gap-4">
            THE REACTOR
            <span className="text-xs font-mono bg-cyan-950 text-cyan-400 px-2 py-1 rounded border border-cyan-800">SECURE NODE-7</span>
          </h1>
          <p className="text-slate-500 text-[10px] mt-1 uppercase tracking-[0.2em] font-bold">Advanced Intelligence Processing Core // Alpha v.0.1.4</p>
        </div>
        
        <div className="mt-4 md:mt-0 flex gap-8 items-center">
          <div className="text-right">
            <div className="text-[10px] text-slate-500 uppercase font-bold tracking-widest">System Load</div>
            <div className="text-xl font-orbitron text-cyan-500">{(100 - stability).toFixed(1)}%</div>
          </div>
          <div className="text-right border-l border-slate-800 pl-8">
            <div className="text-[10px] text-slate-500 uppercase font-bold tracking-widest">Uptime</div>
            <div className="text-xl font-orbitron text-white">00:12:44:09</div>
          </div>
        </div>
      </header>

      {/* Main Grid */}
      <main className="flex-1 grid grid-cols-1 lg:grid-cols-12 gap-6 min-h-0">
        
        {/* Left Column: Input and Logs */}
        <div className="lg:col-span-4 flex flex-col gap-6">
          <div className="flex-1">
            <ControlCenter onProcess={handleProcess} isProcessing={coreStatus === 'processing'} />
          </div>
          <div className="h-[250px]">
            <SystemLogs logs={logs} />
          </div>
        </div>

        {/* Center Column: Reactor Visualizer */}
        <div className="lg:col-span-4 flex flex-col gap-6">
          <div className="glass-panel rounded-lg flex-1 relative overflow-hidden flex flex-col items-center justify-center min-h-[400px]">
            <div className="absolute top-4 left-4 font-orbitron text-[10px] text-slate-500 font-bold tracking-[0.3em]">LIVE FEED // CORE_CAM_01</div>
            <ReactorCore status={coreStatus} stability={stability} />
            
            {/* Corner Markers */}
            <div className="absolute top-4 right-4 text-cyan-500/30 font-mono text-[8px]">[34.09, -122.98]</div>
            <div className="absolute bottom-4 left-4 text-cyan-500/30 font-mono text-[8px]">STABILITY_SYNC: TRUE</div>
            <div className="absolute bottom-4 right-4 text-cyan-500/30 font-mono text-[8px]">CORE_LOCK: ACTIVE</div>
          </div>
          
          <div className="glass-panel h-[150px] rounded-lg p-4 flex flex-col justify-center">
            {lastResponse ? (
               <div className="animate-in fade-in duration-500">
                  <h4 className="text-[10px] font-bold text-cyan-500 uppercase tracking-widest mb-1">Last Analysis Result</h4>
                  <p className="text-sm font-mono text-slate-300 leading-snug line-clamp-3 italic">"{lastResponse.summary}"</p>
                  <div className="flex gap-2 mt-2">
                    {lastResponse.analysis.slice(0, 2).map((a, i) => (
                      <span key={i} className="text-[9px] bg-slate-800 text-slate-400 px-2 py-0.5 rounded border border-slate-700">#{a.split(' ')[0].toLowerCase()}</span>
                    ))}
                  </div>
               </div>
            ) : (
               <div className="text-center py-4 border-2 border-dashed border-slate-800 rounded">
                 <p className="text-[10px] text-slate-700 uppercase font-bold">No recent reaction results</p>
               </div>
            )}
          </div>
        </div>

        {/* Right Column: Telemetry and Stats */}
        <div className="lg:col-span-4 flex flex-col gap-6">
          <div className="glass-panel rounded-lg flex-1">
            <TelemetryPanel data={telemetry} />
          </div>
          
          <div className="grid grid-cols-2 gap-4 h-[250px]">
            <div className="glass-panel rounded-lg p-4 flex flex-col justify-between border-t border-t-orange-500/50">
              <span className="text-[10px] text-slate-500 uppercase font-bold tracking-widest">Heat Level</span>
              <div className="flex flex-col">
                <span className={`text-3xl font-orbitron ${stability < 30 ? 'text-red-500' : 'text-orange-500'}`}>
                   {telemetry[telemetry.length - 1]?.heat.toFixed(1)}°C
                </span>
                <div className="w-full bg-slate-900 h-1.5 mt-2 rounded-full overflow-hidden">
                  <div className="h-full bg-orange-500 transition-all duration-300" style={{ width: `${telemetry[telemetry.length - 1]?.heat}%` }} />
                </div>
              </div>
            </div>
            
            <div className="glass-panel rounded-lg p-4 flex flex-col justify-between border-t border-t-cyan-500/50">
              <span className="text-[10px] text-slate-500 uppercase font-bold tracking-widest">Efficiency</span>
              <div className="flex flex-col">
                <span className="text-3xl font-orbitron text-cyan-400">
                  {lastResponse ? lastResponse.efficiency : '--'}%
                </span>
                <div className="w-full bg-slate-900 h-1.5 mt-2 rounded-full overflow-hidden">
                  <div className="h-full bg-cyan-400 transition-all duration-300" style={{ width: `${lastResponse ? lastResponse.efficiency : 0}%` }} />
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>

      {/* Footer Status Bar */}
      <footer className="glass-panel p-2 rounded-md flex justify-between items-center text-[9px] uppercase font-bold tracking-widest text-slate-600">
        <div className="flex gap-4">
          <div className="flex items-center gap-1">
             <div className="w-1.5 h-1.5 rounded-full bg-emerald-500"></div>
             <span>Network: Secure</span>
          </div>
          <div className="flex items-center gap-1">
             <div className="w-1.5 h-1.5 rounded-full bg-emerald-500"></div>
             <span>Database: Sync</span>
          </div>
          <div className="flex items-center gap-1">
             <div className="w-1.5 h-1.5 rounded-full bg-emerald-500"></div>
             <span>Encryption: AES-256</span>
          </div>
        </div>
        <div>
           Terminal Console // Localhost:8080
        </div>
      </footer>
    </div>
  );
};

export default App;
