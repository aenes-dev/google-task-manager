import React from "react";
import { Link } from "react-router-dom";
import { useOutletContext } from "react-router-dom";


function SettingsMain() {
  const open = useOutletContext();


  return (
    <div className={`max-w-7xl mx-auto `}>

      <div className="mb-14">
        <h1 className="text-4xl font-bold tracking-tight text-gray-900 dark:text-white">
          Ayarlar
        </h1>
        <p className="mt-3 text-gray-600 dark:text-gray-400 text-lg">
          Uygulamanı kişiselleştir ve hesabını yönet.
        </p>
      </div>

      <div className="grid gap-8 sm:grid-cols-2">

        <Link
          to="appearance"
          className="
            group relative p-8 rounded-3xl
            bg-white/60 dark:bg-slate-800/60
            backdrop-blur-2xl
            border border-white/40 dark:border-slate-700
            shadow-lg
            transition-all duration-300
            hover:shadow-2xl
            hover:-translate-y-1
          "
        >
          <div className="
            absolute inset-0 rounded-3xl
            bg-linear-to-br
            from-indigo-400/0
            via-purple-400/0
            to-indigo-400/0
            group-hover:from-indigo-400/10
            group-hover:via-purple-400/10
            group-hover:to-indigo-400/10
            transition
          " />

          <div className="relative z-10">
            <div className="text-3xl mb-4">🎨</div>

            <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
              Görünüm
            </h2>

            <p className="text-gray-600 dark:text-gray-400 text-sm leading-relaxed">
              Açık ve koyu tema arasında geçiş yaparak deneyimini
              kişiselleştir.
            </p>
          </div>
        </Link>

        <Link
          to="profile"
          className="
            group relative p-8 rounded-3xl
            bg-white/60 dark:bg-slate-800/60
            backdrop-blur-2xl
            border border-white/40 dark:border-slate-700
            shadow-lg
            transition-all duration-300
            hover:shadow-2xl
            hover:-translate-y-1
          "
        >
          <div className="
            absolute inset-0 rounded-3xl
            bg-linear-to-br
            from-indigo-400/0
            via-purple-400/0
            to-indigo-400/0
            group-hover:from-indigo-400/10
            group-hover:via-purple-400/10
            group-hover:to-indigo-400/10
            transition
          " />

          <div className="relative z-10">
            <div className="text-3xl mb-4">👤</div>

            <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
              Profil
            </h2>

            <p className="text-gray-600 dark:text-gray-400 text-sm leading-relaxed">
              Hesap bilgilerini görüntüle, düzenle ve güvenlik ayarlarını
              yönet.
            </p>
          </div>
        </Link>

      </div>
    </div>
  );
}

export default SettingsMain;