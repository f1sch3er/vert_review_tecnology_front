interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label: string;
  prefix?: string;
}

export function Input({ label, prefix, className, ...props }: InputProps) {
  return (
    <div className="space-y-1.5 w-full">
      {label && (
        <label className="text-[11px] font-bold text-slate-500 uppercase tracking-wider ml-1">
          {label}
        </label>
      )}
      
      <div className="relative group flex items-center">
        {prefix && (
          <span className="absolute left-4 text-sm font-bold text-brand-purple/80 pointer-events-none z-10 transition-colors group-focus-within:text-brand-purple">
            {prefix}
          </span>
        )}
        
        <input 
          {...props}
          className={`
            w-full bg-[#0D0F12] border border-white/5 rounded-xl 
            placeholder:text-slate-600 text-sm
            focus:border-brand-purple/40 focus:bg-[#121519] focus:ring-4 focus:ring-brand-purple/5
            focus:outline-none transition-all duration-200 text-slate-200 p-3.5
            ${prefix ? 'pl-12' : 'pl-4'} 
            ${className} 
          `}
        />
      </div>
    </div>
  );
}