import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { v4 as uuidv4 } from 'uuid';
import { AppToast } from '../../utils/alerts';
import { accountService } from '../../services/accountService';
import { Button } from '../../components/Button';
import { Input } from '../../components/Input';
import type { AccountData } from '../../types/account';
import { transferService } from '../../services/transferService';
import type { TransferPayload } from '../../types/transfer';
import type { TransferType } from '../../types/transfer';

export default function Transfer() {
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false);
  const [account, setAccount] = useState<AccountData | null>(null);
  const [availableAccounts, setAvailableAccounts] = useState<AccountData[]>([]);
  
  const [amount, setAmount] = useState('');
  const [destinationAccount, setDestinationAccount] = useState('');
  const [transferType, setTransferType] = useState<TransferType>('PIX');

  useEffect(() => {
    async function loadData() {
      try {
        const [me, allAccounts] = await Promise.all([
          accountService.getMe(),
          accountService.getAllAccounts() 
        ]);
        
        setAccount(me);
        setAvailableAccounts(allAccounts.filter((acc: AccountData) => acc.id !== me.id));
      } catch (error) {
        AppToast.fire({ 
          icon: 'error', 
          title: 'Erro ao carregar dados. Tente novamente.' 
        });
        navigate('/dashboard');
      }
    }
    loadData();
  }, [navigate]);

  const handleTransfer = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!account?.id || !destinationAccount) {
      AppToast.fire({ icon: 'error', title: 'Selecione uma conta de destino válida.' });
      return;
    }

    const numericAmount = parseFloat(amount);
    if (isNaN(numericAmount) || numericAmount <= 0) {
      AppToast.fire({ icon: 'error', title: 'Por favor, insira um valor válido.' });
      return;
    }

    setIsLoading(true);

    try {
      const payload: TransferPayload = {
        from_account: String(account.account_number),    
        to_account: destinationAccount,
        idempotency_key: uuidv4(),
        external_code: `${transferType}-TRX-${Date.now()}`,
        amount: numericAmount.toFixed(2),
        transfer_type: transferType,
        transfer_status: 'PENDING',
      };

      const response = await transferService.transfer(payload);

      AppToast.fire({
        icon: 'success',
        title: 'Transferência Realizada!',
        html: `<div class="text-sm mt-2">Novo Saldo: R$ ${response.from_account_balance_after}</div>`
      });

      navigate('/dashboard');
    } catch (error: any) {
      AppToast.fire({ 
        icon: 'error', 
        title: error.response?.data?.message || 'Falha ao processar transferência.'
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#0F1115] text-slate-200 p-6 lg:p-12">
      <div className="max-w-xl mx-auto">
        
        <div className="flex items-center justify-between mb-10">
          <button 
            onClick={() => navigate(-1)}
            className="flex items-center gap-2 text-slate-500 hover:text-white transition-colors group text-sm font-medium"
          >
            <span className="group-hover:-translate-x-1 transition-transform inline-block">←</span> Voltar
          </button>

          {account && (
            <div className="flex flex-col items-end animate-in fade-in slide-in-from-right-4 duration-700">
              <span className="text-[10px] font-bold text-slate-600 uppercase tracking-widest">Saldo disponível</span>
              <span className="text-sm font-bold text-green-500/90">
                R$ {Number(account.balance).toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
              </span>
            </div>
          )}
        </div>

        <header className="mb-12">
          <h1 className="text-3xl font-bold text-white tracking-tight mb-2">
            Enviar Transferência
          </h1>
          <p className="text-slate-500">Preencha os dados abaixo para concluir a transação.</p>
        </header>

        <div className="bg-[#16191E] border border-white/5 rounded-2xl p-8 shadow-2xl relative overflow-hidden">
          <div className="absolute top-0 left-0 w-full h-[2px] bg-gradient-to-r from-transparent via-brand-purple/40 to-transparent" />

          <form onSubmit={handleTransfer} className="space-y-8">
            
            <div className="flex items-center justify-between p-4 bg-[#0D0F12] border border-white/5 rounded-xl transition-all group">
              <div>
                <label className="text-[10px] font-bold text-slate-600 uppercase tracking-widest block mb-0.5">Sua Conta (Origem)</label>
                <p className="text-xs font-medium text-slate-400 group-hover:text-slate-200 transition-colors">
                  {account ? account.owner_name : 'Carregando...'}
                </p>
              </div>
              <div className="text-right">
                <p className="text-[10px] font-mono text-slate-700 uppercase">
                  #{account?.account_number.substring(0, 8)}...
                </p>
              </div>
            </div>

            <div className="space-y-3">
              <label className="text-[11px] font-bold text-slate-500 uppercase tracking-wider ml-1">Método de Envio</label>
              <div className="grid grid-cols-3 gap-1.5 p-1.5 bg-[#0D0F12] rounded-xl border border-white/5">
                {['PIX', 'TED', 'DOC'].map((type) => (
                  <button
                    key={type}
                    type="button"
                    onClick={() => setTransferType(type as TransferType)}
                    className={`py-2.5 rounded-lg text-xs font-bold transition-all duration-200 ${
                      transferType === type 
                        ? 'bg-brand-purple text-white shadow-lg shadow-brand-purple/20' 
                        : 'text-slate-500 hover:text-slate-300 hover:bg-white/5'
                    }`}
                  >
                    {type}
                  </button>
                ))}
              </div>
            </div>

            <div className="space-y-1.5">
              <label className="text-[11px] font-bold text-slate-500 uppercase tracking-wider ml-1">Destinatário</label>
              <div className="relative">
                <select
                  value={destinationAccount}
                  onChange={(e) => setDestinationAccount(e.target.value)}
                  className="w-full bg-[#0D0F12] border border-white/5 rounded-xl text-sm p-4 outline-none focus:border-brand-purple/40 focus:ring-4 focus:ring-brand-purple/5 transition-all appearance-none cursor-pointer text-slate-200"
                  required
                >
                  <option value="" disabled>Selecione para quem enviar...</option>
                  {availableAccounts.map((acc) => (
                    <option key={acc.id} value={acc.account_number}>
                      {acc.owner_name} ({acc.account_number})
                    </option>
                  ))}
                </select>
                <div className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none text-slate-600 italic text-xs">
                  ▼
                </div>
              </div>
            </div>

            <Input 
              label="Quanto deseja enviar?" 
              prefix="R$"
              type="number"
              step="0.01"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              placeholder="0,00"
              className="text-3xl font-bold tracking-tight text-white focus:bg-[#0D0F12]"
              required
            />

            <Button 
              type="submit" 
              isLoading={isLoading || !account}
              variant="primary"
              className="mt-4 py-4"
            >
              {!account ? 'SINCRONIZANDO...' : 'CONFIRMAR TRANSFERÊNCIA'}
            </Button>
          </form>
        </div>

        <div className="mt-12 flex items-center justify-center gap-3 opacity-20 grayscale">
            <div className="h-px w-8 bg-slate-600" />
            <p className="text-[9px] uppercase tracking-[0.4em] font-bold text-slate-500 whitespace-nowrap">
                Ledger Security Protocol v2.4
            </p>
            <div className="h-px w-8 bg-slate-600" />
        </div>
      </div>
    </div>
  );
}