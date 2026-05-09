import { useState, useEffect } from 'react'; 
import { Link, useNavigate } from 'react-router-dom';
import { UI_TEXTS } from '../../const/texts';
import { useAuth } from '../../hooks/useAuth';
import { accountService } from '../../services/accountService';
import type { AccountData } from '../../types/account';
import { KafkaStatus } from '../../components/KafkaStatus';
import { RecentActivity } from '../../components/RecentActivity'; 
import { transferService } from '../../services/transferService';

export default function Dashboard() {
  const navigate = useNavigate(); 
  const { signOut, user } = useAuth(); 
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
        const accountData = await accountService.getMe();
        setAccount(accountData);
        const transactionsData = await transferService.getRecentActivity();
        setTransactions(transactionsData);
      } catch (error: any) {
        console.error("Erro ao carregar dados:", error);
        if (error.response?.status === 404) {
          navigate('/complete-profile');
          return;
        }
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
    // MUDANÇA: Fundo principal agora é um cinza azulado muito profundo, não preto puro
    <div className="flex h-screen bg-[#0F1115] text-slate-200 font-sans overflow-hidden">
      
      {/* SIDEBAR */}
      {/* MUDANÇA: Sidebar um tom acima do fundo e borda mais sutil */}
      <aside className="w-64 bg-[#16191E] border-r border-white/5 p-6 flex flex-col">
        <div className="flex items-center gap-3 mb-10 px-2">
          <div className="w-8 h-8 bg-brand-purple rounded-md flex items-center justify-center font-black text-white shadow-lg shadow-brand-purple/20">F</div>
          <h1 className="text-lg font-semibold tracking-tight text-white">
            {texts.COMMON.APP_NAME}
          </h1>
        </div>
        <nav className="space-y-1.5 flex-1">
          <Link to="/dashboard" className="block px-4 py-2.5 rounded-lg bg-brand-purple/10 text-brand-purple font-medium text-sm">
            {texts.SIDEBAR.DASHBOARD}
          </Link>
          <Link to="/profile" className="block px-4 py-2.5 rounded-lg text-slate-400 hover:bg-white/5 hover:text-white transition-all text-sm">
            {texts.SIDEBAR.PROFILE}
          </Link>
        </nav>
        <button onClick={() => signOut()} className="mt-auto flex items-center gap-3 px-4 py-2.5 rounded-lg text-slate-500 hover:text-red-400 hover:bg-red-400/5 transition-all text-sm font-medium">
          <span>Logout</span>
        </button>
      </aside>

      {/* CONTEÚDO PRINCIPAL */}
      <main className="flex-1 overflow-y-auto p-8 lg:p-10">
        <header className="flex justify-between items-center mb-10">
          <div>
            <h2 className="text-[11px] font-bold text-brand-purple uppercase tracking-widest mb-1 opacity-80">Overview</h2>
            <h3 className="text-2xl font-semibold text-white">
              {texts.DASHBOARD.GREETING}, <span className="text-brand-purple">{user?.first_name || 'Usuário'}</span>
            </h3>
          </div>
          <div className="flex items-center gap-3">
            <button onClick={toggleLang} className="flex items-center gap-2 px-3 py-1.5 bg-[#1C2025] border border-white/5 rounded-lg hover:border-brand-purple/50 transition-all group">
              <span className="text-xs font-bold text-slate-400 group-hover:text-white uppercase">{lang}</span>
            </button>
            <Link to="/profile" className="h-10 w-10 rounded-full bg-gradient-to-tr from-brand-purple to-indigo-600 flex items-center justify-center shadow-md shadow-brand-purple/20 hover:brightness-110 transition-all">
              <span className="text-xs font-bold text-white uppercase">{user?.first_name?.[0]}{user?.last_name?.[0]}</span>
            </Link>
          </div>
        </header>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 space-y-6">
            {/* CARD DE SALDO - MUDANÇA: Borda reduzida e degradê mais suave */}
            <div className="p-8 bg-gradient-to-br from-brand-purple to-[#7c3aed] rounded-2xl relative overflow-hidden shadow-xl shadow-brand-purple/10">
              <div className="relative z-10">
                <p className="text-purple-100/70 text-sm font-medium mb-1">{texts.DASHBOARD.STATS.BALANCE}</p>
                <div className="flex items-baseline gap-2">
                  <span className="text-xl font-medium text-purple-200">{lang === 'PT' ? 'R$' : '$'}</span>
                  <h4 className="text-5xl font-bold tracking-tight text-white">
                    {account ? formatBalance(account.available_balance) : '0,00'}
                  </h4>
                </div>
              </div>
              {/* Elementos decorativos mais discretos */}
              <div className="absolute top-0 right-0 w-48 h-48 bg-white/5 rounded-full -mr-16 -mt-16 blur-3xl" />
            </div>

            <RecentActivity 
              transactions={transactions}
              formatBalance={formatBalance}
              lang={lang} 
              loading={loading}
            />
          </div>

          {/* COLUNA DA DIREITA */}
          <div className="space-y-5">
            <KafkaStatus />
            <div className="grid grid-cols-1 gap-4">
               {/* MUDANÇA: Cards de ação agora com rounded-xl e cores menos gritantes */}
               <Link to="/deposit" className="block p-5 bg-[#1C2025] border border-white/5 rounded-xl hover:bg-[#23282f] transition-all group border-l-2 border-l-green-500/50">
                  <div className="flex items-center justify-between">
                    <div>
                      <h4 className="font-semibold text-white">Adicionar Crédito</h4>
                      <p className="text-[11px] text-slate-500 mt-0.5">Via Ledger/Kafka</p>
                    </div>
                    <div className="w-8 h-8 bg-green-500/10 text-green-500 rounded-lg flex items-center justify-center group-hover:bg-green-500 group-hover:text-white transition-all">
                      <span className="text-lg">+</span>
                    </div>
                  </div>
               </Link>

               <Link to="/transfer" className="block p-5 bg-[#1C2025] border border-white/5 rounded-xl hover:bg-[#23282f] transition-all group border-l-2 border-l-brand-purple/50">
                  <div className="flex items-center justify-between">
                    <div>
                      <h4 className="font-semibold text-white">Nova Transferência</h4>
                      <p className="text-[11px] text-slate-500 mt-0.5">Envio instantâneo</p>
                    </div>
                    <div className="w-8 h-8 bg-brand-purple/10 text-brand-purple rounded-lg flex items-center justify-center group-hover:bg-brand-purple group-hover:text-white transition-all">
                      <span className="text-xs">💸</span>
                    </div>
                  </div>
               </Link>
            </div>

            <div className="p-5 bg-white/[0.02] border border-white/5 rounded-xl">
               <div className="flex items-center gap-2 mb-2">
                 <div className="w-5 h-5 bg-blue-500/10 rounded flex items-center justify-center text-[10px] text-blue-400">🛡️</div>
                 <h4 className="font-semibold text-[11px] text-slate-400 uppercase tracking-wider">Segurança</h4>
               </div>
               <p className="text-[11px] text-slate-500 leading-relaxed font-medium">
                 Proteção com criptografia de ponta a ponta e chaves de idempotência via Redpanda.
               </p>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}