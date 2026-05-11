interface BalanceCardProps {
  balance: number;
  lang: 'PT' | 'EN';
  texts: any;
  formatBalance: (value: number) => string;
}

export function BalanceCard({ balance, lang, texts, formatBalance }: BalanceCardProps) {
  return (
    <div className="p-8 bg-gradient-to-br from-brand-purple to-[#7c3aed] rounded-2xl relative overflow-hidden shadow-2xl shadow-brand-purple/10 border border-white/10">
      <div className="relative z-10">
        <p className="text-purple-100/70 text-sm font-bold uppercase tracking-widest mb-1 italic opacity-80">
          {texts.DASHBOARD.STATS.BALANCE}
        </p>
        <div className="flex items-baseline gap-2">
          <span className="text-xl font-medium text-purple-200">
            {lang === 'PT' ? 'R$' : '$'}
          </span>
          <h4 className="text-5xl font-black tracking-tighter text-white italic">
            {formatBalance(balance)}
          </h4>
        </div>
      </div>
      
      <div className="absolute top-0 right-0 w-48 h-48 bg-white/5 rounded-full -mr-16 -mt-16 blur-3xl" />
      <div className="absolute bottom-0 left-0 w-24 h-24 bg-black/10 rounded-full -ml-8 -mb-8 blur-2xl" />
    </div>
  );
}