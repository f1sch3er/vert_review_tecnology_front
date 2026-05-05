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
  
  const baseStyles = "relative flex items-center justify-center gap-3 py-5 rounded-2xl font-bold transition-all uppercase tracking-[0.15em] active:scale-[0.98] disabled:opacity-50 disabled:cursor-not-allowed disabled:active:scale-100";
  
  const variants = {
    primary: "bg-brand-purple hover:bg-brand-accent text-white shadow-xl shadow-brand-purple/20 hover:scale-[1.02]",
    secondary: "bg-dark-surface border border-gray-800 text-white hover:bg-gray-800",
    outline: "bg-transparent border-2 border-brand-purple text-brand-purple hover:bg-brand-purple hover:text-white"
  };

  const widthStyle = fullWidth ? 'w-full' : 'px-8';

  return (
    <button 
      className={`${baseStyles} ${variants[variant]} ${widthStyle} ${className}`}
      disabled={disabled || isLoading}
      {...props}
    >
      {isLoading ? (
        <div className="flex items-center gap-2">
          <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
          <span>Processando...</span>
        </div>
      ) : (
        children
      )}
    </button>
  );
}