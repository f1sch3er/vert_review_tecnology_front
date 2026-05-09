interface LoadingProps {
  label?: string;
  size?: 'sm' | 'md' | 'lg';
  fullScreen?: boolean;
}

export function Loading({ label, size = 'md', fullScreen = false }: LoadingProps) {
  const sizeClasses = {
    sm: 'w-5 h-5 border-[2px]',
    md: 'w-10 h-10 border-[3px]',
    lg: 'w-16 h-16 border-[4px]'
  };
  const containerClasses = fullScreen 
    ? "fixed inset-0 z-50 flex flex-col items-center justify-center bg-[#0F1115]/60 backdrop-blur-md transition-all"
    : "flex flex-col items-center justify-center p-8";

  return (
    <div className={containerClasses}>
      <div className="relative">
        <div className={`${sizeClasses[size]} border-brand-purple/20 border-t-brand-purple rounded-full animate-spin`}></div>
        <div className={`absolute inset-0 ${sizeClasses[size]} border-transparent border-t-brand-purple/30 rounded-full blur-[2px]`}></div>
      </div>

      {label && (
        <p className="mt-4 text-slate-500 text-[10px] font-bold tracking-[0.2em] uppercase animate-pulse">
          {label}
        </p>
      )}
    </div>
  );
}