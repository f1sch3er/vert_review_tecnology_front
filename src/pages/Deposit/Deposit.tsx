import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { AppToast } from '../../utils/alerts';
import { accountService } from '../../services/accountService';
import { Button } from '../../components/Button'; 

export default function Deposit() {
  const navigate = useNavigate();
  const [amount, setAmount] = useState('');
  const [isLoading, setIsLoading] = useState(false);

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
        text: 'O saldo será atualizado em instantes via Kafka.'
      });

      navigate('/dashboard');
    } catch (error: any) {
      console.error(error);
      AppToast.fire({
        icon: 'error',
        title: error.response?.data?.message || 'Erro ao processar depósito.'
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#0A0A0B] text-white flex flex-col items-center justify-center p-6 font-sans">
      <div className="w-full max-w-lg">
        {/* Botão Voltar */}
        <button 
          onClick={() => navigate(-1)}
          className="flex items-center gap-2 text-gray-500 hover:text-white transition-colors mb-8 group"
        >
          <span className="group-hover:-translate-x-1 transition-transform">←</span> Voltar
        </button>

        <header className="text-center mb-10">
          <h1 className="text-4xl font-black italic uppercase tracking-tighter mb-2">
            Adicionar Saldo
          </h1>
          <p className="text-gray-400">
            Informe o valor que deseja creditar em sua conta via Ledger.
          </p>
        </header>

        <form onSubmit={handleDeposit} className="bg-[#111114] border border-gray-800 rounded-[2.5rem] p-8 shadow-2xl space-y-8">
          
          <div className="space-y-4">
            <label className="text-brand-purple font-bold text-xs uppercase tracking-widest ml-2">
              Valor do Depósito
            </label>
            <div className="relative">
              <span className="absolute left-6 top-1/2 -translate-y-1/2 text-2xl font-black text-brand-purple">
                R$
              </span>
              <input 
                type="number"
                step="0.01"
                placeholder="0,00"
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
                className="w-full bg-black/20 border border-gray-800 rounded-2xl py-8 pl-20 pr-8 text-4xl font-black outline-none focus:border-brand-purple transition-all placeholder:text-gray-800 text-white"
                required
              />
            </div>
          </div>

          <div className="bg-brand-purple/5 border border-brand-purple/10 rounded-2xl p-6 space-y-3">
            <h3 className="text-brand-purple font-bold text-sm uppercase flex items-center gap-2">
              <span className="w-1.5 h-1.5 bg-brand-purple rounded-full animate-pulse" />
              Atenção
            </h3>
            <ul className="text-sm text-gray-500 space-y-2">
              <li>• O saldo será processado via mensageria Kafka.</li>
              <li>• O valor ficará disponível para transferências imediatas.</li>
              <li>• Esta é uma operação simulada de ambiente de teste.</li>
            </ul>
          </div>

          {/* Substituído o <button> nativo pelo componente Button customizado */}
          <Button 
            type="submit"
            isLoading={isLoading}
            className="py-6 text-lg" 
          >
            Confirmar Depósito
          </Button>
        </form>
      </div>
    </div>
  );
}