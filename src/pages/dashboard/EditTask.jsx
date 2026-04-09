import { useState, useEffect } from "react";
import { useCalendar } from "../../context/CalendarContext";
import toast from "react-hot-toast";


function EditTask({ task, onClose }) {
  const { updateTask } = useCalendar();
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  const [formData, setFormData] = useState({
    title: "", 
    dueDate: "",
    dueTime: "",
    notes: "",
  });

  useEffect(() => {
    if (task) {
      let initialTime = "";
      let initialNotes = task.notes || "";
      if (initialNotes.startsWith("🕒 Saat: ")) {
        const splitNotes = initialNotes.split("\n");
        initialTime = splitNotes[0].replace("🕒 Saat: ", "");
        initialNotes = splitNotes.slice(1).join("\n"); 
      }

      let initialDate = "";
      if (task.due) {
        initialDate = task.due.split("T")[0]; 
      }

      setFormData({
        title: task.title || "",
        dueDate: initialDate,
        dueTime: initialTime,
        notes: initialNotes,
      });
    }
  }, [task]);

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

      const updatedPayload = {
        ...task, 
        title: formData.title,
        notes: finalNotes,
        ...(formData.dueDate ? { due: new Date(formData.dueDate).toISOString() } : { due: null })
      };

      await updateTask(updatedPayload);
      toast.success("Görev başarıyla güncellendi! 🎉");
      onClose(); 
    } catch (error) {
      console.error("Güncelleme hatası:", error);
      toast.error("Güncellenirken bir hata oluştu.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/60 backdrop-blur-sm animate-fade-in">
      
      <div className="bg-white/95 dark:bg-slate-800/95 border border-white/20 dark:border-slate-700 rounded-3xl p-5 sm:p-6 lg:p-8 w-full max-w-lg shadow-2xl relative">
        
        <button onClick={onClose} className="absolute top-4 right-4 w-8 h-8 flex items-center justify-center rounded-full bg-gray-100 dark:bg-slate-700 text-gray-500 hover:text-gray-800 dark:text-gray-300 dark:hover:text-white transition-colors">
          ✕
        </button>

        <h2 className="text-xl sm:text-2xl font-bold mb-5 sm:mb-6 text-gray-800 dark:text-gray-100 border-b border-gray-200 dark:border-slate-700 pb-3 pr-8">
          Görevi Düzenle ✏️
        </h2>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Görev Başlığı <span className="text-red-500">*</span>
            </label>
            <input 
              type="text" name="title" required value={formData.title} onChange={handleChange} 
              className="w-full px-4 py-3 rounded-xl bg-white dark:bg-slate-900 border border-gray-200 dark:border-slate-600 focus:outline-none focus:ring-2 focus:ring-green-500 dark:text-white shadow-sm" 
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Hedef Tarih</label>
              <input type="date" name="dueDate" value={formData.dueDate} onChange={handleChange} className="w-full px-4 py-3 rounded-xl bg-white dark:bg-slate-900 border border-gray-200 dark:border-slate-600 focus:outline-none focus:ring-2 focus:ring-green-500 dark:text-white shadow-sm" />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Saat</label>
              <input type="time" name="dueTime" value={formData.dueTime} onChange={handleChange} className="w-full px-4 py-3 rounded-xl bg-white dark:bg-slate-900 border border-gray-200 dark:border-slate-600 focus:outline-none focus:ring-2 focus:ring-green-500 dark:text-white shadow-sm" />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Açıklama / Detaylar
            </label>
            <textarea 
              name="notes" rows="4" value={formData.notes} onChange={handleChange} 
              className="w-full px-4 py-3 rounded-xl bg-white dark:bg-slate-900 border border-gray-200 dark:border-slate-600 focus:outline-none focus:ring-2 focus:ring-green-500 dark:text-white shadow-sm resize-none"
            ></textarea>
          </div>

          <div className="pt-2 flex gap-3">
            <button type="button" onClick={onClose} className="flex-1 py-3.5 rounded-xl font-medium text-gray-700 dark:text-gray-300 bg-gray-200 hover:bg-gray-300 dark:bg-slate-700 dark:hover:bg-slate-600 transition-all">
              İptal
            </button>
            <button type="submit" disabled={isSubmitting} className="flex-1 py-3.5 rounded-xl font-semibold text-white bg-green-600 hover:bg-green-700 transition-all">
              {isSubmitting ? "Kaydediliyor..." : "Kaydet"}
            </button>
          </div>
        </form>

      </div>
    </div>
  );
}

export default EditTask;