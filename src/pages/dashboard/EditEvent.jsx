import { useState, useEffect } from "react";
import { useCalendar } from "../../context/CalendarContext";
import toast from "react-hot-toast";


function EditEvent({ event, onClose }) {
  const { updateEvent } = useCalendar();
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  const [formData, setFormData] = useState({
    title: "", description: "", startDate: "", startTime: "", endDate: "", endTime: "", attendees: "", reminder: "default",
  });

  const [isMeetEnabled, setIsMeetEnabled] = useState(false);

  useEffect(() => {
    if (event) {
      const startStr = event.start.dateTime || `${event.start.date}T00:00:00`;
      const endStr = event.end.dateTime || `${event.end.date}T00:00:00`;

      const sDate = new Date(startStr);
      const eDate = new Date(endStr);

      const formatDate = (date) => {
        const year = date.getFullYear();
        const month = String(date.getMonth() + 1).padStart(2, '0');
        const day = String(date.getDate()).padStart(2, '0');
        return `${year}-${month}-${day}`;
      };

      const formatTime = (date) => {
        const hours = String(date.getHours()).padStart(2, '0');
        const minutes = String(date.getMinutes()).padStart(2, '0');
        return `${hours}:${minutes}`;
      };

      const attendeesStr = event.attendees ? event.attendees.map(a => a.email).join(", ") : "";

      let currentReminder = "default";
      if (event.reminders && event.reminders.useDefault === false && event.reminders.overrides) {
        const override = event.reminders.overrides[0];
        if (override) {
          if (override.method === "popup" && override.minutes === 10) currentReminder = "popup_10";
          else if (override.method === "popup" && override.minutes === 60) currentReminder = "popup_60";
          else if (override.method === "email" && override.minutes === 1440) currentReminder = "email_1440";
        }
      }

      setFormData({
        title: event.summary || "",
        description: event.description || "",
        startDate: formatDate(sDate),
        startTime: formatTime(sDate),
        endDate: formatDate(eDate),
        endTime: formatTime(eDate),
        attendees: attendeesStr,
        reminder: currentReminder, 
      });

      if (event.hangoutLink || event.conferenceData) {
        setIsMeetEnabled(true);
      } else {
        setIsMeetEnabled(false);
      }
    }
  }, [event]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      const startDateTime = new Date(`${formData.startDate}T${formData.startTime}:00`).toISOString();
      const endDateTime = new Date(`${formData.endDate}T${formData.endTime}:00`).toISOString();

      const attendeesArray = formData.attendees
        ? formData.attendees.split(",").map(email => ({ email: email.trim() })).filter(a => a.email)
        : [];

      let remindersConfig = { useDefault: true };
      if (formData.reminder === "popup_10") {
        remindersConfig = { useDefault: false, overrides: [{ method: "popup", minutes: 10 }] };
      } else if (formData.reminder === "popup_60") {
        remindersConfig = { useDefault: false, overrides: [{ method: "popup", minutes: 60 }] };
      } else if (formData.reminder === "email_1440") {
        remindersConfig = { useDefault: false, overrides: [{ method: "email", minutes: 1440 }] };
      }

      const updatedPayload = {
        summary: formData.title,
        description: formData.description,
        start: { dateTime: startDateTime, timeZone: Intl.DateTimeFormat().resolvedOptions().timeZone },
        end: { dateTime: endDateTime, timeZone: Intl.DateTimeFormat().resolvedOptions().timeZone },
        ...(attendeesArray.length > 0 && { attendees: attendeesArray }), 
        reminders: remindersConfig, 
      };

      if (isMeetEnabled && !event.hangoutLink) {
        updatedPayload.conferenceData = {
          createRequest: {
            requestId: `meet-edit-${Date.now()}`,
            conferenceSolutionKey: { type: "hangoutsMeet" }
          }
        };
      } else if (!isMeetEnabled && event.hangoutLink) {
        updatedPayload.conferenceData = null;
      }

      await updateEvent(event.id, updatedPayload);
      toast.success("Etkinlik başarıyla güncellendi! 🎉");
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
      
      <div className="bg-white/95 dark:bg-slate-800/95 border border-white/20 dark:border-slate-700 rounded-3xl p-5 sm:p-6 lg:p-8 w-full max-w-2xl max-h-[90vh] overflow-y-auto scrollbar-thin scrollbar-thumb-gray-300 dark:scrollbar-thumb-gray-600 shadow-2xl relative">
        
        <button onClick={onClose} className="absolute top-4 right-4 w-8 h-8 flex items-center justify-center rounded-full bg-gray-100 dark:bg-slate-700 text-gray-500 hover:text-gray-800 dark:text-gray-300 dark:hover:text-white transition-colors">
          ✕
        </button>

        <h2 className="text-xl sm:text-2xl font-bold mb-5 sm:mb-6 text-gray-800 dark:text-gray-100 border-b border-gray-200 dark:border-slate-700 pb-3 pr-8">
          Etkinliği Düzenle ✏️
        </h2>

        <form onSubmit={handleSubmit} className="space-y-4 lg:space-y-3 md:space-y-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1 sm:mb-2">Etkinlik Başlığı <span className="text-red-500">*</span></label>
            <input type="text" name="title" required value={formData.title} onChange={handleChange} className="w-full px-4 py-2.5 sm:py-3 rounded-xl bg-white dark:bg-slate-900 border border-gray-200 dark:border-slate-600 focus:outline-none focus:ring-2 focus:ring-blue-500 dark:text-white shadow-sm" />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1 sm:mb-2">Başlangıç Tarihi <span className="text-red-500">*</span></label>
              <input type="date" name="startDate" required value={formData.startDate} onChange={handleChange} className="w-full px-4 py-2.5 sm:py-3 rounded-xl bg-white dark:bg-slate-900 border border-gray-200 dark:border-slate-600 focus:outline-none focus:ring-2 focus:ring-blue-500 dark:text-white shadow-sm" />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1 sm:mb-2">Başlangıç Saati <span className="text-red-500">*</span></label>
              <input type="time" name="startTime" required value={formData.startTime} onChange={handleChange} className="w-full px-4 py-2.5 sm:py-3 rounded-xl bg-white dark:bg-slate-900 border border-gray-200 dark:border-slate-600 focus:outline-none focus:ring-2 focus:ring-blue-500 dark:text-white shadow-sm" />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1 sm:mb-2">Bitiş Tarihi <span className="text-red-500">*</span></label>
              <input type="date" name="endDate" required value={formData.endDate} onChange={handleChange} className="w-full px-4 py-2.5 sm:py-3 rounded-xl bg-white dark:bg-slate-900 border border-gray-200 dark:border-slate-600 focus:outline-none focus:ring-2 focus:ring-blue-500 dark:text-white shadow-sm" />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1 sm:mb-2">Bitiş Saati <span className="text-red-500">*</span></label>
              <input type="time" name="endTime" required value={formData.endTime} onChange={handleChange} className="w-full px-4 py-2.5 sm:py-3 rounded-xl bg-white dark:bg-slate-900 border border-gray-200 dark:border-slate-600 focus:outline-none focus:ring-2 focus:ring-blue-500 dark:text-white shadow-sm" />
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 items-start">
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1 sm:mb-2">Davetliler (E-posta girin)</label>
              <input type="text" name="attendees" value={formData.attendees} onChange={handleChange} placeholder="ornek@mail.com, ..." className="w-full px-4 py-2.5 sm:py-3 rounded-xl bg-white dark:bg-slate-900 border border-gray-200 dark:border-slate-600 focus:outline-none focus:ring-2 focus:ring-blue-500 dark:text-white shadow-sm" />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1 sm:mb-2">Açıklama</label>
              <textarea name="description" rows="1" value={formData.description} onChange={handleChange} className="w-full px-4 py-2.5 sm:py-3 rounded-xl bg-white dark:bg-slate-900 border border-gray-200 dark:border-slate-600 focus:outline-none focus:ring-2 focus:ring-blue-500 dark:text-white shadow-sm resize-none"></textarea>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 items-end">
            
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Hatırlatıcı Ayarları
              </label>
              <select 
                name="reminder" 
                value={formData.reminder} 
                onChange={handleChange} 
                className="w-full h-13 px-3 lg:px-4 text-sm lg:text-base rounded-xl bg-white dark:bg-slate-900 border border-gray-200 dark:border-slate-600 focus:outline-none focus:ring-2 focus:ring-blue-500 dark:text-white transition-all shadow-sm cursor-pointer"
              >
                <option value="default" className="text-gray-900 dark:text-white dark:bg-slate-800">Varsayılan (30dk önce)</option>
                <option value="popup_10" className="text-gray-900 dark:text-white dark:bg-slate-800">10 dk önce (Bildirim)</option>
                <option value="popup_60" className="text-gray-900 dark:text-white dark:bg-slate-800">1 saat önce (Bildirim)</option>
                <option value="email_1440" className="text-gray-900 dark:text-white dark:bg-slate-800">1 gün önce (E-posta)</option>
              </select>
            </div>

            <div className="flex items-center justify-between p-3 sm:p-4 rounded-xl bg-gray-50 dark:bg-slate-900/50 border border-gray-200 dark:border-slate-700 shadow-sm h-13">
              <div>
                <p className="font-medium text-gray-800 dark:text-gray-200 flex items-center gap-2 text-sm sm:text-base">
                  <span className="text-lg">📹</span> Google Meet Linki Oluştur
                </p>
              </div>
              
              <button
                type="button"
                onClick={() => setIsMeetEnabled(!isMeetEnabled)}
                className={`relative inline-flex h-6 w-11 sm:h-7 sm:w-12 items-center rounded-full transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 dark:focus:ring-offset-slate-800 ${
                  isMeetEnabled ? 'bg-blue-600' : 'bg-gray-300 dark:bg-slate-600'
                }`}
              >
                <span
                  className={`inline-block h-4 w-4 sm:h-5 sm:w-5 transform rounded-full bg-white shadow-md transition-transform ${
                    isMeetEnabled ? 'translate-x-6' : 'translate-x-1'
                  }`}
                />
              </button>
            </div>
            
          </div>

          <div className="pt-2 flex gap-3">
            <button type="button" onClick={onClose} className="flex-1 py-3 rounded-xl font-medium text-gray-700 dark:text-gray-300 bg-gray-200 hover:bg-gray-300 dark:bg-slate-700 dark:hover:bg-slate-600 transition-all">
              İptal
            </button>
            <button type="submit" disabled={isSubmitting} className="flex-1 py-3 rounded-xl font-semibold text-white bg-blue-600 hover:bg-blue-700 transition-all">
              {isSubmitting ? "Kaydediliyor..." : "Kaydet"}
            </button>
          </div>
        </form>

      </div>
    </div>
  );
}

export default EditEvent;