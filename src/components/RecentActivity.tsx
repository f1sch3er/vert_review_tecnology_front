import { Link } from 'react-router-dom';
import type { RecentActivityProps } from '../types/recent_activity';

export function RecentActivity({ transactions, loading, formatBalance, lang }: RecentActivityProps) {
  return (
    <div className="space-y-4">
      {/* HEADER DA SEÇÃO */}
      <div className="flex justify-between items-end px-2 mb-2">
        <div>
          <h3 className="text-[11px] font-black text-brand-purple uppercase tracking-[0.2em] italic flex items-center gap-2">
            <span className="w-2 h-2 bg-brand-purple rounded-full animate-pulse" />
            {lang === 'PT' ? 'Transações Recentes' : 'Recent Activity'}
          </h3>
        </div>
        <Link 
          to="/history" 
          className="text-[10px] font-black text-slate-500 hover:text-white transition-colors uppercase tracking-widest italic"
        >
          {lang === 'PT' ? 'Ver histórico completo' : 'View full history'} →
        </Link>
      </div>

      {/* LISTA DE CARDS */}
      <div className="space-y-3">
        {loading ? (
          [1, 2, 3].map((i) => (
            <div key={i} className="h-24 bg-[#16191E] rounded-2xl border border-white/5 animate-pulse" />
          ))
        ) : transactions.length > 0 ? (
          transactions.map((tx) => (
            <Link 
              key={tx.id} 
              to={`/transfer-detail/${tx.id}`}
              className="group relative flex items-center justify-between p-6 bg-[#16191E] rounded-2xl border border-white/5 hover:border-brand-purple/40 hover:bg-[#1C2025] transition-all shadow-xl shadow-black/20 block"
            >
              {/* Indicador Lateral de Hover */}
              <div className="absolute left-0 top-4 bottom-4 w-1 bg-brand-purple rounded-r-full opacity-0 group-hover:opacity-100 transition-opacity" />

              <div className="flex items-center gap-5">
                {/* Ícone Redondo Direcional */}
                <div className={`w-12 h-12 rounded-xl border flex items-center justify-center text-lg font-black transition-transform group-hover:scale-110 ${
                  tx.direction === 'IN' 
                    ? 'bg-green-500/5 border-green-500/10 text-green-500' 
                    : 'bg-red-500/5 border-red-500/10 text-red-500'
                }`}>
                  {tx.direction === 'IN' ? '↓' : '↑'}
                </div>
                
                <div>
                  <p className="font-black text-sm text-slate-200 group-hover:text-white transition-colors uppercase italic tracking-tight">
                    {tx.type_display || (lang === 'PT' ? 'Transferência' : 'Transfer')}
                  </p>
                  <p className="text-[10px] text-slate-600 font-bold uppercase tracking-[0.1em] mt-0.5">
                    {tx.date_formatted} • <span className="text-brand-purple/50">REF: {tx.id.toString().substring(0, 8)}</span>
                  </p>
                </div>
              </div>
              
              <div className="text-right">
                <p className={`font-black text-lg italic tracking-tighter ${
                  tx.direction === 'IN' ? 'text-green-500' : 'text-slate-300'
                }`}>
                  {tx.direction === 'IN' ? '+' : '-'} {lang === 'PT' ? 'R$' : '$'} {formatBalance(tx.amount).replace(/[^\d.,]/g, '')}
                </p>
                <div className="flex items-center justify-end gap-2 opacity-0 group-hover:opacity-100 transition-all transform translate-x-2 group-hover:translate-x-0">
                  <span className="text-[9px] text-brand-purple font-black uppercase italic">Details</span>
                  <span className="text-brand-purple text-xs">→</span>
                </div>
              </div>
            </Link>
          ))
        ) : (
          <div className="py-16 text-center border-2 border-dashed border-white/5 rounded-2xl">
            <p className="text-slate-600 font-black uppercase tracking-[0.2em] italic opacity-50 text-[10px]">
              {lang === 'PT' ? 'Nenhum fluxo de dados detectado' : 'No data streams detected'}
            </p>
          </div>
        )}
      </div>
    </div>
  );
}