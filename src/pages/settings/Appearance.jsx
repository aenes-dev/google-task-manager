import { useContext } from "react";
import { ThemeContext } from "../../context/ThemaContext";

const Appearance = () => {
  const {
    dark,
    toggleTheme,
    autoTheme,
    toggleAutoTheme
  } = useContext(ThemeContext);

  return (
    <div className="space-y-10 px-4 sm:px-0">

      <div>
        <h2 className="text-3xl sm:text-4xl font-semibold text-gray-900 dark:text-gray-100">
          Görünüm
        </h2>
        <p className="text-gray-500 dark:text-gray-400 mt-3 text-sm sm:text-base">
          Uygulamanın genel görünüm ayarlarını buradan yönetebilirsin.
        </p>
      </div>

      <div className="w-full h-px bg-white/40 dark:bg-gray-700" />

      <div className="flex items-center justify-between py-5">

        <div className="pr-4">
          <p className="text-lg sm:text-xl font-medium text-gray-800 dark:text-gray-200">
            Karanlık Mod
          </p>
          <p className="text-xs sm:text-sm text-gray-500 dark:text-gray-400 mt-1">
            Açık ve koyu tema arasında geçiş yap.
          </p>
        </div>

        <button
          onClick={toggleTheme}
          disabled={autoTheme}
          className={`
            w-14 h-8 sm:w-16 sm:h-9
            flex items-center
            rounded-full p-1
            transition-all duration-300
            ${dark ? "bg-indigo-600" : "bg-gray-300"}
            ${autoTheme ? "opacity-40 cursor-not-allowed" : ""}
          `}
        >
          <div
            className={`
              w-6 h-6 sm:w-7 sm:h-7
              bg-white rounded-full shadow-md
              transform transition-all duration-300
              ${dark ? "translate-x-6 sm:translate-x-7" : ""}
            `}
          />
        </button>
      </div>

      <div className="flex items-center justify-between py-5">

        <div className="pr-4">
          <p className="text-lg sm:text-xl font-medium text-gray-800 dark:text-gray-200">
            Zamana Göre Otomatik Tema
          </p>
          <p className="text-xs sm:text-sm text-gray-500 dark:text-gray-400 mt-1">
            Sabah 07:00 - 19:00 arası açık, akşamları koyu tema aktif olur.
          </p>
        </div>

        <button
          onClick={toggleAutoTheme}
          className={`
            w-18 h-8 sm:w-16 sm:h-9
            flex items-center
            rounded-full p-1
            transition-all duration-300
            ${autoTheme ? "bg-indigo-600" : "bg-gray-300"}
          `}
        >
          <div
            className={`
              w-6 h-6 sm:w-7 sm:h-7
              bg-white rounded-full shadow-md
              transform transition-all duration-300
              ${autoTheme ? "translate-x-6 sm:translate-x-7" : ""}
            `}
          />
        </button>
      </div>

    </div>
  );
};

export default Appearance;