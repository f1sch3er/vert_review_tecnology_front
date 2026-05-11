import { Link } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';

interface SidebarProps {
  texts: any;
  currentPath: string;
}

export function Sidebar({ texts, currentPath }: SidebarProps) {
  const { signOut } = useAuth();

  const menuItems = [
    { label: texts.SIDEBAR.DASHBOARD, path: '/dashboard' },
    { label: 'Activity History', path: '/transfer-history' },
    { label: texts.SIDEBAR.PROFILE, path: '/profile' },
  ];

  return (
    <aside className="w-64 bg-[#16191E] border-r border-white/5 p-6 flex flex-col h-full">
      <div className="flex items-center gap-3 mb-10 px-2">
        <div className="w-8 h-8 bg-brand-purple rounded-md flex items-center justify-center font-black text-white shadow-lg shadow-brand-purple/20 text-sm">
          F
        </div>
        <h1 className="text-lg font-semibold tracking-tight text-white italic">
          {texts.COMMON.APP_NAME}
        </h1>
      </div>

      <nav className="space-y-1.5 flex-1">
        {menuItems.map((item) => {
          const isActive = currentPath === item.path;
          return (
            <Link
              key={item.path}
              to={item.path}
              className={`block px-4 py-2.5 rounded-lg text-sm transition-all font-medium ${
                isActive
                  ? 'bg-brand-purple/10 text-brand-purple'
                  : 'text-slate-400 hover:bg-white/5 hover:text-white'
              }`}
            >
              {item.label}
            </Link>
          );
        })}
      </nav>

      <button
        onClick={() => signOut()}
        className="mt-auto flex items-center gap-3 px-4 py-2.5 rounded-lg text-slate-500 hover:text-red-400 hover:bg-red-400/5 transition-all text-sm font-medium group"
      >
        <span className="opacity-70 group-hover:opacity-100 transition-opacity">Logout</span>
      </button>
    </aside>
  );
}