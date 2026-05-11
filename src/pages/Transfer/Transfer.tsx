import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { v4 as uuidv4 } from 'uuid';
import { AppToast } from '../../utils/alerts';
import { accountService } from '../../services/accountService';
import { transferService } from '../../services/transferService';
import { Button } from '../../components/Button';
import { Input } from '../../components/Input';
import type { AccountData } from '../../types/account';
import type { TransferPayload, TransferType } from '../../types/transfer';

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
          title: 'Error syncing ledger data.' 
        });
        navigate('/dashboard');
      }
    }
    loadData();
  }, [navigate]);

  const handleTransfer = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!account?.id || !destinationAccount) {
      AppToast.fire({ icon: 'error', title: 'Select a valid destination.' });
      return;
    }

    const numericAmount = parseFloat(amount);
    if (isNaN(numericAmount) || numericAmount <= 0) {
      AppToast.fire({ icon: 'error', title: 'Invalid amount.' });
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
        title: 'Transfer Complete!',
        text: `New balance: R$ ${response.from_account_balance_after}`,
        timer: 2000,
        showConfirmButton: false
      });

      setTimeout(() => navigate('/dashboard'), 1500);
    } catch (error: any) {
      AppToast.fire({ 
        icon: 'error', 
        title: 'Attention',
        text: error.response?.data?.message || 'Protocol failure.'
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex min-h-screen bg-[#0F1115] font-sans">
      {/* LADO ESQUERDO: FORMULÁRIO */}
      <div className="w-full lg:w-1/2 flex flex-col justify-center px-8 md:px-24 py-12 relative">
        
        <button 
          onClick={() => navigate(-1)}
          className="absolute top-12 left-8 md:left-24 text-[10px] font-black text-slate-500 hover:text-brand-purple uppercase tracking-[0.3em] transition-all italic"
        >
          ← Back to Ledger
        </button>

        <div className="max-w-md w-full mx-auto space-y-10">
          <header>
            <h2 className="text-4xl font-black tracking-tighter text-white italic uppercase leading-none">
              New<br/>Transfer
            </h2>
            <p className="mt-4 text-slate-500 text-lg">Send funds via distributed Kafka stream.</p>
          </header>

          <form onSubmit={handleTransfer} className="space-y-6">
            
            {/* Seletor de Método (Estilo Toggle) */}
            <div className="space-y-2">
              <label className="text-[10px] font-bold text-slate-500 uppercase tracking-widest ml-1">
                Transfer Protocol
              </label>
              <div className="grid grid-cols-3 gap-2 p-1 bg-[#1C2025] rounded-xl border border-white/5">
                {(['PIX', 'TED', 'DOC'] as TransferType[]).map((type) => (
                  <button
                    key={type}
                    type="button"
                    onClick={() => setTransferType(type)}
                    className={`py-2 text-[11px] font-black rounded-lg transition-all tracking-wider ${
                      transferType === type 
                      ? 'bg-brand-purple text-white shadow-lg shadow-brand-purple/20' 
                      : 'text-slate-500 hover:text-slate-300'
                    }`}
                  >
                    {type}
                  </button>
                ))}
              </div>
            </div>

            {/* Input de Valor */}
            <Input 
              label="Amount (BRL)" 
              name="amount"
              type="number"
              step="0.01"
              placeholder="0.00"
              value={amount} 
              onChange={(e) => setAmount(e.target.value)} 
              required 
            />

            {/* Select de Destinatário Padronizado */}
            <div className="space-y-2">
              <label className="text-[10px] font-bold text-slate-500 uppercase tracking-widest ml-1">
                Destination Node
              </label>
              <div className="relative group">
                <select
                  value={destinationAccount}
                  onChange={(e) => setDestinationAccount(e.target.value)}
                  className="w-full bg-[#1C2025] border border-white/5 text-slate-200 text-sm font-bold p-4 rounded-xl outline-none focus:border-brand-purple/50 transition-all appearance-none cursor-pointer"
                  required
                >
                  <option value="" disabled className="bg-[#0F1115]">Select beneficiary...</option>
                  {availableAccounts.map((acc) => (
                    <option key={acc.id} value={acc.account_number} className="bg-[#0F1115]">
                      {acc.owner_name} - #{acc.account_number.substring(0, 8)}
                    </option>
                  ))}
                </select>
                <div className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none text-brand-purple text-xs">
                  ▼
                </div>
              </div>
            </div>

            {/* Info de Origem */}
            <div className="p-4 bg-white/[0.02] border border-white/5 rounded-2xl flex items-center justify-between">
              <div>
                <h4 className="font-black text-[9px] text-slate-600 uppercase tracking-widest italic">Source</h4>
                <p className="text-[11px] font-bold text-slate-400 uppercase tracking-tighter">
                  {account?.owner_name || 'Syncing...'}
                </p>
              </div>
              <div className="text-right">
                <h4 className="font-black text-[9px] text-slate-600 uppercase tracking-widest italic">Limit</h4>
                <p className="text-[11px] font-bold text-green-500 italic">
                  R$ {Number(account?.balance || 0).toLocaleString('pt-BR')}
                </p>
              </div>
            </div>

            <Button 
              type="submit"
              isLoading={isLoading || !account}
              className="mt-4 py-4 text-sm tracking-[0.2em] font-black bg-brand-purple hover:bg-brand-purple/90 italic uppercase"
            >
              Execute Protocol
            </Button>
          </form>

          <footer className="opacity-40">
             <p className="text-[10px] text-slate-600 leading-relaxed font-bold italic uppercase tracking-tighter">
                End-to-end encrypted session. Transaction will be broadcasted to the distributed ledger immediately.
             </p>
          </footer>
        </div>
      </div>

      {/* LADO DIREITO: VISUAL */}
      <div className="hidden lg:flex w-1/2 bg-gradient-to-br from-[#0F1115] via-[#16191E] to-brand-purple/20 justify-center items-center border-l border-white/5 relative overflow-hidden">
        <div className="absolute top-[-10%] right-[-10%] w-[500px] h-[500px] bg-brand-purple/5 rounded-full blur-[120px]" />
        
        <div className="text-center p-12 relative z-10">
            <div className="mb-8 flex justify-center gap-4">
              <div className="w-12 h-12 rounded-full bg-brand-purple/20 flex items-center justify-center border border-brand-purple/30 animate-pulse">
                <span className="text-xl">💸</span>
              </div>
            </div>

            <h1 className="text-6xl font-black text-white mb-6 italic tracking-tighter uppercase leading-none">
              Outbound<br/>Stream
            </h1>
            <div className="h-1 w-20 bg-brand-purple mx-auto mb-8" />
            <p className="text-slate-400 max-w-sm mx-auto text-lg leading-relaxed font-medium">
              Real-time settlement for your peer-to-peer operations.
            </p>
        </div>
      </div>
    </div>
  );
}