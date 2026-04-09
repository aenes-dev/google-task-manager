import { useEffect, useState } from 'react';
import { useCalendar } from '../../context/CalendarContext';
import { Link } from 'react-router-dom';
import EventDetailsModal from './EventDetailsModal'; 
import toast from 'react-hot-toast';
import TaskDetails from './TaskDetails';


function Dashboard() {
  const { 
    events, 
    fetchEvents, 
    tasks, 
    fetchTasks, 
    toggleTaskStatus,
    loading 
  } = useCalendar();

  const [viewEventDetails, setViewEventDetails] = useState(null);
  const [vieweTaskDetails, setViewTaskDetails] = useState(null);

  useEffect(() => {
    fetchEvents();
    if (fetchTasks) fetchTasks("all"); 
  }, []);

  const formatTime = (dateString) => {
    if (!dateString) return '';
    return new Date(dateString).toLocaleTimeString('tr-TR', { hour: '2-digit', minute: '2-digit' });
  };

  const getDay = (dateString) => {
    if (!dateString) return '';
    return new Date(dateString).getDate();
  };

  const getMonth = (dateString) => {
    if (!dateString) return '';
    return new Date(dateString).toLocaleDateString('tr-TR', { month: 'short' });
  };

  const formatEventTimeForModal = (ev) => {
    if (ev.start?.dateTime && ev.end?.dateTime) {
      const start = new Date(ev.start.dateTime).toLocaleString("tr-TR", { month: "short", day: "numeric", hour: "2-digit", minute: "2-digit" });
      const sDate = new Date(ev.start.dateTime).toDateString();
      const eDate = new Date(ev.end.dateTime).toDateString();
      const end = sDate === eDate
        ? new Date(ev.end.dateTime).toLocaleString("tr-TR", { hour: "2-digit", minute: "2-digit" })
        : new Date(ev.end.dateTime).toLocaleString("tr-TR", { month: "short", day: "numeric", hour: "2-digit", minute: "2-digit" });
      return `${start} - ${end}`;
    } else {
      const start = new Date(ev.start?.date).toLocaleDateString("tr-TR");
      const endObj = new Date(ev.end?.date);
      endObj.setDate(endObj.getDate() - 1);
      const end = endObj.toLocaleDateString("tr-TR");
      return start === end ? start : `${start} - ${end}`;
    }
  };

  const handleToggleTask = async (task, e) => {
    e.stopPropagation(); 
    
    if (!toggleTaskStatus) {
      toast.error("updateTask fonksiyonu Context'te bulunamadı!");
      return;
    }

    try {
      await toggleTaskStatus(task);
      

    } catch (error) {
      console.error("Görev güncellenirken hata:", error);
      toast.error("Görev güncellenirken bir hata oluştu.");
    }
  };

  const sortedTasks = tasks ? [...tasks].sort((a, b) => {
    const aCompleted = a.status === 'completed';
    const bCompleted = b.status === 'completed';
    
    if (aCompleted && !bCompleted) return 1;  
    if (!aCompleted && bCompleted) return -1; 
    return 0; 
  }) : [];

  return (
    <div className="max-w-7xl mx-auto w-full mt-13 lg:mt-1 animate-fade-in pb-10">
      
      {/* KARŞILAMA KARTI */}
      <div className="bg-white/40 dark:bg-slate-800/50 backdrop-blur-xl border border-white/50 dark:border-slate-700/50 shadow-2xl rounded-4xl p-8 mb-8 transition-all">
        <h1 className="text-4xl font-extrabold text-transparent bg-clip-text bg-linear-to-r from-blue-600 to-green-600 dark:from-blue-400 dark:to-green-400 mb-4 tracking-tight">
          Hoş Geldin! 👋
        </h1>
        <p className="text-gray-700 dark:text-gray-300 text-lg max-w-2xl font-medium leading-relaxed">
          Burası senin kişisel kontrol merkezin. Aşağıdan yaklaşan <strong className="text-blue-600 dark:text-blue-400">Etkinliklerini</strong> takip edebilir veya gün içinde halletmen gereken <strong className="text-green-600 dark:text-green-400">Görevlerine</strong> göz atabilirsin.
        </p>
        
        <div className="mt-8 flex flex-col sm:flex-row gap-4">
          <Link 
            to="event" 
            className="px-8 py-3.5 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-full transition-all transform hover:scale-105 shadow-[0_0_20px_rgba(37,99,235,0.3)] hover:shadow-[0_0_25px_rgba(37,99,235,0.5)] text-center flex items-center justify-center gap-2"
          >
            <span className="text-xl">+</span> Yeni Etkinlik
          </Link>
          <Link 
            to="task" 
            className="px-8 py-3.5 bg-green-600 hover:bg-green-700 text-white font-bold rounded-full transition-all transform hover:scale-105 shadow-[0_0_20px_rgba(34,197,94,0.3)] hover:shadow-[0_0_25px_rgba(34,197,94,0.5)] text-center flex items-center justify-center gap-2"
          >
            <span className="text-xl">+</span> Yeni Görev
          </Link>
        </div>
      </div>

      {/* DÜZELTİLDİ: items-start eklendi, böylece kutular birbirini sündürmeyecek */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-start">
        
        {/* ETKİNLİKLER KISMI */}
        {/* DÜZELTİLDİ: h-full silindi, h-fit yapıldı */}
        <div className="bg-white/30 dark:bg-slate-800/40 backdrop-blur-xl border border-white/40 dark:border-slate-700/50 shadow-xl rounded-4xl p-6 sm:p-8 flex flex-col h-fit">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-2xl font-bold text-gray-800 dark:text-white flex items-center gap-3">
              <span className="bg-blue-100 dark:bg-blue-900/50 text-blue-600 dark:text-blue-400 p-2 rounded-xl text-xl shadow-inner">📅</span> 
              Yaklaşan Etkinlikler
            </h3>
          </div>

          {loading ? (
            <div className="flex justify-center items-center py-10 flex-1">
              <div className="animate-spin rounded-full h-10 w-10 border-b-4 border-blue-600"></div>
            </div>
          ) : events && events.length > 0 ? (
            <ul className="space-y-4 max-h-55 overflow-y-auto pr-2 scrollbar-thin scrollbar-thumb-gray-300 dark:scrollbar-thumb-gray-600">
              {events.map((event) => (
                <li 
                  key={event.id} 
                  onClick={() => setViewEventDetails(event)} 
                  className="group p-4 bg-white/50 dark:bg-slate-700/40 rounded-2xl border border-white/50 dark:border-slate-600/50 shadow-sm hover:shadow-lg hover:bg-white/80 dark:hover:bg-slate-700/80 transition-all duration-300 transform hover:-translate-y-1 cursor-pointer"
                >
                  <div className="flex items-start gap-4">
                    <div className="shrink-0 w-14 h-14 bg-blue-50 dark:bg-slate-800 rounded-xl flex flex-col items-center justify-center border border-blue-100 dark:border-slate-600 shadow-inner group-hover:bg-blue-600 group-hover:text-white transition-colors duration-300 text-blue-600 dark:text-blue-400">
                      <span className="text-xs font-bold uppercase">{getMonth(event.start?.dateTime || event.start?.date)}</span>
                      <span className="text-xl font-extrabold leading-none">{getDay(event.start?.dateTime || event.start?.date)}</span>
                    </div>
                    
                    <div className="flex-1 min-w-0 pt-1">
                      <h4 className="font-bold text-gray-800 dark:text-gray-100 text-lg truncate group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">
                        {event.summary || "(Başlıksız Etkinlik)"}
                      </h4>
                      <p className="text-sm text-gray-500 dark:text-gray-400 flex items-center gap-1.5 mt-1 font-medium">
                        🕒 {formatTime(event.start?.dateTime || event.start?.date)} - {formatTime(event.end?.dateTime || event.end?.date)}
                      </p>
                    </div>
                  </div>
                </li>
              ))}
            </ul>
          ) : (
            <div className="flex flex-col items-center justify-center py-10 text-center opacity-70 flex-1 border-2 border-dashed border-gray-300 dark:border-slate-600 rounded-3xl mt-2">
              <span className="text-4xl mb-3 grayscale opacity-50">📭</span>
              <p className="text-gray-600 dark:text-gray-300 font-bold text-lg">Yaklaşan etkinlik yok.</p>
              <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">Hemen yeni bir etkinlik planla!</p>
            </div>
          )}
        </div>

        {/* GÖREVLER KISMI */}
        {/* DÜZELTİLDİ: h-full silindi, h-fit yapıldı */}
        <div className="bg-white/30 dark:bg-slate-800/40 backdrop-blur-xl border border-white/40 dark:border-slate-700/50 shadow-xl rounded-4xl p-6 sm:p-8 flex flex-col h-fit">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-2xl font-bold text-gray-800 dark:text-white flex items-center gap-3">
              <span className="bg-green-100 dark:bg-green-900/50 text-green-600 dark:text-green-400 p-2 rounded-xl text-xl shadow-inner w-10 h-10 flex items-center justify-center font-black">✅</span> 
              Bekleyen Görevler
            </h3>
          </div>

          {loading ? (
            <div className="flex justify-center items-center py-10 flex-1">
              <div className="animate-spin rounded-full h-10 w-10 border-b-4 border-green-600"></div>
            </div>
          ) : sortedTasks && sortedTasks.length > 0 ? (
            <ul className="space-y-4 max-h-55 overflow-y-auto pr-2 scrollbar-thin scrollbar-thumb-gray-300 dark:scrollbar-thumb-gray-600">
              {sortedTasks.map((task) => {
                const isCompleted = task.status === 'completed'; 

                return (
                  <li 
                    key={task.id} 
                    onClick={() => setViewTaskDetails(task)} 
                    className={`group p-4 rounded-2xl border transition-all duration-300 transform flex items-center gap-4 ${
                      isCompleted 
                        ? "bg-gray-100/50 dark:bg-slate-800/30 border-gray-200 dark:border-slate-700 opacity-60 grayscale hover:opacity-100 cursor-default" 
                        : "bg-white/50 dark:bg-slate-700/40 border-white/50 dark:border-slate-600/50 shadow-sm hover:shadow-lg hover:bg-white/80 dark:hover:bg-slate-700/80 hover:-translate-y-1 cursor-default"
                    }`}
                  >
                    <div 
                      onClick={(e) => handleToggleTask(task, e)}
                      className={`shrink-0 w-6 h-6 rounded-full border-2 transition-all flex items-center justify-center cursor-pointer shadow-sm ${
                        isCompleted 
                          ? "bg-green-500 border-green-500 text-white" 
                          : "border-gray-400 dark:border-gray-500 hover:border-green-500 hover:bg-green-100 dark:hover:bg-green-900/50 text-transparent hover:text-green-600 dark:hover:text-green-400"
                      }`}
                    >
                      <span className={`text-sm ${isCompleted ? 'opacity-100 text-white' : 'opacity-0 hover:opacity-100 transition-opacity'}`}>✔</span>
                    </div>
                    
                    <div className="flex-1 min-w-0">
                      <h4 className={`font-bold text-lg truncate transition-colors ${
                        isCompleted 
                          ? "text-gray-500 dark:text-gray-400 line-through" 
                          : "text-gray-800 dark:text-gray-100"
                      }`}>
                        {task.title}
                      </h4>
                      {task.due && (
                        <p className={`text-sm font-medium mt-0.5 ${
                          isCompleted 
                            ? "text-gray-400 dark:text-gray-500 line-through" 
                            : "text-green-600/80 dark:text-green-400/80"
                        }`}>
                          📅 Son Tarih: {new Date(task.due).toLocaleDateString('tr-TR', { month: 'short', day: 'numeric' })}
                        </p>
                      )}
                    </div>
                  </li>
                );
              })}
            </ul>
          ) : (
            <div className="flex flex-col items-center justify-center py-10 text-center opacity-70 flex-1 border-2 border-dashed border-gray-300 dark:border-slate-600 rounded-3xl mt-2">
              <span className="text-4xl mb-3 grayscale opacity-50">📝</span>
              <p className="text-gray-600 dark:text-gray-300 font-bold text-lg">Tüm görevler tamamlandı!</p>
              <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">Veya henüz bir görev eklemedin.</p>
            </div>
          )}
        </div>

      </div>

      {viewEventDetails && (
        <EventDetailsModal 
          event={viewEventDetails} 
          onClose={() => setViewEventDetails(null)} 
          formatTime={formatEventTimeForModal} 
        />
      )}

       {vieweTaskDetails && (
        <TaskDetails 
          task={vieweTaskDetails} 
          onClose={() => setViewTaskDetails(null)} 
        />
      )}
    </div>
  );
}

export default Dashboard;