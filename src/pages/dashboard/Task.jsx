import { useState, useEffect } from "react";
import { useCalendar } from "../../context/CalendarContext"; 
import EditTask from "./EditTask"; 
import TaskDetails from "./TaskDetails"; 
import toast from "react-hot-toast";
import Swal from "sweetalert2";

function Task() {
  const { 
    tasks, fetchTasks, createTask, deleteTask, toggleTaskStatus, loading,
    taskLists, activeListId, setActiveListId, fetchTaskLists, createTaskList, deleteTaskList 
  } = useCalendar();

  const [formData, setFormData] = useState({
    title: "", 
    dueDate: "",
    dueTime: "",
    notes: "",
  });

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [selectedTask, setSelectedTask] = useState(null);
  const [viewTaskDetails, setViewTaskDetails] = useState(null);

  useEffect(() => {
    fetchTaskLists();
  }, []);

  useEffect(() => {
    if (activeListId) {
      fetchTasks(activeListId);
    }
  }, [activeListId]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.title.trim()) return;
    
    setIsSubmitting(true);
    try {
      let finalNotes = formData.notes;
      if (formData.dueTime) {
        finalNotes = `🕒 Saat: ${formData.dueTime}\n${formData.notes}`;
      }

      const taskPayload = {
        title: formData.title,
        notes: finalNotes,
        ...(formData.dueDate && { due: new Date(formData.dueDate).toISOString() })
      };

      await createTask(taskPayload, activeListId); 
      toast.success("Görev başarıyla eklendi! 🎉");
      setFormData({ title: "", dueDate: "", dueTime: "", notes: "" });
      fetchTasks(activeListId);
    } catch (error) {
      console.error("Hata:", error);
      toast.error("Görev eklenirken bir hata oluştu.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDelete = async (taskObj, e) => {
    e.stopPropagation(); 
    const isDark = document.documentElement.classList.contains('dark');

    Swal.fire({
      title: 'Bu görevi silmek istediğine emin misin?',
      text: "Bu görevi silersen geri dönüşü yok!",
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Evet, Sil gitsin!',
      cancelButtonText: 'Vazgeç',
      buttonsStyling: false, 
      background: isDark ? '#1e293b' : '#ffffff',
      color: isDark ? '#f8fafc' : '#1f2937',     
      customClass: {
        popup: `rounded-[2rem] p-6 shadow-2xl ${isDark ? 'border border-slate-700 shadow-black/50' : 'border border-gray-100 shadow-gray-300/50'}`,
        title: 'text-2xl font-bold',
        htmlContainer: 'font-medium mt-2',
        confirmButton: 'bg-red-500 hover:bg-red-600 text-white font-semibold rounded-xl px-6 py-3 mx-2 transition-all transform hover:scale-105 shadow-lg shadow-red-500/30',
        cancelButton: isDark 
          ? 'bg-slate-700 hover:bg-slate-600 text-gray-200 font-semibold rounded-xl px-6 py-3 mx-2 transition-all'
          : 'bg-gray-200 hover:bg-gray-300 text-gray-800 font-semibold rounded-xl px-6 py-3 mx-2 transition-all',
      }
    }).then(async (result) => {
      if (result.isConfirmed) {
        try {
          await deleteTask(taskObj);
          toast.success('Görev başarıyla silindi! 🚀');
        } catch (error) {
          toast.error('Hata! Silinirken bir sorun çıktı.');
        }
      }
    });
  };

  const handleEditClick = (taskData, e) => {
    e.stopPropagation(); 
    setSelectedTask(taskData);
    setIsEditModalOpen(true);
  };

  const handleToggleStatus = async (task, e) => {
    e.stopPropagation(); 
    try {
      await toggleTaskStatus(task);
    } catch (error) {
      toast.error("Görev durumu güncellenirken hata oluştu.");
    }
  };

  const handleCreateNewList = async () => {
    const isDark = document.documentElement.classList.contains('dark');
    const { value: newListName } = await Swal.fire({
      title: 'Yeni Kategori',
      input: 'text',
      inputPlaceholder: 'Örn: Market, İş, Spor...',
      showCancelButton: true,
      confirmButtonText: 'Oluştur',
      cancelButtonText: 'İptal',
      buttonsStyling: false, 
      background: 'transparent',
      color: isDark ? '#f8fafc' : '#1f2937',
      customClass: {
        popup: `w-[90%] max-w-sm rounded-[2rem] p-6 shadow-2xl backdrop-blur-2xl ${isDark ? 'bg-slate-900/85 border border-white/10 shadow-black/80' : 'bg-white/95 border border-gray-200 shadow-gray-300/50'}`,
        title: 'text-2xl font-bold tracking-tight mt-2 mb-2',
        input: `w-full px-5 py-4 mt-4 rounded-2xl border outline-none focus:ring-2 focus:ring-green-500 transition-all font-medium text-center shadow-inner ${isDark ? 'bg-slate-950/50 border-white/10 text-white placeholder-gray-500' : 'bg-gray-50 border-gray-200 text-gray-800 placeholder-gray-400'}`,
        actions: 'w-full flex flex-row gap-3 mt-6',
        confirmButton: 'flex-1 bg-green-500 hover:bg-green-600 text-white font-bold rounded-full py-3.5 transition-all shadow-[0_0_20px_rgba(34,197,94,0.3)] hover:shadow-[0_0_25px_rgba(34,197,94,0.5)]',
        cancelButton: isDark ? 'bg-slate-800 hover:bg-slate-700 text-gray-300 border border-white/5' : 'bg-gray-100 hover:bg-gray-200 text-gray-700',
      }
    });

    if (newListName && newListName.trim()) {
      try {
        const newList = await createTaskList(newListName);
        setActiveListId(newList.id); 
        toast.success("Kategori oluşturuldu! 🎉");
      } catch (error) {
        toast.error("Kategori oluşturulurken hata oluştu.");
      }
    }
  };

  const handleDeleteList = async () => {
    const isDark = document.documentElement.classList.contains('dark');
    Swal.fire({
      title: 'Görev listesini silmek istediğine emin misin?',
      text: "Görev listesini silersen içindeki tüm görevler de silinir!",
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Evet, Sil!',
      cancelButtonText: 'Vazgeç',
      buttonsStyling: false, 
      background: isDark ? '#1e293b' : '#ffffff',
      color: isDark ? '#f8fafc' : '#1f2937',     
      customClass: {
        popup: `rounded-[2rem] p-6 shadow-2xl ${isDark ? 'border border-slate-700 shadow-black/50' : 'border border-gray-100 shadow-gray-300/50'}`,
        title: 'text-2xl font-bold',
        confirmButton: 'bg-red-500 hover:bg-red-600 text-white font-semibold rounded-xl px-6 py-3 mx-2 transition-all transform hover:scale-105 shadow-lg shadow-red-500/30',
        cancelButton: isDark ? 'bg-slate-700 hover:bg-slate-600 text-gray-200 font-semibold rounded-xl px-6 py-3 mx-2 transition-all' : 'bg-gray-200 hover:bg-gray-300 text-gray-800 font-semibold rounded-xl px-6 py-3 mx-2 transition-all',
      }
    }).then(async (result) => {
      if (result.isConfirmed) {
        try {
          await deleteTaskList(activeListId);
          toast.success('Liste başarıyla silindi! 🚀');
        } catch (error) {
          toast.error('Hata! Silinirken bir sorun çıktı.');
        }
      }
    });
  };

  const sortedTasks = tasks ? [...tasks].sort((a, b) => {
    const aComp = a.status === "completed";
    const bComp = b.status === "completed";
    if (aComp && !bComp) return 1;
    if (!aComp && bComp) return -1;
    return 0;
  }) : [];

  return (
    <div className="max-w-8xl mx-auto w-full animate-fade-in relative">
      <div className="mb-4 lg:ml-4 md:ml-12 ml-10">
        <h1 className="text-3xl font-bold text-gray-800 dark:text-white mb-2">Görev Yönetimi ✅</h1>
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-12 gap-8 items-start">
        <div className="xl:col-span-6">
          <div className="bg-white/40 dark:bg-slate-800/50 backdrop-blur-xl border border-white/40 dark:border-slate-700/50 shadow-2xl rounded-3xl p-6 lg:p-5 h-fit">
            <h2 className="text-xl font-semibold mb-6 text-gray-800 dark:text-gray-100 border-b border-gray-200 dark:border-slate-700 pb-3">Yeni Görev Oluştur</h2>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Görev Başlığı <span className="text-red-500">*</span></label>
                <input type="text" name="title" required value={formData.title} onChange={handleChange} placeholder="Örn: Raporu hazırla..." className="w-full px-4 py-3 rounded-xl bg-white/60 dark:bg-slate-900/50 border border-gray-200 dark:border-slate-600 focus:outline-none focus:ring-2 focus:ring-green-500 dark:text-white transition-all shadow-sm" />
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Hedef Tarih</label>
                  <input type="date" name="dueDate" value={formData.dueDate} onChange={handleChange} className="w-full px-4 py-3 rounded-xl bg-white/60 dark:bg-slate-900/50 border border-gray-200 dark:border-slate-600 focus:outline-none focus:ring-2 focus:ring-green-500 dark:text-white transition-all shadow-sm" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Saat</label>
                  <input type="time" name="dueTime" value={formData.dueTime} onChange={handleChange} className="w-full px-4 py-3 rounded-xl bg-white/60 dark:bg-slate-900/50 border border-gray-200 dark:border-slate-600 focus:outline-none focus:ring-2 focus:ring-green-500 dark:text-white transition-all shadow-sm" />
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Açıklama</label>
                <textarea name="notes" rows="3" value={formData.notes} onChange={handleChange} placeholder="Notlar..." className="w-full px-4 py-3 rounded-xl bg-white/60 dark:bg-slate-900/50 border border-gray-200 dark:border-slate-600 focus:outline-none focus:ring-2 focus:ring-green-500 dark:text-white transition-all shadow-sm resize-none"></textarea>
              </div>
              <button type="submit" disabled={isSubmitting} className={`w-full py-4 rounded-xl font-semibold text-white shadow-lg transition-all duration-300 transform ${isSubmitting ? "bg-green-400 cursor-not-allowed" : "bg-linear-to-r from-emerald-500 to-green-600 hover:from-emerald-600 hover:to-green-700 hover:-translate-y-1 hover:shadow-green-500/30"}`}>
                {isSubmitting ? "Ekleniyor..." : "Görevi Listeye Ekle"}
              </button>
            </form>
          </div>
        </div>

        <div className="xl:col-span-6">
          <div className="bg-white/30 dark:bg-slate-800/40 backdrop-blur-xl border border-white/30 dark:border-slate-700/50 shadow-xl rounded-3xl p-6 h-fit">
            <h2 className="text-xl font-semibold mb-4 border-b border-gray-200 dark:border-slate-700 dark:text-gray-100 pb-3 flex items-center gap-2">📝 Görev Listem</h2>
            
            <div className="flex gap-2 overflow-x-auto scrollbar-hide pb-3 mb-2 items-center">
              <button onClick={() => setActiveListId("all")} className={`px-4 py-2 rounded-full font-bold text-sm transition-all whitespace-nowrap shadow-sm border ${activeListId === "all" ? "bg-green-600 text-white border-green-600" : "bg-white/70 dark:bg-slate-800/70 text-gray-700 dark:text-gray-300 border-gray-200 dark:border-slate-600 hover:bg-white dark:hover:bg-slate-700"}`}>Hepsi</button>
              {taskLists.map((list) => (
                <button key={list.id} onClick={() => setActiveListId(list.id)} className={`px-4 py-2 rounded-full font-medium text-sm transition-all whitespace-nowrap shadow-sm border ${activeListId === list.id ? "bg-green-600 text-white border-green-600" : "bg-white/70 dark:bg-slate-800/70 text-gray-700 dark:text-gray-300 border-gray-200 dark:border-slate-600 hover:bg-white dark:hover:bg-slate-700"}`}>{list.title}</button>
              ))}
              <button onClick={handleCreateNewList} className="px-3 py-2 rounded-full font-medium text-sm bg-gray-100/50 dark:bg-slate-800/50 text-gray-600 dark:text-gray-400 border border-dashed border-gray-300 dark:border-gray-600 hover:bg-gray-200 dark:hover:bg-slate-700 transition-all whitespace-nowrap flex items-center gap-1"><span>+</span> Yeni</button>
              {activeListId !== "all" && activeListId !== '@default' && (
                <button onClick={handleDeleteList} className="px-3 py-2 rounded-full font-medium text-sm bg-red-50 dark:bg-red-900/20 text-red-500 dark:text-red-400 border border-dashed border-red-200 dark:border-red-800 hover:bg-red-100 dark:hover:bg-red-900/40 transition-all whitespace-nowrap ml-auto">🗑️ Sil</button>
              )}
            </div>

            <div className="max-h-112.5 overflow-y-auto pr-2 space-y-3 scrollbar-thin scrollbar-thumb-gray-300 dark:scrollbar-thumb-gray-600">
              {loading ? (
                <div className="flex justify-center py-10"><div className="animate-spin rounded-full h-8 w-8 border-b-2 border-green-600"></div></div>
              ) : sortedTasks.length > 0 ? (
                sortedTasks.map((task) => {
                  const isCompleted = task.status === "completed";
                  let displayTime = "";
                  let displayNotes = task.notes || "";
                  if (displayNotes.startsWith("🕒 Saat: ")) {
                    const splitNotes = displayNotes.split("\n");
                    displayTime = splitNotes[0].replace("🕒 Saat: ", "");
                    displayNotes = splitNotes.slice(1).join("\n"); 
                  }
                  const dueDateStr = task.due ? new Date(task.due).toLocaleDateString('tr-TR', { month: 'short', day: 'numeric' }) : "";

                  return (
                    <div 
                      key={task.id} 
                      onClick={() => setViewTaskDetails(task)}
                      className={`p-4 rounded-2xl border transition-all group flex items-start gap-4 cursor-pointer ${isCompleted ? "bg-gray-100/50 dark:bg-slate-800/40 border-gray-300/50 dark:border-slate-700/50 opacity-60 grayscale" : "bg-white/50 dark:bg-slate-700/50 border-white/40 dark:border-slate-600 hover:shadow-md"}`}
                    >
                      <button onClick={(e) => handleToggleStatus(task, e)} className={`mt-1 shrink-0 w-6 h-6 rounded-full border-2 flex items-center justify-center transition-colors ${isCompleted ? "bg-green-500 border-green-500 text-white" : "border-gray-400 dark:border-gray-500 hover:border-green-500"}`}>
                        {isCompleted && <span className="text-xs">✓</span>}
                      </button>
                      
                      {/* flex-1 min-w-0 eklendi, böylece butonları sağa itmez */}
                      <div className="flex-1 min-w-0">
                        <h3 className={`font-semibold text-lg break-words whitespace-pre-wrap ${isCompleted ? "text-gray-500 dark:text-gray-400 line-through" : "text-gray-800 dark:text-white"}`}>
                          {task.title || "İsimsiz Görev"}
                        </h3>
                        {(dueDateStr || displayTime) && <p className={`text-xs font-medium mt-1 flex items-center gap-1 ${isCompleted ? "text-gray-400" : "text-green-600 dark:text-green-400"}`}>📅 {dueDateStr} {displayTime && ` ⏰ ${displayTime}`}</p>}
                        {displayNotes && <p className={`text-sm mt-1 line-clamp-2 break-words whitespace-pre-wrap ${isCompleted ? "text-gray-400 dark:text-gray-500 line-through" : "text-gray-600 dark:text-gray-300"}`}>{displayNotes}</p>}
                      </div>

                      {/* flex-shrink-0 ve mobilde her zaman görünür (opacity-100) ayarı */}
                      <div className="flex-shrink-0 flex gap-1 opacity-100 xl:opacity-0 xl:group-hover:opacity-100 transition-opacity ml-2">
                        <button onClick={(e) => handleEditClick(task, e)} className="p-2 text-blue-500 hover:bg-blue-100 dark:hover:bg-blue-900/30 rounded-lg transition">✏️</button>
                        <button onClick={(e) => handleDelete(task, e)} className="p-2 text-red-500 hover:bg-red-100 dark:hover:bg-red-900/30 rounded-lg transition">🗑️</button>
                      </div>
                    </div>
                  );
                })
              ) : (
                <div className="flex flex-col items-center justify-center py-10 text-center opacity-70"><span className="text-4xl mb-3">🍃</span><p className="text-gray-600 dark:text-gray-300 font-medium">Bu listede görev bulunamadı.</p></div>
              )}
            </div>
          </div>
        </div>
      </div>

      {isEditModalOpen && selectedTask && (
        <EditTask task={selectedTask} onClose={() => { setIsEditModalOpen(false); setSelectedTask(null); }} />
      )}
      
      {viewTaskDetails && (
        <TaskDetails task={viewTaskDetails} onClose={() => setViewTaskDetails(null)} />
      )}
    </div>
  );
}

export default Task;