import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { AppToast } from '../../utils/alerts';
import { accountService } from '../../services/accountService';
import { Button } from '../../components/Button';
import { Input } from '../../components/Input';
import type { AccountData } from '../../types/account';

export default function Deposit() {
  const navigate = useNavigate();
  const [amount, setAmount] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [account, setAccount] = useState<AccountData | null>(null);

  useEffect(() => {
    async function loadAccount() {
      try {
        const data = await accountService.getMe();
        setAccount(data);
      } catch (error) {
        console.error("Erro ao carregar saldo:", error);
      }
    }
    loadAccount();
  }, []);

  const handleDeposit = async (e: React.FormEvent) => {
    e.preventDefault();
    const numericAmount = parseFloat(amount.replace(',', '.'));

    if (!numericAmount || numericAmount <= 0) {
      AppToast.fire({ icon: 'error', title: 'Informe um valor válido.' });
      return;
    }

    setIsLoading(true);
    try {
      await accountService.deposit(numericAmount.toFixed(2));
      AppToast.fire({
        icon: 'success',
        title: 'Deposit Processed!',
        text: 'The balance will be updated via Ledger Protocol.',
        timer: 2000,
        showConfirmButton: false
      });
      setTimeout(() => navigate('/dashboard'), 1500);
    } catch (error: any) {
      AppToast.fire({
        icon: 'error',
        title: 'Attention',
        text: error.response?.data?.message || 'Error processing deposit.'
      });
    } finally {
      setIsLoading(false);
    }
  };

  const quickValues = ['50', '100', '500', '1000'];

  return (
    <div className="flex min-h-screen bg-[#0F1115] font-sans">
      {/* LADO ESQUERDO: FORMULÁRIO */}
      <div className="w-full lg:w-1/2 flex flex-col justify-center px-8 md:px-24 py-12 relative">
        
        {/* Botão Voltar Estilizado */}
        <button 
          onClick={() => navigate(-1)}
          className="absolute top-12 left-8 md:left-24 text-[10px] font-black text-slate-500 hover:text-brand-purple uppercase tracking-[0.3em] transition-all italic"
        >
          ← Back to Dashboard
        </button>

        <div className="max-w-md w-full mx-auto space-y-10">
          <header>
            <h2 className="text-4xl font-black tracking-tighter text-white italic uppercase leading-none">
              Add<br/>Credits
            </h2>
            <p className="mt-4 text-slate-500 text-lg">Immediate liquidation via secure ledger protocol.</p>
          </header>

          <form onSubmit={handleDeposit} className="space-y-8">
            
            {/* Input de Valor Estilizado como o do Cadastro */}
            <div className="space-y-6">
              <Input 
                label="Amount to Deposit (BRL)" 
                name="amount"
                type="number"
                step="0.01"
                placeholder="0.00"
                value={amount} 
                onChange={(e) => setAmount(e.target.value)} 
                required 
              />

              {/* Atalhos de Valor padronizados com o Toggle do cadastro */}
              <div className="space-y-2">
                <label className="text-[10px] font-bold text-slate-500 uppercase tracking-widest ml-1">
                  Quick Select
                </label>
                <div className="grid grid-cols-4 gap-2 p-1 bg-[#1C2025] rounded-xl border border-white/5">
                  {quickValues.map((val) => (
                    <button
                      key={val}
                      type="button"
                      onClick={() => setAmount(val)}
                      className={`py-2 text-[11px] font-black rounded-lg transition-all tracking-wider ${
                        amount === val 
                        ? 'bg-brand-purple text-white shadow-lg shadow-brand-purple/20' 
                        : 'text-slate-500 hover:text-slate-300'
                      }`}
                    >
                      +{val}
                    </button>
                  ))}
                </div>
              </div>
            </div>

            {/* Info de Conta Destino (estilo Detail Box) */}
            <div className="p-5 bg-white/[0.02] border border-white/5 rounded-2xl">
              <div className="flex items-center gap-2 mb-2">
                <div className="w-1.5 h-1.5 bg-brand-purple rounded-full animate-pulse" />
                <h4 className="font-black text-[10px] text-slate-500 uppercase tracking-widest italic">Target Node</h4>
              </div>
              <p className="text-xs font-bold text-slate-400 uppercase tracking-tighter">
                {account?.owner_name || 'User'} 
                <span className="mx-2 opacity-20">|</span> 
                <span className="text-brand-purple font-mono italic">
                  ID: {account?.account_number.substring(0, 8)}
                </span>
              </p>
            </div>

            <Button 
              type="submit"
              isLoading={isLoading}
              className="w-full py-4 text-sm tracking-[0.2em] font-black bg-brand-purple hover:bg-brand-purple/90 italic uppercase"
            >
              Confirm Transaction
            </Button>
          </form>

          <footer className="pt-4">
             <p className="text-[10px] text-slate-600 leading-relaxed font-bold italic uppercase tracking-tighter opacity-60">
                Transactions are audited in real-time. Assets available immediately after block confirmation.
             </p>
          </footer>
        </div>
      </div>

      {/* LADO DIREITO: VISUAL (Mesmo padrão da outra tela) */}
      <div className="hidden lg:flex w-1/2 bg-gradient-to-br from-[#0F1115] via-[#16191E] to-brand-purple/20 justify-center items-center border-l border-white/5 relative overflow-hidden">
        <div className="absolute top-[-10%] right-[-10%] w-[500px] h-[500px] bg-brand-purple/5 rounded-full blur-[120px]" />
        
        <div className="text-center p-12 relative z-10">
            {/* Badge de Saldo Atual flutuante */}
            {account && (
              <div className="inline-block mb-8 px-4 py-2 bg-white/5 border border-white/10 rounded-full backdrop-blur-md animate-bounce-slow">
                <span className="text-[10px] font-black text-slate-500 uppercase tracking-widest mr-2">Current:</span>
                <span className="text-sm font-black text-green-500 italic">R$ {Number(account.balance).toLocaleString('pt-BR', { minimumFractionDigits: 2 })}</span>
              </div>
            )}

            <h1 className="text-6xl font-black text-white mb-6 italic tracking-tighter uppercase leading-none">
              Inbound<br/>Flow
            </h1>
            <div className="h-1 w-20 bg-brand-purple mx-auto mb-8" />
            <p className="text-slate-400 max-w-sm mx-auto text-lg leading-relaxed font-medium">
              Seamlessly increase your liquidity with our distributed ledger system.
            </p>
        </div>
      </div>
    </div>
  );
}