import { Link } from 'react-router-dom';
import type { RecentActivityProps } from '../types/recent_activity';

export function RecentActivity({ transactions, loading, formatBalance, lang }: RecentActivityProps) {
  return (
    // MUDANÇA: bg-[#16191E] para combinar com a sidebar e rounded-2xl para ser menos circular
    <section className="bg-[#16191E] border border-white/5 rounded-2xl p-6 lg:p-8 shadow-sm">
      <div className="flex justify-between items-end mb-6">
        <div>
          <h3 className="text-lg font-semibold text-white flex items-center gap-2">
            <span className="text-brand-purple text-xl">#</span> Transações Recentes
          </h3>
          <p className="text-[11px] text-slate-500 font-medium">Seu histórico financeiro atualizado</p>
        </div>
        <Link 
          to="/transactions" 
          className="text-[11px] font-bold text-brand-purple hover:text-brand-purple/80 transition-colors flex items-center gap-1 group"
        >
          Ver tudo <span className="group-hover:translate-x-0.5 transition-transform">→</span>
        </Link>
      </div>

      <div className="space-y-3">
        {loading ? (
          [1, 2, 3].map((i) => (
            <div key={i} className="h-16 bg-white/[0.02] rounded-xl border border-white/5 animate-pulse" />
          ))
        ) : transactions.length > 0 ? (
          transactions.map((tx) => (
            <div 
              key={tx.id} 
              className="flex items-center justify-between p-4 bg-[#1C2025] rounded-xl border border-white/5 group hover:border-brand-purple/30 transition-all"
            >
              <div className="flex items-center gap-4">
                {/* Ícones menores e mais discretos */}
                <div className={`w-9 h-9 rounded-lg flex items-center justify-center text-sm ${
                  tx.direction === 'IN' ? 'bg-green-500/10 text-green-500' : 'bg-slate-500/10 text-slate-400'
                }`}>
                  {tx.direction === 'IN' ? '↓' : '↑'}
                </div>
                <div>
                  <p className="font-semibold text-sm text-slate-200">{tx.type_display}</p>
                  <p className="text-[10px] text-slate-500 font-medium">
                    {tx.date_formatted}
                  </p>
                </div>
              </div>
              
              <div className="text-right">
                <span className={`font-bold text-sm ${tx.direction === 'IN' ? 'text-green-500' : 'text-slate-200'}`}>
                  {tx.direction === 'IN' ? '+' : '-'} {lang === 'PT' ? 'R$' : '$'} {formatBalance(tx.amount)}
                </span>
              </div>
            </div>
          ))
        ) : (

          <div className="py-12 text-center border border-dashed border-white/5 rounded-xl">
            <div className="text-2xl mb-2 opacity-20">📁</div>
            <p className="text-slate-500 text-xs font-medium">Nenhuma transação encontrada no período.</p>
          </div>
        )}
      </div>
    </section>
  );
}