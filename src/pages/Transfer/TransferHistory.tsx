import { useEffect, useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth';
import { transferService } from '../../services/transferService';

export default function TransactionsHistory() {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [transactions, setTransactions] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [lang, setLang] = useState<'PT' | 'EN'>(
    (localStorage.getItem('app_lang') as 'PT' | 'EN') || 'PT'
  );

  useEffect(() => {
    async function loadTransactions() {
      try {
        setIsLoading(true);
        const data = await transferService.getRecentActivity(); 
        setTransactions(data);
      } catch (error) {
        console.error("Error loading history", error);
      } finally {
        setIsLoading(false);
      }
    }
    loadTransactions();
  }, []);

  const toggleLang = () => {
    const newLang = lang === 'PT' ? 'EN' : 'PT';
    setLang(newLang);
    localStorage.setItem('app_lang', newLang);
  };

  return (
    <div className="min-h-screen bg-[#0F1115] text-slate-200 p-6 lg:p-12 overflow-y-auto custom-scrollbar">
      <div className="max-w-4xl mx-auto">
        
        {/* HEADER DE PERFIL */}
        <header className="flex justify-between items-start mb-16">
          <div>
            <button 
              onClick={() => navigate('/dashboard')}
              className="text-slate-500 hover:text-brand-purple transition-colors mb-4 flex items-center gap-2 text-[10px] font-black uppercase tracking-[0.2em] italic"
            >
              ← BACK TO DASHBOARD
            </button>
            <h1 className="text-5xl font-black text-white italic uppercase tracking-tighter leading-none">
              Statement
            </h1>
            <p className="text-slate-500 text-xs font-bold uppercase tracking-widest mt-3 opacity-70">
              {lang === 'PT' ? 'Fluxo de caixa e histórico de operações' : 'Cash flow and operations history'}
            </p>
          </div>

          <div className="flex items-center gap-4">
            <button 
              onClick={toggleLang} 
              className="px-4 py-2 bg-[#1C2025] border border-white/5 rounded-xl hover:border-brand-purple/50 transition-all group shadow-lg"
            >
              <span className="text-[10px] font-bold text-slate-400 group-hover:text-white uppercase">{lang}</span>
            </button>
            <Link to="/profile" className="h-14 w-14 rounded-full bg-gradient-to-tr from-brand-purple to-indigo-600 flex items-center justify-center shadow-lg shadow-brand-purple/20 hover:scale-105 transition-all border border-white/10">
              <span className="text-lg font-black text-white uppercase italic">
                {user?.first_name?.[0]}{user?.last_name?.[0]}
              </span>
            </Link>
          </div>
        </header>

        {/* LISTAGEM DE CARDS "GORDOS" */}
        <div className="space-y-4">
          {isLoading ? (
            <div className="p-20 text-center text-slate-600 font-black animate-pulse uppercase tracking-[0.3em] italic opacity-50">
              FETCHING TRANSACTIONS...
            </div>
          ) : transactions.length > 0 ? (
            transactions.map((tx: any) => (
              /* LINK PARA O DETALHE PASSANDO O ID */
              <Link 
                key={tx.id}
                to={`/transfer-detail//${tx.id}`}
                className="group relative bg-[#16191E] border border-white/5 rounded-2xl px-8 py-7 flex items-center justify-between hover:bg-[#1C2025] hover:border-brand-purple/40 transition-all shadow-xl shadow-black/20 block"
              >
                {/* Indicador Lateral */}
                <div className="absolute left-0 top-0 bottom-0 w-1.5 bg-brand-purple rounded-l-2xl opacity-0 group-hover:opacity-100 transition-opacity" />

                <div className="flex items-center gap-8">
                  {/* Ícone de Direção */}
                  <div className={`w-14 h-14 rounded-2xl border-2 flex items-center justify-center text-xl font-black transition-all group-hover:rotate-12 ${
                    tx.direction === 'OUT' || tx.type === 'DEBIT' 
                      ? 'bg-red-500/5 border-red-500/10 text-red-500 shadow-lg shadow-red-500/5' 
                      : 'bg-green-500/5 border-green-500/10 text-green-500 shadow-lg shadow-green-500/5'
                  }`}>
                     {tx.direction === 'OUT' || tx.type === 'DEBIT' ? '↑' : '↓'}
                  </div>
                  
                  <div>
                    <h3 className="text-lg font-black text-slate-100 group-hover:text-white transition-colors uppercase tracking-tight italic">
                      {tx.type_display || tx.description || (lang === 'PT' ? "Transferência" : "Transfer")}
                    </h3>
                    <div className="flex items-center gap-3 mt-1.5">
                      <p className="text-[11px] font-bold text-slate-500 uppercase tracking-[0.15em]">
                        {tx.date_formatted || new Date(tx.created_at).toLocaleDateString()}
                      </p>
                      <span className="w-1.5 h-1.5 bg-white/10 rounded-full" />
                      <p className="text-[11px] font-bold text-brand-purple/60 uppercase tracking-tighter">
                        REF: {tx.id.toString().substring(0, 12)}
                      </p>
                    </div>
                  </div>
                </div>
                
                <div className="text-right">
                  <p className={`text-2xl font-black italic tracking-tighter mb-1 ${
                    tx.direction === 'OUT' || tx.type === 'DEBIT' ? 'text-slate-300' : 'text-green-500'
                  }`}>
                    {tx.direction === 'OUT' || tx.type === 'DEBIT' ? '-' : '+'} {lang === 'PT' ? 'R$' : '$'} {Number(tx.amount).toLocaleString('en-US', { minimumFractionDigits: 2 })}
                  </p>
                  <div className="flex items-center justify-end gap-2 opacity-40 group-hover:opacity-100 transition-opacity">
                    <span className="text-[10px] text-slate-400 font-black uppercase tracking-widest">View Transaction</span>
                    <span className="text-brand-purple font-bold">→</span>
                  </div>
                </div>
              </Link>
            ))
          ) : (
            <div className="p-24 text-center border-2 border-dashed border-white/5 rounded-3xl">
              <p className="text-slate-600 font-black uppercase tracking-[0.2em] italic opacity-50">
                No ledger activity detected.
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}