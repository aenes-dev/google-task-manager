import React, { useEffect } from 'react';

function TaskDetails({ task, onClose }) {
  // Modal açıkken arkadaki sayfanın kaymasını engelle
  useEffect(() => {
    const originalStyle = window.getComputedStyle(document.body).overflow;
    document.body.style.overflow = 'hidden';
    return () => {
      document.body.style.overflow = originalStyle;
    };
  }, []);

  if (!task) return null;

  let displayTime = "";
  let displayNotes = task.notes || "";
  if (displayNotes.startsWith("🕒 Saat: ")) {
    const splitNotes = displayNotes.split("\n");
    displayTime = splitNotes[0].replace("🕒 Saat: ", "");
    displayNotes = splitNotes.slice(1).join("\n");
  }

  const dueDateStr = task.due ? new Date(task.due).toLocaleDateString('tr-TR', { 
    year: 'numeric', month: 'long', day: 'numeric' 
  }) : "Tarih belirtilmemiş";

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-md animate-fade-in">
      <div className="bg-white/95 dark:bg-slate-900/95 backdrop-blur-2xl w-full max-w-lg rounded-[2.5rem] shadow-2xl border border-white/20 dark:border-slate-700/50 overflow-hidden transform animate-scale-in">
        
        {/* Header */}
        <div className="relative p-8 pb-4">
          <button 
            onClick={onClose}
            className="absolute top-6 right-6 p-2 rounded-full bg-gray-100 dark:bg-slate-800 text-gray-500 hover:text-gray-800 dark:hover:text-white transition-all active:scale-90"
          >
            ✕
          </button>
          <div className="flex items-center gap-3 mb-2">
            <span className="bg-green-100 dark:bg-green-900/50 text-green-600 dark:text-green-400 px-3 py-1 rounded-full text-[10px] font-black tracking-wider uppercase">
              Görev Detayı
            </span>
            {task.status === "completed" && (
              <span className="bg-blue-100 dark:bg-blue-900/50 text-blue-600 dark:text-blue-400 px-3 py-1 rounded-full text-[10px] font-black uppercase">
                Tamamlandı
              </span>
            )}
          </div>
          <h2 className={`text-2xl font-black text-gray-800 dark:text-white leading-tight break-words ${task.status === "completed" ? "line-through opacity-60" : ""}`}>
            {task.title}
          </h2>
        </div>

        {/* Body */}
        <div className="p-8 pt-2 space-y-6">
          <div className="flex flex-wrap gap-4">
            <div className="flex items-center gap-3 bg-gray-50 dark:bg-slate-800/50 p-4 rounded-2xl flex-1 min-w-[140px] border border-gray-100 dark:border-slate-700 shadow-sm">
              <span className="text-2xl">📅</span>
              <div>
                <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Son Tarih</p>
                <p className="text-sm font-bold text-gray-700 dark:text-gray-200">{dueDateStr}</p>
              </div>
            </div>
            {displayTime && (
              <div className="flex items-center gap-3 bg-gray-50 dark:bg-slate-800/50 p-4 rounded-2xl flex-1 min-w-[140px] border border-gray-100 dark:border-slate-700 shadow-sm">
                <span className="text-2xl">⏰</span>
                <div>
                  <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Saat</p>
                  <p className="text-sm font-bold text-gray-700 dark:text-gray-200">{displayTime}</p>
                </div>
              </div>
            )}
          </div>

          {/* AÇIKLAMA KISMI - SINIRLANDIRILMIŞ VE ÖZEL SCROLL */}
          {displayNotes && (
            <div className="bg-gray-50 dark:bg-slate-800/50 rounded-[2rem] border border-gray-100 dark:border-slate-700 overflow-hidden shadow-inner">
              <div className="p-4 pb-0">
                <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-2 flex items-center gap-2">
                  <span className="w-1.5 h-1.5 bg-green-500 rounded-full"></span> Açıklama
                </p>
              </div>
              
              {/* Burası sihirli alan: max-h-[150px] sınırı koyduk, taşarsa scroll çıkar */}
              <div className="px-6 pb-6 pt-2 max-h-[180px] overflow-y-auto scrollbar-thin scrollbar-thumb-gray-300 dark:scrollbar-thumb-gray-600">
                <p className="text-gray-600 dark:text-gray-300 whitespace-pre-wrap leading-relaxed font-medium text-sm">
                  {displayNotes}
                </p>
              </div>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="p-8 pt-0">
          <button 
            onClick={onClose}
            className="w-full py-4 bg-green-600 hover:bg-green-700 text-white font-bold rounded-2xl transition-all shadow-lg shadow-green-600/30 active:scale-95"
          >
            Anladım, Kapat
          </button>
        </div>
      </div>
    </div>
  );
}

export default TaskDetails;