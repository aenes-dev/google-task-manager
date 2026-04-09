import { useState, useEffect } from "react";
import { useCalendar } from "../../context/CalendarContext";
import EditEvent from "./EditEvent";
import EventDetailsModal from "./EventDetailsModal";
import { useOutletContext } from "react-router-dom";
import Swal from "sweetalert2";
import toast from "react-hot-toast";

function Event() {
  const { events, fetchEvents, createEvent, deleteEvent, loading } = useCalendar();
  const open = useOutletContext();

  const [formData, setFormData] = useState({
    title: "",
    description: "",
    startDate: "",
    startTime: "",
    endDate: "",
    endTime: "",
    attendees: "",
    reminder: "default",
  });

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [selectedEvent, setSelectedEvent] = useState(null);
  const [viewEventDetails, setViewEventDetails] = useState(null);
  const [isMeetEnabled, setIsMeetEnabled] = useState(false);
  const [viewAttendees, setViewAttendees] = useState(null);

  useEffect(() => {
    fetchEvents();
  }, []);

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
        ? formData.attendees.split(",").map((email) => ({ email: email.trim() })).filter((a) => a.email)
        : [];

      let remindersConfig = { useDefault: true };
      if (formData.reminder === "popup_10") {
        remindersConfig = { useDefault: false, overrides: [{ method: "popup", minutes: 10 }] };
      } else if (formData.reminder === "popup_60") {
        remindersConfig = { useDefault: false, overrides: [{ method: "popup", minutes: 60 }] };
      } else if (formData.reminder === "email_1440") {
        remindersConfig = { useDefault: false, overrides: [{ method: "email", minutes: 1440 }] };
      }

      const eventPayload = {
        summary: formData.title,
        description: formData.description,
        start: { dateTime: startDateTime, timeZone: Intl.DateTimeFormat().resolvedOptions().timeZone },
        end: { dateTime: endDateTime, timeZone: Intl.DateTimeFormat().resolvedOptions().timeZone },
        ...(attendeesArray.length > 0 && { attendees: attendeesArray }),
        reminders: remindersConfig,
      };

      if (isMeetEnabled) {
        eventPayload.conferenceData = {
          createRequest: {
            requestId: `meet-${Date.now()}`,
            conferenceSolutionKey: { type: "hangoutsMeet" },
          },
        };
      }

      await createEvent(eventPayload);
      toast.success("Etkinlik başarıyla eklendi! 🎉");
      setFormData({ title: "", description: "", startDate: "", startTime: "", endDate: "", endTime: "", attendees: "", reminder: "default" });
      setIsMeetEnabled(false);
    } catch (error) {
      console.error("Hata:", error);
      toast.error("Bir hata oluştu, tekrar dene.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDelete = async (id) => {
    const isDark = document.documentElement.classList.contains("dark");
    Swal.fire({
      title: "Emin misin?",
      text: "Bu etkinliği silersen geri dönüşü yok!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonText: "Evet, Sil gitsin!",
      cancelButtonText: "Vazgeç",
      buttonsStyling: false,
      background: isDark ? "#1e293b" : "#ffffff",
      color: isDark ? "#f8fafc" : "#1f2937",
      customClass: {
        popup: `rounded-[2rem] p-6 shadow-2xl ${isDark ? "border border-slate-700 shadow-black/50" : "border border-gray-100 shadow-gray-300/50"}`,
        title: "text-2xl font-bold",
        confirmButton: "bg-red-500 hover:bg-red-600 text-white font-semibold rounded-xl px-6 py-3 mx-2 transition-all transform hover:scale-105 shadow-lg shadow-red-500/30",
        cancelButton: isDark ? "bg-slate-700 hover:bg-slate-600 text-gray-200 font-semibold rounded-xl px-6 py-3 mx-2 transition-all" : "bg-gray-200 hover:bg-gray-300 text-gray-800 font-semibold rounded-xl px-6 py-3 mx-2 transition-all",
      },
    }).then(async (result) => {
      if (result.isConfirmed) {
        try {
          await deleteEvent(id);
          toast.success("Etkinlik başarıyla silindi! 🚀");
        } catch (error) {
          toast.error("Hata! Silinirken bir sorun çıktı.");
        }
      }
    });
  };

  const handleEditClick = (eventData) => {
    setSelectedEvent(eventData);
    setIsEditModalOpen(true);
  };

  const formatEventTime = (ev) => {
    if (ev.start.dateTime && ev.end.dateTime) {
      const start = new Date(ev.start.dateTime).toLocaleString("tr-TR", { month: "short", day: "numeric", hour: "2-digit", minute: "2-digit" });
      const sDate = new Date(ev.start.dateTime).toDateString();
      const eDate = new Date(ev.end.dateTime).toDateString();
      const end = sDate === eDate 
        ? new Date(ev.end.dateTime).toLocaleString("tr-TR", { hour: "2-digit", minute: "2-digit" })
        : new Date(ev.end.dateTime).toLocaleString("tr-TR", { month: "short", day: "numeric", hour: "2-digit", minute: "2-digit" });
      return `${start} - ${end}`;
    } else {
      const start = new Date(ev.start.date).toLocaleDateString("tr-TR");
      const endObj = new Date(ev.end.date);
      endObj.setDate(endObj.getDate() - 1);
      const end = endObj.toLocaleDateString("tr-TR");
      return start === end ? start : `${start} - ${end}`;
    }
  };

  return (
    <div className="max-w-8xl mx-auto w-full animate-fade-in relative">
      <div className="mb-4 lg:ml-4 md:ml-12 ml-10">
        <h1 className="text-3xl font-bold text-gray-800 dark:text-white mb-2">Etkinlik Yönetimi 📅</h1>
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-12 gap-8 items-start">
        <div className="xl:col-span-7">
          <div className="bg-white/40 dark:bg-slate-800/50 backdrop-blur-xl border border-white/40 dark:border-slate-700/50 shadow-2xl rounded-3xl p-6 lg:p-5 h-fit">
            <h2 className="text-xl font-semibold mb-6 text-gray-800 dark:text-gray-100 border-b border-gray-200 dark:border-slate-700 pb-3">Yeni Etkinlik Oluştur</h2>
            <form onSubmit={handleSubmit} className="space-y-3">
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Etkinlik Başlığı <span className="text-red-500">*</span></label>
                <input type="text" name="title" required value={formData.title} onChange={handleChange} placeholder="Örn: Proje Toplantısı" className="w-full px-4 py-3 rounded-xl bg-white/60 dark:bg-slate-900/50 border border-gray-200 dark:border-slate-600 focus:outline-none focus:ring-2 focus:ring-blue-500 dark:text-white transition-all shadow-sm" />
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Başlangıç Tarihi <span className="text-red-500">*</span></label>
                  <input type="date" name="startDate" required value={formData.startDate} onChange={handleChange} className="w-full px-4 py-3 rounded-xl bg-white/60 dark:bg-slate-900/50 border border-gray-200 dark:border-slate-600 focus:outline-none focus:ring-2 focus:ring-blue-500 dark:text-white transition-all shadow-sm" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Başlangıç Saati <span className="text-red-500">*</span></label>
                  <input type="time" name="startTime" required value={formData.startTime} onChange={handleChange} className="w-full px-4 py-3 rounded-xl bg-white/60 dark:bg-slate-900/50 border border-gray-200 dark:border-slate-600 focus:outline-none focus:ring-2 focus:ring-blue-500 dark:text-white transition-all shadow-sm" />
                </div>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Bitiş Tarihi <span className="text-red-500">*</span></label>
                  <input type="date" name="endDate" required value={formData.endDate} onChange={handleChange} className="w-full px-4 py-3 rounded-xl bg-white/60 dark:bg-slate-900/50 border border-gray-200 dark:border-slate-600 focus:outline-none focus:ring-2 focus:ring-blue-500 dark:text-white transition-all shadow-sm" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Bitiş Saati <span className="text-red-500">*</span></label>
                  <input type="time" name="endTime" required value={formData.endTime} onChange={handleChange} className="w-full px-4 py-3 rounded-xl bg-white/60 dark:bg-slate-900/50 border border-gray-200 dark:border-slate-600 focus:outline-none focus:ring-2 focus:ring-blue-500 dark:text-white transition-all shadow-sm" />
                </div>
              </div>
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 items-start">
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Davetliler (E-posta)</label>
                  <input type="text" name="attendees" value={formData.attendees} onChange={handleChange} placeholder="ornek@mail.com, ..." className="w-full px-4 py-3 rounded-xl bg-white/60 dark:bg-slate-900/50 border border-gray-200 dark:border-slate-600 focus:outline-none focus:ring-2 focus:ring-blue-500 dark:text-white transition-all shadow-sm" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Açıklama</label>
                  <textarea name="description" rows="1" value={formData.description} onChange={handleChange} placeholder="Detaylar..." className="w-full px-4 py-3 rounded-xl bg-white/60 dark:bg-slate-900/50 border border-gray-200 dark:border-slate-600 focus:outline-none focus:ring-2 focus:ring-blue-500 dark:text-white transition-all shadow-sm resize-none"></textarea>
                </div>
              </div>
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 items-end">
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Hatırlatıcı</label>
                  <select name="reminder" value={formData.reminder} onChange={handleChange} className="w-full px-3 py-3 rounded-xl bg-white/60 dark:bg-slate-900/50 border border-gray-200 dark:border-slate-600 focus:outline-none focus:ring-2 focus:ring-blue-500 dark:text-white transition-all shadow-sm cursor-pointer">
                    <option value="default">Varsayılan (30dk)</option>
                    <option value="popup_10">10 dk (Bildirim)</option>
                    <option value="popup_60">1 saat (Bildirim)</option>
                    <option value="email_1440">1 gün (E-posta)</option>
                  </select>
                </div>
                <div className="flex items-center justify-between p-3 rounded-xl bg-white/50 dark:bg-slate-900/50 border border-gray-200 dark:border-slate-600 shadow-sm h-13">
                  <p className="font-medium text-gray-800 dark:text-gray-200 flex items-center gap-2 text-sm"><span className="text-xl">📹</span> Meet Linki</p>
                  <button type="button" onClick={() => setIsMeetEnabled(!isMeetEnabled)} className={`relative inline-flex h-7 w-12 items-center rounded-full transition-colors ${isMeetEnabled ? "bg-blue-600" : "bg-gray-300 dark:bg-slate-600"}`}>
                    <span className={`inline-block h-5 w-5 transform rounded-full bg-white shadow-md transition-transform ${isMeetEnabled ? "translate-x-6" : "translate-x-1"}`} />
                  </button>
                </div>
              </div>
              <div className="pt-2">
                <button type="submit" disabled={isSubmitting} className={`w-full py-4 rounded-xl font-semibold text-white shadow-lg transition-all duration-300 transform ${isSubmitting ? "bg-blue-400 cursor-not-allowed" : "bg-linear-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 hover:-translate-y-1 hover:shadow-blue-500/30"}`}>{isSubmitting ? "Ekleniyor..." : "Etkinliği Takvime Ekle"}</button>
              </div>
            </form>
          </div>
        </div>

        <div className="xl:col-span-5">
          <div className="bg-white/30 dark:bg-slate-800/40 backdrop-blur-xl border border-white/30 dark:border-slate-700/50 shadow-xl rounded-3xl p-6 h-fit">
            <h2 className="text-xl font-semibold text-gray-800 dark:text-gray-100 mb-6 border-b border-gray-200 dark:border-slate-700 pb-3 flex items-center gap-2">📋 Yaklaşan Etkinlikler</h2>
            <div className="max-h-112.5 overflow-y-auto pr-2 space-y-4 scrollbar-thin scrollbar-thumb-gray-300 dark:scrollbar-thumb-gray-600">
              {loading ? (
                <div className="flex justify-center py-10"><div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div></div>
              ) : events && events.length > 0 ? (
                events.map((ev) => {
                  const isPastEvent = new Date(ev.end.dateTime || ev.end.date) < new Date();
                  return (
                    <div
                      key={ev.id}
                      onClick={() => setViewEventDetails(ev)}
                      className={`p-4 rounded-2xl border transition-all group flex justify-between items-start cursor-pointer ${isPastEvent ? "bg-gray-100/50 dark:bg-slate-800/40 border-gray-300/50 dark:border-slate-700/50 opacity-60 grayscale" : "bg-white/50 dark:bg-slate-700/50 border-white/40 dark:border-slate-600 hover:shadow-lg hover:-translate-y-1"}`}
                    >
                      {/* flex-1 ve overflow-hidden eklendi, böylece içerik butonları sıkıştırmaz */}
                      <div className="flex-1 min-w-0 overflow-hidden">
                        <h3 className="font-semibold text-gray-800 dark:text-white text-lg break-words whitespace-pre-wrap transition-colors">
                          {ev.summary || "İsimsiz Etkinlik"}
                        </h3>
                        <p className="text-sm text-gray-500 dark:text-gray-400 mt-1 flex items-center gap-1 font-medium">🕒 {formatEventTime(ev)}</p>
                        {ev.description && (
                          <p className="text-sm text-gray-600 dark:text-gray-300 mt-2 line-clamp-2 break-words whitespace-pre-wrap italic border-l-2 border-blue-400 dark:border-blue-500 pl-2">
                            {ev.description}
                          </p>
                        )}
                        <div className="flex items-center gap-2 mt-3 flex-wrap">
                          {ev.attendees && ev.attendees.length > 0 && (
                            <button onClick={(e) => { e.stopPropagation(); setViewAttendees(ev.attendees); }} className="text-[10px] sm:text-xs bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-300 px-2 py-1 rounded-md font-medium">👥 {ev.attendees.length} Davetli</button>
                          )}
                          {ev.hangoutLink && (
                            <a href={ev.hangoutLink} target="_blank" rel="noopener noreferrer" onClick={(e) => e.stopPropagation()} className="text-[10px] sm:text-xs bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-300 px-2 py-1 rounded-md font-medium flex items-center gap-1">📹 Katıl</a>
                          )}
                        </div>
                      </div>

                      {/* flex-shrink-0 eklendi, butonlar mobilde her zaman görünür (opacity-100) */}
                      <div className="flex-shrink-0 flex gap-1 opacity-100 xl:opacity-0 xl:group-hover:opacity-100 transition-opacity ml-2 mt-1">
                        <button onClick={(e) => { e.stopPropagation(); handleEditClick(ev); }} className="p-2 text-blue-500 hover:bg-blue-100 dark:hover:bg-blue-900/30 rounded-lg transition">✏️</button>
                        <button onClick={(e) => { e.stopPropagation(); handleDelete(ev.id); }} className="p-2 text-red-500 hover:bg-red-100 dark:hover:bg-red-900/30 rounded-lg transition">🗑️</button>
                      </div>
                    </div>
                  );
                })
              ) : (
                <div className="flex flex-col items-center justify-center py-10 text-center opacity-70"><span className="text-4xl mb-3">📭</span><p className="text-gray-600 dark:text-gray-300 font-medium">Yaklaşan etkinlik bulunamadı.</p></div>
              )}
            </div>
          </div>
        </div>
      </div>

      {isEditModalOpen && selectedEvent && <EditEvent event={selectedEvent} onClose={() => { setIsEditModalOpen(false); setSelectedEvent(null); }} />}
      {viewEventDetails && <EventDetailsModal event={viewEventDetails} onClose={() => setViewEventDetails(null)} formatTime={formatEventTime} />}

      {viewAttendees && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-fade-in">
          <div className="bg-white/95 dark:bg-slate-800/95 border border-white/20 dark:border-slate-700 rounded-2xl p-6 w-full max-w-sm shadow-2xl relative">
            <button onClick={() => setViewAttendees(null)} className="absolute top-4 right-4 w-8 h-8 flex items-center justify-center rounded-full bg-gray-100 dark:bg-slate-700 text-gray-500 hover:text-gray-800 dark:text-gray-300 dark:hover:text-white transition-colors">✕</button>
            <h3 className="text-xl font-bold mb-4 text-gray-800 dark:text-white border-b border-gray-200 dark:border-slate-700 pb-3">👥 Davetliler</h3>
            <ul className="space-y-2 max-h-60 overflow-y-auto scrollbar-thin scrollbar-thumb-gray-300 dark:scrollbar-thumb-gray-600 pr-2">
              {viewAttendees.map((attendee, idx) => (
                <li key={idx} className="text-gray-700 dark:text-gray-300 bg-gray-50 dark:bg-slate-700/50 border border-gray-100 dark:border-slate-600 px-3 py-2 rounded-lg text-sm break-all flex items-center gap-2"><span className="text-blue-500">✉️</span> {attendee.email}</li>
              ))}
            </ul>
          </div>
        </div>
      )}
    </div>
  );
}

export default Event;