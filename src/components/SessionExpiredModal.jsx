import React from "react";

function SessionExpiredModal({ isOpen, onLogin, onClose }) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-9999 flex items-center justify-center p-4 bg-black/70 backdrop-blur-xl animate-fade-in">
      <div className="bg-white/95 dark:bg-slate-800/95 border border-white/20 dark:border-slate-700 rounded-3xl p-8 w-full max-w-sm shadow-2xl text-center relative flex flex-col items-center transform transition-all">
        
        <div className="relative w-20 h-20 flex items-center justify-center mb-6">
          <div className="absolute inset-0 bg-red-400/20 dark:bg-red-500/10 rounded-full animate-ping"></div>
          <div className="relative w-16 h-16 bg-red-50 dark:bg-red-900/40 border-4 border-white dark:border-slate-800 rounded-full flex items-center justify-center shadow-sm">
            <span className="text-3xl">🔒</span>
          </div>
        </div>
        
        <h2 className="text-2xl font-bold text-gray-800 dark:text-white mb-2 tracking-tight">
          Oturum Süresi Doldu
        </h2>
        
        <p className="text-gray-500 dark:text-gray-400 mb-8 text-sm leading-relaxed px-2">
          Güvenliğiniz için oturumunuz otomatik olarak sonlandırıldı. Kaldığınız yerden devam etmek için tekrar giriş yapın.
        </p>
        
        <div className="w-full space-y-3">
          <button
            onClick={onLogin} 
            className="w-full py-3.5 rounded-xl font-semibold text-white bg-linear-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 transition-all shadow-lg hover:shadow-blue-500/40 hover:-translate-y-0.5 flex items-center justify-center gap-3"
          >
            <svg className="w-5 h-5 bg-white rounded-full p-0.5" viewBox="0 0 24 24" fill="currentColor">
              <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/>
              <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
              <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05"/>
              <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/>
            </svg>
            Google ile Giriş Yap
          </button>

          <button
            onClick={onClose}
            className="w-full py-3.5 rounded-xl font-medium text-gray-700 dark:text-gray-300 bg-gray-100 dark:bg-slate-700/50 hover:bg-gray-200 dark:hover:bg-slate-700 transition-all"
          >
            Ana Menüye Dön
          </button>
        </div>

      </div>
    </div>
  );
}

export default SessionExpiredModal;