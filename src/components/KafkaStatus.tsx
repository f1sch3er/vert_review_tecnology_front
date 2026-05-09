// components/KafkaStatus.tsx
import { useState, useEffect } from 'react';
import { monitorService } from '../services/monitorService';

export function KafkaStatus() {
  const [status, setStatus] = useState<'loading' | 'online' | 'offline'>('loading');

  useEffect(() => {
    async function getStatus() {
      try {
        const data = await monitorService.checkKafka();
        setStatus(data.status === 'online' ? 'online' : 'offline');
      } catch (error) {
        setStatus('offline');
      }
    }

    getStatus();
    const interval = setInterval(getStatus, 30000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="bg-[#16191E] border border-white/5 rounded-xl p-5 shadow-sm">
      <h4 className="font-bold mb-4 text-[10px] uppercase tracking-[0.2em] text-slate-500">
        Infraestrutura
      </h4>
      
      <div className="flex items-center gap-4">
        <div className="relative flex items-center justify-center">
          <div className={`relative flex h-2.5 w-2.5`}>
            {status === 'online' && (
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-500 opacity-20"></span>
            )}
            <span className={`relative inline-flex rounded-full h-2.5 w-2.5 transition-colors duration-500 ${
              status === 'loading' ? 'bg-slate-600' : 
              status === 'online' ? 'bg-green-500 shadow-[0_0_8px_rgba(34,197,94,0.4)]' : 
              'bg-red-500 shadow-[0_0_8px_rgba(239,68,68,0.4)]'
            }`}></span>
          </div>
        </div>
        
        <div className="flex flex-col">
          <span className={`text-[11px] font-bold tracking-wider ${
            status === 'online' ? 'text-green-500/90' : 
            status === 'offline' ? 'text-red-500/90' : 'text-slate-500'
          }`}>
            {status === 'loading' ? 'VERIFICANDO...' : status === 'online' ? 'SISTEMA OPERACIONAL' : 'KAFKA OFFLINE'}
          </span>
          <span className="text-[10px] text-slate-600 font-medium">
            Redpanda Cluster <span className="text-slate-700">v0.11</span>
          </span>
        </div>
      </div>

      {status === 'offline' && (
        <div className="mt-4 p-3 bg-red-500/5 border border-red-500/10 rounded-lg">
          <p className="text-[10px] text-red-400/80 leading-relaxed">
            As transações podem sofrer atrasos no processamento devido à instabilidade no cluster.
          </p>
        </div>
      )}
    </div>
  );
}