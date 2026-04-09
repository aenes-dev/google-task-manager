import React, { useEffect } from 'react';

function EventDetailsModal({ event, onClose }) {
  // Modal açıkken arkadaki sayfanın kaymasını engelle
  useEffect(() => {
    const originalStyle = window.getComputedStyle(document.body).overflow;
    document.body.style.overflow = 'hidden';
    return () => {
      document.body.style.overflow = originalStyle;
    };
  }, []);

  if (!event) return null;

  // Formatlama Fonksiyonları
  const formatDate = (dateObj) => {
    const d = new Date(dateObj?.dateTime || dateObj?.date);
    return d.toLocaleDateString('tr-TR', { day: 'numeric', month: 'short', year: 'numeric' });
  };

  const formatTime = (dateObj) => {
    if (!dateObj?.dateTime) return "Tüm Gün";
    return new Date(dateObj.dateTime).toLocaleTimeString('tr-TR', { hour: '2-digit', minute: '2-digit' });
  };

  const meetLink = event.hangoutLink || null;
  const attendees = event.attendees || [];
  const location = event.location || null;
  const description = event.description || null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-md animate-fade-in">
      <div className="bg-white/95 dark:bg-slate-900/95 backdrop-blur-2xl w-full max-w-lg rounded-[2.5rem] shadow-2xl border border-white/20 dark:border-slate-700/50 overflow-hidden transform animate-scale-in max-h-[90vh] flex flex-col">
        
        {/* Header */}
        <div className="relative p-8 pb-4 shrink-0">
          <button onClick={onClose} className="absolute top-6 right-6 p-2 rounded-full bg-gray-100 dark:bg-slate-800 text-gray-500 hover:text-gray-800 dark:hover:text-white transition-all active:scale-90">✕</button>
          <div className="flex items-center gap-3 mb-2">
            <span className="bg-blue-100 dark:bg-blue-900/50 text-blue-600 dark:text-blue-400 px-3 py-1 rounded-full text-[10px] font-black tracking-wider uppercase">Etkinlik Detayı</span>
            <span className="bg-slate-100 dark:bg-slate-800 text-slate-500 dark:text-slate-400 px-3 py-1 rounded-full text-[10px] font-black uppercase">Google Calendar</span>
          </div>
          <h2 className="text-2xl font-black text-gray-800 dark:text-white leading-tight break-words">{event.summary || "Başlıksız Etkinlik"}</h2>
        </div>

        {/* Scrollable Body - Burası kayar */}
        <div className="p-8 pt-2 space-y-6 overflow-y-auto scrollbar-thin scrollbar-thumb-gray-200 dark:scrollbar-thumb-slate-800">
          
          {/* TARİH VE SAAT */}
          <div className="grid grid-cols-2 gap-4">
            <div className="bg-blue-50/50 dark:bg-blue-900/20 p-4 rounded-3xl border border-blue-100/50 dark:border-blue-800/30">
              <p className="text-[10px] font-black text-blue-500 dark:text-blue-400 uppercase tracking-widest mb-1">Başlangıç</p>
              <span className="text-xs font-bold text-gray-500 dark:text-gray-400">{formatDate(event.start)}</span>
              <p className="text-lg font-black text-blue-600 dark:text-blue-400 leading-none mt-1">{formatTime(event.start)}</p>
            </div>
            <div className="bg-slate-50 dark:bg-slate-800/40 p-4 rounded-3xl border border-gray-100 dark:border-slate-700">
              <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-1">Bitiş</p>
              <span className="text-xs font-bold text-gray-500 dark:text-gray-400">{formatDate(event.end)}</span>
              <p className="text-lg font-black text-gray-600 dark:text-gray-400 leading-none mt-1">{formatTime(event.end)}</p>
            </div>
          </div>

          {/* KATILIMCILAR */}
          {attendees.length > 0 && (
            <div className="space-y-3">
              <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-2 flex items-center gap-2">
                <span className="w-1.5 h-1.5 bg-blue-500 rounded-full animate-pulse"></span>
                Katılımcılar ({attendees.length})
              </p>
              <div className="flex flex-wrap gap-2">
                {attendees.map((person, idx) => (
                  <div key={idx} className="flex items-center gap-2 bg-white dark:bg-slate-800/80 border border-gray-100 dark:border-slate-700 px-3 py-2 rounded-2xl shadow-sm">
                    <div className="w-7 h-7 rounded-full bg-blue-100 dark:bg-blue-900/50 flex items-center justify-center text-[10px] font-bold text-blue-600 dark:text-blue-400 uppercase">
                      {person.email.charAt(0)}
                    </div>
                    <span className="text-xs font-bold text-gray-700 dark:text-gray-300 truncate max-w-[140px]">{person.email}</span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* KONUM */}
          {location && (
            <div className="flex items-center gap-4 bg-gray-50 dark:bg-slate-800/50 p-5 rounded-3xl border border-gray-100 dark:border-slate-700">
              <span className="text-2xl">📍</span>
              <div className="min-w-0">
                <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest leading-none mb-1">Konum</p>
                <p className="text-sm font-bold text-gray-700 dark:text-gray-200 truncate">{location}</p>
              </div>
            </div>
          )}

          {/* AÇIKLAMA (DÜZELTİLDİ: max-h ve overflow-y-auto eklendi) */}
          {description && (
            <div className="bg-gray-50 dark:bg-slate-800/50 rounded-[2rem] border border-gray-100 dark:border-slate-700 p-6 shadow-inner">
              <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-3">📝 Notlar</p>
              
              {/* Burası sihirli alan: max-h-[120px] sınırı koyduk, taşarsa scroll çıkar */}
              <div className="max-h-[120px] overflow-y-auto scrollbar-thin scrollbar-thumb-gray-200 dark:scrollbar-thumb-slate-700 pr-1">
                <p className="text-sm text-gray-600 dark:text-gray-300 leading-relaxed font-medium whitespace-pre-wrap">
                  {description}
                </p>
              </div>
            </div>
          )}
        </div>

        {/* Footer - Sabit burası */}
        <div className="p-8 pt-4 shrink-0 bg-white dark:bg-slate-900 border-t border-gray-100 dark:border-slate-800 flex flex-col gap-3">
          
          {/* MEET BUTONU SABİT VE BURADA */}
          {meetLink && (
            <a href={meetLink} target="_blank" rel="noopener noreferrer" className="flex items-center justify-center gap-3 w-full py-4 bg-gradient-to-r from-blue-600 to-blue-500 hover:from-blue-700 hover:to-blue-600 text-white rounded-2xl font-bold shadow-lg shadow-blue-600/30 transition-all transform active:scale-95 border border-white/10">
              <span className="text-xl">📹</span> Google Meet'e Katıl
            </a>
          )}

          <button onClick={onClose} className="w-full py-4 bg-gray-100 hover:bg-gray-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-gray-600 dark:text-gray-300 font-bold rounded-2xl transition-all active:scale-95 shadow-inner">
            Kapat
          </button>
        </div>
      </div>
    </div>
  );
}

export default EventDetailsModal;