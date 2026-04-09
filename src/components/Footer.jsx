import React from 'react';
import { useLocation, Link } from 'react-router-dom';

function Footer() {
  const currentYear = new Date().getFullYear();
  const location = useLocation();

  if (location.pathname !== '/') {
    return null;
  }

  return (
    <footer className="w-full border-t border-white/20 dark:border-slate-700/50 bg-white/10 dark:bg-slate-900/20 backdrop-blur-md mt-auto">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
        <div className="flex flex-col md:flex-row items-center justify-between gap-4 text-center md:text-left">
          
          <div className="flex flex-wrap justify-center md:justify-start items-center gap-3 sm:gap-4 text-sm font-medium z-10">
            <span className="font-black text-indigo-600 dark:text-indigo-400 tracking-wider text-base">
              TodoV2
            </span>
            
            <span className="opacity-30 text-gray-400 hidden sm:inline">|</span>
            
            <Link 
              to="/dashboard" 
              className="text-gray-600 dark:text-gray-400 hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors"
            >
              Dashboard
            </Link>
            <Link 
              to="/settings" 
              className="text-gray-600 dark:text-gray-400 hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors"
            >
              Ayarlar
            </Link>

            <span className="opacity-30 text-gray-400 hidden sm:inline">|</span>
            
            <span className="text-xs text-gray-500 dark:text-gray-500">
              © {currentYear} Tüm hakları saklıdır.
            </span>
          </div>

          <div className="flex flex-wrap justify-center items-center gap-4 z-10 mt-2 md:mt-0">
            <span className="px-3 py-1 rounded-full bg-indigo-100/50 dark:bg-indigo-900/30 border border-indigo-200 dark:border-indigo-800/50 text-[10px] font-bold text-indigo-700 dark:text-indigo-400 uppercase tracking-wider flex items-center gap-1.5 shadow-sm">
              <span className="text-sm leading-none">🚧</span> Geliştirilme Aşamasında
            </span>
            
            <span className="hidden lg:inline opacity-30 text-gray-400">|</span>

            <div className="flex items-center gap-1.5">
              <span className="w-1.5 h-1.5 bg-green-500 rounded-full animate-pulse shadow-[0_0_5px_rgba(34,197,94,0.5)]"></span>
              <span className="text-[10px] font-bold text-gray-500 dark:text-gray-400 uppercase tracking-tighter">
                Sistem Aktif
              </span>
            </div>
          </div>

        </div>
      </div>
    </footer>
  );
}

export default Footer;