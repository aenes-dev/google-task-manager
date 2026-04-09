import { NavLink, useLocation } from "react-router-dom";
import { useContext } from "react";
import { ThemeContext } from "../context/ThemaContext";

const Navbar = () => {
  const { dark, toggleTheme } = useContext(ThemeContext);
  const location = useLocation();

  const hideOnRoutes = ["/sa", "/login"];
  if (hideOnRoutes.includes(location.pathname)) return null;

  return (
<div className="absolute lg:top-4 md:top-4 top-4 left-0 w-full flex justify-center z-50 pointer-events-none">

      <div
    className="
      pointer-events-auto
      flex items-center lg:gap-3 md:gap-4 gap-2
      lg:px-4 md:px-4 px-2 py-2
      rounded-full
      backdrop-blur-2xl
      bg-white/60 dark:bg-slate-900/70
      shadow-2xl
    "
  >


   
        <button
          onClick={toggleTheme}
          className="
            px-3 py-2 rounded-full
            transition
            hover:bg-gray-200/60
            dark:hover:bg-slate-800
          "
        >
          {dark ? "🌙" : "☀️"}
        </button>

        <div className="w-px h-6 bg-gray-300 dark:bg-slate-700" />

        {/* Links */}
        <NavLink
          to="/"
          className={({ isActive }) =>
            `lg:px-5 md:px-5 px-2 py-2 rounded-full text-sm font-medium transition ${
              isActive
                ? "bg-indigo-600 text-white shadow-md"
                : "text-gray-700 dark:text-gray-300 hover:bg-gray-200/60 dark:hover:bg-slate-800"
            }`
          }
        >
          Ana Menü
        </NavLink>

        <NavLink
          to="/dashboard"
          className={({ isActive }) =>
            `px-5 py-2 rounded-full text-sm font-medium transition ${
              isActive
                ? "bg-indigo-600 text-white shadow-md"
                : "text-gray-700 dark:text-gray-300 hover:bg-gray-200/60 dark:hover:bg-slate-800"
            }`
          }
        >
          Dashboard
        </NavLink>

      

        <NavLink
          to="/settings"
          className={({ isActive }) =>
            `px-5 py-2 rounded-full text-sm font-medium transition ${
              isActive
                ? "bg-indigo-600 text-white shadow-md"
                : "text-gray-700 dark:text-gray-300 hover:bg-gray-200/60 dark:hover:bg-slate-800"
            }`
          }
        >
          Ayarlar
        </NavLink>
      </div>
    </div>
  );
};

export default Navbar;