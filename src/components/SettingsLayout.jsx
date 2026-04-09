import { useState, useEffect } from "react";
import { NavLink, Outlet } from "react-router-dom";

const DashboardLayout = () => {
  const [open, setOpen] = useState(window.innerWidth >= 1024);

  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth < 1024) setOpen(false);
      else setOpen(true);
    };
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  return (
    <div
      className="
      min-h-screen flex
  
    "
    >

      {open && (
        <div
          onClick={() => setOpen(false)}
          className="fixed inset-0 bg-black/40 dark:bg-black/60 z-40 lg:hidden"
        />
      )}

      <aside
        className={`
        fixed
        top-0 left-0
        h-full
        w-72
        flex flex-col
        backdrop-blur-xl
        bg-linear-to-br
        from-slate-300/60
        via-blue-300/50
        to-purple-400/40
        dark:from-slate-800/60
        dark:via-slate-700/50
        dark:to-indigo-900/40
        border-r border-white/30
        dark:border-slate-700/50
        shadow-xl
        p-7
        transform transition-transform duration-300 ease-in-out
        ${open ? "translate-x-0" : "-translate-x-full"}
        z-50
      `}
      >
        <div>
          <h2 className="text-2xl font-semibold mb-6 text-gray-800 dark:text-gray-100">
            Ayarlar
          </h2>

          <nav className="flex flex-col gap-3">
            <NavLink
              to="appearance"
              onClick={() => window.innerWidth < 1024 && setOpen(false)}
              className={({ isActive }) =>
                `px-4 py-3 rounded-xl transition ${
                  isActive
                    ? "bg-white/70 text-gray-900 shadow-md dark:bg-slate-700/70 dark:text-white"
                    : "text-gray-700 hover:bg-white/40 dark:text-gray-300 dark:hover:bg-slate-700/40"
                }`
              }
            >
              Görünüm
            </NavLink>

            <NavLink
              to="profile"
              onClick={() => window.innerWidth < 1024 && setOpen(false)}
              className={({ isActive }) =>
                `px-4 py-3 rounded-xl transition ${
                  isActive
                    ? "bg-white/70 text-gray-900 shadow-md dark:bg-slate-700/70 dark:text-white"
                    : "text-gray-700 hover:bg-white/40 dark:text-gray-300 dark:hover:bg-slate-700/40"
                }`
              }
            >
              Profil
            </NavLink>

            <NavLink
              to="/"
              onClick={() => window.innerWidth < 1024 && setOpen(false)}
              className={({ isActive }) =>
                `px-4 py-3 rounded-xl transition ${
                  isActive
                    ? "bg-white/70 text-gray-900 shadow-md dark:bg-slate-700/70 dark:text-white"
                    : "text-gray-700 hover:bg-white/40 dark:text-gray-300 dark:hover:bg-slate-700/40"
                }`
              }
            >
              Ana Menü
            </NavLink>
          </nav>
        </div>

        <div className="mt-auto pt-4 border-t border-white/30 dark:border-slate-700/50">
          <button
            onClick={() => setOpen(false)}
            className="flex items-center gap-3 w-full px-4 py-3 rounded-xl transition text-gray-700 hover:bg-white/40 dark:text-gray-300 dark:hover:bg-slate-700/40"
          >

            <svg 
              xmlns="http://www.w3.org/2000/svg" 
              fill="none" 
              viewBox="0 0 24 24" 
              strokeWidth={2} 
              stroke="currentColor" 
              className="w-5 h-5"
            >
              <path strokeLinecap="round" strokeLinejoin="round" d="M18.75 19.5l-7.5-7.5 7.5-7.5m-6 15L5.25 12l7.5-7.5" />
            </svg>
            <span className="font-medium">Menüyü Kapat</span>
          </button>
        </div>
      </aside>



      <div 
        className={`flex-1 flex flex-col transition-all duration-300 ease-in-out ${
          open ? "lg:ml-72" : "ml-0"
        }`}
      >

        <div className={`flex items-center p-4 lg:px-8 lg:py-4 ${open ? "lg:hidden" : ""}`}>
          <button
            onClick={() => setOpen(true)}
            className="text-2xl text-gray-800 dark:text-gray-100 p-2 rounded-lg hover:bg-white/20 dark:hover:bg-slate-800/50 transition"
            title="Menüyü Aç"
          >
            ☰
          </button>
        </div>

<main className={`flex-1 px-7 lg:px-16 ${open ? 'lg:py-6' : 'lg:py-0'}`}>
          <div className={`w-full ${open ? 'lg:pt-3' : 'lg:pt-0'}`}>
            <Outlet context={open} />
          </div>
        </main>
      </div>
    </div>
  );
};

export default DashboardLayout;