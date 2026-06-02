import { Link, useLocation } from 'react-router-dom';
import { Home, ListVideo, LibrarySquare } from 'lucide-react';
import { cn } from '../lib/utils';

export function BottomNav() {
  const location = useLocation();

  const links = [
    { to: '/', icon: Home, label: 'ホーム' },
    { to: '/library', icon: ListVideo, label: 'ライブラリ' },
    { to: '/netabako', icon: LibrarySquare, label: 'ネタ箱' },
  ];

  return (
    <div className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 safe-area-pb">
      <nav className="flex justify-around">
        {links.map((link) => {
          const isActive = location.pathname === link.to;
          const Icon = link.icon;
          return (
            <Link
              key={link.to}
              to={link.to}
              className={cn(
                "flex flex-col items-center py-3 px-4 flex-1 transition-colors",
                isActive ? "text-blue-600" : "text-gray-500 hover:text-gray-900"
              )}
            >
              <Icon className="w-6 h-6 mb-1" />
              <span className="text-xs font-medium">{link.label}</span>
            </Link>
          );
        })}
      </nav>
    </div>
  );
}
