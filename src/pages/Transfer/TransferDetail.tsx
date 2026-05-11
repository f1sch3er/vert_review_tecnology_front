import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { transferService } from '../../services/transferService';

export default function TransactionDetail() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [tx, setTx] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadData() {
      if (!id) return;
      try {
        setLoading(true);
        const data = await transferService.getRecentActivity(id);
        setTx(data);
      } catch (error) {
        console.error("Erro:", error);
        navigate('/dashboard');
      } finally {
        setLoading(false);
      }
    }
    loadData();
  }, [id, navigate]);

  if (loading || !tx) return <div className="min-h-screen bg-[#0F1115]" />;

  const isIncoming = tx.direction === 'IN';

  return (
    <div className="flex min-h-screen bg-[#0F1115] font-sans">
      {/* LADO ESQUERDO: INFORMAÇÕES DETALHADAS */}
      <div className="w-full lg:w-1/2 flex flex-col justify-center px-8 md:px-24 py-12 relative">
        
        <button 
          onClick={() => navigate(-1)}
          className="absolute top-12 left-8 md:left-24 text-[10px] font-black text-slate-500 hover:text-brand-purple uppercase tracking-[0.3em] transition-all italic"
        >
          ← Back to Activity
        </button>

        <div className="max-w-md w-full mx-auto space-y-10">
          <header>
            <h2 className="text-[11px] font-black text-brand-purple uppercase tracking-[0.4em] mb-2">
              Receipt Details
            </h2>
            <h1 className="text-4xl font-black tracking-tighter text-white italic uppercase leading-none">
              Transaction<br/>Log
            </h1>
          </header>

          <div className="space-y-8">
            {/* Seção: Envolvidos */}
            <div className="space-y-6 pt-4">
               <div className="group">
                  <label className="block text-[10px] font-black text-slate-600 uppercase tracking-widest mb-1">Origin</label>
                  <p className="text-sm font-bold text-slate-200 break-all">{tx.from_account_email}</p>
                  <div className="h-px bg-white/5 w-full mt-4 group-hover:bg-brand-purple/30 transition-colors" />
               </div>

               <div className="group">
                  <label className="block text-[10px] font-black text-slate-600 uppercase tracking-widest mb-1">Destination</label>
                  <p className="text-sm font-bold text-slate-200 break-all">{tx.to_account_email}</p>
                  <div className="h-px bg-white/5 w-full mt-4 group-hover:bg-brand-purple/30 transition-colors" />
               </div>
            </div>

            {/* Seção: Dados Técnicos em Grid */}
            <div className="grid grid-cols-2 gap-6 p-5 bg-white/[0.02] border border-white/5 rounded-2xl italic">
              <div>
                <label className="block text-[9px] font-black text-slate-600 uppercase tracking-widest">Reference</label>
                <p className="text-[11px] font-bold text-slate-400 uppercase tracking-tighter">{tx.external_code || '---'}</p>
              </div>
              <div>
                <label className="block text-[9px] font-black text-slate-600 uppercase tracking-widest">Method</label>
                <p className="text-[11px] font-bold text-slate-400 uppercase tracking-tighter">Digital Ledger</p>
              </div>
            </div>

            {/* Hash ID */}
            <div className="space-y-2">
               <label className="block text-[10px] font-black text-slate-600 uppercase tracking-widest">Transaction Hash</label>
               <div className="p-4 bg-[#1C2025] border border-white/5 rounded-xl">
                  <p className="text-[10px] font-mono text-brand-purple/80 break-all leading-relaxed">
                    {tx.id}
                  </p>
               </div>
            </div>
          </div>

          <footer className="flex gap-4">
            <button 
              onClick={() => window.print()}
              className="flex-1 py-4 bg-white text-black text-[11px] font-black uppercase tracking-widest hover:bg-brand-purple hover:text-white transition-all italic rounded-sm"
            >
              Export PDF
            </button>
          </footer>
        </div>
      </div>

      {/* LADO DIREITO: STATUS VISUAL IMPACTANTE */}
      <div className={`hidden lg:flex w-1/2 justify-center items-center border-l border-white/5 relative overflow-hidden ${isIncoming ? 'bg-gradient-to-br from-[#0F1115] via-[#101512] to-green-500/10' : 'bg-gradient-to-br from-[#0F1115] via-[#16191E] to-brand-purple/20'}`}>
        <div className={`absolute top-[-10%] right-[-10%] w-[500px] h-[500px] rounded-full blur-[120px] ${isIncoming ? 'bg-green-500/5' : 'bg-brand-purple/5'}`} />
        
        <div className="text-center p-12 relative z-10">
            <div className="mb-8 inline-flex items-center gap-3 px-4 py-2 bg-white/5 border border-white/10 rounded-full backdrop-blur-md">
              <span className={`w-2 h-2 rounded-full animate-pulse ${isIncoming ? 'bg-green-500' : 'bg-brand-purple'}`} />
              <span className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]">{tx.status_display}</span>
            </div>

            <h1 className={`text-6xl lg:text-7xl font-black mb-4 italic tracking-tighter uppercase leading-none ${isIncoming ? 'text-green-500' : 'text-white'}`}>
              {isIncoming ? '+' : '-'} {Number(tx.amount).toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}
            </h1>
            
            <p className="text-slate-500 font-bold uppercase text-xs tracking-[0.3em] mb-12">
              {tx.type_display || 'Electronic Transfer'}
            </p>

            <div className="h-px w-20 bg-white/10 mx-auto mb-8" />
            
            <p className="text-slate-400 font-mono text-xs opacity-60 uppercase">
              Authenticated at<br/>
              {tx.date_formatted}
            </p>
        </div>
      </div>
    </div>
  );
}