interface LoadingProps {
  label?: string;
  size?: 'sm' | 'md' | 'lg';
  fullScreen?: boolean;
}

export function Loading({ label, size = 'md', fullScreen = false }: LoadingProps) {
  const sizeClasses = {
    sm: 'w-5 h-5 border-2',
    md: 'w-8 h-8 border-3',
    lg: 'w-12 h-12 border-4'
  };

  const containerClasses = fullScreen 
    ? "fixed inset-0 z-50 flex flex-col items-center justify-center bg-brand-dark/80 backdrop-blur-sm"
    : "flex flex-col items-center justify-center p-4";

  return (
    <div className={containerClasses}>
      <div className={`${sizeClasses[size]} border-brand-purple border-t-transparent rounded-full animate-spin mb-3`}></div>
      {label && (
        <p className="text-gray-400 text-xs font-bold tracking-widest uppercase animate-pulse">
          {label}
        </p>
      )}
    </div>
  );
}