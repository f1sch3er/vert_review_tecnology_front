interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label: string;
  prefix?: string; // Nova prop opcional para o R$
}

export function Input({ label, prefix, className, ...props }: InputProps) {
  return (
    <div className="space-y-2 w-full">
      {label && <label className="text-sm font-medium text-gray-300">{label}</label>}
      
      <div className="relative flex items-center">
        {/* Renderiza o prefixo apenas se ele existir */}
        {prefix && (
          <span className="absolute left-4 text-xl font-black text-brand-purple pointer-events-none z-10">
            {prefix}
          </span>
        )}
        
        <input 
          {...props}
          className={`
            w-full bg-dark-surface border border-gray-800 rounded-xl 
            focus:ring-2 focus:ring-brand-purple focus:outline-none 
            transition-all text-white p-4
            ${prefix ? 'pl-14' : 'pl-4'} 
            ${className} 
          `}
        />
      </div>
    </div>
  );
}