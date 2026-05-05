import { Link } from 'react-router-dom';
import type { RecentActivityProps } from '../types/recent_activity';


export function RecentActivity({ transactions, loading, formatBalance, lang }: RecentActivityProps) {
  return (
    <section className="bg-[#111114] border border-gray-800/50 rounded-[2rem] p-8">
      <div className="flex justify-between items-center mb-8">
        <h3 className="text-xl font-bold italic flex items-center gap-2">
          <span className="text-brand-purple italic">#</span> Transações Recentes
        </h3>
        <Link 
          to="/transactions" 
          className="text-[10px] uppercase font-black tracking-widest text-gray-500 hover:text-white transition-colors"
        >
          Ver tudo
        </Link>
      </div>

      <div className="space-y-4">
        {loading ? (
          [1, 2].map((i) => (
            <div key={i} className="h-20 bg-[#0D0D0F] rounded-2xl border border-gray-800/20 animate-pulse" />
          ))
        ) : transactions.length > 0 ? (
          transactions.map((tx) => (
            <div 
              key={tx.id} 
              className="flex items-center justify-between p-5 bg-[#0D0D0F] rounded-2xl border border-gray-800/40 group hover:border-gray-700 transition-all"
            >
              <div className="flex items-center gap-4">
                <div className={`w-10 h-10 rounded-xl flex items-center justify-center text-xs ${
                  tx.direction === 'IN' ? 'bg-green-500/10 text-green-500' : 'bg-red-500/10 text-red-400'
                }`}>
                  {tx.direction === 'IN' ? '↓' : '↑'}
                </div>
                <div>
                  <p className="font-bold text-sm">{tx.type_display}</p>
                  <p className="text-[10px] text-gray-500 font-black tracking-tighter uppercase">
                    {tx.date_formatted}
                  </p>
                </div>
              </div>
              
              <span className={`font-black text-sm ${tx.direction === 'IN' ? 'text-green-500' : 'text-white'}`}>
                {tx.direction === 'IN' ? '+' : '-'} {lang === 'PT' ? 'R$' : '$'} {formatBalance(tx.amount)}
              </span>
            </div>
          ))
        ) : (
          <div className="py-10 text-center border border-dashed border-gray-800 rounded-2xl">
            <p className="text-gray-500 text-sm">Nenhuma transação encontrada.</p>
          </div>
        )}
      </div>
    </section>
  );
}