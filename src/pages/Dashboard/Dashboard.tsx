import { useState, useEffect } from 'react'; 
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { UI_TEXTS } from '../../const/texts';
import { useAuth } from '../../hooks/useAuth';
import { accountService } from '../../services/accountService';
import type { AccountData } from '../../types/account';

// Componentes Separados
import { Sidebar } from '../../components/Sidebar';
import { BalanceCard } from '../../components/BalanceCard';
import { KafkaStatus } from '../../components/KafkaStatus';
import { RecentActivity } from '../../components/RecentActivity'; 
import { transferService } from '../../services/transferService';

export default function Dashboard() {
  const navigate = useNavigate(); 
  const location = useLocation();
  const { user } = useAuth(); 
  
  const [account, setAccount] = useState<AccountData | null>(null);
  const [transactions, setTransactions] = useState<any[]>([]); 
  const [loading, setLoading] = useState(true); 
  const [lang, setLang] = useState<'PT' | 'EN'>(
    (localStorage.getItem('app_lang') as 'PT' | 'EN') || 'PT'
  );

  const texts = UI_TEXTS[lang];

  useEffect(() => {
    async function loadData() {
      try {
        setLoading(true);
        const [accountData, transactionsData] = await Promise.all([
          accountService.getMe(),
          transferService.getRecentActivity()
        ]);
    
        setAccount(accountData);
        setTransactions(transactionsData);
      } catch (error: any) {
        if (error.response?.status === 404) {
          console.warn("Conta não encontrada. Redirecionando para completar perfil...");
          navigate('/complete-profile');
          return; 
        }

        console.error("Erro crítico no Dashboard:", error);
      } finally {
        setLoading(false);
      }
    }
    loadData();
  }, [navigate]);

  const toggleLang = () => {
    const newLang = lang === 'PT' ? 'EN' : 'PT';
    setLang(newLang);
    localStorage.setItem('app_lang', newLang);
  };

  const formatBalance = (value: number) => {
    return new Intl.NumberFormat(lang === 'PT' ? 'pt-BR' : 'en-US', {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    }).format(value);
  };

  return (
    <div className="flex h-screen bg-[#0F1115] text-slate-200 font-sans overflow-hidden">
      
      {/* 1. SIDEBAR REUTILIZÁVEL */}
      <Sidebar texts={texts} currentPath={location.pathname} />

      {/* CONTEÚDO PRINCIPAL */}
      <main className="flex-1 overflow-y-auto p-8 lg:p-10 custom-scrollbar">
        
        {/* HEADER */}
        <header className="flex justify-between items-center mb-10">
          <div>
            <h2 className="text-[11px] font-bold text-brand-purple uppercase tracking-widest mb-1 opacity-80 italic">
              Financial Overview
            </h2>
            <h3 className="text-2xl font-semibold text-white tracking-tight">
              {texts.DASHBOARD.GREETING}, <span className="text-brand-purple">{user?.first_name || 'User'}</span>
            </h3>
          </div>
          
          <div className="flex items-center gap-3">
            <button 
              onClick={toggleLang} 
              className="flex items-center gap-2 px-3 py-1.5 bg-[#1C2025] border border-white/5 rounded-lg hover:border-brand-purple/50 transition-all group shadow-lg"
            >
              <span className="text-xs font-bold text-slate-400 group-hover:text-white uppercase">{lang}</span>
            </button>
            <Link to="/profile" className="h-10 w-10 rounded-full bg-gradient-to-tr from-brand-purple to-indigo-600 flex items-center justify-center shadow-md shadow-brand-purple/20 hover:brightness-110 transition-all border border-white/10">
              <span className="text-xs font-bold text-white uppercase italic">
                {user?.first_name?.[0]}{user?.last_name?.[0]}
              </span>
            </Link>
          </div>
        </header>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          
          {/* COLUNA ESQUERDA: Saldo e Atividade */}
          <div className="lg:col-span-2 space-y-6">
            
            {/* 2. CARD DE SALDO SEPARADO */}
            <BalanceCard 
              balance={account?.available_balance || 0}
              lang={lang}
              texts={texts}
              formatBalance={formatBalance}
            />

            {/* 3. ATIVIDADE RECENTE */}
            <RecentActivity 
              transactions={transactions}
              formatBalance={formatBalance}
              lang={lang} 
              loading={loading}
            />
          </div>

          {/* COLUNA DIREITA: Status e Ações */}
          <div className="space-y-5">
            <KafkaStatus />
            
            {/* Ações Rápidas */}
            <div className="grid grid-cols-1 gap-4">
              <Link to="/deposit" className="block p-5 bg-[#1C2025] border border-white/5 rounded-xl hover:bg-[#23282f] transition-all group border-l-4 border-l-green-500 shadow-xl shadow-black/40">
                <div className="flex items-center justify-between">
                  <div>
                    <h4 className="font-bold text-white uppercase text-xs tracking-wider italic">Add Credit</h4>
                    <p className="text-[10px] text-slate-500 mt-0.5 font-bold uppercase tracking-tighter">Instant Ledger Deposit</p>
                  </div>
                  <div className="w-9 h-9 bg-green-500/10 text-green-500 rounded-lg flex items-center justify-center group-hover:bg-green-500 group-hover:text-white transition-all shadow-inner border border-green-500/20">
                    <span className="text-xl font-black">+</span>
                  </div>
                </div>
              </Link>

              <Link to="/transfer" className="block p-5 bg-[#1C2025] border border-white/5 rounded-xl hover:bg-[#23282f] transition-all group border-l-4 border-l-brand-purple shadow-xl shadow-black/40">
                <div className="flex items-center justify-between">
                  <div>
                    <h4 className="font-bold text-white uppercase text-xs tracking-wider italic">New Transfer</h4>
                    <p className="text-[10px] text-slate-500 mt-0.5 font-bold uppercase tracking-tighter">P2P Kafka Stream</p>
                  </div>
                  <div className="w-9 h-9 bg-brand-purple/10 text-brand-purple rounded-lg flex items-center justify-center group-hover:bg-brand-purple group-hover:text-white transition-all shadow-inner border border-brand-purple/20">
                    <span className="text-sm">💸</span>
                  </div>
                </div>
              </Link>
            </div>

            {/* Footer de Segurança */}
            <div className="p-6 bg-white/[0.01] border border-white/5 rounded-2xl backdrop-blur-md">
              <div className="flex items-center gap-2 mb-3">
                <div className="w-6 h-6 bg-blue-500/10 rounded-md flex items-center justify-center text-[10px] text-blue-400 border border-blue-500/20">
                  🛡️
                </div>
                <h4 className="font-black text-[10px] text-slate-500 uppercase tracking-[0.2em] italic">Security Protocol</h4>
              </div>
              <p className="text-[10px] text-slate-600 leading-relaxed font-bold italic uppercase tracking-tighter opacity-80">
                Encrypted node session. Real-time auditing via Redpanda distributed ledger.
              </p>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}