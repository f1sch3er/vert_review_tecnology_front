// components/KafkaStatus.tsx
import { useState, useEffect } from 'react';
import { monitorService } from '../services/monitorService';

export function KafkaStatus() {
  const [status, setStatus] = useState<'loading' | 'online' | 'offline'>('loading');

  useEffect(() => {
    async function getStatus() {
      try {
        const data = await monitorService.checkKafka();
        if (data.status === 'online') {
          setStatus('online');
        } else {
          setStatus('offline');
        }
      } catch (error) {
        setStatus('offline');
      }
    }

    getStatus();
    const interval = setInterval(getStatus, 30000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="bg-[#111114] border border-gray-800 rounded-3xl p-6">
      <h4 className="font-bold mb-4 text-sm uppercase tracking-widest text-gray-400">Infraestrutura</h4>
      
      <div className="flex items-center gap-3">
        <div className={`relative flex h-3 w-3`}>
          {status === 'online' && (
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></span>
          )}
          <span className={`relative inline-flex rounded-full h-3 w-3 ${
            status === 'loading' ? 'bg-gray-600' : 
            status === 'online' ? 'bg-green-500' : 'bg-red-500'
          }`}></span>
        </div>
        
        <div className="flex flex-col">
          <span className={`text-sm font-bold ${
            status === 'online' ? 'text-green-500' : 
            status === 'offline' ? 'text-red-500' : 'text-gray-500'
          }`}>
            {status === 'loading' ? 'VERIFICANDO...' : status === 'online' ? 'KAFKA ONLINE' : 'KAFKA OFFLINE'}
          </span>
          <span className="text-[10px] text-gray-600 uppercase font-medium">Redpanda Cluster v0.11</span>
        </div>
      </div>

      {status === 'offline' && (
        <p className="text-[10px] text-red-400/60 mt-3 leading-tight">
          As transações podem sofrer atrasos no processamento.
        </p>
      )}
    </div>
  );
}