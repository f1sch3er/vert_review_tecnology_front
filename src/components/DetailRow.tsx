import type { DetailRowProps } from "../types/detailRow";


export const DetailRow = ({ label, value, isStatus, isMonospace }: DetailRowProps) => (
  <div className="flex flex-col gap-1">
    <span className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">
      {label}
    </span>
    {isStatus ? (
      <span className={`text-[10px] font-black px-2 py-0.5 rounded-md border w-fit ${
        value === 'SETTLED' 
          ? 'bg-green-500/10 text-green-500 border-green-500/20' 
          : 'bg-yellow-500/10 text-yellow-500 border-yellow-500/20'
      }`}>
        {value}
      </span>
    ) : (
      <span className={`text-sm font-semibold text-slate-200 ${isMonospace ? 'font-mono text-xs text-brand-purple/80' : ''}`}>
        {value || '---'}
      </span>
    )}
  </div>
);

export default DetailRow