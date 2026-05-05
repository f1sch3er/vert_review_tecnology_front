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
        setLoading(true); // Inicia o loading
        
        // Chamadas reais ao backend em paralelo
        const [accountData, transactionsData] = await Promise.all([
          accountService.getMe(),
          transferService.getRecentActivity()
        ]);

        setAccount(accountData);
        setTransactions(transactionsData);

      } catch (error: any) {
        console.error("Erro ao carregar dados do Dashboard:", error);
        if (error.response?.data?.detail === "Conta não encontrada.") {
          navigate('/complete-profile');
        }
      } finally {
        setLoading(false); // Finaliza o loading independente do resultado
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
    <div className="flex h-screen bg-[#0A0A0B] text-white font-sans overflow-hidden">
      
      {/* SIDEBAR */}
      <aside className="w-64 bg-[#111114] border-r border-gray-800 p-6 flex flex-col">
        <div className="flex items-center gap-3 mb-10 px-2">
          <div className="w-8 h-8 bg-brand-purple rounded-lg flex items-center justify-center font-black text-white">F</div>
          <h1 className="text-xl font-bold tracking-tighter text-white">
            {texts.COMMON.APP_NAME}
          </h1>
        </div>
        <nav className="space-y-2 flex-1">
          <Link to="/dashboard" className="block p-3 rounded-xl bg-brand-purple/10 text-brand-purple font-bold">
            {texts.SIDEBAR.DASHBOARD}
          </Link>
          <Link to="/profile" className="block p-3 rounded-xl text-gray-500 hover:bg-gray-800 transition-all">
            {texts.SIDEBAR.PROFILE}
          </Link>
        </nav>
        <button onClick={() => signOut()} className="mt-auto flex items-center gap-3 p-3 rounded-xl text-red-500 hover:bg-red-500/10 transition-all font-bold">
          <span>Logout</span> <span className="text-lg">➔</span>
        </button>
      </aside>

      {/* CONTEÚDO PRINCIPAL */}
      <main className="flex-1 overflow-y-auto p-8 lg:p-12">
        <header className="flex justify-between items-center mb-10">
          <div>
            <h2 className="text-sm font-bold text-brand-purple uppercase tracking-[0.2em] mb-1">Overview</h2>
            <h3 className="text-3xl font-black italic">
              {texts.DASHBOARD.GREETING}, {user?.first_name || 'Usuário'}!
            </h3>
          </div>
          <div className="flex items-center gap-4">
            <button onClick={toggleLang} className="flex items-center gap-2 px-3 py-2 bg-[#111114] border border-gray-800 rounded-xl hover:border-brand-purple transition-all group">
              <span className="text-lg">🌐</span>
              <span className="text-xs font-bold text-gray-400 group-hover:text-white transition-colors">{lang}</span>
            </button>
            <Link to="/profile" className="h-12 w-12 rounded-2xl bg-gradient-to-br from-brand-purple to-purple-700 flex items-center justify-center shadow-lg hover:scale-105 transition-transform">
              <span className="font-bold uppercase">{user?.first_name?.[0]}{user?.last_name?.[0]}</span>
            </Link>
          </div>
        </header>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2 space-y-8">
            {/* SALDO */}
            <div className="p-10 bg-brand-purple rounded-[2.5rem] relative overflow-hidden group">
              <div className="relative z-10">
                <p className="text-purple-200 font-medium mb-2 opacity-80">{texts.DASHBOARD.STATS.BALANCE}</p>
                <div className="flex items-baseline gap-2">
                  <span className="text-2xl font-bold text-purple-300">{lang === 'PT' ? 'R$' : '$'}</span>
                  <h4 className="text-6xl font-black tracking-tighter">
                    {account ? formatBalance(account.available_balance) : '0,00'}
                  </h4>
                </div>
              </div>
              <div className="absolute -right-10 -bottom-10 w-64 h-64 bg-white/10 rounded-full blur-3xl group-hover:bg-white/20 transition-all" />
            </div>

            {/* COMPONENTE DE ATIVIDADES COM DADOS REAIS */}
            <RecentActivity 
              transactions={transactions}
              formatBalance={formatBalance}
              lang={lang} 
              loading={loading} // Agora recebe o estado real
            />
          </div>

          {/* COLUNA DA DIREITA */}
          <div className="space-y-6">
            <KafkaStatus />
            <div className="space-y-4">
               <Link to="/deposit" className="block p-6 bg-[#111114] border border-gray-800/50 rounded-[2rem] hover:border-green-500/30 transition-all group relative overflow-hidden">
                  <div className="w-10 h-10 bg-green-500/10 text-green-500 rounded-xl flex items-center justify-center mb-4 group-hover:bg-green-500 group-hover:text-white transition-all text-xl">+</div>
                  <h4 className="font-bold text-lg">Adicionar Crédito</h4>
                  <p className="text-xs text-gray-500">Via Ledger/Kafka</p>
               </Link>
               <Link to="/transfer" className="block p-6 bg-[#111114] border border-gray-800/50 rounded-[2rem] hover:border-brand-purple/30 transition-all group relative overflow-hidden">
                  <div className="w-10 h-10 bg-brand-purple/10 text-brand-purple rounded-xl flex items-center justify-center mb-4 group-hover:bg-brand-purple group-hover:text-white transition-all text-sm">💸</div>
                  <h4 className="font-bold text-lg">Nova Transferência</h4>
                  <p className="text-xs text-gray-500">Envio instantâneo</p>
               </Link>
            </div>
            <div className="p-6 bg-[#111114]/50 border border-gray-800/30 rounded-[2rem]">
               <div className="flex items-center gap-2 mb-3">
                 <div className="w-6 h-6 bg-blue-500/10 rounded flex items-center justify-center text-[10px]">🛡️</div>
                 <h4 className="font-bold text-xs text-gray-400">Segurança</h4>
               </div>
               <p className="text-[10px] text-gray-600 leading-relaxed uppercase font-medium tracking-tight">
                 Sua conta está protegida com criptografia de ponta a ponta e chaves de idempotência em cada mensagem do Redpanda.
               </p>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}