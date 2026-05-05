import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { v4 as uuidv4 } from 'uuid';
import { AppToast } from '../../utils/alerts';
import { accountService } from '../../services/accountService';
import { Button } from '../../components/Button';
import type { AccountData } from '../../types/account';
import { transferService } from '../../services/transferService';
import type { TransferPayload } from '../../types/transfer';
import type { TransferType } from '../../types/transfer';

export default function Transfer() {
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false);
  const [account, setAccount] = useState<AccountData | null>(null);
  const [availableAccounts, setAvailableAccounts] = useState<AccountData[]>([]);
  
  // Estados do formulário
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
        html: `
          <div class="text-left text-sm mt-2 border-t border-gray-100 pt-2">
            <p><strong>Tipo:</strong> ${transferType}</p>
            <p><strong>Status:</strong> <span class="text-blue-500">${response.transfer_status}</span></p>
            <p><strong>Novo Saldo:</strong> R$ ${response.from_account_balance_after}</p>
          </div>
        `
      });

      navigate('/dashboard');
    } catch (error: any) {
      const serverMessage = error.response?.data?.message || 'Falha ao processar transferência.';
      AppToast.fire({ icon: 'error', title: serverMessage });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-brand-dark text-white flex flex-col items-center justify-center p-6">
      <div className="w-full max-w-lg">
        <button 
          onClick={() => navigate(-1)}
          className="flex items-center gap-2 text-gray-500 hover:text-white transition-colors mb-8 group"
        >
          <span className="group-hover:-translate-x-1 transition-transform">←</span> Voltar
        </button>

        <header className="mb-10 text-center lg:text-left">
          <h1 className="text-4xl font-black italic uppercase tracking-tighter text-brand-purple">
            Enviar Transferência
          </h1>
          <p className="text-gray-400 mt-2">Selecione o destino, o método e o valor.</p>
        </header>

        <form 
          onSubmit={handleTransfer} 
          className="bg-[#111114] border border-gray-800 rounded-[2.5rem] p-8 shadow-2xl space-y-6"
        >
          {/* Conta de Origem */}
          <div className="px-4 py-2 bg-black/20 rounded-xl border border-dashed border-gray-800">
            <label className="text-[10px] uppercase text-gray-500 font-bold tracking-widest">Sua Conta (Origem)</label>
            <p className="text-xs text-gray-400 truncate">{account?.id || 'Carregando...'}</p>
          </div>

          {/* Seleção do Tipo de Transferência */}
          <div className="space-y-2">
            <label className="text-brand-purple font-bold text-xs uppercase tracking-widest ml-2">
              Tipo de Transferência
            </label>
            <div className="grid grid-cols-3 gap-2">
              {['PIX', 'TED', 'DOC'].map((type) => (
                <button
                  key={type}
                  type="button"
                  onClick={() => setTransferType(type as TransferType)}
                  className={`py-3 rounded-xl border text-xs font-bold transition-all ${
                    transferType === type 
                      ? 'bg-brand-purple border-brand-purple text-white shadow-[0_0_15px_rgba(139,92,246,0.4)]' 
                      : 'bg-black/20 border-gray-800 text-gray-500 hover:border-gray-600'
                  }`}
                >
                  {type}
                </button>
              ))}
            </div>
          </div>

          {/* Combobox de Contas de Destino */}
          <div className="space-y-2">
            <label className="text-brand-purple font-bold text-xs uppercase tracking-widest ml-2">
              Conta de Destino
            </label>
            <select
              value={destinationAccount}
              onChange={(e) => setDestinationAccount(e.target.value)}
              className="w-full bg-black/20 border border-gray-800 rounded-2xl py-4 px-6 outline-none focus:border-brand-purple transition-all appearance-none cursor-pointer text-sm"
              required
            >
              <option value="" disabled className="bg-[#111114]">Selecione um destinatário...</option>
              {availableAccounts.map((acc) => (
                <option key={acc.id} value={acc.account_number} className="bg-[#111114]">
                  {acc.owner_name} ({acc.account_number.substring(0, 8)}...)
                </option>
              ))}
            </select>
          </div>

          {/* Valor */}
          <div className="space-y-2">
            <label className="text-brand-purple font-bold text-xs uppercase tracking-widest ml-2">
              Valor da Operação
            </label>
            <div className="relative">
              <span className="absolute left-6 top-1/2 -translate-y-1/2 text-xl font-black text-brand-purple">R$</span>
              <input 
                type="number"
                step="0.01"
                min="0.01"
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
                className="w-full bg-black/20 border border-gray-800 rounded-2xl py-6 pl-16 pr-8 text-2xl font-black outline-none focus:border-brand-purple focus:ring-1 focus:ring-brand-purple transition-all"
                placeholder="0.00"
                required
              />
            </div>
          </div>

          <Button type="submit" isLoading={isLoading || !account}>
            {!account ? 'CARREGANDO DADOS...' : 'CONFIRMAR ENVIO'}
          </Button>
        </form>

        <p className="text-center text-gray-600 text-[10px] mt-8 uppercase tracking-widest">
          Transações processadas via Ledger Core em tempo real.
        </p>
      </div>
    </div>
  );
}