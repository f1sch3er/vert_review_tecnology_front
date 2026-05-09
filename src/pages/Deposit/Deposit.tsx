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
      AppToast.fire({ icon: 'error', title: 'Informe um valor válido para depósito.' });
      return;
    }

    setIsLoading(true);

    try {
      await accountService.deposit(numericAmount.toFixed(2));

      AppToast.fire({
        icon: 'success',
        title: 'Depósito processado!',
        text: 'O saldo será atualizado em instantes via Ledger Protocol.'
      });

      navigate('/dashboard');
    } catch (error: any) {
      AppToast.fire({
        icon: 'error',
        title: error.response?.data?.message || 'Erro ao processar depósito.'
      });
    } finally {
      setIsLoading(false);
    }
  };

  const quickValues = ['50', '100', '500', '1000'];

  return (
    <div className="min-h-screen bg-[#0F1115] text-slate-200 p-6 lg:p-12">
      <div className="max-w-xl mx-auto">
        
        {/* Top Bar: Voltar + Saldo Rápido (Agora em VERDE) */}
        <div className="flex items-center justify-between mb-10">
          <button 
            onClick={() => navigate(-1)}
            className="flex items-center gap-2 text-slate-500 hover:text-white transition-colors group text-sm font-medium"
          >
            <span className="group-hover:-translate-x-1 transition-transform inline-block">←</span> Voltar
          </button>

          {account && (
            <div className="flex flex-col items-end animate-in fade-in slide-in-from-right-4 duration-700">
              <span className="text-[10px] font-bold text-slate-600 uppercase tracking-widest">Saldo Atual</span>
              <span className="text-sm font-bold text-green-500/90">
                R$ {Number(account.balance).toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
              </span>
            </div>
          )}
        </div>

        <header className="mb-12">
          <h1 className="text-3xl font-bold text-white tracking-tight mb-2 uppercase italic">
            Adicionar Saldo
          </h1>
          <p className="text-slate-500">Aumente seu limite de transações via depósito imediato.</p>
        </header>

        <div className="bg-[#16191E] border border-white/5 rounded-2xl p-8 shadow-2xl relative overflow-hidden">
          <div className="absolute top-0 left-0 w-full h-[2px] bg-gradient-to-r from-transparent via-brand-purple/40 to-transparent" />

          <form onSubmit={handleDeposit} className="space-y-8">
            
            <div className="space-y-4">
              <Input 
                label="Valor do Depósito" 
                prefix="R$"
                type="number"
                step="0.01"
                placeholder="0,00"
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
                className="text-4xl font-black tracking-tighter text-white focus:bg-[#0D0F12]"
                required
              />

              <div className="flex gap-2 ml-1">
                {quickValues.map((val) => (
                  <button
                    key={val}
                    type="button"
                    onClick={() => setAmount(val)}
                    className="px-3 py-1.5 rounded-lg bg-[#0D0F12] border border-white/5 text-[10px] font-bold text-slate-500 hover:text-brand-purple hover:border-brand-purple/30 transition-all"
                  >
                    + R$ {val}
                  </button>
                ))}
              </div>
            </div>

            <div className="bg-brand-purple/5 border border-brand-purple/10 rounded-xl p-6 space-y-3">
              <h3 className="text-brand-purple font-bold text-xs uppercase tracking-widest flex items-center gap-2">
                <span className="w-1.5 h-1.5 bg-brand-purple rounded-full animate-pulse" />
                Info de Processamento
              </h3>
              <ul className="text-xs text-slate-500 space-y-2 leading-relaxed">
                <li className="flex gap-2">
                   <span className="text-brand-purple">•</span>
                   <span>Liquidação garantida via mensageria de alta disponibilidade.</span>
                </li>
                <li className="flex gap-2">
                   <span className="text-brand-purple">•</span>
                   <span>O valor estará disponível para operações PIX/TED imediatamente.</span>
                </li>
              </ul>
            </div>

            <Button 
              type="submit" 
              isLoading={isLoading}
              variant="primary"
              className="py-5 text-sm tracking-[0.1em]"
            >
              CONFIRMAR DEPÓSITO
            </Button>
          </form>
        </div>

        <div className="mt-12 flex items-center justify-center gap-3 opacity-20 grayscale">
            <div className="h-px w-8 bg-slate-600" />
            <p className="text-[9px] uppercase tracking-[0.4em] font-bold text-slate-500 whitespace-nowrap">
                Ledger Security Protected
            </p>
            <div className="h-px w-8 bg-slate-600" />
        </div>
      </div>
    </div>
  );
}