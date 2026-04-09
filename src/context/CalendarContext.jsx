import { createContext, useContext, useState } from "react";
import { AuthContext } from "../context/AuthContext";
import SessionExpiredModal from "../components/SessionExpiredModal"; 
import { Link } from 'react-router-dom';

const CalendarContext = createContext();

export const CalendarProvider = ({ children }) => {

  const { logout, loginWithGoogle } = useContext(AuthContext);

  const [calendars, setCalendars] = useState([]);
  const [events, setEvents] = useState([]);
  
const [tasks, setTasks] = useState([]); 
  const [taskLists, setTaskLists] = useState([]); 
  const [activeListId, setActiveListId] = useState("@default");
  
  const [loading, setLoading] = useState(false);

  const [isSessionExpired, setIsSessionExpired] = useState(false);

  const getAccessToken = () => {
    const user = JSON.parse(localStorage.getItem("user"));
    return user?.accessToken || localStorage.getItem("google_token"); 
  };

  const handleLogout = () => {

    logout();
    setIsSessionExpired(true);
    localStorage.removeItem("user");
    localStorage.removeItem("google_token");
  };

  const fetchWithAuth = async (url, options = {}) => {
    const token = getAccessToken();
    
    if (!token) {
      handleLogout();
      throw new Error("Token bulunamadı, oturum kapatılıyor.");
    }

    const headers = {
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json",
      ...options.headers,
    };

    const res = await fetch(url, { ...options, headers });

    if (res.status === 401) {
      handleLogout();
      throw new Error("Token süresi doldu (401).");
    }

    if (!res.ok) {
      throw new Error(`Google API Hatası: ${res.statusText} (${res.status})`);
    }

    if (res.status === 204 || options.method === "DELETE") {
      return true;
    }

    return res.json();
  };


  const fetchCalendars = async () => {
    setLoading(true);
    try {
      const data = await fetchWithAuth("https://www.googleapis.com/calendar/v3/users/me/calendarList");
      setCalendars(data.items || []);
    } catch (err) {
      console.error("Takvimler çekilemedi:", err);
    } finally {
      setLoading(false);
    }
  };

  const fetchEvents = async () => {
    setLoading(true);
    try {
      const pastDate = new Date();
      pastDate.setMonth(pastDate.getMonth() - 1);
      const timeMin = pastDate.toISOString(); 
      
      const url = `https://www.googleapis.com/calendar/v3/calendars/primary/events?timeMin=${timeMin}&orderBy=startTime&singleEvents=true`;
      
      const data = await fetchWithAuth(url);
      const filteredEvents = (data.items || []).filter((event) => event.eventType !== "birthday");
      setEvents(filteredEvents);
    } catch (err) {
      console.error("Etkinlikler çekilirken hata:", err);
    } finally {
      setLoading(false);
    }
  };

  const createEvent = async (eventPayload) => {
    try {
      const data = await fetchWithAuth("https://www.googleapis.com/calendar/v3/calendars/primary/events?conferenceDataVersion=1", {
        method: "POST",
        body: JSON.stringify(eventPayload),
      });
      setEvents((prev) => [...prev, data]);
      return data;
    } catch (err) {
      console.error("Etkinlik oluşturulurken hata:", err);
      throw err;
    }
  };

  const updateEvent = async (eventId, updatedPayload) => {
    try {
      const data = await fetchWithAuth(`https://www.googleapis.com/calendar/v3/calendars/primary/events/${eventId}?conferenceDataVersion=1`, {
        method: "PUT",
        body: JSON.stringify(updatedPayload),
      });
      setEvents((prev) => prev.map((ev) => (ev.id === eventId ? data : ev)));
      return data;
    } catch (err) {
      console.error("Etkinlik güncellenirken hata:", err);
      throw err;
    }
  };

  const deleteEvent = async (eventId) => {
    try {
      await fetchWithAuth(`https://www.googleapis.com/calendar/v3/calendars/primary/events/${eventId}`, {
        method: "DELETE",
      });
      setEvents((prev) => prev.filter((ev) => ev.id !== eventId));
    } catch (err) {
      console.error("Etkinlik silinirken hata:", err);
      throw err;
    }
  };



const fetchTaskLists = async () => {
    try {
      const data = await fetchWithAuth("https://tasks.googleapis.com/tasks/v1/users/@me/lists");
      setTaskLists(data.items || []);
    } catch (err) {
      console.error("Kategoriler çekilirken hata:", err);
    }
  };

  const createTaskList = async (title) => {
    try {
      const data = await fetchWithAuth("https://tasks.googleapis.com/tasks/v1/users/@me/lists", {
        method: "POST",
        body: JSON.stringify({ title }),
      });
      setTaskLists((prev) => [...prev, data]);
      return data;
    } catch (err) {
      console.error("Kategori eklenirken hata:", err);
      throw err;
    }
  };

  const fetchTasks = async (listId = activeListId) => {
    setLoading(true);
    try {
      if (listId === "all") {
        let currentLists = taskLists;
        if (currentLists.length === 0) {
          const data = await fetchWithAuth("https://tasks.googleapis.com/tasks/v1/users/@me/lists");
          currentLists = data.items || [];
          setTaskLists(currentLists);
        }

        const promises = currentLists.map(list => 
          fetchWithAuth(`https://tasks.googleapis.com/tasks/v1/lists/${list.id}/tasks?showHidden=true`)
            .catch(() => ({ items: [] })) 
        );
        
        const results = await Promise.all(promises);
        let allTasks = [];
        
        results.forEach((res, idx) => {
          if (res.items) {
     
            const tasksWithListId = res.items.map(t => ({ ...t, listId: currentLists[idx].id }));
            allTasks = [...allTasks, ...tasksWithListId];
          }
        });
        
        setTasks(allTasks);
      } else {

        const data = await fetchWithAuth(`https://tasks.googleapis.com/tasks/v1/lists/${listId}/tasks?showHidden=true`);
        const tasksWithListId = (data.items || []).map(t => ({ ...t, listId }));
        setTasks(tasksWithListId);
      }
    } catch (err) {
      console.error("Görevler çekilirken hata:", err);
    } finally {
      setLoading(false);
    }
  };

// DÜZELTİLDİ: Artık sadece title ve notes değil, tüm taskPayload'u (Tarih dahil) alıyoruz!
  const createTask = async (taskPayload, listId = activeListId) => {
    try {
      const targetListId = listId === "all" ? "@default" : listId; 
      
      // JSON.stringify(taskPayload) diyerek başlık, notlar ve TARIH bilgisini tek seferde Google'a yolluyoruz.
      const data = await fetchWithAuth(`https://tasks.googleapis.com/tasks/v1/lists/${targetListId}/tasks`, {
        method: "POST",
        body: JSON.stringify(taskPayload), 
      });
      
      const taskWithListId = { ...data, listId: targetListId };
      setTasks((prev) => [taskWithListId, ...prev]);
      return taskWithListId;
    } catch (err) {
      console.error("Görev eklenirken hata:", err);
      throw err;
    }
  };

  const updateTask = async (task, listId = activeListId) => {
    try {

      const targetListId = task.listId || (listId === "all" ? "@default" : listId);
      const data = await fetchWithAuth(`https://tasks.googleapis.com/tasks/v1/lists/${targetListId}/tasks/${task.id}`, {
        method: "PUT",
        body: JSON.stringify(task),
      });
      const taskWithListId = { ...data, listId: targetListId };
      setTasks((prev) => prev.map((t) => (t.id === task.id ? taskWithListId : t)));
      return taskWithListId;
    } catch (err) {
      console.error("Görev güncellenirken hata:", err);
      throw err;
    }
  };

  const toggleTaskStatus = async (task, listId = activeListId) => {
    const newStatus = task.status === "completed" ? "needsAction" : "completed";
    const updatedTask = { ...task, status: newStatus };
    return await updateTask(updatedTask, listId);
  };


  const deleteTask = async (taskObj) => { 
    try {
      const targetListId = taskObj.listId || (activeListId === "all" ? "@default" : activeListId);
      await fetchWithAuth(`https://tasks.googleapis.com/tasks/v1/lists/${targetListId}/tasks/${taskObj.id}`, {
        method: "DELETE",
      });
      setTasks((prev) => prev.filter((t) => t.id !== taskObj.id));
    } catch (err) {
      console.error("Görev silinirken hata:", err);
      throw err;
    }
  };

  const deleteTaskList = async (listId) => {
    try {
      await fetchWithAuth(`https://tasks.googleapis.com/tasks/v1/users/@me/lists/${listId}`, {
        method: "DELETE",
      });
      setTaskLists((prev) => prev.filter((list) => list.id !== listId));
      setActiveListId("all");
    } catch (err) {
      console.error("Kategori silinirken hata:", err);
      throw err;
    }
  };



  return (
    <CalendarContext.Provider
      value={{
        calendars, events, tasks, loading,
        fetchCalendars, fetchEvents, createEvent, updateEvent, deleteEvent, 
        fetchTasks, createTask, updateTask, toggleTaskStatus, deleteTask,taskLists, activeListId, setActiveListId, fetchTaskLists, createTaskList, deleteTaskList
      }}
    >
      {children}

      {isSessionExpired && (
        <SessionExpiredModal 
          isOpen={isSessionExpired} 
          onLogin={() => {
            loginWithGoogle(); 
            setIsSessionExpired(false);
          }}
          onClose={() => {
            setIsSessionExpired(false);
            window.location.href = "/";
          }}
        />
      )}
    </CalendarContext.Provider>
  );
};

export const useCalendar = () => useContext(CalendarContext);