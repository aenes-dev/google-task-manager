import { Link } from "react-router-dom";
import { useContext } from "react";
import { AuthContext } from "../context/AuthContext";

const Home = () => {
  const { user, logout, loginWithGoogle } = useContext(AuthContext);

  console.log(user)


  return (
    <div className="px-6 py-5 lg:max-w-7xl mx-auto">

      <div className="flex justify-between items-center mb-24">
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
          TodoV2
        </h1>


        <button
         onClick={user ? logout : loginWithGoogle}
  className=" bg-indigo-600 text-white px-5 py-2 rounded-lg hover:bg-indigo-700 transition shadow-md"
        >
          {user ? "Çıkış Yap" : "Giriş Yap"}
        </button>
        
      </div>

   <div className="text-center max-w-4xl mx-auto lg:mb-17 md:mb-30 mb-15">
        <h2 className="text-5xl md:text-6xl font-bold text-gray-900 dark:text-white mb-6 leading-tight">
          Zamanını yönet,
          <span className="text-indigo-600 dark:text-indigo-400">
            {" "}hayatını düzenle.
          </span>
        </h2>

        <p className="text-lg md:text-xl text-gray-600 dark:text-gray-300 mb-10">
          Google Takvim senkronizasyonu ile güçlü ve modern görev yönetimi.
        </p>

        {/* Butonları Alt Alta Hizalamak İçin Flex Wrapper Eklendi */}
        <div className="flex flex-col sm:flex-row items-center justify-center gap-4 px-4 sm:px-0">
          
          {/* 1. ANA BUTON (Her Ekran Boyutunda Görünür) */}
          <Link
            to={user ? "/dashboard" : ""}
            onClick={user ? undefined : loginWithGoogle}
            className="w-full sm:w-auto inline-block bg-indigo-600 text-white px-10 py-4 rounded-xl text-lg font-semibold hover:bg-indigo-700 transition shadow-lg shadow-indigo-600/30"
          >
            {user ? "Panele Git" : "Hemen Başla"}
          </Link>

          {/* 2. SADECE MOBİLDE GÖRÜNEN DİNAMİK BUTON (Giriş Yap / Çıkış Yap) */}
          <button
            onClick={user ? logout : loginWithGoogle} // DİKKAT: logout fonksiyonunun adını kendi projene göre ayarla
            className={`md:hidden w-full flex items-center justify-center gap-2 px-10 py-4 rounded-xl text-lg font-semibold transition-all shadow-sm active:scale-95 border ${
              user 
                ? "text-red-600 dark:text-red-400 bg-red-50 dark:bg-red-500/10 border-red-200 dark:border-red-500/30 hover:bg-red-500 hover:text-white dark:hover:bg-red-600 dark:hover:text-white" // ÇIKIŞ YAP TEMASI (Kırmızı Cam)
                : "text-indigo-600 dark:text-indigo-400 bg-indigo-50 dark:bg-indigo-500/10 border-indigo-200 dark:border-indigo-500/30 hover:bg-indigo-600 hover:text-white dark:hover:bg-indigo-600 dark:hover:text-white" // GİRİŞ YAP TEMASI (İndigo Cam)
            }`}
          >
            {user ? (
              <>
                <span className="text-xl">🚪</span> Çıkış Yap
              </>
            ) : (
              <>
                <span className="text-xl">🔐</span> Giriş Yap
              </>
            )}
          </button>
          
        </div>
      </div>

      <div className="grid gap-8 lg:grid-cols-3">
        {[
          {
            title: "Takvim Senkronizasyonu",
            desc: "Görevlerini Google Takvim ile anında eşitle."
          },
          {
            title: "Minimal Tasarım",
            desc: "Dikkat dağıtmayan modern arayüz."
          },
          {
            title: "Koyu & Açık Tema",
            desc: "İstediğin görünümle çalış."
          }
        ].map((item, i) => (
          <div
            key={i}
            className="p-6 rounded-2xl bg-white/60 dark:bg-slate-800/60 backdrop-blur-xl border border-gray-200 dark:border-slate-700 shadow-md hover:shadow-xl transition"
          >
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
              {item.title}
            </h3>
            <p className="text-sm text-gray-600 dark:text-gray-400">
              {item.desc}
            </p>
          </div>
        ))}
      </div>

    </div>
  );
};

export default Home;