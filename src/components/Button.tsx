import type { ReactNode } from "react";

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  children: ReactNode;
  isLoading?: boolean;
  variant?: 'primary' | 'secondary' | 'outline';
  fullWidth?: boolean;
}

export function Button({ 
  children, 
  isLoading, 
  variant = 'primary', 
  fullWidth = true,
  className = '',
  disabled,
  ...props 
}: ButtonProps) {
  const baseStyles = "relative flex items-center justify-center gap-2.5 py-3.5 rounded-xl font-semibold transition-all duration-200 active:scale-[0.97] disabled:opacity-40 disabled:cursor-not-allowed disabled:active:scale-100 text-sm";
  
  const variants = {
    primary: "bg-brand-purple hover:brightness-110 text-white shadow-lg shadow-brand-purple/20 ring-1 ring-white/10",
    secondary: "bg-[#1C2025] border border-white/5 text-slate-300 hover:bg-[#23282f] hover:text-white",
    outline: "bg-transparent border border-brand-purple/50 text-brand-purple hover:bg-brand-purple/5 hover:border-brand-purple"
  };

  const widthStyle = fullWidth ? 'w-full' : 'px-6';

  return (
    <button 
      className={`${baseStyles} ${variants[variant]} ${widthStyle} ${className}`}
      disabled={disabled || isLoading}
      {...props}
    >
      {isLoading ? (
        <div className="flex items-center gap-3">
          {/* Spinner mais fino e elegante */}
          <div className="w-4 h-4 border-2 border-current/20 border-t-current rounded-full animate-spin"></div>
          <span className="opacity-80">Carregando...</span>
        </div>
      ) : (
        children
      )}
    </button>
  );
}